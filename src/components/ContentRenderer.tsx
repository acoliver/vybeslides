import type { MarkdownElement } from '../features/markdown/Types';
import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';

export interface ContentRendererProps {
  readonly elements: MarkdownElement[];
}

export function ContentRenderer({ elements }: ContentRendererProps): React.ReactNode {
  const fg = LLXPRT_GREENSCREEN_THEME.colors.foreground;
  const accent = LLXPRT_GREENSCREEN_THEME.colors.accent;

  return (
    <box style={{ flexDirection: 'column', gap: 1 }}>
      {elements.map((element, index) => {
        if (element.type === 'header') {
          return (
            <text key={index} fg={accent}>
              {element.content}
            </text>
          );
        }
        if (element.type === 'paragraph') {
          return (
            <text key={index} fg={fg}>
              {element.content}
            </text>
          );
        }
        if (element.type === 'bullet_list') {
          return (
            <box key={index} style={{ flexDirection: 'column' }}>
              {element.items.map((item, itemIndex) => (
                <text key={itemIndex} fg={fg}>
                  • {item}
                </text>
              ))}
            </box>
          );
        }
        if (element.type === 'numbered_list') {
          return (
            <box key={index} style={{ flexDirection: 'column' }}>
              {element.items.map((item, itemIndex) => (
                <text key={itemIndex} fg={fg}>
                  {itemIndex + 1}. {item}
                </text>
              ))}
            </box>
          );
        }
        if (element.type === 'ascii_art') {
          const lines = element.content.split('\n');
          return (
            <box key={index} style={{ flexDirection: 'column' }}>
              {lines.map((line, lineIndex) => (
                <text key={lineIndex} fg={accent}>
                  {line}
                </text>
              ))}
            </box>
          );
        }
        if (element.type === 'code_block') {
          const lines = element.content.split('\n');
          return (
            <box key={index} border style={{ borderColor: fg, padding: 1 }}>
              {lines.map((line, lineIndex) => (
                <text key={lineIndex} fg={fg}>
                  {line}
                </text>
              ))}
            </box>
          );
        }
        if (element.type === 'table') {
          return (
            <box key={index} style={{ flexDirection: 'column' }}>
              <text fg={accent}>| {element.headers.join(' | ')} |</text>
              <text fg={fg}>|{element.headers.map(() => '---').join('|')}|</text>
              {element.rows.map((row, rowIndex) => (
                <text key={rowIndex} fg={fg}>
                  | {row.join(' | ')} |
                </text>
              ))}
            </box>
          );
        }
        if (element.type === 'blockquote') {
          return (
            <text key={index} fg={fg}>
              &gt; {element.content}
            </text>
          );
        }
        return null;
      })}
    </box>
  );
}
