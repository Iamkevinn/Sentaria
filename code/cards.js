// cards.js
(() => {
    const cards = [...document.querySelectorAll('.quick .qc')];
    if (!cards.length) return;
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const root = document.documentElement;

    const reveal = c => {
        c.classList.remove('pre');
        c.classList.add('in');
    };

    const start = () => {
        if (rm || !('IntersectionObserver' in window)) {
            cards.forEach(reveal);
            return;
        }
        const io = new IntersectionObserver(es => es.forEach(e => {
            if (e.isIntersecting) {
                reveal(e.target);
                io.unobserve(e.target);
            }
        }), { threshold: .25 });
        cards.forEach(c => io.observe(c));
    };

    if (!rm) cards.forEach(c => c.classList.add('pre'));

    if (root.classList.contains('loading')) {
        const mo = new MutationObserver(() => {
            if (!root.classList.contains('loading')) {
                mo.disconnect();
                start();
            }
        });
        mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    } else start();

    if (fine && !rm) cards.forEach(c => {
        let raf = 0;
        c.addEventListener('pointermove', e => {
            const r = c.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width * 2 - 1;
            const y = (e.clientY - r.top) / r.height * 2 - 1;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                c.classList.add('tilting');
                c.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
                c.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
                c.style.setProperty('--mx', x.toFixed(2));
                c.style.setProperty('--my', y.toFixed(2));
            });
        });
        c.addEventListener('pointerleave', () => {
            cancelAnimationFrame(raf);
            c.classList.remove('tilting');
            ['--rx', '--ry', '--mx', '--my'].forEach(v => c.style.removeProperty(v));
        });
    });
})();