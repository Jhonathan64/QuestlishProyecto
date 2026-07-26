import { Flame, LogOut, Star } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function TopBar() {
  const { user, highContrastMode, logout } = useQuestlishStore();
  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const level = user.currentLevel || 'B1 - INTERMEDIATE';
  return (
    <header className={`w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#110e1b] border-violet-950/40'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 shrink-0 rounded-full bg-violet-900/50 border border-violet-400 flex items-center justify-center text-xs font-bold text-violet-200">{level.slice(0, 2)}</div>
        <div className="hidden sm:block"><span className="text-xs font-bold tracking-wide text-gray-200">LEVEL {level}</span><div className="flex items-center gap-2 mt-1"><div tabIndex="0" className="w-32 h-2 rounded-full bg-gray-800 overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#110e1b]" role="progressbar" aria-label={`Overall progress for level ${level}`} aria-valuenow={user.progress} aria-valuemin="0" aria-valuemax="100" aria-valuetext={`${user.progress} percent complete`}><div className="h-full bg-violet-500 rounded-full" style={{ width: `${user.progress}%` }} /></div><span className="text-xs text-gray-300" aria-hidden="true">{user.progress}%</span></div></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden md:flex items-center gap-1 text-orange-300 text-xs font-bold"><Flame size={17} aria-hidden="true" />{user.streakDays} days</div>
        <div className="flex items-center gap-1.5 bg-violet-950/70 border border-violet-700/50 px-3 py-2 rounded-full text-violet-200 font-bold text-xs"><Star size={15} className="fill-current" aria-hidden="true" />{user.totalXp} XP</div>
        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-xs" title={user.name} aria-label={`${user.name}'s avatar`}>{initials}</div>
        <button onClick={logout} className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-violet-900/40" aria-label="Sign out" title="Sign out"><LogOut size={19} /></button>
      </div>
    </header>
  );
}
