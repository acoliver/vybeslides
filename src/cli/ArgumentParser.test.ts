import { describe, it, expect } from 'vitest';
import { parseArguments } from './ArgumentParser';

describe('parseArguments', () => {
  it('should parse presentation directory', () => {
    const result = parseArguments(['./presentation']);
    expect(result.success).toBe(true);
  });

  it('should return error when directory is missing', () => {
    const result = parseArguments([]);
    expect(result.success).toBe(false);
  });

  it('should parse header off flag', () => {
    const result = parseArguments(['./presentation', '--header', 'off']);
    expect(result.success && result.options.showHeader === false).toBe(true);
  });

  it('should parse footer off flag', () => {
    const result = parseArguments(['./presentation', '--footer', 'off']);
    expect(result.success && result.options.showFooter === false).toBe(true);
  });

  it('should parse both flags', () => {
    const result = parseArguments([
      './presentation',
      '--header',
      'off',
      '--footer',
      'off',
    ]);
    expect(result.success && result.options.showHeader === false).toBe(true);
  });

  it('should default header to true', () => {
    const result = parseArguments(['./presentation']);
    expect(result.success && result.options.showHeader === true).toBe(true);
  });

  it('should default footer to true', () => {
    const result = parseArguments(['./presentation']);
    expect(result.success && result.options.showFooter === true).toBe(true);
  });

  it('should handle help flag', () => {
    const result = parseArguments(['--help']);
    expect(result.success).toBe(false);
  });

  it('should return error for invalid flag', () => {
    const result = parseArguments(['./presentation', '--invalid']);
    expect(result.success).toBe(false);
  });

  it('should return directory path when valid', () => {
    const result = parseArguments(['./presentation']);
    expect(result.success && result.directory === './presentation').toBe(true);
  });
});
