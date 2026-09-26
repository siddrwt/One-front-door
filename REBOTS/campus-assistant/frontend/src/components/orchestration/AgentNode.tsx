import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { OrchestrationState } from '../../hooks/useOrchestrationState';

interface AgentNodeProps {
  id: string;
  name: string;
  icon: React.ElementType;
  colorVar: string;
  state: OrchestrationState;
  isSelected: boolean;
  staggerDelay: string;
}

export const AgentNode: React.FC<AgentNodeProps> = ({ 
  id, 
  name, 
  icon: Icon, 
  colorVar, 
  state, 
  isSelected,
  staggerDelay 
}) => {
  const isPulsing = isSelected && (state.animationPhase === 'selecting' || state.animationPhase === 'zooming');
  const isProcessing = isSelected && state.animationPhase === 'processing';
  const isComplete = isSelected && state.animationPhase === 'responding';
  
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Node Body */}
      <div 
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 relative bg-surface-elevated border shadow-xl backdrop-blur-md",
          isPulsing ? "animate-[agentPulse_400ms_ease-in-out_infinite]" : ""
        )}
        style={{ 
          borderColor: isSelected ? colorVar : 'var(--border)',
          boxShadow: isSelected ? `0 0 20px color-mix(in srgb, ${colorVar} 40%, transparent)` : 'none',
          animationDelay: staggerDelay
        }}
      >
        <Icon size={24} style={{ color: isSelected ? colorVar : 'var(--text-muted)' }} className="transition-colors duration-300" />
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="absolute -bottom-2 -right-2 bg-surface-elevated rounded-full p-1 border" style={{ borderColor: colorVar }}>
            <Loader2 size={12} className="animate-spin" style={{ color: colorVar }} />
          </div>
        )}
        
        {/* Complete Indicator */}
        {isComplete && (
          <div className="absolute -bottom-2 -right-2 bg-surface-elevated rounded-full border bg-green-500/10" style={{ borderColor: colorVar }}>
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
        )}
      </div>

      {/* Node Label */}
      <div 
        className="px-3 py-1 rounded-full text-xs font-medium border bg-surface-elevated backdrop-blur-md shadow-sm transition-all duration-300"
        style={{ 
          color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
          borderColor: isSelected ? `color-mix(in srgb, ${colorVar} 50%, transparent)` : 'var(--border)'
        }}
      >
        {name}
      </div>
    </div>
  );
};
