export function FooterBar(): React.ReactNode {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return (
    <box style={{ height: 1, border: true }}>
      <text>←/↑ prev | →/↓ next | ? help | q quit</text>
      <text style={{ marginLeft: 2 }}>{time}</text>
    </box>
  );
}
