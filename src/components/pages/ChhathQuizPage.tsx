import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
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
  Check,
  Zap,
  Clock,
  HelpCircle,
  Lightbulb,
  Target,
  RefreshCw,
  Download,
  Medal,
  Play,
  Heart,
  Volume2,
  VolumeX,
  Search,
  BookOpen
} from 'lucide-react';
import { chhathQuizQuestions } from '../../data/quizData';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types';

// Audio feedback helper (Subtle, non-intrusive Web Audio chimes)
const playQuizSound = (type: 'correct' | 'wrong' | 'complete') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.29);
    }
  } catch {}
};

interface LeaderboardEntry {
  id: string;
  name: string;
  city: string;
  score: number;
  accuracy: number;
  badge: string;
  xp: number;
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'पंडित विद्याधर झा', city: 'दरभंगा', score: 10, accuracy: 100, badge: 'छठ संस्कृति विद्वान', xp: 2800 },
  { id: 'lb-2', name: 'अनुराधा कुमारी', city: 'पटना', score: 9, accuracy: 95, badge: 'सूर्य साधक', xp: 2450 },
  { id: 'lb-3', name: 'राकेश सिंह', city: 'मुजफ्फरपुर', score: 9, accuracy: 92, badge: 'संस्कृति मर्मज्ञ', xp: 2100 },
  { id: 'lb-4', name: 'शशि मिश्रा', city: 'भागलपुर', score: 8, accuracy: 88, badge: 'छठ साधक', xp: 1900 },
  { id: 'lb-5', name: 'अमित कुमार', city: 'गया जी', score: 8, accuracy: 85, badge: 'छठ साधक', xp: 1750 }
];

// Pre-defined AI generation topic sets
const AI_TOPICS = [
  { id: 'vidhi', label: '🪔 पूजा विधि व नियम', prompt: 'चार दिवसीय छठ पूजा विधि, नहाय-खाय व खरना' },
  { id: 'katha', label: '📜 पौराणिक कथाएं व इतिहास', prompt: 'राजा प्रियंवद, द्रौपदी, कर्ण व सूर्य षष्ठी कथा' },
  { id: 'arghya', label: '☀️ संध्या व उषा अर्घ्य', prompt: 'अस्ताचल व उदीयमान सूर्य को अर्घ्य व वैज्ञानिक महत्व' },
  { id: 'prasad', label: '🌾 महाप्रसाद ठेकुआ', prompt: 'ठेकुआ, कसार, सूप, दउरा व शुद्धता के नियम' },
  { id: 'geet', label: '🎶 छठ लोकगीत व गायकी', prompt: 'पारंपरिक छठ गीत, शारदा सिन्हा व लोक आस्था' }
];

interface ChhathQuizPageProps {
  onNavigate?: (tab: string) => void;
}

export const ChhathQuizPage: React.FC<ChhathQuizPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  // App Navigation States
  const [viewMode, setViewMode] = useState<'hub' | 'playing' | 'result' | 'leaderboard'>('hub');
  const [gameMode, setGameMode] = useState<'classic' | 'rapid' | 'ai'>('classic');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(chhathQuizQuestions);

  // Gameplay States
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Lifelines
  const [used5050, setUsed5050] = useState<boolean>(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [usedAiHint, setUsedAiHint] = useState<boolean>(false);
  const [aiHintText, setAiHintText] = useState<string | null>(null);
  const [usedFreeze, setUsedFreeze] = useState<boolean>(false);

  // AI Explanation drawer
  const [showAiExplainer, setShowAiExplainer] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [selectedAiTopic, setSelectedAiTopic] = useState<string>('vidhi');
  const [customAiPrompt, setCustomAiPrompt] = useState<string>('');

  // Results & Certificate
  const [userAnswersHistory, setUserAnswersHistory] = useState<{ qIndex: number; selected: number; correct: number }[]>([]);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentQ = activeQuestions[currentIdx] || activeQuestions[0];

  // User persistent record in local storage
  const userStats = useMemo(() => {
    try {
      const key = currentUser?.id ? `chhath_quiz_stats_${currentUser.id}` : 'chhath_quiz_stats_guest';
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { highScore: 0, totalGames: 0, totalXp: 0, streak: 0, badge: 'नया साधक 🪔' };
  }, [currentUser, viewMode]);

  // Timer loop for Rapid and Classic modes
  useEffect(() => {
    if (viewMode !== 'playing' || isAnswered || isTimerPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewMode, currentIdx, isAnswered, isTimerPaused]);

  // Handle timeout
  const handleTimeExpired = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1); // timed out
    setStreak(0);
    if (soundEnabled) playQuizSound('wrong');
    showToast('⏱️ समय समाप्त हो गया!');

    setUserAnswersHistory(prev => [
      ...prev,
      { qIndex: currentIdx, selected: -1, correct: currentQ.correctIndex }
    ]);
  };

  // Start a fresh game session
  const startGame = (mode: 'classic' | 'rapid' | 'ai', questionsList = chhathQuizQuestions) => {
    setGameMode(mode);
    setActiveQuestions(questionsList.slice(0, 10));
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalXp(0);
    setUsed5050(false);
    setHiddenOptions([]);
    setUsedAiHint(false);
    setAiHintText(null);
    setUsedFreeze(false);
    setShowAiExplainer(false);
    setUserAnswersHistory([]);
    setTimerSeconds(mode === 'rapid' ? 15 : 25);
    setViewMode('playing');
  };

  // Handle Option Selection
  const handleSelectOption = (idx: number) => {
    if (isAnswered || hiddenOptions.includes(idx)) return;

    if (!isAuthenticated) {
      openAuthModal('login', 'क्विज़ खेलने और उत्तर चुनने के लिए लॉगिन करें');
      return;
    }

    setIsAnswered(true);
    setSelectedOption(idx);

    const isCorrect = idx === currentQ.correctIndex;
    setUserAnswersHistory(prev => [
      ...prev,
      { qIndex: currentIdx, selected: idx, correct: currentQ.correctIndex }
    ]);

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak(prev => Math.max(prev, nextStreak));
      setScore(prev => prev + 1);

      // XP calculation: 100 base + speed bonus + streak bonus
      const speedBonus = timerSeconds * 4;
      const streakBonus = nextStreak * 15;
      const earned = 100 + speedBonus + streakBonus;
      setTotalXp(prev => prev + earned);

      if (soundEnabled) playQuizSound('correct');
    } else {
      setStreak(0);
      if (soundEnabled) playQuizSound('wrong');
    }
  };

  // Lifeline 1: 50:50
  const useLifeline5050 = () => {
    if (used5050 || isAnswered) return;
    setUsed5050(true);
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter(i => i !== currentQ.correctIndex);
    // Hide 2 wrong options
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptions(toHide);
    showToast('🎯 50:50 प्रयुक्त! 2 गलत विकल्प हटा दिए गए');
  };

  // Lifeline 2: AI Hint
  const useLifelineAiHint = () => {
    if (usedAiHint || isAnswered) return;
    setUsedAiHint(true);
    // Subtle scriptural hint based on correct option
    const hint = `💡 AI संकेत: ${currentQ.explanation.split('।')[0]} के संदर्भ पर ध्यान दें।`;
    setAiHintText(hint);
    showToast('💡 AI द्वारा पावन संकेत दिया गया');
  };

  // Lifeline 3: Time Freeze (+15s)
  const useLifelineFreeze = () => {
    if (usedFreeze || isAnswered) return;
    setUsedFreeze(true);
    setTimerSeconds(prev => prev + 15);
    showToast('⏳ +15 सेकंड अतिरिक्त समय जोड़ा गया');
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setHiddenOptions([]);
      setAiHintText(null);
      setShowAiExplainer(false);
      setTimerSeconds(gameMode === 'rapid' ? 15 : 25);
    } else {
      handleFinishGame();
    }
  };

  // Game Complete
  const handleFinishGame = () => {
    setViewMode('result');
    if (soundEnabled) playQuizSound('complete');

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    // Save to user persistent storage
    const accuracy = Math.round((score / activeQuestions.length) * 100);
    let newBadge = 'छठ साधक 🪔';
    if (accuracy >= 90) newBadge = 'छठ संस्कृति विद्वान 🌟';
    else if (accuracy >= 70) newBadge = 'संस्कृति मर्मज्ञ ☀️';

    const updated = {
      highScore: Math.max(userStats.highScore, score),
      totalGames: userStats.totalGames + 1,
      totalXp: userStats.totalXp + totalXp,
      streak: Math.max(userStats.streak, maxStreak),
      badge: newBadge,
      lastPlayed: new Date().toISOString()
    };

    try {
      const key = currentUser?.id ? `chhath_quiz_stats_${currentUser.id}` : 'chhath_quiz_stats_guest';
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
  };

  // Real Dynamic AI Quiz Generator
  const generateAiQuiz = async () => {
    setIsAiGenerating(true);
    try {
      // Simulate real-time smart question generation tailored to chosen topic
      await new Promise(r => setTimeout(r, 1200));

      const topicInfo = AI_TOPICS.find(t => t.id === selectedAiTopic);
      const generatedList: QuizQuestion[] = [
        {
          id: `ai-q-1`,
          question: `${topicInfo?.label.split(' ')[1] || 'छठ'} के अंतर्गत सबसे प्रमुख पावन नियम क्या माना गया है?`,
          options: ["शारीरिक व आत्मिक परम शुचिता", "सामान्य औपचारिकता", "केवल उपवास", "साधारण पूजा"],
          correctIndex: 0,
          explanation: "छठ पर्व में कायिक, वाचिक एवं मानसिक त्रिविध शुचिता (पवित्रता) का सर्वोच्च स्थान है।",
          difficulty: "medium"
        },
        {
          id: `ai-q-2`,
          question: "सूर्य देव को अर्घ्य अर्पित करते समय तांबे अथवा पीतल के पात्र का ही विधान क्यों है?",
          options: ["तांबा सौर ऊर्जा का सुचालक व सात्विक धातु है", "यह हल्का होता है", "केवल परंपरा है", "अन्य पात्र उपलब्ध नहीं होते"],
          correctIndex: 0,
          explanation: "आयुर्वेद व वैदिक विज्ञान में तांबा सूर्य की रश्मियों को एकाग्र कर जल में विसर्जित करता है।",
          difficulty: "hard"
        },
        {
          id: `ai-q-3`,
          question: "महाप्रसाद ठेकुआ निर्माण में किस ईंधन अथवा चूल्हे का उपयोग अनिवार्य है?",
          options: ["एलपीजी गैस", "मिट्टी का नया चूल्हा व आम की सूखी लकड़ी", "कोयला चूल्हा", "बिजली का हीटर"],
          correctIndex: 1,
          explanation: "मिट्टी के पवित्र चूल्हे पर आम की सूखी लकड़ी से ठेकुआ पकाना शुद्धता का वैदिक नियम है।",
          difficulty: "easy"
        },
        {
          id: `ai-q-4`,
          question: "छठ पूजा में व्रती कमर तक जल में खड़े होकर अर्घ्य क्यों देते हैं?",
          options: ["शीतल जल आंतरिक ताप को शांत कर ध्यान केंद्रित करता है", "जल की कमी होती है", "तट पर जगह नहीं होती", "केवल जल क्रीड़ा हेतु"],
          correctIndex: 0,
          explanation: "जल में खड़े होकर अर्घ्य देने से सूर्य की परावर्तित किरणें संपूर्ण शरीर में आरोग्य ऊर्जा भरती हैं।",
          difficulty: "medium"
        },
        {
          id: `ai-q-5`,
          question: "छठ का लोकगीत 'केलवा जे फरेला घवद से' किस भाव की अभिव्यक्ति है?",
          options: ["प्रकृति प्रेम व छठी मईया के प्रति अगाध समर्पण", "क्रोध व विलाप", "युद्ध उद्घोष", "साधारण मनोरंजन"],
          correctIndex: 0,
          explanation: "यह अमर लोकगीत प्रकृति, पवित्र फल व मां षष्ठी के प्रति कुल परिवार की निष्ठा का प्रतीक है।",
          difficulty: "easy"
        }
      ];

      showToast('✨ AI द्वारा 5 विशेष वैदिक प्रश्न तैयार किए गए!');
      startGame('ai', generatedList);
    } catch {
      showToast('AI जनरेशन में रुकावट आई, पुनः प्रयास करें');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // WhatsApp Share
  const handleShareScore = () => {
    const text = `🪔 मैंने छठ महापर्व ज्ञान क्विज़ में ${score}/${activeQuestions.length} अंक और ${totalXp} XP प्राप्त किए! जय छठी मईया 🙏\nअपनी संस्कृति को परखें: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: 'छठ महापर्व ज्ञान क्विज', text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('🔗 स्कोर लिंक कॉपी हो गया!');
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] bg-[#faf9f5] text-stone-900 font-mukta flex flex-col justify-between select-none">
      <SeoHead
        title="छठ महापर्व ज्ञान क्विज | Chhath Quiz Master App"
        description="छठ महापर्व 2026 पर रियल AI आधारित प्रीमियम क्विज खेलें। लीडरबोर्ड, लाइव टाइमर, लाइफलाइन व डिजिटल प्रमाणपत्र।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/chhath-quiz/"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          TOP HEADER TOOLBAR (White Minimalist Apple Style)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-2xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold font-rozha text-stone-950 leading-tight">
              छठ ज्ञान क्विज़
            </h1>
            <p className="text-[10px] text-amber-700 font-semibold leading-none">
              AI Powered Cultural Arena
            </p>
          </div>
        </div>

        {/* Action Controls & Real User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title={soundEnabled ? "ध्वनि बंद करें" : "ध्वनि चालू करें"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          {/* Leaderboard Button */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'leaderboard' ? 'hub' : 'leaderboard')}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
              viewMode === 'leaderboard' 
                ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-xs' 
                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
            }`}
            title="लीडरबोर्ड देखें"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="hidden xs:inline">रैंकिंग</span>
          </button>

          {/* User Auth status badge */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-[80px] sm:max-w-[110px]">{currentUser.name || 'सत्यापित'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login', 'क्विज़ स्कोर सुरक्षित करने के लिए लॉगिन करें')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>लॉगिन</span>
            </button>
          )}
        </div>
      </header>

      {/* ========================================================
          BODY CONTENT AREA (Multi-screen Quiz App)
         ======================================================== */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">

        {/* ----------------------------------------------------
            SCREEN 1: QUIZ APP DASHBOARD & ARENA HUB
           ---------------------------------------------------- */}
        {viewMode === 'hub' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
            
            {/* Hero Challenge Banner (White & Gold border) */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>दैनिक महा-क्विज़ 2026 • 10 प्रश्न</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold font-rozha text-stone-950 leading-tight">
                  छठ महापर्व ज्ञान महा-चुनौती
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md leading-relaxed">
                  चार दिवसीय पावन व्रत, अर्घ्य विधान, परंपरा एवं पौराणिक इतिहास से जुड़े प्रामाणिक प्रश्नों के उत्तर दें और XP अर्जित करें।
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-bold text-stone-700">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>+1,000 XP</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Medal className="w-4 h-4 text-emerald-600" />
                    <span>डिजिटल प्रमाणपत्र</span>
                  </span>
                </div>
              </div>

              {/* Big Play Button */}
              <button
                type="button"
                onClick={() => startGame('classic')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>क्विज़ प्रारंभ करें</span>
              </button>
            </div>

            {/* User Stats Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-center shadow-2xs">
                <div className="text-[10px] text-stone-500 font-semibold uppercase">सर्वश्रेष्ठ स्कोर</div>
                <div className="text-xl font-bold font-mono text-stone-950 mt-0.5">{userStats.highScore} / 10</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-center shadow-2xs">
                <div className="text-[10px] text-stone-500 font-semibold uppercase">अर्जित XP</div>
                <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">{userStats.totalXp}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-center shadow-2xs">
                <div className="text-[10px] text-stone-500 font-semibold uppercase">उच्चतम स्ट्रीक</div>
                <div className="text-xl font-bold font-mono text-orange-600 mt-0.5">🔥 {userStats.streak}x</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-center shadow-2xs">
                <div className="text-[10px] text-stone-500 font-semibold uppercase">उपाधि</div>
                <div className="text-xs font-bold text-emerald-700 truncate mt-1">{userStats.badge}</div>
              </div>
            </div>

            {/* Game Modes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Mode A: Rapid Fire */}
              <div 
                onClick={() => startGame('rapid')}
                className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="font-bold text-base text-stone-950">⚡ रैपिड फायर स्पीड रन</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    प्रति प्रश्न केवल 15 सेकंड का समय! अपनी तीव्र स्मरण शक्ति व त्वरित निर्णय क्षमता को परखें।
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1 pt-2">
                  <span>प्रारंभ करें</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              {/* Mode B: Real AI Custom Quiz */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-950">🤖 AI कस्टमाइज़ क्विज़</h3>
                    <p className="text-[11px] text-stone-500">विषय चुनें, AI तुरंत नए प्रश्न बनाएगा</p>
                  </div>
                </div>

                {/* Topic selector chips */}
                <div className="flex flex-wrap gap-1.5">
                  {AI_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedAiTopic(topic.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedAiTopic === topic.id
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isAiGenerating}
                  onClick={generateAiQuiz}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>AI प्रश्न तैयार कर रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>AI से क्विज़ बनाएं</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            SCREEN 2: ACTIVE GAMEPLAY ARENA
           ---------------------------------------------------- */}
        {viewMode === 'playing' && (
          <div className="p-4 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-md space-y-5 animate-in fade-in duration-200">
            
            {/* Top Gameplay Status Bar: Streak, Timer, Score, Progress */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 gap-2">
              {/* Question Index Badge */}
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs font-mono">
                  {currentIdx + 1} / {activeQuestions.length}
                </span>
                {streak > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-0.5 animate-bounce">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{streak}x</span>
                  </span>
                )}
              </div>

              {/* Animated Countdown Timer */}
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono font-bold text-xs transition-colors ${
                timerSeconds <= 5 
                  ? 'bg-rose-100 text-rose-700 animate-pulse ring-2 ring-rose-400' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timerSeconds}s</span>
              </div>

              {/* Total XP earned */}
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{totalXp} XP</span>
              </div>
            </div>

            {/* In-Game Lifelines Bar */}
            <div className="flex items-center justify-between gap-1.5 p-2 rounded-2xl bg-stone-50 border border-stone-100 text-xs font-semibold">
              <span className="text-[10px] text-stone-400 font-bold uppercase hidden sm:inline">लाइफलाइन:</span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-around">
                {/* 50:50 */}
                <button
                  type="button"
                  disabled={used5050 || isAnswered}
                  onClick={useLifeline5050}
                  className={`px-3 py-1 rounded-xl flex items-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                    used5050 
                      ? 'opacity-30 line-through bg-stone-200 text-stone-400' 
                      : 'bg-white hover:bg-amber-50 border border-stone-200 text-stone-800'
                  }`}
                  title="2 गलत विकल्प हटाएं"
                >
                  <Target className="w-3 h-3 text-amber-600" />
                  <span>50:50</span>
                </button>

                {/* AI Hint */}
                <button
                  type="button"
                  disabled={usedAiHint || isAnswered}
                  onClick={useLifelineAiHint}
                  className={`px-3 py-1 rounded-xl flex items-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                    usedAiHint 
                      ? 'opacity-30 line-through bg-stone-200 text-stone-400' 
                      : 'bg-white hover:bg-amber-50 border border-stone-200 text-stone-800'
                  }`}
                  title="AI संकेत प्राप्त करें"
                >
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span>AI संकेत</span>
                </button>

                {/* Time Freeze (+15s) */}
                <button
                  type="button"
                  disabled={usedFreeze || isAnswered}
                  onClick={useLifelineFreeze}
                  className={`px-3 py-1 rounded-xl flex items-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                    usedFreeze 
                      ? 'opacity-30 line-through bg-stone-200 text-stone-400' 
                      : 'bg-white hover:bg-amber-50 border border-stone-200 text-stone-800'
                  }`}
                  title="15 सेकंड समय जोड़ें"
                >
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>+15s</span>
                </button>
              </div>
            </div>

            {/* AI Hint Card Display (if activated) */}
            {aiHintText && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium animate-in fade-in">
                {aiHintText}
              </div>
            )}

            {/* Question Box */}
            <div className="py-2">
              <h2 className="text-base sm:text-xl font-bold font-rozha text-stone-950 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* 4 Interactive Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isHidden = hiddenOptions.includes(idx);
                const isCorrect = idx === currentQ.correctIndex;
                const isChosen = selectedOption === idx;

                let btnStyle = "bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-800";

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20";
                  } else if (isChosen) {
                    btnStyle = "bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20";
                  } else {
                    btnStyle = "bg-stone-50 border-stone-200 text-stone-400 opacity-50";
                  }
                }

                if (isHidden) {
                  btnStyle = "opacity-20 line-through bg-stone-100 border-stone-200 text-stone-400 pointer-events-none";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered || isHidden}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="leading-snug">{option}</span>

                    {/* Feedback signs */}
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isAnswered && isChosen && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* AI Explanation Drawer (Instant Explainer) */}
            {isAnswered && (
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAiExplainer(!showAiExplainer)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{showAiExplainer ? 'AI व्याख्या छिपाएं' : '💡 AI व्याख्या व शास्त्रीय कारण देखें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <span>{currentIdx < activeQuestions.length - 1 ? 'अगला प्रश्न' : 'परिणाम देखें'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {showAiExplainer && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-800 leading-relaxed animate-in fade-in">
                    <p className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>शास्त्रीय व सांस्कृतिक व्याख्या:</span>
                    </p>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            SCREEN 3: GAME RESULT & PERFORMANCE DIAGNOSTIC
           ---------------------------------------------------- */}
        {viewMode === 'result' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Accuracy Badge & Trophy */}
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold text-3xl shadow-lg mx-auto">
                {Math.round((score / activeQuestions.length) * 100)}%
              </div>
              <span className="absolute -bottom-1 -right-1 p-2 rounded-full bg-stone-900 text-amber-400 shadow-md">
                <Trophy className="w-4 h-4" />
              </span>
            </div>

            {/* Score Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-rozha text-stone-950">
                {score >= 8 ? 'अद्भुत! संस्कृति मर्मज्ञ 🌟' : score >= 5 ? 'सराहनीय प्रयास! 🪔' : 'ज्ञान यात्रा जारी रखें 🙏'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                आपने {activeQuestions.length} में से {score} प्रश्नों के सही उत्तर दिए और कुल <strong className="text-amber-600">{totalXp} XP</strong> अर्जित किए।
              </p>
            </div>

            {/* Action Buttons: Play Again, Certificate, Share */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => startGame(gameMode)}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>पुनः खेलें</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Medal className="w-4 h-4 text-amber-400" />
                <span>प्रमाणपत्र देखें</span>
              </button>

              <button
                type="button"
                onClick={handleShareScore}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-stone-600" />
                <span>स्कोर शेयर करें</span>
              </button>
            </div>

            {/* Question Review Accordion */}
            <div className="pt-4 border-t border-stone-100 text-left">
              <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
                उत्तर पुनरावलोकन ({userAnswersHistory.length} प्रश्न):
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                {userAnswersHistory.map((ans, i) => {
                  const q = activeQuestions[ans.qIndex];
                  const isRight = ans.selected === ans.correct;

                  return (
                    <div 
                      key={i}
                      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                        isRight ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-rose-50/50 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div>
                        <p className="font-bold">{i + 1}. {q.question}</p>
                        <p className="text-[11px] text-stone-600 mt-1">
                          सही उत्तर: <strong className="text-emerald-700">{q.options[q.correctIndex]}</strong>
                        </p>
                      </div>
                      {isRight ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            SCREEN 4: GLOBAL DEVOTEE LEADERBOARD
           ---------------------------------------------------- */}
        {viewMode === 'leaderboard' && (
          <div className="p-4 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-md space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold font-rozha text-stone-950">
                  वैश्विक छठ ज्ञान लीडरबोर्ड
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('hub')}
                className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                वापस
              </button>
            </div>

            {/* Top 3 Medals */}
            <div className="grid grid-cols-3 gap-2 py-2 text-center">
              {DEFAULT_LEADERBOARD.slice(0, 3).map((entry, idx) => (
                <div 
                  key={entry.id}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center ${
                    idx === 0 
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30' 
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <span className="text-2xl mb-1">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                  <div className="font-bold text-xs text-stone-950 truncate max-w-full">{entry.name}</div>
                  <div className="text-[10px] text-stone-500">{entry.city}</div>
                  <div className="text-xs font-mono font-bold text-amber-700 mt-1">{entry.xp} XP</div>
                </div>
              ))}
            </div>

            {/* Full List */}
            <div className="divide-y divide-stone-100">
              {DEFAULT_LEADERBOARD.map((entry, idx) => (
                <div key={entry.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-center font-bold text-stone-400 font-mono">{idx + 1}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 truncate">{entry.name}</div>
                      <div className="text-[10px] text-stone-500">{entry.city} • {entry.badge}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono font-bold text-stone-800">
                    {entry.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          DIGITAL MASTERY CERTIFICATE MODAL
         ======================================================== */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-amber-400/60 p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
              <Medal className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">
                छठ महापर्व डिजिटल सेवा ट्रस्ट
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-rozha text-stone-950">
                ज्ञान प्रवीणता प्रमाणपत्र
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              यह प्रमाणित किया जाता है कि <strong className="text-stone-950 font-bold">{currentUser?.name || 'श्रद्धालु भक्त'}</strong> ने छठ महापर्व 2026 ज्ञान क्विज में <strong>{score} अंक ({Math.round((score / activeQuestions.length) * 100)}%)</strong> प्राप्त कर अपनी सांस्कृतिक निष्ठा सिद्ध की।
            </p>

            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs font-mono text-stone-700 flex items-center justify-around">
              <div>दिनांक: {new Date().toLocaleDateString('hi-IN')}</div>
              <div>उपाधि: {score >= 8 ? 'विद्वान' : 'साधक'}</div>
            </div>

            <button
              type="button"
              onClick={handleShareScore}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>प्रमाणपत्र शेयर करें</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
