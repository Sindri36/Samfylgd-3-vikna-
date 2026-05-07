// ── Sample appointments (built into the demo) ──
const appointments = [
  // Upcoming
  { date: '2026-05-12', time: '10:30', doctor: 'Dr. Sigríður Björnsdóttir', type: 'Almenn skoðun',    location: 'Heilsugæslan Árbær' },
  { date: '2026-05-28', time: '14:00', doctor: 'Dr. Gunnar Helgason',       type: 'Blóðprufa',        location: 'Landspítali' },
  { date: '2026-06-10', time: '09:15', doctor: 'Dr. Anna Kristjánsdóttir',  type: 'Eftirlit',         location: 'Heilsugæslan Breiðholt' },
  // Past
  { date: '2026-04-03', time: '11:00', doctor: 'Dr. Sigríður Björnsdóttir', type: 'Almenn skoðun',    location: 'Heilsugæslan Árbær' },
  { date: '2026-03-18', time: '13:30', doctor: 'Dr. Gunnar Helgason',       type: 'Blóðprufa',        location: 'Landspítali' },
  { date: '2026-02-25', time: '08:45', doctor: 'Dr. Páll Einarsson',        type: 'Röntgenmynd',      location: 'Landspítali' },
  { date: '2026-01-14', time: '15:00', doctor: 'Dr. Anna Kristjánsdóttir',  type: 'Eftirlit',         location: 'Heilsugæslan Breiðholt' },
];

// ── User-booked appointments (stored locally) ──
const BOOKING_KEY = 'samfylgd:booked-appointments';

function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveBookings(list) {
  localStorage.setItem(BOOKING_KEY, JSON.stringify(list));
}

// ── Helpers ──
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isUpcoming(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) >= today;
}

// ── Render the two tables ──
function renderRows(tbodyId, rows) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';
  rows.forEach((row) => {
    const { date, time, doctor, type, location, booked, idx } = row;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(date)}${booked ? ' <span class="booked-badge">Bókað</span>' : ''}</td>
      <td>${time}</td>
      <td>${doctor}</td>
      <td>${type}</td>
      <td>${location}${booked ? ` <button type="button" class="cancel-booking" data-idx="${idx}" title="Hætta við">×</button>` : ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAll() {
  const bookings = loadBookings();

  // Sample: filter by upcoming/past based on date
  const sampleUpcoming = appointments.filter((a) =>  isUpcoming(a.date));
  const samplePast     = appointments.filter((a) => !isUpcoming(a.date));

  // Tag bookings with their index so we can cancel them
  const taggedBookings = bookings.map((b, idx) => ({ ...b, booked: true, idx }));

  // Combined upcoming = sample upcoming + future bookings, sorted by date
  const upcoming = [...sampleUpcoming, ...taggedBookings.filter((b) => isUpcoming(b.date))]
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  // Past = sample past + past bookings, newest first
  const past = [...samplePast, ...taggedBookings.filter((b) => !isUpcoming(b.date))]
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  renderRows('upcomingBody', upcoming);
  renderRows('pastBody',     past);
}

renderAll();

// ── Cancel booking handler (event delegation) ──
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.cancel-booking');
  if (!btn) return;
  if (!confirm('Hætta við þennan bókaða tíma?')) return;
  const bookings = loadBookings();
  bookings.splice(parseInt(btn.dataset.idx, 10), 1);
  saveBookings(bookings);
  renderAll();
});

// ── Booking modal ──
const overlay   = document.getElementById('bookingModal');
const openBtn   = document.getElementById('openBooking');
const closeBtn  = document.getElementById('bookingClose');
const formEl    = document.getElementById('bookingForm');
const errorEl   = document.getElementById('bookError');
const successEl = document.getElementById('bookSuccess');

const fType     = document.getElementById('bookType');
const fDoctor   = document.getElementById('bookDoctor');
const fLocation = document.getElementById('bookLocation');
const fDate     = document.getElementById('bookDate');
const fTime     = document.getElementById('bookTime');

openBtn.addEventListener('click', () => {
  formEl.reset();
  errorEl.classList.remove('show');
  successEl.classList.remove('show');
  // Default the date input to today for convenience
  const today = new Date();
  fDate.value = today.toISOString().slice(0, 10);
  overlay.classList.add('show');
  setTimeout(() => fType.focus(), 80);
});

closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('show');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('show')) overlay.classList.remove('show');
});

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const type     = fType.value.trim();
  const doctor   = fDoctor.value.trim();
  const location = fLocation.value.trim();
  const date     = fDate.value;
  const time     = fTime.value;

  if (!type || !doctor || !location || !date || !time) {
    errorEl.classList.add('show');
    return;
  }

  errorEl.classList.remove('show');

  const bookings = loadBookings();
  bookings.push({ date, time, doctor, type, location, bookedAt: new Date().toISOString() });
  saveBookings(bookings);

  successEl.textContent = `Tími bókaður ${formatDate(date)} kl. ${time}.`;
  successEl.classList.add('show');

  renderAll();

  setTimeout(() => {
    overlay.classList.remove('show');
  }, 1400);
});
