import type { OptimizedBuffer, KeyEvent } from '@vybestack/opentui-core';
import { RGBA } from '@vybestack/opentui-core';
import { useKeyboard, useTimeline } from '@vybestack/opentui-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlideDisplay } from '../components/SlideDisplay';
import { ContentRenderer } from '../components/ContentRenderer';
import { parseMarkdown } from '../features/markdown';
import { createInputHandler } from '../features/navigation/InputHandler';
import type { LoadedSlide } from '../features/slides/Types';
import { applyVisibilityMask, invertVisibilityMask } from '../features/transitions/Masking';
import type { TransitionFrame } from '../features/transitions/TransitionTypes';
import { getTransition } from '../features/transitions/TransitionRegistry';
import type { TransitionType } from '../features/transitions/TransitionTypes';
import { LLXPRT_GREENSCREEN_THEME } from '../core/GreenscreenTheme';
import {
  createNavigationStateMachine,
  type NavigationStateMachine,
  type NavigationState,
} from './NavigationStateMachine';

export interface PresentationRuntimeProps {
  readonly slides: LoadedSlide[];
  readonly showHeader: boolean;
  readonly showFooter: boolean;
  readonly title?: string | null;
  readonly onQuit?: () => void;
  readonly onReload?: () => Promise<LoadedSlide[]>;
}

const inputHandler = createInputHandler();

export function PresentationRuntime({
  slides: initialSlides,
  showHeader,
  showFooter,
  title,
  onQuit,
  onReload,
}: PresentationRuntimeProps): React.ReactNode {
  const [slides, setSlides] = useState<LoadedSlide[]>(initialSlides);
  // Create state machine once
  const machineRef = useRef<NavigationStateMachine | null>(null);
  if (machineRef.current === null) {
    machineRef.current = createNavigationStateMachine(slides);
  }
  const machine = machineRef.current;

  // React state that tracks the machine state
  const [navState, setNavState] = useState<NavigationState>(() => machine.getState());

  // Transition animation state
  const [transitionFrame, setTransitionFrame] = useState<TransitionFrame | null>(null);
  const bufferWidthRef = useRef(80);
  const bufferHeightRef = useRef(24);
  const animatedState = useMemo(() => ({ progress: 0 }), []);

  const timeline = useTimeline({ duration: 800, autoplay: false });

  // Dispatch and sync state
  const dispatch = useCallback(
    (event: Parameters<typeof machine.dispatch>[0]) => {
      machine.dispatch(event);
      setNavState({ ...machine.getState() });
    },
    [machine],
  );

  // Get current transition object
  const getCurrentTransition = useCallback(() => {
    const state = machine.getState();
    if (!state.transitionName) return null;
    try {
      return getTransition(state.transitionName as TransitionType);
    } catch {
      return null;
    }
  }, [machine]);

  // Update transition frame during animation
  const updateTransitionFrame = useCallback(
    (progress: number) => {
      const transition = getCurrentTransition();
      if (!transition) return;

      const frame = transition.getFrame(progress, bufferWidthRef.current, bufferHeightRef.current);
      setTransitionFrame(frame);
    },
    [getCurrentTransition],
  );

  // Handle transition completion
  const onTransitionComplete = useCallback(() => {
    dispatch({ type: 'TRANSITION_COMPLETE' });
    setTransitionFrame(null);
  }, [dispatch]);

  // Start animation when transition begins
  useEffect(() => {
    if (navState.isTransitioning && navState.transitionName) {
      const transition = getCurrentTransition();
      if (transition) {
        timeline.duration = transition.getDuration();
        animatedState.progress = 0;
        timeline.restart();
        timeline.play();
      }
    }
  }, [navState.isTransitioning, navState.transitionName, timeline, getCurrentTransition]);

  // Setup timeline animation
  useEffect(() => {
    if (timeline.items.length === 0) {
      timeline.add(
        animatedState,
        {
          progress: 100,
          duration: 800,
          ease: 'linear',
          onUpdate: (anim) => {
            updateTransitionFrame(anim.progress);
          },
          onComplete: () => {
            onTransitionComplete();
          },
        },
        0,
      );
    }
  }, [timeline, animatedState, updateTransitionFrame, onTransitionComplete]);

  // Handle keyboard input
  useKeyboard((key: KeyEvent) => {
    if (key.eventType !== 'press') {
      return;
    }
    const keyName = key.name ?? key.sequence;
    const parse = inputHandler.parseKey(keyName);
    const action = parse.result.action;

    if (action === 'forward') {
      key.preventDefault();
      dispatch({ type: 'FORWARD' });
      return;
    }
    if (action === 'backward') {
      key.preventDefault();
      dispatch({ type: 'BACKWARD' });
      return;
    }
    if (action === 'jump' && parse.result.jumpIndex !== undefined) {
      key.preventDefault();
      dispatch({ type: 'JUMP', index: parse.result.jumpIndex });
      return;
    }
    if (action === 'quit') {
      key.preventDefault();
      dispatch({
        type: 'QUIT',
        onQuit: () => {
          if (onQuit) {
            onQuit();
          }
          process.exit(0);
        },
      });
      return;
    }
    if (action === 'reload') {
      key.preventDefault();
      dispatch({ type: 'RELOAD' });
      return;
    }
  });

  // Handle reload request
  useEffect(() => {
    if (navState.reloadRequested && onReload) {
      onReload()
        .then((newSlides) => {
          setSlides(newSlides);
          dispatch({ type: 'RELOAD_ACKNOWLEDGED' });
        })
        .catch(() => {
          dispatch({ type: 'RELOAD_ACKNOWLEDGED' });
        });
    }
  }, [navState.reloadRequested, onReload, dispatch]);

  // Get slide to display
  const slide = slides[navState.displayIndex];
  const parseResult = parseMarkdown(slide.content);

  // Render callbacks for transition effects
  const renderBefore = useCallback(
    (buffer: OptimizedBuffer, _deltaTime: number) => {
      bufferWidthRef.current = buffer.width;
      bufferHeightRef.current = buffer.height;

      if (!navState.isTransitioning || !transitionFrame) {
        return;
      }

      // "before" transition: new slide is being revealed (mask hides parts of new slide)
      if (navState.transitionType === 'before') {
        applyVisibilityMask(buffer, transitionFrame.mask, RGBA.fromHex('#000000'));
      }
    },
    [navState.isTransitioning, navState.transitionType, transitionFrame],
  );

  const renderAfter = useCallback(
    (buffer: OptimizedBuffer, _deltaTime: number) => {
      bufferWidthRef.current = buffer.width;
      bufferHeightRef.current = buffer.height;

      if (!navState.isTransitioning || !transitionFrame) {
        return;
      }

      // "after" transition: old slide is being hidden (mask reveals what's behind)
      if (navState.transitionType === 'after') {
        applyVisibilityMask(
          buffer,
          invertVisibilityMask(transitionFrame.mask),
          RGBA.fromHex('#000000'),
        );
      }
    },
    [navState.isTransitioning, navState.transitionType, transitionFrame],
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
        slideNumber={navState.displayIndex}
        totalSlides={slides.length}
        title={title}
      >
        <ContentRenderer elements={parseResult.elements} />
      </SlideDisplay>
    </box>
  );
}
