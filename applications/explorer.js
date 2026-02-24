// ============================================================
// FILE EXPLORER / POSTE DE TRAVAIL
// ============================================================
const FS = {
  'Poste de travail': { type: 'folder', children: {
    'Disque local (C:)': { type: 'folder', children: {
      'Windows': { type: 'folder', children: {
        'System32': { type: 'folder', children: {
          'notepad.exe': { type: 'file', icon: '📝', size: '61 Ko' },
          'calc.exe': { type: 'file', icon: '🔢', size: '114 Ko' },
          'mspaint.exe': { type: 'file', icon: '🎨', size: '297 Ko' },
        }},
        'explorer.exe': { type: 'file', icon: '📁', size: '1 021 Ko' },
      }},
      'Mes documents': { type: 'folder', children: {
        'Mes images': { type: 'folder', children: {
          'photo.jpg': { type: 'file', icon: '🖼️', size: '1,2 Mo' },
        }},
        'readme.txt': { type: 'file', icon: '📝', size: '1 Ko' },
        'rapport.doc': { type: 'file', icon: '📄', size: '24 Ko' },
      }},
      'Program Files': { type: 'folder', children: {
        'Internet Explorer': { type: 'folder', children: {
          'iexplore.exe': { type: 'file', icon: '🌐', size: '91 Ko' },
        }},
        'Accessories': { type: 'folder', children: {
          'wordpad.exe': { type: 'file', icon: '📄', size: '230 Ko' },
        }},
      }},
    }},
    'Disque amovible (D:)': { type: 'folder', children: {
      'musique.mp3': { type: 'file', icon: '🎵', size: '4,2 Mo' },
      'photo_vacances.jpg': { type: 'file', icon: '🖼️', size: '2,1 Mo' },
    }},
  }}
};

Apps.explorer = function(off) {
  const id = 'explorer_' + Date.now();
  WM.create(id, 'Poste de travail', '📁', 640, 420, 50 + off, 60 + off, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Fichier
          <div class="dropdown">
            <div class="dd-item" onclick="WM.close('${id}')">Fermer</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Affichage
          <div class="dropdown">
            <div class="dd-item">Grandes icônes</div>
            <div class="dd-item">Liste</div>
            <div class="dd-item">Détails</div>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <button class="tb-btn" onclick="expUp('${id}')">⬆ Dossier parent</button>
        <div class="tb-sep"></div>
        <span style="font-size:11px;color:#444;">Adresse :</span>
        <input type="text" id="exp_addr_${id}" style="flex:1;height:20px;margin-left:4px;" value="Poste de travail" readonly>
      </div>
      <div style="flex:1;display:flex;overflow:hidden;">
        <div id="exp_tree_${id}" style="width:160px;border-right:1px solid #bbb;overflow:auto;background:white;padding:4px;flex-shrink:0;font-size:11px;"></div>
        <div id="exp_files_${id}" style="flex:1;overflow:auto;background:white;padding:8px;"></div>
      </div>
      <div style="height:20px;background:#ece9d8;border-top:1px solid #bbb;display:flex;align-items:center;padding:0 8px;">
        <span id="exp_status_${id}" style="font-size:11px;"></span>
      </div>
    </div>
  `, { onOpen: () => setTimeout(() => initExplorer(id), 50) });
};

function initExplorer(id) {
  const tree = document.getElementById('exp_tree_' + id);
  if (!tree) return;
  window['_exp_' + id] = { currentNode: FS['Poste de travail'], history: [] };
  buildExpTree(id);
  expNavigate(id, 'Poste de travail', FS['Poste de travail']);
}

function buildExpTree(id) {
  const tree = document.getElementById('exp_tree_' + id);
  if (!tree) return;
  tree.innerHTML = '';
  function addNode(name, node, depth) {
    const item = document.createElement('div');
    item.style.cssText = `display:flex;align-items:center;gap:4px;padding:2px 4px 2px ${depth*12+4}px;cursor:pointer;border:1px solid transparent;border-radius:2px;`;
    item.textContent = (node.type === 'folder' ? '📁 ' : '') + name;
    item.onmouseover = () => item.style.background = '#dce8f5';
    item.onmouseout = () => item.style.background = '';
    item.onclick = () => expNavigate(id, name, node);
    tree.appendChild(item);
    if (node.type === 'folder' && node.children && depth < 2) {
      Object.entries(node.children).forEach(([n, c]) => addNode(n, c, depth + 1));
    }
  }
  addNode('Poste de travail', FS['Poste de travail'], 0);
}

function expNavigate(id, name, node) {
  const files = document.getElementById('exp_files_' + id);
  const addr = document.getElementById('exp_addr_' + id);
  const status = document.getElementById('exp_status_' + id);
  if (!files) return;
  if (addr) addr.value = name;

  const current = node || FS['Poste de travail'];
  files.innerHTML = '';
  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;padding:4px;';

  if (current.type === 'folder' && current.children) {
    const entries = Object.entries(current.children);
    entries.forEach(([n, c]) => {
      const item = document.createElement('div');
      item.style.cssText = 'display:flex;flex-direction:column;align-items:center;width:72px;padding:4px;cursor:pointer;border:1px solid transparent;border-radius:2px;text-align:center;font-size:11px;';
      const ico = c.type === 'folder' ? '📁' : (c.icon || '📄');
      item.innerHTML = `<div style="font-size:28px;margin-bottom:2px;">${ico}</div><div style="word-break:break-word;line-height:1.2;">${n}</div>`;
      item.onmouseover = () => { item.style.background = '#dce8f5'; item.style.borderColor = '#7da2ce'; };
      item.onmouseout = () => { item.style.background = ''; item.style.borderColor = 'transparent'; };
      item.ondblclick = () => {
        if (c.type === 'folder') expNavigate(id, n, c);
        else if (n.endsWith('.txt')) openApp('notepad');
        else if (n.endsWith('.doc')) openApp('wordpad');
        else if (n.endsWith('.exe')) {
          SoundManager.play('error');
          showMsg(n, 'Impossible d\'exécuter ce programme dans l\'environnement actuel.');
        }
      };
      grid.appendChild(item);
    });
    if (status) status.textContent = `${entries.length} objet(s)`;
  }
  files.appendChild(grid);
}

function expUp(id) { expNavigate(id, 'Poste de travail', FS['Poste de travail']); }
