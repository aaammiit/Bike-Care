// Deep Bass Motorcycle Engine Sound Synthesizer & Audio Manager for Website Intro
// Features starting 3-second trim support, sub-bass booster, dynamic engine revs, and progress-based volume fading

export class IntroAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;

  // Synthesizer Oscillators
  private subOsc: OscillatorNode | null = null;
  private mainOsc: OscillatorNode | null = null;
  private harmonicOsc: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

  // External Audio Buffer Source
  private audioBufferSource: AudioBufferSourceNode | null = null;
  private audioElement: HTMLAudioElement | null = null;

  private isRunning = false;
  private isMuted = false;
  private currentProgress = 0;
  private trimStartSeconds = 3.0; // Automatically trim starting 3 seconds as requested!

  constructor(trimStartSeconds = 3.0) {
    this.trimStartSeconds = trimStartSeconds;
  }

  private initCtx(): boolean {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    if (!this.masterGain && this.ctx) {
      // Master Gain for smooth volume control & fading - set to high clear volume
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.55, this.ctx.currentTime);

      // Deep Sub-Bass Booster (Low Shelf Filter at 65Hz with +18dB massive bass boost)
      this.bassFilter = this.ctx.createBiquadFilter();
      this.bassFilter.type = "lowshelf";
      this.bassFilter.frequency.setValueAtTime(65, this.ctx.currentTime);
      this.bassFilter.gain.setValueAtTime(18, this.ctx.currentTime); // +18dB Heavy Sub-Bass!

      // Lowpass Filter for realistic mechanical exhaust resonance
      this.lowpassFilter = this.ctx.createBiquadFilter();
      this.lowpassFilter.type = "lowpass";
      this.lowpassFilter.frequency.setValueAtTime(850, this.ctx.currentTime);

      // Connect Chain
      this.masterGain.connect(this.bassFilter);
      this.bassFilter.connect(this.lowpassFilter);
      this.lowpassFilter.connect(this.ctx.destination);
    }

    return true;
  }

  // Load and play an external audio file/URL starting strictly AFTER trimming 3 seconds
  public async playAudioUrl(url: string, trimSeconds = 3.0): Promise<void> {
    this.trimStartSeconds = trimSeconds;
    if (!this.initCtx() || !this.ctx || !this.masterGain) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      if (this.audioBufferSource) {
        try { this.audioBufferSource.stop(); } catch {}
      }

      this.audioBufferSource = this.ctx.createBufferSource();
      this.audioBufferSource.buffer = decodedBuffer;
      this.audioBufferSource.connect(this.masterGain);

      const now = this.ctx.currentTime;
      // TRIM STARTING 3 SECONDS: play starting from trimSeconds (3.0s offset)
      const offset = Math.min(trimSeconds, decodedBuffer.duration - 0.5);
      this.audioBufferSource.start(now, offset);
      this.isRunning = true;
    } catch {
      // Fallback to high-bass synthesized engine if fetch fails or CORS blocks
      this.startEngine();
    }
  }

  // Play audio element with starting 3 seconds removed
  public attachAudioElement(elem: HTMLAudioElement, trimSeconds = 3.0): void {
    this.trimStartSeconds = trimSeconds;
    this.audioElement = elem;
    if (this.audioElement) {
      this.audioElement.currentTime = trimSeconds; // Skip first 3 seconds
      if (!this.isMuted) {
        this.audioElement.play().catch(() => {});
      }
      this.isRunning = true;
    }
  }

  public startEngine(): void {
    if (this.isRunning) return;
    if (!this.initCtx() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      this.isRunning = true;

      // 1. Sub-Bass Sine Oscillator (32Hz - deep, heavy exhaust vibration)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = "sine";
      this.subOsc.frequency.setValueAtTime(32, now);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.75, now);
      this.subOsc.connect(subGain);
      subGain.connect(this.masterGain);

      // 2. Main Cylinder Sawtooth Oscillator (Aggressive bike engine rumble)
      this.mainOsc = this.ctx.createOscillator();
      this.mainOsc.type = "sawtooth";
      this.mainOsc.frequency.setValueAtTime(70, now);

      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.55, now);
      this.mainOsc.connect(mainGain);
      mainGain.connect(this.masterGain);

      // 3. Harmonic Pulse Square Oscillator (Engine stroke rhythm)
      this.harmonicOsc = this.ctx.createOscillator();
      this.harmonicOsc.type = "square";
      this.harmonicOsc.frequency.setValueAtTime(35, now);

      const harmGain = this.ctx.createGain();
      harmGain.gain.setValueAtTime(0.35, now);
      this.harmonicOsc.connect(harmGain);
      harmGain.connect(this.masterGain);

      // 4. Exhaust Air/Noise Generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.12, now);

      this.noiseNode.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      // Start all sound generators
      this.subOsc.start(now);
      this.mainOsc.start(now);
      this.harmonicOsc.start(now);
      this.noiseNode.start(now);

      // Trigger immediate engine acceleration roar (bypassing initial 3s delay)
      this.triggerAccelerateRoar();
    } catch {
      // Audio playback restrictions
    }
  }

  // Engine throttle rev & acceleration roar (VROOOOM with heavy bass)
  public triggerAccelerateRoar(): void {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const revOsc = this.ctx.createOscillator();
      const revGain = this.ctx.createGain();

      revOsc.type = "sawtooth";
      revOsc.frequency.setValueAtTime(65, now);
      revOsc.frequency.exponentialRampToValueAtTime(320, now + 0.45);
      revOsc.frequency.exponentialRampToValueAtTime(140, now + 0.9);

      revGain.gain.setValueAtTime(0.7, now);
      revGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      revOsc.connect(revGain);
      revGain.connect(this.masterGain);

      revOsc.start(now);
      revOsc.stop(now + 0.95);
    } catch {
      // Fallback
    }
  }

  // Dynamically update audio parameters & fade volume based on animation progress (0% - 100%)
  public updateProgress(progress: number): void {
    this.currentProgress = Math.max(0, Math.min(100, progress));

    if (!this.isRunning) {
      if (this.currentProgress > 0) {
        this.startEngine();
      } else {
        return;
      }
    }

    if (this.audioElement) {
      // If using HTMLAudioElement, sync volume fade
      if (!this.isMuted) {
        if (this.currentProgress >= 75) {
          const fadeRatio = (100 - this.currentProgress) / 25; // 1 -> 0
          this.audioElement.volume = Math.max(0, fadeRatio * 0.95);
        } else {
          this.audioElement.volume = 0.95;
        }
      }
      return;
    }

    if (!this.ctx || !this.masterGain || !this.lowpassFilter) return;

    try {
      const now = this.ctx.currentTime;

      // Calculate Engine Pitch based on progress (70Hz -> 340Hz loud acceleration)
      const p = this.currentProgress / 100;
      const baseFreq = 70 + Math.pow(p, 1.2) * 270;
      const subFreq = baseFreq * 0.5;
      const harmFreq = baseFreq * 0.5;

      // Update frequencies smoothly
      if (this.mainOsc) this.mainOsc.frequency.setTargetAtTime(baseFreq, now, 0.08);
      if (this.subOsc) this.subOsc.frequency.setTargetAtTime(subFreq, now, 0.08);
      if (this.harmonicOsc) this.harmonicOsc.frequency.setTargetAtTime(harmFreq, now, 0.08);

      // Open lowpass filter as motorcycle accelerates (600Hz -> 3200Hz)
      const cutoffFreq = 600 + p * 2600;
      this.lowpassFilter.frequency.setTargetAtTime(cutoffFreq, now, 0.08);

      if (this.noiseGain) {
        this.noiseGain.gain.setTargetAtTime(0.12 + p * 0.18, now, 0.08);
      }

      // AUTOMATIC VOLUME FADING BASED ON ANIMATION PROGRESS:
      // 0% - 75%: High power volume (0.60 with +18dB bass boost)
      // 75% - 100%: Smooth fade down to 0 so intro finishes cleanly
      if (!this.isMuted) {
        if (this.currentProgress < 75) {
          const targetVol = Math.min(0.65, 0.3 + p * 0.35);
          this.masterGain.gain.setTargetAtTime(targetVol, now, 0.08);
        } else {
          // Fade out during last 25% of progress
          const fadeRatio = (100 - this.currentProgress) / 25; // 1 -> 0
          const fadeVol = 0.65 * Math.max(0, fadeRatio);
          this.masterGain.gain.setTargetAtTime(fadeVol, now, 0.12);
        }
      }
    } catch {
      // Audio update catch
    }
  }

  // Smoothly fade out and stop all audio over a specified duration
  public fadeAndStop(durationMs = 400): void {
    if (this.audioElement) {
      try {
        const initialVol = this.audioElement.volume;
        const steps = 10;
        const intervalTime = durationMs / steps;
        let currentStep = 0;
        const fadeInterval = setInterval(() => {
          currentStep++;
          if (this.audioElement) {
            this.audioElement.volume = Math.max(0, initialVol * (1 - currentStep / steps));
          }
          if (currentStep >= steps) {
            clearInterval(fadeInterval);
            if (this.audioElement) {
              this.audioElement.pause();
            }
            this.destroy();
          }
        }, intervalTime);
      } catch {
        this.destroy();
      }
      return;
    }

    if (!this.isRunning || !this.ctx || !this.masterGain) {
      this.destroy();
      return;
    }

    try {
      const now = this.ctx.currentTime;
      const fadeSec = durationMs / 1000;

      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeSec);

      setTimeout(() => {
        this.destroy();
      }, durationMs + 50);
    } catch {
      this.destroy();
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      if (this.isMuted) {
        this.masterGain.gain.setTargetAtTime(0, now, 0.05);
      } else {
        const p = this.currentProgress / 100;
        const targetVol = p >= 0.75 ? 0.38 * ((100 - this.currentProgress) / 25) : 0.38;
        this.masterGain.gain.setTargetAtTime(Math.max(0.01, targetVol), now, 0.08);
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public destroy(): void {
    this.isRunning = false;

    try {
      if (this.audioBufferSource) {
        this.audioBufferSource.stop();
        this.audioBufferSource.disconnect();
      }
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement = null;
      }
      if (this.subOsc) {
        this.subOsc.stop();
        this.subOsc.disconnect();
      }
      if (this.mainOsc) {
        this.mainOsc.stop();
        this.mainOsc.disconnect();
      }
      if (this.harmonicOsc) {
        this.harmonicOsc.stop();
        this.harmonicOsc.disconnect();
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      }
      if (this.ctx && this.ctx.state !== "closed") {
        this.ctx.close().catch(() => {});
      }
    } catch {
      // Cleanup catch
    }

    this.ctx = null;
    this.masterGain = null;
    this.bassFilter = null;
    this.lowpassFilter = null;
    this.subOsc = null;
    this.mainOsc = null;
    this.harmonicOsc = null;
    this.noiseNode = null;
    this.noiseGain = null;
    this.audioBufferSource = null;
  }
}

