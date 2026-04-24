import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ASSETS } from '../../utils/constants.js';

export function TileRenderer({ tile, compact = false, key }) {
  const isSpecial = tile.type !== 'NUMBER';
  
  // Construct the SVG path
  const filename = tile.type === 'NUMBER' 
    ? `${tile.faceValue}_${tile.suit}.svg`
    : `${tile.name}.svg`;
  const imagePath = `${ASSETS.TILES.BASE}${filename}`;

  // Get label for special tiles
  const getSpecialLabel = () => {
    if (!isSpecial) return '';
    const key = `${tile.type}_${tile.name}`;
    return TEXT.tiles[key] || tile.name;
  };

  const tileSize = compact
    ? 'w-14 h-20 p-2'
    : 'w-[var(--play-tile-w)] h-[var(--play-tile-h)] p-[var(--play-tile-pad)]';

  return h('div', {
    key,
    class: `group relative ${tileSize} flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-2 md:hover:-translate-y-4 cursor-pointer select-none`
  },
    // Tile Background with Glass Effect
    h('div', {
      class: 'absolute inset-0 bg-gradient-to-b from-white/10 to-white/[0.02] backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl group-hover:border-white/30 group-hover:bg-white/[0.05] transition-all'
    }),

    // The SVG Illustration
    h('div', { class: 'relative z-10 w-full h-full flex flex-col items-center justify-center pt-2 pb-1' },
      h('img', {
        src: imagePath,
        alt: tile.name || `${tile.faceValue} ${tile.suit}`,
        class: `w-full ${isSpecial ? 'h-[65%]' : 'h-full'} object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500`
      }),
      
      isSpecial && h('span', { 
        class: 'text-[8px] sm:text-[9px] font-bold uppercase tracking-tight text-emerald-300 opacity-90 group-hover:opacity-100 transition-opacity text-center leading-none mt-auto' 
      }, getSpecialLabel())
    ),

    // Highlight Indicator
    h('div', {
      class: `absolute bottom-2 w-8 h-1 rounded-full ${isSpecial ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-white/10'} opacity-50 group-hover:opacity-100 transition-opacity`
    }),

    // Dynamic Shadow
    h('div', {
      class: 'absolute -bottom-4 left-4 right-4 h-2 bg-black/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'
    })
  );
}
