export interface TableProps {
  readonly headers: string[];
  readonly rows: string[][];
}

export function Table({ headers, rows }: TableProps): React.ReactNode {
  return (
    <box style={{ border: true, padding: 1 }}>
      <box>
        {headers.map((header, index) => (
          <text key={index}>{header}</text>
        ))}
      </box>
      {rows.map((row, rowIndex) => (
        <box key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <text key={cellIndex}>{cell}</text>
          ))}
        </box>
      ))}
    </box>
  );
}
