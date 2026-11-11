
(() => {
    const icons = document.querySelectorAll(".hero-icon");

    if (!icons.length) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let ticking = false;

    function updateParallax() {
        const scroll = window.scrollY;

        icons.forEach((icon) => {
            const isPalette = icon.classList.contains(
                "hero-icon-palette"
            );

            // Los iconos se desplazan en direcciones opuestas
            const direction = isPalette ? -1 : 1;

            // Movimiento más visible al desplazarse por la página
            const movement = Math.min(scroll * 0.28, 105) * direction;

            // Rotación sutil que acompaña el desplazamiento
            const rotation = movement * 0.11;

            icon.style.transform = `
                translate3d(0, ${movement}px, 0)
                rotate(${rotation}deg)
            `;
        });

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    updateParallax();
})();
