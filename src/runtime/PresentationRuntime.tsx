import type { OptimizedBuffer, KeyEvent } from '@vybestack/opentui-core';
import { RGBA } from '@vybestack/opentui-core';
import { useKeyboard, useTimeline } from '@vybestack/opentui-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { SlideDisplay } from '../components/SlideDisplay';
import { ContentRenderer } from '../components/ContentRenderer';
import { parseMarkdown } from '../features/markdown';
import { createNavigator } from '../features/navigation/Navigator';
import { createInputHandler } from '../features/navigation/InputHandler';
import type { LoadedSlide } from '../features/slides/Types';
import { createTransitionOrchestrator } from './TransitionOrchestrator';
import { applyVisibilityMask, invertVisibilityMask } from '../features/transitions/Masking';
import type { TransitionFrame } from '../features/transitions/TransitionTypes';
import type { TransitionStepKind } from './TransitionOrchestrator';
import { createCancelTransitionHandler } from './TransitionCancel';
import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';

export interface PresentationRuntimeProps {
  readonly slides: LoadedSlide[];
  readonly showHeader: boolean;
  readonly showFooter: boolean;
  readonly onQuit?: () => void;
}

interface RenderState {
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly intent: 'navigation' | 'quit';
}

const inputHandler = createInputHandler();

export function PresentationRuntime({
  slides,
  showHeader,
  showFooter,
  onQuit,
}: PresentationRuntimeProps): React.ReactNode {
  const navigator = useMemo(() => createNavigator(slides.length), [slides.length]);
  const orchestrator = useMemo(() => createTransitionOrchestrator(slides), [slides]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionActive, setTransitionActive] = useState(false);
  const [renderState, setRenderState] = useState<RenderState>({
    fromIndex: 0,
    toIndex: 0,
    intent: 'navigation',
  });
  const [transitionFrame, setTransitionFrame] = useState<TransitionFrame | null>(null);
  const [transitionKind, setTransitionKind] = useState<TransitionStepKind | null>(null);
  const transitionStepRef = useRef(0);
  const bufferWidthRef = useRef(1);
  const bufferHeightRef = useRef(1);
  const animatedState = useMemo(() => ({ progress: 0 }), []);

  const timeline = useTimeline({ duration: 1000, autoplay: false });

  const updateTransition = useCallback(
    (progress: number) => {
      const plan = orchestrator.buildPlan(
        renderState.fromIndex,
        renderState.toIndex,
        renderState.intent,
      );
      const step = plan.steps[transitionStepRef.current];
      if (!step) {
        return;
      }
      const frame = orchestrator.getFrame(
        step,
        progress,
        bufferWidthRef.current,
        bufferHeightRef.current,
      );
      setTransitionFrame(frame);
      setTransitionKind(step.kind);
      timeline.duration = orchestrator.getDuration(step);
    },
    [orchestrator, renderState],
  );

  const advanceStep = useCallback(() => {
    const plan = orchestrator.buildPlan(
      renderState.fromIndex,
      renderState.toIndex,
      renderState.intent,
    );
    const nextIndex = transitionStepRef.current + 1;
    if (nextIndex >= plan.steps.length) {
      setTransitionActive(false);
      setTransitionFrame(null);
      setTransitionKind(null);
      setCurrentIndex(renderState.toIndex);
      return;
    }
    transitionStepRef.current = nextIndex;
    const step = plan.steps[nextIndex];
    setTransitionKind(step.kind);
    timeline.restart();
    timeline.play();
  }, [orchestrator, renderState, timeline]);

  const startTransition = useCallback(
    (fromIndex: number, toIndex: number, intent: 'navigation' | 'quit') => {
      const plan = orchestrator.buildPlan(fromIndex, toIndex, intent);
      if (plan.steps.length === 0) {
        setCurrentIndex(toIndex);
        return;
      }

      setTransitionActive(true);
      setRenderState({ fromIndex, toIndex, intent });
      transitionStepRef.current = 0;
      const firstStep = plan.steps[0];
      setTransitionKind(firstStep?.kind ?? null);
      timeline.restart();
      timeline.play();
    },
    [orchestrator, timeline],
  );

  const cancelTransition = useCallback(() => {
    const result = createCancelTransitionHandler({
      transitionActive,
      transitionFrame,
      transitionKind,
      renderState: { fromIndex: renderState.fromIndex, toIndex: renderState.toIndex },
    });

    setTransitionActive(result.transitionActive);
    setTransitionFrame(result.transitionFrame);
    setTransitionKind(result.transitionKind);
    setCurrentIndex(result.currentIndex);
  }, [renderState, transitionActive, transitionFrame, transitionKind]);

  const clampIndex = useCallback(
    (index: number): number => Math.max(0, Math.min(index, slides.length - 1)),
    [slides.length],
  );

  useKeyboard((key: KeyEvent) => {
    if (key.eventType !== 'press') {
      return;
    }
    const keyName = key.name ?? key.sequence;
    const parse = inputHandler.parseKey(keyName);
    const action = parse.result.action;

    if (transitionActive) {
      cancelTransition();
      if (action === 'backward') {
        const targetIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(targetIndex);
      } else if (action === 'forward') {
        const targetIndex = Math.min(slides.length - 1, currentIndex + 1);
        if (targetIndex !== currentIndex) {
          setCurrentIndex(targetIndex);
        }
      } else if (action === 'jump' && parse.result.jumpIndex !== undefined) {
        setCurrentIndex(clampIndex(parse.result.jumpIndex));
      }
      return;
    }

    if (action === 'forward') {
      key.preventDefault();
      const targetIndex = currentIndex + 1;
      if (targetIndex < slides.length) {
        setCurrentIndex(targetIndex);
      }
      return;
    }
    if (action === 'backward') {
      key.preventDefault();
      const targetIndex = Math.max(0, currentIndex - 1);
      setCurrentIndex(targetIndex);
      return;
    }
    if (action === 'jump' && parse.result.jumpIndex !== undefined) {
      key.preventDefault();
      setCurrentIndex(clampIndex(parse.result.jumpIndex));
      return;
    }
    if (action === 'quit') {
      key.preventDefault();
      if (onQuit) {
        onQuit();
      }
      process.exit(0);
    }
  });

  if (timeline.items.length === 0) {
    timeline.add(
      animatedState,
      {
        progress: 100,
        duration: 1000,
        ease: 'linear',
        onUpdate: (anim) => {
          updateTransition(anim.progress);
        },
        onComplete: () => {
          advanceStep();
        },
      },
      0,
    );
  }

  const slide = slides[currentIndex];
  const parseResult = parseMarkdown(slide.content);

  const renderBefore = useCallback(
    (buffer: OptimizedBuffer, _deltaTime: number) => {
      bufferWidthRef.current = buffer.width;
      bufferHeightRef.current = buffer.height;
      if (!transitionActive || !transitionFrame || transitionKind !== 'before') {
        return;
      }
      applyVisibilityMask(buffer, transitionFrame.mask, RGBA.fromHex('#000000'));
    },
    [transitionActive, transitionFrame, transitionKind],
  );

  const renderAfter = useCallback(
    (buffer: OptimizedBuffer, _deltaTime: number) => {
      bufferWidthRef.current = buffer.width;
      bufferHeightRef.current = buffer.height;
      if (!transitionActive || !transitionFrame) {
        return;
      }
      if (transitionKind === 'after' || transitionKind === 'blank') {
        applyVisibilityMask(
          buffer,
          invertVisibilityMask(transitionFrame.mask),
          RGBA.fromHex('#000000'),
        );
      }
    },
    [transitionActive, transitionFrame, transitionKind],
  );

  const bg = LLXPRT_GREENSCREEN_THEME.colors.background;

  return (
    <box
      buffered
      renderBefore={renderBefore}
      renderAfter={renderAfter}
      style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: bg }}
    >
      <SlideDisplay
        showHeader={showHeader}
        showFooter={showFooter}
        slideNumber={currentIndex + 1}
        totalSlides={slides.length}
      >
        <ContentRenderer elements={parseResult.elements} />
      </SlideDisplay>
    </box>
  );
}
