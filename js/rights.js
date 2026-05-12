const ICONS = {
  hospital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="7" width="16" height="14" rx="1.5"/>
    <path d="M9 21v-7h6v7"/>
    <path d="M12 3v4"/>
    <path d="M10 5h4"/>
  </svg>`,
  stethoscope: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 3v6a3.5 3.5 0 0 0 7 0V3"/>
    <path d="M3.5 3h2"/>
    <path d="M10.5 3h2"/>
    <path d="M8 12.5v3a4.5 4.5 0 0 0 9 0v-3"/>
    <circle cx="19" cy="11" r="2"/>
  </svg>`,
  ambulance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 7h11v10H3z"/>
    <path d="M14 11h4l3 3v3h-7"/>
    <circle cx="7.5" cy="18" r="1.5"/>
    <circle cx="17.5" cy="18" r="1.5"/>
    <path d="M6 11h4"/>
    <path d="M8 9v4"/>
  </svg>`,
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5a3 3 0 0 0-3 3v0a2.5 2.5 0 0 0-2.5 2.5v0A2.5 2.5 0 0 0 4 13v0a3 3 0 0 0 1.5 2.6v0A2.5 2.5 0 0 0 8 18.5a3 3 0 0 0 4 .5"/>
    <path d="M12 5a3 3 0 0 1 3 3v0a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 20 13v0a3 3 0 0 1-1.5 2.6v0A2.5 2.5 0 0 1 16 18.5a3 3 0 0 1-4 .5"/>
    <path d="M12 5v14"/>
  </svg>`,
  activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 12h3l3-7 4 14 3-7h5"/>
  </svg>`,
};

const réttindi = [
  {
    icon: ICONS.hospital,
    name: 'Heilbrigðisþjónusta – grunnréttindi',
    summary: 'Grunnréttur til almennrar heilbrigðisþjónustu hjá heilsugæslum og heimilislæknum.',
    includes: [
      'Heimsóknir til heimilislæknis',
      'Læknisskoðun og rannsóknir á heilsugæslu',
      'Bólusetningar',
      'Almenn ráðgjöf og forvarnir',
    ],
    where: 'Þú átt rétt á að skrá þig á heilsugæslu á þínu svæði. Sækja má um í gegnum Heilsuveru eða beint hjá viðkomandi stöð.',
  },
  {
    icon: ICONS.stethoscope,
    name: 'Sérfræðiþjónusta',
    summary: 'Aðgangur að sérfræðilæknum með tilvísun frá heimilislækni.',
    includes: [
      'Tilvísun frá heimilislækni á sérfræðing',
      'Sérfræðiráðgjöf og meðferð',
      'Eftirlit eftir aðgerðir',
      'Sjúkratryggingar greiða hluta kostnaðar',
    ],
    where: 'Hafðu samband við heimilislækninn þinn til að fá tilvísun. Sumar sérgreinar krefjast ekki tilvísunar.',
  },
  {
    icon: ICONS.ambulance,
    name: 'Sjúkraflutningar',
    summary: 'Réttur til neyðarflutninga og skipulagðra sjúkraflutninga þegar læknisfræðileg þörf er á.',
    includes: [
      'Neyðarflutningar með sjúkrabíl (112)',
      'Skipulagðir flutningar milli sjúkrahúsa',
      'Flutningar af landsbyggðinni til Reykjavíkur',
      'Sjúkraflug þegar þörf krefur',
    ],
    where: 'Í neyðartilvikum hringdu í 112. Aðrir flutningar eru skipulagðir af læknum eða sjúkrahúsum.',
  },
  {
    icon: ICONS.brain,
    name: 'Geðheilbrigðisþjónusta',
    summary: 'Aðgangur að geðheilbrigðisþjónustu á heilsugæslu og sérhæfðri þjónustu hjá geðlæknum og sálfræðingum.',
    includes: [
      'Sálfræðiþjónusta á heilsugæslu',
      'Geðlæknisþjónusta með tilvísun',
      'Bráðamóttaka geðdeildar Landspítala',
      'Þjónusta fyrir börn og unglinga (BUGL)',
    ],
    where: 'Hafðu samband við heilsugæsluna eða Heilsuveru. Bráðatilvik fara um bráðamóttöku Landspítala.',
  },
  {
    icon: ICONS.activity,
    name: 'Endurhæfing',
    summary: 'Réttur til endurhæfingar eftir veikindi, slys eða aðgerðir.',
    includes: [
      'Sjúkraþjálfun',
      'Iðjuþjálfun',
      'Endurhæfing á Reykjalundi og Grensási',
      'Hæfing og þjálfun fyrir börn',
    ],
    where: 'Tilvísun frá lækni er oftast nauðsynleg. Hægt er að sækja um endurhæfingu á Reykjalundi í gegnum lækni.',
  },
];

// ── Elements ──
const listEl   = document.getElementById('rightsList');
const detailEl = document.getElementById('rightsDetail');

let selectedIdx = 0;

function renderList() {
  listEl.innerHTML = '';
  réttindi.forEach((r, idx) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'rights-item' + (idx === selectedIdx ? ' rights-item-active' : '');
    item.innerHTML = `
      <span class="rights-item-icon">${r.icon}</span>
      <span class="rights-item-name">${r.name}</span>
    `;
    item.addEventListener('click', () => {
      selectedIdx = idx;
      renderList();
      renderDetail();
    });
    listEl.appendChild(item);
  });
}

function renderDetail() {
  if (selectedIdx === null) {
    detailEl.innerHTML = '<p class="rights-empty">Veldu réttindi úr listanum.</p>';
    return;
  }
  const r = réttindi[selectedIdx];
  detailEl.innerHTML = `
    <div class="rights-detail-head">
      <span class="rights-detail-icon">${r.icon}</span>
      <h2>${r.name}</h2>
    </div>
    <p class="rights-summary">${r.summary}</p>

    <h3 class="rights-subhead">Hvað innifelur þetta?</h3>
    <ul class="rights-includes">
      ${r.includes.map((i) => `<li>${i}</li>`).join('')}
    </ul>

    <h3 class="rights-subhead">Hvernig nálgastu þetta?</h3>
    <p class="rights-where">${r.where}</p>
  `;
}

renderList();
renderDetail();
