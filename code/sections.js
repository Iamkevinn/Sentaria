// sections.js
(() => {
    document.documentElement.classList.add('s-ready');
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('.s-rv');

    if (!('IntersectionObserver' in window) || rm) {
        els.forEach(e => e.classList.add('s-in'));
    } else {
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    en.target.classList.add('s-in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
        els.forEach(e => io.observe(e));
    }

    const patio = document.querySelector('.s-patio');
    if (!patio) return;

    const tabs = [...patio.querySelectorAll('[role="tab"]')];
    const panels = [...document.querySelectorAll('.s-panel')];
    const stone = patio.querySelector('.s-piedra');
    const prev = document.querySelector('[data-paso="prev"]');
    const next = document.querySelector('[data-paso="next"]');
    let cur = 0;

    const place = () => {
        const p = patio.getBoundingClientRect();
        const r = tabs[cur].getBoundingClientRect();
        stone.style.setProperty('--x', (r.left - p.left + r.width * .72) + 'px');
        stone.style.setProperty('--y', (r.top - p.top + r.height * .74) + 'px');
    };

    const go = (i, focus) => {
        cur = (i + tabs.length) % tabs.length;
        tabs.forEach((t, k) => {
            const on = k === cur;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
        });
        panels.forEach((pn, k) => { pn.hidden = k !== cur; });
        stone.classList.remove('hop');
        void stone.offsetWidth;
        stone.classList.add('hop');
        place();
        if (focus) tabs[cur].focus();
    };

    tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    prev.addEventListener('click', () => go(cur - 1));
    next.addEventListener('click', () => go(cur + 1));

    patio.addEventListener('keydown', e => {
        const map = { ArrowRight: cur + 1, ArrowDown: cur + 1, ArrowLeft: cur - 1, ArrowUp: cur - 1, Home: 0, End: tabs.length - 1 };
        if (e.key in map) {
            e.preventDefault();
            go(map[e.key], true);
        }
    });

    addEventListener('resize', place);
    go(0);
    requestAnimationFrame(() => stone.classList.add('ready'));
})();