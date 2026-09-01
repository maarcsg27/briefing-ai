import React, { useState, useEffect } from 'react';
import { UserCheck, Save, Trash2, CheckCircle2, X, Clock, FolderDown, RefreshCw, Monitor, Smartphone, Briefcase, Plus } from 'lucide-react';
import type { ConfigVersion, ScopeDefinition, ScopePreferences } from '../types';
import { storageService } from '../services/storageService';

interface SessionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleScopeIds: string[];
  preferencesMap: Record<string, ScopePreferences>;
  scopes: ScopeDefinition[];
  onApplySession: (session: ConfigVersion) => void;
}

export const SessionSelectorModal: React.FC<SessionSelectorModalProps> = ({
  isOpen,
  onClose,
  visibleScopeIds,
  preferencesMap,
  scopes,
  onApplySession,
}) => {
  const [sessionName, setSessionName] = useState('');
  const [savedSessions, setSavedSessions] = useState<ConfigVersion[]>([]);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);
  const [activeSessionInfo, setActiveSessionInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSavedSessions(storageService.getSessionProfiles());
      setActiveSessionInfo(storageService.getActiveSessionInfo());
      setSessionName('');
      setSuccessFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveNewSession = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sessionName.trim()) return;

    const newSession = storageService.saveSessionProfile(
      sessionName,
      visibleScopeIds,
      preferencesMap,
      scopes
    );

    setSavedSessions(storageService.getSessionProfiles());
    setActiveSessionInfo(storageService.getActiveSessionInfo());
    onApplySession(newSession);
    setSuccessFeedback(`¡Sesión "${newSession.name}" creada e iniciada!`);
    setSessionName('');

    setTimeout(() => {
      setSuccessFeedback(null);
    }, 2500);
  };

  const handleUpdateExistingSession = (sessionId: string, name: string) => {
    const updatedSession = storageService.updateSessionProfile(
      sessionId,
      visibleScopeIds,
      preferencesMap,
      scopes
    );
    if (updatedSession) {
      setSavedSessions(storageService.getSessionProfiles());
      setActiveSessionInfo(storageService.getActiveSessionInfo());
      onApplySession(updatedSession);
      setSuccessFeedback(`¡Sesión "${name}" actualizada con la configuración actual!`);
      setTimeout(() => {
        setSuccessFeedback(null);
      }, 2500);
    }
  };

  const handleDeleteSession = (id: string, name: string) => {
    if (confirm(`¿Eliminar la sesión "${name}"?`)) {
      const updated = storageService.deleteSessionProfile(id);
      setSavedSessions(updated);
      setActiveSessionInfo(storageService.getActiveSessionInfo());
    }
  };

  const handleLoadSession = (session: ConfigVersion) => {
    storageService.loadSessionProfile(session);
    onApplySession(session);
    setActiveSessionInfo(storageService.getActiveSessionInfo());
    setSuccessFeedback(`Iniciada la sesión "${session.name}"`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const getSessionIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('móvil') || n.includes('movil') || n.includes('teléfono') || n.includes('telefono') || n.includes('phone')) {
      return <Smartphone className="w-4 h-4 text-emerald-400" />;
    }
    if (n.includes('trabajo') || n.includes('oficina') || n.includes('empresa') || n.includes('work')) {
      return <Briefcase className="w-4 h-4 text-amber-400" />;
    }
    return <Monitor className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
        
        {/* CABECERA */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Gestor de Sesiones & Perfiles</h3>
              <p className="text-xs text-slate-400">Crea o cambia entre sesiones para tu ordenador, móvil o trabajo.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* FEEDBACK ÉXITO */}
          {successFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successFeedback}</span>
            </div>
          )}

          {/* SESIÓN ACTIVA (SI EXISTE) */}
          {activeSessionInfo && (
            <div className="bg-indigo-950/40 rounded-2xl p-4 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-indigo-950/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sesión Activa Actual</span>
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">{activeSessionInfo.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Guarda los últimos cambios de etiquetas y fuentes en esta sesión.
                </p>
              </div>

              <button
                onClick={() => handleUpdateExistingSession(activeSessionInfo.id, activeSessionInfo.name)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar "{activeSessionInfo.name}"</span>
              </button>
            </div>
          )}

          {/* FORMULARIO CREAR NUEVA SESIÓN */}
          <form onSubmit={handleSaveNewSession} className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Crear Nueva Sesión Personalizada</span>
            </label>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Nombre sesión (ej. Sesión Ordenador, Sesión Teléfono, Trabajo)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!sessionName.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" />
                <span>Crear Sesión</span>
              </button>
            </div>

            {/* PÍLDORAS DE NOMBRES RÁPIDOS */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold">Sugerencias:</span>
              {['Sesión Ordenador', 'Sesión Teléfono', 'Perfil Trabajo', 'Fin de Semana'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSessionName(preset)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </form>

          {/* LISTA DE SESIONES GUARDADAS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sesiones & Perfiles Guardados ({savedSessions.length})</span>
              </span>
            </h4>

            {savedSessions.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-950/40 p-4 rounded-2xl border border-slate-800 text-center">
                Aún no has creado ninguna sesión. Escribe un nombre arriba (ej. "Sesión Ordenador") y pulsa "Crear Sesión".
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedSessions.map((session) => {
                  const isActive = activeSessionInfo?.id === session.id;
                  const dateStr = new Date(session.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={session.id}
                      className={`border rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                        isActive
                          ? 'bg-indigo-950/50 border-indigo-500/50 shadow-md'
                          : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                          {getSessionIcon(session.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">{session.name}</span>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
                                Activa
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">{dateStr} • {session.visibleScopeIds.length} categorías</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        <button
                          onClick={() => handleUpdateExistingSession(session.id, session.name)}
                          className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition flex items-center gap-1"
                          title="Sobrescribir esta sesión con los cambios actuales"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Actualizar</span>
                        </button>
                        <button
                          onClick={() => handleLoadSession(session)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 shadow-md shadow-indigo-600/20"
                        >
                          <FolderDown className="w-3.5 h-3.5" />
                          <span>Entrar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id, session.name)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition"
                          title="Eliminar sesión"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* PIE */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
