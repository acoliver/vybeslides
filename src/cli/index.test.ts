import { describe, it, expect } from 'vitest';
import { run } from './index';

describe('CLI entry point', () => {
  it('should return error when no arguments provided', async () => {
    const result = await run([]);
    expect(result.success).toBe(false);
  });

  it('should return error when directory does not exist', async () => {
    const result = await run(['/nonexistent']);
    expect(result.success).toBe(false);
  });

  it('should return error message for missing directory', async () => {
    const result = await run([]);
    const hasError = 'error' in result && typeof result.error === 'string';
    expect(hasError).toBe(true);
  });

  it('should return error message for invalid arguments', async () => {
    const result = await run(['./presentation', '--invalid']);
    const hasError = 'error' in result && typeof result.error === 'string';
    expect(hasError).toBe(true);
  });
});
