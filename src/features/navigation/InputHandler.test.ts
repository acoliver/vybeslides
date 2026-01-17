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
  it('should enter jump mode with single digit', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('5');
    
    expect(result.action).toBe('jump');
  });

  it('should enter jump mode with colon prefix', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey(':');
    
    expect(result.action).toBe('jump_mode');
  });

  it('should accumulate digits in jump mode', () => {
    const handler = createInputHandler();
    handler.parseKey(':');
    handler.parseKey('1');
    const { result } = handler.parseKey('0');
    
    expect(result.jumpIndex).toBe(10);
  });
});

describe('InputHandler - All Forward Keys', () => {
  it('should recognize ArrowRight as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('ArrowRight');
    
    expect(result.action).toBe('forward');
  });

  it('should recognize Space as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('Space');
    
    expect(result.action).toBe('forward');
  });

  it('should recognize PageDown as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('PageDown');
    
    expect(result.action).toBe('forward');
  });

  it('should recognize ArrowDown as forward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('ArrowDown');
    
    expect(result.action).toBe('forward');
  });
});

describe('InputHandler - All Backward Keys', () => {
  it('should recognize ArrowLeft as backward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('ArrowLeft');
    
    expect(result.action).toBe('backward');
  });

  it('should recognize PageUp as backward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('PageUp');
    
    expect(result.action).toBe('backward');
  });

  it('should recognize ArrowUp as backward', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('ArrowUp');
    
    expect(result.action).toBe('backward');
  });
});

describe('InputHandler - Cancel Keys', () => {
  it('should recognize Escape as cancel', () => {
    const handler = createInputHandler();
    const { result } = handler.parseKey('Escape');
    
    expect(result.action).toBe('cancel');
  });
});
