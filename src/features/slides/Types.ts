export type TransitionName =
  | 'diagonal'
  | 'leftwipe'
  | 'rightwipe'
  | 'topwipe'
  | 'bottomwipe'
  | 'tvon'
  | 'tvoff';

export const TRANSITION_NAMES: [TransitionName, ...TransitionName[]] = [
  'diagonal',
  'leftwipe',
  'rightwipe',
  'topwipe',
  'bottomwipe',
  'tvon',
  'tvoff',
];

export const TRANSITION_NAME_SET: ReadonlySet<string> = new Set(TRANSITION_NAMES);

export interface SlideEntry {
  filename: string;
  beforeTransition: string | null;
  afterTransition: string | null;
  unknownDirectives?: string[];
}

export interface LoadedSlide {
  filename: string;
  content: string;
  beforeTransition: string | null;
  afterTransition: string | null;
}

export interface ValidationError {
  type:
    | 'missing_file'
    | 'invalid_path'
    | 'invalid_transition'
    | 'invalid_directive'
    | 'missing_slides_txt';
  message: string;
  filename?: string;
  line?: number;
}

export interface ValidationResult {
  success: boolean;
  error?: ValidationError;
  entries?: SlideEntry[];
}
