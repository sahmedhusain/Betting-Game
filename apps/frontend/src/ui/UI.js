import { LandingView } from './views/LandingView.js';
import { GameView } from './views/GameView.js';
import { EndView } from './views/EndView.js';
import { PHASES } from '../utils/constants.js';

export function resolveView(state, engine) {
	switch (state.gamePhase) {
		case PHASES.LANDING:
			return LandingView({ state, engine });
		case PHASES.PLAYING:
			return GameView({ state, engine });
		case PHASES.GAME_OVER:
			return EndView({ state, engine });
		default:
			return LandingView({ state, engine });
	}
}
