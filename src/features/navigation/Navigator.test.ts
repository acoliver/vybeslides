import { describe, it, expect } from 'vitest';
import { createNavigator } from './Navigator';

describe('Navigator - Forward Navigation', () => {
  it('should navigate forward to next slide when not on last slide', () => {
    const nav = createNavigator(5);
    const { result } = nav.handleForward();
    
    expect(result.targetIndex).toBe(1);
  });

  it('should not navigate forward when on last slide', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 4 });
    const { result } = nav.handleForward();
    
    expect(result.direction).toBe('stay');
  });

  it('should cancel transition when forward pressed at end of deck during transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 4, transitionInProgress: true });
    const { result } = nav.handleForward();
    
    expect(result.cancelTransition).toBe(true);
  });
});

describe('Navigator - Backward Navigation', () => {
  it('should navigate backward to previous slide', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2 });
    const { result } = nav.handleBackward();
    
    expect(result.targetIndex).toBe(1);
  });

  it('should navigate backward instantly without transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2 });
    const { result } = nav.handleBackward();
    
    expect(result.requiresTransition).toBe(false);
  });
});

describe('Navigator - Cancel Behaviors', () => {
  it('should cancel transition and stay on current slide when ESC pressed mid-transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2, transitionInProgress: true });
    const { result } = nav.handleKey('Escape');
    
    expect(result.cancelTransition).toBe(true);
  });

  it('should cancel transition and navigate backward when PgUp pressed mid-transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2, transitionInProgress: true });
    const { result } = nav.handleBackward();
    
    expect(result.cancelTransition).toBe(true);
  });

  it('should cancel transition and navigate forward when PgDn pressed mid-transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2, transitionInProgress: true });
    const { result } = nav.handleForward();
    
    expect(result.cancelTransition).toBe(true);
  });

  it('should target previous slide when backward pressed during transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2, transitionInProgress: true });
    const { result } = nav.handleBackward();
    
    expect(result.targetIndex).toBe(1);
  });

  it('should target next slide when forward pressed during transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2, transitionInProgress: true });
    const { result } = nav.handleForward();
    
    expect(result.targetIndex).toBe(3);
  });

  it('should target current slide when ESC pressed during transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2, transitionInProgress: true });
    const { result } = nav.handleKey('Escape');
    
    expect(result.targetIndex).toBe(2);
  });
});

describe('Navigator - Jump Navigation', () => {
  it('should jump to target slide by index', () => {
    const nav = createNavigator(10);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, currentSlideIndex: 2 });
    const { result } = nav.handleJump(5);
    
    expect(result.targetIndex).toBe(5);
  });

  it('should jump instantly without transition', () => {
    const nav = createNavigator(10);
    const { result } = nav.handleJump(5);
    
    expect(result.requiresTransition).toBe(false);
  });

  it('should cancel transition when jumping mid-transition', () => {
    const nav = createNavigator(10);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, transitionInProgress: true });
    const { result } = nav.handleJump(5);
    
    expect(result.cancelTransition).toBe(true);
  });

  it('should clamp jump to valid slide range', () => {
    const nav = createNavigator(5);
    const { result } = nav.handleJump(10);
    
    expect(result.targetIndex).toBe(4);
  });
});

describe('Navigator - Quit Behavior', () => {
  it('should quit presentation', () => {
    const nav = createNavigator(5);
    const { result } = nav.handleQuit();
    
    expect(result.direction).toBe('quit');
  });

  it('should cancel transition when quitting mid-transition', () => {
    const nav = createNavigator(5);
    const currentState = nav.getState();
    nav.updateState({ ...currentState, transitionInProgress: true });
    const { result } = nav.handleQuit();
    
    expect(result.cancelTransition).toBe(true);
  });
});
