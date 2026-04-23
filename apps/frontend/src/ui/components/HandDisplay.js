import { createElement as h } from '../../picojs/framework/core.js';
import { TileRenderer } from './TileRenderer.js';

/**
 * @param {Object} props
 * @param {Array} props.tiles - Array of tile objects to display
 * @param {boolean} props.showDistributionAnimation - Trigger cascade animation
 */
export function HandDisplay({ tiles = [], showDistributionAnimation = true }) {
  return h('div', {
    class: 'glass-panel p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center items-center shadow-2xl relative overflow-hidden transition-all duration-300',
    key: 'hand-display'
  },
    h('div', { class: 'absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none' }),
    ...tiles.map((tile, index) => {
      // Determine animation delay based on card position
      const delayClass = showDistributionAnimation
        ? `animate-card-distribute animate-distribute-delay-${Math.min(index + 1, 5)}`
        : '';

      return h('div', {
        class: `${delayClass} animate-card-hover transition-all duration-300`,
        key: tile.id,
        style: {
          animationFillMode: 'both',
        }
      }, TileRenderer({ tile, key: tile.id }));
    })
  );
}
