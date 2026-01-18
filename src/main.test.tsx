import { describe, it, expect } from 'vitest';
import { createApp } from './main';

describe('createApp', () => {
  const slides = [
    {
      filename: '00.md',
      content: '# Intro',
      beforeTransition: null,
      afterTransition: null,
    },
  ];

  it('should create app with slides', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: true,
      showFooter: true,
      slides,
    });

    expect(app).toBeDefined();
  });

  it('should create app without header', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: false,
      showFooter: true,
      slides,
    });
    expect(app).toBeDefined();
  });

  it('should create app without footer', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: true,
      showFooter: false,
      slides,
    });
    expect(app).toBeDefined();
  });

  it('should create app with header/footer disabled', () => {
    const app = createApp({
      directory: './presentation',
      showHeader: false,
      showFooter: false,
      slides,
    });
    expect(app).toBeDefined();
  });
});
