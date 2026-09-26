/* ===== SHARED APP SHELL: header, mobile nav, toasts, session, layout ===== */
const CC = {
  session:null,
  init(active){
    this.session = JSON.parse(localStorage.getItem('cc_session')||'null');
    if(!this.session && active!=='landing'){ window.location.href='index.html'; return; }
    this.renderHeader(active);
    this.renderMobileNav(active);
    this.bindGlobalUI();
  },
  currentUser(){ return this.session ? getStudentById(this.session.userId) : null; },

  renderHeader(active){
    const host=document.getElementById('site-header');
    if(!host) return;
    const user=this.currentUser();
    const nav=[
      ['home.html','Home'],['discover.html','Discover'],['matches.html','Matches'],
      ['messages.html','Messages'],['explore.html','Explore'],['groups.html','Groups'],
      ['profile.html','Profile'],['settings.html','Settings']
    ];
    host.innerHTML = `
      <a href="home.html" class="logo">💜 Campus<span class="gradient-text">Cupid</span></a>
      <nav class="nav-links">
        ${nav.map(([href,label])=>`<a href="${href}" class="${active===href?'active':''}">${label}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <div class="icon-btn" id="notifBtn">🔔<span class="dot"></span></div>
        <a href="profile.html" class="avatar avatar-sm" style="background:${user?user.avatarBg:'var(--grad-main)'}">${user?user.initials:'?'}</a>
      </div>`;
    document.getElementById('notifBtn')?.addEventListener('click',()=>CC.toast('🔔 3 new: match, like, daily picks ready.'));
  },

  renderMobileNav(active){
    const host=document.getElementById('mobile-nav');
    if(!host) return;
    const items=[
      ['home.html','🏠','Home'],['discover.html','🔥','Discover'],
      ['matches.html','💜','Matches'],['messages.html','💬','Chat'],['profile.html','👤','Profile']
    ];
    host.innerHTML=`<ul>${items.map(([href,ic,l])=>`
      <li><a href="${href}" class="${active===href?'active':''}"><span class="mi">${ic}</span>${l}</a></li>`).join('')}</ul>`;
  },

  toast(msg,type='default'){
    const c=document.getElementById('toast-container'); if(!c) return;
    const el=document.createElement('div');
    const bg = type==='success'?'linear-gradient(135deg,#34d399,#059669)':
               type==='error'?'linear-gradient(135deg,#fb7185,#e11d48)':'var(--glass-strong)';
    el.className='toast glass'; el.style.background=bg; el.style.border='1px solid var(--border)';
    el.textContent=msg; c.appendChild(el);
    setTimeout(()=>{el.style.opacity='0';el.style.transition='.3s';setTimeout(()=>el.remove(),300);},2800);
  },

  openSheet(id){document.getElementById(id)?.classList.add('open');document.getElementById(id+'-overlay')?.classList.add('open');},
  closeSheet(id){document.getElementById(id)?.classList.remove('open');document.getElementById(id+'-overlay')?.classList.remove('open');},
  openModal(id){document.getElementById(id)?.classList.add('open');},
  closeModal(id){document.getElementById(id)?.classList.remove('open');},

  bindGlobalUI(){
    document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>this.closeModal(b.dataset.closeModal)));
    document.querySelectorAll('[data-close-sheet]').forEach(b=>b.addEventListener('click',()=>this.closeSheet(b.dataset.closeSheet)));
  },

  profileCompletion(u){
    const checks=[u.photos>=1,u.prompts?.length>=1,u.interests?.length>=3,!!u.branch,u.lookingFor?.length>=1,!!u.availability,u.voice];
    return Math.round(checks.filter(Boolean).length/checks.length*100);
  },

  logout(){localStorage.removeItem('cc_session'); window.location.href='index.html';}
};

/* Lightweight canvas "constellation" particles for hero (no external libs) */
function initParticles(canvasId){
  const canvas=document.getElementById(canvasId); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let w,h,points=[];
  function resize(){w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight;}
  resize(); window.addEventListener('resize',resize);
  for(let i=0;i<50;i++) points.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3});
  function loop(){
    ctx.clearRect(0,0,w,h);
    points.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,7);ctx.fillStyle='rgba(236,113,220,.7)';ctx.fill();
    });
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
      const dx=points[i].x-points[j].x, dy=points[i].y-points[j].y, d=Math.hypot(dx,dy);
      if(d<120){ctx.strokeStyle=`rgba(168,85,247,${1-d/120})`;ctx.lineWidth=.6;
        ctx.beginPath();ctx.moveTo(points[i].x,points[i].y);ctx.lineTo(points[j].x,points[j].y);ctx.stroke();}
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* Global match celebration modal (used by discovery.js / explore) */
function showMatchAnimation(me, other){
  let root=document.getElementById('match-modal-root');
  if(!root){root=document.createElement('div');root.id='match-modal-root';document.body.appendChild(root);}
  root.innerHTML=`
   <div class="match-modal open" id="mm">
     <div class="match-content">
       <div class="hb">💜</div>
       <h1 class="gradient-text">IT'S A MATCH!</h1>
       <p class="text-muted" style="margin-bottom:20px;">You and ${other.name} both liked each other.</p>
       <div class="match-avatars">
         <div class="avatar avatar-xl" style="background:${me.avatarBg}">${me.initials}</div>
         <div class="avatar avatar-xl" style="background:${other.avatarBg}">${other.initials}</div>
       </div>
       <div class="hero-cta">
         <a href="messages.html?with=${other.id}" class="btn btn-primary">Send a Message</a>
         <button class="btn btn-outline" onclick="document.getElementById('mm').remove()">Keep Discovering</button>
       </div>
     </div>
   </div>`;
}