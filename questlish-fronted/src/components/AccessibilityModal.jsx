import { Sparkles, Sun, Type, Keyboard, X } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function AccessibilityModal({ onClose, onApply }) {
  const {
    highContrastMode,
    fontSize,
    typography,
    keyboardNav,
    setHighContrastMode,
    setFontSize,
    setTypography,
    setKeyboardNav,
  } = useQuestlishStore();

  const handleApply = () => {
    if (onApply) {
      onApply({
        darkMode: highContrastMode,
        fontSize,
        typography,
        keyboardNav,
      });
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container / Modal Window */}
      <div className="w-full max-w-md bg-[#130d25] border border-violet-900/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative text-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Accessibility
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility modal"
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-violet-950/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Dark Mode Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-violet-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-white">High Contrast Dark Mode</div>
              <div className="text-xs text-gray-400">{highContrastMode ? 'On' : 'Off'}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHighContrastMode(!highContrastMode)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              highContrastMode ? 'bg-violet-600' : 'bg-violet-950/80 border border-violet-800/40'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                highContrastMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 2. Font Size Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-violet-400 shrink-0" />
            <span className="text-sm font-semibold text-white">Font Size</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFontSize('Default')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                fontSize === 'Default'
                  ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/30'
                  : 'bg-[#18112e] border-violet-950/80 text-gray-300 hover:border-violet-800/50'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setFontSize('Large')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                fontSize === 'Large'
                  ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/30'
                  : 'bg-[#18112e] border-violet-950/80 text-gray-300 hover:border-violet-800/50'
              }`}
            >
              Large (+150%)
            </button>
          </div>
        </div>

        {/* 3. Typography Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-violet-400 shrink-0" />
            <span className="text-sm font-semibold text-white">Typography</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTypography('Default')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                typography === 'Default'
                  ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/30'
                  : 'bg-[#18112e] border-violet-950/80 text-gray-300 hover:border-violet-800/50'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setTypography('OpenDyslexic')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                typography === 'OpenDyslexic'
                  ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/30'
                  : 'bg-[#18112e] border-violet-950/80 text-gray-300 hover:border-violet-800/50'
              }`}
            >
              OpenDyslexic
            </button>
          </div>
        </div>

        {/* 4. Assisted Keyboard Navigation Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3 pr-2">
            <Keyboard className="w-5 h-5 text-violet-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-white">
                Assisted Keyboard Navigation
              </div>
              <div className="text-xs text-gray-400">
                Magnifies focus borders
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setKeyboardNav(!keyboardNav)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
              keyboardNav ? 'bg-violet-600' : 'bg-violet-950/80 border border-violet-800/40'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                keyboardNav ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 5. Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={handleApply}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-violet-600/30 active:scale-98"
          >
            Apply and Close
          </button>
        </div>

      </div>
    </div>
  );
}