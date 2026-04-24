import { createElement as h } from '../../picojs/framework/core.js';
import { ROUTES, ASSETS, TEXT, UI_CONFIG } from '../../utils/constants.js';

export function ErrorView({ state, engine }) {
  const { error } = TEXT;
  const { code, title, message, buttonText, targetRoute } = state.errorData;
  
  const displayCode = code || error.general.code;
  const displayTitle = title || error.general.title;
  const displayMessage = message || error.general.message;
  const displayButtonText = buttonText || error.general.buttonText;
  const displayTarget = targetRoute || ROUTES.LANDING;
  
  const errorIcon = displayCode === '401' ? ASSETS.ICONS.ERROR_401 : ASSETS.ICONS.ERROR_404;

  return h('div', { 
    class: 'w-full h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden' 
  },
    h('div', { class: 'relative z-10 w-full max-w-xl flex flex-col items-center' },
      
      h('div', { class: 'mb-8 flex justify-center animate-bounce-slow' },
        h('img', { 
          src: errorIcon, 
          alt: TEXT.error.iconAlt,
          class: 'w-12 h-12 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
        })
      ),

      h('div', { class: 'relative mb-12 inline-block' },
        h('div', { class: 'absolute inset-0 bg-rose-500/20 blur-[80px] rounded-full animate-pulse' }),
        h('h1', { 
          class: 'relative text-[8rem] md:text-[12rem] font-black text-white font-outfit tracking-tighter leading-none mix-blend-overlay opacity-20 select-none' 
        }, displayCode),
        h('h1', { 
          class: 'absolute inset-0 flex items-center justify-center text-6xl md:text-8xl font-black text-rose-500 font-outfit tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(244,63,94,0.4)]' 
        }, displayCode)
      ),
      
      h('div', { class: 'glass-panel p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden w-full' },
        h('div', { class: 'absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent' }),
        
        h('h2', { 
          class: 'text-2xl md:text-3xl font-black text-white mb-6 tracking-tight uppercase font-outfit' 
        }, displayTitle),
        
        h('p', { 
          class: 'text-slate-400 text-base md:text-lg leading-relaxed mb-12 font-medium max-w-sm mx-auto' 
        }, displayMessage),
        
        h('div', { class: 'flex flex-col items-center justify-center' },
          h('button', {
            class: 'w-full sm:w-auto group px-12 py-5 bg-white text-slate-950 hover:bg-rose-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-white/5',
            onclick: () => { window.location.hash = displayTarget; }
          },
            h('span', { class: 'opacity-50 group-hover:-translate-x-1 transition-transform' }, UI_CONFIG.SYMBOLS.ARROW_LEFT),
            h('span', {}, displayButtonText)
          )
        )
      ),

      h('p', { class: 'mt-12 text-[8px] font-black uppercase tracking-[0.6em] text-slate-700 animate-pulse' }, 
        TEXT.error.integrityCompromised(displayCode)
      )
    )
  );
}
