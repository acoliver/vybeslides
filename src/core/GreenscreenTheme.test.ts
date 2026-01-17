import { describe, it, expect } from 'vitest';
import { LLXPRT_GREENSCREEN_THEME } from './GreenscreenTheme';

describe('LLXPRT_GREENSCREEN_THEME', () => {
  it('should have background color set to black', () => {
    expect(LLXPRT_GREENSCREEN_THEME.colors.background).toBe('#000000');
  });

  it('should have foreground color set to greenscreen primary', () => {
    expect(LLXPRT_GREENSCREEN_THEME.colors.foreground).toBe('#6a9955');
  });

  it('should have primary color set to bright green', () => {
    expect(LLXPRT_GREENSCREEN_THEME.colors.primary).toBe('#00ff00');
  });

  it('should have secondary color set to dim green', () => {
    expect(LLXPRT_GREENSCREEN_THEME.colors.secondary).toBe('#4a7035');
  });

  it('should have accent color set to bright green', () => {
    expect(LLXPRT_GREENSCREEN_THEME.colors.accent).toBe('#00ff00');
  });

  it('should have typography heading scale defined', () => {
    expect(LLXPRT_GREENSCREEN_THEME.typography?.headingScale).toBe(1.5);
  });

  it('should have typography body size defined', () => {
    expect(LLXPRT_GREENSCREEN_THEME.typography?.bodySize).toBe(16);
  });

  it('should have spacing base defined', () => {
    expect(LLXPRT_GREENSCREEN_THEME.spacing?.base).toBe(8);
  });

  it('should have spacing small defined', () => {
    expect(LLXPRT_GREENSCREEN_THEME.spacing?.small).toBe(4);
  });

  it('should have spacing large defined', () => {
    expect(LLXPRT_GREENSCREEN_THEME.spacing?.large).toBe(16);
  });
});
