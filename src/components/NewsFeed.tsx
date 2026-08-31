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
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Resumen Ejecutivo del Momento
          </h3>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Titulares Oficiales y Fuentes Verificadas ({briefing.articles.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Ordenado por coincidencia de etiquetas
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

                  {/* Titular */}
                  <h4 className="text-base font-bold text-white mb-2 leading-snug">
                    {article.title}
                  </h4>

                  {/* Extracto */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {article.contentSnippet}
                  </p>

                  {/* Etiquetas coincidentes */}
                  {hasMatchedTags && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
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
