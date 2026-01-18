import { describe, it, expect } from 'vitest';
import { applyVisibilityMask, invertVisibilityMask } from './Masking';

describe('invertVisibilityMask', () => {
  it('should flip visible cells to hidden', () => {
    const mask = [[true, false]];
    const inverted = invertVisibilityMask(mask);

    expect(inverted[0]?.[0]).toBe(false);
  });
});

describe('applyVisibilityMask', () => {
  it('should clear masked cells', () => {
    const calls: { x: number; y: number }[] = [];
    const buffer = {
      width: 2,
      height: 1,
      setCell: (x: number, y: number) => {
        calls.push({ x, y });
      },
    };

    applyVisibilityMask(buffer, [[true, false]], 'black');

    expect(calls[0]).toStrictEqual({ x: 1, y: 0 });
  });
});
