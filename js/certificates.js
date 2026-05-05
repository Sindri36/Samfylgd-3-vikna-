// Sample certificate data
const certificates = [
  { name: 'Læknisvottorð',           id: 'VT-7701', expiry: '2026-06-15', issuer: 'Heilsugæslan Garðabæ' },
  { name: 'Örorkuvottorð',           id: 'VT-7702', expiry: '2027-01-10', issuer: 'Tryggingastofnun' },
  { name: 'Vinnufærnisvottorð',      id: 'VT-7703', expiry: '2026-05-20', issuer: 'Heilsugæslan Mjódd' },
  { name: 'Sjúkdómsvottorð',         id: 'VT-7704', expiry: '2026-04-28', issuer: 'Landspítali' },
  { name: 'Endurhæfingarvottorð',    id: 'VT-7705', expiry: '2026-09-01', issuer: 'Reykjalundur' },
  { name: 'Færniskerðingarvottorð',  id: 'VT-7706', expiry: '2026-12-15', issuer: 'Greiningarstöð' },
];

// ── localStorage ──
const CERT_STORAGE = 'samfylgd:cert-applied:';

function loadApplication(id) {
  try {
    const raw = localStorage.getItem(CERT_STORAGE + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveApplication(id, data) {
  localStorage.setItem(CERT_STORAGE + id, JSON.stringify(data));
}

// ── Date helpers ──
function formatIcelandic(dateStr) {
  return new Date(dateStr).toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Render table ──
const tbody = document.getElementById('certBody');

function renderTable() {
  tbody.innerHTML = '';
  certificates.forEach((cert) => {
    const application = loadApplication(cert.id);

    const action = application
      ? `<span class="renew-status">Umsókn send ${new Date(application.appliedOn).toLocaleDateString('is-IS')}</span>`
      : `<a href="#" class="rx-renew" data-id="${cert.id}">Sækja um endurnýjun</a>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cert.name}</td>
      <td class="rx-id">${cert.id}</td>
      <td>${expiryBadge(cert.expiry)}</td>
      <td>${action}</td>
    `;
    tbody.appendChild(tr);
  });
}

renderTable();

// ── Modal logic ──
const overlay      = document.getElementById('certModal');
const closeBtn     = document.getElementById('certClose');
const titleEl      = document.getElementById('certTitle');
const subEl        = document.getElementById('certSub');

const detailName   = document.getElementById('certDetailName');
const detailId     = document.getElementById('certDetailId');
const detailIssuer = document.getElementById('certDetailIssuer');
const detailExpiry = document.getElementById('certDetailExpiry');

const formEl       = document.getElementById('certForm');
const reasonInput  = document.getElementById('certReason');
const errorMsg     = document.getElementById('certError');
const successMsg   = document.getElementById('certSuccess');

let currentCert = null;

function openModalFor(certId) {
  const cert = certificates.find((c) => c.id === certId);
  if (!cert) return;
  currentCert = cert;

  titleEl.textContent = `Sækja um nýtt: ${cert.name}`;
  subEl.textContent   = `Umsókn fer til ${cert.issuer}.`;

  detailName.textContent   = cert.name;
  detailId.textContent     = cert.id;
  detailIssuer.textContent = cert.issuer;
  detailExpiry.textContent = formatIcelandic(cert.expiry);

  reasonInput.value = '';
  errorMsg.classList.remove('show');
  successMsg.classList.remove('show');
  formEl.style.display = 'flex';

  overlay.classList.add('show');
  setTimeout(() => reasonInput.focus(), 80);
}

function closeModal() {
  overlay.classList.remove('show');
  currentCert = null;
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
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
});

// Submit application
formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentCert) return;

  const reason = reasonInput.value.trim();
  if (!reason) {
    errorMsg.classList.add('show');
    return;
  }

  errorMsg.classList.remove('show');

  saveApplication(currentCert.id, {
    appliedOn: new Date().toISOString(),
    reason,
  });

  formEl.style.display = 'none';
  successMsg.textContent = `Umsókn send til ${currentCert.issuer}.`;
  successMsg.classList.add('show');

  renderTable();

  setTimeout(() => {
    closeModal();
  }, 1800);
});
