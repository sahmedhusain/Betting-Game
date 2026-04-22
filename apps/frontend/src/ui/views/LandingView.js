import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';

export function LandingView({ state, engine }) {
    const topScores = state.leaderboard || [];

    const handleNameInput = (e) => {
        store.setState({ playerName: e.target.value });
    };

    return h('div', { class: 'flex flex-col items-center gap-12 animate-fade-in w-full max-w-4xl' },
        // Hero Section
        h('div', { class: 'glass-panel p-20 rounded-[4rem] text-center w-full relative overflow-hidden' },
            h('div', { class: 'absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-[80px] -z-10' }),
            h('h1', { class: 'text-8xl font-black mb-6 font-outfit tracking-tighter leading-none' }, 'MAHJONG\nBETTING'),
            h('p', { class: 'text-slate-400 text-lg mb-10' }, 'High-fidelity strategy powered by dynamic tile scaling.'),

            // Name Input
            h('div', { class: 'max-w-sm mx-auto mb-10 group' },
                h('p', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4' }, 'Identify Player'),
                h('input', {
                    type: 'text',
                    placeholder: 'ENTER YOUR NAME',
                    class: 'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center font-black tracking-widest text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/10',
                    value: state.playerName,
                    oninput: handleNameInput
                })
            ),

            h('button', {
                class: `px-16 py-6 rounded-3xl font-black text-white transition-all shadow-2xl uppercase tracking-[0.2em] text-xs ${state.playerName.length >= 3 ? 'bg-emerald-500 hover:scale-105 active:scale-95 shadow-emerald-500/40' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`,
                disabled: state.playerName.length < 3,
                onclick: () => {
                    window.location.hash = '#/play';
                    engine.startGame(state.playerName);
                }
            }, 'Initialize Session')
        ),

        // Hall of Fame
        h('div', { class: 'w-full grid grid-cols-1 gap-4' },
            h('div', { class: 'flex justify-between items-center px-8 mb-2' },
                h('h2', { class: 'text-[10px] font-black uppercase tracking-[0.5em] text-slate-500' }, 'Hall of Fame'),
                h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' })
            ),
            h('div', { class: 'grid grid-cols-3 gap-6' },
                topScores.length > 0
                    ? topScores.slice(0, 3).map((player, i) => h('div', { class: 'glass-panel p-6 rounded-3xl flex flex-col items-center gap-2' },
                        h('span', { class: 'text-[10px] font-black text-emerald-500' }, `RANK 0${i + 1}`),
                        h('p', { class: 'font-black font-outfit text-xl truncate w-full text-center' }, player.player_name || player.username),
                        h('p', { class: 'text-slate-500 font-mono text-sm font-bold' }, player.score.toLocaleString())
                    ))
                    : h('div', { class: 'col-span-3 text-center py-8 text-slate-600 text-xs font-black uppercase tracking-widest' },
                        'No legends recorded yet. Will you be the first?')
            )
        )
    );
}
