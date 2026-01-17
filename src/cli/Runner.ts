import { validatePresentation as validatePresentationCore } from '../features/slides/Validator';

export interface ValidationSuccess {
  success: true;
}

export interface ValidationFailure {
  success: false;
  error: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export async function validatePresentation(directory: string): Promise<ValidationResult> {
  const result = await validatePresentationCore(directory);

  if (!result.success) {
    return {
      success: false,
      error: result.error?.message ?? 'Unknown validation error',
    };
  }

  return {
    success: true,
  };
}
