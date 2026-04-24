import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ASSETS } from '../../utils/constants.js';
import { getTileValue } from '../../engine/TileConfig.js';

export function TileRenderer({ tile, compact = false, animateFlip = false, flipDelay = '0ms', key }) {
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
    // 3D FLIP CONTAINER
    h('div', {
      class: `relative ${tileSize} preserve-3d ${animateFlip ? 'animate-card-flip' : ''}`,
      style: animateFlip ? `animation-delay: ${flipDelay}; animation-fill-mode: both; transform: rotateY(180deg); -webkit-transform: rotateY(180deg);` : ''
    },
      // BACK FACE (facing user when container is at 180deg)
      h('div', { 
        class: 'absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-white/5 bg-[#0f172a] flex items-center justify-center p-4 shadow-2xl' 
      },
        h('img', {
          src: ASSETS.TILES.BACK,
          alt: 'Back',
          class: 'w-full h-full object-contain opacity-20'
        })
      ),

      // FRONT FACE (facing user when container is at 0deg)
      h('div', { 
        class: 'absolute inset-0 backface-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden' 
      },
        // Top Liquid Highlight
        h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent' }),
        
        // The Illustration
        h('div', { class: 'absolute inset-0 flex items-center justify-center p-2' },
          h('img', {
            src: imagePath,
            alt: tile.name || `${tile.faceValue} ${tile.suit}`,
            class: 'w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]'
          })
        ),

        // Hover Info Overlay
        h('div', {
          class: 'absolute inset-0 bg-[#0a0a0b]/90 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-sm'
        },
          h('span', { class: 'text-[10px] font-black text-slate-500 uppercase tracking-widest' }, 'Value'),
          h('span', { class: 'text-4xl md:text-5xl font-black text-emerald-400 font-outfit' }, tileValue)
        )
      )
    ),

    // Label (Always visible on Mobile, hover on Desktop)
    h('span', { 
      class: `text-[10px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center leading-tight w-full max-w-[var(--play-tile-w)] transition-all lg:group-hover:opacity-0 ${animateFlip ? 'animate-fade-in' : ''}`,
      style: animateFlip ? `animation-delay: calc(${flipDelay} + 600ms); animation-fill-mode: both; opacity: 0;` : ''
    }, getLabel())
  );
}
