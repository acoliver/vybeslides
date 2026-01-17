import type React from 'react';
import { SlideDisplay } from './components/SlideDisplay';

export interface AppOptions {
  directory: string;
  showHeader: boolean;
  showFooter: boolean;
}

export function createApp(options: AppOptions): React.ReactNode {
  return (
    <SlideDisplay
      showHeader={options.showHeader}
      showFooter={options.showFooter}
      slideNumber={1}
      totalSlides={1}
    >
      <box>Starting presentation...</box>
    </SlideDisplay>
  );
}
