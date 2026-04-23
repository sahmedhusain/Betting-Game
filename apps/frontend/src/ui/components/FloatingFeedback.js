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
      class: `fixed pointer-events-none`,
      style: {
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
      },
      onanimationend: onAnimationEnd,
    },

    h(
      'div',
      {
        class: `flex flex-col items-center gap-2 ${animationClass}`,
      },

      // Icon Container
      h(
        'div',
        {
          class: `w-12 h-12 rounded-full ${iconBgClass} border flex items-center justify-center backdrop-blur-sm`,
        },
        h('span', { class: `text-2xl font-black ${colorClass}` }, icon)
      ),

      // Text
      h('span', { class: `text-lg font-black ${colorClass} tracking-wider uppercase` }, text)
    )
  );
}
