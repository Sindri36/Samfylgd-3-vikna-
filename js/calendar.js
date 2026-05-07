// ────────────────────────────────────────────────────────────
// Mirror data from prescription / certificates / compensation /
// doctor-appointments pages. In a real app this would come from
// a shared source.
// ────────────────────────────────────────────────────────────
const calPrescriptions = [
  { drug: 'Metformín',    id: 'RX-10042', expiry: '2026-05-20' },
  { drug: 'Atorvastatín', id: 'RX-10078', expiry: '2026-05-08' },
  { drug: 'Amoxicillín',  id: 'RX-10091', expiry: '2026-04-30' },
  { drug: 'Levotýroxín',  id: 'RX-10115', expiry: '2026-08-14' },
  { drug: 'Ómeprazól',    id: 'RX-10133', expiry: '2026-05-15' },
];

const calCertificates = [
  { name: 'Læknisvottorð',           id: 'VT-7701', expiry: '2026-06-15', issuer: 'Heilsugæslan Garðabæ' },
  { name: 'Örorkuvottorð',           id: 'VT-7702', expiry: '2027-01-10', issuer: 'Tryggingastofnun' },
  { name: 'Vinnufærnisvottorð',      id: 'VT-7703', expiry: '2026-05-20', issuer: 'Heilsugæslan Mjódd' },
  { name: 'Sjúkdómsvottorð',         id: 'VT-7704', expiry: '2026-04-28', issuer: 'Landspítali' },
  { name: 'Endurhæfingarvottorð',    id: 'VT-7705', expiry: '2026-09-01', issuer: 'Reykjalundur' },
  { name: 'Færniskerðingarvottorð',  id: 'VT-7706', expiry: '2026-12-15', issuer: 'Greiningarstöð' },
];

const calCompensations = [
  { name: 'Örorkulífeyrir',         id: 'BT-3301', expiry: '2026-12-31' },
  { name: 'Endurhæfingarlífeyrir',  id: 'BT-3302', expiry: '2026-06-15' },
  { name: 'Foreldragreiðslur',      id: 'BT-3303', expiry: '2026-05-12' },
  { name: 'Atvinnuleysisbætur',     id: 'BT-3304', expiry: '2026-05-25' },
  { name: 'Húsnæðisbætur',          id: 'BT-3305', expiry: '2026-08-01' },
  { name: 'Barnabætur',             id: 'BT-3306', expiry: '2026-04-20' },
  { name: 'Umönnunarbætur',         id: 'BT-3307', expiry: '2026-04-20' },
];

const calAppointments = [
  { date: '2026-05-12', time: '10:30', doctor: 'Dr. Sigríður Björnsdóttir', type: 'Almenn skoðun',  location: 'Heilsugæslan Árbær' },
  { date: '2026-05-28', time: '14:00', doctor: 'Dr. Gunnar Helgason',       type: 'Blóðprufa',      location: 'Landspítali' },
  { date: '2026-06-10', time: '09:15', doctor: 'Dr. Anna Kristjánsdóttir',  type: 'Eftirlit',       location: 'Heilsugæslan Breiðholt' },
  { date: '2026-04-03', time: '11:00', doctor: 'Dr. Sigríður Björnsdóttir', type: 'Almenn skoðun',  location: 'Heilsugæslan Árbær' },
  { date: '2026-03-18', time: '13:30', doctor: 'Dr. Gunnar Helgason',       type: 'Blóðprufa',      location: 'Landspítali' },
  { date: '2026-02-25', time: '08:45', doctor: 'Dr. Páll Einarsson',        type: 'Röntgenmynd',    location: 'Landspítali' },
  { date: '2026-01-14', time: '15:00', doctor: 'Dr. Anna Kristjánsdóttir',  type: 'Eftirlit',       location: 'Heilsugæslan Breiðholt' },
];

// Read renewed compensation expiries from localStorage
function effectiveCompExpiry(comp) {
  try {
    const raw = localStorage.getItem('samfylgd:comp-renewed:' + comp.id);
    if (!raw) return comp.expiry;
    const parsed = JSON.parse(raw);
    return parsed.newExpiry || comp.expiry;
  } catch {
    return comp.expiry;
  }
}

// ────────────────────────────────────────────────────────────
// Build a unified event list keyed by ISO date (YYYY-MM-DD)
// ────────────────────────────────────────────────────────────
function buildEvents() {
  const events = {};

  function add(dateStr, event) {
    if (!events[dateStr]) events[dateStr] = [];
    events[dateStr].push(event);
  }

  calAppointments.forEach((a) => {
    add(a.date, {
      type: 'appt',
      label: `${a.time} — ${a.type}`,
      detail: `${a.doctor}, ${a.location}`,
    });
  });

  // User-booked appointments from localStorage
  try {
    const raw = localStorage.getItem('samfylgd:booked-appointments');
    const bookings = raw ? JSON.parse(raw) : [];
    bookings.forEach((b) => {
      add(b.date, {
        type: 'appt',
        label: `${b.time} — ${b.type} (bókað)`,
        detail: `${b.doctor}, ${b.location}`,
      });
    });
  } catch { /* ignore */ }

  calPrescriptions.forEach((rx) => {
    add(rx.expiry, {
      type: 'rx',
      label: `Lyfjaseðill rennur út: ${rx.drug}`,
      detail: `Seðill ${rx.id}`,
    });
  });

  calCertificates.forEach((cert) => {
    add(cert.expiry, {
      type: 'cert',
      label: `Vottorð rennur út: ${cert.name}`,
      detail: `Útgefandi: ${cert.issuer}`,
    });
  });

  calCompensations.forEach((comp) => {
    add(effectiveCompExpiry(comp), {
      type: 'comp',
      label: `Bætur renna út: ${comp.name}`,
      detail: `Númer ${comp.id}`,
    });
  });

  return events;
}

let eventsByDate = buildEvents();

// Rebuild events from current localStorage state. Call this whenever the
// page becomes visible again (e.g. after the user renewed something on a
// different page and pressed Back) so the calendar reflects the latest data.
function refreshEvents() {
  eventsByDate = buildEvents();
  render();
  if (selectedKey) showDetailFor(selectedKey);
  renderUpcoming();
}

// ────────────────────────────────────────────────────────────
// Calendar rendering
// ────────────────────────────────────────────────────────────
const monthNames = [
  'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
  'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember',
];

const monthLabel = document.getElementById('monthLabel');
const grid       = document.getElementById('calGrid');
const detailEl   = document.getElementById('detailTitle');
const detailEmpty= document.getElementById('detailEmpty');
const detailList = document.getElementById('detailList');

const today = new Date();
today.setHours(0, 0, 0, 0);

// Start at current month
let viewYear  = today.getFullYear();
let viewMonth = today.getMonth(); // 0-indexed
let selectedKey = null;

function pad(n) { return String(n).padStart(2, '0'); }
function dateKey(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

function clearDayCells() {
  // Remove only day cells, keep weekday headers
  Array.from(grid.querySelectorAll('.cal-day')).forEach((el) => el.remove());
}

function render() {
  monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
  clearDayCells();

  // Monday-first offset (Iceland convention)
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const jsDay = firstOfMonth.getDay(); // 0 = Sun ... 6 = Sat
  const offset = (jsDay + 6) % 7;      // 0 = Mon ... 6 = Sun

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Leading blanks
  for (let i = 0; i < offset; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-day cal-day-blank';
    grid.appendChild(blank);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(viewYear, viewMonth, d);
    const cell = document.createElement('button');
    cell.className = 'cal-day';
    cell.type = 'button';
    cell.dataset.key = key;

    const isToday = key === dateKey(today.getFullYear(), today.getMonth(), today.getDate());
    if (isToday) cell.classList.add('cal-day-today');
    if (key === selectedKey) cell.classList.add('cal-day-selected');

    const num = document.createElement('span');
    num.className = 'cal-day-num';
    num.textContent = d;
    cell.appendChild(num);

    const events = eventsByDate[key];
    if (events && events.length) {
      const dots = document.createElement('span');
      dots.className = 'cal-dots';
      // unique types only, max 4 dots
      const seenTypes = new Set();
      events.forEach((e) => {
        if (seenTypes.has(e.type)) return;
        seenTypes.add(e.type);
        const dot = document.createElement('span');
        dot.className = `cal-dot cal-dot-${e.type}`;
        dots.appendChild(dot);
      });
      cell.appendChild(dots);
    }

    cell.addEventListener('click', () => {
      selectedKey = key;
      render();
      showDetailFor(key);
    });

    grid.appendChild(cell);
  }
}

function formatLong(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('is-IS', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

const eventTypeLabel = {
  appt: 'Tímabókun',
  rx:   'Lyfjaseðill',
  cert: 'Vottorð',
  comp: 'Bætur',
};

function showDetailFor(key) {
  detailEl.textContent = formatLong(key);
  detailList.innerHTML = '';
  const events = eventsByDate[key];

  if (!events || !events.length) {
    detailEmpty.textContent = 'Ekkert á döfinni þennan dag.';
    detailEmpty.style.display = 'block';
    return;
  }

  detailEmpty.style.display = 'none';

  events.forEach((e) => {
    const li = document.createElement('li');
    li.className = `cal-event cal-event-${e.type}`;
    li.innerHTML = `
      <span class="cal-event-type">${eventTypeLabel[e.type]}</span>
      <span class="cal-event-label">${e.label}</span>
      <span class="cal-event-detail">${e.detail}</span>
    `;
    detailList.appendChild(li);
  });
}

document.getElementById('prevMonth').addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  render();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  render();
});

// ── Upcoming events list (shown below the calendar) ──
const upcomingListEl  = document.getElementById('upcomingList');
const upcomingEmptyEl = document.getElementById('upcomingEmpty');

function renderUpcoming() {
  upcomingListEl.innerHTML = '';

  const todayStr = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // Flatten all events with their dates, keep only future ones, sort.
  const flat = [];
  Object.keys(eventsByDate).forEach((key) => {
    if (key < todayStr) return;
    eventsByDate[key].forEach((e) => flat.push({ key, ...e }));
  });
  flat.sort((a, b) => a.key.localeCompare(b.key));

  if (!flat.length) {
    upcomingEmptyEl.style.display = 'block';
    return;
  }
  upcomingEmptyEl.style.display = 'none';

  flat.forEach((e) => {
    const li = document.createElement('li');
    li.className = `cal-event cal-event-${e.type} cal-upcoming-item`;
    li.innerHTML = `
      <span class="cal-upcoming-date">${formatLong(e.key)}</span>
      <span class="cal-event-type">${eventTypeLabel[e.type]}</span>
      <span class="cal-event-label">${e.label}</span>
      <span class="cal-event-detail">${e.detail}</span>
    `;
    li.addEventListener('click', () => {
      // Jump the calendar to this event's month
      const [y, m] = e.key.split('-').map(Number);
      viewYear  = y;
      viewMonth = m - 1;
      selectedKey = e.key;
      render();
      showDetailFor(e.key);
      document.getElementById('detailPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    upcomingListEl.appendChild(li);
  });
}

// Auto-select today if it's in the current view
const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
selectedKey = todayKey;
render();
showDetailFor(todayKey);
renderUpcoming();

// ── Keep calendar in sync ──
// 1. If the page is restored from the bfcache (user pressed Back after
//    renewing something on another page), rebuild from fresh localStorage.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) refreshEvents();
});

// 2. If the user is viewing the calendar while editing in another tab,
//    pick up cross-tab localStorage changes.
window.addEventListener('storage', (e) => {
  if (!e.key) return;
  if (e.key.startsWith('samfylgd:')) refreshEvents();
});

// 3. When the tab regains focus, refresh defensively.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') refreshEvents();
});
