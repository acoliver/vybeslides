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
      style: { foreground: fg },
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
    <box style={{ flexDirection: 'column' }}>
      {elements.map((element, index) => {
        // Determine if next element is a table or code_block (to suppress bottom margin)
        const nextElement = elements[index + 1];
        const nextIsTableOrCode =
          nextElement?.type === 'table' || nextElement?.type === 'code_block';

        if (element.type === 'header') {
          const text = element.content;
          // Use OpenTUI's code component with markdown syntax highlighting
          // Headers get bold + accent color via tree-sitter
          const prefix = '#'.repeat(element.level) + ' ';
          // Check previous element to determine spacing
          const prevElement = elements[index - 1];
          const prevIsList =
            prevElement?.type === 'bullet_list' || prevElement?.type === 'numbered_list';
          // H1 always gets top margin (if not first), H2+ gets margin if after a list
          const marginTop = index > 0 && (element.level === 1 || prevIsList) ? 1 : 0;
          // Only add bottom margin for H1, and not if next element is a table or code block
          const marginBottom = element.level === 1 && !nextIsTableOrCode ? 1 : 0;
          return (
            <box key={index} style={{ marginTop, marginBottom }}>
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
          // Use code component to get markdown inline formatting (bold, italic, etc.)
          return (
            <box key={index}>
              <code
                filetype="markdown"
                content={element.content}
                drawUnstyledText={false}
                syntaxStyle={markdownSyntaxStyle}
              />
            </box>
          );
        }
        if (element.type === 'bullet_list') {
          const renderItems: React.ReactNode[] = [];
          element.items.forEach((item, itemIndex) => {
            renderItems.push(
              <box key={`item-${itemIndex}`} style={{ flexDirection: 'row' }}>
                <text fg={fg}>• </text>
                <code
                  filetype="markdown"
                  content={item.content}
                  drawUnstyledText={false}
                  syntaxStyle={markdownSyntaxStyle}
                />
              </box>,
            );
            if (item.children && item.children.length > 0) {
              item.children.forEach((child, childIndex) => {
                renderItems.push(
                  <box
                    key={`item-${itemIndex}-child-${childIndex}`}
                    style={{ flexDirection: 'row', marginLeft: 2 }}
                  >
                    <text fg={fg}>- </text>
                    <code
                      filetype="markdown"
                      content={child.content}
                      drawUnstyledText={false}
                      syntaxStyle={markdownSyntaxStyle}
                    />
                  </box>,
                );
              });
            }
          });
          return (
            <box key={index} style={{ flexDirection: 'column' }}>
              {renderItems}
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
                <text key={lineIndex} fg={fg}>
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
          // Calculate column widths for proper alignment
          const allRows = [element.headers, ...element.rows];
          const columnWidths = element.headers.map((_, colIndex) =>
            Math.max(...allRows.map((row) => (row[colIndex] || '').length)),
          );

          const padCell = (cell: string, width: number): string => {
            return cell.padEnd(width, ' ');
          };

          const formatRow = (row: string[]): string => {
            return (
              '│ ' + row.map((cell, i) => padCell(cell || '', columnWidths[i])).join(' │ ') + ' │'
            );
          };

          const topBorder = '┌─' + columnWidths.map((w) => '─'.repeat(w)).join('─┬─') + '─┐';
          const headerSeparator = '├─' + columnWidths.map((w) => '─'.repeat(w)).join('─┼─') + '─┤';
          const bottomBorder = '└─' + columnWidths.map((w) => '─'.repeat(w)).join('─┴─') + '─┘';

          return (
            <box key={index} style={{ flexDirection: 'column' }}>
              <text fg={fg}>{topBorder}</text>
              <text fg={accent}>{formatRow(element.headers)}</text>
              <text fg={fg}>{headerSeparator}</text>
              {element.rows.map((row, rowIndex) => (
                <text key={rowIndex} fg={fg}>
                  {formatRow(row)}
                </text>
              ))}
              <text fg={fg}>{bottomBorder}</text>
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
