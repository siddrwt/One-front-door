import React from 'react';
import { Home, Calendar, LayoutDashboard, Compass, Settings, User } from 'lucide-react';

interface AppShellProps {
  chat: React.ReactNode;
  orchestration: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ chat, orchestration }) => {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-background overflow-hidden">
      
      {/* Sidebar Navigation */}
      <div className="w-16 lg:w-20 bg-surface-elevated border-r border-border flex flex-col items-center py-6 gap-8 z-20">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
          OS
        </div>
        <div className="flex flex-col gap-6 text-text-muted">
          <button className="p-3 rounded-xl hover:bg-surface hover:text-text-primary transition-colors group relative">
            <Home size={22} />
          </button>
          <button className="p-3 rounded-xl bg-blue-600/10 text-blue-500 transition-colors relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
            <LayoutDashboard size={22} />
          </button>
          <button className="p-3 rounded-xl hover:bg-surface hover:text-text-primary transition-colors">
            <Calendar size={22} />
          </button>
          <button className="p-3 rounded-xl hover:bg-surface hover:text-text-primary transition-colors">
            <Compass size={22} />
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-6 text-text-muted">
          <button className="p-3 rounded-xl hover:bg-surface hover:text-text-primary transition-colors">
            <Settings size={22} />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-blue-500 transition-colors">
            <User size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row p-2 lg:p-4 gap-4 overflow-hidden">
        {/* Left: Chat Pane */}
        <div className="flex-shrink-0 w-full lg:w-[450px] xl:w-[500px] h-1/2 lg:h-full flex flex-col">
          <div className="flex-1 bg-surface rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col">
            {chat}
          </div>
        </div>
        
        {/* Right: Orchestration Visualization */}
        <div className="flex-1 h-1/2 lg:h-full bg-surface rounded-xl border border-border shadow-2xl relative overflow-hidden hidden md:block">
          {orchestration}
        </div>
      </div>
    </div>
  );
};

