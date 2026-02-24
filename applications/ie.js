// ============================================================
// INTERNET EXPLORER — iframe réel + pages simulées en fallback
// ============================================================

// Pages simulées pour les sites qui bloquent les iframes
const IE_SIMULATED = {

  'google.com': { title: 'Google', html: `
    <div style="text-align:center;padding:60px 20px 20px;font-family:Arial;">
      <div style="font-size:56px;font-weight:bold;margin-bottom:24px;letter-spacing:-2px;">
        <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span>
        <span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span>
        <span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
      </div>
      <div style="margin-bottom:16px;">
        <input type="text" id="google_q" style="width:420px;height:32px;padding:4px 12px;border:1px solid #ccc;border-radius:20px;font-size:13px;outline:none;box-shadow:0 1px 3px rgba(0,0,0,0.1);" placeholder="Recherche Google" onkeydown="if(event.key==='Enter') ieSiteSearch(this.value,'google',null)">
      </div>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button onclick="ieSiteSearch(document.getElementById('google_q').value,'google',null)" style="padding:7px 18px;background:#f8f9fa;border:1px solid #dfe1e5;border-radius:4px;cursor:pointer;font-size:13px;font-family:Arial;">Recherche Google</button>
        <button style="padding:7px 18px;background:#f8f9fa;border:1px solid #dfe1e5;border-radius:4px;cursor:pointer;font-size:13px;font-family:Arial;">J'ai de la chance</button>
      </div>
    </div>
  `},

  'msn.com': { title: 'MSN.com', html: `
    <div style="background:linear-gradient(135deg,#0050b3,#0078d4);color:white;padding:10px 16px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:22px;font-weight:bold;font-family:Arial;"><span style="color:#f90">msn</span></span>
      <span style="flex:1;"></span>
      <span style="font-size:11px;opacity:0.8;">Hotmail · Messenger · Search</span>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:0;font-family:Tahoma;font-size:11px;">
      <div style="padding:12px;border-right:1px solid #e0e0e0;">
        <div style="background:#f0f4ff;border:1px solid #c8d8f0;padding:8px;margin-bottom:12px;border-radius:2px;">
          <b style="color:#003399;">🔴 À la une</b><br>
          <div style="margin-top:6px;line-height:2;">
            <div><a style="color:#00c;cursor:pointer;text-decoration:underline;" onclick="ieNavGlobal('http://www.lemonde.fr')">Le Monde — Actualités françaises et internationales</a></div>
            <div><a style="color:#00c;cursor:pointer;text-decoration:underline;" onclick="ieNavGlobal('http://www.google.com/')">🔍 Rechercher sur Google</a></div>
            <div><a style="color:#00c;cursor:pointer;text-decoration:underline;" onclick="ieNavGlobal('http://www.wikipedia.org/')">📖 Wikipédia — L'encyclopédie libre</a></div>
          </div>
        </div>
        <div style="margin-bottom:10px;"><b>🌍 Actualités</b>
          <ul style="margin:4px 0 0 16px;line-height:1.8;color:#333;">
            <li><a style="color:#00c;cursor:pointer;">Politique internationale : sommet européen</a></li>
            <li><a style="color:#00c;cursor:pointer;">Économie : nouveau record pour l'euro</a></li>
            <li><a style="color:#00c;cursor:pointer;">Science : découverte sur Mars</a></li>
          </ul>
        </div>
      </div>
      <div style="padding:12px;background:#f9f9f9;">
        <div style="margin-bottom:10px;"><b>🔍 Recherche</b><br>
          <input type="text" id="msn_q" style="margin-top:4px;width:100%;height:20px;border:1px solid #888;font-size:11px;padding:0 4px;" placeholder="Rechercher...">
          <button onclick="ieSiteSearch(document.getElementById('msn_q').value,'google',null)" style="margin-top:4px;width:100%;font-size:10px;cursor:pointer;padding:2px;">Chercher</button>
        </div>
        <div style="margin-bottom:10px;"><b>📧 Hotmail</b><br><a style="color:#00c;font-size:10px;cursor:pointer;">Se connecter</a></div>
        <div><b>🌤️ Météo</b><br><div style="font-size:10px;color:#555;margin-top:2px;">Paris : ☀️ 22°C</div></div>
      </div>
    </div>
    <div style="padding:4px 12px;background:#f0f0f0;border-top:1px solid #ddd;font-size:9px;color:#888;">© 2003 Microsoft Corporation. Tous droits réservés.</div>
  `},

  'microsoft.com': { title: 'Microsoft', html: `
    <div style="background:#00adef;padding:10px 16px;color:white;font-family:Tahoma;display:flex;align-items:center;gap:16px;">
      <span style="font-size:20px;font-weight:bold;">Microsoft</span>
    </div>
    <div style="padding:16px;font-family:Tahoma;font-size:11px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div>
        <h3 style="color:#003399;border-bottom:2px solid #003399;padding-bottom:4px;">Windows XP</h3>
        <p style="margin:8px 0;line-height:1.6;">Windows XP offre une expérience informatique révolutionnaire avec fiabilité et sécurité améliorées.</p>
        <a style="color:#00c;cursor:pointer;text-decoration:underline;">→ Windows Update</a><br>
        <a style="color:#00c;cursor:pointer;text-decoration:underline;">→ Télécharger Service Pack 2</a>
      </div>
      <div>
        <h3 style="color:#003399;border-bottom:2px solid #003399;padding-bottom:4px;">Produits phares</h3>
        <ul style="margin:8px 0 0 16px;line-height:2;">
          <li><a style="color:#00c;cursor:pointer;">Office XP</a></li>
          <li><a style="color:#00c;cursor:pointer;">Internet Explorer 6</a></li>
          <li><a style="color:#00c;cursor:pointer;">MSN Messenger</a></li>
        </ul>
      </div>
    </div>
  `},

  'wikipedia.org': { title: 'Wikipédia — L\'encyclopédie libre', html: `
    <div style="display:flex;align-items:center;gap:12px;padding:8px 16px;border-bottom:1px solid #a7d7f9;background:#f6f6f6;">
      <div style="font-size:32px;">🌐</div>
      <div>
        <div style="font-size:20px;font-weight:bold;font-family:Georgia,serif;">Wikipédia</div>
        <div style="font-size:11px;color:#54595d;font-family:sans-serif;">L'encyclopédie libre</div>
      </div>
    </div>
    <div style="max-width:700px;margin:16px auto;padding:0 16px;font-family:sans-serif;font-size:12px;line-height:1.6;">
      <div style="text-align:center;padding:12px;background:#f8f9fa;border:1px solid #a2a9b1;margin-bottom:16px;">
        <input type="text" id="wiki_q" placeholder="Rechercher dans Wikipédia" style="width:300px;height:26px;padding:2px 8px;border:1px solid #a2a9b1;font-size:12px;">
        <button onclick="ieSiteSearch(document.getElementById('wiki_q').value,'wikipedia',null)" style="padding:2px 10px;margin-left:4px;font-size:12px;cursor:pointer;border:1px solid #a2a9b1;background:#f8f9fa;">Rechercher</button>
      </div>
      <h2 style="border-bottom:1px solid #a2a9b1;padding-bottom:4px;">Bienvenue sur Wikipédia</h2>
      <p>Wikipédia est une encyclopédie universelle et multilingue établie sur Internet. Son contenu est librement réutilisable, son écriture est collaborative et ses rédacteurs sont bénévoles.</p>
      <p style="margin-top:8px;color:#666;font-size:11px;"><b>6 900 000+</b> articles en anglais · <b>2 600 000+</b> articles en français</p>
    </div>
  `},

  'youtube.com': { title: 'YouTube — Broadcast Yourself', html: `
    <div style="background:#cc0000;padding:8px 16px;color:white;font-family:Arial;font-size:18px;font-weight:bold;display:flex;align-items:center;gap:8px;">
      <span style="background:white;color:#cc0000;padding:2px 6px;border-radius:3px;font-size:14px;">You</span>Tube
    </div>
    <div style="padding:40px;text-align:center;font-family:Arial;font-size:12px;color:#666;">
      <div style="font-size:48px;margin-bottom:16px;">📺</div>
      <h2 style="color:#333;">YouTube n'existait pas encore !</h2>
      <p style="margin-top:8px;">YouTube a été fondé en <b>2005</b>. En 2003 avec Windows XP, cette page n'existait pas encore.</p>
    </div>
  `},

  'lemonde.fr': { title: 'Le Monde.fr', html: `
    <div style="background:white;border-bottom:3px solid #000;padding:8px 16px;font-family:'Times New Roman',serif;">
      <div style="font-size:28px;font-weight:bold;letter-spacing:-1px;">Le Monde</div>
      <div style="font-size:10px;color:#555;font-family:Tahoma;">Le journal de référence</div>
    </div>
    <div style="padding:12px 16px;font-family:Tahoma;font-size:11px;max-width:700px;">
      <div style="border-bottom:1px solid #ccc;padding-bottom:10px;margin-bottom:10px;">
        <h3 style="font-size:14px;margin-bottom:4px;"><a style="color:#000;cursor:pointer;text-decoration:none;">À la une : Actualités politiques françaises</a></h3>
        <p style="color:#555;font-size:10px;">Le gouvernement annonce de nouvelles mesures économiques pour relancer la croissance...</p>
      </div>
      <div style="border-bottom:1px solid #ccc;padding-bottom:10px;margin-bottom:10px;">
        <h3 style="font-size:14px;margin-bottom:4px;"><a style="color:#000;cursor:pointer;">International : Situation en Europe</a></h3>
        <p style="color:#555;font-size:10px;">Les dirigeants européens se réunissent à Bruxelles pour discuter de l'élargissement...</p>
      </div>
      <div>
        <h3 style="font-size:14px;margin-bottom:4px;"><a style="color:#000;cursor:pointer;">Culture : Cinéma, le palmarès du Festival</a></h3>
        <p style="color:#555;font-size:10px;">La Palme d'or attribuée à un réalisateur européen lors de la cérémonie...</p>
      </div>
    </div>
  `},

  'error': { title: 'Cette page ne peut pas être affichée', html: `
    <div style="padding:24px 32px;font-family:Tahoma;font-size:12px;max-width:600px;">
      <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:16px;">
        <div style="font-size:48px;line-height:1;">⚠️</div>
        <div>
          <h2 style="color:#cc0000;font-size:16px;margin-bottom:8px;">Internet Explorer ne peut pas afficher cette page Web</h2>
          <p style="color:#555;">Ce site Web n'autorise pas l'affichage dans un autre contexte (politique X-Frame-Options ou CSP).</p>
        </div>
      </div>
      <div style="background:#fff8dc;border:1px solid #e8d870;padding:10px 12px;margin-bottom:12px;">
        <b>Causes possibles :</b>
        <ul style="margin:6px 0 0 20px;line-height:1.8;color:#555;">
          <li>Le site utilise une politique de sécurité moderne</li>
          <li>La connexion Internet est interrompue</li>
          <li>Le serveur est temporairement indisponible</li>
        </ul>
      </div>
      <b>Suggestions :</b>
      <ul style="margin:6px 0 0 20px;line-height:2;color:#333;">
        <li>Cliquez sur <b>Actualiser</b> pour réessayer</li>
        <li>Accédez à votre page d'<a id="ie_error_home" style="color:#00c;cursor:pointer;text-decoration:underline;">Accueil</a></li>
      </ul>
    </div>
  `}
};

function ieGetDomain(url) {
  try { return new URL(url.startsWith('http') ? url : 'http://' + url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

function ieNormalizeUrl(input) {
  input = input.trim();
  if (!input) return 'http://www.msn.com/';
  if (!input.includes('://')) {
    if (!input.includes('.') || input.includes(' '))
      return 'https://www.google.com/search?q=' + encodeURIComponent(input);
    input = 'http://' + input;
  }
  return input;
}

function ieGetSimulated(url) {
  const domain = ieGetDomain(url);
  for (const [key, page] of Object.entries(IE_SIMULATED)) {
    if (key === 'error') continue;
    if (domain.includes(key) || key.includes(domain)) return page;
  }
  return null;
}

// ============================================================
// OUVERTURE DE L'APP
// ============================================================
Apps.ie = function(off) {
  const id = 'ie_' + Date.now();
  WM.create(id, 'Internet Explorer', '🌐', 820, 580, 40 + off, 30 + off, `
    <div style="display:flex;flex-direction:column;height:100%;">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Fichier
          <div class="dropdown">
            <div class="dd-item" onclick="WM.close('${id}')">Fermer</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Favoris
          <div class="dropdown">
            <div class="dd-item" onclick="ieLoadUrl('http://www.google.com/','${id}')">🔍 Google</div>
            <div class="dd-item" onclick="ieLoadUrl('http://www.microsoft.com/','${id}')">🪟 Microsoft</div>
            <div class="dd-item" onclick="ieLoadUrl('http://www.msn.com/','${id}')">📰 MSN</div>
            <div class="dd-item" onclick="ieLoadUrl('http://www.wikipedia.org/','${id}')">📖 Wikipédia</div>
            <div class="dd-item" onclick="ieLoadUrl('http://www.lemonde.fr/','${id}')">📰 Le Monde</div>
            <div class="dd-item" onclick="ieLoadUrl('http://www.youtube.com/','${id}')">▶️ YouTube</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Outils
          <div class="dropdown">
            <div class="dd-item" onclick="openApp('about')">Options Internet...</div>
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:2px;padding:2px 4px;background:#ece9d8;border-bottom:1px solid #ccc;flex-shrink:0;">
        <button class="tb-btn" id="ie_back_${id}" onclick="ieBack('${id}')" disabled>◀ Préc.</button>
        <button class="tb-btn" id="ie_fwd_${id}" onclick="ieFwd('${id}')" disabled>▶ Suiv.</button>
        <button class="tb-btn" id="ie_stop_${id}" onclick="ieStop('${id}')" disabled>✕</button>
        <button class="tb-btn" onclick="ieRefresh('${id}')">🔄</button>
        <button class="tb-btn" onclick="ieLoadUrl('http://www.msn.com/','${id}')">🏠</button>
        <div class="tb-sep"></div>
        <span style="font-size:11px;padding:0 4px;white-space:nowrap;">Adresse :</span>
        <input type="text" id="ie_addr_${id}" style="flex:1;height:22px;padding:1px 6px;border:2px inset #888;font-size:11px;font-family:Tahoma;" value="http://www.msn.com/" onkeydown="if(event.key==='Enter') ieLoadUrl(this.value,'${id}')">
        <button class="tb-btn" onclick="ieLoadUrl(document.getElementById('ie_addr_${id}').value,'${id}')">Atteindre ➜</button>
      </div>
      <div style="display:flex;align-items:center;gap:1px;padding:1px 4px;background:#ece9d8;border-bottom:1px solid #ccc;flex-shrink:0;font-size:10px;">
        <span style="color:#666;margin-right:4px;">Liens :</span>
        <button style="padding:1px 6px;font-size:10px;background:linear-gradient(180deg,#f0ede4,#d8d4c8);border:1px solid #888;cursor:pointer;" onclick="ieLoadUrl('http://www.google.com/','${id}')">Google</button>
        <button style="padding:1px 6px;font-size:10px;background:linear-gradient(180deg,#f0ede4,#d8d4c8);border:1px solid #888;cursor:pointer;" onclick="ieLoadUrl('http://www.wikipedia.org/','${id}')">Wikipedia</button>
        <button style="padding:1px 6px;font-size:10px;background:linear-gradient(180deg,#f0ede4,#d8d4c8);border:1px solid #888;cursor:pointer;" onclick="ieLoadUrl('http://www.lemonde.fr/','${id}')">Le Monde</button>
        <button style="padding:1px 6px;font-size:10px;background:linear-gradient(180deg,#f0ede4,#d8d4c8);border:1px solid #888;cursor:pointer;" onclick="ieLoadUrl('http://www.youtube.com/','${id}')">YouTube</button>
        <button style="padding:1px 6px;font-size:10px;background:linear-gradient(180deg,#f0ede4,#d8d4c8);border:1px solid #888;cursor:pointer;" onclick="ieLoadUrl('http://www.msn.com/','${id}')">MSN</button>
      </div>
      <div style="flex:1;position:relative;overflow:hidden;" id="ie_wrap_${id}">
        <iframe id="ie_frame_${id}" style="width:100%;height:100%;border:none;display:none;" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerpolicy="no-referrer"></iframe>
        <div id="ie_sim_${id}" style="width:100%;height:100%;overflow:auto;background:white;cursor:default;user-select:text;display:block;"></div>
        <div id="ie_loading_${id}" style="display:none;position:absolute;inset:0;background:white;z-index:10;flex-direction:column;align-items:center;justify-content:center;">
          <div style="font-family:Tahoma;font-size:13px;color:#333;margin-bottom:12px;">Connexion en cours...</div>
          <div class="xp-progress" style="width:200px;"><div class="xp-progress-fill" style="width:100%;"></div></div>
        </div>
      </div>
      <div class="statusbar">
        <div id="ie_status_${id}" class="status-panel" style="flex:1;">Prêt</div>
        <div class="status-panel">🌐 Internet</div>
      </div>
    </div>
  `, {
    onOpen: () => setTimeout(() => {
      window['_ie_' + id] = { history: [], idx: -1, loading: false };
      ieLoadUrl('http://www.msn.com/', id);
    }, 80)
  });
};

// ============================================================
// NAVIGATION
// ============================================================
function ieLoadUrl(rawUrl, id) {
  const url = ieNormalizeUrl(rawUrl);
  const state = window['_ie_' + id] || { history: [], idx: -1, loading: false };

  const addrEl = document.getElementById('ie_addr_' + id);
  const statusEl = document.getElementById('ie_status_' + id);
  const stopBtn = document.getElementById('ie_stop_' + id);
  const frame = document.getElementById('ie_frame_' + id);
  const sim = document.getElementById('ie_sim_' + id);
  const loadingEl = document.getElementById('ie_loading_' + id);
  if (!frame || !sim) return;

  if (addrEl) addrEl.value = url;

  state.history = state.history.slice(0, state.idx + 1);
  state.history.push(url);
  state.idx = state.history.length - 1;
  window['_ie_' + id] = state;
  ieUpdateNavBtns(id, state);

  if (statusEl) statusEl.textContent = 'Connexion à ' + ieGetDomain(url) + '...';
  if (stopBtn) stopBtn.disabled = false;
  if (loadingEl) loadingEl.style.display = 'flex';

  // Google search
  if (url.includes('/search?q=') || url.includes('google.com/search')) {
    let q = '';
    try { q = new URL(url).searchParams.get('q') || ''; } catch {}
    setTimeout(() => {
      if (loadingEl) loadingEl.style.display = 'none';
      if (stopBtn) stopBtn.disabled = true;
      frame.style.display = 'none';
      sim.style.display = 'block';
      sim.innerHTML = ieSearchResults(q);
      if (statusEl) statusEl.textContent = 'Terminé';
      ieUpdateTitle(id, q + ' - Recherche Google - Internet Explorer');
    }, 400);
    return;
  }

  // Check simulated pages
  const simPage = ieGetSimulated(url);
  if (simPage) {
    setTimeout(() => {
      if (loadingEl) loadingEl.style.display = 'none';
      if (stopBtn) stopBtn.disabled = true;
      frame.style.display = 'none';
      sim.style.display = 'block';
      sim.innerHTML = simPage.html;
      if (statusEl) statusEl.textContent = 'Terminé';
      ieUpdateTitle(id, simPage.title + ' - Internet Explorer');
      setTimeout(() => {
        const homeLink = document.getElementById('ie_error_home');
        if (homeLink) homeLink.onclick = () => ieLoadUrl('http://www.msn.com/', id);
      }, 50);
    }, 200 + Math.random() * 500);
    return;
  }

  // Try real iframe
  state.loading = true;
  frame.style.display = 'block';
  sim.style.display = 'none';

  const timeout = setTimeout(() => {
    if (!window['_ie_' + id] || !window['_ie_' + id].loading) return;
    window['_ie_' + id].loading = false;
    ieShowError(id, url);
  }, 5000);

  frame.onload = () => {
    if (!window['_ie_' + id]) return;
    window['_ie_' + id].loading = false;
    clearTimeout(timeout);
    if (loadingEl) loadingEl.style.display = 'none';
    if (stopBtn) stopBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Terminé';
    try { const t = frame.contentDocument?.title; if (t) ieUpdateTitle(id, t + ' - Internet Explorer'); } catch {}
  };

  frame.onerror = () => {
    clearTimeout(timeout);
    ieShowError(id, url);
  };

  try { frame.src = url; } catch(e) { clearTimeout(timeout); ieShowError(id, url); }
}

function ieShowError(id, url) {
  const frame = document.getElementById('ie_frame_' + id);
  const sim = document.getElementById('ie_sim_' + id);
  const loadingEl = document.getElementById('ie_loading_' + id);
  const statusEl = document.getElementById('ie_status_' + id);
  const stopBtn = document.getElementById('ie_stop_' + id);
  if (frame) frame.style.display = 'none';
  if (sim) { sim.style.display = 'block'; sim.innerHTML = IE_SIMULATED.error.html; }
  if (loadingEl) loadingEl.style.display = 'none';
  if (stopBtn) stopBtn.disabled = true;
  if (statusEl) statusEl.textContent = 'Erreur';
  ieUpdateTitle(id, 'Cette page ne peut pas être affichée - Internet Explorer');
  setTimeout(() => {
    const homeLink = document.getElementById('ie_error_home');
    if (homeLink) homeLink.onclick = () => ieLoadUrl('http://www.msn.com/', id);
  }, 50);
}

function ieStop(id) {
  const state = window['_ie_' + id]; if (!state) return;
  state.loading = false; clearTimeout(state._timeout);
  const frame = document.getElementById('ie_frame_' + id);
  if (frame) { try { frame.contentWindow.stop(); } catch {} frame.style.display = 'none'; }
  const sim = document.getElementById('ie_sim_' + id);
  if (sim) { sim.style.display = 'block'; sim.innerHTML = IE_SIMULATED.error.html; }
  const loading = document.getElementById('ie_loading_' + id); if (loading) loading.style.display = 'none';
  const stop = document.getElementById('ie_stop_' + id); if (stop) stop.disabled = true;
  const status = document.getElementById('ie_status_' + id); if (status) status.textContent = 'Arrêté';
}

function ieBack(id) {
  const state = window['_ie_' + id]; if (!state || state.idx <= 0) return;
  state.idx--;
  const url = state.history[state.idx];
  ieLoadUrlDirect(url, id);
}
function ieFwd(id) {
  const state = window['_ie_' + id]; if (!state || state.idx >= state.history.length - 1) return;
  state.idx++;
  ieLoadUrlDirect(state.history[state.idx], id);
}
function ieRefresh(id) { const a = document.getElementById('ie_addr_' + id); if (a) ieLoadUrl(a.value, id); }

// Direct load without modifying history (back/fwd)
function ieLoadUrlDirect(url, id) {
  const addrEl = document.getElementById('ie_addr_' + id); if (addrEl) addrEl.value = url;
  const state = window['_ie_' + id]; ieUpdateNavBtns(id, state);
  const frame = document.getElementById('ie_frame_' + id);
  const sim = document.getElementById('ie_sim_' + id);
  const loading = document.getElementById('ie_loading_' + id);
  const status = document.getElementById('ie_status_' + id);
  if (url.includes('/search?q=')) {
    let q = ''; try { q = new URL(url).searchParams.get('q') || ''; } catch {}
    if (frame) frame.style.display = 'none';
    if (sim) { sim.style.display = 'block'; sim.innerHTML = ieSearchResults(q); }
    if (loading) loading.style.display = 'none';
    if (status) status.textContent = 'Terminé';
    return;
  }
  const simPage = ieGetSimulated(url);
  if (simPage) {
    if (frame) frame.style.display = 'none';
    if (sim) { sim.style.display = 'block'; sim.innerHTML = simPage.html; }
    if (loading) loading.style.display = 'none';
    if (status) status.textContent = 'Terminé';
    ieUpdateTitle(id, simPage.title + ' - Internet Explorer');
    return;
  }
  if (frame) { frame.style.display = 'block'; frame.src = url; }
  if (sim) sim.style.display = 'none';
  if (status) status.textContent = 'Chargement...';
}

function ieUpdateNavBtns(id, state) {
  const backBtn = document.getElementById('ie_back_' + id);
  const fwdBtn = document.getElementById('ie_fwd_' + id);
  if (backBtn) backBtn.disabled = !state || state.idx <= 0;
  if (fwdBtn) fwdBtn.disabled = !state || state.idx >= state.history.length - 1;
}

function ieUpdateTitle(id, title) {
  const winEl = document.getElementById('win_' + id);
  if (winEl) { const tb = winEl.querySelector('.titlebar-title'); if (tb) tb.textContent = title.length > 55 ? title.substring(0, 52) + '...' : title; }
}

window.ieNavGlobal = function(url) {
  const ieId = Object.keys(WM.windows).find(id => id.startsWith('ie_'));
  if (ieId) ieLoadUrl(url, ieId);
  else { openApp('ie'); setTimeout(() => ieNavGlobal(url), 200); }
};

window.ieSiteSearch = function(q, engine, ctxId) {
  if (!q) return;
  const url = engine === 'wikipedia'
    ? 'https://fr.wikipedia.org/wiki/' + encodeURIComponent(q)
    : 'https://www.google.com/search?q=' + encodeURIComponent(q);
  const ieId = ctxId || Object.keys(WM.windows).find(id => id.startsWith('ie_'));
  if (ieId) ieLoadUrl(url, ieId);
};

// ============================================================
// PAGE DE RÉSULTATS GOOGLE SIMULÉE
// ============================================================
function ieSearchResults(query) {
  const q = query || '';
  const results = [
    { title: q + ' — Wikipédia', url: 'http://www.wikipedia.org/', desc: q + ' est un sujet documenté sur Wikipédia, l\'encyclopédie libre rédigée par ses utilisateurs.' },
    { title: q + ' — Le Monde.fr', url: 'http://www.lemonde.fr/', desc: 'Retrouvez toutes les actualités et informations sur ' + q + ' dans Le Monde, journal de référence.' },
    { title: q + ' — MSN Actualités', url: 'http://www.msn.com/', desc: 'Dernières nouvelles et informations sur ' + q + ' sur MSN, votre portail en ligne.' },
    { title: 'Microsoft et ' + q, url: 'http://www.microsoft.com/', desc: 'Découvrez les solutions et produits Microsoft en rapport avec ' + q + '.' },
    { title: q + ' — Résultats Web', url: '#', desc: 'Environ 2 840 000 résultats pour ' + q + '. Explorez les meilleures ressources disponibles sur le Web.' },
  ];
  return `
    <div style="font-family:Arial,sans-serif;font-size:12px;">
      <div style="padding:8px 16px;border-bottom:1px solid #e0e0e0;display:flex;align-items:center;gap:12px;background:white;">
        <span style="font-size:22px;font-weight:bold;">
          <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span><span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span><span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
        </span>
        <input type="text" value="${q.replace(/"/g,'&quot;')}" style="width:400px;height:28px;padding:4px 12px;border:1px solid #dfe1e5;border-radius:20px;font-size:13px;outline:none;">
        <button style="padding:6px 14px;background:#1a73e8;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;">Rechercher</button>
      </div>
      <div style="padding:6px 16px 8px;font-size:11px;color:#70757a;border-bottom:1px solid #e0e0e0;">
        Environ <b>2 840 000</b> résultats (0,38 secondes)
      </div>
      <div style="padding:12px 16px;max-width:640px;">
        ${results.map(r => `
          <div style="margin-bottom:20px;">
            <div style="font-size:11px;color:#006621;">${r.url}</div>
            <a style="font-size:16px;color:#1a0dab;text-decoration:none;cursor:pointer;" onclick="ieNavGlobal('${r.url}')">${r.title}</a>
            <p style="font-size:13px;color:#545454;margin:3px 0 0;line-height:1.5;">${r.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
