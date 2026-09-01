import React from 'react';
import { ExternalLink, ShieldCheck, Tag, Clock, Globe, Star, Newspaper } from 'lucide-react';
import type { BriefingResult } from '../types';

interface NewsFeedProps {
  briefing: BriefingResult;
  selectedTags?: string[];
}

function stripHtmlAndUrls(str: string): string {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/gi, ' ')
    .replace(/https?:\/\/[^\s]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ briefing }) => {
  if (!briefing.articles || briefing.articles.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-paper-900 border border-paper-750 text-center font-sans">
        <Newspaper className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="font-serif text-lg font-bold text-slate-200">No se encontraron noticias coincidentes</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          No hay artículos publicados en las últimas 24h que contengan tus etiquetas o que pertenezcan a las fuentes de tu biblioteca en esta sección.
        </p>
      </div>
    );
  }

  const leadStory = briefing.articles[0];
  const secondaryStories = briefing.articles.slice(1, 3);
  const streamStories = briefing.articles.slice(3);

  const getValidUrl = (art: typeof leadStory) => {
    return art.sourceUrl && art.sourceUrl.startsWith('http') && !art.sourceUrl.includes('#')
      ? art.sourceUrl
      : `https://${art.sourceDomain || 'google.com'}`;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Editorial Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-paper-750 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-serif text-lg font-bold text-slate-100">
            Edición Curada de Prensa — {briefing.scopeName}
          </h3>
          <span className="text-xs font-mono text-slate-400">
            ({briefing.articles.length} noticias seleccionadas)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Ordenadas por número de coincidencias con tus etiquetas (palabras vetadas excluidas)
        </span>
      </div>

      {/* NIVEL 1: LEAD STORY (Noticia Principal del Hito) */}
      {leadStory && (
        <article className="p-6 sm:p-7 rounded-xl bg-paper-900 border border-emerald-500/40 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 border-l border-b border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400" />
            <span>Hito Noticioso Principal</span>
          </div>

          {/* Metadatos superiores */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <a
              href={`https://${leadStory.sourceDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-paper-800 hover:bg-paper-750 border border-paper-700 text-slate-200 font-bold transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{leadStory.source}</span>
            </a>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {leadStory.publishedAt}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              {leadStory.geographicArea}
            </span>
          </div>

          {/* Titular Principal en Serif */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
            <a
              href={getValidUrl(leadStory)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition-colors"
              title="Abrir artículo completo en la fuente oficial"
            >
              {stripHtmlAndUrls(leadStory.title)}
            </a>
          </h2>

          {/* Resumen del Contenido */}
          <div className="bg-paper-950/80 p-4 rounded-lg border border-paper-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
              Resumen del Contenido del Artículo:
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              {stripHtmlAndUrls(leadStory.summary || leadStory.contentSnippet)}
            </p>

            {leadStory.whyRelevance && (
              <div className="pt-2 border-t border-paper-800 text-xs text-indigo-300 italic font-medium">
                <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-400 block not-italic">Relevancia:</span>
                {leadStory.whyRelevance}
              </div>
            )}
          </div>

          {/* Etiquetas coincidentes */}
          {leadStory.matchedTags && leadStory.matchedTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Coincide con:
              </span>
              {leadStory.matchedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          )}

          {/* Botón de lectura oficial */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">{leadStory.sourceDomain}</span>
            <a
              href={getValidUrl(leadStory)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
            >
              <span>Leer artículo completo en {leadStory.source}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </article>
      )}

      {/* NIVEL 2: NOTICIAS SECUNDARIAS (Grid de 2 Columnas) */}
      {secondaryStories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-paper-750 pb-1">
            Cobertura Especializada Destacada
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {secondaryStories.map((art) => (
              <article
                key={art.id}
                className="p-5 rounded-xl bg-paper-900 border border-paper-750 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-bold text-slate-200">{art.source}</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white leading-snug">
                    <a
                      href={getValidUrl(art)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      {stripHtmlAndUrls(art.title)}
                    </a>
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {stripHtmlAndUrls(art.summary || art.contentSnippet)}
                  </p>
                </div>

                <div className="pt-3 border-t border-paper-800 flex items-center justify-between">
                  {art.matchedTags && art.matchedTags.length > 0 ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      {art.matchedTags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] font-mono text-emerald-400">
                          #{t.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  ) : <span></span>}

                  <a
                    href={getValidUrl(art)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                  >
                    <span>Leer en {art.sourceDomain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* NIVEL 3: COMPACT NEWS STREAM (Hilo Télex de Noticias) */}
      {streamStories.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-paper-750 pb-1">
            Flujo de Noticias de la Biblioteca ({streamStories.length})
          </h4>

          <div className="divide-y divide-paper-800 border-t border-b border-paper-800">
            {streamStories.map((art) => (
              <article key={art.id} className="py-4 space-y-2 group">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-serif text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors leading-snug">
                    <a
                      href={getValidUrl(art)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {stripHtmlAndUrls(art.title)}
                    </a>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {art.source} • {art.publishedAt}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {stripHtmlAndUrls(art.summary || art.contentSnippet)}
                </p>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  {art.matchedTags && art.matchedTags.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      {art.matchedTags.map((t) => (
                        <span key={t} className="text-[10px] text-emerald-300 font-bold">
                          #{t.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={getValidUrl(art)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Fuente original</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
