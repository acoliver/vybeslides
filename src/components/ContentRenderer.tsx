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
          const text = element.content;
          if (element.level === 1) {
            // H1 gets big block style
            const upper = text.toUpperCase();
            const bar = '█'.repeat(upper.length + 4);
            return (
              <box key={index} style={{ flexDirection: 'column', marginBottom: 1 }}>
                <text fg={accent}>{bar}</text>
                <text fg={accent}>█ {upper} █</text>
                <text fg={accent}>{bar}</text>
              </box>
            );
          }
          if (element.level === 2) {
            // H2 gets underline
            const underline = '═'.repeat(text.length);
            return (
              <box key={index} style={{ flexDirection: 'column' }}>
                <text fg={accent}>{text}</text>
                <text fg={accent}>{underline}</text>
              </box>
            );
          }
          // H3+ just prefix
          const prefix = '─'.repeat(Math.max(1, 4 - element.level));
          return (
            <text key={index} fg={accent}>
              {prefix} {text}
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
