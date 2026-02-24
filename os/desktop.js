// ============================================================
// CLOCK
// ============================================================
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const clockEl = document.getElementById('clock-display');
  if (clockEl) clockEl.textContent = `${h}:${m}`;
  const bc = document.getElementById('big-clock');
  const bd = document.getElementById('big-date');
  if (bc) bc.textContent = `${h}:${m}:${s}`;
  if (bd) bd.textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

function toggleClock() {
  document.getElementById('clock-popup').classList.toggle('visible');
}

// ============================================================
// START MENU
// ============================================================
function toggleStart() {
  SoundManager.play('click');
  document.getElementById('start-menu').classList.toggle('visible');
  document.getElementById('clock-popup').classList.remove('visible');
}

function closeStart() {
  document.getElementById('start-menu').classList.remove('visible');
}

// ============================================================
// CONTEXT MENU
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('desktop').addEventListener('contextmenu', e => {
    if (e.target.id === 'desktop' || e.target.id === 'desktop-bg' || e.target.id === 'desktop-icons') {
      e.preventDefault();
      const m = document.getElementById('ctx-menu');
      m.style.left = e.clientX + 'px';
      m.style.top = e.clientY + 'px';
      m.classList.add('visible');
    }
  });
});

document.addEventListener('click', e => {
  hideCtx();
  if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) closeStart();
  if (!e.target.closest('#clock-popup') && !e.target.closest('#clock-display'))
    document.getElementById('clock-popup').classList.remove('visible');
  SoundManager.unlock();
});

function hideCtx() {
  document.getElementById('ctx-menu').classList.remove('visible');
}

function arrangeIcons() {
  const icons = document.querySelectorAll('.desk-icon');
  icons.forEach((icon, i) => {
    icon.style.left = '10px';
    icon.style.top = (10 + i * 88) + 'px';
  });
  State.saveIconPositions();
}

// ============================================================
// DESKTOP ICONS — draggable + position persistence
// ============================================================
function initDesktopIcons() {
  const savedPositions = State.loadIconPositions();
  const icons = document.querySelectorAll('.desk-icon');

  icons.forEach((icon, i) => {
    const appId = icon.dataset.appid;

    // Apply saved or default position
    if (appId && savedPositions[appId]) {
      icon.style.left = savedPositions[appId].left + 'px';
      icon.style.top = savedPositions[appId].top + 'px';
    } else {
      icon.style.left = '10px';
      icon.style.top = (10 + i * 88) + 'px';
    }

    // Make icon draggable
    let dragging = false, ox = 0, oy = 0;
    icon.addEventListener('mousedown', e => {
      if (e.detail === 2) return; // don't drag on dblclick
      dragging = true;
      ox = e.clientX - parseInt(icon.style.left);
      oy = e.clientY - parseInt(icon.style.top);
      icon.classList.add('selected');
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      icon.style.left = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - ox)) + 'px';
      icon.style.top = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - oy)) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; State.saveIconPositions(); }
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.desk-icon')) {
      document.querySelectorAll('.desk-icon').forEach(i => i.classList.remove('selected'));
    }
  });
}

// ============================================================
// APP LAUNCHER
// ============================================================
let winCount = 0;
function openApp(app) {
  winCount++;
  SoundManager.unlock();
  State.addRecentApp(app);
  const offset = (winCount * 20) % 200;
  switch (app) {
    case 'notepad':     Apps.notepad(offset);     break;
    case 'wordpad':     Apps.wordpad(offset);      break;
    case 'calc':        Apps.calculator(offset);   break;
    case 'minesweeper': Apps.minesweeper(offset);  break;
    case 'paint':       Apps.paint(offset);        break;
    case 'mycomputer':  Apps.explorer(offset);     break;
    case 'ie':          Apps.ie(offset);           break;
    case 'taskmgr':     Apps.taskmanager(offset);  break;
    case 'about':       Apps.about(offset);        break;
    case 'solitaire':   Apps.solitaire(offset);    break;
  }
}

// ============================================================
// MENU TOGGLE
// ============================================================
function toggleMenu(el) {
  const allMenus = document.querySelectorAll('.menu-item');
  allMenus.forEach(m => { if (m !== el) m.classList.remove('open'); });
  el.classList.toggle('open');
  document.addEventListener('click', function cls(e) {
    if (!e.target.closest('.menu-item')) {
      allMenus.forEach(m => m.classList.remove('open'));
      document.removeEventListener('click', cls);
    }
  });
}

// ============================================================
// MISC
// ============================================================
function showMsg(title, msg) { alert(`${title}\n\n${msg}`); }

function openCtrlPanel() {
  WM.create('ctrlpanel', 'Panneau de configuration', '🎛️', 520, 400, 150, 100, `
    <div style="padding:16px;font-family:Tahoma;font-size:11px;">
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        ${[['🖥️','Affichage'],['🔊','Son'],['🌐','Réseau'],['⌨️','Clavier'],['🖱️','Souris'],
           ['🕐','Date/Heure'],['🔒','Sécurité'],['💿','Ajout/Suppression'],
           ['🖨️','Imprimantes'],['♿','Accessibilité'],['⚡','Alimentation'],['👤','Comptes']
          ].map(([ico, name]) => `
          <div onclick="" style="display:flex;flex-direction:column;align-items:center;width:80px;padding:8px;cursor:pointer;border:1px solid transparent;border-radius:2px;text-align:center;font-size:10px;"
               onmouseover="this.style.background='#dce8f5'" onmouseout="this.style.background=''">
            <span style="font-size:28px;">${ico}</span>
            <span style="margin-top:4px;">${name}</span>
          </div>`).join('')}
      </div>
      <hr style="margin:16px 0;border:1px solid #bbb;">
      <div style="background:#f0f0f0;border:1px inset #888;padding:8px;">
        <b>Préférences utilisateur</b><br><br>
        <label>Nom d'utilisateur : </label>
        <input type="text" id="username_input" value="${State.getUsername()}" style="width:150px;">
        <button onclick="State.setUsername(document.getElementById('username_input').value)" style="margin-left:8px;padding:2px 8px;border:1px solid #888;cursor:pointer;background:#e8e4d8;">Appliquer</button>
        <br><br>
        <label>Volume : </label>
        <input type="range" min="0" max="100" value="${Math.round(State.getVolume()*100)}" oninput="SoundManager.setVolume(this.value/100)" style="width:100px;vertical-align:middle;">
        <br><br>
        <button onclick="if(confirm('Effacer toutes les données ? (positions icônes, préférences)')) { State.clearAll(); location.reload(); }" 
                style="padding:4px 12px;border:1px solid #888;cursor:pointer;background:#e8e4d8;">Réinitialiser les préférences</button>
      </div>
    </div>
  `);
}

function shutDown() {
  if (confirm('Voulez-vous vraiment arrêter l\'ordinateur ?')) {
    SoundManager.play('startup'); // play shutdown reversed approximation
    document.body.innerHTML = `
      <div style="background:black;width:100vw;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:Tahoma;">
        <div style="font-size:18px;margin-bottom:20px;">Windows s'arrête...</div>
        <div style="width:300px;height:18px;background:#333;border:2px inset #555;overflow:hidden;">
          <div style="height:100%;background:linear-gradient(90deg,#4a9a2e,#6ab84e);animation:shut 2s linear forwards;"></div>
        </div>
        <style>@keyframes shut{from{width:0}to{width:100%}}</style>
      </div>`;
    setTimeout(() => location.reload(), 3000);
  }
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Escape') toggleStart();
  if (e.ctrlKey && e.shiftKey && e.key === 'Escape') openApp('taskmgr');
  if (e.ctrlKey && e.key === 'F4') {
    if (WM.focused) WM.close(WM.focused);
  }
});
