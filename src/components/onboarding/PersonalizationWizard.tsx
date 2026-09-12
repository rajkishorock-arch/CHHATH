import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Languages, 
  MapPin, 
  Heart, 
  User, 
  Globe, 
  Flame, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useChhathData } from '../../context/ChhathDataContext';
import { Language, CHHATH_INTERESTS } from '../../types';

interface PersonalizationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'
];

export const PersonalizationWizard: React.FC<PersonalizationWizardProps> = ({ isOpen, onClose }) => {
  const { currentUser, completeOnboarding } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { setUserLocation } = useChhathData();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basic Info
  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatarUrl || PRESET_AVATARS[0]);

  // Step 2: Language
  const [selectedLang, setSelectedLang] = useState<Language>(currentUser?.language || language || 'hi');

  // Step 3: Interests (Multiple selection)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests && currentUser.interests.length > 0 
      ? currentUser.interests 
      : ['songs', 'vidhi', 'arghya', 'ghats', 'prasad']
  );

  // Step 4: Location
  const [country, setCountry] = useState(currentUser?.country || 'India');
  const [state, setState] = useState(currentUser?.state || 'Bihar');
  const [city, setCity] = useState(currentUser?.city || 'Patna');

  const [isFinishing, setIsFinishing] = useState(false);

  if (!isOpen || !currentUser) return null;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(prev => prev.filter(item => item !== id));
      }
    } else {
      setSelectedInterests(prev => [...prev, id]);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleFinish = async () => {
    setIsFinishing(true);

    // Sync global location context
    setUserLocation({ state, city, isCustom: true });

    await completeOnboarding({
      language: selectedLang,
      interests: selectedInterests,
      country,
      state,
      city
    });

    setIsFinishing(false);
    onClose();

    // Scroll to personalized "मेरा Chhath" section
    const myChhathEl = document.getElementById('my-chhath');
    if (myChhathEl) {
      myChhathEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-xl bg-stone-950 border border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/50 flex flex-col overflow-hidden text-stone-100 p-6 sm:p-8 animate-scaleUp">
        
        {/* Ambient Warm Golden Flare */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-orange-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Step Progress Tracker */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300 font-mono mb-2">
            <span>चरण {step} / 4</span>
            <span>
              {step === 1 && 'बुनियादी परिचय'}
              {step === 2 && 'भाषा चयन'}
              {step === 3 && 'रुचियां व पसंद'}
              {step === 4 && 'स्थान प्राथमिकता'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden flex gap-1">
            <div className={`flex-1 transition-all duration-300 ${step >= 1 ? 'bg-amber-400' : 'bg-stone-800'}`} />
            <div className={`flex-1 transition-all duration-300 ${step >= 2 ? 'bg-amber-400' : 'bg-stone-800'}`} />
            <div className={`flex-1 transition-all duration-300 ${step >= 3 ? 'bg-amber-400' : 'bg-stone-800'}`} />
            <div className={`flex-1 transition-all duration-300 ${step >= 4 ? 'bg-amber-400' : 'bg-stone-800'}`} />
          </div>
        </div>

        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <div className="relative z-10 space-y-5 animate-fadeIn">
            <div className="text-center space-y-1">
              <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">
                छठ महापर्व में आपका स्वागत है 🙏
              </h3>
              <p className="font-mukta text-xs sm:text-sm text-stone-300">
                अपनी प्रोफाइल पूर्ण करें ताकि आपका छठ अनुभव पूरी तरह आपके अनुरूप बन सके।
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="text-center space-y-2">
              <span className="block text-xs font-bold text-stone-300">अपना पावन अवतार चुनें</span>
              <div className="flex justify-center gap-2.5">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-12 h-12 rounded-full p-[2px] transition-transform ${
                      selectedAvatar === av
                        ? 'bg-amber-400 scale-110 shadow-lg shadow-amber-400/40'
                        : 'bg-stone-800 hover:scale-105 opacity-70'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">पूरा नाम (Full Name)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="उदा. प्रमोद कुमार"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">यूनिक यूजरनेम (@username)</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@pramod_chhath"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 hover:brightness-110 transition-all"
              >
                <span>आगे बढ़ें (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE YOUR LANGUAGE */}
        {step === 2 && (
          <div className="relative z-10 space-y-5 animate-fadeIn">
            <div className="text-center space-y-1">
              <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">
                अपनी पसंदीदा भाषा चुनें 🌐
              </h3>
              <p className="font-mukta text-xs sm:text-sm text-stone-300">
                “आप Chhath Mahaparv को किस भाषा में देखना चाहते हैं?”
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { code: 'hi', label: 'हिंदी', sub: 'Hindi', flag: '🇮🇳' },
                { code: 'bho', label: 'भोजपुरी', sub: 'Bhojpuri', flag: '🟠' },
                { code: 'mai', label: 'मैथिली', sub: 'Maithili', flag: '🟢' },
                { code: 'en', label: 'English', sub: 'Global', flag: '🔵' }
              ].map(item => {
                const isSelected = selectedLang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleLanguageChange(item.code as Language)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-stone-900/60 border-stone-800 hover:border-amber-500/30'
                    }`}
                  >
                    <div>
                      <span className="text-xl block mb-1">{item.flag}</span>
                      <div className="font-rozha text-lg font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{item.sub}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-400 text-center font-mukta">
              * आप इस भाषा को बाद में कभी भी ऊपर दिए गए मेनू से बदल सकते हैं।
            </p>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>वापस</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
              >
                <span>आगे बढ़ें (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE YOUR INTERESTS */}
        {step === 3 && (
          <div className="relative z-10 space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">
                अपनी रुचियां चुनें (Select Interests) 🪔
              </h3>
              <p className="font-mukta text-xs sm:text-sm text-stone-300">
                “आपको Chhath में सबसे ज्यादा क्या पसंद है?” (एक से अधिक चुन सकते हैं)
              </p>
            </div>

            {/* 14 Sacred Interests Multi-Select Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {CHHATH_INTERESTS.map(item => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-900'
                    }`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">{item.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold font-mukta truncate">{item.hindiName}</div>
                      <div className="text-[10px] text-stone-400 truncate">{item.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center text-[11px] text-amber-400 font-mono">
              {selectedInterests.length} विषय चयनित • आपका फीड इन रुचियों के आधार पर सजेगा
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>वापस</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
              >
                <span>आगे बढ़ें (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION PREFERENCE */}
        {step === 4 && (
          <div className="relative z-10 space-y-5 animate-fadeIn">
            <div className="text-center space-y-1">
              <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">
                छठ का स्थान (Your Location) 📍
              </h3>
              <p className="font-mukta text-xs sm:text-sm text-stone-300">
                “आप इस बार छठ कहाँ मना रहे हैं?”
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">देश (Country)</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="India">भारत (India)</option>
                  <option value="USA">संयुक्त राज्य अमेरिका (USA)</option>
                  <option value="UAE">संयुक्त अरब अमीरात (UAE)</option>
                  <option value="UK">यूनाइटेड किंगडम (UK)</option>
                  <option value="Canada">कनाडा (Canada)</option>
                  <option value="Australia">ऑस्ट्रेलिया (Australia)</option>
                  <option value="Other">अन्य देश (Other)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">राज्य (State)</label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Bihar">बिहार (Bihar)</option>
                    <option value="Jharkhand">झारखंड (Jharkhand)</option>
                    <option value="Uttar Pradesh">उत्तर प्रदेश (UP)</option>
                    <option value="Delhi">दिल्ली (Delhi NCR)</option>
                    <option value="Maharashtra">महाराष्ट्र (Mumbai/Pune)</option>
                    <option value="West Bengal">पश्चिम बंगाल (Kolkata)</option>
                    <option value="Other">अन्य राज्य (Other State)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">शहर (City)</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Patna, Varanasi, Gaya..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2 font-mukta">
                <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  इस स्थान के अनुसार आपको निकटतम छठ घाट, सटीक संध्या व उषा अर्घ्य समय, और स्थानीय मौसम की जानकारी मिलेगी।
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>वापस</span>
              </button>
              <button
                type="button"
                disabled={isFinishing || !city.trim()}
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-orange-600/30 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isFinishing ? 'तैयार हो रहा है...' : 'मेरा छठ शुरू करें (Enter Platform)'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
