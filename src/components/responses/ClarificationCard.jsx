// src/components/responses/ClarificationCard.jsx
import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';


export default function ClarificationCard({ data, onSelectOption }) {
  return (
    <div className="bg-amber-50/60 rounded-xl border border-amber-200/80 shadow-sm p-4 sm:p-5 transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Clarification Required
          </span>
          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
            Multi-Intent Ambiguity
          </span>
        </div>
      </div>

      {/* Ambiguity Prompt */}
      <p className="text-slate-800 text-[14.5px] font-medium mb-3.5 leading-relaxed">
        {data.question || "I'm not completely sure which department process you are referring to."}
      </p>

      {/* Interactive Clarification Action Options */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Select intended department to continue:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {data.options && data.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectOption && onSelectOption(option)}
              className="flex items-start justify-between p-3.5 bg-white hover:bg-amber-50/50 border border-amber-200 rounded-lg text-left transition-all duration-150 shadow-xs hover:border-amber-400 group cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 text-sm group-hover:text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {option.label}
                </div>
                {option.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {option.description}
                  </p>
                )}
                {option.domain && (
                  <span className="inline-block mt-2 text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Domain: {option.domain}
                  </span>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Disambiguation hint */}
      <div className="mt-3.5 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800/80">
        <span>💡 Clicking an option instantly resolves and answers the specific inquiry.</span>
        <span className="font-mono">Spread: 0.02 delta</span>
      </div>
    </div>
  );
}
