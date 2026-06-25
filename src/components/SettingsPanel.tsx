import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Upload, Check, Link2, RefreshCw, AlertCircle, HelpCircle, FileSpreadsheet, Sparkles, LogOut, Trash2 } from 'lucide-react';
import { googleSignIn, logout, fetchDiaryFromSheets, getAccessToken, isFirebaseConfigured } from '../lib/sheetsService';
import { DiaryEntry } from '../types';
import { User } from 'firebase/auth';

interface SettingsPanelProps {
  onProfilePicChange: (newUrl: string) => void;
  currentProfilePic: string;
  onSyncComplete: (syncedEntries: DiaryEntry[]) => void;
  onResetSync: () => void;
  isSynced: boolean;
  spreadsheetId: string;
  setSpreadsheetId: (id: string) => void;
  autoSync: boolean;
  setAutoSync: (enabled: boolean) => void;
}

export default function SettingsPanel({
  onProfilePicChange,
  currentProfilePic,
  onSyncComplete,
  onResetSync,
  isSynced,
  spreadsheetId,
  setSpreadsheetId,
  autoSync,
  setAutoSync
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [picUrl, setPicUrl] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState(() => localStorage.getItem('g_sheets_manual_token') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [showTutorial, setShowTutorial] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync manualToken changes to localStorage
  useEffect(() => {
    localStorage.setItem('g_sheets_manual_token', manualToken);
  }, [manualToken]);

  // Handle local image upload as Base64 so it persists on client side
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onProfilePicChange(reader.result);
          setSyncStatus({ type: 'success', message: '¡Foto de perfil actualizada con éxito!' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (picUrl.trim()) {
      onProfilePicChange(picUrl.trim());
      setPicUrl('');
      setSyncStatus({ type: 'success', message: '¡Enlace de foto de perfil actualizado con éxito!' });
    }
  };

  const handleResetPic = () => {
    localStorage.removeItem('scrapbook_profile_pic');
    onProfilePicChange('/src/assets/images/lol.png');
    setSyncStatus({ type: 'success', message: 'Foto de perfil restablecida al retrato original.' });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setSyncStatus({ type: 'idle', message: '' });
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setSyncStatus({ type: 'success', message: `¡Sesión iniciada como ${res.user.displayName}! Ya puedes sincronizar.` });
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatus({ 
        type: 'error', 
        message: 'No se pudo iniciar sesión automáticamente. No te preocupes, puedes usar la opción de "Token manual" abajo para sincronizar al instante.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    onResetSync();
    setSyncStatus({ type: 'success', message: 'Sesión de Google cerrada y sincronización desactivada.' });
  };

  const handleSync = async () => {
    // Fall back to 'public' mode if no tokens are configured
    const token = manualToken.trim() || accessToken || getAccessToken() || 'public';
    
    if (!spreadsheetId.trim()) {
      setSyncStatus({ type: 'error', message: 'Introduce un ID de Google Sheets válido.' });
      return;
    }

    setIsLoading(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      const entries = await fetchDiaryFromSheets(spreadsheetId.trim(), token);
      if (entries && entries.length > 0) {
        onSyncComplete(entries);
        setSyncStatus({ 
          type: 'success', 
          message: token === 'public'
            ? `¡Sincronizado públicamente! Se cargaron ${entries.length} carpetas y sus elementos dinámicos correctamente sin necesidad de tokens de acceso.`
            : `¡Sincronizado! Se cargaron ${entries.length} carpetas y sus elementos dinámicos correctamente desde tu Google Sheet.` 
        });
      } else {
        setSyncStatus({ type: 'error', message: 'No se encontraron carpetas válidas en tu hoja.' });
      }
    } catch (err: any) {
      setSyncStatus({ 
        type: 'error', 
        message: err.message || 'Error al realizar la sincronización. Verifica tu Google Sheet (ID) y asegúrate de que esté compartida de manera pública.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Settings Panel Floating Gear Button (Retro Leather/Brass Tag Style) */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center select-none">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2 px-3 py-2 rounded-full bg-white/85 dark:bg-[#2a1219]/80 backdrop-blur-md border border-[#ead46b] dark:border-[#6f1728] text-[#6f1728] dark:text-[#f3da72] hover:bg-[#fff7e8] dark:hover:bg-[#3a111a] hover:scale-105 active:scale-95 shadow-md cursor-pointer transition-all duration-300"
          title="Ajustes de mi Bitácora"
        >
          <Settings className="w-4 h-4 animate-spin-slow group-hover:rotate-45 transition-transform" />
          <span className="text-[10px] sm:text-xs font-mono tracking-widest font-semibold uppercase">AJUSTES</span>
          {isSynced && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
        </button>
      </div>

      {/* Slide-over Retro Drawer / Scrapbook Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
          <div 
            className="w-full max-w-lg bg-[#fffdf8] dark:bg-[#160f12] text-[#431826] dark:text-[#fff7e8] h-full shadow-2xl relative overflow-y-auto flex flex-col border-l border-[#ead46b] dark:border-[#6f1728] p-6 sm:p-8 select-none"
          >
            {/* Background Texture overlay */}
            <div className="absolute inset-0 notebook-paper-grid opacity-30 pointer-events-none" />

            {/* Header */}
            <div className="relative flex justify-between items-center pb-4 border-b border-[#ead46b] dark:border-[#6f1728] mb-6 z-10">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-[#6f1728] dark:text-[#f3da72]" />
                <h2 className="font-serif text-xl sm:text-2xl font-bold italic">Ajustes de mi Bitácora</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 space-y-8 z-10 overflow-y-auto pr-1">
              
              {/* SECTION 1: PROFILE PICTURE CONTROLS */}
              <div className="bg-[#fff7e8]/75 dark:bg-neutral-900/40 p-4 rounded-2xl border border-[#eadfce] dark:border-neutral-800 space-y-4">
                <div className="flex items-center space-x-1.5 text-xs font-mono tracking-wider font-semibold text-[#6f1728] dark:text-[#f3da72]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AJUSTES DE TU FOTO DE PERFIL</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Avatar Frame with Polaroid Aspect */}
                  <div className="relative p-2 pb-6 bg-white dark:bg-[#181614] rounded shadow-md w-24 h-32 border border-[#ebdcd0] dark:border-none rotate-[-2deg] flex-shrink-0">
                    <div className="w-full h-full overflow-hidden bg-gray-100">
                      <img 
                        src={currentProfilePic} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Cambia tu foto de perfil de scrapbook cargando una foto o ingresando cualquier enlace web:
                    </p>
                    
                    {/* File Upload Trigger */}
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-[#6f1728] hover:bg-[#431826] text-white text-xs font-mono rounded cursor-pointer shadow transition-all duration-300 w-full"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>SUBIR ARCHIVO</span>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />

                      {/* Reset to default button */}
                      <button
                        onClick={handleResetPic}
                        className="p-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 rounded cursor-pointer transition-colors"
                        title="Restaurar retrato original"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* URL Input Form */}
                    <form onSubmit={handleUrlSubmit} className="flex space-x-1 mt-2">
                      <input
                        type="url"
                        placeholder="Ingresar URL de imagen..."
                        value={picUrl}
                        onChange={(e) => setPicUrl(e.target.value)}
                        className="flex-1 px-3 py-1 bg-white dark:bg-neutral-800 text-xs rounded border border-[#cbd5e1] dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#6f1728] hover:bg-[#431826] text-white text-xs font-mono rounded cursor-pointer"
                      >
                        APLICAR
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* SECTION 2: GOOGLE SHEETS SYNCHRONIZATION */}
              <div className="bg-[#fff7e8]/75 dark:bg-neutral-900/40 p-4 rounded-2xl border border-[#eadfce] dark:border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-mono tracking-wider font-semibold text-[#6f1728] dark:text-[#f3da72]">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>SINCRONIZAR CON GOOGLE SHEETS</span>
                  </div>
                  
                  <button
                    onClick={() => setShowTutorial(!showTutorial)}
                    className="flex items-center space-x-1 text-xs text-[#a64c32] dark:text-[#f3da72] hover:underline cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>¿Cómo se usa?</span>
                  </button>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Carga tus carpetas, proyectos y elementos interactivos dinámicamente desde un archivo en Google Sheets.
                </p>

                {/* Tutorial / Columns info */}
                {showTutorial && (
                  <div className="bg-[#fdfdfc] dark:bg-neutral-950 p-4 rounded-xl border border-dashed border-[#c4af9c] text-xs space-y-3 leading-relaxed text-[#5e4c3a] dark:text-[#beaf9e]">
                    <p className="font-semibold text-amber-800 dark:text-amber-400 text-center font-serif text-[13px]">
                      📔 Plantilla de tu Google Sheet
                    </p>
                    <p>
                      Tu archivo debe contener **dos pestañas** con las siguientes columnas (puedes usar los títulos en español o en inglés):
                    </p>
                    
                    <div className="space-y-2">
                      <p className="font-bold border-b border-gray-200 dark:border-neutral-800 pb-0.5">• Pestaña 1: "Carpetas" (o "Folders")</p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] font-mono">
                        <li><strong>id:</strong> Código único (ej. <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">arte</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">vida</code>)</li>
                        <li><strong>title:</strong> Título elegante principal</li>
                        <li><strong>subtitle:</strong> Subtítulo (ej. "Nº1 | MIS DIBUJOS")</li>
                        <li><strong>date:</strong> Fecha (ej. "15/06/2026")</li>
                        <li><strong>folderName:</strong> Nombre de pestaña (ej. "ARTE")</li>
                        <li><strong>folderTabColor:</strong> Color de la pestaña (ej. "#dfbebe" o clase Tailwind)</li>
                        <li><strong>folderBgColor:</strong> Color de fondo de la hoja</li>
                        <li><strong>folderTextColor:</strong> Color del texto principal</li>
                      </ul>

                      <p className="font-bold border-b border-gray-200 dark:border-neutral-800 pb-0.5 pt-2">• Pestaña 2: "Elementos" (o "Elements")</p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] font-mono">
                        <li><strong>folderId:</strong> ID de la carpeta a la que pertenece (ej. <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">arte</code>)</li>
                        <li><strong>id:</strong> ID único del elemento (opcional)</li>
                        <li><strong>type:</strong> Tipo (<code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">photo</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">handwritten</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">postit</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">tape</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">flower</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">stamp</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">paperclip</code>)</li>
                        <li><strong>content:</strong> Texto de la nota o enlace de imagen</li>
                        <li><strong>title:</strong> Título / Etiqueta del elemento</li>
                        <li><strong>rotation:</strong> Número de rotación (ej. -5 a 5)</li>
                        <li><strong>aspectRatio:</strong> Formato (<code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">aspect-square</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">aspect-[3/4]</code>)</li>
                        <li><strong>extraClass:</strong> Ancho opcional (ej. <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">w-48</code>, <code className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded">w-56</code>)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* GOOGLE OAUTH FLOW */}
                <div className="space-y-3">
                  {!isFirebaseConfigured && (
                    <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl text-[11px] sm:text-xs text-[#854d0e] dark:text-amber-400 leading-normal flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-700 dark:text-amber-500 mt-0.5" />
                      <span>
                        <strong>Entorno de Pruebas:</strong> El inicio de sesión directo con Google requiere configuración de Firebase. No te preocupes, puedes usar la opción de <strong>"Token de Acceso Manual"</strong> abajo para sincronizar al instante de manera fácil y segura.
                      </span>
                    </div>
                  )}

                  {!user ? (
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading || !isFirebaseConfigured}
                      className={`gsi-material-button w-full flex items-center justify-center shadow-md ${!isFirebaseConfigured ? 'opacity-45 cursor-not-allowed filter grayscale' : 'cursor-pointer'}`}
                    >
                      <div className="gsi-material-button-state"></div>
                      <div className="gsi-material-button-content-wrapper">
                        <div className="gsi-material-button-icon">
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                          </svg>
                        </div>
                        <span className="gsi-material-button-contents font-mono tracking-wider">CONECTAR CON GOOGLE</span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex justify-between items-center bg-white/60 dark:bg-neutral-900/60 p-3 rounded-xl border border-amber-800/10">
                      <div className="flex items-center space-x-2">
                        {user.photoURL && (
                          <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                        )}
                        <span className="text-xs font-mono font-bold">{user.displayName}</span>
                      </div>
                      <button
                        onClick={handleGoogleLogout}
                        className="flex items-center space-x-1.5 text-xs text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}

                  {/* SPREADSHEET ID FIELD */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase text-[#5e4c3a] dark:text-[#a09181] tracking-wider font-semibold">
                      ID de tu Google Sheet:
                    </label>
                    <div className="flex space-x-1">
                      <input
                        type="text"
                        placeholder="ej. 1abcDeFgHiJkLmNoPqRsTuVwXyZ"
                        value={spreadsheetId}
                        onChange={(e) => setSpreadsheetId(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-neutral-800 text-xs rounded border border-[#cbd5e1] dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        onClick={handleSync}
                        disabled={isLoading || !spreadsheetId}
                        className="flex items-center space-x-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 disabled:dark:bg-neutral-800 disabled:text-neutral-500 text-white text-xs font-mono rounded cursor-pointer font-bold shadow shadow-emerald-700/20 active:scale-95 transition-all duration-150"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        <span>SINCRONIZAR</span>
                      </button>
                    </div>
                    <p className="text-[9px] text-[#8a7a6c] leading-tight">
                      Encuentra el ID en el enlace de tu hoja de cálculo, entre <code className="bg-[#cbd5e1]/30 px-1 rounded">/d/</code> y <code className="bg-[#cbd5e1]/30 px-1 rounded">/edit</code>.
                    </p>

                    {/* AUTO SYNC TOGGLE */}
                    {spreadsheetId && (
                      <div className="flex items-center space-x-2.5 py-2 px-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mt-2 select-none animate-fade-in">
                        <input
                          id="auto-sync-checkbox"
                          type="checkbox"
                          checked={autoSync}
                          onChange={(e) => setAutoSync(e.target.checked)}
                          className="w-4 h-4 text-amber-700 focus:ring-amber-500 border-amber-500/30 rounded cursor-pointer accent-amber-700"
                        />
                        <label htmlFor="auto-sync-checkbox" className="text-[11px] font-mono font-medium text-amber-900 dark:text-amber-400 cursor-pointer flex items-center space-x-1">
                          <span>🔄 Auto-actualizar al editar mi Sheet (cada 30s)</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* MANUAL ACCESS TOKEN OVERRIDE */}
                  <div className="pt-2 border-t border-[#cbd5e1]/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-mono uppercase text-[#5e4c3a] dark:text-[#a09181] tracking-wider font-semibold">
                        Token de Acceso Manual (Alternativo):
                      </label>
                      {manualToken && (
                        <button
                          onClick={() => setManualToken('')}
                          className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      placeholder="Pega un Google Access Token aquí..."
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-800 text-xs rounded border border-[#cbd5e1] dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                    <p className="text-[9px] text-[#8a7a6c] leading-tight">
                      <strong>¿Por qué esto?</strong> En entornos de prueba embebidos (iFrames), el inicio de sesión con Google emergente puede estar restringido. Puedes generar un token temporal en <a href="https://developers.google.com/oauthplayground/" target="_blank" rel="noreferrer" className="text-amber-800 underline">OAuth Playground</a> (seleccionando la API de Sheets v4) y pegarlo aquí para sincronizar de inmediato sin iniciar sesión.
                    </p>
                  </div>

                  {/* RESET DATA BUTTON IF SYNCED */}
                  {isSynced && (
                    <button
                      onClick={onResetSync}
                      className="w-full py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white rounded text-[11px] font-mono tracking-widest transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>DESACTIVAR SYNC Y USAR DATOS LOCALES</span>
                    </button>
                  )}
                </div>
              </div>

              {/* FEEDBACK STATUS AND ALERTS */}
              {syncStatus.message && (
                <div className={`p-4 rounded-xl flex items-start space-x-2 border text-xs leading-relaxed ${
                  syncStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                    : syncStatus.type === 'error'
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-400'
                }`}>
                  {syncStatus.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : syncStatus.type === 'success' ? (
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />
                  )}
                  <span>{syncStatus.message}</span>
                </div>
              )}

            </div>

            {/* Footer Signatures */}
            <div className="pt-4 border-t border-[#cbd5e1]/40 dark:border-neutral-800 text-center text-[10px] font-mono tracking-widest text-[#a09181]">
              SCRAPBOOK ORGANIZER v1.0 • @eko0.0ff
            </div>
          </div>
        </div>
      )}
    </>
  );
}
