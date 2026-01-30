import React, { useState, useEffect, useCallback } from 'react';
import { generateFlashcards } from './services/geminiService';
import { FlashcardData, Preposition, GameState } from './types';
import { Flashcard } from './components/Flashcard';
import { Button } from './components/Button';
import { FALLBACK_CARDS } from './constants';
import { Trophy, Flame, Loader2, RotateCw } from 'lucide-react';
import { clsx } from 'clsx';

const App: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>({ score: 0, streak: 0, highScore: 0 });
  const [userAnswer, setUserAnswer] = useState<Preposition | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    loadInitialCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch Logic
  const loadInitialCards = async () => {
    setLoading(true);
    try {
      const newCards = await generateFlashcards(5);
      if (newCards.length > 0) {
        setCards(newCards);
      } else {
        // Fallback if API fails or quota exceeded
        console.warn("Using fallback cards due to API issue");
        setCards(FALLBACK_CARDS);
        setError("AI Generation failed. Using offline mode.");
      }
    } catch (e) {
      setCards(FALLBACK_CARDS);
      setError("Network error. Using offline mode.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreCards = useCallback(async () => {
    if (fetchingMore) return;
    setFetchingMore(true);
    try {
      const newCards = await generateFlashcards(5);
      setCards(prev => [...prev, ...newCards]);
    } catch (e) {
      console.error("Failed to fetch more cards");
    } finally {
      setFetchingMore(false);
    }
  }, [fetchingMore]);

  // Pre-fetch when getting close to end
  useEffect(() => {
    if (cards.length > 0 && currentIndex >= cards.length - 2) {
      fetchMoreCards();
    }
  }, [currentIndex, cards.length, fetchMoreCards]);

  const handleAnswer = (prep: Preposition) => {
    if (userAnswer) return; // Prevent double answer

    const currentCard = cards[currentIndex];
    const correct = currentCard.correctPreposition === prep;
    
    setUserAnswer(prep);
    setIsCorrect(correct);

    setGameState(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        score: correct ? prev.score + 10 + (newStreak * 2) : prev.score,
        streak: newStreak,
        highScore: Math.max(prev.highScore, correct ? prev.score + 10 + (newStreak * 2) : prev.score)
      };
    });
  };

  const nextCard = () => {
    setUserAnswer(null);
    setIsCorrect(null);
    setCurrentIndex(prev => (prev + 1) % cards.length); // Loop if fallback only
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-200">
      
      {/* Top Navigation / Stats */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">P</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Prépoflex</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1.5 text-orange-500">
              <Flame className={clsx("w-5 h-5", gameState.streak > 2 && "animate-pulse")} fill={gameState.streak > 0 ? "currentColor" : "none"} />
              <span>{gameState.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Trophy className="w-5 h-5" />
              <span>{gameState.score}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center min-h-[calc(100vh-64px)]">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 animate-pulse">Generating your lesson...</p>
          </div>
        ) : (
          <>
            <div className="w-full mb-8 flex justify-between items-end">
               <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-1">À or De?</h1>
                  <p className="text-slate-500">Master French verb prepositions.</p>
               </div>
               {error && (
                 <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md border border-orange-200">
                   Offline Mode
                 </span>
               )}
            </div>

            {currentCard && (
              <div className="w-full flex flex-col items-center gap-8">
                <Flashcard 
                  data={currentCard}
                  onAnswer={handleAnswer}
                  userAnswer={userAnswer}
                  isCorrect={isCorrect}
                />

                <div className="h-16 w-full max-w-lg flex justify-center items-center">
                  {userAnswer && (
                    <Button 
                      onClick={nextCard} 
                      className="animate-in fade-in slide-in-from-bottom-4 duration-300 w-full shadow-xl"
                      variant={isCorrect ? "primary" : "secondary"}
                    >
                      {isCorrect ? "Continue" : "Try Next"}
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {!currentCard && !loading && (
               <div className="text-center mt-20">
                  <p>No cards available.</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">Reload App</Button>
               </div>
            )}
          </>
        )}

        {/* Footer info */}
        <div className="mt-auto py-6 text-center">
           <p className="text-xs text-slate-400">
             Powered by Gemini 2.5 Flash • Built with React & Tailwind
           </p>
        </div>
      </main>
    </div>
  );
};

export default App;
