// ── Storage ──
const FOLDER_KEY = 'samfylgd:child-folder';

// ── List schemas: which fields each row has ──
const LIST_SCHEMAS = {
  diagnoses: [
    { key: 'name',  label: 'Greining / heilkenni', placeholder: 't.d. einhverfurófsröskun' },
    { key: 'date',  label: 'Greint',                placeholder: 'dd.mm.áááá' },
    { key: 'notes', label: 'Nótur',                 placeholder: 'Stutt athugasemd' },
  ],
  medications: [
    { key: 'drug',     label: 'Lyf',         placeholder: 't.d. Risperdal' },
    { key: 'dosage',   label: 'Skammtur',    placeholder: 't.d. 0,5 mg' },
    { key: 'schedule', label: 'Tímasetning', placeholder: 't.d. kvölds' },
  ],
  equipment: [
    { key: 'name',  label: 'Hjálpartæki / búnaður', placeholder: 't.d. hjólastóll, hlustunartæki' },
    { key: 'where', label: 'Hvar',                  placeholder: 't.d. heima, í skóla' },
    { key: 'notes', label: 'Athugasemdir',          placeholder: 'Stærð, viðhald, o.s.frv.' },
  ],
  contacts: [
    { key: 'name',  label: 'Nafn',     placeholder: 't.d. Dr. Anna Kristjánsdóttir' },
    { key: 'role',  label: 'Hlutverk', placeholder: 't.d. heimilislæknir, kennari' },
    { key: 'phone', label: 'Sími',     placeholder: 't.d. 555 1234' },
  ],
  procedures: [
    { key: 'date',      label: 'Dagsetning', placeholder: 'dd.mm.áááá' },
    { key: 'procedure', label: 'Aðgerð / atburður', placeholder: 't.d. svæfing, aðgerð á hné' },
    { key: 'where',     label: 'Hvar',       placeholder: 't.d. Landspítali' },
  ],
};

// ── Helpers ──
function loadFolder() {
  try {
    const raw = localStorage.getItem(FOLDER_KEY);
    if (!raw) return emptyFolder();
    const parsed = JSON.parse(raw);
    return Object.assign(emptyFolder(), parsed);
  } catch {
    return emptyFolder();
  }
}

function emptyFolder() {
  return {
    basics:   { name: '', birthdate: '', height: '', weight: '', personality: '', family: '' },
    care:     { distraction: '', communication: '', calming: '', avoid: '' },
    history:  { milestones: '' },
    diagnoses: [],
    medications: [],
    equipment: [],
    contacts: [],
    procedures: [],
    savedAt: null,
  };
}

function saveFolder(folder) {
  folder.savedAt = new Date().toISOString();
  localStorage.setItem(FOLDER_KEY, JSON.stringify(folder));
  updateSavedAt(folder.savedAt);
}

function updateSavedAt(iso) {
  const el = document.getElementById('folderSavedAt');
  if (!iso) { el.textContent = 'Engar breytingar enn'; return; }
  const t = new Date(iso).toLocaleString('is-IS', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  el.textContent = `Síðast vistað ${t}`;
}

// ── Set value at "basics.name" path ──
function setPath(obj, path, value) {
  const parts = path.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (curr[parts[i]] === undefined) curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

// ── State (single source of truth) ──
let folder = loadFolder();

// ── Render dynamic list rows ──
function renderList(listName) {
  const container = document.getElementById(listName + 'List');
  const schema    = LIST_SCHEMAS[listName];
  const rows      = folder[listName] || [];
  container.innerHTML = '';

  if (!rows.length) {
    const empty = document.createElement('p');
    empty.className = 'folder-empty';
    empty.textContent = 'Ekkert skráð enn.';
    container.appendChild(empty);
    return;
  }

  rows.forEach((row, idx) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'folder-row';

    schema.forEach((field) => {
      const wrap = document.createElement('div');
      wrap.className = 'form-group';

      const label = document.createElement('label');
      label.textContent = field.label;
      wrap.appendChild(label);

      const isPhone = field.key === 'phone';
      const input = document.createElement(field.key === 'notes' ? 'textarea' : 'input');
      if (input.tagName === 'INPUT') input.type = isPhone ? 'tel' : 'text';
      if (input.tagName === 'TEXTAREA') input.rows = 2;
      input.placeholder = field.placeholder || '';
      input.value = row[field.key] || '';

      input.addEventListener('input', () => {
        folder[listName][idx][field.key] = input.value;
        debouncedSave();
      });

      wrap.appendChild(input);
      rowEl.appendChild(wrap);
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove-row';
    removeBtn.title = 'Eyða færslu';
    removeBtn.setAttribute('aria-label', 'Eyða færslu');
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', () => {
      folder[listName].splice(idx, 1);
      saveFolder(folder);
      renderList(listName);
      flashSaved();
    });
    rowEl.appendChild(removeBtn);

    container.appendChild(rowEl);
  });
}

// ── Hook up text fields with data-field paths ──
function bindFields() {
  document.querySelectorAll('[data-field]').forEach((el) => {
    const path = el.dataset.field;
    el.value = getPath(folder, path) || '';
    el.addEventListener('input', () => {
      setPath(folder, path, el.value);
      debouncedSave();
    });
  });
}

// ── Debounced save ──
let saveTimer = null;
function debouncedSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveFolder(folder);
    flashSaved();
  }, 700);
}

const successEl = document.getElementById('folderSuccess');
let successTimer = null;
function flashSaved() {
  successEl.textContent = 'Vistað sjálfvirkt.';
  successEl.classList.add('show');
  clearTimeout(successTimer);
  successTimer = setTimeout(() => successEl.classList.remove('show'), 1400);
}

// ── Add row buttons ──
document.querySelectorAll('.btn-add').forEach((btn) => {
  btn.addEventListener('click', () => {
    const listName = btn.dataset.list;
    const schema = LIST_SCHEMAS[listName];
    const blank = {};
    schema.forEach((f) => { blank[f.key] = ''; });
    folder[listName].push(blank);
    saveFolder(folder);
    renderList(listName);
  });
});

// ── Clear all ──
document.getElementById('folderClear').addEventListener('click', () => {
  if (!confirm('Eyða öllum upplýsingum úr möppunni? Þetta er ekki hægt að taka til baka.')) return;
  folder = emptyFolder();
  localStorage.removeItem(FOLDER_KEY);
  bindFields();
  Object.keys(LIST_SCHEMAS).forEach(renderList);
  updateSavedAt(null);
  flashSaved();
  successEl.textContent = 'Mappa hreinsuð.';
});

// ── Initial render ──
bindFields();
Object.keys(LIST_SCHEMAS).forEach(renderList);
updateSavedAt(folder.savedAt);
