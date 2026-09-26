import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { animated, useSpring, useTransition } from 'https://esm.sh/@react-spring/web@9.7.5?deps=react@18.3.1,react-dom@18.3.1';

const h = React.createElement;

function AccreditationIsland(){
  const cards=[
    {k:'UNCCD',t:'Observer accreditation',d:'Formal access to the UN Convention to Combat Desertification process.'},
    {k:'UN Water 2026',t:'Special accreditation',d:'Accredited to attend the 2026 United Nations Water Conference.'},
    {k:'Sri Lanka',t:'Home base',d:'Local programmes and field priorities remain the starting point.'}
  ];
  const [active,setActive]=useState(0);
  const spring=useSpring({transform:`translateY(${active*2}px)`,config:{tension:240,friction:24}});
  return h(animated.div,{className:'accreditation-cards',style:spring},cards.map((c,i)=>h(animated.button,{key:c.k,type:'button',className:'accreditation-card',onMouseEnter:()=>setActive(i),onFocus:()=>setActive(i),style:{borderColor:i===active?'rgba(231,163,62,.62)':'rgba(255,255,255,.13)',textAlign:'left',color:'inherit',cursor:'default'}},h('div',null,h('span',null,c.k),h('b',null,c.t),h('p',{style:{margin:'5px 0 0',fontSize:'12px'}},c.d)),h('span',null,String(i+1).padStart(2,'0'))))));
}

const cats={
  Ocean:new Set(['sea-turtles','blue-whales','sea-lions','clownfish','jellyfish','dolphins','seahorses','sawsharks']),
  Land:new Set(['polar-bears','cheetahs','rhinos','north-african-ostrich','gorillas','wild-horses','foxes','bears','kangaroos','lions']),
  Other:new Set(['snakes'])
};
function SpeciesApp(){
  const data=window.CUTEFELA_SPECIES||[]; const [filter,setFilter]=useState('All');
  const shown=useMemo(()=>filter==='All'?data:data.filter(s=>cats[filter]?.has(s.slug)),[data,filter]);
  const transitions=useTransition(shown,{keys:s=>s.slug,from:{opacity:0,transform:'translateY(16px) scale(.985)'},enter:{opacity:1,transform:'translateY(0) scale(1)'},leave:{opacity:0,transform:'translateY(-8px) scale(.985)'},trail:32,config:{tension:280,friction:26}});
  return h(React.Fragment,null,
    h('div',{className:'species-filter','aria-label':'Filter species'},['All','Ocean','Land','Other'].map(x=>h('button',{type:'button',key:x,className:x===filter?'is-active':'',onClick:()=>setFilter(x)},x))),
    h('div',{className:'species-grid'},transitions((style,s)=>h(animated.a,{style,className:'species-card',href:`species/${s.slug}.html`},h('h2',null,s.name),h('p',null,s.tagline),h('small',null,s.status))))
  );
}

const accred=document.getElementById('spring-accreditation'); if(accred) createRoot(accred).render(h(AccreditationIsland));
const species=document.getElementById('species-app'); if(species) createRoot(species).render(h(SpeciesApp));
