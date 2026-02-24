// ============================================================
// WORDPAD
// ============================================================
Apps.wordpad = function(off) {
  const id = 'wordpad_' + Date.now();
  WM.create(id, 'Document - WordPad', '📄', 660, 480, 100 + off, 50 + off, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Fichier
          <div class="dropdown">
            <div class="dd-item" onclick="wpNew(this)">Nouveau</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="wpSave(this)">💾 Enregistrer en HTML</div>
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
            <div class="dd-item" onclick="document.execCommand('selectAll')">Sélectionner tout</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Format
          <div class="dropdown">
            <div class="dd-item" onclick="document.execCommand('bold')">Gras</div>
            <div class="dd-item" onclick="document.execCommand('italic')">Italique</div>
            <div class="dd-item" onclick="document.execCommand('underline')">Souligné</div>
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:4px;padding:2px 4px;background:#ece9d8;border-bottom:1px solid #ccc;flex-shrink:0;flex-wrap:wrap;">
        <select style="height:20px;min-width:100px;" onchange="document.execCommand('fontName',false,this.value)">
          <option>Times New Roman</option><option>Arial</option><option>Courier New</option>
          <option>Tahoma</option><option>Verdana</option><option>Georgia</option>
        </select>
        <select style="height:20px;width:48px;" onchange="document.execCommand('fontSize',false,this.value)">
          <option value="1">8</option><option value="2">10</option>
          <option value="3" selected>12</option><option value="4">14</option>
          <option value="5">18</option><option value="6">24</option><option value="7">36</option>
        </select>
        <div class="tb-sep"></div>
        <button class="wp-fmt-btn" onclick="document.execCommand('bold')" title="Gras" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;font-size:12px;display:flex;align-items:center;"><b>G</b></button>
        <button class="wp-fmt-btn" onclick="document.execCommand('italic')" title="Italique" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;font-size:12px;display:flex;align-items:center;"><i>I</i></button>
        <button class="wp-fmt-btn" onclick="document.execCommand('underline')" title="Souligné" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;font-size:12px;display:flex;align-items:center;"><u>S</u></button>
        <div class="tb-sep"></div>
        <button onclick="document.execCommand('justifyLeft')" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;">◀</button>
        <button onclick="document.execCommand('justifyCenter')" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;">▬</button>
        <button onclick="document.execCommand('justifyRight')" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;">▶</button>
        <div class="tb-sep"></div>
        <button onclick="document.execCommand('insertUnorderedList')" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;">•</button>
        <button onclick="document.execCommand('insertOrderedList')" style="padding:1px 4px;height:20px;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);border:1px solid #888;cursor:pointer;">1.</button>
        <div class="tb-sep"></div>
        <label style="font-size:11px">Couleur:</label>
        <input type="color" style="width:24px;height:20px;border:1px solid #888;cursor:pointer;"
               onchange="document.execCommand('foreColor',false,this.value)">
      </div>
      <div id="wp_content_${id}" contenteditable="true"
           style="flex:1;padding:12px 16px;background:white;outline:none;overflow-y:auto;
           font-family:'Times New Roman',serif;font-size:13px;line-height:1.6;cursor:text;user-select:text;min-height:0;">
        <p>Bienvenue dans WordPad !</p>
        <p>Commencez à taper votre texte ici. Vous pouvez utiliser la barre de mise en forme pour <b>mettre en gras</b>, <i>en italique</i> ou <u>souligner</u> votre texte.</p>
      </div>
      <div class="statusbar"><span class="status-panel">Prêt</span></div>
    </div>
  `);
};

function wpNew(el) {
  const c = el.closest('.window').querySelector('[contenteditable]');
  if (c) c.innerHTML = '<p></p>';
}

function wpSave(el) {
  const c = el.closest('.window').querySelector('[contenteditable]');
  if (c) {
    const blob = new Blob([c.innerHTML], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.html';
    a.click();
  }
}
