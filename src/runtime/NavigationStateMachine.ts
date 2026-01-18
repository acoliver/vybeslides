import type { LoadedSlide } from '../features/slides/Types';

export interface NavigationState {
  /** The confirmed current slide index (after any transition completes) */
  currentIndex: number;
  /** The slide index we're transitioning TO, if any */
  targetIndex: number | null;
  /** Whether a transition is in progress */
  isTransitioning: boolean;
  /** The index to display/render (may differ from currentIndex during transition) */
  displayIndex: number;
  /** Whether quit is pending after transition completes */
  quitPending: boolean;
  /** Callback to execute on quit */
  onQuitCallback: (() => void) | null;
  /** Type of current transition */
  transitionType: 'before' | 'after' | null;
  /** Name of the transition */
  transitionName: string | null;
}

export type NavigationEvent =
  | { type: 'FORWARD' }
  | { type: 'BACKWARD' }
  | { type: 'JUMP'; index: number }
  | { type: 'QUIT'; onQuit?: () => void }
  | { type: 'TRANSITION_COMPLETE' }
  | { type: 'CANCEL_TRANSITION' };

export interface NavigationStateMachine {
  getState(): NavigationState;
  dispatch(event: NavigationEvent): void;
}

function createInitialState(): NavigationState {
  return {
    currentIndex: 0,
    targetIndex: null,
    isTransitioning: false,
    displayIndex: 0,
    quitPending: false,
    onQuitCallback: null,
    transitionType: null,
    transitionName: null,
  };
}

function createClearedTransitionState(state: NavigationState, newIndex: number): NavigationState {
  return {
    ...state,
    currentIndex: newIndex,
    targetIndex: null,
    isTransitioning: false,
    displayIndex: newIndex,
    transitionType: null,
    transitionName: null,
    quitPending: false,
    onQuitCallback: null,
  };
}

interface TransitionInfo {
  type: 'before' | 'after' | null;
  name: string | null;
}

function getSlideAt(slides: LoadedSlide[], index: number): LoadedSlide | null {
  return index >= 0 && index < slides.length ? slides[index] : null;
}

function getTransitionInfo(
  slides: LoadedSlide[],
  fromIndex: number,
  toIndex: number,
): TransitionInfo {
  if (toIndex < 0 || toIndex >= slides.length) {
    return { type: null, name: null };
  }

  const currentSlide = getSlideAt(slides, fromIndex);
  const nextSlide = getSlideAt(slides, toIndex);
  const currentAfter = currentSlide ? currentSlide.afterTransition : null;
  const nextBefore = nextSlide ? nextSlide.beforeTransition : null;

  if (currentAfter) {
    return { type: 'after', name: currentAfter };
  }

  if (nextBefore) {
    return { type: 'before', name: nextBefore };
  }

  return { type: null, name: null };
}

function handleForwardDuringTransition(
  state: NavigationState,
  totalSlides: number,
): NavigationState {
  const newTarget = Math.max(
    0,
    Math.min((state.targetIndex ?? state.currentIndex) + 1, totalSlides - 1),
  );
  return createClearedTransitionState(state, newTarget);
}

function handleForwardInstant(state: NavigationState, targetIndex: number): NavigationState {
  return {
    ...state,
    currentIndex: targetIndex,
    displayIndex: targetIndex,
  };
}

function handleForwardWithBefore(
  state: NavigationState,
  targetIndex: number,
  transitionName: string,
): NavigationState {
  return {
    ...state,
    targetIndex,
    isTransitioning: true,
    displayIndex: targetIndex,
    transitionType: 'before',
    transitionName,
  };
}

function handleForwardWithAfter(
  state: NavigationState,
  targetIndex: number,
  transitionName: string,
): NavigationState {
  return {
    ...state,
    targetIndex,
    isTransitioning: true,
    displayIndex: state.currentIndex,
    transitionType: 'after',
    transitionName,
  };
}

function handleBackward(state: NavigationState): NavigationState {
  const targetIndex = Math.max(0, state.currentIndex - 1);
  return {
    ...state,
    currentIndex: targetIndex,
    displayIndex: targetIndex,
  };
}

function handleQuitWithTransition(
  state: NavigationState,
  transitionName: string,
  onQuit?: () => void,
): NavigationState {
  return {
    ...state,
    isTransitioning: true,
    quitPending: true,
    onQuitCallback: onQuit ?? null,
    transitionType: 'after',
    transitionName,
  };
}

function handleTransitionComplete(state: NavigationState): NavigationState {
  if (state.quitPending) {
    if (state.onQuitCallback) {
      state.onQuitCallback();
    }
    return {
      ...state,
      isTransitioning: false,
      quitPending: false,
      onQuitCallback: null,
      transitionType: null,
      transitionName: null,
    };
  }

  const newIndex = state.targetIndex ?? state.currentIndex;
  return createClearedTransitionState(state, newIndex);
}

export function createNavigationStateMachine(slides: LoadedSlide[]): NavigationStateMachine {
  const totalSlides = slides.length;
  let state: NavigationState = createInitialState();

  function clamp(index: number): number {
    return Math.max(0, Math.min(index, totalSlides - 1));
  }

  function dispatch(event: NavigationEvent): void {
    switch (event.type) {
      case 'FORWARD': {
        if (state.isTransitioning) {
          state = handleForwardDuringTransition(state, totalSlides);
          return;
        }

        const targetIndex = state.currentIndex + 1;
        if (targetIndex >= totalSlides) {
          return;
        }

        const transitionInfo = getTransitionInfo(slides, state.currentIndex, targetIndex);

        if (transitionInfo.type === null) {
          state = handleForwardInstant(state, targetIndex);
        } else if (transitionInfo.type === 'before' && transitionInfo.name) {
          state = handleForwardWithBefore(state, targetIndex, transitionInfo.name);
        } else if (transitionInfo.name) {
          state = handleForwardWithAfter(state, targetIndex, transitionInfo.name);
        }
        break;
      }

      case 'BACKWARD': {
        if (state.isTransitioning) {
          const newIndex = Math.max(0, state.currentIndex - 1);
          state = createClearedTransitionState(state, newIndex);
          return;
        }
        state = handleBackward(state);
        break;
      }

      case 'JUMP': {
        const targetIndex = clamp(event.index);
        state = createClearedTransitionState(state, targetIndex);
        break;
      }

      case 'QUIT': {
        const quitSlide = getSlideAt(slides, state.currentIndex);
        const afterTransition = quitSlide ? quitSlide.afterTransition : null;
        if (afterTransition) {
          state = handleQuitWithTransition(state, afterTransition, event.onQuit);
        } else if (event.onQuit) {
          event.onQuit();
        }
        break;
      }

      case 'TRANSITION_COMPLETE': {
        if (state.isTransitioning) {
          state = handleTransitionComplete(state);
        }
        break;
      }

      case 'CANCEL_TRANSITION': {
        if (state.isTransitioning) {
          state = createClearedTransitionState(state, state.currentIndex);
        }
        break;
      }
    }
  }

  return {
    getState: () => state,
    dispatch,
  };
}
