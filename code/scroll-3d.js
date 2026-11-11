
/* =========================================================
   SENTARIA — PARALLAX 3D POR SCROLL

   Efecto:
   - Desplazamiento vertical y horizontal.
   - Rotación tridimensional progresiva.
   - Movimiento reversible al subir.
   - Direcciones alternas entre iconos.

   Compatibilidad:
   - cards.js
   - content.js
   - aula.css
   - hero-parallax.js (no se modifica)
========================================================= */

(() => {
    "use strict";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    // Seleccionar únicamente los iconos que deben participar.
    const targets = [
        ...document.querySelectorAll(
            ".quick .qc img.qc-ico"
        ),
        ...document.querySelectorAll(
            "img.section-object"
        ),
        ...document.querySelectorAll(
            "img.s-piz-side .s-ico-cal"
        ),
        ...document.querySelectorAll(
            "img.s-ico-cal"
        )
    ];

    // Eliminar duplicados.
    const icons = [...new Set(targets)].filter(
        icon => !icon.closest(".hero")
    );

    if (!icons.length) return;

    // Registrar los elementos.
    icons.forEach((icon, index) => {
        icon.classList.add("s-scroll3d");
        icon.dataset.scroll3dIndex = index;
    });

    let ticking = false;

    const clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

    function updateParallax() {
        ticking = false;

        const viewportHeight = window.innerHeight;

        icons.forEach((icon, index) => {
            const rect = icon.getBoundingClientRect();

            // No calcular iconos que están lejos de la pantalla.
            if (
                rect.bottom < -180 ||
                rect.top > viewportHeight + 180
            ) {
                return;
            }

            // Centro vertical del icono.
            const centerY = rect.top + rect.height / 2;

            // Progreso del icono al atravesar la pantalla.
            const progress = clamp(
                (viewportHeight * 0.58 - centerY) /
                (viewportHeight * 0.58),
                -1,
                1
            );

            // Alternar direcciones para crear profundidad.
            const direction = index % 2 === 0 ? 1 : -1;

            // Diferenciar la respuesta de cada objeto.
            const phase = index * 0.75;

            // Movimiento vertical principal.
            const movementY =
                progress * 38 * direction;

            // Desplazamiento horizontal complementario.
            const movementX =
                Math.sin(progress * 1.55 + phase) * 10;

            // Profundidad simulada.
            const movementZ =
                Math.cos(progress * 1.4 + phase) * 12;

            // Inclinación sobre los ejes X e Y.
            const rotationX =
                Math.sin(progress * 1.45 + phase) *
                12 * direction;

            const rotationY =
                Math.cos(progress * 1.25 + phase) *
                14 * direction;

            // Pequeña rotación sobre el eje Z.
            const rotationZ =
                Math.sin(progress * 1.6 + phase) * 5;

            // Aplicar desplazamientos.
            icon.style.setProperty(
                "--scroll-x",
                `${movementX.toFixed(2)}px`
            );

            icon.style.setProperty(
                "--scroll-y",
                `${movementY.toFixed(2)}px`
            );

            icon.style.setProperty(
                "--scroll-z",
                `${movementZ.toFixed(2)}px`
            );

            // Aplicar rotaciones tridimensionales.
            icon.style.setProperty(
                "--scroll-rx",
                `${rotationX.toFixed(2)}deg`
            );

            icon.style.setProperty(
                "--scroll-ry",
                `${rotationY.toFixed(2)}deg`
            );

            icon.style.setProperty(
                "--scroll-rz",
                `${rotationZ.toFixed(2)}deg`
            );
        });
    }

    // Agrupar cálculos con requestAnimationFrame.
    function requestUpdate() {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(updateParallax);
    }

    // Responder al desplazamiento de la página.
    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestUpdate,
        { passive: true }
    );

    // Calcular estado inicial.
    requestUpdate();

})();
