import type { Transition, TransitionFrame, VisibilityMask } from './TransitionTypes';

function calculateTvTurnOffMask(
  progress: number,
  width: number,
  height: number,
): VisibilityMask {
  if (progress >= 100) {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false)
    );
  }
  
  if (progress === 0) {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => true)
    );
  }
  
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  const maxRadiusX = Math.max(centerX, width - centerX);
  const maxRadiusY = Math.max(centerY, height - centerY);
  
  const radiusX = Math.max(0.1, (maxRadiusX * (100 - progress)) / 100);
  const radiusY = Math.max(0.1, (maxRadiusY * (100 - progress)) / 100);

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

export function createTvTurnOff(): Transition {
  return {
    getFrame(progress: number, width: number, height: number): TransitionFrame {
      return {
        progress,
        mask: calculateTvTurnOffMask(progress, width, height),
        isComplete: progress >= 100,
      };
    },
    getDuration(): number {
      return 1500;
    },
  };
}
