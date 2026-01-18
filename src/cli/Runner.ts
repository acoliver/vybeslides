import { validatePresentation as validatePresentationCore } from '../features/slides/Validator';
import { loadSlides } from '../features/slides/SlideLoader';
import type { LoadedSlide } from '../features/slides/Types';

export interface RunnerOptions {
  readonly directory: string;
  readonly showHeader: boolean;
  readonly showFooter: boolean;
}

export interface RunnerSuccess {
  success: true;
}

export interface RunnerFailure {
  success: false;
  error: string;
}

export type RunnerResult = RunnerSuccess | RunnerFailure;

export async function runPresentation(options: RunnerOptions): Promise<RunnerResult> {
  const validationResult = await validatePresentationCore(options.directory);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error?.message ?? 'Unknown validation error',
    };
  }

  if (!validationResult.entries) {
    return {
      success: false,
      error: 'No slide entries found',
    };
  }

  const slides = await loadSlides(options.directory, validationResult.entries);

  await startRuntime({
    directory: options.directory,
    showHeader: options.showHeader,
    showFooter: options.showFooter,
    slides,
    title: validationResult.title,
  });

  return {
    success: true,
  };
}

interface StartRuntimeOptions {
  directory: string;
  showHeader: boolean;
  showFooter: boolean;
  slides: LoadedSlide[];
  title?: string | null;
}

async function startRuntime(options: StartRuntimeOptions): Promise<void> {
  const { createCliRenderer } = await import('@vybestack/opentui-core');
  const { createRoot } = await import('@vybestack/opentui-react');
  const { createApp } = await import('../main');

  const renderer = await createCliRenderer({
    useMouse: false,
    exitOnCtrlC: true,
  });
  const root = createRoot(renderer);

  const cleanup = (): void => {
    root.unmount();
    renderer.stop();
    renderer.destroy();
  };

  const app = createApp({
    directory: options.directory,
    showHeader: options.showHeader,
    showFooter: options.showFooter,
    slides: options.slides,
    title: options.title,
    onQuit: cleanup,
  });

  root.render(app);

  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      cleanup();
      resolve();
    });
  });
}
