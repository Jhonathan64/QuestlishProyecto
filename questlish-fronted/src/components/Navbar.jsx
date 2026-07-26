import { useRef } from 'react';
import { BookOpen, Gamepad2, User, Sliders, HelpCircle, Zap } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function Navbar({ currentTab, setCurrentTab }) {
  const { highContrastMode } = useQuestlishStore();
  const buttonRefs = useRef([]);
  const navItems = [
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'minigames', label: 'Mini Games', icon: Gamepad2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accessibility', label: 'Accessibility', icon: Sliders },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const handleNavigationKey = (event, index) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      buttonRefs.current[(index + direction + navItems.length) % navItems.length]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      buttonRefs.current[event.key === 'Home' ? 0 : navItems.length - 1]?.focus();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      document.getElementById('main-content')?.focus();
    }
  };

  return (
    <aside className={`w-full md:w-64 p-5 flex flex-col min-h-screen border-r ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#110e1b] border-violet-950/40'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <h1 className="text-xl font-bold tracking-wide text-white">
          Questlish
        </h1>
      </div>

      {/* Navigation List */}
      <nav className="space-y-2" aria-label="Main navigation. Use arrow keys to move quickly between sections.">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              ref={(element) => { buttonRefs.current[index] = element; }}
              id={`nav-${item.id}`}
              data-nav-button
              onClick={() => setCurrentTab(item.id)}
              onKeyDown={(event) => handleNavigationKey(event, index)}
              aria-current={isActive ? 'page' : undefined}
              aria-keyshortcuts={item.id === 'learn' ? 'Control+1 Alt+1' : item.id === 'minigames' ? 'Control+2 Alt+2' : item.id === 'profile' ? 'Control+3 Alt+3' : item.id === 'accessibility' ? 'Control+4 Alt+4' : 'Control+5 Alt+5'}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-violet-900/40 text-violet-300 font-semibold border border-violet-500/20'
                  : 'text-gray-400 hover:bg-violet-950/30 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span>{item.label}</span><span className="sr-only">, keyboard shortcut {item.id === 'learn' ? 'L, Control plus 1' : item.id === 'minigames' ? 'M, Control plus 2' : item.id === 'profile' ? 'P, Control plus 3' : item.id === 'accessibility' ? 'A, Control plus 4' : 'H, Control plus 5'}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
