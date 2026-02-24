// ============================================================
// NOTEPAD
// ============================================================
Apps.notepad = function(off) {
  const id = 'notepad_' + Date.now();
  const savedContent = State.getNotepadContent();
  WM.create(id, 'Bloc-notes - Sans titre', '📝', 520, 380, 80 + off, 60 + off, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Fichier
          <div class="dropdown">
            <div class="dd-item" onclick="npNew(this)">Nouveau</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="npSave(this)">💾 Enregistrer sous...</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="WM.close('${id}')">Quitter</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Edition
          <div class="dropdown">
            <div class="dd-item" onclick="document.execCommand('undo')">↩ Annuler</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="document.execCommand('cut')">✂ Couper</div>
            <div class="dd-item" onclick="document.execCommand('copy')">📋 Copier</div>
            <div class="dd-item" onclick="document.execCommand('paste')">📌 Coller</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="selectAllNp(this)">Sélectionner tout</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Format
          <div class="dropdown">
            <div class="dd-item" onclick="toggleWrap(this)"><span class="dd-check">✓</span> Retour à la ligne auto.</div>
            <div class="dd-item" onclick="changeFont(this)">Police...</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Affichage
          <div class="dropdown">
            <div class="dd-item" onclick="toggleSb(this)"><span class="dd-check">✓</span> Barre d'état</div>
          </div>
        </div>
        <div class="menu-item" onclick="openApp('about')">?</div>
      </div>
      <textarea id="np_${id}" style="flex:1;resize:none;border:none;outline:none;padding:4px;font-family:'Courier New',monospace;font-size:12px;background:white;width:100%;height:100%;" placeholder="Tapez votre texte ici...">${savedContent}</textarea>
      <div class="statusbar"><div class="status-panel" id="np_sb_${id}">Ln 1, Col 1</div></div>
    </div>
  `);

  setTimeout(() => {
    const ta = document.getElementById('np_' + id);
    if (ta) {
      ta.addEventListener('keyup', () => {
        const lines = ta.value.substring(0, ta.selectionStart).split('\n');
        const sb = document.getElementById('np_sb_' + id);
        if (sb) sb.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
        // Autosave
        State.saveNotepadContent(ta.value);
      });
    }
  }, 50);
};

function npNew(el) {
  const ta = el.closest('.window').querySelector('textarea');
  if (ta) { ta.value = ''; State.saveNotepadContent(''); }
}

function npSave(el) {
  const ta = el.closest('.window').querySelector('textarea');
  if (ta) {
    const blob = new Blob([ta.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.txt';
    a.click();
  }
}

function selectAllNp(el) {
  const ta = el.closest('.window').querySelector('textarea');
  if (ta) { ta.focus(); ta.select(); }
}

function toggleWrap(el) {
  const ta = el.closest('.window').querySelector('textarea');
  if (ta) ta.style.whiteSpace = ta.style.whiteSpace === 'nowrap' ? 'pre-wrap' : 'nowrap';
}

function changeFont(el) {
  const ta = el.closest('.window').querySelector('textarea');
  if (ta) {
    const f = prompt('Police (ex: Arial, Courier New):', ta.style.fontFamily || 'Courier New');
    if (f) ta.style.fontFamily = f;
  }
}

function toggleSb(el) {
  const sb = el.closest('.window').querySelector('.statusbar');
  if (sb) sb.style.display = sb.style.display === 'none' ? 'flex' : 'none';
}
