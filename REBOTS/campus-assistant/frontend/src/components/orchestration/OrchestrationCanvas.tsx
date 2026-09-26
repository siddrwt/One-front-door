import { useEffect, useState, useRef } from 'react';
import { OrchestratorNode } from './OrchestratorNode';
import { AgentNode } from './AgentNode';
import { AgentEdge } from './AgentEdge';
import { GraduationCap, Building, CreditCard, Briefcase, Sparkles, UserCheck, Stethoscope, Users, Globe, ClipboardList, Shield, Wrench } from 'lucide-react';
import type { OrchestrationState } from '../../hooks/useOrchestrationState';

const AGENTS = [
  { id: 'Academics', icon: GraduationCap, colorVar: 'var(--domain-academics)' },
  { id: 'Admissions', icon: UserCheck, colorVar: 'var(--domain-admissions)' },
  { id: 'Fees', icon: CreditCard, colorVar: 'var(--domain-fees)' },
  { id: 'Housing', icon: Building, colorVar: 'var(--domain-housing)' },
  { id: 'Health', icon: Stethoscope, colorVar: 'var(--domain-health)' },
  { id: 'Health & Wellness', icon: Stethoscope, colorVar: 'var(--domain-health)' },
  { id: 'Career', icon: Briefcase, colorVar: 'var(--domain-career)' },
  { id: 'General', icon: Sparkles, colorVar: 'var(--domain-general)' },
  { id: 'Student Life', icon: Users, colorVar: 'var(--domain-general)' },
  { id: 'Registration', icon: ClipboardList, colorVar: 'var(--domain-academics)' },
  { id: 'International', icon: Globe, colorVar: 'var(--domain-admissions)' },
  { id: 'Disciplinary', icon: Shield, colorVar: 'var(--domain-housing)' },
  { id: 'Facilities', icon: Wrench, colorVar: 'var(--domain-fees)' },
];

export const OrchestrationCanvas: React.FC<{ state: OrchestrationState }> = ({ state }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Track dimensions for responsive node placement
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setDimensions({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getCoordinates = () => {
    const centerX = dimensions.width / 2;
    // Push the core lower to leave room for the sleek grid above
    const centerY = (dimensions.height / 2) + 120; 
    
    const agentsMap = AGENTS.map((agent, index) => {
      // 13 Agents total. Honeycomb grid: Row 1 (4), Row 2 (5), Row 3 (4)
      let row, rowIndex, itemsInRow;
      if (index < 4) { row = 0; rowIndex = index; itemsInRow = 4; }
      else if (index < 9) { row = 1; rowIndex = index - 4; itemsInRow = 5; }
      else { row = 2; rowIndex = index - 9; itemsInRow = 4; }
      
      const spacingX = Math.min(130, dimensions.width * 0.15);
      const spacingY = Math.min(100, dimensions.height * 0.15);
      
      const rowWidth = (itemsInRow - 1) * spacingX;
      
      // Calculate base grid position
      let x = centerX - (rowWidth / 2) + (rowIndex * spacingX);
      
      // Center the grid vertically in the top half of the screen
      // Row 1 is middle row (index 1), so (row - 1) centers it around that point
      let y = centerY - (dimensions.height * 0.35) + ((row - 1) * spacingY);
      
      // Add a subtle futuristic curve (V-shape)
      const distFromCenter = Math.abs(rowIndex - (itemsInRow - 1) / 2);
      y -= distFromCenter * 12; 
      
      const isSelected = state.selectedAgents.includes(agent.id);
      
      // During zooming/processing phases, selected agents move to center
      if (isSelected && (state.animationPhase === 'zooming' || state.animationPhase === 'processing' || state.animationPhase === 'responding')) {
        // Move towards center, but keep some distance based on how many are selected
        const selectedIndex = state.selectedAgents.indexOf(agent.id);
        const totalSelected = state.selectedAgents.length;
        
        if (totalSelected === 1) {
          x = centerX;
          y = centerY - 140;
        } else {
          // Spread them out slightly above the core
          const spreadOffset = (selectedIndex - (totalSelected - 1) / 2) * 120;
          x = centerX + spreadOffset;
          y = centerY - 140;
        }
      }
      
      return { ...agent, x, y, isSelected };
    });
    
    return { centerX, centerY, agentsMap };
  };

  const { centerX, centerY, agentsMap } = getCoordinates();

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-l-2xl shadow-inner" ref={containerRef}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* SVG Connections Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {agentsMap.map((agent) => (
          <AgentEdge
            key={`edge-${agent.id}`}
            startX={centerX}
            startY={centerY}
            endX={agent.x}
            endY={agent.y + 32} // point to bottom of card
            isActive={agent.isSelected && state.animationPhase !== 'idle' && state.animationPhase !== 'analyzing'}
            isProcessing={agent.isSelected && (state.animationPhase === 'processing' || state.animationPhase === 'zooming')}
            colorVar={agent.colorVar}
          />
        ))}
      </svg>

      {/* Nodes Layer */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        
        {/* Core Orchestrator */}
        <div className="absolute" style={{ left: centerX, top: centerY, transform: 'translate(-50%, -50%)' }}>
          <OrchestratorNode state={state} />
        </div>

        {/* Agents */}
        {agentsMap.map((agent, index) => {
           // Calculate stagger delay based on index for the selection phase
           const staggerDelay = agent.isSelected && state.animationPhase === 'selecting' 
              ? `${state.selectedAgents.indexOf(agent.id) * 100}ms` 
              : '0ms';

           return (
             <div 
               key={agent.id} 
               className="absolute transition-all duration-600 ease-in-out" 
               style={{ 
                 left: agent.x, 
                 top: agent.y, 
                 transform: `translate(-50%, -50%) scale(${agent.isSelected && state.animationPhase === 'zooming' ? 1.15 : 1})`,
                 opacity: (state.animationPhase !== 'idle' && state.animationPhase !== 'analyzing') ? (agent.isSelected ? 1 : 0.3) : 1,
                 zIndex: agent.isSelected ? 30 : 20
               }}
             >
               <AgentNode 
                 id={agent.id}
                 name={agent.id}
                 icon={agent.icon}
                 colorVar={agent.colorVar}
                 state={state}
                 isSelected={agent.isSelected}
                 staggerDelay={staggerDelay}
               />
             </div>
           );
        })}
      </div>
      
    </div>
  );
};
