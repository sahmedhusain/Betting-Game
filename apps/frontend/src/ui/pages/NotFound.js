import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ROUTES } from '../../utils/constants.js';

export function NotFound() {
  const t = TEXT.notFound;

  return h('div', { 
    class: 'relative z-10 w-full max-w-2xl px-6 py-12 animate-fade-in' 
  }, [
    h('div', { class: 'glass-panel p-12 rounded-[3rem] border border-white/5 flex flex-col items-center shadow-2xl relative overflow-hidden' }, [
      // Background Accent
      h('div', { class: 'absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full' }),
      
      // The "Lost Tile" Icon
      h('div', { class: 'w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mb-12 border border-emerald-500/30' },
        h('div', { class: 'w-10 h-14 border-4 border-emerald-500 rounded-md relative' }, [
          h('div', { class: 'absolute top-2 left-2 w-2 h-2 bg-emerald-500 rounded-full' }),
          h('div', { class: 'absolute bottom-2 right-2 w-2 h-2 bg-emerald-500 rounded-full opacity-30' })
        ])
      ),

      // Ornate 404 number
      h('div', { class: 'relative mb-6' }, [
        h('h1', { 
          class: 'text-[140px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' 
        }, t.title),
        h('span', { class: 'relative z-10 text-7xl font-black tracking-tight text-white' }, t.title)
      ]),

      // Message
      h('p', { 
        class: 'text-slate-400 text-lg mb-12 text-center max-w-sm leading-relaxed font-medium' 
      }, t.subtitle),

      // CTA - Matching Landing Page Style
      h('a', {
        href: ROUTES.LANDING,
        class: 'group flex items-center gap-6 px-10 py-6 bg-emerald-500 hover:bg-emerald-400 rounded-3xl font-black text-white transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 no-underline'
      }, [
        h('span', { class: 'uppercase tracking-[0.2em] text-sm' }, t.goHome),
        h('div', { class: 'w-8 h-[1px] bg-white/50 group-hover:w-12 transition-all' })
      ])
    ])
  ]);
}
