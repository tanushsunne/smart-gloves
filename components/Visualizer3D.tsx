
import React from 'react';

interface Visualizer3DProps {
  flexValues: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    little: number;
  };
}

const Visualizer3D: React.FC<Visualizer3DProps> = ({ flexValues }) => {
  // Simple representation of a hand using SVG
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 200 240" className="w-full h-full opacity-80">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Palm */}
        <path d="M60,180 Q100,220 140,180 L140,120 Q100,100 60,120 Z" fill="none" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        
        {/* Fingers - Heights adjusted by flex values (0-1) */}
        {/* Thumb */}
        <line x1="60" y1="140" x2={40 - flexValues.thumb * 10} y2={100 + flexValues.thumb * 20} stroke="#10b981" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
        {/* Index */}
        <line x1="75" y1="120" x2="75" y2={40 + flexValues.index * 40} stroke="#10b981" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
        {/* Middle */}
        <line x1="100" y1="110" x2="100" y2={30 + flexValues.middle * 40} stroke="#10b981" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
        {/* Ring */}
        <line x1="125" y1="120" x2="125" y2={45 + flexValues.ring * 40} stroke="#10b981" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
        {/* Little */}
        <line x1="145" y1="140" x2="155" y2={70 + flexValues.little * 30} stroke="#10b981" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
      </svg>
      
      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-emerald-800">
        Haptic Nodes: 12 Active
      </div>
    </div>
  );
};

export default Visualizer3D;
