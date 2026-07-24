import { useEffect, useState } from 'react';
import { X, Volume2, Star, Check, RotateCcw } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

// Pregunta con retroalimentación contextual específica por cada palabra
const sampleQuestion = {
  id: 1,
  instruction: 'INSTRUCTION',
  prompt: 'Select the Noun in the following sentence:',
  audioText: 'Select the noun in the following sentence. The algorithm evaluates complex data.',
  correctTokenIndex: 1, // 'algorithm'
  sentenceTokens: [
    {
      word: 'The',
      type: 'incorrect',
      explanation:
        "'The' is a definite article used to modify nouns. It specifies a particular noun, but it is not a noun itself.",
    },
    {
      word: 'algorithm',
      type: 'correct',
      explanation:
        "'Algorithm' is a noun. It names a process or set of rules. In this sentence, it acts as the primary subject.",
    },
    {
      word: 'evaluates',
      type: 'incorrect',
      explanation:
        "'Evaluates' is a verb. It indicates the action being performed by the subject in the sentence.",
    },
    {
      word: 'complex',
      type: 'incorrect',
      explanation:
        "'Complex' is an adjective. It modifies the noun 'data' by describing its nature or characteristics.",
    },
    {
      word: 'data',
      type: 'incorrect',
      explanation:
        "'Data' can act as a noun in other contexts (direct object here), but in this exercise, the target primary subject noun is 'algorithm'.",
    },
  ],
};

const lessonQuestions = {
  'Grammar Essentials': sampleQuestion,
  'Letters & Sounds': {
    instruction: 'PRONUNCIATION',
    prompt: 'Select the word that begins with the /th/ sound in “think”:',
    audioText: 'Select the word that begins with the th sound in think. Ship. Think. Cat. Zoo.',
    correctTokenIndex: 1,
    sentenceTokens: [
      { word: 'ship', explanation: "'Ship' begins with the /sh/ sound, not the /th/ sound." },
      { word: 'think', explanation: "'Think' begins with the unvoiced /th/ sound, made by placing the tongue lightly between the teeth." },
      { word: 'cat', explanation: "'Cat' begins with the /k/ sound." },
      { word: 'zoo', explanation: "'Zoo' begins with the voiced /z/ sound." },
    ],
  },
  'Daily Conversations': {
    instruction: 'CONVERSATION',
    prompt: 'Choose the most natural response to: “How are you doing today?”',
    audioText: 'How are you doing today? Choose the most natural response.',
    correctTokenIndex: 0,
    sentenceTokens: [
      { word: "I'm doing well, thanks.", explanation: 'This is a polite and natural response to a question about how you are.' },
      { word: 'At the library.', explanation: 'This answers a question about location, not how someone is doing.' },
      { word: 'Yesterday morning.', explanation: 'This answers a question about time.' },
      { word: 'Because it is sunny.', explanation: 'This gives a reason but does not answer the greeting.' },
    ],
  },
  'Workplace English': {
    instruction: 'WORKPLACE ENGLISH',
    prompt: 'Complete the sentence: “Please ___ the report by Friday.”',
    audioText: 'Please submit the report by Friday. Choose the correct word.',
    correctTokenIndex: 2,
    sentenceTokens: [
      { word: 'submits', explanation: "After 'please,' use the base form of the verb, not 'submits'." },
      { word: 'submitted', explanation: 'The past form does not fit this polite instruction.' },
      { word: 'submit', explanation: "'Submit' is the correct base verb for this polite workplace instruction." },
      { word: 'submitting', explanation: "The -ing form cannot follow 'please' directly in this sentence." },
    ],
  },
  'Academic Writing': {
    instruction: 'ACADEMIC WRITING',
    prompt: 'Choose the best connector: “The results were significant; ___, further research is needed.”',
    audioText: 'The results were significant. However, further research is needed. Choose the best connector.',
    correctTokenIndex: 1,
    sentenceTokens: [
      { word: 'therefore', explanation: "'Therefore' expresses a result, but the second idea contrasts with the first." },
      { word: 'however', explanation: "'However' introduces the contrast between significant results and the need for more research." },
      { word: 'for example', explanation: "'For example' introduces an illustration, not a contrasting idea." },
      { word: 'similarly', explanation: "'Similarly' connects ideas that agree; these two ideas contrast." },
    ],
  },
};

export default function LessonView({ lesson, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState('');
  const { decrementHeart, completeLesson } = useQuestlishStore();
  const question = lessonQuestions[lesson.title] || sampleQuestion;

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioMessage('Audio playback is not supported by this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setAudioMessage('Playing the lesson audio.');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setAudioMessage('Audio finished.');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAudioMessage('The audio could not be played. Please try again.');
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectWord = (index) => {
    if (status === 'idle') {
      setSelectedIndex(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedIndex === null) return;

    if (selectedIndex === question.correctTokenIndex) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
      decrementHeart();
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setSelectedIndex(null);
  };

  const handleContinue = async () => {
    if (status === 'correct') await completeLesson(lesson.id);
    setStatus('idle');
    setSelectedIndex(null);
    onClose();
  };

  // Obtener la palabra actual seleccionada
  const selectedToken = selectedIndex !== null ? question.sentenceTokens[selectedIndex] : null;

  return (
    <div className="flex-1 flex flex-col bg-[#0b0813] min-h-full">
      {/* Sub-Header con progreso y botón cerrar */}
      <div className="bg-[#110e1b] px-8 py-3 flex items-center gap-6 border-b border-violet-950/40">
        <button
          onClick={onClose}
          aria-label="Close lesson"
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-[#1a142e] h-2.5 rounded-full overflow-hidden">
          <div className="bg-violet-600 h-full w-[65%] rounded-full shadow-lg shadow-violet-600/50"></div>
        </div>
      </div>

      {/* Contenido principal del ejercicio */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center items-center">
        {/* Practice Points */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-medium text-gray-400">Practice Points</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 text-violet-950/80 fill-violet-950/60" />
            <Star className="w-4 h-4 text-violet-950/80 fill-violet-950/60" />
          </div>
        </div>

        {/* Card de la pregunta */}
        <div className="w-full bg-[#140f24] border border-violet-900/30 rounded-3xl p-8 md:p-10 shadow-2xl relative flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[11px] font-extrabold tracking-widest text-violet-400 uppercase">
              {question.instruction}
            </span>
            <div>
              <button
                type="button"
                onClick={handlePlayAudio}
                aria-label={isSpeaking ? 'Replay lesson audio' : 'Play lesson audio'}
                title={isSpeaking ? 'Replay lesson audio' : 'Play lesson audio'}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                  isSpeaking
                    ? 'bg-violet-600 border-violet-400 text-white animate-pulse'
                    : 'bg-violet-950/60 border-violet-800/30 text-violet-400 hover:bg-violet-900/50'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">{audioMessage}</p>

          <h2 className="w-full text-xl md:text-2xl font-bold text-white mb-8 leading-snug text-left">
            {question.prompt}
          </h2>

          {/* Fichas de Palabras / Tokens */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 w-full">
            {question.sentenceTokens.map((token, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrectWord = status === 'correct' && isSelected;
              const isIncorrectWord = status === 'incorrect' && isSelected;

              let buttonStyles =
                'bg-[#1e1735] border-violet-900/40 text-gray-200 hover:bg-violet-900/40 hover:border-violet-700/50';

              if (status === 'idle' && isSelected) {
                buttonStyles =
                  'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/50 scale-105 font-bold';
              } else if (isCorrectWord) {
                buttonStyles =
                  'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/40 font-bold scale-105';
              } else if (isIncorrectWord) {
                buttonStyles =
                  'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/40 font-bold scale-105';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectWord(idx)}
                  disabled={status !== 'idle'}
                  className={`px-6 py-3 rounded-2xl font-medium text-base transition-all border flex items-center gap-2 ${buttonStyles}`}
                >
                  <span>{token.word}</span>
                  {isCorrectWord && <Check className="w-4 h-4 stroke-[3]" />}
                  {isIncorrectWord && <X className="w-4 h-4 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Botón Check Answer */}
          {status === 'idle' && (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedIndex === null}
              className={`w-full max-w-md py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md ${
                selectedIndex !== null
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30 active:scale-98 cursor-pointer'
                  : 'bg-violet-950/30 text-gray-500 border border-violet-900/20 cursor-not-allowed opacity-50'
              }`}
            >
              Check Answer
            </button>
          )}
        </div>

        {/* Diálogo de Retroalimentación Contextual Inferior */}
        <div className="w-full mt-6">
          {status === 'correct' && selectedToken && (
            <div className="w-full bg-[#0d1e1c]/90 border border-emerald-500/50 rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-emerald-400 font-extrabold text-lg">Correct!</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedToken.explanation}
                  </p>
                </div>
              </div>
              <div className="flex justify-start pl-14">
                <button
                  onClick={handleContinue}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-2.5 rounded-full text-sm transition-all shadow-md shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {status === 'incorrect' && selectedToken && (
            <div className="w-full bg-[#200f18]/90 border border-rose-500/50 rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <X className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-rose-500 font-extrabold text-lg">Not quite — keep trying!</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedToken.explanation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-14 pt-1">
                <button
                  onClick={handleRetry}
                  className="bg-transparent hover:bg-violet-950/50 text-gray-200 font-semibold px-5 py-2.5 rounded-full text-sm border border-gray-600/50 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
                <button
                  onClick={handleContinue}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-2.5 rounded-full text-sm transition-all shadow-md shadow-violet-600/30"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
