// src/components/responses/MultiDomainCard.jsx
import React from 'react';
import { 
  Split, 
  FileText, 
  ShieldCheck, 
  Layers
} from 'lucide-react';


const DOMAIN_STYLES = {
  fees: {
    bg: 'bg-emerald-50/70 border-emerald-200',
    headerBg: 'bg-emerald-100/60 text-emerald-900 border-b border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accent: 'border-l-4 border-l-emerald-600',
    dot: 'bg-emerald-600'
  },
  examination: {
    bg: 'bg-amber-50/70 border-amber-200',
    headerBg: 'bg-amber-100/60 text-amber-900 border-b border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    accent: 'border-l-4 border-l-amber-600',
    dot: 'bg-amber-600'
  },
  it: {
    bg: 'bg-indigo-50/70 border-indigo-200',
    headerBg: 'bg-indigo-100/60 text-indigo-900 border-b border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    accent: 'border-l-4 border-l-indigo-600',
    dot: 'bg-indigo-600'
  },
  facilities: {
    bg: 'bg-violet-50/70 border-violet-200',
    headerBg: 'bg-violet-100/60 text-violet-900 border-b border-violet-200',
    badge: 'bg-violet-100 text-violet-800 border-violet-300',
    accent: 'border-l-4 border-l-violet-600',
    dot: 'bg-violet-600'
  }
};

export default function MultiDomainCard({ data }) {
  // Simple bold renderer
  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner Explaining Query Decomposition */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
            <Split className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide uppercase text-blue-200">
              Multi-Domain Query Decomposition
            </h4>
            <p className="text-[11px] text-blue-100/80">
              Single user prompt split across {data.answers?.length || 2} independent domain knowledge bases
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono bg-blue-800/80 border border-blue-700/60 px-2 py-0.5 rounded text-blue-200">
          Parallel Orchestration
        </span>
      </div>

      {data.summary && (
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/70 text-xs text-slate-600 font-medium flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span>{data.summary}</span>
        </div>
      )}

      {/* Domain Specific Answer Cards Stack */}
      <div className="p-4 space-y-4 bg-slate-50/40">
        {data.answers && data.answers.map((item, idx) => {
          const style = DOMAIN_STYLES[item.domain] || DOMAIN_STYLES.fees;
          const confidence = Math.round((item.confidence || 0.9) * 100);

          return (
            <div 
              key={idx}
              className={`bg-white rounded-lg border shadow-xs overflow-hidden ${style.accent} border-slate-200`}
            >
              {/* Domain Subheader */}
              <div className="px-3.5 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {item.domainLabel || item.domain}
                  </span>
                  {item.questionPart && (
                    <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                      — "{item.questionPart}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{confidence}% confidence</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5">
                <p className="text-slate-800 text-[14px] leading-relaxed">
                  {renderFormattedText(item.answer)}
                </p>

                {/* Sources for this specific domain */}
                {item.sources && item.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Sources:
                    </span>
                    {item.sources.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                      >
                        {src.title} {src.section ? `(${src.section})` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
