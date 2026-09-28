import React, { useState } from 'react';
import { PoleChudesGame } from './PoleChudesGame';
import { FruitsAndDaysGame } from './FruitsAndDaysGame';
import { QuestionsList } from './QuestionsList';
import { sounds } from './audio';
import { 
  Trophy, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkles, 
  Apple, 
  RotateCcw 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pole' | 'fruits_days' | 'questions'>('pole');
  const [score, setScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Contract (Single-line wordmark, 4-6 nav links, 1-2 primary actions) */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text wordmark */}
          <button 
            onClick={() => setActiveTab('pole')}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Campo de las Maravillas
          </button>

          {/* Zone 2: Clean Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('pole')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pole'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Поле чудес (JUGADOR)</span>
            </button>

            <button
              onClick={() => setActiveTab('fruits_days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fruits_days'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Фрукты и Дни недели</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`hidden md:flex px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer items-center gap-1.5 ${
                activeTab === 'questions'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>50 вопросов (Presente)</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Score & Sound) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Очки:</span>
              <strong className="text-amber-400 font-bold tabular-nums">{score}</strong>
            </div>

            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                sounds.setEnabled(next);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
              title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
              aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner with Armenian-Spanish Learning Promise */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-slate-800 to-slate-900 border border-amber-500/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              🇪🇸
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                Սովորեք իսպաներեն հայերենով խաղային ձևով · Изучайте испанский с армянским переводом
              </p>
              <p className="text-[11px] text-slate-400">
                Առանց ժամանակի և սնանկացման (без времени и банкрота) · Սեղմեք իսպաներեն տեքստի վրա թարգմանության համար
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setScore(0)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              title="Сбросить счет"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Сбросить очки</span>
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'pole' && (
          <PoleChudesGame
            score={score}
            setScore={setScore}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        )}

        {activeTab === 'fruits_days' && (
          <FruitsAndDaysGame score={score} setScore={setScore} />
        )}

        {activeTab === 'questions' && (
          <QuestionsList />
        )}
      </main>

      {/* Clean quiet footer without ornamental clutter */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Campo de las Maravillas · Իսպաներեն և Հայերեն ուսուցողական խաղ</span>
          <span>50 preguntas Presente · 15 Frutas · 15 Días de la semana</span>
        </div>
      </footer>
    </div>
  );
}
