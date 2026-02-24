// ============================================================
// INTERNET EXPLORER
// ============================================================
const IE_PAGES = {
  'http://www.msn.com/': { title: 'MSN.com', html: `
    <div style="background:#003399;color:white;padding:8px 12px;font-size:16px;font-weight:bold;font-family:Arial;">
      <span style="color:#ff9900">msn</span>.com
    </div>
    <div style="padding:12px;font-family:Tahoma;font-size:11px;">
      <h3 style="color:#003399;margin-bottom:8px;">Bienvenue sur MSN</h3>
      <p>Nouvelles du jour :</p>
      <ul style="margin:8px 0 8px 20px;line-height:2;">
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;" onclick="ieNavGlobal('http://news.msn.com')">🔴 Actualités mondiales</a></li>
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;" onclick="ieNavGlobal('http://sport.msn.com')">⚽ Sport</a></li>
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;" onclick="ieNavGlobal('http://meteo.msn.com')">🌤️ Météo</a></li>
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;" onclick="ieNavGlobal('http://finance.msn.com')">📈 Finance</a></li>
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;" onclick="ieNavGlobal('http://www.google.com/')">🔍 Google</a></li>
      </ul>
      <hr>
      <p style="color:#666;font-size:10px;">© 2001 Microsoft Corporation</p>
    </div>
  `},
  'http://www.google.com/': { title: 'Google', html: `
    <div style="text-align:center;padding:40px 20px;font-family:Arial;">
      <div style="font-size:52px;font-weight:bold;margin-bottom:20px;">
        <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span>
        <span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span>
        <span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
      </div>
      <input type="text" id="google_search" style="width:400px;height:28px;font-size:13px;padding:4px 8px;border:1px solid #ccc;border-radius:14px;outline:none;" placeholder="Recherche Google">
      <br><br>
      <button onclick="googleSearch()" style="padding:6px 16px;background:#f8f8f8;border:1px solid #ccc;cursor:pointer;font-size:11px;border-radius:2px;margin:2px;font-family:Tahoma;">Recherche Google</button>
      <button style="padding:6px 16px;background:#f8f8f8;border:1px solid #ccc;cursor:pointer;font-size:11px;border-radius:2px;margin:2px;font-family:Tahoma;">J'ai de la chance</button>
      <p style="margin-top:16px;font-size:10px;color:#666;">Google Recherche disponible en : <a style="color:#00f;cursor:pointer;">Français</a></p>
    </div>
  `},
  'http://www.microsoft.com/': { title: 'Microsoft', html: `
    <div style="background:#00adef;padding:12px;color:white;font-family:Tahoma;">
      <span style="font-size:20px;font-weight:bold;">Microsoft</span>
    </div>
    <div style="padding:12px;font-family:Tahoma;font-size:11px;">
      <h3>Windows XP — Explorez les possibilités</h3>
      <p style="margin:8px 0;">Windows XP offre la meilleure expérience informatique avec fiabilité et sécurité améliorées.</p>
      <ul style="margin:8px 0 8px 20px;line-height:2;">
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;" onclick="ieNavGlobal('http://windowsupdate.microsoft.com')">🔄 Windows Update</a></li>
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;">📧 Outlook Express</a></li>
        <li><a style="color:#00f;text-decoration:underline;cursor:pointer;">🎮 Zone.com — Jeux</a></li>
      </ul>
    </div>
  `},
  'default': { title: 'Page introuvable', html: `
    <div style="padding:20px;font-family:Tahoma;font-size:12px;">
      <h2 style="color:#cc0000;">⚠ Cette page n'est pas disponible</h2>
      <p style="margin:12px 0;">Internet Explorer ne peut pas afficher la page Web.</p>
      <p>La page que vous recherchez est actuellement indisponible. Le site Web est peut-être en cours de maintenance ou votre connexion est interrompue.</p>
      <hr style="margin:12px 0;">
      <p><b>Suggestions :</b></p>
      <ul style="margin:8px 0 8px 20px;line-height:2;">
        <li>Cliquez sur le bouton <b>Actualiser</b></li>
        <li>Vérifiez votre connexion réseau</li>
        <li>Essayez de vous connecter ultérieurement</li>
      </ul>
      <br><a style="color:#00f;text-decoration:underline;cursor:pointer;" onclick="ieNavGlobal('http://www.google.com/')">→ Aller sur Google</a>
    </div>
  `}
};

// Global nav (for links inside IE pages)
window.ieNavGlobal = function(url) {
  const ieWin = Object.keys(WM.windows).find(id => id.startsWith('ie_'));
  if (ieWin) ieNav_(url, ieWin.replace('ie_', '').replace('win_ie_', ''));
  else { openApp('ie'); setTimeout(() => ieNavGlobal(url), 100); }
};

window.googleSearch = function() {
  const q = document.getElementById('google_search');
  if (q && q.value) alert(`Recherche pour : "${q.value}"\n\n(Fonctionnalité non disponible en mode hors ligne)`);
};

Apps.ie = function(off) {
  const id = 'ie_' + Date.now();
  WM.create(id, 'Internet Explorer', '🌐', 720, 500, 40 + off, 30 + off, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Fichier
          <div class="dropdown">
            <div class="dd-item" onclick="WM.close('${id}')">Fermer</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Favoris
          <div class="dropdown">
            <div class="dd-item" onclick="ieNav_('http://www.google.com/','${id}')">🔍 Google</div>
            <div class="dd-item" onclick="ieNav_('http://www.microsoft.com/','${id}')">🪟 Microsoft</div>
            <div class="dd-item" onclick="ieNav_('http://www.msn.com/','${id}')">📰 MSN</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Outils
          <div class="dropdown">
            <div class="dd-item" onclick="openApp('about')">Options Internet...</div>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <button class="tb-btn" id="ie_back_${id}" onclick="ieBack('${id}')" disabled>◀ Précédent</button>
        <button class="tb-btn" id="ie_fwd_${id}" onclick="ieFwd('${id}')" disabled>▶ Suivant</button>
        <button class="tb-btn" onclick="ieRefresh('${id}')">🔄 Actualiser</button>
        <button class="tb-btn" onclick="ieNav_('http://www.msn.com/','${id}')">🏠 Accueil</button>
        <div class="tb-sep"></div>
        <span style="font-size:11px;padding:0 4px;">Adresse :</span>
        <input type="text" id="ie_addr_${id}" style="flex:1;height:20px;" value="http://www.msn.com/"
               onkeydown="if(event.key==='Enter') ieNav_(this.value,'${id}')">
        <button class="tb-btn" onclick="ieNav_(document.getElementById('ie_addr_${id}').value,'${id}')">Atteindre</button>
      </div>
      <div id="ie_content_${id}" style="flex:1;background:white;overflow:auto;padding:0;font-family:'Times New Roman',serif;font-size:12px;user-select:text;cursor:default;"></div>
      <div class="statusbar"><div id="ie_status_${id}" class="status-panel">Prêt</div></div>
    </div>
  `, { onOpen: () => setTimeout(() => {
    window['_ie_' + id] = { history: [], idx: -1 };
    ieNav_('http://www.msn.com/', id);
  }, 50) });
};

function ieNav_(url, id) {
  const state = window['_ie_' + id] || { history: [], idx: -1 };
  const content = document.getElementById('ie_content_' + id);
  const addr = document.getElementById('ie_addr_' + id);
  const status = document.getElementById('ie_status_' + id);
  if (!content) return;
  if (addr) addr.value = url;
  if (status) status.textContent = 'Chargement de ' + url;
  const page = IE_PAGES[url] || IE_PAGES['default'];
  content.innerHTML = page.html;
  state.history = state.history.slice(0, state.idx + 1);
  state.history.push(url);
  state.idx = state.history.length - 1;
  window['_ie_' + id] = state;
  const backBtn = document.getElementById('ie_back_' + id);
  const fwdBtn = document.getElementById('ie_fwd_' + id);
  if (backBtn) backBtn.disabled = state.idx <= 0;
  if (fwdBtn) fwdBtn.disabled = state.idx >= state.history.length - 1;
  // Update window title
  const winEl = document.getElementById('win_' + id);
  if (winEl) { const tb = winEl.querySelector('.titlebar-title'); if (tb) tb.textContent = page.title + ' - Internet Explorer'; }
  setTimeout(() => { if (status) status.textContent = 'Terminé'; }, 300);
}

function ieBack(id) {
  const state = window['_ie_' + id];
  if (!state || state.idx <= 0) return;
  state.idx--;
  ieNav_(state.history[state.idx], id);
}

function ieFwd(id) {
  const state = window['_ie_' + id];
  if (!state || state.idx >= state.history.length - 1) return;
  state.idx++;
  ieNav_(state.history[state.idx], id);
}

function ieRefresh(id) {
  const addr = document.getElementById('ie_addr_' + id);
  if (addr) ieNav_(addr.value, id);
}
