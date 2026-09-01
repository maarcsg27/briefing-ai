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
  onSelectScope,
  onOpenPreferences,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-4 h-4" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4" />;
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Brain':
        return <Brain className="w-4 h-4" />;
      case 'Activity':
        return <Activity className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'Palette':
        return <Palette className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Título de Sección Editorial */}
      <div className="flex items-center justify-between border-b border-paper-750 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
            Temáticas & Secciones Editoriales
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {scopes.length} secciones activas
        </span>
      </div>

      {/* Pestañas / Tiras Editoriales de Selección */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {scopes.map((scope) => {
          const prefs = preferencesMap[scope.id] || scope.defaultPreferences;
          const isActive = activeScopeId === scope.id;

          return (
            <div
              key={scope.id}
              onClick={() => onSelectScope(scope)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition cursor-pointer group shrink-0 ${
                isActive
                  ? 'bg-paper-850 border-emerald-500/60 text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-paper-900/80 hover:bg-paper-850 border-paper-750 text-slate-300 hover:text-white'
              }`}
            >
              <span
                className={`w-6 h-6 rounded flex items-center justify-center text-white transition ${
                  isActive ? 'bg-emerald-600' : 'bg-paper-750 group-hover:bg-paper-700'
                }`}
              >
                {getIcon(scope.icon)}
              </span>

              <div className="flex flex-col text-left">
                <span className="font-serif text-sm font-semibold tracking-tight leading-none text-slate-100">
                  {scope.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {prefs.tags?.length || 0} etiquetas
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPreferences(scope);
                }}
                title={`Ajustes de ${scope.name}`}
                className="ml-1 p-1 rounded hover:bg-paper-700 text-slate-400 hover:text-white transition"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
