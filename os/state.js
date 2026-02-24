// ============================================================
// STATE MANAGER — cookies + session persistence
// ============================================================
const State = {
  COOKIE_PREFIX: 'winxp_',
  COOKIE_DAYS: 365,

  // --- Cookie helpers ---
  setCookie(name, value, days = this.COOKIE_DAYS) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${this.COOKIE_PREFIX}${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires};path=/;SameSite=Lax`;
  },

  getCookie(name) {
    const key = this.COOKIE_PREFIX + name + '=';
    const found = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(key));
    if (!found) return null;
    try { return JSON.parse(decodeURIComponent(found.slice(key.length))); }
    catch { return null; }
  },

  deleteCookie(name) {
    document.cookie = `${this.COOKIE_PREFIX}${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },

  // --- Username ---
  getUsername() {
    return this.getCookie('username') || 'Utilisateur';
  },

  setUsername(name) {
    this.setCookie('username', name);
    const el = document.getElementById('sm-username');
    if (el) el.textContent = name;
  },

  // --- Desktop icon positions ---
  saveIconPositions() {
    const positions = {};
    document.querySelectorAll('.desk-icon').forEach(icon => {
      const id = icon.dataset.appid;
      if (id) {
        positions[id] = {
          left: parseInt(icon.style.left) || 0,
          top: parseInt(icon.style.top) || 0
        };
      }
    });
    this.setCookie('icon_positions', positions);
  },

  loadIconPositions() {
    return this.getCookie('icon_positions') || {};
  },

  // --- Open windows (for task manager display / session memory) ---
  saveOpenWindows() {
    const open = Object.entries(WM.windows).map(([id, w]) => ({
      id,
      title: w.title,
      icon: w.icon,
      minimized: w.minimized
    }));
    this.setCookie('open_windows', open);
  },

  getOpenWindows() {
    return this.getCookie('open_windows') || [];
  },

  // --- Window positions ---
  saveWindowPositions() {
    const positions = {};
    Object.entries(WM.windows).forEach(([id, w]) => {
      positions[id] = {
        left: parseInt(w.el.style.left),
        top: parseInt(w.el.style.top),
        width: parseInt(w.el.style.width),
        height: parseInt(w.el.style.height)
      };
    });
    this.setCookie('win_positions', positions);
  },

  getWindowPosition(id) {
    const positions = this.getCookie('win_positions') || {};
    return positions[id] || null;
  },

  // --- Wallpaper ---
  saveWallpaper(wallpaper) {
    this.setCookie('wallpaper', wallpaper);
  },

  getWallpaper() {
    return this.getCookie('wallpaper') || 'default';
  },

  // --- Notepad content (autosave) ---
  saveNotepadContent(content) {
    this.setCookie('notepad_autosave', content);
  },

  getNotepadContent() {
    return this.getCookie('notepad_autosave') || '';
  },

  // --- Volume ---
  saveVolume(vol) {
    this.setCookie('volume', vol);
  },

  getVolume() {
    const v = this.getCookie('volume');
    return v !== null ? v : 0.5;
  },

  // --- Recently used apps ---
  addRecentApp(appId) {
    let recent = this.getCookie('recent_apps') || [];
    recent = [appId, ...recent.filter(a => a !== appId)].slice(0, 5);
    this.setCookie('recent_apps', recent);
  },

  getRecentApps() {
    return this.getCookie('recent_apps') || [];
  },

  // --- Clear all state ---
  clearAll() {
    ['username', 'icon_positions', 'open_windows', 'win_positions',
     'wallpaper', 'notepad_autosave', 'volume', 'recent_apps'].forEach(k => this.deleteCookie(k));
  }
};
