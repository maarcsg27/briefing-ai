// Vercel Serverless Function: Extracción & Curación de Noticias con IA (Sin CORS)
// Endpoint: /api/curate-news

interface RequestBody {
  scopeId: string;
  scopeName: string;
  tags?: string[];
  sources?: Array<{ id: string; name: string; domain: string; enabled: boolean; rssUrl?: string }>;
  bannedKeywords?: string[];
  maxLimit?: number;
  apiKey?: string;
  country?: string;
  geographicScope?: string;
}

interface ExtractedArticle {
  titular: string;
  enlace: string;
  fuente: string;
  dominio: string;
  texto_completo: string;
  pubDate?: string;
}

function cleanUrl(str: string, defaultDomain: string): string {
  if (!str) return `https://${defaultDomain}`;
  let cleaned = str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();

  const hrefMatch = cleaned.match(/href=["'](https?:\/\/[^"']+)["']/i);
  if (hrefMatch) {
    return hrefMatch[1];
  }

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }

  return `https://${defaultDomain}`;
}

function cleanHtmlTags(str: string): string {
  if (!str) return '';
  let cleaned = str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');

  cleaned = cleaned.replace(/<[^>]*>/gi, ' ');
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

function extractRssItems(xmlText: string, defaultSource: string, defaultDomain: string): ExtractedArticle[] {
  const items: ExtractedArticle[] = [];
  const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i);
    const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || itemXml.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i);
    const pubDateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
    const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/i);

    let rawTitle = titleMatch ? titleMatch[1] : '';
    let rawLink = linkMatch ? linkMatch[1] : '';
    let rawDesc = descMatch ? descMatch[1] : '';
    let sourceName = sourceMatch ? cleanHtmlTags(sourceMatch[1]) : defaultSource;

    const cleanTitle = cleanHtmlTags(rawTitle);
    const cleanLink = cleanUrl(rawLink, defaultDomain);
    const cleanDesc = cleanHtmlTags(rawDesc);

    if (cleanTitle && cleanTitle.length > 8) {
      let domain = defaultDomain;
      try {
        if (cleanLink && cleanLink.startsWith('http')) {
          domain = new URL(cleanLink).hostname.replace(/^www\./, '');
        }
      } catch {}

      items.push({
        titular: cleanTitle,
        enlace: cleanLink,
        fuente: sourceName || domain,
        dominio: domain,
        texto_completo: `${cleanTitle}. ${cleanDesc}`.substring(0, 1000),
        pubDate: pubDateMatch ? pubDateMatch[1] : '',
      });
    }
  }

  return items;
}

declare const process: { env?: Record<string, string | undefined> } | undefined;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se acepta método POST.' });
  }

  try {
    const body: RequestBody = req.body || {};
    const {
      scopeName = 'Actualidad',
      scopeId = 'actualidad',
      tags = [],
      sources = [],
      bannedKeywords = [],
      maxLimit = 20,
      apiKey: clientApiKey,
      country = 'España',
      geographicScope = 'nacional',
    } = body;

    const envMap = (typeof process !== 'undefined' && process?.env) ? process.env : {};
    const apiKey =
      clientApiKey ||
      envMap.GEMINI_API_KEY ||
      envMap.VITE_GEMINI_API_KEY ||
      '';

    const enabledSources = (sources || []).filter((s) => s.enabled);
    const extractedArticles: ExtractedArticle[] = [];

    // --- 1. RASTREO Y SCRAPING DIRECTO SERVERLESS (SIN CORS) ---
    const gl = country.toLowerCase().includes('global') || geographicScope === 'internacional' ? 'US' : 'ES';
    const hl = 'es';
    const ceid = `${gl}:${hl}`;

    const fetchTasks: Promise<void>[] = [];

    if (enabledSources.length > 0) {
      enabledSources.forEach((src) => {
        const cleanDomain = src.domain.toLowerCase().replace(/^www\./, '');
        
        // 1. Petición directa a Google News site query para la fuente
        fetchTasks.push(
          (async () => {
            try {
              const query = `site:${cleanDomain} when:24h`;
              const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
              const response = await fetch(rssUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BriefingAI-Worker/2.0)' },
                signal: AbortSignal.timeout(5000),
              });
              if (response.ok) {
                const xml = await response.text();
                const items = extractRssItems(xml, src.name, cleanDomain);
                extractedArticles.push(...items);
              }
            } catch (err) {
              console.warn(`[Serverless Worker] Error consultando fuente ${src.name}:`, err);
            }
          })()
        );

        // 2. Búsqueda combinada de etiquetas dentro de la fuente de la biblioteca
        if (tags.length > 0) {
          tags.slice(0, 5).forEach((tag) => {
            const cleanTag = tag.replace(/^#/, '').trim();
            if (!cleanTag) return;
            fetchTasks.push(
              (async () => {
                try {
                  const query = `${cleanTag} site:${cleanDomain} when:24h`;
                  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
                  const response = await fetch(rssUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BriefingAI-Worker/2.0)' },
                    signal: AbortSignal.timeout(5000),
                  });
                  if (response.ok) {
                    const xml = await response.text();
                    const items = extractRssItems(xml, src.name, cleanDomain);
                    extractedArticles.push(...items);
                  }
                } catch {}
              })()
            );
          });
        }
      });
    } else {
      fetchTasks.push(
        (async () => {
          try {
            const query = `${scopeName} when:24h`;
            const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
            const response = await fetch(rssUrl, {
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BriefingAI-Worker/2.0)' },
              signal: AbortSignal.timeout(5000),
            });
            if (response.ok) {
              const xml = await response.text();
              const items = extractRssItems(xml, 'Medio Verificado', 'noticias.es');
              extractedArticles.push(...items);
            }
          } catch (err) {
            console.warn('[Serverless Worker] Error en búsqueda general:', err);
          }
        })()
      );
    }

    await Promise.allSettled(fetchTasks);

    // Deduplicar artículos extraídos
    const seenTitles = new Set<string>();
    let uniqueExtracted: ExtractedArticle[] = [];
    extractedArticles.forEach((art) => {
      const normalized = art.titular.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 28);
      if (!seenTitles.has(normalized) && art.titular.length > 10) {
        seenTitles.add(normalized);
        uniqueExtracted.push(art);
      }
    });

    // 1. FILTRADO ESTRICTO DE FUENTES: Mantener ÚNICAMENTE noticias pertenecientes a la biblioteca del usuario
    if (enabledSources.length > 0) {
      const enabledDomains = enabledSources.map((s) => s.domain.toLowerCase().replace(/^www\./, ''));
      uniqueExtracted = uniqueExtracted.filter((art) => {
        const domainClean = (art.dominio || '').toLowerCase().replace(/^www\./, '');
        const urlClean = (art.enlace || '').toLowerCase();
        return enabledDomains.some((d) => domainClean.includes(d) || urlClean.includes(d));
      });
    }

    // 2. FILTRADO ESTRICTO DE PALABRAS VETADAS (Blacklist)
    if (bannedKeywords.length > 0) {
      uniqueExtracted = uniqueExtracted.filter((art) => {
        const text = `${art.titular} ${art.texto_completo}`.toLowerCase();
        return !bannedKeywords.some((kw) => kw.trim() && text.includes(kw.trim().toLowerCase()));
      });
    }

    // --- 2. PIPELINE DE CURACIÓN CON GEMINI 2.5 FLASH (SI API KEY ESTÁ ACTIVA) ---
    if (apiKey && apiKey.length > 10 && uniqueExtracted.length > 0) {
      try {
        const candidateLimit = Math.max(maxLimit * 2.5, 40);
        const batch = uniqueExtracted.slice(0, candidateLimit).map((a) => ({
          titular: a.titular,
          enlace: a.enlace,
          fuente: a.fuente,
          texto_completo: (a.texto_completo || '').substring(0, 600),
        }));

        const promptText = `
Actúa como el motor de curación de contenidos y análisis de texto para un agregador de noticias hiper-personalizado. Tu objetivo es procesar un lote de noticias extraídas de diversas fuentes, filtrar estrictamente aquellas que coincidan con los intereses del usuario y generar un resumen estructurado.

A continuación, recibirás dos bloques de información:
1. [PREFERENCIAS_DEL_USUARIO]: Las categorías y etiquetas (tags) específicas que le interesan al usuario.
2. [NOTICIAS_EXTRAIDAS]: Una lista de artículos obtenidos mediante web scraping, que incluye el Titular, el Enlace y el Texto Completo de cada noticia.

TUS INSTRUCCIONES:
1. FILTRADO: Analiza el texto completo de cada noticia en [NOTICIAS_EXTRAIDAS]. Compara el contenido con las etiquetas en [PREFERENCIAS_DEL_USUARIO]. Descarta cualquier noticia que no tenga una relación directa, clara y sustancial con al menos una de las etiquetas del usuario.
2. RESUMEN: Para las noticias que pasen el filtro, lee el contenido completo y redacta un resumen de exactamente un párrafo (máximo 4-5 oraciones). El resumen debe ser objetivo, directo al grano y contener la información de mayor valor de la noticia. No uses frases introductorias como "Este artículo trata sobre..." o "En esta noticia...".
3. CLASIFICACIÓN ADICIONAL: Asigna el sentimiento general ("Positivo", "Neutro", "Negativo") y una puntuación de impacto/relevancia ("relevance_score": entero de 1 a 10).
4. FORMATO DE SALIDA: Debes devolver la información EXCLUSIVAMENTE en formato JSON válido, sin texto adicional en formato Markdown.

La estructura del JSON debe ser exactamente esta:
{
  "noticias_filtradas": [
    {
      "titular": "Titular original de la noticia",
      "enlace": "URL original proporcionada",
      "fuente": "Nombre del medio o fuente",
      "etiquetas_coincidentes": ["etiqueta1", "etiqueta2"],
      "resumen": "Tu resumen objetivo de un solo párrafo aquí (4-5 oraciones).",
      "sentiment": "Positivo",
      "relevance_score": 8
    }
  ],
  "audioScript": "Guion fluido en español para locución por voz..."
}

-----------------
[PREFERENCIAS_DEL_USUARIO]
{
  "categoria": "${scopeName}",
  "etiquetas_prioritarias": ${JSON.stringify(tags)},
  "palabras_vetadas": ${JSON.stringify(bannedKeywords)},
  "limite": ${maxLimit}
}

[NOTICIAS_EXTRAIDAS]
${JSON.stringify(batch, null, 2)}
`;

        const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'];

        for (const model of modelsToTry) {
          try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const aiRes = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                  temperature: 0.1,
                  responseMimeType: 'application/json',
                },
              }),
              signal: AbortSignal.timeout(15000),
            });

            if (aiRes.ok) {
              const aiData = await aiRes.json();
              const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
              const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleanJson);

              const filtered = Array.isArray(parsed.noticias_filtradas) ? parsed.noticias_filtradas : [];
              if (filtered.length > 0) {
                const finalArticles = filtered.slice(0, maxLimit).map((art: any, idx: number) => {
                  let domain = 'fuente.com';
                  try {
                    if (art.enlace) domain = new URL(art.enlace).hostname.replace(/^www\./, '');
                  } catch {}

                  const validLink = cleanUrl(art.enlace, domain);
                  let cleanSummary = cleanHtmlTags(art.resumen || '');
                  if (cleanSummary.length < 40) {
                    cleanSummary = `${art.titular}. Noticia verificada publicada por ${art.fuente || domain} con las claves e información de ${scopeName}.`;
                  }

                  let matchedTagsList: string[] = Array.isArray(art.etiquetas_coincidentes) 
                    ? art.etiquetas_coincidentes.map((t: string) => t.replace(/^#/, '').trim()) 
                    : [];
                  
                  if (matchedTagsList.length === 0 && tags.length > 0) {
                    const fullTextToSearch = `${art.titular || ''} ${cleanSummary}`.toLowerCase();
                    matchedTagsList = tags.filter((t) => {
                      const cleanT = t.replace(/^#/, '').trim().toLowerCase();
                      return cleanT.length > 2 && fullTextToSearch.includes(cleanT);
                    });
                  }

                  if (matchedTagsList.length === 0 && tags.length > 0) {
                    matchedTagsList = [tags[0].replace(/^#/, '').trim()];
                  }

                  return {
                    id: `ai-${Date.now()}-${idx}`,
                    title: cleanHtmlTags(art.titular || 'Noticia destacada'),
                    summary: cleanSummary,
                    contentSnippet: cleanSummary,
                    source: cleanHtmlTags(art.fuente || domain),
                    sourceDomain: domain,
                    sourceUrl: validLink,
                    publishedAt: 'Últimas 24h',
                    isOfficial: true,
                    matchedTags: matchedTagsList,
                    geographicArea: country || 'España',
                    is24h: true,
                    sentiment: art.sentiment || 'Neutro',
                    relevanceScore: typeof art.relevance_score === 'number' ? art.relevance_score : 8,
                    whyRelevance: `Noticia seleccionada de la fuente oficial ${art.fuente || domain} por coincidencia con etiquetas: ${matchedTagsList.map((t) => `#${t}`).join(', ')}`,
                  };
                });

                finalArticles.sort((a: any, b: any) => {
                  const scoreA = (a.matchedTags ? a.matchedTags.length : 0) * 20 + (a.relevanceScore || 0);
                  const scoreB = (b.matchedTags ? b.matchedTags.length : 0) * 20 + (b.relevanceScore || 0);
                  return scoreB - scoreA;
                });

                return res.status(200).json({
                  success: true,
                  source: 'gemini-serverless',
                  scopeId,
                  scopeName,
                  timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                  audioScript: parsed.audioScript || `Resumen de prensa de ${scopeName}.`,
                  summaryBulletPoints: finalArticles.map((a: any) => a.summary),
                  articles: finalArticles,
                  totalAnalyzed: uniqueExtracted.length,
                });
              }
            }
          } catch (modelErr) {
            console.warn(`[Serverless Worker] Error con modelo ${model}:`, modelErr);
          }
        }
      } catch (aiErr) {
        console.warn('[Serverless Worker] Error llamando a Gemini:', aiErr);
      }
    }

    // --- 3. RESPUESTA DE CONTINGENCIA SERVERLESS (SI GEMINI NO RESPONDE O NO HAY KEY) ---
    let scoredExtracted = uniqueExtracted.map((art) => {
      const fullText = `${art.titular} ${art.texto_completo}`.toLowerCase();
      const matched = tags.filter((t) => t.trim() && fullText.includes(t.toLowerCase().trim()));
      return {
        ...art,
        matchedTags: matched,
        score: matched.length * 20,
      };
    });

    if (tags.length > 0) {
      const tagMatchedOnly = scoredExtracted.filter((art) => art.matchedTags.length > 0);
      if (tagMatchedOnly.length > 0) {
        scoredExtracted = tagMatchedOnly;
      }
    }

    scoredExtracted.sort((a, b) => b.score - a.score);

    const fallbackArticles = scoredExtracted.slice(0, maxLimit).map((art, idx) => {
      let cleanSummary = cleanHtmlTags(art.texto_completo || '');
      if (cleanSummary.length < 40) {
        cleanSummary = `${art.titular}. Cobertura completa publicada por ${art.fuente} detallando los hechos clave e impacto en ${scopeName}.`;
      }

      const tagsToShow = art.matchedTags && art.matchedTags.length > 0 ? art.matchedTags : (tags.length > 0 ? [tags[0]] : []);

      return {
        id: `fallback-${Date.now()}-${idx}`,
        title: art.titular,
        summary: cleanSummary,
        contentSnippet: cleanSummary,
        source: art.fuente,
        sourceDomain: art.dominio,
        sourceUrl: art.enlace,
        publishedAt: 'Últimas 24h',
        isOfficial: true,
        matchedTags: tagsToShow.map((t) => t.replace(/^#/, '').trim()),
        geographicArea: country || 'España',
        is24h: true,
        whyRelevance: `Noticia seleccionada de la fuente oficial ${art.fuente} por coincidencia con etiquetas: ${tagsToShow.map((t) => `#${t.replace(/^#/, '').trim()}`).join(', ')}`,
      };
    });

    return res.status(200).json({
      success: true,
      source: 'scraper-fallback',
      scopeId,
      scopeName,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      audioScript: `Resumen de prensa de ${scopeName}.`,
      summaryBulletPoints: fallbackArticles.map((a) => a.summary),
      articles: fallbackArticles,
      totalAnalyzed: uniqueExtracted.length,
    });
  } catch (error: any) {
    console.error('[Serverless Worker] Error general:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno en el servidor.',
    });
  }
}
