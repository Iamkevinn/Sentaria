(() => {
    const L = document.getElementById('loader');
    if (!L) return;
    const root = document.documentElement;
    const mark = document.getElementById('mark');
    const stage = document.getElementById('stage');
    const row = document.getElementById('letters');
    const dice = document.getElementById('dice');
    const letters = [...row.children];
    const wrap = document.createElement('div');
    wrap.className = 'markwrap';
    mark.parentNode.insertBefore(wrap, mark);
    wrap.appendChild(mark);
    const CUT = 1;
    const DICE = { x: .4894, y: .07, w: .142 };
    const ROW = 1, GAP = 0;
    const STOPS = [0, 3, 7];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const ready = i => i.complete ? Promise.resolve() : new Promise(r => { i.onload = i.onerror = r });
    const tf = (x, y, r = 0, s = 1) => `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${r}deg) scale(${s})`;
    let done = false;
    const finish = () => { if (done) return; done = true; L.classList.add('out'); root.classList.remove('loading'); setTimeout(() => L.remove(), 350) };
    document.getElementById('skip').onclick = finish;
    root.classList.add('loading');
    setTimeout(finish, 14000);
    const layout = () => {
        const m = mark.getBoundingClientRect();
        wrap.style.height = m.height * CUT + 'px';
        const gap = m.width * GAP;
        const sum = letters.reduce((s, i) => s + i.naturalWidth, 0);
        if (sum) { const k = (m.width * ROW - gap * (letters.length - 1)) / sum; letters.forEach(i => { i.style.width = i.naturalWidth * k + 'px' }) }
        row.style.gap = gap + 'px';
        dice.style.width = m.width * DICE.w + 'px';
        L.classList.add('ready');
    };
    const landing = el => {
        const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
        return { x: r.left - s.left + r.width / 2, y: r.top - s.top - dice.offsetHeight / 2 + 2 };
    };
    const target = () => {
        const s = stage.getBoundingClientRect(), m = mark.getBoundingClientRect();
        return { x: m.left - s.left + DICE.x * m.width, y: m.top - s.top + DICE.y * m.height };
    };
    const hop = (a, b, h, dur, r0, r1) => dice.animate([
        { transform: tf(a.x, a.y, r0), easing: 'cubic-bezier(.3,.7,.4,1)' },
        { transform: tf((a.x + b.x) / 2, Math.min(a.y, b.y) - h, (r0 + r1) / 2), easing: 'cubic-bezier(.6,0,.7,.3)' },
        { transform: tf(b.x, b.y, r1) }
    ], { duration: dur, fill: 'forwards' }).finished;
    const bounce = l => l.animate([
        { transform: 'none' },
        { transform: 'translateY(4%) scale(1.05,.9)', offset: .25 },
        { transform: 'translateY(-9%) scale(.98,1.04)', offset: .6 },
        { transform: 'none' }
    ], { duration: 380, easing: 'ease-out' });
    const run = async () => {
        await Promise.all([mark, dice, ...letters].map(ready));
        layout();
        const mw = mark.getBoundingClientRect().width;
        if (reduce) {
            letters.forEach(l => { l.style.opacity = 1 });
            const t = target(); dice.style.opacity = 1; dice.style.transform = tf(t.x, t.y);
            await wait(900); return finish();
        }
        const t0 = target();
        dice.style.transform = tf(t0.x, t0.y);
        dice.style.opacity = 1;
        await Promise.all([mark, dice].map(e => e.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450 }).finished));
        letters.forEach((l, i) => l.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 350, delay: i * 70, fill: 'both', easing: 'ease-out' }));
        await wait(letters.length * 70 + 450);
        const spots = letters.map(landing);
        let cur = t0;
        let r = 0;
        for (const i of STOPS) {
            const nr = r + 360;
            await hop(cur, spots[i], mw * .11, i ? 400 : 460, r, nr);
            bounce(letters[i]);
            cur = spots[i]; r = nr;
        }
        await hop(cur, target(), mw * .35, 850, r, r + 720);
        await wait(200);
        finish();
    };
    run().catch(finish);
})();