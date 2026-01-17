import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';

export interface AsciiArtProps {
  readonly content: string;
}

export function AsciiArt({ content }: AsciiArtProps): React.ReactNode {
  return (
    <box>
      <text fg={LLXPRT_GREENSCREEN_THEME.colors.foreground}>
        {content}
      </text>
    </box>
  );
}
