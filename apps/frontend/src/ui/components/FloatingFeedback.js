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
  const colorClass = isWin ? 'text-green-500' : 'text-red-500';
  const iconBgClass = isWin
    ? 'bg-green-500/20 border-green-500/30'
    : 'bg-red-500/20 border-red-500/30';

  return h(
    'div',
    {
      class: 'fixed inset-0 pointer-events-none flex items-center justify-center',
      style: {
        zIndex: 70,
      },
      onanimationend: onAnimationEnd,
    },

    h(
      'div',
      {
        class: `flex flex-col items-center gap-4 ${animationClass}`,
      },

      // Icon Container
      h(
        'div',
        {
          class: `w-24 h-24 md:w-28 md:h-28 rounded-full ${iconBgClass} border-2 flex items-center justify-center backdrop-blur-sm shadow-2xl`,
        },
        h('span', { class: `text-5xl md:text-6xl font-black ${colorClass}` }, icon)
      ),

      // Text
      h('span', { class: `text-4xl md:text-6xl font-black ${colorClass} tracking-wider uppercase drop-shadow-[0_0_28px_rgba(16,185,129,0.45)]` }, text)
    )
  );
}
