import React from 'react';
import { ExternalLink, ShieldCheck, Tag, Clock, Globe } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      {/* SECCIÓN DE TITULARES Y FUENTES OFICIALES */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Titulares Seleccionados de las Últimas 24h ({briefing.articles.length} noticias)
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-400">
            Ordenadas por número de coincidencias de etiquetas (vetadas descartadas)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {briefing.articles.map((article) => {
            const hasMatchedTags = article.matchedTags && article.matchedTags.length > 0;
            const cleanSummaryText = stripHtmlAndUrls(article.summary || article.contentSnippet);
            const validUrl = article.sourceUrl && article.sourceUrl.startsWith('http') && !article.sourceUrl.includes('#')
              ? article.sourceUrl
              : `https://${article.sourceDomain || 'google.com'}`;

            return (
              <div
                key={article.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  hasMatchedTags
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Barra de metadatos superior */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://${article.sourceDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition"
                        title={`Ir a ${article.source}`}
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{article.source}</span>
                      </a>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.publishedAt}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-400" />
                      {article.geographicArea}
                    </span>
                  </div>

                  {/* Titular Seleccionado con Enlace Clicable Directo */}
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-0.5">
                      Titular Seleccionado:
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                      <a
                        href={validUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 transition-colors"
                        title="Abrir noticia original"
                      >
                        {stripHtmlAndUrls(article.title)}
                      </a>
                    </h4>
                  </div>

                  {/* Resumen del Contenido del Artículo */}
                  <div className="mb-3.5 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/90 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Resumen del Contenido del Artículo:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {cleanSummaryText}
                      </p>
                    </div>

                    {/* Por qué es relevante (1 frase de justificación) */}
                    {article.whyRelevance && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-0.5">
                          Por qué es relevante:
                        </span>
                        <p className="text-xs text-indigo-200 italic font-medium">
                          {article.whyRelevance}
                        </p>
                      </div>
                    )}

                    {/* Puntos clave destacados si existen */}
                    {article.keyHighlights && article.keyHighlights.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        {article.keyHighlights.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Etiquetas coincidentes */}
                  {hasMatchedTags && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Coincide con:
                      </span>
                      {article.matchedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pie de tarjeta con enlace a la fuente oficial */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    {article.sourceDomain}
                  </span>
                  <a
                    href={validUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition group shadow-sm"
                  >
                    <span>Leer en la fuente oficial ({article.sourceDomain})</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
