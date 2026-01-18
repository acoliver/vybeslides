import { validatePresentation as validatePresentationCore } from '../features/slides/Validator';
import { loadSlides } from '../features/slides/SlideLoader';
import type { LoadedSlide } from '../features/slides/Types';
import { parseMarkdown } from '../features/markdown/Parser';
import type { MarkdownElement } from '../features/markdown/Types';

export interface RunnerOptions {
  readonly directory: string;
  readonly showHeader: boolean;
  readonly showFooter: boolean;
  readonly render?: number;
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

  // Headless render mode: render a single slide to stdout and exit
  if (options.render !== undefined) {
    return renderSlideToStdout(slides, options.render, options);
  }

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

interface RenderOptions {
  showHeader: boolean;
  showFooter: boolean;
}

function renderSlideToStdout(
  slides: LoadedSlide[],
  slideIndex: number,
  options: RenderOptions,
): RunnerResult {
  if (slideIndex < 0 || slideIndex >= slides.length) {
    return {
      success: false,
      error: `Slide ${slideIndex} out of range (0-${slides.length - 1})`,
    };
  }

  const slide = slides[slideIndex];
  const totalSlides = slides.length;

  // Simple text rendering of the slide
  const lines: string[] = [];

  if (options.showHeader) {
    lines.push(`[Slide ${slideIndex}/${totalSlides}]`);
    lines.push('');
  }

  const parseResult = parseMarkdown(slide.content);
  for (const element of parseResult.elements) {
    renderElement(element, lines);
    lines.push('');
  }

  process.stdout.write(lines.join('\n') + '\n');

  return { success: true };
}

function renderElement(element: MarkdownElement, lines: string[]): void {
  switch (element.type) {
    case 'header': {
      const prefix = '#'.repeat(element.level) + ' ';
      lines.push(prefix + element.content);
      break;
    }
    case 'paragraph':
      lines.push(element.content);
      break;
    case 'bullet_list':
      for (const item of element.items) {
        lines.push('• ' + item.content);
        if (item.children) {
          for (const child of item.children) {
            lines.push('  - ' + child.content);
          }
        }
      }
      break;
    case 'numbered_list':
      element.items.forEach((item, idx) => {
        lines.push(`${idx + 1}. ${item}`);
      });
      break;
    case 'code_block':
      lines.push('```' + (element.language ?? ''));
      lines.push(element.content);
      lines.push('```');
      break;
    case 'ascii_art':
      lines.push(element.content);
      break;
    case 'table':
      lines.push('| ' + element.headers.join(' | ') + ' |');
      lines.push('|' + element.headers.map(() => '---').join('|') + '|');
      for (const row of element.rows) {
        lines.push('| ' + row.join(' | ') + ' |');
      }
      break;
    case 'blockquote':
      lines.push('> ' + element.content);
      break;
  }
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

  const reloadSlides = async (): Promise<LoadedSlide[]> => {
    const validationResult = await validatePresentationCore(options.directory);
    if (!validationResult.success || !validationResult.entries) {
      return options.slides;
    }
    return loadSlides(options.directory, validationResult.entries);
  };

  const app = createApp({
    directory: options.directory,
    showHeader: options.showHeader,
    showFooter: options.showFooter,
    slides: options.slides,
    title: options.title,
    onQuit: cleanup,
    onReload: reloadSlides,
  });

  root.render(app);

  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      cleanup();
      resolve();
    });
  });
}
