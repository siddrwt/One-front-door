import React from 'react';

interface AgentEdgeProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isActive: boolean;
  isProcessing: boolean;
  colorVar: string;
}

export const AgentEdge: React.FC<AgentEdgeProps> = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  isActive,
  isProcessing,
  colorVar 
}) => {
  // Use a smooth cubic bezier curve instead of a straight line
  const controlPointY = startY - Math.abs(startY - endY) * 0.5;
  const path = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${controlPointY} ${endX} ${endY}`;
  
  // Calculate approximate length for stroke-dasharray animation
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) * 1.2;

  if (!isActive) return null;

  return (
    <g>
      {/* Glow effect behind the line */}
      <path
        d={path}
        fill="none"
        stroke={colorVar}
        strokeWidth="6"
        strokeOpacity={isProcessing ? "0.3" : "0.1"}
        className="transition-all duration-500"
        style={{
          strokeDasharray: length,
          strokeDashoffset: 0,
        }}
      />
      
      {/* Main animated line */}
      <path
        d={path}
        fill="none"
        stroke={colorVar}
        strokeWidth="2"
        style={{
          strokeDasharray: length,
          strokeDashoffset: length,
          animation: `dashDraw 600ms linear forwards`,
        }}
      />
      
      {/* Define the keyframe dynamically or rely on a global one. We can do global in index.css, 
          but inline is fine for this specific length constraint trick. */}
      <style>
        {`
          @keyframes dashDraw {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      
      {/* Moving particle along the path during processing */}
      {isProcessing && (
        <circle r="3" fill="#ffffff" style={{ filter: `drop-shadow(0 0 4px ${colorVar})` }}>
          <animateMotion 
            dur="1.5s" 
            repeatCount="indefinite" 
            path={path}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>
      )}
    </g>
  );
};
