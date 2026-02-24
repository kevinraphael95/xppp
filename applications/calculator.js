// ============================================================
// CALCULATOR
// ============================================================
Apps.calculator = function(off) {
  const id = 'calc_' + Date.now();
  WM.create(id, 'Calculatrice', '🔢', 240, 290, 200 + off, 100 + off, `
    <div style="padding:8px;background:#d4d0c8;">
      <div id="calc_disp_${id}" style="background:#c8d8a0;border:2px inset #888;padding:4px 8px;text-align:right;font-family:'Courier New',monospace;font-size:22px;margin-bottom:8px;height:40px;display:flex;align-items:center;justify-content:flex-end;overflow:hidden;">0</div>
      <div style="display:grid;grid-template-columns:repeat(5,44px);gap:3px;" id="calc_grid_${id}"></div>
    </div>
  `, { resizable: false, maximizable: false, onOpen: () => setTimeout(() => initCalc(id), 50) });
};

function initCalc(id) {
  const grid = document.getElementById('calc_grid_' + id);
  if (!grid) return;
  const disp = document.getElementById('calc_disp_' + id);
  let cur = '0', prev = '', op = '', newNum = true, mem = 0;

  const upd = (v) => {
    cur = String(v);
    if (cur.length > 12) cur = parseFloat(cur).toExponential(4);
    disp.textContent = cur;
  };

  const btnDefs = [
    ['MC','mem'],['MR','mem'],['MS','mem'],['M+','mem'],['±','op'],
    ['√','op'],['%','op'],['CE','op'],['C','op'],['⌫','op'],
    ['1/x','op'],['7','num'],['8','num'],['9','num'],['÷','op'],
    ['',''],['4','num'],['5','num'],['6','num'],['×','op'],
    ['',''],['1','num'],['2','num'],['3','num'],['−','op'],
    ['',''],['0','num'],['.','num'],['=','eq'],['+','op'],
  ];

  btnDefs.forEach(([label, type]) => {
    const btn = document.createElement('button');
    btn.style.cssText = 'height:34px;font-size:12px;font-family:Tahoma;border:1px solid #888;border-radius:2px;cursor:pointer;box-shadow:1px 1px 0 white inset,-1px -1px 0 #999 inset;';
    if (!label) {
      btn.disabled = true;
      btn.style.cssText = 'height:34px;background:transparent;border:none;';
    } else if (type === 'eq') {
      btn.style.background = 'linear-gradient(180deg,#80a8ff 0%,#4060c0 100%)';
      btn.style.color = 'white'; btn.style.fontWeight = 'bold';
    } else if (type === 'mem') {
      btn.style.background = 'linear-gradient(180deg,#d8f0d8 0%,#a8c8a8 100%)';
    } else if (type === 'op') {
      btn.style.background = 'linear-gradient(180deg,#f8e8d0 0%,#e0c8a0 100%)';
    } else {
      btn.style.background = 'linear-gradient(180deg,#f0ede4 0%,#d8d4c8 100%)';
    }
    btn.textContent = label;

    btn.onclick = () => {
      SoundManager.play('click');
      if (!label) return;
      if ((label >= '0' && label <= '9') || label === '.') {
        if (newNum) { cur = label === '.' ? '0.' : label; newNum = false; }
        else { if (label === '.' && cur.includes('.')) return; cur += label; }
        upd(cur);
      } else if (['÷', '×', '−', '+'].includes(label)) {
        prev = cur; op = label; newNum = true;
      } else if (label === '=') {
        if (!prev || !op) return;
        const a = parseFloat(prev), b = parseFloat(cur);
        let r = 0;
        if (op === '÷') r = b === 0 ? 'Erreur' : a / b;
        else if (op === '×') r = a * b;
        else if (op === '−') r = a - b;
        else if (op === '+') r = a + b;
        upd(r); prev = ''; op = ''; newNum = true;
      } else if (label === 'C') { cur = '0'; prev = ''; op = ''; newNum = true; upd('0'); }
      else if (label === 'CE') { cur = '0'; newNum = true; upd('0'); }
      else if (label === '⌫') { cur = cur.length > 1 ? cur.slice(0, -1) : '0'; upd(cur); }
      else if (label === '±') { cur = String(-parseFloat(cur)); upd(cur); }
      else if (label === '%') { cur = String(parseFloat(cur) / 100); upd(cur); }
      else if (label === '√') { cur = String(Math.sqrt(parseFloat(cur))); upd(cur); newNum = true; }
      else if (label === '1/x') { const v = parseFloat(cur); cur = v === 0 ? 'Erreur' : String(1 / v); upd(cur); newNum = true; }
      else if (label === 'MS') { mem = parseFloat(cur); }
      else if (label === 'MR') { upd(mem); newNum = true; }
      else if (label === 'MC') { mem = 0; }
      else if (label === 'M+') { mem += parseFloat(cur); }
    };
    grid.appendChild(btn);
  });
}
