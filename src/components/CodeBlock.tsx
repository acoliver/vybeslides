import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';

export interface CodeBlockProps {
  readonly content: string;
}

export function CodeBlock({ content }: CodeBlockProps): React.ReactNode {
  return (
    <box style={{ border: true, padding: 1 }}>
      <text fg={LLXPRT_GREENSCREEN_THEME.colors.foreground}>
        {content}
      </text>
    </box>
  );
}
