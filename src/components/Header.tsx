import React, { useState, useEffect, useMemo } from 'react';
import { Mic, MicOff, Radio, Sparkles, Sliders, Timer, RefreshCw, Bookmark } from 'lucide-react';
import { speechService } from '../services/speechService';
import type { ScopeDefinition, ScopePreferences } from '../types';

interface HeaderProps {
  onVoiceCommand: (command: string) => void;
  onOpenConfigurator?: () => void;
  onOpenSaveVersionModal?: () => void;
  onTriggerSync?: () => void;
  statusText?: string;
  isSyncing?: boolean;
  scopes?: ScopeDefinition[];
  preferencesMap?: Record<string, ScopePreferences>;
  visibleScopeIds?: string[];
}

export const Header: React.FC<HeaderProps> = ({ 
  onVoiceCommand, 
  onOpenConfigurator, 
  onOpenSaveVersionModal,
  onTriggerSync,
  statusText,
  isSyncing = false,
  scopes = [],
  preferencesMap = {},
  visibleScopeIds = []
}) => {
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechInfo, setActiveSpeechInfo] = useState<string>('');
  
  // Estado del contador regresivo y reloj
  const [countdown, setCountdown] = useState<string>('--:--:--');
  const [nextUpdateInfo, setNextUpdateInfo] = useState<{ time: string; scopeName: string }>({
    time: '08:30',
    scopeName: 'Noticias',
  });

  // Calcular la lista de horas preferidas de las categorías visibles en la web
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

  // Actualizar la cuenta atrás cada segundo hacia la siguiente hora de actualización más próxima
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

      // Buscar la actualización más próxima en el día o para mañana
      let minDiffSeconds = Infinity;
      let nextTargetTime = '';
      let nextTargetScope = '';

      scheduledUpdates.forEach((item) => {
        const [h, m] = item.time.split(':').map(Number);
        const targetSeconds = (h || 0) * 3600 + (m || 0) * 60;
        
        let diff = targetSeconds - currentTotalSeconds;
        // Si la hora ya pasó hoy, se programa para mañana (+24h)
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

  const handleToggleListen = () => {
    if (isListening) {
      speechService.stop();
      setIsListening(false);
      setActiveSpeechInfo('');
    } else {
      setIsListening(true);
      setActiveSpeechInfo('Escuchando... Di: "Actualización de Fútbol" o "Finanzas"');
      
      const { stop } = speechService.listenCommand(
        (transcript) => {
          setIsListening(false);
          setActiveSpeechInfo(`Comando detectado: "${transcript}"`);
          onVoiceCommand(transcript);
        },
        (err) => {
          setIsListening(false);
          setActiveSpeechInfo('No se pudo acceder al micrófono o no hubo respuesta.');
          console.warn(err);
        }
      );

      // Auto timeout de 8 segundos si no habla
      setTimeout(() => {
        setIsListening((prev) => {
          if (prev) {
            stop();
            setActiveSpeechInfo('');
            return false;
          }
          return prev;
        });
      }, 8000);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Radio className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Briefing<span className="text-emerald-400">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Oficial & Curado
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Asistente de noticias por voz con seguimiento de etiquetas
            </p>
          </div>
        </div>

        {/* Cuenta Atrás y Acciones de Voz adaptadas a Móvil / Tablet / Desktop */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          
          {/* Reloj con Cuenta Atrás hasta la siguiente hora de actualización */}
          <div 
            title={`Próxima actualización a las ${nextUpdateInfo.time} h (${nextUpdateInfo.scopeName})`}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 shadow-inner group transition text-left"
          >
            <div className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-emerald-300 transition">
                Próxima:
              </span>
            </div>
            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-300 tracking-wider">
              {countdown}
            </span>
            <span className="text-[10px] text-slate-400 font-medium pl-1 border-l border-slate-700/60 hidden lg:inline">
              {nextUpdateInfo.time}h ({nextUpdateInfo.scopeName})
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botón de Sincronización / Búsqueda Exhaustiva 24h */}
            {onTriggerSync && (
              <button
                onClick={onTriggerSync}
                disabled={isSyncing}
                title="Ejecutar búsqueda exhaustiva de las últimas 24h ahora"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition shadow-sm ${
                  isSyncing
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse cursor-wait'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : 'text-emerald-400'}`} />
                <span className="hidden md:inline">{isSyncing ? 'Buscando...' : 'Buscar 24h'}</span>
              </button>
            )}

            {/* Botón de Configurador General */}
            {onOpenConfigurator && (
              <button
                onClick={onOpenConfigurator}
                title="Abrir configurador de categorías y preferencias"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span className="inline">Configurador</span>
              </button>
            )}

            {/* Botón de Guardar Versión / Perfil */}
            {onOpenSaveVersionModal && (
              <button
                onClick={onOpenSaveVersionModal}
                title="Guardar o cargar versiones de configuración"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span className="inline">Versiones</span>
              </button>
            )}

            {/* Botón de Comando por Voz */}
            <button
              onClick={handleToggleListen}
              title="Pedir actualización por voz"
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30 ring-2 ring-rose-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Escuchando...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Hablar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Banner de estado o comando por voz si está activo */}
      {(activeSpeechInfo || statusText) && (
        <div className="bg-emerald-950/40 border-t border-emerald-800/40 px-4 py-1.5 text-center text-xs text-emerald-300 flex items-center justify-center gap-2 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{activeSpeechInfo || statusText}</span>
        </div>
      )}
    </header>
  );
};
