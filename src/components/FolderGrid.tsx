import React from 'react';
import { DiaryEntry } from '../types';
import { ArrowLeft, Sparkles, Pin } from 'lucide-react';

interface FolderGridProps {
  entries: DiaryEntry[];
  onSelectEntry: (id: string) => void;
  onBackToCollage: () => void;
}

export default function FolderGrid({ entries, onSelectEntry, onBackToCollage }: FolderGridProps) {
  return (
    <div className="relative w-full min-h-full bg-[#fffdf8] dark:bg-[#160f12] text-[#431826] dark:text-[#fff7e8] font-sans p-4 sm:p-8 transition-colors duration-500 selection:bg-[#ead46b] selection:text-[#431826]">
      
      {/* Dynamic Grid Background Texture */}
      <div className="absolute inset-0 notebook-paper-grid opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-4xl mx-auto z-10">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#ead46b] dark:border-[#6f1728]">
          <button 
            onClick={onBackToCollage}
            className="group flex items-center space-x-2 text-xs font-mono tracking-widest text-[#6f1728] hover:text-[#431826] dark:text-[#f3da72] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>RETORNAR AL COLLAGE</span>
          </button>
          
          <div className="flex items-center space-x-1.5 text-xs font-mono tracking-widest text-[#6f1728] dark:text-[#f3da72] select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#ead46b]" />
            <span>CABINET DE ARCHIVOS</span>
          </div>
        </div>

        {/* Tactile Folder Stack Visual (Like Image 2) */}
        <div className="mb-14 text-center select-none">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight italic mb-3">
            Elige un archivo de la bitácora
          </h2>
          <p className="font-serif text-xs text-[#6f5246] dark:text-[#d6c2a4] max-w-md mx-auto italic">
            "Cada documento resguarda fragmentos de memoria, flores disecadas, notas al margen y capturas analógicas de un instante perdido."
          </p>
        </div>

        {/* 1. OVERLAPPING TACTILE MANILA TABS STACK (Beautiful interactive representation of Image 2) */}
        <div className="w-full max-w-2xl mx-auto mb-16 relative h-[240px] sm:h-[300px] flex flex-col justify-end">
          <div className="absolute inset-x-0 bottom-0 h-4 bg-black/10 dark:bg-black/30 rounded-full blur-md pointer-events-none" />
          
          {entries.map((entry, index) => {
            // Overlapping height position & margins
            const zIndex = 10 + index;
            const translateOffset = (entries.length - 1 - index) * 16;
            const folderLabel = entry.folderName;

            // Get preview image if present
            const firstPhoto = entry.elements.find((e) => e.type === 'photo')?.content;

            return (
              <div
                key={entry.id}
                className="absolute inset-x-0 bottom-0 transition-all duration-500 ease-out transform origin-bottom hover:-translate-y-8 cursor-pointer"
                style={{
                  zIndex,
                  transform: `translateY(-${translateOffset}px)`,
                }}
                onClick={() => onSelectEntry(entry.id)}
              >
                {/* File Folder Tab Outline (Manila folder style) */}
                <div className="w-full shadow-lg rounded-t-xl overflow-hidden border border-[#eadfce]/90 dark:border-[#3a111a]">
                  
                  {/* Folder Tab Head */}
                  <div className="flex items-end">
                    {/* Folder Tab Item */}
                    <div 
                      className={`px-4 sm:px-6 py-2 rounded-t-lg text-[10px] sm:text-xs font-mono tracking-widest font-semibold ${entry.folderTabColor} text-[#fbfaf8] shadow-sm flex items-center space-x-2`}
                      style={{
                        marginLeft: `${24 + index * 80}px`,
                      }}
                    >
                      <Pin className="w-2.5 h-2.5 transform -rotate-45" />
                      <span>{folderLabel}</span>
                    </div>
                  </div>

                  {/* Folder Cover Body */}
                  <div className={`w-full p-4 sm:p-6 ${entry.folderBgColor} h-36 sm:h-44 flex justify-between items-center transition-colors duration-500 border-t border-black/5`}>
                    
                    {/* Left: Metadata and Excerpt */}
                    <div className="max-w-[65%] flex flex-col space-y-1.5 sm:space-y-3">
                      <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-[#a64c32] dark:text-[#f3da72] uppercase">
                        {entry.subtitle}
                      </span>
                      <h3 className="font-serif text-lg sm:text-2xl tracking-tight font-medium text-[#21171a] dark:text-[#fff7e8]">
                        {entry.title}
                      </h3>
                      <p className="font-serif text-[10px] sm:text-xs italic text-[#6f5246] dark:text-[#d6c2a4] line-clamp-2 max-w-sm">
                        "{entry.elements.find(e => e.type === 'handwritten')?.content || ''}"
                      </p>
                      <div className="flex items-center space-x-2 text-[8px] font-mono tracking-widest text-[#8a6b5c] dark:text-[#d6c2a4] pt-1">
                        <span>FECHA: {entry.date}</span>
                        <span>•</span>
                        <span>ELEMENTOS: {entry.elements.length}</span>
                      </div>
                    </div>

                    {/* Right: Small polaroid peeking out */}
                    {firstPhoto && (
                      <div className="w-20 sm:w-28 bg-white dark:bg-[#1a1816] p-1.5 pb-4 sm:pb-6 shadow-md border border-[#ebdcd0]/75 dark:border-none rounded-sm transform rotate-6 group-hover:rotate-12 transition-transform duration-300 pointer-events-none">
                        <div className="w-full aspect-square bg-gray-100 dark:bg-neutral-800 overflow-hidden relative rounded-sm">
                          <img 
                            src={firstPhoto} 
                            alt="Peek" 
                            className="w-full h-full object-cover grayscale brightness-95" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="mt-1 text-center">
                          <span className="font-handwritten text-[9px] sm:text-xs text-[#52463b] dark:text-[#beae9f]">Recuerdo</span>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* 2. THE CHRONOLOGICAL DOCUMENT GRID (Beautiful layout of individual items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-12">
          {entries.map((entry) => {
            const firstPhoto = entry.elements.find((e) => e.type === 'photo')?.content;
            
            return (
              <button
                key={entry.id}
                onClick={() => onSelectEntry(entry.id)}
                className="w-full group bg-white hover:bg-[#fff7e8] dark:bg-[#2a1219] dark:hover:bg-[#3a111a] border border-[#ead46b]/70 dark:border-[#6f1728] p-5 sm:p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between text-left relative overflow-hidden cursor-pointer"
              >
                {/* Top Corner Tape Decoration */}
                <div className="absolute top-2 left-6 w-14 h-4 bg-[#ead46b]/45 dark:bg-white/10 border-x border-dashed border-[#6f1728]/45 rotate-[-15deg]" />

                <div className="w-full">
                  {/* Category and Date */}
                  <div className="flex justify-between items-center mb-4 text-[9px] font-mono tracking-widest text-[#6f1728] dark:text-[#f3da72]">
                    <span className="bg-[#ead46b]/35 dark:bg-[#6f1728] px-2 py-0.5 rounded text-[#431826] dark:text-[#fff7e8] font-bold">
                      FOLDER {entry.folderName}
                    </span>
                    <span>{entry.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-medium tracking-tight text-[#431826] dark:text-[#f3da72] group-hover:text-[#6f1728] dark:group-hover:text-white transition-colors mb-2">
                    {entry.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-mono text-[9px] tracking-wider text-[#6f1728]/80 dark:text-[#f3da72]/80 mb-4">
                    {entry.subtitle}
                  </p>

                  {/* Grid Preview row */}
                  <div className="flex space-x-4 items-start">
                    {firstPhoto && (
                      <div className="w-20 h-20 shrink-0 bg-white dark:bg-[#160f12] p-1 shadow-sm border border-[#ead46b] dark:border-[#6f1728] rounded-sm transform rotate-[-2deg]">
                        <img 
                          src={firstPhoto} 
                          alt={entry.title} 
                          className="w-full h-full object-cover grayscale brightness-95"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <p className="font-serif text-xs leading-relaxed text-[#431826]/90 dark:text-[#fff7e8]/90 line-clamp-4 italic">
                      {entry.elements.find(e => e.type === 'handwritten')?.content || ''}
                    </p>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex justify-between items-center mt-6 pt-3 border-t border-[#ead46b]/60 dark:border-[#6f1728]/70 text-[9px] font-mono tracking-widest text-[#6f1728] dark:text-[#f3da72]">
                  <span>ARCHIVOS CHERRY & BANANA</span>
                  <span className="group-hover:translate-x-1 transition-transform font-bold">EXPLORAR →</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
