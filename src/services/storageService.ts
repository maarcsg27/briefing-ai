import type { ScopeDefinition, ScopePreferences, ScopeSource } from '../types';

export const DEFAULT_SCOPES: ScopeDefinition[] = [
  {
    id: 'crecimiento-personal',
    name: 'Crecimiento Personal & Psicología',
    label: 'Actualización de Psicología y Desarrollo',
    icon: 'Brain',
    color: '#EC4899',
    accentGradient: 'from-pink-600 to-rose-800',
    description: 'Sesgos cognitivos, gestión del tiempo, comunicación asertiva, inteligencia emocional y hábitos atómicos.',
    defaultPreferences: {
      scopeId: 'crecimiento-personal',
      geographicScope: 'internacional',
      country: 'Global',
      city: '',
      preferredTime: '07:30',
      tags: ['Sesgos cognitivos', 'Gestión del tiempo', 'Comunicación asertiva', 'Inteligencia emocional', 'Hábitos atómicos'],
      sources: [
        { id: 'psicologiaymente', name: 'Psicología y Mente', domain: 'psicologiaymente.com', enabled: true, isOfficial: true, category: 'Divulgación Psicología' },
        { id: 'psychologytoday', name: 'Psychology Today', domain: 'psychologytoday.com', enabled: true, isOfficial: true, category: 'Psicología Internacional' },
        { id: 'jamesclear', name: 'James Clear Blog', domain: 'jamesclear.com', enabled: true, isOfficial: true, category: 'Desarrollo Personal' },
      ],
    },
  },
  {
    id: 'finanzas',
    name: 'Finanzas & Inversión',
    label: 'Actualización de Finanzas',
    icon: 'TrendingUp',
    color: '#3B82F6',
    accentGradient: 'from-blue-600 to-indigo-800',
    description: 'Fondos indexados, ahorro sistemático, reducción de deuda, fiscalidad doméstica y criptoactivos.',
    defaultPreferences: {
      scopeId: 'finanzas',
      geographicScope: 'internacional',
      country: 'España',
      city: '',
      preferredTime: '08:00',
      tags: ['Fondos indexados', 'Ahorro sistemático', 'Reducción de deuda', 'Fiscalidad doméstica', 'Criptoactivos'],
      sources: [
        { id: 'rankia', name: 'Rankia', domain: 'rankia.com', enabled: true, isOfficial: true, category: 'Comunidad Inversora' },
        { id: 'balio', name: 'Balio', domain: 'balio.app', enabled: true, isOfficial: true, category: 'Finanzas Personales' },
        { id: 'expansion', name: 'Expansión', domain: 'expansion.com', enabled: true, isOfficial: true, category: 'Financiero Nacional' },
        { id: 'cincodias', name: 'Cinco Días', domain: 'cincodias.elpais.com', enabled: true, isOfficial: true, category: 'Financiero Nacional' },
        { id: 'coindesk', name: 'CoinDesk', domain: 'coindesk.com', enabled: true, isOfficial: true, category: 'Criptoactivos' },
      ],
    },
  },
  {
    id: 'tecnologia',
    name: 'Tecnología & Innovación',
    label: 'Actualización de Tecnología',
    icon: 'Cpu',
    color: '#F59E0B',
    accentGradient: 'from-amber-500 to-rose-600',
    description: 'Automatización, privacidad digital, inteligencia artificial, ciberseguridad y domótica.',
    defaultPreferences: {
      scopeId: 'tecnologia',
      geographicScope: 'internacional',
      country: 'Global',
      city: '',
      preferredTime: '09:30',
      tags: ['Automatización', 'Privacidad digital', 'Inteligencia artificial', 'Ciberseguridad', 'Domótica'],
      sources: [
        { id: 'xataka', name: 'Xataka', domain: 'xataka.com', enabled: true, isOfficial: true, category: 'Tecnología Hispana' },
        { id: 'genbeta', name: 'Genbeta', domain: 'genbeta.com', enabled: true, isOfficial: true, category: 'Software y Web' },
        { id: 'mittech', name: 'MIT Technology Review', domain: 'technologyreview.com', enabled: true, isOfficial: true, category: 'Investigación Tech' },
        { id: 'theverge', name: 'The Verge', domain: 'theverge.com', enabled: true, isOfficial: true, category: 'Tecnología Global' },
        { id: 'techcrunch', name: 'TechCrunch', domain: 'techcrunch.com', enabled: true, isOfficial: true, category: 'Startups y Tech' },
      ],
    },
  },
  {
    id: 'salud-bienestar',
    name: 'Salud & Bienestar',
    label: 'Actualización de Salud',
    icon: 'Activity',
    color: '#10B981',
    accentGradient: 'from-emerald-500 to-teal-700',
    description: 'Entrenamiento de fuerza, meal prep, higiene del sueño, ergonomía y movilidad articular.',
    defaultPreferences: {
      scopeId: 'salud-bienestar',
      geographicScope: 'internacional',
      country: 'Global',
      city: '',
      preferredTime: '08:00',
      tags: ['Entrenamiento de fuerza', 'Meal prep', 'Higiene del sueño', 'Ergonomía', 'Movilidad articular'],
      sources: [
        { id: 'examine', name: 'Examine.com', domain: 'examine.com', enabled: true, isOfficial: true, category: 'Evidencia Científica' },
        { id: 'vitonica', name: 'Vitónica', domain: 'vitonica.com', enabled: true, isOfficial: true, category: 'Salud y Fitness' },
        { id: 'pubmed', name: 'PubMed', domain: 'pubmed.ncbi.nlm.nih.gov', enabled: true, isOfficial: true, category: 'Base Médica Oficial' },
        { id: 'sciencedaily', name: 'ScienceDaily', domain: 'sciencedaily.com', enabled: true, isOfficial: true, category: 'Noticias Científicas' },
      ],
    },
  },
  {
    id: 'ciencia-historia',
    name: 'Ciencia, Historia & Misterio',
    label: 'Actualización de Ciencia e Historia',
    icon: 'Compass',
    color: '#06B6D4',
    accentGradient: 'from-cyan-500 to-blue-700',
    description: 'Civilizaciones antiguas, exploración espacial, mitología, experimentos científicos y arqueología.',
    defaultPreferences: {
      scopeId: 'ciencia-historia',
      geographicScope: 'internacional',
      country: 'Global',
      city: '',
      preferredTime: '10:00',
      tags: ['Civilizaciones antiguas', 'Exploración espacial', 'Mitología', 'Experimentos científicos', 'Arqueología'],
      sources: [
        { id: 'natgeo', name: 'National Geographic', domain: 'nationalgeographic.com', enabled: true, isOfficial: true, category: 'Historia y Naturaleza' },
        { id: 'agenciasinc', name: 'Agencia SINC', domain: 'agenciasinc.es', enabled: true, isOfficial: true, category: 'Ciencia Estatal Oficial' },
        { id: 'naukas', name: 'Naukas', domain: 'naukas.com', enabled: true, isOfficial: true, category: 'Divulgación Científica' },
      ],
    },
  },
  {
    id: 'negocios-carrera',
    name: 'Negocios & Carrera',
    label: 'Actualización de Negocios y Carrera',
    icon: 'Briefcase',
    color: '#6366F1',
    accentGradient: 'from-indigo-600 to-violet-800',
    description: 'Negociación salarial, marca personal, trabajo remoto, emprendimiento digital y gestión de proyectos.',
    defaultPreferences: {
      scopeId: 'negocios-carrera',
      geographicScope: 'internacional',
      country: 'Global',
      city: '',
      preferredTime: '08:45',
      tags: ['Negociación salarial', 'Marca personal', 'Trabajo remoto', 'Emprendimiento digital', 'Gestión de proyectos'],
      sources: [
        { id: 'hbr', name: 'Harvard Business Review', domain: 'hbr.org', enabled: true, isOfficial: true, category: 'Estrategia y Management' },
        { id: 'fastcompany', name: 'Fast Company', domain: 'fastcompany.com', enabled: true, isOfficial: true, category: 'Innovación Empresarial' },
        { id: 'inc', name: 'Inc.', domain: 'inc.com', enabled: true, isOfficial: true, category: 'Emprendimiento' },
        { id: 'hubspot', name: 'HubSpot Blog', domain: 'blog.hubspot.com', enabled: true, isOfficial: true, category: 'Marketing y Ventas' },
      ],
    },
  },
  {
    id: 'creatividad-diseno',
    name: 'Creatividad & Diseño',
    label: 'Actualización de Creatividad y Diseño',
    icon: 'Palette',
    color: '#A855F7',
    accentGradient: 'from-purple-500 to-fuchsia-700',
    description: 'Storytelling, fotografía digital, identidad visual, edición de vídeo y DIY/bricolaje creativo.',
    defaultPreferences: {
      scopeId: 'creatividad-diseno',
      geographicScope: 'internacional',
      country: 'Global',
      city: '',
      preferredTime: '11:00',
      tags: ['Storytelling', 'Fotografía digital', 'Identidad visual', 'Edición de vídeo', 'DIY'],
      sources: [
        { id: 'domestika', name: 'Domestika Blog', domain: 'domestika.org', enabled: true, isOfficial: true, category: 'Comunidad Creativa' },
        { id: 'behance', name: 'Behance', domain: 'behance.net', enabled: true, isOfficial: true, category: 'Portafolio Creativo' },
        { id: 'petapixel', name: 'PetaPixel', domain: 'petapixel.com', enabled: true, isOfficial: true, category: 'Fotografía' },
        { id: 'creativebloq', name: 'Creative Bloq', domain: 'creativebloq.com', enabled: true, isOfficial: true, category: 'Diseño Gráfico' },
      ],
    },
  },
  {
    id: 'politica',
    name: 'Política & Geopolítica',
    label: 'Actualización de Política y Geopolítica',
    icon: 'Building2',
    color: '#EF4444',
    accentGradient: 'from-red-600 to-rose-900',
    description: 'Conflictos internacionales, elecciones, geopolítica energética, economía política y diplomacia.',
    defaultPreferences: {
      scopeId: 'politica',
      geographicScope: 'nacional',
      country: 'España',
      city: 'Madrid',
      preferredTime: '09:00',
      tags: ['Conflictos internacionales', 'Elecciones', 'Geopolítica energética', 'Economía política', 'Diplomacia'],
      sources: [
        { id: 'elordenmundial', name: 'El Orden Mundial', domain: 'elordenmundial.com', enabled: true, isOfficial: true, category: 'Geopolítica Especializada' },
        { id: 'foreignaffairs', name: 'Foreign Affairs', domain: 'foreignaffairs.com', enabled: true, isOfficial: true, category: 'Análisis Internacional' },
        { id: 'politico', name: 'Politico', domain: 'politico.com', enabled: true, isOfficial: true, category: 'Política Global' },
        { id: 'elcano', name: 'Real Instituto Elcano', domain: 'realinstitutoelcano.org', enabled: true, isOfficial: true, category: 'Think Tank Oficial' },
      ],
    },
  },
  {
    id: 'deportes-competicion',
    name: 'Deportes & Competición',
    label: 'Actualización de Deportes y Rendimiento',
    icon: 'Trophy',
    color: '#84CC16',
    accentGradient: 'from-lime-500 to-emerald-700',
    description: 'Fútbol internacional, baloncesto (NBA/Euroliga), deportes de motor, polideportivo y alto rendimiento.',
    defaultPreferences: {
      scopeId: 'deportes-competicion',
      geographicScope: 'nacional',
      country: 'España',
      city: '',
      preferredTime: '08:30',
      tags: ['Fútbol internacional', 'Baloncesto (NBA/Euroliga)', 'Deportes de motor', 'Polideportivo', 'Rendimiento'],
      sources: [
        { id: 'theathletic', name: 'The Athletic', domain: 'theathletic.com', enabled: true, isOfficial: true, category: 'Periodismo Deportivo' },
        { id: 'marca', name: 'Marca', domain: 'marca.com', enabled: true, isOfficial: true, category: 'Deportivo Nacional' },
        { id: 'as', name: 'Diario AS', domain: 'as.com', enabled: true, isOfficial: true, category: 'Deportivo Nacional' },
        { id: 'bleacherreport', name: 'Bleacher Report', domain: 'bleacherreport.com', enabled: true, isOfficial: true, category: 'Deportes Global' },
        { id: 'panenka', name: 'Panenka', domain: 'panenka.org', enabled: true, isOfficial: true, category: 'Cultura de Fútbol' },
      ],
    },
  },
];

const SCOPES_LIST_KEY = 'briefing_ai_scopes_catalog_v3';
const PREFERENCES_STORAGE_KEY = 'briefing_ai_preferences_v3';
const VISIBLE_SCOPES_KEY = 'briefing_ai_visible_scopes_v4';

export const storageService = {
  getAllScopes(): ScopeDefinition[] {
    try {
      const stored = localStorage.getItem(SCOPES_LIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((s: ScopeDefinition) => s.id));
          let updated = false;
          DEFAULT_SCOPES.forEach((defScope) => {
            if (!existingIds.has(defScope.id)) {
              parsed.push(defScope);
              updated = true;
            }
          });
          if (updated) {
            this.saveAllScopes(parsed);
          }
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

  getVisibleScopeIds(): string[] {
    const allScopes = this.getAllScopes();
    const allIds = allScopes.map((s) => s.id);

    try {
      const stored = localStorage.getItem(VISIBLE_SCOPES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = false;
          allIds.forEach((id) => {
            if (!parsed.includes(id)) {
              parsed.push(id);
              updated = true;
            }
          });
          if (updated) {
            this.saveVisibleScopeIds(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading visible scopes:', e);
    }
    // Por defecto, todas las categorías están activas y visibles
    this.saveVisibleScopeIds(allIds);
    return allIds;
  },

  saveVisibleScopeIds(ids: string[]): void {
    try {
      localStorage.setItem(VISIBLE_SCOPES_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error('Error saving visible scopes:', e);
    }
  },

  // Caché de búsqueda exhaustiva del día por categoría
  getDailyBriefingCache(scopeId: string): any | null {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const key = `briefing_ai_cache_24h_${scopeId}_${today}`;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading daily briefing cache:', e);
    }
    return null;
  },

  saveDailyBriefingCache(scopeId: string, briefing: any): void {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const key = `briefing_ai_cache_24h_${scopeId}_${today}`;
      localStorage.setItem(key, JSON.stringify(briefing));
      localStorage.setItem('briefing_ai_last_sync_timestamp', new Date().toISOString());
    } catch (e) {
      console.error('Error saving daily briefing cache:', e);
    }
  },

  getLastSyncTimestamp(): string | null {
    try {
      return localStorage.getItem('briefing_ai_last_sync_timestamp');
    } catch {
      return null;
    }
  },

  addSourceToScope(scopeId: string, newSource: ScopeSource): ScopePreferences {
    const prefs = this.getPreferences(scopeId);
    const existing = prefs.sources || [];
    if (!existing.some((s) => s.id === newSource.id || s.domain === newSource.domain)) {
      const updated: ScopePreferences = {
        ...prefs,
        sources: [newSource, ...existing],
      };
      this.savePreferences(updated);
      return updated;
    }
    return prefs;
  },
};
