import React, { useState, useEffect } from 'react';
import { 
  X, 
  Tag, 
  Globe, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FolderPlus,
  Sliders
} from 'lucide-react';
import type { ScopeDefinition, ScopePreferences } from '../types';

interface ConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scopes: ScopeDefinition[];
  selectedScopeId: string | null;
  onSelectScopeId: (id: string) => void;
  onSavePreferences: (prefs: ScopePreferences, updatedScope?: ScopeDefinition) => void;
  onCreateScope: (newScope: ScopeDefinition) => void;
  onDeleteScope?: (scopeId: string) => void;
}

export const PreferencesConfigurator: React.FC<ConfiguratorModalProps> = ({
  isOpen,
  onClose,
  scopes,
  selectedScopeId,
  onSelectScopeId,
  onSavePreferences,
  onCreateScope,
  onDeleteScope,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'create'>('edit');
  const currentScope = scopes.find((s) => s.id === selectedScopeId) || scopes[0];

  // Estado del formulario de edición
  const [editPreferences, setEditPreferences] = useState<ScopePreferences>(
    currentScope ? currentScope.defaultPreferences : ({} as ScopePreferences)
  );
  const [scopeDescription, setScopeDescription] = useState<string>(
    currentScope ? currentScope.description : ''
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estado del formulario de crear nueva categoría
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryTime, setNewCategoryTime] = useState('09:00');
  const [newCategoryTags, setNewCategoryTags] = useState<string[]>([]);
  const [createTagInput, setCreateTagInput] = useState('');
  const [createError, setCreateError] = useState('');

  // Sincronizar estado cuando cambia la categoría seleccionada
  useEffect(() => {
    if (currentScope) {
      setEditPreferences({ ...currentScope.defaultPreferences });
      setScopeDescription(currentScope.description);
    }
  }, [currentScope?.id]);

  if (!isOpen) return null;

  // --- MANEJADORES DE EDICIÓN ---
  const handleAddTagToEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tag = newTagInput.trim();
    if (!tag) return;
    if (editPreferences.tags.length >= 20) {
      alert('Has alcanzado el límite máximo de 20 etiquetas para esta categoría.');
      return;
    }
    if (!editPreferences.tags.includes(tag)) {
      setEditPreferences({
        ...editPreferences,
        tags: [...editPreferences.tags, tag],
      });
      setNewTagInput('');
    }
  };

  const handleRemoveTagFromEdit = (tagToRemove: string) => {
    setEditPreferences({
      ...editPreferences,
      tags: editPreferences.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleSaveEdit = () => {
    if (!currentScope) return;
    const updatedScopeDef: ScopeDefinition = {
      ...currentScope,
      description: scopeDescription,
      defaultPreferences: editPreferences,
    };
    onSavePreferences(editPreferences, updatedScopeDef);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1500);
  };

  // --- MANEJADORES DE CREACIÓN DE CATEGORÍA ---
  const handleAddTagToCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tag = createTagInput.trim();
    if (!tag) return;
    if (newCategoryTags.length >= 20) {
      alert('Límite máximo de 20 etiquetas por categoría alcanzado.');
      return;
    }
    if (!newCategoryTags.includes(tag)) {
      setNewCategoryTags([...newCategoryTags, tag]);
      setCreateTagInput('');
    }
  };

  const handleRemoveTagFromCreate = (tagToRemove: string) => {
    setNewCategoryTags(newCategoryTags.filter((t) => t !== tagToRemove));
  };

  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCreateError('Por favor introduce un nombre para la categoría.');
      return;
    }
    if (!newCategoryDescription.trim()) {
      setCreateError('Por favor añade una pequeña descripción para entender de qué trata.');
      return;
    }

    const generatedId = newCategoryName
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-');

    const createdScope: ScopeDefinition = {
      id: generatedId || `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      label: `Actualización de ${newCategoryName.trim()}`,
      icon: 'Sparkles',
      color: '#06B6D4', // Cyan
      accentGradient: 'from-cyan-500 to-blue-700',
      description: newCategoryDescription.trim(),
      defaultPreferences: {
        scopeId: generatedId || `custom-${Date.now()}`,
        geographicScope: 'internacional',
        country: 'Global',
        city: '',
        preferredTime: newCategoryTime || '09:00',
        tags: newCategoryTags.slice(0, 20),
        sources: [
          {
            id: 'reuters-custom',
            name: 'Reuters Direct',
            domain: 'reuters.com',
            enabled: true,
            isOfficial: true,
            category: 'Agencia Oficial',
          },
          {
            id: 'official-press',
            name: 'Boletines Oficiales',
            domain: 'official.org',
            enabled: true,
            isOfficial: true,
            category: 'Oficial',
          },
        ],
      },
    };

    onCreateScope(createdScope);
    // Limpiar formulario y cambiar a la pestaña de edición con la nueva categoría activa
    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryTags([]);
    setCreateError('');
    onSelectScopeId(createdScope.id);
    setActiveTab('edit');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Cabecera Principal del Configurador */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Configurador de Preferencias
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona, edita o crea categorías con sus etiquetas y horas de búsqueda
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

        {/* Pestañas: [Editar Categoría] | [Crear Categoría] */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'edit'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Editar Categorías</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'create'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Crear Nueva Categoría</span>
          </button>
        </div>

        {/* CONTENIDO DE LA PESTAÑA: EDITAR CATEGORÍA */}
        {activeTab === 'edit' && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            
            {/* 1. Selector de Categoría a Editar */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                1. Selecciona la Categoría a configurar:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {scopes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectScopeId(s.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                      currentScope?.id === s.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate w-full text-center">{s.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      {s.defaultPreferences.tags.length}/20 tags
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {currentScope && (
              <>
                {/* 2. Descripción de la Categoría */}
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-200">
                    Descripción de la Categoría
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Una pequeña descripción para que se entienda el ámbito y contexto de la información.
                  </p>
                  <textarea
                    rows={2}
                    value={scopeDescription}
                    onChange={(e) => setScopeDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="Describe de qué trata esta categoría..."
                  />
                </div>

                {/* 3. Hora de Búsqueda Completa y Ámbito Geográfico */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Hora de Búsqueda */}
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <label className="text-xs font-semibold text-slate-200">
                        Hora de búsqueda completa
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Hora límite preferida para tener listo el repaso matutino o vespertino.
                    </p>
                    <input
                      type="time"
                      value={editPreferences.preferredTime || '08:30'}
                      onChange={(e) =>
                        setEditPreferences({
                          ...editPreferences,
                          preferredTime: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Alcance Geográfico */}
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <label className="text-xs font-semibold text-slate-200">
                        Ámbito Territorial / País
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Filtro geográfico para las noticias del sector.
                    </p>
                    <div className="flex gap-2">
                      <select
                        value={editPreferences.geographicScope}
                        onChange={(e) =>
                          setEditPreferences({
                            ...editPreferences,
                            geographicScope: e.target.value as any,
                          })
                        }
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 flex-1"
                      >
                        <option value="nacional">Nacional</option>
                        <option value="internacional">Internacional</option>
                        <option value="continental">Continental</option>
                        <option value="local">Local</option>
                      </select>
                      <input
                        type="text"
                        value={editPreferences.country || ''}
                        onChange={(e) =>
                          setEditPreferences({
                            ...editPreferences,
                            country: e.target.value,
                          })
                        }
                        placeholder="País"
                        className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Etiquetas Específicas (Límite 20) */}
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <label className="text-xs font-semibold text-slate-200">
                        Etiquetas Específicas de Búsqueda
                      </label>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        editPreferences.tags.length >= 20
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {editPreferences.tags.length} / 20 máx
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Añade palabras clave que el asistente rastreará en páginas y webs oficiales (máximo 20 etiquetas).
                  </p>

                  <form onSubmit={handleAddTagToEdit} className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      disabled={editPreferences.tags.length >= 20}
                      placeholder={
                        editPreferences.tags.length >= 20
                          ? 'Límite de 20 etiquetas alcanzado'
                          : 'Escribe una etiqueta y pulsa Añadir...'
                      }
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTagToEdit()}
                      disabled={editPreferences.tags.length >= 20}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir</span>
                    </button>
                  </form>

                  {/* Chips de etiquetas */}
                  <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
                    {editPreferences.tags.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">
                        No hay etiquetas configuradas.
                      </span>
                    ) : (
                      editPreferences.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTagFromEdit(tag)}
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

                {/* Botón de Borrar Categoría si es personalizada */}
                {onDeleteScope && !['futbol', 'finanzas', 'politica', 'tecnologia'].includes(currentScope.id) && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDeleteScope(currentScope.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar esta categoría personalizada</span>
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        )}

        {/* CONTENIDO DE LA PESTAÑA: CREAR NUEVA CATEGORÍA */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateCategorySubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
            
            {createError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {/* Nombre de la Categoría */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ej. Criptomonedas, Automoción, Cine & Series, Salud..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Pequeña Descripción */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Pequeña Descripción (para entender de qué trata) *
              </label>
              <textarea
                rows={2}
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Ej. Novedades del ecosistema cripto, bitcoin, regulaciones de la SEC y finanzas descentralizadas..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Hora de Búsqueda Completa */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Hora a la que quieres que la búsqueda esté hecha</span>
              </label>
              <input
                type="time"
                value={newCategoryTime}
                onChange={(e) => setNewCategoryTime(e.target.value)}
                className="w-full sm:w-48 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Añadir Etiquetas Iniciales (Límite 20) */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Etiquetas Específicas (Límite 20)</span>
                </label>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  {newCategoryTags.length} / 20
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={createTagInput}
                  onChange={(e) => setCreateTagInput(e.target.value)}
                  disabled={newCategoryTags.length >= 20}
                  placeholder="Añade etiquetas para esta categoría..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handleAddTagToCreate()}
                  disabled={newCategoryTags.length >= 20}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {newCategoryTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTagFromCreate(tag)}
                      className="text-emerald-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Crear Categoría y Guardar</span>
              </button>
            </div>

          </form>
        )}

        {/* Footer con Botón de Guardar en Modo Edición */}
        {activeTab === 'edit' && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <span>Guardar Preferencias de {currentScope?.name}</span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
