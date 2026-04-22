import { createElement as h } from '../../picojs/framework/core.js';

export function HistoryPanel({ history }) {
    if (!history || history.length === 0) {
        return h('div', { class: 'text-center p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-slate-600' }, 
            h('p', { class: 'text-xs font-black uppercase tracking-widest' }, 'Waiting for first bet...')
        );
    }

    return h('div', { class: 'flex flex-col h-full animate-fade-in' },
        h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-8 px-2' }, 'Hand History'),
        
        h('div', { class: 'flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar' },
            ...history.slice().reverse().map((entry, i) => {
                const isWin = entry.result === 'WIN';
                return h('div', { 
                    class: 'flex items-center justify-between bg-white/[0.03] p-5 rounded-3xl border border-white/5 hover:bg-white/5 transition-all'
                },
                    // Left: Result Indicator
                    h('div', { class: 'flex items-center gap-4' },
                        h('div', { 
                            class: `w-1 h-8 rounded-full ${isWin ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500'}`
                        }),
                        h('div', {},
                            h('p', { class: 'text-[9px] text-slate-500 font-black' }, `SESSION HAND #${history.length - i}`),
                            h('p', { class: 'font-black text-sm uppercase' }, entry.result)
                        )
                    ),

                    // Right: Score Delta
                    h('div', { class: 'text-right' },
                        h('p', { class: 'text-[9px] text-slate-500 font-black uppercase' }, 'Hand Value'),
                        h('p', { class: `font-outfit font-black text-lg ${isWin ? 'text-emerald-400' : 'text-slate-200'}` }, 
                            `+${entry.value}`
                        )
                    )
                );
            })
        )
    );
}