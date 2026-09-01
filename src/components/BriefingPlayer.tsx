import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Headphones, ChevronDown, ChevronUp } from 'lucide-react';
import { speechService } from '../services/speechService';
import type { BriefingResult } from '../types';

interface BriefingPlayerProps {
  briefing: BriefingResult;
  autoPlay?: boolean;
}

export const BriefingPlayer: React.FC<BriefingPlayerProps> = ({
  briefing,
  autoPlay = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(true);

  useEffect(() => {
    speechService.subscribeState((speaking, paused) => {
      setIsPlaying(speaking);
      setIsPaused(paused);
    });

    if (autoPlay && briefing.audioScript) {
      handlePlay();
    }

    return () => {
      speechService.stop();
    };
  }, [briefing.id]);

  const handlePlay = () => {
    speechService.speak(briefing.audioScript, speechRate, () => {
      setIsPlaying(false);
      setIsPaused(false);
    });
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      handlePlay();
    } else if (isPaused) {
      speechService.resume();
    } else {
      speechService.pause();
    }
  };

  const handleStop = () => {
    speechService.stop();
  };

  const handleSpeedChange = () => {
    const nextRate = speechRate === 1.0 ? 1.25 : speechRate === 1.25 ? 1.5 : 1.0;
    setSpeechRate(nextRate);
    if (isPlaying && !isPaused) {
      handlePlay();
    }
  };

  return (
    <div className="bg-paper-900 rounded-xl border border-paper-750 p-5 shadow-lg relative overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Información del Audio Digest */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            {isPlaying && !isPaused ? (
              <div className="flex items-end gap-0.5 h-5">
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-1"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-2"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-3"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-4"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-5"></span>
              </div>
            ) : (
              <Headphones className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400">
                Resumen Sonoro de Prensa
              </span>
              <span className="text-[10px] font-mono text-slate-400">• {briefing.scopeName}</span>
            </div>
            <h4 className="font-serif text-base font-bold text-white tracking-tight leading-none mt-1">
              Locución Ejecutiva de Titulares
            </h4>
          </div>
        </div>

        {/* Controles del Reproductor */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={handleSpeedChange}
            className="px-2.5 py-1.5 rounded text-xs font-mono font-bold bg-paper-800 hover:bg-paper-750 text-slate-300 border border-paper-700 transition"
            title="Cambiar velocidad de reproducción"
          >
            {speechRate}x
          </button>

          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{isPaused ? 'Reanudar' : 'Escuchar Edición'}</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-2 rounded-lg bg-paper-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-paper-700 transition"
              title="Detener lectura"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="p-2 rounded-lg bg-paper-800 hover:bg-paper-750 text-slate-400 hover:text-slate-200 border border-paper-700 transition"
            title={showTranscript ? "Ocultar transcripción" : "Mostrar transcripción"}
          >
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Transcripción del Guión */}
      {showTranscript && briefing.audioScript && (
        <div className="mt-4 pt-3 border-t border-paper-800 text-xs text-slate-300 font-sans leading-relaxed bg-paper-950/50 p-3 rounded-lg border border-paper-800/80">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Transcripción de la Locución:
          </span>
          <p className="italic text-slate-300 font-serif text-sm">
            "{briefing.audioScript}"
          </p>
        </div>
      )}
    </div>
  );
};
