import type { Transition, TransitionFrame, VisibilityMask } from './TransitionTypes';

function calculateLeftWipeMask(progress: number, width: number, height: number): VisibilityMask {
  const visibleColumns = Math.floor((width * progress) / 100);

  return Array.from({ length: height }, () =>
    Array.from({ length: width }, (_, x) => x < visibleColumns),
  );
}

export function createLeftWipe(): Transition {
  return {
    getFrame(progress: number, width: number, height: number): TransitionFrame {
      return {
        progress,
        mask: calculateLeftWipeMask(progress, width, height),
        isComplete: progress >= 100,
      };
    },
    getDuration(): number {
      return 1000;
    },
  };
}
