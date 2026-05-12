const réttindi = [
  {
    icon: '🏥',
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
    icon: '🩺',
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
    icon: '🚑',
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
    icon: '🧠',
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
    icon: '🦾',
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
