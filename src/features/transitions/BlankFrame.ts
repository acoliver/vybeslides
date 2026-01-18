import type { Transition, TransitionFrame, VisibilityMask } from './TransitionTypes';

export const BLANK_FRAME_DURATION = 100;

function createBlankMask(width: number, height: number): VisibilityMask {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => false));
}

export function createBlankFrame(): Transition {
  return {
    getFrame(progress: number, width: number, height: number): TransitionFrame {
      return {
        progress,
        mask: createBlankMask(width, height),
        isComplete: progress >= 100,
      };
    },
    getDuration(): number {
      return BLANK_FRAME_DURATION;
    },
  };
}
