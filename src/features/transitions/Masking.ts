import type { VisibilityMask } from './TransitionTypes';

export interface BufferCell<Color> {
  readonly width: number;
  readonly height: number;
  setCell: (x: number, y: number, char: string, fg: Color, bg: Color, attributes?: number) => void;
}

export function invertVisibilityMask(mask: VisibilityMask): VisibilityMask {
  return mask.map((row) => row.map((cell) => !cell));
}

export function applyVisibilityMask<Color>(
  buffer: BufferCell<Color>,
  mask: VisibilityMask,
  background: Color,
): void {
  const height = Math.min(buffer.height, mask.length);

  for (let y = 0; y < height; y += 1) {
    const row = mask[y];
    const width = Math.min(buffer.width, row.length);

    for (let x = 0; x < width; x += 1) {
      const isVisible = row[x];
      if (!isVisible) {
        buffer.setCell(x, y, ' ', background, background);
      }
    }
  }
}
