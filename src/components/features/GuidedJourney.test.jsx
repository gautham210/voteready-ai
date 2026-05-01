import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuidedJourney } from './GuidedJourney';

/**
 * Keyboard accessibility tests for GuidedJourney task checkboxes.
 * Verifies that role="checkbox" elements respond to Enter and Space keys.
 */

function buildProgressHook(overrides = {}) {
  const toggleTask = vi.fn();
  const isComplete = vi.fn().mockReturnValue(false);
  return { toggleTask, isComplete, ...overrides };
}

describe('GuidedJourney — keyboard accessibility (a11y)', () => {
  it('renders task checkboxes with role="checkbox"', () => {
    const hook = buildProgressHook();
    render(<GuidedJourney progressHook={hook} onAskAI={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('calls toggleTask when Enter is pressed on a task', () => {
    const hook = buildProgressHook();
    render(<GuidedJourney progressHook={hook} onAskAI={vi.fn()} />);
    const [firstCheckbox] = screen.getAllByRole('checkbox');
    fireEvent.keyDown(firstCheckbox, { key: 'Enter' });
    expect(hook.toggleTask).toHaveBeenCalledTimes(1);
  });

  it('calls toggleTask when Space is pressed on a task', () => {
    const hook = buildProgressHook();
    render(<GuidedJourney progressHook={hook} onAskAI={vi.fn()} />);
    const [firstCheckbox] = screen.getAllByRole('checkbox');
    fireEvent.keyDown(firstCheckbox, { key: ' ' });
    expect(hook.toggleTask).toHaveBeenCalledTimes(1);
  });

  it('does NOT call toggleTask on other key presses (e.g., Tab)', () => {
    const hook = buildProgressHook();
    render(<GuidedJourney progressHook={hook} onAskAI={vi.fn()} />);
    const [firstCheckbox] = screen.getAllByRole('checkbox');
    fireEvent.keyDown(firstCheckbox, { key: 'Tab' });
    expect(hook.toggleTask).not.toHaveBeenCalled();
  });

  it('each task has tabIndex=0 for keyboard focusability', () => {
    const hook = buildProgressHook();
    render(<GuidedJourney progressHook={hook} onAskAI={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(cb => {
      expect(cb).toHaveAttribute('tabindex', '0');
    });
  });

  it('reflects aria-checked=false when task is incomplete', () => {
    const hook = buildProgressHook();
    render(<GuidedJourney progressHook={hook} onAskAI={vi.fn()} />);
    const [firstCheckbox] = screen.getAllByRole('checkbox');
    expect(firstCheckbox).toHaveAttribute('aria-checked', 'false');
  });

  it('reflects aria-checked=true when task is complete', () => {
    const hook = buildProgressHook({ isComplete: vi.fn().mockReturnValue(true) });
    render(<GuidedJourney progressHook={hook} onAskAI={vi.fn()} />);
    const [firstCheckbox] = screen.getAllByRole('checkbox');
    expect(firstCheckbox).toHaveAttribute('aria-checked', 'true');
  });
});
