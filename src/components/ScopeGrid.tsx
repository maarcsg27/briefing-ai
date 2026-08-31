import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Building2, 
  Cpu, 
  Settings, 
  Play, 
  Tag, 
  Globe, 
  Clock, 
  Sparkles,
  Loader2
} from 'lucide-react';
import type { ScopeDefinition, ScopePreferences } from '../types';

interface ScopeGridProps {
  scopes: ScopeDefinition[];
  preferencesMap: Record<string, ScopePreferences>;
  activeScopeId: string | null;
  isLoading: boolean;
  onSelectScope: (scope: ScopeDefinition) => void;
  onOpenPreferences: (scope: ScopeDefinition) => void;
}

export const ScopeGrid: React.FC<ScopeGridProps> = ({
  scopes,
  preferencesMap,
  activeScopeId,
  isLoading,
  onSelectScope,
  onOpenPreferences,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {scopes.map((scope) => {
        const prefs = preferencesMap[scope.id] || scope.defaultPreferences;
        const isActive = activeScopeId === scope.id;
        const isCurrentLoading = isLoading && isActive;

        return (
          <div
            key={scope.id}
            className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              isActive
                ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Cabecera de la tarjeta */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: scope.color }}
                >
                  {getIcon(scope.icon)}
                </div>

                {/* Botón de Ajustes / Preferencias de Ámbito */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPreferences(scope);
                  }}
                  title={`Configurar etiquetas y filtros de ${scope.name}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition"
                >
                  <Settings className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px]">Preferencias</span>
                </button>
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {scope.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {scope.description}
              </p>

              {/* Indicadores de configuración activa */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                
                {/* Ámbito Geográfico y Hora */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-400" />
                    <span className="capitalize">{prefs.geographicScope} ({prefs.country})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{prefs.preferredTime} h</span>
                  </span>
                </div>

                {/* Tags personalizadas activas */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3 h-3 text-emerald-400 shrink-0" />
                  {prefs.tags.length === 0 ? (
                    <span className="text-[11px] text-slate-500 italic">Sin etiquetas</span>
                  ) : (
                    prefs.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-full border border-slate-700/60 truncate max-w-[90px]"
                      >
                        #{tag}
                      </span>
                    ))
                  )}
                  {prefs.tags.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      +{prefs.tags.length - 3}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Botón Principal: "Actualización de [Ámbito]" */}
            <div className="p-4 bg-slate-950/40 border-t border-slate-800/60">
              <button
                onClick={() => onSelectScope(scope)}
                disabled={isLoading}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  isActive
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                    : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-transparent'
                }`}
              >
                {isCurrentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Buscando en webs oficiales...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{scope.label}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
};
