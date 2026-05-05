// Sample compensation / benefit data
const compensations = [
  { name: 'Örorkulífeyrir',         id: 'BT-3301', expiry: '2026-12-31', agency: 'Tryggingastofnun' },
  { name: 'Endurhæfingarlífeyrir',  id: 'BT-3302', expiry: '2026-06-15', agency: 'Tryggingastofnun' },
  { name: 'Foreldragreiðslur',      id: 'BT-3303', expiry: '2026-05-12', agency: 'Fæðingarorlofssjóður' },
  { name: 'Atvinnuleysisbætur',     id: 'BT-3304', expiry: '2026-05-25', agency: 'Vinnumálastofnun' },
  { name: 'Húsnæðisbætur',          id: 'BT-3305', expiry: '2026-08-01', agency: 'Húsnæðis- og mannvirkjastofnun' },
  { name: 'Barnabætur',             id: 'BT-3306', expiry: '2026-04-20', agency: 'Skatturinn' },
  { name: 'Umönnunarbætur',         id: 'BT-3307', expiry: '2026-04-20', agency: 'Tryggingarstofnun' },

];

// ── localStorage ──
const COMP_STORAGE = 'samfylgd:comp-renewed:';

function loadRenewal(id) {
  try {
    const raw = localStorage.getItem(COMP_STORAGE + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveRenewal(id, data) {
  localStorage.setItem(COMP_STORAGE + id, JSON.stringify(data));
}

// ── Date helpers ──
function addOneYear(dateStr) {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

function formatIcelandic(dateStr) {
  return new Date(dateStr).toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Effective expiry (renewed if applicable) ──
function effectiveExpiry(comp) {
  const renewed = loadRenewal(comp.id);
  return renewed ? renewed.newExpiry : comp.expiry;
}

// ── Render table ──
const tbody = document.getElementById('compBody');

function renderTable() {
  tbody.innerHTML = '';
  compensations.forEach((comp) => {
    const expiryDate = effectiveExpiry(comp);
    const renewed    = loadRenewal(comp.id);

    const action = renewed
      ? `<span class="renew-status">Endurnýjað ${new Date(renewed.renewedOn).toLocaleDateString('is-IS')}</span>`
      : `<a href="#" class="rx-renew" data-id="${comp.id}">Endurnýja</a>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${comp.name}</td>
      <td class="rx-id">${comp.id}</td>
      <td>${expiryBadge(expiryDate)}</td>
      <td>${action}</td>
    `;
    tbody.appendChild(tr);
  });
}

renderTable();

// ── Modal logic ──
const overlay      = document.getElementById('compModal');
const closeBtn     = document.getElementById('compClose');
const titleEl      = document.getElementById('compTitle');
const subEl        = document.getElementById('compSub');

const detailName   = document.getElementById('compDetailName');
const detailId     = document.getElementById('compDetailId');
const detailAgency = document.getElementById('compDetailAgency');
const detailExpiry = document.getElementById('compDetailExpiry');
const detailNew    = document.getElementById('compDetailNew');

const successMsg   = document.getElementById('compSuccess');
const errorMsg     = document.getElementById('compError');
const actionRow    = document.getElementById('compActionRow');

const cancelBtn    = document.getElementById('compCancel');
const confirmBtn   = document.getElementById('compConfirm');

let currentComp = null;

function openModalFor(compId) {
  const comp = compensations.find((c) => c.id === compId);
  if (!comp) return;
  currentComp = comp;

  titleEl.textContent = `Endurnýja ${comp.name}`;
  subEl.textContent   = 'Staðfestu endurnýjun fyrir næsta tímabil.';

  const currentExpiry = effectiveExpiry(comp);
  const newExpiry     = addOneYear(currentExpiry);

  detailName.textContent   = comp.name;
  detailId.textContent     = comp.id;
  detailAgency.textContent = comp.agency;
  detailExpiry.textContent = formatIcelandic(currentExpiry);
  detailNew.textContent    = formatIcelandic(newExpiry);

  successMsg.classList.remove('show');
  errorMsg.classList.remove('show');
  actionRow.style.display = 'flex';

  overlay.classList.add('show');
}

function closeModal() {
  overlay.classList.remove('show');
  currentComp = null;
}

// Open from table links
tbody.addEventListener('click', (e) => {
  const link = e.target.closest('.rx-renew');
  if (!link) return;
  e.preventDefault();
  openModalFor(link.dataset.id);
});

// Close
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
});

// Confirm renewal
confirmBtn.addEventListener('click', () => {
  if (!currentComp) return;

  const currentExpiry = effectiveExpiry(currentComp);
  const newExpiry     = addOneYear(currentExpiry);

  saveRenewal(currentComp.id, {
    renewedOn: new Date().toISOString(),
    newExpiry,
  });

  successMsg.textContent = `Endurnýjun staðfest. Nýr gildistími: ${formatIcelandic(newExpiry)}`;
  successMsg.classList.add('show');
  actionRow.style.display = 'none';

  renderTable();

  // Auto-close after a moment
  setTimeout(() => {
    closeModal();
  }, 1800);
});
