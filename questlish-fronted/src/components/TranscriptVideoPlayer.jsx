import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

let youtubeApiPromise;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

export default function TranscriptVideoPlayer({ video }) {
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const activeLineRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Loading accessible video player.');

  const activeIndex = useMemo(() => {
    let currentIndex = 0;
    video.transcript.forEach((line, index) => {
      if (currentTime >= line.seconds) currentIndex = index;
    });
    return currentIndex;
  }, [currentTime, video.transcript]);

  useEffect(() => {
    let cancelled = false;
    let timer;
    const playerHost = playerHostRef.current;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !playerHost) return;

      const playerElement = document.createElement('div');
      playerHost.replaceChildren(playerElement);
      playerRef.current = new YT.Player(playerElement, {
        videoId: video.youtubeId,
        playerVars: {
          cc_load_policy: 1,
          controls: 1,
          enablejsapi: 1,
          fs: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setPlayerReady(true);
            setStatusMessage('Video player ready. Select a transcript line to jump to that moment.');
            timer = window.setInterval(() => {
              const time = playerRef.current?.getCurrentTime?.();
              if (Number.isFinite(time)) setCurrentTime(time);
            }, 500);
          },
          onError: () => setStatusMessage('The embedded video could not be loaded. Use the YouTube link instead.'),
        },
      });
    });

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      playerHost?.replaceChildren();
    };
  }, [video.youtubeId]);

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeIndex]);

  const seekToLine = (line) => {
    if (!playerReady) {
      setStatusMessage('The video is still loading. Please try again in a moment.');
      return;
    }
    playerRef.current.seekTo(line.seconds, true);
    playerRef.current.playVideo();
    setCurrentTime(line.seconds);
    setStatusMessage(`Playing from ${line.start}. Speaker ${line.speaker}: ${line.text}`);
    window.requestAnimationFrame(() => activeLineRef.current?.focus());
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.8fr)]">
      <section aria-labelledby="video-player-title">
        <h2 id="video-player-title" className="sr-only">{video.fullTitle}</h2>
        <div className="aspect-video overflow-hidden rounded-2xl border border-violet-500/40 bg-black shadow-2xl shadow-violet-950/50">
          <div ref={playerHostRef} className="w-full h-full" />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400">YouTube player · Captions requested by default</p>
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-200"
          >
            Open on YouTube
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-violet-800/50 bg-[#151026] overflow-hidden" aria-labelledby="transcript-title">
        <div className="p-4 border-b border-violet-900/50">
          <h2 id="transcript-title" className="font-bold text-white">Interactive transcript</h2>
          <p className="text-xs text-gray-400 mt-1">Select a line to jump to its timestamp.</p>
        </div>
        <ol className="max-h-[28rem] overflow-y-auto p-2" aria-label="Timestamped video transcript">
          {video.transcript.map((line, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={`${line.seconds}-${line.speaker}`}>
                <button
                  ref={isActive ? activeLineRef : null}
                  type="button"
                  onClick={() => seekToLine(line)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`${line.start}. Speaker ${line.speaker}: ${line.text}`}
                  className={`w-full rounded-xl p-3 text-left grid grid-cols-[4.5rem_1fr] gap-3 transition-colors ${
                    isActive
                      ? 'bg-violet-600 text-white ring-1 ring-violet-300'
                      : 'text-gray-200 hover:bg-violet-950/60'
                  }`}
                >
                  <span className={`text-xs font-mono pt-0.5 ${isActive ? 'text-violet-100' : 'text-violet-300'}`}>
                    {line.start.slice(3)}
                  </span>
                  <span>
                    <span className="font-bold mr-2" aria-hidden="true">{line.speaker}:</span>
                    {line.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{statusMessage}</p>
    </div>
  );
}
