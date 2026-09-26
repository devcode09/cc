/* ===== SMART MATCHING ENGINE =====
   Mirrors the conceptual C scoring model (see c/matching_algorithm.c) in JS
   so the interactive UI can display live compatibility percentages. */

const WEIGHTS = { interest:40, year:20, branch:10, mode:20, availability:10 };

function computeCompatibility(a,b){
  let score=0; const reasons=[];

  // Interest overlap
  const shared = a.interests.filter(i=>b.interests.includes(i));
  const interestScore = Math.min(1, shared.length/4) * WEIGHTS.interest;
  score += interestScore;
  shared.slice(0,4).forEach(i=>reasons.push(`✦ You both like ${i}`));

  // Academic year proximity
  const yearDiff = Math.abs(a.year-b.year);
  let yearScore=0;
  if(yearDiff===0){yearScore=WEIGHTS.year;reasons.push(`📚 Same academic year (Year ${a.year})`);}
  else if(yearDiff===1){yearScore=WEIGHTS.year*0.5;}
  score += yearScore;

  // Branch match
  if(a.branch===b.branch){score+=WEIGHTS.branch;reasons.push(`🎓 Same branch: ${a.branch}`);}

  // Mode / lookingFor overlap
  const modeOverlap = a.lookingFor.filter(m=>b.lookingFor.includes(m));
  if(modeOverlap.length){score+=WEIGHTS.mode;reasons.push(`💜 Both open to ${modeOverlap[0]}`);}

  // Availability heuristic (both share the word "evening"/"library"/time bucket)
  if(a.availability && b.availability){
    const aw=a.availability.toLowerCase(), bw=b.availability.toLowerCase();
    const commonTokens=["library","evening","afternoon","weekend","hostel"];
    if(commonTokens.some(t=>aw.includes(t)&&bw.includes(t))){
      score+=WEIGHTS.availability; reasons.push("🕒 Overlapping free time");
    }
  }

  const pct = Math.round(Math.min(98, Math.max(32, score)));
  return {percent:pct, reasons: reasons.length?reasons:["✨ New connection — explore their profile!"]};
}

function filterByYearMode(students, myYear, mode){
  // mode: 'strict' | 'flexible' | 'all'
  if(mode==='all') return students;
  if(mode==='strict') return students.filter(s=>s.year===myYear);
  return students.filter(s=>Math.abs(s.year-myYear)<=1); // flexible
}

function rankByCompatibility(me, pool){
  return pool
    .map(s=>({student:s, ...computeCompatibility(me,s)}))
    .sort((a,b)=>b.percent-a.percent);
}