import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward } from 'lucide-react';
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

  useEffect(() => {
    // Suscribirse a los cambios de estado de la voz
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
      // Reiniciar con la nueva velocidad
      handlePlay();
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/80 p-5 shadow-xl relative overflow-hidden">
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Información del Locutor y Ámbito */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              {isPlaying && !isPaused ? (
                <div className="flex items-end gap-0.5 h-6">
                  <span className="w-1 bg-emerald-400 rounded-full animate-wave-1"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-wave-2"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-wave-3"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-wave-4"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-wave-5"></span>
                </div>
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </div>
            {isPlaying && !isPaused && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Locución en Vivo
              </span>
              <span className="text-[11px] text-slate-500 font-mono">• {briefing.timestamp}</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Repaso oficial de {briefing.scopeName}
            </h4>
            <p className="text-xs text-slate-400">
              {isPlaying && !isPaused
                ? 'Transmitiendo el resumen por voz...'
                : isPaused
                ? 'Locución en pausa'
                : 'Listo para reproducir'}
            </p>
          </div>
        </div>

        {/* Controles del Reproductor */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          
          {/* Selector de velocidad */}
          <button
            onClick={handleSpeedChange}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold border border-slate-700 transition flex items-center gap-1"
            title="Cambiar velocidad de locución"
          >
            <FastForward className="w-3.5 h-3.5 text-emerald-400" />
            <span>{speechRate}x</span>
          </button>

          {/* Reiniciar */}
          <button
            onClick={handlePlay}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Reiniciar audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Parar */}
          <button
            onClick={handleStop}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Detener audio"
          >
            <VolumeX className="w-4 h-4" />
          </button>

          {/* Play / Pausa Principal */}
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition"
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Escuchar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Guion de locución transcrito */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-950/40 p-3.5 rounded-xl">
        <p className="text-xs text-slate-300 italic leading-relaxed">
          &ldquo;{briefing.audioScript}&rdquo;
        </p>
      </div>

    </div>
  );
};
