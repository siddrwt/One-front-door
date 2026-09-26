// src/components/responses/HandoffCard.jsx
import React, { useState } from 'react';
import { 
  AlertCircle, 
  LifeBuoy, 
  Ticket, 
  CheckCircle, 
  Building, 
  Clock, 
  ArrowRight
} from 'lucide-react';

export default function HandoffCard({ data }) {
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketId] = useState(() => data.mockTicketId || `OFD-TKT-${Math.floor(10000 + Math.random() * 90000)}`);


  return (
    <div className="bg-white rounded-xl border border-rose-200/90 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-rose-50/80 border-b border-rose-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Out of Knowledge Scope / Fallback
            </span>
          </div>
        </div>

        <span className="text-[11px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-medium">
          Fallback Route
        </span>
      </div>

      {/* Main Notification */}
      <div className="p-4 sm:p-5">
        <p className="text-slate-800 text-[14.5px] font-medium leading-relaxed mb-3">
          {data.answer || "I couldn't find reliable information about this in the available university knowledge base."}
        </p>

        {data.reason && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-600 mb-4 leading-relaxed">
            <strong className="text-slate-700 block mb-0.5">Policy Context:</strong>
            {data.reason}
          </div>
        )}

        {/* Handoff Assistance Card */}
        <div className="bg-blue-50/50 border border-blue-200/70 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <LifeBuoy className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wide text-blue-900 mb-1">
                University Staff Handoff Available
              </h4>
              <p className="text-xs text-slate-600 mb-3">
                {data.suggestedAction || "Your request can be handed off to university support for manual administrative verification."}
              </p>

              {data.department && (
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium mb-3">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Department: <strong>{data.department}</strong></span>
                </div>
              )}

              {!ticketCreated ? (
                <button
                  onClick={() => setTicketCreated(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Create University Support Ticket</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              ) : (
                <div className="bg-white border border-emerald-300 rounded-lg p-3.5 shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Support Ticket Generated Successfully</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Ticket ID</span>
                      <span className="font-mono font-bold text-slate-900">{ticketId}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Expected SLA</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        24-48 hrs
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2">
                    Confirmation notice logged under your student institutional account. Reference this ID with the Helpdesk.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
