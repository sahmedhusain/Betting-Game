import { createElement as h } from '../../picojs/framework/core.js';

/**
 * @param {Object} props
 * @param {boolean} props.isVisible
 * @param {boolean} props.isWin
 * @param {Object} props.position
 * @param {Function} props.onAnimationEnd
 */
export function FloatingFeedback({ isVisible, isWin, onAnimationEnd }) {
  if (!isVisible) return h('div', {});

  const animationClass = isWin
    ? 'animate-float-feedback-win'
    : 'animate-float-feedback-loss';

  const icon = isWin ? '✓' : '✕';
  const text = isWin ? 'Bim!' : 'Oh Snap!';
  
  const accentColor = isWin ? '#10b981' : '#f43f5e';
  const glowColor = isWin ? 'rgba(16,185,129,0.5)' : 'rgba(244,63,94,0.5)';
  const borderColor = 'border-white/10';
  const bgColor = 'bg-white/[0.03]';

  return h(
    'div',
    {
      class: 'absolute inset-0 pointer-events-none flex items-center justify-center z-[99999]',
      onanimationend: onAnimationEnd,
    },
    h('div', {
      class: `flex items-center gap-6 px-10 py-6 rounded-[2.5rem] border backdrop-blur-[100px] shadow-2xl ${animationClass} ${borderColor} ${bgColor}`
    },
      h('span', { 
        class: 'text-5xl md:text-7xl font-black leading-none',
        style: { 
          color: accentColor,
          filter: `drop-shadow(0 0 15px ${glowColor})`,
        }
      }, icon),

      h('span', { 
        class: 'text-4xl md:text-6xl font-black italic leading-none tracking-tight',
        style: { 
          color: accentColor,
          filter: `drop-shadow(0 0 20px ${glowColor})`,
        }
      }, text)
    )
  );
}
