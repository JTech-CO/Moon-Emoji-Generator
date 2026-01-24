import { state } from './state.js';
import { els } from './dom.js';
import { initSpotlight } from './spotlight.js';
import { updateModeUI, updateSizeControlsUI, toggleAntialiasing, toggleInvert } from './ui.js';
import { handleImageUpload } from './imageHandler.js';
import { debounceProcess } from './renderer.js';
import { handleWheel, handleMouseDown, handleMouseMove, handleMouseUp } from './viewport.js';
import { copyToClipboard } from './clipboard.js';

function setMode(newMode) {
    state.mode = newMode;
    updateModeUI();
    debounceProcess();
}

export function init() {
    initSpotlight();

    els.btnModeImage.addEventListener('click', () => setMode('image'));
    els.btnModeText.addEventListener('click', () => setMode('text'));
    
    els.dropzone.addEventListener('click', () => els.fileInput.click());
    els.fileInput.addEventListener('change', handleImageUpload);
    els.textInput.addEventListener('input', (e) => {
        state.textInput = e.target.value;
        debounceProcess();
    });

    els.checkAspectRatio.addEventListener('change', (e) => {
        state.keepAspectRatio = e.target.checked;
        updateSizeControlsUI();
        debounceProcess();
    });

    els.inputWidth.addEventListener('input', (e) => {
        state.width = parseInt(e.target.value);
        els.valWidth.innerText = `${state.width}`;
        debounceProcess();
    });

    els.inputHeight.addEventListener('input', (e) => {
        state.height = parseInt(e.target.value);
        els.valHeight.innerText = `${state.height}`;
        debounceProcess();
    });

    els.inputContrast.addEventListener('input', (e) => {
        state.contrast = parseFloat(e.target.value);
        els.valContrast.innerText = `x${state.contrast}`;
        debounceProcess();
    });

    els.btnAntialiasing.addEventListener('click', toggleAntialiasing);
    
    els.inputCharDark.addEventListener('input', (e) => {
        state.charDark = e.target.value || ' ';
        debounceProcess();
    });
    els.inputCharLight.addEventListener('input', (e) => {
        state.charLight = e.target.value || ' ';
        debounceProcess();
    });

    els.btnInvert.addEventListener('click', toggleInvert);
    els.btnCopy.addEventListener('click', copyToClipboard);
    els.btnResetView.addEventListener('click', () => location.reload());

    els.outputContainer.addEventListener('wheel', handleWheel);
    els.outputContainer.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    updateModeUI();
    updateSizeControlsUI();
    
    if (state.mode === 'text') debounceProcess();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
