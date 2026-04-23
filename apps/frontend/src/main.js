import { initialState, initStore } from './state/State.js';
import { engine } from './engine/Engine.js';
import { createApp, eventRegistry } from './picojs/framework/core.js';
import { registerEventHandler } from './picojs/framework/events.js';
import { resolveView } from './ui/UI.js';
import { EVENTS } from './utils/constants.js';
import {
  phaseFromHash,
  handleRouting,
  handleSideEffects,
  handleKeyboard
} from './services/AppController.js';

const routingHandlerId = registerEventHandler(EVENTS.HASHCHANGE, handleRouting);
const keyboardHandlerId = registerEventHandler(EVENTS.KEYDOWN, handleKeyboard);

// Initialize the application
const store = createApp({
  view: (state) => resolveView(state, engine),
  initialState: { ...initialState, gamePhase: phaseFromHash() },
  rootElement: document.getElementById('root')
});

initStore(store);

store.subscribe(handleSideEffects);

// Global browser events - guarded to avoid duplicate listeners in dev reloads.
if (window.__bettingGameHashHandler) {
  window.removeEventListener(EVENTS.HASHCHANGE, window.__bettingGameHashHandler);
}

if (window.__bettingGameKeydownHandler) {
  document.removeEventListener(EVENTS.KEYDOWN, window.__bettingGameKeydownHandler);
}

window.__bettingGameHashHandler = (e) => eventRegistry.handlers[routingHandlerId](e);
window.__bettingGameKeydownHandler = (e) => eventRegistry.handlers[keyboardHandlerId](e);

window.addEventListener(EVENTS.HASHCHANGE, window.__bettingGameHashHandler);
document.addEventListener(EVENTS.KEYDOWN, window.__bettingGameKeydownHandler);

handleSideEffects();
