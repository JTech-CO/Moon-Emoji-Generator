import { state } from './state.js';
import { els } from './dom.js';

export function updateTransform() {
    els.outputContent.style.transform = `translate(calc(-50% + ${state.x}px), calc(-50% + ${state.y}px)) scale(${state.scale})`;
    if (state.scale !== 1) {
        els.zoomBadge.innerText = `${Math.round(state.scale * 100)}%`;
        els.zoomBadge.classList.remove('hidden');
    } else {
        els.zoomBadge.classList.add('hidden');
    }
}

export function handleWheel(e) {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.1, state.scale * (1 + scaleAmount)), 10);
    state.scale = newScale;
    updateTransform();
}

export function handleMouseDown(e) {
    state.isDragging = true;
    state.dragStart = { x: e.clientX - state.x, y: e.clientY - state.y };
    els.outputContainer.classList.replace('cursor-grab', 'cursor-grabbing');
}

export function handleMouseMove(e) {
    if (!state.isDragging) return;
    state.x = e.clientX - state.dragStart.x;
    state.y = e.clientY - state.dragStart.y;
    updateTransform();
}

export function handleMouseUp() {
    state.isDragging = false;
    els.outputContainer.classList.replace('cursor-grabbing', 'cursor-grab');
}

export function resetView() {
    state.scale = 1;
    state.x = 0;
    state.y = 0;
    updateTransform();
}
