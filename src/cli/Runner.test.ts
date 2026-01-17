import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { validatePresentation } from './Runner';

describe('validatePresentation (Runner)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vybeslides-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should validate a valid presentation directory', async () => {
    const slidesTxt = path.join(tempDir, 'slides.txt');
    const slide1 = path.join(tempDir, 'slide1.md');

    await fs.writeFile(slidesTxt, 'slide1.md\n');
    await fs.writeFile(slide1, '# Slide 1\n');

    const result = await validatePresentation(tempDir);
    expect(result.success).toBe(true);
  });

  it('should fail when slides.txt is missing', async () => {
    const result = await validatePresentation(tempDir);
    expect(result.success).toBe(false);
  });

  it('should fail when directory does not exist', async () => {
    const result = await validatePresentation('/nonexistent');
    expect(result.success).toBe(false);
  });

  it('should fail when slide file is missing', async () => {
    const slidesTxt = path.join(tempDir, 'slides.txt');
    await fs.writeFile(slidesTxt, 'missing.md\n');

    const result = await validatePresentation(tempDir);
    expect(result.success).toBe(false);
  });

  it('should return error message when slides.txt is missing', async () => {
    const result = await validatePresentation(tempDir);
    expect(!result.success && result.error.includes('slides.txt')).toBe(true);
  });
});
