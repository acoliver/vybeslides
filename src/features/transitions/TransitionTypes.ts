export type VisibilityMask = boolean[][];

export interface TransitionFrame {
  progress: number;
  mask: VisibilityMask;
  isComplete: boolean;
}

export interface Transition {
  getFrame(progress: number, width: number, height: number): TransitionFrame;
  getDuration(): number;
}

export type TransitionType =
  | 'diagonal'
  | 'leftwipe'
  | 'rightwipe'
  | 'topwipe'
  | 'bottomwipe'
  | 'tvon'
  | 'tvoff';
