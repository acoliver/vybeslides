import { describe, it, expect } from 'vitest';
import { createCancelTransitionHandler } from './TransitionCancel';

const baseFrame = { progress: 50, mask: [[true]], isComplete: false };

describe('createCancelTransitionHandler', () => {
  it('should cancel to previous slide during before transition', () => {
    const result = createCancelTransitionHandler({
      transitionActive: true,
      transitionFrame: baseFrame,
      transitionKind: 'before',
      renderState: { fromIndex: 1, toIndex: 2 },
    });

    expect(result.currentIndex).toBe(1);
  });

  it('should cancel to target slide during after transition', () => {
    const result = createCancelTransitionHandler({
      transitionActive: true,
      transitionFrame: baseFrame,
      transitionKind: 'after',
      renderState: { fromIndex: 1, toIndex: 2 },
    });

    expect(result.currentIndex).toBe(2);
  });

  it('should cancel to target slide during blank step', () => {
    const result = createCancelTransitionHandler({
      transitionActive: true,
      transitionFrame: baseFrame,
      transitionKind: 'blank',
      renderState: { fromIndex: 1, toIndex: 2 },
    });

    expect(result.currentIndex).toBe(2);
  });
});
