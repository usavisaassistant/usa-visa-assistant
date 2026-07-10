// Firebase online database configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkHMnxngyfeUES5HfR7u8vNI9nimVvj3c",
  authDomain: "usa-visa-assistant.firebaseapp.com",
  projectId: "usa-visa-assistant",
  storageBucket: "usa-visa-assistant.firebasestorage.app",
  messagingSenderId: "10902149878",
  appId: "1:10902149878:web:6e863dff5e15f7a3bd2ad7",
  measurementId: "G-40DZNEVXDD"
};
let db = null;
let firebaseReady = false;
try {
  if (window.firebase) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    firebaseReady = true;
  }
} catch (error) {
  console.warn('Firebase not ready, local mode only:', error);
}
async function saveApplicantOnline(record) {
  if (!firebaseReady || !db) return null;
  const clean = {...record, savedOnlineAt: new Date().toISOString()};
  const ref = await db.collection('applicants').add(clean);
  return ref.id;
}
async function loadApplicantsOnline() {
  if (!firebaseReady || !db) return null;
  const snap = await db.collection('applicants').orderBy('createdAt','desc').limit(200).get();
  return snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
}

const STORAGE_KEY = 'usaVisaAssistantApplicantsV3';
let lang = localStorage.getItem('uva_lang') || 'ka';
let step = 0;
let answers = {};

const t = {
  ka: {
    brandSub:'ამერიკის ვიზისთვის მომზადების პლატფორმა', toolAssessment:'ვიზის მზადყოფნის შეფასება', toolAssessmentSub:'მიიღეთ რისკების, ძლიერი მხარეებისა და რეკომენდაციების ანგარიში.', toolConsul:'ვირტუალური კონსული', toolConsulSub:'გაიარეთ საკონსულო გასაუბრების რეალისტური სიმულაცია.', toolDs160:'DS-160 ტექსტის შემოწმება', toolDs160Sub:'შეამოწმეთ ინგლისური ტექსტი, ბუნდოვანება და შესაძლო წინააღმდეგობები.', consulTitle:'ვირტუალური კონსული', consulIntro:'უპასუხეთ მოკლედ, ზუსტად და მხოლოდ სიმართლე.', answerPlaceholder:'ჩაწერეთ პასუხი...', send:'გაგზავნა', interviewResult:'გასაუბრების შეფასება', goodAnswers:'კარგი პასუხები', improveAnswers:'გასაუმჯობესებელი პასუხები', practiceTips:'მომზადების რჩევები', truthNotice:'არ დამალოთ ფაქტები და არ მოიგონოთ ინფორმაცია. რეკომენდაციები გამოიყენეთ მხოლოდ თქვენი რეალური გარემოებების უკეთ ასახსნელად.', dsTitle:'DS-160 ტექსტის შემოწმება', dsIntro:'ჩასვით ინგლისური ტექსტი. სისტემა შეამოწმებს სიცხადეს, სიგრძესა და გავრცელებულ პრობლემებს.', textType:'ტექსტის ტიპი', pasteText:'ჩასვით ტექსტი ინგლისურად', checkText:'ტექსტის შემოწმება', questionsTitle:'სავარაუდო საკონსულო კითხვები', heroTitle:'მოემზადეთ ამერიკის ტურისტული ვიზისთვის პროფესიონალურად', heroText:'აირჩიეთ თქვენთვის საჭირო ინსტრუმენტი — მზადყოფნის შეფასება, ვირტუალური გასაუბრება ან DS-160 ტექსტის შემოწმება.', homeDisclaimer:'ეს არ არის ვიზის გარანტია. საბოლოო გადაწყვეტილებას იღებს მხოლოდ საკონსულოს ოფიცერი.', back:'უკან', next:'შემდეგი', finish:'შედეგის ნახვა', resultSub:'თქვენი პასუხების მიხედვით შეიქმნა საინფორმაციო მზადყოფნის ინდექსი.', strongTitle:'ძლიერი მხარეები', weakTitle:'გასაუმჯობესებელი', resultDisclaimer:'ინდექსი არ წარმოადგენს ვიზის მიღების გარანტიას. გადაწყვეტილებას იღებს მხოლოდ აშშ-ის საკონსულოს ოფიცერი.', consult:'კონსულტაცია მინდა', download:'რეპორტის ჩამოტვირთვა', restart:'თავიდან დაწყება', adminSub:'შევსებული განაცხადები', step:'ეტაპი', of:'დან', low:'საჭიროა მომზადება', mid:'საშუალო მზადყოფნა', high:'კარგი მზადყოფნა', excellent:'ძალიან კარგი მზადყოფნა', choose:'აირჩიეთ', required:'გთხოვთ შეავსოთ აუცილებელი ველები.', saving:'ინახება...', saved:'შენახულია ონლაინ ბაზაში', localSaved:'შენახულია დროებით, მაგრამ Firebase კავშირი ვერ დამყარდა'
  },
  en: {
    brandSub:'U.S. visa preparation platform', toolAssessment:'Visa readiness assessment', toolAssessmentSub:'Receive a report on risks, strengths and recommendations.', toolConsul:'Virtual Consul', toolConsulSub:'Practice a realistic consular interview simulation.', toolDs160:'DS-160 text checker', toolDs160Sub:'Review English text for clarity and common issues.', consulTitle:'Virtual Consul', consulIntro:'Answer briefly, clearly and truthfully.', answerPlaceholder:'Type your answer...', send:'Send', interviewResult:'Interview assessment', goodAnswers:'Strong answers', improveAnswers:'Answers to improve', practiceTips:'Preparation tips', truthNotice:'Do not hide facts or invent information. Use suggestions only to explain your real circumstances more clearly.', dsTitle:'DS-160 text checker', dsIntro:'Paste your English text. The checker reviews clarity, length and common issues.', textType:'Text type', pasteText:'Paste text in English', checkText:'Check text', questionsTitle:'Likely consular questions', heroTitle:'Prepare professionally for a U.S. tourist visa', heroText:'Choose the tool you need — readiness assessment, virtual interview or DS-160 text review.', homeDisclaimer:'This is not a visa guarantee. The final decision is made only by the consular officer.', back:'Back', next:'Next', finish:'See Result', resultSub:'Based on your answers, an informational readiness index has been created.', strongTitle:'Strong points', weakTitle:'Needs improvement', resultDisclaimer:'The index is not a guarantee of visa approval. The decision is made only by the U.S. consular officer.', consult:'I want consultation', download:'Download report', restart:'Start again', adminSub:'Submitted applicants', step:'Step', of:'of', low:'Needs preparation', mid:'Average readiness', high:'Good readiness', excellent:'Very good readiness', choose:'Select', required:'Please complete the required fields.', saving:'Saving...', saved:'Saved to online database', localSaved:'Saved locally, but Firebase connection failed'
  }
};

const sections = [
  {id:'personal', title:{ka:'პირადი ინფორმაცია',en:'Personal information'}, subtitle:{ka:'საკონტაქტო და ძირითადი მონაცემები',en:'Contact and basic details'}, fields:[
    f('fullName','text',{ka:'სახელი და გვარი',en:'Full name'}, true), f('phone','tel',{ka:'ტელეფონის ნომერი',en:'Phone number'}, true), f('email','email',{ka:'ელფოსტა',en:'Email'}, false), f('age','select',{ka:'ასაკი',en:'Age'}, true, ['18-24','25-34','35-44','45-54','55+'])]},
  {id:'location', title:{ka:'ქვეყანა და საკონსულო',en:'Country and consulate'}, subtitle:{ka:'სად იმყოფებით და სად გსურთ განაცხადი',en:'Where you are and where you want to apply'}, fields:[
    f('citizenship','text',{ka:'მოქალაქეობა',en:'Citizenship'}, true), f('residence','text',{ka:'რომელ ქვეყანაში ცხოვრობთ ახლა?',en:'Which country do you currently live in?'}, true), f('applyCity','text',{ka:'რომელ ქალაქში/ქვეყანაში გსურთ ვიზაზე შესვლა?',en:'In which city/country would you like to apply?'}, true), f('legalResidence','radio',{ka:'გაქვთ ამ ქვეყანაში ლეგალური რეზიდენტობა?',en:'Do you have legal residence there?'}, true, [['yes','დიახ','Yes'],['no','არა','No'],['not_sure','არ ვიცი','Not sure']])]},
  {id:'visa', title:{ka:'წინა ვიზები და უარები',en:'Previous visas and refusals'}, subtitle:{ka:'სავიზო ისტორია',en:'Visa history'}, fields:[
    f('hadUsVisa','radio',{ka:'გქონიათ ადრე ამერიკის ვიზა?',en:'Have you ever had a U.S. visa?'}, true, [['yes','დიახ','Yes'],['no','არა','No']]), f('usRefusal','radio',{ka:'გქონიათ ამერიკის ვიზაზე უარი?',en:'Have you ever been refused a U.S. visa?'}, true, [['yes','დიახ','Yes'],['no','არა','No']]), f('otherRefusal','radio',{ka:'სხვა ქვეყნის ვიზაზე უარი გქონიათ?',en:'Have you been refused by another country?'}, true, [['yes','დიახ','Yes'],['no','არა','No']]), f('overstay','radio',{ka:'ოდესმე გადააცილეთ დაშვებულ ყოფნის ვადას?',en:'Have you ever overstayed a permitted stay?'}, true, [['yes','დიახ','Yes'],['no','არა','No']])]},
  {id:'travel', title:{ka:'მოგზაურობის ისტორია',en:'Travel history'}, subtitle:{ka:'გასვლები და გამოცდილება',en:'Trips and travel experience'}, fields:[
    f('travelHistory','radio',{ka:'გაქვთ მოგზაურობის ისტორია?',en:'Do you have travel history?'}, true, [['strong','დიახ, რამდენიმე ქვეყანა','Yes, several countries'],['some','ნაწილობრივ','Partially'],['none','არა','No']]), f('visitedCountries','textarea',{ka:'რომელი ქვეყნები გაქვთ ნანახი?',en:'Which countries have you visited?'}, false), f('recentTravel','radio',{ka:'ბოლო 2 წელში იმოგზაურეთ?',en:'Have you traveled in the last 2 years?'}, true, [['yes','დიახ','Yes'],['no','არა','No']])]},
  {id:'employment', title:{ka:'სამსახური და შემოსავალი',en:'Employment and income'}, subtitle:{ka:'ეკონომიკური კავშირები',en:'Economic ties'}, fields:[
    f('employment','radio',{ka:'თქვენი სტატუსი',en:'Your status'}, true, [['employed','დასაქმებული','Employed'],['self','თვითდასაქმებული','Self-employed'],['student','სტუდენტი','Student'],['student_employed','სტუდენტი და დასაქმებული','Student and employed'],['unemployed','დაუსაქმებელი','Unemployed']]), f('monthlyIncome','select',{ka:'დაახლოებით თვიური შემოსავალი',en:'Approximate monthly income'}, true, [['low','0-1000 GEL','$0-400'],['mid','1000-3000 GEL','$400-1100'],['good','3000-6000 GEL','$1100-2200'],['high','6000+ GEL','$2200+']]), f('incomeProof','radio',{ka:'გაქვთ შემოსავლის დამადასტურებელი დოკუმენტი?',en:'Do you have proof of income?'}, true, [['yes','დიახ','Yes'],['partial','ნაწილობრივ','Partially'],['no','არა','No']])]},
  {id:'ties', title:{ka:'კავშირები სამშობლოსთან',en:'Home country ties'}, subtitle:{ka:'ოჯახი, ქონება და დაბრუნების მიზეზები',en:'Family, property and reasons to return'}, fields:[
    f('marital','radio',{ka:'ოჯახური მდგომარეობა',en:'Marital status'}, true, [['single','დასაოჯახებელი','Single'],['married','დაოჯახებული','Married'],['divorced','განქორწინებული','Divorced']]), f('children','radio',{ka:'გყავთ შვილები?',en:'Do you have children?'}, true, [['yes','დიახ','Yes'],['no','არა','No']]), f('property','radio',{ka:'გაქვთ უძრავი ქონება თქვენს სახელზე?',en:'Do you own property?'}, true, [['yes','დიახ','Yes'],['no','არა','No']]), f('business','radio',{ka:'გაქვთ ბიზნესი/კომპანია?',en:'Do you own a business/company?'}, true, [['yes','დიახ','Yes'],['no','არა','No']])]},
  {id:'trip', title:{ka:'მოგზაურობის მიზანი',en:'Purpose of travel'}, subtitle:{ka:'რატომ მიდიხართ ამერიკაში',en:'Why you want to visit the U.S.'}, fields:[
    f('purpose','radio',{ka:'მიზანი',en:'Purpose'}, true, [['tourism','ტურიზმი','Tourism'],['family','ოჯახის/ნათესავის მონახულება','Visiting family/relatives'],['business','ბიზნესი','Business'],['event','ღონისძიებაზე დასწრება','Attending an event'],['other','სხვა','Other']]), f('duration','select',{ka:'რამდენი დღით გეგმავთ ყოფნას?',en:'How long do you plan to stay?'}, true, [['short','1-14 დღე','1-14 days'],['mid','15-30 დღე','15-30 days'],['long','1 თვეზე მეტი','More than 1 month']]), f('sponsor','radio',{ka:'ვინ აფინანსებს მოგზაურობას?',en:'Who will pay for the trip?'}, true, [['self','მე თვითონ','Myself'],['family','ოჯახი/ნათესავი','Family/relative'],['company','კომპანია','Company'],['other','სხვა','Other']]), f('usFamily','radio',{ka:'გყავთ ახლო ნათესავი აშშ-ში?',en:'Do you have close relatives in the U.S.?'}, true, [['yes','დიახ','Yes'],['no','არა','No']])]},
  {id:'final', title:{ka:'კონსულტაცია',en:'Consultation'}, subtitle:{ka:'დასკვნითი ინფორმაცია',en:'Final details'}, fields:[
    f('helpNeeded','radio',{ka:'გსურთ ჩვენი დახმარება?',en:'Would you like our assistance?'}, true, [['consult','დიახ, კონსულტაცია მინდა','Yes, I want consultation'],['info','მხოლოდ ინფორმაცია მაინტერესებს','I only need information']]), f('notes','textarea',{ka:'დამატებითი კომენტარი',en:'Additional comment'}, false)]}
];
function f(id,type,label,required,options=[]){return {id,type,label,required,options};}

const app = document.getElementById('app');
document.getElementById('langToggle').onclick=()=>{lang=lang==='ka'?'en':'ka';localStorage.setItem('uva_lang',lang); render();};
document.getElementById('adminBtn').onclick=renderAdmin;
document.getElementById('brandHome').onclick=renderHome;
function translateRoot(){document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n; if(t[lang][key]) el.textContent=t[lang][key];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const key=el.dataset.i18nPlaceholder;if(t[lang][key]) el.placeholder=t[lang][key];}); document.getElementById('langToggle').textContent=lang==='ka'?'ENG':'ქარ';}
function render(){renderHome();}
function renderHome(){app.innerHTML=document.getElementById('homeTemplate').innerHTML; translateRoot(); app.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{const tool=b.dataset.tool;if(tool==='assessment'){step=0;answers={};renderForm();}else if(tool==='consul'){renderConsul();}else if(tool==='ds160'){renderDsChecker();}});}
function renderForm(){app.innerHTML=document.getElementById('formTemplate').innerHTML; translateRoot(); const s=sections[step]; document.getElementById('stepLabel').textContent=`${t[lang].step} ${step+1} ${t[lang].of} ${sections.length}`; const pct=Math.round(((step+1)/sections.length)*100); document.getElementById('percentLabel').textContent=pct+'%'; document.getElementById('progressBar').style.width=pct+'%'; document.getElementById('sectionTitle').textContent=s.title[lang]; document.getElementById('sectionSubtitle').textContent=s.subtitle[lang]; const fields=document.getElementById('fields'); fields.innerHTML=''; s.fields.forEach(field=>fields.appendChild(renderField(field))); document.getElementById('prevBtn').style.visibility=step===0?'hidden':'visible'; document.getElementById('prevBtn').onclick=()=>{step--;renderForm();}; const next=document.getElementById('nextBtn'); next.textContent=step===sections.length-1?t[lang].finish:t[lang].next; next.onclick=()=>{if(!collectAndValidate()) return; if(step<sections.length-1){step++;renderForm();}else{saveAndRenderResult();}};}
function captureVisibleFields(){
  const s=sections[step];
  if(!s) return;
  s.fields.forEach(field=>{
    if(field.type!=='radio'){
      const el=document.getElementById(field.id);
      if(el) answers[field.id]=el.value.trim();
    }
  });
}
function renderField(field){
  const wrap=document.createElement('div');
  wrap.className='field reveal';
  const label=document.createElement('label');
  label.textContent=field.label[lang]+(field.required?' *':'');
  wrap.appendChild(label);
  if(['text','tel','email'].includes(field.type)){
    const input=document.createElement('input'); input.type=field.type; input.id=field.id; input.value=answers[field.id]||'';
    input.addEventListener('input',()=>answers[field.id]=input.value.trim());
    wrap.appendChild(input);
  } else if(field.type==='textarea'){
    const ta=document.createElement('textarea'); ta.id=field.id; ta.rows=4; ta.value=answers[field.id]||'';
    ta.addEventListener('input',()=>answers[field.id]=ta.value.trim());
    wrap.appendChild(ta);
  } else if(field.type==='select'){
    const sel=document.createElement('select'); sel.id=field.id; sel.innerHTML=`<option value="">${t[lang].choose}</option>`;
    field.options.forEach(o=>{let val,ka,en; if(Array.isArray(o)){[val,ka,en]=o;}else{val=ka=en=o;} const opt=document.createElement('option'); opt.value=val; opt.textContent=lang==='ka'?ka:en; sel.appendChild(opt);});
    sel.value=answers[field.id]||'';
    sel.addEventListener('change',()=>answers[field.id]=sel.value);
    wrap.appendChild(sel);
  } else if(field.type==='radio'){
    const box=document.createElement('div'); box.className='options';
    field.options.forEach(([val,ka,en])=>{
      const opt=document.createElement('button');
      opt.type='button';
      opt.className='option'+(answers[field.id]===val?' selected':'');
      opt.textContent=lang==='ka'?ka:en;
      opt.onclick=()=>{
        captureVisibleFields();
        answers[field.id]=val;
        box.querySelectorAll('.option').forEach(x=>x.classList.remove('selected','pop'));
        opt.classList.add('selected','pop');
      };
      box.appendChild(opt);
    });
    wrap.appendChild(box);
  }
  return wrap;
}
function collectAndValidate(){captureVisibleFields(); const s=sections[step]; for(const field of s.fields){if(field.required && !answers[field.id]){alert(t[lang].required); return false;}} return true;}
function calculateScore(a){let score=50; const strong=[], weak=[]; function add(points, good, bad, condition){ if(condition){score+=points; if(good) strong.push(good);} else {score-=Math.abs(points); if(bad) weak.push(bad);} }
 add(10, lang==='ka'?'მოგზაურობის ისტორია გაქვთ':'You have travel history', lang==='ka'?'მოგზაურობის ისტორია სუსტია':'Travel history is weak', a.travelHistory==='strong'||a.travelHistory==='some');
 add(8, lang==='ka'?'შემოსავლის დოკუმენტი გაქვთ':'You have proof of income', lang==='ka'?'შემოსავლის დოკუმენტი გასაძლიერებელია':'Proof of income needs improvement', a.incomeProof==='yes'||a.incomeProof==='partial');
 add(8, lang==='ka'?'სტაბილური სამუშაო/სტატუსი გაქვთ':'You have a stable status', lang==='ka'?'სამუშაო/სტატუსი დასაზუსტებელია':'Employment/status needs clarification', ['employed','self','student_employed'].includes(a.employment));
 add(7, lang==='ka'?'ქონება/ბიზნესი აძლიერებს კავშირებს':'Property/business strengthens ties', lang==='ka'?'სამშობლოსთან კავშირები გასაძლიერებელია':'Home country ties need strengthening', a.property==='yes'||a.business==='yes'||a.children==='yes'||a.marital==='married');
 if(a.usRefusal==='yes'){score-=10; weak.push(lang==='ka'?'წინა უარის ახსნა და სწორი სტრატეგია საჭიროა':'Previous refusal needs explanation and strategy');}
 if(a.overstay==='yes'){score-=18; weak.push(lang==='ka'?'ვადის გადაცილება სერიოზული რისკია და უნდა შეფასდეს':'Overstay is a serious risk and needs review');}
 if(a.duration==='long'){score-=6; weak.push(lang==='ka'?'ძალიან გრძელი ვიზიტი შეიძლება დამატებით კითხვებს იწვევდეს':'A very long stay may raise additional questions');}
 if(a.hadUsVisa==='yes'){score+=5; strong.push(lang==='ka'?'წინა ამერიკული ვიზა დადებითი ფაქტორია':'Previous U.S. visa is a positive factor');}
 score=Math.max(5,Math.min(98,score)); if(strong.length===0) strong.push(lang==='ka'?'კითხვარი სრულად შეივსო':'Assessment completed'); if(weak.length===0) weak.push(lang==='ka'?'ინტერვიუსთვის მკაფიო პასუხების მომზადება':'Prepare clear interview answers'); return {score,strong,weak};}
async function saveAndRenderResult(){
  const res=calculateScore(answers);
  const record={...answers, score:res.score, createdAt:new Date().toISOString(), status:'New', language:lang};
  const list=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
  list.unshift(record);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(list));
  answers._lastResult=res;
  try {
    const id = await saveApplicantOnline(record);
    if (id) record.firebaseId = id;
  } catch (e) {
    console.warn('Could not save online:', e);
  }
  renderResult(record,res);
}
function renderResult(record,res){
  app.innerHTML=document.getElementById('resultTemplate').innerHTML; translateRoot();
  document.querySelector('.score-circle').style.setProperty('--score',res.score+'%');
  document.getElementById('scoreValue').textContent=res.score;
  const title=res.score>=85?t[lang].excellent:res.score>=70?t[lang].high:res.score>=50?t[lang].mid:t[lang].low;
  document.getElementById('scoreTitle').textContent=title;
  const risk=res.score>=75?(lang==='ka'?'რისკის დონე: დაბალი':'Risk level: Low'):res.score>=50?(lang==='ka'?'რისკის დონე: საშუალო':'Risk level: Medium'):(lang==='ka'?'რისკის დონე: მაღალი':'Risk level: High');
  document.getElementById('riskLabel').textContent=risk;
  document.getElementById('strongList').innerHTML=res.strong.map(x=>`<li>✔️ ${escapeHtml(x)}</li>`).join('');
  document.getElementById('weakList').innerHTML=res.weak.map(x=>`<li>⚠️ ${escapeHtml(x)}</li>`).join('');
  const qs=buildLikelyQuestions(record);
  document.getElementById('questionList').innerHTML=qs.map(x=>`<li>❓ ${escapeHtml(x)}</li>`).join('');
  document.getElementById('consultBtn').onclick=()=>openWhatsApp('გამარჯობა, გავიარე USA Visa Assistant PRO-ს შეფასება და მსურს კონსულტაცია. ჩემი შეფასებაა '+res.score+'/100.');
  document.getElementById('restartBtn').onclick=renderHome;
  document.getElementById('downloadBtn').onclick=()=>downloadReport(record,{...res,questions:qs});
}
function buildLikelyQuestions(a){
  const q=lang==='ka'?['რატომ გსურთ ამერიკაში გამგზავრება?','რამდენი ხნით მიდიხართ და სად დარჩებით?','ვინ აფინანსებს მოგზაურობას?','რას საქმიანობთ და რატომ დაბრუნდებით?']:['Why do you want to visit the United States?','How long will you stay and where?','Who will pay for the trip?','What do you do and why will you return?'];
  if(a.usRefusal==='yes') q.push(lang==='ka'?'რა შეიცვალა წინა უარის შემდეგ?':'What has changed since your previous refusal?');
  if(a.usFamily==='yes') q.push(lang==='ka'?'ვინ გყავთ აშშ-ში და რა სტატუსი აქვს?':'Who is your relative in the U.S. and what is their status?');
  if(a.sponsor!=='self') q.push(lang==='ka'?'რატომ გიფინანსებთ სხვა პირი ან კომპანია?':'Why is another person or company funding your trip?');
  return q.slice(0,7);
}
function downloadReport(record,res){const lines=[`USA Visa Readiness Report`,`Name: ${record.fullName||''}`,`Phone: ${record.phone||''}`,`Score: ${res.score}/100`,'','Strong points:',...res.strong.map(x=>'- '+x),'','Needs improvement:',...res.weak.map(x=>'- '+x),'','Likely questions:',...(res.questions||[]).map(x=>'- '+x),'','Disclaimer: This index is informational only. Final decision is made by the consular officer.']; const blob=new Blob([lines.join('\n')],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='visa-readiness-report.txt'; a.click();}
let cachedApplicants = [];
async function renderAdmin(){
  app.innerHTML=document.getElementById('adminTemplate').innerHTML;
  translateRoot();
  document.getElementById('homeBtn').onclick=renderHome;
  document.getElementById('exportBtn').onclick=exportCSV;
  document.getElementById('clearBtn').onclick=()=>{if(confirm('Clear local browser data?')){localStorage.removeItem(STORAGE_KEY);renderAdmin();}};
  document.getElementById('searchInput').oninput=renderApplicants;
  const box=document.getElementById('applicantsList');
  box.innerHTML='<p class="muted">Loading applicants...</p>';
  try {
    const online = await loadApplicantsOnline();
    cachedApplicants = online || JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
  } catch(e) {
    console.warn('Online load failed:', e);
    cachedApplicants = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
  }
  renderApplicants();
}
function renderApplicants(){
  const q=(document.getElementById('searchInput')?.value||'').toLowerCase();
  const list=(cachedApplicants||[]).filter(r=>(r.fullName||'').toLowerCase().includes(q)||(r.phone||'').toLowerCase().includes(q));
  const box=document.getElementById('applicantsList');
  if(!list.length){box.innerHTML='<p class="muted">No applicants yet.</p>'; return;}
  box.innerHTML=list.map(r=>`<div class="applicant"><div class="applicant-top"><div><b>${r.fullName||'No name'}</b><div class="muted">${r.createdAt ? new Date(r.createdAt).toLocaleString() : ''} ${r.id ? '• Online' : '• Local'}</div></div><div class="badge">${r.score||0}/100</div></div><div class="details"><div class="detail">Phone<br><b>${r.phone||'-'}</b></div><div class="detail">Residence<br><b>${r.residence||'-'}</b></div><div class="detail">Refusal<br><b>${r.usRefusal||'-'}</b></div><div class="detail">Employment<br><b>${r.employment||'-'}</b></div><div class="detail">Purpose<br><b>${r.purpose||'-'}</b></div><div class="detail">Help<br><b>${r.helpNeeded||'-'}</b></div></div></div>`).join('');
}
function exportCSV(){const list=(cachedApplicants && cachedApplicants.length) ? cachedApplicants : JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); if(!list.length) return alert('No data'); const keys=[...new Set(list.flatMap(Object.keys))].filter(k=>k!=='_lastResult'); const csv=[keys.join(','),...list.map(r=>keys.map(k=>'"'+String(r[k]??'').replaceAll('"','""')+'"').join(','))].join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='applicants.csv'; a.click();}

function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}
function openWhatsApp(message){window.open('https://wa.me/995571563035?text='+encodeURIComponent(message),'_blank','noopener');}

const consulQuestions={
  ka:['რატომ გსურთ ამერიკაში გამგზავრება?','რამდენი ხნით გეგმავთ დარჩენას?','სად დარჩებით ამერიკაში?','ვინ აფინანსებს მოგზაურობას?','რას საქმიანობთ და რამდენი ხანია?','გყავთ ნათესავი ამერიკაში?','გქონიათ ადრე ამერიკის ვიზაზე უარი?','რატომ დაბრუნდებით საქართველოში?'],
  en:['Why do you want to visit the United States?','How long do you plan to stay?','Where will you stay in the United States?','Who will pay for your trip?','What do you do and how long have you done it?','Do you have relatives in the United States?','Have you ever been refused a U.S. visa?','Why will you return to your country?']
};
let consulIndex=0,consulAnswers=[];
function renderConsul(){
  app.innerHTML=document.getElementById('consulTemplate').innerHTML;translateRoot();consulIndex=0;consulAnswers=[];
  document.getElementById('exitToolBtn').onclick=renderHome;
  document.getElementById('sendAnswerBtn').onclick=submitConsulAnswer;
  document.getElementById('chatAnswer').addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter')submitConsulAnswer();});
  addChat('officer',consulQuestions[lang][0]);
}
function addChat(role,text){const box=document.getElementById('chatBox');const div=document.createElement('div');div.className='chat '+role;div.innerHTML=`<b>${role==='officer'?(lang==='ka'?'კონსული':'Consular Officer'):(lang==='ka'?'თქვენ':'You')}</b><p>${escapeHtml(text)}</p>`;box.appendChild(div);box.scrollTop=box.scrollHeight;}
function submitConsulAnswer(){const input=document.getElementById('chatAnswer');const value=input.value.trim();if(!value)return;addChat('user',value);consulAnswers.push(value);input.value='';consulIndex++;if(consulIndex<consulQuestions[lang].length){setTimeout(()=>addChat('officer',consulQuestions[lang][consulIndex]),250);}else{document.getElementById('sendAnswerBtn').disabled=true;setTimeout(renderConsulResult,350);}}
function assessInterview(){
  let score=40,good=[],improve=[];
  consulAnswers.forEach((a,i)=>{const words=a.split(/\s+/).filter(Boolean).length;const vague=/don't know|not sure|maybe|რავი|არ ვიცი|ალბათ/i.test(a);if(words>=5&&words<=45&&!vague){score+=7;good.push(`${i+1}. ${lang==='ka'?'პასუხი იყო კონკრეტული და გასაგები':'Answer was clear and specific'}`);}else{score+=2;improve.push(`${i+1}. ${lang==='ka'?'დააკონკრეტეთ პასუხი მოკლედ და ფაქტებზე დაყრდნობით':'Make the answer brief, specific and fact-based'}`);}});
  score=Math.min(96,score);if(!good.length)good.push(lang==='ka'?'გასაუბრება სრულად დაასრულეთ':'You completed the full interview');if(!improve.length)improve.push(lang==='ka'?'ივარჯიშეთ მშვიდ ტონში და ზედმეტი დეტალების გარეშე':'Practice calmly and avoid unnecessary detail');return{score,good,improve};
}
function renderConsulResult(){const r=assessInterview();app.innerHTML=document.getElementById('consulResultTemplate').innerHTML;translateRoot();document.querySelector('.score-circle').style.setProperty('--score',r.score+'%');document.getElementById('interviewScore').textContent=r.score;document.getElementById('goodAnswerList').innerHTML=r.good.map(x=>`<li>✔️ ${escapeHtml(x)}</li>`).join('');document.getElementById('improveAnswerList').innerHTML=r.improve.map(x=>`<li>⚠️ ${escapeHtml(x)}</li>`).join('');const tips=lang==='ka'?['უპასუხეთ პირდაპირ კითხვას.','არ დამალოთ უარი, ნათესავი ან წინა მოგზაურობა.','თქვენი გეგმა უნდა ემთხვეოდეს DS-160-ს.','არ დაიზეპიროთ ხელოვნური ტექსტი.']:['Answer the exact question asked.','Do not hide refusals, relatives or travel history.','Your plan must match the DS-160.','Do not memorize an artificial script.'];document.getElementById('practiceTipsList').innerHTML=tips.map(x=>`<li>• ${x}</li>`).join('');document.getElementById('consulWhatsapp').onclick=()=>openWhatsApp('გამარჯობა, გავიარე ვირტუალური კონსულის სიმულაცია და მსურს გასაუბრებისთვის მომზადება.');document.getElementById('consulRestart').onclick=renderConsul;document.getElementById('consulHome').onclick=renderHome;}

function renderDsChecker(){app.innerHTML=document.getElementById('dsTemplate').innerHTML;translateRoot();document.getElementById('exitToolBtn').onclick=renderHome;document.getElementById('checkDsBtn').onclick=checkDsText;}
function checkDsText(){
  const text=document.getElementById('dsText').value.trim(),type=document.getElementById('dsType').value,box=document.getElementById('dsResult');if(!text){box.innerHTML='<div class="notice error">Please paste text first.</div>';return;}
  const words=text.split(/\s+/).filter(Boolean);const issues=[],positives=[];
  if(words.length<8)issues.push(lang==='ka'?'ტექსტი ზედმეტად მოკლეა და შეიძლება ბუნდოვანი იყოს.':'The text may be too short and vague.');
  if(words.length>90)issues.push(lang==='ka'?'ტექსტი ზედმეტად გრძელია; შეამცირეთ მხოლოდ მნიშვნელოვან ფაქტებამდე.':'The text is long; reduce it to relevant facts.');
  if(/guarantee|definitely|100%|always/i.test(text))issues.push(lang==='ka'?'მოერიდეთ აბსოლუტურ ან გარანტიის გამომხატველ სიტყვებს.':'Avoid absolute or guarantee-like wording.');
  if(/work|job|employment/i.test(text)&&type==='purpose'&&/tourism|visit|vacation/i.test(text))issues.push(lang==='ka'?'მოგზაურობის მიზანში სამუშაოს ხსენება შეიძლება დამატებით განმარტებას საჭიროებდეს.':'Mentioning work in a tourism purpose may require clarification.');
  if(!/[.!?]$/.test(text))issues.push(lang==='ka'?'დაასრულეთ ტექსტი სასვენი ნიშნით.':'End the text with punctuation.');
  if(/\bi\b/.test(text))issues.push(lang==='ka'?'ინგლისურში პირის ნაცვალსახელი „I“ დიდი ასოთი უნდა დაიწეროს.':'The pronoun “I” must be capitalized.');
  if(/\b(very very|and and|the the)\b/i.test(text))issues.push(lang==='ka'?'აღმოჩენილია გამეორებული სიტყვა.':'A repeated word was detected.');
  if(words.length>=8&&words.length<=90)positives.push(lang==='ka'?'ტექსტის მოცულობა მისაღებია.':'The text length is reasonable.');
  if(/[.!?]$/.test(text))positives.push(lang==='ka'?'ტექსტი დასრულებული წინადადებით არის წარმოდგენილი.':'The text appears to be a complete sentence.');
  positives.push(lang==='ka'?'სისტემამ ფაქტები არ შეცვალა და ახალი ინფორმაცია არ მოუგონია.':'No facts were changed or invented.');
  const rating=Math.max(25,Math.min(95,90-issues.length*12));
  box.innerHTML=`<div class="ds-output"><h2>${lang==='ka'?'შემოწმების შედეგი':'Review result'}: ${rating}/100</h2><div class="grid2"><div class="mini-card"><h3>${lang==='ka'?'კარგი მხარეები':'Positive points'}</h3><ul>${positives.map(x=>`<li>✔️ ${escapeHtml(x)}</li>`).join('')}</ul></div><div class="mini-card"><h3>${lang==='ka'?'შესამოწმებელი საკითხები':'Items to review'}</h3><ul>${(issues.length?issues:[lang==='ka'?'ავტომატურმა შემოწმებამ მნიშვნელოვანი პრობლემა ვერ აღმოაჩინა.':'No major issue was detected by the automated check.']).map(x=>`<li>⚠️ ${escapeHtml(x)}</li>`).join('')}</ul></div></div><div class="notice">${lang==='ka'?'ეს არის ავტომატური ენობრივი და ლოგიკური შემოწმება, არა იურიდიული დასკვნა.':'This is an automated language and logic check, not legal advice.'}</div><button class="primary wide" id="dsWhatsapp">WhatsApp კონსულტაცია</button></div>`;
  document.getElementById('dsWhatsapp').onclick=()=>openWhatsApp('გამარჯობა, მსურს DS-160 განაცხადის ტექსტის პროფესიონალური გადამოწმება.');
}

render();
