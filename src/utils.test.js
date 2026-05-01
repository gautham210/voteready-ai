import { describe, it, expect } from 'vitest';
import { normalize, findBestMatch, mapGeminiError, cn } from './utils';

describe('utils', () => {
  describe('normalize', () => {
    it('lowercases and trims whitespace', () => {
      expect(normalize('  Hello World  ')).toBe('hello world');
    });

    it('strips punctuation', () => {
      expect(normalize('hello, world! 123?')).toBe('hello world 123');
    });
  });

  describe('findBestMatch', () => {
    it('matches "id" keyword as a whole word', () => {
      expect(findBestMatch('do i need an id')).toMatch(/valid photo ID/i);
    });

    it('matches "vote" and "18"', () => {
      expect(findBestMatch('im 18 can i vote')).toMatch(/minimum voting age/i);
    });

    it('returns null for unmatched input', () => {
      expect(findBestMatch('what is the weather')).toBeNull();
    });

    // Safety test: "id" as substring of other words must NOT false-match
    it('does NOT match when "id" appears inside another word (false-positive guard)', () => {
      expect(findBestMatch('what did I do wrong')).toBeNull();
      expect(findBestMatch('invalid question here')).toBeNull();
      expect(findBestMatch('consider this period')).toBeNull();
    });
  });

  describe('mapGeminiError', () => {
    it('maps 429 to quota error', () => {
      expect(mapGeminiError('Gemini API 429 RESOURCE_EXHAUSTED')).toMatch(/quota exhausted/i);
    });

    it('maps fetch failures to network error', () => {
      expect(mapGeminiError('Failed to fetch')).toMatch(/temporarily unavailable/i);
    });

    it('maps missing API key error', () => {
      expect(mapGeminiError('Missing Gemini API key')).toMatch(/not configured/i);
    });

    it('returns generic fallback for unknown errors', () => {
      expect(mapGeminiError('Random API glitch')).toMatch(/Something went wrong/i);
    });
  });

  describe('cn (Tailwind class merger)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500', { 'text-white': true })).toBe('px-2 py-1 bg-red-500 text-white');
    });
  });
});
