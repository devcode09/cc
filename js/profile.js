/* ===== PROFILE RENDERER ===== */
const ProfileView = {
  student:null, isMe:false,
  init(){
    const params=new URLSearchParams(location.search);
    const id = params.get('id') || CC.session.userId;
    this.student = getStudentById(id);
    this.isMe = id===CC.session.userId;
    this.render();
    this.bindTabs();
  },
  render(){
    const s=this.student, me=CC.currentUser();
    const compat = this.isMe? null : computeCompatibility(me,s);
    document.getElementById('profileRoot').innerHTML=`
      <div class="profile-hero glass fade-in">
        <div class="profile-photo-col">
          <div class="avatar avatar-xl" style="background:${s.avatarBg};margin:0 auto;">${s.initials}
            ${s.verified?'<div class="verified-badge">✓</div>':''}
          </div>
          ${this.isMe?`<div style="margin-top:16px;">
            <p class="text-dim" style="font-size:.8rem;margin-bottom:6px;">Profile ${CC.profileCompletion(s)}% complete</p>
            <div class="progress-bar"><div style="width:${CC.profileCompletion(s)}%"></div></div>
          </div>`:`<div class="hero-cta" style="margin-top:18px;">
            <button class="btn btn-primary btn-sm" onclick="CC.toast('💌 Like sent!')">Send Like</button>
            <button class="btn btn-outline btn-sm" onclick="CC.toast('⭐ Super Like sent!')">Super Like</button>
          </div>`}
        </div>
        <div>
          <h1 class="profile-name">${s.name} ${s.verified?'<span class="badge badge-verified">✓ Verified</span>':''}</h1>
          <p class="profile-meta">Year ${s.year} · ${s.branch} · ${s.campus} Campus · ${s.hostel}</p>
          ${compat?`<span class="compat-pill" style="font-size:.9rem;">✨ ${compat.percent}% Compatible</span>
            <div class="glass" style="padding:16px 20px;margin:14px 0;">
              <strong style="font-size:.85rem;">Why you matched</strong>
              <ul style="margin-top:8px;font-size:.85rem;color:var(--text-1);">${compat.reasons.map(r=>`<li style="padding:3px 0;">${r}</li>`).join('')}</ul>
            </div>`:''}
          <p class="text-muted" style="margin:14px 0;">${s.bio}</p>
          <p style="font-weight:700;font-size:.85rem;">Looking for: <span class="text-muted" style="font-weight:500;">${s.lookingFor.join(' • ')}</span></p>
          <p style="font-weight:700;font-size:.85rem;margin-top:6px;">🕒 ${s.availability}</p>
        </div>
      </div>

      <div class="tab-strip" style="margin-top:34px;">
        <button data-tab="about" class="active">About</button>
        <button data-tab="prompts">Prompts</button>
        <button data-tab="photos">Photos</button>
        <button data-tab="voice">Voice</button>
      </div>
      <div id="tabContent"></div>
    `;
    this.renderTab('about');
  },
  bindTabs(){
    document.querySelectorAll('.tab-strip button').forEach(btn=>{
      btn.onclick=()=>{
        document.querySelectorAll('.tab-strip button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); this.renderTab(btn.dataset.tab);
      };
    });
  },
  renderTab(tab){
    const s=this.student; const el=document.getElementById('tabContent');
    if(tab==='about'){
      el.innerHTML=`<div class="tag-cloud fade-in">${s.interests.map(i=>`<span class="tag active">${i}</span>`).join('')}</div>
      <div class="glass" style="padding:20px;margin-top:20px;">
        <p style="font-size:.85rem;"><strong>Zodiac:</strong> ${s.zodiac} &nbsp;·&nbsp; <strong>MBTI:</strong> ${s.mbti} &nbsp;·&nbsp; <strong>Love language:</strong> ${s.loveLanguage}</p>
      </div>`;
    } else if(tab==='prompts'){
      el.innerHTML = s.prompts.map(p=>`<div class="prompt-card glass fade-in"><div class="q">${p.q}</div><div class="a">"${p.a}"</div></div>`).join('') 
        || `<div class="empty-state"><div class="em">📝</div>No prompts added yet.</div>`;
    } else if(tab==='photos'){
      el.innerHTML=`<div class="gallery fade-in">${Array.from({length:s.photos}).map((_,i)=>`<div class="ph" style="background:${s.avatarBg};opacity:${1-(i*0.12)}">📸</div>`).join('')}</div>`;
    } else if(tab==='voice'){
      el.innerHTML = s.voice ? `<div class="audio-player glass fade-in">
          <button class="btn-icon btn-primary" onclick="CC.toast('▶ Playing voice note (mock)')">▶</button>
          <div style="flex:1;"><div class="progress-bar"><div style="width:35%"></div></div>
          <p class="text-dim" style="font-size:.75rem;margin-top:6px;">"Tell people something about yourself" · 0:12 / 0:30</p></div>
        </div>` : `<div class="empty-state"><div class="em">🎙️</div>No voice prompt recorded.</div>`;
    }
  }
};