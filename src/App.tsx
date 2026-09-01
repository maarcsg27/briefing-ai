import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScopeGrid } from './components/ScopeGrid';
import { PreferencesConfigurator } from './components/PreferencesConfigurator';
import { BriefingPlayer } from './components/BriefingPlayer';
import { NewsFeed } from './components/NewsFeed';
import { LibraryManager } from './components/LibraryManager';
import { SessionSelectorModal } from './components/SessionSelectorModal';
import { storageService } from './services/storageService';
import { newsService } from './services/newsService';
import { geminiService } from './services/geminiService';
import type { ScopeDefinition, ScopePreferences, BriefingResult } from './types';
import { Sparkles, Sliders, Newspaper, Library, Key, Bot, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'briefings' | 'library'>('briefings');
  const [scopes, setScopes] = useState<ScopeDefinition[]>([]);
  const [visibleScopeIds, setVisibleScopeIds] = useState<string[]>([]);
  const [preferencesMap, setPreferencesMap] = useState<Record<string, ScopePreferences>>({});
  const [activeScope, setActiveScope] = useState<ScopeDefinition | null>(null);

  // Estado del Configurador de Preferencias
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState<boolean>(false);
  const [configuratorSelectedId, setConfiguratorSelectedId] = useState<string | null>(null);
  const [configuratorInitialTab, setConfiguratorInitialTab] = useState<'selector' | 'edit' | 'create'>('selector');

  // Estado del Gestor de Sesiones
  const [isSaveVersionModalOpen, setIsSaveVersionModalOpen] = useState<boolean>(false);
  const [activeVersionName, setActiveVersionName] = useState<string | null>(null);

  const [currentBriefing, setCurrentBriefing] = useState<BriefingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Cargar catálogo de categorías, sus preferencias y cuáles son visibles en la web
  useEffect(() => {
    const loadedScopes = storageService.getAllScopes();
    setScopes(loadedScopes);

    const loadedVisibleIds = storageService.getVisibleScopeIds();
    setVisibleScopeIds(loadedVisibleIds);

    const loadedPrefs: Record<string, ScopePreferences> = {};
    loadedScopes.forEach((s) => {
      loadedPrefs[s.id] = storageService.getPreferences(s.id);
    });
    setPreferencesMap(loadedPrefs);

    const lastSync = storageService.getLastSyncTimestamp();
    if (lastSync) {
      const d = new Date(lastSync);
      setLastSyncTime(d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }

    const initial = loadedScopes.find((s) => loadedVisibleIds.includes(s.id)) || loadedScopes[0];
    if (initial) {
      const cached = storageService.getDailyBriefingCache(initial.id);
      if (cached) {
        setActiveScope(initial);
        setCurrentBriefing(cached);
      } else {
        handleGenerateBriefing(initial, loadedPrefs[initial.id] || initial.defaultPreferences, false);
      }
    }
  }, []);

  // Comprobación automática cada 15s para actualizar según hora configurada
  useEffect(() => {
    const checkScheduledAutoUpdate = () => {
      const now = new Date();
      const currentHHMM = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      const activeScopes = scopes.filter((s) => visibleScopeIds.length === 0 || visibleScopeIds.includes(s.id));
      for (const s of activeScopes) {
        const prefs = preferencesMap[s.id] || s.defaultPreferences;
        if (prefs.preferredTime === currentHHMM) {
          const today = now.toISOString().slice(0, 10);
          const autoKey = `auto_updated_${s.id}_${today}_${currentHHMM}`;
          if (!sessionStorage.getItem(autoKey)) {
            sessionStorage.setItem(autoKey, 'true');
            handleGenerateBriefing(s, prefs, true, true);
            break;
          }
        }
      }
    };

    const timer = setInterval(checkScheduledAutoUpdate, 15000);
    return () => clearInterval(timer);
  }, [scopes, visibleScopeIds, preferencesMap]);

  const handleGenerateBriefing = async (
    scope: ScopeDefinition,
    prefs?: ScopePreferences,
    triggerSpeech: boolean = true,
    forceFresh: boolean = false
  ) => {
    setIsLoading(true);
    setActiveScope(scope);
    const activePrefs = prefs || preferencesMap[scope.id] || scope.defaultPreferences;

    if (!forceFresh) {
      const cached = storageService.getDailyBriefingCache(scope.id);
      if (cached) {
        setCurrentBriefing(cached);
        setIsLoading(false);
        if (triggerSpeech && cached.audioScript) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('briefing-auto-play'));
          }, 200);
        }
        return;
      }
    }

    try {
      setSyncStatus(`Rastreando prensa 24h en ${scope.name}...`);
      const result = await newsService.generateBriefing(
        scope.id, 
        activePrefs, 
        scope.name,
        (progress) => setSyncStatus(progress)
      );

      setCurrentBriefing(result);
      storageService.saveDailyBriefingCache(scope.id, result);
      
      const nowStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(nowStr);
      setSyncStatus(`Búsqueda de 24h completada con éxito a las ${nowStr}.`);
      setTimeout(() => setSyncStatus(''), 4000);

      if (triggerSpeech && result.audioScript) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('briefing-auto-play'));
        }, 300);
      }
    } catch (e) {
      console.error('Error generando briefing:', e);
      setSyncStatus('Error al conectar con los servicios de noticias.');
      setTimeout(() => setSyncStatus(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfigurator = (
    targetScope?: ScopeDefinition,
    tab: 'selector' | 'edit' | 'create' = 'edit'
  ) => {
    setConfiguratorInitialTab(tab);
    setConfiguratorSelectedId(targetScope ? targetScope.id : activeScope ? activeScope.id : scopes[0]?.id || null);
    setIsConfiguratorOpen(true);
  };

  const handleSavePreferences = (prefs: ScopePreferences, updatedScope?: ScopeDefinition) => {
    const scopeId = updatedScope ? updatedScope.id : prefs.scopeId;
    storageService.savePreferences(prefs);

    if (updatedScope) {
      storageService.updateScope(updatedScope);
      const allUpdated = storageService.getAllScopes();
      setScopes(allUpdated);
    }

    setPreferencesMap((prev) => ({
      ...prev,
      [scopeId]: prefs,
    }));

    if (activeScope && activeScope.id === scopeId) {
      const targetScope = updatedScope || activeScope;
      handleGenerateBriefing(targetScope, prefs, false, true);
    }
  };

  const handleSaveVisibleScopeIds = (newVisibleIds: string[]) => {
    storageService.saveVisibleScopeIds(newVisibleIds);
    setVisibleScopeIds(newVisibleIds);

    if (activeScope && !newVisibleIds.includes(activeScope.id)) {
      const nextVisibleScope = scopes.find((s) => newVisibleIds.includes(s.id));
      if (nextVisibleScope) {
        handleGenerateBriefing(nextVisibleScope, preferencesMap[nextVisibleScope.id], false, false);
      }
    }
  };

  const handleCreateScope = (newScope: ScopeDefinition) => {
    storageService.addScope(newScope);

    const newVisible = [...visibleScopeIds, newScope.id];
    storageService.saveVisibleScopeIds(newVisible);

    const allScopes = storageService.getAllScopes();
    setScopes(allScopes);
    setVisibleScopeIds(newVisible);
    setPreferencesMap((prev) => ({
      ...prev,
      [newScope.id]: newScope.defaultPreferences,
    }));

    handleGenerateBriefing(newScope, newScope.defaultPreferences, true, true);
  };

  const handleDeleteScope = (scopeId: string) => {
    storageService.deleteScope(scopeId);
    const updatedScopes = storageService.getAllScopes();
    const updatedVisible = storageService.getVisibleScopeIds();

    setScopes(updatedScopes);
    setVisibleScopeIds(updatedVisible);

    if (activeScope?.id === scopeId) {
      const fallback = updatedScopes.find((s) => updatedVisible.includes(s.id)) || updatedScopes[0];
      if (fallback) {
        handleGenerateBriefing(fallback, preferencesMap[fallback.id] || fallback.defaultPreferences, false, false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Editorial Masthead */}
      <Header
        onOpenConfigurator={() => handleOpenConfigurator(undefined, 'selector')}
        onOpenSaveVersionModal={() => setIsSaveVersionModalOpen(true)}
        onTriggerSync={() => {
          if (activeScope) {
            handleGenerateBriefing(activeScope, undefined, true, true);
          }
        }}
        statusText={syncStatus}
        isSyncing={isLoading}
        scopes={scopes}
        preferencesMap={preferencesMap}
        visibleScopeIds={visibleScopeIds}
        activeVersionName={activeVersionName}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Navegación Principal en Pestañas Editoriales */}
        <div className="flex items-center gap-2 border-b border-paper-750 pb-3">
          <button
            onClick={() => setActiveTab('briefings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition ${
              activeTab === 'briefings'
                ? 'bg-paper-850 text-white border border-paper-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-paper-900'
            }`}
          >
            <Newspaper className="w-4 h-4 text-emerald-400" />
            <span>Portadas & Feed Curado</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition ${
              activeTab === 'library'
                ? 'bg-paper-850 text-white border border-paper-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-paper-900'
            }`}
          >
            <Library className="w-4 h-4 text-indigo-400" />
            <span>Biblioteca de Temáticas & Fuentes IA</span>
          </button>
        </div>

        {/* VISTA 1: BIBLIOTECA DE TEMÁTICAS */}
        {activeTab === 'library' ? (
          <LibraryManager
            scopes={scopes}
            preferencesMap={preferencesMap}
            onUpdatePreferences={(_scopeId, updated) => handleSavePreferences(updated)}
            onUpdateScopes={() => setScopes(storageService.getAllScopes())}
          />
        ) : (
          /* VISTA 2: PORTADA EDITORIAL & FEED DIARIO */
          <>
            {/* Banner Editorial Contextual */}
            <div className="p-6 rounded-xl bg-paper-900 border border-paper-750 shadow-lg relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Curación de Noticias 24h</span>
                    </span>

                    {geminiService.hasValidKey() ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-500/30">
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Gemini 2.5 Flash Activo</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveTab('library')}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span>Configurar Gemini Key ➔</span>
                      </button>
                    )}

                    {lastSyncTime && (
                      <span className="text-slate-400">
                        • Actualizado a las {lastSyncTime}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    Resumen hiper-personalizado por etiquetas y medios oficiales.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Evaluación continua en 2 pasos: primero descartamos absolutamente cualquier noticia que no coincida en el titular con tus etiquetas prioritarias, y luego sintetizamos su contenido objetivo.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleOpenConfigurator()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Ajustes Rápidos</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Selector de Temáticas & Secciones Editoriales */}
            <section className="space-y-3">
              <ScopeGrid
                scopes={scopes.filter((s) => visibleScopeIds.includes(s.id))}
                preferencesMap={preferencesMap}
                activeScopeId={activeScope?.id || null}
                isLoading={isLoading}
                onSelectScope={(scope) => {
                  if (activeScope?.id !== scope.id) {
                    handleGenerateBriefing(scope, undefined, false, false);
                  }
                }}
                onOpenPreferences={(scope) => handleOpenConfigurator(scope, 'edit')}
                onAddNewScope={() => handleOpenConfigurator(undefined, 'create')}
              />
            </section>

            {/* Feed Principal Curado con Jerarquía Editorial */}
            {currentBriefing && (
              <section className="space-y-6">
                <BriefingPlayer briefing={currentBriefing} autoPlay={false} />
                <NewsFeed
                  briefing={currentBriefing}
                  selectedTags={
                    (activeScope && preferencesMap[activeScope.id]?.tags) || []
                  }
                />
              </section>
            )}
          </>
        )}

      </main>

      {/* Footer Editorial Fino */}
      <footer className="border-t border-paper-800 bg-[#080a0f] py-6 mt-12 text-center text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Briefing.AI • Motor de curación hiper-personalizada de noticias</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Fuentes verificadas & seguimiento de etiquetas
          </span>
        </div>
      </footer>

      {/* Configurador Integral */}
      <PreferencesConfigurator
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        scopes={scopes}
        visibleScopeIds={visibleScopeIds}
        onSaveVisibleScopeIds={handleSaveVisibleScopeIds}
        initialTab={configuratorInitialTab}
        selectedScopeId={configuratorSelectedId}
        onSelectScopeId={(id) => setConfiguratorSelectedId(id)}
        onSavePreferences={handleSavePreferences}
        onCreateScope={handleCreateScope}
        onDeleteScope={handleDeleteScope}
        onOpenSaveVersionModal={() => setIsSaveVersionModalOpen(true)}
      />

      {/* Gestor de Sesiones */}
      <SessionSelectorModal
        isOpen={isSaveVersionModalOpen}
        onClose={() => setIsSaveVersionModalOpen(false)}
        visibleScopeIds={visibleScopeIds}
        preferencesMap={preferencesMap}
        scopes={scopes}
        onApplySession={(session) => {
          setVisibleScopeIds(session.visibleScopeIds);
          setPreferencesMap(session.preferencesMap);
          if (session.scopes && session.scopes.length > 0) {
            setScopes(session.scopes);
          }
          setActiveVersionName(session.name);
        }}
      />
    </div>
  );
};

export default App;
