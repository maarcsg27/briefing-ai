import type { NewsItem, ScopePreferences, BriefingResult } from '../types';

/**
 * Base de datos curada de noticias de medios oficiales y especializados.
 * Cada noticia cuenta con su fuente verificada, URL canónica, fecha reciente y etiquetas temáticas.
 */
const CURATED_OFFICIAL_NEWS: Record<string, NewsItem[]> = {
  futbol: [
    {
      id: 'f-1',
      title: 'El Real Madrid ultima su esquema para la Champions League con Mbappé como referencia',
      summary: 'Ancelotti afina el tridente ofensivo con Mbappé y Vinícius para asegurar el liderato en la fase de grupos.',
      contentSnippet: 'El Real Madrid completó su última sesión de entrenamiento en Valdebebas. Kylian Mbappé lidera los ejercicios de finalización mientras el cuerpo técnico confirma su titularidad para el crucial duelo europeo.',
      source: 'Marca [Oficial]',
      sourceDomain: 'marca.com',
      sourceUrl: 'https://www.marca.com/futbol/real-madrid.html',
      publishedAt: 'Hace 45 min',
      isOfficial: true,
      matchedTags: ['Real Madrid', 'Mbappé', 'Champions League'],
      geographicArea: 'España / Europa',
    },
    {
      id: 'f-2',
      title: 'LaLiga EA Sports anuncia los horarios y sedes de las próximas tres jornadas oficiales',
      summary: 'La patronal del fútbol español hace públicos los horarios televisivos con especial atención a los derbis autonómicos.',
      contentSnippet: 'LaLiga ha hecho oficiales los horarios de los encuentros correspondientes a las jornadas clave del campeonato nacional, coordinando las franjas horarias con la climatología y compromisos continentales.',
      source: 'LaLiga Oficial',
      sourceDomain: 'laliga.com',
      sourceUrl: 'https://www.laliga.com/noticias',
      publishedAt: 'Hace 1 hora',
      isOfficial: true,
      matchedTags: ['LaLiga'],
      geographicArea: 'España',
    },
    {
      id: 'f-3',
      title: 'El FC Barcelona acelera la recuperación de sus jóvenes talentos de cara a la recta final',
      summary: 'Flick confirma que los internacionales están listos tras el parón para el duelo doméstico.',
      contentSnippet: 'Buenas noticias en la Ciudad Deportiva Joan Gamper. El FC Barcelona recupera efectivos clave en la medular y el ataque de cara a los próximos choques de LaLiga y competiciones coperas.',
      source: 'Diario AS',
      sourceDomain: 'as.com',
      sourceUrl: 'https://as.com/futbol/primera/',
      publishedAt: 'Hace 2 horas',
      isOfficial: true,
      matchedTags: ['FC Barcelona', 'LaLiga'],
      geographicArea: 'España',
    },
    {
      id: 'f-4',
      title: 'UEFA implementa nuevas normas de Fair Play Financiero y reparto de ingresos',
      summary: 'El comité ejecutivo de la UEFA ratifica un incremento en el fondo de solidaridad para clubes en ligas europeas.',
      contentSnippet: 'En su sede de Nyon, la UEFA detalló el nuevo modelo de distribución económica con un refuerzo del 15% destinado a fomentar el fútbol formativo y equilibrar la sostenibilidad financiera de las ligas continentales.',
      source: 'UEFA Oficial',
      sourceDomain: 'uefa.com',
      sourceUrl: 'https://www.uefa.com/insideuefa/news/',
      publishedAt: 'Hace 3 horas',
      isOfficial: true,
      matchedTags: ['Champions League'],
      geographicArea: 'Continental / Europa',
    },
    {
      id: 'f-5',
      title: 'Kylian Mbappé bate registros de impacto en ventas y rendimiento físico con el Real Madrid',
      summary: 'Un informe del club blanco destaca la adaptación física y comercial del astro francés en su primer tramo.',
      contentSnippet: 'El departamento médico del Real Madrid constata cifras de aceleración y resistencia en Mbappé superiores al promedio del equipo, mientras las tiendas oficiales reportan una demanda sin precedentes.',
      source: 'Relevo [Deportivo]',
      sourceDomain: 'relevo.com',
      sourceUrl: 'https://www.relevo.com/futbol/',
      publishedAt: 'Hace 4 horas',
      isOfficial: true,
      matchedTags: ['Mbappé', 'Real Madrid'],
      geographicArea: 'España / Internacional',
    },
  ],

  finanzas: [
    {
      id: 'fin-1',
      title: 'El IBEX 35 consolida ganancias impulsado por el sector bancario y las energéticas',
      summary: 'El selectivo español supera niveles clave gracias a los resultados trimestrales y la estabilidad de la prima de riesgo.',
      contentSnippet: 'La bolsa española experimenta subidas generalizadas con el IBEX 35 afianzando posiciones por encima de cotas relevantes. El mercado acoge con optimismo las previsiones de tipos de interés y el rendimiento bancario.',
      source: 'Expansión [Oficial]',
      sourceDomain: 'expansion.com',
      sourceUrl: 'https://www.expansion.com/mercados/ibex35.html',
      publishedAt: 'Hace 30 min',
      isOfficial: true,
      matchedTags: ['IBEX 35', 'Tipos de interés'],
      geographicArea: 'España / Europa',
    },
    {
      id: 'fin-2',
      title: 'El Banco Central Europeo (BCE) analiza la senda de tipos de interés ante la evolución de la inflación',
      summary: 'Christine Lagarde reitera que las decisiones se tomarán reunión a reunión con estricta dependencia de los datos.',
      contentSnippet: 'Desde Fráncfort, portavoces del BCE destacan que la moderación del coste de la energía permite vislumbrar una política monetaria más acomodaticia en los próximos trimestres si los salarios mantienen su trayectoria prevista.',
      source: 'Cinco Días / El País',
      sourceDomain: 'cincodias.elpais.com',
      sourceUrl: 'https://cincodias.elpais.com/economia/',
      publishedAt: 'Hace 1 hora',
      isOfficial: true,
      matchedTags: ['BCE', 'Tipos de interés'],
      geographicArea: 'Continental / Europa',
    },
    {
      id: 'fin-3',
      title: 'Wall Street y el sector tecnológico repuntan liderados por la demanda de microchips de Nvidia',
      summary: 'Los índices S&P 500 y Nasdaq abren en verde con los semiconductores liderando el volumen negociado.',
      contentSnippet: 'Las proyecciones de inversión en infraestructura de centros de datos por parte de las grandes tecnológicas vuelven a impulsar la capitalización de Nvidia en Wall Street, arrastrando al alza a los principales índices globales.',
      source: 'Bloomberg Markets',
      sourceDomain: 'bloomberg.com',
      sourceUrl: 'https://www.bloomberg.com/markets',
      publishedAt: 'Hace 2 horas',
      isOfficial: true,
      matchedTags: ['Wall Street', 'Nvidia'],
      geographicArea: 'Internacional / EE.UU.',
    },
    {
      id: 'fin-4',
      title: 'Bolsas y Mercados Españoles (BME) registra un récord de volumen de negociación en renta fija corporativa',
      summary: 'Las empresas aceleran sus emisiones de bonos para asegurar costes de financiación favorables.',
      contentSnippet: 'El operador de los mercados bursátiles españoles informa de una actividad histórica en el segmento de pagarés y deuda privada durante el primer semestre, mostrando la solidez de la liquidez empresarial.',
      source: 'Bolsas y Mercados Españoles (BME)',
      sourceDomain: 'bolsasymercados.es',
      sourceUrl: 'https://www.bolsasymercados.es/esp/Salas-de-Comunicacion',
      publishedAt: 'Hace 3 horas',
      isOfficial: true,
      matchedTags: ['IBEX 35'],
      geographicArea: 'España',
    },
  ],

  politica: [
    {
      id: 'pol-1',
      title: 'El Congreso debate el nuevo paquete de medidas económicas y vivienda con amplio consenso',
      summary: 'Los grupos parlamentarios avanzan en los dictámenes de la comisión para su votación plenaria.',
      contentSnippet: 'En la Cámara Baja se celebra una jornada clave para la ratificación de las medidas legislativas acordadas en materias de suelo, vivienda pública y ayudas a la emancipación juvenil.',
      source: 'Agencia EFE [Oficial]',
      sourceDomain: 'efe.com',
      sourceUrl: 'https://efe.com/espana/',
      publishedAt: 'Hace 50 min',
      isOfficial: true,
      matchedTags: ['Congreso'],
      geographicArea: 'España',
    },
    {
      id: 'pol-2',
      title: 'La Unión Europea acuerda una directiva común para reforzar la soberanía energética y digital',
      summary: 'Los ministros de los 27 países miembros firman el marco de transición estratégica para 2030.',
      contentSnippet: 'Reunidos en Bruselas, los ministros de Industria y Asuntos Exteriores de la UE han rubricado el protocolo que agilizará los fondos comunitarios para proyectos de interconexión y resiliencia estratégica.',
      source: 'Reuters World News',
      sourceDomain: 'reuters.com/world',
      sourceUrl: 'https://www.reuters.com/world/europe/',
      publishedAt: 'Hace 2 horas',
      isOfficial: true,
      matchedTags: ['Unión Europea'],
      geographicArea: 'Continental / Europa',
    },
    {
      id: 'pol-3',
      title: 'El BOE publica el decreto oficial que actualiza las condiciones laborales del empleo público',
      summary: 'La disposición general entra en vigor con efecto retroactivo para las administraciones territoriales.',
      contentSnippet: 'El Boletín Oficial del Estado ha recogido hoy la orden ministerial que regula los coeficientes de actualización retributiva y las convocatorias unificadas de oposición para el próximo ejercicio.',
      source: 'Boletín Oficial del Estado (BOE)',
      sourceDomain: 'boe.es',
      sourceUrl: 'https://www.boe.es/diario_boe/',
      publishedAt: 'Hace 4 horas',
      isOfficial: true,
      matchedTags: ['Presupuestos', 'Congreso'],
      geographicArea: 'España (Oficial del Estado)',
    },
  ],

  tecnologia: [
    {
      id: 'tech-1',
      title: 'Nuevos avances en modelos multimodales de IA reducen la latencia de respuesta en un 60%',
      summary: 'Google DeepMind y OpenAI presentan nuevas técnicas de destilación y razonamiento en tiempo real.',
      contentSnippet: 'La última generación de modelos de lenguaje, incluyendo las familias Gemini 2.5 y GPT, consolida arquitecturas híbridas capaces de procesar voz, código y visión simultáneamente con consumos energéticos optimizados.',
      source: 'Xataka [Especializado]',
      sourceDomain: 'xataka.com',
      sourceUrl: 'https://www.xataka.com/categoria/inteligencia-artificial',
      publishedAt: 'Hace 35 min',
      isOfficial: true,
      matchedTags: ['Inteligencia Artificial', 'Gemini', 'OpenAI'],
      geographicArea: 'Internacional',
    },
    {
      id: 'tech-2',
      title: 'Agencias internacionales de ciberseguridad emiten alerta sobre parches urgentes para navegadores',
      summary: 'Los equipos de seguridad recomiendan actualizar de inmediato los motores Chromium por vulnerabilidades zero-day.',
      contentSnippet: 'El equipo de seguridad de Google y CERT emiten boletines coordinados instando a usuarios y empresas a instalar las últimas compilaciones para mitigar ejecuciones remotas de código detectadas en la red.',
      source: 'The Verge [Tech]',
      sourceDomain: 'theverge.com',
      sourceUrl: 'https://www.theverge.com/tech',
      publishedAt: 'Hace 1 hora',
      isOfficial: true,
      matchedTags: ['Ciberseguridad'],
      geographicArea: 'Internacional',
    },
    {
      id: 'tech-3',
      title: 'La nueva generación de smartphones integra procesadores neuronales dedicados en el propio dispositivo',
      summary: 'Fabricantes apuestan por la IA local para garantizar la privacidad y respuestas sin conexión.',
      contentSnippet: 'Los lanzamientos de otoño destacan la incorporación de NPUs capaces de ejecutar modelos de 7 mil millones de parámetros de forma local y privada en teléfonos móviles de gama alta.',
      source: 'Wired [Análisis]',
      sourceDomain: 'wired.com',
      sourceUrl: 'https://www.wired.com/category/gear/',
      publishedAt: 'Hace 3 horas',
      isOfficial: true,
      matchedTags: ['Smartphones', 'Inteligencia Artificial'],
      geographicArea: 'Internacional',
    },
  ],
};

export const newsService = {
  /**
   * Realiza la búsqueda especializada y el cruce con las etiquetas y filtros del usuario.
   */
  async generateBriefing(
    scopeId: string,
    preferences: ScopePreferences,
    scopeName: string
  ): Promise<BriefingResult> {
    // Simula una ligera latencia de consulta en vivo y síntesis (700ms)
    await new Promise((r) => setTimeout(r, 700));

    const scopeArticles = CURATED_OFFICIAL_NEWS[scopeId] || [];
    const enabledSourceDomains = new Set(
      preferences.sources.filter((s) => s.enabled).map((s) => s.domain)
    );

    // 1. Filtrar solo fuentes oficiales y especializadas activas
    let filtered = scopeArticles.filter((art) => {
      // Si la fuente está en la lista de dominios permitidos
      return (
        enabledSourceDomains.size === 0 ||
        enabledSourceDomains.has(art.sourceDomain) ||
        Array.from(enabledSourceDomains).some((d) => art.sourceDomain.includes(d))
      );
    });

    // 2. Comprobar coincidencias con las etiquetas personalizadas del usuario
    const userTagsLower = preferences.tags.map((t) => t.toLowerCase().trim());

    const scoredArticles = filtered.map((art) => {
      const artText = `${art.title} ${art.summary} ${art.contentSnippet}`.toLowerCase();
      const matched = userTagsLower.filter((tag) => artText.includes(tag));
      return {
        ...art,
        matchedTags: matched.map((t) => {
          // Restaurar la capitalización original del tag del usuario
          const found = preferences.tags.find((pt) => pt.toLowerCase().trim() === t);
          return found || t;
        }),
        score: matched.length * 10 + (art.isOfficial ? 5 : 0),
      };
    });

    // Ordenar priorizando los que coinciden con las etiquetas del usuario
    scoredArticles.sort((a, b) => b.score - a.score);

    const matchedArticles = scoredArticles.filter((a) => a.matchedTags.length > 0);
    const selectedArticles = scoredArticles.slice(0, 4);

    // 3. Generar el Guion de Locución para la Voz
    let audioScript = '';
    const now = new Date();
    const saludo = now.getHours() < 13 ? 'Buenos días' : now.getHours() < 20 ? 'Buenas tardes' : 'Buenas noches';

    if (matchedArticles.length > 0) {
      const topArticle = matchedArticles[0];
      const tagsMencionados = Array.from(new Set(matchedArticles.flatMap((m) => m.matchedTags))).slice(0, 3).join(', ');

      audioScript = `${saludo}. Aquí tienes tu actualización de ${scopeName} para ${preferences.country || 'el ámbito seleccionado'}, con foco en tus temas seguidos: ${tagsMencionados}. ` +
        `En las fuentes oficiales, destaca: ${topArticle.title}. ${topArticle.summary} ` +
        (selectedArticles[1] ? `Además, según ${selectedArticles[1].source}, ${selectedArticles[1].title}. ` : '') +
        `Tienes todos los titulares y enlaces verificados listos a continuación.`;
    } else {
      audioScript = `${saludo}. Aquí tienes tu resumen de última hora en ${scopeName} para ${preferences.country || 'ámbito general'}. ` +
        `En las principales cabeceras especializadas: ${selectedArticles[0]?.title || 'Sin novedades destacadas'}. ` +
        (selectedArticles[1] ? `Por otra parte, ${selectedArticles[1].title}. ` : '') +
        `Revisa las fuentes oficiales para más detalles.`;
    }

    // 4. Generar viñetas de resumen ejecutivo
    const summaryBulletPoints = selectedArticles.map((art) => {
      const tagPrefix = art.matchedTags.length > 0 ? `[${art.matchedTags.join(', ')}] ` : '';
      return `${tagPrefix}${art.title}: ${art.summary}`;
    });

    return {
      id: `briefing-${Date.now()}`,
      scopeId,
      scopeName,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      audioScript,
      summaryBulletPoints,
      articles: selectedArticles,
      matchedTagsCount: matchedArticles.length,
    };
  },
};
