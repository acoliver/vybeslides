import type { TransitionStepKind } from './TransitionOrchestrator';
import type { TransitionFrame } from '../features/transitions/TransitionTypes';

export interface TransitionCancelState {
  readonly transitionActive: boolean;
  readonly transitionFrame: TransitionFrame | null;
  readonly transitionKind: TransitionStepKind | null;
  readonly renderState: {
    readonly fromIndex: number;
    readonly toIndex: number;
  };
}

export interface TransitionCancelResult {
  readonly currentIndex: number;
  readonly transitionActive: boolean;
  readonly transitionFrame: TransitionFrame | null;
  readonly transitionKind: TransitionStepKind | null;
}

export function createCancelTransitionHandler(
  state: TransitionCancelState,
): TransitionCancelResult {
  if (!state.transitionActive) {
    return {
      currentIndex: state.renderState.toIndex,
      transitionActive: false,
      transitionFrame: state.transitionFrame,
      transitionKind: state.transitionKind,
    };
  }

  if (state.transitionKind === 'before') {
    return {
      currentIndex: state.renderState.fromIndex,
      transitionActive: false,
      transitionFrame: null,
      transitionKind: null,
    };
  }

  return {
    currentIndex: state.renderState.toIndex,
    transitionActive: false,
    transitionFrame: null,
    transitionKind: null,
  };
}
