"use client";

import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";
import { events, getTimeRemaining } from "@/features/events/EventCountdown";

export default function HomeEventCountdown() {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // We only care about the first upcoming event
  const event = events[0];
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(event.startDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(event.startDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [event.startDate]);

  return (
    <div className="w-full max-w-7xl mx-auto relative group px-4">
      {/* Cyberpunk / Racing style header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-[#D71920]/30 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-3 h-8 md:h-10 bg-[#D71920] animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-white italic">
            NEXT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D71920] to-red-700">MISSION</span>
          </h2>
        </div>
        <div className="text-zinc-500 font-mono text-xs md:text-sm tracking-widest hidden md:flex items-center gap-2">
          <span>SYS.STATUS</span>
          <span className="text-white/20">{"//"}</span>
          <span className="text-[#D71920] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D71920] animate-pulse" />
            COUNTDOWN ACTIVE
          </span>
        </div>
      </div>

      {/* Main Dashboard / HUD */}
      <div className="relative w-full min-h-[500px] border border-white/10 overflow-hidden bg-[#050505] flex flex-col justify-end">
        
        {/* Background Image with Hover Parallax / Color reveal */}
        <div className="absolute inset-0 transition-opacity duration-700">
          {!imageError && event.image ? (
            <img 
              src={event.image} 
              alt={event.fullName} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
              <ImageOff size={64} />
            </div>
          )}
          {/* Gradients to blend image into the dark background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-90" />
        </div>

        {/* HUD Targeting Brackets */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#D71920]/40 transition-all duration-500 group-hover:border-[#D71920]" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#D71920]/40 transition-all duration-500 group-hover:border-[#D71920]" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#D71920]/40 transition-all duration-500 group-hover:border-[#D71920]" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#D71920]/40 transition-all duration-500 group-hover:border-[#D71920]" />

        {/* Scanline Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-10 p-8 md:p-12">
          
          {/* Left Side: Event Info */}
          <div className="flex-1 w-full">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#D71920]/10 border border-[#D71920]/30 mb-6 backdrop-blur-sm">
              <span className="w-2.5 h-2.5 bg-[#D71920] shadow-[0_0_8px_#D71920] animate-pulse" />
              <span className="font-mono text-xs text-[#D71920] tracking-[0.3em] uppercase font-bold">Target Locked</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-wider mb-4 drop-shadow-lg">
              {event.fullName}
            </h3>
            <p className="text-zinc-400 font-mono text-sm md:text-base max-w-2xl leading-relaxed border-l-2 border-white/10 pl-4">
              {event.description}
            </p>
          </div>

          {/* Right Side: Digital Countdown */}
          <div className="w-full lg:w-auto flex flex-col">
            <div className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-3 ml-2">
              Time to Deployment
            </div>
            
            <div className="flex gap-2 md:gap-4 backdrop-blur-md bg-black/40 p-4 md:p-6 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Decorative top bar on timer */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D71920]/50 to-transparent" />
              
              {!mounted ? (
                <div className="flex gap-4 animate-pulse">
                   {[1, 2, 3, 4].map((i) => <div key={i} className="w-16 md:w-24 h-20 bg-white/5" />)}
                </div>
              ) : timeLeft.isLive ? (
                <div className="w-full text-center py-6 px-12">
                  <p className="text-[#D71920] font-mono text-2xl font-bold uppercase tracking-[0.3em] animate-pulse">
                    MISSION IS ACTIVE
                  </p>
                </div>
              ) : (
                [
                  { label: "Days", value: timeLeft.days },
                  { label: "Hrs", value: timeLeft.hours },
                  { label: "Min", value: timeLeft.minutes },
                  { label: "Sec", value: timeLeft.seconds },
                ].map((unit, i) => (
                  <React.Fragment key={unit.label}>
                    <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]">
                      <span className="font-mono font-bold text-4xl md:text-6xl text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      <span className="text-[#D71920] font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mt-2 font-bold">
                        {unit.label}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className="flex flex-col justify-center pb-6 text-white/20 font-mono text-3xl md:text-4xl animate-pulse">
                        :
                      </div>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
