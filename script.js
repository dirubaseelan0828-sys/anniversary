document.documentElement.classList.add('js');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

// 1. Missing image? show its expected filename
$$('.ph img').forEach(img=>{
  const mark=()=>{img.parentElement.classList.add('missing');img.parentElement.dataset.label='📸 add '+img.getAttribute('src')};
  img.addEventListener('error',mark);
  if(img.complete&&img.naturalWidth===0)mark();
});

// 2. Floating hearts + cursor / tap sparkles
const box=$('#hearts');
function heart(size=14+Math.random()*18,dur=6+Math.random()*6){
  const h=document.createElement('span');h.className='heart';
  h.textContent=['❤','💗','💕','🌹'][Math.floor(Math.random()*4)];
  h.style.cssText=`left:${Math.random()*100}vw;font-size:${size}px;animation-duration:${dur}s`;
  box.appendChild(h);setTimeout(()=>h.remove(),dur*1000);
}
function spark(x,y,n){
  for(let i=0;i<n;i++){
    const s=document.createElement('span');s.className='trail';s.textContent='♥';
    const r=n>1?150:40;
    s.style.cssText=`left:${x}px;top:${y}px;--dx:${(Math.random()-.5)*r*2}px;--dy:${-20-Math.random()*r}px;color:${Math.random()<.5?'#ffd86b':'#e8a0b4'};font-size:${10+Math.random()*12}px`;
    document.body.appendChild(s);setTimeout(()=>s.remove(),1000);
  }
}
let last=0;
addEventListener('pointermove',e=>{const t=Date.now();if(t-last>70&&e.pointerType==='mouse'){last=t;spark(e.clientX,e.clientY,1)}});
addEventListener('pointerdown',e=>spark(e.clientX,e.clientY,8));

// 3. Envelope gate + music (music starts on the same tap)
const song=$('#song'),mBtn=$('#music');let opening=false;
function openGate(){
  if(opening)return;opening=true;
  $('#env').classList.add('opened');$('#open').hidden=true;
  song.volume=.85;
  const p=song.play();if(p&&p.then)p.then(()=>{mBtn.hidden=false;mBtn.classList.remove('off')}).catch(()=>{});
  setTimeout(()=>{
    $('#gate').classList.add('gone');document.body.classList.add('open');
    for(let i=0;i<14;i++)setTimeout(()=>heart(20+Math.random()*24,5+Math.random()*4),i*90);
    setInterval(heart,1400);
  },2300);
}
$('#open').addEventListener('click',openGate);
$('#env').addEventListener('click',openGate);
$('#env').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')openGate()});
mBtn.addEventListener('click',()=>{song.paused?song.play():song.pause();mBtn.classList.toggle('off',song.paused)});

// 4. Live counter since 24 Oct 2020
const start=new Date(2020,9,24),counter=$('#counter');
function tick(){
  const n=new Date();let y=n.getFullYear()-start.getFullYear(),m=n.getMonth()-start.getMonth(),d=n.getDate()-start.getDate();
  if(d<0){m--;d+=new Date(n.getFullYear(),n.getMonth(),0).getDate()}
  if(m<0){y--;m+=12}
  counter.innerHTML=[[y,'years'],[m,'months'],[d,'days'],[n.getHours(),'hours'],[n.getMinutes(),'minutes'],[n.getSeconds(),'seconds']]
    .map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('');
}
tick();setInterval(tick,1000);

// 5. Quotes: split into words for the reveal animation
$$('.words').forEach(b=>{b.innerHTML=b.textContent.trim().split(/\s+/).map((w,i)=>`<span style="--w:${i}">${w}</span>`).join(' ')});

// 6. Scroll reveal (sections, timeline chapters, quotes, gallery) + progress bar
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
$$('.reveal,.tl,.quote,.qsplit,.gal,.notes').forEach(el=>io.observe(el));
addEventListener('scroll',()=>{$('#bar').style.width=scrollY/(document.documentElement.scrollHeight-innerHeight)*100+'%'},{passive:true});

// 7. Then & Now slider (with a little auto-demo when it appears)
const cmp=$('#compare'),rg=$('#range');let demo=false;
const setPos=v=>{cmp.style.setProperty('--pos',v+'%');rg.value=v};
rg.addEventListener('input',()=>{demo=false;setPos(rg.value)});
new IntersectionObserver(([e],o)=>{if(!e.isIntersecting)return;o.disconnect();demo=true;const t0=performance.now();
  (function f(t){if(!demo)return;const k=(t-t0)/2800;if(k>1)return setPos(50);setPos(50+40*Math.sin(k*Math.PI*2));requestAnimationFrame(f)})(t0)},{threshold:.5}).observe(cmp);

// 8. Letter: envelope opens, letter slides out, then paragraphs appear one by one
const lEnv=$('#letterEnv'),eWrap=$('#envwrap');
function openLetter(){
  const b=$('#readLetter');if(b.hidden)return;
  b.hidden=true;lEnv.classList.add('opened');
  setTimeout(()=>eWrap.classList.add('away'),2200);
  setTimeout(()=>{
    eWrap.hidden=true;const w=$('#paperWrap');w.hidden=false;
    $$('#paper p').forEach((p,i)=>p.style.setProperty('--i',i));
    w.scrollIntoView({behavior:'smooth',block:'start'});
  },2900);
}
$('#readLetter').addEventListener('click',openLetter);
lEnv.addEventListener('click',openLetter);
lEnv.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')openLetter()});

// 9. Poem cards flip on tap
$$('.flip').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('on')));

// 10. Lightbox for memories
const lb=$('#lb');
$$('.pol').forEach(p=>p.addEventListener('click',()=>{
  const img=p.querySelector('img');if(img.parentElement.classList.contains('missing'))return;
  lb.querySelector('img').src=img.src;lb.querySelector('p').textContent=p.querySelector('figcaption').textContent;lb.classList.add('on');
}));
lb.addEventListener('click',()=>lb.classList.remove('on'));

// 11. Final surprise
$('#burst').addEventListener('click',()=>{
  const o=$('#iloveyou');o.classList.add('on');
  for(let i=0;i<70;i++)setTimeout(()=>heart(20+Math.random()*34,3+Math.random()*4),i*55);
  setTimeout(()=>o.classList.remove('on'),4800);
});
