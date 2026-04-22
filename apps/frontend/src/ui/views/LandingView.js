import { createElement as h } from '../../picojs/framework/core.js';

export function LandingView({ state, engine }) {
    // Mock leaderboard if none exists in state yet
    const topScores = state.leaderboard || [
        { player_name: 'Alpha', score: 1250 },
        { player_name: 'Beta', score: 980 },
        { player_name: 'Gamma', score: 750 }
    ];

    return h('div', { class: 'flex flex-col items-center gap-12 animate-fade-in w-full max-w-4xl' },
        // Hero Section
        h('div', { class: 'glass-panel p-20 rounded-[4rem] text-center w-full relative overflow-hidden' },
            h('div', { class: 'absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-[80px] -z-10' }),
            h('h1', { class: 'text-8xl font-black mb-6 font-outfit tracking-tighter leading-none' }, 'MAHJONG\nBETTING'),
            h('p', { class: 'text-slate-400 text-lg mb-10' }, 'High-fidelity strategy powered by dynamic tile scaling.'),
            h('button', {
                class: 'px-16 py-6 bg-emerald-500 rounded-3xl font-black text-white hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/40 uppercase tracking-[0.2em] text-xs',
                onclick: () => engine.startGame('Player1')
            }, 'Initialize Session')
        ),

        // Hall of Fame (Requirement 3.1)
        h('div', { class: 'w-full grid grid-cols-1 gap-4' },
            h('div', { class: 'flex justify-between items-center px-8 mb-2' },
                h('h2', { class: 'text-[10px] font-black uppercase tracking-[0.5em] text-slate-500' }, 'Hall of Fame'),
                h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' })
            ),
            h('div', { class: 'grid grid-cols-3 gap-6' },
                ...topScores.slice(0, 3).map((player, i) => h('div', { class: 'glass-panel p-6 rounded-3xl flex flex-col items-center gap-2' },
                    h('span', { class: 'text-[10px] font-black text-emerald-500' }, `RANK 0${i+1}`),
                    h('p', { class: 'font-black font-outfit text-xl truncate w-full text-center' }, player.player_name),
                    h('p', { class: 'text-slate-500 font-mono text-sm font-bold' }, player.score.toLocaleString())
                ))
            )
        )
    );
}
