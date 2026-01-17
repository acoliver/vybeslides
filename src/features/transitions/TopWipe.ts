import type { Transition, TransitionFrame, VisibilityMask } from './TransitionTypes';

function calculateTopWipeMask(
  progress: number,
  width: number,
  height: number,
): VisibilityMask {
  const visibleRows = Math.floor((height * progress) / 100);

  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, () => y < visibleRows)
  );
}

export function createTopWipe(): Transition {
  return {
    getFrame(progress: number, width: number, height: number): TransitionFrame {
      return {
        progress,
        mask: calculateTopWipeMask(progress, width, height),
        isComplete: progress >= 100,
      };
    },
    getDuration(): number {
      return 1000;
    },
  };
}
