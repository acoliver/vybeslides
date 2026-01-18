import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';

export function FooterBar(): React.ReactNode {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;
  const fg = LLXPRT_GREENSCREEN_THEME.colors.foreground;
  const bg = LLXPRT_GREENSCREEN_THEME.colors.background;

  return (
    <box
      border
      style={{
        height: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: fg,
        backgroundColor: bg,
      }}
    >
      <text fg={fg}>←/↑ prev | →/↓ next | r reload | ? help | q quit</text>
      <text fg={fg}>{time}</text>
    </box>
  );
}
