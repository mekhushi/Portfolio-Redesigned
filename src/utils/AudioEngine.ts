export class AudioEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isPlaying = false;

  public start() {
    if (this.isPlaying) return;

    try {
      // Create audio context
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Create gain (volume control)
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      // Soft fade in to prevent clicking sound
      this.gainNode.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2.0);

      // Lowpass filter to create a deep warm sub bass / drone
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(350, this.ctx.currentTime);

      // Oscillator 1 (Warm fundamentals)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = "sine";
      this.osc1.frequency.setValueAtTime(150, this.ctx.currentTime); // Eb3 range, audible on speakers

      // Oscillator 2 (Wobble / detuned voice for chorus effect)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = "triangle";
      this.osc2.frequency.setValueAtTime(150.6, this.ctx.currentTime); // Slight detuning for warmth

      // Connect nodes
      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      // Start oscillators
      this.osc1.start(0);
      this.osc2.start(0);
      this.isPlaying = true;

      // Force resume context if suspended by browser autoplay policies
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Failed to initialize audio engine:", e);
    }
  }

  public stop() {
    if (!this.isPlaying) return;

    if (this.gainNode && this.ctx) {
      const curTime = this.ctx.currentTime;
      // Soft fade out
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, curTime);
      this.gainNode.gain.linearRampToValueAtTime(0, curTime + 0.5);

      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.ctx?.close();
        } catch {
          // ignore already-stopped oscillators or closed context
        }
        this.ctx = null;
        this.osc1 = null;
        this.osc2 = null;
        this.gainNode = null;
        this.filter = null;
        this.isPlaying = false;
      }, 600);
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}
