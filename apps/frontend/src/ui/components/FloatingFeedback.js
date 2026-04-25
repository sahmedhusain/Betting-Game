import { createElement as h } from '../../picojs/framework/core.js';
import { HAND_RESULTS, TEXT, UI_CONFIG } from '../../utils/constants.js';

/**
 * @param {Object} props
 * @param {boolean} props.isVisible
 * @param {string} props.result
 * @param {Function} props.onAnimationEnd
 */
export function FloatingFeedback({ isVisible, result, onAnimationEnd }) {
  if (!isVisible) return h('div', {});

  const isWin = result === HAND_RESULTS.WIN;
  const isLoss = result === HAND_RESULTS.LOSS;
  const isPush = result === HAND_RESULTS.PUSH;

  const animationClass = isWin
    ? 'animate-float-feedback-win'
    : (isLoss ? 'animate-float-feedback-loss' : 'animate-float-feedback-push');

  const icon = isWin ? UI_CONFIG.SYMBOLS.WIN : (isLoss ? UI_CONFIG.SYMBOLS.LOSS : UI_CONFIG.SYMBOLS.PUSH);
  const text = isWin ? TEXT.game.feedbackWin : (isLoss ? TEXT.game.feedbackLoss : TEXT.game.feedbackPush);
  
  const accentColor = isWin ? '#10b981' : (isLoss ? '#f43f5e' : '#94a3b8');
  const glowColor = isWin ? 'rgba(16,185,129,0.5)' : (isLoss ? 'rgba(244,63,94,0.5)' : 'rgba(148,163,184,0.5)');
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
