
import React from 'react';

interface CharacterProps {
  isListening?: boolean;
  isTalking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Character: React.FC<CharacterProps> = ({ isListening, isTalking, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-48 h-48' : 'w-32 h-32';

  return (
    <div className={`relative ${sizeClass} flex items-center justify-center transition-all duration-500`}>
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full bg-yellow-300 blur-xl opacity-20 transition-all duration-500 ${isTalking || isListening ? 'scale-125 opacity-40' : 'scale-100'}`}></div>
      
      {/* The Character (Robot/Alien hybrid) */}
      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-lg transition-transform ${isTalking ? 'animate-bounce-slow' : ''}`}>
        <circle cx="50" cy="50" r="45" fill="#FFD700" />
        <circle cx="50" cy="50" r="40" fill="#FFF176" />
        
        {/* Eyes */}
        <g className={isListening ? 'animate-pulse' : ''}>
          <circle cx="35" cy="40" r="6" fill="#333" />
          <circle cx="65" cy="40" r="6" fill="#333" />
          <circle cx="37" cy="38" r="2" fill="white" />
          <circle cx="67" cy="38" r="2" fill="white" />
        </g>

        {/* Mouth */}
        {isTalking ? (
          <path d="M 40 65 Q 50 75 60 65" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 40 60 Q 50 70 60 60" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Antenna */}
        <line x1="50" y1="10" x2="50" y2="25" stroke="#FBC02D" strokeWidth="4" />
        <circle cx="50" cy="8" r="4" fill={isListening ? "#F44336" : "#FBC02D"} className={isListening ? 'animate-ping' : ''} />
      </svg>
    </div>
  );
};

export default Character;
