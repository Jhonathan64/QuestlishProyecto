import { useState } from 'react';
import { 
  HelpCircle, Smartphone, Settings, ChevronDown, ChevronUp, Mail 
} from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function HelpCenter() {
  const { highContrastMode } = useQuestlishStore();
  // Estado para controlar qué pregunta del acordeón FAQ está desplegada
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const quickGuides = [
    {
      id: 1,
      icon: Smartphone,
      title: 'Getting Started Guide',
      description: 'Learn the basics of navigating Questlish and starting your first lesson',
    },
    {
      id: 2,
      icon: Settings,
      title: 'Accessibility Features',
      description: 'Discover how to customize Questlish for your learning needs',
    },
    {
      id: 3,
      icon: Smartphone,
      title: 'Learning Path Overview',
      description: 'Understand how the B1 curriculum is structured and what to expect',
    },
  ];

  const faqs = [
    {
      question: 'How do I start learning with Questlish?',
      answer:
        'To start learning, simply navigate to the "Learn" section on the left sidebar. Click on any unlocked lesson node on the interactive map to begin your learning session.',
    },
    {
      question: 'What are Mini Games and how do I play them?',
      answer:
        'Mini Games are bite-sized interactive challenges designed to practice Grammar, Vocabulary, and Pronunciation in a fun way. You can access them from the "Mini Games" menu.',
    },
    {
      question: 'How does the XP system work?',
      answer:
        'You earn XP (Experience Points) by completing lessons and winning interactive mini-games. XP measures your learning effort and helps track your overall progress.',
    },
    {
      question: 'What is the daily streak?',
      answer:
        'Your daily streak increases by 1 for every consecutive day you complete at least one lesson or mini-game. Keep the streak alive by practicing every day!',
    },
    {
      question: 'How do I track my progress?',
      answer:
        'Visit your "Profile" tab to view completed lessons, overall completion percentage, current streak, and earned achievements.',
    },
  ];

  return (
    <div className={`max-w-5xl mx-auto py-8 px-6 space-y-10 ${highContrastMode ? 'text-white' : 'text-gray-100'}`}>
      {/* 1. Header Principal */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-950/80 border border-violet-800/40 flex items-center justify-center text-violet-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Help Center
          </h1>
        </div>
        <p className="text-sm text-gray-400 pl-12">
          Find answers to common questions and learn how to make the most of Questlish
        </p>
      </div>

      {/* 2. Quick Guides */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Quick Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.id}
                className={`rounded-2xl p-5 flex flex-col justify-start space-y-3 hover:border-violet-700/50 transition-all hover:shadow-lg group cursor-pointer border ${highContrastMode ? 'bg-black border-white/20' : 'bg-[#140f24] border-violet-900/30'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-800/40 flex items-center justify-center text-violet-400 group-hover:text-violet-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-violet-300 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Frequently Asked Questions
        </h2>
        <div className={`rounded-2xl divide-y overflow-hidden border ${highContrastMode ? 'bg-black border-white/20 divide-white/10' : 'bg-[#140f24] border-violet-900/30 divide-violet-950/60'}`}>
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left py-4 px-6 flex items-center justify-between text-sm font-semibold text-gray-200 hover:text-white hover:bg-violet-950/30 transition-all"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-violet-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className={`px-6 pb-4 pt-1 text-xs leading-relaxed ${highContrastMode ? 'text-zinc-200 bg-[#050505]' : 'text-gray-400 bg-[#110d1f]'}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Accessibility Guide */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Accessibility Guide
        </h2>
        <div className={`rounded-2xl p-6 space-y-4 text-xs leading-relaxed border ${highContrastMode ? 'bg-black border-white/20 text-zinc-200' : 'bg-[#140f24] border-violet-900/30 text-gray-300'}`}>
          <p>
            Questlish is designed to be accessible to all learners. Access the Accessibility menu from the sidebar to customize your experience:
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0"></span>
              <span>
                <strong className="text-white font-bold">Dark Mode:</strong> Toggle between light and dark themes to reduce eye strain
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0"></span>
              <span>
                <strong className="text-white font-bold">Font Size:</strong> Increase text size by 150% for better readability
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0"></span>
              <span>
                <strong className="text-white font-bold">OpenDyslexic Font:</strong> Switch to a font designed for readers with dyslexia
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0"></span>
              <span>
                <strong className="text-white font-bold">Keyboard Navigation:</strong> Enable enhanced focus borders for keyboard navigation
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 5. Contact Support (Banner Púrpura) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Contact Support
        </h2>
        <div className={`w-full rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${highContrastMode ? 'bg-black border border-white/20 shadow-none' : 'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">
                Need more help?
              </h3>
              <p className="text-xs text-violet-100/80 leading-relaxed max-w-md">
                Can't find the answer you're looking for? Our support team is here to help you with any questions or issues.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Support team contact initiated.')}
            className="bg-white hover:bg-gray-100 text-violet-900 font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}