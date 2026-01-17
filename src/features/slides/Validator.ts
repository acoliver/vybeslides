import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parseSlidesText } from './SlidesParser';
import type { ValidationResult, SlideEntry, TransitionName } from './Types';
import { TRANSITION_NAME_SET } from './Types';

export async function validatePresentation(presentationDir: string): Promise<ValidationResult> {
  const slidesTxtPath = path.join(presentationDir, 'slides.txt');
  
  try {
    await fs.access(slidesTxtPath);
  } catch {
    return {
      success: false,
      error: {
        type: 'missing_slides_txt',
        message: `slides.txt not found in ${presentationDir}`,
      },
    };
  }

  const content = await fs.readFile(slidesTxtPath, 'utf-8');
  const entries = parseSlidesText(content);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    
    if (hasDirectiveWithUnknownTransition(entry)) {
      return {
        success: false,
        error: {
          type: 'invalid_directive',
          message: `Malformed directive in: ${entry.filename}`,
          filename: entry.filename,
          line: i + 1,
        },
      };
    }

    const entryValidation = validateSlideEntry(
      entry.filename,
      entry.beforeTransition,
      entry.afterTransition,
    );

    if (!entryValidation.success) {
      if (!entryValidation.error) {
        return {
          success: false,
          error: {
            type: 'invalid_path',
            message: 'Validation failed',
            line: i + 1,
          },
        };
      }
      return {
        success: false,
        error: {
          ...entryValidation.error,
          line: i + 1,
        },
      };
    }

    const filePath = path.join(presentationDir, entry.filename);
    try {
      await fs.access(filePath);
    } catch {
      return {
        success: false,
        error: {
          type: 'missing_file',
          message: `Slide file not found: ${entry.filename}`,
          filename: entry.filename,
          line: i + 1,
        },
      };
    }
  }

  return {
    success: true,
    entries,
  };
}

export function validateSlideEntry(
  filename: string,
  beforeTransition: string | null,
  afterTransition: string | null,
): ValidationResult {
  if (!filename || filename.trim() === '') {
    return {
      success: false,
      error: {
        type: 'invalid_path',
        message: 'Filename cannot be empty',
        filename,
      },
    };
  }

  if (filename.includes('/') || filename.includes('\\')) {
    if (path.isAbsolute(filename)) {
      return {
        success: false,
        error: {
          type: 'invalid_path',
          message: `Absolute paths are not allowed: ${filename}`,
          filename,
        },
      };
    }
    return {
      success: false,
      error: {
        type: 'invalid_path',
        message: `Subdirectories are not allowed: ${filename}`,
        filename,
      },
    };
  }

  if (beforeTransition !== null && !isValidTransition(beforeTransition)) {
    return {
      success: false,
      error: {
        type: 'invalid_transition',
        message: `Invalid before transition: ${beforeTransition}`,
        filename,
      },
    };
  }

  if (afterTransition !== null && !isValidTransition(afterTransition)) {
    return {
      success: false,
      error: {
        type: 'invalid_transition',
        message: `Invalid after transition: ${afterTransition}`,
        filename,
      },
    };
  }

  return {
    success: true,
  };
}

function isValidTransition(name: string): name is TransitionName {
  return TRANSITION_NAME_SET.has(name);
}

function hasDirectiveWithUnknownTransition(entry: SlideEntry): boolean {
  if (entry.unknownDirectives && entry.unknownDirectives.length > 0) {
    return true;
  }
  if (entry.filename.includes(':')) {
    return true;
  }
  return false;
}
