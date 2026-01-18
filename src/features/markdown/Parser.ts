import type {
  ParseResult,
  MarkdownElement,
  Header,
  Paragraph,
  BulletList,
  BulletListItem,
  NumberedList,
  CodeBlock,
  AsciiArt,
  Table,
  Blockquote,
} from './Types';

const BULLET_ITEM_PATTERN = /^(\s*)[-*]\s/;
const NUMBERED_ITEM_PATTERN = /^\d+\.\s/;
const TABLE_ROW_PATTERN = /^\|.*\|$/;
const TABLE_SEPARATOR_PATTERN = /^\|[\s-:|]+\|$/;
const CODE_BLOCK_START_PATTERN = /^```\w*$/;
const CODE_BLOCK_END_PATTERN = /^```$/;

function parseHeader(line: string): Header | null {
  const headerPattern = /^(#{1,6})\s+(.*)$/;
  const match = headerPattern.exec(line);
  if (!match?.[2]) {
    return null;
  }
  const level = match[1].length;
  if (level < 1 || level > 6) {
    return null;
  }
  return {
    type: 'header',
    level,
    content: match[2],
  };
}

function parseBulletList(
  lines: string[],
  startIndex: number,
): { element: BulletList; nextIndex: number } {
  const items: BulletListItem[] = [];
  let i = startIndex;
  const topLevelPattern = /^[-*]\s+(.*)$/;
  const subItemPattern = /^(\s{2,})[-*]\s+(.*)$/;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines within the list
    if (line.trim() === '') {
      // Look ahead to see if there's another bullet item (top-level or sub)
      let nextNonBlank = i + 1;
      while (nextNonBlank < lines.length && lines[nextNonBlank].trim() === '') {
        nextNonBlank++;
      }
      if (
        nextNonBlank < lines.length &&
        (topLevelPattern.exec(lines[nextNonBlank]) || subItemPattern.exec(lines[nextNonBlank]))
      ) {
        i++;
        continue;
      }
      break;
    }

    // Check for sub-item first (indented bullet)
    const subMatch = subItemPattern.exec(line);
    if (subMatch?.[2]) {
      // Add as child to last top-level item
      if (items.length > 0) {
        const lastItem = items[items.length - 1];
        lastItem.children ??= [];
        lastItem.children.push({ content: subMatch[2] });
      }
      i++;
      continue;
    }

    // Check for top-level item
    const topMatch = topLevelPattern.exec(line);
    if (!topMatch?.[1]) {
      break;
    }
    items.push({ content: topMatch[1] });
    i++;
  }

  return {
    element: { type: 'bullet_list', items },
    nextIndex: i,
  };
}

function parseNumberedList(
  lines: string[],
  startIndex: number,
): { element: NumberedList; nextIndex: number } {
  let items: string[] = [];
  let i = startIndex;
  const itemPattern = /^\d+\.\s+(.*)$/;

  while (i < lines.length) {
    const match = itemPattern.exec(lines[i]);
    if (!match?.[1]) {
      break;
    }
    items = [...items, match[1]];
    i++;
  }

  return {
    element: { type: 'numbered_list', items },
    nextIndex: i,
  };
}

function parseTable(
  lines: string[],
  startIndex: number,
): { element: Table; nextIndex: number } | null {
  if (startIndex + 1 >= lines.length) {
    return null;
  }

  const separatorMatch = TABLE_SEPARATOR_PATTERN.exec(lines[startIndex + 1]);
  if (!separatorMatch) {
    return null;
  }

  const headerCells = lines[startIndex]
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
  let rows: string[][] = [];
  let i = startIndex + 2;

  while (i < lines.length && TABLE_ROW_PATTERN.exec(lines[i])) {
    const rowCells = lines[i]
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    rows = [...rows, rowCells];
    i++;
  }

  return {
    element: { type: 'table', headers: headerCells, rows },
    nextIndex: i,
  };
}

function parseBlockquote(line: string): Blockquote | null {
  const quotePattern = /^>\s+(.*)$/;
  const match = quotePattern.exec(line);
  if (!match?.[1]) {
    return null;
  }
  return {
    type: 'blockquote',
    content: match[1],
  };
}

function parseCodeBlock(
  lines: string[],
  startIndex: number,
): { element: CodeBlock | AsciiArt; nextIndex: number } | null {
  const startPattern = /^```(\w+)?$/;
  const match = startPattern.exec(lines[startIndex]);
  if (!match) {
    return null;
  }

  const language = match[1] || null;
  let codeLines: string[] = [];
  let i = startIndex + 1;

  while (i < lines.length && !CODE_BLOCK_END_PATTERN.exec(lines[i])) {
    codeLines = [...codeLines, lines[i]];
    i++;
  }

  const content = codeLines.join('\n');
  const element: CodeBlock | AsciiArt =
    language === 'ascii'
      ? { type: 'ascii_art', content }
      : { type: 'code_block', language, content };

  return {
    element,
    nextIndex: i + 1,
  };
}

export function parseMarkdown(content: string): ParseResult {
  let elements: MarkdownElement[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const header = parseHeader(line);
    if (header) {
      elements = [...elements, header];
      i++;
      continue;
    }

    if (BULLET_ITEM_PATTERN.exec(line)) {
      const result = parseBulletList(lines, i);
      elements = [...elements, result.element];
      i = result.nextIndex;
      continue;
    }

    if (NUMBERED_ITEM_PATTERN.exec(line)) {
      const result = parseNumberedList(lines, i);
      elements = [...elements, result.element];
      i = result.nextIndex;
      continue;
    }

    if (TABLE_ROW_PATTERN.exec(line)) {
      const result = parseTable(lines, i);
      if (result) {
        elements = [...elements, result.element];
        i = result.nextIndex;
        continue;
      }
    }

    const blockquote = parseBlockquote(line);
    if (blockquote) {
      elements = [...elements, blockquote];
      i++;
      continue;
    }

    if (CODE_BLOCK_START_PATTERN.exec(line)) {
      const result = parseCodeBlock(lines, i);
      if (result) {
        elements = [...elements, result.element];
        i = result.nextIndex;
        continue;
      }
    }

    const paragraph: Paragraph = {
      type: 'paragraph',
      content: line,
    };
    elements = [...elements, paragraph];
    i++;
  }

  return { elements };
}
