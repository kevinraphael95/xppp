// ============================================================
// TASK MANAGER DYNAMIQUE
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
        <div style="padding:4px 12px;cursor:pointer;border:1px solid #aaa;border-bottom:none;border-radius:4px 4px 0 0;font-size:11px;margin-right:2px;background:white;margin-bottom:-1px;" onclick="tmTab('apps')" id="tm_tab_apps">Applications</div>
        <div style="padding:4px 12px;cursor:pointer;border:1px solid transparent;border-bottom:none;border-radius:4px 4px 0 0;font-size:11px;margin-right:2px;" onclick="tmTab('proc')" id="tm_tab_proc">Processus</div>
        <div style="padding:4px 12px;cursor:pointer;border:1px solid transparent;border-bottom:none;border-radius:4px 4px 0 0;font-size:11px;margin-right:2px;" onclick="tmTab('perf')" id="tm_tab_perf">Performances</div>
      </div>
      <div id="tm_content" style="padding:8px;flex:1;overflow:auto;"></div>
      <div style="height:22px;background:#ece9d8;border-top:1px solid #bbb;display:flex;align-items:center;padding:0 8px;gap:16px;">
        <span style="font-size:10px;" id="tm_cpu_bar">Utilisation processeur : 15%</span>
        <span style="font-size:10px;" id="tm_mem_bar">Mémoire : 268 Mo / 512 Mo</span>
        <span style="font-size:10px;" id="tm_proc_count">Processus : ${Object.keys(WM.windows).length}</span>
      </div>
    </div>
  `, { onOpen: () => setTimeout(() => { tmTab('apps'); initTMTimer(); }, 50) });
};

// ============================================================
// TAB & CONTENT DYNAMIQUE
// ============================================================
function tmTab(tab) {
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
    const windows = Object.values(WM.windows);
    const rows = windows.length
      ? windows.map(w => `
        <tr onmouseover="this.style.background='#316ac5';this.style.color='white'" onmouseout="this.style.background='';this.style.color=''">
          <td style="border:1px solid #ddd;padding:2px 8px;">${w.icon} ${w.title}</td>
          <td style="border:1px solid #ddd;padding:2px 8px;text-align:center;">En cours</td>
          <td style="border:1px solid #ddd;padding:2px 8px;text-align:center;">${w.minimized ? 'Réduit' : 'Normal'}</td>
          <td style="border:1px solid #ddd;padding:2px 8px;text-align:center;">
            <button onclick="tmKillApp('${w.id}')" style="font-size:10px;padding:2px 6px;">Terminer</button>
          </td>
        </tr>
      `).join('')
      : `<tr><td colspan="4" style="padding:8px;color:#999;text-align:center;">Aucune application ouverte</td></tr>`;

    content.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <tr style="background:#ece9d8;">
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Tâche</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Statut</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Mode</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Action</th>
        </tr>
        ${rows}
      </table>`;
  } else if (tab === 'proc') {
    const processes = Object.values(WM.windows).map(w => ({
      name: w.title + '.exe',
      pid: Math.floor(Math.random() * 5000 + 1000),
      cpu: Math.floor(Math.random()*5)+'%',
      mem: Math.floor(Math.random()*20000+5000).toLocaleString()+' Ko',
      id: w.id
    }));

    const rows = processes.length
      ? processes.map(p => `
        <tr onmouseover="this.style.background='#316ac5';this.style.color='white'" onmouseout="this.style.background='';this.style.color=''">
          <td style="border:1px solid #ddd;padding:2px 8px;">${p.name}</td>
          <td style="border:1px solid #ddd;padding:2px 8px;">${p.pid}</td>
          <td style="border:1px solid #ddd;padding:2px 8px;">${p.cpu}</td>
          <td style="border:1px solid #ddd;padding:2px 8px;">${p.mem}</td>
          <td style="border:1px solid #ddd;padding:2px 8px;text-align:center;">
            <button onclick="tmKillApp('${p.id}')" style="font-size:10px;padding:2px 6px;">Terminer</button>
          </td>
        </tr>
      `).join('')
      : `<tr><td colspan="5" style="padding:8px;color:#999;text-align:center;">Aucun processus actif</td></tr>`;

    content.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <tr style="background:#ece9d8;">
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Nom de l'image</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">PID</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">UC</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Mémoire</th>
          <th style="border:1px solid #bbb;padding:2px 8px;text-align:left;">Action</th>
        </tr>
        ${rows}
      </table>`;
  } else if (tab === 'perf') {
    drawTMGraphs();
  }
}

// ============================================================
// TERMINER APPLICATION
// ============================================================
function tmKillApp(id) {
  if (WM.windows[id]) WM.close(id);
  tmTab(document.querySelector('#tm_tabs_taskmgr .menu-item.active')?.id?.split('_')[2] || 'apps');
}

// ============================================================
// TIMER DYNAMIQUE
// ============================================================
let tmStartTime = Date.now();
function initTMTimer() {
  setInterval(() => {
    const cpu = Math.floor(Math.random() * 30 + 5);
    const mem = Math.floor(Math.random() * 60 + 40);
    const cpuBar = document.getElementById('tm_cpu_bar');
    const memBar = document.getElementById('tm_mem_bar');
    if(cpuBar) cpuBar.textContent = `Utilisation processeur : ${cpu}%`;
    if(memBar) memBar.textContent = `Mémoire : ${mem*10} Mo / 512 Mo`;
    const procCount = document.getElementById('tm_proc_count');
    if(procCount) procCount.textContent = `Processus : ${Object.keys(WM.windows).length}`;
    tmTab(document.querySelector('#tm_tabs_taskmgr .menu-item.active')?.id?.split('_')[2] || 'apps');
  }, 2000);
}
