export type AgentState =
  | 'idle'
  | 'analyzing'
  | 'selecting'
  | 'zooming'
  | 'routing'
  | 'retrieving'
  | 'generating'
  | 'processing'
  | 'responding'
  | 'complete'
  | 'error';

export interface AgentEvent {
  agentId?: string; // Optional for global states like analyzing
  state: AgentState | 'classification_complete' | 'agent_activated' | 'retrieval_started' | 'generation_started' | 'response_complete' | 'low_confidence' | 'query_received';
  timestamp: number;
  metadata?: Record<string, any>;
}
