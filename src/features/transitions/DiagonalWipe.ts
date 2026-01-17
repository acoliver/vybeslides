import type { Transition, TransitionFrame, VisibilityMask } from './TransitionTypes';

function calculateDiagonalMask(
  progress: number,
  width: number,
  height: number,
): VisibilityMask {
  const threshold = ((width + height) * progress) / 100;

  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => x + y < threshold)
  );
}

export function createDiagonalWipe(): Transition {
  return {
    getFrame(progress: number, width: number, height: number): TransitionFrame {
      return {
        progress,
        mask: calculateDiagonalMask(progress, width, height),
        isComplete: progress >= 100,
      };
    },
    getDuration(): number {
      return 1000;
    },
  };
}
