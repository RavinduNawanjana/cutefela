(() => {
  'use strict';
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navigation
  const header = $('[data-header]');
  const menuBtn = $('[data-menu-button]');
  const mobileMenu = $('[data-mobile-menu]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 20);
  updateHeader(); addEventListener('scroll', updateHeader, {passive:true});
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileMenu?.classList.toggle('is-open', open);
  });
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    menuBtn?.setAttribute('aria-expanded','false'); mobileMenu?.classList.remove('is-open');
  }));

  // Reliable local video autoplay + viewport pause
  const videos = $$('[data-autoplay-video]');
  if (!reduce) {
    videos.forEach(v => { v.muted = true; v.playsInline = true; const tryPlay=()=>v.play().catch(()=>{}); if(v.readyState>=2) tryPlay(); else v.addEventListener('canplay',tryPlay,{once:true}); });
    if ('IntersectionObserver' in window) {
      const vo = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(()=>{}); else e.target.pause();
      }), {rootMargin:'120px 0px',threshold:.05});
      videos.forEach(v=>vo.observe(v));
    }
  } else videos.forEach(v=>v.pause());
  $$('[data-video-control]').forEach(btn => btn.addEventListener('click', () => {
    const hero = btn.closest('.hero'); const v = hero?.querySelector('video'); if(!v) return;
    if(v.paused){v.play().catch(()=>{});btn.textContent='Pause motion'}else{v.pause();btn.textContent='Play motion'}
  }));

  // GSAP scroll choreography
  if (!reduce && window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.set('[data-reveal], .section-intro, .editorial-card, .phase-card, .work-card', {willChange:'transform,opacity'});
    $$('.section-intro, .editorial-card, .phase-card, .work-card, .proposal-feature, .media-card').forEach((el,i)=>{
      gsap.from(el,{y:34,opacity:0,duration:.82,ease:'power3.out',scrollTrigger:window.ScrollTrigger?{trigger:el,start:'top 88%',once:true}:undefined,delay:window.ScrollTrigger?0:Math.min(i*.03,.3)});
    });
    $$('.conference-mosaic figure, .logo-wall figure, .sdg-tile').forEach(el => gsap.from(el,{y:24,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    const orbit=$('.hero-orbit'); if(orbit) gsap.to(orbit,{rotation:22,scale:1.08,duration:14,repeat:-1,yoyo:true,ease:'sine.inOut'});
    const bg=$('.footer-bg-word'); const footer=$('[data-footer]');
    footer?.addEventListener('pointermove',e=>{const r=footer.getBoundingClientRect(); gsap.to(bg,{x:((e.clientX-r.left)/r.width-.5)*-22,y:((e.clientY-r.top)/r.height-.5)*-13,duration:.6,ease:'power2.out',overwrite:true})});
  }

  // Anime.js: split hero text + gentle logo pulse
  if (!reduce && window.anime) {
    $$('.split-text').forEach((el,idx)=>{
      if(el.dataset.splitDone) return; el.dataset.splitDone='1';
      const txt=el.textContent.trim(); el.setAttribute('aria-label',txt);
      el.innerHTML=txt.split(/(\s+)/).map(x=>/^\s+$/.test(x)?x:`<span class="word" aria-hidden="true">${x}</span>`).join('');
      anime({targets:el.querySelectorAll('.word'),opacity:[0,1],translateY:[30,0],delay:anime.stagger(42,{start:120+idx*30}),duration:900,easing:'easeOutExpo'});
    });
    anime({targets:'.brand img',translateY:[0,-3,0],duration:4800,loop:true,easing:'easeInOutSine'});
  }

  // Footer theme + rotating word + leaves
  const footer = $('[data-footer]');
  const themeButton = $('[data-theme-toggle]');
  if (footer) {
    const hour = new Date().getHours(); footer.classList.toggle('is-day', hour>=6 && hour<18);
    themeButton?.addEventListener('click',()=>footer.classList.toggle('is-day'));
    const words=['matter','count','grow','protect','restore','travel further']; let wi=0; const word=$('[data-rotate-word]');
    if(word && !reduce) setInterval(()=>{wi=(wi+1)%words.length;if(window.anime){anime({targets:word,opacity:[1,0],translateY:[0,7],duration:180,easing:'easeInQuad',complete:()=>{word.textContent=words[wi];anime({targets:word,opacity:[0,1],translateY:[-7,0],duration:260,easing:'easeOutQuad'})}})}else word.textContent=words[wi]},2600);
    const layer=$('[data-leaves]'); let timer=null, queue=[];
    const leaf=()=>{if(!layer||reduce)return;const n=document.createElement('span');n.className='leaf';n.textContent=['🍃','🍂','∙'][Math.floor(Math.random()*3)];const x=2+Math.random()*96, drift=(Math.random()-.5)*120, rot=(Math.random()-.5)*300, dur=4400+Math.random()*2600;n.style.left=x+'%';n.style.fontSize=(10+Math.random()*15)+'px';n.style.opacity='.82';layer.appendChild(n);queue.push(n);if(window.gsap){gsap.fromTo(n,{y:-30,x:0,rotation:0,opacity:0},{y:Math.max(430,footer.clientHeight-90-Math.random()*70),x:drift,rotation:rot,opacity:.76,duration:dur/1000,ease:'power1.inOut'})}else{n.animate([{transform:'translateY(-30px)',opacity:0},{transform:`translate(${drift}px,${footer.clientHeight-100}px) rotate(${rot}deg)`,opacity:.75}],{duration:dur,fill:'forwards'})}n.addEventListener('click',()=>{n.style.opacity='0';setTimeout(()=>n.remove(),200)});if(queue.length>34){const old=queue.shift();old?.remove()}};
    if('IntersectionObserver'in window&&!reduce){const fo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!timer){leaf();timer=setInterval(leaf,520)}else if(!e.isIntersecting&&timer){clearInterval(timer);timer=null}}),{threshold:.05});fo.observe(footer)}
  }

  // Brief drawer
  const drawer=$('[data-brief-drawer]'), overlay=$('[data-brief-overlay]');
  const openDrawer=()=>{drawer?.classList.add('is-open');overlay?.classList.add('is-open');drawer?.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>drawer?.querySelector('input,textarea,button')?.focus(),120)};
  const closeDrawer=()=>{drawer?.classList.remove('is-open');overlay?.classList.remove('is-open');drawer?.setAttribute('aria-hidden','true');document.body.style.overflow=''};
  $$('[data-open-brief]').forEach(b=>b.addEventListener('click',openDrawer)); $('[data-close-brief]')?.addEventListener('click',closeDrawer); overlay?.addEventListener('click',closeDrawer); addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});

  // AJAX Web3Forms (falls back to normal form submit if fetch fails before a response)
  $$('[data-contact-form]').forEach(form=>form.addEventListener('submit',async e=>{
    e.preventDefault();const status=form.querySelector('[data-form-status]');const submit=form.querySelector('button[type=submit]');
    const original=submit?.innerHTML;if(submit){submit.disabled=true;submit.textContent='Sending…'} if(status){status.textContent='';status.className='form-status'}
    try{const fd=new FormData(form);const res=await fetch(form.action,{method:'POST',body:fd,headers:{Accept:'application/json'}});const data=await res.json().catch(()=>({}));if(!res.ok||data.success===false)throw new Error(data.message||'Could not send your message.');form.reset();if(status){status.textContent='Thanks — your enquiry has been sent.';status.classList.add('is-ok')}}catch(err){if(status){status.textContent='We could not send this right now. Please email contact@cutefela.com.';status.classList.add('is-error')}}finally{if(submit){submit.disabled=false;submit.innerHTML=original}}
  }));
})();
