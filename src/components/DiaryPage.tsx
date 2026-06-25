import React from 'react';
import { DiaryEntry, ScrapbookElement } from '../types';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Home, Scissors } from 'lucide-react';

interface DiaryPageProps {
  entry: DiaryEntry;
  onBackToFolders: () => void;
  onBackToHome: () => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function DiaryPage({
  entry,
  onBackToFolders,
  onBackToHome,
  onPrevPage,
  onNextPage,
  hasPrev,
  hasNext,
}: DiaryPageProps) {
  
  // Distribute elements into "left page" and "right page" for the open binder notebook layout
  const photos = entry.elements.filter((e) => e.type === 'photo');
  const textElements = entry.elements.filter((e) => e.type === 'handwritten' || e.type === 'postit');
  const decoElements = entry.elements.filter(
    (e) => e.type === 'tape' || e.type === 'flower' || e.type === 'stamp' || e.type === 'paperclip' || e.type === 'filmstrip'
  );

  // Helper to render tape based on type
  const getTapeClass = (content?: string) => {
    switch (content) {
      case 'washi-floral':
        return 'washi-tape-floral h-5 w-24 opacity-85';
      case 'washi-pink-translucent':
        return 'washi-tape-pink h-4 w-20 opacity-75';
      case 'washi-gold-sparkle':
        return 'washi-tape-sparkle h-5 w-24 opacity-80';
      case 'washi-brown-craft':
        return 'bg-[#a64c32]/65 border-x border-dashed border-[#6f1728]/40 h-5 w-24 opacity-75';
      case 'washi-grid-pattern':
        return 'bg-[#fff7e8]/90 border border-[#ead46b] h-4.5 w-22 opacity-85 border-dashed';
      case 'washi-navy-star':
        return 'bg-[#431826]/85 h-5 w-24 opacity-85 border-y border-dashed border-[#ead46b]/60';
      case 'washi-silver':
        return 'bg-neutral-300 dark:bg-neutral-700 h-4 w-20 opacity-65';
      default:
        return 'washi-tape h-4 w-20';
    }
  };

  return (
    <div className="relative w-full min-h-full bg-[#fffdf8] dark:bg-[#160f12] text-[#431826] dark:text-[#fff7e8] font-sans p-3 sm:p-6 transition-colors duration-500 selection:bg-[#ead46b] selection:text-[#431826]">
      
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 notebook-paper-grid opacity-35 pointer-events-none" />

      {/* Notebook Control Bar */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-wrap gap-4 justify-between items-center z-20 mb-6 bg-white/75 dark:bg-black/25 backdrop-blur-md p-3 rounded-xl border border-[#ead46b] dark:border-[#6f1728] shadow-sm select-none">
        
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={onBackToFolders}
            className="group flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider text-[#6f1728] hover:text-[#431826] dark:text-[#f3da72] dark:hover:text-white bg-[#fff7e8] dark:bg-[#2a1219] border border-[#ead46b] dark:border-[#6f1728] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
            <span>ARCHIVOS</span>
          </button>
          
          <button 
            onClick={onBackToHome}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider text-[#6f1728] hover:text-[#431826] dark:text-[#f3da72] dark:hover:text-white bg-[#fff7e8] dark:bg-[#2a1219] border border-[#ead46b] dark:border-[#6f1728] cursor-pointer transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">INICIO</span>
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center space-x-2 text-xs font-mono tracking-[0.2em] text-[#6f1728] dark:text-[#f3da72] font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{entry.folderName} // {entry.date}</span>
        </div>

        {/* Notebook Quick Flip Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onPrevPage}
            disabled={!hasPrev}
            className={`p-1.5 rounded-lg border border-[#e0d3c5] dark:border-[#2f2b28] transition-all cursor-pointer ${
              hasPrev 
                ? 'bg-[#f5f1ea] dark:bg-[#1d1a18] hover:bg-white dark:hover:bg-neutral-800 text-[#5c4f42] dark:text-[#ebdcd0]' 
                : 'opacity-40 cursor-not-allowed text-gray-400'
            }`}
            title="Página Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextPage}
            disabled={!hasNext}
            className={`p-1.5 rounded-lg border border-[#e0d3c5] dark:border-[#2f2b28] transition-all cursor-pointer ${
              hasNext 
                ? 'bg-[#f5f1ea] dark:bg-[#1d1a18] hover:bg-white dark:hover:bg-neutral-800 text-[#5c4f42] dark:text-[#ebdcd0]' 
                : 'opacity-40 cursor-not-allowed text-gray-400'
            }`}
            title="Página Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THE OPEN JOURNAL NOTEBOOK CONTAINER */}
      <div className="relative w-full max-w-5xl mx-auto z-10 flex flex-col md:flex-row bg-white dark:bg-[#171113] rounded-2xl shadow-2xl overflow-hidden border border-[#eadfce] dark:border-[#3a111a] min-h-[700px] md:min-h-[780px] transition-colors duration-500">
        
        {/* --- DESKTOP RINGS SPINE (Image 4 metal ring binder vertical spine) --- */}
        <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 z-30 hidden md:flex flex-col justify-around py-12 pointer-events-none select-none">
          {/* Vertical spine paper crease line */}
          <div className="absolute left-1/2 inset-y-0 w-[4px] -ml-[2px] bg-gradient-to-r from-black/15 via-black/5 to-white/10 dark:from-black/30 dark:via-black/10 dark:to-white/5 border-r border-black/10" />
          
          {/* Render individual metal ring binders (as in Image 4 binder rings) */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="relative w-full h-8 flex justify-center items-center">
              {/* Binder Paper holes on left page and right page */}
              <div className="absolute left-[2px] w-2.5 h-2.5 rounded-full bg-[#dec9b8] dark:bg-[#2b2723] shadow-inner border border-black/10" />
              <div className="absolute right-[2px] w-2.5 h-2.5 rounded-full bg-[#dec9b8] dark:bg-[#2b2723] shadow-inner border border-black/10" />
              
              {/* Metallic Ring Arch */}
              <div className="w-10 h-4 rounded-full border-t-4 border-r-4 border-[#cfc3b4] dark:border-[#4d443b] bg-transparent opacity-95 transform rotate-[25deg] shadow-lg flex items-center justify-center">
                {/* Metallic shine reflection */}
                <div className="w-5 h-1 border-t border-white/40 absolute -top-1 rounded-full rotate-[-20deg]" />
              </div>
            </div>
          ))}
        </div>

        {/* --- LEFT PAGE (Desktop Journal Page 1) --- */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-[#eadfce] dark:border-[#3a111a] notebook-paper-lines">
          {/* Absolute pressed flower sticker (Left page corner) */}
          <div className="absolute top-4 left-6 pointer-events-none opacity-45 select-none w-14 h-14 transform rotate-[-12deg]">
            <img src="https://api.iconify.design/noto:cherry-blossom.svg" alt="Flower sticker" className="w-full h-full object-contain filter saturate-50" />
          </div>

          <div className="space-y-8">
            {/* Header section (Nº4 THE DIGITAL DIARY...) */}
            <div className="flex justify-between items-start border-b border-[#eadfce] dark:border-[#3a111a] pb-4">
              <div>
                <p className="font-mono text-[9px] tracking-[0.25em] text-[#8a6b5c] uppercase">{entry.subtitle}</p>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#21171a] dark:text-[#fff7e8] mt-1">
                  {entry.title}
                </h1>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-[#6f1728] dark:text-[#f3da72] bg-[#ead46b]/65 dark:bg-[#6f1728] px-2 py-0.5 rounded-md font-semibold select-none">
                  PAGE 01
                </span>
                <p className="font-serif text-[10px] text-gray-400 mt-1">{entry.date}</p>
              </div>
            </div>

            {/* Main Polaroid Photo of Left Page */}
            {photos[0] && (
              <div 
                className="relative mx-auto bg-white dark:bg-[#1a1816] p-4 pb-14 shadow-2xl rounded-sm border border-[#ebdcd0] dark:border-[#272522] z-10 max-w-[280px]"
                style={{ transform: `rotate(${photos[0].rotation || -2}deg)` }}
              >
                {/* Washi tape on top of the polaroid */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={getTapeClass('washi-floral')} />
                </div>

                <div className={`relative w-full ${photos[0].aspectRatio || 'aspect-[3/4]'} bg-[#eee] dark:bg-neutral-900 overflow-hidden rounded-sm`}>
                  <img 
                    src={photos[0].content} 
                    alt={photos[0].title} 
                    className="w-full h-full object-cover grayscale brightness-95 dark:brightness-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 shadow-inner" />
                </div>
                
                <div className="absolute bottom-3 left-4 right-4 text-center">
                  <p className="font-serif italic text-xs sm:text-sm text-[#52463b] dark:text-[#beae9f] tracking-wide font-semibold">
                    {photos[0].title || 'Un instante guardado'}
                  </p>
                  <p className="font-mono text-[7px] text-gray-400 mt-0.5">EST. 2026 // EXP01</p>
                </div>
              </div>
            )}

            {/* Handwritten Diary Entry (The main text) */}
            {textElements[0] && (
              <div 
                className="relative p-2 font-handwritten text-[#431826] dark:text-[#fff7e8] z-10"
                style={{ transform: `rotate(${textElements[0].rotation || 1}deg)` }}
              >
                {textElements[0].title && (
                  <h3 className="text-2xl font-bold mb-3 font-serif italic text-[#6f1728] dark:text-[#f3da72] border-b border-[#eadfce]/80 dark:border-none pb-1">
                    {textElements[0].title}
                  </h3>
                )}
                <p className="text-xl sm:text-2xl leading-relaxed tracking-wide font-medium whitespace-pre-wrap select-text">
                  {textElements[0].content}
                </p>
              </div>
            )}
          </div>

          {/* Footer of Left Page */}
          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#8a6b5c] mt-8 border-t border-[#eadfce]/70 dark:border-[#3a111a] pt-4 select-none">
            <span>MEMORIAS // NOSTALGIA</span>
            <span>the SERENE edit</span>
          </div>
        </div>

        {/* --- RIGHT PAGE (Desktop Journal Page 2) --- */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between relative bg-[#fffaf0] dark:bg-[#151012] notebook-paper-grid">
          
          {/* Vintage Copper Paperclip decoration on the top right edge */}
          <div className="absolute -top-1.5 right-12 w-6 h-12 border-2 border-[#b09e8a] dark:border-[#52463a] rounded-full bg-transparent transform rotate-6 opacity-85 pointer-events-none select-none z-20">
            <div className="absolute top-1 left-1 w-3.5 h-8 border-r border-[#b09e8a] dark:border-[#52463a] rounded-full" />
          </div>

          <div className="space-y-8">
            {/* Header of Right Page */}
            <div className="flex justify-between items-start pb-4 border-b border-[#eadfce]/80 dark:border-none">
              <div>
                <p className="font-mono text-[9px] tracking-[0.25em] text-[#8a6b5c]">SCRAPBOOK ARRANGEMENT</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-[#6f1728] dark:text-[#f3da72] bg-[#ead46b]/65 dark:bg-[#6f1728] px-2 py-0.5 rounded-md font-semibold select-none">
                  PAGE 02
                </span>
              </div>
            </div>

            {/* Elements container holding Polaroid 2, postits, stamps */}
            <div className="relative w-full flex flex-col space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
                
                {/* Secondary Polaroid of Right Page */}
                {photos[1] && (
                  <div 
                    className="relative bg-white dark:bg-[#1a1816] p-3 pb-12 shadow-xl rounded-sm border border-[#ebdcd0] dark:border-none z-10 w-full sm:w-48 shrink-0 mx-auto"
                    style={{ transform: `rotate(${photos[1].rotation || 3}deg)` }}
                  >
                    {/* Corner washi tape sticker */}
                    <div className="absolute -top-2 -right-4 z-20">
                      <div className={getTapeClass('washi-pink-translucent')} />
                    </div>

                    <div className={`relative w-full ${photos[1].aspectRatio || 'aspect-square'} bg-gray-100 dark:bg-neutral-900 overflow-hidden rounded-sm`}>
                      <img 
                        src={photos[1].content} 
                        alt={photos[1].title} 
                        className="w-full h-full object-cover grayscale brightness-95"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 text-center">
                      <p className="font-serif italic text-[10px] text-[#52463b] dark:text-[#beae9f] font-semibold">{photos[1].title}</p>
                    </div>
                  </div>
                )}

                {/* Yellow/Cream Post-it note (Image 4 bottom post-it style) */}
                {textElements[1] && (
                  <div 
                    className={`p-5 shadow-lg rounded-sm ${textElements[1].extraClass || 'bg-[#fff7e8] dark:bg-[#1e1416] text-[#431826] dark:text-[#f5e7a6]'} max-w-[260px] border border-dashed border-[#ead46b] dark:border-[#6f1728] relative z-10 mx-auto`}
                    style={{ transform: `rotate(${textElements[1].rotation || -3}deg)` }}
                  >
                    {/* Metal mini pin clip decoration */}
                    <div className="absolute -top-3 left-1/3 transform -translate-x-1/2 w-6 h-4 bg-[#6f1728] dark:bg-[#ead46b] rounded-t shadow-md flex justify-center items-center pointer-events-none select-none">
                      <div className="w-2.5 h-1 bg-[#3a312a] dark:bg-black/40 rounded-full" />
                    </div>

                    <p className="font-typewriter text-xs leading-relaxed select-text mt-1">
                      {textElements[1].content}
                    </p>
                  </div>
                )}
              </div>

              {/* Decorative row: Stamp and Dried Flower */}
              <div className="flex justify-around items-center pt-4 select-none">
                
                {/* Vintage Postage Stamp sticker */}
                <div className="relative p-2 bg-white dark:bg-[#1f1d1a] border-4 border-dashed border-[#d2c2af] dark:border-[#38332d] shadow-md transform rotate-12 hover:scale-105 transition-transform duration-300 w-16 h-16 flex flex-col justify-between items-center pointer-events-none">
                  <div className="w-full h-3/4 bg-amber-50 dark:bg-neutral-800 rounded-sm overflow-hidden flex items-center justify-center">
                    <span className="text-xl">🗼</span>
                  </div>
                  <span className="text-[6px] font-mono tracking-widest text-amber-900/60 dark:text-neutral-500 font-bold">PARIS // 10c</span>
                </div>

                {/* Pressed Dried Flower / Leaf sticker */}
                <div className="relative w-16 h-24 transform -rotate-12 opacity-85 hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none">
                  <img 
                    src="https://api.iconify.design/noto:sheaf-of-rice.svg" 
                    alt="Dried Autumn Leaf" 
                    className="w-full h-full object-contain filter saturate-30 sepia brightness-90" 
                  />
                  {/* Miniature tape holding down the flower */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
                    <div className="washi-tape h-3 w-12 opacity-80" />
                  </div>
                </div>

                {/* Heart Sticker */}
                <div className="text-2xl transform rotate-[15deg] opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300 pointer-events-none">
                  🖤
                </div>
              </div>

              {/* FILM STRIP STICKER (As in Image 4 filmstrip cells) */}
              <div className="pt-4 flex justify-center select-none">
                <div className="bg-[#111] text-white p-2 rounded-md shadow-xl flex space-x-1.5 transform rotate-[-2deg] max-w-[280px]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-[#222] overflow-hidden border border-neutral-800 rounded-sm relative">
                        <img 
                          src={
                            i === 0 
                              ? "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&q=80&w=150" 
                              : i === 1 
                                ? "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150"
                                : "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=150"
                          } 
                          alt="Film cell" 
                          className="w-full h-full object-cover grayscale brightness-75 contrast-110" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                      {/* Film sprocket holes */}
                      <div className="flex justify-between w-full px-1 py-0.5 opacity-50">
                        <div className="w-1 h-1 bg-[#444] rounded-sm" />
                        <div className="w-1 h-1 bg-[#444] rounded-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Footer of Right Page */}
          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#8a6b5c] mt-8 border-t border-[#eadfce]/70 dark:border-[#3a111a] pt-4 select-none">
            <span>WHIMSYNIA // 2026</span>
            <span>CAPÍTULO TERMINADO</span>
          </div>
        </div>

      </div>

    </div>
  );
}
