// ============================================================
// PAINT
// ============================================================
Apps.paint = function(off) {
  const id = 'paint_' + Date.now();
  WM.create(id, 'Sans titre - Paint', '🎨', 620, 460, 60 + off, 40 + off, `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="menubar">
        <div class="menu-item" onclick="toggleMenu(this)">Fichier
          <div class="dropdown">
            <div class="dd-item" onclick="paintNew(this)">Nouveau</div>
            <div class="dd-item" onclick="paintSave(this)">💾 Enregistrer...</div>
            <div class="dd-item separator"></div>
            <div class="dd-item" onclick="WM.close('${id}')">Quitter</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Edition
          <div class="dropdown">
            <div class="dd-item" onclick="paintClear(this)">Effacer tout</div>
          </div>
        </div>
        <div class="menu-item" onclick="toggleMenu(this)">Image
          <div class="dropdown">
            <div class="dd-item" onclick="paintFlipH(this)">↔ Retourner horizontalement</div>
            <div class="dd-item" onclick="paintFlipV(this)">↕ Retourner verticalement</div>
          </div>
        </div>
      </div>
      <div style="flex:1;display:flex;overflow:hidden;">
        <div style="display:flex;flex-direction:column;gap:2px;padding:4px;background:#c0c0c0;border-right:1px solid #808080;width:52px;flex-shrink:0;" id="pt_tools_${id}">
          <div style="display:flex;gap:2px;">
            <button class="pt-btn active" data-tool="pencil" title="Crayon" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;">✏️</button>
            <button class="pt-btn" data-tool="fill" title="Remplissage" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;">🪣</button>
          </div>
          <div style="display:flex;gap:2px;">
            <button class="pt-btn" data-tool="eraser" title="Gomme" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;">⬜</button>
            <button class="pt-btn" data-tool="eyedrop" title="Pipette" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;">💉</button>
          </div>
          <div style="display:flex;gap:2px;">
            <button class="pt-btn" data-tool="rect" title="Rectangle" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;">▭</button>
            <button class="pt-btn" data-tool="ellipse" title="Ellipse" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;">⬭</button>
          </div>
          <div style="display:flex;gap:2px;">
            <button class="pt-btn" data-tool="line" title="Ligne" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;">╱</button>
            <button class="pt-btn" data-tool="text" title="Texte" onclick="ptTool(this,'${id}')" style="width:24px;height:24px;font-size:13px;background:linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:2px;font-weight:bold;">A</button>
          </div>
          <hr style="border:1px solid #808080;margin:2px 0;">
          <div style="font-size:9px;text-align:center;color:#444;">Taille</div>
          <div style="display:flex;flex-direction:column;gap:2px;align-items:center;" id="pt_sizes_${id}">
            <button data-size="1" onclick="ptSize(this,'${id}')" style="width:38px;height:14px;font-size:9px;background:#e0e0e0;border:2px inset #808080;cursor:pointer;display:flex;align-items:center;justify-content:center;"><span style="background:#333;width:20px;height:1px;display:block;"></span></button>
            <button data-size="3" onclick="ptSize(this,'${id}')" style="width:38px;height:14px;font-size:9px;background:#e0e0e0;border:1px solid #808080;cursor:pointer;display:flex;align-items:center;justify-content:center;"><span style="background:#333;width:20px;height:3px;display:block;"></span></button>
            <button data-size="6" onclick="ptSize(this,'${id}')" style="width:38px;height:14px;font-size:9px;background:#e0e0e0;border:1px solid #808080;cursor:pointer;display:flex;align-items:center;justify-content:center;"><span style="background:#333;width:20px;height:6px;display:block;"></span></button>
          </div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
          <div style="flex:1;overflow:auto;background:#808080;padding:2px;">
            <canvas id="pt_canvas_${id}" width="520" height="340" style="display:block;cursor:crosshair;background:white;"></canvas>
          </div>
          <div style="padding:4px;background:#c0c0c0;border-top:1px solid #808080;display:flex;align-items:center;gap:4px;flex-shrink:0;">
            <div style="position:relative;width:32px;height:28px;flex-shrink:0;">
              <div id="pt_bg_${id}" style="width:22px;height:20px;border:1px solid #808080;position:absolute;bottom:0;right:0;background:white;cursor:pointer;"></div>
              <div id="pt_fg_${id}" style="width:22px;height:20px;border:1px solid #808080;position:absolute;top:0;left:0;background:black;cursor:pointer;"></div>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:1px;max-width:320px;" id="pt_palette_${id}"></div>
          </div>
        </div>
      </div>
      <div class="statusbar"><div id="pt_status_${id}" class="status-panel">Crayon</div></div>
    </div>
  `, { onOpen: () => setTimeout(() => initPaint(id), 50) });
};

function initPaint(id) {
  const canvas = document.getElementById('pt_canvas_' + id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);

  const palette = [
    '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080',
    '#808040','#004040','#0080ff','#004080','#8000ff','#804000','#ffffff','#c0c0c0',
    '#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffff80','#00ff80',
    '#80ffff','#8080ff','#ff0080','#ff8040','#ff8000','#ffc000','#ffcc99','#cc9966'
  ];
  const pal = document.getElementById('pt_palette_' + id);
  if (pal) {
    palette.forEach(col => {
      const sw = document.createElement('div');
      sw.style.cssText = `width:14px;height:14px;background:${col};border:1px solid #808080;cursor:pointer;flex-shrink:0;`;
      sw.onclick = (e) => { document.getElementById('pt_fg_' + id).style.background = col; };
      sw.oncontextmenu = (e) => { e.preventDefault(); document.getElementById('pt_bg_' + id).style.background = col; };
      pal.appendChild(sw);
    });
  }

  let drawing = false, tool = 'pencil', brushSize = 2, startX = 0, startY = 0, snapshot = null;
  canvas._paintState = { tool, brushSize };

  canvas.addEventListener('mousedown', e => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left; startY = e.clientY - rect.top;
    const fg = document.getElementById('pt_fg_' + id)?.style.background || 'black';
    ctx.strokeStyle = fg; ctx.fillStyle = fg;
    ctx.lineWidth = canvas._paintState.brushSize || 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const t = canvas._paintState.tool;
    if (t === 'pencil' || t === 'eraser') {
      ctx.beginPath(); ctx.moveTo(startX, startY);
      if (t === 'eraser') { ctx.strokeStyle = 'white'; ctx.lineWidth = (canvas._paintState.brushSize || 2) * 3; }
    }
    if (t === 'fill') { floodFill(ctx, Math.round(startX), Math.round(startY), hexToRgb(fg)); drawing = false; }
    if (t === 'text') {
      const txt = prompt('Texte:');
      if (txt) { ctx.font = '16px Arial'; ctx.fillStyle = fg; ctx.fillText(txt, startX, startY); }
      drawing = false;
    }
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    e.preventDefault();
  });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const st = document.getElementById('pt_status_' + id);
    if (st) st.textContent = `${Math.round(x)}, ${Math.round(y)}`;
    if (!drawing) return;
    const fg = document.getElementById('pt_fg_' + id)?.style.background || 'black';
    const t = canvas._paintState.tool;
    ctx.strokeStyle = fg; ctx.lineWidth = canvas._paintState.brushSize || 2;
    if (t === 'pencil' || t === 'eraser') {
      if (t === 'eraser') { ctx.strokeStyle = 'white'; ctx.lineWidth = (canvas._paintState.brushSize || 2) * 3; }
      ctx.lineTo(x, y); ctx.stroke();
    } else if (t === 'line') {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath(); ctx.strokeStyle = fg; ctx.lineWidth = canvas._paintState.brushSize || 2;
      ctx.moveTo(startX, startY); ctx.lineTo(x, y); ctx.stroke();
    } else if (t === 'rect') {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath(); ctx.strokeStyle = fg; ctx.lineWidth = canvas._paintState.brushSize || 2;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (t === 'ellipse') {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath(); ctx.strokeStyle = fg; ctx.lineWidth = canvas._paintState.brushSize || 2;
      const rx = Math.abs(x - startX) / 2, ry = Math.abs(y - startY) / 2;
      const cx = startX + (x - startX) / 2, cy = startY + (y - startY) / 2;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI); ctx.stroke();
    }
  });

  canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
  canvas._setTool = (t) => { canvas._paintState.tool = t; };
  canvas._setSize = (s) => { canvas._paintState.brushSize = s; };
}

function ptTool(btn, id) {
  const tool = btn.dataset.tool;
  const canvas = document.getElementById('pt_canvas_' + id);
  if (canvas?._setTool) canvas._setTool(tool);
  btn.closest('[id^="pt_tools"]').querySelectorAll('.pt-btn').forEach(b => {
    b.style.border = '2px outset #ddd';
  });
  btn.style.border = '2px inset #ddd';
  const names = { pencil:'Crayon', fill:'Pot de peinture', eraser:'Gomme', rect:'Rectangle', ellipse:'Ellipse', line:'Ligne', text:'Texte', eyedrop:'Pipette' };
  const st = document.getElementById('pt_status_' + id);
  if (st) st.textContent = names[tool] || tool;
}

function ptSize(btn, id) {
  const canvas = document.getElementById('pt_canvas_' + id);
  if (canvas?._setSize) canvas._setSize(parseInt(btn.dataset.size));
  btn.closest('[id^="pt_sizes"]').querySelectorAll('button').forEach(b => b.style.border = '1px solid #808080');
  btn.style.border = '2px inset #808080';
}

function paintNew(el) {
  const c = el.closest('.window').querySelector('canvas');
  if (c) { const ctx = c.getContext('2d'); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, c.width, c.height); }
}
function paintSave(el) {
  const c = el.closest('.window').querySelector('canvas');
  if (c) { const a = document.createElement('a'); a.href = c.toDataURL(); a.download = 'image.png'; a.click(); }
}
function paintClear(el) { paintNew(el); }
function paintFlipH(el) {
  const c = el.closest('.window').querySelector('canvas');
  if (c) { const ctx = c.getContext('2d'); const img = new Image(); img.src = c.toDataURL(); img.onload = () => { ctx.save(); ctx.scale(-1,1); ctx.drawImage(img,-c.width,0); ctx.restore(); }; }
}
function paintFlipV(el) {
  const c = el.closest('.window').querySelector('canvas');
  if (c) { const ctx = c.getContext('2d'); const img = new Image(); img.src = c.toDataURL(); img.onload = () => { ctx.save(); ctx.scale(1,-1); ctx.drawImage(img,0,-c.height); ctx.restore(); }; }
}

function hexToRgb(str) {
  const el = document.createElement('div'); el.style.color = str; document.body.appendChild(el);
  const cs = getComputedStyle(el).color; document.body.removeChild(el);
  const m = cs.match(/\d+/g); return m ? { r: +m[0], g: +m[1], b: +m[2] } : { r: 0, g: 0, b: 0 };
}

function floodFill(ctx, startX, startY, fillColor) {
  const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const d = img.data, w = img.width, h = img.height;
  const idx = (x, y) => (y * w + x) * 4;
  const si = idx(startX, startY);
  const sr = d[si], sg = d[si+1], sb = d[si+2];
  if (sr === fillColor.r && sg === fillColor.g && sb === fillColor.b) return;
  const stack = [[startX, startY]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const i = idx(x, y);
    if (d[i] !== sr || d[i+1] !== sg || d[i+2] !== sb) continue;
    d[i] = fillColor.r; d[i+1] = fillColor.g; d[i+2] = fillColor.b; d[i+3] = 255;
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
  }
  ctx.putImageData(img, 0, 0);
}
