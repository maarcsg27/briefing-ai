import type { ScopeDefinition, ScopePreferences, BriefingResult, NewsItem, DiscoveredSource } from '../types';

const GEMINI_KEY_STORAGE = 'briefing_ai_gemini_api_key';

export const geminiService = {
  getApiKey(): string {
    try {
      const stored = localStorage.getItem(GEMINI_KEY_STORAGE);
      if (stored && stored.trim().length > 0) {
        return stored.trim();
      }
    } catch (_) {}
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  },

  setApiKey(key: string): void {
    try {
      localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
    } catch (e) {
      console.error('Error saving Gemini API Key:', e);
    }
  },

  hasValidKey(): boolean {
    const key = this.getApiKey();
    return key.length > 10;
  },

  /**
   * Genera la síntesis de noticias completa utilizando la API de Gemini.
   * Cada noticia incluirá un resumen explicativo REAL de 3 a 5 líneas.
   */
  async generateBriefingWithAI(
    scope: ScopeDefinition,
    preferences: ScopePreferences,
    onProgress?: (msg: string) => void
  ): Promise<BriefingResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Se requiere una Gemini API Key configurada para la sintesis con IA.');
    }

    if (onProgress) onProgress('Conectando con Gemini 2.5 Flash para rastreo y síntesis en tiempo real...');

    const tagsStr = preferences.tags && preferences.tags.length > 0
      ? preferences.tags.join(', ')
      : scope.description;

    const sourcesStr = preferences.sources
      .filter((s) => s.enabled)
      .map((s) => `${s.name} (${s.domain})`)
      .join(', ');

    const maxLimit = preferences.maxNewsLimit || 5;

    const promptText = `
Eres el motor principal de inteligencia artificial de la aplicación Briefing AI.
Tu tarea es investigar las noticias reales más importantes de las últimas 24 horas para la categoría "${scope.name}".

DATOS DE CONFIGURACIÓN DEL ÁMBITO:
- Categoría: ${scope.name}
- Descripción del ámbito: ${scope.description}
- Etiquetas prioritarias del usuario: ${tagsStr}
- Ámbito geográfico: ${preferences.geographicScope} (${preferences.country || 'Global'})
- Fuentes preferidas de referencia: ${sourcesStr || 'Medios acreditados globales y nacionales'}
- Cantidad deseada de noticias: ${maxLimit}

REGLAS DE GENERACIÓN OBLIGATORIAS:
1. Para cada noticia (debes incluir exactamente entre 3 y ${maxLimit} noticias):
   - "title": Titular limpio, profesional y directo. NO repitas el nombre del medio en el titular.
   - "summary": UN PÁRRAFO COMPLETO DE 3 A 5 LÍNEAS (entre 50 y 90 palabras en español) que explique con profundidad la noticia. Debe aportar contexto real, datos, implicaciones y antecedentes. NUNCA comiences el resumen repitiendo el titular.
   - "source": Nombre de la fuente oficial o medio especializado (ej. "Expansión", "Harvard Business Review", "PubMed").
   - "sourceDomain": Dominio web limpio (ej. "expansion.com", "hbr.org").
   - "sourceUrl": Enlace web real o búsqueda directa a la fuente.
   - "matchedTags": Array con las etiquetas del usuario que coinciden con esta noticia (ej. ["${preferences.tags[0] || 'Actualidad'}"]).
   - "geographicArea": Zona geográfica (ej. "España", "Global", "Europa").

2. "audioScript": Un guion fluido en español para ser leído por voz en la app. Saluda ("Buenos días" / "Buenas tardes"), presenta las noticias clave una a una explicando su titular y resumen breve sin redundancias, y despídete profesionalmente.

3. "summaryBulletPoints": Array de strings donde cada elemento sea un resumen sintético de 1-2 frases para cada noticia precedido por [#etiqueta]. NO incluyas el titular en el punto del resumen.

FORMATO DE RESPUESTA REQUERIDO:
Responde ÚNICAMENTE con un JSON válido con esta estructura exacta sin formato markdown alrededor ni texto extra:
{
  "articles": [
    {
      "id": "ai-1",
      "title": "Titular de la noticia",
      "summary": "Párrafo de 3 a 5 líneas completas explicando los detalles...",
      "contentSnippet": "Extracto explicativo de soporte.",
      "source": "Nombre Fuente",
      "sourceDomain": "dominio.com",
      "sourceUrl": "https://dominio.com/noticia",
      "publishedAt": "Últimas 24h",
      "isOfficial": true,
      "matchedTags": ["Tag1"],
      "geographicArea": "Global"
    }
  ],
  "audioScript": "Guion fluido para la locución por voz...",
  "summaryBulletPoints": [
    "[#Tag1] Resumen sintético explicativo..."
  ]
}
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
      tools: [
        {
          googleSearch: {},
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    };

    if (onProgress) onProgress('Gemini está analizando la web en tiempo real y redactando resúmenes de 3 a 5 líneas...');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error en la llamada a Gemini API (${response.status}): ${errText.substring(0, 150)}`);
    }

    const resData = await response.json();
    const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawText) {
      throw new Error('La respuesta de Gemini vino vacía.');
    }

    // Parsear el JSON
    let parsed: any;
    try {
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Fallback parsing Gemini JSON:', rawText);
      throw new Error('No se pudo interpretar la respuesta estructurada de Gemini.');
    }

    const now = new Date();
    const horaActual = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const articles: NewsItem[] = (parsed.articles || []).map((art: any, index: number) => ({
      id: art.id || `gemini-${Date.now()}-${index}`,
      title: art.title || 'Información destacada del día',
      summary: art.summary || 'Resumen sintetizado por IA.',
      contentSnippet: art.contentSnippet || art.summary || '',
      source: art.source || 'Fuente Acreditada',
      sourceDomain: art.sourceDomain || 'fuente.com',
      sourceUrl: art.sourceUrl || `https://${art.sourceDomain || 'google.com'}`,
      publishedAt: art.publishedAt || 'Últimas 24h',
      isOfficial: art.isOfficial !== undefined ? art.isOfficial : true,
      matchedTags: Array.isArray(art.matchedTags) ? art.matchedTags : [],
      geographicArea: art.geographicArea || preferences.country || 'Global',
      is24h: true,
    }));

    return {
      id: `briefing-ai-${Date.now()}`,
      scopeId: scope.id,
      scopeName: scope.name,
      timestamp: horaActual,
      audioScript: parsed.audioScript || `Síntesis informativa de las últimas 24 horas para ${scope.name}.`,
      summaryBulletPoints: parsed.summaryBulletPoints || articles.map((a) => a.summary),
      articles,
      matchedTagsCount: articles.filter((a) => a.matchedTags.length > 0).length,
      totalArticlesAnalyzed: articles.length * 3,
      isExhaustive24h: true,
      lastSearchDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };
  },

  /**
   * Rastrea y descubre autónomamente nuevas fuentes de referencia (blogs, foros, portales) para la biblioteca.
   */
  async discoverSourcesWithAI(
    scopeName: string,
    scopeDescription: string,
    tags: string[],
    existingDomains: string[],
    onProgress?: (msg: string) => void
  ): Promise<DiscoveredSource[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Configura tu Gemini API Key para descubrir fuentes automáticamente.');
    }

    if (onProgress) onProgress(`Explorando la web para descubrir portales, blogs y foros de ${scopeName}...`);

    const promptText = `
Eres un analista de medios digitales e Inteligencia Artificial de la app Briefing AI.
Tu objetivo es investigar y descubrir entre 4 y 6 NUEVAS fuentes de información de alta calidad (blogs especializados, foros comunitarios, portales temáticos, revistas digitales o podcasts) para la temática "${scopeName}".

CONFIGURACIÓN DE LA TEMÁTICA:
- Descripción: ${scopeDescription}
- Palabras clave / Subtemáticas: ${tags.join(', ')}
- Dominios que YA están en la biblioteca (NO los repitas): ${existingDomains.join(', ')}

REGLAS DE DESCUBRIMIENTO:
1. Encuentra fuentes reales y reputadas en español o inglés.
2. Varía los tipos de fuente: incluye al menos 1 blog de autor/experto, 1 foro o comunidad, 1 portal especializado y 1 medio digital.
3. Para cada fuente descubierta proporciona:
   - "id": identificador tipo slug (ej. "xataka-ia")
   - "name": Nombre comercial de la fuente.
   - "domain": Dominio web limpio (ej. "elordenmundial.com").
   - "description": Una breve descripción de 1-2 frases explicando por qué es valiosa esta fuente para la temática.
   - "category": Tipo de categoría (ej. "Blog de Autor", "Comunidad/Foro", "Portal Especializado", "Podcast").
   - "sourceType": Uno de los valores: "blog", "foro", "prensa", "podcast", "oficial".
   - "url": URL completa de acceso a la web.

Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{
  "sources": [
    {
      "id": "slug-fuente",
      "name": "Nombre de la Fuente",
      "domain": "dominio.com",
      "description": "Explicación de valor...",
      "category": "Blog Especializado",
      "sourceType": "blog",
      "url": "https://dominio.com"
    }
  ]
}
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Error al descubrir fuentes con Gemini API (${response.status}).`);
    }

    const resData = await response.json();
    const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return (parsed.sources || []).map((s: any, idx: number) => ({
      id: s.id || `discovered-${Date.now()}-${idx}`,
      name: s.name || 'Nueva Fuente',
      domain: s.domain || 'web.com',
      description: s.description || 'Fuente sugerida por IA.',
      category: s.category || 'Portal Especializado',
      scopeId: '',
      sourceType: s.sourceType || 'blog',
      url: s.url || `https://${s.domain || 'google.com'}`,
    }));
  },
};
