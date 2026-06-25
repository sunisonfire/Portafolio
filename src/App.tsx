import React, { useState, useEffect } from 'react';
import { AppView, DiaryEntry } from './types';
import { diaryEntries } from './data/diaryEntries';
import CollageHome from './components/CollageHome';
import FolderGrid from './components/FolderGrid';
import DiaryPage from './components/DiaryPage';
import AboutMe from './components/AboutMe';
import SettingsPanel from './components/SettingsPanel';
import { Moon, Sun } from 'lucide-react';
import { fetchDiaryFromSheets } from './lib/sheetsService';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('collage');
  const [displayView, setDisplayView] = useState<AppView>('collage');
  const [selectedEntryId, setSelectedEntryId] = useState<string>('you');
  
  // Custom Profile Picture State
  const [profilePic, setProfilePic] = useState<string>(() => {
    return localStorage.getItem('scrapbook_profile_pic') || '/src/assets/images/lol.png';
  });

  // Google Sheets Sync States
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const cached = localStorage.getItem('g_sheets_synced_entries');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return diaryEntries;
  });

  const [isSynced, setIsSynced] = useState<boolean>(() => {
    return localStorage.getItem('g_sheets_is_synced') === 'true';
  });

  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem('g_sheets_spreadsheet_id') || '';
  });

  const [autoSync, setAutoSync] = useState<boolean>(() => {
    return localStorage.getItem('g_sheets_auto_sync') === 'true';
  });

  // Persist spreadsheetId changes
  useEffect(() => {
    localStorage.setItem('g_sheets_spreadsheet_id', spreadsheetId);
  }, [spreadsheetId]);

  // Persist autoSync changes
  useEffect(() => {
    localStorage.setItem('g_sheets_auto_sync', autoSync ? 'true' : 'false');
  }, [autoSync]);

  // Background Automatic Sync Effect (polls every 30s)
  useEffect(() => {
    if (!autoSync || !spreadsheetId) return;

    const intervalId = setInterval(async () => {
      try {
        const manualToken = localStorage.getItem('g_sheets_manual_token') || '';
        const token = manualToken.trim() || 'public';
        
        const syncedEntries = await fetchDiaryFromSheets(spreadsheetId.trim(), token);
        if (syncedEntries && syncedEntries.length > 0) {
          setEntries(syncedEntries);
          setIsSynced(true);
          localStorage.setItem('g_sheets_synced_entries', JSON.stringify(syncedEntries));
          localStorage.setItem('g_sheets_is_synced', 'true');
        }
      } catch (err) {
        console.warn('Auto-sync background fetch failed:', err);
      }
    }, 30000); // 30 seconds interval

    return () => clearInterval(intervalId);
  }, [autoSync, spreadsheetId]);

  const handleProfilePicChange = (newUrl: string) => {
    setProfilePic(newUrl);
    localStorage.setItem('scrapbook_profile_pic', newUrl);
  };

  const handleSyncComplete = (syncedEntries: DiaryEntry[]) => {
    setEntries(syncedEntries);
    setIsSynced(true);
    localStorage.setItem('g_sheets_synced_entries', JSON.stringify(syncedEntries));
    localStorage.setItem('g_sheets_is_synced', 'true');
  };

  const handleResetSync = () => {
    setEntries(diaryEntries);
    setIsSynced(false);
    localStorage.removeItem('g_sheets_synced_entries');
    localStorage.setItem('g_sheets_is_synced', 'false');
  };

  // Map over entries to dynamically swap out original profile picture for the custom one
  const getRenderedEntries = () => {
    return entries.map(entry => ({
      ...entry,
      elements: entry.elements.map(el => {
        if (el.content === '/src/assets/images/lol.png') {
          return { ...el, content: profilePic };
        }
        return el;
      })
    }));
  };

  const renderedEntries = getRenderedEntries();

  // Transition States
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionDir, setTransitionDir] = useState<'forward' | 'backward'>('forward');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Default to dark mode if past 7 PM
    const hours = new Date().getHours();
    return hours >= 19 || hours < 7;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Coordinate gorgeous 3D page flip transition
  const triggerTransition = (nextView: AppView, direction: 'forward' | 'backward', entryIdToSelect?: string) => {
    if (isTransitioning) return;

    setTransitionDir(direction);
    setIsTransitioning(true);
    
    // Pre-set entry ID if we are opening a diary page so it is ready during page turn
    if (entryIdToSelect) {
      setSelectedEntryId(entryIdToSelect);
    }

    // Set displayView immediately so we render BOTH pages during transition
    setDisplayView(nextView);

    // End transition after animation time (900ms in CSS)
    setTimeout(() => {
      setCurrentView(nextView);
      setIsTransitioning(false);
    }, 900);
  };

  const activeEntry = renderedEntries.find((e) => e.id === selectedEntryId) || renderedEntries[0];
  const activeEntryIndex = renderedEntries.findIndex((e) => e.id === selectedEntryId);

  // Diary navigation inside the notebook view
  const handlePrevDiaryPage = () => {
    if (activeEntryIndex > 0) {
      const prevEntry = renderedEntries[activeEntryIndex - 1];
      triggerTransition('diary', 'backward', prevEntry.id);
    }
  };

  const handleNextDiaryPage = () => {
    if (activeEntryIndex < renderedEntries.length - 1) {
      const nextEntry = renderedEntries[activeEntryIndex + 1];
      triggerTransition('diary', 'forward', nextEntry.id);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fffdf8] dark:bg-[#160f12] overflow-hidden transition-colors duration-500 font-sans">
      
      {/* GLOBAL FLOOR CONTROLS: Floating Dark Mode Toggle (Vintage Pocket Watch/Locket aesthetic) */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 select-none">
        <button
          id="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-white/85 dark:bg-[#2a1219]/80 backdrop-blur-md border border-[#ead46b] dark:border-[#6f1728] text-[#6f1728] dark:text-[#f3da72] hover:bg-[#fff7e8] dark:hover:bg-[#3a111a] hover:scale-105 active:scale-95 shadow-md cursor-pointer transition-all duration-300 flex items-center justify-center"
          title={darkMode ? "Encender luces (Modo Claro)" : "Apagar luces (Modo Oscuro)"}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-[#f3da72]" />
          ) : (
            <Moon className="w-4 h-4 text-[#431826]" />
          )}
        </button>
      </div>

      {/* 3D PERSPECTIVE ANIMATION STAGE */}
      <div className="perspective-container">
        
        {/* VIEW 1: COLLAGE HOME */}
        {(currentView === 'collage' || (isTransitioning && displayView === 'collage')) && (
          <div 
            id="view-collage-container"
            className={`transition-page h-full ${
              isTransitioning && currentView === 'collage'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-exit'
                  : 'page-flip-backward-exit'
                : isTransitioning && displayView === 'collage'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-enter'
                  : 'page-flip-backward-enter'
                : ''
            }`}
          >
            <CollageHome 
              onOpenFolder={() => triggerTransition('archive', 'forward')} 
              onOpenAboutMe={() => triggerTransition('about_me', 'forward')}
              darkMode={darkMode}
              userSelfieUrl={profilePic}
            />
          </div>
        )}

        {/* VIEW 2: FOLDER STACK CABINET */}
        {(currentView === 'archive' || (isTransitioning && displayView === 'archive')) && (
          <div 
            id="view-archive-container"
            className={`transition-page h-full ${
              isTransitioning && currentView === 'archive'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-exit'
                  : 'page-flip-backward-exit'
                : isTransitioning && displayView === 'archive'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-enter'
                  : 'page-flip-backward-enter'
                : ''
            }`}
          >
            <FolderGrid
              entries={renderedEntries}
              onSelectEntry={(id) => triggerTransition('diary', 'forward', id)}
              onBackToCollage={() => triggerTransition('collage', 'backward')}
            />
          </div>
        )}

        {/* VIEW 3: SCRAPBOOK DIARY PAGE */}
        {(currentView === 'diary' || (isTransitioning && displayView === 'diary')) && (
          <div 
            id="view-diary-container"
            className={`transition-page h-full ${
              isTransitioning && currentView === 'diary'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-exit'
                  : 'page-flip-backward-exit'
                : isTransitioning && displayView === 'diary'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-enter'
                  : 'page-flip-backward-enter'
                : ''
            }`}
          >
            <DiaryPage
              entry={activeEntry}
              onBackToFolders={() => triggerTransition('archive', 'backward')}
              onBackToHome={() => triggerTransition('collage', 'backward')}
              onPrevPage={handlePrevDiaryPage}
              onNextPage={handleNextDiaryPage}
              hasPrev={activeEntryIndex > 0}
              hasNext={activeEntryIndex < renderedEntries.length - 1}
            />
          </div>
        )}

        {/* VIEW 4: ABOUT ME / ¿QUIÉN SOY? */}
        {(currentView === 'about_me' || (isTransitioning && displayView === 'about_me')) && (
          <div 
            id="view-about-me-container"
            className={`transition-page h-full ${
              isTransitioning && currentView === 'about_me'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-exit'
                  : 'page-flip-backward-exit'
                : isTransitioning && displayView === 'about_me'
                ? transitionDir === 'forward'
                  ? 'page-flip-forward-enter'
                  : 'page-flip-backward-enter'
                : ''
            }`}
          >
            <AboutMe
              onBackToHome={() => triggerTransition('collage', 'backward')}
              userSelfieUrl={profilePic}
            />
          </div>
        )}

      </div>

      {/* Settings Control Panel */}
      <SettingsPanel
        currentProfilePic={profilePic}
        onProfilePicChange={handleProfilePicChange}
        onSyncComplete={handleSyncComplete}
        onResetSync={handleResetSync}
        isSynced={isSynced}
        spreadsheetId={spreadsheetId}
        setSpreadsheetId={setSpreadsheetId}
        autoSync={autoSync}
        setAutoSync={setAutoSync}
      />
    </div>
  );
}
