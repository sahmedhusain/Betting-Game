import { createElement as h } from '../../picojs/framework/core.js';
import { TileRenderer } from './TileRenderer.js';

/**
 * @param {Object} props
 * @param {Array} props.tiles - Array of tile objects to display
 * @param {boolean} props.showDistributionAnimation - Trigger cascade animation
 */
export function HandDisplay({ tiles = [], showDistributionAnimation = true, isExiting = false, distributionSeed = 0 }) {
  return h('div', {
    class: `glass-panel p-6 lg:p-[max(1.4rem,2.5vw)] rounded-[var(--play-panel-radius)] lg:rounded-[calc(var(--play-panel-radius)*1.35)] flex flex-wrap gap-4 lg:gap-[max(0.65rem,1.2vw)] justify-center items-center shadow-2xl relative overflow-hidden transition-all duration-300 min-h-[clamp(280px,40vh,460px)] ${isExiting ? 'animate-hand-exit' : ''}`,
    key: 'hand-display'
  },
    h('div', { class: 'absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none' }),
    
    ...tiles.map((tile, index) => {
      // Apply opacity-0 immediately if animating to prevent flash
      const isAnimating = showDistributionAnimation;
      const delayClass = isAnimating
        ? `animate-card-distribute animate-distribute-delay-${Math.min(index + 1, 5)} opacity-0`
        : '';

      return h('div', {
        class: `flex justify-center w-[28%] lg:w-auto ${delayClass}`, // Force 3+2 wrap on mobile
        key: `${tile.id}-${distributionSeed}`,
        style: {
          animationFillMode: 'both',
        }
      }, TileRenderer({ 
        tile, 
        key: tile.id,
        animateFlip: showDistributionAnimation,
        flipDelay: showDistributionAnimation ? `${(index + 1) * 100 + 500}ms` : '0ms'
      }));
    })
  );
}
