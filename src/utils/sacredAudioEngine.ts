/**
 * Sacred Audio Engine for 3D Ghat Experience
 * Uses Web Audio API for 100% reliable, zero-latency, offline-capable soundscapes:
 * - Flowing Ganga river water ambient currents
 * - Resonant temple brass bell chimes with authentic physical harmonics
 * - Vedic meditative Tanpura / Om harmonic drone
 */

class SacredAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.55;
  private masterGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private bellIntervalId: any = null;
  private waterNoiseNode: AudioNode | null = null;
  private droneOscillators: OscillatorNode[] = [];

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  public async start() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume notice:', e);
      }
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // 1. Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // 2. Ganga River Water Currents Generator (Pink Noise filtered with LPF)
    this.startWaterSound();

    // 3. Meditative Sacred Tanpura / Om Drone
    this.startVedicDrone();

    // 4. Periodic Resonant Temple Bell Chimes (Every 12 to 18 seconds)
    this.playTempleBell();
    this.bellIntervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playTempleBell();
      }
    }, 14000);
  }

  public stop() {
    this.isPlaying = false;
    if (this.bellIntervalId) {
      clearInterval(this.bellIntervalId);
      this.bellIntervalId = null;
    }

    if (this.waterNoiseNode) {
      try {
        (this.waterNoiseNode as any).stop?.();
        this.waterNoiseNode.disconnect();
      } catch {}
      this.waterNoiseNode = null;
    }

    this.droneOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.droneOscillators = [];

    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  // Realistic Ganga Water Stream Synthesis
  private startWaterSound() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate Pink/Brown noise for soothing river waves
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

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter simulating water depths
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.waterGain);
    this.waterGain.connect(this.masterGain);

    whiteNoise.start();
    this.waterNoiseNode = whiteNoise;
  }

  // Sacred Vedic Tanpura / Om Drone (D note ~ 146.83 Hz)
  private startVedicDrone() {
    if (!this.ctx || !this.masterGain) return;

    const baseFreq = 146.83; // D3 note
    const harmonics = [1, 1.5, 2]; // Fundamental, Fifth (A3), Octave (D4)

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    this.droneOscillators = harmonics.map((h, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * h + (idx === 1 ? 0.3 : 0), this.ctx!.currentTime);
      osc.connect(this.droneGain!);
      osc.start();
      return osc;
    });
  }

  // Authentically synthesized Indian Temple Brass Bell chime
  public playTempleBell() {
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    const bellFrequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 harmonics

    bellFrequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Strike and long natural acoustic decay
      const initialVol = (0.18 / (i + 1)) * 0.6;
      gain.gain.setValueAtTime(initialVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 4.6);
    });
  }

  // Vedic Shloka Divine Chime (plays upon performing Arghya)
  public playArghyaChime() {
    if (!this.ctx) this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const dest = this.masterGain || this.ctx.destination;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 (Divine Major chord)

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.2);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 3.3);
    });
  }
}

export const sacredAudio = new SacredAudioEngine();
