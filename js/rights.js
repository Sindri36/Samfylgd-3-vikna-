const ICONS = {
  // State (ríki) icons
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

  // Municipal (sveitarfélag) icons
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 17h14"/>
    <path d="M5 17l-1.5-5h17L19 17"/>
    <path d="M5 12l1.5-5h11l1.5 5"/>
    <circle cx="7" cy="17" r="2"/>
    <circle cx="17" cy="17" r="2"/>
  </svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <path d="M9 22V12h6v10"/>
  </svg>`,
  bed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 4v16"/>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/>
    <circle cx="7" cy="12" r="2"/>
  </svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>`,
};

const rightsCategories = [
  {
    id: 'municipal',
    label: 'Sveitarfélags réttindi',
    items: [
      {
        icon: ICONS.users,
        name: 'Liðveisla',
        summary: 'Stuðningsþjónusta þar sem liðveitandi fylgir einstaklingi með fötlun í daglegu lífi, tómstundum eða þjónustu.',
        includes: [
          'Fylgd í tómstundir og félagsstarf',
          'Stuðningur við daglegar athafnir',
          'Aðstoð utan heimilis',
          'Sniðin að þörfum einstaklingsins',
        ],
        where: 'Sótt er um liðveislu hjá félagsþjónustu sveitarfélagsins. Þjónustan er metin út frá þörfum.',
      },
      {
        icon: ICONS.car,
        name: 'Akstursþjónusta fatlaðs fólks',
        summary: 'Akstursþjónusta fyrir fólk sem getur ekki nýtt almenningssamgöngur vegna fötlunar.',
        includes: [
          'Ferðir til og frá vinnu eða skóla',
          'Ferðir í tómstundir og félagsstarf',
          'Læknistímar og heilbrigðisþjónustu',
          'Niðurgreitt af sveitarfélagi',
        ],
        where: 'Sótt er um hjá Strætó eða þjónustudeild fatlaðra hjá sveitarfélaginu. Mat fer fram á rétti til þjónustu.',
      },
      {
        icon: ICONS.home,
        name: 'Stuðningsfjölskyldur',
        summary: 'Fjölskyldur sem taka að sér umönnun barns með sérþarfir í afmarkaðan tíma til að styðja við foreldra.',
        includes: [
          'Reglulegar heimsóknir barns til stuðningsfjölskyldu',
          'Stundum yfir helgi eða lengri tíma',
          'Skilgreindur tímafjöldi á mánuði',
          'Sveitarfélag greiðir kostnað',
        ],
        where: 'Sótt er um hjá félagsþjónustu eða barnaverndarþjónustu sveitarfélagsins.',
      },
      {
        icon: ICONS.bed,
        name: 'Skammtímavistun',
        summary: 'Tímabundin vistun barns með fötlun á sérstöku heimili til að styðja við fjölskylduna.',
        includes: [
          'Vistun í nokkra daga í senn',
          'Skilgreindur fjöldi sólarhringa á ári',
          'Faglegt og þjálfað starfsfólk',
          'Hugsuð sem stuðningur fyrir foreldra',
        ],
        where: 'Sótt er um hjá félagsþjónustu sveitarfélagsins með faglegu mati á þörf.',
      },
      {
        icon: ICONS.sun,
        name: 'Sumarúrræði og frístund',
        summary: 'Skipulögð sumar- og frístundaúrræði fyrir börn með sérþarfir.',
        includes: [
          'Sumarbúðir og dagúrræði',
          'Sérdeild í frístundaheimilum',
          'Skipulagðar afþreyingar',
          'Þjálfað starfsfólk',
        ],
        where: 'Skráning fer fram hjá frístundamiðstöð sveitarfélagsins eða þjónustumiðstöð fatlaðs fólks.',
      },
    ],
  },
  {
    id: 'state',
    label: 'Ríkisréttindi',
    items: [
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
    ],
  },
];

// ── Elements ──
const listEl   = document.getElementById('rightsList');
const detailEl = document.getElementById('rightsDetail');

// Start with first municipal right selected, municipal group expanded
let selected = { group: 0, item: 0 };
const expanded = { municipal: true, state: false };

function renderList() {
  listEl.innerHTML = '';

  rightsCategories.forEach((cat, gIdx) => {
    const group = document.createElement('div');
    group.className = 'rights-group';

    // Group header (clickable)
    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'rights-group-header' + (expanded[cat.id] ? ' rights-group-header-expanded' : '');
    header.innerHTML = `
      <span>${cat.label}</span>
      <span class="rights-group-chevron">▾</span>
    `;
    header.addEventListener('click', () => {
      expanded[cat.id] = !expanded[cat.id];
      renderList();
    });
    group.appendChild(header);

    // Items wrapper
    const itemsWrap = document.createElement('div');
    itemsWrap.className = 'rights-group-items';
    if (!expanded[cat.id]) itemsWrap.style.display = 'none';

    cat.items.forEach((r, iIdx) => {
      const isActive = selected.group === gIdx && selected.item === iIdx;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'rights-item' + (isActive ? ' rights-item-active' : '');
      item.innerHTML = `
        <span class="rights-item-icon">${r.icon}</span>
        <span class="rights-item-name">${r.name}</span>
      `;
      item.addEventListener('click', () => {
        selected = { group: gIdx, item: iIdx };
        renderList();
        renderDetail();
      });
      itemsWrap.appendChild(item);
    });

    group.appendChild(itemsWrap);
    listEl.appendChild(group);
  });
}

function renderDetail() {
  const r = rightsCategories[selected.group]?.items[selected.item];
  if (!r) {
    detailEl.innerHTML = '<p class="rights-empty">Veldu réttindi úr listanum.</p>';
    return;
  }
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
