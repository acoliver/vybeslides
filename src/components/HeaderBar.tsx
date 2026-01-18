import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';

export interface HeaderBarProps {
  readonly slideNumber: number;
  readonly totalSlides: number;
  readonly title?: string | null;
}

export function HeaderBar({ slideNumber, totalSlides, title }: HeaderBarProps): React.ReactNode {
  const fg = LLXPRT_GREENSCREEN_THEME.colors.foreground;
  const bg = LLXPRT_GREENSCREEN_THEME.colors.background;
  const displayTitle = title ?? 'VybeSlides';

  return (
    <box
      border
      style={{
        height: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: fg,
        backgroundColor: bg,
        padding: 1,
      }}
    >
      <text fg={fg}>{displayTitle}</text>
      <text fg={fg}>
        [{slideNumber}/{totalSlides}]
      </text>
    </box>
  );
}
