export type ScopeId = 
  | 'crecimiento-personal' 
  | 'finanzas' 
  | 'tecnologia' 
  | 'salud-bienestar' 
  | 'ciencia-historia' 
  | 'negocios-carrera' 
  | 'creatividad-diseno' 
  | 'politica' 
  | 'deportes-competicion' 
  | 'futbol' 
  | string;

export interface ScopeSource {
  id: string;
  name: string;
  domain: string;
  enabled: boolean;
  isOfficial: boolean;
  category: string;
  description?: string;
  discoveredByAI?: boolean;
  rssUrl?: string;
}

export interface DiscoveredSource {
  id: string;
  name: string;
  domain: string;
  description: string;
  category: string;
  scopeId: string;
  sourceType: 'blog' | 'foro' | 'prensa' | 'podcast' | 'oficial';
  url: string;
}

export interface ScopePreferences {
  scopeId: string;
  geographicScope: 'local' | 'nacional' | 'continental' | 'internacional';
  country: string;
  city: string;
  preferredTime: string; // ej: "08:30"
  maxNewsLimit?: number; // Límite de noticias a mostrar (ej. 3, 5, 10)
  tags: string[]; // Etiquetas prioritarias: ej. ["Real Madrid", "Mbappé"]
  subcategories?: string[]; // Subtemáticas asociadas al ámbito
  bannedKeywords?: string[]; // Palabras betadas/excluidas: ej. ["apuestas deportivas", "bet", "casino"]
  sources: ScopeSource[];
}

export interface ScopeDefinition {
  id: ScopeId;
  name: string;
  label: string;
  icon: string;
  color: string;
  accentGradient: string;
  description: string;
  subcategories?: string[];
  defaultPreferences: ScopePreferences;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  contentSnippet: string;
  keyHighlights?: string[]; // Puntos clave específicos extraídos de la noticia
  source: string;
  sourceDomain: string;
  sourceUrl: string;
  publishedAt: string;
  isOfficial: boolean;
  matchedTags: string[];
  geographicArea: string;
  is24h?: boolean;
  score?: number;
}

export interface BriefingResult {
  id: string;
  scopeId: string;
  scopeName: string;
  timestamp: string;
  audioScript: string;
  summaryBulletPoints: string[];
  articles: NewsItem[];
  matchedTagsCount: number;
  totalArticlesAnalyzed?: number;
  isExhaustive24h?: boolean;
  lastSearchDate?: string;
}
