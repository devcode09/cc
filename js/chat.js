/* ===== CHAT SYSTEM (localStorage-backed mock) ===== */
const Chat = {
  me:null, activeId:null, conversations:[],

  init(){
    this.me = CC.currentUser();
    this.conversations = this.loadMatches();
    this.renderList();
    const params=new URLSearchParams(location.search);
    const withId = params.get('with') || this.conversations[0]?.id;
    if(withId) this.open(withId);
  },

  loadMatches(){
    // Demo: treat first 5 other students as existing matches
    return getOtherStudents(this.me.id).slice(0,5);
  },

  storageKey(otherId){ return `cc_chat_${this.me.id}_${otherId}`; },

  getMessages(otherId){
    const raw = localStorage.getItem(this.storageKey(otherId));
    if(raw) return JSON.parse(raw);
    const seed=[
      {from:otherId, text:"Heyy! Saw we matched 👀", time:this.now()},
      {from:this.me.id, text:"Haha hi! Loved your prompt about mess food 😂", time:this.now()}
    ];
    localStorage.setItem(this.storageKey(otherId), JSON.stringify(seed));
    return seed;
  },

  now(){return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});},

  renderList(){
    const list=document.getElementById('chatList');
    list.innerHTML = this.conversations.map(s=>`
      <div class="chat-list-item ${s.id===this.activeId?'active':''}" data-id="${s.id}">
        <div class="avatar avatar-md" style="background:${s.avatarBg}">${s.initials}</div>
        <div>
          <div class="name">${s.name}</div>
          <div class="preview">${s.verified?'✓ ':''}${s.branch} · Y${s.year}</div>
        </div>
      </div>`).join('');
    list.querySelectorAll('.chat-list-item').forEach(el=>el.onclick=()=>this.open(el.dataset.id));
  },

  open(id){
    this.activeId=id; this.renderList();
    const other=getStudentById(id);
    document.getElementById('chatHead').innerHTML=`
      <div class="avatar avatar-md" style="background:${other.avatarBg}">${other.initials}</div>
      <div><div style="font-weight:700">${other.name}</div><div class="text-dim" style="font-size:.75rem;">Active recently</div></div>
      <div style="margin-left:auto;display:flex;gap:8px;">
        <button class="icon-btn" title="Unmatch" onclick="Chat.unmatch('${id}')">⛔</button>
        <button class="icon-btn" title="Report" onclick="CC.toast('🚩 Report submitted (mock)')">🚩</button>
      </div>`;
    this.renderMessages();
    document.getElementById('chatForm').onsubmit=(e)=>{e.preventDefault(); this.send();};
    document.getElementById('chatList').classList.remove('show');
  },

  renderMessages(){
    const box=document.getElementById('chatBody');
    const msgs=this.getMessages(this.activeId);
    box.innerHTML = msgs.map(m=>`
      <div class="bubble ${m.from===this.me.id?'me':'them'}">${m.text}<span class="time">${m.time}</span></div>
    `).join('');
    box.scrollTop=box.scrollHeight;
  },

  send(){
    const input=document.getElementById('chatInput');
    const text=input.value.trim(); if(!text) return;
    const msgs=this.getMessages(this.activeId);
    msgs.push({from:this.me.id, text, time:this.now()});
    localStorage.setItem(this.storageKey(this.activeId), JSON.stringify(msgs));
    input.value=''; this.renderMessages();
    this.showTyping();
    setTimeout(()=>{
      const replies=["Haha totally!","Same tbh 😭","Wait really?","Let's plan something!","Ooh tell me more","Lol true"];
      msgs.push({from:this.activeId, text:replies[Math.floor(Math.random()*replies.length)], time:this.now()});
      localStorage.setItem(this.storageKey(this.activeId), JSON.stringify(msgs));
      this.hideTyping(); this.renderMessages();
    },1400);
  },

  showTyping(){
    const box=document.getElementById('chatBody');
    const t=document.createElement('div'); t.className='bubble them'; t.id='typingBubble';
    t.innerHTML=`<div class="typing-dots"><span></span><span></span><span></span></div>`;
    box.appendChild(t); box.scrollTop=box.scrollHeight;
  },
  hideTyping(){document.getElementById('typingBubble')?.remove();},

  unmatch(id){
    this.conversations = this.conversations.filter(c=>c.id!==id);
    localStorage.removeItem(this.storageKey(id));
    CC.toast('Unmatched. They will not be notified.');
    this.renderList();
    document.getElementById('chatHead').innerHTML='';
    document.getElementById('chatBody').innerHTML='';
  }
};