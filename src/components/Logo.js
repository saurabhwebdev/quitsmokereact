import React from 'react';

export default function Logo({ className = "h-8 w-8" }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Cigarette */}
        <rect x="20" y="40" width="60" height="20" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
        <rect x="20" y="40" width="15" height="20" fill="#FFA07A" stroke="#000000" strokeWidth="2" />
        
        {/* Animated Smoke */}
        <g className="smoke-animation">
          <circle className="animate-smoke-1 opacity-0" cx="15" cy="45" r="3" fill="#D3D3D3" />
          <circle className="animate-smoke-2 opacity-0" cx="12" cy="42" r="2" fill="#D3D3D3" />
          <circle className="animate-smoke-3 opacity-0" cx="18" cy="40" r="2.5" fill="#D3D3D3" />
        </g>
        
        {/* Red Cross Animation */}
        <g className="cross-animation">
          <line 
            x1="30" 
            y1="30" 
            x2="70" 
            y2="70" 
            stroke="#FF0000" 
            strokeWidth="4"
            className="animate-cross-1"
          />
          <line 
            x1="70" 
            y1="30" 
            x2="30" 
            y2="70" 
            stroke="#FF0000" 
            strokeWidth="4"
            className="animate-cross-2"
          />
        </g>
      </svg>
    </div>
  );
} 