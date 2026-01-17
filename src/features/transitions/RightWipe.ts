import type { Transition, TransitionFrame, VisibilityMask } from './TransitionTypes';

function calculateRightWipeMask(
  progress: number,
  width: number,
  height: number,
): VisibilityMask {
  const visibleColumns = Math.floor((width * progress) / 100);

  return Array.from({ length: height }, () =>
    Array.from({ length: width }, (_, x) => x >= width - visibleColumns)
  );
}

export function createRightWipe(): Transition {
  return {
    getFrame(progress: number, width: number, height: number): TransitionFrame {
      return {
        progress,
        mask: calculateRightWipeMask(progress, width, height),
        isComplete: progress >= 100,
      };
    },
    getDuration(): number {
      return 1000;
    },
  };
}
