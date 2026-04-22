import { createElement as h } from '../picojs/framework/core.js';
import { ScoreBoard } from './components/ScoreBoard.js';
import { Tile } from './Tile.js';
export function GameView({ state, engine }) {
    return h('div', { class: 'w-full space-y-12' },
        // Use our new ScoreBoard component!
        ScoreBoard({ state, engine }),
        // Hand display logic
        h('div', { class: 'flex gap-6 justify-center items-center py-16' },
            ...state.currentHand.map(tile => Tile({ tile }))
        ),
        // Footer stats
        h('div', { class: 'flex justify-center gap-12 text-slate-500 text-xs font-bold uppercase tracking-widest' },
            h('span', {}, `Draw Pile: ${state.drawPileCount}`),
            h('span', {}, `Discarded: ${state.discardPileCount}`),
            h('span', {}, `Reshuffles: ${state.reshuffleCount}/3`)
        )
    );
}