import React from 'react';
import { ArrowLeft, Sparkles, Heart, HelpCircle } from 'lucide-react';

interface AboutMeProps {
  onBackToHome: () => void;
  userSelfieUrl: string;
}

export default function AboutMe({ onBackToHome, userSelfieUrl }: AboutMeProps) {
  return (
    <div className="relative w-full min-h-full bg-[#fffdf8] dark:bg-[#160f12] text-[#431826] dark:text-[#fff7e8] font-sans p-4 sm:p-8 transition-colors duration-500 overflow-y-auto pb-24 select-none">
      
      {/* Aesthetic grid overlay for scrapbook context */}
      <div className="absolute inset-0 notebook-paper-grid opacity-25 pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto z-10">
        
        {/* Navigation bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#ead46b] dark:border-[#6f1728]">
          <button 
            onClick={onBackToHome}
            className="group flex items-center space-x-2 text-xs font-mono tracking-widest text-[#6f1728] hover:text-[#431826] dark:text-[#f3da72] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>VOLVER AL INICIO</span>
          </button>
          
          <div className="flex items-center space-x-1.5 text-xs font-mono tracking-widest text-[#6f1728] dark:text-[#f3da72]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PERFIL ARTÍSTICO // ¿QUIÉN SOY?</span>
          </div>
        </div>

        {/* Introduction Title */}
        <div className="text-center mb-12">
          <span className="font-handwritten text-3xl text-[#a64c32] dark:text-[#f3da72] block mb-2">Un pedacito de mí...</span>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-none italic font-semibold">
            ¿Quién Soy?
          </h1>
          <p className="font-serif text-xs text-[#6f5246] dark:text-[#d6c2a4] max-w-md mx-auto mt-3 italic">
            "Un refugio de nostalgia y arte donde guardo mis tesoros cotidianos, canciones favoritas y pensamientos de medianoche."
          </p>
        </div>

        {/* MAIN LAYOUT: Combined reference 2 & reference 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDE: REFERENCE 2 (What's in my Tin Case) - Span 6 */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Tin Case Header */}
            <div className="w-full text-center mb-4">
              <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-[#6f1728] dark:text-[#f3da72]">Aesthetic Box</h2>
              <p className="font-serif italic text-sm text-[#6f5246] dark:text-[#d6c2a4] mt-1">"Mis esenciales analógicos y dulces favoritos"</p>
            </div>

            {/* THE TIN CASE COMPONENT (Exactly as in Image 2) */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] bg-[#431826] p-6 rounded-[30px] shadow-2xl border border-[#6f1728] flex flex-col items-center">
              
              {/* Star stickers on the outer layout */}
              <div className="absolute -top-6 -left-6 text-2xl text-amber-300/40 animate-pulse">★</div>
              <div className="absolute top-1/2 -right-8 text-xl text-amber-300/30">★</div>
              <div className="absolute -bottom-4 -left-2 text-2xl text-amber-300/40">★</div>

              {/* Title Calligraphy overlying the box (What's in my Tin Case) */}
              <div className="w-full relative h-20 -mb-4 z-20 pointer-events-none">
                <span className="absolute left-[-20px] top-0 font-handwritten text-6xl sm:text-7xl text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform -rotate-[10deg]">
                  What's
                </span>
                <span className="absolute left-[80px] top-8 font-serif italic text-2xl sm:text-3xl text-[#f5e7a6] tracking-widest uppercase drop-shadow">
                  in
                </span>
                <span className="absolute right-4 top-1 font-serif italic text-3xl sm:text-4xl text-[#f5e7a6] tracking-widest uppercase drop-shadow">
                  my
                </span>
                <span className="absolute right-4 top-10 font-serif text-3xl sm:text-4xl tracking-tight text-white font-bold drop-shadow">
                  Tin Case
                </span>
              </div>

              {/* THE OPEN METALLIC BOX (Divided in Top and Bottom Lids) */}
              <div className="w-full bg-[#ead46b] rounded-2xl p-3 border-2 border-[#f5e7a6] shadow-inner relative flex flex-col space-y-4">
                
                {/* Metallic Inner Rim Shadow */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/25 rounded-2xl pointer-events-none" />

                {/* --- TOP LID (Stickers & Sweets) --- */}
                <div className="relative bg-[#f5e7a6] rounded-xl p-3 border border-[#c8a84f] shadow-inner h-56 flex flex-col justify-between overflow-hidden">
                  
                  {/* Photo Strip Sticker (Top Left) */}
                  <div className="absolute top-2 left-2 w-24 bg-white p-1 pb-3 shadow-md border border-gray-100 rounded-sm transform rotate-[-8deg] hover:rotate-[-2deg] transition-all duration-300 z-10">
                    <div className="w-full aspect-square bg-[#333] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=200" 
                        alt="Band memory" 
                        className="w-full h-full object-cover grayscale brightness-90"
                      />
                    </div>
                    <p className="text-[6px] font-mono text-center text-gray-500 mt-1 uppercase tracking-widest font-semibold">THE BAND</p>
                  </div>

                  {/* Red Star Sticker badge */}
                  <div className="absolute top-4 right-14 w-12 h-12 flex items-center justify-center transform rotate-12 drop-shadow-md z-10">
                    <span className="text-3xl">⭐</span>
                  </div>

                  {/* "Cherry Flavoured" Sticker */}
                  <div className="absolute top-10 right-2 bg-[#fff7e8] text-[#6f1728] border border-[#a64c32]/35 font-serif text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold transform rotate-6 shadow-sm z-10 flex items-center space-x-1">
                    <span>🍒</span>
                    <span>Cherry Flavoured</span>
                  </div>

                  {/* Black Cat Silhouette Sticker */}
                  <div className="absolute bottom-2 left-2 text-3xl transform -rotate-12 hover:scale-110 transition-transform duration-300 z-10 select-none">
                    🐈‍⬛
                  </div>

                  {/* RED KITKAT CHOCOLATE BAR wrapper (Classic nostalgia food element) */}
                  <div className="absolute bottom-6 right-2 w-32 bg-[#6f1728] text-white py-1 px-3 border border-[#431826] shadow-md font-bold text-center tracking-widest rounded-sm transform rotate-[-4deg] hover:rotate-1 transition-all duration-300 z-10 flex flex-col justify-center items-center">
                    <span className="text-[10px] font-serif tracking-tighter">KitKat</span>
                    <span className="text-[4px] font-mono tracking-widest opacity-80">CHOC WAFER</span>
                  </div>

                  {/* Mini quote sticker */}
                  <div className="absolute top-24 left-16 bg-amber-50/90 text-[#4c3a2b] font-mono text-[7px] p-1.5 rounded border border-[#d2c2af] transform rotate-[4deg] max-w-[120px] shadow-sm leading-tight z-10">
                    "Carpe Diem. Seize the day. Make your lives extraordinary."
                  </div>

                </div>

                {/* --- THE HINGE JOINT SPLIT LINE --- */}
                <div className="h-[2px] bg-[#6f1728] w-full relative">
                  <div className="absolute left-1/4 top-[-3px] w-6 h-2 bg-[#fff7e8] border border-[#6f1728] rounded-sm" />
                  <div className="absolute right-1/4 top-[-3px] w-6 h-2 bg-[#fff7e8] border border-[#6f1728] rounded-sm" />
                </div>

                {/* --- BOTTOM LID (Accessories & Essentials) --- */}
                <div className="relative bg-[#f5e7a6] rounded-xl p-3 border border-[#c8a84f] shadow-inner h-56 overflow-hidden flex flex-col justify-between">
                  
                  {/* Retro Wire Earphones Cable looping around (Image 2 style) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45 stroke-white fill-none stroke-2">
                    <path d="M 30,190 C 80,180 150,220 200,160 C 230,130 180,80 120,110 C 90,130 140,160 210,120 C 260,90 280,180 250,200" />
                  </svg>
                  {/* Earphone earbud icons */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-12 z-20 opacity-80 pointer-events-none">
                    <div className="w-3 h-3 bg-white rounded-full border border-gray-400 rotate-45 flex items-center justify-center">
                      <div className="w-1 h-2 bg-gray-400 rounded-full" />
                    </div>
                    <div className="w-3 h-3 bg-white rounded-full border border-gray-400 -rotate-45 flex items-center justify-center">
                      <div className="w-1 h-2 bg-gray-400 rounded-full" />
                    </div>
                  </div>

                  {/* Wire Glasses Sticker (Image 2 style glasses lying down) */}
                  <div className="absolute top-6 right-8 w-28 h-12 opacity-85 hover:scale-105 transition-transform duration-300 z-10 pointer-events-none">
                    <div className="flex justify-between items-center w-full h-full relative">
                      {/* Left Rim */}
                      <div className="w-10 h-10 border-2 border-gray-300/80 rounded-full bg-white/5 shadow-inner" />
                      {/* Bridge */}
                      <div className="w-8 h-1 border-t-2 border-gray-300/80 absolute left-1/2 transform -translate-x-1/2 top-1/2" />
                      {/* Right Rim */}
                      <div className="w-10 h-10 border-2 border-gray-300/80 rounded-full bg-white/5 shadow-inner" />
                    </div>
                  </div>

                  {/* Retro Post Card envelope slip */}
                  <div className="absolute top-10 left-2 w-32 bg-[#faf7f0] p-1.5 shadow-md border border-[#dfd5c5] rounded-sm transform rotate-[-6deg] hover:rotate-[1deg] transition-all duration-300 z-10 text-[#4c3b2d]">
                    <div className="border border-[#ebdcd0] p-1 flex flex-col justify-between h-14">
                      <span className="font-serif text-[6px] tracking-widest border-b border-[#ebdcd0] pb-0.5 uppercase font-bold text-center">POST CARD</span>
                      <div className="flex justify-between items-end">
                        <span className="font-handwritten text-[7px] italic text-gray-500">Un saludo, Rayi</span>
                        <div className="w-3 h-3 bg-amber-800/10 border border-amber-800/20" />
                      </div>
                    </div>
                  </div>

                  {/* Shopping receipt paper peeking from behind */}
                  <div className="absolute bottom-6 right-2 w-20 bg-white/90 p-1 shadow border border-gray-100 rounded-sm transform rotate-[8deg] z-10 text-[#111] font-mono text-[5px] space-y-0.5 leading-none">
                    <p className="text-center font-bold border-b border-gray-300 pb-0.5 text-[6px]">RECEIPT</p>
                    <div className="flex justify-between"><span>• COFFEE</span><span>$3.50</span></div>
                    <div className="flex justify-between"><span>• FILM DEV</span><span>$8.00</span></div>
                    <div className="flex justify-between"><span>• ART BOOK</span><span>$14.00</span></div>
                    <div className="flex justify-between font-bold border-t border-dashed border-gray-300 pt-0.5"><span>TOTAL</span><span>$25.50</span></div>
                  </div>

                  {/* "I ❤️ ME" Badge Pin Button */}
                  <div className="absolute bottom-3 left-4 w-10 h-10 rounded-full bg-white text-rose-600 border border-gray-200 shadow-md flex flex-col justify-center items-center transform rotate-12 hover:scale-110 transition-transform duration-300 z-10 cursor-pointer">
                    <Heart className="w-3.5 h-3.5 fill-rose-600" />
                    <span className="text-[5px] font-mono font-black mt-0.5 tracking-tighter">I LUV ME</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE: REFERENCE 3 (Friendship Valentines Card) - Span 6 */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Valentines Card Header */}
            <div className="w-full text-center mb-4">
              <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-[#6f1728] dark:text-[#f3da72]">Nostalgic Letter</h2>
              <p className="font-serif italic text-sm text-[#6f5246] dark:text-[#d6c2a4] mt-1">"Mi tarjeta de presentación para el mundo"</p>
            </div>

            {/* THE VALENTINES CARD CANVAS (Exactly as in Image 3) */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] bg-[#6f1728] p-6 rounded-[30px] shadow-2xl border border-[#a64c32] flex flex-col items-center min-h-[500px] justify-between">
              
              {/* Star stickers on the outer layout */}
              <div className="absolute top-1/4 -left-6 text-xl text-amber-200/40">★</div>
              <div className="absolute top-10 right-4 text-2xl text-amber-200/50">★</div>
              <div className="absolute bottom-20 -right-4 text-xl text-amber-200/35">★</div>

              {/* VALENTINES RETRO ENVELOPE (Top Side) */}
              <div className="relative w-full bg-[#fdfbf7] p-4 pb-8 rounded-sm shadow-xl border border-[#ebdcd0] transform rotate-[-4deg] hover:rotate-1 transition-all duration-500 z-10">
                
                {/* Friendship card title in red lettering */}
                <div className="w-full text-center border-2 border-dashed border-[#e6bfae] py-3 px-2 rounded-sm text-[#82111d] flex flex-col justify-center items-center">
                  <h3 className="font-serif text-xl font-bold tracking-widest leading-none">
                    FRIENDSHIP
                  </h3>
                  <h3 className="font-serif text-xl font-bold tracking-widest leading-none mt-1">
                    VALENTINES
                  </h3>
                  <h3 className="font-serif text-xl font-bold tracking-widest leading-none mt-1">
                    CARD
                  </h3>
                </div>

                {/* Wax seal graphic center bottom of envelope flap */}
                <div className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-[#a32230] border border-[#82111d] shadow-md flex items-center justify-center text-amber-300/80 font-serif font-bold text-lg select-none">
                  ⚜️
                </div>

                {/* Handwritten sub-tag */}
                <div className="absolute right-4 bottom-2 font-handwritten text-xs text-rose-800 rotate-[-12deg]">
                  with love x
                </div>
              </div>

              {/* POLAROID OF USER SELFIE (Using the user-selfie image without editing/replacing it) */}
              <div className="absolute top-[180px] right-[-10px] bg-white p-3 pb-8 shadow-2xl rounded-sm border border-gray-100 w-36 sm:w-40 transform rotate-[10deg] hover:rotate-[4deg] transition-all duration-300 z-20">
                
                {/* Mini piece of clear washi tape on top of polaroid */}
                <div className="absolute -top-2 left-1/3 w-16 h-4 bg-white/30 border-x border-dashed border-gray-300 rotate-12" />

                <div className="w-full aspect-square bg-[#333] overflow-hidden rounded-sm relative">
                  <img 
                    src={userSelfieUrl} 
                    alt="Selfie Portrait" 
                    className="w-full h-full object-cover grayscale-0 brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 shadow-inner" />
                </div>
                
                <div className="mt-2 text-center">
                  <p className="font-handwritten text-sm text-[#82111d] font-semibold leading-none">Pinka's selfie</p>
                  <p className="font-mono text-[6px] text-gray-400 mt-1 uppercase tracking-widest">FROM PINKA'S CAM!</p>
                </div>
              </div>

              {/* HANDWRITTEN PINK NOTE (Exactly as in Image 3 pink letter block) */}
              <div className="relative w-full max-w-[340px] bg-[#fff7e8] p-5 pt-8 shadow-xl rounded-sm border border-[#ead46b] transform rotate-[3deg] hover:rotate-[-1deg] transition-all duration-500 z-10 mt-12 text-[#6f1728]">
                
                {/* Drawn Ribbon bow decoration on top center */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl drop-shadow-sm select-none">
                  🎀
                </div>

                {/* Hand-drawn content of note */}
                <div className="font-handwritten text-lg sm:text-xl leading-relaxed font-semibold">
                  <p className="mb-2">Dear Reader,</p>
                  <p className="text-sm sm:text-base leading-snug">
                    in the tapestry of our lives, your presence is a rare gem, illuminating the path with moments of warmth and acceptance. thank you for being here! I hope you're always surrounded by love because you really deserve it.
                  </p>
                  <div className="text-right mt-4 text-xs font-serif italic font-bold">
                    XD, Pinka A. Rosebelle
                  </div>
                </div>

                {/* Tiny star stickers */}
                <span className="absolute bottom-2 left-2 text-amber-500 text-xs">⭐</span>
              </div>

              {/* STAMP & DETAILS (Bottom left of Valentines Card canvas) */}
              <div className="w-full flex justify-between items-end mt-12 z-20">
                
                {/* Beautiful Blue Aster Flower Stamp */}
                <div className="bg-white p-1 pb-2 border-2 border-dashed border-gray-300 shadow-md transform -rotate-[15deg] w-14 h-16 flex flex-col justify-between items-center select-none">
                  <div className="w-full h-3/4 bg-[#e8f1f7] rounded-sm overflow-hidden flex items-center justify-center">
                    <span className="text-xl">🌸</span>
                  </div>
                  <span className="text-[5px] font-mono tracking-widest text-indigo-900 font-bold">FRANCE // 3.00</span>
                </div>

                {/* B&W Passport photo of her (or cute cat picture as stamp) */}
                <div className="bg-white p-1.5 pb-4 shadow-lg border border-gray-200 w-16 h-20 transform rotate-[8deg] select-none">
                  <div className="w-full h-full bg-[#111] overflow-hidden">
                    <img 
                      src={userSelfieUrl} 
                      alt="Mini Passport selfie" 
                      className="w-full h-full object-cover grayscale brightness-90 contrast-125"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

              </div>

              {/* FOOTER CALL SIGNATURE (CALL ME IF YOU GET LOST: @eko0.0ff) */}
              <div className="w-full text-center mt-6 pt-3 border-t border-white/10 z-20 select-none">
                <span className="font-typewriter text-[9px] sm:text-xs text-[#f5e7a6] tracking-widest uppercase block">
                  CALL ME IF YOU GET LOST: @eko0.0ff
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
