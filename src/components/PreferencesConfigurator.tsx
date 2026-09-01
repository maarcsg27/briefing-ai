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
  Sliders,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Newspaper,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import type { ScopeDefinition, ScopePreferences } from '../types';

interface ConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scopes: ScopeDefinition[];
  visibleScopeIds: string[];
  onSaveVisibleScopeIds: (ids: string[]) => void;
  initialTab?: 'selector' | 'edit' | 'create';
  selectedScopeId: string | null;
  onSelectScopeId: (id: string) => void;
  onSavePreferences: (prefs: ScopePreferences, updatedScope?: ScopeDefinition) => void;
  onCreateScope: (newScope: ScopeDefinition) => void;
  onDeleteScope?: (scopeId: string) => void;
  onOpenSaveVersionModal?: () => void;
}

export const PreferencesConfigurator: React.FC<ConfiguratorModalProps> = ({
  isOpen,
  onClose,
  scopes,
  visibleScopeIds,
  onSaveVisibleScopeIds,
  initialTab = 'selector',
  selectedScopeId,
  onSelectScopeId,
  onSavePreferences,
  onCreateScope,
  onDeleteScope,
  onOpenSaveVersionModal,
}) => {
  const [activeTab, setActiveTab] = useState<'selector' | 'edit' | 'create'>(initialTab);
  
  // Estado local para el Selector de Visibilidad en la Web
  const [tempVisibleIds, setTempVisibleIds] = useState<string[]>(visibleScopeIds);
  const [selectorSavedFeedback, setSelectorSavedFeedback] = useState(false);

  // Categoría actual seleccionada para editar
  const currentScope = scopes.find((s) => s.id === selectedScopeId) || scopes[0];

  // Estado del formulario de edición
  const [editPreferences, setEditPreferences] = useState<ScopePreferences>(
    currentScope ? currentScope.defaultPreferences : ({} as ScopePreferences)
  );
  const [scopeDescription, setScopeDescription] = useState<string>(
    currentScope ? currentScope.description : ''
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [bannedTagInput, setBannedTagInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estado del formulario de crear nueva categoría
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryTime, setNewCategoryTime] = useState('09:00');
  const [newCategoryMaxNews, setNewCategoryMaxNews] = useState<number>(5);
  const [newCategoryTags, setNewCategoryTags] = useState<string[]>([]);
  const [createTagInput, setCreateTagInput] = useState('');
  const [createError, setCreateError] = useState('');

  // Sincronizar estados al abrir o cambiar props
  useEffect(() => {
    if (isOpen) {
      setTempVisibleIds(visibleScopeIds);
      setActiveTab(initialTab);
    }
  }, [isOpen, visibleScopeIds, initialTab]);

  useEffect(() => {
    if (currentScope) {
      setEditPreferences({ ...currentScope.defaultPreferences });
      setScopeDescription(currentScope.description);
    }
  }, [currentScope?.id]);

  if (!isOpen) return null;

  // --- MANEJADORES DEL SELECTOR DE VISIBILIDAD ---
  const handleToggleVisible = (id: string) => {
    if (tempVisibleIds.includes(id)) {
      // Debe haber al menos 1 visible
      if (tempVisibleIds.length === 1) {
        alert('Debe quedar al menos una categoría seleccionada para mostrar en la web.');
        return;
      }
      setTempVisibleIds(tempVisibleIds.filter((scopeId) => scopeId !== id));
    } else {
      setTempVisibleIds([...tempVisibleIds, id]);
    }
  };

  const handleSelectAll = () => {
    setTempVisibleIds(scopes.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    setTempVisibleIds([]);
  };

  const handleSaveVisibility = () => {
    onSaveVisibleScopeIds(tempVisibleIds);
    setSelectorSavedFeedback(true);
    setTimeout(() => {
      setSelectorSavedFeedback(false);
      onClose();
    }, 600);
  };

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

  const handleAddBannedTagToEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const kw = bannedTagInput.trim().toLowerCase();
    if (!kw) return;
    const currentBanned = editPreferences.bannedKeywords || [];
    if (!currentBanned.includes(kw)) {
      setEditPreferences({
        ...editPreferences,
        bannedKeywords: [...currentBanned, kw],
      });
      setBannedTagInput('');
    }
  };

  const handleRemoveBannedTagFromEdit = (kwToRemove: string) => {
    const currentBanned = editPreferences.bannedKeywords || [];
    setEditPreferences({
      ...editPreferences,
      bannedKeywords: currentBanned.filter((k) => k !== kwToRemove),
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
      color: '#06B6D4',
      accentGradient: 'from-cyan-500 to-blue-700',
      description: newCategoryDescription.trim(),
      defaultPreferences: {
        scopeId: generatedId || `custom-${Date.now()}`,
        geographicScope: 'internacional',
        country: 'Global',
        city: '',
        preferredTime: newCategoryTime || '09:00',
        maxNewsLimit: Number(newCategoryMaxNews) || 5,
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
    // Añadir automáticamente a la lista visible de la web
    onSaveVisibleScopeIds([...visibleScopeIds, createdScope.id]);
    setTempVisibleIds([...tempVisibleIds, createdScope.id]);

    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryTags([]);
    setCreateError('');
    onSelectScopeId(createdScope.id);
    setActiveTab('edit');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        
        {/* Cabecera Principal */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Configurador & Selector
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Elige qué categorías aparecen en la web, edita sus etiquetas o crea nuevas
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

        {/* 3 Pestañas Principales Adaptativas */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-3 sm:px-6 pt-2.5 sm:pt-3 gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {/* Pestaña 1: Selector de Categorías Visibles */}
          <button
            onClick={() => setActiveTab('selector')}
            className={`pb-2.5 sm:pb-3 px-2.5 sm:px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 ${
              activeTab === 'selector'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Selector Web</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              {tempVisibleIds.length}/{scopes.length}
            </span>
          </button>

          {/* Pestaña 2: Editar Categorías & Etiquetas */}
          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-2.5 sm:pb-3 px-2.5 sm:px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 ${
              activeTab === 'edit'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Editar Categoría & Tags</span>
          </button>

          {/* Pestaña 3: Crear Nueva Categoría */}
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 sm:pb-3 px-2.5 sm:px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 ${
              activeTab === 'create'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>+ Crear Categoría</span>
          </button>
        </div>

        {/* PESTAÑA 1: SELECTOR DE PREFERENCIAS PARA TODA LA WEB */}
        {activeTab === 'selector' && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Categorías activas en toda la web</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Marca las categorías que quieres que se muestren en la pantalla principal y en los repasos del asistente.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition"
                >
                  Activar Todas
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-rose-200 text-xs font-semibold border border-rose-500/40 transition"
                >
                  Desactivar Todas
                </button>
              </div>
            </div>

            {/* Listado de Categorías con interruptor y detalles */}
            <div className="grid grid-cols-1 gap-3">
              {scopes.map((scope) => {
                const isSelected = tempVisibleIds.includes(scope.id);

                return (
                  <div
                    key={scope.id}
                    onClick={() => handleToggleVisible(scope.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-slate-800/80 border-emerald-500/60 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Checkbox Icon */}
                      <div className="shrink-0 text-emerald-400">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </div>

                      {/* Icono de la categoría */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow"
                        style={{ backgroundColor: scope.color }}
                      >
                        <span className="text-base font-bold">
                          {scope.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>

                      {/* Información de la categoría */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {scope.name}
                          </h4>
                          {isSelected ? (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Visible en la web
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <EyeOff className="w-3 h-3" /> Oculta
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {scope.description}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {scope.defaultPreferences.preferredTime} h
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Tag className="w-3 h-3 text-emerald-400" />
                            {scope.defaultPreferences.tags.length} etiquetas
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* PESTAÑA 2: EDITAR CATEGORÍA & ETIQUETAS */}
        {activeTab === 'edit' && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            
            {/* Selector de Categoría a Editar */}
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
                {/* Descripción de la Categoría */}
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

                {/* Hora de Búsqueda Completa y Ámbito Geográfico */}
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

                {/* Apartado: Límite de Noticias de la Categoría */}
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-emerald-400" />
                      <label className="text-xs font-semibold text-slate-200">
                        Límite de noticias de la categoría
                      </label>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {editPreferences.maxNewsLimit || 5} noticias
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Establece el número exacto de noticias y artículos oficiales que se recopilarán en esta categoría.
                  </p>

                  {/* Botones de Selección Rápida Ordenados */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[2, 3, 5, 8, 10, 12, 15, 20].map((num) => {
                      const isSelected = (editPreferences.maxNewsLimit || 5) === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            setEditPreferences({
                              ...editPreferences,
                              maxNewsLimit: num,
                            })
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {num} noticias
                        </button>
                      );
                    })}
                  </div>

                  {/* Barra deslizante limpia con valores mínimo y máximo */}
                  <div className="space-y-1 pt-1">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={editPreferences.maxNewsLimit || 5}
                      onChange={(e) =>
                        setEditPreferences({
                          ...editPreferences,
                          maxNewsLimit: Number(e.target.value),
                        })
                      }
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>1 noticia</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20 noticias</span>
                    </div>
                  </div>
                </div>

                {/* Etiquetas Específicas (Límite 20) */}
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
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
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

                {/* APARTADO: PALABRAS VETADAS / EXCLUIDAS */}
                <div className="bg-rose-950/20 p-4 rounded-xl border border-rose-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <label className="text-xs font-bold text-rose-200 uppercase tracking-wider">
                        Palabras Vetadas / Excluidas
                      </label>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {(editPreferences.bannedKeywords || []).length} vetadas
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Añade palabras o temas que <strong>NO quieres que salgan nunca</strong>. Cualquier noticia que contenga estos términos (ej. <em>apuestas deportivas, bet, casino, póquer</em>) será bloqueada automáticamente.
                  </p>

                  <form onSubmit={handleAddBannedTagToEdit} className="flex gap-2">
                    <input
                      type="text"
                      value={bannedTagInput}
                      onChange={(e) => setBannedTagInput(e.target.value)}
                      placeholder="Añadir palabra o frase a vetar (ej. apuestas deportivas)..."
                      className="flex-1 bg-slate-900 border border-rose-900/60 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddBannedTagToEdit()}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Vetar</span>
                    </button>
                  </form>

                  {/* Chips de Palabras Vetadas */}
                  <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
                    {(!editPreferences.bannedKeywords || editPreferences.bannedKeywords.length === 0) ? (
                      <span className="text-xs text-slate-500 italic">
                        No hay palabras vetadas configuradas.
                      </span>
                    ) : (
                      editPreferences.bannedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 border border-rose-500/50 text-rose-300 text-xs font-medium shadow-sm"
                        >
                          <span>🚫 {kw}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBannedTagFromEdit(kw)}
                            className="hover:text-white transition text-rose-400 ml-1"
                            title="Eliminar palabra vetada"
                          >
                            <X className="w-3 h-3" />
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

        {/* PESTAÑA 3: CREAR NUEVA CATEGORÍA */}
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

            {/* Hora de Búsqueda Completa y Límite de Noticias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hora de búsqueda completa</span>
                </label>
                <input
                  type="time"
                  value={newCategoryTime}
                  onChange={(e) => setNewCategoryTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Límite de noticias a mostrar</span>
                </label>
                <select
                  value={newCategoryMaxNews}
                  onChange={(e) => setNewCategoryMaxNews(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {[2, 3, 4, 5, 6, 8, 10, 12, 15].map((num) => (
                    <option key={num} value={num}>
                      {num} noticias máximo
                    </option>
                  ))}
                </select>
              </div>
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

        {/* Footer con Botón según la Pestaña Activa */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-800 bg-slate-900/95 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition text-center"
            >
              Cerrar
            </button>

            {onOpenSaveVersionModal && (
              <button
                type="button"
                onClick={onOpenSaveVersionModal}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gestor de Sesiones & Perfiles...</span>
              </button>
            )}
          </div>

          {activeTab === 'selector' && (
            <button
              type="button"
              onClick={handleSaveVisibility}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
            >
              {selectorSavedFeedback ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>¡Selección Aplicada!</span>
                </>
              ) : (
                <span>Aplicar a toda la web ({tempVisibleIds.length} activas)</span>
              )}
            </button>
          )}

          {activeTab === 'edit' && (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
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
          )}
        </div>

      </div>
    </div>
  );
};
