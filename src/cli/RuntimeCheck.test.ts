import { describe, it, expect } from 'vitest';
import { checkBunRuntime } from './RuntimeCheck';

describe('checkBunRuntime', () => {
  it('should have isBun property', () => {
    const result = checkBunRuntime();
    expect(result).toHaveProperty('isBun');
  });

  it('should return boolean success property', () => {
    const result = checkBunRuntime();
    expect(typeof result.success).toBe('boolean');
  });

  it('should return error property when not successful', () => {
    const result = checkBunRuntime();
    const hasError = 'error' in result;
    expect(hasError || result.success).toBe(true);
  });
});
