import { useState } from "react"

/**
 * NOTE:
 * This component is intentionally consolidated for demo simplicity.
 * In a production-grade system, it would be split into:
 * - BoothStepId
 * - BoothStepVerification
 * - BoothStepEVM
 * - BoothStepConfirmation
 */

// -------------------------------------------------
// Data
// -------------------------------------------------
const ID_OPTIONS = [
  { label: "Aadhaar Card",    emoji: "🪪" },
  { label: "Voter ID",        emoji: "📋" },
  { label: "Passport",        emoji: "📕" },
  { label: "Driving License", emoji: "🚗" },
]

const CANDIDATES = [
  { id: "lion", name: "Lion Party",  emoji: "🦁" },
  { id: "star", name: "Star Party",  emoji: "🌟" },
  { id: "tree", name: "Tree Party",  emoji: "🌳" },
  { id: "nota", name: "NOTA",        emoji: "🚫", isNota: true },
]

const TOTAL_STEPS = 5

// -------------------------------------------------
// Component
// -------------------------------------------------
export function BoothWalkthrough() {
  const [step, setStep]                         = useState(0)
  const [selectedId, setSelectedId]             = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  function advance() {
    setStep(prev => prev + 1)
  }

  function restart() {
    setSelectedId(null)
    setSelectedCandidate(null)
    setStep(0)
  }

  function renderStep() {
    switch (step) {

      // ── STEP 0 — Entry ────────────────────────────────────────────────
      case 0:
        return (
          <div style={s.stepBox}>
            <div style={s.iconCircle}>🗳️</div>
            <h2 style={s.heading}>Enter Polling Booth</h2>
            <p style={s.body}>
              Welcome! Experience the complete Indian voting process, step by step,
              exactly as it happens on Election Day.
            </p>
            <div style={s.infoGrid}>
              <InfoBadge emoji="✅" text="18+ years old" />
              <InfoBadge emoji="🇮🇳" text="Indian citizen" />
              <InfoBadge emoji="📝" text="Registered voter" />
            </div>
            <button id="btn-start" style={s.primaryBtn} onClick={advance}>
              Start
            </button>
          </div>
        )

      // ── STEP 1 — ID Verification ─────────────────────────────────────
      case 1:
        return (
          <div style={s.stepBox}>
            <StepBadge number={1} label="ID Verification" />
            <div style={s.iconCircle}>🪪</div>
            <h2 style={s.heading}>Show Your ID</h2>
            <p style={s.body}>
              Select the photo ID document you are presenting to the polling officer.
            </p>
            <div style={s.gridTwo}>
              {ID_OPTIONS.map(({ label, emoji }) => {
                const active = selectedId === label
                return (
                  <button
                    key={label}
                    id={`id-opt-${label.replace(/\s+/g, "-").toLowerCase()}`}
                    aria-label={label}
                    aria-pressed={active}
                    style={{ ...s.selectCard, ...(active ? s.selectCardActive : {}) }}
                    onClick={() => setSelectedId(label)}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    {active && <span style={s.check}>✓</span>}
                  </button>
                )
              })}
            </div>
            <button
              id="btn-verify-identity"
              style={{ ...s.primaryBtn, ...(selectedId ? {} : s.btnDisabled) }}
              disabled={!selectedId}
              onClick={advance}
            >
              Verify Identity
            </button>
          </div>
        )

      // ── STEP 2 — Officer Verification ────────────────────────────────
      case 2:
        return (
          <div style={s.stepBox}>
            <StepBadge number={2} label="Officer Verification" />
            <div style={s.iconCircle}>👮</div>
            <h2 style={s.heading}>Officer Verification</h2>
            <p style={s.body}>
              The polling officer verifies your details against the electoral roll.
            </p>
            <div style={s.checkList}>
              <CheckRow label="Name matched in electoral roll" />
              <CheckRow label="Voter list entry confirmed" />
              <CheckRow label={`ID verified: ${selectedId}`} />
            </div>
            <button id="btn-officer-proceed" style={s.primaryBtn} onClick={advance}>
              Proceed
            </button>
          </div>
        )

      // ── STEP 3 — Ink Mark ─────────────────────────────────────────────
      case 3:
        return (
          <div style={s.stepBox}>
            <StepBadge number={3} label="Ink Mark" />
            <h2 style={s.heading}>Ink Mark</h2>
            <p style={s.body}>
              Indelible ink is applied to your left index finger before you vote,
              to prevent duplicate voting at any booth.
            </p>
            <div style={s.inkWidget}>
              <span style={{ fontSize: "3.5rem" }}>☝️</span>
              <div style={s.inkDot} />
              <span style={s.inkLabel}>Indelible ink applied</span>
            </div>
            <div style={s.infoCard}>
              <span>💜</span>
              <span>This ink cannot be removed for several weeks — it is mandatory.</span>
            </div>
            <button id="btn-ink-continue" style={s.primaryBtn} onClick={advance}>
              Continue to Voting
            </button>
          </div>
        )

      // ── STEP 4 — Voting Machine (EVM) ────────────────────────────────
      case 4:
        return (
          <div style={s.stepBox}>
            <StepBadge number={4} label="Electronic Voting Machine" />
            <div style={s.iconCircle}>🗳️</div>
            <h2 style={s.heading}>Voting Machine</h2>
            <p style={s.body}>
              Press the button next to your choice. You have one vote.
              NOTA is available if you wish to reject all candidates.
            </p>
            <div style={s.evmPanel}>
              {CANDIDATES.map(({ id, name, emoji, isNota }) => {
                const active = selectedCandidate === id
                return (
                  <button
                    key={id}
                    id={`candidate-${id}`}
                    aria-label={name}
                    aria-pressed={active}
                    style={{
                      ...s.evmRow,
                      ...(active ? (isNota ? s.evmRowNota : s.evmRowActive) : {}),
                    }}
                    onClick={() => setSelectedCandidate(id)}
                  >
                    <span style={s.evmEmoji}>{emoji}</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{name}</span>
                    {active && <span style={s.evmLight}>●</span>}
                  </button>
                )
              })}
            </div>
            <button
              id="btn-cast-vote"
              style={{ ...s.primaryBtn, ...(selectedCandidate ? {} : s.btnDisabled) }}
              disabled={!selectedCandidate}
              onClick={advance}
            >
              Cast Vote
            </button>
          </div>
        )

      // ── STEP 5 — Success ──────────────────────────────────────────────
      case 5: {
        const voted = CANDIDATES.find(c => c.id === selectedCandidate)
        return (
          <div style={s.stepBox}>
            <div style={{ fontSize: "4rem" }}>✅</div>
            <h2 style={{ ...s.heading, color: "#16a34a" }}>Vote Successfully Cast</h2>
            <p style={s.body}>Your vote has been recorded securely and anonymously.</p>
            <div style={s.infoCard}>
              <span style={{ fontSize: "1.5rem" }}>{voted?.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#1e293b" }}>
                  {voted?.isNota ? "NOTA — None Of The Above" : voted?.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Your choice has been recorded
                </div>
              </div>
            </div>
            <div style={s.successLinks}>
              <a href="https://www.nvsp.in" target="_blank" rel="noreferrer" style={s.link}>🔗 NVSP Portal</a>
              <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noreferrer" style={s.link}>📍 Find Polling Station</a>
              <a href="tel:1950" style={s.link}>📞 Voter Helpline: 1950</a>
            </div>
            <button id="btn-restart" style={{ ...s.primaryBtn, background: "#64748b" }} onClick={restart}>
              Restart
            </button>
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div style={s.wrapper}>
      {/* Progress bar */}
      <div style={s.progressBar}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            style={{
              ...s.progressSeg,
              background: step > i ? "#4f46e5" : "#e2e8f0",
            }}
          />
        ))}
      </div>
      <p style={s.stepLabel}>Step {step} of {TOTAL_STEPS}</p>

      <div style={s.content}>{renderStep()}</div>
    </div>
  )
}

// -------------------------------------------------
// Small reusable sub-components
// -------------------------------------------------
function StepBadge({ number, label }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      background: "#eef2ff",
      color: "#4338ca",
      borderRadius: "9999px",
      padding: "0.25rem 0.75rem",
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: "0.03em",
    }}>
      <span style={{
        background: "#4f46e5",
        color: "#fff",
        borderRadius: "9999px",
        width: "1.2rem",
        height: "1.2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.7rem",
        fontWeight: 800,
      }}>{number}</span>
      {label.toUpperCase()}
    </div>
  )
}

function InfoBadge({ emoji, text }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "0.6rem",
      padding: "0.4rem 0.75rem",
      fontSize: "0.85rem",
      color: "#475569",
      fontWeight: 500,
    }}>
      <span>{emoji}</span>
      <span>{text}</span>
    </div>
  )
}

function CheckRow({ label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      padding: "0.5rem 0",
      fontSize: "0.9rem",
      color: "#334155",
    }}>
      <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
      {label}
    </div>
  )
}

// -------------------------------------------------
// Styles
// -------------------------------------------------
const s = {
  wrapper: {
    width: "100%",
    minHeight: "520px",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    borderRadius: "1.5rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
    padding: "2rem",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  progressBar: {
    display: "flex",
    gap: "6px",
    marginBottom: "0.4rem",
  },
  progressSeg: {
    flex: 1,
    height: "5px",
    borderRadius: "9999px",
  },
  stepLabel: {
    fontSize: "0.72rem",
    color: "#94a3b8",
    margin: "0 0 1.5rem 0",
    letterSpacing: "0.04em",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  stepBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "1rem",
    width: "100%",
  },
  iconCircle: {
    width: "5rem",
    height: "5rem",
    borderRadius: "9999px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.4rem",
  },
  heading: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#1e293b",
    margin: 0,
  },
  body: {
    fontSize: "0.95rem",
    color: "#64748b",
    margin: 0,
    maxWidth: "28rem",
    lineHeight: 1.6,
  },
  primaryBtn: {
    marginTop: "0.25rem",
    padding: "0.75rem 2rem",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#ffffff",
    background: "#4f46e5",
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
    width: "100%",
    maxWidth: "20rem",
  },
  btnDisabled: {
    background: "#cbd5e1",
    cursor: "not-allowed",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.65rem",
    width: "100%",
    maxWidth: "26rem",
  },
  selectCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.875rem",
    border: "2px solid #e2e8f0",
    borderRadius: "0.75rem",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "0.88rem",
    color: "#334155",
    position: "relative",
  },
  selectCardActive: {
    border: "2px solid #4f46e5",
    background: "#eef2ff",
    color: "#4338ca",
  },
  check: {
    position: "absolute",
    top: "0.4rem",
    right: "0.6rem",
    fontSize: "0.9rem",
    fontWeight: 800,
    color: "#4f46e5",
  },
  infoGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.5rem",
    maxWidth: "24rem",
  },
  checkList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "22rem",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    gap: "0.1rem",
  },
  inkWidget: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.25rem 2.5rem",
    background: "#faf5ff",
    border: "2px solid #d8b4fe",
    borderRadius: "1rem",
    gap: "0.2rem",
  },
  inkDot: {
    width: "14px",
    height: "14px",
    borderRadius: "9999px",
    background: "#7c3aed",
    marginTop: "-0.4rem",
    marginLeft: "1.2rem",
  },
  inkLabel: {
    fontSize: "0.8rem",
    color: "#7c3aed",
    fontWeight: 600,
    marginTop: "0.35rem",
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
    fontSize: "0.88rem",
    color: "#475569",
    maxWidth: "26rem",
    textAlign: "left",
  },
  evmPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
    maxWidth: "22rem",
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "1rem",
    padding: "0.75rem",
  },
  evmRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "0.65rem",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#334155",
    textAlign: "left",
  },
  evmRowActive: {
    border: "2px solid #16a34a",
    background: "#f0fdf4",
    color: "#15803d",
  },
  evmRowNota: {
    border: "2px solid #dc2626",
    background: "#fef2f2",
    color: "#b91c1c",
  },
  evmEmoji: {
    fontSize: "1.4rem",
  },
  evmLight: {
    color: "#16a34a",
    fontWeight: 900,
    fontSize: "1.1rem",
  },
  successLinks: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.5rem",
    maxWidth: "26rem",
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.75rem",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: 600,
  },
}
