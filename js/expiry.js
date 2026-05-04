/**
 * Returns an HTML string for a coloured expiry badge.
 * Green  = more than 30 days remaining
 * Orange = 1–30 days remaining
 * Red    = expired
 */
function expiryBadge(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  const label = expiry.toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' });

  let cls;
  if (daysLeft < 0)  cls = 'exp-red';
  else if (daysLeft <= 30) cls = 'exp-orange';
  else cls = 'exp-green';

  return `<span class="exp-badge ${cls}">${label}</span>`;
}

function renderEntitlementTable(tbodyId, rows) {
  const tbody = document.getElementById(tbodyId);
  rows.forEach(({ name, id, expiry }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${name}</td>
      <td class="rx-id">${id}</td>
      <td>${expiryBadge(expiry)}</td>
    `;
    tbody.appendChild(tr);
  });
}
