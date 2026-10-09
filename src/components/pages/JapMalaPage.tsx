import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award, 
  Flame, 
  Play, 
  Pause, 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  Globe, 
  Cloud, 
  Target, 
  TrendingUp,
  Share2,
  ChevronDown,
  Info
} from 'lucide-react';
import { spiritualAudio } from '../../utils/spiritualAudio';
import { useAuth } from '../../context/AuthContext';
import { UserSyncService, JapMalaCloudData } from '../../services/userSyncService';

interface JapMalaPageProps {
  onNavigate: (tab: string) => void;
}

export type BeadType = 'rudraksha' | 'tulsi' | 'kamalgatta' | 'sphatik';

export interface VedicMantra {
  id: string;
  name: string;
  deity: string;
  meaning: string;
  benefit: string;
  recommendedBead: BeadType;
}

export const VEDIC_MANTRAS: VedicMantra[] = [
  {
    id: 'shiva',
    name: 'ॐ नमः शिवाय',
    deity: 'भगवान शिव',
    meaning: 'परम कल्याणकारी सर्वव्यापी शिव को मेरा नमन।',
    benefit: 'मानसिक शांति, भय नाश और मोक्ष प्रदाता।',
    recommendedBead: 'rudraksha'
  },
  {
    id: 'gayatri',
    name: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    deity: 'माता गायत्री / सूर्य नारायण',
    meaning: 'उस प्राणस्वरूप, दुःखनिवारक, सुखस्वरूप श्रेष्ठ तेजस्वी परमात्मा को हम अंतःकरण में धारण करें, जो हमारी बुद्धि को प्रेरित करे।',
    benefit: 'दिव्य ज्ञान, मेधा शक्ति, आत्मबल व पाप नाश।',
    recommendedBead: 'tulsi'
  },
  {
    id: 'mahamrityunjaya',
    name: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
    deity: 'महाकाल शिव',
    meaning: 'हम त्रिनेत्रधारी सुगन्धित पुष्टि के वर्धक शिव की आराधना करते हैं, जो हमें अकाल मृत्यु से मुक्त कर अमृतत्व प्रदान करें।',
    benefit: 'अकाल मृत्यु से रक्षा, दीर्घायु व आरोग्य लाभ।',
    recommendedBead: 'rudraksha'
  },
  {
    id: 'vishnu',
    name: 'ॐ नमो भगवते वासुदेवाय',
    deity: 'भगवान विष्णु',
    meaning: 'समस्त जगत के पालनहार वासुदेव भगवान को सादर नमन।',
    benefit: 'सद्गति, गृह क्लेश शांति और परम धाम की प्राप्ति।',
    recommendedBead: 'tulsi'
  },
  {
    id: 'hare-krishna',
    name: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥',
    deity: 'श्री राधा-कृष्ण व श्री राम',
    meaning: 'हे प्रभु, हे परम आनंद, मुझे अपनी पावन प्रेमाभक्ति सेवा में संलग्न कीजिए।',
    benefit: 'कलियुग में परम कल्याण, हृदय शुद्धि व दिव्य आनंद।',
    recommendedBead: 'tulsi'
  },
  {
    id: 'ram',
    name: 'श्री राम जय राम जय जय राम',
    deity: 'मर्यादा पुरुषोत्तम श्री राम',
    meaning: 'श्री राम की जय हो, सर्वसमर्थ विजय दाता प्रभु राम की जय हो।',
    benefit: 'संकट मोचन, आत्मिक शांति व विजय प्रदाता।',
    recommendedBead: 'tulsi'
  },
  {
    id: 'ganesh',
    name: 'ॐ गं गणपतये नमः',
    deity: 'विघ्नहर्ता गणेश',
    meaning: 'समस्त विघ्नों के हर्ता गणपति भगवान को सादर प्रणाम।',
    benefit: 'कार्यों में सफलता, बुद्धि, ऋद्धि-सिद्धि व विघ्न निवारण।',
    recommendedBead: 'rudraksha'
  },
  {
    id: 'surya',
    name: 'ॐ घृणि सूर्याय नमः',
    deity: 'भगवान सूर्य नारायण',
    meaning: 'सकल ब्रह्मांड को प्रकाश व जीवन देने वाले सूर्य देव को प्रणाम।',
    benefit: 'तेजस्वी आभा, नेत्र ज्योति, पितृ दोष निवारण व उत्तम स्वास्थ्य।',
    recommendedBead: 'kamalgatta'
  },
  {
    id: 'chhathi-maiya',
    name: 'ॐ षष्ठी देव्यै नमः',
    deity: 'छठी मईया (देवसेना)',
    meaning: 'संतान रक्षक, सौभाग्यदायिनी माता षष्ठी को बारंबार नमन।',
    benefit: 'संतान सुख, दीर्घायु, कुल वृद्धि व मनोकामना सिद्धि।',
    recommendedBead: 'kamalgatta'
  },
  {
    id: 'lakshmi',
    name: 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः',
    deity: 'माता महालक्ष्मी',
    meaning: 'धन, धान्य, ऐश्वर्य व सौभाग्य की अधिष्ठात्री महालक्ष्मी को नमन।',
    benefit: 'दारिद्र्य नाश, व्यापार वृद्धि व अखंड सुख-समृद्धि।',
    recommendedBead: 'kamalgatta'
  }
];

export const BEAD_CONFIG: Record<BeadType, { name: string; desc: string; color: string; beadBg: string; activeGlow: string }> = {
  rudraksha: {
    name: 'रुद्राक्ष माला',
    desc: 'भगवान शिव व महामृत्युंजय साधना हेतु',
    color: '#9a3412',
    beadBg: 'from-amber-800 to-amber-950',
    activeGlow: 'shadow-[0_0_15px_rgba(234,88,12,0.8)] border-orange-400'
  },
  tulsi: {
    name: 'तुलसी माला',
    desc: 'विष्णु, राम, कृष्ण व गायत्री मंत्र हेतु',
    color: '#d97706',
    beadBg: 'from-amber-600 to-amber-700',
    activeGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.8)] border-amber-300'
  },
  kamalgatta: {
    name: 'कमलगट्टा माला',
    desc: 'माता लक्ष्मी व सूर्य साधना हेतु',
    color: '#1c1917',
    beadBg: 'from-stone-900 to-black',
    activeGlow: 'shadow-[0_0_15px_rgba(251,191,36,0.8)] border-amber-400'
  },
  sphatik: {
    name: 'स्फटिक माला',
    desc: 'माता दुर्गा, सरस्वती व शांति साधना हेतु',
    color: '#0284c7',
    beadBg: 'from-sky-100 to-sky-200',
    activeGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.8)] border-sky-400'
  }
};

const SANKALP_TARGETS = [1, 3, 5, 11, 21, 108];

export const JapMalaPage: React.FC<JapMalaPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  // Chanting State
  const [count, setCount] = useState<number>(0);
  const [completedMalas, setCompletedMalas] = useState<number>(0);
  const [totalChants, setTotalChants] = useState<number>(0);
  const [todayChants, setTodayChants] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(1);
  const [mantraBreakdown, setMantraBreakdown] = useState<Record<string, number>>({});
  
  // Settings & Selections
  const [selectedMantra, setSelectedMantra] = useState<VedicMantra>(VEDIC_MANTRAS[0]);
  const [beadType, setBeadType] = useState<BeadType>('rudraksha');
  const [sankalpTarget, setSankalpTarget] = useState<number>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [isAutoChanting, setIsAutoChanting] = useState<boolean>(false);
  const [autoSpeed, setAutoSpeed] = useState<number>(1.0); // 0.75, 1.0, 1.25

  // UI feedback
  const [animating, setAnimating] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const autoChantTimerRef = useRef<any>(null);
  const cloudSaveTimerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load & Cloud Sync on mount and devotee user change
  useEffect(() => {
    let isCancelled = false;

    // Purge legacy shared keys so they never leak across users or unauthenticated view
    try {
      localStorage.removeItem('digital_mala_completed');
      localStorage.removeItem('digital_mala_total_chants');
      localStorage.removeItem('digital_mala_today_chants');
      localStorage.removeItem('digital_mala_count');
    } catch {}

    async function loadUserData() {
      // Devotee is NOT logged in: strictly clean zero state (guest cannot see old user data)
      if (!currentUser?.id) {
        if (!isCancelled) {
          setCount(0);
          setCompletedMalas(0);
          setTotalChants(0);
          setTodayChants(0);
          setStreakDays(0);
          setMantraBreakdown({});
          setCloudSynced(false);
        }
        return;
      }

      // Devotee IS logged in: Load this devotee's personal records!
      const userKey = `chhath_jap_mala_${currentUser.id}`;
      let hasCached = false;

      // 1. Try local user-scoped cache for instant zero-latency load
      try {
        const cachedRaw = localStorage.getItem(userKey);
        if (cachedRaw) {
          const cachedData: JapMalaCloudData = JSON.parse(cachedRaw);
          if (!isCancelled) {
            hasCached = true;
            setCompletedMalas(cachedData.totalMalas || 0);
            setTotalChants(cachedData.totalChants || 0);

            // Date check for today's chants
            const isToday = cachedData.lastChantedDate && 
              new Date(cachedData.lastChantedDate).toDateString() === new Date().toDateString();
            setTodayChants(isToday ? (cachedData.todayChants || 0) : 0);

            setStreakDays(cachedData.streakDays || 1);
            if (cachedData.mantraBreakdown) setMantraBreakdown(cachedData.mantraBreakdown);
            if (cachedData.sankalpTargetMalas) setSankalpTarget(cachedData.sankalpTargetMalas);
            if (cachedData.beadType) setBeadType(cachedData.beadType);
            if (cachedData.favoriteMantraId) {
              const m = VEDIC_MANTRAS.find(v => v.id === cachedData.favoriteMantraId);
              if (m) setSelectedMantra(m);
            }
            setCloudSynced(true);
          }
        } else {
          // New devotee without local cache -> clean 0 state
          if (!isCancelled) {
            setCount(0);
            setCompletedMalas(0);
            setTotalChants(0);
            setTodayChants(0);
            setStreakDays(1);
            setMantraBreakdown({});
            setCloudSynced(false);
          }
        }
      } catch (err) {
        console.warn('Error reading devotee local cache:', err);
      }

      // 2. Fetch authoritative cloud records for this devotee
      try {
        const cloudData = await UserSyncService.fetchJapMalaData(currentUser.id);
        if (!isCancelled) {
          if (cloudData) {
            setCompletedMalas(cloudData.totalMalas || 0);
            setTotalChants(cloudData.totalChants || 0);

            const isToday = cloudData.lastChantedDate && 
              new Date(cloudData.lastChantedDate).toDateString() === new Date().toDateString();
            setTodayChants(isToday ? (cloudData.todayChants || 0) : 0);

            setStreakDays(cloudData.streakDays || 1);
            if (cloudData.mantraBreakdown) setMantraBreakdown(cloudData.mantraBreakdown);
            if (cloudData.sankalpTargetMalas) setSankalpTarget(cloudData.sankalpTargetMalas);
            if (cloudData.beadType) setBeadType(cloudData.beadType);
            if (cloudData.favoriteMantraId) {
              const m = VEDIC_MANTRAS.find(v => v.id === cloudData.favoriteMantraId);
              if (m) setSelectedMantra(m);
            }
            setCloudSynced(true);
          } else if (!hasCached) {
            // Fresh account with 0 chants on cloud
            setCompletedMalas(0);
            setTotalChants(0);
            setTodayChants(0);
            setCloudSynced(true);
          }
        }
      } catch (err) {
        console.warn('Error fetching cloud data for devotee:', err);
      }
    }

    loadUserData();

    return () => {
      isCancelled = true;
    };
  }, [currentUser?.id]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (autoChantTimerRef.current) clearInterval(autoChantTimerRef.current);
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
    };
  }, []);

  // 2. Persist to Cloud & Local Storage (Strictly Scoped to Current Devotee)
  const persistCounts = (
    newCount: number, 
    newMalas: number, 
    newTotal: number, 
    newToday: number, 
    newBreakdown: Record<string, number>,
    immediate = false
  ) => {
    if (!currentUser?.id) return;

    const userKey = `chhath_jap_mala_${currentUser.id}`;
    const payload: JapMalaCloudData = {
      totalMalas: newMalas,
      totalChants: newTotal,
      todayChants: newToday,
      lastChantedDate: new Date().toISOString(),
      favoriteMantraId: selectedMantra.id,
      mantraBreakdown: newBreakdown,
      sankalpTargetMalas: sankalpTarget,
      beadType,
      streakDays
    };

    // 1. Instant local persistence strictly for this logged-in devotee
    try {
      localStorage.setItem(userKey, JSON.stringify(payload));
    } catch {}

    // 2. Cloud sync queue with debounce
    if (cloudSaveTimerRef.current) {
      clearTimeout(cloudSaveTimerRef.current);
    }

    const doCloudSync = () => {
      UserSyncService.saveJapMalaData(currentUser.id, payload).then((ok) => {
        if (ok) setCloudSynced(true);
      });
    };

    if (immediate) {
      doCloudSync();
    } else {
      cloudSaveTimerRef.current = setTimeout(doCloudSync, 600);
    }
  };

  // 3. Central Bead Tap Handler
  const handleChantTap = () => {
    // ⚠️ Mandatory Devotee Verification: If not logged in, prompt user to log in or create an account!
    if (!isAuthenticated) {
      openAuthModal(
        'login',
        '108 जप माला साधना शुरू करने और अपने सभी जप को अपने अकाउंट में सुरक्षित रखने के लिए कृपया लॉगिन करें।'
      );
      showToast('साधना को अपने अकाउंट से जोड़ने के लिए कृपया लॉगिन करें');
      return;
    }

    setAnimating(true);
    setTimeout(() => setAnimating(false), 120);

    // Audio feedback
    if (soundEnabled) {
      spiritualAudio.playBeadTap();
    }

    // Haptic vibration feedback
    if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    const nextCount = count + 1;
    const nextTotalChants = totalChants + 1;
    const nextTodayChants = todayChants + 1;
    const nextBreakdown = {
      ...mantraBreakdown,
      [selectedMantra.id]: (mantraBreakdown[selectedMantra.id] || 0) + 1
    };
    setMantraBreakdown(nextBreakdown);

    if (nextCount >= 108) {
      // 108 Completion: Maha Sankalp Purna!
      setCount(0);
      const nextMalas = completedMalas + 1;
      setCompletedMalas(nextMalas);
      setTotalChants(nextTotalChants);
      setTodayChants(nextTodayChants);

      persistCounts(0, nextMalas, nextTotalChants, nextTodayChants, nextBreakdown, true);

      // Play sacred bell & shankh celebration
      spiritualAudio.playTempleBell();
      setTimeout(() => spiritualAudio.playShankh(), 700);

      if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 60, 150, 60, 200]);
      }

      setShowCelebration(true);
      showToast(`🚩 1 माला (108 जप) पूर्ण हुई! आपके अकाउंट में सुरक्षित हो गई।`);
    } else {
      setCount(nextCount);
      setTotalChants(nextTotalChants);
      setTodayChants(nextTodayChants);
      persistCounts(nextCount, completedMalas, nextTotalChants, nextTodayChants, nextBreakdown);
    }
  };

  // 4. Auto-Jap Mode Timer Logic
  useEffect(() => {
    if (isAutoChanting) {
      if (!isAuthenticated) {
        setIsAutoChanting(false);
        openAuthModal('login', 'ऑटो जप शुरू करने के लिए कृपया लॉगिन करें');
        return;
      }

      const intervalMs = Math.round(1800 / autoSpeed);
      autoChantTimerRef.current = setInterval(() => {
        handleChantTap();
      }, intervalMs);
    } else {
      if (autoChantTimerRef.current) {
        clearInterval(autoChantTimerRef.current);
        autoChantTimerRef.current = null;
      }
    }
    return () => {
      if (autoChantTimerRef.current) clearInterval(autoChantTimerRef.current);
    };
  }, [isAutoChanting, autoSpeed, count, totalChants, completedMalas, isAuthenticated]);

  const handleResetCurrentMala = () => {
    if (count === 0) return;
    if (window.confirm('क्या आप वर्तमान माला गणना को 0 पर रीसेट करना चाहते हैं? (पूर्ण हो चुकी मालाएं सुरक्षित रहेंगी)')) {
      setCount(0);
      showToast('वर्तमान माला रीसेट की गई');
    }
  };

  // Generate 108 bead positions along an SVG circle
  const beadsData = useMemo(() => {
    const totalBeads = 108;
    const radius = 105;
    const cx = 130;
    const cy = 130;
    const beads = [];

    for (let i = 0; i < totalBeads; i++) {
      // Start from top (-90 degrees) and proceed clockwise
      const angle = (i / totalBeads) * 2 * Math.PI - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      beads.push({ index: i + 1, x, y });
    }
    return beads;
  }, []);

  const progressPercentage = Math.round((count / 108) * 100);
  const sankalpProgress = Math.min(100, Math.round((completedMalas / sankalpTarget) * 100));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-28 pt-2 sm:pt-6 font-mukta transition-colors animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-stone-950 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Maha Sankalp Completion Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 text-center border-2 border-amber-400 shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
              📿
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                महा संकल्प पूर्ण
              </span>
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-2">
                1 माला (108 जप) पूर्ण हुई!
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                {selectedMantra.name}
              </p>
            </div>
            
            <div className="p-3 bg-amber-50 dark:bg-stone-800 rounded-2xl border border-amber-200 dark:border-stone-700 text-xs text-amber-900 dark:text-amber-200 font-semibold space-y-1">
              <p>कुल पूर्ण मालाएं: <span className="font-bold text-orange-600">{completedMalas}</span></p>
              <p>कुल जपे गए मंत्र: <span className="font-bold text-orange-600">{totalChants}</span></p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                क्लाउड अकाउंट में स्वतः सुरक्षित हो गया
              </p>
            </div>

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer text-sm"
            >
              अगली माला जप शुरू करें →
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-6">

        {/* 1. Header Bar with Back Button & Devotee Account Pill */}
        <div className="flex items-center justify-between py-2 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 -ml-1 text-stone-700 dark:text-stone-300 hover:text-amber-600 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="मुख्य पृष्ठ पर वापस जाएं"
              aria-label="वापस जाएं"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 dark:from-amber-200 dark:via-orange-300 dark:to-amber-200 bg-clip-text text-transparent">
                  डिजिटल 108 जप माला
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  वैदिक साधना
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                108 मनकों का पावन डिजिटल जाप काउंटर एवं क्लाउड जप डायरी
              </p>
            </div>
          </div>

          {/* User Account Cloud Pill */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <Cloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentUser?.name || 'श्रद्धालु'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                  क्लाउड सिंक
                </span>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login', '108 जप माला साधना शुरू करने और अपने सभी जप को अपने अकाउंट में सुरक्षित रखने के लिए कृपया लॉगिन करें।')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-xs font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>लॉगिन करें</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Top Notice for Unauthenticated Devotees */}
        {!isAuthenticated && (
          <div 
            onClick={() => openAuthModal('login', '108 जप माला साधना शुरू करने और अपने सभी जप को अपने अकाउंट में सुरक्षित रखने के लिए कृपया लॉगिन करें।')}
            className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 cursor-pointer hover:bg-amber-500/15 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>महत्वपूर्ण:</strong> अपने जप को कभी न खोने और किसी भी फ़ोन में देखने के लिए <strong>लॉगिन करें</strong>।
              </span>
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 underline shrink-0">
              लॉगिन →
            </span>
          </div>
        )}

        {/* 3. Main 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Interactive 108 Beads Circle & Tap Action Disc (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
            
            {/* Top Quick Controls: Sound, Haptic, Reset */}
            <div className="w-full flex items-center justify-between mb-2 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-full border transition-all ${
                    soundEnabled 
                      ? 'bg-amber-500/15 text-amber-600 border-amber-500/30' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                  }`}
                  title={soundEnabled ? 'मनका ध्वनि चालू' : 'ध्वनि बंद'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setHapticEnabled(!hapticEnabled);
                    showToast(hapticEnabled ? 'स्पर्श कंपन बंद' : 'स्पर्श कंपन चालू');
                  }}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all ${
                    hapticEnabled 
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  📳 कंपन {hapticEnabled ? 'चालू' : 'बंद'}
                </button>
              </div>

              <button
                onClick={handleResetCurrentMala}
                disabled={count === 0}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-stone-500 hover:text-red-600 disabled:opacity-40 transition-colors cursor-pointer"
                title="वर्तमान माला रीसेट करें"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
            </div>

            {/* Sacred 108 Beads Visual Mala Ring */}
            <div className="relative flex items-center justify-center my-3 select-none">
              
              {/* SVG 108 Beads Ring with Sumeru Bead */}
              <svg 
                className="w-72 h-72 sm:w-80 sm:h-80 drop-shadow-md"
                viewBox="0 0 260 260"
              >
                {/* Background Ring Track */}
                <circle
                  cx="130"
                  cy="130"
                  r="105"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-stone-200 dark:text-stone-800"
                  fill="none"
                />

                {/* Progress Arc */}
                <circle
                  cx="130"
                  cy="130"
                  r="105"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 105}
                  strokeDashoffset={2 * Math.PI * 105 * (1 - count / 108)}
                  strokeLinecap="round"
                  className="text-amber-500 transition-all duration-150"
                  fill="none"
                  transform="rotate(-90 130 130)"
                />

                {/* 108 Individual Sacred Beads */}
                {beadsData.map((bead) => {
                  const isCurrent = bead.index === count;
                  const isPassed = bead.index <= count;
                  const isSumeru = bead.index === 108;

                  return (
                    <circle
                      key={bead.index}
                      cx={bead.x}
                      cy={bead.y}
                      r={isSumeru ? (isCurrent ? 5.5 : 4.5) : (isCurrent ? 4.5 : 2.5)}
                      className={`transition-all duration-150 ${
                        isCurrent
                          ? 'fill-amber-400 stroke-amber-200 stroke-2 filter drop-shadow-[0_0_6px_rgba(245,158,11,1)]'
                          : isPassed
                            ? 'fill-orange-600 dark:fill-orange-500'
                            : 'fill-stone-300 dark:fill-stone-700'
                      }`}
                    />
                  );
                })}

                {/* Top Sumeru Bead Ornament */}
                <g transform="translate(122, 10)">
                  <polygon points="8,0 12,6 4,6" className="fill-amber-500" />
                </g>
              </svg>

              {/* Large Tactile Chant Touch Button in the Center of Mala */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={handleChantTap}
                  className={`pointer-events-auto w-44 h-44 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center shadow-xl border-4 transition-all duration-150 active:scale-95 cursor-pointer bg-gradient-to-b ${
                    BEAD_CONFIG[beadType].beadBg
                  } ${BEAD_CONFIG[beadType].activeGlow} ${
                    animating ? 'scale-95 brightness-125' : 'hover:scale-102'
                  }`}
                  aria-label="जप करें (Tap Bead)"
                >
                  <span className="text-3xl sm:text-4xl text-amber-300 filter drop-shadow-md select-none font-serif">
                    ॐ
                  </span>
                  
                  {/* Current Bead Count */}
                  <div className="mt-1 text-center select-none">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans drop-shadow-sm">
                      {count}
                    </span>
                    <span className="text-xs font-bold text-amber-200/90 block">
                      / 108 मनके
                    </span>
                  </div>

                  <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300/80 bg-black/30 px-2.5 py-0.5 rounded-full select-none">
                    {progressPercentage}% पूर्ण
                  </span>
                </button>
              </div>
            </div>

            {/* Instruction Tap Cue */}
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">
              👉 केंद्र में <strong>ॐ पर स्पर्श (टैप) करें</strong> • 108वां मनका पूरा होने पर स्वतः 1 माला पूर्ण होगी
            </p>

            {/* Auto-Jap Mode Quick Bar */}
            <div className="w-full mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoChanting(!isAutoChanting)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isAutoChanting 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-amber-500/30'
                  }`}
                >
                  {isAutoChanting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isAutoChanting ? 'ऑटो जप रोकें' : 'स्वचालित जप'}</span>
                </button>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:inline">
                  {isAutoChanting ? 'ऑटो मनके आगे बढ़ रहे हैं...' : 'हैंड्स-फ्री साधना'}
                </span>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1">
                {[0.75, 1.0, 1.25].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setAutoSpeed(spd)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      autoSpeed === spd 
                        ? 'bg-amber-500 text-stone-950' 
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Active Mantra, Mala Bead Type, Stats & Sankalp Tracker (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* 1. Active Mantra Display & Dropdown Selector */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  साधना महामंत्र:
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  {selectedMantra.deity}
                </span>
              </div>

              {/* Mantra Dropdown */}
              <div className="relative">
                <select
                  value={selectedMantra.id}
                  onChange={(e) => {
                    const m = VEDIC_MANTRAS.find(v => v.id === e.target.value);
                    if (m) {
                      setSelectedMantra(m);
                      setBeadType(m.recommendedBead);
                      showToast(`${m.name} चुना गया`);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-amber-500/30 rounded-2xl text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
                >
                  {VEDIC_MANTRAS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name.length > 40 ? m.name.substring(0, 40) + '...' : m.name} ({m.deity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mantra Meaning Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 text-center">
                <p className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-200 font-serif leading-relaxed">
                  {selectedMantra.name}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 leading-snug">
                  {selectedMantra.meaning}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold mt-1">
                  ✨ फल: {selectedMantra.benefit}
                </p>
              </div>
            </div>

            {/* 2. Bead Type Selector (Rudraksha, Tulsi, Kamalgatta, Sphatik) */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <span>माला प्रकार चुनें:</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400">
                  ({BEAD_CONFIG[beadType].name})
                </span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(BEAD_CONFIG) as BeadType[]).map((key) => {
                  const cfg = BEAD_CONFIG[key];
                  const isSelected = beadType === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setBeadType(key);
                        showToast(`${cfg.name} सक्रिय`);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 shadow-sm font-bold text-amber-900 dark:text-amber-200'
                          : 'border-stone-200 dark:border-stone-800 hover:border-amber-500/40 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <div className="text-base mb-0.5">
                        {key === 'rudraksha' && '📿'}
                        {key === 'tulsi' && '🌿'}
                        {key === 'kamalgatta' && '🪷'}
                        {key === 'sphatik' && '💎'}
                      </div>
                      <p className="text-xs font-bold truncate">{cfg.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Devotee Jap Stats & Cloud Sync Info */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  आपकी साधना सांख्यिकी (Stats):
                </span>
                {isAuthenticated && currentUser ? (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Cloud className="w-3 h-3" />
                    <span>क्लाउड सुरक्षित</span>
                    <span className="hidden sm:inline">• {currentUser.name || 'खाता'}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal('login', '108 जप माला साधना शुरू करने और अपने सभी जप को अपने अकाउंट में सुरक्षित रखने के लिए कृपया लॉगिन करें।')}
                    className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 hover:underline cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 transition-all active:scale-95"
                  >
                    <User className="w-3 h-3" />
                    <span>लॉगिन आवश्यक</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
                  <span className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400 font-sans">
                    {completedMalas}
                  </span>
                  <p className="text-[11px] font-bold text-stone-600 dark:text-stone-400">कुल मालाएं</p>
                </div>

                <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
                  <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-sans">
                    {totalChants}
                  </span>
                  <p className="text-[11px] font-bold text-stone-600 dark:text-stone-400">कुल मंत्र जप</p>
                </div>

                <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
                  <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
                    {todayChants}
                  </span>
                  <p className="text-[11px] font-bold text-stone-600 dark:text-stone-400">आज का जप</p>
                </div>
              </div>
            </div>

            {/* 4. Daily Sankalp Target Tracker */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-orange-500" />
                  दैनिक संकल्प लक्ष्य:
                </span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  {completedMalas} / {sankalpTarget} माला ({sankalpProgress}%)
                </span>
              </div>

              {/* Target Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {SANKALP_TARGETS.map(target => (
                  <button
                    key={target}
                    onClick={() => {
                      setSankalpTarget(target);
                      showToast(`दैनिक संकल्प ${target} माला सेट किया गया`);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                      sankalpTarget === target
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {target} माला ({target * 108})
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
                  style={{ width: `${sankalpProgress}%` }}
                />
              </div>
            </div>

            {/* 5. Worldwide Community Satsang Live Counter */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                <Globe className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '10s' }} />
                <span>वैश्विक सनातन सामूहिक जप (Worldwide Devotees):</span>
              </div>
              <p className="text-lg font-black text-orange-600 dark:text-orange-400 font-sans tracking-wide">
                1,42,85,920+ ॐ
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                विश्वभर के श्रद्धालुओं द्वारा जपे गए सामूहिक मंत्र
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
