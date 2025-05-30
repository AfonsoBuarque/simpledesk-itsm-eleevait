
import React from 'react';

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large Circle - Top Left */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white bg-opacity-10 rounded-full"></div>
      
      {/* Medium Circle - Top Right */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-300 bg-opacity-20 rounded-full"></div>
      
      {/* Small Circle - Bottom Left */}
      <div className="absolute bottom-32 left-40 w-32 h-32 bg-cyan-300 bg-opacity-30 rounded-full"></div>
      
      {/* Rectangle - Bottom Right */}
      <div className="absolute bottom-20 right-10 w-48 h-32 bg-blue-300 bg-opacity-25 rounded-lg transform rotate-12"></div>
      
      {/* Triangle shapes */}
      <div className="absolute top-1/3 left-1/4 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-white border-opacity-15"></div>
      
      {/* Zigzag patterns */}
      <div className="absolute bottom-1/4 right-1/3">
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-white opacity-20">
          <path d="M10,10 L20,30 L30,10 L40,30 L50,10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M10,25 L20,45 L30,25 L40,45 L50,25" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      
      {/* More geometric elements */}
      <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-white border-opacity-25 rounded-lg transform rotate-45"></div>
      <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-purple-200 bg-opacity-30 transform rotate-12"></div>
    </div>
  );
};

export default AuthBackground;
