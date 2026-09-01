import React, { useState, useEffect } from 'react';
import { Bookmark, Save, Trash2, CheckCircle2, X, Clock, Layers, FolderDown, RefreshCw } from 'lucide-react';
import type { ConfigVersion, ScopeDefinition, ScopePreferences } from '../types';
import { storageService } from '../services/storageService';

interface SaveVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleScopeIds: string[];
  preferencesMap: Record<string, ScopePreferences>;
  scopes: ScopeDefinition[];
  onApplyVersion: (version: ConfigVersion) => void;
}

export const SaveVersionModal: React.FC<SaveVersionModalProps> = ({
  isOpen,
  onClose,
  visibleScopeIds,
  preferencesMap,
  scopes,
  onApplyVersion,
}) => {
  const [versionName, setVersionName] = useState('');
  const [savedVersions, setSavedVersions] = useState<ConfigVersion[]>([]);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);
  const [activeVersionInfo, setActiveVersionInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSavedVersions(storageService.getConfigVersions());
      setActiveVersionInfo(storageService.getActiveVersionInfo());
      setVersionName('');
      setSuccessFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionName.trim()) return;

    const newVer = storageService.saveConfigVersion(
      versionName,
      visibleScopeIds,
      preferencesMap,
      scopes
    );

    setSavedVersions(storageService.getConfigVersions());
    setActiveVersionInfo(storageService.getActiveVersionInfo());
    setSuccessFeedback(`¡Versión "${newVer.name}" guardada correctamente!`);
    setVersionName('');

    setTimeout(() => {
      setSuccessFeedback(null);
    }, 2500);
  };

  const handleUpdateExistingVersion = (versionId: string, name: string) => {
    const updatedVer = storageService.updateConfigVersion(
      versionId,
      visibleScopeIds,
      preferencesMap,
      scopes
    );
    if (updatedVer) {
      setSavedVersions(storageService.getConfigVersions());
      setActiveVersionInfo(storageService.getActiveVersionInfo());
      onApplyVersion(updatedVer);
      setSuccessFeedback(`¡Versión "${name}" actualizada con la configuración actual!`);
      setTimeout(() => {
        setSuccessFeedback(null);
      }, 2500);
    }
  };

  const handleDeleteVersion = (id: string, name: string) => {
    if (confirm(`¿Eliminar la versión guardada "${name}"?`)) {
      const updated = storageService.deleteConfigVersion(id);
      setSavedVersions(updated);
      setActiveVersionInfo(storageService.getActiveVersionInfo());
    }
  };

  const handleLoadVersion = (ver: ConfigVersion) => {
    storageService.loadConfigVersion(ver);
    onApplyVersion(ver);
    setActiveVersionInfo(storageService.getActiveVersionInfo());
    setSuccessFeedback(`Cargada la versión "${ver.name}"`);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
        
        {/* CABECERA */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Guardar / Cargar Preferencias</h3>
              <p className="text-xs text-slate-400">Guarda la configuración completa de la web con un nombre de versión.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* FEEDBACK ÉXITO */}
          {successFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successFeedback}</span>
            </div>
          )}

          {/* TARJETA DE VERSIÓN ACTIVA (SI EXISTE) */}
          {activeVersionInfo && (
            <div className="bg-indigo-950/40 rounded-2xl p-4 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-indigo-950/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1">
                  <Bookmark className="w-3 h-3" />
                  <span>Perfil de Versión Activo</span>
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">{activeVersionInfo.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sobrescribe esta versión con los cambios de etiquetas, categorías y fuentes actuales.
                </p>
              </div>

              <button
                onClick={() => handleUpdateExistingVersion(activeVersionInfo.id, activeVersionInfo.name)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar "{activeVersionInfo.name}"</span>
              </button>
            </div>
          )}

          {/* FORMULARIO GUARDAR NUEVA VERSIÓN */}
          <form onSubmit={handleSaveVersion} className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guardar Configuración Actual como Nueva Versión</span>
            </label>

            <div className="text-xs text-slate-400 space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>{visibleScopeIds.length} de {scopes.length} categorías activas en la web</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Se guardarán tus etiquetas, fuentes seleccionadas, número límite de noticias y orden.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="Nombre versión (ej. Perfil Trabajo, Fin de Semana, Tech)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!versionName.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            </div>
          </form>

          {/* LISTA DE VERSIONES GUARDADAS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Versiones & Perfiles Guardados ({savedVersions.length})</span>
              </span>
            </h4>

            {savedVersions.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-950/40 p-4 rounded-2xl border border-slate-800 text-center">
                Aún no has guardado ninguna versión. Asigna un nombre arriba y pulsa "Guardar" para crear tu primera configuración.
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedVersions.map((ver) => {
                  const isActive = activeVersionInfo?.id === ver.id;
                  const dateStr = new Date(ver.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={ver.id}
                      className={`border rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                        isActive
                          ? 'bg-indigo-950/50 border-indigo-500/50 shadow-md'
                          : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">{ver.name}</span>
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
                              Activa
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono shrink-0">
                            {ver.visibleScopeIds.length} cat.
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">{dateStr}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        <button
                          onClick={() => handleUpdateExistingVersion(ver.id, ver.name)}
                          className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition flex items-center gap-1"
                          title="Sobrescribir esta versión con la configuración actual"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Actualizar</span>
                        </button>
                        <button
                          onClick={() => handleLoadVersion(ver)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 shadow-md shadow-indigo-600/20"
                        >
                          <FolderDown className="w-3.5 h-3.5" />
                          <span>Cargar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVersion(ver.id, ver.name)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition"
                          title="Eliminar versión"
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
