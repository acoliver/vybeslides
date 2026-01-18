#!/usr/bin/env bun

import { parseArguments } from './ArgumentParser';
import { checkBunRuntime } from './RuntimeCheck';
import { runPresentation } from './Runner';

export interface RunSuccess {
  success: true;
}

export interface RunFailure {
  success: false;
  error: string;
}

export type RunResult = RunSuccess | RunFailure;

const HELP_TEXT = `
VybeSlides - Retro terminal-based slide presenter

Usage:
  vybeslides <presentation-dir> [options]

Options:
  --header off    Disable header bar
  --footer off    Disable footer bar
  --render <num>  Render slide <num> to stdout (headless mode)
  --help, -h      Show this help message

Example:
  vybeslides ./my-presentation
  vybeslides ./slides --footer off
  vybeslides ./slides --render 5 > slide5.txt
`;

export async function run(args: string[]): Promise<RunResult> {
  const runtimeCheck = checkBunRuntime();
  if (!runtimeCheck.success) {
    return {
      success: false,
      error: runtimeCheck.error,
    };
  }

  const parseResult = parseArguments(args);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.showHelp === true ? HELP_TEXT : parseResult.error || 'Invalid arguments',
    };
  }

  const runResult = await runPresentation({
    directory: parseResult.directory,
    showHeader: parseResult.options.showHeader,
    showFooter: parseResult.options.showFooter,
    render: parseResult.options.render,
  });
  if (!runResult.success) {
    return {
      success: false,
      error: runResult.error,
    };
  }

  return {
    success: true,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const result = await run(args);

  if (!result.success) {
    process.stderr.write(`Error: ${result.error}
`);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
