import { createElement as h } from '../../picojs/framework/core.js';

export function EndView({ state, engine }) {
    return h('div', { class: 'flex flex-col items-center justify-center animate-fade-in' },
        h('div', { class: 'glass-panel p-20 rounded-[4rem] text-center max-w-lg w-full relative overflow-hidden' },
            //  Game Over
            h('div', { class: 'absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/10 blur-[80px] -z-10' }),

            h('p', { class: 'text-rose-500 font-black uppercase tracking-[0.4em] mb-4 text-[10px]' }, 'Session Terminated'),
            h('h1', { class: 'text-7xl font-black mb-2 font-outfit tracking-tighter leading-none' }, 'GAME\nOVER'),
            
            h('div', { class: 'my-12 py-8 border-y border-white/5' },
                h('p', { class: 'text-slate-500 uppercase text-[10px] font-black tracking-widest mb-2' }, 'Final Bankroll'),
                h('h2', { class: 'text-6xl font-black text-white font-outfit tracking-tight' }, 
                    state.score.toLocaleString()
                )
            ),

            h('div', { class: 'space-y-4' },
                h('p', { class: 'text-slate-400 text-sm mb-6 leading-relaxed' }, 
                    'Your performance has been recorded in the Hall of Fame.'
                ),
                h('button', {
                    class: 'w-full py-6 bg-white text-slate-900 rounded-3xl font-black hover:bg-emerald-400 transition-all uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95',
                    onclick: () => window.location.reload()
                }, 'Re-Initialize')
            )
        )
    );
}
