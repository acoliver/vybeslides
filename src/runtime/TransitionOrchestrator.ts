import { createPresentationController } from '../features/presentation/PresentationController';
import type { LoadedSlide } from '../features/slides/Types';
import { createBlankFrame, BLANK_FRAME_DURATION } from '../features/transitions/BlankFrame';
import { getTransition } from '../features/transitions/TransitionRegistry';
import type {
  Transition,
  TransitionFrame,
  TransitionType,
} from '../features/transitions/TransitionTypes';

export type TransitionStepKind = 'before' | 'after' | 'blank';

export interface TransitionStep {
  readonly kind: TransitionStepKind;
  readonly transition: Transition;
}

export interface TransitionPlan {
  readonly steps: TransitionStep[];
  readonly type: 'instant' | 'overlapping' | 'sequential';
}

export interface TransitionOrchestrator {
  buildPlan: (fromIndex: number, toIndex: number, intent: 'navigation' | 'quit') => TransitionPlan;
  getFrame: (
    step: TransitionStep,
    progress: number,
    width: number,
    height: number,
  ) => TransitionFrame;
  getDuration: (step: TransitionStep) => number;
  getBlankDuration: () => number;
}

export function createTransitionOrchestrator(slides: LoadedSlide[]): TransitionOrchestrator {
  const controller = createPresentationController(slides);

  function buildPlan(
    fromIndex: number,
    toIndex: number,
    intent: 'navigation' | 'quit',
  ): TransitionPlan {
    const info = controller.getTransitionForNavigation(fromIndex, toIndex, intent);

    if (info.type === 'instant' || info.transitionName === null) {
      return { steps: [], type: 'instant' };
    }

    if (info.type === 'overlapping') {
      return {
        type: 'overlapping',
        steps: [
          {
            kind: 'before',
            transition: getTransition(info.transitionName as TransitionType),
          },
        ],
      };
    }

    const steps: TransitionStep[] = [
      {
        kind: 'after',
        transition: getTransition(info.transitionName as TransitionType),
      },
    ];

    if (info.hasBlankDelay) {
      steps.push({ kind: 'blank', transition: createBlankFrame() });
    }

    return {
      type: 'sequential',
      steps,
    };
  }

  function getFrame(
    step: TransitionStep,
    progress: number,
    width: number,
    height: number,
  ): TransitionFrame {
    return step.transition.getFrame(progress, width, height);
  }

  function getDuration(step: TransitionStep): number {
    return step.transition.getDuration();
  }

  function getBlankDuration(): number {
    return BLANK_FRAME_DURATION;
  }

  return {
    buildPlan,
    getFrame,
    getDuration,
    getBlankDuration,
  };
}
