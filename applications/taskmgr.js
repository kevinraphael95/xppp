// ============================================================
// TASK MANAGER
// ============================================================
Apps.taskmanager = function(off) {
  const id = 'taskmgr';
  if (WM.windows[id]) { WM.focus(id); return; }
  WM.create(id, 'Gestionnaire des tâches Windows', '⚙️', 480, 400, 200 + off, 100 + off, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Fichier
          <div class="dropdown">
            <div class="dd-item" onclick="openApp('notepad')">Nouvelle tâche (Exécuter...)</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="WM.close('taskmgr')">Quitter le Gestionnaire des tâches</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Affichage
          <div class="dropdown">
            <div class="dd-item" onclick="tmRefresh()">Actualiser maintenant</div>
          </div>
        </div>
      </div>
      <div id="tm_tabs_taskmgr" style="display:flex;background:#ece9d8;border-bottom:1px solid #aaa;padding:4px 4px 0;">
        <div style="padding:4px 12px;cursor:pointer;border:1px solid #aaa;border-bottom:none;border-radius:4px 4px 0 0;font-size:11px;margin-right:2px;background:white;margin-bottom:-1px;" onclick="tmTab(this,'apps')" id="tm_tab_apps">Applications</div>
        <div style="padding:4px 12px;cursor:pointer;border:1px solid transparent;border-bottom:none;border-radius:4px 4px 0 0;font-size:11px;margin-right:2px;" onclick="tmTab(this,'proc')" id="tm_tab_proc">Processus</div>
        <div style="padding:4px 12px;cursor:pointer;border:1px solid transparent;border-bottom:none;border-radius:4px 4px 0 0;font-size:11px;margin-right:2px;" onclick="tmTab(this,'perf')" id="tm_tab_perf">Performances</div>
      </div>
      <div id="tm_content" style="padding:8px;flex:1;overflow:auto;"></div>
      <div style="height:22px;background:#ece9d8;border-top:1px solid #bbb;display:flex;align-items:center;padding:0 8px;gap:16px;">
        <span style="font-size:10px;" id="tm_cpu_bar">Utilisation processeur : 15%</span>
        <span style="font-size:10px;" id="tm_mem_bar">Mémoire : 268 Mo / 512 Mo</span>
        <span style="font-size:10px;" id="tm_proc_count">Processus : ${8 + Object.keys(WM.windows).length}</span>
      </div>
    </div>
  `, { onOpen: () => setTimeout(() => { tmTab(null, 'apps'); initTMTimer(); }, 50) });
};

function tmTab(btn, tab) {
  // Update tab styles
  ['apps','proc','perf'].forEach(t => {
    const el = document.getElementById('tm_tab_' + t);
    if (el) {
      if (t === tab) {
        el.style.background = 'white'; el.style.border = '1px solid #aaa';
        el.style.borderBottom = '1px solid white'; el.style.marginBottom = '-1px';
      } else {
        el.style.background = ''; el.style.border = '1px solid transparent';
        el.style.borderBottom = 'none'; el.style.marginBottom = '0';
      }
    }
  });

  const content = document.getElementById('tm_content');
  if (!content) return;

  if (tab === 'apps') {
    const savedWindows = State.getOpenWindows();
    const currentWindows = Object.values(WM.windows);
    const rows = currentWindows.length > 0
      ? currentWindows.map(w => `
          <tr style="cursor:pointer;" onmouseover="this.style.background='#316ac5';this.style.color='white'" onmouseout="this.style.background='';this.style.color=''">
            <td style="border:1px solid #ddd;padding:2px 8px;">${w.icon} ${w.title}</td>
            <td style="border:1px solid #ddd;padding:2px 8px;text-align:center;">En cours d'exécution</td>
            <td style="border:1px solid #ddd;padding:2px 8px;text-align:center;">${w.minimized ? 'Réduit' : 'Normal'}</td>
          </tr>`).join('')
      : '<tr><td colspan="3" style="padding:8px;color:#999;text-align:center;">Aucune application ouverte</td></tr>';

    content.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <tr style="background:#ece9d8;">
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Tâche</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Statut</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Mode</th>
        </tr>
        ${rows}
      </table>
      <div style="display:flex;gap:4px;margin-top:8px;justify-content:flex-end;">
        <button onclick="openApp('notepad')" style="padding:4px 12px;font-size:11px;font-family:Tahoma;border:1px solid #888;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);cursor:pointer;">Nouvelle tâche...</button>
      </div>
    `;
  } else if (tab === 'proc') {
    const baseProcs = [
      ['System', '4', '0%', '28 Ko'],
      ['smss.exe', '312', '0%', '360 Ko'],
      ['csrss.exe', '424', '1%', '3 648 Ko'],
      ['winlogon.exe', '500', '0%', '5 516 Ko'],
      ['services.exe', '548', '0%', '3 164 Ko'],
      ['lsass.exe', '560', '0%', '2 048 Ko'],
      ['svchost.exe', '724', '0%', '4 512 Ko'],
      ['explorer.exe', '1156', '2%', '15 624 Ko'],
      ['taskmgr.exe', '2044', '3%', '3 000 Ko'],
    ];
    // Add open windows as processes
    const winProcs = Object.values(WM.windows).map(w => [
      w.title.toLowerCase().replace(/ /g,'') + '.exe',
      String(Math.floor(Math.random() * 3000 + 1000)),
      Math.floor(Math.random() * 5) + '%',
      Math.floor(Math.random() * 20000 + 5000).toLocaleString('fr-FR') + ' Ko'
    ]);
    const allProcs = [...baseProcs, ...winProcs];

    content.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <tr style="background:#ece9d8;">
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Nom de l'image</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">PID</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">UC</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Mémoire</th>
        </tr>
        ${allProcs.map(p => `
          <tr onmouseover="this.style.background='#316ac5';this.style.color='white'" onmouseout="this.style.background='';this.style.color=''">
            <td style="border:1px solid #ddd;padding:2px 8px;">${p[0]}</td>
            <td style="border:1px solid #ddd;padding:2px 8px;">${p[1]}</td>
            <td style="border:1px solid #ddd;padding:2px 8px;">${p[2]}</td>
            <td style="border:1px solid #ddd;padding:2px 8px;">${p[3]}</td>
          </tr>`).join('')}
      </table>
    `;
  } else if (tab === 'perf') {
    content.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:11px;font-weight:bold;margin-bottom:4px;color:#333;">Utilisation processeur</div>
          <div style="height:80px;background:black;border:2px inset #808080;position:relative;overflow:hidden;">
            <canvas id="tm_cpu_canvas" width="200" height="76" style="display:block;"></canvas>
          </div>
          <div style="font-size:10px;color:#0c0;margin-top:2px;font-family:'Courier New';" id="tm_cpu_pct">15%</div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:bold;margin-bottom:4px;color:#333;">Utilisation mémoire</div>
          <div style="height:80px;background:black;border:2px inset #808080;position:relative;overflow:hidden;">
            <canvas id="tm_mem_canvas" width="200" height="76" style="display:block;"></canvas>
          </div>
          <div style="font-size:10px;color:#0c0;margin-top:2px;font-family:'Courier New';">268 Mo / 512 Mo</div>
        </div>
      </div>
      <div style="margin-top:12px;font-size:11px;border:2px inset #888;padding:8px;background:#fff;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:2px 0;color:#555;">Mémoire physique totale :</td><td><b>524 288 Ko</b></td></tr>
          <tr><td style="padding:2px 0;color:#555;">Mémoire disponible :</td><td><b>256 020 Ko</b></td></tr>
          <tr><td style="padding:2px 0;color:#555;">Charge du système :</td><td><b>52 %</b></td></tr>
          <tr><td style="padding:2px 0;color:#555;">Processus en cours :</td><td><b id="tm_pcount">${9 + Object.keys(WM.windows).length}</b></td></tr>
          <tr><td style="padding:2px 0;color:#555;">Durée de fonctionnement :</td><td><b id="tm_uptime">0:00:00</b></td></tr>
        </table>
      </div>
    `;
    drawTMGraphs();
  }
}

function drawTMGraphs() {
  ['cpu','mem'].forEach(type => {
    const canvas = document.getElementById('tm_' + type + '_canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const history = Array.from({ length: 50 }, () => Math.random() * (type === 'cpu' ? 30 : 60) + (type === 'cpu' ? 5 : 40));
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 200, 76);
    ctx.strokeStyle = '#00cc00'; ctx.lineWidth = 1;
    ctx.beginPath();
    history.forEach((v, i) => {
      const x = i * 4, y = 76 - (v / 100) * 76;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

let tmStartTime = Date.now();
function initTMTimer() {
  const timer = setInterval(() => {
    if (!document.getElementById('tm_content')) { clearInterval(timer); return; }
    const cpu = Math.floor(Math.random() * 30 + 5);
    const cpuBar = document.getElementById('tm_cpu_bar');
    if (cpuBar) cpuBar.textContent = `Utilisation processeur : ${cpu}%`;
    const cpuPct = document.getElementById('tm_cpu_pct');
    if (cpuPct) cpuPct.textContent = cpu + '%';
    const procCount = document.getElementById('tm_proc_count');
    if (procCount) procCount.textContent = `Processus : ${9 + Object.keys(WM.windows).length}`;
    const up = document.getElementById('tm_uptime');
    if (up) {
      const s = Math.floor((Date.now() - tmStartTime) / 1000);
      up.textContent = `${Math.floor(s/3600)}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    }
  }, 2000);
  window._tmTimer = timer;
}

function tmRefresh() {
  const activeTab = ['apps','proc','perf'].find(t => {
    const el = document.getElementById('tm_tab_' + t);
    return el && el.style.background === 'white';
  }) || 'apps';
  tmTab(null, activeTab);
}
