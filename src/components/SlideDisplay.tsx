import { HeaderBar } from './HeaderBar';
import { FooterBar } from './FooterBar';

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
  return (
    <box style={{ flexDirection: 'column' }}>
      {showHeader && <HeaderBar slideNumber={slideNumber} totalSlides={totalSlides} />}
      <box>
        {children}
      </box>
      {showFooter && <FooterBar />}
    </box>
  );
}
