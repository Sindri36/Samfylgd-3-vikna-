// Sample prescription data
const prescriptions = [
  { drug: 'Metformín',    id: 'RX-10042', expiry: '2026-05-20' },
  { drug: 'Atorvastatín', id: 'RX-10078', expiry: '2026-05-08' },
  { drug: 'Amoxicillín',  id: 'RX-10091', expiry: '2026-04-30' },
  { drug: 'Levotýroxín',  id: 'RX-10115', expiry: '2026-08-14' },
  { drug: 'Ómeprazól',    id: 'RX-10133', expiry: '2026-05-15' },
];

function expiryStatus(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0)  return { label: 'Útrunnið',       cls: 'exp-red' };
  if (daysLeft < 10) return { label: `${daysLeft} dagar`, cls: 'exp-orange' };
  return               { label: expiry.toLocaleDateString('is-IS'), cls: 'exp-green' };
}

const tbody = document.getElementById('rxBody');

prescriptions.forEach(({ drug, id, expiry }) => {
  const { label, cls } = expiryStatus(expiry);
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${drug}</td>
    <td class="rx-id">${id}</td>
    <td><span class="exp-badge ${cls}">${label}</span></td>
  `;
  tbody.appendChild(tr);
});
