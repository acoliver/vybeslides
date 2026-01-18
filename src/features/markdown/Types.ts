export type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Header {
  type: 'header';
  level: number;
  content: string;
}

export interface Paragraph {
  type: 'paragraph';
  content: string;
}

export interface BulletListItem {
  content: string;
  children?: BulletListItem[];
}

export interface BulletList {
  type: 'bullet_list';
  items: BulletListItem[];
}

export interface NumberedList {
  type: 'numbered_list';
  items: string[];
}

export interface CodeBlock {
  type: 'code_block';
  language: string | null;
  content: string;
}

export interface Table {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface Blockquote {
  type: 'blockquote';
  content: string;
}

export interface AsciiArt {
  type: 'ascii_art';
  content: string;
}

export interface MarkdownElementBase {
  type: string;
}

export type MarkdownElement =
  | Header
  | Paragraph
  | BulletList
  | NumberedList
  | CodeBlock
  | Table
  | Blockquote
  | AsciiArt;

export interface ParseResult {
  elements: MarkdownElement[];
}
