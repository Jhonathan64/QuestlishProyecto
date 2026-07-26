import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import LearnMap from './components/LearnMap';
import LessonView from './components/LessonView';
import MiniGames from './components/MiniGames';
import UserProfile from './components/UserProfile';
import AccessibilityModal from './components/AccessibilityModal';
import HelpCenter from './components/HelpCenter';
import AuthScreen from './components/AuthScreen';
import { useQuestlishStore } from './store/useQuestlishStore.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('learn');
  const [activeLesson, setActiveLesson] = useState(null);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [shortcutMessage, setShortcutMessage] = useState('');
  const { highContrastMode, fontSize, typography, keyboardNav, authStatus, restoreSession } = useQuestlishStore();
  const appShellClasses = highContrastMode ? 'bg-black text-white' : 'bg-[#0b0813] text-gray-100';
  const mainAreaClasses = highContrastMode ? 'bg-black' : 'bg-[#0b0813]';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const accessibilitySettings = {
      highContrastMode,
      fontSize,
      typography,
      keyboardNav,
    };

    window.localStorage.setItem('questlish-accessibility-settings', JSON.stringify(accessibilitySettings));
    document.documentElement.dataset.questlishHighContrast = String(highContrastMode);
    document.documentElement.dataset.questlishKeyboardNav = String(keyboardNav);
  }, [highContrastMode, fontSize, keyboardNav, typography]);

  useEffect(() => { restoreSession(); }, [restoreSession]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (authStatus !== 'authenticated') return;
      const element = event.target;
      const isTyping = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement || element?.isContentEditable;
      if (isTyping) return;

      const shortcuts = {
        '1': 'learn',
        '2': 'minigames',
        '3': 'profile',
        '4': 'accessibility',
        '5': 'help',
      };
      const directShortcuts = {
        KeyL: 'learn',
        KeyM: 'minigames',
        KeyP: 'profile',
        KeyA: 'accessibility',
        KeyH: 'help',
      };
      let tab = (event.ctrlKey || event.altKey) && !activeLesson ? shortcuts[event.key] : null;
      if (!tab && !activeLesson && !showAccessibility && !event.ctrlKey && !event.altKey && !event.metaKey) {
        tab = event.key === '?' ? 'help' : directShortcuts[event.code];
      }
      if (tab) {
        event.preventDefault();
        handleTabChange(tab);
        const label = {
          learn: 'Learn',
          minigames: 'Mini Games',
          profile: 'Profile',
          accessibility: 'Accessibility',
          help: 'Help',
        }[tab];
        setShortcutMessage(`${label} opened.`);
        if (tab !== 'accessibility') {
          window.requestAnimationFrame(() => document.getElementById('main-content')?.focus());
        }
      } else if (event.key === 'Escape') {
        if (showAccessibility) {
          setShowAccessibility(false);
          setShortcutMessage('Accessibility settings closed.');
        } else if (activeLesson) {
          setActiveLesson(null);
          setShortcutMessage('Lesson closed.');
        }
      }
    };
    window.addEventListener('keydown', handleShortcut, true);
    return () => window.removeEventListener('keydown', handleShortcut, true);
  }, [activeLesson, authStatus, currentTab, showAccessibility]);

  if (authStatus === 'checking') {
    return <div className="min-h-screen bg-[#0b0813] text-violet-200 flex items-center justify-center" role="status" aria-live="polite"><span className="w-8 h-8 border-4 border-violet-300/30 border-t-violet-400 rounded-full animate-spin mr-3" aria-hidden="true" />Loading your progress…</div>;
  }
  if (authStatus === 'guest' || authStatus === 'loading') return <AuthScreen />;

  let mainContent;

  if (activeLesson) {
    mainContent = <LessonView lesson={activeLesson} onClose={() => setActiveLesson(null)} />;
  } else if (currentTab === 'learn') {
    mainContent = <LearnMap onStartLesson={setActiveLesson} />;
  } else if (currentTab === 'minigames') {
    mainContent = <MiniGames />;
  } else if (currentTab === 'profile') {
    mainContent = <UserProfile onContinueLesson={() => setCurrentTab('learn')} />;
  } else if (currentTab === 'help') {
    mainContent = <HelpCenter />;
  } else {
    mainContent = (
      <div className="flex items-center justify-center h-full p-8 text-gray-400 font-medium">
        <span className="capitalize">{currentTab}</span> section is coming soon!
      </div>
    );
  }

  const handleTabChange = (tab) => {
    if (tab === 'accessibility') {
      setShowAccessibility(true);
    } else {
      setCurrentTab(tab);
    }
  };

  return (
      <div className={`min-h-screen flex flex-col md:flex-row font-sans overflow-x-hidden ${appShellClasses}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-3 focus:left-3 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg">Skip to main content</a>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{shortcutMessage}</p>
      {/* Menú Lateral */}
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <TopBar />

        {/* Área Cambiante */}
        <main
          id="main-content"
          tabIndex="-1"
          aria-label="Main content"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' && event.target === event.currentTarget) {
              event.preventDefault();
              document.getElementById(`nav-${currentTab}`)?.focus();
            }
          }}
          className={`flex-1 flex flex-col overflow-y-auto ${mainAreaClasses}`}
        >
          {mainContent}
        </main>
      </div>

      {/* Modal de Accesibilidad */}
      {showAccessibility && (
        <AccessibilityModal
          onClose={() => setShowAccessibility(false)}
          onApply={() => setShowAccessibility(false)}
        />
      )}
    </div>
  );
}
