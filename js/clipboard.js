import { els } from './dom.js';

export function copyToClipboard() {
    const text = els.resultArt.innerText;
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard! 🌕");
    }).catch(err => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Copied to clipboard! 🌕");
    });
}
