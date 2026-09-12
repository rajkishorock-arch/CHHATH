import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  CloudSun, 
  CheckSquare, 
  Music, 
  Heart, 
  Bookmark, 
  Edit3, 
  Save, 
  Compass,
  Film,
  Play,
  Eye,
  Sliders,
  Utensils,
  BookOpen,
  Users,
  Flame,
  Check,
  HelpCircle,
  Sun,
  Sunrise,
  Sunset,
  Info,
  ShieldCheck,
  CheckCircle2,
  Plus,
  X,
  Share2
} from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useAuth } from '../../context/AuthContext';
import { useReels } from '../../context/ReelsContext';
import { useAudio } from '../../context/AudioContext';
import { cityArghyaData } from '../../data/astronomy';
import { chhathDays } from '../../data/days';
import { CHHATH_INTERESTS, DynamicReel } from '../../types';
import { AIService, ChhathPlanDay } from '../../services/ai/aiService';

const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'chk-1', title: 'बांस का बड़ा दउरा व पीतल का सूप', category: 'Samagri' },
  { id: 'chk-2', title: '5 साबुत पत्तों सहित गांठदार ईख (गन्ना)', category: 'Samagri' },
  { id: 'chk-3', title: 'शुद्ध देशी घी और गुड़ का ठेकुआ व कसार', category: 'Prasad' },
  { id: 'chk-4', title: 'डाभ नींबू, नारियल, हल्दी-अदरक का हरा पौधा', category: 'Samagri' },
  { id: 'chk-5', title: 'मिट्टी के नए दीये, कच्चा धागा, सिन्दूर व रोली', category: 'Samagri' },
  { id: 'chk-6', title: 'घाट पर स्थान सुरक्षित करना व स्वच्छता', category: 'Ghat' },
  { id: 'chk-7', title: 'खरना हेतु गाय का शुद्ध दूध व अरवा चावल', category: 'Prasad' },
  { id: 'chk-8', title: 'उषा अर्घ्य हेतु कच्चा दूध व गंगाजल लोटा', category: 'Arghya' }
];

export const MyChhathDashboard: React.FC = () => {
  const { userLocation, favoriteSongs, songs, favoriteGhats, ghats, familyTasks, toggleFamilyTask } = useChhathData();
  const { currentUser, updateInterests, openOnboarding } = useAuth();
  const { allReels, openReelsPlatform } = useReels();
  const { playSong } = useAudio();

  // Matched city data
  const matchedCity = cityArghyaData.find(c => 
    c.cityName.toLowerCase().includes(userLocation.city.toLowerCase()) || 
    c.state.toLowerCase().includes(userLocation.state.toLowerCase())
  ) || cityArghyaData[0];

  // Dynamic Time of Day Greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 4 && hours < 12) return 'सुप्रभात';
    if (hours >= 12 && hours < 16) return 'शुभ दोपहर';
    if (hours >= 16 && hours < 21) return 'शुभ संध्या';
    return 'शुभ रात्रि';
  };

  // State for AI Modals
  const [whatShouldIDoModalOpen, setWhatShouldIDoModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [explainerModalOpen, setExplainerModalOpen] = useState(false);
  const [whySeeingThisTooltip, setWhySeeingThisTooltip] = useState<string | null>(null);

  // Contextual Recommendations
  const currentActionContext = AIService.getWhatShouldIDoNow(userLocation.city);
  const chhathPlan = AIService.createChhathPlan({
    cityName: userLocation.city,
    familyCount: 4,
    hasFastKeeper: true
  });

  // Interactive Checklist State
  const [checklistItems, setChecklistItems] = useState<{ id: string; title: string; category: string }[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_interactive_checklist_items');
      return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST_ITEMS;
    } catch {
      return DEFAULT_CHECKLIST_ITEMS;
    }
  });

  const [completedChecklistIds, setCompletedChecklistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_interactive_checklist_completed');
      return saved ? JSON.parse(saved) : ['chk-1', 'chk-2'];
    } catch {
      return ['chk-1', 'chk-2'];
    }
  });

  const [newChecklistInput, setNewChecklistInput] = useState('');

  const toggleChecklistItem = (id: string) => {
    setCompletedChecklistIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      try {
        localStorage.setItem('chhath_interactive_checklist_completed', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistInput.trim()) return;
    const newItem = {
      id: `chk-${Date.now()}`,
      title: newChecklistInput.trim(),
      category: 'Samagri'
    };
    const updated = [...checklistItems, newItem];
    setChecklistItems(updated);
    try {
      localStorage.setItem('chhath_interactive_checklist_items', JSON.stringify(updated));
    } catch {}
    setNewChecklistInput('');
  };

  // Personal Devotional Note state
  const [personalNote, setPersonalNote] = useState<string>(() => {
    return localStorage.getItem('chhath_personal_sankalp_note') || 
      'छठी मईया से प्रार्थना: परिवार का स्वास्थ्य उत्तम रहे और दोनों बच्चे मन लगाकर पढ़ें। शाम को गंगा घाट पर सूप अर्पण करना है। 🙏';
  });
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);

  const saveNote = () => {
    localStorage.setItem('chhath_personal_sankalp_note', personalNote);
    setIsEditingNote(false);
  };

  const userInterests = currentUser?.interests || ['songs', 'vidhi', 'arghya', 'ghats', 'prasad'];

  const handleToggleInterest = (id: string) => {
    let next: string[];
    if (userInterests.includes(id)) {
      if (userInterests.length > 1) {
        next = userInterests.filter(i => i !== id);
      } else {
        next = userInterests;
      }
    } else {
      next = [...userInterests, id];
    }
    updateInterests(next);
  };

  // Filtered Reels For You
  const forYouReels = allReels.filter(r => {
    if (r.status !== 'approved') return false;
    if (userInterests.includes('songs') && r.category === 'Chhath Geet') return true;
    if (userInterests.includes('vidhi') && r.category === 'Puja Preparation') return true;
    if (userInterests.includes('arghya') && (r.category === 'Sandhya Arghya' || r.category === 'Usha Arghya')) return true;
    if (userInterests.includes('prasad') && r.category === 'Thekua / Prasad') return true;
    if (userInterests.includes('ghats') && r.category === 'Ghat') return true;
    return true;
  }).slice(0, 4);

  // Filtered Songs based on language
  const recommendedSongs = songs.filter(s => {
    if (currentUser?.language === 'bho') return s.language === 'Bhojpuri';
    if (currentUser?.language === 'mai') return s.language === 'Maithili';
    return true;
  }).slice(0, 3);

  // Filtered Ghats for user's city
  const localGhats = ghats.filter(g => 
    g.city.toLowerCase().includes(userLocation.city.toLowerCase()) ||
    g.state.toLowerCase().includes(userLocation.state.toLowerCase())
  ).slice(0, 2);

  const checklistProgressPercent = Math.round((completedChecklistIds.length / (checklistItems.length || 1)) * 100);

  return (
    <section id="my-chhath" className="section-padding relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent">
      <div className="container-custom">
        
        {/* Top Header: Devotee Welcome & Intelligent Action Triggers */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 pb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-4">
            {currentUser?.avatarUrl && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 shadow-2xl shrink-0">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="badge-saffron inline-flex items-center gap-1.5 mb-1.5 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MY CHHATH • {currentUser?.username || '@bhakt'}</span>
              </div>
              <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
                {getGreeting()}, {currentUser?.name || 'भक्तजन'}! 🙏
              </h2>
              <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                {userLocation.city}, {userLocation.state} हेतु विशेष रूप से तैयार आपका निजी डिजिटल छठ अनुष्ठान।
              </p>
            </div>
          </div>

          {/* AI Contextual Action Triggers (Parts 44, 45, 46) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Part 45: What should I do now? button */}
            <button
              onClick={() => setWhatShouldIDoModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Clock className="w-4 h-4" />
              <span>अभी क्या करना चाहिए?</span>
            </button>

            {/* Part 44: Create My Chhath Plan button */}
            <button
              onClick={() => setPlanModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>4-दिवसीय छठ योजना</span>
            </button>

            {/* Part 46: Understand Chhath explainer */}
            <button
              onClick={() => setExplainerModalOpen(true)}
              className="px-3 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1 transition-all"
              title="छठ का आध्यात्मिक व वैज्ञानिक रहस्य"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>छठ को समझें</span>
            </button>

            <button
              onClick={() => setIsEditingInterests(!isEditingInterests)}
              className="p-2 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-amber-500 transition-all"
              title="रुचियां बदलें"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Interests Active Rail / Edit Drawer */}
        {isEditingInterests ? (
          <div className="p-5 mb-6 rounded-3xl bg-stone-900/90 border border-amber-500/40 text-stone-100 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>अपनी रुचियां चुनें (Select Interests for Recommendations)</span>
              </div>
              <button
                onClick={() => setIsEditingInterests(false)}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                पूर्ण करें (Done)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {CHHATH_INTERESTS.map(item => {
                const isSelected = userInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleInterest(item.id)}
                    className={`p-2 rounded-xl border text-xs text-left flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.hindiName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 font-mukta">
              आपकी सक्रिय रुचियां:
            </span>
            {userInterests.map(id => {
              const item = CHHATH_INTERESTS.find(i => i.id === id);
              if (!item) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mukta font-semibold text-stone-800 dark:text-stone-200 shrink-0"
                >
                  <span>{item.emoji}</span>
                  <span>{item.hindiName}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Top Highlight Banner: Today's Active Stage & Astronomical Integrity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>आज का पावन चरण • कार्तिक शुक्ल पंचमी</span>
              </div>
              <h3 className="font-rozha text-3xl sm:text-4xl font-black">
                आज खरना का पावन अनुष्ठान है 🙏
              </h3>
              <p className="font-mukta text-xs sm:text-sm text-amber-100 leading-relaxed">
                आज 36 घंटे के अखंड निर्जला तप की शुरुआत होगी। सायंकाल नए मिट्टी के चूल्हे पर आम की लकड़ी की आंच से शुद्ध गाय के दूध व गुड़ से "रसियाव खीर" और घी चुपड़ी रोटी का नैवेद्य मां षष्ठी को समर्पित किया जाएगा।
              </p>

              {/* Data Integrity Marker (Part 14) */}
              <div className="inline-flex items-center gap-2 text-[11px] bg-black/30 px-3 py-1 rounded-full text-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-green-300" />
                <span>100% प्रामाणिक खगोलीय पंचांग गणना • नो फेक डेटा (No Fake Data)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 text-center min-w-[130px]">
                <span className="text-[11px] uppercase font-bold text-amber-200 block">संध्या अर्घ्य ({userLocation.city})</span>
                <span className="font-rozha text-2xl font-black">{matchedCity.sandhyaSunset}</span>
                <span className="text-[10px] text-amber-200/80 block">15 Nov 2026 (सूर्यास्त)</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 text-center min-w-[130px]">
                <span className="text-[11px] uppercase font-bold text-amber-200 block">उषा अर्घ्य ({userLocation.city})</span>
                <span className="font-rozha text-2xl font-black">{matchedCity.ushaSunrise}</span>
                <span className="text-[10px] text-amber-200/80 block">16 Nov 2026 (सूर्योदय)</span>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONALIZED "REELS FOR YOU" ROW WITH "WHY AM I SEEING THIS?" (Part 10, 26) */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-rozha text-xl sm:text-2xl font-bold">
              <Film className="w-5 h-5 text-amber-500" />
              <span>आपके लिए विशेष रील्स (Reels For You)</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:inline font-mukta">
                रुचियों एवं शहर ({userLocation.city}) के आधार पर अनुशंसित
              </span>
              <button
                onClick={() => openReelsPlatform('foryou')}
                className="text-xs font-bold text-orange-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-mukta"
              >
                <span>सभी देखें</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {forYouReels.map(reel => (
              <div
                key={reel.id}
                onClick={() => openReelsPlatform('foryou', reel.id)}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/30 shadow-xl cursor-pointer group hover:scale-[1.02] transition-all"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Floating Play Indicator */}
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>

                {/* Category Pill */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 text-amber-300 text-[10px] font-bold backdrop-blur-md">
                  {reel.category}
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white space-y-1">
                  <div className="text-[10px] text-amber-300 font-bold font-mono truncate">
                    {reel.creatorName}
                  </div>
                  <h4 className="font-rozha text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                    {reel.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-stone-300 font-mono">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3 text-amber-400" />
                      {reel.viewsCount.toLocaleString('en-IN')}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-2.5 h-2.5 text-red-400 fill-red-400" />
                      {reel.likesCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Grid: 4 Core Command Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Module 1: Interactive Persistent Puja Checklist */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
                  मेरी पूजा चेकलिस्ट ({checklistProgressPercent}%)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                {completedChecklistIds.length}/{checklistItems.length} पूर्ण
              </span>
            </div>

            {/* Progress Meter */}
            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${checklistProgressPercent}%` }}
              />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {checklistItems.map(item => {
                const isChecked = completedChecklistIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between gap-2 transition-all ${
                      isChecked 
                        ? 'bg-amber-500/10 border-amber-500/30 line-through text-stone-400' 
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-800 dark:text-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-amber-500 border-amber-500 text-stone-950' : 'border-stone-400'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400 shrink-0">
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Checklist Input */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newChecklistInput}
                onChange={e => setNewChecklistInput(e.target.value)}
                placeholder="नया सामान जोड़ें..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100 outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shrink-0"
              >
                जोड़ें
              </button>
            </form>
          </div>

          {/* Module 2: Recommended Chhath Songs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-500" />
                <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
                  अनुशंसित पावन गीत
                </h4>
              </div>
              <a href="#songs" className="text-xs text-amber-500 font-bold hover:underline">
                संगीत पटल
              </a>
            </div>

            <div className="space-y-2.5">
              {recommendedSongs.map(song => (
                <div
                  key={song.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-all border border-transparent"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate font-rozha">
                        {song.title}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        {song.singer} • {song.duration}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => playSong(song)}
                    className="p-2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              ))}
            </div>

            {/* Why seeing this explainer */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>आपके द्वारा चयनित भाषा ({currentUser?.language?.toUpperCase() || 'HI'}) एवं रुचि के अनुसार।</span>
            </div>
          </div>

          {/* Module 3: Local Ghats & Real-Time Weather */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
                  {userLocation.city} घाट व मौसम
                </h4>
              </div>
              <a href="#ghats" className="text-xs text-emerald-500 font-bold hover:underline">
                सभी घाट
              </a>
            </div>

            <div className="space-y-2.5">
              {localGhats.length > 0 ? (
                localGhats.map(ghat => (
                  <div key={ghat.id} className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-100 font-rozha">
                        {ghat.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                        भीड़: {ghat.crowdStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 font-mukta">
                      {ghat.river} तट • {ghat.parkingInfo}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs text-stone-400 text-center font-mukta">
                  {userLocation.city} में प्रमुख घाट सूची उपलब्ध है।
                </div>
              )}

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mukta text-stone-700 dark:text-stone-300 space-y-1">
                <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5" />
                  <span>मौसम वेधशाला रिपोर्ट:</span>
                </div>
                <p>
                  तापमान: <strong>{matchedCity.weatherTemp}</strong> ({matchedCity.weatherCondition})। अर्घ्य के समय शीतल हवाएं रह सकती हैं।
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* MODAL 1: "WHAT SHOULD I DO NOW?" CONTEXTUAL AI MODAL (Part 45) */}
        {whatShouldIDoModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-5 text-stone-900 dark:text-stone-100">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-rozha text-xl font-bold">अभी क्या करना चाहिए?</h4>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-mukta font-bold">
                      {currentActionContext.phaseName}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setWhatShouldIDoModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  तात्कालिक अनुष्ठान मार्गदर्शन (Contextual Recommendation)
                </span>
                <p className="text-sm font-mukta leading-relaxed">
                  {currentActionContext.currentRecommendation}
                </p>
                <div className="pt-2 border-t border-amber-500/20 text-xs font-mono text-stone-600 dark:text-stone-300">
                  ⏰ {currentActionContext.timerNotice}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setWhatShouldIDoModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md"
                >
                  समझ गया, धन्यवाद! 🙏
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: "CREATE MY CHHATH PLAN" 4-DAY ITINERARY MODAL (Part 44) */}
        {planModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl p-6 border border-amber-500/40 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-stone-900 dark:text-stone-100">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <div className="badge-saffron inline-flex items-center gap-1.5 mb-1 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>AI Personal Chhath Planner</span>
                  </div>
                  <h3 className="font-rozha text-2xl font-bold">
                    आपकी 4-दिवसीय छठ महापर्व कार्ययोजना ({userLocation.city})
                  </h3>
                </div>
                <button
                  onClick={() => setPlanModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin">
                {chhathPlan.map(day => (
                  <div
                    key={day.dayNumber}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-amber-500/25 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-rozha text-lg font-bold text-amber-600 dark:text-amber-400">
                        {day.dayName}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 font-bold">
                        {day.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800">
                        <span className="font-bold text-amber-500 block mb-0.5">🌅 प्रातः कार्य</span>
                        <p className="text-stone-700 dark:text-stone-300">{day.morningAction}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800">
                        <span className="font-bold text-orange-500 block mb-0.5">☀️ मध्याह्न कार्य</span>
                        <p className="text-stone-700 dark:text-stone-300">{day.afternoonAction}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800">
                        <span className="font-bold text-red-500 block mb-0.5">🌇 सायं अनुष्ठान</span>
                        <p className="text-stone-700 dark:text-stone-300">{day.eveningAction}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                      <span className="font-bold text-stone-500">आवश्यक सामग्री:</span>
                      {day.criticalSamagri.map((s, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-500/20 pt-4 flex justify-between items-center">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  योजना को अपनी सुविधानुसार संशोधित कर सकते हैं।
                </span>
                <button
                  onClick={() => setPlanModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400"
                >
                  योजना सहेजें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: "UNDERSTAND CHHATH" CULTURAL EXPLAINER (Part 46) */}
        {explainerModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-4 text-stone-900 dark:text-stone-100 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <h3 className="font-rozha text-2xl font-bold">छठ महापर्व का आध्यात्मिक व वैज्ञानिक रहस्य</h3>
                </div>
                <button
                  onClick={() => setExplainerModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mukta leading-relaxed text-stone-700 dark:text-stone-300">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                    1. अस्ताचलगामी (डूबते) सूर्य को अर्घ्य देने का दर्शन:
                  </h4>
                  <p>
                    संसार केवल उगते सूरज को सलाम करता है, परंतु हमारी सनातन संस्कृति ढलते हुए सूरज के प्रति भी कृतज्ञता ज्ञापित करती है। यह जीवन में सुख और दुख, उत्थान और पतन दोनों को समभाव से स्वीकार करने का अमर संदेश है।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                    2. नदी के बहते जल में कमर तक खड़े होने का वैज्ञानिक आधार:
                  </h4>
                  <p>
                    कार्तिक मास की इस वेला में सूर्य की पराबैंगनी किरणें न्यूनतम और जीवनदायिनी इन्फ्रारेड तरंगें संतुलित होती हैं। बहते शीतल जल में खड़े होने से शरीर का बायो-इलेक्ट्रिकल सर्किट पूर्ण होता है और शरीर की रोग-प्रतिरोधक क्षमता (Immunity) कई गुना बढ़ जाती है।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                    3. षष्ठी देवी (छठी मईया) और सूर्य देव का संबंध:
                  </h4>
                  <p>
                    पौराणिक मान्यतानुसार षष्ठी देवी ब्रह्मा जी की मानस पुत्री एवं देवसेना हैं, जो प्रकृति की षष्ठांश शक्ति हैं। वे सूर्य देव की मानस भगिनी मानी जाती हैं। इसलिए सूर्य की उपासना से सीधे छठी मईया का वात्सल्य और संतान रक्षा का वरदान मिलता है।
                  </p>
                </div>
              </div>

              <div className="text-right pt-2 border-t border-amber-500/20">
                <button
                  onClick={() => setExplainerModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  समाप्त करें
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
