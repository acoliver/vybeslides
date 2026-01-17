export function HelpOverlay(): React.ReactNode {
  return (
    <box style={{ border: true, padding: 2 }}>
      <text>Help - Key Bindings</text>
      <text>n, →, Space, PageDown, ↓ - Next slide</text>
      <text>p, ←, PageUp, ↑ - Previous slide</text>
      <text>0-9 - Jump to slide</text>
      <text>? - Help</text>
      <text>q, Escape - Quit</text>
    </box>
  );
}
