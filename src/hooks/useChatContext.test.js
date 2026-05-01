import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatContext } from './useChatContext';

// Mock the Gemini API module so tests never make real network calls
vi.mock('../lib/gemini', () => ({
  getGeminiResponse: vi.fn(),
}));

import { getGeminiResponse } from '../lib/gemini';

describe('useChatContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initialises with one AI welcome message', () => {
    const { result } = renderHook(() => useChatContext(''));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].sender).toBe('ai');
  });

  it('appends the user message immediately before AI responds', async () => {
    getGeminiResponse.mockResolvedValue('You can vote at 18 in India.');
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('can i vote at 17');
    });

    const userMsg = result.current.messages.find(m => m.sender === 'user');
    expect(userMsg).toBeDefined();
    expect(userMsg.text).toBe('can i vote at 17');
  });

  it('appends AI reply after successful Gemini call', async () => {
    const reply = 'You must be at least 18 years old to vote in India.';
    getGeminiResponse.mockResolvedValue(reply);
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('what is the voting age');
    });

    const aiReplies = result.current.messages.filter(m => m.sender === 'ai');
    expect(aiReplies[aiReplies.length - 1].text).toBe(reply);
  });

  it('blocks political phrases and does NOT call Gemini', async () => {
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('who should i vote for');
    });

    expect(getGeminiResponse).not.toHaveBeenCalled();
    const lastAI = result.current.messages.filter(m => m.sender === 'ai').at(-1);
    expect(lastAI.text).toMatch(/can't advise/i);
  });

  it('blocks "best party to vote" phrase without calling Gemini', async () => {
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('what is the best party to vote');
    });

    expect(getGeminiResponse).not.toHaveBeenCalled();
  });

  it('does NOT block normal voting questions', async () => {
    getGeminiResponse.mockResolvedValue('You need a valid photo ID.');
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('what documents do i need');
    });

    expect(getGeminiResponse).toHaveBeenCalledOnce();
  });

  it('shows quota error message on 429 error', async () => {
    getGeminiResponse.mockRejectedValue(new Error('Gemini API failed: 429 quota RESOURCE_EXHAUSTED'));
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('can i vote');
    });

    const lastAI = result.current.messages.filter(m => m.sender === 'ai').at(-1);
    expect(lastAI.text).toMatch(/quota exhausted/i);
  });

  it('shows network error message on fetch failure', async () => {
    getGeminiResponse.mockRejectedValue(new Error('Failed to fetch'));
    const { result } = renderHook(() => useChatContext(''));

    // Use a question NOT in the predefined list so it reaches Gemini
    await act(async () => {
      await result.current.sendMessage('how do i register online');
    });

    const lastAI = result.current.messages.filter(m => m.sender === 'ai').at(-1);
    expect(lastAI.text).toMatch(/temporarily unavailable/i);
  });

  it('shows config error message when API key is missing', async () => {
    getGeminiResponse.mockRejectedValue(new Error('Missing Gemini API key'));
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('hi');
    });

    const lastAI = result.current.messages.filter(m => m.sender === 'ai').at(-1);
    expect(lastAI.text).toMatch(/not configured/i);
  });

  it('does not send message if text is empty or whitespace', async () => {
    const { result } = renderHook(() => useChatContext(''));
    const initialLength = result.current.messages.length;

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(result.current.messages).toHaveLength(initialLength);
    expect(getGeminiResponse).not.toHaveBeenCalled();
  });

  it('isTyping is false after message resolves', async () => {
    getGeminiResponse.mockResolvedValue('Yes, you can vote.');
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('can i vote');
    });

    expect(result.current.isTyping).toBe(false);
  });

  it('passes currentStep as context to Gemini', async () => {
    getGeminiResponse.mockResolvedValue('OK');
    const { result } = renderHook(() => useChatContext('ID Verification'));

    await act(async () => {
      await result.current.sendMessage('help');
    });

    expect(getGeminiResponse).toHaveBeenCalledWith(
      'help',
      expect.stringContaining('ID Verification')
    );
  });
});

// ── Predefined knowledge base tests ─────────────────────────────────────────

describe('useChatContext — predefined knowledge base', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('answers "can i vote at 18" instantly without calling Gemini', async () => {
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('can i vote at 18');
    });

    expect(getGeminiResponse).not.toHaveBeenCalled();
    const lastAI = result.current.messages.filter(m => m.sender === 'ai').at(-1);
    expect(lastAI.text).toMatch(/minimum voting age/i);
  });

  it('answers "what is nota" instantly without calling Gemini', async () => {
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('what is nota');
    });

    expect(getGeminiResponse).not.toHaveBeenCalled();
    const lastAI = result.current.messages.filter(m => m.sender === 'ai').at(-1);
    expect(lastAI.text).toMatch(/none of the above/i);
  });

  it('fuzzy-matches a predefined key embedded in a longer phrase', async () => {
    const { result } = renderHook(() => useChatContext(''));

    // "can i vote at 18" is a substring of this message
    await act(async () => {
      await result.current.sendMessage('im turning 18 next month, can i vote at 18?');
    });

    expect(getGeminiResponse).not.toHaveBeenCalled();
    const lastAI = result.current.messages.filter(m => m.sender === 'ai').at(-1);
    expect(lastAI.text).toMatch(/minimum voting age/i);
  });

  it('does NOT set isTyping for predefined answers', async () => {
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('what id do i need');
    });

    // isTyping must be false — predefined bypasses the Gemini async path
    expect(result.current.isTyping).toBe(false);
    expect(getGeminiResponse).not.toHaveBeenCalled();
  });

  it('still routes unknown questions to Gemini, not predefined', async () => {
    getGeminiResponse.mockResolvedValue('Great question!');
    const { result } = renderHook(() => useChatContext(''));

    await act(async () => {
      await result.current.sendMessage('what happens if i miss election day');
    });

    expect(getGeminiResponse).toHaveBeenCalledOnce();
  });
});
