class SpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private onStateChangeCallback: ((speaking: boolean, paused: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'es-ES';
        this.recognition.interimResults = false;
      }
    }
  }

  public subscribeState(callback: (speaking: boolean, paused: boolean) => void) {
    this.onStateChangeCallback = callback;
  }

  private notifyState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.isSpeaking, this.isPaused);
    }
  }

  public speak(text: string, rate: number = 1.0, onEnd?: () => void) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Buscar una voz nativa en español
    const voices = this.synthesis.getVoices();
    const spanishVoice = voices.find(
      (v) => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Helena') || v.name.includes('Pablo'))
    ) || voices.find((v) => v.lang.startsWith('es'));

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notifyState();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
    };

    this.synthesis.speak(utterance);
  }

  public pause() {
    if (this.synthesis && this.isSpeaking && !this.isPaused) {
      this.synthesis.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  public resume() {
    if (this.synthesis && this.isSpeaking && this.isPaused) {
      this.synthesis.resume();
      this.isPaused = false;
      this.notifyState();
    }
  }

  public stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
    }
  }

  public listenCommand(
    onResult: (command: string) => void,
    onError?: (err: any) => void
  ): { stop: () => void } {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return { stop: () => {} };
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (err: any) => {
      if (onError) onError(err);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }

    return {
      stop: () => {
        try {
          this.recognition.stop();
        } catch (_) {}
      },
    };
  }

  public isSupported(): { tts: boolean; stt: boolean } {
    return {
      tts: typeof window !== 'undefined' && 'speechSynthesis' in window,
      stt: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    };
  }
}

export const speechService = new SpeechService();
