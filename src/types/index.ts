export type ScopeId = 'futbol' | 'finanzas' | 'politica' | 'tecnologia' | string;

export interface ScopeSource {
  id: string;
  name: string;
  domain: string;
  enabled: boolean;
  isOfficial: boolean;
  category: string;
}

export interface ScopePreferences {
  scopeId: string;
  geographicScope: 'local' | 'nacional' | 'continental' | 'internacional';
  country: string;
  city: string;
  preferredTime: string; // ej: "08:30"
  tags: string[]; // Etiquetas prioritarias: ej. ["Real Madrid", "Mbappé"]
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
  defaultPreferences: ScopePreferences;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  contentSnippet: string;
  source: string;
  sourceDomain: string;
  sourceUrl: string;
  publishedAt: string;
  isOfficial: boolean;
  matchedTags: string[];
  geographicArea: string;
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
}
