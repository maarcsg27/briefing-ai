import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Radio, Clock, Sparkles } from 'lucide-react';
import { speechService } from '../services/speechService';

interface HeaderProps {
  onVoiceCommand: (command: string) => void;
  statusText?: string;
}

export const Header: React.FC<HeaderProps> = ({ onVoiceCommand, statusText }) => {
  const [isListening, setIsListening] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeSpeechInfo, setActiveSpeechInfo] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

        {/* Reloj y Acciones de Voz */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">{currentTime}</span>
          </div>

          {/* Botón de Comando por Voz */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleListen}
              title="Pedir actualización por voz"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30 ring-2 ring-rose-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Escuchando...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Hablar al Asistente</span>
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
