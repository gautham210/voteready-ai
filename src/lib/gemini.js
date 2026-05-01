const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// System prompt folded into user content — avoids systemInstruction field
// which differs between REST (system_instruction) and SDK (systemInstruction)
// and is unsupported on some key types entirely.
const SYSTEM_PROMPT = `You are VoteReady AI, an assistant that explains the Indian voting process.

Rules:
- Answer clearly in 2–3 sentences
- Be accurate to India and its Election Commission rules
- Be simple and friendly for first-time voters
- Do NOT give political opinions or suggest any party or candidate
- If the user asks something completely unrelated to voting, gently redirect them to voting topics
- Always answer eligibility, age, documents, citizenship, and process questions directly`;

export async function getGeminiResponse(userMessage, context = "") {
  // ── ENV CHECK ─────────────────────────────────────────────────────────────
  if (import.meta.env.DEV) {
    console.log('=== GEMINI DEBUG START ===');
    console.log('ENV vars:', import.meta.env);
    console.log('API_KEY:', API_KEY);
  }

  if (!API_KEY || API_KEY === "undefined" || API_KEY.trim() === "") {
    throw new Error(
      "VITE_GEMINI_API_KEY is missing — check .env in project root and restart the dev server."
    );
  }

  // ── BUILD USER CONTENT ────────────────────────────────────────────────────
  // Inline system prompt as a preamble so we avoid the systemInstruction
  // field entirely — works on ALL Gemini API key types and versions.
  const fullPrompt = [
    SYSTEM_PROMPT,
    context ? `\nContext: ${context}` : "",
    `\nUser question: ${userMessage}`,
  ]
    .filter(Boolean)
    .join("\n");

  // ── BUILD REQUEST ─────────────────────────────────────────────────────────
  // Minimal body — no systemInstruction, no generationConfig.
  // Stripped to bare minimum to isolate auth/connectivity first.
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: fullPrompt }],
      },
    ],
  };

  if (import.meta.env.DEV) {
    console.log('POST →', url);
    console.log('BODY:', JSON.stringify(requestBody, null, 2));
  }

  // ── FETCH ─────────────────────────────────────────────────────────────────
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
  } catch (netErr) {
    console.error("NETWORK ERROR (fetch threw — likely CORS or offline):", netErr);
    throw netErr;
  }

  if (import.meta.env.DEV) console.log('HTTP STATUS:', response.status, response.statusText);

  const rawText = await response.text();
  if (import.meta.env.DEV) console.log('RAW RESPONSE:', rawText);

  // ── HTTP ERROR ────────────────────────────────────────────────────────────
  if (!response.ok) {
    // Parse the error body to surface the exact Google error code.
    let errDetail = rawText;
    try {
      const errJson = JSON.parse(rawText);
      errDetail = errJson?.error?.message || rawText;
    } catch (_) { /* keep raw text */ }

    if (import.meta.env.DEV) console.error('GEMINI ERROR DETAIL:', errDetail);

    // Surface actionable hint in the thrown message.
    if (response.status === 400) {
      throw new Error(`400 Bad Request — ${errDetail}`);
    }
    if (response.status === 403) {
      throw new Error(
        `403 Forbidden — API key may be restricted or "Generative Language API" not enabled in Google Cloud Console. Detail: ${errDetail}`
      );
    }
    if (response.status === 404) {
      throw new Error(
        `404 Not Found — model name may be wrong or API not enabled for this key. Detail: ${errDetail}`
      );
    }
    if (response.status === 429) {
      throw new Error(`429 Quota exceeded — wait and retry. Detail: ${errDetail}`);
    }
    if (response.status === 503) {
      throw new Error(`503 Service Unavailable — Gemini is temporarily down. Detail: ${errDetail}`);
    }
    throw new Error(`Gemini HTTP ${response.status}: ${errDetail}`);
  }

  // ── PARSE ─────────────────────────────────────────────────────────────────
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (parseErr) {
    console.error("JSON parse failed. Raw:", rawText);
    throw new Error("Could not parse Gemini JSON response");
  }

  if (import.meta.env.DEV) console.log('PARSED:', JSON.stringify(data, null, 2));

  // ── EXTRACT TEXT ──────────────────────────────────────────────────────────
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || text.trim() === "") {
    // Safety block or empty candidate
    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Gemini blocked the prompt: ${blockReason}`);
    }
    console.error("No text in response. Full data:", JSON.stringify(data, null, 2));
    throw new Error("Gemini response contained no usable text");
  }

  if (import.meta.env.DEV) console.log('=== GEMINI REPLY:', text.trim(), '===');
  return text.trim();
}
