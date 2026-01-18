import type { SlideEntry, PresentationConfig } from './Types';

export function parseSlideEntry(line: string): SlideEntry {
  const parts = line.trim().split(/\s+/);

  const parsedData = parts.reduce<{
    filename: string;
    beforeTransition: string | null;
    afterTransition: string | null;
    unknownDirectives: string[];
  }>(
    (acc, part) => {
      if (part.startsWith('before:')) {
        const transitionName = part.substring(7);
        return { ...acc, beforeTransition: transitionName };
      }
      if (part.startsWith('after:')) {
        const transitionName = part.substring(6);
        return { ...acc, afterTransition: transitionName };
      }
      if (part.includes(':')) {
        const newUnknownDirectives = [...acc.unknownDirectives, part];
        return {
          ...acc,
          unknownDirectives: newUnknownDirectives,
          filename: acc.filename || part,
        };
      }
      if (!acc.filename) {
        return { ...acc, filename: part };
      }
      return acc;
    },
    {
      filename: '',
      beforeTransition: null,
      afterTransition: null,
      unknownDirectives: [],
    },
  );

  if (parsedData.unknownDirectives.length === 0) {
    return {
      filename: parsedData.filename,
      beforeTransition: parsedData.beforeTransition,
      afterTransition: parsedData.afterTransition,
    };
  }

  return {
    filename: parsedData.filename,
    beforeTransition: parsedData.beforeTransition,
    afterTransition: parsedData.afterTransition,
    unknownDirectives: parsedData.unknownDirectives,
  };
}

export function parseSlidesText(content: string): PresentationConfig {
  const lines = content.split('\n').map((line) => line.trim());

  let title: string | null = null;
  const entryLines: string[] = [];

  for (const line of lines) {
    if (line.length === 0) continue;

    // Check for title line (# Title)
    if (line.startsWith('# ') && title === null) {
      title = line.substring(2).trim();
    } else {
      entryLines.push(line);
    }
  }

  const entries = entryLines.map((line) => parseSlideEntry(line));

  return { title, entries };
}
