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
    const result = parseArguments(['./presentation', '--header', 'off', '--footer', 'off']);
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

describe('parseArguments - render option', () => {
  it('should parse --render with slide number', () => {
    const result = parseArguments(['./presentation', '--render', '5']);
    expect(result.success).toBe(true);
    expect(result.success && result.options.render).toBe(5);
  });

  it('should parse --render with 0 for first slide', () => {
    const result = parseArguments(['./presentation', '--render', '0']);
    expect(result.success).toBe(true);
    expect(result.success && result.options.render).toBe(0);
  });

  it('should default render to undefined', () => {
    const result = parseArguments(['./presentation']);
    expect(result.success).toBe(true);
    expect(result.success && result.options.render).toBeUndefined();
  });

  it('should return error for non-numeric render value', () => {
    const result = parseArguments(['./presentation', '--render', 'abc']);
    expect(result.success).toBe(false);
  });

  it('should return error for negative render value', () => {
    const result = parseArguments(['./presentation', '--render', '-1']);
    expect(result.success).toBe(false);
  });

  it('should return error for missing render value', () => {
    const result = parseArguments(['./presentation', '--render']);
    expect(result.success).toBe(false);
  });

  it('should combine --render with other options', () => {
    const result = parseArguments(['./presentation', '--header', 'off', '--render', '3']);
    expect(result.success).toBe(true);
    expect(result.success && result.options.showHeader).toBe(false);
    expect(result.success && result.options.render).toBe(3);
  });
});

describe('parseArguments - disable options', () => {
  it('should parse --disable-header', () => {
    const result = parseArguments(['./presentation', '--disable-header']);
    expect(result.success).toBe(true);
    expect(result.success && result.options.showHeader).toBe(false);
  });

  it('should parse --disable-footer', () => {
    const result = parseArguments(['./presentation', '--disable-footer']);
    expect(result.success).toBe(true);
    expect(result.success && result.options.showFooter).toBe(false);
  });

  it('should parse both --disable-header and --disable-footer', () => {
    const result = parseArguments(['./presentation', '--disable-header', '--disable-footer']);
    expect(result.success).toBe(true);
    expect(result.success && result.options.showHeader).toBe(false);
    expect(result.success && result.options.showFooter).toBe(false);
  });
});
