import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ASSETS } from '../../utils/constants.js';
import { getTileValue } from '../../engine/TileConfig.js';

export function TileRenderer({ tile, compact = false, key }) {
  const isSpecial = tile.type !== 'NUMBER';
  const tileValue = getTileValue(tile);
  
  // Construct the SVG path
  const filename = tile.type === 'NUMBER' 
    ? `${tile.faceValue}_${tile.suit}.svg`
    : `${tile.name}.svg`;
  const imagePath = `${ASSETS.TILES.BASE}${filename}`;

  // Get label for all tiles
  const getLabel = () => {
    if (tile.type === 'NUMBER') {
      const suit = tile.suit.charAt(0).toUpperCase() + tile.suit.slice(1).toLowerCase();
      return `${tile.faceValue} ${suit}`;
    }
    const key = `${tile.type}_${tile.name}`;
    return TEXT.tiles[key] || tile.name;
  };

  const tileSize = compact
    ? 'w-14 h-20'
    : 'w-[var(--play-tile-w)] h-[var(--play-tile-h)]';

  return h('div', {
    key,
    class: 'group relative flex flex-col items-center gap-3 select-none'
  },
    // The Glass Card Container
    h('div', {
      class: `relative ${tileSize} rounded-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden bg-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08]`
    },
      // Top Liquid Highlight
      h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent' }),
      
      // The Illustration (Filling the container)
      h('div', { class: 'absolute inset-0 flex items-center justify-center p-2' },
        h('img', {
          src: imagePath,
          alt: tile.name || `${tile.faceValue} ${tile.suit}`,
          class: 'w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]'
        })
      ),

      // Hover Info Overlay: "Value" label and the Numerical Value
      h('div', {
        class: 'absolute inset-0 bg-[#0a0a0b]/90 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-sm'
      },
        h('span', { class: 'text-[10px] font-black text-slate-500 uppercase tracking-widest' }, 'Value'),
        h('span', { class: 'text-4xl md:text-5xl font-black text-emerald-400 font-outfit' }, tileValue)
      )
    ),

    // Label outside and below for ALL tiles
    h('span', { 
      class: 'text-[8px] md:text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 text-center leading-none max-w-[var(--play-tile-w)] truncate transition-opacity group-hover:opacity-0' 
    }, getLabel())
  );
}
