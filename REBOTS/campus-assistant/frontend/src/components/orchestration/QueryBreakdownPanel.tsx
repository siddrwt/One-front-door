import type { OrchestrationState } from '../../hooks/useOrchestrationState';
import { cn } from '../../utils/cn';

interface QueryBreakdownPanelProps {
  state: OrchestrationState;
}

export const QueryBreakdownPanel: React.FC<QueryBreakdownPanelProps> = ({ state }) => {
  if (state.animationPhase === 'idle' && !state.querySubmitted) return null;

  return (
    <div className="absolute left-6 top-6 w-[320px] bg-surface/80 backdrop-blur-md border border-border rounded-xl p-5 shadow-2xl text-fade-in z-30">
      <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2 uppercase tracking-wider">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        Query Analysis
      </h3>

      <div className="mb-5">
        <label className="block text-[11px] text-text-muted font-mono uppercase mb-1.5">Detected Intent</label>
        <p className="text-sm font-medium text-text-primary bg-surface-elevated px-3 py-2 rounded-md border border-border/50">
          {state.detectedIntent}
        </p>
      </div>

      <div className="mb-5">
        <label className="block text-[11px] text-text-muted font-mono uppercase mb-2">Selected Agents</label>
        
        {state.selectedAgents.length === 0 ? (
          <div className="text-sm text-text-secondary italic">Analyzing...</div>
        ) : (
          <div className="space-y-3">
            {state.selectedAgents.map(agent => (
              <div key={agent} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-primary">{agent}</span>
                  <span className="text-text-muted font-mono text-xs">
                    {Math.round((state.agentScores[agent] || 0) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out rounded-full"
                    style={{ 
                      width: `${(state.agentScores[agent] || 0) * 100}%`,
                      backgroundColor: `var(--domain-${agent.toLowerCase()})` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center gap-2">
        <span className="text-lg">⏱️</span>
        <span className="text-xs font-mono text-text-secondary">
          {state.animationPhase === 'complete' 
            ? "Processing Complete" 
            : `Processing in ~${Math.round(state.estimatedTime / 1000)}s`}
        </span>
      </div>
    </div>
  );
};
