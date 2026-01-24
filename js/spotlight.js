export function initSpotlight() {
    document.addEventListener('mousemove', (e) => {
        const spotlight = document.getElementById('spotlight');
        const x = e.clientX;
        const y = e.clientY;
        spotlight.style.setProperty('--x', `${x}px`);
        spotlight.style.setProperty('--y', `${y}px`);
    });
}
