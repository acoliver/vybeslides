export interface BoxBorderProps {
  readonly children: React.ReactNode;
  readonly borderStyle?: 'rounded' | 'lightweight';
}

export function BoxBorder({ children }: BoxBorderProps): React.ReactNode {
  return <box style={{ border: true }}>{children}</box>;
}
