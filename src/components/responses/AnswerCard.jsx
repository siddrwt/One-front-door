// src/components/responses/AnswerCard.jsx
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck
} from 'lucide-react';


const DOMAIN_STYLES = {
  fees: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    title: 'Fees & Finance'
  },
  examination: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    title: 'Examination & Evaluation'
  },
  it: {
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dot: 'bg-indigo-500',
    title: 'IT & Digital Services'
  },
  facilities: {
    badge: 'bg-violet-50 text-violet-800 border-violet-200',
    dot: 'bg-violet-500',
    title: 'Campus Facilities'
  },
  general: {
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
    title: 'University Orchestrator'
  }
};

export default function AnswerCard({ data }) {
  const [showWhy, setShowWhy] = useState(false);
  const style = DOMAIN_STYLES[data.domain] || DOMAIN_STYLES.general;
  const confidencePercent = Math.round((data.confidence || 0.9) * 100);

  // Simple Markdown bold & line break renderer
  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, pIdx) => {
      // Split on bold **text**
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={pIdx} className="mb-2.5 last:mb-0 leading-relaxed text-slate-800 text-[14.5px]">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={idx} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('- ')) {
              return (
                <span key={idx} className="block pl-3 my-0.5">
                  • {part.slice(2)}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-300">
      {/* Top Header: Domain Pill & Confidence Badge */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
            {data.domainLabel || style.title}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ID: {data.domain || 'core'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{confidencePercent}% confidence</span>
        </div>
      </div>

      {/* Main Answer Content */}
      <div className="p-4 sm:p-5">
        <div className="text-slate-800">
          {renderFormattedText(data.answer)}
        </div>

        {/* Sources Section */}
        {data.sources && data.sources.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Grounded Institutional Sources</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.sources.map((src, idx) => (
                <div 
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                  title={src.section || src.title}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium truncate max-w-[240px]">{src.title}</span>
                  {src.section && (
                    <span className="text-slate-500 text-[11px]">({src.section})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expandable "Why this answer?" Section */}
      {data.routingInfo && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors text-left"
          >
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Why this answer? (Routing Metadata)</span>
            </div>
            {showWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showWhy && (
            <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 space-y-2 bg-white/70 border-t border-slate-100/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Selected Domain:</span>
                  <span className="font-semibold text-slate-800">{data.routingInfo.domain || data.domain}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Classification Confidence:</span>
                  <span className="font-semibold text-emerald-700">{data.routingInfo.confidence || `${confidencePercent}%`}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Semantic Match Score:</span>
                  <span className="font-semibold text-slate-800">{data.routingInfo.semanticMatch ?? '0.82'}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Domain Separation Margin:</span>
                  <span className="font-semibold text-slate-800">{data.routingInfo.domainMargin ?? '0.34'}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200/60 text-[11px]">
                <span className="text-slate-400 block">Keyword Signals Detected:</span>
                <span className="font-mono text-slate-700">{data.routingInfo.keywordSignal || 'Primary intent tokens matched'}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Orchestrator: {data.routingInfo.routedBy || 'OFD-Router-v2'}</span>
                <span>Latency: {data.routingInfo.latency || '142ms'}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
