import React from 'react';
import { Bot, Network } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { OrchestrationState } from '../../hooks/useOrchestrationState';

interface OrchestratorNodeProps {
  state: OrchestrationState;
}

export const OrchestratorNode: React.FC<OrchestratorNodeProps> = ({ state }) => {
  const isProcessing = state.animationPhase === 'processing' || state.animationPhase === 'zooming';
  const isAnalyzing = state.animationPhase === 'analyzing' || state.animationPhase === 'selecting';

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center relative shadow-2xl transition-all duration-500 border-2 campus-core",
          isProcessing ? "bg-blue-600/20 border-blue-500 processing" : "bg-surface border-border",
          isAnalyzing ? "border-blue-400" : ""
        )}
      >
        {/* Inner glow */}
        <div className={cn(
          "absolute inset-2 rounded-full border border-white/5",
          isProcessing ? "bg-blue-500/20 animate-pulse" : "bg-surface-elevated"
        )} />
        
        {isAnalyzing ? (
          <Network size={32} className="text-blue-400 animate-pulse relative z-10" />
        ) : (
          <Bot size={32} className={cn("relative z-10 transition-colors", isProcessing ? "text-blue-400" : "text-text-secondary")} />
        )}

        {/* Orbiting rings (purely decorative) */}
        <div className={cn(
          "absolute -inset-4 border border-border/30 rounded-full",
          isProcessing ? "animate-[spin_4s_linear_infinite] border-t-blue-500/50" : ""
        )} />
        <div className={cn(
          "absolute -inset-8 border border-border/20 rounded-full",
          isProcessing ? "animate-[spin_6s_linear_infinite_reverse] border-b-blue-400/30" : ""
        )} />
      </div>

      <div className="text-center bg-surface-elevated/80 backdrop-blur-md border border-border px-4 py-1.5 rounded-full shadow-sm">
        <div className="text-xs font-bold text-text-primary tracking-wide">CAMPUS CORE</div>
        <div className="text-[10px] text-text-muted font-mono uppercase mt-0.5 min-h-[15px]">
          {state.animationPhase === 'idle' && 'Waiting for input'}
          {state.animationPhase === 'analyzing' && 'Analyzing intent...'}
          {state.animationPhase === 'selecting' && 'Routing request...'}
          {state.animationPhase === 'zooming' && 'Establishing links...'}
          {state.animationPhase === 'processing' && 'Synthesizing data...'}
          {state.animationPhase === 'responding' && 'Response ready'}
        </div>
      </div>
    </div>
  );
};
