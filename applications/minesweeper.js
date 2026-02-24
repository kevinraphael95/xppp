// ============================================================
// MINESWEEPER
// ============================================================
Apps.minesweeper = function(off) {
  const id = 'minesweeper';
  if (WM.windows[id]) { WM.focus(id); return; }
  WM.create(id, 'Démineur', '💣', 210, 290, 150 + off, 80 + off, `
    <div style="padding:8px;background:#c0c0c0;display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div style="background:#c0c0c0;border:3px inset #808080;padding:4px 8px;display:flex;align-items:center;justify-content:space-between;width:100%;">
        <div id="ms_mines" style="font-family:'Courier New',monospace;font-size:20px;background:black;color:red;padding:2px 6px;border:2px inset #808080;min-width:50px;text-align:right;letter-spacing:2px;font-weight:bold;">010</div>
        <div id="ms_face" onclick="msInit()" style="width:32px;height:32px;font-size:20px;background:linear-gradient(180deg,#ddd 0%,#bbb 100%);border:2px outset #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;">🙂</div>
        <div id="ms_timer" style="font-family:'Courier New',monospace;font-size:20px;background:black;color:red;padding:2px 6px;border:2px inset #808080;min-width:50px;text-align:right;letter-spacing:2px;font-weight:bold;">000</div>
      </div>
      <div id="ms_grid" style="border:3px inset #808080;display:inline-block;"></div>
    </div>
  `, { resizable: false, maximizable: false, onOpen: () => setTimeout(msInit, 50) });
};

const MS = {
  rows: 9, cols: 9, mines: 10,
  board: [], revealed: [], flagged: [],
  gameOver: false, started: false, time: 0, timer: null
};

function msInit() {
  MS.gameOver = false; MS.started = false; MS.time = 0;
  clearInterval(MS.timer);
  const grid = document.getElementById('ms_grid');
  const face = document.getElementById('ms_face');
  const timerEl = document.getElementById('ms_timer');
  const minesEl = document.getElementById('ms_mines');
  if (!grid) return;
  if (face) face.textContent = '🙂';
  if (timerEl) timerEl.textContent = '000';
  if (minesEl) minesEl.textContent = String(MS.mines).padStart(3, '0');

  MS.board = Array.from({ length: MS.rows }, () => Array(MS.cols).fill(0));
  MS.revealed = Array.from({ length: MS.rows }, () => Array(MS.cols).fill(false));
  MS.flagged = Array.from({ length: MS.rows }, () => Array(MS.cols).fill(false));

  let placed = 0;
  while (placed < MS.mines) {
    const r = Math.floor(Math.random() * MS.rows), c = Math.floor(Math.random() * MS.cols);
    if (MS.board[r][c] !== -1) { MS.board[r][c] = -1; placed++; }
  }
  for (let r = 0; r < MS.rows; r++) for (let c = 0; c < MS.cols; c++) {
    if (MS.board[r][c] === -1) continue;
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < MS.rows && nc >= 0 && nc < MS.cols && MS.board[nr][nc] === -1) n++;
    }
    MS.board[r][c] = n;
  }

  grid.innerHTML = '';
  for (let r = 0; r < MS.rows; r++) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    for (let c = 0; c < MS.cols; c++) {
      const cell = document.createElement('div');
      cell.style.cssText = 'width:20px;height:20px;background:linear-gradient(180deg,#ddd 0%,#bbb 100%);border:2px outset #fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;font-weight:bold;font-family:Arial;';
      cell.id = `ms_${r}_${c}`;
      cell.addEventListener('click', () => msReveal(r, c));
      cell.addEventListener('contextmenu', e => { e.preventDefault(); msFlag(r, c); });
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function msStartTimer() {
  if (MS.started) return;
  MS.started = true;
  MS.timer = setInterval(() => {
    MS.time++;
    const el = document.getElementById('ms_timer');
    if (el) el.textContent = String(Math.min(MS.time, 999)).padStart(3, '0');
  }, 1000);
  window._msTimer = MS.timer;
}

function msReveal(r, c) {
  if (MS.gameOver || MS.revealed[r][c] || MS.flagged[r][c]) return;
  msStartTimer();
  if (MS.board[r][c] === -1) {
    MS.gameOver = true;
    clearInterval(MS.timer);
    SoundManager.play('error');
    const cell = document.getElementById(`ms_${r}_${c}`);
    if (cell) { cell.textContent = '💥'; cell.style.background = 'red'; }
    for (let rr = 0; rr < MS.rows; rr++) for (let cc = 0; cc < MS.cols; cc++) {
      if (MS.board[rr][cc] === -1 && !(rr === r && cc === c)) {
        const mc = document.getElementById(`ms_${rr}_${cc}`);
        if (mc) { mc.textContent = '💣'; mc.style.background = '#c0c0c0'; mc.style.border = '1px solid #808080'; }
      }
    }
    const face = document.getElementById('ms_face');
    if (face) face.textContent = '😵';
    return;
  }
  msFloodReveal(r, c);
  msCheckWin();
}

function msFloodReveal(r, c) {
  if (r < 0 || r >= MS.rows || c < 0 || c >= MS.cols) return;
  if (MS.revealed[r][c] || MS.flagged[r][c]) return;
  MS.revealed[r][c] = true;
  const cell = document.getElementById(`ms_${r}_${c}`);
  if (!cell) return;
  cell.style.background = '#c0c0c0';
  cell.style.border = '1px solid #808080';
  cell.style.cursor = 'default';
  const v = MS.board[r][c];
  const colors = ['','#0000ff','#008000','#ff0000','#000080','#800000','#008080','#000000','#808080'];
  if (v > 0) {
    cell.textContent = v;
    cell.style.color = colors[v] || '#000';
  } else {
    cell.textContent = '';
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) msFloodReveal(r + dr, c + dc);
  }
}

function msFlag(r, c) {
  if (MS.gameOver || MS.revealed[r][c]) return;
  MS.flagged[r][c] = !MS.flagged[r][c];
  const cell = document.getElementById(`ms_${r}_${c}`);
  if (cell) cell.textContent = MS.flagged[r][c] ? '🚩' : '';
}

function msCheckWin() {
  let revealed = 0;
  for (let r = 0; r < MS.rows; r++) for (let c = 0; c < MS.cols; c++) if (MS.revealed[r][c]) revealed++;
  if (revealed === MS.rows * MS.cols - MS.mines) {
    MS.gameOver = true;
    clearInterval(MS.timer);
    SoundManager.play('ding');
    const face = document.getElementById('ms_face');
    if (face) face.textContent = '😎';
    setTimeout(() => alert('🎉 Bravo ! Vous avez gagné !'), 200);
  }
}
