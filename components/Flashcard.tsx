import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashcardData, Preposition } from '../types';
import { CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface FlashcardProps {
  data: FlashcardData;
  onAnswer: (prep: Preposition) => void;
  userAnswer: Preposition | null;
  isCorrect: boolean | null;
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, onAnswer, userAnswer, isCorrect }) => {
  const isAnswered = userAnswer !== null;

  // Split sentence by the placeholder to styling it specifically
  const parts = data.sentenceFrench.split('___');

  return (
    <div className="w-full max-w-lg mx-auto perspective-1000">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
        className={clsx(
          "relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 transition-colors duration-500",
          isAnswered && isCorrect ? "border-green-400 shadow-green-200" : 
          isAnswered && !isCorrect ? "border-red-400 shadow-red-200" : 
          "border-white/50"
        )}
      >
        {/* Header / Verb Title */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/90">
             <Sparkles size={18} />
             <span className="uppercase text-xs font-bold tracking-wider">Verb Focus</span>
          </div>
          <h2 className="text-2xl font-bold text-white capitalize">{data.verb}</h2>
        </div>

        <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          
          {/* The Sentence */}
          <div className="text-center mb-8">
            <p className="text-2xl text-slate-800 font-medium leading-relaxed">
              {parts[0]}
              <span className={clsx(
                "inline-block px-3 py-1 mx-1 rounded-lg border-2 font-bold min-w-[3rem] align-middle transition-all",
                !isAnswered ? "border-dashed border-gray-300 bg-gray-50 text-transparent" : "",
                isAnswered && isCorrect ? "border-green-500 bg-green-50 text-green-700" : "",
                isAnswered && !isCorrect ? "border-red-500 bg-red-50 text-red-700" : ""
              )}>
                {isAnswered ? data.correctPreposition : "?"}
              </span>
              {parts[1]}
            </p>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            {(['à', 'de'] as Preposition[]).map((prep) => {
              const isSelected = userAnswer === prep;
              const isThisCorrect = data.correctPreposition === prep;
              
              let buttonStyle = "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600";
              
              if (isAnswered) {
                if (isThisCorrect) {
                  buttonStyle = "bg-green-500 border-green-600 text-white ring-2 ring-green-300 ring-offset-2";
                } else if (isSelected && !isThisCorrect) {
                  buttonStyle = "bg-red-500 border-red-600 text-white opacity-50";
                } else {
                  buttonStyle = "bg-gray-100 text-gray-400 border-transparent opacity-50";
                }
              }

              return (
                <button
                  key={prep}
                  onClick={() => !isAnswered && onAnswer(prep)}
                  disabled={isAnswered}
                  className={clsx(
                    "h-20 text-3xl font-bold rounded-2xl border-b-4 transition-all duration-200 active:border-b-0 active:translate-y-1 flex items-center justify-center",
                    buttonStyle
                  )}
                >
                  {prep}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="w-full"
              >
                <div className={clsx(
                  "rounded-xl p-4 mb-2 flex items-start gap-3",
                  isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                )}>
                  {isCorrect ? <CheckCircle2 className="shrink-0 mt-0.5" /> : <XCircle className="shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-bold text-lg mb-1">{isCorrect ? "Excellent!" : "Not quite..."}</p>
                    <p className="text-sm opacity-90">{data.explanation}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 text-slate-600">
                  <Info className="shrink-0 mt-0.5 w-5 h-5" />
                  <p className="text-sm italic">"{data.translationEnglish}"</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
};
