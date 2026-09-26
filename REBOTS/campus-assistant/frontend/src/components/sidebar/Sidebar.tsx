import { Bot, Search, PlusCircle, Settings, History } from 'lucide-react';
import type { Message } from '../../hooks/useOrchestrationState';
import { cn } from '../../utils/cn';

interface SidebarProps {
  messages: Message[];
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ messages, onNewChat }) => {
  // Group user messages as chat history (simplified for now)
  const history = messages.filter(m => m.sender === 'user').reverse();

  return (
    <div className="w-[320px] h-full bg-surface border-r border-border flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2 text-text-primary">
          <Bot className="text-blue-500" /> Campus OS
        </h1>
      </div>
      
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-surface-elevated hover:bg-surface-elevated/80 border border-border text-text-primary rounded-lg py-2.5 transition-colors"
        >
          <PlusCircle size={16} /> New Query
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
          <History size={14} /> Recent Queries
        </div>
        
        {history.length === 0 ? (
          <p className="text-sm text-text-muted">No recent queries</p>
        ) : (
          <div className="space-y-1">
            {history.map((msg, i) => (
              <button 
                key={msg.id}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors",
                  i === 0 ? "bg-blue-500/10 text-blue-400" : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                )}
              >
                {msg.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors w-full p-2 rounded-md hover:bg-surface-elevated">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
