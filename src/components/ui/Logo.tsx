import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* Outer Shield representing protection */}
      <path 
        d="M50 5 C75 5, 90 20, 90 40 C90 65, 55 90, 50 95 C45 90, 10 65, 10 40 C10 20, 25 5, 50 5 Z" 
        fill="url(#shieldGradient)" 
        opacity="0.2"
      />
      <path 
        d="M50 12 C68 12, 80 23, 80 40 C80 58, 55 78, 50 82 C45 78, 20 58, 20 40 C20 23, 32 12, 50 12 Z" 
        stroke="url(#shieldGradient)" 
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner Droplet representing Varuna/Water */}
      <path 
        d="M50 30 C50 30, 35 48, 35 60 C35 68.284 41.716 75 50 75 C58.284 75 65 68.284 65 60 C65 48, 50 30, 50 30 Z" 
        fill="url(#dropletGradient)" 
      />
      
      {/* Sparkle / Highlight for depth */}
      <path 
        d="M43 50 C43 50, 40 55, 42 62" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        opacity="0.6"
      />
    </svg>
  );
}
