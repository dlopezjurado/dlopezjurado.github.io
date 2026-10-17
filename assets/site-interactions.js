(()=>{'use strict';
const assetBase=new URL('.',document.currentScript.src);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-carousel]').forEach(root=>{
 const slides=[...root.querySelectorAll('[data-slide]')],dots=[...root.querySelectorAll('[data-slide-to]')];
 const pause=root.querySelector('[data-carousel-pause]'),count=root.querySelector('[data-slide-count]'),status=root.querySelector('[data-carousel-status]');
 let index=0,paused=reduced.matches,hover=false,focused=false,visible=false,timer=null,touch=null;
 const schedule=()=>{clearInterval(timer);timer=null;if(!paused&&!hover&&!focused&&visible&&!document.hidden)timer=setInterval(()=>show((index+1)%slides.length,false),5500)};
 function show(next,manual){index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==index);dots.forEach((dot,i)=>{if(i===index)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});count.textContent=`${index+1} / ${slides.length}`;status.setAttribute('aria-live',manual?'polite':'off');status.textContent=`Imagen ${index+1} de ${slides.length}: ${slides[index].querySelector('img').alt}`;schedule()}
 const updatePause=()=>{pause.textContent=paused?'Reanudar':'Pausar';pause.setAttribute('aria-pressed',String(paused));schedule()};
 root.querySelector('[data-prev]').addEventListener('click',()=>show(index-1,true));root.querySelector('[data-next]').addEventListener('click',()=>show(index+1,true));dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i,true)));
 pause.addEventListener('click',()=>{paused=!paused;updatePause()});
 root.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;schedule()}});root.addEventListener('pointerleave',()=>{hover=false;schedule()});
 root.addEventListener('focusin',()=>{focused=true;schedule()});root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget)){focused=false;schedule()}});
 root.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1),true)}});
 const view=root.querySelector('.carousel-viewport');view.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touch=[event.clientX,event.clientY]});view.addEventListener('pointerup',event=>{if(touch){const dx=event.clientX-touch[0],dy=event.clientY-touch[1];if(Math.abs(dx)>45&&Math.abs(dy)<45)show(index+(dx<0?1:-1),true);touch=null}});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.2}).observe(root);else visible=true;
 document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;updatePause()}});updatePause();root.dataset.carouselReady='true';
});
const waveNodes=[...document.querySelectorAll('[data-waves]')];if(!waveNodes.length)return;
let vendorPromise;
function script(name){return new Promise((resolve,reject)=>{const node=document.createElement('script');node.src=new URL(name,assetBase).href;node.onload=resolve;node.onerror=reject;document.head.append(node)})}
function vendors(){if(!vendorPromise)vendorPromise=script('vendor/three.r134.min.js').then(()=>script('vendor/vanta.waves.0.5.24.min.js'));return vendorPromise}
waveNodes.forEach(el=>{
 const toggle=el.closest('.wave-shell').querySelector('[data-waves-toggle]');let paused=reduced.matches,visible=false,effect=null,loading=false,failed=false;
 function stop(){if(effect){effect.destroy();effect=null}el.dataset.motion='paused'}
 async function sync(){toggle.textContent=failed?'Animación no disponible':paused?'Activar animación':'Pausar animación';toggle.setAttribute('aria-pressed',String(paused));if(paused||!visible||document.hidden||failed){stop();return}if(effect||loading)return;loading=true;try{await vendors();if(paused||!visible||document.hidden)return;effect=window.VANTA.WAVES({el,THREE:window.THREE,mouseControls:true,touchControls:false,gyroControls:false,minHeight:160,minWidth:200,scale:1.5,scaleMobile:2,color:0x496e72,shininess:16,waveHeight:13,waveSpeed:.35,zoom:.85});el.dataset.motion='running'}catch(error){failed=true;toggle.textContent='Animación no disponible';toggle.disabled=true;el.dataset.motion='fallback'}finally{loading=false}}
 toggle.addEventListener('click',()=>{paused=!paused;sync()});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{rootMargin:'120px',threshold:0}).observe(el);else visible=true;
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;sync()}});window.addEventListener('pagehide',stop);sync();
});
})();
