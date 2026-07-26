import { ArrowLeft, Captions, Keyboard, Play } from 'lucide-react';
import TranscriptVideoPlayer from './TranscriptVideoPlayer.jsx';
import { VIDEO_PRACTICE } from '../data/videoPractice.js';

export default function VideoConversations({ onClose }) {
  return (
    <main className="flex-1 min-h-screen bg-[#0b0813] text-gray-100" aria-labelledby="video-practice-title">
      <div className="max-w-7xl mx-auto px-5 py-8 md:px-8">
        <button
          type="button"
          onClick={onClose}
          aria-keyshortcuts="Escape"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-950/60 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Mini Games
        </button>

        <header className="my-7 max-w-3xl">
          <p className="text-xs font-extrabold tracking-[0.18em] uppercase text-violet-400">Listening & transcript practice</p>
          <h1 id="video-practice-title" className="mt-2 text-3xl md:text-4xl font-black text-white">
            {VIDEO_PRACTICE.title}
          </h1>
          <p className="mt-3 text-gray-300">{VIDEO_PRACTICE.fullTitle}</p>
        </header>

        <TranscriptVideoPlayer video={VIDEO_PRACTICE} />

        <aside className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Practice accessibility features">
          {[
            [Play, 'Timestamp navigation', 'Choose any transcript line to continue from that exact moment.'],
            [Captions, 'Captions supported', 'YouTube captions are requested automatically when available.'],
            [Keyboard, 'Keyboard accessible', 'Use Tab to reach a line and Enter or Space to play it.'],
          ].map(([Icon, title, description]) => (
            <div key={title} className="rounded-2xl border border-violet-900/50 bg-[#151026] p-4">
              <Icon className="w-5 h-5 text-violet-400" aria-hidden="true" />
              <h2 className="mt-3 font-bold text-white">{title}</h2>
              <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
