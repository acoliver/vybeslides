import type { Transition, TransitionType } from './TransitionTypes';
import { createDiagonalWipe } from './DiagonalWipe';
import { createLeftWipe } from './LeftWipe';
import { createRightWipe } from './RightWipe';
import { createTopWipe } from './TopWipe';
import { createBottomWipe } from './BottomWipe';
import { createTvTurnOn } from './TvTurnOn';
import { createTvTurnOff } from './TvTurnOff';

const VALID_TRANSITION_NAMES: ReadonlySet<string> = new Set([
  'diagonal',
  'leftwipe',
  'rightwipe',
  'topwipe',
  'bottomwipe',
  'tvon',
  'tvoff',
]);

export function isValidTransitionName(name: string): boolean {
  return VALID_TRANSITION_NAMES.has(name);
}

export function getTransition(type: TransitionType): Transition {
  switch (type) {
    case 'diagonal':
      return createDiagonalWipe();
    case 'leftwipe':
      return createLeftWipe();
    case 'rightwipe':
      return createRightWipe();
    case 'topwipe':
      return createTopWipe();
    case 'bottomwipe':
      return createBottomWipe();
    case 'tvon':
      return createTvTurnOn();
    case 'tvoff':
      return createTvTurnOff();
  }
}
