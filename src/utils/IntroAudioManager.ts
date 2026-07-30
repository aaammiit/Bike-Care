// Deep Bass Motorcycle Engine Sound Manager for Website Intro
// Supports playing custom audio files (MP3/WAV/etc.), local storage audio persistence,
// 3.0-second start trimming, dynamic engine revs, and fallback synth.

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

  // External Audio File Player
  private audioElement: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private isUsingFileAudio = false;

  private isRunning = false;
  private isMuted = false;
  private currentProgress = 0;
  private trimStartSeconds = 3.0; // Trim starting 3 seconds as requested

  constructor(trimStartSeconds = 3.0) {
    this.trimStartSeconds = trimStartSeconds;
    // Check localStorage for user-uploaded custom bike sound
    try {
      const storedAudio = localStorage.getItem("custom_bike_sound_url");
      if (storedAudio) {
        this.customAudioUrl = storedAudio;
      }
    } catch {}
  }

  public setCustomAudioSource(urlOrDataUri: string): void {
    this.customAudioUrl = urlOrDataUri;
    try {
      localStorage.setItem("custom_bike_sound_url", urlOrDataUri);
    } catch {}
    if (this.isRunning) {
      this.stopAll();
      this.startEngine();
    }
  }

  public removeCustomAudioSource(): void {
    this.customAudioUrl = null;
    try {
      localStorage.removeItem("custom_bike_sound_url");
    } catch {}
    if (this.isRunning) {
      this.stopAll();
      this.startEngine();
    }
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
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);

      this.bassFilter = this.ctx.createBiquadFilter();
      this.bassFilter.type = "lowshelf";
      this.bassFilter.frequency.setValueAtTime(65, this.ctx.currentTime);
      this.bassFilter.gain.setValueAtTime(18, this.ctx.currentTime);

      this.lowpassFilter = this.ctx.createBiquadFilter();
      this.lowpassFilter.type = "lowpass";
      this.lowpassFilter.frequency.setValueAtTime(850, this.ctx.currentTime);

      this.masterGain.connect(this.bassFilter);
      this.bassFilter.connect(this.lowpassFilter);
      this.lowpassFilter.connect(this.ctx.destination);
    }

    return true;
  }

  private stopOscillators(): void {
    try {
      if (this.subOsc) {
        this.subOsc.stop();
        this.subOsc.disconnect();
        this.subOsc = null;
      }
      if (this.mainOsc) {
        this.mainOsc.stop();
        this.mainOsc.disconnect();
        this.mainOsc = null;
      }
      if (this.harmonicOsc) {
        this.harmonicOsc.stop();
        this.harmonicOsc.disconnect();
        this.harmonicOsc = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement = null;
      }
    } catch {
      // ignore cleanup errors
    }
  }

  public stopAll(): void {
    this.stopOscillators();
    this.isRunning = false;
    this.isUsingFileAudio = false;
  }

  public getCustomAudioUrl(): string | null {
    return this.customAudioUrl;
  }

  public isUsingCustomAudio(): boolean {
    return this.isUsingFileAudio;
  }

  public startEngine(): void {
    if (!this.initCtx() || !this.ctx || !this.masterGain) return;

    // Clean up any stale audio nodes prior to starting
    this.stopOscillators();
    this.isRunning = true;

    // Priority 1: Try playing custom audio file if provided or if bike-sound.mp3 exists
    const audioSrc = this.customAudioUrl || "/bike-sound.mp3";

    if (audioSrc) {
      try {
        const audio = new Audio(audioSrc);
        audio.loop = true;
        audio.currentTime = this.trimStartSeconds; // Trim starting 3 seconds
        audio.muted = this.isMuted;
        audio.volume = this.isMuted ? 0 : Math.min(1.0, 0.5 + (this.currentProgress / 100) * 0.5);

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.audioElement = audio;
              this.isUsingFileAudio = true;
            })
            .catch(() => {
              // If custom/local audio file fails or doesn't exist, launch synth engine fallback
              this.startSynthEngine();
            });
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Priority 2: Fallback to high-bass synthesizer engine
    this.startSynthEngine();
  }

  private startSynthEngine(): void {
    if (!this.ctx || !this.masterGain) return;
    this.isUsingFileAudio = false;

    try {
      const now = this.ctx.currentTime;

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

      // Trigger immediate engine acceleration roar
      this.triggerAccelerateRoar();
    } catch {
      // Audio playback restrictions
    }
  }

  // Engine throttle rev & acceleration roar (VROOOOM with heavy bass & accelerator surge)
  public triggerAccelerateRoar(): void {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const revOsc = this.ctx.createOscillator();
      const revGain = this.ctx.createGain();

      revOsc.type = "sawtooth";
      // Frequency ramps up aggressively like pulling a bike throttle
      revOsc.frequency.setValueAtTime(75, now);
      revOsc.frequency.exponentialRampToValueAtTime(390, now + 0.55);
      revOsc.frequency.exponentialRampToValueAtTime(160, now + 1.1);

      // Gain surge reflecting throttle acceleration force
      const currentProgRatio = this.currentProgress / 100;
      const surgeGain = 0.65 + currentProgRatio * 0.35; // gets louder as sequence progresses
      revGain.gain.setValueAtTime(surgeGain, now);
      revGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

      revOsc.connect(revGain);
      revGain.connect(this.masterGain);

      revOsc.start(now);
      revOsc.stop(now + 1.15);
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
      // If using HTMLAudioElement, sync volume so it builds up to maximum loud in last phase
      if (!this.isMuted) {
        this.audioElement.volume = Math.min(1.0, 0.4 + (this.currentProgress / 100) * 0.6);
      }
      return;
    }

    if (!this.ctx || !this.masterGain || !this.lowpassFilter) return;

    try {
      const now = this.ctx.currentTime;

      // Calculate Engine Pitch based on progress (70Hz -> 380Hz loud engine acceleration)
      const p = this.currentProgress / 100;
      const baseFreq = 70 + Math.pow(p, 1.1) * 310;
      const subFreq = baseFreq * 0.5;
      const harmFreq = baseFreq * 0.5;

      // Update frequencies smoothly
      if (this.mainOsc) this.mainOsc.frequency.setTargetAtTime(baseFreq, now, 0.08);
      if (this.subOsc) this.subOsc.frequency.setTargetAtTime(subFreq, now, 0.08);
      if (this.harmonicOsc) this.harmonicOsc.frequency.setTargetAtTime(harmFreq, now, 0.08);

      // Open lowpass filter as motorcycle accelerates (600Hz -> 3600Hz)
      const cutoffFreq = 600 + p * 3000;
      this.lowpassFilter.frequency.setTargetAtTime(cutoffFreq, now, 0.08);

      if (this.noiseGain) {
        this.noiseGain.gain.setTargetAtTime(0.12 + p * 0.25, now, 0.08);
      }

      // VOLUME INCREASES CONTINUOUSLY — LOUDEST IN THE LAST PHASE (75% - 100%):
      if (!this.isMuted) {
        // Volume builds up from 0.38 at start to 0.88 peak loudness at 100%
        const targetVol = 0.38 + p * 0.50;
        this.masterGain.gain.setTargetAtTime(targetVol, now, 0.08);
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
        const targetVol = 0.38 + p * 0.50;
        this.masterGain.gain.setTargetAtTime(Math.max(0.01, targetVol), now, 0.08);
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public isAudioContextRunning(): boolean {
    return !!(this.ctx && this.ctx.state === "running" && this.isRunning);
  }

  public async ensureAudioStarted(): Promise<boolean> {
    if (!this.initCtx() || !this.ctx) return false;

    // Play silent buffer to unlock Web Audio API on iOS and Chrome autoplay policies
    try {
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
    } catch {}

    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        // resume attempt
      }
    }

    if (this.ctx.state === "running") {
      const now = this.ctx.currentTime;
      const p = this.currentProgress / 100;
      const targetVol = this.isMuted ? 0 : (0.38 + p * 0.50);
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(targetVol, now);
      }

      if (!this.isRunning || !this.mainOsc) {
        this.startEngine();
      } else {
        this.triggerAccelerateRoar();
      }
      return true;
    }
    return false;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public destroy(): void {
    this.isRunning = false;

    try {
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
  }
}

