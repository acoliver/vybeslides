import { describe, it, expect } from 'vitest';
import { createInputHandler } from './InputHandler';

describe('InputHandler - Key Mapping', () => {
  it('should map forward keys to forward action', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('n');

    expect(result.action).toBe('forward');
  });

  it('should map backward keys to backward action', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('p');

    expect(result.action).toBe('backward');
  });

  it('should map quit keys to quit action', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('q');

    expect(result.action).toBe('quit');
  });
});

describe('InputHandler - Jump Mode', () => {
  it('should jump to index with single digit (0-based)', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('5');

    expect(result.action).toBe('jump');
    expect(result.jumpIndex).toBe(5);
  });

  it('should enter jump mode with colon prefix', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey(':');

    expect(result.action).toBe('jump_mode');
  });

  it('should accumulate digits in jump mode for multi-digit index', () => {
    const handler = createInputHandler();
    handler.parseKey(':');
    handler.parseKey('1');
    const { result } = handler.parseKey('0');

    expect(result.jumpIndex).toBe(10);
  });

  it('should return 0-based index for single digit', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('0');

    expect(result.jumpIndex).toBe(0);
  });

  it('should return 0-based index for colon prefix', () => {
    const handler = createInputHandler();
    handler.parseKey(':');
    const { result } = handler.parseKey('4');

    expect(result.jumpIndex).toBe(4);
  });
});

describe('InputHandler - All Forward Keys', () => {
  it('should recognize right as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('right');

    expect(result.action).toBe('forward');
  });

  it('should recognize space as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('space');

    expect(result.action).toBe('forward');
  });

  it('should recognize pagedown as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('pagedown');

    expect(result.action).toBe('forward');
  });

  it('should recognize down as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('down');

    expect(result.action).toBe('forward');
  });
});

describe('InputHandler - All Backward Keys', () => {
  it('should recognize left as backward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('left');

    expect(result.action).toBe('backward');
  });

  it('should recognize pageup as backward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('pageup');

    expect(result.action).toBe('backward');
  });

  it('should recognize up as backward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('up');

    expect(result.action).toBe('backward');
  });
});

describe('InputHandler - Cancel Keys', () => {
  it('should recognize escape as cancel', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('escape');

    expect(result.action).toBe('cancel');
  });
});

describe('InputHandler - Reload Keys', () => {
  it('should recognize r as reload', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('r');

    expect(result.action).toBe('reload');
  });

  it('should recognize R as reload', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('R');

    expect(result.action).toBe('reload');
  });
});
