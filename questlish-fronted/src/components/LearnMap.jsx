import { BookOpen, Volume2, MessageSquare, Briefcase, FileText, Lock, Check } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function LearnMap({ onStartLesson }) {
  const { highContrastMode } = useQuestlishStore();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Current Level Pill Badge */}
      <div className="flex justify-center">
        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full shadow-lg border ${highContrastMode ? 'bg-black border-white/25' : 'bg-[#1d1633] border-violet-500/30'}`}>
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
          <span className="text-xs font-bold tracking-wider text-gray-200">
            LEVEL B1 — INTERMEDIATE
          </span>
        </div>
      </div>

      {/* Completed Theory Section 1 */}
      <div className={`rounded-2xl p-5 flex items-center justify-between border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#151026] border-violet-900/30'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-900/40 flex items-center justify-center text-violet-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider text-violet-400 uppercase bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/40">
                THEORY SECTION
              </span>
              <span className="text-[10px] font-bold text-violet-400 bg-violet-950 px-1.5 py-0.5 rounded">
                B1
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Grammar Essentials</h3>
            <p className="text-xs text-gray-400">Master nouns, verbs, and adjectives in context</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      </div>

      {/* Completed Theory Section 2 */}
      <div className={`rounded-2xl p-5 flex items-center justify-between border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#151026] border-violet-900/30'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-900/40 flex items-center justify-center text-violet-300">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider text-violet-400 uppercase bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/40">
                THEORY SECTION
              </span>
              <span className="text-[10px] font-bold text-violet-400 bg-violet-950 px-1.5 py-0.5 rounded">
                B1
              </span>
            </div>
            <h3 className="font-bold text-white text-base">Letters & Sounds</h3>
            <p className="text-xs text-gray-400">Learn phonetic alphabet and English sounds</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      </div>

      {/* CURRENT LESSON CARD (Active / Highlighted) */}
      <div className={`rounded-3xl p-6 shadow-xl flex items-center justify-between relative overflow-hidden ${highContrastMode ? 'bg-black border border-white/20 shadow-none' : 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-900/30'}`}>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-purple-200 uppercase">
              CURRENT LESSON
            </span>
            <h3 className="font-extrabold text-white text-xl">Daily Conversations</h3>
            <p className="text-xs text-purple-100/80">Continue your learning journey</p>
          </div>
        </div>

        <button
          onClick={onStartLesson}
          className="relative z-10 bg-white hover:bg-gray-100 text-violet-700 font-black px-7 py-3.5 rounded-full text-xs tracking-wider transition-all shadow-md active:scale-95"
        >
          START
        </button>
      </div>

      {/* Unlocked Practice Lesson 1 */}
      <div className={`rounded-2xl p-5 flex items-center justify-between border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#151026] border-violet-900/20'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-950/60 border border-violet-900/30 flex items-center justify-center text-violet-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-200 text-base">Workplace English</h3>
            <p className="text-xs text-gray-400">Ready to start</p>
          </div>
        </div>
        <button className="bg-violet-950/80 hover:bg-violet-900 text-violet-300 font-bold px-5 py-2 rounded-xl text-xs border border-violet-800/40 transition-all">
          Start
        </button>
      </div>

      {/* Unlocked Practice Lesson 2 */}
      <div className={`rounded-2xl p-5 flex items-center justify-between border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#151026] border-violet-900/20'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-950/60 border border-violet-900/30 flex items-center justify-center text-violet-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-200 text-base">Academic Writing</h3>
            <p className="text-xs text-gray-400">Ready to start</p>
          </div>
        </div>
        <button className="bg-violet-950/80 hover:bg-violet-900 text-violet-300 font-bold px-5 py-2 rounded-xl text-xs border border-violet-800/40 transition-all">
          Start
        </button>
      </div>

      {/* Locked Lesson 1 */}
      <div className={`rounded-2xl p-5 flex items-center justify-between opacity-60 border ${highContrastMode ? 'bg-black border-white/10' : 'bg-[#130f21]/60 border-violet-950/20'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-500">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-base">Social Situations</h3>
            <p className="text-xs text-gray-500">Complete previous lessons to unlock</p>
          </div>
        </div>
      </div>

      {/* Locked Lesson 2 */}
      <div className={`rounded-2xl p-5 flex items-center justify-between opacity-60 border ${highContrastMode ? 'bg-black border-white/10' : 'bg-[#130f21]/60 border-violet-950/20'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-500">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-base">Business Communication</h3>
            <p className="text-xs text-gray-500">Complete previous lessons to unlock</p>
          </div>
        </div>
      </div>
    </div>
  );
}