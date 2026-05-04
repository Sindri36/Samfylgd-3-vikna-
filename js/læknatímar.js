const appointments = [
  // Upcoming
  { date: '2026-05-12', time: '10:30', doctor: 'Dr. Sigríður Björnsdóttir', type: 'Almenn skoðun',    location: 'Heilsugæslan Árbær',    upcoming: true  },
  { date: '2026-05-28', time: '14:00', doctor: 'Dr. Gunnar Helgason',       type: 'Blóðprufa',        location: 'Landspítali',           upcoming: true  },
  { date: '2026-06-10', time: '09:15', doctor: 'Dr. Anna Kristjánsdóttir',  type: 'Eftirlit',         location: 'Heilsugæslan Breiðholt', upcoming: true  },
  // Past
  { date: '2026-04-03', time: '11:00', doctor: 'Dr. Sigríður Björnsdóttir', type: 'Almenn skoðun',    location: 'Heilsugæslan Árbær',    upcoming: false },
  { date: '2026-03-18', time: '13:30', doctor: 'Dr. Gunnar Helgason',       type: 'Blóðprufa',        location: 'Landspítali',           upcoming: false },
  { date: '2026-02-25', time: '08:45', doctor: 'Dr. Páll Einarsson',        type: 'Röntgenmynd',      location: 'Landspítali',           upcoming: false },
  { date: '2026-01-14', time: '15:00', doctor: 'Dr. Anna Kristjánsdóttir',  type: 'Eftirlit',         location: 'Heilsugæslan Breiðholt', upcoming: false },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderRows(tbodyId, rows) {
  const tbody = document.getElementById(tbodyId);
  rows.forEach(({ date, time, doctor, type, location }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(date)}</td>
      <td>${time}</td>
      <td>${doctor}</td>
      <td>${type}</td>
      <td>${location}</td>
    `;
    tbody.appendChild(tr);
  });
}

renderRows('upcomingBody', appointments.filter(a => a.upcoming));
renderRows('pastBody',     appointments.filter(a => !a.upcoming));
