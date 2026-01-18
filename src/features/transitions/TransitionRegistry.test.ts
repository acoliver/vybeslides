import { describe, it, expect } from 'vitest';
import { getTransition, isValidTransitionName } from './TransitionRegistry';

describe('TransitionRegistry', () => {
  describe('isValidTransitionName', () => {
    it('should recognize diagonal as valid', () => {
      expect(isValidTransitionName('diagonal')).toBe(true);
    });

    it('should recognize leftwipe as valid', () => {
      expect(isValidTransitionName('leftwipe')).toBe(true);
    });

    it('should recognize rightwipe as valid', () => {
      expect(isValidTransitionName('rightwipe')).toBe(true);
    });

    it('should recognize topwipe as valid', () => {
      expect(isValidTransitionName('topwipe')).toBe(true);
    });

    it('should recognize bottomwipe as valid', () => {
      expect(isValidTransitionName('bottomwipe')).toBe(true);
    });

    it('should recognize tvon as valid', () => {
      expect(isValidTransitionName('tvon')).toBe(true);
    });

    it('should recognize tvoff as valid', () => {
      expect(isValidTransitionName('tvoff')).toBe(true);
    });

    it('should reject invalid transition name', () => {
      expect(isValidTransitionName('invalid')).toBe(false);
    });
  });

  describe('getTransition', () => {
    it('should return diagonal wipe transition', () => {
      const transition = getTransition('diagonal');

      expect(transition.getDuration()).toBeGreaterThan(0);
    });

    it('should return tvon transition', () => {
      const transition = getTransition('tvon');

      expect(transition.getDuration()).toBe(2000);
    });
  });
});
