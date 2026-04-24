import { createElement as h } from '../picojs/framework/core.js';
import { LandingView } from './views/LandingView.js';
import { GameView } from './views/GameView.js';
import { EndView } from './views/EndView.js';
import { PHASES } from '../utils/constants.js';
import { ErrorView } from './views/ErrorView.js';
import { LoadingView } from './views/LoadingView.js';

export function resolveView(state, engine) {
  const shell = (phaseKey, content) => h('div', { key: `page-${phaseKey}` }, content);

  if (!state.sessionChecked && (state.gamePhase === PHASES.PLAYING || state.gamePhase === PHASES.GAME_OVER)) {
    return shell('loading', LoadingView());
  }

  switch (state.gamePhase) {
    case PHASES.LANDING:
      return shell(PHASES.LANDING, LandingView({ state, engine }));
    case PHASES.PLAYING:
      return shell(PHASES.PLAYING, GameView({ state, engine }));
    case PHASES.GAME_OVER:
      return shell(PHASES.GAME_OVER, EndView({ state, engine }));
    case PHASES.ERROR:
      return shell(PHASES.ERROR, ErrorView({ state, engine }));
    default:
      return shell(PHASES.LANDING, LandingView({ state, engine }));
  }
}
