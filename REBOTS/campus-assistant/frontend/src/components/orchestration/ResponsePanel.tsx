import type { OrchestrationState } from '../../hooks/useOrchestrationState';
import { ShieldAlert, X } from 'lucide-react';

interface ResponsePanelProps {
  state: OrchestrationState;
  onClose?: () => void;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({ state, onClose }) => {
  if (!state.isResponseReady || Object.keys(state.responseByAgent).length === 0) {
    return null;
  }

  // Get the last message from the bot (which should contain the full response details)
  const lastBotMessage = state.messages.filter(m => m.sender === 'bot').pop();

  return (
    <div className="w-[450px] h-full bg-surface-elevated border-l border-border flex flex-col flex-shrink-0 animate-in slide-in-from-right-8 duration-500 shadow-2xl relative z-40">
      
      <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface-elevated/95 backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Response Ready</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Routed via:</span>
            <div className="flex gap-1.5">
              {Object.keys(state.responseByAgent).map(agent => (
                <span 
                  key={agent}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ 
                    backgroundColor: `color-mix(in srgb, var(--domain-${agent.toLowerCase()}) 15%, transparent)`,
                    color: `var(--domain-${agent.toLowerCase()})`,
                    border: `1px solid color-mix(in srgb, var(--domain-${agent.toLowerCase()}) 30%, transparent)`
                  }}
                >
                  {agent}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {onClose && (
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-md hover:bg-surface transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {Object.entries(state.responseByAgent).map(([agent, content], index) => {
          // Split content by paragraphs to animate line by line
          const paragraphs = content.split('\n\n').filter(p => p.trim());
          
          return (
            <div 
              key={agent} 
              className="pl-4 border-l-[3px] relative"
              style={{ borderColor: `var(--domain-${agent.toLowerCase()})` }}
            >
              <h3 
                className="text-sm font-semibold mb-3 flex items-center gap-2"
                style={{ color: `var(--domain-${agent.toLowerCase()})` }}
              >
                {agent} Agent
              </h3>
              
              <div className="space-y-4 text-text-primary text-[15px] leading-relaxed">
                {paragraphs.map((p, pIdx) => (
                  <p 
                    key={pIdx} 
                    className="text-fade-in opacity-0"
                    style={{ animationDelay: `${(index * paragraphs.length + pIdx) * 100}ms` }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          );
        })}

        {/* Sources Section */}
        {lastBotMessage?.sources && lastBotMessage.sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border/50 text-fade-in opacity-0" style={{ animationDelay: '800ms' }}>
            <h4 className="text-[11px] uppercase tracking-widest text-text-muted mb-3 font-semibold">Knowledge Sources</h4>
            <div className="flex flex-col gap-2">
              {lastBotMessage.sources.map((source, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-surface p-3 rounded-lg border border-border hover:border-border/80 transition-colors">
                  <div className="mt-0.5"><ShieldAlert size={14} className="text-blue-500" /></div>
                  <div>
                    <div className="text-sm text-text-primary font-medium">{source.title || source.source}</div>
                    {source.title && <div className="text-xs text-text-muted mt-0.5 font-mono">{source.source}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
