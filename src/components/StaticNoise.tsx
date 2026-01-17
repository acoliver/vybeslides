const NOISE_CHARS = ['░', '▒', '▓', '█'];

function generateNoise(width: number, height: number): string {
  const lines = Array.from({ length: height }, () => {
    return Array.from({ length: width }, () => {
      return NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
    }).join('');
  });
  return lines.join('\n');
}

export interface StaticNoiseProps {
  readonly width: number;
  readonly height: number;
}

export function StaticNoise({ width, height }: StaticNoiseProps): React.ReactNode {
  const noise = generateNoise(width, height);
  
  return (
    <box>
      <text>{noise}</text>
    </box>
  );
}
