import { describe, it, expect, vi } from 'vitest';
import { createNavigationStateMachine } from './NavigationStateMachine';

describe('NavigationStateMachine', () => {
  const mockSlides = [
    {
      filename: 'slide1.md',
      content: '# Slide 1',
      beforeTransition: 'tvon',
      afterTransition: null,
    },
    {
      filename: 'slide2.md',
      content: '# Slide 2',
      beforeTransition: 'diagonal',
      afterTransition: null,
    },
    {
      filename: 'slide3.md',
      content: '# Slide 3',
      beforeTransition: null,
      afterTransition: 'tvoff',
    },
  ];

  describe('initial state', () => {
    it('should start at slide index 0', () => {
      const machine = createNavigationStateMachine(mockSlides);
      expect(machine.getState().currentIndex).toBe(0);
    });

    it('should not be in transition initially', () => {
      const machine = createNavigationStateMachine(mockSlides);
      expect(machine.getState().isTransitioning).toBe(false);
    });
  });

  describe('forward navigation without transitions', () => {
    const slidesNoTransitions = [
      {
        filename: 'slide1.md',
        content: '# Slide 1',
        beforeTransition: null,
        afterTransition: null,
      },
      {
        filename: 'slide2.md',
        content: '# Slide 2',
        beforeTransition: null,
        afterTransition: null,
      },
    ];

    it('should move to next slide immediately when no transitions defined', () => {
      const machine = createNavigationStateMachine(slidesNoTransitions);
      machine.dispatch({ type: 'FORWARD' });
      expect(machine.getState().currentIndex).toBe(1);
    });

    it('should not be transitioning after instant navigation', () => {
      const machine = createNavigationStateMachine(slidesNoTransitions);
      machine.dispatch({ type: 'FORWARD' });
      expect(machine.getState().isTransitioning).toBe(false);
    });
  });

  describe('forward navigation with before transition', () => {
    it('should start transition when next slide has before transition', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'FORWARD' });
      expect(machine.getState().isTransitioning).toBe(true);
    });

    it('should set target index during transition', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'FORWARD' });
      expect(machine.getState().targetIndex).toBe(1);
    });

    it('should keep current index at 0 during transition', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'FORWARD' });
      // During overlapping transition, we show the NEW slide being revealed
      // so currentIndex should already be the target
      expect(machine.getState().displayIndex).toBe(1);
    });

    it('should complete transition and update currentIndex', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'FORWARD' });
      machine.dispatch({ type: 'TRANSITION_COMPLETE' });
      expect(machine.getState().currentIndex).toBe(1);
      expect(machine.getState().isTransitioning).toBe(false);
    });
  });

  describe('backward navigation', () => {
    it('should move back instantly (no transitions on backward)', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'FORWARD' });
      machine.dispatch({ type: 'TRANSITION_COMPLETE' });
      expect(machine.getState().currentIndex).toBe(1);

      machine.dispatch({ type: 'BACKWARD' });
      expect(machine.getState().currentIndex).toBe(0);
      expect(machine.getState().isTransitioning).toBe(false);
    });

    it('should not go below 0', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'BACKWARD' });
      expect(machine.getState().currentIndex).toBe(0);
    });
  });

  describe('navigation during transition', () => {
    it('should cancel transition and jump on backward during transition', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'FORWARD' }); // Start transition to slide 1
      expect(machine.getState().isTransitioning).toBe(true);

      machine.dispatch({ type: 'BACKWARD' }); // Cancel and go back
      expect(machine.getState().isTransitioning).toBe(false);
      expect(machine.getState().currentIndex).toBe(0);
    });

    it('should cancel transition and jump on forward during transition', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'FORWARD' }); // Start transition to slide 1
      machine.dispatch({ type: 'FORWARD' }); // Cancel and go to slide 2

      expect(machine.getState().isTransitioning).toBe(false);
      expect(machine.getState().currentIndex).toBe(2);
    });
  });

  describe('boundary conditions', () => {
    it('should not go past last slide', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'JUMP', index: 2 });
      machine.dispatch({ type: 'FORWARD' });
      expect(machine.getState().currentIndex).toBe(2);
    });
  });

  describe('jump navigation', () => {
    it('should jump to specific slide instantly', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'JUMP', index: 2 });
      expect(machine.getState().currentIndex).toBe(2);
      expect(machine.getState().isTransitioning).toBe(false);
    });

    it('should clamp jump index to valid range', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'JUMP', index: 100 });
      expect(machine.getState().currentIndex).toBe(2); // last slide
    });
  });

  describe('quit with after transition', () => {
    it('should trigger after transition on quit if slide has one', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'JUMP', index: 2 }); // Go to slide with after:tvoff

      const onQuit = vi.fn();
      machine.dispatch({ type: 'QUIT', onQuit });

      expect(machine.getState().isTransitioning).toBe(true);
      expect(machine.getState().quitPending).toBe(true);
    });

    it('should call onQuit after transition completes', () => {
      const machine = createNavigationStateMachine(mockSlides);
      machine.dispatch({ type: 'JUMP', index: 2 });

      const onQuit = vi.fn();
      machine.dispatch({ type: 'QUIT', onQuit });
      machine.dispatch({ type: 'TRANSITION_COMPLETE' });

      expect(onQuit).toHaveBeenCalled();
    });

    it('should quit immediately if no after transition', () => {
      const machine = createNavigationStateMachine(mockSlides);
      // Slide 0 has no after transition

      const onQuit = vi.fn();
      machine.dispatch({ type: 'QUIT', onQuit });

      expect(onQuit).toHaveBeenCalled();
      expect(machine.getState().isTransitioning).toBe(false);
    });
  });
});
