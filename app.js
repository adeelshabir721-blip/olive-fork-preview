(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],C=window.OF_CONFIG||{};
const nav=$('#nav');const onS=()=>nav.classList.toggle('solid',scrollY>40);addEventListener('scroll',onS,{passive:true});onS();
const slides=$$('.slide'),dots=$$('.dots button');let cur=0,timer;
const show=i=>{const s=slides[i];if(!s.getAttribute('src'))s.src=s.dataset.src;slides[cur].classList.remove('on');dots[cur]&&dots[cur].setAttribute('aria-selected','false');cur=i;s.classList.add('on');dots[i]&&dots[i].setAttribute('aria-selected','true')};
const auto=()=>{clearInterval(timer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show((cur+1)%slides.length),5500)};
dots.forEach(d=>d.addEventListener('click',()=>{show(+d.dataset.i);auto()}));
addEventListener('load',()=>{slides.slice(1).forEach((s,i)=>setTimeout(()=>{if(!s.getAttribute('src'))s.src=s.dataset.src},800+i*400));auto()});
const tabs=$$('.tab'),dishes=$$('.dish');
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>{x.classList.toggle('on',x===t);x.setAttribute('aria-selected',x===t)});const c=t.dataset.cat;dishes.forEach(d=>d.hidden=!(c==='all'||d.dataset.cat===c));$$('.cat-banner').forEach(b=>b.hidden=b.dataset.cat!==c);$$('.cat-hero').forEach(b=>b.hidden=b.dataset.cat!==c);$$('.cgrid').forEach(b=>b.hidden=c!=='all')}));
$$('.cgrid .cbanner').forEach(b=>b.addEventListener('click',()=>{const t=$('.tab[data-cat="'+b.dataset.go+'"]');if(t){t.click();t.scrollIntoView({block:'nearest',inline:'center'})}}));
const fail=i=>i.classList.add('failed');$$('img').forEach(i=>{i.addEventListener('error',()=>fail(i));if(i.complete&&i.getAttribute('src')&&!i.naturalWidth)fail(i)});
const car=$('#carousel');$$('.arrow').forEach(b=>b.addEventListener('click',()=>{const w=car.firstElementChild.getBoundingClientRect().width+18;car.scrollBy({left:w*+b.dataset.dir,behavior:'smooth'})}));
let ct=setInterval(()=>{if(document.hidden)return;const end=car.scrollLeft+car.clientWidth>=car.scrollWidth-4;car.scrollTo({left:end?0:car.scrollLeft+car.firstElementChild.getBoundingClientRect().width+18,behavior:'smooth'})},6000);
['pointerdown','focusin','wheel'].forEach(e=>car.addEventListener(e,()=>clearInterval(ct),{once:true}));
const f=$('#res-form'),msg=$('#form-msg'),dt=f.date;const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());dt.min=today.toISOString().slice(0,10);dt.value=dt.min;
const waLink=d=>'https://wa.me/'+C.whatsapp+'?text='+encodeURIComponent('Hi '+C.name+'! Table request:\nName: '+d.name+'\nPhone: '+d.phone+'\nDate: '+d.date+' at '+d.time+'\nGuests: '+d.guests+(d.notes?'\nNotes: '+d.notes:''));
f.addEventListener('submit',async e=>{e.preventDefault();msg.className='form-msg';if(!f.checkValidity()){msg.textContent='Please fill in name, a valid phone number, date and guests.';msg.classList.add('err');f.reportValidity();return}
if(f.company.value)return;const d=Object.fromEntries(new FormData(f));delete d.company;d.guests=+d.guests;const btn=f.querySelector('button');btn.disabled=true;msg.textContent='Sending…';
if(C.api){try{const r=await fetch(C.api.replace(/\/$/,'')+'/api/table-booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json().catch(()=>({}));if(r.ok){msg.textContent='Request received'+(j.bookingId?' (ref '+j.bookingId+')':'')+'. We\'ll confirm on WhatsApp shortly.';f.reset();dt.value=dt.min;btn.disabled=false;return}throw new Error(j.error||'Server error')}catch(err){msg.textContent='Online booking is busy — opening WhatsApp instead…'}}
else msg.textContent='Opening WhatsApp to confirm your table…';
setTimeout(()=>{window.open(waLink(d),'_blank','noopener');btn.disabled=false},500)});
})();