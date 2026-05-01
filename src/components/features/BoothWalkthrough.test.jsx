import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BoothWalkthrough } from './BoothWalkthrough';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Click a button whose accessible name matches the regex. */
const clickBtn = (name) =>
  fireEvent.click(screen.getByRole('button', { name: new RegExp(name, 'i') }));

/** Get a button by name regex. */
const btn = (name) =>
  screen.getByRole('button', { name: new RegExp(name, 'i') });

/** Navigate to Step 1. */
function goToStep1() {
  render(<BoothWalkthrough />);
  clickBtn('Start');
}

/** Navigate to Step 2 (selects Voter ID). */
function goToStep2() {
  render(<BoothWalkthrough />);
  clickBtn('Start');
  // Click the "Voter ID" selectable card button
  fireEvent.click(btn('Voter ID'));
  clickBtn('Verify Identity');
}

/** Navigate to Step 3. */
function goToStep3() {
  goToStep2();
  clickBtn('Proceed');
}

/** Navigate to Step 4. */
function goToStep4() {
  goToStep3();
  clickBtn('Continue to Voting');
}

/** Navigate to Step 5, selecting the given candidate button name. */
function goToStep5(candidate = 'Star Party') {
  goToStep4();
  fireEvent.click(btn(candidate));
  clickBtn('Cast Vote');
}

// ── Step 0 ───────────────────────────────────────────────────────────────────

describe('BoothWalkthrough — Step 0: Entry', () => {
  it('renders "Enter Polling Booth" on initial mount', () => {
    render(<BoothWalkthrough />);
    expect(screen.getByText(/Enter Polling Booth/i)).toBeInTheDocument();
  });

  it('shows "Start" button on Step 0', () => {
    render(<BoothWalkthrough />);
    expect(btn('Start')).toBeInTheDocument();
  });

  it('shows "Step 0 of 5" counter on mount', () => {
    render(<BoothWalkthrough />);
    expect(screen.getByText(/Step 0 of 5/i)).toBeInTheDocument();
  });
});

// ── Step 1 ───────────────────────────────────────────────────────────────────

describe('BoothWalkthrough — Step 1: ID Verification', () => {
  it('advances to Step 1 after clicking Start', () => {
    goToStep1();
    expect(screen.getByText(/Show Your ID/i)).toBeInTheDocument();
  });

  it('"Verify Identity" button is disabled until an ID is selected', () => {
    goToStep1();
    expect(btn('Verify Identity')).toBeDisabled();
  });

  it('enables "Verify Identity" after selecting an ID', () => {
    goToStep1();
    fireEvent.click(btn('Aadhaar Card'));
    expect(btn('Verify Identity')).not.toBeDisabled();
  });

  it('shows all 4 ID options as buttons', () => {
    goToStep1();
    expect(btn('Aadhaar Card')).toBeInTheDocument();
    expect(btn('Voter ID')).toBeInTheDocument();
    expect(btn('Passport')).toBeInTheDocument();
    expect(btn('Driving License')).toBeInTheDocument();
  });
});

// ── Step 2 ───────────────────────────────────────────────────────────────────

describe('BoothWalkthrough — Step 2: Officer Verification', () => {
  it('shows Officer Verification heading on Step 2', () => {
    goToStep2();
    expect(screen.getByRole('heading', { name: /Officer Verification/i })).toBeInTheDocument();
  });

  it('shows the selected ID in the checklist', () => {
    goToStep2();
    // "Voter ID" appears in the verification checklist
    expect(screen.getByText(/Voter ID/i)).toBeInTheDocument();
  });

  it('"Proceed" button is present and enabled', () => {
    goToStep2();
    expect(btn('Proceed')).not.toBeDisabled();
  });
});

// ── Step 3 ───────────────────────────────────────────────────────────────────

describe('BoothWalkthrough — Step 3: Ink Mark', () => {
  it('shows Ink Mark heading on Step 3', () => {
    goToStep3();
    expect(screen.getByRole('heading', { name: /Ink Mark/i })).toBeInTheDocument();
  });

  it('shows "Indelible ink applied" text', () => {
    goToStep3();
    expect(screen.getByText(/Indelible ink applied/i)).toBeInTheDocument();
  });

  it('"Continue to Voting" button is present and enabled', () => {
    goToStep3();
    expect(btn('Continue to Voting')).not.toBeDisabled();
  });
});

// ── Step 4 ───────────────────────────────────────────────────────────────────

describe('BoothWalkthrough — Step 4: Voting Machine', () => {
  it('shows "Voting Machine" heading on Step 4', () => {
    goToStep4();
    expect(screen.getByRole('heading', { name: /Voting Machine/i })).toBeInTheDocument();
  });

  it('renders all three parties plus NOTA as buttons', () => {
    goToStep4();
    expect(btn('Lion Party')).toBeInTheDocument();
    expect(btn('Star Party')).toBeInTheDocument();
    expect(btn('Tree Party')).toBeInTheDocument();
    expect(btn('NOTA')).toBeInTheDocument();
  });

  it('"Cast Vote" is disabled before any candidate is selected', () => {
    goToStep4();
    expect(btn('Cast Vote')).toBeDisabled();
  });

  it('"Cast Vote" is enabled after selecting a candidate', () => {
    goToStep4();
    fireEvent.click(btn('Lion Party'));
    expect(btn('Cast Vote')).not.toBeDisabled();
  });

  it('"Cast Vote" is enabled after selecting NOTA', () => {
    goToStep4();
    fireEvent.click(btn('NOTA'));
    expect(btn('Cast Vote')).not.toBeDisabled();
  });
});

// ── Step 5 ───────────────────────────────────────────────────────────────────

describe('BoothWalkthrough — Step 5: Success', () => {
  it('shows "Vote Successfully Cast" on Step 5', () => {
    goToStep5('Star Party');
    expect(screen.getByText(/Vote Successfully Cast/i)).toBeInTheDocument();
  });

  it('shows the voted candidate name in the confirmation card', () => {
    goToStep5('Lion Party');
    expect(screen.getByText(/Lion Party/i)).toBeInTheDocument();
  });

  it('shows NOTA label when NOTA was selected', () => {
    goToStep5('NOTA');
    expect(screen.getByText(/None Of The Above/i)).toBeInTheDocument();
  });

  it('"Restart" resets flow back to Step 0', () => {
    goToStep5('Star Party');
    clickBtn('Restart');
    expect(screen.getByText(/Enter Polling Booth/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 0 of 5/i)).toBeInTheDocument();
  });

  it('shows NVSP external link on Step 5', () => {
    goToStep5('Star Party');
    expect(screen.getByText(/NVSP Portal/i)).toBeInTheDocument();
  });

  it('shows Voter Helpline link on Step 5', () => {
    goToStep5('Star Party');
    expect(screen.getByText(/Voter Helpline/i)).toBeInTheDocument();
  });
});
