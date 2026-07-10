const firebaseConfig = {
  apiKey: "AIzaSyDkHMnxngyfeUES5HfR7u8vNI9njmVvj3c",
  authDomain: "usa-visa-assistant.firebaseapp.com",
  projectId: "usa-visa-assistant",
  storageBucket: "usa-visa-assistant.firebasestorage.app",
  messagingSenderId: "10902149878",
  appId: "1:10902149878:web:072d17040c05e6b6bd2ad7",
  measurementId: "G-YT7LM28WNS"
};

let db = null;
let auth = null;
let firebaseReady = false;
const ADMIN_EMAIL = "badri.bagagoshvili@gmail.com";
try {
  if (window.firebase) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    firebaseReady = true;
  }
} catch (e) {
  console.warn("Firebase unavailable, local mode active", e);
}

const STORAGE_KEY = "usaVisaAdvisorV5Applicants";
const app = document.getElementById("app");
let step = 0;
let answers = {};
let lastResult = null;
let interviewIndex = 0;
let interviewAnswers = [];

function trackEvent(name, params = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch (error) {
    console.warn("Analytics event failed", error);
  }
}

const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];
const clone = id => document.getElementById(id).innerHTML;

const sections = [
  {
    eyebrow:"ეტაპი 1", title:"პირადი და საკონტაქტო ინფორმაცია", subtitle:"ძირითადი მონაცემები",
    fields:[
      f("fullName","text","სახელი და გვარი",true),
      f("phone","tel","ტელეფონის ნომერი",true),
      f("email","email","ელფოსტა",false),
      f("age","select","ასაკი",true,[["18_24","18-24"],["25_30","25-30"],["31_45","31-45"],["46_60","46-60"],["60_plus","60+"]]),
      f("marital","radio","ოჯახური მდგომარეობა",true,[["single","დასაოჯახებელი"],["married","დაოჯახებული"],["divorced","განქორწინებული"],["widowed","ქვრივი"]]),
      f("children","radio","გყავთ შვილები?",true,[["yes","დიახ"],["no","არა"]])
    ]
  },
  {
    eyebrow:"ეტაპი 2", title:"დასაქმება და პროფესიული სტაბილურობა", subtitle:"ხანგრძლივობა რეალისტურ შეფასებაში დიდ გავლენას ახდენს",
    fields:[
      f("employment","radio","თქვენი სტატუსი",true,[["employed","დასაქმებული"],["self","თვითდასაქმებული / ბიზნესი"],["student_employed","სტუდენტი და დასაქმებული"],["student","სტუდენტი"],["unemployed","დაუსაქმებელი"],["retired","პენსიონერი"]]),
      f("jobYears","select","რამდენი წელია მუშაობთ მიმდინარე საქმიანობაში?",true,[["under_6m","6 თვეზე ნაკლები"],["6_12m","6-12 თვე"],["1_3y","1-3 წელი"],["3_5y","3-5 წელი"],["5_10y","5-10 წელი"],["10_plus","10 წელზე მეტი"]]),
      f("jobTitle","text","თანამდებობა / საქმიანობა",false),
      f("monthlyIncome","select","თვიური შემოსავალი",true,[["under_1000","1000 ლარზე ნაკლები"],["1000_3000","1000-3000 ლარი"],["3000_6000","3000-6000 ლარი"],["6000_10000","6000-10000 ლარი"],["10000_plus","10000+ ლარი"]]),
      f("incomeProof","radio","შეგიძლიათ შემოსავლის დადასტურება?",true,[["yes","დიახ"],["partial","ნაწილობრივ"],["no","არა"]])
    ]
  },
  {
    eyebrow:"ეტაპი 3", title:"ფინანსები და აქტივები", subtitle:"მოგზაურობის დაფინანსების რეალურობა",
    fields:[
      f("bankFunds","select","დაახლოებით რა თანხა გაქვთ ხელმისაწვდომი მოგზაურობისთვის?",true,[["under_1000","1000 ლარზე ნაკლები"],["1000_5000","1000-5000 ლარი"],["5000_10000","5000-10000 ლარი"],["10000_30000","10000-30000 ლარი"],["30000_plus","30000+ ლარი"]]),
      f("property","select","უძრავი ქონება",true,[["none","არ მაქვს"],["one","ერთი ქონება"],["multiple","რამდენიმე ქონება"]]),
      f("business","radio","გაქვთ საკუთარი ბიზნესი ან კომპანიის წილი?",true,[["yes","დიახ"],["no","არა"]]),
      f("sponsor","radio","ვინ აფინანსებს მოგზაურობას?",true,[["self","მე თვითონ"],["family","ოჯახის წევრი"],["company","კომპანია"],["other","სხვა"]])
    ]
  },
  {
    eyebrow:"ეტაპი 4", title:"მოგზაურობის ისტორია", subtitle:"რაოდენობა და ბოლო წლების აქტივობა",
    fields:[
      f("countryCount","select","რამდენ ქვეყანაში ხართ ნამყოფი?",true,[["0","არც ერთში"],["1_2","1-2 ქვეყანაში"],["3_5","3-5 ქვეყანაში"],["6_10","6-10 ქვეყანაში"],["10_plus","10-ზე მეტ ქვეყანაში"]]),
      f("recentTravel","radio","ბოლო 2 წელში იმოგზაურეთ?",true,[["yes","დიახ"],["no","არა"]]),
      f("strongVisas","multi","რომელი ვიზები ან ვიზიტები გქონიათ?",false,[["schengen","შენგენი"],["uk","დიდი ბრიტანეთი"],["canada","კანადა"],["australia","ავსტრალია"],["japan","იაპონია"],["usa","აშშ"]]),
      f("overstay","radio","ოდესმე გადააცილეთ დაშვებულ ყოფნის ვადას?",true,[["yes","დიახ"],["no","არა"]])
    ]
  },
  {
    eyebrow:"ეტაპი 5", title:"ამერიკის სავიზო ისტორია", subtitle:"წინა ვიზები და უარები",
    fields:[
      f("hadUsVisa","radio","გქონიათ ადრე აშშ-ის ვიზა?",true,[["yes","დიახ"],["no","არა"]]),
      f("refusalCount","select","რამდენჯერ გქონდათ აშშ-ის ვიზაზე უარი?",true,[["0","არც ერთხელ"],["1","ერთხელ"],["2","ორჯერ"],["3_plus","სამჯერ ან მეტჯერ"]]),
      f("lastRefusalChange","textarea","თუ უარი გქონდათ, რა შეიცვალა მას შემდეგ?",false)
    ]
  },
  {
    eyebrow:"ეტაპი 6", title:"ოჯახის წევრი ამერიკაში", subtitle:"უპასუხეთ მხოლოდ სიმართლე",
    fields:[
      f("usFamily","radio","გყავთ ოჯახის წევრი აშშ-ში?",true,[["no","არა"],["yes_legal","დიახ, ლეგალურად იმყოფება"],["yes_illegal","დიახ, არალეგალურად იმყოფება"]]),
      f("familyRelation","select","ნათესაობა",false,[["none","არ ეხება"],["parent","მშობელი"],["sibling","და/ძმა"],["child","შვილი"],["spouse","მეუღლე"],["other","სხვა ნათესავი"]])
    ]
  },
  {
    eyebrow:"ეტაპი 7", title:"მოგზაურობის გეგმა", subtitle:"კონკრეტულობა და რეალურობა",
    fields:[
      f("purpose","select","მოგზაურობის მიზანი",true,[["tourism","ტურიზმი"],["family","ოჯახის/ნათესავის მონახულება"],["business","ბიზნესი"],["event","ღონისძიება / კონფერენცია"],["medical","სამედიცინო"],["other","სხვა"]]),
      f("duration","select","რამდენი დღით მიდიხართ?",true,[["1_7","1-7 დღე"],["8_14","8-14 დღე"],["15_30","15-30 დღე"],["31_60","31-60 დღე"],["60_plus","60 დღეზე მეტი"]]),
      f("cities","text","რომელი ქალაქების მონახულებას გეგმავთ?",true),
      f("stayPlace","select","სად დარჩებით?",true,[["hotel","სასტუმრო"],["airbnb","Airbnb / ნაქირავები ბინა"],["relative","ნათესავთან"],["friend","მეგობართან"],["other","სხვა"]]),
      f("returnReason","textarea","რატომ დაბრუნდებით თქვენს ქვეყანაში?",true)
    ]
  },
  {
    eyebrow:"ეტაპი 8", title:"თანხმობა და დასრულება", subtitle:"მონაცემების დამუშავება",
    fields:[
      f("helpNeeded","radio","გსურთ კონსულტაცია?",true,[["yes","დიახ"],["no","არა"]]),
      f("consent","checkbox","ვეთანხმები ჩემი მონაცემების დამუშავებას შეფასებისა და საკონსულტაციო მომსახურების მიზნით.",true)
    ]
  }
];

function f(id,type,label,required,options=[]){ return {id,type,label,required,options}; }

document.getElementById("homeBtn").onclick = renderHome;
document.getElementById("adminBtn").onclick = openAdminAccess;
qsa("[data-go-home]").forEach(el => el.onclick = renderHome);


function openAdminAccess(){
  if(!firebaseReady || !auth){
    alert("Admin ავტორიზაცია ამ მომენტში მიუწვდომელია.");
    return;
  }
  const user = auth.currentUser;
  if(user && user.email === ADMIN_EMAIL){
    renderAdmin();
    return;
  }
  const modal = document.getElementById("adminLoginModal");
  modal.classList.remove("hidden");
  const emailEl = document.getElementById("adminEmail");
  const passEl = document.getElementById("adminPassword");
  const errorEl = document.getElementById("adminLoginError");
  emailEl.value = "";
  passEl.value = "";
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
  setTimeout(()=>emailEl.focus(), 50);
}

document.getElementById("cancelAdminLogin").onclick = ()=>{
  document.getElementById("adminLoginModal").classList.add("hidden");
};

document.getElementById("submitAdminLogin").onclick = async ()=>{
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;
  const errorEl = document.getElementById("adminLoginError");
  errorEl.classList.add("hidden");

  if(email !== ADMIN_EMAIL){
    errorEl.textContent = "ამ ელფოსტას Admin წვდომა არ აქვს.";
    errorEl.classList.remove("hidden");
    return;
  }

  try{
    await auth.signInWithEmailAndPassword(email, password);
    document.getElementById("adminLoginModal").classList.add("hidden");
    renderAdmin();
  }catch(e){
    errorEl.textContent = "ელფოსტა ან პაროლი არასწორია.";
    errorEl.classList.remove("hidden");
  }
};

if(window.firebase){
  setTimeout(()=>{
    if(auth){
      auth.onAuthStateChanged(()=>{});
    }
  },0);
}

function renderHome(){
  trackEvent("home_view");
  app.innerHTML = clone("homeTemplate");
  qsa("[data-action='assessment']",app).forEach(b=>b.onclick=()=>{step=0;answers={};renderAssessment();});
  qsa("[data-action='interview']",app).forEach(b=>b.onclick=startInterview);
  qsa("[data-action='ds160']",app).forEach(b=>b.onclick=renderDs160);
  renderLeaderboards();
}

function renderLeaderboards(){
  const list = getApplicants();
  const today = new Date().toDateString();
  const todays = list.filter(x => new Date(x.createdAt || 0).toDateString() === today);
  const source = todays.length ? todays : list;
  const top = [...source].sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,5);
  const low = [...source].sort((a,b)=>(a.score||0)-(b.score||0)).slice(0,5);
  const row = r => `<div class="leader-row"><span>${maskName(r.fullName||"აპლიკანტი")}</span><span class="leader-score">${r.score||0}/100</span></div>`;
  qs("#topList",app).innerHTML = top.length ? top.map(row).join("") : `<p class="muted">ჯერ მონაცემები არ არის.</p>`;
  qs("#lowList",app).innerHTML = low.length ? low.map(row).join("") : `<p class="muted">ჯერ მონაცემები არ არის.</p>`;
}

function maskName(name){
  const parts = name.trim().split(/\s+/);
  return parts.map((p,i)=> i===0 ? p : `${p[0]||""}.`).join(" ");
}

function renderAssessment(){
  if(step === 0) trackEvent("assessment_start");
  app.innerHTML = clone("assessmentTemplate");
  const s = sections[step];
  qs("#stepLabel",app).textContent = `ეტაპი ${step+1} / ${sections.length}`;
  const pct = Math.round((step+1)/sections.length*100);
  qs("#percentLabel",app).textContent = pct+"%";
  qs("#progressBar",app).style.width = pct+"%";
  qs("#sectionEyebrow",app).textContent = s.eyebrow;
  qs("#sectionTitle",app).textContent = s.title;
  qs("#sectionSubtitle",app).textContent = s.subtitle;

  const box = qs("#fields",app);
  s.fields.forEach(field=>box.appendChild(renderField(field)));

  qs("#prevBtn",app).style.visibility = step===0 ? "hidden" : "visible";
  qs("#prevBtn",app).onclick = ()=>{captureVisible();step--;renderAssessment();};
  qs("#nextBtn",app).textContent = step===sections.length-1 ? "შედეგის ნახვა" : "შემდეგი";
  qs("#nextBtn",app).onclick = ()=>{
    if(!collectAndValidate()) return;
    if(step < sections.length-1){ step++; renderAssessment(); }
    else finishAssessment();
  };
}

function renderField(field){
  const wrap = document.createElement("div");
  wrap.className = "field";
  const label = document.createElement("label");
  label.textContent = field.label + (field.required ? " *" : "");
  wrap.appendChild(label);

  if(["text","tel","email"].includes(field.type)){
    const input=document.createElement("input"); input.type=field.type; input.id=field.id; input.value=answers[field.id]||"";
    input.oninput=()=>answers[field.id]=input.value.trim(); wrap.appendChild(input);
  } else if(field.type==="textarea"){
    const ta=document.createElement("textarea"); ta.id=field.id; ta.rows=4; ta.value=answers[field.id]||"";
    ta.oninput=()=>answers[field.id]=ta.value.trim(); wrap.appendChild(ta);
  } else if(field.type==="select"){
    const sel=document.createElement("select"); sel.id=field.id;
    sel.innerHTML=`<option value="">აირჩიეთ</option>`;
    field.options.forEach(([v,l])=>{const o=document.createElement("option");o.value=v;o.textContent=l;sel.appendChild(o);});
    sel.value=answers[field.id]||""; sel.onchange=()=>answers[field.id]=sel.value; wrap.appendChild(sel);
  } else if(field.type==="radio"){
    const box=document.createElement("div");box.className="options";
    field.options.forEach(([v,l])=>{
      const b=document.createElement("button");b.type="button";b.className="option"+(answers[field.id]===v?" selected":"");b.textContent=l;
      b.onclick=()=>{answers[field.id]=v;qsa(".option",box).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");};
      box.appendChild(b);
    });wrap.appendChild(box);
  } else if(field.type==="multi"){
    const box=document.createElement("div");box.className="options";
    const current = new Set(answers[field.id]||[]);
    field.options.forEach(([v,l])=>{
      const b=document.createElement("button");b.type="button";b.className="option"+(current.has(v)?" selected":"");b.textContent=l;
      b.onclick=()=>{current.has(v)?current.delete(v):current.add(v);answers[field.id]=[...current];b.classList.toggle("selected");};
      box.appendChild(b);
    });wrap.appendChild(box);
  } else if(field.type==="checkbox"){
    const row=document.createElement("label");row.style.display="flex";row.style.gap="10px";row.style.alignItems="flex-start";
    const c=document.createElement("input");c.type="checkbox";c.id=field.id;c.checked=!!answers[field.id];c.style.width="22px";c.style.marginTop="2px";
    c.onchange=()=>answers[field.id]=c.checked; row.appendChild(c); const span=document.createElement("span");span.textContent=field.label;row.appendChild(span);
    wrap.innerHTML="";wrap.appendChild(row);
  }
  return wrap;
}

function captureVisible(){
  const s=sections[step]; if(!s) return;
  s.fields.forEach(field=>{
    const el=document.getElementById(field.id);
    if(!el) return;
    if(field.type==="checkbox") answers[field.id]=el.checked;
    else if(!["radio","multi"].includes(field.type)) answers[field.id]=el.value.trim();
  });
}

function collectAndValidate(){
  captureVisible();
  for(const field of sections[step].fields){
    const value=answers[field.id];
    const missing = field.type==="checkbox" ? value!==true : (field.required && (value===undefined || value==="" || value===null));
    if(missing){alert("გთხოვთ შეავსოთ აუცილებელი ველი: "+field.label);return false;}
  }
  return true;
}

function scoreAssessment(a){
  let score=52;
  const impacts=[], strong=[], risks=[];
  const cat={employment:50,travel:50,finance:50,ties:50,history:50};

  const add=(points,label,category,positiveText,negativeText)=>{
    score += points;
    cat[category] = clamp(cat[category] + points*2, 0, 100);
    impacts.push({label,points});
    if(points>0 && positiveText) strong.push(positiveText);
    if(points<0 && negativeText) risks.push(negativeText);
  };

  const jobMap={under_6m:-9,"6_12m":-5,"1_3y":3,"3_5y":7,"5_10y":11,"10_plus":15};
  add(jobMap[a.jobYears]||0,"მიმდინარე საქმიანობის ხანგრძლივობა","employment",
      a.jobYears==="10_plus"?"10 წელზე მეტი სტაბილური საქმიანობა":"დასაქმების სტაბილურობა",
      "მიმდინარე საქმიანობის მოკლე ისტორია");

  const employmentMap={employed:7,self:8,student_employed:5,student:-2,unemployed:-16,retired:1};
  add(employmentMap[a.employment]||0,"საქმიანობის სტატუსი","employment",
      ["employed","self","student_employed"].includes(a.employment)?"აქტიური პროფესიული ან ბიზნეს საქმიანობა":"სტაბილური სტატუსი",
      a.employment==="unemployed"?"დასაქმების არქონა ზრდის დამატებითი კითხვების ალბათობას":"პროფესიული სტატუსი დამატებით ახსნას მოითხოვს");

  const incMap={under_1000:-9,"1000_3000":-2,"3000_6000":6,"6000_10000":10,"10000_plus":14};
  add(incMap[a.monthlyIncome]||0,"თვიური შემოსავალი","finance","შემოსავალი შეესაბამება მოგზაურობის დაფინანსებას","დაბალი შემოსავალი მოგზაურობის ბიუჯეტთან შედარებით");

  const bankMap={under_1000:-10,"1000_5000":-4,"5000_10000":4,"10000_30000":8,"30000_plus":11};
  add(bankMap[a.bankFunds]||0,"ხელმისაწვდომი თანხა","finance","მოგზაურობისთვის ხელმისაწვდომი ფინანსური რესურსი","ხელმისაწვდომი თანხა შესაძლოა არასაკმარისად გამოიყურებოდეს");

  add(a.incomeProof==="yes"?7:a.incomeProof==="partial"?2:-8,"შემოსავლის დადასტურება","finance",
      "შემოსავლის დოკუმენტურად დადასტურება შეგიძლიათ","შემოსავლის დამადასტურებელი დოკუმენტი არ გაქვთ");

  const travelMap={"0":-15,"1_2":-7,"3_5":2,"6_10":10,"10_plus":18};
  add(travelMap[a.countryCount]||0,"მოგზაურობის ქვეყნების რაოდენობა","travel",
      a.countryCount==="10_plus"?"10-ზე მეტ ქვეყანაში მოგზაურობის გამოცდილება":"მოგზაურობის გამოცდილება",
      "მოგზაურობის ისტორია შეზღუდულია");

  add(a.recentTravel==="yes"?5:-3,"ბოლო 2 წლის მოგზაურობა","travel","ბოლო წლებში საერთაშორისო მოგზაურობა გაქვთ","ბოლო წლებში მოგზაურობის აქტივობა არ ჩანს");
  const strongVisas=(a.strongVisas||[]).length;
  if(strongVisas) add(Math.min(strongVisas*2,10),"ძლიერი ვიზები/ვიზიტები","travel","სხვა ქვეყნების ვიზებისა და ვიზიტების გამოცდილება",null);

  if(a.overstay==="yes") add(-22,"ნებადართული ვადის გადაცილება","history",null,"ვადის გადაცილება მნიშვნელოვანი რისკის ფაქტორია და ზუსტ ახსნას მოითხოვს");
  if(a.hadUsVisa==="yes") add(7,"წინა აშშ-ის ვიზა","history","წინა აშშ-ის ვიზის ისტორია",null);

  const refusalMap={"0":4,"1":-6,"2":-13,"3_plus":-20};
  add(refusalMap[a.refusalCount]||0,"აშშ-ის ვიზაზე უარების რაოდენობა","history",
      a.refusalCount==="0"?"წინა უარი არ გაქვთ":null,
      a.refusalCount!=="0"?"წინა უარი ან უარები საჭიროებს მკაფიო და ნამდვილ ახსნას":null);

  if(a.usFamily==="yes_illegal") add(-14,"აშშ-ში არალეგალურად მყოფი ოჯახის წევრი","ties",null,"აშშ-ში არალეგალურად მყოფი ოჯახის წევრი შეიძლება გახდეს დამატებითი შეკითხვების საფუძველი");
  if(a.usFamily==="yes_legal") impacts.push({label:"აშშ-ში ლეგალურად მყოფი ოჯახის წევრი",points:0});

  if(a.property==="one") add(4,"უძრავი ქონება","ties","უძრავი ქონება სამშობლოსთან კავშირს აძლიერებს",null);
  if(a.property==="multiple") add(7,"რამდენიმე უძრავი ქონება","ties","რამდენიმე უძრავი ქონება","",null);
  if(a.business==="yes") add(8,"საკუთარი ბიზნესი","ties","საკუთარი ბიზნესი ან კომპანიის წილი",null);
  if(a.marital==="married") add(4,"ოჯახური მდგომარეობა","ties","ოჯახური კავშირები",null);
  if(a.children==="yes") add(5,"შვილები","ties","შვილებთან დაკავშირებული ოჯახური კავშირები",null);

  const durationMap={"1_7":5,"8_14":4,"15_30":0,"31_60":-7,"60_plus":-14};
  add(durationMap[a.duration]||0,"ვიზიტის ხანგრძლივობა","history",
      ["1_7","8_14"].includes(a.duration)?"კონკრეტული და შედარებით მოკლე ვიზიტი":"ვიზიტის ხანგრძლივობა რეალისტურია",
      ["31_60","60_plus"].includes(a.duration)?"ხანგრძლივი ვიზიტი შესაძლოა დამატებით კითხვებს იწვევდეს":null);

  if((a.returnReason||"").length>=45) add(5,"დაბრუნების მიზეზის აღწერა","ties","დაბრუნების მიზეზი კონკრეტულად გაქვთ აღწერილი",null);
  else add(-5,"დაბრუნების მიზეზის აღწერა","ties",null,"დაბრუნების მიზეზი ზედმეტად მოკლე ან ზოგადია");

  if(a.sponsor==="self") add(4,"მოგზაურობის დაფინანსება","finance","მოგზაურობას თავად აფინანსებთ",null);
  if(a.sponsor==="other") add(-3,"მოგზაურობის დაფინანსება","finance",null,"დაფინანსების წყარო დამატებით დაზუსტებას საჭიროებს");

  score=clamp(Math.round(score),5,96);
  Object.keys(cat).forEach(k=>cat[k]=clamp(Math.round(cat[k]),5,98));

  const riskLevel = score>=78 ? "დაბალი რისკი" : score>=52 ? "საშუალო რისკი" : "მაღალი რისკი";
  const profile = score>=85 ? "ძლიერი და სტაბილური სავიზო პროფილი" :
                  score>=70 ? "კარგად მომზადებული სავიზო პროფილი" :
                  score>=52 ? "საშუალო მზადყოფნის სავიზო პროფილი" :
                  "დამატებით მოსამზადებელი სავიზო პროფილი";

  const questions = buildQuestions(a);
  const prep = buildPrep(a, risks);
  const confidence = 94;

  if(!strong.length) strong.push("კითხვარი სრულად და თანმიმდევრულად შეავსეთ");
  if(!risks.length) risks.push("ინტერვიუზე პასუხების სიზუსტე და მოკლედ გადმოცემა მაინც მნიშვნელოვანია");

  return {score,cat,impacts,strong:[...new Set(strong)],risks:[...new Set(risks)],riskLevel,profile,questions,prep,confidence};
}

function buildQuestions(a){
  const q=["რატომ გსურთ ამ კონკრეტულ პერიოდში ამერიკაში გამგზავრება?","ვინ აფინანსებს მოგზაურობას და რა არის დაგეგმილი ბიუჯეტი?","რატომ დაბრუნდებით მოგზაურობის დასრულების შემდეგ?"];
  if(a.refusalCount!=="0") q.push("რა შეიცვალა წინა უარის შემდეგ?");
  if(a.usFamily==="yes_illegal") q.push("რა სტატუსით იმყოფება თქვენი ოჯახის წევრი ამერიკაში და ვისთან გეგმავთ დარჩენას?");
  if(a.usFamily==="yes_legal") q.push("ვინ არის თქვენი ოჯახის წევრი ამერიკაში და რა სტატუსით იმყოფება?");
  if(a.countryCount==="0"||a.countryCount==="1_2") q.push("რატომ არის ამერიკა თქვენი პირველი ან ერთ-ერთი პირველი მნიშვნელოვანი საერთაშორისო მოგზაურობა?");
  if(a.employment==="unemployed") q.push("რა ფინანსური და პირადი საფუძველი გაქვთ მოგზაურობისთვის და დაბრუნებისთვის?");
  if(["31_60","60_plus"].includes(a.duration)) q.push("რატომ გჭირდებათ ასეთი ხანგრძლივი ვიზიტი?");
  q.push("რას საქმიანობთ და რამდენი ხანია?","რომელ ქალაქებში მიდიხართ და რას გეგმავთ ყოველდღიურად?");
  return q.slice(0,7);
}

function buildPrep(a, risks){
  const p=["გადაამოწმეთ DS-160-ის ყველა პასუხი და დარწმუნდით, რომ ინტერვიუს პასუხები ზუსტად ემთხვევა განაცხადს.","მოამზადეთ მოკლე, პირდაპირი და ფაქტობრივი პასუხები მოგზაურობის მიზანზე, დაფინანსებასა და დაბრუნების მიზეზზე."];
  if(a.refusalCount!=="0") p.push("მოამზადეთ ზუსტი პასუხი კითხვაზე: რა შეიცვალა წინა უარის შემდეგ?");
  if(a.incomeProof!=="yes") p.push("არსებობის შემთხვევაში, მოამზადეთ შემოსავლისა და საქმიანობის დამადასტურებელი რეალური დოკუმენტები.");
  if(a.usFamily!=="no") p.push("არ დამალოთ ოჯახის წევრი აშშ-ში; ზუსტად იცოდეთ ნათესაობა და მისი საიმიგრაციო სტატუსი.");
  if(["31_60","60_plus"].includes(a.duration)) p.push("გქონდეთ დასაბუთებული და რეალისტური ახსნა ხანგრძლივი ვიზიტისთვის.");
  p.push("არ გამოიყენოთ დაზეპირებული ან გამოგონილი პასუხები.");
  return [...new Set(p)].slice(0,6);
}

function clamp(n,min,max){return Math.max(min,Math.min(max,n));}

async function finishAssessment(){
  trackEvent("assessment_complete");
  const result=scoreAssessment(answers);
  lastResult=result;
  const record={...answers,score:result.score,riskLevel:result.riskLevel,createdAt:new Date().toISOString(),status:"New"};
  saveLocal(record);
  if(firebaseReady && db){
    try{await db.collection("applicants").add(record);}catch(e){console.warn("Online save failed",e);}
  }
  renderResult(record,result);
}

function renderResult(record,res){
  app.innerHTML=clone("resultTemplate");
  qs("#scoreRing",app).style.setProperty("--score",res.score+"%");
  qs("#scoreValue",app).textContent=res.score;
  qs("#profileTitle",app).textContent=res.profile;
  const badge=qs("#riskBadge",app);
  badge.textContent=res.riskLevel;
  badge.className="risk-badge "+(res.score>=78?"risk-low":res.score>=52?"risk-mid":"risk-high");
  qs("#confidenceText",app).textContent=`შეფასების სანდოობა: ${res.confidence}%`;
  qs("#summaryText",app).textContent=`შედეგი ეფუძნება ${res.impacts.length} განსხვავებულ ფაქტორს. ქულა არ არის ვიზის მიღების ალბათობა — ეს არის მზადყოფნის სიმულაციური ინდექსი.`;

  const labels={employment:"დასაქმება",travel:"მოგზაურობა",finance:"ფინანსები",ties:"სამშობლოსთან კავშირები",history:"სავიზო ისტორია"};
  qs("#categoryGrid",app).innerHTML=Object.entries(res.cat).map(([k,v])=>`<div class="metric"><small>${labels[k]}</small><b>${v}/100</b></div>`).join("");
  qs("#strongList",app).innerHTML=res.strong.map(x=>`<li>${x}</li>`).join("");
  qs("#riskList",app).innerHTML=res.risks.map(x=>`<li>${x}</li>`).join("");
  qs("#impactList",app).innerHTML=res.impacts.sort((a,b)=>Math.abs(b.points)-Math.abs(a.points)).map(x=>`<div class="impact-item"><span>${x.label}</span><span class="${x.points>=0?"impact-pos":"impact-neg"}">${x.points>0?"+":""}${x.points}</span></div>`).join("");
  qs("#questionList",app).innerHTML=res.questions.map(x=>`<li>${x}</li>`).join("");
  qs("#prepList",app).innerHTML=res.prep.map(x=>`<li>${x}</li>`).join("");
  qs("#openInterviewBtn",app).onclick=startInterview;
  qs("#restartBtn",app).onclick=()=>{step=0;answers={};renderAssessment();};
  qs("#downloadBtn",app).onclick=()=>downloadReport(record,res);
  showDisclaimer();
}

function showDisclaimer(){
  const m=document.getElementById("disclaimerModal");m.classList.remove("hidden");
  document.getElementById("closeDisclaimer").onclick=()=>m.classList.add("hidden");
}

function downloadReport(record,res){
  const txt=[
    "USA VISA AI ADVISOR PRO — SIMULATION REPORT",
    `Name: ${record.fullName||""}`,
    `Score: ${res.score}/100`,
    `Risk: ${res.riskLevel}`,
    "",
    "Strong points:",
    ...res.strong.map(x=>"- "+x),
    "",
    "Risks:",
    ...res.risks.map(x=>"- "+x),
    "",
    "Likely interview questions:",
    ...res.questions.map((x,i)=>`${i+1}. ${x}`),
    "",
    "Disclaimer: This is a simulated informational assessment and not an official U.S. consular decision."
  ].join("\n");
  const blob=new Blob([txt],{type:"text/plain;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="usa-visa-simulation-report.txt";a.click();
}

const baseInterviewQuestions=[
  "რატომ გსურთ ამერიკაში გამგზავრება?",
  "რამდენი დღით მიდიხართ და რომელ ქალაქებში?",
  "ვინ აფინანსებს თქვენს მოგზაურობას?",
  "რას საქმიანობთ და რამდენი ხანია?",
  "გყავთ ოჯახის წევრი ამერიკაში?",
  "გქონიათ ადრე აშშ-ის ვიზაზე უარი?",
  "რატომ დაბრუნდებით მოგზაურობის დასრულების შემდეგ?"
];

function getInterviewQuestions(){
  const q=[...baseInterviewQuestions];
  if(answers.refusalCount && answers.refusalCount!=="0") q.splice(6,0,"რა შეიცვალა წინა უარის შემდეგ?");
  if(answers.usFamily==="yes_illegal") q.splice(5,0,"რა სტატუსით იმყოფება თქვენი ოჯახის წევრი აშშ-ში?");
  return q;
}

function startInterview(){
  trackEvent("interview_start");
  interviewIndex=0;interviewAnswers=[];renderInterview();
}

function renderInterview(){
  const questions=getInterviewQuestions();
  app.innerHTML=clone("interviewTemplate");
  qs("#interviewCounter",app).textContent=`კითხვა ${interviewIndex+1} / ${questions.length}`;
  qs("#interviewProgressBar",app).style.width=`${Math.round((interviewIndex+1)/questions.length*100)}%`;
  qs("#interviewQuestion",app).textContent=questions[interviewIndex];
  qs("#exitInterviewBtn",app).onclick=renderHome;
  qs("#nextInterviewBtn",app).textContent=interviewIndex===questions.length-1?"დასრულება":"შემდეგი კითხვა";
  qs("#nextInterviewBtn",app).onclick=()=>{
    const text=qs("#interviewAnswer",app).value.trim();
    if(!text){alert("გთხოვთ უპასუხოთ კითხვას.");return;}
    interviewAnswers.push({question:questions[interviewIndex],answer:text});
    if(interviewIndex<questions.length-1){interviewIndex++;renderInterview();} else renderInterviewResult();
  };
}

function renderInterviewResult(){
  app.innerHTML=clone("interviewResultTemplate");
  const analysis=analyzeInterview(interviewAnswers);
  const metrics=[
    ["სიცხადე",analysis.clarity],["კონკრეტულობა",analysis.specificity],["თანმიმდევრულობა",analysis.consistency],["დაბრუნების კავშირები",analysis.ties],["საერთო მზადყოფნა",analysis.overall]
  ];
  qs("#interviewMetrics",app).innerHTML=metrics.map(([l,v])=>`<div class="metric"><small>${l}</small><b>${v}/100</b></div>`).join("");
  qs("#goodAnswers",app).innerHTML=analysis.good.map(x=>`<li>${x}</li>`).join("");
  qs("#weakAnswers",app).innerHTML=analysis.weak.map(x=>`<li>${x}</li>`).join("");
  qs("#interviewTips",app).innerHTML=analysis.tips.map(x=>`<li>${x}</li>`).join("");
  qs("#repeatInterviewBtn",app).onclick=startInterview;
  qs("#backHomeBtn",app).onclick=renderHome;
}

function analyzeInterview(items){
  let clarity=70,specificity=65,consistency=78,ties=60;
  const good=[],weak=[],tips=[];
  items.forEach((item,i)=>{
    const a=item.answer;
    const words=a.split(/\s+/).filter(Boolean).length;
    if(words>=12){clarity+=2;specificity+=3;good.push(`კითხვა ${i+1}: პასუხი საკმარისად დეტალური იყო.`);}
    else{clarity-=7;specificity-=8;weak.push(`კითხვა ${i+1}: პასუხი ზედმეტად მოკლე იყო — "${a.slice(0,70)}${a.length>70?"…":""}"`);}
    if(/\b\d+\b/.test(a)) specificity+=2;
    if(/სამსახ|ბიზნეს|ოჯახ|შვილ|უნივერსიტეტ|ქონებ|დაბრუნ/i.test(a)) ties+=4;
    if(/არ ვიცი|ალბათ|რავი|შეიძლება/i.test(a)){clarity-=5;weak.push(`კითხვა ${i+1}: გაურკვეველი ფორმულირება გამოიყენეთ.`);}
  });
  if(!good.length) good.push("გასაუბრება ბოლომდე დაასრულეთ.");
  if(!weak.length) weak.push("ყურადღება მიაქციეთ პასუხების მოკლედ და პირდაპირ გადმოცემას.");
  tips.push("უპასუხეთ მხოლოდ იმ კითხვას, რომელიც დაგისვეს — ზედმეტი ინფორმაციის გარეშე.");
  tips.push("გამოიყენეთ კონკრეტული თარიღები, ქალაქები და რეალური ფაქტები, როცა ეს ბუნებრივად შეესაბამება კითხვას.");
  tips.push("არ დამალოთ წინა უარი, ნათესავი ან სხვა მნიშვნელოვანი გარემოება.");
  tips.push("ყველა პასუხი უნდა ემთხვეოდეს DS-160-ში შეყვანილ ინფორმაციას.");
  clarity=clamp(clarity,20,96);specificity=clamp(specificity,20,96);consistency=clamp(consistency,30,96);ties=clamp(ties,20,96);
  return {clarity,specificity,consistency,ties,overall:Math.round((clarity+specificity+consistency+ties)/4),good,weak,tips};
}

function renderDs160(){
  trackEvent("ds160_checker_open");
  app.innerHTML=clone("ds160Template");
  qs("#dsBackBtn",app).onclick=renderHome;
  qs("#checkDsBtn",app).onclick=()=>{
    const fields=[
      ["მოგზაურობის მიზანი",qs("#dsPurpose",app).value.trim()],
      ["სამუშაო მოვალეობები",qs("#dsJob",app).value.trim()],
      ["უარის/გარემოების ახსნა",qs("#dsRefusal",app).value.trim()]
    ];
    const issues=[];
    fields.forEach(([label,text])=>{
      if(!text) return;
      const words=text.split(/\s+/).filter(Boolean).length;
      if(words<8) issues.push({label,type:"ყურადღება",msg:"ტექსტი ძალიან მოკლეა და შესაძლოა ბუნდოვნად გამოიყურებოდეს."});
      if(words>90) issues.push({label,type:"ყურადღება",msg:"ტექსტი ზედმეტად გრძელია; DS-160-ში ჩვეულებრივ საჭიროა მოკლე და ფაქტობრივი აღწერა."});
      if(/\bmaybe\b|\bprobably\b|\bnot sure\b/i.test(text)) issues.push({label,type:"რისკი",msg:"გამოყენებულია გაურკვეველი ფორმულირება (maybe/probably/not sure)."});
      if(/\bvisa\b.*\bguarantee\b/i.test(text)) issues.push({label,type:"რისკი",msg:"არ გამოიყენოთ გარანტიის მსგავსი ფორმულირება."});
      const sentences=text.split(/[.!?]+/).filter(Boolean);
      if(sentences.some(s=>s.trim().split(/\s+/).length>35)) issues.push({label,type:"სტილი",msg:"ერთ-ერთი წინადადება ზედმეტად გრძელია; დაყავით მოკლე წინადადებებად."});
      if(!/[.!?]$/.test(text)) issues.push({label,type:"სტილი",msg:"ტექსტის ბოლოს სასვენი ნიშანი არ არის."});
    });
    if(!fields.some(x=>x[1])){alert("ჩასვით მინიმუმ ერთი ტექსტი.");return;}
    if(!issues.length) issues.push({label:"საერთო შეფასება",type:"კარგია",msg:"აშკარა სტრუქტურული პრობლემა ვერ გამოვლინდა. ფაქტები მაინც გადაამოწმეთ საკუთარ დოკუმენტებთან და წინა განაცხადებთან."});
    const box=qs("#dsResults",app);box.classList.remove("hidden");box.className="ds-result-box";
    box.innerHTML=`<h3>შემოწმების შედეგი</h3>${issues.map(x=>`<div class="issue"><b>${x.type}: ${x.label}</b><div class="muted">${x.msg}</div></div>`).join("")}
    <div class="simulation-warning">ეს შემოწმება არის ტექსტური სიმულაცია და ვერ ადასტურებს ინფორმაციის სამართლებრივ ან ფაქტობრივ სისწორეს.</div>`;
  };
}

function saveLocal(record){
  const list=getApplicants();list.unshift(record);localStorage.setItem(STORAGE_KEY,JSON.stringify(list.slice(0,500)));
}
function getApplicants(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch{return[];}}

async function renderAdmin(){
  if(!firebaseReady || !auth || !auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL){
    openAdminAccess();
    return;
  }
  app.innerHTML=clone("adminTemplate");
  qs("#adminHomeBtn",app).onclick=renderHome;
  qs("#adminLogoutBtn",app).onclick=async ()=>{
    await auth.signOut();
    renderHome();
  };
  let list=getApplicants();
  if(firebaseReady && db){
    try{
      const snap=await db.collection("applicants").orderBy("createdAt","desc").limit(300).get();
      list=snap.docs.map(d=>({id:d.id,...d.data()}));
    }catch(e){console.warn("Admin online load failed",e); alert("Admin მონაცემების წაკითხვა ვერ მოხერხდა. გადაამოწმეთ Firebase Authentication და Firestore Rules.");}
  }
  window.__adminList=list;
  renderStats(list);
  qs("#adminSearch",app).oninput=renderAdminList;
  qs("#scoreFilter",app).onchange=renderAdminList;
  qs("#exportCsvBtn",app).onclick=()=>exportCsv(list);
  renderAdminList();
}

function renderStats(list){
  const today=new Date().toDateString();
  const todayCount=list.filter(x=>new Date(x.createdAt||0).toDateString()===today).length;
  const avg=list.length?Math.round(list.reduce((s,x)=>s+(x.score||0),0)/list.length):0;
  const high=list.filter(x=>(x.score||0)>=80).length;
  const refusal=list.filter(x=>x.refusalCount && x.refusalCount!=="0").length;
  const stats=[["სულ განაცხადი",list.length],["დღეს",todayCount],["საშუალო ქულა",avg],["80+ შეფასება",high],["უარის ისტორია",refusal]];
  qs("#statsGrid",app).innerHTML=stats.map(([l,v])=>`<div class="metric"><small>${l}</small><b>${v}</b></div>`).join("");
}

function renderAdminList(){
  const all=window.__adminList||[];
  const q=(qs("#adminSearch",app)?.value||"").toLowerCase();
  const filter=qs("#scoreFilter",app)?.value||"all";
  let list=all.filter(r=>(r.fullName||"").toLowerCase().includes(q)||(r.phone||"").toLowerCase().includes(q));
  if(filter==="high") list=list.filter(r=>(r.score||0)>=80);
  if(filter==="mid") list=list.filter(r=>(r.score||0)>=50&&(r.score||0)<80);
  if(filter==="low") list=list.filter(r=>(r.score||0)<50);
  const box=qs("#adminList",app);
  if(!list.length){box.innerHTML=`<p class="muted">მონაცემები არ მოიძებნა.</p>`;return;}
  box.innerHTML=list.map(r=>`<div class="applicant">
    <div class="applicant-top"><div><b>${escapeHtml(r.fullName||"უსახელო")}</b><div class="muted">${r.createdAt?new Date(r.createdAt).toLocaleString():""}</div></div><div class="badge">${r.score||0}/100</div></div>
    <div class="details">
      <div class="detail">ტელეფონი<b>${escapeHtml(r.phone||"-")}</b></div>
      <div class="detail">დასაქმება<b>${escapeHtml(r.employment||"-")}</b></div>
      <div class="detail">სამუშაო წლები<b>${escapeHtml(r.jobYears||"-")}</b></div>
      <div class="detail">ქვეყნები<b>${escapeHtml(r.countryCount||"-")}</b></div>
      <div class="detail">აშშ-ში ოჯახის წევრი<b>${escapeHtml(r.usFamily||"-")}</b></div>
      <div class="detail">უარი<b>${escapeHtml(r.refusalCount||"0")}</b></div>
      <div class="detail">რისკი<b>${escapeHtml(r.riskLevel||"-")}</b></div>
      <div class="detail">კონსულტაცია<b>${escapeHtml(r.helpNeeded||"-")}</b></div>
    </div>
    <div class="nav-row">
      <a class="secondary link-btn" target="_blank" href="https://wa.me/${normalizePhone(r.phone)}">WhatsApp</a>
      <a class="secondary link-btn" href="tel:${escapeHtml(r.phone||"")}">დარეკვა</a>
    </div>
  </div>`).join("");
}

function normalizePhone(p){return String(p||"").replace(/\D/g,"").replace(/^0/,"995");}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function exportCsv(list){
  if(!list.length){alert("მონაცემები არ არის.");return;}
  const keys=[...new Set(list.flatMap(Object.keys))];
  const csv=[keys.join(","),...list.map(r=>keys.map(k=>`"${String(r[k]??"").replaceAll('"','""')}"`).join(","))].join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="visa-applicants-v5.csv";a.click();
}

renderHome();

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href*="wa.me"]');
  if (link) trackEvent("whatsapp_click", { location: window.location.pathname });
});
