export interface ParsedArguments {
  success: true;
  directory: string;
  options: {
    showHeader: boolean;
    showFooter: boolean;
  };
}

export interface ParseError {
  success: false;
  error: string;
  showHelp?: boolean;
}

export type ParseResult = ParsedArguments | ParseError;

export function parseArguments(args: string[]): ParseResult {
  if (args.length === 0) {
    return {
      success: false,
      error: 'Missing presentation directory argument',
      showHelp: true,
    };
  }

  if (args[0] === '--help' || args[0] === '-h') {
    return {
      success: false,
      error: '',
      showHelp: true,
    };
  }

  const directory = args[0];
  const result = parseOptions(args.slice(1));

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    directory,
    options: result.options,
  };
}

interface OptionsParseSuccess {
  success: true;
  options: {
    showHeader: boolean;
    showFooter: boolean;
  };
}

interface OptionsParseFailure {
  success: false;
  error: string;
}

type OptionsParseResult = OptionsParseSuccess | OptionsParseFailure;

function parseOptions(args: string[]): OptionsParseResult {
  const initialOptions = {
    showHeader: true,
    showFooter: true,
  };

  const reducer = (
    state: OptionsParseResult,
    arg: string,
    index: number,
    allArgs: string[],
  ): OptionsParseResult => {
    if (!state.success) {
      return state;
    }

    const optionState = state.options;
    const handledIndices = getHandledIndices(allArgs, index);
    if (handledIndices.includes(index)) {
      return state;
    }

    if (arg === '--header') {
      return parseToggleOption(optionState, allArgs[index + 1], 'header');
    }

    if (arg === '--footer') {
      return parseToggleOption(optionState, allArgs[index + 1], 'footer');
    }

    return {
      success: false,
      error: `Unknown argument: ${arg}`,
    };
  };

  return args.reduce<OptionsParseResult>(
    reducer,
    { success: true, options: initialOptions },
  );
}

function parseToggleOption(
  options: { showHeader: boolean; showFooter: boolean },
  value: string | undefined,
  type: 'header' | 'footer',
): OptionsParseResult {
  if (value === 'off') {
    return {
      success: true,
      options: {
        ...options,
        ...(type === 'header' ? { showHeader: false } : { showFooter: false }),
      },
    };
  }

  return {
    success: false,
    error: `Invalid value for --${type}: ${value}`,
  };
}

function getHandledIndices(args: string[], index: number): number[] {
  const previous = args[index - 1];
  if (previous === '--header' || previous === '--footer') {
    return [index];
  }

  return [];
}

