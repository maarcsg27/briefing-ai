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
import { Sparkles, ArrowDown, Sliders, Radio, Library, Key, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'briefings' | 'library'>('briefings');
  const [scopes, setScopes] = useState<ScopeDefinition[]>([]);
  const [visibleScopeIds, setVisibleScopeIds] = useState<string[]>([]);
  const [preferencesMap, setPreferencesMap] = useState<Record<string, ScopePreferences>>({});
  const [activeScope, setActiveScope] = useState<ScopeDefinition | null>(null);

  // ...
  // Line 298
          <LibraryManager
            scopes={scopes}
            preferencesMap={preferencesMap}
            onUpdatePreferences={(_scopeId, updated) => handleSavePreferences(updated)}
            onUpdateScopes={() => setScopes(storageService.getAllScopes())}
          />
  
  // Estado del Configurador de Preferencias
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState<boolean>(false);
  const [configuratorSelectedId, setConfiguratorSelectedId] = useState<string | null>(null);
  const [configuratorInitialTab, setConfiguratorInitialTab] = useState<'selector' | 'edit' | 'create'>('selector');

  const [currentBriefing, setCurrentBriefing] = useState<BriefingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string>('');
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

    // Activar por defecto la primera categoría visible y comprobar si tiene caché del día
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

  // Comprobación automática cada minuto: si la hora actual coincide con la hora marcada de una categoría activa, actualizar automáticamente
  useEffect(() => {
    const checkScheduledAutoUpdate = () => {
      const now = new Date();
      const currentHHMM = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      // Revisar categorías visibles
      const activeScopes = scopes.filter((s) => visibleScopeIds.length === 0 || visibleScopeIds.includes(s.id));
      for (const s of activeScopes) {
        const prefs = preferencesMap[s.id] || s.defaultPreferences;
        if (prefs.preferredTime === currentHHMM) {
          // Comprobar si ya se actualizó hoy a esta hora
          const today = now.toISOString().slice(0, 10);
          const autoKey = `auto_updated_${s.id}_${today}_${currentHHMM}`;
          if (!sessionStorage.getItem(autoKey)) {
            sessionStorage.setItem(autoKey, 'true');
            console.log(`[Auto-Update] Hora marcada cumplida para ${s.name} (${currentHHMM}). Actualizando noticias 24h...`);
            handleGenerateBriefing(s, prefs, true, true);
            break;
          }
        }
      }
    };

    const timer = setInterval(checkScheduledAutoUpdate, 15000); // comprobar cada 15s
    return () => clearInterval(timer);
  }, [scopes, visibleScopeIds, preferencesMap]);

  // Función para ejecutar la búsqueda exhaustiva de las últimas 24h
  const handleGenerateBriefing = async (
    scope: ScopeDefinition,
    prefs?: ScopePreferences,
    triggerSpeech: boolean = true,
    forceFresh: boolean = false
  ) => {
    setIsLoading(true);
    setActiveScope(scope);
    const activePrefs = prefs || preferencesMap[scope.id] || scope.defaultPreferences;

    // Si no es forzado, revisar si ya tenemos el briefing de hoy en caché
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
      setSyncStatus(`Rastreando noticias de las últimas 24h en ${scope.name}...`);
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
    } catch (err) {
      console.error('Error generating briefing:', err);
      setSyncStatus('Error al conectar con algunas fuentes de noticias. Mostrando datos de respaldo.');
      setTimeout(() => setSyncStatus(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Forzar actualización exhaustiva de todas las categorías visibles
  const handleTriggerFullSync = async () => {
    if (!activeScope) return;
    handleGenerateBriefing(activeScope, preferencesMap[activeScope.id], false, true);
  };

  // Abrir el configurador centrado en una categoría específica o en una pestaña específica
  const handleOpenConfigurator = (scope?: ScopeDefinition, tab: 'selector' | 'edit' | 'create' = 'selector') => {
    if (scope) {
      setConfiguratorSelectedId(scope.id);
      setConfiguratorInitialTab('edit');
    } else {
      if (scopes.length > 0) setConfiguratorSelectedId(scopes[0].id);
      setConfiguratorInitialTab(tab);
    }
    setIsConfiguratorOpen(true);
  };

  // Guardar qué categorías son visibles en toda la web
  const handleSaveVisibleScopeIds = (newVisibleIds: string[]) => {
    storageService.saveVisibleScopeIds(newVisibleIds);
    setVisibleScopeIds(newVisibleIds);

    // Si el ámbito activo se ocultó, cambiar al primer visible disponible
    if (activeScope && !newVisibleIds.includes(activeScope.id)) {
      const nextScope = scopes.find((s) => newVisibleIds.includes(s.id));
      if (nextScope) {
        handleGenerateBriefing(nextScope, preferencesMap[nextScope.id], false);
      }
    }
  };

  // Guardar preferencias y descripción de categoría
  const handleSavePreferences = (newPrefs: ScopePreferences, updatedScope?: ScopeDefinition) => {
    storageService.savePreferences(newPrefs);
    setPreferencesMap((prev) => ({
      ...prev,
      [newPrefs.scopeId]: newPrefs,
    }));

    if (updatedScope) {
      const updatedList = storageService.updateScope(updatedScope);
      setScopes(updatedList);
      if (activeScope && activeScope.id === updatedScope.id) {
        setActiveScope(updatedScope);
      }
    }

    // Regenerar si es el ámbito que está en pantalla
    if (activeScope && activeScope.id === newPrefs.scopeId) {
      const currentDef = updatedScope || activeScope;
      handleGenerateBriefing(currentDef, newPrefs, false);
    }
  };

  // Crear nueva categoría dinámica
  const handleCreateScope = (newScope: ScopeDefinition) => {
    const updated = storageService.addScope(newScope);
    setScopes(updated);
    setPreferencesMap((prev) => ({
      ...prev,
      [newScope.id]: newScope.defaultPreferences,
    }));
    setConfiguratorSelectedId(newScope.id);
    // Cambiar al nuevo ámbito
    handleGenerateBriefing(newScope, newScope.defaultPreferences, false);
  };

  // Eliminar categoría personalizada
  const handleDeleteScope = (scopeId: string) => {
    const updated = storageService.deleteScope(scopeId);
    setScopes(updated);
    if (updated.length > 0) {
      setConfiguratorSelectedId(updated[0].id);
      if (activeScope?.id === scopeId) {
        handleGenerateBriefing(updated[0], undefined, false);
      }
    }
  };

  // Manejo de comandos por voz
  const handleVoiceCommand = (command: string) => {
    const cmdLower = command.toLowerCase();
    setVoiceNotice(`Comando de voz recibido: "${command}"`);

    const matchedScope = scopes.find((s) => {
      const nameMatch = cmdLower.includes(s.name.toLowerCase());
      const labelMatch = cmdLower.includes(s.id.toLowerCase());
      return nameMatch || labelMatch;
    });

    if (matchedScope) {
      handleGenerateBriefing(matchedScope, preferencesMap[matchedScope.id], true);
    } else {
      setVoiceNotice(`No se reconoció el ámbito en: "${command}". Puedes elegirlo en la pantalla.`);
    }

    setTimeout(() => setVoiceNotice(''), 6000);
  };

  // Estado para Modal de Guardar Versión / Perfil de Configuración
  const [isSaveVersionModalOpen, setIsSaveVersionModalOpen] = useState(false);
  const [activeVersionName, setActiveVersionName] = useState<string | null>(null);

  useEffect(() => {
    const info = storageService.getActiveVersionInfo();
    setActiveVersionName(info ? info.name : null);
  }, [isSaveVersionModalOpen]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Cabecera con Reloj de Cuenta Atrás y Acceso al Configurador */}
      <Header 
        onVoiceCommand={handleVoiceCommand} 
        onOpenConfigurator={() => handleOpenConfigurator()} 
        onOpenSaveVersionModal={() => setIsSaveVersionModalOpen(true)}
        onTriggerSync={handleTriggerFullSync}
        isSyncing={isLoading}
        statusText={syncStatus || voiceNotice}
        scopes={scopes}
        preferencesMap={preferencesMap}
        visibleScopeIds={visibleScopeIds}
        activeVersionName={activeVersionName}
      />

      {/* Contenedor Principal Adaptativo */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* NAVEGACIÓN SUPERIOR DE PESTAÑAS: BRIEFINGS vs BIBLIOTECA & IA */}
        <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('briefings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'briefings'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-300" />
            <span>Briefings & Noticias</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Library className="w-4 h-4 text-indigo-300" />
            <span>Biblioteca de Temáticas & Fuentes (IA)</span>
          </button>
        </div>

        {/* VISTA 1: BIBLIOTECA DE TEMÁTICAS Y DESCUBRIMIENTO POR IA */}
        {activeTab === 'library' ? (
          <LibraryManager
            scopes={scopes}
            preferencesMap={preferencesMap}
            onUpdatePreferences={(_scopeId, updated) => handleSavePreferences(updated)}
            onUpdateScopes={() => setScopes(storageService.getAllScopes())}
          />
        ) : (
          /* VISTA 2: BRIEFINGS DIARIOS Y NOTICIAS EN VIVO */
          <>
            {/* Banner de Bienvenida y Acceso Directo al Configurador */}
            <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2.5 sm:mb-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Búsqueda Exhaustiva 24h & Locución</span>
                    </div>

                    {geminiService.hasValidKey() ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] sm:text-xs font-semibold">
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Gemini 2.5 Flash IA Activo</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveTab('library')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-semibold transition"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span>Activar Gemini API Key para Resúmenes por IA ➔</span>
                      </button>
                    )}

                    {lastSyncTime && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] sm:text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Actualizado hoy {lastSyncTime}</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                    Lo más relevante de las últimas 24 horas.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Rastreo continuo de medios oficiales y sintesis avanzada por IA. Las noticias se priorizan primero según tus <strong>etiquetas configuradas</strong> con resúmenes explicativos de 3 a 5 líneas.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('library')}
                    className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition w-full sm:w-auto"
                  >
                    <Library className="w-4 h-4" />
                    <span>Biblioteca & Fuentes IA</span>
                  </button>

                  <button
                    onClick={() => handleOpenConfigurator()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition w-full sm:w-auto"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ajustes Rápidos</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sección de Categorías y Botones de Ámbito */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
                    Tus Categorías Activas en la Web:
                  </h3>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                    {scopes.filter((s) => visibleScopeIds.includes(s.id)).length} de {scopes.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenConfigurator(undefined, 'selector')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition self-start sm:self-auto"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Personalizar qué categorías mostrar</span>
                </button>
              </div>

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

            {/* Separador Visual */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
              <ArrowDown className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Resumen de voz y titulares verificados del momento</span>
            </div>

            {/* Sección de Resultados: Reproductor de Voz + Feed de Noticias */}
            {currentBriefing && (
              <section className="space-y-6 animate-fadeIn">
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <p>
          BriefingAI • Búsquedas especializadas en páginas oficiales y organismos acreditados.
        </p>
      </footer>

      {/* Configurador Integral de Preferencias */}
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

      {/* Gestor y Selección de Sesiones / Perfiles de Configuración */}
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
