import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import LearnMap from './components/LearnMap';
import LessonView from './components/LessonView';
import MiniGames from './components/MiniGames';
import UserProfile from './components/UserProfile';
import AccessibilityModal from './components/AccessibilityModal';
import HelpCenter from './components/HelpCenter';
import { useQuestlishStore } from './store/useQuestlishStore.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('learn');
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const { highContrastMode, fontSize, typography, keyboardNav } = useQuestlishStore();
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

  let mainContent;

  if (isLessonActive) {
    mainContent = <LessonView onClose={() => setIsLessonActive(false)} />;
  } else if (currentTab === 'learn') {
    mainContent = <LearnMap onStartLesson={() => setIsLessonActive(true)} />;
  } else if (currentTab === 'minigames') {
    mainContent = <MiniGames />;
  } else if (currentTab === 'profile') {
    mainContent = <UserProfile onContinueLesson={() => setIsLessonActive(true)} />;
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
      {/* Menú Lateral */}
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <TopBar />

        {/* Área Cambiante */}
        <main className={`flex-1 flex flex-col overflow-y-auto ${mainAreaClasses}`}>
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