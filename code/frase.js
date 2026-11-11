// frase.js
(() => {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const rr = n => (Math.random() * 2 - 1) * n;
    const crayons = ['#F4A817', '#F1CF56', '#E57D5E', '#A5C11F', '#ffffff', '#7FDCF0', '#E55A1D'];
    const clays = ['#E55A1D', '#F4A817', '#4F9E40', '#20ACC1', '#E57D5E', '#A5C11F', '#F1CF56', '#B04A9B'];
    const papers = [['#F7F1E1', '#1b1b1b'], ['#EDE3C8', '#2a2a2a'], ['#ffffff', '#111111'], ['#1c1c1c', '#f5f5f5'], ['#C8372D', '#ffffff'], ['#F1CF56', '#1b1b1b'], ['#E8DDB5', '#7a1f1f']];
    const fonts = ['Georgia,serif', '"Times New Roman",serif', 'Impact,"Arial Narrow",sans-serif', '"Courier New",monospace', '"Arial Black",sans-serif', '"Palatino Linotype",serif'];

    const split = el => {
        const t = el.textContent.trim();
        let n = 0;
        el.textContent = '';
        t.split(' ').forEach(w => {
            const ws = document.createElement('span');
            ws.className = 'w';
            [...w].forEach(ch => {
                const l = document.createElement('span');
                l.className = 'l';
                l.textContent = ch;
                l.style.setProperty('--i', n++);
                ws.append(l);
            });
            el.append(ws, ' ');
        });
    };

    const crayon = el => {
        const off = Math.floor(Math.random() * crayons.length);
        el.querySelectorAll('.l').forEach((l, i) => {
            l.style.setProperty('--c', crayons[(i * 3 + off) % crayons.length]);
            l.style.setProperty('--r', rr(5) + 'deg');
            l.style.setProperty('--y', rr(.05) + 'em');
        });
    };

    const clay = el => {
        const off = Math.floor(Math.random() * clays.length);
        el.querySelectorAll('.l').forEach((l, i) => {
            l.style.setProperty('--c', clays[(i * 3 + off) % clays.length]);
            l.style.setProperty('--r', rr(6) + 'deg');
            l.style.setProperty('--s', (.94 + Math.random() * .12).toFixed(2));
        });
    };

    const p = () => Math.random() * (Math.random() < .3 ? 14 : 5);
    const cut = el => {
        el.querySelectorAll('.l').forEach(l => {
            const [bg, ink] = pick(papers);
            l.style.setProperty('--p', bg);
            l.style.setProperty('--k', ink);
            l.style.setProperty('--f', pick(fonts));
            l.style.setProperty('--r', rr(7) + 'deg');
            l.style.setProperty('--y', rr(.08) + 'em');
            l.style.setProperty('--s', (.85 + Math.random() * .3).toFixed(2));
            l.style.setProperty('--cp', `${p()}% ${p()}%,${100 - p()}% ${p()}%,${100 - p()}% ${100 - p()}%,${p()}% ${100 - p()}%`);
            l.classList.toggle('np', Math.random() < .6);
            l.classList.toggle('gl', Math.random() < .35);
        });
    };

    const cr = document.querySelector('.crayon');
    const ct = document.querySelector('.cut');
    const cl = document.querySelector('.clay');
    if (!cr || !ct || !cl) return;
    split(cr);
    split(ct);
    split(cl);
    crayon(cr);
    cut(ct);
    clay(cl);

    if (rm) return;

    const slides = [...document.querySelectorAll('.rot .slide')];
    let i = 0;
    setInterval(() => {
        i = (i + 1) % slides.length;
        if (slides[i].contains(ct)) cut(ct);
        if (slides[i].contains(cr)) crayon(cr);
        if (slides[i].contains(cl)) clay(cl);
        slides.forEach((s, k) => s.classList.toggle('on', k === i));
    }, 4200);
})();