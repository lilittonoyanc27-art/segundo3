import React, { useState } from 'react';
import { PRESENTE_QUESTIONS, Question } from './data';
import { sounds } from './audio';
import { Volume2, Eye, EyeOff, Search } from 'lucide-react';

interface QuestionsListProps {
  onSelectQuestionForGame?: (q: Question) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ onSelectQuestionForGame }) => {
  const [search, setSearch] = useState<string>('');
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [filterPerson, setFilterPerson] = useState<string>('all');

  const toggleTranslation = (id: number) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const revealAll = () => {
    setRevealedIds(new Set(PRESENTE_QUESTIONS.map((q) => q.id)));
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  const filteredQuestions = PRESENTE_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.esPrompt.toLowerCase().includes(search.toLowerCase()) ||
      q.hyPrompt.toLowerCase().includes(search.toLowerCase()) ||
      q.fullSentenceEs.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterPerson === 'yo') return q.esPrompt.startsWith('Yo ');
    if (filterPerson === 'tu') return q.esPrompt.startsWith('Tú ');
    if (filterPerson === 'nosotros') return q.esPrompt.startsWith('Nosotros ');
    if (filterPerson === 'ellos') return q.esPrompt.startsWith('Ellos ') || q.esPrompt.startsWith('Ellas ');
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>50 Вопросов на Presente de Indicativo · Ներկա ժամանակ</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Բոլոր 50 նախադասությունները իսպաներենով և հայերենով: Սեղմեք իսպաներեն տեքստի վրա թարգմանության և արտասանության համար:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={revealAll}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg font-medium transition-colors cursor-pointer"
            >
              Բացել բոլոր թարգմանությունները
            </button>
            <button
              onClick={hideAll}
              className="px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-400 text-xs rounded-lg font-medium transition-colors cursor-pointer"
            >
              Թաքցնել
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-700/60">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Փնտրել բառ կամ նախադասություն..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setFilterPerson('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterPerson === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Բոլորը (50)
            </button>
            <button
              onClick={() => setFilterPerson('yo')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterPerson === 'yo' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yo (Ես)
            </button>
            <button
              onClick={() => setFilterPerson('tu')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterPerson === 'tu' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tú (Դու)
            </button>
            <button
              onClick={() => setFilterPerson('nosotros')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterPerson === 'nosotros' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nosotros (Մենք)
            </button>
            <button
              onClick={() => setFilterPerson('ellos')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterPerson === 'ellos' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ellos/Ellas (Նրանք)
            </button>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredQuestions.map((q) => {
          const isOpen = revealedIds.has(q.id);
          const correctOpt = q.options.find((o) => o.key === q.correctAnswer);

          return (
            <div
              key={q.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 transition-all hover:border-slate-600 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-400">
                    Вопрос #{q.id}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Պատասխան: <strong className="text-emerald-400">{q.correctAnswer}) {correctOpt?.text}</strong>
                  </span>
                </div>

                {/* Spanish Sentence */}
                <div className="flex items-start justify-between gap-2">
                  <p
                    onClick={() => {
                      toggleTranslation(q.id);
                      sounds.speakSpanish(q.fullSentenceEs);
                    }}
                    className="text-base font-semibold text-slate-100 hover:text-amber-300 cursor-pointer select-none transition-colors"
                  >
                    🇪🇸 {q.esPrompt}
                  </p>
                  <button
                    onClick={() => sounds.speakSpanish(q.fullSentenceEs)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors shrink-0"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Armenian Translation */}
                <div
                  onClick={() => toggleTranslation(q.id)}
                  className={`mt-2.5 pt-2 border-t border-slate-700/60 text-xs cursor-pointer transition-colors flex items-center justify-between ${
                    isOpen ? 'text-emerald-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-emerald-400">🇦🇲 Հայերեն:</span>
                    <span>{isOpen ? q.hyPrompt : 'Սեղմեք թարգմանության համար...'}</span>
                  </div>
                  <span>{isOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</span>
                </div>
              </div>

              {/* 4 Choices pill row */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-slate-700/40 text-[11px]">
                {q.options.map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => sounds.speakSpanish(opt.text)}
                    className={`p-1 rounded text-center cursor-pointer transition-colors ${
                      opt.key === q.correctAnswer
                        ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 font-bold'
                        : 'bg-slate-900/60 border border-slate-750 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.key}) {opt.text}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
