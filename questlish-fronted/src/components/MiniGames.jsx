import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  Play,
  Zap,
  Puzzle,
  Clock,
  Target,
  RefreshCw,
  AudioWaveform,
  X,
  Star,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';
import { fetchMiniGames, verifyAnswer } from '../services/minigameService.js';

const CATEGORY_ORDER = ['Grammar', 'Vocabulary', 'Pronunciation'];

const FILTER_CATEGORIES = [
  { id: 'All', label: 'All', icon: Zap },
  { id: 'Grammar', label: 'Grammar', icon: BookOpen },
  { id: 'Vocabulary', label: 'Vocabulary', icon: BookOpen },
  { id: 'Pronunciation', label: 'Pronunciation', icon: Volume2 },
];

const ICON_MAP = {
  Zap,
  Puzzle,
  Clock,
  Target,
  RefreshCw,
  AudioWaveform,
  BookOpen,
  Volume2,
};

const FALLBACK_GAMES = [
  {
    id: 'grammar-ninja',
    title: 'Grammar Ninja',
    description: 'Choose the correct tense for a university project update.',
    category: 'Grammar',
    level: 'B1',
    plays: '1.2k plays',
    tag: 'HOT',
    icon: 'Zap',
    iconBg: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400',
    exercise: {
      instruction: 'Select the correct word to complete the sentence.',
      prompt: 'Our research team _____ the survey results during the presentation.',
      correctTokenIndex: 0,
      tokens: [
        {
          id: 'gn-1',
          word: 'has reviewed',
          explanation:
            'Correct. Present perfect works because the action is recent and relevant to the presentation now.',
        },
        {
          id: 'gn-2',
          word: 'reviewed',
          explanation:
            'Incorrect. Simple past is possible for finished actions, but the sentence focuses on the current result.',
        },
        {
          id: 'gn-3',
          word: 'is reviewing',
          explanation:
            'Incorrect. The present continuous does not fit a completed action during the presentation.',
        },
        {
          id: 'gn-4',
          word: 'reviews',
          explanation:
            'Incorrect. The third-person singular form does not match the subject “Our research team”.',
        },
      ],
    },
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    description: 'Build clear academic sentences for class discussions.',
    category: 'Grammar',
    level: 'B1',
    plays: '980 plays',
    tag: 'NEW',
    icon: 'Puzzle',
    iconBg: 'bg-sky-950/60 border-sky-500/30 text-sky-400',
    exercise: {
      instruction: 'Choose the best option to complete the sentence.',
      prompt: 'During the seminar, the professor asked us to _____ our ideas clearly.',
      correctTokenIndex: 1,
      tokens: [
        {
          id: 'sb-1',
          word: 'presenting',
          explanation:
            'Incorrect. After “asked us to,” the base form of the verb is required.',
        },
        {
          id: 'sb-2',
          word: 'present',
          explanation:
            'Correct. The base verb follows “asked us to” and fits the academic context naturally.',
        },
        {
          id: 'sb-3',
          word: 'presented',
          explanation:
            'Incorrect. Past tense is not used after “asked us to” in this structure.',
        },
        {
          id: 'sb-4',
          word: 'to present',
          explanation:
            'Incorrect. The infinitive marker is already included in “asked us to”.',
        },
      ],
    },
  },
  {
    id: 'tense-master',
    title: 'Tense Master',
    description: 'Practice future perfect with deadlines and presentations.',
    category: 'Grammar',
    level: 'B1',
    plays: '760 plays',
    tag: 'HOT',
    icon: 'Clock',
    iconBg: 'bg-violet-950/60 border-violet-500/30 text-violet-300',
    exercise: {
      instruction: 'Pick the correct tense for the context.',
      prompt: 'By the time the thesis defense starts, I _____ all my slides.',
      correctTokenIndex: 0,
      tokens: [
        {
          id: 'tm-1',
          word: 'will have finished',
          explanation:
            'Correct. Future perfect shows that the work will be completed before a future point.',
        },
        {
          id: 'tm-2',
          word: 'finish',
          explanation:
            'Incorrect. The base form does not express completion before a future deadline.',
        },
        {
          id: 'tm-3',
          word: 'have finished',
          explanation:
            'Incorrect. The sentence needs the full future perfect form with “will”.',
        },
        {
          id: 'tm-4',
          word: 'finished',
          explanation:
            'Incorrect. The past participle alone does not show the future timing.',
        },
      ],
    },
  },
  {
    id: 'word-match-adventure',
    title: 'Word Match Adventure',
    description: 'Match university words with their meanings in context.',
    category: 'Vocabulary',
    level: 'B1',
    plays: '1.5k plays',
    tag: 'TOP',
    icon: 'Target',
    iconBg: 'bg-amber-950/60 border-amber-500/30 text-amber-400',
    exercise: {
      instruction: 'Choose the word that matches the definition.',
      prompt: 'A student who studies data and writes reports for a project is a _____.',
      correctTokenIndex: 2,
      tokens: [
        {
          id: 'wma-1',
          word: 'tourist',
          explanation:
            'Incorrect. A tourist visits a place for leisure, not for academic work.',
        },
        {
          id: 'wma-2',
          word: 'speaker',
          explanation:
            'Incorrect. A speaker gives a talk, but that does not describe the student’s role here.',
        },
        {
          id: 'wma-3',
          word: 'researcher',
          explanation:
            'Correct. A researcher studies information and writes reports in academic contexts.',
        },
        {
          id: 'wma-4',
          word: 'roommate',
          explanation:
            'Incorrect. A roommate shares a room, not the academic task described.',
        },
      ],
    },
  },
  {
    id: 'synonym-challenge',
    title: 'Synonym Challenge',
    description: 'Find the best synonym for academic and classroom language.',
    category: 'Vocabulary',
    level: 'B1',
    plays: '2.1k plays',
    tag: 'HOT',
    icon: 'RefreshCw',
    iconBg: 'bg-fuchsia-950/60 border-fuchsia-500/30 text-fuchsia-300',
    exercise: {
      instruction: 'Choose the word closest in meaning.',
      prompt: 'In a presentation, “important” is closest in meaning to _____.',
      correctTokenIndex: 0,
      tokens: [
        {
          id: 'sc-1',
          word: 'significant',
          explanation:
            'Correct. “Significant” is a strong synonym for “important” in academic speech and writing.',
        },
        {
          id: 'sc-2',
          word: 'quiet',
          explanation:
            'Incorrect. This word describes sound level, not importance.',
        },
        {
          id: 'sc-3',
          word: 'basic',
          explanation:
            'Incorrect. “Basic” means simple or elementary, which is not the same as “important”.',
        },
        {
          id: 'sc-4',
          word: 'temporary',
          explanation:
            'Incorrect. “Temporary” refers to duration, not importance.',
        },
      ],
    },
  },
  {
    id: 'sound-quest',
    title: 'Sound Quest',
    description: 'Listen for word stress in university vocabulary.',
    category: 'Pronunciation',
    level: 'B1',
    plays: '640 plays',
    tag: 'NEW',
    icon: 'AudioWaveform',
    iconBg: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300',
    exercise: {
      instruction: 'Choose the word with stress on the second syllable.',
      prompt: 'Which word has the stress on the second syllable?',
      correctTokenIndex: 1,
      tokens: [
        {
          id: 'sq-1',
          word: 'campus',
          explanation:
            'Incorrect. The stress is on the first syllable: CAM-pus.',
        },
        {
          id: 'sq-2',
          word: 'report',
          explanation:
            'Correct. The stress falls on the second syllable: re-PORT.',
        },
        {
          id: 'sq-3',
          word: 'lecture',
          explanation:
            'Incorrect. The stress is on the first syllable: LEC-ture.',
        },
        {
          id: 'sq-4',
          word: 'project',
          explanation:
            'Incorrect. In the noun form, the stress is on the first syllable: PRO-ject.',
        },
      ],
    },
  },
];

const DEFAULT_THEME = {
  page: 'bg-[#0b0813] text-white',
  topShell: 'bg-[#110e1b] border-violet-950/40',
  panel: 'bg-[#140f24] border-violet-900/30',
  panelHover: 'hover:border-violet-700/50 hover:shadow-xl hover:shadow-violet-950/40',
  subPanel: 'bg-[#1e1735] border-violet-900/40 text-gray-200 hover:bg-violet-900/40 hover:border-violet-700/50',
  input: 'bg-[#140f24] border-violet-900/30 text-gray-200 placeholder-gray-500 focus:border-violet-600/60',
  text: 'text-white',
  muted: 'text-gray-400',
  subtle: 'text-gray-500',
  accent: 'text-violet-400',
  accentSoft: 'text-violet-300',
  primaryButton: 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30',
  primaryButtonDisabled: 'bg-violet-950/30 text-gray-500 border border-violet-900/20 cursor-not-allowed opacity-50',
  selectedAnswer: 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/50 scale-105 font-bold',
  successPanel: 'bg-[#0d1e1c]/90 border-emerald-500/50',
  dangerPanel: 'bg-[#200f18]/90 border-rose-500/50',
  iconButton: 'bg-violet-950/60 border-violet-800/30 text-violet-400 hover:bg-violet-900/50',
  outline: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0813]',
  tabActive: 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30',
  tabInactive: 'bg-[#140f24] border-violet-950/60 text-gray-400 hover:text-gray-200 hover:border-violet-800/40',
  tag: 'bg-violet-950/80 text-violet-300 border-violet-800/40',
  bodyText: 'text-gray-300',
  noResults: 'bg-[#140f24] border-violet-900/30 text-gray-200',
  ringOffset: 'focus-visible:ring-offset-[#140f24]',
};

const HIGH_CONTRAST_THEME = {
  page: 'bg-black text-white',
  topShell: 'bg-black border-white/25',
  panel: 'bg-[#050505] border-white/35',
  panelHover: 'hover:border-white/60 hover:shadow-none',
  subPanel: 'bg-[#0b0b0b] border-white/35 text-white hover:bg-[#111] hover:border-white/60',
  input: 'bg-[#050505] border-white/35 text-white placeholder-zinc-300 focus:border-cyan-300',
  text: 'text-white',
  muted: 'text-zinc-200',
  subtle: 'text-zinc-300',
  accent: 'text-cyan-300',
  accentSoft: 'text-cyan-200',
  primaryButton: 'bg-white hover:bg-cyan-200 text-black shadow-none',
  primaryButtonDisabled: 'bg-zinc-900 text-zinc-400 border border-zinc-700 cursor-not-allowed opacity-70',
  selectedAnswer: 'bg-cyan-300 border-cyan-200 text-black shadow-none scale-105 font-bold',
  successPanel: 'bg-[#04110d] border-emerald-300/60',
  dangerPanel: 'bg-[#120509] border-rose-300/60',
  iconButton: 'bg-[#050505] border-white/35 text-cyan-200 hover:bg-[#111] hover:border-white/60',
  outline: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  tabActive: 'bg-white border-white text-black shadow-none',
  tabInactive: 'bg-[#050505] border-white/35 text-zinc-200 hover:text-white hover:border-white/60',
  tag: 'bg-black text-cyan-200 border-cyan-300/50',
  bodyText: 'text-zinc-200',
  noResults: 'bg-[#050505] border-white/35 text-white',
  ringOffset: 'focus-visible:ring-offset-black',
};

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

const normalizeChoice = (choice, index) => {
  if (typeof choice === 'string') {
    return {
      id: `choice-${index}`,
      word: choice,
      text: choice,
      label: choice,
      explanation: '',
    };
  }

  return {
    id: choice?.id || `choice-${index}`,
    word: choice?.word || choice?.text || choice?.label || '',
    text: choice?.text || choice?.word || choice?.label || '',
    label: choice?.label || choice?.word || choice?.text || '',
    explanation: choice?.explanation || choice?.feedback || '',
  };
};

const normalizeChoiceList = (rawChoices) =>
  Array.isArray(rawChoices) ? rawChoices.map((choice, index) => normalizeChoice(choice, index)) : [];

const normalizeExercise = (rawExercise = {}, rawGame = {}) => {
  const sourceExercise = rawExercise || {};
  const instruction =
    sourceExercise.instruction ||
    sourceExercise.direction ||
    sourceExercise.instructions ||
    'Select the correct answer.';

  const prompt =
    sourceExercise.prompt ||
    sourceExercise.question ||
    sourceExercise.statement ||
    sourceExercise.text ||
    '';

  const rawChoices =
    sourceExercise.tokens ||
    sourceExercise.options ||
    sourceExercise.choices ||
    sourceExercise.answers ||
    [];

  const choices = normalizeChoiceList(rawChoices);
  const correctTokenIndex =
    sourceExercise.correctTokenIndex ??
    sourceExercise.correctOptionIndex ??
    sourceExercise.correctAnswerIndex ??
    0;

  return {
    instruction,
    prompt,
    question: prompt,
    correctTokenIndex,
    correctOptionIndex: correctTokenIndex,
    tokens: choices,
    options: choices,
    choices,
    raw: sourceExercise,
    sourceGameId: rawGame?.id,
  };
};

const normalizeGame = (game, source = 'backend') => {
  const rawExercise = game?.exercise || game || {};
  const tokensSource =
    rawExercise.tokens ||
    rawExercise.options ||
    rawExercise.choices ||
    rawExercise.answers ||
    game?.tokens ||
    [];

  const tokens = normalizeChoiceList(tokensSource);

  return {
    id: game?.id,
    title: game?.title || 'Untitled game',
    description: game?.description || '',
    category: game?.category || 'Grammar',
    level: game?.level || 'B1',
    plays: game?.plays || game?.plays_count || game?.playsCount || '1.2k plays',
    tag: game?.tag || 'HOT',
    icon: game?.icon || 'Zap',
    iconBg: game?.iconBg || 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400',
    source,
    exercise: normalizeExercise(
      {
        ...rawExercise,
        instruction: rawExercise?.instruction || rawExercise?.direction || rawExercise?.instructions || game?.instruction,
        prompt: rawExercise?.prompt || rawExercise?.question || rawExercise?.statement || rawExercise?.text || game?.prompt,
        question: rawExercise?.question || rawExercise?.prompt || rawExercise?.statement || rawExercise?.text || game?.question,
        tokens,
        options: tokens,
        choices: tokens,
        correctTokenIndex:
          rawExercise?.correctTokenIndex ??
          rawExercise?.correctOptionIndex ??
          rawExercise?.correctAnswerIndex ??
          game?.correctTokenIndex ??
          game?.correct_token_index ??
          0,
      },
      game
    ),
  };
};

const groupGamesByCategory = (games) => {
  const categoryMap = new Map();

  CATEGORY_ORDER.forEach((category) => {
    categoryMap.set(category, { category, games: [] });
  });

  games.forEach((game) => {
    const category = CATEGORY_ORDER.includes(game.category) ? game.category : 'Grammar';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, { category, games: [] });
    }
    categoryMap.get(category).games.push(game);
  });

  return Array.from(categoryMap.values()).filter((section) => section.games.length > 0);
};

const mergeGames = (fallbackGames, backendGames) => {
  const fallbackById = new Map(fallbackGames.map((game) => [game.id, game]));
  const mergedGames = [];

  backendGames.forEach((backendGame) => {
    const fallbackGame = fallbackById.get(backendGame.id);

    if (!fallbackGame) {
      mergedGames.push(backendGame);
      return;
    }

    const backendTokens = backendGame.exercise?.tokens || [];
    const fallbackTokens = fallbackGame.exercise?.tokens || [];
    const mergedExercise = {
      ...backendGame.exercise,
      ...fallbackGame.exercise,
      tokens: fallbackTokens.length > 0 ? fallbackTokens : backendTokens,
      instruction: fallbackGame.exercise?.instruction || backendGame.exercise?.instruction,
      prompt: fallbackGame.exercise?.prompt || backendGame.exercise?.prompt,
      correctTokenIndex:
        typeof fallbackGame.exercise?.correctTokenIndex === 'number'
          ? fallbackGame.exercise.correctTokenIndex
          : backendGame.exercise?.correctTokenIndex ?? 0,
    };

    mergedGames.push({
      ...fallbackGame,
      ...backendGame,
      title: fallbackGame.title || backendGame.title,
      description: fallbackGame.description || backendGame.description,
      category: backendGame.category || fallbackGame.category,
      level: backendGame.level || fallbackGame.level,
      plays: backendGame.plays || fallbackGame.plays,
      tag: backendGame.tag || fallbackGame.tag,
      icon: backendGame.icon || fallbackGame.icon,
      iconBg: backendGame.iconBg || fallbackGame.iconBg,
      exercise: mergedExercise,
      source: backendGame.source || 'backend',
    });
  });

  fallbackGames.forEach((fallbackGame) => {
    const alreadyIncluded = mergedGames.some((game) => game.id === fallbackGame.id);
    if (!alreadyIncluded) {
      mergedGames.push(fallbackGame);
    }
  });

  return mergedGames;
};

const buildSearchableText = (game) =>
  [
    game.title,
    game.description,
    game.category,
    game.exercise?.prompt,
    game.exercise?.tokens?.map((token) => token.word).join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export default function MiniGames() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [backendGames, setBackendGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [status, setStatus] = useState('idle');
  const [apiFeedback, setApiFeedback] = useState(null);
  const [liveMessage, setLiveMessage] = useState('');

  const { decrementHeart, addXp, highContrastMode, toggleHighContrastMode } = useQuestlishStore();

  const theme = highContrastMode ? HIGH_CONTRAST_THEME : DEFAULT_THEME;

  useEffect(() => {
    let isMounted = true;

    const loadBackendGames = async () => {
      try {
        const data = await fetchMiniGames();

        if (!isMounted) return;

        const normalizedGames = Array.isArray(data)
          ? data.map((game) => normalizeGame(game, 'backend'))
          : [];

        setBackendGames(normalizedGames);
      } catch (error) {
        console.error('Error al obtener minijuegos:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBackendGames();

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackCatalog = useMemo(
    () => FALLBACK_GAMES.map((game) => normalizeGame(game, 'fallback')),
    []
  );

  const fallbackGameMap = useMemo(
    () => new Map(fallbackCatalog.map((game) => [game.id, game])),
    [fallbackCatalog]
  );

  const catalogGames = useMemo(
    () => mergeGames(fallbackCatalog, backendGames),
    [backendGames, fallbackCatalog]
  );

  const canonicalGame = (game) => fallbackGameMap.get(game.id) || game;

  const currentGame = activeGame ? canonicalGame(activeGame) : null;

  const filteredData = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return groupGamesByCategory(catalogGames)
      .map((cat) => {
        if (activeCategory !== 'All' && cat.category !== activeCategory) {
          return null;
        }

        const filteredGames = cat.games.filter((game) => {
          const searchableText = buildSearchableText(game);
          return normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);
        });

        return filteredGames.length > 0 ? { ...cat, games: filteredGames } : null;
      })
      .filter(Boolean);
  }, [activeCategory, catalogGames, searchQuery]);

  const visibleGameCount = filteredData.reduce((count, section) => count + section.games.length, 0);

  useEffect(() => {
    if (loading) return;

    if (searchQuery.trim() && visibleGameCount === 0) {
      setLiveMessage(`No games match ${searchQuery.trim()}.`);
      return;
    }

    if (visibleGameCount > 0) {
      setLiveMessage(`${visibleGameCount} games available.`);
    }
  }, [loading, searchQuery, visibleGameCount]);

  const handleToggleContrast = () => {
    toggleHighContrastMode();
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setLiveMessage(`Category filtered to ${category}.`);
  };

  const handleStartGame = (game) => {
    setActiveGame(canonicalGame(game));
    setSelectedIndex(null);
    setStatus('idle');
    setApiFeedback(null);
    setLiveMessage(`Opened ${game.title}.`);
  };

  const handleCloseGame = () => {
    setActiveGame(null);
    setSelectedIndex(null);
    setStatus('idle');
    setApiFeedback(null);
    setLiveMessage('Returned to the mini games catalog.');
  };

  const handleSelectWord = (index) => {
    if (status === 'idle') {
      setSelectedIndex(index);
    }
  };

  const playPromptAudio = () => {
    if (!activeGame) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setLiveMessage('Audio playback is not available in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${activeGame.title}. ${activeGame.exercise.instruction}. ${activeGame.exercise.prompt}`
    );
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setLiveMessage('Audio prompt finished playing.');
    window.speechSynthesis.speak(utterance);
    setLiveMessage('Playing audio prompt.');
  };

  const resolveLocalResult = () => {
    if (!currentGame) return null;

    const correctIndex = currentGame.exercise.correctTokenIndex ?? 0;
    const selectedToken = currentGame.exercise.tokens[selectedIndex];
    const correctToken = currentGame.exercise.tokens[correctIndex];
    const isCorrect = selectedIndex === correctIndex;

    return {
      isCorrect,
      explanation: isCorrect
        ? selectedToken?.explanation || currentGame.description
        : selectedToken?.explanation || correctToken?.explanation || currentGame.description,
      xpEarned: isCorrect ? 15 : 0,
    };
  };

  const handleCheckAnswer = async () => {
    if (selectedIndex === null || !currentGame) return;

    try {
      const shouldUseBackend = currentGame.source === 'backend' && !fallbackGameMap.has(currentGame.id);
      const response = shouldUseBackend ? await verifyAnswer(currentGame.id, selectedIndex) : resolveLocalResult();
      const finalResponse = response || resolveLocalResult();

      setApiFeedback(finalResponse);

      if (finalResponse.isCorrect) {
        setStatus('correct');
        addXp(finalResponse.xpEarned || 15);
        setLiveMessage(`Correct answer. ${finalResponse.explanation}`);
      } else {
        setStatus('incorrect');
        decrementHeart();
        setLiveMessage(`Incorrect answer. ${finalResponse.explanation}`);
      }
    } catch (error) {
      console.error('Error al verificar la respuesta:', error);
      const fallbackResponse = resolveLocalResult();

      if (!fallbackResponse) return;

      setApiFeedback(fallbackResponse);

      if (fallbackResponse.isCorrect) {
        setStatus('correct');
        addXp(fallbackResponse.xpEarned || 15);
        setLiveMessage(`Correct answer. ${fallbackResponse.explanation}`);
      } else {
        setStatus('incorrect');
        decrementHeart();
        setLiveMessage(`Incorrect answer. ${fallbackResponse.explanation}`);
      }
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setSelectedIndex(null);
    setApiFeedback(null);
    setLiveMessage('Try the activity again.');
  };

  if (loading) {
    return (
      <main className={joinClasses('flex-1 min-h-screen', theme.page)} aria-busy="true" aria-label="Mini games loading state">
        <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
          <div className="space-y-3">
            <div className="h-9 w-56 rounded-2xl bg-white/10 animate-pulse" />
            <div className="h-4 w-72 rounded-full bg-white/10 animate-pulse" />
          </div>

          <div className="relative">
            <div className="h-12 rounded-2xl bg-white/10 animate-pulse" />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {FILTER_CATEGORIES.map((item) => (
              <div key={item.id} className="h-10 w-24 rounded-full bg-white/10 animate-pulse shrink-0" />
            ))}
          </div>

          <div className="space-y-8">
            {CATEGORY_ORDER.map((category) => (
              <section key={category} className="space-y-4" aria-label={`${category} games skeleton`}>
                <div className="flex items-center justify-between">
                  <div className="h-6 w-40 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-5 w-14 rounded-full bg-white/10 animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={`${category}-${index}`} className={joinClasses('rounded-2xl p-5 flex flex-col justify-between border animate-pulse', theme.panel)}>
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="h-12 w-12 rounded-xl bg-white/10" />
                          <div className="space-y-2 items-end flex flex-col">
                            <div className="h-4 w-16 rounded-full bg-white/10" />
                            <div className="h-3 w-20 rounded-full bg-white/10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-5 w-40 rounded-full bg-white/10" />
                          <div className="h-3 w-full rounded-full bg-white/10" />
                          <div className="h-3 w-5/6 rounded-full bg-white/10" />
                        </div>
                      </div>
                      <div className="mt-6 pt-2 border-t border-white/10 flex items-center justify-between">
                        <div className="h-3 w-10 rounded-full bg-white/10" />
                        <div className="h-9 w-20 rounded-xl bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (activeGame) {
    const exercise = currentGame.exercise;
    const selectedToken = selectedIndex !== null ? exercise.tokens[selectedIndex] : null;
    const correctToken = exercise.tokens[exercise.correctTokenIndex] || null;
    const resultExplanation =
      apiFeedback?.explanation || selectedToken?.explanation || correctToken?.explanation || currentGame.description;

    return (
      <main className={joinClasses('flex-1 flex flex-col min-h-full', theme.page)} aria-label="Mini game activity">
        <div className={joinClasses('px-8 py-3 flex items-center justify-between border-b', theme.topShell)}>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCloseGame}
              aria-label="Close activity"
              className={joinClasses('transition-colors p-1', theme.accent, theme.outline)}
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-violet-300">{currentGame.title}</span>
            <button
              type="button"
              onClick={handleToggleContrast}
              aria-label={highContrastMode ? 'Disable high contrast mode' : 'Enable high contrast mode'}
              aria-pressed={highContrastMode}
              className={joinClasses('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all', theme.iconButton, theme.outline)}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{highContrastMode ? 'High Contrast On' : 'High Contrast'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 text-violet-950/80 fill-violet-950/60" />
            <Star className="w-4 h-4 text-violet-950/80 fill-violet-950/60" />
          </div>
        </div>

        <section className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center items-center" aria-labelledby="mini-game-title" role="tabpanel" id="mini-games-panel">
          <div className={joinClasses('w-full border rounded-3xl p-8 md:p-10 shadow-2xl relative flex flex-col items-center', theme.panel)}>
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold tracking-widest text-violet-400 uppercase">
                {exercise.instruction}
              </span>
              <button
                type="button"
                onClick={playPromptAudio}
                aria-label="Listen audio"
                className={joinClasses('w-10 h-10 rounded-xl border flex items-center justify-center transition-all', theme.iconButton, theme.outline)}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <h2 id="mini-game-title" className="w-full text-xl md:text-2xl font-bold text-white mb-8 leading-snug text-left">
              {exercise.prompt}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 w-full">
              {exercise.tokens.map((token, idx) => {
                const isSelected = selectedIndex === idx;
                const isCorrectWord = status === 'correct' && isSelected;
                const isIncorrectWord = status === 'incorrect' && isSelected;

                let buttonStyles = joinClasses(theme.subPanel, theme.ringOffset);

                if (status === 'idle' && isSelected) {
                  buttonStyles = joinClasses(theme.selectedAnswer, theme.ringOffset);
                } else if (isCorrectWord) {
                  buttonStyles = joinClasses('bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/40 font-bold scale-105', theme.ringOffset);
                } else if (isIncorrectWord) {
                  buttonStyles = joinClasses('bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/40 font-bold scale-105', theme.ringOffset);
                }

                return (
                  <button
                    key={token.id || idx}
                    type="button"
                    onClick={() => handleSelectWord(idx)}
                    disabled={status !== 'idle'}
                    aria-label={`Answer option ${token.word}`}
                    aria-pressed={isSelected}
                    className={joinClasses('px-6 py-3 rounded-2xl font-medium text-base transition-all border flex items-center gap-2', buttonStyles)}
                  >
                    <span>{token.word}</span>
                    {isCorrectWord && <Check className="w-4 h-4 stroke-[3]" />}
                    {isIncorrectWord && <X className="w-4 h-4 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {status === 'idle' && (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={selectedIndex === null}
                aria-label="Check answer"
                className={joinClasses(
                  'w-full max-w-md py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2',
                  selectedIndex !== null
                    ? joinClasses(theme.primaryButton, 'active:scale-98 cursor-pointer')
                    : theme.primaryButtonDisabled
                )}
              >
                Check Answer
              </button>
            )}
          </div>

          <div className="w-full mt-6" aria-live="polite">
            {status === 'correct' && selectedToken && (
              <div className={joinClasses('w-full rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300', theme.successPanel)}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-emerald-400 font-extrabold text-lg">Correct!</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{resultExplanation}</p>
                  </div>
                </div>
                <div className="flex justify-start pl-14">
                  <button
                    type="button"
                    onClick={handleCloseGame}
                    aria-label="Continue to catalog"
                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-2.5 rounded-full text-sm transition-all shadow-md shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0813]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {status === 'incorrect' && selectedToken && (
              <div className={joinClasses('w-full rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300', theme.dangerPanel)}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <X className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-rose-500 font-extrabold text-lg">Not quite — keep trying!</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{resultExplanation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14 pt-1">
                  <button
                    type="button"
                    onClick={handleRetry}
                    aria-label="Retry activity"
                    className={joinClasses('bg-transparent hover:bg-violet-950/50 text-gray-200 font-semibold px-5 py-2.5 rounded-full text-sm border border-gray-600/50 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2', theme.ringOffset)}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseGame}
                    aria-label="Continue to catalog"
                    className={joinClasses('font-bold px-8 py-2.5 rounded-full text-sm transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2', theme.primaryButton)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            <div className="sr-only" role="status" aria-live="polite">
              {liveMessage}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={joinClasses('flex-1 min-h-screen', theme.page)} aria-label="Mini games catalog">
      <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Mini Games</h1>
            <p className="text-sm text-gray-400">Practice English through fun, interactive games</p>
          </div>
          <button
            type="button"
            onClick={handleToggleContrast}
            aria-label={highContrastMode ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            aria-pressed={highContrastMode}
            className={joinClasses('inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0', theme.iconButton, theme.outline)}
          >
            <Star className="w-4 h-4 fill-current" />
            <span>{highContrastMode ? 'High Contrast On' : 'High Contrast'}</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Find a game (e.g. Verbs, Adjectives...)"
            aria-label="Search mini games"
            aria-controls="mini-games-panel"
            className={joinClasses(
              'w-full border rounded-2xl py-3.5 pl-11 pr-4 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2',
              theme.input,
              theme.ringOffset
            )}
          />
        </div>

        <nav className="overflow-x-auto pb-2" aria-label="Game category filters">
          <div className="flex items-center gap-3" role="tablist">
            {FILTER_CATEGORIES.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="mini-games-panel"
                onClick={() => handleCategoryChange(item.id)}
                className={joinClasses(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2',
                  isActive ? theme.tabActive : theme.tabInactive,
                  theme.ringOffset
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
            })}
          </div>
        </nav>

        <div className="sr-only" role="status" aria-live="polite">
          {liveMessage}
        </div>

        <section className="space-y-8" role="tabpanel" id="mini-games-panel" aria-label="Mini games list">
          {visibleGameCount === 0 ? (
            <div className={joinClasses('rounded-2xl p-8 text-center border', theme.noResults)}>
              <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
              <p className="text-sm text-gray-400">Try another search term or clear the current filters.</p>
            </div>
          ) : (
            filteredData.map((section) => {
              const SectionIcon = section.category === 'Pronunciation' ? Volume2 : BookOpen;

              return (
                <article key={section.category} className="space-y-4" aria-labelledby={`section-${section.category}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SectionIcon className={joinClasses('w-5 h-5', theme.accent)} />
                      <h2 id={`section-${section.category}`} className="text-xl font-bold text-white tracking-wide">
                        {section.category}
                      </h2>
                    </div>
                    <button
                      type="button"
                      aria-label={`See all ${section.category} games`}
                      className={joinClasses('text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2', theme.accent, theme.ringOffset)}
                    >
                      See all
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.games.map((game) => {
                      const GameIcon = ICON_MAP[game.icon] || Zap;

                      return (
                        <button
                          key={game.id}
                          type="button"
                          onClick={() => handleStartGame(game)}
                          aria-label={`Play ${game.title}, ${game.category}, level ${game.level}`}
                          aria-pressed={false}
                          className={joinClasses(
                            'text-left border rounded-2xl p-5 flex flex-col justify-between transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2',
                            theme.panel,
                            theme.panelHover,
                            theme.ringOffset
                          )}
                        >
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className={joinClasses('w-12 h-12 rounded-xl flex items-center justify-center border', game.iconBg)}>
                                <GameIcon className="w-6 h-6" />
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className={joinClasses('text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border', theme.tag)}>
                                  {game.level}
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium">{game.plays}</span>
                              </div>
                            </div>

                            <h3 className="font-bold text-white text-base mb-1 group-hover:text-violet-300 transition-colors">
                              {game.title}
                            </h3>
                            <p className={joinClasses('text-xs mb-6', theme.muted)}>{game.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-violet-950/40">
                            <span className="text-[11px] font-medium text-gray-500">{game.tag}</span>
                            <span className={joinClasses('inline-flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-xs transition-all', theme.primaryButton)}>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Play</span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
