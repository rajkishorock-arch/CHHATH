import React, { useState } from 'react';
import { chhathQuizQuestions } from '../../data/quizData';
import { useLanguage } from '../../context/LanguageContext';
import { Brain, CheckCircle, XCircle, RefreshCw, Award, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChhathQuiz: React.FC = () => {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = chhathQuizQuestions.filter(
    q => difficulty === 'all' || q.difficulty === difficulty
  );

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  return (
    <section id="quiz" className="section-padding bg-gradient-to-b from-transparent via-amber-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <Brain className="w-3.5 h-3.5" />
            <span>ज्ञानवर्धन एवं संस्कृति बोध</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.quizTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            छठ महापर्व की समृद्ध परंपरा, इतिहास एवं पौराणिक कथाओं से जुड़े रोचक प्रश्नों के उत्तर देकर अपना ज्ञान परखें।
          </p>
        </div>

        {/* Difficulty Selector Pills */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'सभी स्तर (All)' },
            { id: 'easy', label: 'सरल (Easy)' },
            { id: 'medium', label: 'मध्यम (Medium)' },
            { id: 'hard', label: 'कठिन (Hard)' }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDifficulty(d.id as typeof difficulty);
                handleRestart();
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                difficulty === d.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-500/20'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Quiz Card */}
        <div className="chhath-card p-6 sm:p-10 max-w-2xl mx-auto border-amber-500/30 shadow-2xl relative font-mukta">
          
          {!showResult ? (
            <div className="space-y-6">
              
              {/* Question Progress Header */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <span className="text-xs font-bold text-orange-600 dark:text-amber-400 uppercase tracking-wider">
                  प्रश्न {currentIdx + 1} / {questions.length} • स्तर: {currentQ.difficulty}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  वर्तमान स्कोर: {score}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="font-mukta font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = "bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-amber-500/40 text-stone-800 dark:text-stone-200";

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-red-500/20 border-red-500 text-red-800 dark:text-red-300 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between text-sm ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box on Answer */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-stone-700 dark:text-stone-300 space-y-1 animate-in fade-in">
                  <strong className="text-orange-600 dark:text-amber-400 block font-bold">
                    ज्ञान सूत्र (Explanation):
                  </strong>
                  <p>{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Question CTA */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="btn-primary text-xs py-2.5 px-6 flex items-center gap-1.5"
                  >
                    <span>{currentIdx < questions.length - 1 ? 'अगला प्रश्न' : 'परिणाम देखें (View Score)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-2xl">
                <Award className="w-10 h-10" />
              </div>

              <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                क्विज संपन्न! जय छठी मईया 🙏
              </h3>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-sm mx-auto">
                <span className="text-xs text-stone-500 block mb-1">आपका प्राप्तांक (Score):</span>
                <span className="font-rozha text-4xl font-bold text-orange-600 dark:text-amber-400">
                  {score} / {questions.length}
                </span>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-2">
                  {score >= questions.length * 0.8 
                    ? 'अद्भुत! आप छठ संस्कृति के सच्चे ज्ञाता हैं 🌟' 
                    : score >= questions.length * 0.5 
                      ? 'बहुत बढ़िया! आपकी आस्था और समझ सराहनीय है 👍' 
                      : 'छठ के बारे में और जानने हेतु वेबसाइट का अध्ययन करें 🙏'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRestart}
                  className="btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>पुनः क्विज खेलें (Retry Quiz)</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
