import type { SlideEntry } from './Types';

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

export function parseSlidesText(content: string): SlideEntry[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => parseSlideEntry(line));
}
