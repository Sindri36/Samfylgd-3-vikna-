// Sample prescription data
const prescriptions = [
  { drug: 'Metformín',    id: 'RX-10042', expiry: '2026-05-20' },
  { drug: 'Atorvastatín', id: 'RX-10078', expiry: '2026-05-08' },
  { drug: 'Amoxicillín',  id: 'RX-10091', expiry: '2026-04-30' },
  { drug: 'Levotýroxín',  id: 'RX-10115', expiry: '2026-08-14' },
  { drug: 'Ómeprazól',    id: 'RX-10133', expiry: '2026-05-15' },
];

// ── Expiry helpers ──
function expiryStatus(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0)  return { label: 'Útrunnið',          cls: 'exp-red' };
  if (daysLeft < 10) return { label: `${daysLeft} dagar`, cls: 'exp-orange' };
  return               { label: expiry.toLocaleDateString('is-IS'), cls: 'exp-green' };
}

// ── localStorage helpers ──
const STORAGE_PREFIX = 'samfylgd:rx-doctor:';

function loadDoctor(rxId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + rxId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDoctor(rxId, data) {
  localStorage.setItem(STORAGE_PREFIX + rxId, JSON.stringify(data));
}

function deleteDoctor(rxId) {
  localStorage.removeItem(STORAGE_PREFIX + rxId);
}

// ── Render table ──
const tbody = document.getElementById('rxBody');

function renderTable() {
  tbody.innerHTML = '';
  prescriptions.forEach(({ drug, id, expiry }) => {
    const { label, cls } = expiryStatus(expiry);
    const doctor = loadDoctor(id);
    const linkLabel = doctor ? 'Hringja / breyta' : 'Bæta við lækni';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${drug}</td>
      <td class="rx-id">${id}</td>
      <td><span class="exp-badge ${cls}">${label}</span></td>
      <td><a href="#" class="rx-renew" data-rx="${id}" data-drug="${drug}">${linkLabel}</a></td>
    `;
    tbody.appendChild(tr);
  });
}

renderTable();

// ── Modal logic ──
const overlay     = document.getElementById('renewModal');
const closeBtn    = document.getElementById('renewClose');
const titleEl     = document.getElementById('renewTitle');
const subEl       = document.getElementById('renewSub');

const savedBox    = document.getElementById('renewSaved');
const savedName   = document.getElementById('renewSavedName');
const savedPhone  = document.getElementById('renewSavedPhone');
const editBtn     = document.getElementById('renewEdit');
const deleteBtn   = document.getElementById('renewDelete');

const formEl      = document.getElementById('renewForm');
const nameInput   = document.getElementById('renewName');
const phoneInput  = document.getElementById('renewPhone');
const errorMsg    = document.getElementById('renewError');

let currentRxId   = null;
let currentDrug   = null;

function openModalFor(rxId, drug) {
  currentRxId = rxId;
  currentDrug = drug;
  titleEl.textContent = `Endurnýja ${drug}`;
  subEl.textContent   = `Seðill ${rxId}`;
  errorMsg.classList.remove('show');

  const doctor = loadDoctor(rxId);
  if (doctor) {
    showSavedView(doctor);
  } else {
    showFormView('', '');
  }

  overlay.classList.add('show');
}

function showSavedView(doctor) {
  savedName.textContent  = doctor.name;
  savedPhone.textContent = doctor.phone;
  savedPhone.href        = 'tel:' + doctor.phone.replace(/\s+/g, '');
  savedBox.style.display = 'block';
  formEl.style.display   = 'none';
}

function showFormView(name, phone) {
  nameInput.value  = name || '';
  phoneInput.value = phone || '';
  savedBox.style.display = 'none';
  formEl.style.display   = 'flex';
  setTimeout(() => nameInput.focus(), 80);
}

function closeRenewModal() {
  overlay.classList.remove('show');
  currentRxId = null;
  currentDrug = null;
}

// Open from table links
tbody.addEventListener('click', (e) => {
  const link = e.target.closest('.rx-renew');
  if (!link) return;
  e.preventDefault();
  openModalFor(link.dataset.rx, link.dataset.drug);
});

// Close handlers
closeBtn.addEventListener('click', closeRenewModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeRenewModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('show')) closeRenewModal();
});

// Edit existing entry
editBtn.addEventListener('click', () => {
  const doctor = loadDoctor(currentRxId);
  showFormView(doctor?.name, doctor?.phone);
});

// Delete saved entry
deleteBtn.addEventListener('click', () => {
  if (!currentRxId) return;
  if (!confirm('Eyða vistuðum upplýsingum um lækni?')) return;
  deleteDoctor(currentRxId);
  renderTable();
  closeRenewModal();
});

// Submit form
formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const name  = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    errorMsg.classList.add('show');
    return;
  }

  errorMsg.classList.remove('show');
  saveDoctor(currentRxId, { name, phone });
  renderTable();
  showSavedView({ name, phone });
});
