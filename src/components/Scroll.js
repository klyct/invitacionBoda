import React, { useState, useEffect } from "react";


export default function ScrollIndicator() {
  const [showIndicator, setShowIndicator] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    if (timerStarted) return;

    const initialTimer = setTimeout(() => {
      setShowIndicator(true);
      setTimerStarted(true);
      
      // Ocultar después de 10 segundos
      const hideTimer = setTimeout(() => {
        setShowIndicator(false);
      }, 15000);
      
      return () => clearTimeout(hideTimer);
    }, 15000); 

    return () => clearTimeout(initialTimer);
  }, [timerStarted]);

  if (!showIndicator) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#c798c8] bg-opacity-90 backdrop-blur-sm py-3 z-50 animate-fade-in">
      <div className="container mx-auto text-center">
        <p className="text-[#4c044d] font-medium flex items-center justify-center space-x-2">
          <svg 
            className="w-5 h-5 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
          <span>Desplázate hacia abajo para descubrir más</span>
          <svg 
            className="w-5 h-5 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </p>
      </div>
    </div>
  );

}