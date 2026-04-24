import { initialState, initStore } from './state/State.js';
import { engine } from './engine/Engine.js';
import { createApp, eventRegistry } from './picojs/framework/core.js';
import { registerEventHandler } from './picojs/framework/events.js';
import { resolveView } from './ui/UI.js';
import { EVENTS, ROUTES, GAME_CONFIG } from './utils/constants.js';
import {
  handleRouting,
  handleSideEffects,
  handleKeyboard,
  handleBootstrap
} from './services/AppController.js';

// Global Event Handlers Registration
const routingHandlerId = registerEventHandler(EVENTS.HASHCHANGE, handleRouting);
const keyboardHandlerId = registerEventHandler(EVENTS.KEYDOWN, handleKeyboard);

// Enforce default route if empty
if (!window.location.hash || window.location.hash === '#/') {
  window.location.hash = ROUTES.LANDING;
}

// Initialize the application
const store = createApp({
  view: (state) => resolveView(state, engine),
  initialState: {
    ...initialState,
    playerName: localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.PLAYER_NAME) || initialState.playerName
  },
  rootElement: document.getElementById('root')
});

initStore(store);
store.subscribe(handleSideEffects);

// Bootstrap session
handleBootstrap();

const setupGlobalListeners = () => {
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
};

setupGlobalListeners();
