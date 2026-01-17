import { describe, it, expect } from 'vitest';
import { createTvTurnOff } from './TvTurnOff';

describe('TvTurnOff', () => {
  describe('screen collapse', () => {
    it('should show all content at 0% progress', () => {
      const tv = createTvTurnOff();
      const frame = tv.getFrame(0, 80, 24);
      
      const allVisible = frame.mask.every((row) => row.every((cell) => cell === true));
      expect(allVisible).toBe(true);
    });

    it('should hide all content at 100% progress', () => {
      const tv = createTvTurnOff();
      const frame = tv.getFrame(100, 80, 24);
      
      const allHidden = frame.mask.every((row) => row.every((cell) => cell === false));
      expect(allHidden).toBe(true);
    });

    it('should collapse to center', () => {
      const tv = createTvTurnOff();
      const frame = tv.getFrame(50, 80, 24);
      
      const centerX = 40;
      const centerY = 12;
      expect(frame.mask[centerY][centerX]).toBe(true);
    });

    it('should hide corners first', () => {
      const tv = createTvTurnOff();
      const frame = tv.getFrame(90, 80, 24);
      
      expect(frame.mask[0][0]).toBe(false);
    });
  });

  describe('timing', () => {
    it('should report completion at 100% progress', () => {
      const tv = createTvTurnOff();
      const frame = tv.getFrame(100, 80, 24);
      
      expect(frame.isComplete).toBe(true);
    });
  });
});
