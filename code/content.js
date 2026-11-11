/* =========================================================
   SENTARIA — INTERACCIONES DEL CONTENIDO INTERIOR
   Independiente de loader.js, cards.js y hero-parallax.js.
   content.js
========================================================= */
(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Aparición gradual de secciones al entrar en pantalla.
       Si IntersectionObserver no está disponible, todo queda visible. */
    const revealElements = document.querySelectorAll(".content-reveal");

    if (!reduceMotion && "IntersectionObserver" in window && revealElements.length) {
        document.documentElement.classList.add("content-motion-ready");

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    /* Parallax pequeño en las composiciones 3D.
       En pantallas táctiles no se fuerza movimiento con el dedo. */
    if (!reduceMotion) {
        const scenes = document.querySelectorAll(".parallax-scene");

        scenes.forEach((scene) => {
            scene.addEventListener("pointermove", (event) => {
                if (event.pointerType === "touch") return;

                const rect = scene.getBoundingClientRect();
                if (!rect.width || !rect.height) return;

                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

                scene.style.setProperty("--pointer-x", `${(Math.max(-1, Math.min(1, x)) * 8).toFixed(2)}px`);
                scene.style.setProperty("--pointer-y", `${(Math.max(-1, Math.min(1, y)) * 8).toFixed(2)}px`);
            }, { passive: true });

            scene.addEventListener("pointerleave", () => {
                scene.style.setProperty("--pointer-x", "0");
                scene.style.setProperty("--pointer-y", "0");
            }, { passive: true });
        });
    }

    /* En las competencias, mantener un único detalle abierto.
       Los elementos siguen siendo <details> nativos y accesibles. */
    document.querySelectorAll("[data-exclusive-details]").forEach((group) => {
        const items = group.querySelectorAll("details");

        items.forEach((item) => {
            item.addEventListener("toggle", () => {
                if (!item.open) return;
                items.forEach((other) => {
                    if (other !== item && other.open) other.open = false;
                });
            });
        });
    });
})();
