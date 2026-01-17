import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { validatePresentation, validateSlideEntry } from './Validator';

const BASE_DIR = path.resolve(__dirname, '../../../test-fixtures');
const BASIC_PATH = path.join(BASE_DIR, 'valid-presentations', 'basic');
const MISSING_SLIDES_PATH = path.join(BASE_DIR, 'invalid', 'missing-slides-txt');
const MISSING_FILE_PATH = path.join(BASE_DIR, 'invalid', 'missing-file');
const SUBDIR_PATH = path.join(BASE_DIR, 'invalid', 'subdirectory');
const ABSOLUTE_PATH = path.join(BASE_DIR, 'invalid', 'absolute-path');
const INVALID_TRANSITION_PATH = path.join(BASE_DIR, 'invalid', 'invalid-transition');
const MALFORMED_DIRECTIVE_PATH = path.join(BASE_DIR, 'invalid', 'malformed-directive');
const COMMENT_AS_FILENAME_PATH = path.join(BASE_DIR, 'invalid', 'comment-as-filename');

describe('validatePresentation', () => {
  it('should pass validation for valid presentation', async () => {
    const result = await validatePresentation(BASIC_PATH);
    expect(result.success).toBe(true);
  });

  it('should fail if slides.txt is missing', async () => {
    const result = await validatePresentation(MISSING_SLIDES_PATH);
    expect(result.success).toBe(false);
  });

  it('should include error type for missing slides.txt', async () => {
    const result = await validatePresentation(MISSING_SLIDES_PATH);
    expect(result.error?.type).toBe('missing_slides_txt');
  });

  it('should fail if referenced slide file does not exist', async () => {
    const result = await validatePresentation(MISSING_FILE_PATH);
    expect(result.success).toBe(false);
  });

  it('should include error type for missing file', async () => {
    const result = await validatePresentation(MISSING_FILE_PATH);
    expect(result.error?.type).toBe('missing_file');
  });

  it('should fail if subdirectory is used in path', async () => {
    const result = await validatePresentation(SUBDIR_PATH);
    expect(result.success).toBe(false);
  });

  it('should include error type for subdirectory', async () => {
    const result = await validatePresentation(SUBDIR_PATH);
    expect(result.error?.type).toBe('invalid_path');
  });

  it('should fail if absolute path is used', async () => {
    const result = await validatePresentation(ABSOLUTE_PATH);
    expect(result.success).toBe(false);
  });

  it('should include error type for absolute path', async () => {
    const result = await validatePresentation(ABSOLUTE_PATH);
    expect(result.error?.type).toBe('invalid_path');
  });

  it('should fail if invalid transition name is used', async () => {
    const result = await validatePresentation(INVALID_TRANSITION_PATH);
    expect(result.success).toBe(false);
  });

  it('should include error type for invalid transition', async () => {
    const result = await validatePresentation(INVALID_TRANSITION_PATH);
    expect(result.error?.type).toBe('invalid_transition');
  });

  it('should fail for malformed directive syntax', async () => {
    const result = await validatePresentation(MALFORMED_DIRECTIVE_PATH);
    expect(result.success).toBe(false);
  });

  it('should include error type for malformed directive', async () => {
    const result = await validatePresentation(MALFORMED_DIRECTIVE_PATH);
    expect(result.error?.type).toBe('invalid_directive');
  });

  it('should treat comment-like lines as filenames', async () => {
    const result = await validatePresentation(COMMENT_AS_FILENAME_PATH);
    expect(result.success).toBe(false);
  });

  it('should include error for comment-like filename not existing', async () => {
    const result = await validatePresentation(COMMENT_AS_FILENAME_PATH);
    expect(result.error?.type).toBe('missing_file');
  });
});

describe('validateSlideEntry', () => {
  it('should pass for valid filename with no path separators', () => {
    const result = validateSlideEntry('slide.md', null, null);
    expect(result.success).toBe(true);
  });

  it('should fail for empty filename', () => {
    const result = validateSlideEntry('', null, null);
    expect(result.success).toBe(false);
  });

  it('should include error type for empty filename', () => {
    const result = validateSlideEntry('', null, null);
    expect(result.error?.type).toBe('invalid_path');
  });

  it('should fail for whitespace-only filename', () => {
    const result = validateSlideEntry('   ', null, null);
    expect(result.success).toBe(false);
  });

  it('should fail for filename with subdirectory', () => {
    const result = validateSlideEntry('subdir/slide.md', null, null);
    expect(result.success).toBe(false);
  });

  it('should fail for absolute path', () => {
    const result = validateSlideEntry('/absolute/slide.md', null, null);
    expect(result.success).toBe(false);
  });

  it('should pass for valid transition names', () => {
    const result = validateSlideEntry('slide.md', 'tvon', 'leftwipe');
    expect(result.success).toBe(true);
  });

  it('should fail for invalid before transition', () => {
    const result = validateSlideEntry('slide.md', 'invalidtransition', null);
    expect(result.success).toBe(false);
  });

  it('should fail for invalid after transition', () => {
    const result = validateSlideEntry('slide.md', null, 'invalidtransition');
    expect(result.success).toBe(false);
  });

  it('should fail for case-sensitive transition mismatch', () => {
    const result = validateSlideEntry('slide.md', 'TvOn', null);
    expect(result.success).toBe(false);
  });
});
