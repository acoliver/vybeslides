import { describe, it, expect } from 'vitest';
import { createTvTurnOn } from './TvTurnOn';

describe('TvTurnOn', () => {
  describe('static box expansion', () => {
    it('should start with small centered box at 0% progress', () => {
      const tv = createTvTurnOn();
      const frame = tv.getFrame(0, 80, 24);
      
      const centerX = 40;
      const centerY = 12;
      expect(frame.mask[centerY][centerX]).toBe(true);
    });

    it('should show all content at 100% progress', () => {
      const tv = createTvTurnOn();
      const frame = tv.getFrame(100, 80, 24);
      
      const allVisible = frame.mask.every((row) => row.every((cell) => cell === true));
      expect(allVisible).toBe(true);
    });

    it('should hide corners at early progress', () => {
      const tv = createTvTurnOn();
      const frame = tv.getFrame(10, 80, 24);
      
      expect(frame.mask[0][0]).toBe(false);
    });

    it('should expand from center', () => {
      const tv = createTvTurnOn();
      const frame = tv.getFrame(50, 80, 24);
      
      const centerX = 40;
      const centerY = 12;
      expect(frame.mask[centerY][centerX]).toBe(true);
    });
  });

  describe('timing', () => {
    it('should report completion at 100% progress', () => {
      const tv = createTvTurnOn();
      const frame = tv.getFrame(100, 80, 24);
      
      expect(frame.isComplete).toBe(true);
    });
  });
});
