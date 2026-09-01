import React, { useState } from 'react';
import { 
  Library, 
  Sparkles, 
  Key, 
  Plus, 
  Trash2, 
  Tag, 
  ShieldCheck, 
  Bot, 
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Search,
  BookOpen,
  ShieldAlert,
  X,
  Mic,
  MicOff
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import type { ScopeDefinition, ScopePreferences, ScopeSource, DiscoveredSource } from '../types';

interface LibraryManagerProps {
  scopes: ScopeDefinition[];
  preferencesMap: Record<string, ScopePreferences>;
  onUpdatePreferences: (scopeId: string, updated: ScopePreferences) => void;
  onUpdateScopes: () => void;
}

export const LibraryManager: React.FC<LibraryManagerProps> = ({
  scopes,
  preferencesMap,
  onUpdatePreferences,
}) => {
  const [selectedScopeId, setSelectedScopeId] = useState<string>(scopes[0]?.id || 'crecimiento-personal');
  const [apiKey, setApiKey] = useState<string>(geminiService.getApiKey());
  const [keySavedFeedback, setKeySavedFeedback] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(!geminiService.hasValidKey());

  // Estados para añadir fuentes manuales
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceDomain, setNewSourceDomain] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState('Portal Especializado');

  // Estados para palabras clave y subtemáticas
  const [newTag, setNewTag] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newBannedKeyword, setNewBannedKeyword] = useState('');

  // Estados para descubrimiento de fuentes por IA y Voz
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredSources, setDiscoveredSources] = useState<DiscoveredSource[]>([]);
  const [addedDiscoveredIds, setAddedDiscoveredIds] = useState<Set<string>>(new Set());
  const [customSourceQuery, setCustomSourceQuery] = useState('');
  const [isListeningSource, setIsListeningSource] = useState(false);

  const selectedScope = scopes.find((s) => s.id === selectedScopeId) || scopes[0];
  const activePrefs = preferencesMap[selectedScopeId] || selectedScope?.defaultPreferences;

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    geminiService.setApiKey(apiKey);
    setKeySavedFeedback(true);
    setTimeout(() => setKeySavedFeedback(false), 2000);
  };

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTag.trim();
    if (trimmed && !activePrefs.tags.includes(trimmed)) {
      const updated: ScopePreferences = {
        ...activePrefs,
        tags: [...activePrefs.tags, trimmed],
      };
      onUpdatePreferences(selectedScopeId, updated);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated: ScopePreferences = {
      ...activePrefs,
      tags: activePrefs.tags.filter((t) => t !== tagToRemove),
    };
    onUpdatePreferences(selectedScopeId, updated);
  };

  const handleAddSubcategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSubcategory.trim();
    const existingSubs = activePrefs.subcategories || [];
    if (trimmed && !existingSubs.includes(trimmed)) {
      const updated: ScopePreferences = {
        ...activePrefs,
        subcategories: [...existingSubs, trimmed],
      };
      onUpdatePreferences(selectedScopeId, updated);
      setNewSubcategory('');
    }
  };

  const handleRemoveSubcategory = (subToRemove: string) => {
    const existingSubs = activePrefs.subcategories || [];
    const updated: ScopePreferences = {
      ...activePrefs,
      subcategories: existingSubs.filter((s) => s !== subToRemove),
    };
    onUpdatePreferences(selectedScopeId, updated);
  };

  const handleAddBannedKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = newBannedKeyword.trim().toLowerCase();
    if (!kw) return;
    const currentBanned = activePrefs.bannedKeywords || [];
    if (!currentBanned.includes(kw)) {
      const updated: ScopePreferences = {
        ...activePrefs,
        bannedKeywords: [...currentBanned, kw],
      };
      onUpdatePreferences(selectedScopeId, updated);
      setNewBannedKeyword('');
    }
  };

  const handleRemoveBannedKeyword = (kwToRemove: string) => {
    const currentBanned = activePrefs.bannedKeywords || [];
    const updated: ScopePreferences = {
      ...activePrefs,
      bannedKeywords: currentBanned.filter((k) => k !== kwToRemove),
    };
    onUpdatePreferences(selectedScopeId, updated);
  };

  const handleToggleSource = (sourceId: string) => {
    const updated: ScopePreferences = {
      ...activePrefs,
      sources: activePrefs.sources.map((s) =>
        s.id === sourceId ? { ...s, enabled: !s.enabled } : s
      ),
    };
    onUpdatePreferences(selectedScopeId, updated);
  };

  const handleEnableAllSources = () => {
    const updated: ScopePreferences = {
      ...activePrefs,
      sources: activePrefs.sources.map((s) => ({ ...s, enabled: true })),
    };
    onUpdatePreferences(selectedScopeId, updated);
  };

  const handleDisableAllSources = () => {
    const updated: ScopePreferences = {
      ...activePrefs,
      sources: activePrefs.sources.map((s) => ({ ...s, enabled: false })),
    };
    onUpdatePreferences(selectedScopeId, updated);
  };

  const handleAddManualSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceDomain.trim()) return;

    let cleanDomain = newSourceDomain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    const newSrc: ScopeSource = {
      id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: newSourceName.trim(),
      domain: cleanDomain,
      enabled: true,
      isOfficial: true,
      category: newSourceCategory,
    };

    const updated = storageService.addSourceToScope(selectedScopeId, newSrc);
    onUpdatePreferences(selectedScopeId, updated);

    setNewSourceName('');
    setNewSourceDomain('');
  };

  const handleRemoveSource = (sourceId: string) => {
    const updated: ScopePreferences = {
      ...activePrefs,
      sources: activePrefs.sources.filter((s) => s.id !== sourceId),
    };
    onUpdatePreferences(selectedScopeId, updated);
  };

  const handleDiscoverSources = async (queryOverride?: string) => {
    setIsDiscovering(true);
    setDiscoveredSources([]);

    const queryToUse = queryOverride !== undefined ? queryOverride : customSourceQuery;

    try {
      const existingDomains = activePrefs.sources.map((s) => s.domain);
      const results = await geminiService.discoverSourcesWithAI(
        selectedScope.name,
        selectedScope.description,
        [...activePrefs.tags, ...(activePrefs.subcategories || [])],
        existingDomains,
        queryToUse
      );

      setDiscoveredSources(results);
    } catch (err: any) {
      console.warn('Error en descubrimiento de fuentes por IA:', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleListenSourceQuery = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta entrada de voz directa. Puedes escribir tu búsqueda en el cuadro de texto.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningSource(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setCustomSourceQuery(transcript);
          handleDiscoverSources(transcript);
        }
        setIsListeningSource(false);
      };

      recognition.onerror = () => {
        setIsListeningSource(false);
      };

      recognition.onend = () => {
        setIsListeningSource(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListeningSource(false);
    }
  };

  const handleAddDiscoveredSource = (source: DiscoveredSource) => {
    const newSrc: ScopeSource = {
      id: source.id,
      name: source.name,
      domain: source.domain,
      enabled: true,
      isOfficial: false,
      category: `${source.category} (Descubierto por IA)`,
      description: source.description,
      discoveredByAI: true,
    };

    const updated = storageService.addSourceToScope(selectedScopeId, newSrc);
    onUpdatePreferences(selectedScopeId, updated);

    setAddedDiscoveredIds((prev) => new Set(prev).add(source.id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. BANNER CABECERA DE BIBLIOTECA */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-3xl border border-indigo-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Library className="w-3.5 h-3.5" />
              <span>Base de Conocimiento & Curación Digital</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Biblioteca de Temáticas, Fuentes & IA
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Administra tus categorías, palabras clave y fuentes de referencia. La IA de **Gemini** rastreará constantemente la web para descubrir nuevos portales, blogs y foros para ampliar tu catálogo.
            </p>
          </div>

          {/* Botón rápido de estado Gemini API Key */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0 w-full sm:w-auto">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Gemini API Key</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                geminiService.hasValidKey() 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {geminiService.hasValidKey() ? 'Conectado' : 'Clave pendiente'}
              </span>
            </div>
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              {showKeyInput ? 'Ocultar ajustes de llave' : 'Configurar llave Gemini'}
            </button>
          </div>
        </div>

        {/* Panel desplegable de configuración de Gemini Key */}
        {showKeyInput && (
          <form onSubmit={handleSaveApiKey} className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Pega aquí tu Gemini API Key (ej. AIzaSy...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Obtén tu llave gratuita en Google AI Studio para resúmenes ilimitados de 3 a 5 líneas.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                {keySavedFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>¡Guardada!</span>
                  </>
                ) : (
                  <span>Guardar Clave</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. SELECTOR DE TEMÁTICA Y NAVEGADOR DE ÁMBITOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Selecciona un Ámbito para Gestionar ({scopes.length} activos)</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {scopes.map((scope) => {
            const isSelected = scope.id === selectedScopeId;
            return (
              <button
                key={scope.id}
                onClick={() => setSelectedScopeId(scope.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shrink-0 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: scope.color }}
                />
                <span>{scope.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PANEL PRINCIPAL DE LA TEMÁTICA SELECCIONADA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA (2 Cols): PALABRAS CLAVE, SUBTEMÁTICAS Y FUENTES */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DETALLES DE LA CATEGORÍA */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{selectedScope.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedScope.description}
                </p>
              </div>
              <span
                className="w-4 h-4 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: selectedScope.color }}
              />
            </div>

            {/* SECCIÓN PALABRAS CLAVE (TAGS) */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Palabras Clave Principales</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activePrefs.tags.length} configuradas
                </span>
              </div>

              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Agregar nueva palabra clave (ej. Inteligencia emocional, ETF)..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {activePrefs.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-300 text-xs font-medium"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SECCIÓN SUBTEMÁTICAS / SUBCATEGORÍAS */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Subtemáticas & Nichos Específicos</span>
                </label>
              </div>

              <form onSubmit={handleAddSubcategory} className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="Agregar subtemática (ej. Psicología Conductual, Cripto DeFi)..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Subtemática</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {(!activePrefs.subcategories || activePrefs.subcategories.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">No hay subtemáticas añadidas aún.</p>
                ) : (
                  activePrefs.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                    >
                      <span>{sub}</span>
                      <button
                        onClick={() => handleRemoveSubcategory(sub)}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* SECCIÓN PALABRAS BETADAS / EXCLUIDAS */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Palabras Betadas / Excluidas</span>
                </label>
                <span className="text-[11px] text-rose-400 font-mono font-bold">
                  {(activePrefs.bannedKeywords || []).length} betadas
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Añade términos que <strong>NO quieres que salgan nunca</strong> (ej. <em>apuestas deportivas, bet, casino</em>).
              </p>

              <form onSubmit={handleAddBannedKeyword} className="flex gap-2">
                <input
                  type="text"
                  value={newBannedKeyword}
                  onChange={(e) => setNewBannedKeyword(e.target.value)}
                  placeholder="Añadir palabra a vetar (ej. apuestas deportivas, bet)..."
                  className="flex-1 bg-slate-950 border border-rose-900/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="bg-rose-700 hover:bg-rose-600 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Betar</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {(!activePrefs.bannedKeywords || activePrefs.bannedKeywords.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">No hay palabras betadas configuradas aún.</p>
                ) : (
                  activePrefs.bannedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-medium"
                    >
                      <span>🚫 {kw}</span>
                      <button
                        onClick={() => handleRemoveBannedKeyword(kw)}
                        className="text-rose-400 hover:text-white transition"
                        title="Eliminar palabra betada"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* FUENTES DE REFERENCIA DE LA BIBLIOTECA */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Fuentes & Medios Vinculados ({activePrefs.sources.length})</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Webs, prensa, blogs y foros configurados para rastrear este ámbito.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleEnableAllSources}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition"
                >
                  Activar Todas
                </button>
                <button
                  type="button"
                  onClick={handleDisableAllSources}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-rose-200 text-xs font-semibold border border-rose-500/40 transition"
                >
                  Desactivar Todas
                </button>
              </div>
            </div>

            {/* Formulario para añadir fuente manual */}
            <form onSubmit={handleAddManualSource} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Añadir Nueva Fuente Manual</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="Nombre medio (ej. Finect)"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={newSourceDomain}
                  onChange={(e) => setNewSourceDomain(e.target.value)}
                  placeholder="Dominio (ej. finect.com)"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={newSourceCategory}
                  onChange={(e) => setNewSourceCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Portal Especializado">Portal Especializado</option>
                  <option value="Blog de Autor">Blog de Autor</option>
                  <option value="Comunidad/Foro">Comunidad / Foro</option>
                  <option value="Prensa Oficial">Prensa Oficial</option>
                  <option value="Podcast">Podcast</option>
                </select>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-3 py-2 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Vincular Fuente</span>
                </button>
              </div>
            </form>

            {/* Grilla de Fuentes Activas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePrefs.sources.map((source) => (
                <div
                  key={source.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    source.enabled
                      ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                      : 'bg-slate-950/20 border-slate-900 text-slate-500 opacity-50'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{source.name}</span>
                      {source.discoveredByAI && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-mono">
                          IA
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{source.domain}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={source.enabled}
                      onChange={() => handleToggleSource(source.id)}
                      className="rounded text-emerald-500 bg-slate-900 border-slate-700"
                      title={source.enabled ? 'Desactivar fuente' : 'Activar fuente'}
                    />
                    <button
                      onClick={() => handleRemoveSource(source.id)}
                      className="text-slate-600 hover:text-rose-400 transition"
                      title="Eliminar de la biblioteca"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (1 Col): DESCUBRIDOR AUTÓNOMO DE FUENTES POR IA Y VOZ */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 space-y-4 shadow-xl">
            
            <div className="flex items-center gap-2 text-indigo-400">
              <Bot className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Descubridor de Fuentes por IA & Comando de Voz
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pide por <strong>texto o dictando por voz</strong> la temática o competición sobre la que deseas descubrir webs, blogs, foros o portales verificados.
            </p>

            {/* CUADRO DE TEXTO Y BOTÓN PARA HABLAR */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSourceQuery}
                  onChange={(e) => setCustomSourceQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleDiscoverSources();
                    }
                  }}
                  placeholder="Ej: busca una fuente sobre ciclismo uci, o resultados de la liga y la champions..."
                  className="flex-1 bg-slate-950 border border-indigo-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />

                {/* BOTÓN DE MICRÓFONO PARA HABLAR */}
                <button
                  type="button"
                  onClick={handleListenSourceQuery}
                  title="Pulsar para pedir por voz la fuente que buscas"
                  className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 ${
                    isListeningSource
                      ? 'bg-rose-500 text-white animate-pulse border-rose-400 shadow-lg shadow-rose-500/30'
                      : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-500/40'
                  }`}
                >
                  {isListeningSource ? (
                    <>
                      <MicOff className="w-4 h-4 text-white" />
                      <span>Escuchando...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-indigo-400" />
                      <span>Hablar</span>
                    </>
                  )}
                </button>
              </div>

              {/* EJEMPLOS RÁPIDOS EN PÍLDORAS */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">Ejemplos:</span>
                {[
                  'Ciclismo UCI carretera',
                  'Liga EA y Champions League',
                  'Psicología y Ansiedad',
                  'Finanzas e Inversión',
                ].map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setCustomSourceQuery(ex);
                      handleDiscoverSources(ex);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleDiscoverSources()}
              disabled={isDiscovering}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDiscovering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>Rastreando fuentes en la web...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Buscar Fuentes con IA</span>
                </>
              )}
            </button>

            {/* LISTA DE FUENTES DESCUBIERTAS POR LA IA */}
            {discoveredSources.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" />
                  <span>{discoveredSources.length} Fuentes Sugeridas por IA</span>
                </span>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {discoveredSources.map((source) => {
                    const isAdded = addedDiscoveredIds.has(source.id);

                    return (
                      <div
                        key={source.id}
                        className="bg-slate-950 p-4 rounded-xl border border-indigo-500/20 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                              {source.category}
                            </span>
                            <h5 className="text-xs font-bold text-white leading-snug">
                              {source.name}
                            </h5>
                          </div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-indigo-400 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {source.description}
                        </p>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-900 text-[10px]">
                          <span className="text-slate-400 font-mono">{source.domain}</span>
                          <button
                            onClick={() => handleAddDiscoveredSource(source)}
                            disabled={isAdded}
                            className={`px-3 py-1 rounded-lg font-bold text-[10px] transition flex items-center gap-1 ${
                              isAdded
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Añadida</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Añadir a Biblioteca</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
