import { state } from './state.js';
import { els } from './dom.js';
import { debounceProcess } from './renderer.js';

export function updateModeUI() {
    if (state.mode === 'image') {
        els.btnModeImage.classList.add('active');
        els.btnModeText.classList.remove('active');
        
        els.uiImageMode.classList.remove('hidden');
        els.uiTextMode.classList.add('hidden');
    } else {
        els.btnModeText.classList.add('active');
        els.btnModeImage.classList.remove('active');
        
        els.uiImageMode.classList.add('hidden');
        els.uiTextMode.classList.remove('hidden');
    }
}

export function updateSizeControlsUI() {
    if (state.keepAspectRatio) {
        els.containerHeight.classList.add('opacity-50', 'pointer-events-none');
        els.valHeight.innerText = "AUTO";
    } else {
        els.containerHeight.classList.remove('opacity-50', 'pointer-events-none');
        els.valHeight.innerText = `${state.height}`;
    }
}

export function toggleAntialiasing() {
    state.useAntiAliasing = !state.useAntiAliasing;
    if (state.useAntiAliasing) {
        els.btnAntialiasing.classList.add('active');
        els.toggleAntialiasing.classList.replace('translate-x-0', 'translate-x-5');
        els.containerCustomChars.classList.add('hidden');
    } else {
        els.btnAntialiasing.classList.remove('active');
        els.toggleAntialiasing.classList.replace('translate-x-5', 'translate-x-0');
        
        state.charDark = '🌑';
        state.charLight = '🌕';
        els.inputCharDark.value = '🌑';
        els.inputCharLight.value = '🌕';

        els.containerCustomChars.classList.remove('hidden');
    }
    debounceProcess();
}

export function toggleInvert() {
    state.isInverted = !state.isInverted;
    if (state.isInverted) {
        els.btnInvert.classList.add('active');
        els.toggleInvert.classList.replace('translate-x-0', 'translate-x-5');
    } else {
        els.btnInvert.classList.remove('active');
        els.toggleInvert.classList.replace('translate-x-5', 'translate-x-0');
    }
    debounceProcess();
}
