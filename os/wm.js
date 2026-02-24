// ============================================================
// WINDOW MANAGER
// ============================================================
const WM = {
  windows: {},
  zBase: 100,
  focused: null,

  create(id, title, icon, w, h, x, y, content, opts = {}) {
    if (this.windows[id]) {
      this.focus(id);
      this.restore(id);
      return;
    }
    const win = document.createElement('div');
    win.className = 'window';
    win.id = 'win_' + id;
    win.style.cssText = `width:${w}px;height:${h}px;left:${x}px;top:${y}px;`;

    const resizable = opts.resizable !== false;
    const maximizable = opts.maximizable !== false;

    win.innerHTML = `
      <div class="titlebar" data-wid="${id}">
        <span class="titlebar-icon">${icon}</span>
        <span class="titlebar-title">${title}</span>
        <div class="win-btns">
          <div class="win-btn minimize" onclick="WM.minimize('${id}')" title="Réduire">_</div>
          ${maximizable ? `<div class="win-btn maximize" onclick="WM.toggleMax('${id}')" title="Agrandir">▢</div>` : ''}
          <div class="win-btn close" onclick="WM.close('${id}')" title="Fermer">✕</div>
        </div>
      </div>
      <div class="window-content">${content}</div>
      ${resizable ? `<div class="resize-handle" data-wid="${id}"></div>` : ''}
    `;

    document.getElementById('desktop').appendChild(win);
    this.windows[id] = {
      el: win, title, icon,
      x, y, w, h,
      minimized: false, maximized: false,
      prevState: { x, y, w, h }
    };
    this.focus(id);
    this.makeDraggable(win, id);
    if (resizable) this.makeResizable(win, id);
    this.addTaskbarBtn(id, title, icon);
    SoundManager.play('open');
    if (opts.onOpen) opts.onOpen();
    State.saveOpenWindows();
  },

  focus(id) {
    if (this.focused === id) return;
    Object.values(this.windows).forEach(w => w.el && w.el.classList.remove('focused'));
    const w = this.windows[id];
    if (w) {
      w.el.classList.add('focused');
      w.el.style.zIndex = ++this.zBase;
      this.focused = id;
    }
    this.updateTaskbar();
  },

  close(id) {
    const w = this.windows[id];
    if (!w) return;
    SoundManager.play('close');
    w.el.remove();
    delete this.windows[id];
    this.removeTaskbarBtn(id);
    this.focused = null;
    if (id === 'minesweeper') clearInterval(window._msTimer);
    if (id === 'taskmgr') clearInterval(window._tmTimer);
    State.saveOpenWindows();
  },

  minimize(id) {
    const w = this.windows[id];
    if (!w) return;
    SoundManager.play('minimize');
    w.el.classList.add('minimized');
    w.minimized = true;
    this.focused = null;
    this.updateTaskbar();
    State.saveOpenWindows();
  },

  restore(id) {
    const w = this.windows[id];
    if (!w) return;
    w.el.classList.remove('minimized');
    w.minimized = false;
    this.focus(id);
    State.saveOpenWindows();
  },

  toggleMax(id) {
    const w = this.windows[id];
    if (!w) return;
    if (w.maximized) {
      const p = w.prevState;
      w.el.style.cssText = `width:${p.w}px;height:${p.h}px;left:${p.x}px;top:${p.y}px;`;
      w.maximized = false;
    } else {
      w.prevState = {
        x: parseInt(w.el.style.left), y: parseInt(w.el.style.top),
        w: parseInt(w.el.style.width), h: parseInt(w.el.style.height)
      };
      w.el.style.cssText = `width:${window.innerWidth}px;height:${window.innerHeight - 30}px;left:0;top:0;`;
      w.maximized = true;
    }
    this.focus(id);
  },

  makeDraggable(win, id) {
    const tb = win.querySelector('.titlebar');
    let dragging = false, ox = 0, oy = 0;
    tb.addEventListener('mousedown', e => {
      if (e.target.classList.contains('win-btn')) return;
      const w = this.windows[id];
      if (w.maximized) return;
      dragging = true;
      ox = e.clientX - parseInt(win.style.left);
      oy = e.clientY - parseInt(win.style.top);
      this.focus(id);
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const nx = e.clientX - ox, ny = e.clientY - oy;
      win.style.left = Math.max(0, Math.min(window.innerWidth - 80, nx)) + 'px';
      win.style.top = Math.max(0, Math.min(window.innerHeight - 60, ny)) + 'px';
    });
    document.addEventListener('mouseup', () => { if (dragging) { dragging = false; State.saveWindowPositions(); } });
    win.addEventListener('mousedown', () => this.focus(id));
  },

  makeResizable(win, id) {
    const rh = win.querySelector('.resize-handle');
    if (!rh) return;
    let resizing = false, ox = 0, oy = 0, ow = 0, oh = 0;
    rh.addEventListener('mousedown', e => {
      resizing = true;
      ox = e.clientX; oy = e.clientY;
      ow = parseInt(win.style.width); oh = parseInt(win.style.height);
      e.preventDefault(); e.stopPropagation();
    });
    document.addEventListener('mousemove', e => {
      if (!resizing) return;
      const nw = Math.max(200, ow + (e.clientX - ox));
      const nh = Math.max(100, oh + (e.clientY - oy));
      win.style.width = nw + 'px'; win.style.height = nh + 'px';
    });
    document.addEventListener('mouseup', () => resizing = false);
  },

  addTaskbarBtn(id, title, icon) {
    const apps = document.getElementById('taskbar-apps');
    const btn = document.createElement('div');
    btn.className = 'tb-app active';
    btn.id = 'tb_' + id;
    btn.innerHTML = `<span class="tb-app-ico">${icon}</span>${title.substring(0, 18)}`;
    btn.onclick = () => {
      const w = this.windows[id];
      if (!w) return;
      if (w.minimized) { this.restore(id); }
      else if (this.focused === id) { this.minimize(id); }
      else { this.focus(id); }
    };
    apps.appendChild(btn);
  },

  removeTaskbarBtn(id) {
    const btn = document.getElementById('tb_' + id);
    if (btn) btn.remove();
  },

  updateTaskbar() {
    Object.keys(this.windows).forEach(id => {
      const btn = document.getElementById('tb_' + id);
      if (btn) {
        const w = this.windows[id];
        btn.classList.toggle('active', this.focused === id && !w.minimized);
      }
    });
  }
};
