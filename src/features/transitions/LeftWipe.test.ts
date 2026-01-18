import { describe, it, expect } from 'vitest';
import { createLeftWipe } from './LeftWipe';

describe('LeftWipe', () => {
  describe('visibility mask', () => {
    it('should show no content at 0% progress', () => {
      const wipe = createLeftWipe();
      const frame = wipe.getFrame(0, 80, 24);

      const allHidden = frame.mask.every((row) => row.every((cell) => cell === false));
      expect(allHidden).toBe(true);
    });

    it('should show all content at 100% progress', () => {
      const wipe = createLeftWipe();
      const frame = wipe.getFrame(100, 80, 24);

      const allVisible = frame.mask.every((row) => row.every((cell) => cell === true));
      expect(allVisible).toBe(true);
    });

    it('should show left half at 50% progress', () => {
      const wipe = createLeftWipe();
      const frame = wipe.getFrame(50, 80, 24);

      expect(frame.mask[0][0]).toBe(true);
    });

    it('should hide right half at 50% progress', () => {
      const wipe = createLeftWipe();
      const frame = wipe.getFrame(50, 80, 24);

      expect(frame.mask[0][79]).toBe(false);
    });
  });

  describe('timing', () => {
    it('should report completion at 100% progress', () => {
      const wipe = createLeftWipe();
      const frame = wipe.getFrame(100, 80, 24);

      expect(frame.isComplete).toBe(true);
    });
  });
});
