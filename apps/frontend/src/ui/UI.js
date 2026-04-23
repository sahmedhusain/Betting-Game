import { createElement as h } from '../picojs/framework/core.js';
import { LandingView } from './views/LandingView.js';
import { GameView } from './views/GameView.js';
import { EndView } from './views/EndView.js';
import { PHASES } from '../utils/constants.js';
import { NotFound } from './pages/NotFound.js';

export function resolveView(state, engine) {
  const shell = (phaseKey, content) => h('div', { key: `page-${phaseKey}` }, content);

  switch (state.gamePhase) {
    case PHASES.LANDING:
      return shell(PHASES.LANDING, LandingView({ state, engine }));
    case PHASES.PLAYING:
      return shell(PHASES.PLAYING, GameView({ state, engine }));
    case PHASES.GAME_OVER:
      return shell(PHASES.GAME_OVER, EndView({ state, engine }));
    case PHASES.NOT_FOUND:
      return shell(PHASES.NOT_FOUND, NotFound());
    default:
      return shell(PHASES.LANDING, LandingView({ state, engine }));
  }
}
