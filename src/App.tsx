import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScopeGrid } from './components/ScopeGrid';
import { PreferencesModal } from './components/PreferencesModal';
import { BriefingPlayer } from './components/BriefingPlayer';
import { NewsFeed } from './components/NewsFeed';
import { storageService } from './services/storageService';
import { newsService } from './services/newsService';
import type { ScopeDefinition, ScopePreferences, BriefingResult } from './types';
import { Sparkles, ArrowDown } from 'lucide-react';

export const App: React.FC = () => {
  const [scopes] = useState<ScopeDefinition[]>(storageService.getAllScopes());
  const [preferencesMap, setPreferencesMap] = useState<Record<string, ScopePreferences>>({});
  const [activeScope, setActiveScope] = useState<ScopeDefinition | null>(null);
  const [modalScope, setModalScope] = useState<ScopeDefinition | null>(null);
  const [currentBriefing, setCurrentBriefing] = useState<BriefingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string>('');

  // Cargar preferencias iniciales al montar
  useEffect(() => {
    const loaded: Record<string, ScopePreferences> = {};
    scopes.forEach((s) => {
      loaded[s.id] = storageService.getPreferences(s.id);
    });
    setPreferencesMap(loaded);

    // Seleccionar fútbol por defecto para mostrar contenido inmediato
    const defaultScope = scopes[0];
    if (defaultScope) {
      handleGenerateBriefing(defaultScope, loaded[defaultScope.id] || defaultScope.defaultPreferences, false);
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
        // En reproducción interactiva, iniciamos con un breve retardo natural
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

  const handleOpenPreferences = (scope: ScopeDefinition) => {
    setModalScope(scope);
  };

  const handleSavePreferences = (newPrefs: ScopePreferences) => {
    storageService.savePreferences(newPrefs);
    setPreferencesMap((prev) => ({
      ...prev,
      [newPrefs.scopeId]: newPrefs,
    }));

    // Si el ámbito modificado es el que está activo actualmente, regenerar el briefing
    if (activeScope && activeScope.id === newPrefs.scopeId) {
      handleGenerateBriefing(activeScope, newPrefs, false);
    }
  };

  // Manejo de comandos por voz
  const handleVoiceCommand = (command: string) => {
    const cmdLower = command.toLowerCase();
    setVoiceNotice(`Comando de voz recibido: "${command}"`);

    let targetScope: ScopeDefinition | undefined;

    if (cmdLower.includes('fútbol') || cmdLower.includes('futbol') || cmdLower.includes('deporte')) {
      targetScope = scopes.find((s) => s.id === 'futbol');
    } else if (cmdLower.includes('finanza') || cmdLower.includes('economía') || cmdLower.includes('bolsa')) {
      targetScope = scopes.find((s) => s.id === 'finanzas');
    } else if (cmdLower.includes('política') || cmdLower.includes('politica') || cmdLower.includes('congreso')) {
      targetScope = scopes.find((s) => s.id === 'politica');
    } else if (cmdLower.includes('tecnología') || cmdLower.includes('tecnologia') || cmdLower.includes('ia')) {
      targetScope = scopes.find((s) => s.id === 'tecnologia');
    }

    if (targetScope) {
      handleGenerateBriefing(targetScope, preferencesMap[targetScope.id], true);
    } else {
      setVoiceNotice(`No se reconoció el ámbito en: "${command}". Prueba diciendo: "Actualización de Fútbol"`);
    }

    setTimeout(() => setVoiceNotice(''), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Cabecera y Micrófono */}
      <Header onVoiceCommand={handleVoiceCommand} statusText={voiceNotice} />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Banner de Bienvenida & Explicación Rápida */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tu Asistente Personal de Noticias Filtradas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Locución de actualidad y titulares al instante.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pulsa el botón del ámbito que desees o personaliza tus <strong>etiquetas de interés</strong> (equipos, jugadores, empresas, índices) para que el asistente rastree exclusivamente noticias en <strong>webs y páginas oficiales</strong>.
            </p>
          </div>
        </div>

        {/* Sección de Botones de Ámbitos y Preferencias */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Selecciona un ámbito para escuchar su actualización:
            </h3>
            <span className="text-xs text-slate-500 hidden sm:inline">
              ⚙️ Pulsa "Preferencias" para añadir tus etiquetas
            </span>
          </div>

          <ScopeGrid
            scopes={scopes}
            preferencesMap={preferencesMap}
            activeScopeId={activeScope?.id || null}
            isLoading={isLoading}
            onSelectScope={(scope) => handleGenerateBriefing(scope, undefined, true)}
            onOpenPreferences={handleOpenPreferences}
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
            
            {/* 1. Reproductor de Audio del Asistente */}
            <BriefingPlayer briefing={currentBriefing} autoPlay={false} />

            {/* 2. Resumen Escrito y Titulares con Fuentes Oficiales */}
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

      {/* Modal de Preferencias (Etiquetas, Geografía, Hora, Fuentes) */}
      {modalScope && (
        <PreferencesModal
          scope={modalScope}
          initialPreferences={
            preferencesMap[modalScope.id] || modalScope.defaultPreferences
          }
          isOpen={!!modalScope}
          onClose={() => setModalScope(null)}
          onSave={handleSavePreferences}
        />
      )}
    </div>
  );
};

export default App;
