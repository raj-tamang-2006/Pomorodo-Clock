import { SoundPreset, AmbientSoundType } from '../types';

let audioCtx: AudioContext | null = null;

// Ensure audio context is created or resumed on user gesture
export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Sound Effect: START ALERT
 * Warm ascending chime or soft crisp double tone signaling session start
 */
export function playStartSound(volume = 0.8, preset: SoundPreset = 'zen') {
  if (volume <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.5, now);
    masterGain.connect(ctx.destination);

    if (preset === 'zen') {
      // Warm gong/chime
      const freqs = [392.00, 523.25]; // G4 -> C5
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.4, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.85);
      });
    } else if (preset === 'digital') {
      // Digital double beep ascending
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.15, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (preset === 'marimba') {
      // Warm woody marimba hit
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    } else {
      // Soft Pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.42);
    }
  } catch (e) {
    console.error('Error playing start sound:', e);
  }
}

/**
 * Sound Effect: PAUSE ALERT
 * Muted low-tone click or descending tone signaling timer paused
 */
export function playPauseSound(volume = 0.8, preset: SoundPreset = 'zen') {
  if (volume <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.5, now);
    masterGain.connect(ctx.destination);

    if (preset === 'zen') {
      // Muted soft wooden block tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.exponentialRampToValueAtTime(196.00, now + 0.1); // G3

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (preset === 'digital') {
      // Digital low single blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(349.23, now); // F4

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (preset === 'marimba') {
      // Low marimba tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.63, now); // C4

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.22);
    } else {
      // Soft Pulse pause
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    }
  } catch (e) {
    console.error('Error playing pause sound:', e);
  }
}

/**
 * Sound Effect: COMPLETION ALERT
 * Rich multi-tone celebratory chord / Tibetan singing bell / bright chime
 */
export function playCompletionSound(volume = 0.8, preset: SoundPreset = 'zen') {
  if (volume <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.6, now);
    masterGain.connect(ctx.destination);

    if (preset === 'zen') {
      // Tibetan singing bowl / C major triad resonance (C5 - E5 - G5 - C6)
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.5);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.6);
      });
    } else if (preset === 'digital') {
      // Retro triumph arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.2, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.45);
      });
    } else if (preset === 'marimba') {
      // Warm marimba arpeggio chord
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.4, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 1.2);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 1.3);
      });
    } else {
      // Soft Pulse success swell
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.85);
    }
  } catch (e) {
    console.error('Error playing completion sound:', e);
  }
}

// Ambient Noise Generator
let ambientNoiseNode: AudioNode | null = null;
let ambientGainNode: GainNode | null = null;

export function stopAmbientSound() {
  if (ambientGainNode && audioCtx) {
    ambientGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      if (ambientNoiseNode) {
        ambientNoiseNode.disconnect();
        ambientNoiseNode = null;
      }
      ambientGainNode = null;
    }, 550);
  }
}

export function startAmbientSound(type: AmbientSoundType, volume = 0.2) {
  stopAmbientSound();
  if (type === 'none' || volume <= 0) return;

  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    if (type === 'pinkNoise') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }
    } else if (type === 'brownNoise') {
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 1.8;
      }
    } else if (type === 'focusDrone') {
      // Warm low drone frequency
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        output[i] = (Math.sin(2 * Math.PI * 110 * t) + 0.5 * Math.sin(2 * Math.PI * 165 * t)) * 0.1;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + 1.0);

    // Filter to make it smooth & relaxing
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'brownNoise' ? 400 : 800, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    ambientNoiseNode = whiteNoise;
    ambientGainNode = gainNode;
  } catch (e) {
    console.error('Error starting ambient noise:', e);
  }
}

export function updateAmbientVolume(volume: number) {
  if (ambientGainNode && audioCtx) {
    ambientGainNode.gain.linearRampToValueAtTime(volume * 0.15, audioCtx.currentTime + 0.1);
  }
}
