import { animate, hover, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  hover('.motion-card', (el) => {
    animate(el, { y: -6, scale: 1.012 }, { duration: .22, easing: 'ease-out' });
    return () => animate(el, { y: 0, scale: 1 }, { duration: .28, easing: 'ease-out' });
  });
  hover('.magnetic', (el) => {
    animate(el, { y: -3, scale: 1.02 }, { duration: .18, easing: 'ease-out' });
    return () => animate(el, { y: 0, scale: 1 }, { duration: .34, easing: 'ease-out' });
  });
  inView('.initiative-feature', (el) => {
    const parts = el.querySelectorAll('.initiative-media, h3, p, .text-link');
    animate(parts, { opacity:[0,1], y:[24,0] }, { delay:stagger(.08), duration:.58, easing:'ease-out' });
  }, { amount:.18 });
  inView('.conference-timeline article', (el) => {
    animate(el, { opacity:[0,1], x:[-20,0] }, { duration:.5, easing:'ease-out' });
  }, { amount:.25 });
}
