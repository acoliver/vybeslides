import type { MarkdownElement } from '../features/markdown/Types';

export interface SpacingResult {
  marginTop: number;
  marginBottom: number;
}

/**
 * Compute spacing for an element based on its context in the element list.
 *
 * Spacing rules:
 * - H1 at start: no top margin
 * - H1 after content: top margin
 * - H2+ after header: no top margin
 * - H2+ after list or code block: top margin
 * - Bullet/numbered list after header: no top margin
 * - Paragraph after list or code block: top margin
 * - Headers: no bottom margin (content follows directly)
 */
export function computeSpacing(elements: MarkdownElement[], index: number): SpacingResult {
  const element = elements[index];
  const prevElement = index > 0 ? elements[index - 1] : null;

  const prevIsList = prevElement?.type === 'bullet_list' || prevElement?.type === 'numbered_list';
  const prevIsCodeBlock = prevElement?.type === 'code_block';

  // Determine top margin based on element type and previous element
  const marginTop = computeTopMargin(element, index, prevIsList, prevIsCodeBlock);

  // No elements need bottom margin currently
  return { marginTop, marginBottom: 0 };
}

function computeTopMargin(
  element: MarkdownElement,
  index: number,
  prevIsList: boolean,
  prevIsCodeBlock: boolean,
): number {
  if (element.type === 'header') {
    // H1 always gets top margin (if not first), H2+ only after list or code block
    if (index > 0 && (element.level === 1 || prevIsList || prevIsCodeBlock)) {
      return 1;
    }
  } else if (element.type === 'paragraph') {
    // Paragraphs get top margin after list or code block
    if (prevIsList || prevIsCodeBlock) {
      return 1;
    }
  }
  // All other elements: no top margin by default
  return 0;
}
