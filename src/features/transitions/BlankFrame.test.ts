import { describe, it, expect } from 'vitest';
import { createBlankFrame, BLANK_FRAME_DURATION } from './BlankFrame';

describe('BlankFrame', () => {
  describe('duration', () => {
    it('should have duration around 100ms', () => {
      expect(BLANK_FRAME_DURATION).toBeGreaterThan(50);
    });
  });

  describe('visibility mask', () => {
    it('should hide all content', () => {
      const blank = createBlankFrame();
      const frame = blank.getFrame(50, 80, 24);
      
      const allHidden = frame.mask.every((row) => row.every((cell) => cell === false));
      expect(allHidden).toBe(true);
    });
  });
});
