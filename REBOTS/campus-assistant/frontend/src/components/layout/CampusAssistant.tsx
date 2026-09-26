import { useOrchestrationState } from '../../hooks/useOrchestrationState';
import { Sidebar } from '../sidebar/Sidebar';
import { QueryBreakdownPanel } from '../orchestration/QueryBreakdownPanel';
import { ResponsePanel } from '../orchestration/ResponsePanel';
import { QueryInputBar } from '../orchestration/QueryInputBar';
import { OrchestrationCanvas } from '../orchestration/OrchestrationCanvas';

export const CampusAssistant: React.FC = () => {
  const { state, submitQuery, resetState } = useOrchestrationState();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-primary">
      {/* LEFT: Sidebar (History & Nav) */}
      <Sidebar messages={state.messages} onNewChat={resetState} />

      {/* CENTER: Main Canvas & Orchestration */}
      <div className="flex-1 relative flex flex-col min-w-0">
        
        {/* The 3D/Network Canvas */}
        <div className="absolute inset-0 z-0">
          <OrchestrationCanvas state={state} />
        </div>

        {/* Floating Breakdown Panel (appears during analysis) */}
        <QueryBreakdownPanel state={state} />

        {/* Bottom Input Area */}
        <div className="mt-auto relative z-30 w-full pb-8 pt-4 px-8 bg-gradient-to-t from-background via-background/80 to-transparent">
          <QueryInputBar onSend={submitQuery} isLoading={state.isProcessing} />
        </div>
      </div>

      {/* RIGHT: Response Panel (Slides in when ready) */}
      <ResponsePanel state={state} onClose={resetState} />
    </div>
  );
};
