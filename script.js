
function protectedCheck(){
  const gate = document.getElementById('protected-content');
  const denied = document.getElementById('protected-denied');
  const authed = localStorage.getItem('pgax_demo_auth') === 'true';
  if(gate && denied){
    gate.classList.toggle('hidden', !authed);
    denied.classList.toggle('hidden', authed);
  }
}
function loginSubmit(e){
  e.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const err = document.getElementById('login-error');
  const ok = document.getElementById('login-success');
  if(user === 'SDEV1' && pass === '12345'){
    localStorage.setItem('pgax_demo_auth','true');
    err.classList.add('hidden');
    ok.classList.remove('hidden');
    setTimeout(()=>{ window.location.href='zaken.html'; }, 500);
  } else {
    ok.classList.add('hidden');
    err.classList.remove('hidden');
  }
}
function logout(){
  localStorage.removeItem('pgax_demo_auth');
  window.location.href='login.html';
}
document.addEventListener('DOMContentLoaded', ()=>{
  protectedCheck();
  const form=document.getElementById('login-form');
  if(form) form.addEventListener('submit', loginSubmit);
  const logoutBtn=document.getElementById('logout-btn');
  if(logoutBtn) logoutBtn.addEventListener('click', logout);
  setupDemoSearch();
  renderCaseDetail();
});


const demoRecords = [
  {
    person: "Jan de Boer",
    address: "Hoofdstraat 18, Emmen",
    vehicles: ["K-421-TR", "91-ZK-PL"],
    caseId: "MH-001",
    status: "Actief",
    note: "Fictieve registratie met signalen rond woon-werkafhankelijkheid.",
    partners: ["OOV", "Politie", "AVIM"]
  },
  {
    person: "Mila Petrovic",
    address: "Stationsweg 4, Emmen",
    vehicles: ["N-882-LV"],
    caseId: "MH-002",
    status: "In duiding",
    note: "Fictieve registratie met mogelijk arbeidsgerelateerd signaal.",
    partners: ["Aandachtsfunctionaris", "Arbeidsinspectie", "RIEC"]
  },
  {
    person: "Sander Vos",
    address: "Bargerweg 112, Emmen",
    vehicles: ["T-104-KR", "P-771-SD"],
    caseId: "MH-003",
    status: "Monitoren",
    note: "Fictieve registratie met jeugd- en schuldsignalen.",
    partners: ["Sociaal domein", "Zorg- en Veiligheidshuis"]
  },
  {
    person: "Elena Novak",
    address: "Wilhelminastraat 29, Klazienaveen",
    vehicles: ["L-555-HG"],
    caseId: "MH-004",
    status: "Actief",
    note: "Fictieve registratie in een mogelijk kwetsbare woon-/werksituatie.",
    partners: ["OOV", "Politie", "Arbeidsinspectie"]
  }
];

function renderDemoResults(records){
  const container = document.getElementById('searchResults');
  if(!container) return;
  if(!records.length){
    container.innerHTML = '<div class="empty-state">Geen resultaten gevonden in de demo-registraties.</div>';
    return;
  }
  container.innerHTML = records.map(r => `
    <div class="result-card">
      <h4>${r.person}</h4>
      <div class="meta-grid">
        <div class="meta-item">
          <div class="label">Adres</div>
          <div class="value">${r.address}</div>
        </div>
        <div class="meta-item">
          <div class="label">Kenteken(s)</div>
          <div class="value">${r.vehicles.join(', ')}</div>
        </div>
        <div class="meta-item">
          <div class="label">Casus / status</div>
          <div class="value">${r.caseId} • ${r.status}</div>
        </div>
      </div>
      <div style="margin-top:10px;color:var(--muted);line-height:1.6;">${r.note}</div>
      <div style="margin-top:10px;">
        ${r.partners.map(p => `<span class="tag">${p}</span>`).join('')}
      </div>
      <a class="detail-link" href="case.html?id=${encodeURIComponent(r.caseId)}">Bekijk casusdetails</a>
    </div>
  `).join('');
}

function setupDemoSearch(){
  const btn = document.getElementById('searchBtn');
  if(!btn) return;
  renderDemoResults(demoRecords);
  btn.addEventListener('click', () => {
    const p = (document.getElementById('searchPerson')?.value || '').trim().toLowerCase();
    const k = (document.getElementById('searchPlate')?.value || '').trim().toLowerCase();
    const a = (document.getElementById('searchAddress')?.value || '').trim().toLowerCase();

    const results = demoRecords.filter(r => {
      const personMatch = !p || r.person.toLowerCase().includes(p);
      const plateMatch = !k || r.vehicles.some(v => v.toLowerCase().includes(k));
      const addressMatch = !a || r.address.toLowerCase().includes(a);
      return personMatch && plateMatch && addressMatch;
    });
    renderDemoResults(results);
  });
}



function getCaseById(caseId){
  return demoRecords.find(r => r.caseId === caseId) || null;
}

function renderCaseDetail(){
  const mount = document.getElementById('case-detail-mount');
  if(!mount) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const rec = getCaseById(id);
  if(!rec){
    mount.innerHTML = `
      <section class="card">
        <div class="eyebrow">Casusdetail</div>
        <h2>Casus niet gevonden</h2>
        <p>De gevraagde demo-casus bestaat niet of het ID ontbreekt.</p>
        <a class="btn btn-primary" href="zaken.html">Terug naar lopende zaken</a>
      </section>`;
    return;
  }
  mount.innerHTML = `
    <section class="card">
      <div class="eyebrow">Casusdetail • ${rec.caseId}</div>
      <h2>${rec.person}</h2>
      <p>Fictieve detailpagina in de beschermde omgeving. Deze data is alleen bedoeld voor demo- en presentatiedoeleinden.</p>
    </section>

    <section class="section">
      <div class="section-head">
        <h3>Casusinformatie</h3>
        <p>Overzicht van kerngegevens, status en betrokken partners.</p>
      </div>
      <div class="section-body">
        <div class="case-detail-grid">
          <div class="case-box">
            <h4>Basisgegevens</h4>
            <p><strong>Persoon:</strong> ${rec.person}<br>
            <strong>Adres:</strong> ${rec.address}<br>
            <strong>Kenteken(s):</strong> ${rec.vehicles.join(', ')}<br>
            <strong>Casus-ID:</strong> ${rec.caseId}</p>
          </div>
          <div class="case-box">
            <h4>Status en regie</h4>
            <p><strong>Status:</strong> ${rec.status}<br>
            <strong>Primair doel:</strong> Duiding en casusregie<br>
            <strong>Partneraanhaak:</strong> ${rec.partners.join(', ')}</p>
          </div>
          <div class="case-box">
            <h4>Observaties</h4>
            <p>${rec.note}</p>
          </div>
          <div class="case-box">
            <h4>Vervolgacties (demo)</h4>
            <p>• Casus bespreken in passend overleg<br>
            • Bepalen of partneraanhaak noodzakelijk is<br>
            • Vastleggen welke signalen doorslaggevend zijn<br>
            • Vervolgcontrole of verrijking voorbereiden</p>
          </div>
        </div>
        <div style="margin-top:16px;">
          <a class="btn btn-primary" href="zaken.html">Terug naar lopende zaken</a>
        </div>
      </div>
    </section>
  `;
}
