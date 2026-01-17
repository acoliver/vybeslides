export type NavigationDirection = 'forward' | 'backward' | 'jump' | 'stay' | 'quit';

export interface NavigationState {
  currentSlideIndex: number;
  totalSlides: number;
  transitionInProgress: boolean;
  jumpMode: boolean;
  jumpBuffer: string;
}

export interface NavigationResult {
  direction: NavigationDirection;
  targetIndex: number;
  cancelTransition: boolean;
  requiresTransition: boolean;
  transitionName: string | null;
  hasBlankDelay: boolean;
}
