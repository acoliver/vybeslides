import { describe, it, expect } from 'vitest';
import type { Theme } from './Theme';

describe('Theme', () => {
  it('should have colors background property', () => {
    const theme: Theme = {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#0066cc',
        secondary: '#00cc66',
        accent: '#cc6600',
      },
    };

    expect(theme.colors.background).toBe('#000000');
  });

  it('should have colors foreground property', () => {
    const theme: Theme = {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#0066cc',
        secondary: '#00cc66',
        accent: '#cc6600',
      },
    };

    expect(theme.colors.foreground).toBe('#ffffff');
  });

  it('should have optional typography headingScale property', () => {
    const theme: Theme = {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#0066cc',
        secondary: '#00cc66',
        accent: '#cc6600',
      },
      typography: {
        headingScale: 1.5,
        bodySize: 16,
      },
    };

    expect(theme.typography?.headingScale).toBe(1.5);
  });

  it('should have optional typography bodySize property', () => {
    const theme: Theme = {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#0066cc',
        secondary: '#00cc66',
        accent: '#cc6600',
      },
      typography: {
        headingScale: 1.5,
        bodySize: 16,
      },
    };

    expect(theme.typography?.bodySize).toBe(16);
  });

  it('should have optional spacing base property', () => {
    const theme: Theme = {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#0066cc',
        secondary: '#00cc66',
        accent: '#cc6600',
      },
      spacing: {
        base: 8,
        small: 4,
        large: 16,
      },
    };

    expect(theme.spacing?.base).toBe(8);
  });
});
