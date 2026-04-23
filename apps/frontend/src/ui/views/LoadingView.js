import { createElement as h } from '../../picojs/framework/core.js';
import { ASSETS } from '../../utils/constants.js';

export function LoadingView() {
  return h('div', { 
    class: 'w-full h-screen bg-slate-950 flex flex-col items-center justify-center p-6 animate-fade-in' 
  },
    h('div', { class: 'relative mb-8' },
      h('div', { class: 'absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse' }),
      h('img', { 
        src: ASSETS.BRANDING.LOGO, 
        class: 'w-24 h-24 relative drop-shadow-2xl animate-bounce-slow' 
      })
    ),
    h('div', { class: 'flex items-center gap-3' },
      h('div', { class: 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]' }),
      h('div', { class: 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]' }),
      h('div', { class: 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce' })
    ),
    h('p', { class: 'mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500' }, 'Authenticating')
  );
}
