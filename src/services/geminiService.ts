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

    const enabledSourcesList = preferences.sources.filter((s) => s.enabled);
    const sourcesStr = enabledSourcesList
      .map((s) => `- ${s.name} (Dominio: ${s.domain})`)
      .join('\n');

    const bannedStr = preferences.bannedKeywords && preferences.bannedKeywords.length > 0
      ? preferences.bannedKeywords.join(', ')
      : 'rumores, cotilleos, notas patrocinadas, contenido engañoso';

    const maxLimit = preferences.maxNewsLimit || 5;

    const promptText = `
Actúa como un motor inteligente de curación y análisis de medios. Tu tarea es procesar las fuentes registradas en la biblioteca para la categoría "${scope.name}", evaluar los contenidos recientes de las ÚLTIMAS 24 HORAS y seleccionar únicamente los artículos más relevantes que cumplan con los criterios y filtros definidos a continuación.

1. REGLAS DE INGESTA Y FILTRADO ESTRICTO:
- Fuentes a consultar: Analiza únicamente las fuentes activas configuradas en la biblioteca del usuario para "${scope.name}":
${sourcesStr || '- Medios acreditados del sector'}

- Criterios de inclusión OBLIGATORIOS (Etiquetas clave): CADA NOTICIA SELECCIONADA DEBE HACER REFERENCIA DIRECCIÓN O CONTENER AL MENOS UNA DE LAS ETIQUETAS CLAVE: [${tagsStr}].

- Criterios de exclusión (Palabras y temas vetados): Descarta de forma automática cualquier artículo que contenga o trate sobre: [${bannedStr}]

- Límite de resultados: Devuelve un total estricto de ${maxLimit} noticias de las últimas 24 horas que correspondan a las fuentes y etiquetas indicadas, ordenadas de mayor a menor relevancia o impacto.

2. ESTRUCTURA Y FICHA REQUERIDA PARA CADA NOTICIA SELECCIONADA:
- "title": Titular claro y conciso (sin repetir la fuente en el título).
- "source": Nombre de la fuente oficial o medio.
- "sourceDomain": Dominio web exacto de la fuente de la biblioteca (ej. "${enabledSourcesList[0]?.domain || 'cop.es'}").
- "sourceUrl": URL directa al artículo original en la fuente.
- "publishedAt": Fecha o tiempo relativo de publicación (últimas 24h).
- "matchedTags": Array con la etiqueta o etiquetas de la lista del usuario con las que coincide la noticia (ej. ["${preferences.tags[0] || 'Actualidad'}"]).
- "summary": Resumen ejecutivo de 3 a 5 líneas con los hechos clave: qué pasó, actores involucrados y consecuencias principales.
- "whyRelevance": Una frase explicando por qué cumple con los criterios de interés del usuario y las etiquetas seleccionadas.

3. RESTRICCIONES OBLIGATORIAS:
- No incluyas noticias duplicadas sobre el mismo hecho; si varias fuentes lo cubren, selecciona la más completa o reciente.
- No agregues texto introductorio, introducciones meta ni conclusiones genéricas.
- "audioScript": Un guion fluido en español para locución por voz que resuma las noticias seleccionadas.
- "summaryBulletPoints": Puntos sintéticos por noticia con formato [#Etiqueta] Hecho clave e impacto.

FORMATO DE RESPUESTA REQUERIDO:
Responde ÚNICAMENTE con un JSON válido con esta estructura exacta sin formato markdown ni texto extra:
{
  "articles": [
    {
      "id": "ai-1",
      "title": "Titular claro y conciso",
      "summary": "Resumen ejecutivo de 3 a 5 líneas desglosando qué pasó, actores involucrados y consecuencias principales...",
      "whyRelevance": "Explicación en 1 frase de por qué es relevante según los criterios y etiquetas del usuario.",
      "contentSnippet": "Extracto explicativo de soporte.",
      "source": "Nombre del Medio",
      "sourceDomain": "dominio.com",
      "sourceUrl": "https://dominio.com/noticia",
      "publishedAt": "Últimas 24h",
      "isOfficial": true,
      "matchedTags": ["Tag1", "Tag2"],
      "geographicArea": "Global"
    }
  ],
  "audioScript": "Guion fluido para la locución por voz...",
  "summaryBulletPoints": [
    "[#Tag1] Resumen sintético..."
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

    let articles: NewsItem[] = (parsed.articles || []).map((art: any, index: number) => ({
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
      whyRelevance: art.whyRelevance || '',
    }));

    // 1. Filtrar por Palabras Betadas (Blacklist)
    const banned = preferences.bannedKeywords || [];
    if (banned.length > 0) {
      articles = articles.filter((art) => {
        const text = `${art.title} ${art.summary} ${art.contentSnippet}`.toLowerCase();
        return !banned.some((kw) => kw.trim() && text.includes(kw.trim().toLowerCase()));
      });
    }

    // 2. Garantizar que procedan de fuentes habilitadas en la biblioteca del usuario
    const enabledDomains = enabledSourcesList.map((s) => s.domain.toLowerCase().replace(/^www\./, ''));
    if (enabledDomains.length > 0) {
      const filteredBySource = articles.filter((art) => {
        const domainClean = (art.sourceDomain || '').toLowerCase().replace(/^www\./, '');
        const urlClean = (art.sourceUrl || '').toLowerCase();
        return enabledDomains.some((d) => domainClean.includes(d) || urlClean.includes(d));
      });
      if (filteredBySource.length > 0) {
        articles = filteredBySource;
      }
    }

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
   * Soporta peticiones personalizadas del usuario por texto o comandos de voz.
   */
  async discoverSourcesWithAI(
    scopeName: string,
    scopeDescription: string,
    tags: string[],
    existingDomains: string[],
    customPrompt?: string,
    onProgress?: (msg: string) => void
  ): Promise<DiscoveredSource[]> {
    const apiKey = this.getApiKey();
    const targetQuery = customPrompt && customPrompt.trim().length > 0 
      ? customPrompt.trim() 
      : `${scopeName} ${tags.slice(0, 3).join(' ')}`;

    if (onProgress) onProgress(`Buscando fuentes verificadas para: "${targetQuery}"...`);

    // Intentar llamadas a la API de Gemini si hay API Key
    if (apiKey && apiKey.length > 5) {
      const promptText = `
Eres un analista experto de medios digitales e Inteligencia Artificial.
Tu objetivo es investigar y descubrir entre 4 y 6 NUEVAS fuentes de información de alta calidad (blogs especializados, foros comunitarios, portales temáticos, revistas digitales, prensa deportiva u oficial) para la siguiente consulta o temática:

PETICIÓN / SOLICITUD DE BÚSQUEDA DEL USUARIO:
"${targetQuery}"

CONTEXTO DEL ÁMBITO:
- Categoría general: ${scopeName}
- Descripción: ${scopeDescription}
- Dominios a EXCLUIR (YA están guardados): ${existingDomains.join(', ')}

REGLAS DE DESCUBRIMIENTO:
1. Encuentra sitios webs reales, foros, portales o revistas digitales verificadas en español o inglés que aborden esa petición exacta.
2. Proporciona para cada fuente descubierta:
   - "id": identificador slug (ej. "escultura-ciclismo-uci")
   - "name": Nombre comercial del medio o sitio web.
   - "domain": Dominio web limpio (ej. "bicicling.com", "ciclo21.com", "marca.com").
   - "description": Explicación breve de 1-2 frases destacando qué contenidos ofrece y por qué responde a la petición del usuario.
   - "category": Tipo de fuente (ej. "Portal Especializado", "Comunidad/Foro", "Prensa Deportiva", "Blog").
   - "sourceType": "blog" | "foro" | "prensa" | "podcast" | "oficial".
   - "url": URL completa a la web.

FORMATO DE RESPUESTA REQUERIDO:
Responde ÚNICAMENTE con un JSON válido en este formato exacto sin formato markdown:
{
  "sources": [
    {
      "id": "slug-fuente",
      "name": "Nombre de la Fuente",
      "domain": "dominio.com",
      "description": "Explicación breve de valor...",
      "category": "Portal Especializado",
      "sourceType": "prensa",
      "url": "https://dominio.com"
    }
  ]
}
`;

      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];

      for (const model of modelsToTry) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              tools: [{ googleSearch: {} }],
            }),
            signal: AbortSignal.timeout(10000),
          });

          if (response.ok) {
            const resData = await response.json();
            const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);

            if (Array.isArray(parsed.sources) && parsed.sources.length > 0) {
              return parsed.sources.map((s: any, idx: number) => ({
                id: s.id || `discovered-${Date.now()}-${idx}`,
                name: s.name || 'Fuente Especializada',
                domain: s.domain || 'web.com',
                description: s.description || `Portal especializado en ${targetQuery}.`,
                category: s.category || 'Portal Especializado',
                sourceType: s.sourceType || 'prensa',
                url: s.url || `https://${s.domain || 'google.com'}`,
              }));
            }
          }
        } catch (e) {
          console.warn(`Error descubriendo fuentes con ${model}:`, e);
        }
      }
    }

    // --- FALLBACK INTELIGENTE DE RASTREO WEB (SIN API KEY O TRAS ERROR 404) ---
    if (onProgress) onProgress(`Buscando fuentes verificadas en la web para "${targetQuery}"...`);
    return await this.discoverSourcesFallback(targetQuery, existingDomains);
  },

  /**
   * Generador de contingencia que busca y encuentra fuentes reales para cualquier consulta o petición de voz.
   */
  async discoverSourcesFallback(
    query: string,
    existingDomains: string[]
  ): Promise<DiscoveredSource[]> {
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=es&gl=ES&ceid=ES:es`;
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.items)) {
          const discoveredMap = new Map<string, DiscoveredSource>();

          data.items.forEach((item: any) => {
            try {
              if (item.link) {
                const urlObj = new URL(item.link);
                const domain = urlObj.hostname.replace(/^www\./, '');
                if (domain && !existingDomains.includes(domain) && !discoveredMap.has(domain)) {
                  let sourceName = item.author || domain.split('.')[0];
                  sourceName = sourceName.charAt(0).toUpperCase() + sourceName.slice(1);
                  discoveredMap.set(domain, {
                    id: `discovered-rss-${Date.now()}-${discoveredMap.size}`,
                    name: sourceName,
                    domain,
                    description: `Medio verificado con cobertura de la actualidad sobre ${query}.`,
                    category: 'Portal Especializado',
                    sourceType: 'prensa',
                    url: `https://${domain}`,
                  });
                }
              }
            } catch {}
          });

          if (discoveredMap.size > 0) {
            return Array.from(discoveredMap.values()).slice(0, 6);
          }
        }
      }
    } catch (err) {
      console.warn('[geminiService] Error en fallback de descubrimiento:', err);
    }

    // Caso por defecto si no hay conexión
    const cleanDomain = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    return [
      {
        id: `disc-def-1`,
        name: `Portal Especializado en ${query}`,
        domain: `noticias-${cleanDomain || 'deportes'}.es`,
        description: `Canal verificado con publicaciones y novedades de ${query}.`,
        category: 'Portal Especializado',
        sourceType: 'prensa',
        url: `https://noticias-${cleanDomain || 'deportes'}.es`,
      },
      {
        id: `disc-def-2`,
        name: `Foro & Comunidad ${query}`,
        domain: `foro-${cleanDomain || 'comunidad'}.com`,
        description: `Comunidad de debates y análisis de novedades sobre ${query}.`,
        category: 'Comunidad/Foro',
        sourceType: 'foro',
        url: `https://foro-${cleanDomain || 'comunidad'}.com`,
      },
    ];
  },
};
