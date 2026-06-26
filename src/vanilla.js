const PROFILE_KEY = 'scrapbook_profile_pic';
const DARK_KEY = 'portfolio_dark_mode';
const defaultProfile = './src/assets/images/lol.png';

let currentView = 'home';
let selectedEntryId = 'you';
let profilePic = localStorage.getItem(PROFILE_KEY) || defaultProfile;

const entries = [
  {
    id: '4',
    title: 'Moments, flavors & Memories',
    subtitle: 'Nº4 | PASTELERÍA',
    date: '06/2026',
    folderName: 'Delicias del ayer',
    tabColor: '#6f1728',
    bgColor: '#6f1728',
    photo: '.src/assets/images/pasteleria.webp',
    secondPhoto: './src/assets/images/postre.webp',
    noteTitle: 'Pequeñas Bendiciones',
    text: 'Una pastelería que desbloquea tus recuerdos con tan solo un mordisco. Cada sabor es un viaje a la infancia, a los días soleados y a las risas compartidas.',
    postit: 'Atrevete a probar algo nuevo hoy: un sabor que nunca antes habías considerado. La vida es demasiado corta para no explorar.',
  },
  {
    id: '3',
    title: 'Your best friend in the world',
    subtitle: 'Nº3 | ADOPCIONES',
    date: '05/2026',
    folderName: 'Happy Paws',
    tabColor: '#ead46b',
    bgColor: '#ead46b',
    photo: './src/assets/images/mascotas.jpg',
    secondPhoto: './src/assets/images/mascotas2.jpg',
    noteTitle: 'Un amigo peludo para cada corazón',
    text: '¡Cada patita merece ser feliz, ven y encuentra a tu compañero aquí!',
    postit: 'Nunca es suficiente:tu amigo peludo te amará cada vez más.',
  },
  {
    id: '2',
    title: 'Security in every corner',
    subtitle: 'Nº2 | TRANSPORTE',
    date: '05/2025',
    folderName: 'KidRoute',
    tabColor: '#a64c32',
    bgColor: '#a64c32',
    photo: './src/assets/images/transporte.jpg',
    secondPhoto: './src/assets/images/niños.jpg',
    noteTitle: 'Siempre seguro y protegido',
    text: 'No busques más, la solución para tu seguridad está justo aquí.',
    postit: 'Tu niño necesita seguridad, aquí siempre la tendrá.',
  },
  {
    id: '1',
    title: 'Save your money from yourself',
    subtitle: 'Nº1 | COACHING',
    date: '06/2026',
    folderName: 'PANDA',
    tabColor: '#431826',
    bgColor: '#431826',
    photo: './src/assets/images/panda.jpg',
    secondPhoto: './src/assets/images/dinero.jpg',
    noteTitle: 'Tu coach financiero a la mano',
    text: 'Tus problemas financieros han llegado a su fin con tu nuevo coach virtual, PANDA. Aprende a ahorrar, invertir y gastar de manera inteligente con la ayuda de PANDA.',
    postit: 'Fin a tus problemas financieros: PANDA te guiará hacia un futuro más próspero y seguro.',
  },
];

const app = document.getElementById('app');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function entryById(id) {
  return entries.find((entry) => entry.id === id) || entries[0];
}

function updateProfileInEntries() {
  entries[0].photo = profilePic;
}

function renderShell(content) {
  app.innerHTML = `
    <main class="app">
      <div class="top-actions">
        <button class="icon-button" data-action="toggle-dark" title="Cambiar modo">◐</button>
      </div>
      <div class="settings-launcher">
        <button class="settings-button" data-action="open-settings">Ajustes</button>
      </div>
      ${content}
      ${renderSettings()}
    </main>
  `;
  bindActions();
}

function renderHome() {
  renderShell(`
    <section class="page">
      <div class="meta-bar">
        <span>@sunisonfire</span>
        <span>Danna Sofia Téllez Jaimes</span>
        <span>2026.06.26</span>
      </div>

      <div class="hero-mark" aria-hidden="true">
        <svg class="butterfly" viewBox="0 0 100 100">
          <path d="M 50 50 Q 20 20 15 40 Q 15 65 50 55 Z"></path>
          <path d="M 50 50 Q 80 20 85 40 Q 85 65 50 55 Z"></path>
          <ellipse cx="50" cy="50" rx="2" ry="12" fill="currentColor"></ellipse>
        </svg>
      </div>

      <div class="window-collage">
        <img class="landscape" src="https://i.pinimg.com/736x/35/0b/45/350b45e1ab84dffce45e6dcd621d33d3.jpg" alt="Paisaje de fondo">
        <button class="portrait-card" data-action="about" title="Abrir perfil">
          <span class="clip"></span>
          <span class="portrait-frame">
            <img src="${escapeHtml(profilePic)}" alt="Retrato">
          </span>
          <span class="portrait-label">About Me!</span>
        </button>
      </div>

      <div class="intro-grid">
        <article class="intro-panel">
          <span class="eyebrow">Just tell yourself</span>
          <p>"Go big or go home!"</p>
        </article>
        <article class="intro-panel center">
          <span class="eyebrow">this is fate</span>
          <h1>Porta<br><em>folio</em></h1>
          <span class="hand">Ride or Die</span>
        </article>
        <article class="intro-panel">
          <span class="eyebrow">I'm feeling lucky</span>
          <p>"With or without you"</p>
        </article>
      </div>

      <div class="folder-hero">
        <div class="mini-polaroid left">
          <img src="/src/assets/images/yem.jpeg" alt="Ventana con lluvia">
        </div>
        <div class="mini-polaroid right">
          <img src="/src/assets/images/yop.jpeg" alt="Pradera">
        </div>
        <button class="folder-button" data-action="archive">
          <span class="folder-subtitle">It starts with a folder and a dream.</span>
          <h2>My<br><em>Projects</em></h2>
          <span class="folder-subtitle">Take a look</span>
          <div class="folder-footer">
            <span>2026</span>
            <span>GitHub</span>
          </div>
        </button>
      </div>
    </section>
  `);
}

function renderArchive() {
  renderShell(`
    <section class="page">
      <div class="nav-row">
        <button class="small-button" data-action="home">← Exit</button>
        <span class="nav-title">Treasure</span>
      </div>

      <header class="archive-title">
        <h1>My Projects</h1>
        <p>Cada documento resguarda un pedacito de mi conocimiento.</p>
      </header>

      <div class="folder-stack">
        ${entries.map((entry, index) => `
          <button class="stack-folder" data-entry="${entry.id}" style="z-index:${10 + index}; transform: translateY(-${(entries.length - 1 - index) * 34}px);">
            <div class="folder-tab" style="margin-left:${18 + index * 72}px; background:${entry.tabColor}; color:${entry.tabColor === '#ead46b' ? '#431826' : '#fffdf8'}">${entry.folderName}</div>
            <div class="folder-body" style="background:${entry.bgColor}">
              <div>
                <span class="eyebrow">${entry.subtitle}</span>
                <h2>${entry.title}</h2>
                <p>"${entry.text}"</p>
              </div>
              <div class="preview-photo">
                <img src="${escapeHtml(entry.photo)}" alt="${escapeHtml(entry.title)}">
              </div>
            </div>
          </button>
        `).join('')}
      </div>

      <div class="entry-grid">
        ${entries.map((entry) => `
          <button class="entry-card" data-entry="${entry.id}">
            <div class="card-meta">Folder ${entry.folderName} · ${entry.date}</div>
            <h2>${entry.title}</h2>
            <div class="card-meta">${entry.subtitle}</div>
            <div class="card-body">
              <div class="preview-photo">
                <img src="${escapeHtml(entry.photo)}" alt="${escapeHtml(entry.title)}">
              </div>
              <p>${entry.text}</p>
            </div>
            <div class="card-footer">
              <span>Toca para descubrir</span>
              <span>Explorar →</span>
            </div>
          </button>
        `).join('')}
      </div>
    </section>
  `);
}

function renderDiary() {
  const entry = entryById(selectedEntryId);
  renderShell(`
    <section class="page">
      <div class="nav-row">
        <button class="small-button" data-action="archive">← Archivos</button>
        <span class="nav-title">${entry.folderName} // ${entry.date}</span>
        <button class="small-button" data-action="home">Inicio</button>
      </div>

      <article class="journal">
        <section class="journal-page left">
          <div class="journal-header">
            <div>
              <span class="eyebrow">${entry.subtitle}</span>
              <h1>${entry.title}</h1>
            </div>
            <span class="page-chip">Page 01</span>
          </div>

          <div class="polaroid" style="transform: rotate(-2deg)">
            <span class="tape" style="left:50%; top:-10px; transform:translateX(-50%) rotate(-4deg)"></span>
            <div class="photo">
              <img src="${escapeHtml(entry.photo)}" alt="${escapeHtml(entry.title)}">
            </div>
            <div class="polaroid-label">Capturing light</div>
          </div>

          <div class="diary-text">
            <strong>${entry.noteTitle}</strong><br>
            ${entry.text}
          </div>
        </section>

        <section class="journal-page right">
          <div class="journal-header">
            <span class="eyebrow">Scrapbook arrangement</span>
            <span class="page-chip">Page 02</span>
          </div>

          <div class="polaroid" style="width:min(230px, 84%); transform: rotate(4deg)">
            <span class="tape" style="right:-18px; top:-8px; transform:rotate(14deg)"></span>
            <div class="photo" style="aspect-ratio:1">
              <img src="${escapeHtml(entry.secondPhoto)}" alt="Recuerdo secundario">
            </div>
            <div class="polaroid-label">Recuerdo</div>
          </div>

          <div class="note">${entry.postit}</div>

          <div class="deco-row">
            <div class="stamp">✦</div>
            <div class="stamp" style="transform:rotate(-12deg)">✿</div>
            <div class="stamp" style="transform:rotate(8deg)">♥</div>
          </div>

          <div class="film-strip">
            <img src="https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&q=80&w=150" alt="Film 1">
            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150" alt="Film 2">
            <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=150" alt="Film 3">
          </div>
        </section>
      </article>
    </section>
  `);
}

function renderAbout() {
  renderShell(`
    <section class="page">
      <div class="nav-row">
        <button class="small-button" data-action="home">← Home</button>
        <span class="nav-title">I MAKE YOU, YOU MAKE ME</span>
      </div>

      <header class="about-head">
        <div class="script">Un pedacito de mí...</div>
        <h1>¿Quién Soy?</h1>
      </header>

      <div class="about-grid">
        <section>
          <span class="eyebrow">Entre mis conocimientos estan...</span>
          <div class="object-case">
            <h2 class="tin-title">Mis<br>conocimientos<br></h2>
                        <div class="selfie-small">
              <img src="/src/assets/images/yoagain.jpeg" alt="Selfie">
            </div>
            <div class="tin">
              <div class="tin-section">
<div class="packaging">
    
    <div class="header">


        <div class="tag">
            
        </div>
    </div>

<div class="blister">
    <div class="icon affinity">
        <img src="/src/assets/images/css.jpg" alt="css">
    </div>

    <div class="icon photoshop">
        <img src="/src/assets/images/html.jpg" alt="html">
    </div>

    <div class="icon illustrator">
        <img src="/src/assets/images/python.jpg" alt="python">
    </div>


    <div class="icon dots">
        <img src="/src/assets/images/js.jpg" alt="js">
    </div>

    <div class="icon pixellab">
        <img src="/src/assets/images/git hub.jpg" alt="github">
    </div>

    <div class="icon canva">
        <img src="/src/assets/images/python.jpg" alt="python">
    </div>
</div>

    <div class="sticker">
        
    </div>

</div>
          </div>
          <div class="kitkat">y más...
          </div>
          </div>
            <div class="packaging">
    


</div>
          </div>
        </section>

        <section>
          <span class="eyebrow">Sobre mi</span>
          <div class="letter-card">
                      <div class="letter-note">
              Dear Reader,<br>
              Soy una programadora en formación con ganas de romperla en el mundo digital. Manejo Python, HTML, CSS, JavaScript y me organizo con Git/GitHub.
Me gusta darle vida a ideas con lógica, diseño web y un toque creativo que convierte lo básico en algo funcional y diferente.
Tengo nivel de inglés B2, lo que me ayuda a leer documentación técnica sin drama y colaborar en proyectos grupales.
Lo que más me define: creatividad, disciplina y la obsesión por aprender siempre algo nuevo.
            </div>
            
            
            </div>


          
        </section>
      </div>
    </section>
  <style>
  .icon{
    width:70px;
    height:70px;
    background:white;
    border-radius:12px;

    display:flex;
    justify-content:center;
    align-items:center;

    position:absolute;

    box-shadow:0 8px 20px rgba(0,0,0,.15);
}

.icon img{
    width:65%;
    height:65%;
    object-fit:contain;
    pointer-events:none;
}

.affinity{
    top:45px;
    left:40px;
    transform:rotate(-8deg);
}

.photoshop{
    top:35px;
    left:160px;
    transform:rotate(8deg);
}

.illustrator{
    top:45px;
    right:40px;
    transform:rotate(-5deg);
}

.figma{
    top:170px;
    left:35px;
    transform:rotate(-6deg);
}

.scribble{
    top:165px;
    left:165px;
    transform:rotate(5deg);
}

.midjourney{
    top:170px;
    right:35px;
    transform:rotate(-7deg);
}

.dots{
    bottom:45px;
    left:55px;
    transform:rotate(-10deg);
}

.pixellab{
    bottom:40px;
    left:170px;
    transform:rotate(2deg);
}

.canva{
    bottom:40px;
    right:45px;
    transform:rotate(10deg);
}
`);
}

function renderSettings() {
  return `
    <div class="drawer-backdrop" id="settingsDrawer">
      <aside class="drawer">
        <div class="drawer-head">
          <h2>Ajustes de mi Bitácora</h2>
          <button class="icon-button" data-action="close-settings" title="Cerrar">×</button>
        </div>

        <section class="settings-section">
          <label>Foto de perfil</label>
          <div class="avatar-preview">
            <img src="/src/assets/images/lol.png" alt="Vista previa">
          </div>

          <input id="fileInput" class="hidden" type="file" accept="image/*">
          <button class="small-button" data-action="upload-photo">Subir archivo</button>
          <button class="small-button" data-action="reset-photo">Restaurar</button>

          <div style="height:16px"></div>
          <label for="photoUrl">URL de imagen</label>
          <input id="photoUrl" type="url" placeholder="https://...">
          <button class="small-button" data-action="apply-url">Aplicar</button>
        </section>
      </aside>
    </div>
  `;
}

function bindActions() {
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', handleAction);
  });

  document.querySelectorAll('[data-entry]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedEntryId = button.dataset.entry;
      currentView = 'diary';
      renderDiary();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  if (action === 'toggle-dark') {
    document.body.classList.toggle('dark');
    localStorage.setItem(DARK_KEY, document.body.classList.contains('dark') ? 'true' : 'false');
    return;
  }
  if (action === 'open-settings') {
    document.getElementById('settingsDrawer')?.classList.add('open');
    return;
  }
  if (action === 'close-settings') {
    document.getElementById('settingsDrawer')?.classList.remove('open');
    return;
  }
  if (action === 'upload-photo') {
    document.getElementById('fileInput')?.click();
    return;
  }
  if (action === 'reset-photo') {
    profilePic = defaultProfile;
    localStorage.removeItem(PROFILE_KEY);
    updateProfileInEntries();
    rerender();
    return;
  }
  if (action === 'apply-url') {
    const input = document.getElementById('photoUrl');
    if (input?.value.trim()) {
      profilePic = input.value.trim();
      localStorage.setItem(PROFILE_KEY, profilePic);
      updateProfileInEntries();
      rerender();
    }
    return;
  }
  if (action === 'home') {
    currentView = 'home';
    renderHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (action === 'archive') {
    currentView = 'archive';
    renderArchive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (action === 'about') {
    currentView = 'about';
    renderAbout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePic = reader.result;
    localStorage.setItem(PROFILE_KEY, profilePic);
    updateProfileInEntries();
    rerender();
  };
  reader.readAsDataURL(file);
}

function rerender() {
  if (currentView === 'archive') renderArchive();
  else if (currentView === 'diary') renderDiary();
  else if (currentView === 'about') renderAbout();
  else renderHome();
}

function boot() {
  updateProfileInEntries();
  const savedDark = localStorage.getItem(DARK_KEY);
  if (savedDark === 'true') document.body.classList.add('dark');
  renderHome();
}

boot();
