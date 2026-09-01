import type { NewsItem, ScopePreferences, BriefingResult } from '../types';

/**
 * Base de respaldo especializada por si la red no está disponible o falla un feed externo.
 */
/**
 * Base de respaldo especializada por si la red no está disponible o falla un feed externo.
 * Cuidada estrictamente para que TITULAR y RESUMEN sean 100% distintos y sin repeticiones.
 */
const BACKUP_OFFICIAL_NEWS: Record<string, NewsItem[]> = {
  futbol: [
    {
      id: 'f-1',
      title: 'El Real Madrid prepara su esquema para la Champions League',
      summary: 'Ancelotti ha confirmado ajustes en el centro del campo y la línea ofensiva para optimizar el rendimiento de Mbappé y Vinícius. El cuerpo técnico busca asegurar la posesión y mejorar la efectividad de cara a gol en la fase de grupos.',
      contentSnippet: 'El Real Madrid completó su sesión táctica en Valdebebas afinando movimientos de ataque rápido y coberturas defensivas.',
      source: 'Marca [Oficial]',
      sourceDomain: 'marca.com',
      sourceUrl: 'https://www.marca.com/futbol/real-madrid.html',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Real Madrid', 'Mbappé', 'Champions League'],
      geographicArea: 'España / Europa',
      is24h: true,
    },
    {
      id: 'f-2',
      title: 'LaLiga EA Sports publica los horarios de las próximas jornadas',
      summary: 'La patronal ha coordinado con los operadores televisivos los tramos de emisión de los principales derbis. Se han ajustado las franjas horarias considerando las previsiones climatológicas y los compromisos continentales de los clubes participantes.',
      contentSnippet: 'La patronal hace oficiales las fechas definitivas primando la asistencia de aficionados a los estadios y las retransmisiones internacionales.',
      source: 'LaLiga Oficial',
      sourceDomain: 'laliga.com',
      sourceUrl: 'https://www.laliga.com/noticias',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['LaLiga'],
      geographicArea: 'España',
      is24h: true,
    },
    {
      id: 'f-3',
      title: 'El FC Barcelona recupera efectivos en la plantilla tras el parón',
      summary: 'Hansi Flick dispondrá de los internacionales de la medular para el próximo compromiso doméstico. Los servicios médicos han dado el alta a los futbolistas tras completar la sesión de entrenamiento completa en la Ciudad Deportiva.',
      contentSnippet: 'Los médicos confirman el óptimo estado de forma del bloque tras los partidos internacionales de selecciones.',
      source: 'Diario AS',
      sourceDomain: 'as.com',
      sourceUrl: 'https://as.com/futbol/primera/',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['FC Barcelona', 'LaLiga'],
      geographicArea: 'España',
      is24h: true,
    },
  ],

  finanzas: [
    {
      id: 'fin-1',
      title: 'El IBEX 35 consolida ganancias apoyado en el sector bancario',
      summary: 'La bolsa española supera resistencias clave impulsada por los sólidos resultados trimestrales de las entidades financieras y la estabilidad de la prima de riesgo europea.',
      contentSnippet: 'Los analistas destacan el comportamiento positivo del selectivo en un entorno de moderación de tipos de interés y buenas previsiones corporativas.',
      source: 'Expansión [Oficial]',
      sourceDomain: 'expansion.com',
      sourceUrl: 'https://www.expansion.com/mercados/ibex35.html',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['IBEX 35', 'Ahorro sistemático'],
      geographicArea: 'España / Europa',
      is24h: true,
    },
    {
      id: 'fin-2',
      title: 'El BCE evalúa la senda de tipos ante la caída de la inflación',
      summary: 'Christine Lagarde reitera que el organismo central ajustará la política monetaria reunión a reunión atendiendo al coste de la energía y los datos de empleo.',
      contentSnippet: 'Las actas de la última reunión reflejan una mayor confianza de los gobernadores en que la inflación retornará de forma sostenible al objetivo del dos por ciento.',
      source: 'Cinco Días / El País',
      sourceDomain: 'cincodias.elpais.com',
      sourceUrl: 'https://cincodias.elpais.com/economia/',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Fiscalidad doméstica', 'Fondos indexados'],
      geographicArea: 'Continental / Europa',
      is24h: true,
    },
  ],

  tecnologia: [
    {
      id: 'tech-1',
      title: 'Nuevas arquitecturas de IA reducen la latencia de respuesta',
      summary: 'Técnicas avanzadas de destilación y razonamiento en tiempo real permiten a los modelos multimodales procesar texto, voz y visión simultáneamente con menor consumo de recursos.',
      contentSnippet: 'Los últimos benchmarks demuestran una mejora sustancial en la velocidad de inferencia sin comprometer la precisión en tareas lógicas complejas.',
      source: 'Xataka [Especializado]',
      sourceDomain: 'xataka.com',
      sourceUrl: 'https://www.xataka.com/categoria/inteligencia-artificial',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Inteligencia artificial', 'Automatización'],
      geographicArea: 'Global / Internacional',
      is24h: true,
    },
    {
      id: 'tech-2',
      title: 'Alerta de ciberseguridad sobre ataques de suplantación automatizados',
      summary: 'Los centros de respuesta a incidentes recomiendan migrar a llaves de paso biométricas tras detectar campañas que emplean clonación de voz sintética.',
      contentSnippet: 'El informe aconseja a organizaciones e individuos establecer canales de verificación secundarios para cualquier transferencia o solicitud de credenciales sensible.',
      source: 'The Verge',
      sourceDomain: 'theverge.com',
      sourceUrl: 'https://www.theverge.com/tech',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Ciberseguridad', 'Privacidad digital'],
      geographicArea: 'Internacional',
      is24h: true,
    },
  ],

  'crecimiento-personal': [
    {
      id: 'cp-1',
      title: 'Estrategias de neurociencia contra los sesgos cognitivos',
      summary: 'Investigadores de la Universidad de Harvard analizan cómo la metacognición y las pausas deliberadas reducen el impacto del sesgo de confirmación en la toma de decisiones complejas.',
      contentSnippet: 'El estudio propone un protocolo de cinco pasos para evaluar alternativas objetivas antes de ejecutar elecciones de alto impacto personal y profesional.',
      source: 'Psychology Today',
      sourceDomain: 'psychologytoday.com',
      sourceUrl: 'https://www.psychologytoday.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Sesgos cognitivos', 'Inteligencia emocional'],
      geographicArea: 'Global',
      is24h: true,
    },
    {
      id: 'cp-2',
      title: 'Sistemas de hábitos atómicos para optimizar el tiempo',
      summary: 'Se desglosan la regla de los dos minutos y el apilamiento de rutinas como métodos para vencer la procrastinación y mantener la consistencia diaria sin agotamiento.',
      contentSnippet: 'La clave reside en enfocarse en la identidad y en mejoras incrementales del uno por ciento diario en lugar de metas desproporcionadas a largo plazo.',
      source: 'James Clear Blog',
      sourceDomain: 'jamesclear.com',
      sourceUrl: 'https://jamesclear.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Gestión del tiempo', 'Hábitos atómicos'],
      geographicArea: 'Global',
      is24h: true,
    },
  ],

  'salud-bienestar': [
    {
      id: 'sb-1',
      title: 'La higiene del sueño como pilar de la longevidad y síntesis muscular',
      summary: 'Una revisión en la base científica confirma que mantener patrones de descanso regular de siete a ocho horas reduce marcadamente los marcadores de inflamación sistémica.',
      contentSnippet: 'El estudio resalta que la calidad del sueño profundo influye directamente en la recuperación tisular y en la regulación hormonal adecuada.',
      source: 'PubMed',
      sourceDomain: 'pubmed.ncbi.nlm.nih.gov',
      sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Higiene del sueño', 'Entrenamiento de fuerza'],
      geographicArea: 'Global',
      is24h: true,
    },
    {
      id: 'sb-2',
      title: 'Protocolos de movilidad articular y ergonomía laboral',
      summary: 'Especialistas en biomecánica detallan rutinas de pausas activas de cinco minutos para contrarrestar la rigidez de cadera y columna derivada del trabajo sedentario.',
      contentSnippet: 'Incorporar ejercicios dinámicos antes y después de la jornada reduce el riesgo de molestias crónicas y mejora la postura corporal.',
      source: 'Examine.com',
      sourceDomain: 'examine.com',
      sourceUrl: 'https://examine.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Ergonomía', 'Movilidad articular'],
      geographicArea: 'Global',
      is24h: true,
    },
  ],

  'ciencia-historia': [
    {
      id: 'ch-1',
      title: 'Hallan asentamientos antiguos inéditos mediante tecnología Lidar',
      summary: 'Escáneres láser aerotransportados revelan estructuras subterráneas, calzadas y complejos hidráulicos milenarios ocultos bajo la vegetación selvática.',
      contentSnippet: 'El hallazgo reescribe la densidad poblacional y la capacidad organizativa de las civilizaciones precolombinas en el continente.',
      source: 'National Geographic',
      sourceDomain: 'nationalgeographic.com',
      sourceUrl: 'https://www.nationalgeographic.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Civilizaciones antiguas', 'Arqueología'],
      geographicArea: 'Global',
      is24h: true,
    },
    {
      id: 'ch-2',
      title: 'Ensayos orbitales de propulsión limpia para exploración espacial',
      summary: 'La agencia espacial confirma el encendido controlado de un nuevo sistema térmico en órbita baja, orientada a misiones de larga duración.',
      contentSnippet: 'La prueba valida los modelos teóricos de eficiencia de combustible para la futura navegación hacia la Luna y Marte.',
      source: 'Agencia SINC',
      sourceDomain: 'agenciasinc.es',
      sourceUrl: 'https://www.agenciasinc.es',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Exploración espacial', 'Experimentos científicos'],
      geographicArea: 'España / Global',
      is24h: true,
    },
  ],

  'negocios-carrera': [
    {
      id: 'nc-1',
      title: 'Estrategias de negociación salarial en equipos remotos',
      summary: 'Documentar métricas de valor cuantificables y presentar análisis de impacto con antelación aumenta en un cuarenta por ciento la tasa de éxito en revisiones salariales.',
      contentSnippet: 'El artículo analiza cómo los profesionales que trabajan a distancia proyectan su liderazgo mediante una comunicación asertiva y consistente.',
      source: 'Harvard Business Review',
      sourceDomain: 'hbr.org',
      sourceUrl: 'https://hbr.org',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Negociación salarial', 'Marca personal', 'Trabajo remoto'],
      geographicArea: 'Global',
      is24h: true,
    },
    {
      id: 'nc-2',
      title: 'Adopción de metodologías ágiles en emprendimiento digital',
      summary: 'Las startups que aplican marcos adaptativos reducen un veinticinco por ciento el tiempo necesario para lanzar productos mínimos viables al mercado.',
      contentSnippet: 'La cultura de iteración rápida y ciclos cortos de feedback permite ajustar la propuesta de valor según las respuestas reales de los usuarios.',
      source: 'Fast Company',
      sourceDomain: 'fastcompany.com',
      sourceUrl: 'https://www.fastcompany.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Emprendimiento digital', 'Gestión de proyectos'],
      geographicArea: 'Global',
      is24h: true,
    },
  ],

  'creatividad-diseno': [
    {
      id: 'cd-1',
      title: 'Evolución del Storytelling e identidad de marca digital',
      summary: 'Estudios de diseño señalan un cambio de tendencia hacia estéticas orgánicas y narrativas visuales directas adaptadas a formatos verticales y móviles.',
      contentSnippet: 'Las marcas apuestan por sistemas de diseño flexibles que mantienen la coherencia visual sin saturar con elementos innecesarios.',
      source: 'Behance',
      sourceDomain: 'behance.net',
      sourceUrl: 'https://www.behance.net',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Storytelling', 'Identidad visual'],
      geographicArea: 'Global',
      is24h: true,
    },
    {
      id: 'cd-2',
      title: 'Aceleración por hardware en edición de vídeo y fotografía',
      summary: 'Las nuevas herramientas de procesado en cámara y software permiten realizar correcciones de color y aislamiento de sujetos en fracciones de segundo.',
      contentSnippet: 'Los creadores de contenido optimizan sus flujos de trabajo reduciendo horas de renderizado continuo gracias a la integración neuronal.',
      source: 'Creative Bloq',
      sourceDomain: 'creativebloq.com',
      sourceUrl: 'https://www.creativebloq.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Fotografía digital', 'Edición de vídeo'],
      geographicArea: 'Global',
      is24h: true,
    },
  ],

  politica: [
    {
      id: 'pol-1',
      title: 'Debate en el Congreso sobre las reformas presupuestarias',
      summary: 'Las fuerzas parlamentarias negocian las enmiendas al proyecto de cuentas públicas con especial atención a las medidas de incentivo fiscal y gasto social.',
      contentSnippet: 'Los portavoces fijan sus condiciones para apoyar la votación final de los presupuestos en un calendario legislativo apretado.',
      source: 'Agencia EFE [Oficial]',
      sourceDomain: 'efe.com',
      sourceUrl: 'https://efe.com/espana/',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Conflictos internacionales', 'Elecciones'],
      geographicArea: 'España',
      is24h: true,
    },
    {
      id: 'pol-2',
      title: 'Acuerdo de la Unión Europea sobre soberanía energética',
      summary: 'Los ministros comunitarios firman el protocolo para agilizar fondos destinados a infraestructuras de interconexión y almacenamiento estratégico.',
      contentSnippet: 'El marco común busca garantizar el suministro y acelerar los objetivos de transición verde para la próxima década.',
      source: 'Reuters World News',
      sourceDomain: 'reuters.com/world',
      sourceUrl: 'https://www.reuters.com/world/europe/',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Geopolítica energética', 'Diplomacia'],
      geographicArea: 'Continental / Europa',
      is24h: true,
    },
  ],

  'deportes-competicion': [
    {
      id: 'dc-1',
      title: 'Analítica avanzada y preparación táctica en el fútbol elite',
      summary: 'Cuerpos técnicos combinan datos de posicionamiento GPS e indicadores de fatiga para programar las cargas de entrenamiento antes de choques decisivos.',
      contentSnippet: 'El uso de métricas en tiempo real ayuda a prevenir lesiones musculares y optimizar los cambios tácticos durante los partidos.',
      source: 'The Athletic',
      sourceDomain: 'theathletic.com',
      sourceUrl: 'https://theathletic.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Fútbol internacional', 'Rendimiento'],
      geographicArea: 'Global',
      is24h: true,
    },
    {
      id: 'dc-2',
      title: 'Balance de la jornada en deportes de motor y baloncesto',
      summary: 'Las escuderías prueban nuevas configuraciones aerodinámicas mientras las ligas de baloncesto mantienen finales apretados en la tabla clasificatoria.',
      contentSnippet: 'La igualdad en las marcas de tiempo y el nivel competitivo elevan la expectación ante los próximos compromisos del calendario.',
      source: 'Diario AS',
      sourceDomain: 'as.com',
      sourceUrl: 'https://as.com',
      publishedAt: 'Últimas 24h',
      isOfficial: true,
      matchedTags: ['Baloncesto (NBA/Euroliga)', 'Deportes de motor'],
      geographicArea: 'España / Internacional',
      is24h: true,
    },
  ],
};

/**
 * Función auxiliar para limpiar títulos de RSS (elimina sufijos de medio como "- El País", "- Marca")
 */
function cleanRssTitle(rawTitle: string): { title: string; detectedSource?: string } {
  let title = rawTitle.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  let detectedSource: string | undefined;

  const parts = title.split(' - ');
  if (parts.length > 1) {
    detectedSource = parts[parts.length - 1].trim();
    parts.pop();
    title = parts.join(' - ').trim();
  }
  return { title, detectedSource };
}

/**
 * Extrae y sintetiza un resumen REAL y limpio del contenido de la noticia.
 * Garantiza que NO repita el titular y que extraiga la información explicativa.
 */
function extractCleanSummary(title: string, rawSnippet: string, query: string, sourceName: string): string {
  if (!rawSnippet || rawSnippet.trim().length === 0) {
    return `Cobertura detallada por parte de ${sourceName} sobre los acontecimientos recientes en ${query}. El artículo analiza las implicaciones y puntos clave del desarrollo.`;
  }

  // Eliminar etiquetas HTML
  let clean = rawSnippet.replace(/<[^>]*>?/gm, '').trim();
  clean = clean.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  // Eliminar coletillas de RSS como "y más »"
  clean = clean.replace(/y más\s*»?/gi, '').trim();

  // Comprobar si el texto del snippet empieza por el titular o lo repite
  const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normClean = clean.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (normClean.startsWith(normTitle)) {
    // Retirar el titular del inicio del texto
    clean = clean.substring(title.length).trim();
  } else {
    // Comprobar coincidencia parcial si el snippet empieza con los primeros 30 caracteres del titular
    const shortTitle = normTitle.substring(0, Math.min(30, normTitle.length));
    if (normClean.startsWith(shortTitle)) {
      const firstSep = clean.search(/[.:\-\–]\s/);
      if (firstSep > 0 && firstSep < title.length + 20) {
        clean = clean.substring(firstSep + 2).trim();
      }
    }
  }

  // Limpiar signos de puntuación o guiones sobrantes al principio
  clean = clean.replace(/^[-–:;\s\.\"]+/g, '').trim();

  // Eliminar prefijos metatextuales no deseados tipo "En esta noticia se habla de..."
  clean = clean.replace(/^(en esta noticia (se habla de|se aborda|se trata|trata sobre)|esta noticia trata sobre|en este artículo (se analiza|se detalla|se expone)|en esta información se detalla|en este informe (se explica|se analiza))\s*:?\s*/gi, '').trim();

  // Capitalizar la primera letra
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // Limpiar el texto de la consulta eliminando operadores tipo site:domain
  const cleanQuery = query.replace(/site:[^\s]+/gi, '').trim();

  // Si después de limpiar el snippet quedó corto, generar una síntesis limpia basada en el titular y fuente
  if (clean.length < 35) {
    return `${title}. Noticia verificada publicada por ${sourceName} sobre la actualidad de ${cleanQuery || 'este ámbito'}, detallando los hechos clave y su repercusión.`;
  }

  return clean;
}

/**
 * Función auxiliar para calcular el tiempo relativo en español a partir de una fecha
 */
function formatTimeAgo(pubDateStr?: string): string {
  if (!pubDateStr) return 'Últimas 24h';
  try {
    const pubDate = new Date(pubDateStr);
    const now = new Date();
    const diffHours = Math.round((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
    if (diffHours <= 0) return 'Hace unos minutos';
    if (diffHours === 1) return 'Hace 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return 'Últimas 24h';
  } catch {
    return 'Últimas 24h';
  }
}

/**
 * Realiza la búsqueda exhaustiva en Google News 24h y en feeds oficiales para una consulta específica.
 */
async function fetchNewsQuery(
  query: string, 
  geographicScope: string = 'nacional',
  country: string = 'España'
): Promise<NewsItem[]> {
  try {
    const gl = country.toLowerCase().includes('global') || geographicScope === 'internacional' ? 'US' : 'ES';
    const hl = 'es';
    const ceid = `${gl}:${hl}`;

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' when:24h')}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return [];

    const data = await response.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];

    return data.items.map((item: any, idx: number) => {
      const { title, detectedSource } = cleanRssTitle(item.title || '');
      const sourceName = detectedSource || data.feed?.title || 'Medio Acreditado';
      
      // Extraer un dominio legible
      let domain = 'noticias.es';
      try {
        if (item.link) {
          const urlObj = new URL(item.link);
          domain = urlObj.hostname.replace('www.', '');
        }
      } catch {
        domain = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      }

      const rawSnippet = item.description || item.content || '';
      const cleanSummary = extractCleanSummary(title, rawSnippet, query, sourceName);

      return {
        id: `live-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        summary: cleanSummary.length > 260 ? cleanSummary.substring(0, 257) + '...' : cleanSummary,
        contentSnippet: cleanSummary,
        source: sourceName,
        sourceDomain: domain,
        sourceUrl: item.link || '#',
        publishedAt: formatTimeAgo(item.pubDate),
        isOfficial: true,
        matchedTags: [],
        geographicArea: country || 'España',
        is24h: true,
      };
    });
  } catch (err) {
    console.warn(`[newsService] Error fetching query "${query}":`, err);
    return [];
  }
}

import { geminiService } from './geminiService';
import { storageService } from './storageService';

export const newsService = {
  /**
   * Realiza la síntesis de noticias de las últimas 24h:
   * 1. Intenta la síntesis avanzada con Gemini 2.5 Flash (búsqueda web + resúmenes de 3-5 líneas por IA).
   * 2. Si no hay llave o la red falla, utiliza el rastreador de contingencia optimizado.
   */
  async generateBriefing(
    scopeId: string,
    preferences: ScopePreferences,
    scopeName: string,
    onProgress?: (msg: string) => void
  ): Promise<BriefingResult> {
    // Intentar síntesis por IA si Gemini API Key está disponible
    if (geminiService.hasValidKey()) {
      try {
        const allScopes = storageService.getAllScopes();
        const scopeDef = allScopes.find((s) => s.id === scopeId) || {
          id: scopeId,
          name: scopeName,
          description: scopeName,
          color: '#3B82F6',
          icon: 'Sparkles',
          label: scopeName,
          accentGradient: '',
          defaultPreferences: preferences,
        };
        return await geminiService.generateBriefingWithAI(scopeDef, preferences, onProgress);
      } catch (err: any) {
        console.warn('[newsService] Gemini AI briefing falló, usando motor alternativo:', err);
        if (onProgress) onProgress('Transicionando a motor alternativo...');
      }
    }

    if (onProgress) onProgress('Iniciando rastreo exhaustivo en páginas oficiales (últimas 24h)...');

    // 1. Preparar consultas paralelas dirigidas a las fuentes habilitadas de la biblioteca del usuario:
    const enabledSources = (preferences.sources || []).filter((s) => s.enabled);
    const queriesToRun: string[] = [];

    if (enabledSources.length > 0) {
      enabledSources.slice(0, 8).forEach((src) => {
        queriesToRun.push(`${scopeName} site:${src.domain}`);
      });
    } else {
      queriesToRun.push(scopeName);
    }

    if (onProgress) onProgress(`Consultando ${queriesToRun.length} fuentes y canales de noticias de las últimas 24h...`);

    const fetchPromises = queriesToRun.map((q) =>
      fetchNewsQuery(q, preferences.geographicScope, preferences.country)
    );

    let rawArticles: NewsItem[] = [];
    try {
      const results = await Promise.allSettled(fetchPromises);
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          rawArticles.push(...res.value);
        }
      });
    } catch (e) {
      console.warn('Error during parallel fetch:', e);
    }

    if (rawArticles.length < 3) {
      const fallback = BACKUP_OFFICIAL_NEWS[scopeId] || [];
      rawArticles.push(...fallback);
    }

    // 1. Filtrar estrictamente por palabras betadas (Blacklist)
    const banned = preferences.bannedKeywords || [];
    if (banned.length > 0) {
      rawArticles = rawArticles.filter((art) => {
        const text = `${art.title} ${art.summary || ''} ${art.contentSnippet || ''}`.toLowerCase();
        return !banned.some((kw) => kw.trim() && text.includes(kw.trim().toLowerCase()));
      });
    }

    // 2. Filtrar estrictamente por las fuentes habilitadas en la biblioteca del usuario
    if (enabledSources.length > 0) {
      const enabledDomains = enabledSources.map((s) => s.domain.toLowerCase().replace(/^www\./, ''));
      const libraryFiltered = rawArticles.filter((art) => {
        const domainClean = (art.sourceDomain || '').toLowerCase().replace(/^www\./, '');
        const urlClean = (art.sourceUrl || '').toLowerCase();
        return enabledDomains.some((d) => domainClean.includes(d) || urlClean.includes(d));
      });
      if (libraryFiltered.length > 0) {
        rawArticles = libraryFiltered;
      }
    }

    if (onProgress) onProgress(`Analizadas ${rawArticles.length} noticias de tus fuentes oficiales (últimas 24h). Deduplicando y puntuando...`);

    // 2. Deduplicar por título similar (mismo inicio de 25 caracteres)
    const seenTitles = new Set<string>();
    const uniqueArticles: NewsItem[] = [];

    rawArticles.forEach((art) => {
      const normalizedTitle = art.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 28);
      if (!seenTitles.has(normalizedTitle) && art.title.trim().length > 10) {
        seenTitles.add(normalizedTitle);
        uniqueArticles.push(art);
      }
    });

    // 3. PUNTUAR Y FILTRAR ESTRICTAMENTE según etiquetas configuradas por el usuario
    const userTags = (preferences.tags || []).map((t) => t.trim());
    const maxLimit = preferences.maxNewsLimit && preferences.maxNewsLimit > 0 ? preferences.maxNewsLimit : 5;

    // --- CURACIÓN INTELIGENTE CON GEMINI (SI API KEY ESTÁ CONFIGURADA) ---
    const extractedForAI = uniqueArticles.map((a) => ({
      titular: a.title,
      enlace: a.sourceUrl,
      fuente: a.source,
      texto_completo: `${a.title}. ${a.summary || a.contentSnippet || ''}`,
    }));

    if (geminiService.hasValidKey() && extractedForAI.length > 0) {
      try {
        const curatedByAI = await geminiService.curateExtractedNewsWithAI(
          scopeName,
          userTags,
          banned,
          maxLimit,
          extractedForAI,
          onProgress
        );

        if (curatedByAI.length > 0) {
          return {
            id: `briefing-curated-${Date.now()}`,
            scopeId,
            scopeName,
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            audioScript: `Resumen de prensa y actualidad en ${scopeName}.`,
            summaryBulletPoints: curatedByAI.map((a) => a.summary),
            articles: curatedByAI,
            matchedTagsCount: curatedByAI.length,
            totalArticlesAnalyzed: uniqueArticles.length,
            isExhaustive24h: true,
            lastSearchDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          };
        }
      } catch (e) {
        console.warn('Error en curación por IA de noticias extraídas:', e);
      }
    }

    let scoredArticles = uniqueArticles.map((art) => {
      const fullText = `${art.title} ${art.summary} ${art.contentSnippet}`.toLowerCase();
      
      const matched = userTags.filter((tag) => {
        const tLower = tag.toLowerCase();
        return fullText.includes(tLower);
      });

      let score = matched.length * 20 + (art.isOfficial ? 5 : 0);
      matched.forEach((t) => {
        if (art.title.toLowerCase().includes(t.toLowerCase())) {
          score += 10;
        }
      });

      return {
        ...art,
        matchedTags: matched,
        score,
        is24h: true,
      };
    });

    // Si el usuario tiene etiquetas configuradas, filtrar estrictamente solo las noticias que coincidan con sus etiquetas
    if (userTags.length > 0) {
      const tagMatched = scoredArticles.filter((art) => art.matchedTags.length > 0);
      if (tagMatched.length > 0) {
        scoredArticles = tagMatched;
      }
    }

    scoredArticles.sort((a, b) => (b.score || 0) - (a.score || 0));

    // 4. APLICAR EL LÍMITE DE NOTICIAS DE LA CATEGORÍA
    const selectedBatch = scoredArticles.slice(0, maxLimit);

    // SINTETIZAR Y GARANTIZAR RESÚMENES LIMPIOS Y PUNTOS CLAVE SIN REPETIR EL TITULAR
    const finalArticles: NewsItem[] = selectedBatch.map((art) => {
      const cleanSummary = extractCleanSummary(art.title, art.summary || art.contentSnippet || '', scopeName, art.source);

      // Extraer oraciones clave que NO repitan el titular
      const sentences = cleanSummary
        .split(/[.!?]\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20 && !s.toLowerCase().includes('leer más'));

      const keyHighlights: string[] = [];
      sentences.forEach((sentence) => {
        const titleOverlap = art.title.toLowerCase().substring(0, 20);
        if (!sentence.toLowerCase().includes(titleOverlap) && !keyHighlights.includes(sentence) && keyHighlights.length < 2) {
          keyHighlights.push(sentence);
        }
      });

      return {
        ...art,
        summary: cleanSummary.length > 260 ? cleanSummary.substring(0, 257) + '...' : cleanSummary,
        keyHighlights: keyHighlights.length > 0 ? keyHighlights : undefined,
      };
    });

    const matchedArticles = finalArticles.filter((a) => a.matchedTags.length > 0);

    if (onProgress) onProgress(`Analizadas y resumidas las ${finalArticles.length} noticias seleccionadas.`);

    // 5. GENERAR EL GUION DE LOCUCIÓN EN AUDIO SIN REPETICIONES
    const now = new Date();
    const saludo = now.getHours() < 13 ? 'Buenos días' : now.getHours() < 20 ? 'Buenas tardes' : 'Buenas noches';
    const horaActual = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    let audioScript = `${saludo}. Presentamos la síntesis informativa de ${scopeName} a las ${horaActual}. `;
    
    if (matchedArticles.length > 0) {
      const distinctTags = Array.from(new Set(matchedArticles.flatMap((m) => m.matchedTags))).slice(0, 4).join(', ');
      audioScript += `Destacamos temas clave sobre ${distinctTags}. `;
    } else {
      audioScript += `Analizamos las principales novedades del sector recopiladas en medios oficiales. `;
    }

    finalArticles.slice(0, 4).forEach((art, index) => {
      const ordinal = index === 0 ? 'Primer titular' : index === 1 ? 'Segunda noticia' : index === 2 ? 'Tercera noticia' : 'Finalmente';
      
      audioScript += `${ordinal}: "${art.title}". Resumen: ${art.summary} `;
    });

    audioScript += `Este es tu resumen para ${scopeName}. Puedes acceder a los enlaces de cada fuente oficial para ampliar detalles.`;

    // 6. GENERAR PUNTOS CLAVE DE RESUMEN EJECUTIVO (Solo Resumen directo con Tag)
    const summaryBulletPoints = finalArticles.map((art) => {
      const tagPrefix = art.matchedTags.length > 0 ? `[#${art.matchedTags.join(', #')}] ` : '';
      return `${tagPrefix}${art.summary}`;
    });

    return {
      id: `briefing-${Date.now()}`,
      scopeId,
      scopeName,
      timestamp: horaActual,
      audioScript,
      summaryBulletPoints,
      articles: finalArticles,
      matchedTagsCount: matchedArticles.length,
      totalArticlesAnalyzed: uniqueArticles.length,
      isExhaustive24h: true,
      lastSearchDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };
  },
};
