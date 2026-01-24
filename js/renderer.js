import { state } from './state.js';
import { els } from './dom.js';
import { MOON_PALETTE } from './config.js';
import { processTextMode } from './textHandler.js';

let debounceTimer;

export function debounceProcess() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        processContent();
    }, 100);
}

export function processContent() {
    if (state.mode === 'image' && !state.imageSrc) {
        els.resultArt.innerText = "";
        els.emptyState.classList.remove('hidden');
        els.hintOverlay.classList.add('hidden');
        return;
    }
    if (state.mode === 'text' && !state.textInput.trim()) {
        els.resultArt.innerText = "";
        els.emptyState.classList.remove('hidden');
        els.hintOverlay.classList.add('hidden');
        return;
    }

    els.loader.classList.remove('hidden');
    els.emptyState.classList.add('hidden');
    
    requestAnimationFrame(() => {
        if (state.mode === 'image') {
            processImageMode();
        } else {
            processTextMode();
        }
    });
}

export function processImageMode() {
    const img = new Image();
    img.src = state.imageSrc;
    img.onload = () => {
        renderToAscii(img);
    };
}

export function renderToAscii(imgSource) {
    const ctx = els.canvas.getContext('2d');
    
    const targetWidth = state.width;
    let targetHeight;

    let srcX = 0, srcY = 0, srcW = imgSource.width, srcH = imgSource.height;

    if (state.keepAspectRatio) {
        const aspectRatio = imgSource.height / imgSource.width;
        const correctionFactor = 1.0;
        targetHeight = Math.max(1, Math.floor(targetWidth * aspectRatio * correctionFactor));
    } else {
        targetHeight = state.height;

        const targetRatio = targetWidth / targetHeight;
        const sourceRatio = imgSource.width / imgSource.height;

        if (sourceRatio > targetRatio) {
            srcH = imgSource.height;
            srcW = imgSource.height * targetRatio;
            srcX = (imgSource.width - srcW) / 2;
        } else {
            srcW = imgSource.width;
            srcH = imgSource.width / targetRatio;
            srcY = (imgSource.height - srcH) / 2;
        }
    }

    els.canvas.width = targetWidth;
    els.canvas.height = targetHeight;
    ctx.drawImage(imgSource, srcX, srcY, srcW, srcH, 0, 0, targetWidth, targetHeight);

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imageData.data;
    let artString = "";

    for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
            const offset = (y * targetWidth + x) * 4;
            let r = data[offset];
            let g = data[offset + 1];
            let b = data[offset + 2];

            r = clamp((r - 128) * state.contrast + 128);
            g = clamp((g - 128) * state.contrast + 128);
            b = clamp((b - 128) * state.contrast + 128);

            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            let normalized = brightness / 255;

            if (state.isInverted) {
                normalized = 1.0 - normalized;
            }

            if (state.useAntiAliasing) {
                let index = Math.floor(normalized * MOON_PALETTE.length);
                index = Math.max(0, Math.min(index, MOON_PALETTE.length - 1));
                artString += MOON_PALETTE[index];
            } else {
                if (normalized < 0.5) {
                    artString += state.charDark;
                } else {
                    artString += state.charLight;
                }
            }
        }
        artString += "\n";
    }

    els.resultArt.innerText = artString;
    els.loader.classList.add('hidden');
    els.hintOverlay.classList.remove('hidden');
}

export function clamp(val) {
    return Math.max(0, Math.min(255, val));
}
