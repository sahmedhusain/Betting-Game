import { createElement as h } from '../../picojs/framework/core.js';

export function HistoryPanel({ history }) {
    if (!history || history.length === 0) {
        return h('div', { class: 'text-center p-8 border-2 border-dashed border-white/5 rounded-3xl text-slate-600' },
            'No hand history yet. Make your first bet!'
        );
    }
    return h('div', { class: 'space-y-4' },
        h('h3', { class: 'text-xs font-black uppercase tracking-widest text-slate-500 mb-6' }, 'Hand History'),

        h('div', { class: 'space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar' },
            ...history.slice().reverse().map((entry, i) => h('div', {
                class: 'flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors'
            },
                h('div', { class: 'flex items-center gap-4' },
                    h('span', {
                        class: `w-2 h-2 rounded-full ${entry.result === 'WIN' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-rose-500'}`
                    }),
                    h('div', {},
                        h('p', { class: 'text-[10px] text-slate-500 font-bold' }, `HAND #${history.length - i}`),
                        h('p', { class: 'font-black text-sm' }, entry.result)
                    )
                ),
                h('div', { class: 'text-right' },
                    h('p', { class: 'text-[10px] text-slate-500 font-bold uppercase' }, 'Hand Value'),
                    h('p', { class: 'font-mono font-bold text-emerald-400' }, `+${entry.value}`)
                )
            ))
        )
    );
}