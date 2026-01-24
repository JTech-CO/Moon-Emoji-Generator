import { state } from './state.js';
import { els } from './dom.js';
import { debounceProcess } from './renderer.js';

export function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            state.imageSrc = event.target.result;
            els.imagePreview.src = state.imageSrc;
            els.previewContainer.classList.remove('hidden');
            debounceProcess();
        };
        reader.readAsDataURL(file);
    }
}
