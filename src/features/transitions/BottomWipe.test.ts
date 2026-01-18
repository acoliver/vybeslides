import { describe, it, expect } from 'vitest';
import { createBottomWipe } from './BottomWipe';

describe('BottomWipe', () => {
  describe('visibility mask', () => {
    it('should show no content at 0% progress', () => {
      const wipe = createBottomWipe();
      const frame = wipe.getFrame(0, 80, 24);

      const allHidden = frame.mask.every((row) => row.every((cell) => cell === false));
      expect(allHidden).toBe(true);
    });

    it('should show all content at 100% progress', () => {
      const wipe = createBottomWipe();
      const frame = wipe.getFrame(100, 80, 24);

      const allVisible = frame.mask.every((row) => row.every((cell) => cell === true));
      expect(allVisible).toBe(true);
    });

    it('should show bottom half at 50% progress', () => {
      const wipe = createBottomWipe();
      const frame = wipe.getFrame(50, 80, 24);

      expect(frame.mask[23][0]).toBe(true);
    });

    it('should hide top half at 50% progress', () => {
      const wipe = createBottomWipe();
      const frame = wipe.getFrame(50, 80, 24);

      expect(frame.mask[0][0]).toBe(false);
    });
  });

  describe('timing', () => {
    it('should report completion at 100% progress', () => {
      const wipe = createBottomWipe();
      const frame = wipe.getFrame(100, 80, 24);

      expect(frame.isComplete).toBe(true);
    });
  });
});
