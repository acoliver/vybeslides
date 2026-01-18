import type React from 'react';
import { PresentationRuntime } from './runtime/PresentationRuntime';
import type { LoadedSlide } from './features/slides/Types';

export interface AppOptions {
  directory: string;
  showHeader: boolean;
  showFooter: boolean;
  slides: LoadedSlide[];
  title?: string | null;
  onQuit?: () => void;
}

export function createApp(options: AppOptions): React.ReactNode {
  return (
    <PresentationRuntime
      slides={options.slides}
      showHeader={options.showHeader}
      showFooter={options.showFooter}
      title={options.title}
      onQuit={options.onQuit}
    />
  );
}
