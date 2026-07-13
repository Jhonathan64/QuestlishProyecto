import { BookOpen, Gamepad2, User, Sliders, HelpCircle, Zap } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function Navbar({ currentTab, setCurrentTab }) {
  const { highContrastMode } = useQuestlishStore();
  const navItems = [
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'minigames', label: 'Mini Games', icon: Gamepad2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accessibility', label: 'Accessibility', icon: Sliders },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

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
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-violet-900/40 text-violet-300 font-semibold border border-violet-500/20'
                  : 'text-gray-400 hover:bg-violet-950/30 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}