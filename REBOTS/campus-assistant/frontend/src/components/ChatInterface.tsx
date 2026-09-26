import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Info, ShieldAlert } from 'lucide-react';
import type { AgentEvent } from './orchestration/types';
import { cn } from '../utils/cn';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  domain?: string;
  confidence?: number;
  sources?: { title: string; source: string }[];
  actions?: { label: string; action: string; route: string }[];
  needsClarification?: boolean;
  options?: string[];
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  onAgentEvent?: (event: AgentEvent) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAgentEvent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Track current domain for events
  const currentDomainRef = useRef<string>('General');

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const emitEvent = (state: AgentEvent['state'], domain?: string) => {
    if (onAgentEvent) {
      onAgentEvent({
        agentId: domain || currentDomainRef.current,
        state,
        timestamp: Date.now(),
        metadata: { domain }
      });
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Connect to SSE stream
      const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let botMessageId = (Date.now() + 1).toString();
      
      // Initially add empty streaming message
      setMessages((prev) => [...prev, {
        id: botMessageId,
        sender: 'bot',
        text: '',
        isStreaming: true,
      }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.state === 'query_received') {
                emitEvent('analyzing');
              } else if (data.state === 'classification_complete') {
                // Backend sends domains[] now, not domain
                const firstDomain = data.domains?.[0] || data.domain || 'General';
                currentDomainRef.current = firstDomain;
                emitEvent('routing', firstDomain);
              } else if (data.state === 'agent_activated') {
                // Backend sends agentId, not domain
                emitEvent('routing', data.agentId || data.domain);
              } else if (data.state === 'retrieving' || data.state === 'retrieval_started') {
                emitEvent('retrieving', data.agentId);
              } else if (data.state === 'generating' || data.state === 'generation_started') {
                emitEvent('generating', data.agentId);
              } else if (data.state === 'complete' && !data.result) {
                // Per-agent completion (not the final response_complete)
                emitEvent('complete', data.agentId);
              } else if (data.state === 'error') {
                emitEvent('error');
                setMessages((prev) => prev.map(m => 
                  m.id === botMessageId ? { ...m, text: data.message, isStreaming: false } : m
                ));
              } else if (data.state === 'low_confidence') {
                // Low confidence — show clarification options
                setMessages((prev) => prev.map(m =>
                  m.id === botMessageId ? {
                    ...m,
                    text: "I'm not completely sure which campus service you need.",
                    needsClarification: true,
                    options: data.options,
                    isStreaming: false,
                  } : m
                ));
              } else if (data.state === 'response_complete') {
                emitEvent('complete', data.result.domains?.[0] || data.result.domain);
                
                // Update message with final result
                setMessages((prev) => prev.map(m => 
                  m.id === botMessageId ? { 
                    ...m, 
                    text: data.result.response,
                    domain: data.result.domains ? data.result.domains.join(", ") : data.result.domain,
                    confidence: data.result.confidence,
                    sources: data.result.sources,
                    actions: data.result.actions,
                    isStreaming: false
                  } : m
                ));
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Connection to orchestrator lost.',
      }]);
      emitEvent('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative z-10">
      {/* Header */}
      <div className="bg-surface-elevated border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2 text-text-primary">
          <Bot className="text-blue-500" /> Campus Assistant
        </h1>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-text-muted font-mono tracking-widest uppercase">
            Core Connected
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-muted mt-[-2rem]">
            <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-6 shadow-2xl">
              <Bot size={32} className="text-blue-500" />
            </div>
            <p className="text-lg font-medium text-text-primary mb-2">Campus Orchestrator</p>
            <p className="text-sm max-w-[250px] text-center">
              Ask me about admissions, fees, housing, and more. I'll route your request to the right agent.
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.sender === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[85%]", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
              
              <div className={cn(
                "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1",
                msg.sender === 'user' ? "bg-blue-600 ml-3" : "bg-surface-elevated border border-border mr-3"
              )}>
                {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-blue-400" />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl shadow-sm relative",
                msg.sender === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-sm" 
                  : "bg-surface-elevated border border-border text-text-primary rounded-tl-sm"
              )}>
                
                {msg.domain && msg.sender === 'bot' && (
                  <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-border/50 text-[10px] text-text-muted font-mono uppercase tracking-widest">
                    <Info size={12} /> Routed via {msg.domain} Agent
                  </div>
                )}
                
                {msg.isStreaming ? (
                  <div className="flex items-center gap-2 h-6 text-text-muted">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed opacity-90">{msg.text}</p>
                )}
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-semibold">Knowledge Sources</p>
                    <div className="flex flex-col gap-2">
                      {msg.sources.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-surface p-2 rounded border border-border/50 hover:border-border transition-colors">
                          <div className="mt-0.5"><ShieldAlert size={12} className="text-blue-500" /></div>
                          <span className="text-xs text-text-secondary line-clamp-1">{s.title || s.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.actions.map((act, idx) => (
                      <button key={idx} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs px-3 py-1.5 rounded-md border border-blue-500/30 transition-colors">
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-surface-elevated border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="w-full bg-surface border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-text-primary focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-text-muted"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:bg-surface disabled:text-text-muted disabled:hover:bg-surface transition-colors flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
