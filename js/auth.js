/* ===== AUTH / DEMO MODE ===== */
function ccStartDemo(personaId){
  const id = personaId || DEMO_PERSONAS[Math.floor(Math.random()*DEMO_PERSONAS.length)];
  localStorage.setItem('cc_session', JSON.stringify({userId:id, loggedInAt:Date.now()}));
  window.location.href='home.html';
}

function ccMockRegister(e){
  e.preventDefault();
  const email=document.getElementById('regEmail').value;
  if(!email.endsWith('@upes.ac.in')){
    document.getElementById('regError').textContent='Please use your official @upes.ac.in email.';
    return false;
  }
  document.getElementById('regError').style.color='var(--success)';
  document.getElementById('regError').textContent='✔ Verification link sent! (Simulated) Redirecting to demo profile...';
  setTimeout(()=>ccStartDemo(),1400);
  return false;
}

function ccMockLogin(e){
  e.preventDefault();
  CC?.toast?.('Simulated login — starting demo session.');
  ccStartDemo();
  return false;
}