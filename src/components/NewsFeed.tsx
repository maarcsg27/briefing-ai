import React from 'react';
import { ExternalLink, ShieldCheck, Tag, Sparkles, Clock, Globe } from 'lucide-react';
import type { BriefingResult } from '../types';

interface NewsFeedProps {
  briefing: BriefingResult;
  selectedTags?: string[];
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ briefing }) => {
  return (
    <div className="space-y-6">
      
      {/* 1. SECCIÓN DE RESUMEN EJECUTIVO (Puntos Clave) */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Vistazo Rápido de las Últimas 24 Horas
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {briefing.totalArticlesAnalyzed && (
              <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {briefing.totalArticlesAnalyzed} noticias analizadas
              </span>
            )}
            <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {briefing.timestamp}
            </span>
          </div>
        </div>

        <ul className="space-y-2.5">
          {briefing.summaryBulletPoints.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. SECCIÓN DE TITULARES Y FUENTES OFICIALES */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Titulares de las Últimas 24h ({briefing.articles.length} seleccionadas)
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-400">
            Priorizadas por etiquetas configuradas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {briefing.articles.map((article) => {
            const hasMatchedTags = article.matchedTags && article.matchedTags.length > 0;

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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-semibold text-white">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{article.source}</span>
                      </span>
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

                  {/* Titular de la Noticia */}
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-0.5">
                      Titular:
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {article.title}
                    </h4>
                  </div>

                  {/* Resumen de lo más importante que se cuenta en la noticia */}
                  <div className="mb-3.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/90 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Resumen Ejecutivo (3-5 líneas):
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {article.summary || article.contentSnippet}
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
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold transition group shadow-sm"
                  >
                    <span>Leer en la fuente oficial</span>
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
