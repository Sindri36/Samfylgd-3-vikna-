const tryggingar = [
  { name: 'Sjúkratrygging – grunnvernd',   id: 'TR-5501', expiry: '2026-12-31' },
  { name: 'Slysatrygging',                 id: 'TR-5502', expiry: '2026-07-01' },
  { name: 'Lyfjakostnaðarvernd',           id: 'TR-5503', expiry: '2026-05-25' },
  { name: 'Tannlæknaþjónusta – börn',      id: 'TR-5504', expiry: '2026-05-10' },
  { name: 'Ferðatrygging',                 id: 'TR-5505', expiry: '2026-04-15' },
];

renderEntitlementTable('tryggingarBody', tryggingar);
