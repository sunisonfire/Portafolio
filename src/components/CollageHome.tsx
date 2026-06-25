import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';

interface CollageHomeProps {
  onOpenFolder: () => void;
  onOpenAboutMe: () => void;
  darkMode: boolean;
  userSelfieUrl: string;
}

export default function CollageHome({ onOpenFolder, onOpenAboutMe, darkMode, userSelfieUrl }: CollageHomeProps) {
  const [particles, setParticles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  // Generate simple ambient floating particles
  useEffect(() => {
    const tempParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${3 + Math.random() * 8}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${12 + Math.random() * 10}s`,
    }));
    setParticles(tempParticles);
  }, []);

  return (
    <div className="relative w-full min-h-full bg-[#fffdf8] dark:bg-[#160f12] text-[#431826] dark:text-[#fff7e8] font-sans pb-24 transition-colors duration-500 selection:bg-[#ead46b] selection:text-[#431826]">
      
      {/* Floating particles background */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Hero Window Swap Collage Section */}
      <div className="relative w-full max-w-5xl mx-auto px-4 pt-10 sm:pt-16 pb-12 flex flex-col items-center">
        
        {/* Aesthetic Grid Header */}
        <div className="w-full flex justify-between items-center text-[10px] tracking-[0.25em] text-[#7c6157] dark:text-[#d6c2a4] font-mono border-b border-[#eadfce] dark:border-[#3a111a] pb-3 mb-10 select-none">
          <span>WINDOW SWAP // ARCHIVE 01</span>
          <span>CODINOMELOBOS</span>
          <span className="hidden sm:inline">2026.06.23 // SCOTLAND</span>
        </div>

        {/* Butterfly Winged Sticker (Top Center) */}
        <div className="relative w-12 h-12 flex items-center justify-center mb-6 opacity-80 dark:opacity-90 select-none transform hover:scale-110 transition-transform duration-300">
          <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#6f1728] dark:fill-[#f3da72]">
            {/* Left Wing */}
            <path d="M 50 50 Q 20 20 15 40 Q 15 65 50 55 Z" className="butterfly-wing-left" />
            {/* Right Wing */}
            <path d="M 50 50 Q 80 20 85 40 Q 85 65 50 55 Z" className="butterfly-wing-right" />
            {/* Body */}
            <ellipse cx="50" cy="50" rx="2" ry="12" fill="#431826" />
          </svg>
          <div className="absolute -top-1 font-mono text-[8px] tracking-widest text-[#6f1728] dark:text-[#f3da72]">01</div>
        </div>

        {/* WINDOW PHOTO COLLAGE (Large window view layout as in Image 1) */}
        <div className="relative w-full aspect-[16/9] max-h-[460px] rounded-lg overflow-hidden border border-[#eadfce]/80 dark:border-[#3a111a] shadow-lg mb-12">
          {/* Main Landscape Background */}
          <img 
            src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200" 
            alt="Meadow Landscape Window" 
            className="w-full h-full object-cover brightness-[0.95] dark:brightness-[0.75] transition-all duration-500 scale-105 hover:scale-100 duration-[4000ms]"
            referrerPolicy="no-referrer"
          />

          {/* Absolute Overlays inside the Window */}
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />

          {/* Semi-transparent moon sticker (Left Inside) */}
          <div className="absolute top-[10%] left-[5%] sm:left-[10%] w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden opacity-35 dark:opacity-50 pointer-events-none mix-blend-screen select-none">
            <div className="w-full h-full bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=300')" }} />
          </div>

          {/* Floating Polaroid-Style Central Portrait (Image 1 central photographer girl) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button 
              id="about-me-portrait-trigger"
              onClick={onOpenAboutMe}
              className="pointer-events-auto text-left transform hover:-rotate-1 hover:scale-[1.05] hover:shadow-2xl hover:brightness-105 active:scale-95 transition-all duration-500 ease-out p-3 sm:p-4 pb-12 sm:pb-16 bg-white dark:bg-[#181614] rounded-sm shadow-2xl w-48 sm:w-64 rotate-[2.5deg] border border-[#ebdcd0] dark:border-none cursor-pointer focus:outline-none"
            >
              <div className="relative aspect-square w-full bg-[#eee] overflow-hidden">
                <img 
                  src={userSelfieUrl} 
                  alt="My Portrait" 
                  className="w-full h-full object-cover grayscale brightness-95 contrast-105 dark:brightness-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 shadow-inner" />
              </div>
              <div className="mt-2 text-center">
                <p className="font-serif italic text-xs text-[#52463b] dark:text-[#d0c0b0] font-semibold tracking-wide">lost & found</p>
                <p className="font-mono text-[8px] text-gray-400 mt-1">Nº 7482 // MONO</p>
              </div>
              {/* Gold clip graphic at top */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-[#ead46b] dark:bg-[#6f1728] rounded-t-md opacity-90 shadow-md flex items-center justify-center border-b border-[#c8a84f]">
                <div className="w-4 h-1 bg-[#6f1728] dark:bg-[#f3da72] rounded-full" />
              </div>
            </button>
          </div>

          {/* Tiny side flower/ribbon graphics inside window */}
          <div className="absolute bottom-4 right-[5%] w-16 h-16 pointer-events-none opacity-80 select-none transform rotate-[15deg] hidden sm:block">
            <img 
              src="https://api.iconify.design/noto:cherry-blossom.svg" 
              alt="Pressed Flower" 
              className="w-full h-full object-contain filter saturate-50 brightness-95" 
            />
          </div>
        </div>

        {/* TYPOGRAPHY SNIPPETS COLLAGE (Image 1 scattered layout) */}
        <div className="relative w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mt-6 px-4">
          
          {/* Left Text Block */}
          <div className="flex flex-col space-y-2 text-left opacity-75 dark:opacity-90 max-w-xs justify-center">
            <span className="font-mono text-[9px] tracking-widest text-[#a64c32]">TO U, FOR U.</span>
            <h3 className="font-serif text-lg tracking-tight leading-tight italic">
              "I've changed every part of me until the puzzle pieces aren't me at all."
            </h3>
            <span className="font-mono text-[8px] text-[#a88462] tracking-widest">— EXTRACT 03</span>
          </div>

          {/* Center Text Block (Main focus) */}
          <div className="flex flex-col items-center text-center space-y-4 px-2 py-4 border-y border-[#eadfce]/70 dark:border-[#3a111a] md:border-y-0 md:border-x md:px-6">
            <h2 className="font-serif text-sm tracking-[0.3em] font-bold text-[#431826] dark:text-[#f3da72] uppercase">
              LOST AND FORGOTTEN
            </h2>
            <p className="font-serif text-xs leading-relaxed text-[#6f5246] dark:text-[#d6c2a4] max-w-sm italic">
              "the moment when you feel forgotten in the place where you once felt most important... it's hard to even breathe in here without thinking that you are truly lost."
            </p>
            <div className="flex flex-col items-center space-y-0">
              <span className="font-serif text-3xl font-light tracking-widest text-[#21171a] dark:text-[#fff7e8]">02</span>
              <span className="font-handwritten text-xl text-[#a64c32] dark:text-[#f3da72] mt-[-5px]">lost and forgotten</span>
            </div>
          </div>

          {/* Right Text Block */}
          <div className="flex flex-col space-y-2 text-right items-end justify-center opacity-75 dark:opacity-90 max-w-xs md:ml-auto">
            <span className="font-mono text-[9px] tracking-widest text-[#a64c32]">PORTFOLIO MEMORY</span>
            <h3 className="font-serif text-lg tracking-tight leading-tight italic">
              "I look in the mirror, now I'm just a jigsaw. You take every part of me, the rest you bury."
            </h3>
            <span className="font-handwritten text-2xl text-[#a64c32] dark:text-[#f3da72] mt-1 select-none">Me?</span>
          </div>
        </div>

        {/* SCROLL / PROMPT CTA */}
        <div className="flex flex-col items-center mt-12 mb-4 animate-bounce text-[#6f1728] select-none text-[10px] tracking-widest uppercase">
          <span className="mb-1 font-mono">Ver Portfolio Diario</span>
          <ArrowDown className="w-3 h-3" />
        </div>

        {/* PORTFOLIO FOLDER COMPONENT (Image 3 layout) */}
        <div className="w-full max-w-md mt-6 relative group select-none">
          {/* Subtle glow/shadow surrounding the folder */}
          <div className="absolute inset-x-4 -top-8 -bottom-4 bg-[#6f1728]/12 dark:bg-black/40 rounded-[30px] filter blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Grass Landscape Backdrop (Slight abstract green hills under the folder) */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[120%] h-14 bg-gradient-to-t from-[#ead46b]/55 dark:from-[#6f1728]/45 to-transparent blur-md rounded-full pointer-events-none" />

          {/* The Folder Card button */}
          <button 
            id="open-portfolio-btn"
            onClick={onOpenFolder}
            className="w-full relative bg-[#6f1728] hover:bg-[#5b1322] dark:bg-[#3a111a] dark:hover:bg-[#431826] rounded-2xl p-6 pb-12 pt-8 text-white text-left shadow-2xl transform hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 ease-out cursor-pointer border border-[#a64c32] dark:border-[#6f1728] flex flex-col items-center"
          >
            {/* Folder spine indentation */}
            <div className="absolute left-6 inset-y-0 w-[2px] bg-black/15 dark:bg-white/5 border-r border-white/5 dark:border-black/20" />
            
            {/* Clip & Papers peeking out from folder back */}
            <div className="absolute -top-4 right-10 flex flex-col items-end pointer-events-none">
              {/* White sheet peeking out */}
              <div className="w-20 h-10 bg-white shadow-md transform rotate-6 translate-y-3 rounded-sm border border-gray-100" />
              {/* Paperclip */}
              <div className="w-3 h-8 border-2 border-gray-400 dark:border-gray-600 rounded-full bg-transparent transform -rotate-12 translate-x-2 -translate-y-4" />
            </div>

            {/* Red Gingham Ribbon Bow Sticker (Top left of folder) */}
            <div className="absolute -top-3 left-4 w-12 h-12 transform -rotate-12 pointer-events-none drop-shadow-md">
              <span className="text-3xl">🎀</span>
            </div>

            {/* Stamp / Mini polaroid on left cover */}
            <div className="absolute -left-10 top-12 w-28 bg-[#fdfbf7] p-2 pb-6 shadow-xl border border-[#ebdcd0] rounded-sm transform -rotate-12 group-hover:rotate-[-8deg] group-hover:-translate-x-2 transition-all duration-500 hidden sm:block">
              <div className="w-full aspect-square bg-[#333] overflow-hidden rounded-sm relative">
                <img 
                  src="https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&q=80&w=200" 
                  alt="Rain Window Cover" 
                  className="w-full h-full object-cover grayscale brightness-90"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="font-serif text-[7px] text-center text-[#5c4f42] mt-1 italic font-semibold">The art of Escape</p>
            </div>

            {/* Little pinned polaroid on right cover (Stuck in the void) */}
            <div className="absolute -right-12 top-16 w-28 bg-[#fdfbf7] p-2 pb-6 shadow-xl border border-[#ebdcd0] rounded-sm transform rotate-12 group-hover:rotate-[8deg] group-hover:translate-x-2 transition-all duration-500 hidden sm:block">
              <div className="w-full aspect-square bg-[#7c8f79] overflow-hidden rounded-sm relative">
                <img 
                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=200" 
                  alt="Grass Chair Cover" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="font-serif text-[7px] text-center text-red-800 mt-1 uppercase tracking-widest font-bold">Stuck in Void</p>
              {/* Star stickers on polaroid */}
              <span className="absolute -bottom-2 -right-1 text-xs">⭐</span>
              <span className="absolute -bottom-1 -left-2 text-[10px] transform rotate-45">⭐</span>
            </div>

            {/* Text on Folder */}
            <div className="w-full text-center mt-6 z-10">
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#f5e7a6] dark:text-[#f3da72] mb-1">
                It starts with a folder and a dream.
              </p>
              
              <h1 className="font-serif text-5xl sm:text-6xl tracking-tighter leading-none my-2 text-[#fffdf8] drop-shadow-md">
                Post<br/>
                <span className="font-light italic tracking-wide">folio</span>
              </h1>
              
              <div className="flex justify-center items-center space-x-2 mt-4 text-[#f5e7a6]/90 text-[10px] tracking-widest font-mono">
                <Sparkles className="w-3 h-3 text-[#ead46b]" />
                <span>POST DESIGN // DIARIO</span>
              </div>
            </div>

            {/* Folder Footer Text */}
            <div className="w-full flex justify-between items-end mt-12 text-[8px] tracking-widest font-mono text-[#f5e7a6] z-10 border-t border-white/15 pt-4 px-2 select-none">
              <span>ARCHIVE // 2026</span>
              <span>WHIMSYNIA</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
