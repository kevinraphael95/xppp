// ============================================================
// SOUND MANAGER — Web Audio API (no external files needed)
// ============================================================
const SoundManager = {
  ctx: null,
  enabled: true,
  volume: 0.5,

  init() {
    this.volume = State.getVolume();
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  },

  // Unlock audio context on first user gesture
  unlock() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  // Generate a simple tone
  _tone(freq, duration, type = 'sine', gain = 0.3) {
    if (!this.ctx || !this.enabled) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gainNode.gain.setValueAtTime(gain * this.volume, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) { /* ignore */ }
  },

  // Sounds library
  sounds: {
    // Windows XP startup chime approximation (4 notes)
    startup() {
      const S = SoundManager;
      if (!S.ctx) return;
      const notes = [[523, 0.15], [659, 0.15], [784, 0.2], [1047, 0.4]];
      let t = S.ctx.currentTime;
      notes.forEach(([freq, dur]) => {
        const osc = S.ctx.createOscillator();
        const g = S.ctx.createGain();
        osc.connect(g); g.connect(S.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.25 * S.volume, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t); osc.stop(t + dur);
        t += dur * 0.7;
      });
    },

    // Window open - short ascending
    open() { SoundManager._tone(880, 0.08, 'sine', 0.2); },

    // Window close - short descending
    close() { SoundManager._tone(440, 0.08, 'sine', 0.15); },

    // Minimize
    minimize() { SoundManager._tone(660, 0.06, 'sine', 0.15); },

    // Error - harsh buzz
    error() {
      const S = SoundManager;
      S._tone(220, 0.15, 'square', 0.3);
      setTimeout(() => S._tone(220, 0.15, 'square', 0.3), 180);
    },

    // Notification / ding
    ding() {
      SoundManager._tone(1047, 0.05, 'sine', 0.25);
      setTimeout(() => SoundManager._tone(1319, 0.2, 'sine', 0.2), 60);
    },

    // Click
    click() { SoundManager._tone(1200, 0.03, 'sine', 0.1); },

    // Recycle bin empty
    recycle() {
      SoundManager._tone(440, 0.12, 'triangle', 0.2);
      setTimeout(() => SoundManager._tone(330, 0.2, 'triangle', 0.2), 140);
    },

    // Battery / warning
    exclamation() {
      SoundManager._tone(880, 0.08, 'square', 0.2);
      setTimeout(() => SoundManager._tone(660, 0.15, 'square', 0.2), 100);
    }
  },

  play(name) {
    this.unlock();
    if (this.sounds[name]) this.sounds[name]();
  },

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    State.saveVolume(this.volume);
  },

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
};
