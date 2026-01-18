import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { runPresentation } from './Runner';

describe('runPresentation (Runner)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vybeslides-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should fail when slides.txt is missing', async () => {
    const result = await runPresentation({
      directory: tempDir,
      showHeader: false,
      showFooter: false,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when directory does not exist', async () => {
    const result = await runPresentation({
      directory: '/nonexistent',
      showHeader: false,
      showFooter: false,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when slide file is missing', async () => {
    const slidesTxt = path.join(tempDir, 'slides.txt');
    await fs.writeFile(slidesTxt, 'missing.md\n');

    const result = await runPresentation({
      directory: tempDir,
      showHeader: false,
      showFooter: false,
    });
    expect(result.success).toBe(false);
  });
});
