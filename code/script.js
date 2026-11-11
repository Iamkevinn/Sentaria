const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false') }
});
const steps = document.querySelectorAll('.steps details');
steps.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) steps.forEach(o => { if (o !== d) o.open = false });
}));
const header=document.querySelector('.top');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
let raf=0;
const stop=()=>cancelAnimationFrame(raf);
['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,stop,{passive:true}));
const targetY=el=>{
if(el.id==='inicio')return 0;
const top=el.getBoundingClientRect().top+scrollY;
const pad=parseFloat(getComputedStyle(el).paddingTop)||0;
const hb=header.offsetHeight+12;
const y=Math.max(top-24,top+pad-hb-20);
return Math.min(y,document.documentElement.scrollHeight-innerHeight);
};
const glide=y=>{
stop();
const from=scrollY,dist=y-from;
if(reduceMotion||Math.abs(dist)<2){scrollTo({top:y,behavior:'instant'});return}
const dur=Math.min(1200,Math.max(600,Math.abs(dist)*.5));
const t0=performance.now();
const step=now=>{
const p=Math.min(1,(now-t0)/dur);
scrollTo({top:from+dist*ease(p),behavior:'instant'});
if(p<1)raf=requestAnimationFrame(step);
};
raf=requestAnimationFrame(step);
};
document.addEventListener('click',e=>{
const a=e.target.closest('a[href^="#"]');
if(!a)return;
const id=a.getAttribute('href').slice(1);
const el=id&&document.getElementById(id);
if(!el)return;
e.preventDefault();
glide(targetY(el));
history.pushState(null,'','#'+id);
el.setAttribute('tabindex','-1');
el.focus({preventScroll:true});
});