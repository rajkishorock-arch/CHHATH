// Devotional Audio Utility - Procedural Web Audio Engine
// All audio strictly requires user gesture/trigger (Zero intrusive autoplay)

class DevotionalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Active ambient sources
  private riverNode: AudioNode | null = null;
  private riverGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(console.error);
    }
  }

  // 1. Crisp Sacred Temple Bell (घंटी)
  public ringTempleBell(frequency: number = 587.33) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2.76, now);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 3.4);
      osc2.stop(now + 2.2);
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Sacred Shankh / Conch Resonant Call (शंखनाद)
  public blowShankh() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(325, now + 2.5);
      osc.frequency.exponentialRampToValueAtTime(220, now + 3.5);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.6);
      gain.gain.setValueAtTime(0.4, now + 2.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.7);
    } catch (e) {
      console.error(e);
    }
  }

  // 3. Gentle Procedural River Waves (गंगा जी की लहरें)
  public startRiverWaves(volume: number = 0.3) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      if (this.riverNode) return; // already playing

      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.02;
        b2 = 0.85 * b2 + white * 0.01;
        output[i] = (b0 + b1 + b2) * 0.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.riverGain = this.ctx.createGain();
      this.riverGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.riverGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 2.0);

      whiteNoise.connect(filter);
      filter.connect(this.riverGain);
      this.riverGain.connect(this.masterGain);

      whiteNoise.start();
      this.riverNode = whiteNoise;
    } catch (e) {
      console.error(e);
    }
  }

  public stopRiverWaves() {
    if (this.riverGain && this.ctx) {
      this.riverGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.0);
      setTimeout(() => {
        if (this.riverNode) {
          try {
            (this.riverNode as AudioBufferSourceNode).stop();
            this.riverNode.disconnect();
          } catch {}
          this.riverNode = null;
        }
      }, 1100);
    }
  }

  public isRiverPlaying(): boolean {
    return this.riverNode !== null;
  }

  // 4. Kitchen / Cooking Timer Alert Chime
  public playCookingTimerAlert() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.3, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 0.8);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.9);
      });
    } catch (e) {
      console.error(e);
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }
}

export const devotionalAudio = new DevotionalAudioEngine();
