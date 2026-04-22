import { createElement as h } from '../../picojs/framework/core.js';
import { TileRenderer } from './TileRenderer.js';

export function HandDisplay({ tiles = [] }) {
	return h('div', { class: 'glass-panel p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center items-center shadow-2xl relative overflow-hidden' },
		h('div', { class: 'absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none' }),
		...tiles.map(tile => TileRenderer({ tile }))
	);
}
