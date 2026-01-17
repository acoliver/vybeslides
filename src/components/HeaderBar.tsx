export interface HeaderBarProps {
  readonly slideNumber: number;
  readonly totalSlides: number;
}

export function HeaderBar({ slideNumber, totalSlides }: HeaderBarProps): React.ReactNode {
  return (
    <box style={{ height: 3, border: true }}>
      <text>VybeSlides</text>
      <text style={{ marginLeft: 2 }}>[{slideNumber}/{totalSlides}]</text>
    </box>
  );
}
