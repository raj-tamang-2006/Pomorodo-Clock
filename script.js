
(function(){
  const DEFAULTS = {
    focus: 25, short: 5, long: 15,
    sessionsBeforeLong: 4,
    autoStart: false,
    soundOn: true,
    volume: 0.7,
    tone: 'chime'
  };

  let settings = Object.assign({}, DEFAULTS);
  let DURATIONS = { focus: settings.focus*60, short: settings.short*60, long: settings.long*60 };
  const LABELS = { focus: 'Focus', short: 'Short Break', long: 'Long Break' };
  const STATUS = { focus: 'In progress', short: 'Breathe', long: 'Recharge' };

  let mode = 'focus';
  let secondsLeft = DURATIONS[mode];
  let running = false;
  let intervalId = null;
  let completedFocusSessions = 0;

  const timeDisplay = document.getElementById('timeDisplay');
  const statusLabel = document.getElementById('statusLabel');
  const ring = document.getElementById('ringProgress');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const startPauseLabel = document.getElementById('startPauseLabel');
  const startIcon = document.getElementById('startIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const resetBtn = document.getElementById('resetBtn');
  const skipBtn = document.getElementById('skipBtn');
  const modeButtons = document.querySelectorAll('.modes button');
  const sessionDots = document.getElementById('sessionDots');
  const eyebrowText = document.getElementById('eyebrowText');
  const footnoteText = document.getElementById('footnoteText');

  const CIRC = 2 * Math.PI * 120;
  ring.style.strokeDasharray = CIRC;

  // ---------- Sound engine (Web Audio API, no external files) ----------
  let audioCtx = null;
  function getCtx(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function tone(freq, startTime, duration, type, gainPeak){
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    const peak = (gainPeak || 0.18) * settings.volume;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function playStart(){
    if(!settings.soundOn) return;
    const t = getCtx().currentTime;
    if(settings.tone === 'beep'){
      tone(880, t, 0.09, 'square', 0.12);
    } else if(settings.tone === 'bell'){
      tone(659.25, t, 0.5, 'sine', 0.15);
      tone(987.77, t, 0.4, 'sine', 0.08);
    } else {
      tone(523.25, t, 0.12, 'sine', 0.16);
      tone(783.99, t + 0.11, 0.16, 'sine', 0.16);
    }
  }

  function playPause(){
    if(!settings.soundOn) return;
    const t = getCtx().currentTime;
    if(settings.tone === 'beep'){
      tone(440, t, 0.09, 'square', 0.1);
    } else if(settings.tone === 'bell'){
      tone(440, t, 0.4, 'sine', 0.12);
    } else {
      tone(392.00, t, 0.14, 'triangle', 0.14);
      tone(293.66, t + 0.09, 0.18, 'triangle', 0.12);
    }
  }

  function playComplete(){
    if(!settings.soundOn) return;
    const t = getCtx().currentTime;
    if(settings.tone === 'beep'){
      tone(880, t, 0.1, 'square', 0.13);
      tone(880, t + 0.16, 0.1, 'square', 0.13);
      tone(880, t + 0.32, 0.16, 'square', 0.13);
    } else if(settings.tone === 'bell'){
      tone(783.99, t, 0.7, 'sine', 0.16);
      tone(1174.66, t + 0.05, 0.6, 'sine', 0.08);
    } else {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => tone(f, t + i*0.14, 0.30, 'sine', 0.17));
    }
  }

  // ---------- Rendering ----------
  function formatTime(s){
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return m + ':' + sec;
  }

  function render(){
    timeDisplay.textContent = formatTime(secondsLeft);
    const total = DURATIONS[mode] || 1;
    const progress = 1 - (secondsLeft / total);
    ring.style.strokeDashoffset = CIRC * (1 - progress);
    statusLabel.textContent = running ? STATUS[mode] : (secondsLeft === DURATIONS[mode] ? 'Ready' : 'Paused');
    eyebrowText.textContent = running ? LABELS[mode] + ' — session in progress' : (secondsLeft === DURATIONS[mode] ? LABELS[mode] + ' — ready when you are' : LABELS[mode] + ' — paused');
    document.title = (running ? formatTime(secondsLeft) + ' · ' : '') + 'Pomodoro Timer';

    modeButtons.forEach(btn => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active);
    });

    startPauseLabel.textContent = running ? 'Pause' : (secondsLeft < DURATIONS[mode] ? 'Resume' : 'Start');
    startIcon.style.display = running ? 'none' : 'block';
    pauseIcon.style.display = running ? 'block' : 'none';

    footnoteText.innerHTML = settings.sessionsBeforeLong + ' focus session' + (settings.sessionsBeforeLong === 1 ? '' : 's') + ' = 1 cycle, then a long break.<br>' +
      (settings.autoStart ? 'Auto-start is on — sessions chain automatically.' : 'Tap the gear icon to customize durations and sound.');

    renderDots();
  }

  function renderDots(){
    sessionDots.innerHTML = '';
    const n = settings.sessionsBeforeLong;
    for(let i=0;i<n;i++){
      const dot = document.createElement('div');
      dot.className = 'session-mark' + (i < (completedFocusSessions % n) ? ' done' : '');
      sessionDots.appendChild(dot);
    }
  }

  // ---------- Timer logic ----------
  function tick(){
    secondsLeft--;
    if(secondsLeft <= 0){
      clearInterval(intervalId);
      intervalId = null;
      running = false;
      playComplete();
      handleSessionComplete();
      return;
    }
    render();
  }

  function handleSessionComplete(){
    if(mode === 'focus'){
      completedFocusSessions++;
      mode = (completedFocusSessions % settings.sessionsBeforeLong === 0) ? 'long' : 'short';
    } else {
      mode = 'focus';
    }
    secondsLeft = DURATIONS[mode];
    render();
    if(settings.autoStart){
      start();
    }
  }

  function start(){
    if(running) return;
    running = true;
    playStart();
    getCtx();
    intervalId = setInterval(tick, 1000);
    render();
  }

  function pause(){
    if(!running) return;
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    playPause();
    render();
  }

  function reset(){
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    secondsLeft = DURATIONS[mode];
    render();
  }

  function switchMode(newMode){
    mode = newMode;
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    secondsLeft = DURATIONS[mode];
    render();
  }

  function skip(){
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    if(mode === 'focus'){
      completedFocusSessions++;
      mode = (completedFocusSessions % settings.sessionsBeforeLong === 0) ? 'long' : 'short';
    } else {
      mode = 'focus';
    }
    secondsLeft = DURATIONS[mode];
    render();
  }

  startPauseBtn.addEventListener('click', () => { running ? pause() : start(); });
  resetBtn.addEventListener('click', reset);
  skipBtn.addEventListener('click', skip);
  modeButtons.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));

  document.addEventListener('keydown', (e) => {
    if(e.code === 'Space' && document.activeElement.tagName !== 'BUTTON' && document.activeElement.tagName !== 'INPUT'){
      e.preventDefault();
      running ? pause() : start();
    }
  });

  // ---------- Settings panel ----------
  const overlay = document.getElementById('overlay');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeSettings = document.getElementById('closeSettings');
  const focusInput = document.getElementById('focusInput');
  const shortInput = document.getElementById('shortInput');
  const longInput = document.getElementById('longInput');
  const sessionsValue = document.getElementById('sessionsValue');
  const sessionsMinus = document.getElementById('sessionsMinus');
  const sessionsPlus = document.getElementById('sessionsPlus');
  const autoStartToggle = document.getElementById('autoStartToggle');
  const soundToggleSwitch = document.getElementById('soundToggleSwitch');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  const soundPickerBtns = document.querySelectorAll('.sound-picker button');
  const applyBtn = document.getElementById('applySettings');
  const restoreBtn = document.getElementById('restoreDefaults');

  let draftSessions = settings.sessionsBeforeLong;
  let draftTone = settings.tone;

  function openPanelFields(){
    focusInput.value = settings.focus;
    shortInput.value = settings.short;
    longInput.value = settings.long;
    draftSessions = settings.sessionsBeforeLong;
    sessionsValue.textContent = draftSessions;
    autoStartToggle.checked = settings.autoStart;
    soundToggleSwitch.checked = settings.soundOn;
    volumeSlider.value = Math.round(settings.volume * 100);
    volumeValue.textContent = Math.round(settings.volume * 100) + '%';
    draftTone = settings.tone;
    soundPickerBtns.forEach(b => b.classList.toggle('active', b.dataset.tone === draftTone));
  }

  function openPanel(){
    openPanelFields();
    overlay.classList.add('open');
    settingsBtn.classList.add('spin');
  }
  function closePanel(){
    overlay.classList.remove('open');
    settingsBtn.classList.remove('spin');
  }

  settingsBtn.addEventListener('click', openPanel);
  closeSettings.addEventListener('click', closePanel);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closePanel(); });
  document.addEventListener('keydown', (e) => { if(e.code === 'Escape' && overlay.classList.contains('open')) closePanel(); });

  sessionsMinus.addEventListener('click', () => {
    draftSessions = Math.max(1, draftSessions - 1);
    sessionsValue.textContent = draftSessions;
  });
  sessionsPlus.addEventListener('click', () => {
    draftSessions = Math.min(12, draftSessions + 1);
    sessionsValue.textContent = draftSessions;
  });

  volumeSlider.addEventListener('input', () => {
    volumeValue.textContent = volumeSlider.value + '%';
  });

  soundPickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      draftTone = btn.dataset.tone;
      soundPickerBtns.forEach(b => b.classList.toggle('active', b === btn));
      settings.tone = draftTone;
      playStart();
    });
  });

  function clampMinutes(val, min, max, fallback){
    const n = parseInt(val, 10);
    if(isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  applyBtn.addEventListener('click', () => {
    const newFocus = clampMinutes(focusInput.value, 1, 180, settings.focus);
    const newShort = clampMinutes(shortInput.value, 1, 60, settings.short);
    const newLong = clampMinutes(longInput.value, 1, 90, settings.long);

    settings.focus = newFocus;
    settings.short = newShort;
    settings.long = newLong;
    settings.sessionsBeforeLong = draftSessions;
    settings.autoStart = autoStartToggle.checked;
    settings.soundOn = soundToggleSwitch.checked;
    settings.volume = parseInt(volumeSlider.value, 10) / 100;
    settings.tone = draftTone;

    DURATIONS = { focus: settings.focus*60, short: settings.short*60, long: settings.long*60 };

    running = false;
    clearInterval(intervalId);
    intervalId = null;
    completedFocusSessions = 0;
    mode = 'focus';
    secondsLeft = DURATIONS[mode];
    render();
    closePanel();
  });

  restoreBtn.addEventListener('click', () => {
    settings = Object.assign({}, DEFAULTS);
    openPanelFields();
  });

  render();
})();
