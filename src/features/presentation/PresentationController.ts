import type { LoadedSlide } from '../slides/Types';

export type TransitionType = 'instant' | 'overlapping' | 'sequential';
export type NavigationIntent = 'navigation' | 'quit';

export interface TransitionInfo {
  type: TransitionType;
  transitionName: string | null;
  hasBlankDelay: boolean;
}

export interface PresentationController {
  getTransitionForNavigation(
    fromIndex: number,
    toIndex: number,
    intent: NavigationIntent,
  ): TransitionInfo;
}

export function createPresentationController(slides: LoadedSlide[]): PresentationController {
  function getTransitionForNavigation(
    fromIndex: number,
    toIndex: number,
    intent: NavigationIntent,
  ): TransitionInfo {
    if (toIndex < 0 || toIndex >= slides.length) {
      return { type: 'instant', transitionName: null, hasBlankDelay: false };
    }

    const nextSlide = slides[toIndex];

    if (fromIndex < 0) {
      if (nextSlide.beforeTransition !== null) {
        return {
          type: 'overlapping',
          transitionName: nextSlide.beforeTransition,
          hasBlankDelay: false,
        };
      }
      return { type: 'instant', transitionName: null, hasBlankDelay: false };
    }

    if (fromIndex === toIndex) {
      const slide = slides[fromIndex];
      if (slide.afterTransition !== null && intent === 'quit') {
        return { type: 'sequential', transitionName: slide.afterTransition, hasBlankDelay: false };
      }
      return { type: 'instant', transitionName: null, hasBlankDelay: false };
    }

    const currentSlide = slides[fromIndex];

    const hasAfter = currentSlide.afterTransition !== null;
    const hasBefore = nextSlide.beforeTransition !== null;

    if (!hasAfter && !hasBefore) {
      return { type: 'instant', transitionName: null, hasBlankDelay: false };
    }

    if (!hasAfter && hasBefore) {
      return {
        type: 'overlapping',
        transitionName: nextSlide.beforeTransition,
        hasBlankDelay: false,
      };
    }

    if (hasAfter && !hasBefore) {
      return {
        type: 'sequential',
        transitionName: currentSlide.afterTransition,
        hasBlankDelay: true,
      };
    }

    return {
      type: 'sequential',
      transitionName: currentSlide.afterTransition,
      hasBlankDelay: true,
    };
  }

  return {
    getTransitionForNavigation,
  };
}
