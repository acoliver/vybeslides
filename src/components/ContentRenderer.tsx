import type { MarkdownElement } from '../features/markdown/Types';
import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';
import { SyntaxStyle, RGBA } from '@vybestack/opentui-core';

// Create a greenscreen markdown syntax style
function createMarkdownSyntaxStyle() {
  const accent = RGBA.fromHex(LLXPRT_GREENSCREEN_THEME.colors.accent);
  const fg = RGBA.fromHex(LLXPRT_GREENSCREEN_THEME.colors.foreground);

  return SyntaxStyle.fromTheme([
    {
      scope: ['default'],
      style: { foreground: fg },
    },
    {
      scope: ['markup.heading'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.heading.1'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.heading.2'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.heading.3'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.heading.4'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.heading.5'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.heading.6'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.bold', 'markup.strong'],
      style: { foreground: accent, bold: true },
    },
    {
      scope: ['markup.italic'],
      style: { foreground: fg, italic: true },
    },
    {
      scope: ['markup.raw', 'markup.inline.raw'],
      style: { foreground: accent },
    },
    {
      scope: ['markup.link'],
      style: { foreground: accent, underline: true },
    },
  ]);
}

const markdownSyntaxStyle = createMarkdownSyntaxStyle();

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
          // Use OpenTUI's code component with markdown syntax highlighting
          // Headers get bold + accent color via tree-sitter
          const prefix = '#'.repeat(element.level) + ' ';
          return (
            <box key={index} style={{ marginBottom: element.level === 1 ? 1 : 0 }}>
              <code
                filetype="markdown"
                content={prefix + text}
                drawUnstyledText={false}
                syntaxStyle={markdownSyntaxStyle}
              />
            </box>
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
