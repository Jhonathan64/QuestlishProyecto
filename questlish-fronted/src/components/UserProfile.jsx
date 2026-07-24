import { Target, Zap, BookOpen, Flame, Trophy, Flame as FireIcon, Check } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function UserProfile({ onContinueLesson }) {
  const { highContrastMode, user, lessons } = useQuestlishStore();
  const completedLessons = lessons.filter((lesson) => lesson.status === 'completed').length;
  // Datos del usuario (se pueden conectar con Zustand o Props)
  const userData = {
    name: user.name,
    role: 'Learner · Questlish',
    initials: user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
    level: user.currentLevel,
    progressPercent: user.progress,
    totalXp: user.totalXp,
    lessonsCompleted: `${completedLessons}/${lessons.length}`,
    streakDays: user.streakDays,
  };

  const achievements = [
    {
      id: 1,
      title: 'First Lesson',
      description: 'Complete your first lesson',
      icon: Trophy,
      completed: completedLessons >= 1,
      iconColor: 'text-amber-400',
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: '7-day streak achieved',
      icon: FireIcon,
      completed: user.streakDays >= 7,
      iconColor: 'text-orange-500',
    },
    {
      id: 3,
      title: 'B1 Champion',
      description: 'Complete B1 level',
      icon: Target,
      completed: false,
      iconColor: 'text-violet-400',
    },
  ];

  return (
    <div className={`max-w-5xl mx-auto py-8 px-6 space-y-6 ${highContrastMode ? 'text-white' : ''}`}>
      {/* 1. Banner Header de Perfil */}
      <div className={`w-full rounded-3xl p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden ${highContrastMode ? 'bg-black border border-white/20 shadow-none' : 'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700'}`}>
        {/* Avatar */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black text-2xl md:text-3xl shrink-0 shadow-lg">
          {userData.initials}
        </div>

        {/* Info del usuario */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {userData.name}
          </h1>
          <p className="text-sm font-medium text-violet-100/80">
            {userData.role}
          </p>

          <div className="pt-2 flex justify-center sm:justify-start">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {userData.level} Intermediate — {userData.progressPercent}% complete
            </span>
          </div>
        </div>
      </div>

      {/* 2. Grid de Estadísticas (2x2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current Level */}
        <div className={`rounded-2xl p-5 flex flex-col justify-between hover:border-violet-700/40 transition-all border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#140f24] border-violet-900/30'}`}>
          <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-violet-400 mb-4">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{userData.level}</div>
            <div className="text-xs font-medium text-gray-400">Current Level</div>
          </div>
        </div>

        {/* Total XP */}
        <div className={`rounded-2xl p-5 flex flex-col justify-between hover:border-violet-700/40 transition-all border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#140f24] border-violet-900/30'}`}>
          <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-violet-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{userData.totalXp}</div>
            <div className="text-xs font-medium text-gray-400">Total XP</div>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className={`rounded-2xl p-5 flex flex-col justify-between hover:border-violet-700/40 transition-all border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#140f24] border-violet-900/30'}`}>
          <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-violet-400 mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{userData.lessonsCompleted}</div>
            <div className="text-xs font-medium text-gray-400">Lessons Completed</div>
          </div>
        </div>

        {/* Daily Streak */}
        <div className={`rounded-2xl p-5 flex flex-col justify-between hover:border-violet-700/40 transition-all border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#140f24] border-violet-900/30'}`}>
          <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-orange-400 mb-4">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-2xl font-black text-orange-400">{userData.streakDays}</div>
            <div className="text-xs font-medium text-gray-400">Daily Streak</div>
          </div>
        </div>
      </div>

      {/* 3. Sección Inferior: Achievements & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Logros (Achievements) - Toma 2 columnas */}
        <div className={`lg:col-span-2 rounded-2xl p-6 space-y-4 border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#140f24] border-violet-900/30'}`}>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">Achievements</h2>
          </div>

          <div className="space-y-3">
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-[#1b1433] border-violet-800/40'
                      : 'bg-[#110d1e] border-violet-950/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-800/30 flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </div>
                  </div>

                  {item.completed && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Quick Actions - Toma 1 columna */}
        <div className={`rounded-2xl p-6 flex flex-col justify-between space-y-4 border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#140f24] border-violet-900/30'}`}>
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          </div>

          <button
            onClick={onContinueLesson}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2.5 active:scale-98"
          >
            <BookOpen className="w-4 h-4" />
            <span>Continue Last Lesson</span>
          </button>
        </div>
      </div>
    </div>
  );
}
