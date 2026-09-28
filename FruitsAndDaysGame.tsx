import React, { useState } from 'react';
import { FRUTAS_DATA, DIAS_DATA, DIAS_VOCAB, FruitItem, DayItem, DayVocab } from './data';
import { sounds } from './audio';
import { 
  Apple, 
  Calendar, 
  Volume2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  Shuffle
} from 'lucide-react';

interface FruitsAndDaysGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export const FruitsAndDaysGame: React.FC<FruitsAndDaysGameProps> = ({ score, setScore }) => {
  const [subTab, setSubTab] = useState<'frutas' | 'dias' | 'quiz' | 'order'>('frutas');

  // Flashcards state
  const [activeFruitIndex, setActiveFruitIndex] = useState<number>(0);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});

  // Quiz state for fruits & days
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);

  // Day order puzzle state
  const [orderedDays, setOrderedDays] = useState<DayVocab[]>([]);
  const [remainingDays, setRemainingDays] = useState<DayVocab[]>(() => {
    return [...DIAS_VOCAB].sort(() => Math.random() - 0.5);
  });
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  // Toggle reveal helper
  const toggleReveal = (key: string) => {
    setRevealedTranslations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isRevealed = (key: string) => !!revealedTranslations[key];

  // Combined quiz items for quiz mode
  const allQuizItems = React.useMemo(() => {
    const list: {
      id: string;
      category: 'fruta' | 'dia';
      questionEs: string;
      questionHy: string;
      correctAnswerEs: string;
      correctAnswerHy: string;
      distractors: { es: string; hy: string }[];
    }[] = [];

    FRUTAS_DATA.forEach((f, idx) => {
      // Find 3 other answers
      const others = FRUTAS_DATA.filter((_, i) => i !== idx)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((o) => ({ es: o.esAnswer, hy: o.hyAnswer }));

      list.push({
        id: `f-${f.id}`,
        category: 'fruta',
        questionEs: f.esQuestion,
        questionHy: f.hyQuestion,
        correctAnswerEs: f.esAnswer,
        correctAnswerHy: f.hyAnswer,
        distractors: others,
      });
    });

    DIAS_DATA.forEach((d, idx) => {
      const others = DIAS_DATA.filter((_, i) => i !== idx)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((o) => ({ es: o.esAnswer, hy: o.hyAnswer }));

      list.push({
        id: `d-${d.id}`,
        category: 'dia',
        questionEs: d.esQuestion,
        questionHy: d.hyQuestion,
        correctAnswerEs: d.esAnswer,
        correctAnswerHy: d.hyAnswer,
        distractors: others,
      });
    });

    return list.sort(() => Math.random() - 0.5);
  }, []);

  const currentQuiz = allQuizItems[quizIndex % allQuizItems.length];

  // Options for current quiz question
  const currentQuizOptions = React.useMemo(() => {
    if (!currentQuiz) return [];
    const opts = [
      { es: currentQuiz.correctAnswerEs, hy: currentQuiz.correctAnswerHy, isCorrect: true },
      ...currentQuiz.distractors.map((d) => ({ ...d, isCorrect: false })),
    ];
    return opts.sort(() => Math.random() - 0.5);
  }, [currentQuiz]);

  const handleQuizAnswer = (option: { es: string; hy: string; isCorrect: boolean }) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    setSelectedQuizAnswer(option.es);

    if (option.isCorrect) {
      sounds.playCorrect();
      setQuizScore((prev) => prev + 1);
      setScore((prev) => prev + 250);
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuiz = () => {
    setQuizIndex((prev) => prev + 1);
    setQuizAnswered(false);
    setSelectedQuizAnswer(null);
  };

  // Day order handlers
  const handleSelectDay = (day: DayVocab) => {
    sounds.playLetterReveal();
    sounds.speakSpanish(day.es);
    const nextOrdered = [...orderedDays, day];
    const nextRemaining = remainingDays.filter((d) => d.es !== day.es);
    setOrderedDays(nextOrdered);
    setRemainingDays(nextRemaining);

    if (nextRemaining.length === 0) {
      // Check if order is 1 to 7
      const isCorrectOrder = nextOrdered.every((d, i) => d.dayNumber === i + 1);
      if (isCorrectOrder) {
        sounds.playFanfare();
        setOrderFeedback('🎉 Կեցցե՛ք: Շաբաթվա բոլոր 7 օրերը ճիշտ հերթականությամբ են! (+500 միավոր)');
        setScore((prev) => prev + 500);
      } else {
        sounds.playWrong();
        setOrderFeedback('Հերթականությունը ճիշտ չէ, բայց ոչինչ! Սեղմեք «Վերսկսել» և փորձեք նորից:');
      }
    }
  };

  const resetDayOrder = () => {
    setOrderedDays([]);
    setRemainingDays([...DIAS_VOCAB].sort(() => Math.random() - 0.5));
    setOrderFeedback(null);
  };

  const currentFruit = FRUTAS_DATA[activeFruitIndex];
  const currentDay = DIAS_DATA[activeDayIndex];

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 border border-slate-700 p-2 rounded-xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSubTab('frutas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'frutas'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>🍎 Frutas (Մրգեր)</span>
          </button>

          <button
            onClick={() => setSubTab('dias')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'dias'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 Días de la semana (Շաբաթվա օրեր)</span>
          </button>

          <button
            onClick={() => setSubTab('order')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'order'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Հերթականության խաղ</span>
          </button>

          <button
            onClick={() => setSubTab('quiz')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Վիկտորինա · Quiz</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 px-2 flex items-center gap-1">
          <span>Հուշում:</span>
          <span className="text-amber-300 font-medium">
            սեղմեք իսպաներեն տեքստի վրա թարգմանության համար
          </span>
        </div>
      </div>

      {/* Mode 1: Frutas (15 Q&A) */}
      {subTab === 'frutas' && (
        <div className="space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
                  🍎 FRUTAS / ՄՐԳԵՐ · Հարց ու պատասխան #{currentFruit.id} / 15
                </span>
                <span className="text-xs text-slate-400">
                  Սովորեք 15 առօրյա երկխոսություն մրգերի մասին
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFruitIndex((prev) => (prev > 0 ? prev - 1 : FRUTAS_DATA.length - 1))}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200 cursor-pointer"
                >
                  ← Նախորդ
                </button>
                <span className="text-xs font-bold text-amber-400 px-1">
                  {currentFruit.id} / 15
                </span>
                <button
                  onClick={() => setActiveFruitIndex((prev) => (prev + 1) % FRUTAS_DATA.length)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200 cursor-pointer"
                >
                  Հաջորդ →
                </button>
              </div>
            </div>

            {/* Interactive Dialogue Card */}
            <div className="space-y-4">
              {/* Question Bubble */}
              <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-amber-400 uppercase font-semibold block">
                      Հարց (🇪🇸 Español):
                    </span>
                    <p
                      onClick={() => {
                        toggleReveal(`f-q-${currentFruit.id}`);
                        sounds.speakSpanish(currentFruit.esQuestion);
                      }}
                      className="text-lg font-bold text-slate-100 hover:text-amber-300 cursor-pointer select-none transition-colors"
                    >
                      {currentFruit.esQuestion}
                    </p>
                  </div>
                  <button
                    onClick={() => sounds.speakSpanish(currentFruit.esQuestion)}
                    className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800 rounded-lg shrink-0 cursor-pointer"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Translation Reveal */}
                <div
                  onClick={() => toggleReveal(`f-q-${currentFruit.id}`)}
                  className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">🇦🇲 Հայերեն:</span>
                    <span className={isRevealed(`f-q-${currentFruit.id}`) ? 'text-slate-200' : 'text-slate-500 italic'}>
                      {isRevealed(`f-q-${currentFruit.id}`) ? currentFruit.hyQuestion : 'Սեղմեք տեսնելու թարգմանությունը...'}
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:text-amber-400">
                    {isRevealed(`f-q-${currentFruit.id}`) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>

              {/* Answer Bubble */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-emerald-400 uppercase font-semibold block">
                      Պատասխան (🇪🇸 Respuesta):
                    </span>
                    <p
                      onClick={() => {
                        toggleReveal(`f-a-${currentFruit.id}`);
                        sounds.speakSpanish(currentFruit.esAnswer);
                      }}
                      className="text-lg font-bold text-emerald-200 hover:text-emerald-100 cursor-pointer select-none transition-colors"
                    >
                      {currentFruit.esAnswer}
                    </p>
                  </div>
                  <button
                    onClick={() => sounds.speakSpanish(currentFruit.esAnswer)}
                    className="p-2 text-emerald-400 hover:text-emerald-200 bg-emerald-900/40 rounded-lg shrink-0 cursor-pointer"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Translation Reveal */}
                <div
                  onClick={() => toggleReveal(`f-a-${currentFruit.id}`)}
                  className="mt-3 pt-2.5 border-t border-emerald-900/60 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300 font-semibold">🇦🇲 Հայերեն:</span>
                    <span className={isRevealed(`f-a-${currentFruit.id}`) ? 'text-slate-200' : 'text-emerald-400/60 italic'}>
                      {isRevealed(`f-a-${currentFruit.id}`) ? currentFruit.hyAnswer : 'Սեղմեք տեսնելու թարգմանությունը...'}
                    </span>
                  </div>
                  <span className="text-emerald-400 group-hover:text-emerald-200">
                    {isRevealed(`f-a-${currentFruit.id}`) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick fruit grid list */}
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <span className="text-xs text-slate-400 uppercase font-semibold block mb-2.5">
                Բոլոր 15 հարցերը (սեղմեք ցանկացածի վրա):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {FRUTAS_DATA.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFruitIndex(idx)}
                    className={`p-2 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                      activeFruitIndex === idx
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>#{item.id}</span>
                      <span className="text-[10px] opacity-80">{item.fruitTag || '🍎'}</span>
                    </div>
                    <div className="truncate text-[11px] mt-0.5">
                      {item.esQuestion.slice(0, 18)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Días de la semana (Vocab + 15 Q&A) */}
      {subTab === 'dias' && (
        <div className="space-y-5">
          {/* Days of week vocabulary bar */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>ՇԱԲԱԹՎԱ 7 ՕՐԵՐԸ · DÍAS DE LA SEMANA (սեղմեք արտասանության և թարգմանության համար)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {DIAS_VOCAB.map((day) => (
                <div
                  key={day.es}
                  onClick={() => sounds.speakSpanish(day.es)}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-amber-400/60 rounded-xl p-3 text-center transition-all cursor-pointer group shadow-sm"
                >
                  <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">
                    Օր {day.dayNumber}
                  </span>
                  <span className="text-base font-bold text-amber-300 group-hover:text-amber-200 block capitalize">
                    {day.es}
                  </span>
                  <span className="text-xs text-emerald-400 block mt-0.5">
                    {day.hy}
                  </span>
                  <div className="mt-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dialogue card for 15 days questions */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
                  📅 DÍAS DE LA SEMANA · Երկխոսություն #{currentDay.id} / 15
                </span>
                <span className="text-xs text-slate-400">
                  Սովորեք շաբաթվա օրերի հարցերն ու պատասխանները
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDayIndex((prev) => (prev > 0 ? prev - 1 : DIAS_DATA.length - 1))}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200 cursor-pointer"
                >
                  ← Նախորդ
                </button>
                <span className="text-xs font-bold text-amber-400 px-1">
                  {currentDay.id} / 15
                </span>
                <button
                  onClick={() => setActiveDayIndex((prev) => (prev + 1) % DIAS_DATA.length)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200 cursor-pointer"
                >
                  Հաջորդ →
                </button>
              </div>
            </div>

            {/* Question & Answer Card */}
            <div className="space-y-4">
              {/* Question */}
              <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-amber-400 uppercase font-semibold block mb-0.5">
                      🇪🇸 Pregunta (Հարց):
                    </span>
                    <p
                      onClick={() => {
                        toggleReveal(`d-q-${currentDay.id}`);
                        sounds.speakSpanish(currentDay.esQuestion);
                      }}
                      className="text-lg font-bold text-slate-100 hover:text-amber-300 cursor-pointer select-none transition-colors"
                    >
                      {currentDay.esQuestion}
                    </p>
                  </div>
                  <button
                    onClick={() => sounds.speakSpanish(currentDay.esQuestion)}
                    className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800 rounded-lg shrink-0 cursor-pointer"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() => toggleReveal(`d-q-${currentDay.id}`)}
                  className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">🇦🇲 Հայերեն:</span>
                    <span className={isRevealed(`d-q-${currentDay.id}`) ? 'text-slate-200' : 'text-slate-500 italic'}>
                      {isRevealed(`d-q-${currentDay.id}`) ? currentDay.hyQuestion : 'Սեղմեք տեսնելու թարգմանությունը...'}
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:text-amber-400">
                    {isRevealed(`d-q-${currentDay.id}`) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>

              {/* Answer */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-emerald-400 uppercase font-semibold block mb-0.5">
                      🇪🇸 Respuesta (Պատասխան):
                    </span>
                    <p
                      onClick={() => {
                        toggleReveal(`d-a-${currentDay.id}`);
                        sounds.speakSpanish(currentDay.esAnswer);
                      }}
                      className="text-lg font-bold text-emerald-200 hover:text-emerald-100 cursor-pointer select-none transition-colors"
                    >
                      {currentDay.esAnswer}
                    </p>
                  </div>
                  <button
                    onClick={() => sounds.speakSpanish(currentDay.esAnswer)}
                    className="p-2 text-emerald-400 hover:text-emerald-200 bg-emerald-900/40 rounded-lg shrink-0 cursor-pointer"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() => toggleReveal(`d-a-${currentDay.id}`)}
                  className="mt-3 pt-2.5 border-t border-emerald-900/60 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300 font-semibold">🇦🇲 Հայերեն:</span>
                    <span className={isRevealed(`d-a-${currentDay.id}`) ? 'text-slate-200' : 'text-emerald-400/60 italic'}>
                      {isRevealed(`d-a-${currentDay.id}`) ? currentDay.hyAnswer : 'Սեղմեք տեսնելու թարգմանությունը...'}
                    </span>
                  </div>
                  <span className="text-emerald-400 group-hover:text-emerald-200">
                    {isRevealed(`d-a-${currentDay.id}`) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick list of all 15 questions */}
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <span className="text-xs text-slate-400 uppercase font-semibold block mb-2.5">
                Բոլոր 15 հարցերը (ընտրեք ցանկացածը):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {DIAS_DATA.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`p-2 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                      activeDayIndex === idx
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-semibold">Հարց #{item.id}</div>
                    <div className="truncate text-[11px] text-slate-400 mt-0.5">
                      {item.esQuestion}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Order the Days Game (Շաբաթվա օրերի հերթականություն) */}
      {subTab === 'order' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 md:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                Դասավորեք շաբաթվա օրերը ճիշտ հերթականությամբ (1 - 7)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Սեղմեք օրերի վրա ըստ հերթականության՝ երկուշաբթիից մինչև կիրակի (lunes ➔ domingo)
              </p>
            </div>
            <button
              onClick={resetDayOrder}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Վերսկսել</span>
            </button>
          </div>

          {/* Target Ordered Slots */}
          <div className="my-6">
            <span className="text-xs uppercase text-slate-400 font-semibold block mb-2">
              Ձեր հավաքած հերթականությունը:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 min-h-[90px] p-3 bg-slate-900/70 border border-dashed border-slate-700 rounded-xl">
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                const day = orderedDays[idx];
                return (
                  <div
                    key={idx}
                    className={`rounded-lg p-2.5 flex flex-col items-center justify-center text-center transition-all ${
                      day
                        ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 font-bold border border-amber-300 shadow-md'
                        : 'border border-slate-700 bg-slate-800/40 text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80">Օր {idx + 1}</span>
                    {day ? (
                      <>
                        <span className="text-sm capitalize font-extrabold">{day.es}</span>
                        <span className="text-[11px] font-medium opacity-90">{day.hy}</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500">Դատարկ</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Remaining Days to Pick */}
          {remainingDays.length > 0 ? (
            <div>
              <span className="text-xs uppercase text-slate-400 font-semibold block mb-2">
                Ընտրեք հաջորդ օրը (սեղմեք ավելացնելու համար):
              </span>
              <div className="flex flex-wrap gap-2.5">
                {remainingDays.map((day) => (
                  <button
                    key={day.es}
                    onClick={() => handleSelectDay(day)}
                    className="px-4 py-2.5 bg-slate-700/80 hover:bg-amber-500 hover:text-slate-950 border border-slate-600 rounded-xl font-bold text-sm text-slate-200 transition-all cursor-pointer shadow-sm hover:scale-105"
                  >
                    <span className="capitalize">{day.es}</span>
                    <span className="text-xs font-normal opacity-80 ml-2">({day.hy})</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Feedback */}
          {orderFeedback && (
            <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-amber-400/50 text-center">
              <p className="text-sm font-semibold text-amber-300">
                {orderFeedback}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 4: Fruit & Days Knowledge Quiz (Վիկտորինա) */}
      {subTab === 'quiz' && currentQuiz && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 md:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                Վիկտորինա · Quiz (#{quizIndex + 1} / {allQuizItems.length})
              </span>
              <span className="text-xs text-slate-400">
                Ընտրեք ճիշտ իսպաներեն պատասխանը հարցին
              </span>
            </div>

            <div className="text-xs text-slate-300">
              Ճիշտ պատասխաններ: <strong className="text-amber-400">{quizScore}</strong>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-900 border border-slate-700/70 rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] text-amber-400 uppercase font-semibold block mb-0.5">
                  Հարց իսպաներենով (սեղմեք թարգմանության համար):
                </span>
                <p
                  onClick={() => {
                    toggleReveal(`quiz-${currentQuiz.id}`);
                    sounds.speakSpanish(currentQuiz.questionEs);
                  }}
                  className="text-lg font-bold text-slate-100 hover:text-amber-300 cursor-pointer select-none transition-colors"
                >
                  {currentQuiz.questionEs}
                </p>
              </div>
              <button
                onClick={() => sounds.speakSpanish(currentQuiz.questionEs)}
                className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800 rounded-lg shrink-0 cursor-pointer"
                title="Լսել արտասանությունը"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div
              onClick={() => toggleReveal(`quiz-${currentQuiz.id}`)}
              className="mt-3 pt-2 border-t border-slate-800 text-xs text-emerald-400 cursor-pointer"
            >
              <span>🇦🇲 Հայերեն: </span>
              <span className="text-slate-300">
                {isRevealed(`quiz-${currentQuiz.id}`) ? currentQuiz.questionHy : 'Սեղմեք տեսնելու թարգմանությունը...'}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuizOptions.map((opt, i) => {
              const isSelected = selectedQuizAnswer === opt.es;
              let btnStyle = 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-amber-400/60 hover:bg-slate-750';

              if (quizAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={i}
                  disabled={quizAnswered}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div>
                    <div className="font-semibold text-sm">{opt.es}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{opt.hy}</div>
                  </div>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.speakSpanish(opt.es);
                    }}
                    className="text-slate-400 hover:text-amber-400 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {quizAnswered && (
            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-700/60">
              <span className="text-xs text-slate-400">
                {selectedQuizAnswer === currentQuiz.correctAnswerEs
                  ? '✨ Ճիշտ է! (+250 միավոր)'
                  : 'Շարունակեք խաղալ, սխալները օգնում են սովորել!'}
              </span>
              <button
                onClick={handleNextQuiz}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Հաջորդ հարցը</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
