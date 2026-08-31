import React, { useState } from 'react';
import { X, Tag, Globe, Clock, ShieldCheck, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { ScopeDefinition, ScopePreferences } from '../types';

interface PreferencesModalProps {
  scope: ScopeDefinition;
  initialPreferences: ScopePreferences;
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: ScopePreferences) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  scope,
  initialPreferences,
  isOpen,
  onClose,
  onSave,
}) => {
  const [preferences, setPreferences] = useState<ScopePreferences>({
    ...initialPreferences,
  });
  const [newTag, setNewTag] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTag.trim();
    if (trimmed && !preferences.tags.includes(trimmed)) {
      setPreferences({
        ...preferences,
        tags: [...preferences.tags, trimmed],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPreferences({
      ...preferences,
      tags: preferences.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleToggleSource = (sourceId: string) => {
    setPreferences({
      ...preferences,
      sources: preferences.sources.map((s) =>
        s.id === sourceId ? { ...s, enabled: !s.enabled } : s
      ),
    });
  };

  const handleSave = () => {
    onSave(preferences);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera del modal */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Preferencias de {scope.name}
              </h2>
              <p className="text-xs text-slate-400">
                Personaliza etiquetas prioritarias, país/ciudad y fuentes oficiales.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* SECCIÓN 1: ETIQUETAS DE INTERÉS (Tags) */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <label className="text-sm font-semibold text-slate-200">
                  Etiquetas de Interés Personalizadas
                </label>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                {preferences.tags.length} activas
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Escribe palabras clave o temas específicos (ej. <em>equipos, jugadores, empresas, índices</em>). La app rastreará noticias oficiales que las incluyan.
            </p>

            {/* Input para agregar etiquetas */}
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Escribe una etiqueta (ej. Real Madrid, Mbappé, IBEX 35)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            </form>

            {/* Lista de Chips / Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {preferences.tags.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay etiquetas añadidas todavía.</p>
              ) : (
                preferences.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium group hover:border-emerald-400 transition"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-emerald-400/60 hover:text-rose-400 transition"
                      title="Eliminar etiqueta"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* SECCIÓN 2: ÁMBITO GEOGRÁFICO Y HORA PREFERIDA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Alcance Geográfico */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <label className="text-sm font-semibold text-slate-200">
                  Ámbito Geográfico
                </label>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nivel de cobertura</label>
                <select
                  value={preferences.geographicScope}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      geographicScope: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="local">Local (Ciudad / Región)</option>
                  <option value="nacional">Nacional (País)</option>
                  <option value="continental">Continental (Europa / América)</option>
                  <option value="internacional">Internacional / Global</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">País</label>
                  <input
                    type="text"
                    value={preferences.country}
                    onChange={(e) =>
                      setPreferences({ ...preferences, country: e.target.value })
                    }
                    placeholder="Ej. España"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Ciudad (Opcional)</label>
                  <input
                    type="text"
                    value={preferences.city}
                    onChange={(e) =>
                      setPreferences({ ...preferences, city: e.target.value })
                    }
                    placeholder="Ej. Madrid, Barcelona"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Preferencia de Hora */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <label className="text-sm font-semibold text-slate-200">
                  Preferencia de Hora
                </label>
              </div>
              <p className="text-xs text-slate-400">
                Hora sugerida en la que sueles consultar este ámbito para generar el briefing diario.
              </p>

              <div className="pt-2">
                <input
                  type="time"
                  value={preferences.preferredTime}
                  onChange={(e) =>
                    setPreferences({ ...preferences, preferredTime: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <span className="block text-[11px] text-slate-500 mt-2">
                  La app compila los artículos más recientes antes de esta franja horaria.
                </span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: FUENTES OFICIALES Y ESPECIALIZADAS */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <label className="text-sm font-semibold text-slate-200">
                  Whitelist de Fuentes Oficiales y Especializadas
                </label>
              </div>
              <span className="text-[11px] text-slate-400">
                Solo medios verificados
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Activa o desactiva las cabeceras especializadas autorizadas para buscar en este ámbito.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {preferences.sources.map((source) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => handleToggleSource(source.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition ${
                    source.enabled
                      ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                      {source.name}
                      {source.isOfficial && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                          OFICIAL
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {source.domain}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={source.enabled}
                    onChange={() => {}}
                    className="rounded text-emerald-500 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer con botones de acción */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
          >
            {savedFeedback ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <span>Guardar Preferencias</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
