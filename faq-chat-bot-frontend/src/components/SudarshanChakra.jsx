import React from 'react';
import '../App.css';

/**
 * Sudarshan Chakra SVG component with spinning animation
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the chakra ('small' or 'large')
 */
const SudarshanChakra = ({ size = "large" }) => (
  <div className={`chakra-container ${size === "small" ? "chakra-container-small" : ""}`}>
    <svg 
      className="chakra-svg" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="#d4af37" strokeWidth="1" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#d4af37" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="10" fill="#d4af37" />
      
      {/* Spokes */}
      {[...Array(24)].map((_, i) => (
        <line 
          key={i}
          x1="50" 
          y1="50" 
          x2={50 + 42 * Math.cos(i * Math.PI / 12)} 
          y2={50 + 42 * Math.sin(i * Math.PI / 12)} 
          stroke="#d4af37" 
          strokeWidth="1.5"
        />
      ))}
      
      {/* Triangle edges */}
      {[...Array(8)].map((_, i) => {
        const angle = i * Math.PI / 4;
        const x = 50 + 45 * Math.cos(angle);
        const y = 50 + 45 * Math.sin(angle);
        return (
          <path 
            key={`triangle-${i}`}
            d={`M ${x} ${y} L ${x + 8 * Math.cos(angle + Math.PI/2)} ${y + 8 * Math.sin(angle + Math.PI/2)} L ${x + 8 * Math.cos(angle - Math.PI/2)} ${y + 8 * Math.sin(angle - Math.PI/2)} Z`}
            fill="#d4af37"
          />
        );
      })}
    </svg>
  </div>
);

export default SudarshanChakra; 