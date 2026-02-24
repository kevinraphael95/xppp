// ============================================================
// ABOUT / PROPRIÉTÉS SYSTÈME
// ============================================================
Apps.about = function(off) {
  const id = 'about';
  if (WM.windows[id]) { WM.focus(id); return; }
  WM.create(id, 'Propriétés système', 'ℹ️', 380, 300, 250, 150, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div style="display:flex;flex-direction:column;align-items:center;padding:20px;background:white;flex:1;">
        <div style="font-size:48px;margin-bottom:8px;">🪟</div>
        <div style="font-size:22px;font-weight:bold;color:#003399;font-family:'Franklin Gothic Medium',Tahoma;letter-spacing:-1px;">Microsoft Windows</div>
        <div style="font-size:22px;color:#ff6600;font-style:italic;font-family:'Franklin Gothic Medium',Tahoma;">XP</div>
        <div style="font-size:12px;color:#333;margin-top:4px;">Édition Familiale</div>
        <div style="font-size:12px;color:#555;margin-top:2px;">Version 5.1.2600 Service Pack 3</div>
        <hr style="width:100%;margin:12px 0;border:1px solid #ddd;">
        <div style="font-size:11px;color:#333;text-align:center;line-height:2;">
          <div>Intel Pentium 4, 2,40 GHz</div>
          <div>512 Mo de RAM</div>
          <div>Enregistré à : <b id="about_username">${State ? State.getUsername() : 'Utilisateur'}</b></div>
        </div>
      </div>
      <div style="padding:8px;display:flex;justify-content:center;border-top:1px solid #bbb;">
        <button onclick="WM.close('about')" style="padding:4px 20px;font-size:11px;font-family:Tahoma;border:1px solid #888;background:linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%);cursor:pointer;">OK</button>
      </div>
    </div>
  `, { resizable: false, maximizable: false });
};

// ============================================================
// SOLITAIRE
// ============================================================
Apps.solitaire = function(off) {
  const id = 'solitaire_' + Date.now();
  WM.create(id, 'Solitaire', '🂡', 650, 490, 50 + off, 30 + off, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Jeu
          <div class="dropdown">
            <div class="dd-item" onclick="solInit('${id}')">Nouvelle partie</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="WM.close('${id}')">Quitter</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Aide
          <div class="dropdown">
            <div class="dd-item" onclick="alert('Klondike Solitaire\\n\\nBut : déplacer toutes les cartes vers les 4 fondations en ordre croissant par couleur.\\n\\nCliquez sur le tas pour retourner une carte.')">Aide sur le Solitaire</div>
          </div>
        </div>
      </div>
      <div id="sol_body_${id}" style="background:#006600;flex:1;position:relative;overflow:hidden;padding:8px;min-height:0;"></div>
      <div class="statusbar"><div id="sol_score_${id}" class="status-panel">Score : 0</div></div>
    </div>
  `, { onOpen: () => setTimeout(() => solInit(id), 50) });
};

function solInit(id) {
  const body = document.getElementById('sol_body_' + id);
  if (!body) return;

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];
  suits.forEach(s => ranks.forEach(r => deck.push({ s, r, red: s === '♥' || s === '♦' })));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const cols = Array.from({ length: 7 }, () => []);
  let ci = 0;
  for (let c = 0; c < 7; c++) for (let r = 0; r <= c; r++) {
    cols[c].push({ ...deck[ci++], faceDown: r < c });
  }
  const stock = deck.slice(ci);
  let waste = [], score = 0;
  const state = { cols, stock, waste, score };
  window['_sol_' + id] = state;

  function render() {
    body.innerHTML = '';
    const W = body.clientWidth || 620;
    const colW = Math.min(70, Math.floor((W - 60) / 7));
    const gap = Math.min(8, Math.floor((W - colW * 7 - 16) / 6));
    const st = window['_sol_' + id];

    // Stock
    const stockDiv = document.createElement('div');
    stockDiv.style.cssText = `position:absolute;left:8px;top:8px;width:${colW}px;height:90px;`;
    if (st.stock.length > 0) {
      const c = makeCard(null, true, colW);
      c.style.cssText += 'cursor:pointer;position:absolute;inset:0;';
      c.onclick = () => {
        const card = st.stock.pop();
        if (card) { card.faceDown = false; st.waste.push(card); st.score += 5; updateScore(); render(); }
      };
      stockDiv.appendChild(c);
    } else {
      stockDiv.style.cssText += 'border:2px dashed rgba(255,255,255,0.3);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:24px;';
      stockDiv.textContent = '↺';
      stockDiv.onclick = () => {
        if (st.waste.length) { st.stock = [...st.waste].reverse(); st.waste = []; render(); }
      };
    }
    body.appendChild(stockDiv);

    // Waste
    if (st.waste.length > 0) {
      const top = st.waste[st.waste.length - 1];
      const c = makeCard(top, false, colW);
      c.style.cssText += `position:absolute;left:${colW + gap + 8}px;top:8px;`;
      body.appendChild(c);
    }

    // Foundation piles
    for (let f = 0; f < 4; f++) {
      const fp = document.createElement('div');
      fp.style.cssText = `position:absolute;left:${(f + 3) * (colW + gap) + 8}px;top:8px;width:${colW}px;height:90px;border:2px dashed rgba(255,255,255,0.3);border-radius:4px;display:flex;align-items:center;justify-content:center;`;
      fp.innerHTML = `<span style="font-size:24px;opacity:0.4;">${suits[f]}</span>`;
      body.appendChild(fp);
    }

    // Tableau columns
    st.cols.forEach((col, ci) => {
      const x = ci * (colW + gap) + 8;
      if (col.length === 0) {
        const emp = document.createElement('div');
        emp.style.cssText = `position:absolute;left:${x}px;top:108px;width:${colW}px;height:90px;border:2px dashed rgba(255,255,255,0.3);border-radius:4px;`;
        body.appendChild(emp);
        return;
      }
      col.forEach((card, ri) => {
        const c = makeCard(card, card.faceDown, colW);
        c.style.cssText += `position:absolute;left:${x}px;top:${108 + ri * 20}px;`;
        if (!card.faceDown && ri === col.length - 1) {
          c.style.cursor = 'pointer';
        }
        body.appendChild(c);
      });
    });

    function updateScore() {
      const el = document.getElementById('sol_score_' + id);
      if (el) el.textContent = 'Score : ' + st.score;
    }
    updateScore();
  }

  function makeCard(card, faceDown, w = 64) {
    const el = document.createElement('div');
    el.style.cssText = `width:${w}px;height:90px;background:white;border:1px solid #888;border-radius:4px;box-shadow:1px 1px 3px rgba(0,0,0,0.4);font-family:Arial;overflow:hidden;`;
    if (faceDown) {
      el.style.background = 'linear-gradient(135deg,#2244aa 0%,#3366cc 50%,#2244aa 100%)';
      el.style.backgroundSize = '10px 10px';
    } else if (card) {
      el.style.color = card.red ? '#cc0000' : '#000';
      el.innerHTML = `
        <div style="position:absolute;top:2px;left:4px;font-size:12px;font-weight:bold;line-height:1;">${card.r}</div>
        <div style="position:absolute;top:14px;left:4px;font-size:11px;">${card.s}</div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:22px;">${card.s}</div>
        <div style="position:absolute;bottom:2px;right:4px;font-size:12px;font-weight:bold;line-height:1;transform:rotate(180deg);">${card.r}</div>
      `;
    }
    return el;
  }

  render();
}
