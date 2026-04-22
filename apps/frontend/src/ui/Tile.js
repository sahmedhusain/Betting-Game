import { createElement as h } from '../picojs/framework/core.js';

export function Tile({ tile }) {
    // Determine color based on suit/type
    const isSpecial = tile.type !== 'NUMBER';
    const accentColor = isSpecial ? 'text-emerald-400' : 'text-slate-200';

    return h('div', {
        class: 'group relative w-24 h-32 flex flex-col items-center justify-between p-4 transition-all duration-500 hover:-translate-y-4 cursor-pointer select-none'
    },
        h('div', { 
            class: 'absolute inset-0 bg-gradient-to-b from-white/10 to-white/[0.02] backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl group-hover:border-white/30 group-hover:bg-white/[0.05] transition-all' 
        }),

        h('span', { class: 'relative z-10 text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity' },
            tile.suit !== 'NONE' ? tile.suit : tile.type
        ),

        h('div', { 
            class: `relative z-10 text-5xl font-black font-outfit ${accentColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500` 
        },
            tile.faceValue || tile.name[0]
        ),

        // Bottom: Status Indicator
        h('div', { 
            class: `relative z-10 w-8 h-1 rounded-full ${isSpecial ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-white/10'}` 
        }),

        // 3D Shadow underneath
        h('div', { 
            class: 'absolute -bottom-4 left-4 right-4 h-2 bg-black/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' 
        })
    );
}