import { HeaderBar } from './HeaderBar';
import { FooterBar } from './FooterBar';
import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';

export interface SlideDisplayProps {
  readonly children: React.ReactNode;
  readonly showHeader?: boolean;
  readonly showFooter?: boolean;
  readonly slideNumber?: number;
  readonly totalSlides?: number;
}

export function SlideDisplay({
  children,
  showHeader = false,
  showFooter = false,
  slideNumber = 1,
  totalSlides = 1,
}: SlideDisplayProps): React.ReactNode {
  const bg = LLXPRT_GREENSCREEN_THEME.colors.background;

  return (
    <box style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: bg }}>
      {showHeader && <HeaderBar slideNumber={slideNumber} totalSlides={totalSlides} />}
      <box style={{ flexGrow: 1, padding: 1 }}>
        {children}
      </box>
      {showFooter && <FooterBar />}
    </box>
  );
}
