import { describe, it, expect } from 'vitest';
import { createApp } from './main';

describe('createApp', () => {
  it('should create app with directory', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: true,
      showFooter: true,
    });
    expect(app).toBeDefined();
  });

  it('should create app without header', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: false,
      showFooter: true,
    });
    expect(app).toBeDefined();
  });

  it('should create app without footer', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: true,
      showFooter: false,
    });
    expect(app).toBeDefined();
  });

  it('should create app with minimal options', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: false,
      showFooter: false,
    });
    expect(app).toBeDefined();
  });
});
