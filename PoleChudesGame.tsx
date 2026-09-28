import React, { useState, useEffect, useMemo } from 'react';
import { Wheel, Sector } from './Wheel';
import { PRESENTE_QUESTIONS, MAIN_SECRET_WORDS, Question, SecretWord } from './data';
import { sounds } from './audio';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  Volume2, 
  Eye, 
  RotateCcw, 
  ArrowRight,
  Lightbulb,
  Award
} from 'lucide-react';

interface PoleChudesGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const PoleChudesGame: React.FC<PoleChudesGameProps> = ({
  score,
  setScore,
  soundEnabled,
  setSoundEnabled,
}) => {
  // Current secret word - starts with primary word 'JUGADOR'
  const [wordIndex, setWordIndex] = useState<number>(0);
  const currentSecret: SecretWord = MAIN_SECRET_WORDS[wordIndex % MAIN_SECRET_WORDS.length];
  const targetWord = currentSecret.word.toUpperCase();

  // Revealed letters set
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());
  // Missed guessed letters set (tried but not in the word)
  const [missedLetters, setMissedLetters] = useState<Set<string>>(new Set());

  // Wheel state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentSector, setCurrentSector] = useState<Sector | null>(null);

  // Question state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'unanswered' | 'correct' | 'wrong'>('unanswered');

  // Letter picker state: when answered correctly, user picks a letter from the alphabet
  const [isLetterPickerOpen, setIsLetterPickerOpen] = useState<boolean>(false);
  const [letterFeedback, setLetterFeedback] = useState<{ type: 'hit' | 'miss'; message: string } | null>(null);

  // Armenian translation toggle for Spanish text
  const [showQuestionTranslation, setShowQuestionTranslation] = useState<boolean>(false);
  const [showHintTranslation, setShowHintTranslation] = useState<boolean>(false);

  // Whole word guess state
  const [isGuessWordOpen, setIsGuessWordOpen] = useState<boolean>(false);
  const [wholeWordGuess, setWholeWordGuess] = useState<string>('');
  const [wholeWordFeedback, setWholeWordFeedback] = useState<string | null>(null);

  // Victory celebration state
  const [isWon, setIsWon] = useState<boolean>(false);

  const currentQ: Question = PRESENTE_QUESTIONS[currentQuestionIndex % PRESENTE_QUESTIONS.length];

  // Check if word is completely revealed
  const isWordFullyRevealed = useMemo(() => {
    const letters = targetWord.split('');
    return letters.every((char) => revealedLetters.has(char) || char === ' ');
  }, [targetWord, revealedLetters]);

  useEffect(() => {
    if (isWordFullyRevealed && !isWon) {
      setIsWon(true);
      sounds.playFanfare();
      setScore((prev) => prev + 1000);
    }
  }, [isWordFullyRevealed, isWon, setScore]);

  // Handle wheel spin outcome
  const handleSpinEnd = (sector: Sector) => {
    setCurrentSector(sector);
    setLetterFeedback(null);

    if (sector.type === 'plus') {
      // Sector Plus (+ Буква): immediately allow picking a letter from alphabet!
      setIsLetterPickerOpen(true);
      setScore((prev) => prev + sector.points);
    } else if (sector.type === 'prize') {
      // Sector Prize: reveal a random unrevealed letter + points!
      setScore((prev) => prev + sector.points);
      revealRandomLetter();
    } else {
      // Points, Chance, or x2: open Question from the 50 Presente questions
      setSelectedOption(null);
      setAnswerStatus('unanswered');
      setShowQuestionTranslation(false);
      setIsQuestionModalOpen(true);
    }
  };

  // Reveal a random letter that hasn't been opened yet (for Prize sector)
  const revealRandomLetter = () => {
    const unrevealed = targetWord.split('').filter((c) => !revealedLetters.has(c));
    if (unrevealed.length > 0) {
      const charToOpen = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      setRevealedLetters((prev) => new Set([...prev, charToOpen]));
      sounds.playLetterReveal();
    }
  };

  // User chooses a letter from the alphabet to guess
  const handleGuessLetter = (char: string) => {
    const upper = char.toUpperCase();
    if (revealedLetters.has(upper) || missedLetters.has(upper)) {
      return; // already guessed
    }

    if (targetWord.includes(upper)) {
      // Letter is in the word!
      setRevealedLetters((prev) => new Set([...prev, upper]));
      sounds.playCorrect();
      setLetterFeedback({
        type: 'hit',
        message: `¡Correcto! La letra "${upper}" está en la palabra. / Ճիշտ է, «${upper}» տառը կա բառի մեջ!`
      });
      // Award extra points for hit
      setScore((prev) => prev + 200);
    } else {
      // Letter is NOT in the word - but game continues!
      setMissedLetters((prev) => new Set([...prev, upper]));
      sounds.playWrong();
      setLetterFeedback({
        type: 'miss',
        message: `La letra "${upper}" no está en la palabra. / «${upper}» տառը չկա բառի մեջ, բայց խաղը շարունակվում է:`
      });
    }
  };

  // Handle answering question
  const handleAnswerSubmit = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (answerStatus === 'correct') return; // already solved
    setSelectedOption(optionKey);

    if (optionKey === currentQ.correctAnswer) {
      // Correct!
      setAnswerStatus('correct');
      sounds.playCorrect();

      // Add points
      const multiplier = currentSector?.type === 'x2' ? 2 : 1;
      const pointsWon = (currentSector?.points || 200) * multiplier;
      setScore((prev) => prev + pointsWon);

      // Open letter selector modal without revealing the word!
      setTimeout(() => {
        setIsQuestionModalOpen(false);
        setLetterFeedback(null);
        setIsLetterPickerOpen(true);
      }, 1200);
    } else {
      // Incorrect! Remember requirement: "и если ответ неверный всё равно продолжить играть"
      setAnswerStatus('wrong');
      sounds.playWrong();
    }
  };

  // Next question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % PRESENTE_QUESTIONS.length);
    setSelectedOption(null);
    setAnswerStatus('unanswered');
    setShowQuestionTranslation(false);
    setIsQuestionModalOpen(true);
  };

  // Guess whole word
  const handleGuessWholeWord = () => {
    const cleanGuess = wholeWordGuess.trim().toUpperCase();
    if (cleanGuess === targetWord) {
      // Reveal all letters
      const allChars = new Set(targetWord.split(''));
      setRevealedLetters(allChars);
      setScore((prev) => prev + 1500);
      sounds.playFanfare();
      setIsWon(true);
      setIsGuessWordOpen(false);
      setWholeWordFeedback(null);
    } else {
      sounds.playWrong();
      setWholeWordFeedback('Չհամընկավ, բայց կարող եք շարունակել փորձել! / Не совсем то слово, но продолжайте играть!');
    }
  };

  // Reset or next word
  const handleNextWord = () => {
    setWordIndex((prev) => prev + 1);
    setRevealedLetters(new Set());
    setMissedLetters(new Set());
    setIsWon(false);
    setWholeWordGuess('');
    setWholeWordFeedback(null);
    setLetterFeedback(null);
  };

  const restartCurrentWord = () => {
    setRevealedLetters(new Set());
    setMissedLetters(new Set());
    setIsWon(false);
    setWholeWordGuess('');
    setWholeWordFeedback(null);
    setLetterFeedback(null);
  };

  // Spanish alphabet for guessing letters
  const SPANISH_ALPHABET = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  return (
    <div className="space-y-6">
      {/* Word Guessing Board (Scoreboard style like Pole Chudes) */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 md:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-700/60 pb-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
              Գուշակելու գաղտնի բառը · Секретное слово ({targetWord.length} букв)
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-slate-300">
                {currentSecret.hintHy}
              </span>
              <button
                onClick={() => sounds.speakSpanish(currentSecret.hintEs)}
                className="text-slate-400 hover:text-amber-400 transition-colors p-1"
                title="Слушать подсказку на испанском"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {/* Click to reveal Spanish hint translation */}
            <p 
              onClick={() => setShowHintTranslation(!showHintTranslation)} 
              className="text-xs text-slate-400 hover:text-amber-300 cursor-pointer transition-colors mt-0.5 italic"
            >
              🇪🇸 {currentSecret.hintEs} {showHintTranslation ? `(🇦🇲 ${currentSecret.hintHy})` : '— սեղմեք թարգմանության համար'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLetterFeedback(null);
                setIsLetterPickerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-amber-300 border border-amber-400/40 font-semibold text-xs rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Назвать букву</span>
            </button>

            <button
              onClick={() => setIsGuessWordOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-all hover:shadow-amber-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Назвать всё слово
            </button>

            <button
              onClick={restartCurrentWord}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Сбросить буквы"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Word Display Boxes - Hidden with '?' until guessed! */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 py-6 min-h-[100px]">
          {targetWord.split('').map((char, idx) => {
            const isRevealed = revealedLetters.has(char) || char === ' ';
            return (
              <div
                key={idx}
                className={`w-11 h-14 sm:w-14 sm:h-18 rounded-lg flex flex-col items-center justify-center font-bold text-2xl sm:text-3xl transition-all duration-300 shadow-lg ${
                  char === ' '
                    ? 'bg-transparent border-none'
                    : isRevealed
                    ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-2 border-amber-200 transform scale-105 shadow-amber-500/30 animate-scaleUp'
                    : 'bg-slate-900 border-2 border-slate-600 text-slate-500 hover:border-amber-400/50'
                }`}
              >
                {isRevealed ? (
                  char
                ) : (
                  <span className="text-slate-500 text-xl font-bold select-none">?</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Word Clue Footer */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <span>Տառերի քանակը (Букв): <strong className="text-slate-200">{targetWord.length}</strong></span>
            <span>·</span>
            <span>Բացված է (Открыто): <strong className="text-amber-400">{targetWord.split('').filter(c => revealedLetters.has(c)).length}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {isWon ? (
              <div
                onClick={() => sounds.speakSpanish(targetWord)} 
                className="flex items-center gap-1.5 text-emerald-400 font-semibold cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Բառը գուշակված է: <strong>{targetWord}</strong> ({currentSecret.hyTranslation})</span>
              </div>
            ) : (
              <span className="text-slate-400 italic">
                Գուշակեք տառերը հարցերին ճիշտ պատասխանելուց հետո:
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Game Arena: Wheel + Question Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Wheel (Барабан) */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-xl flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                Барабан Поле чудес · Հրաշքների անիվ
              </h2>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Без банкрота & времени
            </span>
          </div>

          <Wheel
            onSpinEnd={handleSpinEnd}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        </div>

        {/* Right: Quick Question Desk & Actions */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Question Preview Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Вопрос #{currentQ.id} из 50 (Presente de Indicativo)
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setAnswerStatus('unanswered');
                  setShowQuestionTranslation(false);
                  setIsQuestionModalOpen(true);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Открыть на весь экран
              </button>
            </div>

            {/* Spanish Sentence with Click-to-Translate to Armenian */}
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-3.5 mb-3 group transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    🇪🇸 Испанский (кликните для перевода на армянский):
                  </span>
                  <p
                    onClick={() => {
                      setShowQuestionTranslation(!showQuestionTranslation);
                      sounds.speakSpanish(currentQ.esPrompt.replace('___', '...'));
                    }}
                    className="text-base sm:text-lg font-semibold text-amber-300 hover:text-amber-200 cursor-pointer select-none transition-colors"
                  >
                    {currentQ.esPrompt}
                  </p>
                </div>
                <button
                  onClick={() => sounds.speakSpanish(currentQ.esPrompt.replace('___', '...'))}
                  className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors shrink-0 cursor-pointer"
                  title="Озвучить на испанском"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Armenian Translation */}
              <div 
                onClick={() => setShowQuestionTranslation(!showQuestionTranslation)}
                className={`mt-2 pt-2 border-t border-slate-800 transition-all cursor-pointer ${
                  showQuestionTranslation ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span>🇦🇲 Հայերեն թարգմանություն:</span>
                  <span className="text-slate-200">
                    {showQuestionTranslation ? currentQ.hyPrompt : 'Սեղմեք տեսնելու համար... (нажмите для перевода)'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-2 gap-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === currentQ.correctAnswer;
                let btnStyle = 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-amber-400/50';

                if (isSelected && answerStatus === 'correct') {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected && answerStatus === 'wrong') {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                } else if (answerStatus === 'correct' && isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300';
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswerSubmit(opt.key)}
                    className={`p-2.5 rounded-lg border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-slate-800 text-amber-400">
                        {opt.key}
                      </span>
                      <span className="font-medium">{opt.text}</span>
                    </div>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.speakSpanish(opt.text);
                      }} 
                      className="text-slate-400 hover:text-amber-400 p-0.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback */}
            {answerStatus === 'correct' && (
              <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/70 rounded-lg text-xs text-emerald-300 flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-200">
                    ¡Correcto! / Ճիշտ պատասխան: {currentQ.fullSentenceEs}
                  </p>
                  <p className="text-emerald-400/90 mt-0.5">
                    🇦🇲 {currentQ.hyPrompt}
                  </p>
                  <p className="text-amber-300 mt-1 font-medium">
                    ✨ Գերազանց է! Հիմա կարող եք ընտրել տառ իսպաներեն այբուբենից՝ գաղտնի բառը գուշակելու համար:
                  </p>
                </div>
              </div>
            )}

            {answerStatus === 'wrong' && (
              <div className="mt-3 p-3 bg-slate-900/90 border border-amber-500/60 rounded-lg text-xs text-amber-200 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      Ոչինչ, փորձեք նորից կամ շարունակեք խաղը! (Не беда, продолжайте играть!)
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Կարող եք ընտրել այլ տարբերակ կամ նորից պտտել անիվը:
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAnswerStatus('unanswered')}
                  className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer"
                >
                  Попробовать еще
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
              <button
                onClick={() => {
                  setLetterFeedback(null);
                  setIsLetterPickerOpen(true);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Выбрать букву (Ընտրել տառ)</span>
              </button>

              <button
                onClick={handleNextQuestion}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Следующий вопрос</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Educational Note about learning Presente without revealing answer */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-400">
                Ներկա ժամանակ · Presente de Indicativo
              </span>
              <span className="text-slate-400">
                Բառի երկարությունը՝ {targetWord.length} տառ
              </span>
            </div>
            <p className="mt-1 text-slate-400 leading-relaxed">
              Յուրաքանչյուր ճիշտ պատասխանից հետո դուք ինքներդ եք ընտրում տառը իսպաներեն այբուբենից: Եթե տառը կա բառի մեջ, այն կբացվի տախտակի վրա:
            </p>
          </div>
        </div>
      </div>

      {/* Manual Letter Picker Modal - DOES NOT REVEAL THE SECRET WORD! */}
      {isLetterPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-amber-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-center animate-scaleUp">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-100">
              Ընտրեք տառ այբուբենից · Выберите букву
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Գուշակեք, թե որ տառն է գտնվում գաղտնի բառի մեջ ({targetWord.length} տառ):
            </p>

            {/* Feedback message for the chosen letter */}
            {letterFeedback && (
              <div className={`mt-3 p-3 rounded-lg text-xs font-semibold ${
                letterFeedback.type === 'hit'
                  ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                  : 'bg-slate-900 border border-slate-700 text-amber-300'
              }`}>
                {letterFeedback.message}
              </div>
            )}

            {/* Spanish Alphabet Keyboard */}
            <div className="my-5">
              <span className="text-xs text-slate-400 block mb-2 uppercase tracking-wider font-semibold">
                Իսպաներեն այբուբեն (Առանց պատասխանը ցույց տալու):
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-h-56 overflow-y-auto p-1">
                {SPANISH_ALPHABET.map((letter) => {
                  const isRevealed = revealedLetters.has(letter);
                  const isMissed = missedLetters.has(letter);

                  let btnClass = 'bg-slate-700/80 border-slate-600 text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:scale-105';
                  let statusMark = null;

                  if (isRevealed) {
                    btnClass = 'bg-emerald-900/80 border-emerald-500 text-emerald-200 cursor-not-allowed opacity-90 font-bold';
                    statusMark = '✓';
                  } else if (isMissed) {
                    btnClass = 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50';
                    statusMark = '✗';
                  }

                  return (
                    <button
                      key={letter}
                      disabled={isRevealed || isMissed}
                      onClick={() => handleGuessLetter(letter)}
                      className={`w-9 h-10 sm:w-10 sm:h-11 rounded-lg text-sm sm:text-base font-bold border transition-all cursor-pointer flex flex-col items-center justify-center relative ${btnClass}`}
                    >
                      <span>{letter}</span>
                      {statusMark && (
                        <span className="text-[9px] -mt-1">{statusMark}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Letter status summary */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-700/60">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Կա բառում: <strong>{revealedLetters.size}</strong></span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span>
                <span>Չկա բառում: <strong>{missedLetters.size}</strong></span>
              </span>
            </div>

            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => {
                  setIsLetterPickerOpen(false);
                  setLetterFeedback(null);
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Պատրաստ է · Продолжить игру
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Whole Word Guess Modal */}
      {isGuessWordOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Назвать слово целиком · Գուշակել ամբողջ բառը</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Եթե գիտեք ամբողջ բառը, գրեք այստեղ իսպաներենով և ստացեք +1500 միավոր!
            </p>

            <div className="my-4">
              <input
                type="text"
                value={wholeWordGuess}
                onChange={(e) => setWholeWordGuess(e.target.value)}
                placeholder="Գրեք բառը այստեղ..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-lg font-bold text-amber-300 tracking-wider text-center uppercase focus:border-amber-400 focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGuessWholeWord();
                }}
              />
              {wholeWordFeedback && (
                <p className="text-xs text-amber-400 mt-2 text-center">
                  {wholeWordFeedback}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setIsGuessWordOpen(false);
                  setWholeWordFeedback(null);
                }}
                className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-700 rounded-lg cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={handleGuessWholeWord}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg cursor-pointer"
              >
                Проверить слово
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal - Only here the word is fully unveiled and celebrated! */}
      {isWon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl shadow-amber-500/20">
            <div className="w-16 h-16 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-400/40">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
              Շնորհավորանքներ! · ¡Felicitaciones!
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Слово разгадано: <span className="text-amber-400">{targetWord}</span>!
            </h2>
            <p className="text-sm text-emerald-400 font-semibold mt-1">
              🇦🇲 Թարգմանություն: {currentSecret.hyTranslation}
            </p>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 my-5 text-left text-xs space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span>Ընդհանուր միավորներ:</span>
                <strong className="text-amber-400 text-sm">{score}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Բացատրություն:</span>
                <span className="text-slate-300">{currentSecret.hintHy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Իսպաներեն օրինակ:</span>
                <span className="text-amber-300 italic">"El jugador juega muy bien."</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => sounds.speakSpanish(targetWord)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Լսել արտասանությունը</span>
              </button>
              <button
                onClick={handleNextWord}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Следующее слово · Հաջորդ բառը
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
