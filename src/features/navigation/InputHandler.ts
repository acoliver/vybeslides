export type InputAction =
  | 'forward'
  | 'backward'
  | 'quit'
  | 'cancel'
  | 'jump'
  | 'jump_mode'
  | 'help'
  | 'unknown';

export interface KeyParseResult {
  action: InputAction;
  jumpIndex?: number;
}

export interface InputHandlerState {
  jumpMode: boolean;
  jumpBuffer: string;
}

export interface InputHandler {
  state: InputHandlerState;
  parseKey(key: string): { result: KeyParseResult; newState: InputHandlerState };
  reset(): InputHandlerState;
}

const FORWARD_KEYS = new Set(['n', 'right', 'space', 'pagedown', 'down']);
const BACKWARD_KEYS = new Set(['p', 'left', 'pageup', 'up']);
const QUIT_KEYS = new Set(['q']);
const DIGIT_KEYS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export function createInputHandler(): InputHandler {
  let state: InputHandlerState = {
    jumpMode: false,
    jumpBuffer: '',
  };

  function parseKey(key: string): { result: KeyParseResult; newState: InputHandlerState } {
    if (FORWARD_KEYS.has(key)) {
      return { result: { action: 'forward' }, newState: state };
    }

    if (BACKWARD_KEYS.has(key)) {
      return { result: { action: 'backward' }, newState: state };
    }

    if (QUIT_KEYS.has(key)) {
      return { result: { action: 'quit' }, newState: state };
    }

    if (key === 'escape') {
      return { result: { action: 'cancel' }, newState: state };
    }

    if (key === '?') {
      return { result: { action: 'help' }, newState: state };
    }

    if (key === ':') {
      const newState: InputHandlerState = {
        jumpMode: true,
        jumpBuffer: '',
      };
      state = newState;
      return { result: { action: 'jump_mode' }, newState };
    }

    if (DIGIT_KEYS.has(key)) {
      if (state.jumpMode) {
        const newBuffer = state.jumpBuffer + key;
        const index = parseInt(newBuffer, 10);
        const newState: InputHandlerState = {
          jumpMode: state.jumpMode,
          jumpBuffer: newBuffer,
        };
        state = newState;
        return { result: { action: 'jump', jumpIndex: index }, newState };
      }
      const index = parseInt(key, 10);
      return { result: { action: 'jump', jumpIndex: index }, newState: state };
    }

    return { result: { action: 'unknown' }, newState: state };
  }

  function reset(): InputHandlerState {
    const newState: InputHandlerState = {
      jumpMode: false,
      jumpBuffer: '',
    };
    state = newState;
    return newState;
  }

  return {
    state,
    parseKey,
    reset,
  };
}
