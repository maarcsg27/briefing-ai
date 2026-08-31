import type { ScopeDefinition, ScopePreferences } from '../types';

export const DEFAULT_SCOPES: ScopeDefinition[] = [
  {
    id: 'futbol',
    name: 'Fútbol',
    label: 'Actualización de Fútbol',
    icon: 'Trophy',
    color: '#10B981', // Emerald
    accentGradient: 'from-emerald-500 to-teal-700',
    description: 'Resultados, fichajes, competiciones nacionales e internacionales y ruedas de prensa.',
    defaultPreferences: {
      scopeId: 'futbol',
      geographicScope: 'nacional',
      country: 'España',
      city: 'Madrid',
      preferredTime: '08:30',
      tags: ['Real Madrid', 'Champions League', 'LaLiga', 'Mbappé', 'FC Barcelona'],
      sources: [
        { id: 'marca', name: 'Marca', domain: 'marca.com', enabled: true, isOfficial: true, category: 'Deportivo Nacional' },
        { id: 'as', name: 'Diario AS', domain: 'as.com', enabled: true, isOfficial: true, category: 'Deportivo Nacional' },
        { id: 'relevo', name: 'Relevo', domain: 'relevo.com', enabled: true, isOfficial: true, category: 'Deportivo Digital' },
        { id: 'laliga', name: 'LaLiga Oficial', domain: 'laliga.com', enabled: true, isOfficial: true, category: 'Organismo Oficial' },
        { id: 'uefa', name: 'UEFA Oficial', domain: 'uefa.com', enabled: true, isOfficial: true, category: 'Organismo Internacional' },
        { id: 'bbc_sport', name: 'BBC Sport Football', domain: 'bbc.com/sport/football', enabled: true, isOfficial: true, category: 'Internacional' },
      ],
    },
  },
  {
    id: 'finanzas',
    name: 'Finanzas & Economía',
    label: 'Actualización de Finanzas',
    icon: 'TrendingUp',
    color: '#3B82F6', // Blue
    accentGradient: 'from-blue-600 to-indigo-800',
    description: 'Bolsas mundiales, tipos de interés, empresas cotizadas, divisas e inflación.',
    defaultPreferences: {
      scopeId: 'finanzas',
      geographicScope: 'internacional',
      country: 'España',
      city: '',
      preferredTime: '08:00',
      tags: ['IBEX 35', 'BCE', 'Tipos de interés', 'Wall Street', 'Nvidia'],
      sources: [
        { id: 'expansion', name: 'Expansión', domain: 'expansion.com', enabled: true, isOfficial: true, category: 'Financiero Nacional' },
        { id: 'cincodias', name: 'Cinco Días', domain: 'cincodias.elpais.com', enabled: true, isOfficial: true, category: 'Financiero Nacional' },
        { id: 'bloomberg', name: 'Bloomberg', domain: 'bloomberg.com', enabled: true, isOfficial: true, category: 'Financiero Global' },
        { id: 'reuters_biz', name: 'Reuters Business', domain: 'reuters.com/business', enabled: true, isOfficial: true, category: 'Agencia Oficial' },
        { id: 'ft', name: 'Financial Times', domain: 'ft.com', enabled: true, isOfficial: true, category: 'Financiero Internacional' },
        { id: 'bme', name: 'BME Bolsas y Mercados', domain: 'bolsasymercados.es', enabled: true, isOfficial: true, category: 'Organismo Oficial' },
      ],
    },
  },
  {
    id: 'politica',
    name: 'Política & Sociedad',
    label: 'Actualización de Política',
    icon: 'Building2',
    color: '#8B5CF6', // Purple
    accentGradient: 'from-purple-600 to-indigo-900',
    description: 'Legislación, acuerdos de gobierno, relaciones internacionales y decisiones públicas.',
    defaultPreferences: {
      scopeId: 'politica',
      geographicScope: 'nacional',
      country: 'España',
      city: 'Madrid',
      preferredTime: '09:00',
      tags: ['Congreso', 'Unión Europea', 'Elecciones', 'Presupuestos'],
      sources: [
        { id: 'efe', name: 'Agencia EFE', domain: 'efe.com', enabled: true, isOfficial: true, category: 'Agencia Estatal Oficial' },
        { id: 'europapress', name: 'Europa Press', domain: 'europapress.es', enabled: true, isOfficial: true, category: 'Agencia Nacional' },
        { id: 'reuters_pol', name: 'Reuters World', domain: 'reuters.com/world', enabled: true, isOfficial: true, category: 'Agencia Internacional' },
        { id: 'boe', name: 'BOE (Boletín Oficial del Estado)', domain: 'boe.es', enabled: true, isOfficial: true, category: 'Fuente Oficial de Estado' },
        { id: 'elpais', name: 'El País (Sección Política)', domain: 'elpais.com', enabled: true, isOfficial: true, category: 'Prensa General' },
      ],
    },
  },
  {
    id: 'tecnologia',
    name: 'Tecnología & IA',
    label: 'Actualización de Tecnología',
    icon: 'Cpu',
    color: '#F59E0B', // Amber/Orange
    accentGradient: 'from-amber-500 to-rose-600',
    description: 'Inteligencia Artificial, gadgets, innovación científica, ciberseguridad y lanzamientos.',
    defaultPreferences: {
      scopeId: 'tecnologia',
      geographicScope: 'internacional',
      country: 'Global',
      city: '',
      preferredTime: '09:30',
      tags: ['Inteligencia Artificial', 'Gemini', 'OpenAI', 'Ciberseguridad', 'Smartphones'],
      sources: [
        { id: 'xataka', name: 'Xataka', domain: 'xataka.com', enabled: true, isOfficial: true, category: 'Tecnología Hispana' },
        { id: 'theverge', name: 'The Verge', domain: 'theverge.com', enabled: true, isOfficial: true, category: 'Tecnología Global' },
        { id: 'techcrunch', name: 'TechCrunch', domain: 'techcrunch.com', enabled: true, isOfficial: true, category: 'Startups y Tech' },
        { id: 'wired', name: 'Wired', domain: 'wired.com', enabled: true, isOfficial: true, category: 'Análisis Tecnológico' },
        { id: 'ars', name: 'Ars Technica', domain: 'arstechnica.com', enabled: true, isOfficial: true, category: 'Especializado en Software y Hard' },
      ],
    },
  },
];

const SCOPES_LIST_KEY = 'briefing_ai_scopes_catalog_v2';
const PREFERENCES_STORAGE_KEY = 'briefing_ai_preferences_v2';

export const storageService = {
  getAllScopes(): ScopeDefinition[] {
    try {
      const stored = localStorage.getItem(SCOPES_LIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading scopes catalog:', e);
    }
    // Guardar por defecto si no existía
    this.saveAllScopes(DEFAULT_SCOPES);
    return DEFAULT_SCOPES;
  },

  saveAllScopes(scopes: ScopeDefinition[]): void {
    try {
      localStorage.setItem(SCOPES_LIST_KEY, JSON.stringify(scopes));
    } catch (e) {
      console.error('Error saving scopes catalog:', e);
    }
  },

  addScope(newScope: ScopeDefinition): ScopeDefinition[] {
    const existing = this.getAllScopes();
    const updated = [...existing, newScope];
    this.saveAllScopes(updated);
    this.savePreferences(newScope.defaultPreferences);
    return updated;
  },

  updateScope(updatedScope: ScopeDefinition): ScopeDefinition[] {
    const existing = this.getAllScopes();
    const updated = existing.map((s) => (s.id === updatedScope.id ? updatedScope : s));
    this.saveAllScopes(updated);
    return updated;
  },

  deleteScope(scopeId: string): ScopeDefinition[] {
    const existing = this.getAllScopes();
    const updated = existing.filter((s) => s.id !== scopeId);
    this.saveAllScopes(updated);
    try {
      localStorage.removeItem(`${PREFERENCES_STORAGE_KEY}_${scopeId}`);
    } catch (_) {}
    return updated;
  },

  getPreferences(scopeId: string): ScopePreferences {
    try {
      const stored = localStorage.getItem(`${PREFERENCES_STORAGE_KEY}_${scopeId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading preferences for scope:', scopeId, e);
    }

    const all = this.getAllScopes();
    const def = all.find((s) => s.id === scopeId);
    return def ? def.defaultPreferences : {
      scopeId,
      geographicScope: 'nacional',
      country: 'España',
      city: '',
      preferredTime: '08:30',
      tags: [],
      sources: [],
    };
  },

  savePreferences(preferences: ScopePreferences): void {
    try {
      // Limitar a máximo 20 etiquetas por seguridad y requerimiento
      const sanitized = {
        ...preferences,
        tags: preferences.tags.slice(0, 20),
      };
      localStorage.setItem(
        `${PREFERENCES_STORAGE_KEY}_${sanitized.scopeId}`,
        JSON.stringify(sanitized)
      );
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  },
};
