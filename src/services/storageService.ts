import type { ScopeDefinition, ScopePreferences, ScopeSource, ConfigVersion } from '../types';

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
      country: 'España / Europa',
      city: '',
      preferredTime: '07:30',
      tags: ['Sesgos cognitivos', 'Gestión del tiempo', 'Comunicación asertiva', 'Inteligencia emocional', 'Hábitos atómicos'],
      sources: [
        { id: 'cop', name: 'Consejo General de la Psicología de España (COP)', domain: 'cop.es', enabled: true, isOfficial: true, category: 'Organismo Colegial Oficial' },
        { id: 'psicologiaymente', name: 'Psicología y Mente', domain: 'psicologiaymente.com', enabled: true, isOfficial: true, category: 'Divulgación Neurociencia' },
        { id: 'efpa', name: 'European Federation of Psychologists\' Associations (EFPA)', domain: 'efpa.eu', enabled: true, isOfficial: true, category: 'Marco Regulador Europeo' },
        { id: 'infocop', name: 'Infocop Online', domain: 'infocop.es', enabled: true, isOfficial: true, category: 'Revista Oficial COP' },
        { id: 'fundacionmapfre_salud', name: 'Fundación MAPFRE (Área Salud y Bienestar)', domain: 'fundacionmapfre.org', enabled: true, isOfficial: true, category: 'Estudios sobre Estrés y Salud' },
        { id: 'mind_uk', name: 'Mind UK / Europa', domain: 'mind.org.uk', enabled: true, isOfficial: true, category: 'Divulgación en Evidencia' },
        { id: 'lamenteesmaravillosa', name: 'La Mente es Maravillosa', domain: 'lamenteesmaravillosa.com', enabled: true, isOfficial: true, category: 'Sesgos y Desarrollo' },
        { id: 'aepc', name: 'Asociación Española de Psicología Conductual (AEPC)', domain: 'aepc.es', enabled: true, isOfficial: true, category: 'Investigación Terapia' },
        { id: 'ejpalc', name: 'European Journal of Psychology Applied to Legal Context', domain: 'elsevier.es', enabled: true, isOfficial: true, category: 'Publicación Académica' },
        { id: 'cibersam', name: 'CIBERSAM (Centro de Investigación en Salud Mental)', domain: 'cibersam.es', enabled: true, isOfficial: true, category: 'Investigación Biomédica' },
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
      country: 'España / Europa',
      city: '',
      preferredTime: '08:00',
      tags: ['Fondos indexados', 'Ahorro sistemático', 'Reducción de deuda', 'Fiscalidad doméstica', 'Criptoactivos'],
      sources: [
        { id: 'cnmv', name: 'Comisión Nacional del Mercado de Valores (CNMV)', domain: 'cnmv.es', enabled: true, isOfficial: true, category: 'Regulador Oficial España' },
        { id: 'bde', name: 'Banco de España (Portal del Cliente Bancario)', domain: 'bde.es', enabled: true, isOfficial: true, category: 'Estadísticas e Interés' },
        { id: 'bce', name: 'Banco Central Europeo (BCE)', domain: 'ecb.europa.eu', enabled: true, isOfficial: true, category: 'Política Monetaria UE' },
        { id: 'expansion', name: 'Expansión', domain: 'expansion.com', enabled: true, isOfficial: true, category: 'Prensa Económica' },
        { id: 'cincodias', name: 'Cinco Días / El País Economía', domain: 'cincodias.elpais.com', enabled: true, isOfficial: true, category: 'Mercados e Inversión' },
        { id: 'eleconomista', name: 'elEconomista.es', domain: 'eleconomista.es', enabled: true, isOfficial: true, category: 'Bolsa en Tiempo Real' },
        { id: 'rankia', name: 'Rankia', domain: 'rankia.com', enabled: true, isOfficial: true, category: 'Comunidad Financiera' },
        { id: 'ft_europa', name: 'Financial Times - Edición Europa', domain: 'ft.com', enabled: true, isOfficial: true, category: 'Mercados Globales' },
        { id: 'fundspeople', name: 'FundsPeople', domain: 'fundspeople.com', enabled: true, isOfficial: true, category: 'Inversión Colectiva' },
        { id: 'esma', name: 'European Securities and Markets Authority (ESMA)', domain: 'esma.europa.eu', enabled: true, isOfficial: true, category: 'Regulador Financiero UE' },
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
      country: 'Global / Europa',
      city: '',
      preferredTime: '09:30',
      tags: ['Automatización', 'Privacidad digital', 'Inteligencia artificial', 'Ciberseguridad', 'Domótica'],
      sources: [
        { id: 'xataka', name: 'Xataka', domain: 'xataka.com', enabled: true, isOfficial: true, category: 'Consumo Tech e IA' },
        { id: 'genbeta', name: 'Genbeta', domain: 'genbeta.com', enabled: true, isOfficial: true, category: 'Software y Web' },
        { id: 'aepd', name: 'Agencia Española de Protección de Datos (AEPD)', domain: 'aepd.es', enabled: true, isOfficial: true, category: 'Privacidad y RGPD' },
        { id: 'incibe', name: 'INCIBE (Instituto Nacional de Ciberseguridad)', domain: 'incibe.es', enabled: true, isOfficial: true, category: 'Alertas Ciberseguridad' },
        { id: 'wired_eu', name: 'Wired UK / Wired Europa', domain: 'wired.com', enabled: true, isOfficial: true, category: 'Tendencias y Futuros Tech' },
        { id: 'sifted', name: 'Sifted (Respaldado por FT)', domain: 'sifted.eu', enabled: true, isOfficial: true, category: 'Startups en Europa' },
        { id: 'tnw', name: 'The Next Web (TNW)', domain: 'thenextweb.com', enabled: true, isOfficial: true, category: 'Innovación Tecnológica' },
        { id: 'mittech_es', name: 'MIT Technology Review en español', domain: 'technologyreview.es', enabled: true, isOfficial: true, category: 'Tecnología Avanzada' },
        { id: 'hipertextual', name: 'Hipertextual', domain: 'hipertextual.com', enabled: true, isOfficial: true, category: 'Cultura Tech y Ciencia' },
        { id: 'ccncert', name: 'CCN-CERT (Centro Criptológico Nacional)', domain: 'ccn-cert.cni.es', enabled: true, isOfficial: true, category: 'Seguridad Crítica' },
      ],
    },
  },
  {
    id: 'salud-bienestar',
    name: 'Salud, Nutrición & Bienestar Físico',
    label: 'Actualización de Salud',
    icon: 'Activity',
    color: '#10B981',
    accentGradient: 'from-emerald-500 to-teal-700',
    description: 'Entrenamiento de fuerza, meal prep, higiene del sueño, ergonomía y movilidad articular.',
    defaultPreferences: {
      scopeId: 'salud-bienestar',
      geographicScope: 'internacional',
      country: 'España / Europa',
      city: '',
      preferredTime: '08:00',
      tags: ['Entrenamiento de fuerza', 'Meal prep', 'Higiene del sueño', 'Ergonomía', 'Movilidad articular'],
      sources: [
        { id: 'sanidad_es', name: 'Ministerio de Sanidad de España', domain: 'sanidad.gob.es', enabled: true, isOfficial: true, category: 'Sanidad Pública Oficial' },
        { id: 'aesan', name: 'Agencia Española de Seguridad Alimentaria (AESAN)', domain: 'aesan.gob.es', enabled: true, isOfficial: true, category: 'Nutrición y Alimentos' },
        { id: 'ecdc', name: 'European Centre for Disease Prevention and Control (ECDC)', domain: 'ecdc.europa.eu', enabled: true, isOfficial: true, category: 'Control Epidemiológico UE' },
        { id: 'efsa', name: 'Autoridad Europea de Seguridad Alimentaria (EFSA)', domain: 'efsa.europa.eu', enabled: true, isOfficial: true, category: 'Riesgo Nutricional UE' },
        { id: 'vitonica', name: 'Vitónica', domain: 'vitonica.com', enabled: true, isOfficial: true, category: 'Entrenamiento y Nutrición' },
        { id: 'senc', name: 'Sociedad Española de Nutrición Comunitaria (SENC)', domain: 'nutricioncomunitaria.org', enabled: true, isOfficial: true, category: 'Guías Alimentarias' },
        { id: 'semed', name: 'Sociedad Española de Medicina del Deporte (SEMED)', domain: 'femede.es', enabled: true, isOfficial: true, category: 'Fisiología Deportiva' },
        { id: 'isciii', name: 'Instituto de Salud Carlos III (ISCIII)', domain: 'isciii.es', enabled: true, isOfficial: true, category: 'Investigación Biomédica' },
        { id: 'bmj', name: 'The BMJ (British Medical Journal)', domain: 'bmj.com', enabled: true, isOfficial: true, category: 'Revista Médica de Elite' },
        { id: 'ser', name: 'Sociedad Española de Reumatología (SER)', domain: 'ser.es', enabled: true, isOfficial: true, category: 'Ergonomía y Movilidad' },
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
      country: 'España / Europa',
      city: '',
      preferredTime: '10:00',
      tags: ['Civilizaciones antiguas', 'Exploración espacial', 'Mitología', 'Experimentos científicos', 'Arqueología'],
      sources: [
        { id: 'agenciasinc', name: 'Agencia SINC (FECYT)', domain: 'agenciasinc.es', enabled: true, isOfficial: true, category: 'Noticias Científicas Oficial' },
        { id: 'csic', name: 'Consejo Superior de Investigaciones Científicas (CSIC)', domain: 'csic.es', enabled: true, isOfficial: true, category: 'Investigación Estatal' },
        { id: 'naukas', name: 'Naukas', domain: 'naukas.com', enabled: true, isOfficial: true, category: 'Divulgación Científica' },
        { id: 'natgeo_es', name: 'National Geographic España', domain: 'nationalgeographic.com.es', enabled: true, isOfficial: true, category: 'Historia y Arqueología' },
        { id: 'esa', name: 'Agencia Espacial Europea (ESA)', domain: 'esa.int', enabled: true, isOfficial: true, category: 'Exploración Espacial' },
        { id: 'materia_elpais', name: 'Materia (El País)', domain: 'elpais.com/ciencia', enabled: true, isOfficial: true, category: 'Periodismo Científico' },
        { id: 'cern', name: 'CERN (Física de Partículas)', domain: 'home.cern', enabled: true, isOfficial: true, category: 'Física Fundamental' },
        { id: 'despertaferro', name: 'Revista Desperta Ferro', domain: 'despertaferro-ediciones.com', enabled: true, isOfficial: true, category: 'Historia y Arqueología' },
        { id: 'egu', name: 'European Geosciences Union (EGU)', domain: 'egu.eu', enabled: true, isOfficial: true, category: 'Ciencias de la Tierra' },
        { id: 'iac', name: 'Instituto de Astrofísica de Canarias (IAC)', domain: 'iac.es', enabled: true, isOfficial: true, category: 'Investigación Astronómica' },
      ],
    },
  },
  {
    id: 'negocios-carrera',
    name: 'Negocios, Carrera & Empleo',
    label: 'Actualización de Negocios y Empleo',
    icon: 'Briefcase',
    color: '#6366F1',
    accentGradient: 'from-indigo-600 to-violet-800',
    description: 'Negociación salarial, marca personal, trabajo remoto, emprendimiento digital y gestión de proyectos.',
    defaultPreferences: {
      scopeId: 'negocios-carrera',
      geographicScope: 'internacional',
      country: 'España / Europa',
      city: '',
      preferredTime: '08:45',
      tags: ['Negociación salarial', 'Marca personal', 'Trabajo remoto', 'Emprendimiento digital', 'Gestión de proyectos'],
      sources: [
        { id: 'sepe', name: 'Servicio Público de Empleo Estatal (SEPE)', domain: 'sepe.es', enabled: true, isOfficial: true, category: 'Mercado Laboral Oficial' },
        { id: 'ceoe', name: 'CEOE Empresarios Española', domain: 'ceoe.es', enabled: true, isOfficial: true, category: 'Informes Empresariales' },
        { id: 'eubusinessreview', name: 'European Business Review', domain: 'europeanbusinessreview.com', enabled: true, isOfficial: true, category: 'Estrategia y Liderazgo' },
        { id: 'infojobs_reports', name: 'InfoJobs (Informes de Mercado Laboral)', domain: 'infojobs.net', enabled: true, isOfficial: true, category: 'Datos Salariales' },
        { id: 'emprendedores', name: 'Emprendedores.es', domain: 'emprendedores.es', enabled: true, isOfficial: true, category: 'Creación de Empresas' },
        { id: 'businessinsider_es', name: 'Business Insider España', domain: 'businessinsider.es', enabled: true, isOfficial: true, category: 'Carrera y Mercado' },
        { id: 'cepyme', name: 'CEPYME (Pymes y Autónomos)', domain: 'cepyme.es', enabled: true, isOfficial: true, category: 'Estadísticas Pyme' },
        { id: 'eustartups', name: 'EU-Startups', domain: 'eu-startups.com', enabled: true, isOfficial: true, category: 'Ecosistema Emprendedor' },
        { id: 'eurofound', name: 'Eurofound (Conciliación y Trabajo Remoto)', domain: 'eurofound.europa.eu', enabled: true, isOfficial: true, category: 'Estudios Laborales UE' },
        { id: 'ie_iese_insights', name: 'IE University / IESE Insight', domain: 'ie.edu', enabled: true, isOfficial: true, category: 'Investigación de Negocios' },
      ],
    },
  },
  {
    id: 'creatividad-diseno',
    name: 'Creatividad, Cultura Visual & Diseño',
    label: 'Actualización de Creatividad y Diseño',
    icon: 'Palette',
    color: '#A855F7',
    accentGradient: 'from-purple-500 to-fuchsia-700',
    description: 'Storytelling, fotografía digital, identidad visual, edición de vídeo y bricolaje creativo.',
    defaultPreferences: {
      scopeId: 'creatividad-diseno',
      geographicScope: 'internacional',
      country: 'Europa / Global',
      city: '',
      preferredTime: '11:00',
      tags: ['Storytelling', 'Fotografía digital', 'Identidad visual', 'Edición de vídeo', 'DIY'],
      sources: [
        { id: 'graffica', name: 'Gràffica', domain: 'graffica.info', enabled: true, isOfficial: true, category: 'Diseño Gráfico y Visual' },
        { id: 'brandnew', name: 'Brand New / UnderConsideration', domain: 'underconsideration.com', enabled: true, isOfficial: true, category: 'Análisis de Rediseño/Branding' },
        { id: 'domestika', name: 'Domestika Blog', domain: 'domestika.org', enabled: true, isOfficial: true, category: 'Comunidad de Arte Digital' },
        { id: 'itsnicethat', name: 'It’s Nice That', domain: 'itsnicethat.com', enabled: true, isOfficial: true, category: 'Dirección de Arte y Proyectos' },
        { id: 'experimenta', name: 'Experimenta Magazine', domain: 'experimenta.es', enabled: true, isOfficial: true, category: 'Diseño Industrial' },
        { id: 'eyemagazine', name: 'Eye Magazine', domain: 'eyemagazine.com', enabled: true, isOfficial: true, category: 'Tipografía y Gráfica' },
        { id: 'visualmagazine', name: 'Visual Magazine', domain: 'visual.gi', enabled: true, isOfficial: true, category: 'Dirección Artística' },
        { id: 'creativereview', name: 'Creative Review', domain: 'creativereview.co.uk', enabled: true, isOfficial: true, category: 'Branding y Audiovisual' },
        { id: 'aiga_eyeondesign', name: 'AIGA Eye on Design', domain: 'eyeondesign.aiga.org', enabled: true, isOfficial: true, category: 'Ensayos Críticos de Diseño' },
        { id: 'reddot', name: 'Red Dot Design Awards', domain: 'red-dot.org', enabled: true, isOfficial: true, category: 'Estándar Internacional Diseño' },
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
      geographicScope: 'internacional',
      country: 'España / Europa',
      city: 'Madrid',
      preferredTime: '09:00',
      tags: ['Conflictos internacionales', 'Elecciones', 'Geopolítica energética', 'Economía política', 'Diplomacia'],
      sources: [
        { id: 'elordenmundial', name: 'El Orden Mundial (EOM)', domain: 'elordenmundial.com', enabled: true, isOfficial: true, category: 'Geopolítica Comparada' },
        { id: 'elcano', name: 'Real Instituto Elcano', domain: 'realinstitutoelcano.org', enabled: true, isOfficial: true, category: 'Think Tank Estratégico' },
        { id: 'cidob', name: 'CIDOB (Asuntos Internacionales Barcelona)', domain: 'cidob.org', enabled: true, isOfficial: true, category: 'Gobernanza Global' },
        { id: 'ecfr', name: 'European Council on Foreign Relations (ECFR)', domain: 'ecfr.eu', enabled: true, isOfficial: true, category: 'Política Exterior UE' },
        { id: 'politico_eu', name: 'Politico Europe', domain: 'politico.eu', enabled: true, isOfficial: true, category: 'Instituciones de la UE' },
        { id: 'euronews', name: 'Euronews', domain: 'euronews.com', enabled: true, isOfficial: true, category: 'Actualidad Comunitaria' },
        { id: 'lemonde_diplo', name: 'Le Monde Diplomatique (Español)', domain: 'mondiplo.com', enabled: true, isOfficial: true, category: 'Economía Política Global' },
        { id: 'ieee', name: 'Instituto Español de Estudios Estratégicos (IEEE)', domain: 'ieee.es', enabled: true, isOfficial: true, category: 'Seguridad y Defensa' },
        { id: 'bruegel', name: 'Bruegel Think Tank', domain: 'bruegel.org', enabled: true, isOfficial: true, category: 'Políticas Económicas UE' },
        { id: 'euobserver', name: 'EUobserver', domain: 'euobserver.com', enabled: true, isOfficial: true, category: 'Transparencia Comunitaria' },
      ],
    },
  },
  {
    id: 'deportes-competicion',
    name: 'Deportes & Rendimiento',
    label: 'Actualización de Deportes y Rendimiento',
    icon: 'Trophy',
    color: '#84CC16',
    accentGradient: 'from-lime-500 to-emerald-700',
    description: 'Fútbol internacional, baloncesto (NBA/Euroliga), deportes de motor, polideportivo y alto rendimiento.',
    defaultPreferences: {
      scopeId: 'deportes-competicion',
      geographicScope: 'nacional',
      country: 'España / Europa',
      city: '',
      preferredTime: '08:30',
      tags: ['Fútbol internacional', 'Baloncesto (NBA/Euroliga)', 'Deportes de motor', 'Polideportivo', 'Rendimiento'],
      sources: [
        { id: 'marca', name: 'Marca', domain: 'marca.com', enabled: true, isOfficial: true, category: 'Diario Deportivo Líder' },
        { id: 'as', name: 'Diario AS', domain: 'as.com', enabled: true, isOfficial: true, category: 'Ligas Europeas y Motor' },
        { id: 'mundodeportivo', name: 'Mundo Deportivo', domain: 'mundodeportivo.com', enabled: true, isOfficial: true, category: 'Cobertura Especializada' },
        { id: 'sport', name: 'Sport', domain: 'sport.es', enabled: true, isOfficial: true, category: 'Ligas y Polideportivo' },
        { id: 'lequipe', name: 'L\'Équipe', domain: 'lequipe.fr', enabled: true, isOfficial: true, category: 'Análisis Deportivo Europeo' },
        { id: 'gazzetta', name: 'La Gazzetta dello Sport', domain: 'gazzetta.it', enabled: true, isOfficial: true, category: 'Ciclismo y Fútbol Continental' },
        { id: 'panenka', name: 'Revista Panenka', domain: 'panenka.org', enabled: true, isOfficial: true, category: 'Periodismo Narrativo Futbolístico' },
        { id: 'gigantes', name: 'Gigantes del Basket', domain: 'gigantes.com', enabled: true, isOfficial: true, category: 'Baloncesto NBA y Euroliga' },
        { id: 'soymotor', name: 'SoyMotor.com', domain: 'soymotor.com', enabled: true, isOfficial: true, category: 'Fórmula 1 y MotoGP' },
        { id: 'efe_deportes', name: 'Agencia EFE Deportes', domain: 'efe.com', enabled: true, isOfficial: true, category: 'Servicio Deportivo Oficial' },
      ],
    },
  },
];

const SCOPES_LIST_KEY = 'briefing_ai_scopes_catalog_v5';
const PREFERENCES_STORAGE_KEY = 'briefing_ai_preferences_v5';
const VISIBLE_SCOPES_KEY = 'briefing_ai_visible_scopes_v5';

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

  // --- GESTIÓN DE VERSIONES Y PERFILES DE CONFIGURACIÓN DE LA APP ---
  getActiveVersionInfo(): { id: string; name: string } | null {
    try {
      const raw = localStorage.getItem('briefing_ai_active_version');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  },

  setActiveVersionInfo(id: string, name: string): void {
    try {
      localStorage.setItem('briefing_ai_active_version', JSON.stringify({ id, name }));
    } catch (e) {
      console.error('Error saving active version info:', e);
    }
  },

  clearActiveVersionInfo(): void {
    try {
      localStorage.removeItem('briefing_ai_active_version');
    } catch {}
  },

  getConfigVersions(): ConfigVersion[] {
    try {
      const raw = localStorage.getItem('briefing_ai_config_versions_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading config versions:', e);
    }
    return [];
  },

  saveConfigVersion(
    versionName: string,
    visibleScopeIds: string[],
    preferencesMap: Record<string, ScopePreferences>,
    scopes: ScopeDefinition[]
  ): ConfigVersion {
    const versions = this.getConfigVersions();
    const newVersion: ConfigVersion = {
      id: `ver-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: versionName.trim() || `Versión ${new Date().toLocaleDateString('es-ES')}`,
      createdAt: new Date().toISOString(),
      visibleScopeIds,
      preferencesMap,
      scopes,
    };
    const updated = [newVersion, ...versions];
    try {
      localStorage.setItem('briefing_ai_config_versions_v1', JSON.stringify(updated));
      this.setActiveVersionInfo(newVersion.id, newVersion.name);
    } catch (e) {
      console.error('Error saving config version:', e);
    }
    return newVersion;
  },

  updateConfigVersion(
    versionId: string,
    visibleScopeIds: string[],
    preferencesMap: Record<string, ScopePreferences>,
    scopes: ScopeDefinition[]
  ): ConfigVersion | null {
    const versions = this.getConfigVersions();
    const idx = versions.findIndex((v) => v.id === versionId);
    if (idx === -1) return null;

    const existing = versions[idx];
    const updatedVer: ConfigVersion = {
      ...existing,
      createdAt: new Date().toISOString(),
      visibleScopeIds,
      preferencesMap,
      scopes,
    };

    versions[idx] = updatedVer;
    try {
      localStorage.setItem('briefing_ai_config_versions_v1', JSON.stringify(versions));
      this.setActiveVersionInfo(updatedVer.id, updatedVer.name);
    } catch (e) {
      console.error('Error updating config version:', e);
    }
    return updatedVer;
  },

  deleteConfigVersion(versionId: string): ConfigVersion[] {
    const versions = this.getConfigVersions();
    const updated = versions.filter((v) => v.id !== versionId);
    const active = this.getActiveVersionInfo();
    if (active && active.id === versionId) {
      this.clearActiveVersionInfo();
    }
    try {
      localStorage.setItem('briefing_ai_config_versions_v1', JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting config version:', e);
    }
    return updated;
  },

  loadConfigVersion(version: ConfigVersion): void {
    try {
      this.saveVisibleScopeIds(version.visibleScopeIds);
      if (version.preferencesMap) {
        Object.values(version.preferencesMap).forEach((p) => {
          this.savePreferences(p);
        });
      }
      if (version.scopes && version.scopes.length > 0) {
        this.saveAllScopes(version.scopes);
      }
      this.setActiveVersionInfo(version.id, version.name);
    } catch (e) {
      console.error('Error loading config version:', e);
    }
  },
};
