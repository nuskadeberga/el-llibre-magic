const pages = Array.from({length: 10}, (_, i) => `assets/pages/page-${String(i + 1).padStart(2, '0')}.webp`);
const narration = [
  'La gran aventura de la Nyicris, de l’Anna de Berga.',
  'A Barcelona, en un pis molt acollidor ple de llum, hi viu la Nyicris. És una gata preciosa i molt especial perquè té taques de tres colors: blanca, negra i marró. Li encanta dormir sobre la catifa i observar el món des de la finestra.',
  'Una nit càlida, la Nyicris veu una papallona nocturna volant prop de la terrassa. Amb un salt àgil i silenciós, puf!, salta des de la barana cap a un arbre gran que hi ha a prop de la carretera. Les seves potetes s’agafen ben fort a l’escorça.',
  'De cop, el timbre de casa sona amb insistència. En Benet, un veí que caminava pel carrer, ha vist el salt de la gata. «La vostra gata s’ha enfilat dalt de tot de l’arbre!», diu preocupat. En Carles, que és un home alt, prim i amb el cabell blanc, s’espanta molt.',
  'En Carles i l’Anna baixen corrents al carrer. L’Anna té els cabells curts i foscs, i mira cap amunt amb els ulls molt oberts mentre es tapa la boca amb les mans. L’arbre és molt alt i la carretera està plena de cotxes que fan molt de soroll.',
  'L’Aran també arriba per ajudar. Té els cabells castanys i llargs que li cauen per l’esquena. «Nyicris, vine aquí, bonica!», crida l’Aran amb veu dolça, però la Nyicris té por dels cotxes i es queda immòbil a la branca més alta, sense voler baixar.',
  'La Nyicris mira cap a la carretera. Els llums dels cotxes semblen ulls brillants que es mouen molt ràpid. Està massa amunt i no troba el camí per tornar a terra. Comença a miolar molt fluixet, demanant ajuda.',
  'L’Aran s’adona que no poden arribar tan amunt soles. Agafa el seu telèfon mòbil i truca als bombers. «Hola! Necessitem ajuda, la nostra gata Nyicris s’ha quedat atrapada en un arbre molt alt al costat de la carretera», diu amb veu ferma.',
  'Al cap de poc, se sent una sirena que sona fort: i-ooo, i-ooo! Un gran camió vermell amb llums blaus s’atura davant de l’arbre. En Roc, un bomber amb un casc brillant, baixa del camió i comença a aturar el trànsit perquè tot sigui segur.',
  'Quan en Roc baixa a terra amb la gata, els veïns des dels balcons comencen a aplaudir amb alegria. L’Anna i l’Aran somriuen de felicitat i abracen els bombers per donar-los les gràcies. La Nyicris ja torna a ser a casa, on l’espera un bol de llet i moltes carícies.'
];
const songs = [
  ['Dorm, Ponç Hug', 'Una cançó de bressol', 'assets/audio/01-dorm-ponc-hug.mp3'],
  ['Sota els estels', 'Per mirar el cel plegats', 'assets/audio/02-sota-els-estels.mp3'],
  ['Sota els braços de la casa', 'La casa que ens abraça', 'assets/audio/03-sota-els-bracos-de-la-casa.mp3'],
  ['Tres llars', 'Tres llocs, un mateix amor', 'assets/audio/04-tres-llars.mp3']
];

const songList = document.querySelector('#songList');
songs.forEach(([title, subtitle, src], i) => {
  const row = document.createElement('article');
  row.className = 'song';
  row.innerHTML = `<span class="song-number">${i + 1}</span><div><h3>${title}</h3><small>${subtitle}</small></div><audio controls preload="metadata" src="${src}">El navegador no pot reproduir aquesta cançó.</audio>`;
  songList.append(row);
});

const audios = [...document.querySelectorAll('audio')];
audios.forEach(audio => audio.addEventListener('play', () => audios.forEach(other => { if (other !== audio) other.pause(); })));

const reader = document.querySelector('#reader');
const storyPage = document.querySelector('#storyPage');
const counter = document.querySelector('#pageCounter');
const prev = document.querySelector('#prevPage');
const next = document.querySelector('#nextPage');
const dots = document.querySelector('#pageDots');
let page = 0;

pages.forEach((_, i) => { const dot = document.createElement('i'); dot.dataset.page = i; dots.append(dot); });
function renderPage() {
  storyPage.src = pages[page];
  storyPage.alt = page === 0 ? 'Portada de La gran aventura de la Nyicris' : `Pàgina ${page} de La gran aventura de la Nyicris`;
  counter.textContent = page === 0 ? 'Portada' : `Pàgina ${page} de ${pages.length - 1}`;
  prev.disabled = page === 0;
  next.disabled = page === pages.length - 1;
  [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === page));
  speechSynthesis.cancel();
}
function openReader(){ page = 0; renderPage(); reader.showModal(); }
document.querySelector('#openStory').addEventListener('click', openReader);
document.querySelector('#openStoryTop').addEventListener('click', openReader);
document.querySelector('#closeStory').addEventListener('click', () => { speechSynthesis.cancel(); reader.close(); });
prev.addEventListener('click', () => { if(page > 0){ page--; renderPage(); }});
next.addEventListener('click', () => { if(page < pages.length - 1){ page++; renderPage(); }});
document.querySelector('#speakPage').addEventListener('click', () => {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(narration[page]);
  utterance.lang = 'ca-ES'; utterance.rate = .88; utterance.pitch = 1.04;
  const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ca'));
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
});
document.addEventListener('keydown', event => {
  if(!reader.open) return;
  if(event.key === 'ArrowRight') next.click();
  if(event.key === 'ArrowLeft') prev.click();
});
let startX = 0;
storyPage.addEventListener('touchstart', e => startX = e.changedTouches[0].clientX, {passive:true});
storyPage.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX; if(Math.abs(dx) > 50) (dx < 0 ? next : prev).click(); }, {passive:true});
