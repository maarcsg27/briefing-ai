import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Sliders, Timer, RefreshCw, UserCheck, Compass } from 'lucide-react';
import type { ScopeDefinition, ScopePreferences } from '../types';

interface HeaderProps {
  onVoiceCommand?: (command: string) => void;
  onOpenConfigurator?: () => void;
  onOpenSaveVersionModal?: () => void;
  onTriggerSync?: () => void;
  statusText?: string;
  isSyncing?: boolean;
  scopes?: ScopeDefinition[];
  preferencesMap?: Record<string, ScopePreferences>;
  visibleScopeIds?: string[];
  activeVersionName?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenConfigurator, 
  onOpenSaveVersionModal,
  onTriggerSync,
  statusText,
  isSyncing = false,
  scopes = [],
  preferencesMap = {},
  visibleScopeIds = [],
  activeVersionName
}) => {
  const [countdown, setCountdown] = useState<string>('--:--:--');
  const [nextUpdateInfo, setNextUpdateInfo] = useState<{ time: string; scopeName: string }>({
    time: '08:30',
    scopeName: 'Noticias',
  });

  const currentDateFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const scheduledUpdates = useMemo(() => {
    const activeScopes = scopes.filter((s) => visibleScopeIds.length === 0 || visibleScopeIds.includes(s.id));
    return activeScopes.map((s) => {
      const prefs = preferencesMap[s.id] || s.defaultPreferences;
      return {
        scopeName: s.name,
        time: prefs.preferredTime || '08:30',
      };
    });
  }, [scopes, visibleScopeIds, preferencesMap]);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      if (scheduledUpdates.length === 0) {
        setCountdown('--:--:--');
        return;
      }

      let minDiffSeconds = Infinity;
      let nextTargetTime = '';
      let nextTargetScope = '';

      scheduledUpdates.forEach((item) => {
        const [h, m] = item.time.split(':').map(Number);
        const targetSeconds = (h || 0) * 3600 + (m || 0) * 60;
        
        let diff = targetSeconds - currentTotalSeconds;
        if (diff <= 0) {
          diff += 24 * 3600;
        }

        if (diff < minDiffSeconds) {
          minDiffSeconds = diff;
          nextTargetTime = item.time;
          nextTargetScope = item.scopeName;
        }
      });

      const hoursLeft = Math.floor(minDiffSeconds / 3600);
      const minutesLeft = Math.floor((minDiffSeconds % 3600) / 60);
      const secondsLeft = minDiffSeconds % 60;

      const pad = (n: number) => n.toString().padStart(2, '0');
      setCountdown(`${pad(hoursLeft)}:${pad(minutesLeft)}:${pad(secondsLeft)}`);
      setNextUpdateInfo({
        time: nextTargetTime,
        scopeName: nextTargetScope,
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [scheduledUpdates]);

  return (
    <header className="border-b border-paper-750 bg-[#0c0f17]/95 backdrop-blur-md sticky top-0 z-30 font-sans">
      {/* Barra de cabecera editorial (Date Masthead) */}
      <div className="border-b border-paper-800 bg-[#080a0f] py-1.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="capitalize font-semibold text-slate-300">{currentDateFormatted}</span>
            <span className="text-slate-600">•</span>
            <span className="hidden md:inline uppercase tracking-widest text-slate-400">Edición Hiper-Personalizada</span>
          </div>

          <div className="flex items-center gap-3">
            {activeVersionName && (
              <button
                onClick={onOpenSaveVersionModal}
                title="Cambiar o gestionar sesión"
                className="hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer font-bold text-emerald-400"
              >
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>Sesión activa: <span className="underline decoration-emerald-500/50">{activeVersionName}</span></span>
              </button>
            )}
            <div title={`Próximo ciclo a las ${nextUpdateInfo.time}h (${nextUpdateInfo.scopeName})`} className="flex items-center gap-1.5 text-slate-400">
              <Timer className="w-3 h-3 text-amber-400" />
              <span>Próxima actualización: <strong className="text-white font-mono">{countdown}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header / Masthead */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Editorial Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif italic font-bold text-2xl tracking-tight text-white leading-none">
                Briefing<span className="text-emerald-400 not-italic">.AI</span>
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/90 px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-950/30">
                Prensa Curada
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Análisis continuo por etiquetas y fuentes verificadas
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {onTriggerSync && (
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              title="Buscar noticias de las últimas 24h"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isSyncing
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 cursor-wait'
                  : 'bg-paper-850 hover:bg-paper-800 text-slate-200 border-paper-750 hover:border-slate-600'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : 'text-emerald-400'}`} />
              <span>{isSyncing ? 'Buscando...' : 'Buscar 24h'}</span>
            </button>
          )}

          {onOpenConfigurator && (
            <button
              onClick={onOpenConfigurator}
              title="Abrir configurador de categorías y fuentes"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configuración</span>
            </button>
          )}

          {onOpenSaveVersionModal && (
            <button
              onClick={onOpenSaveVersionModal}
              title="Gestor de sesiones guardadas"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-paper-850 hover:bg-paper-800 text-indigo-300 border border-indigo-500/30 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sesiones</span>
            </button>
          )}
        </div>
      </div>

      {statusText && (
        <div className="bg-emerald-950/50 border-t border-emerald-800/40 px-4 py-1.5 text-center text-xs text-emerald-300 font-mono flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{statusText}</span>
        </div>
      )}
    </header>
  );
};
