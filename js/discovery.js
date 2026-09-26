/* ===== SWIPE DISCOVERY ENGINE ===== */
const Discovery = {
  mode:'Dating', yearMode:'flexible', queue:[], history:[], me:null,

  init(){
    this.me = CC.currentUser();
    this.buildQueue();
    this.renderDeck();
    this.bindActions();
  },

  buildQueue(){
    const pool = getOtherStudents(this.me.id);
    let filtered = filterByYearMode(pool, this.me.year, this.yearMode)
      .filter(s=>s.lookingFor.includes(this.mode) || this.mode==='Study Buddy' && s.lookingFor.includes('Study Buddy'));
    if(filtered.length<3) filtered = filterByYearMode(pool,this.me.year,'all'); // fallback so deck isn't empty
    this.queue = rankByCompatibility(this.me, filtered);
  },

  renderDeck(){
    const wrap=document.getElementById('deckWrap');
    if(!this.queue.length){
      wrap.innerHTML=`<div class="empty-state glass"><div class="em">🌙</div>
        <h3>No matches yet</h3><p>Try expanding your preferences or switching mode.</p></div>`;
      return;
    }
    wrap.innerHTML='';
    this.queue.slice(0,4).reverse().forEach((entry,idx)=>{
      const card=document.createElement('div');
      card.className='swipe-card';
      card.style.zIndex=idx;
      card.style.transform=`scale(${1-((this.queue.slice(0,4).length-1-idx)*0.03)}) translateY(${(this.queue.slice(0,4).length-1-idx)*10}px)`;
      const s=entry.student;
      card.innerHTML=`
        <div class="photo-area"><div class="avatar avatar-xl" style="background:${s.avatarBg}">${s.initials}</div></div>
        <div class="stamp like">LIKE</div><div class="stamp nope">NOPE</div>
        <div class="info">
          <span class="compat-pill">✨ ${entry.percent}% Compatible</span>
          <h3>${s.name}, Y${s.year}</h3>
          <div class="meta">${s.branch} · ${s.campus} campus ${s.verified?'· ✓ Verified':''}</div>
          <div class="tag-cloud">${s.interests.slice(0,4).map(i=>`<span class="tag active">${i}</span>`).join('')}</div>
        </div>`;
      wrap.appendChild(card);
      if(idx===this.queue.slice(0,4).length-1) this.makeDraggable(card, entry);
    });
  },

  makeDraggable(card, entry){
    let startX=0, currentX=0, dragging=false;
    const like=card.querySelector('.stamp.like'), nope=card.querySelector('.stamp.nope');
    const start=(x)=>{dragging=true;startX=x;card.style.transition='none';};
    const move=(x)=>{
      if(!dragging) return;
      currentX=x-startX;
      card.style.transform=`translateX(${currentX}px) rotate(${currentX/18}deg)`;
      like.style.opacity=Math.max(0,currentX/100);
      nope.style.opacity=Math.max(0,-currentX/100);
    };
    const end=()=>{
      if(!dragging) return; dragging=false;
      card.style.transition='transform .3s ease';
      if(currentX>120) this.decide(card, entry, 'like');
      else if(currentX<-120) this.decide(card, entry, 'pass');
      else { card.style.transform='translateX(0) rotate(0)'; like.style.opacity=0; nope.style.opacity=0; }
      currentX=0;
    };
    card.addEventListener('mousedown',e=>start(e.clientX));
    window.addEventListener('mousemove',e=>move(e.clientX));
    window.addEventListener('mouseup',end);
    card.addEventListener('touchstart',e=>start(e.touches[0].clientX));
    card.addEventListener('touchmove',e=>move(e.touches[0].clientX));
    card.addEventListener('touchend',end);
  },

  decide(card, entry, action){
    const flyX = action==='like'?600:-600;
    card.style.transform=`translateX(${flyX}px) rotate(${flyX/12}deg)`;
    card.style.opacity='0';
    this.history.push({entry, action});
    this.queue = this.queue.filter(q=>q.student.id!==entry.student.id);
    setTimeout(()=>{
      this.renderDeck();
      if(action==='like' || action==='superlike'){
        // Deterministic "mutual like" demo: even-index compatibility over 70% = instant match for demo delight
        if(entry.percent>=70) showMatchAnimation(this.me, entry.student);
        else CC.toast(`💌 Liked ${entry.student.name}`);
      } else CC.toast('Passed');
    },320);
  },

  bindActions(){
    document.getElementById('btnPass').onclick=()=>this.actOnTop('pass');
    document.getElementById('btnLike').onclick=()=>this.actOnTop('like');
    document.getElementById('btnSuper').onclick=()=>this.actOnTop('superlike');
    document.getElementById('btnRewind').onclick=()=>{
      const last=this.history.pop();
      if(last){this.queue.unshift(last.entry); this.renderDeck(); CC.toast('↺ Rewound last swipe');}
      else CC.toast('Nothing to rewind');
    };
    document.querySelectorAll('.mode-switch button').forEach(btn=>{
      btn.onclick=()=>{
        document.querySelectorAll('.mode-switch button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); this.mode=btn.dataset.mode; this.buildQueue(); this.renderDeck();
      };
    });
    document.getElementById('yearModeSelect')?.addEventListener('change',e=>{
      this.yearMode=e.target.value; this.buildQueue(); this.renderDeck();
    });
  },

  actOnTop(action){
    if(!this.queue.length) return;
    const top=document.querySelector('.swipe-card:last-child');
    if(top) this.decide(top, this.queue[0], action);
  }
};