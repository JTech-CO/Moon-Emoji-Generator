import { state } from './state.js';
import { renderToAscii } from './renderer.js';

export function processTextMode() {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    const lines = state.textInput.split('\n');
    const fontStr = `bold ${state.fontSize}px "Noto Sans KR", sans-serif`;
    ctx.font = fontStr;

    let maxWidth = 0;
    lines.forEach(line => {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxWidth) maxWidth = metrics.width;
    });

    const lineHeight = state.fontSize * 1.2;
    const height = lineHeight * lines.length;

    tempCanvas.width = maxWidth + state.fontSize;
    tempCanvas.height = height + state.fontSize/2;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = fontStr;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    const centerX = tempCanvas.width / 2;
    let currentY = state.fontSize/4;

    lines.forEach(line => {
        ctx.fillText(line, centerX, currentY);
        currentY += lineHeight;
    });

    const img = new Image();
    img.onload = () => {
        renderToAscii(img);
    };
    img.src = tempCanvas.toDataURL();
}
