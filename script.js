const demoRecords=[
 {person:"Demo-persoon A",address:"Fictief adres, Emmen",vehicles:["XX-001-X"],caseId:"MH-DEMO-001",status:"In duiding",note:"Fictief voorbeeld van gecombineerde signalen rond woon-, werk- en financiële afhankelijkheid.",partners:["OOV","Politie","Aandachtsfunctionaris"]},
 {person:"Demo-persoon B",address:"Fictief adres, gemeente Emmen",vehicles:["XX-002-X"],caseId:"MH-DEMO-002",status:"Monitoren",note:"Fictief voorbeeld van signalen die eerst nadere duiding en partnerafstemming vragen.",partners:["OOV","Zorg- en Veiligheidshuis"]}
];

const DATA={
 nationalTrend:{labels:["2020","2021","2022","2023","2024"],values:[1013,791,814,868,944]},
 forms2024:{labels:["Binnenlandse seksuele uitbuiting","Internationale seksuele uitbuiting","Arbeidsuitbuiting","Criminele uitbuiting"],values:[123,364,356,160]},
 emmenPopulation:{labels:["okt 2025","nov","dec","jan 2026","feb","mrt","apr","mei","jun","jul","aug","sep"],values:[109903,109927,109945,109881,109905,109863,109838,109832,109820,109817,109815,109820]}
};

function chartDefaults(){
 if(typeof Chart==='undefined')return;
 Chart.defaults.font.family='Inter, system-ui, sans-serif';
 Chart.defaults.color='#667085';
 Chart.defaults.borderColor='#e2e8f0';
}
function makeLine(id,labels,values,label){
 const el=document.getElementById(id);if(!el||typeof Chart==='undefined')return;
 new Chart(el,{type:'line',data:{labels,datasets:[{label,data:values,borderWidth:3,tension:.3,pointRadius:4,pointHoverRadius:5,fill:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{displayColors:false}},scales:{y:{beginAtZero:false,ticks:{precision:0}},x:{grid:{display:false}}}}});
}
function makeBar(id,labels,values,label){
 const el=document.getElementById(id);if(!el||typeof Chart==='undefined')return;
 new Chart(el,{type:'bar',data:{labels,datasets:[{label,data:values,borderRadius:7,maxBarThickness:42}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{displayColors:false}},scales:{x:{beginAtZero:true,ticks:{precision:0}},y:{grid:{display:false}}}}});
}
function initCharts(){
 chartDefaults();
 makeLine('nationalTrendChart',DATA.nationalTrend.labels,DATA.nationalTrend.values,'Geregistreerde slachtoffers');
 makeBar('formsChart',DATA.forms2024.labels,DATA.forms2024.values,'Geregistreerde slachtoffers');
 makeLine('populationChart',DATA.emmenPopulation.labels,DATA.emmenPopulation.values,'Inwoners');
}

function initMap(){
 const el=document.getElementById('emmenMap');if(!el||typeof L==='undefined')return;
 const map=L.map('emmenMap',{scrollWheelZoom:false}).setView([52.742,6.93],10);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap-bijdragers'}).addTo(map);
 const places=[
  {name:'Emmen',lat:52.7792,lng:6.9065,pop:'59.130'},
  {name:'Klazienaveen',lat:52.7246,lng:6.9905,pop:'11.970'},
  {name:'Emmer-Compascuum',lat:52.8118,lng:7.0469,pop:'7.735'},
  {name:'Erica',lat:52.7105,lng:6.9250,pop:'4.740'},
  {name:'Nieuw-Amsterdam',lat:52.7141,lng:6.8559,pop:'4.720'},
  {name:'Schoonebeek',lat:52.6621,lng:6.8840,pop:'4.390'},
  {name:'Nieuw-Weerdinge',lat:52.8550,lng:6.9846,pop:'3.360'},
  {name:'Zwartemeer',lat:52.7230,lng:7.0437,pop:'3.085'}
 ];
 places.forEach(p=>L.circleMarker([p.lat,p.lng],{radius:7,weight:2,fillOpacity:.75}).addTo(map).bindPopup(`<strong>${p.name}</strong><br>${p.pop} inwoners (2025)<br><small>Contextpunt; geen incident- of risicomarker.</small>`));
 L.control.scale({imperial:false}).addTo(map);
}

function syncAuthClass(){const authed=localStorage.getItem('pgax_demo_auth')==='true';document.body.classList.toggle('auth',authed)}
function protectedCheck(){const gate=document.getElementById('protected-content'),denied=document.getElementById('protected-denied');const authed=localStorage.getItem('pgax_demo_auth')==='true';if(gate&&denied){gate.classList.toggle('hidden',!authed);denied.classList.toggle('hidden',authed)}}
function loginSubmit(e){e.preventDefault();const user=document.getElementById('username')?.value.trim(),pass=document.getElementById('password')?.value.trim(),err=document.getElementById('login-error'),ok=document.getElementById('login-success');if(user==='SDEV1'&&pass==='12345'){localStorage.setItem('pgax_demo_auth','true');err?.classList.add('hidden');ok?.classList.remove('hidden');setTimeout(()=>location.href='zaken.html',350)}else{ok?.classList.add('hidden');err?.classList.remove('hidden')}}
function logout(){localStorage.removeItem('pgax_demo_auth');location.href='login.html'}
function renderDemoResults(records){const container=document.getElementById('searchResults');if(!container)return;if(!records.length){container.innerHTML='<div class="empty-state">Geen resultaten in de fictieve demo-registraties.</div>';return}container.innerHTML=records.map(r=>`<div class="result-card"><h4>${r.person}</h4><div class="meta-grid"><div class="meta-item"><div class="label">Adres</div><div class="value">${r.address}</div></div><div class="meta-item"><div class="label">Kenteken</div><div class="value">${r.vehicles.join(', ')}</div></div><div class="meta-item"><div class="label">Casus / status</div><div class="value">${r.caseId} • ${r.status}</div></div></div><p style="margin-top:10px">${r.note}</p><div>${r.partners.map(p=>`<span class="tag">${p}</span>`).join('')}</div><a class="detail-link" href="case.html?id=${encodeURIComponent(r.caseId)}">Bekijk fictieve casus</a></div>`).join('')}
function setupDemoSearch(){const btn=document.getElementById('searchBtn');if(!btn)return;renderDemoResults(demoRecords);btn.addEventListener('click',()=>{const p=(document.getElementById('searchPerson')?.value||'').trim().toLowerCase(),k=(document.getElementById('searchPlate')?.value||'').trim().toLowerCase(),a=(document.getElementById('searchAddress')?.value||'').trim().toLowerCase();renderDemoResults(demoRecords.filter(r=>(!p||r.person.toLowerCase().includes(p))&&(!k||r.vehicles.some(v=>v.toLowerCase().includes(k)))&&(!a||r.address.toLowerCase().includes(a))))})}
function renderCaseDetail(){const mount=document.getElementById('case-detail-mount');if(!mount)return;const id=new URLSearchParams(location.search).get('id'),rec=demoRecords.find(r=>r.caseId===id);if(!rec){mount.innerHTML='<div class="card"><h2>Demo-casus niet gevonden</h2><p>Het ID ontbreekt of bestaat niet.</p><a class="btn primary" href="zaken.html">Terug</a></div>';return}mount.innerHTML=`<div class="card"><div class="eyebrow">Fictieve demo • ${rec.caseId}</div><h2>${rec.person}</h2><p>Deze gegevens zijn volledig fictief en uitsluitend bedoeld om de werking van een afgeschermde casusweergave te demonstreren.</p></div><div class="section"><div class="section-head"><h3>Casusinformatie</h3><p>Voorbeeld van een compacte, doelgebonden casusweergave.</p></div><div class="section-body"><div class="case-detail-grid"><div class="case-box"><h4>Basisgegevens</h4><p><strong>Adres:</strong> ${rec.address}<br><strong>Kenteken:</strong> ${rec.vehicles.join(', ')}<br><strong>Status:</strong> ${rec.status}</p></div><div class="case-box"><h4>Betrokken rollen</h4><p>${rec.partners.join(', ')}</p></div><div class="case-box"><h4>Signaalbeeld</h4><p>${rec.note}</p></div><div class="case-box"><h4>Vervolg (demo)</h4><p>Beoordelen noodzaak slachtofferzorg, duiding, regiehouder, rechtmatige informatie-uitwisseling en passende interventie.</p></div></div></div></div>`}
function setupMeetingStart(){const btn=document.getElementById('meetingStartBtn'),status=document.getElementById('meetingStatus');if(!btn||!status)return;btn.addEventListener('click',()=>{if(localStorage.getItem('pgax_demo_auth')!=='true'){status.textContent='Inloggen is vereist om de demo-vergadering te starten.';return}const time=new Date().toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'});status.className='meeting-status active';status.innerHTML=`<strong>Demo-vergadering gestart</strong><br>Actief sinds ${time}.`})}

document.addEventListener('DOMContentLoaded',()=>{initCharts();initMap();syncAuthClass();protectedCheck();document.getElementById('login-form')?.addEventListener('submit',loginSubmit);document.getElementById('logout-btn')?.addEventListener('click',logout);setupDemoSearch();renderCaseDetail();setupMeetingStart()});
