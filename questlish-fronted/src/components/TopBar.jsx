import { Star } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function TopBar() {
  const { highContrastMode } = useQuestlishStore();

  return (
    <header className={`w-full px-6 py-4 flex items-center justify-between border-b ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#110e1b] border-violet-950/40'}`}>
      {/* Level Info */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-violet-900/50 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
          B1
        </div>
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-bold tracking-wider ${highContrastMode ? 'text-zinc-200' : 'text-gray-300'}`}>
            LEVEL B1 — INTERMEDIATE
          </span>
          <div className={`w-36 h-1.5 rounded-full overflow-hidden flex items-center ${highContrastMode ? 'bg-zinc-800' : 'bg-gray-800'}`}>
            <div className={`h-full w-[40%] rounded-full ${highContrastMode ? 'bg-cyan-300' : 'bg-violet-500'}`}></div>
          </div>
        </div>
        <span className={`text-xs font-semibold ml-1 ${highContrastMode ? 'text-zinc-300' : 'text-gray-400'}`}>40%</span>
      </div>

      {/* Stats & User Avatar */}
      <div className="flex items-center gap-6">
        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-amber-400">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 text-gray-600" />
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 bg-violet-950/60 border border-violet-800/40 px-3 py-1.5 rounded-full text-violet-300 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-current text-violet-400" />
          <span>340 XP</span>
        </div>

        {/* User Avatar Button */}
        <div
          className="w-9 h-9 rounded-full bg-purple-600 transition-colors flex items-center justify-center font-bold text-white shadow-md text-xs cursor-default"
          title="Questlish user"
          aria-label="Questlish user avatar"
        >
          AR
        </div>
      </div>
    </header>
  );
}