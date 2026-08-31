import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScopeGrid } from './components/ScopeGrid';
import { PreferencesConfigurator } from './components/PreferencesConfigurator';
import { BriefingPlayer } from './components/BriefingPlayer';
import { NewsFeed } from './components/NewsFeed';
import { storageService } from './services/storageService';
import { newsService } from './services/newsService';
import type { ScopeDefinition, ScopePreferences, BriefingResult } from './types';
import { Sparkles, ArrowDown, Sliders, PlusCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [scopes, setScopes] = useState<ScopeDefinition[]>([]);
  const [visibleScopeIds, setVisibleScopeIds] = useState<string[]>([]);
  const [preferencesMap, setPreferencesMap] = useState<Record<string, ScopePreferences>>({});
  const [activeScope, setActiveScope] = useState<ScopeDefinition | null>(null);
  
  // Estado del Configurador de Preferencias
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState<boolean>(false);
  const [configuratorSelectedId, setConfiguratorSelectedId] = useState<string | null>(null);
  const [configuratorInitialTab, setConfiguratorInitialTab] = useState<'selector' | 'edit' | 'create'>('selector');

  const [currentBriefing, setCurrentBriefing] = useState<BriefingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string>('');

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

    // Activar por defecto la primera categoría visible
    const initial = loadedScopes.find((s) => loadedVisibleIds.includes(s.id)) || loadedScopes[0];
    if (initial) {
      handleGenerateBriefing(initial, loadedPrefs[initial.id] || initial.defaultPreferences, false);
    }
  }, []);

  const handleGenerateBriefing = async (
    scope: ScopeDefinition,
    prefs?: ScopePreferences,
    triggerSpeech: boolean = true
  ) => {
    setIsLoading(true);
    setActiveScope(scope);
    const activePrefs = prefs || preferencesMap[scope.id] || scope.defaultPreferences;

    try {
      const result = await newsService.generateBriefing(scope.id, activePrefs, scope.name);
      setCurrentBriefing(result);
      if (triggerSpeech && result.audioScript) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('briefing-auto-play'));
        }, 300);
      }
    } catch (err) {
      console.error('Error generating briefing:', err);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Cabecera con Reloj de Cuenta Atrás y Acceso al Configurador */}
      <Header 
        onVoiceCommand={handleVoiceCommand} 
        onOpenConfigurator={() => handleOpenConfigurator()} 
        statusText={voiceNotice}
        scopes={scopes}
        preferencesMap={preferencesMap}
        visibleScopeIds={visibleScopeIds}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Banner de Bienvenida y Acceso Directo al Configurador */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Asistente Personalizado de Noticias por Voz</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Locución de actualidad y titulares al instante.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Escucha el resumen oficial de cada ámbito o utiliza el <strong>Configurador de Preferencias</strong> para añadir categorías, configurar tu hora de búsqueda y definir hasta <strong>20 etiquetas específicas</strong>.
              </p>
            </div>

            <div className="flex sm:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenConfigurator()}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition"
              >
                <Sliders className="w-4 h-4" />
                <span>Configurador de Preferencias</span>
              </button>

              <button
                onClick={() => {
                  handleOpenConfigurator();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Crear Categoría</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Categorías y Botones de Ámbito */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Tus Categorías Activas en la Web:
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                {scopes.filter((s) => visibleScopeIds.includes(s.id)).length} de {scopes.length}
              </span>
            </div>

            <button
              onClick={() => handleOpenConfigurator(undefined, 'selector')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition"
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
            onSelectScope={(scope) => handleGenerateBriefing(scope, undefined, true)}
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
      />
    </div>
  );
};

export default App;
