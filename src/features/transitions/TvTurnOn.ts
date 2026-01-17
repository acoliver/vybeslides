import type { Transition, TransitionFrame, VisibilityMask } from './TransitionTypes';

function calculateTvTurnOnMask(
  progress: number,
  width: number,
  height: number,
): VisibilityMask {
  if (progress >= 100) {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => true)
    );
  }
  
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  const maxRadiusX = Math.max(centerX, width - centerX);
  const maxRadiusY = Math.max(centerY, height - centerY);
  
  const radiusX = Math.max(1, (maxRadiusX * progress) / 100);
  const radiusY = Math.max(1, (maxRadiusY * progress) / 100);

  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const dx = x - centerX;
      const dy = y - centerY;
      const normalizedDistance = (dx * dx) / (radiusX * radiusX) + 
                                 (dy * dy) / (radiusY * radiusY);
      return normalizedDistance <= 1;
    })
  );
}

export function createTvTurnOn(): Transition {
  return {
    getFrame(progress: number, width: number, height: number): TransitionFrame {
      return {
        progress,
        mask: calculateTvTurnOnMask(progress, width, height),
        isComplete: progress >= 100,
      };
    },
    getDuration(): number {
      return 2000;
    },
  };
}
