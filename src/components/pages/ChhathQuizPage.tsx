import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Brain, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Share2, 
  ShieldCheck, 
  Lock, 
  LogIn, 
  Sparkles, 
  Trophy, 
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { chhathQuizQuestions } from '../../data/quizData';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';
import confetti from 'canvas-confetti';

interface QuizUserRecord {
  highScore: number;
  totalAttempts: number;
  lastPlayedAt: string;
  badge: string;
}

interface ChhathQuizPageProps {
  onNavigate: (tab: string) => void;
}

export const ChhathQuizPage: React.FC<ChhathQuizPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal, signInWithGoogle } = useAuth();

  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userRecord, setUserRecord] = useState<QuizUserRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter questions based on selected difficulty
  const questions = chhathQuizQuestions.filter(
    q => difficulty === 'all' || q.difficulty === difficulty
  );
  const currentQ = questions[currentIdx] || questions[0];

  // Load user score record from localStorage (Real user persistent data!)
  useEffect(() => {
    if (currentUser?.id) {
      try {
        const saved = localStorage.getItem(`chhath_user_quiz_${currentUser.id}`);
        if (saved) {
          setUserRecord(JSON.parse(saved));
        } else {
          setUserRecord({
            highScore: 0,
            totalAttempts: 0,
            lastPlayedAt: '',
            badge: 'नया साधक'
          });
        }
      } catch {
        setUserRecord(null);
      }
    } else {
      setUserRecord(null);
    }
  }, [currentUser]);

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
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    // Save to user's real persistent account
    if (currentUser?.id) {
      const prevHigh = userRecord?.highScore || 0;
      const newHigh = Math.max(prevHigh, score + (selectedOption === currentQ.correctIndex ? 1 : 0));
      const newAttempts = (userRecord?.totalAttempts || 0) + 1;
      
      let newBadge = 'छठ साधक';
      const pct = (newHigh / questions.length) * 100;
      if (pct >= 85) newBadge = 'छठ संस्कृति विद्वान 🌟';
      else if (pct >= 60) newBadge = 'संस्कृति मर्मज्ञ 🪔';

      const updatedRecord: QuizUserRecord = {
        highScore: newHigh,
        totalAttempts: newAttempts,
        lastPlayedAt: new Date().toISOString(),
        badge: newBadge
      };

      try {
        localStorage.setItem(`chhath_user_quiz_${currentUser.id}`, JSON.stringify(updatedRecord));
        setUserRecord(updatedRecord);
      } catch {}
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  const handleShare = () => {
    const text = `मैंने छठ महापर्व ज्ञान क्विज में ${score}/${questions.length} अंक प्राप्त किए! जय छठी मईया 🙏\nआप भी खेलें: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'छठ महापर्व 2026 ज्ञान क्विज',
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('🔗 स्कोर लिंक कॉपी किया गया!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 font-mukta flex flex-col">
      <SeoHead
        title="छठ महापर्व ज्ञान क्विज | Chhath Puja Quiz 2026"
        description="छठ महापर्व, इतिहास, विधि एवं परंपराओं से जुड़े प्रामाणिक प्रश्नों के उत्तर दें और अपना ज्ञान परखें।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/chhath-quiz/"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-3 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-all cursor-pointer"
            title="होम पर जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-rozha text-stone-950 leading-tight">
                छठ महापर्व ज्ञान क्विज
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-700 font-semibold leading-none">
                संस्कृति, विधि एवं इतिहास बोध
              </p>
            </div>
          </div>
        </div>

        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-2">
            {userRecord && userRecord.highScore > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>रिकॉर्ड: {userRecord.highScore}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="truncate max-w-[100px]">{currentUser.name || 'सत्यापित'}</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('login', 'अपना क्विज स्कोर अपने खाते में सुरक्षित करने हेतु लॉगिन करें')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>लॉगिन</span>
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-6 space-y-6 flex-1">
        
        {/* Auth status banner if guest */}
        {!isAuthenticated && (
          <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-700 font-bold text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>स्कोर सेविंग सुविधा</span>
              </div>
              <p className="text-xs text-stone-600">
                लॉगिन करने पर आपका क्विज रिकॉर्ड और पदक आपके स्थायी खाते में सुरक्षित रहेगा।
              </p>
            </div>
            <button
              type="button"
              onClick={() => signInWithGoogle?.()}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>लॉगिन करें</span>
            </button>
          </div>
        )}

        {/* User Stats Card if logged in */}
        {isAuthenticated && userRecord && userRecord.totalAttempts > 0 && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span>{userRecord.badge}</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  कुल खेल: {userRecord.totalAttempts} बार • सर्वश्रेष्ठ: {userRecord.highScore} अंक
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              खाते में सुरक्षित
            </span>
          </div>
        )}

        {/* Level Filters */}
        <div className="flex items-center justify-center gap-2">
          {[
            { id: 'all', label: 'सभी स्तर' },
            { id: 'easy', label: 'सरल' },
            { id: 'medium', label: 'मध्यम' },
            { id: 'hard', label: 'कठिन' }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDifficulty(d.id as typeof difficulty);
                handleRestart();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                difficulty === d.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Quiz Playing Card */}
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm relative space-y-6">
          
          {!showResult ? (
            <div className="space-y-6">
              {/* Progress & Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>प्रश्न {currentIdx + 1} / {questions.length}</span>
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  स्कोर: {score}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h2 className="font-rozha text-lg sm:text-2xl font-bold text-stone-950 leading-snug">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = "bg-stone-50 border-stone-200 hover:border-amber-400 text-stone-800";

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-rose-50 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-500";
                    } else {
                      btnStyle = "bg-stone-50 border-stone-200 text-stone-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-medium">{option}</span>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-stone-800 space-y-1 animate-in fade-in">
                  <div className="text-amber-800 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>ज्ञान सूत्र (Explanation):</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Question / Finish Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>{currentIdx < questions.length - 1 ? 'अगला प्रश्न' : 'परिणाम देखें'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-20 h-20 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-md">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-950">
                  क्विज संपन्न! जय छठी मईया 🙏
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  छठ महापर्व के प्रश्नों में आपका प्रदर्शन:
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 max-w-sm mx-auto space-y-1">
                <span className="text-xs text-stone-500 block">प्राप्तांक (Score)</span>
                <span className="font-rozha text-4xl font-extrabold text-amber-700">
                  {score} / {questions.length}
                </span>
                <p className="text-xs font-bold text-stone-800 pt-1">
                  {score >= questions.length * 0.8 
                    ? 'अद्भुत! आप छठ संस्कृति के सच्चे ज्ञाता हैं 🌟' 
                    : score >= questions.length * 0.5 
                      ? 'बहुत बढ़िया! आपकी आस्था और समझ सराहनीय है 👍' 
                      : 'छठ के बारे में और जानने हेतु पुनः प्रयास करें 🙏'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुनः खेलें</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'कॉपी हुआ' : 'स्कोर शेयर करें'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
};
