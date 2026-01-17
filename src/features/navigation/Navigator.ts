import type { NavigationState, NavigationResult, NavigationDirection } from './Types';

export interface Navigator {
  getState(): NavigationState;
  handleForward(): { result: NavigationResult; newState: NavigationState };
  handleBackward(): { result: NavigationResult; newState: NavigationState };
  handleQuit(): { result: NavigationResult; newState: NavigationState };
  handleJump(index: number): { result: NavigationResult; newState: NavigationState };
  handleKey(key: string): { result: NavigationResult; newState: NavigationState };
  updateState(newState: NavigationState): void;
}

interface NavigationHelpers {
  getState: () => NavigationState;
  createResult: (
    direction: NavigationDirection,
    targetIndex: number,
    cancelTransition: boolean,
  ) => NavigationResult;
  handleNavigation: (
    direction: NavigationDirection,
    explicitTarget?: number,
  ) => { result: NavigationResult; newState: NavigationState };
}

export function createNavigator(totalSlides: number): Navigator {
  let state: NavigationState = {
    currentSlideIndex: 0,
    totalSlides,
    transitionInProgress: false,
    jumpMode: false,
    jumpBuffer: '',
  };

  function getState(): NavigationState {
    return { ...state };
  }

  function updateState(newState: NavigationState): void {
    state = { ...newState };
  }

  function createResult(
    direction: NavigationDirection,
    targetIndex: number,
    cancelTransition: boolean,
  ): NavigationResult {
    return {
      direction,
      targetIndex,
      cancelTransition,
      requiresTransition: false,
      transitionName: null,
      hasBlankDelay: false,
    };
  }

  const helpers: NavigationHelpers = {
    getState,
    createResult,
    handleNavigation: (direction, explicitTarget) =>
      handleNavigation(state, helpers, direction, explicitTarget),
  };

  return {
    getState,
    updateState,
    handleForward: () => helpers.handleNavigation('forward'),
    handleBackward: () => helpers.handleNavigation('backward'),
    handleQuit: () => helpers.handleNavigation('quit'),
    handleJump: (index) => {
      const targetIndex = Math.max(0, Math.min(index, state.totalSlides - 1));
      return helpers.handleNavigation('jump', targetIndex);
    },
    handleKey: (key) => {
      if (key === 'Escape') {
        return helpers.handleNavigation('stay');
      }
      return helpers.handleNavigation('stay');
    },
  };
}

function handleNavigation(
  state: NavigationState,
  helpers: NavigationHelpers,
  direction: NavigationDirection,
  explicitTarget?: number,
): { result: NavigationResult; newState: NavigationState } {
  const cancelTransition = state.transitionInProgress;
  const currentIndex = state.currentSlideIndex;

  if (direction === 'forward') {
    return handleForwardNavigation(state, helpers, currentIndex, cancelTransition);
  }

  if (direction === 'backward') {
    return handleBackwardNavigation(helpers, state, currentIndex, cancelTransition);
  }

  if (direction === 'jump' && explicitTarget !== undefined) {
    return handleJumpNavigation(helpers, state, explicitTarget, cancelTransition);
  }

  if (direction === 'quit') {
    return handleQuitNavigation(helpers, state, currentIndex, cancelTransition);
  }

  return handleStayNavigation(helpers, state, currentIndex, cancelTransition);
}

function handleForwardNavigation(
  state: NavigationState,
  helpers: NavigationHelpers,
  currentIndex: number,
  cancelTransition: boolean,
): { result: NavigationResult; newState: NavigationState } {
  const isLastSlide = currentIndex >= state.totalSlides - 1;
  if (isLastSlide) {
    return {
      result: helpers.createResult('stay', currentIndex, cancelTransition),
      newState: { ...state },
    };
  }
  return {
    result: helpers.createResult('forward', currentIndex + 1, cancelTransition),
    newState: { ...state },
  };
}

function handleBackwardNavigation(
  helpers: NavigationHelpers,
  state: NavigationState,
  currentIndex: number,
  cancelTransition: boolean,
): { result: NavigationResult; newState: NavigationState } {
  const targetIndex = Math.max(0, currentIndex - 1);
  return {
    result: helpers.createResult('backward', targetIndex, cancelTransition),
    newState: { ...state },
  };
}

function handleJumpNavigation(
  helpers: NavigationHelpers,
  state: NavigationState,
  targetIndex: number,
  cancelTransition: boolean,
): { result: NavigationResult; newState: NavigationState } {
  return {
    result: helpers.createResult('jump', targetIndex, cancelTransition),
    newState: { ...state },
  };
}

function handleQuitNavigation(
  helpers: NavigationHelpers,
  state: NavigationState,
  currentIndex: number,
  cancelTransition: boolean,
): { result: NavigationResult; newState: NavigationState } {
  return {
    result: helpers.createResult('quit', currentIndex, cancelTransition),
    newState: { ...state },
  };
}

function handleStayNavigation(
  helpers: NavigationHelpers,
  state: NavigationState,
  currentIndex: number,
  cancelTransition: boolean,
): { result: NavigationResult; newState: NavigationState } {
  return {
    result: helpers.createResult('stay', currentIndex, cancelTransition),
    newState: { ...state },
  };
}
