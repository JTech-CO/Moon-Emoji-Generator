import { state } from './state.js';
import { els } from './dom.js';
import { MOON_PALETTE, TSUKI_EMOJIS, TSUKI_MATRICES } from './config.js';
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
    if (state.useAntiAliasing) {
        renderTsukimoji(imgSource);
    } else {
        renderSimple(imgSource);
    }
}

// =====================================================
// tsukimoji 방식: 4×4 블록 템플릿 매칭 (안티앨리어싱 ON)
// =====================================================
function renderTsukimoji(imgSource) {
    const ctx = els.canvas.getContext('2d');
    const emojiCols = state.width;

    // 캔버스 해상도 = 이모지 열 수 × 4 (4×4 블록 단위)
    const canvasW = emojiCols * 4;
    let canvasH;

    let srcX = 0, srcY = 0, srcW = imgSource.width, srcH = imgSource.height;

    if (state.keepAspectRatio) {
        const aspectRatio = imgSource.height / imgSource.width;
        canvasH = Math.max(4, Math.floor(canvasW * aspectRatio));
    } else {
        canvasH = state.height * 4;

        const targetRatio = emojiCols / state.height;
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

    // 4의 배수로 맞춤
    canvasH -= canvasH % 4;
    if (canvasH < 4) canvasH = 4;

    els.canvas.width = canvasW;
    els.canvas.height = canvasH;
    ctx.drawImage(imgSource, srcX, srcY, srcW, srcH, 0, 0, canvasW, canvasH);

    const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
    const data = imageData.data;

    // 그레이스케일 + 대비 + 정규화 → [-1, 1] 배열
    const gray = new Float32Array(canvasW * canvasH);
    for (let i = 0; i < gray.length; i++) {
        let r = data[i * 4];
        let g = data[i * 4 + 1];
        let b = data[i * 4 + 2];

        r = clamp((r - 128) * state.contrast + 128);
        g = clamp((g - 128) * state.contrast + 128);
        b = clamp((b - 128) * state.contrast + 128);

        let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        let normalized = brightness / 128 - 1; // [-1, 1]

        if (state.isInverted) {
            normalized = -normalized;
        }

        gray[i] = normalized;
    }

    // 4×4 블록 순회 → 템플릿 매칭
    const blockRows = Math.floor(canvasH / 4);
    const blockCols = Math.floor(canvasW / 4);
    let artString = "";

    for (let bi = 0; bi < blockRows; bi++) {
        for (let bj = 0; bj < blockCols; bj++) {
            let bestIdx = 0;
            let bestScore = -Infinity;

            for (let n = 0; n < 8; n++) {
                let score = 0;
                const tmpl = TSUKI_MATRICES[n];
                for (let dy = 0; dy < 4; dy++) {
                    const rowOffset = (bi * 4 + dy) * canvasW + bj * 4;
                    const tmplRow = tmpl[dy];
                    score += gray[rowOffset]     * tmplRow[0]
                           + gray[rowOffset + 1] * tmplRow[1]
                           + gray[rowOffset + 2] * tmplRow[2]
                           + gray[rowOffset + 3] * tmplRow[3];
                }
                if (score > bestScore) {
                    bestScore = score;
                    bestIdx = n;
                }
            }
            artString += TSUKI_EMOJIS[bestIdx];
        }
        artString += "\n";
    }

    els.resultArt.innerText = artString;
    els.loader.classList.add('hidden');
    els.hintOverlay.classList.remove('hidden');
}

// =====================================================
// 기존 방식: 1픽셀 = 1이모지 이분법 (안티앨리어싱 OFF)
// =====================================================
function renderSimple(imgSource) {
    const ctx = els.canvas.getContext('2d');

    const targetWidth = state.width;
    let targetHeight;

    let srcX = 0, srcY = 0, srcW = imgSource.width, srcH = imgSource.height;

    if (state.keepAspectRatio) {
        const aspectRatio = imgSource.height / imgSource.width;
        targetHeight = Math.max(1, Math.floor(targetWidth * aspectRatio));
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

            if (normalized < 0.5) {
                artString += state.charDark;
            } else {
                artString += state.charLight;
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
