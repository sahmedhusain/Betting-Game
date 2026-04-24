import { createElement as h } from '../../picojs/framework/core.js';

/**
 * @param {Object} props
 * @param {boolean} props.isVisible
 * @param {boolean} props.isWin
 * @param {Object} props.position
 * @param {Function} props.onAnimationEnd
 */
export function FloatingFeedback({ isVisible, isWin, position = { x: 0, y: 0 }, onAnimationEnd }) {
  if (!isVisible) return h('div', {});

  const animationClass = isWin
    ? 'animate-float-feedback-win'
    : 'animate-float-feedback-loss';

  const icon = isWin ? '✓' : '✕';
  const text = isWin ? 'Bim!' : 'Oh Snap!';
  
  const accentColor = isWin ? '#10b981' : '#f43f5e';
  const glowColor = isWin ? 'rgba(16,185,129,0.8)' : 'rgba(244,63,94,0.8)';

  return h(
    'div',
    {
      class: 'absolute inset-x-0 bottom-0 pointer-events-none flex items-center justify-center -translate-y-12 md:-translate-y-16',
      style: {
        zIndex: 99999,
      },
      onanimationend: onAnimationEnd,
    },

    h(
      'div',
      {
        class: `flex flex-row items-center gap-4 ${animationClass}`,
        style: { opacity: '1 !important' }
      },

      // Raw Icon
      h('span', { 
        class: 'text-5xl md:text-7xl font-black leading-none',
        style: { 
          color: accentColor,
          filter: `drop-shadow(0 0 15px ${glowColor}) drop-shadow(0 0 30px ${glowColor})`,
          opacity: '1'
        }
      }, icon),

      h('span', { 
        class: 'text-4xl md:text-6xl font-black italic leading-none tracking-tight',
        style: { 
          color: accentColor,
          filter: `drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 0 40px ${glowColor})`,
          opacity: '1'
        }
      }, text)
    )
  );
}
