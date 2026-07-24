import { Check, Lock, Volume2 } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function LearnMap({ onStartLesson }) {
  const { lessons, user, highContrastMode } = useQuestlishStore();
  return (
    <section className="max-w-3xl w-full mx-auto py-8 px-4 space-y-5" aria-labelledby="learning-path-title">
      <div className="text-center mb-8"><p className="text-xs font-bold tracking-widest text-violet-300">LEVEL {user.currentLevel}</p><h1 id="learning-path-title" className="text-2xl font-black mt-2">Your learning path</h1></div>
      {lessons.length === 0 && <p className="text-center text-gray-300" role="status">We could not load the lessons. Check your connection and try again.</p>}
      {lessons.map((lesson) => {
        const completed = lesson.status === 'completed';
        const current = lesson.status === 'current';
        const Icon = completed ? Check : current ? Volume2 : Lock;
        return <article key={lesson.id} className={`rounded-2xl p-5 flex items-center justify-between gap-4 border ${current ? 'bg-gradient-to-r from-violet-700 to-purple-600 border-violet-400' : highContrastMode ? 'bg-black border-white/25' : 'bg-[#151026] border-violet-900/40'} ${lesson.status === 'locked' ? 'opacity-65' : ''}`}>
          <div className="flex items-center gap-4 min-w-0"><div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-violet-950/60 text-violet-200'}`}><Icon aria-hidden="true" /></div><div><p className="text-[10px] font-bold tracking-widest text-violet-200 uppercase">{completed ? 'Completed' : current ? 'Current lesson' : 'Locked'}</p><h2 className="font-bold text-white">{lesson.title}</h2><p className="text-sm text-gray-300">{lesson.description}</p></div></div>
          {(current || completed) && <button onClick={() => onStartLesson(lesson)} className={`${current ? 'bg-white text-violet-800' : 'bg-violet-800 text-white'} hover:brightness-110 font-bold px-5 py-2.5 rounded-xl text-sm shrink-0`}>{completed ? 'Review' : 'Start'}</button>}
        </article>;
      })}
    </section>
  );
}
