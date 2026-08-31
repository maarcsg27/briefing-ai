import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Building2, 
  Cpu, 
  Brain,
  Activity,
  Compass,
  Briefcase,
  Palette,
  Settings, 
  Tag, 
  Globe, 
  Clock, 
  Sparkles
} from 'lucide-react';
import type { ScopeDefinition, ScopePreferences } from '../types';

interface ScopeGridProps {
  scopes: ScopeDefinition[];
  preferencesMap: Record<string, ScopePreferences>;
  activeScopeId: string | null;
  isLoading: boolean;
  onSelectScope: (scope: ScopeDefinition) => void;
  onOpenPreferences: (scope: ScopeDefinition) => void;
  onAddNewScope?: () => void;
}

export const ScopeGrid: React.FC<ScopeGridProps> = ({
  scopes,
  preferencesMap,
  activeScopeId,
  isLoading,
  onSelectScope,
  onOpenPreferences,
  onAddNewScope,
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
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
      {scopes.map((scope) => {
        const prefs = preferencesMap[scope.id] || scope.defaultPreferences;
        const isActive = activeScopeId === scope.id;

        return (
          <div
            key={scope.id}
            onClick={() => onSelectScope(scope)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectScope(scope);
              }
            }}
            className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group ${
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
                
                {/* Ámbito Geográfico, Hora y Límite de Noticias */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <Globe className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="capitalize truncate">{prefs.geographicScope}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{prefs.preferredTime}h</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono" title="Límite de noticias">
                      {prefs.maxNewsLimit || 5} notic.
                    </span>
                  </div>
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

            {/* Pie de tarjeta: Indicador informativo de hora de actualización programada */}
            <div className="p-3.5 bg-slate-950/50 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Actualización automática: <strong>{prefs.preferredTime}h</strong></span>
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isActive 
                  ? isLoading
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-500 group-hover:text-slate-300'
              }`}>
                {isActive ? (isLoading ? 'Actualizando...' : 'En pantalla') : 'Ver noticias'}
              </span>
            </div>

          </div>
        );
      })}

      {/* Tarjeta para Crear Nueva Categoría */}
      {onAddNewScope && (
        <button
          type="button"
          onClick={onAddNewScope}
          className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-900/30 hover:bg-slate-900/60 p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-emerald-300 transition-all min-h-[220px] group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 border border-slate-700 group-hover:border-emerald-500/40 transition">
            <span className="text-2xl font-bold">+</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-bold text-slate-200 group-hover:text-emerald-300 block mb-0.5">
              Crear Categoría
            </span>
            <span className="text-xs text-slate-500 group-hover:text-slate-400">
              Personaliza nombre, descripción, hora y hasta 20 etiquetas
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
