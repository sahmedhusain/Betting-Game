import { createElement as h } from '../picojs/framework/core.js';

export function Tile({ tile }) {
    return h('div', {
        class: 'relative w-24 h-32 bg-white rounded-xl shadow-lg border-b-8 border-slate-200 flex flex-col items-center justify-between p-4 transform transition-transform hover:-translate-y-2 cursor-pointer'
    },
        // Tile Type/Suit
        h('span', { class: 'text-[10px] font-black uppercase tracking-tighter text-slate-400 self-start' },
            tile.suit !== 'NONE' ? tile.suit : tile.type
        ),

        // The Main Symbol
        h('div', { class: 'text-4xl font-black text-slate-800' },
            tile.faceValue || tile.name[0]
        ),

        // Red/Green
        h('div', { class: 'w-8 h-1 rounded-full bg-emerald-500/20' })
    );
}