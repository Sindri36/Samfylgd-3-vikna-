// ── Storage keys ──
const REVIEW_DRAFT_KEY     = 'samfylgd:review-draft';
const REVIEW_SUBMITTED_KEY = 'samfylgd:review-submitted';

// ── Certificates list (mirror of data in js/certificates.js) ──
// If a new certificate is added in certificates.js, also add it here so it
// shows up in the "Vottorð sem fylgir umsókn" dropdown.
const REVIEW_CERTIFICATES = [
  { name: 'Læknisvottorð',          id: 'VT-7701' },
  { name: 'Örorkuvottorð',          id: 'VT-7702' },
  { name: 'Vinnufærnisvottorð',     id: 'VT-7703' },
  { name: 'Sjúkdómsvottorð',        id: 'VT-7704' },
  { name: 'Endurhæfingarvottorð',   id: 'VT-7705' },
  { name: 'Færniskerðingarvottorð', id: 'VT-7706' },
];

function populateCertOptions() {
  const select = document.getElementById('attachedCert');
  if (!select) return;
  select.innerHTML = '<option value="">Veldu...</option>';
  REVIEW_CERTIFICATES.forEach((cert) => {
    const opt = document.createElement('option');
    opt.value = cert.id;
    opt.textContent = `${cert.name} (${cert.id})`;
    select.appendChild(opt);
  });
}

populateCertOptions();

// ── Field IDs that are part of the form ──
const FIELDS = [
  'parentName', 'parentKt', 'parentAddress', 'parentPhone', 'parentEmail',
  'childName', 'childKt', 'childRelation', 'childLivesWith',
  'diagnosis', 'doctor', 'hoursPerWeek', 'careDescription', 'extraSupport',
  'attachedCert',
];

// ── Element refs ──
const statusEl   = document.getElementById('reviewStatus');
const savedAtEl  = document.getElementById('reviewSavedAt');
const successEl  = document.getElementById('reviewSuccess');
const errorEl    = document.getElementById('reviewError');

const saveBtn    = document.getElementById('reviewSave');
const clearBtn   = document.getElementById('reviewClear');
const submitBtn  = document.getElementById('reviewSubmit');

// ── Helpers ──
function getFormData() {
  const data = {};
  FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value;
  });
  return data;
}

function setFormData(data) {
  if (!data) return;
  FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el && typeof data[id] === 'string') el.value = data[id];
  });
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(REVIEW_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadSubmitted() {
  try {
    const raw = localStorage.getItem(REVIEW_SUBMITTED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft() {
  const payload = {
    data: getFormData(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(REVIEW_DRAFT_KEY, JSON.stringify(payload));
  return payload;
}

function clearDraft() {
  localStorage.removeItem(REVIEW_DRAFT_KEY);
}

function clearSubmission() {
  localStorage.removeItem(REVIEW_SUBMITTED_KEY);
}

function formatTime(isoStr) {
  return new Date(isoStr).toLocaleString('is-IS', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function updateStatus() {
  const submitted = loadSubmitted();
  const draft     = loadDraft();

  if (submitted) {
    statusEl.textContent = 'Send inn';
    statusEl.className = 'review-status review-status-submitted';
    savedAtEl.textContent = `Send ${formatTime(submitted.submittedAt)}`;
  } else if (draft) {
    statusEl.textContent = 'Drög';
    statusEl.className = 'review-status review-status-draft';
    savedAtEl.textContent = `Vistað ${formatTime(draft.savedAt)}`;
  } else {
    statusEl.textContent = 'Ný umsókn';
    statusEl.className = 'review-status';
    savedAtEl.textContent = '';
  }
}

function flashSuccess(text) {
  successEl.textContent = text;
  successEl.classList.add('show');
  setTimeout(() => successEl.classList.remove('show'), 2200);
}

// ── Initial load: prefer submitted snapshot, fall back to draft ──
const submitted = loadSubmitted();
const draft     = loadDraft();
setFormData(submitted ? submitted.data : draft ? draft.data : null);
updateStatus();

// ── Save draft ──
saveBtn.addEventListener('click', () => {
  errorEl.classList.remove('show');
  saveDraft();
  // If they edit after submitting, demote status back to draft.
  clearSubmission();
  updateStatus();
  flashSuccess('Drög vistuð.');
});

// ── Auto-save on input (debounced) ──
let autoSaveTimer = null;
FIELDS.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      saveDraft();
      // Editing after submission → back to draft state
      clearSubmission();
      updateStatus();
    }, 800);
  });
});

// ── Clear form ──
clearBtn.addEventListener('click', () => {
  if (!confirm('Eyða öllum upplýsingum úr umsókninni?')) return;
  FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = '';
  });
  clearDraft();
  clearSubmission();
  updateStatus();
  flashSuccess('Umsókn hreinsuð.');
});

// ── Submit ──
submitBtn.addEventListener('click', () => {
  errorEl.classList.remove('show');
  const data = getFormData();

  // Minimum required fields
  if (!data.parentName.trim() || !data.childName.trim() || !data.careDescription.trim()) {
    errorEl.classList.add('show');
    return;
  }

  const payload = {
    data,
    submittedAt: new Date().toISOString(),
  };
  localStorage.setItem(REVIEW_SUBMITTED_KEY, JSON.stringify(payload));
  // Keep draft in sync as the latest version.
  saveDraft();
  updateStatus();
  flashSuccess('Umsókn send. Þú færð staðfestingu í pósti.');
});
