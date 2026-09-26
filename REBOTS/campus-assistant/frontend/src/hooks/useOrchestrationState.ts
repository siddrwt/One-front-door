import { useState, useRef, useCallback } from 'react';

// Animation phases based on the Master Prompt
export type AnimationPhase = 
  | 'idle' 
  | 'analyzing' 
  | 'selecting' 
  | 'zooming' 
  | 'processing' 
  | 'responding' 
  | 'complete';

export interface Message {
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

export interface OrchestrationState {
  // Query state
  userQuery: string;
  querySubmitted: boolean;
  isProcessing: boolean;
  
  // Analysis results
  detectedIntent: string;
  selectedAgents: string[]; // agent IDs
  agentScores: Record<string, number>; // confidence
  estimatedTime: number; // ms
  
  // Animation state
  animationPhase: AnimationPhase;
  
  // Response state
  response: string | null;
  responseByAgent: Record<string, string>;
  isResponseReady: boolean;
  
  // Chat history
  messages: Message[];
}

export const useOrchestrationState = () => {
  const [state, setState] = useState<OrchestrationState>({
    userQuery: "",
    querySubmitted: false,
    isProcessing: false,
    detectedIntent: "Analyzing Intent...",
    selectedAgents: [],
    agentScores: {},
    estimatedTime: 2500,
    animationPhase: "idle",
    response: null,
    responseByAgent: {},
    isResponseReady: false,
    messages: []
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      querySubmitted: false,
      isProcessing: false,
      animationPhase: 'idle',
      selectedAgents: [],
      agentScores: {},
      response: null,
      responseByAgent: {},
      isResponseReady: false,
      userQuery: ''
    }));
  }, []);

  const submitQuery = useCallback(async (query: string) => {
    if (!query.trim() || state.isProcessing) return;

    // Reset current active query state but keep history
    setState(prev => ({
      ...prev,
      userQuery: query,
      querySubmitted: true,
      isProcessing: true,
      animationPhase: 'analyzing', // Phase 1: 0-200ms
      selectedAgents: [],
      agentScores: {},
      responseByAgent: {},
      isResponseReady: false,
      messages: [...prev.messages, { id: Date.now().toString(), sender: 'user', text: query }]
    }));

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let botMessageId = (Date.now() + 1).toString();
      let currentResponse = '';
      
      // Add a placeholder bot message to the history
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: botMessageId,
          sender: 'bot',
          text: '',
          isStreaming: true,
        }]
      }));

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
                setState(prev => ({ ...prev, animationPhase: 'analyzing' }));
              } 
              else if (data.state === 'classification_complete') {
                // Phase 2: Agent Selection
                const domains = data.domains || [data.domain || 'General'];
                const confidence = data.confidence || 0.5;
                
                // Build scores record
                const scores: Record<string, number> = {};
                domains.forEach((d: string) => scores[d] = confidence);
                
                setState(prev => ({ 
                  ...prev, 
                  animationPhase: 'selecting',
                  selectedAgents: domains,
                  agentScores: scores,
                  detectedIntent: domains[0] + ' Inquiry', // Basic intent string
                }));
                
                // Trigger Zoom Phase shortly after Selection Phase
                setTimeout(() => {
                  setState(prev => {
                    // Only transition if we haven't been reset or moved past this
                    if (prev.isProcessing && prev.animationPhase === 'selecting') {
                       return { ...prev, animationPhase: 'zooming' };
                    }
                    return prev;
                  });
                }, 600); // Wait for the glow/pulse selection animation
                
              } 
              else if (data.state === 'routing_started' || data.state === 'agent_activated') {
                // We should already be zooming by this point, let's move to processing
                setState(prev => {
                   if (prev.animationPhase === 'zooming' || prev.animationPhase === 'selecting') {
                     return { ...prev, animationPhase: 'processing' };
                   }
                   return prev;
                });
              } 
              else if (data.state === 'response_complete') {
                 // Phase 4: Response Integration
                 const finalResult = data.result;
                 const mainAgent = finalResult.domains?.[0] || finalResult.domain || 'General';
                 
                 setState(prev => {
                   const updatedResponseByAgent = { ...prev.responseByAgent, [mainAgent]: finalResult.response };
                   
                   return { 
                     ...prev, 
                     animationPhase: 'responding',
                     responseByAgent: updatedResponseByAgent,
                     isResponseReady: true,
                     messages: prev.messages.map(m => 
                        m.id === botMessageId ? { 
                          ...m, 
                          text: finalResult.response,
                          domain: mainAgent,
                          confidence: finalResult.confidence,
                          sources: finalResult.sources,
                          actions: finalResult.actions,
                          isStreaming: false
                        } : m
                     )
                   };
                 });

                 // Phase 5: Complete/Reset after viewing response
                 setTimeout(() => {
                   setState(prev => {
                     if (prev.animationPhase === 'responding') {
                        return { ...prev, animationPhase: 'complete', isProcessing: false };
                     }
                     return prev;
                   });
                 }, 3000); // 3 seconds to view response highlight before resetting agents
              }
              else if (data.state === 'error') {
                 setState(prev => ({
                   ...prev,
                   animationPhase: 'complete',
                   isProcessing: false,
                   messages: prev.messages.map(m => 
                     m.id === botMessageId ? { ...m, text: data.message || 'An error occurred.', isStreaming: false } : m
                   )
                 }));
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return; // Expected when unmounting or re-submitting
      console.error(error);
      setState(prev => ({
        ...prev,
        animationPhase: 'complete',
        isProcessing: false,
        messages: [...prev.messages, {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Connection to orchestrator lost.',
        }]
      }));
    }
  }, [state.isProcessing]);

  return {
    state,
    submitQuery,
    resetState
  };
};
