/* ===== CAMPUS CUPID — MOCK DATA LAYER =====
   Provides in-memory data so the prototype works even without a server (file://).
   Structured to mirror /data/*.json so a real backend could swap in later. */

const INTERESTS = {
  Entertainment:["Music","Movies","Anime","Netflix","K-pop","Photography"],
  Lifestyle:["Gym","Travel","Food","Fashion","Gaming"],
  Technology:["Coding","AI","Startups","Cybersecurity","Web Dev"],
  Sports:["Cricket","Football","Basketball","Badminton","Running"],
  Creative:["Drawing","Writing","Dance","Singing","Video Editing"]
};

const PROMPTS_BANK = [
  "My 3 AM thought is...","Mess food I'd fight for...","My perfect weekend looks like...",
  "One thing I could talk about for hours...","The quickest way to become my friend...",
  "My most random talent...","My comfort movie is...","The first thing I'd do after exams...",
  "One thing on my college bucket list...","Ask me about..."
];

function initials(name){return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();}
function hue(seed){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))%360;return h;}
function avatarGradient(name){const h=hue(name);return `linear-gradient(135deg,hsl(${h},80%,55%),hsl(${(h+70)%360},80%,55%))`;}

const STUDENTS = [
  {id:"UPES001",name:"Aarav Mehta",campus:"Bidholi",year:2,course:"B.Tech",branch:"CSE",hostel:"Hosteler",
   interests:["Coding","Gym","Music","Startups"],lookingFor:["Friendship","Study Buddy"],
   prompts:[{q:"My most random talent...",a:"I can solve a rubik's cube while explaining recursion."},
            {q:"My perfect weekend looks like...",a:"Gym, chai, and a 2 AM debugging session."}],
   zodiac:"Leo",mbti:"ENTP",loveLanguage:"Quality Time",verified:true,
   availability:"Free today 4–6 PM · Library",bio:"CSE junior, caffeine-powered.",photos:3,voice:true},

  {id:"UPES002",name:"Ishita Rao",campus:"Kandoli",year:2,course:"B.Des",branch:"Product Design",hostel:"Day Scholar",
   interests:["Drawing","Photography","K-pop","Travel"],lookingFor:["Dating","Friendship"],
   prompts:[{q:"My comfort movie is...",a:"Kal Ho Naa Ho, don't judge me."},
            {q:"Ask me about...",a:"My Pinterest boards, I have 40+."}],
   zodiac:"Libra",mbti:"INFP",loveLanguage:"Words of Affirmation",verified:true,
   availability:"Free evenings after 6 PM",bio:"Design nerd who overthinks fonts.",photos:4,voice:false},

  {id:"UPES003",name:"Kabir Singh",campus:"Bidholi",year:3,course:"B.Tech",branch:"CSE",hostel:"Hosteler",
   interests:["Cricket","Coding","Gaming","AI"],lookingFor:["Study Buddy","Networking"],
   prompts:[{q:"One thing I could talk about for hours...",a:"Why our mess menu needs a UI redesign."}],
   zodiac:"Aries",mbti:"ISTP",loveLanguage:"Acts of Service",verified:true,
   availability:"Free 2–4 PM · Academic Block",bio:"Backend dev, cricket all-rounder.",photos:2,voice:true},

  {id:"UPES004",name:"Ananya Verma",campus:"Kandoli",year:1,course:"BBA",branch:"Marketing",hostel:"Hosteler",
   interests:["Dance","Fashion","Netflix","Food"],lookingFor:["Friendship","Dating"],
   prompts:[{q:"Mess food I'd fight for...",a:"Chole bhature Fridays. Non-negotiable."}],
   zodiac:"Gemini",mbti:"ESFJ",loveLanguage:"Physical Touch",verified:true,
   availability:"Free most evenings",bio:"1st year figuring out campus life.",photos:5,voice:true},

  {id:"UPES005",name:"Rohan Malhotra",campus:"Bidholi",year:2,course:"B.Tech",branch:"Mechanical",hostel:"Day Scholar",
   interests:["Football","Gym","Movies","Travel"],lookingFor:["Friendship","Study Buddy"],
   prompts:[{q:"The first thing I'd do after exams...",a:"Road trip to Rishikesh, no plans."}],
   zodiac:"Sagittarius",mbti:"ESTP",loveLanguage:"Quality Time",verified:false,
   availability:"Free weekends",bio:"Mechanical engineer, weekend traveller.",photos:3,voice:false},

  {id:"UPES006",name:"Meher Kapoor",campus:"Kandoli",year:2,course:"B.Tech",branch:"CSE",hostel:"Hosteler",
   interests:["Coding","Anime","Writing","Music"],lookingFor:["Study Buddy","Friendship"],
   prompts:[{q:"My 3 AM thought is...",a:"What if arrays were sentient."}],
   zodiac:"Aquarius",mbti:"INTJ",loveLanguage:"Quality Time",verified:true,
   availability:"Free 4–6 PM · Library",bio:"CP grinder & anime binger.",photos:3,voice:true},

  {id:"UPES007",name:"Vivaan Chauhan",campus:"Bidholi",year:4,course:"B.Tech",branch:"Electronics",hostel:"Hosteler",
   interests:["Startups","AI","Badminton","Cybersecurity"],lookingFor:["Networking","Study Buddy"],
   prompts:[{q:"One thing on my college bucket list...",a:"Ship a startup before graduating."}],
   zodiac:"Capricorn",mbti:"ENTJ",loveLanguage:"Acts of Service",verified:true,
   availability:"Free late evenings",bio:"Final year, building things.",photos:2,voice:false},

  {id:"UPES008",name:"Sanya Bhatt",campus:"Kandoli",year:1,course:"B.Des",branch:"Fashion",hostel:"Day Scholar",
   interests:["Fashion","Dance","Photography","Music"],lookingFor:["Dating","Friendship"],
   prompts:[{q:"My most random talent...",a:"I can name any song in 2 seconds."}],
   zodiac:"Pisces",mbti:"ISFP",loveLanguage:"Words of Affirmation",verified:true,
   availability:"Free afternoons",bio:"Fashion first-year, always sketching.",photos:4,voice:true},

  {id:"UPES009",name:"Dev Prakash",campus:"Bidholi",year:3,course:"B.Tech",branch:"CSE",hostel:"Hosteler",
   interests:["Coding","Cricket","Gaming","Gym"],lookingFor:["Study Buddy","Friendship"],
   prompts:[{q:"Ask me about...",a:"My competitive programming rating (don't ask actually)."}],
   zodiac:"Virgo",mbti:"ISTJ",loveLanguage:"Quality Time",verified:true,
   availability:"Free 5–7 PM · Hostel Common Room",bio:"3rd year, DSA obsessed.",photos:2,voice:true},

  {id:"UPES010",name:"Kyra D'Souza",campus:"Kandoli",year:2,course:"BBA",branch:"Finance",hostel:"Hosteler",
   interests:["Travel","Food","Netflix","Running"],lookingFor:["Friendship","Dating"],
   prompts:[{q:"My perfect weekend looks like...",a:"Cafe hopping in Dehradun with good playlists."}],
   zodiac:"Taurus",mbti:"ENFJ",loveLanguage:"Quality Time",verified:true,
   availability:"Free weekends & evenings",bio:"Finance major, foodie at heart.",photos:5,voice:false},

  {id:"UPES011",name:"Arjun Nair",campus:"Bidholi",year:2,course:"B.Tech",branch:"CSE",hostel:"Day Scholar",
   interests:["Coding","Music","Badminton","AI"],lookingFor:["Study Buddy","Dating"],
   prompts:[{q:"The quickest way to become my friend...",a:"Beat me at badminton. You won't."}],
   zodiac:"Scorpio",mbti:"INTP",loveLanguage:"Quality Time",verified:true,
   availability:"Free 4–6 PM · Sports Complex",bio:"CSE, badminton, lo-fi playlists.",photos:3,voice:true},

  {id:"UPES012",name:"Naina Joshi",campus:"Kandoli",year:1,course:"B.Tech",branch:"CSE",hostel:"Hosteler",
   interests:["Writing","Anime","Drawing","Coding"],lookingFor:["Friendship","Study Buddy"],
   prompts:[{q:"My comfort movie is...",a:"Spirited Away. Always."}],
   zodiac:"Cancer",mbti:"INFJ",loveLanguage:"Words of Affirmation",verified:false,
   availability:"Free evenings · Library",bio:"1st year, still finding my people.",photos:3,voice:false},
];

STUDENTS.forEach(s=>{s.initials=initials(s.name);s.avatarBg=avatarGradient(s.name);});

// The "logged-in" demo personas an examiner can pick from
const DEMO_PERSONAS = ["UPES001","UPES002","UPES006"];

function getStudentById(id){return STUDENTS.find(s=>s.id===id);}
function getOtherStudents(excludeId){return STUDENTS.filter(s=>s.id!==excludeId);}