import { LandingView } from './views/LandingView.js';
import { GameView } from './views/GameView.js';
import { EndView } from './views/EndView.js';
import { PHASES } from '../utils/constants.js';
import { NotFound } from './pages/NotFound.js';

export function resolveView(state, engine) {
  switch (state.gamePhase) {
    case PHASES.LANDING:
      return LandingView({ state, engine });
    case PHASES.PLAYING:
      return GameView({ state, engine });
    case PHASES.GAME_OVER:
      return EndView({ state, engine });
    case PHASES.NOT_FOUND:
      return NotFound();
    default:
      return LandingView({ state, engine });
  }
}
