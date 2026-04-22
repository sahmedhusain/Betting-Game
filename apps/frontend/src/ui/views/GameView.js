import { createElement as h } from '../../picojs/framework/core.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { Tile } from '../Tile.js';
import { HistoryPanel } from '../components/HistoryPanel.js';

export function GameView({ state, engine }) {
    return h('div', { class: 'w-full max-w-6xl mx-auto grid grid-cols-12 gap-8 animate-fade-in' },
        // Main Game Area (Left)
        h('div', { class: 'col-span-8 space-y-8' },
            ScoreBoard({ state, engine }),
            
            h('div', { class: 'glass-panel p-16 rounded-[3rem] flex gap-6 justify-center items-center shadow-2xl relative overflow-hidden' },
                h('div', { class: 'absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none' }),
                ...state.currentHand.map(tile => Tile({ tile }))
            ),

            h('div', { class: 'flex justify-center gap-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]' },
                h('span', {}, `Draw Pile: ${state.drawPileCount}`),
                h('span', {}, `Discarded: ${state.discardPileCount}`),
                h('span', {}, `Reshuffles: ${state.reshuffleCount}/3`)
            )
        ),

        // History Sidebar
        h('div', { class: 'col-span-4' },
            h('div', { class: 'glass-panel p-8 rounded-[2.5rem] h-full flex flex-col' },
                HistoryPanel({ history: state.history })
            )
        )
    );
}
