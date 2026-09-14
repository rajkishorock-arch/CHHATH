import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Sun, 
  Sunset, 
  Sunrise, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  Share2, 
  Printer, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Info,
  ListChecks
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getChhathDays } from '../../data/days';
import { calculateChhathStatus } from '../hero/LiveFestivalExperience';
import { Language } from '../../types';

interface ChhathVidhiInteractiveProps {
  onNavigate: (url: string) => void;
}

export interface VidhiChecklistItem {
  id: string;
  dayId: string;
  text: Record<Language, string>;
  category?: string;
}

// 20 authentic, actionable items across 4 days (5 per day)
export const vidhiChecklistData: VidhiChecklistItem[] = [
  // Day 1: Nahay Khay
  {
    id: 'vidhi-d1-item-1',
    dayId: 'nahay-khay',
    text: {
      hi: 'घर एवं रसोईघर की पूर्ण धुलाई और गंगाजल छिड़क कर शुद्धि',
      en: 'Thorough cleaning & purification of home and kitchen with Ganga water',
      bho: 'घर आ रसोईघर के पूरा सफाई आ गंगाजल छींट के सुद्धिकरण',
      mai: 'घर ओ भानसक (रसोई) पूर्ण सफाई आ गंगाजल छिड़कि कऽ शुद्धि',
      mag: 'घर व रसोईघर के पूरा सफाई आ गंगाजल छिड़क के शुद्धि'
    }
  },
  {
    id: 'vidhi-d1-item-2',
    dayId: 'nahay-khay',
    text: {
      hi: 'सूर्योदय के समय पवित्र नदी या गंगाजल मिले जल से स्नान',
      en: 'Holy morning bath in a sacred river or water mixed with Ganga water',
      bho: 'सबेरे पावन नदी भा गंगाजल मिलावल पानी से असनान',
      mai: 'प्रातःकाल पवित्र नदी वा गंगाजल मिश्रित जल सं स्नान',
      mag: 'सबेरे पावन नदी या गंगाजल मिलावल जल से स्नान'
    }
  },
  {
    id: 'vidhi-d1-item-3',
    dayId: 'nahay-khay',
    text: {
      hi: 'नए अथवा शुद्ध धौत पवित्र सूती वस्त्र धारण करना',
      en: 'Wearing clean, fresh, unstitched sacred cotton clothing',
      bho: 'नया भा साफ धोवल पवित्र बस्तर पहिनल',
      mai: 'नव वा धौत पवित्र वस्त्र धारण करब',
      mag: 'नया या साफ धोवल सूती कपड़ा पहिनल'
    }
  },
  {
    id: 'vidhi-d1-item-4',
    dayId: 'nahay-khay',
    text: {
      hi: 'सेंधा नमक व देसी घी में कद्दू (लौकी), अरवा भात व चने की दाल बनाना',
      en: 'Preparing satvik Kaddu-Bhat, chana dal in rock salt & pure desi ghee',
      bho: 'सेंधा नोन आ देसी घीव में कद्दू के तरकारी, अरवा भात आ चना दाल बनावल',
      mai: 'सेंधा नून ओ देशी घीव में कद्दूक तरकारी, अरवा भात ओ चना दालि बनाएब',
      mag: 'सेंधा नमक व देशी घी में कद्दू के सब्जी, अरवा भात व चना दाल बनावल'
    }
  },
  {
    id: 'vidhi-d1-item-5',
    dayId: 'nahay-khay',
    text: {
      hi: 'भगवान सूर्य को भोग लगाकर व्रती द्वारा सर्वप्रथम प्रसाद ग्रहण करना',
      en: 'Offering bhog to Lord Surya and Vrati taking the sanctified meal first',
      bho: 'सुरुज भगवान के भोग लगा के बरतिया द्वारा पहिले प्रसाद ग्रहण कइल',
      mai: 'सूर्य देवकेँ भोग लगा कऽ व्रती द्वारा सर्वप्रथम प्रसाद ग्रहण करब',
      mag: 'सूर्य देव के भोग लगा के बरतिया द्वारा सबसे पहिले प्रसाद ग्रहण कइल'
    }
  },

  // Day 2: Kharna
  {
    id: 'vidhi-d2-item-1',
    dayId: 'kharna',
    text: {
      hi: 'सूर्योदय से सायंकाल तक अखंड निर्जला उपवास रखना',
      en: 'Observing a strict waterless fast from sunrise until evening dusk',
      bho: 'दिन भर निर्जला उपवास रखल, संझा तक पानी ना पिएल',
      mai: 'सूर्योदय सं संध्या धरि अखंड निर्जला उपवास राखब',
      mag: 'सूर्योदय से सायंकाल तक निर्जला उपवास रखल'
    }
  },
  {
    id: 'vidhi-d2-item-2',
    dayId: 'kharna',
    text: {
      hi: 'मिट्टी के नए चूल्हे पर आम की लकड़ी से गुड़-दूध की खीर (रसियाव) बनाना',
      en: 'Cooking Rasiyaw (jaggery kheer) on mango wood fire in a new earthen stove',
      bho: 'माटी के नया चूल्हा पर आम के लकड़ी से गुड़ के खीर (रसियाव) बनावल',
      mai: 'माटिक नव चूल्हा पर आमक काठ सं गुड़क खीर (रसियाव) बनाएब',
      mag: 'माटी के नया चूल्हा पर आम के लकड़ी से गुड़ के खीर बनावल'
    }
  },
  {
    id: 'vidhi-d2-item-3',
    dayId: 'kharna',
    text: {
      hi: 'एकांत शांत कक्ष में केले के पत्ते पर मां षष्ठी को भोग अर्पित करना',
      en: 'Offering kheer, ghee rotis & bananas to Chhathi Maiya in serene silence',
      bho: 'एकांत कमरा में केरा के पात पर छठी मइया के भोग लगावल',
      mai: 'एकांत शांत कक्ष में केराक पात पर मां षष्ठीकेँ भोग अर्पित करब',
      mag: 'एकांत कमरा में केला के पात पर छठी मैया के भोग अर्पित कइल'
    }
  },
  {
    id: 'vidhi-d2-item-4',
    dayId: 'kharna',
    text: {
      hi: 'पूर्ण नीरवता में व्रती द्वारा रसियाव-रोटी प्रसाद ग्रहण करना',
      en: 'Vrati partaking in Rasiyaw-Roti prasad in complete meditative silence',
      bho: 'पूरा संन्नाटा में बरतिया द्वारा रसियाव-रोटी प्रसाद ग्रहण कइल',
      mai: 'पूर्ण नीरवता में व्रती द्वारा रसियाव-रोटी प्रसाद ग्रहण करब',
      mag: 'पूरा शांति में बरतिया द्वारा रसियाव-रोटी प्रसाद ग्रहण कइल'
    }
  },
  {
    id: 'vidhi-d2-item-5',
    dayId: 'kharna',
    text: {
      hi: 'परिजनों एवं पड़ोसियों में अमृतमयी महाप्रसाद का वितरण करना',
      en: 'Distributing the blessed Mahaprasad to family, neighbors and relatives',
      bho: 'सब परिवार आ पड़ोस में महाप्रसाद बंटावल',
      mai: 'कुटुम-सजन ओ आसे-पासे में महाप्रसाद वितरण करब',
      mag: 'परिवार व आस-पड़ोस में महाप्रसाद बाँटल'
    }
  },

  // Day 3: Sandhya Arghya
  {
    id: 'vidhi-d3-item-1',
    dayId: 'sandhya-arghya',
    text: {
      hi: 'देशी घी में गेहूं के आटे व गुड़ का ठेकुआ, भुसवा व कसार तैयार करना',
      en: 'Preparing sacred Thekua, Bhuswa & Kasar prasad in pure cow ghee',
      bho: 'देसी घीव में गेंहू के आटा आ गुड़ के ठेकुआ-भुसवा बनावल',
      mai: 'देशी घीव में गेहूँक आटा ओ गुड़क ठेकुआ-भुसवा तैयार करब',
      mag: 'देशी घी में गेहूं के आटा व गुड़ के ठेकुआ बनावल'
    }
  },
  {
    id: 'vidhi-d3-item-2',
    dayId: 'sandhya-arghya',
    text: {
      hi: 'बांस के सूप में ठेकुआ, नारियल, गन्ना, डाभा नींबू, फल व दीया सजाना',
      en: 'Decorating bamboo winnows (soop) with fruits, sugarcane, coconut & lamps',
      bho: 'बांस के सूप में ठेकुआ, नारियल, ईख, फल आ दीया सजावल',
      mai: 'बाँसक सूप में ठेकुआ, नारिकेल, ऊखि, फल ओ दीप सजाएब',
      mag: 'बांस के सूप में ठेकुआ, नारियल, गन्ना व दीया सजावल'
    }
  },
  {
    id: 'vidhi-d3-item-3',
    dayId: 'sandhya-arghya',
    text: {
      hi: 'सिर पर दउरा उठाकर नंगे पांव पारंपरिक छठ गीत गाते हुए घाट प्रस्थान',
      en: 'Carrying sacred Daura on head while walking barefoot to ghat singing folk songs',
      bho: 'माथा पर दउरा उठा के नंगे पांव लोकगीत गावत घाट ले जाइल',
      mai: 'माथ पर दउरा लऽ कऽ नंगे पैर छठि गीत गबैत घाट दिश प्रस्थान करब',
      mag: 'सिर पर दउरा उठा के नंगे पांव छठ गीत गावत घाट जाइल'
    }
  },
  {
    id: 'vidhi-d3-item-4',
    dayId: 'sandhya-arghya',
    text: {
      hi: 'जल में खड़े होकर अस्ताचलगामी सूर्य को दूध व जल की धारा से अर्घ्य देना',
      en: 'Standing waist-deep in water to offer Arghya to setting Sun with milk & water',
      bho: 'पानी में खड़ा होके डूबत सुरुज के दूध आ जल के धार से अरघ देहल',
      mai: 'जल में ठाढ़ भऽ कऽ अस्ताचलगामी सूर्यकेँ दूध ओ जल सं अर्घ्य देब',
      mag: 'जल में खड़ा हो के डूबत सूर्य के दूध व जल से अर्घ्य देहल'
    }
  },
  {
    id: 'vidhi-d3-item-5',
    dayId: 'sandhya-arghya',
    text: {
      hi: 'रात्रि में गन्ने का भव्य कोसी मंडप बनाकर दीपक जलाना व रातभर जागरण',
      en: 'Erecting sugarcane Kosi canopy with lamps for night-long vigil & hymns',
      bho: 'रात में ईख के कोसी भरल आ रात भर मंगल गीत गावल',
      mai: 'राति में ईखक कोसी भरब ओ राति भरि जागरण ओ गीत गाएब',
      mag: 'रात में गन्ने के कोसी भर के रातभर जागरण कइल'
    }
  },

  // Day 4: Usha Arghya
  {
    id: 'vidhi-d4-item-1',
    dayId: 'usha-arghya',
    text: {
      hi: 'ब्रह्ममुहूर्त में घाट पहुंचकर सूप-दउरा सजाकर पूर्व दिशा में जल में खड़े होना',
      en: 'Reaching ghat before dawn, arranging soops facing east in cold waters',
      bho: 'भोरही में घाट पहुंच के सूप सजा के जल में खड़ा होइल',
      mai: 'ब्रह्ममुहूर्त में घाट पहुँचि कऽ पूर्व दिशा में जल में ठाढ़ हेब',
      mag: 'भोर में घाट पहुंच के सूप सजा के जल में खड़ा होइल'
    }
  },
  {
    id: 'vidhi-d4-item-2',
    dayId: 'usha-arghya',
    text: {
      hi: 'सूर्य की प्रथम लालिमा बिखरते ही उदित सूर्यदेव को दूध व जल से अंतिम अर्घ्य देना',
      en: 'Offering final Arghya of cow milk & water as first rays of morning Sun emerge',
      bho: 'सुरुज के पहिला लाली लउकते उगत सुरुज के दूध आ जल से अंतिम अरघ देहल',
      mai: 'सूर्य केर प्रथम लालिमा देखिते उदित सूर्यकेँ दूध ओ जल सं अंतिम अर्घ्य देब',
      mag: 'सूर्य के पहिला लाली दिखते उदित सूर्य के दूध व जल से अर्घ्य देहल'
    }
  },
  {
    id: 'vidhi-d4-item-3',
    dayId: 'usha-arghya',
    text: {
      hi: 'छठी मईया की आरती गाकर परिवार के कल्याण व संतान की दीर्घायु का वर मांगना',
      en: 'Chanting Chhathi Maiya Aarti & seeking blessings for family longevity & health',
      bho: 'छठी मइया के आरती गा के लइका-परिवार के लमहर उमिर के असीस माँगल',
      mai: 'छठी मइयाक आरती गा कऽ संतानक दीर्घायु ओ परिवारक कल्याणक वर मांगब',
      mag: 'छठी मैया के आरती गा के परिवार व बच्चा के सुख-समृद्धि मांगना'
    }
  },
  {
    id: 'vidhi-d4-item-4',
    dayId: 'usha-arghya',
    text: {
      hi: 'घाट पर ही कच्चा दूध, अदरक, अंकुरित चना व गुड़ खाकर 36 घंटे का पारण करना',
      en: 'Breaking 36-hour waterless fast at ghat with raw milk, ginger, gram & jaggery',
      bho: 'घाटे पर कच्चा दूध, आदी, चना आ गुड़ खा के पारण कइल',
      mai: 'घाटहि पर काँच दूध, आदा, चना ओ गुड़ खा कऽ व्रतक पारण करब',
      mag: 'घाट पर ही कच्चा दूध, अदरक, चना व गुड़ खा के पारण कइल'
    }
  },
  {
    id: 'vidhi-d4-item-5',
    dayId: 'usha-arghya',
    text: {
      hi: 'बुजुर्गों के चरण स्पर्श कर आशीर्वाद लेना और ठेकुआ महाप्रसाद का वितरण करना',
      en: "Seeking elders' blessings & distributing holy Thekua prasad to all",
      bho: 'बुजुर्गन के गोड़ छू के आशीर्वाद लीहल आ ठेकुआ महाप्रसाद बांटल',
      mai: 'ज्येष्ठ लोकनिक चरण स्पर्श कऽ आशीर्वाद लेब ओ ठेकुआ महाप्रसाद बाँटब',
      mag: 'बुजुर्ग के पैर छू के आशीर्वाद लेहल व ठेकुआ प्रसाद बाँटल'
    }
  }
];

const STORAGE_KEY = 'chhath-vidhi-checklist-2026-v1';

export const ChhathVidhiInteractive: React.FC<ChhathVidhiInteractiveProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const days = getChhathDays(language);
  const { stateData } = calculateChhathStatus(new Date(), language);

  // Default active tab to current live day (0..3) if within festival, else 0
  const initialTab = (stateData.activeStep >= 1 && stateData.activeStep <= 4) 
    ? stateData.activeStep - 1 
    : 0;

  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
    return new Set();
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checkedIds)));
    } catch (e) {
      console.warn('localStorage save error:', e);
    }
  }, [checkedIds]);

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    const confirmMsg = language === 'en'
      ? 'Are you sure you want to reset your Chhath Vidhi checklist progress?'
      : 'क्या आप निश्चित रूप से छठ विधि चेकलिस्ट की अपनी तैयारी रीसेट करना चाहते हैं?';
    if (window.confirm(confirmMsg)) {
      setCheckedIds(new Set());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDayInfo = days[activeTab] || days[0];
  const dayItems = vidhiChecklistData.filter(item => item.dayId === currentDayInfo.id);
  const dayCheckedCount = dayItems.filter(item => checkedIds.has(item.id)).length;
  const dayTotalCount = dayItems.length;
  const dayPercent = dayTotalCount > 0 ? Math.round((dayCheckedCount / dayTotalCount) * 100) : 0;
  const isDayComplete = dayCheckedCount === dayTotalCount && dayTotalCount > 0;

  const totalCheckedCount = vidhiChecklistData.filter(item => checkedIds.has(item.id)).length;
  const totalItemsCount = vidhiChecklistData.length;
  const totalPercent = Math.round((totalCheckedCount / totalItemsCount) * 100);
  const isAllComplete = totalCheckedCount === totalItemsCount;

  // Day Status badge helper
  const getDayStatusBadge = (idx: number) => {
    const dayNum = idx + 1;
    if (stateData.activeStep === 0) {
      if (dayNum === 1) return { label: '→ अगला', cls: 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40' };
      return { label: 'आगामी', cls: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/20' };
    }
    if (stateData.activeStep > 0 && stateData.activeStep <= 4) {
      if (dayNum === stateData.activeStep) {
        return { label: '🟢 आज (Today)', cls: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-500/50 font-bold' };
      }
      if (dayNum < stateData.activeStep) {
        return { label: '✓ पूरा हुआ', cls: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/20' };
      }
      if (dayNum === stateData.activeStep + 1) {
        return { label: '→ अगला', cls: 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40' };
      }
    }
    if (stateData.activeStep === 5) {
      return { label: '✓ संपन्न', cls: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/20' };
    }
    return { label: 'आगामी', cls: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/20' };
  };

  // Banner text for "आज क्या है?"
  const getLiveBannerText = () => {
    switch (stateData.stateKey) {
      case 'pre-chhath':
        return 'छठ महापर्व शुरू होने वाला है (13 नवंबर 2026 से)';
      case 'nahay-khay':
        return 'आज नहाय-खाय है (दिन 1)';
      case 'kharna':
        return 'आज खरना है (दिन 2)';
      case 'sandhya-arghya':
        return 'आज संध्या अर्घ्य है (दिन 3)';
      case 'usha-arghya':
        return 'आज उषा अर्घ्य और पारण है (दिन 4)';
      case 'post-chhath':
        return 'छठ महापर्व 2026 संपन्न हो चुका है';
      default:
        return 'छठ महापर्व 2026';
    }
  };

  return (
    <div className="w-full space-y-8 font-mukta">
      
      {/* 1. Live Today Banner */}
      <div className="print:hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center font-bold shrink-0">
            <Sun className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              लाइव अपडेट • Asia/Kolkata
            </span>
            <h2 className="font-rozha text-lg sm:text-xl font-bold text-stone-900 dark:text-amber-100">
              {getLiveBannerText()}
            </h2>
          </div>
        </div>

        {/* Overall progress indicator pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-stone-900/90 px-4 py-2 rounded-xl border border-amber-500/20">
          <div className="text-right">
            <span className="text-xs text-stone-600 dark:text-stone-300 font-semibold block">पूरे पर्व की तैयारी</span>
            <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">{totalCheckedCount} / {totalItemsCount} पूरे ({totalPercent}%)</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 flex items-center justify-center font-bold text-xs">
            {totalPercent}%
          </div>
        </div>
      </div>

      {/* 2. Four-Day Navigation Tabs / Cards */}
      <div className="print:hidden space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span>छठ महापर्व के 4 दिन</span>
          </h3>
          <span className="text-xs text-stone-600 dark:text-stone-400">दिन का चयन करें ↓</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {days.map((day, idx) => {
            const isSelected = activeTab === idx;
            const badge = getDayStatusBadge(idx);
            const itemsForDay = vidhiChecklistData.filter(it => it.dayId === day.id);
            const countChecked = itemsForDay.filter(it => checkedIds.has(it.id)).length;

            return (
              <button
                key={day.id}
                onClick={() => setActiveTab(idx)}
                aria-selected={isSelected}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-md'
                    : 'bg-white dark:bg-stone-900 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${badge.cls}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs text-stone-500 font-bold">
                    {countChecked}/{itemsForDay.length}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-stone-600 dark:text-stone-300 font-bold block">
                    दिन {day.dayNumber}
                  </span>
                  <h4 className="font-rozha font-bold text-base sm:text-lg text-stone-900 dark:text-amber-100 line-clamp-1">
                    {day.nameKey === 'nahayKhay' && 'नहाय-खाय'}
                    {day.nameKey === 'kharna' && 'खरना'}
                    {day.nameKey === 'sandhyaArghya' && 'संध्या अर्घ्य'}
                    {day.nameKey === 'ushaArghya' && 'उषा अर्घ्य व पारण'}
                  </h4>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold block mt-0.5">
                    {day.date2026.split('(')[0]}
                  </span>
                </div>

                {/* Day mini progress bar */}
                <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${itemsForDay.length > 0 ? (countChecked / itemsForDay.length) * 100 : 0}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Day Guide Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/30 shadow-md space-y-6">
        
        {/* Day Header & Progress */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-amber-500/15 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>दिन {currentDayInfo.dayNumber} • {currentDayInfo.tithi}</span>
            </div>
            <h3 className="font-rozha text-2xl sm:text-3xl font-black text-stone-900 dark:text-amber-100">
              {currentDayInfo.title}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm max-w-2xl">
              {currentDayInfo.meaning}
            </p>
          </div>

          <div className="w-full sm:w-auto bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-center space-y-2 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
              <span>आज की तैयारी</span>
              <span className="text-amber-700 dark:text-amber-400">{dayCheckedCount} / {dayTotalCount} पूरे</span>
            </div>
            {/* Progress bar with ARIA */}
            <div 
              role="progressbar" 
              aria-valuenow={dayPercent} 
              aria-valuemin={0} 
              aria-valuemax={100}
              className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden"
            >
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${dayPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400 block">
              {dayPercent}% तैयारी संपन्न
            </span>
          </div>
        </div>

        {/* 4. Actionable Interactive Checklist: "आज क्या करें?" */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-amber-500" />
              <span>आज क्या करें? — आवश्यक तैयारी checklist</span>
            </h4>

            <div className="print:hidden flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 text-stone-700 dark:text-stone-300 transition-all"
                title="चेकलिस्ट रीसेट करें"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 text-stone-700 dark:text-stone-300 transition-all"
                title="प्रिंट करें"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट</span>
              </button>
            </div>
          </div>

          {/* Checklist Items List */}
          <div className="space-y-2">
            {dayItems.map(item => {
              const isChecked = checkedIds.has(item.id);
              const textStr = item.text[language] || item.text.hi;

              return (
                <label
                  key={item.id}
                  htmlFor={`checkbox-${item.id}`}
                  className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-amber-500/10 border-amber-500/40 text-stone-900 dark:text-amber-100'
                      : 'bg-white dark:bg-stone-900/80 border-amber-500/20 hover:border-amber-500/40 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`checkbox-${item.id}`}
                    checked={isChecked}
                    onChange={() => toggleCheck(item.id)}
                    className="w-5 h-5 mt-0.5 accent-amber-500 rounded cursor-pointer shrink-0"
                  />
                  <span className={`text-sm sm:text-base font-semibold leading-relaxed ${
                    isChecked ? 'line-through text-stone-500 dark:text-stone-400' : ''
                  }`}>
                    {textStr}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Day Complete Banner */}
          {isDayComplete && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 text-center font-bold text-sm sm:text-base animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>🎉 इस दिन की संपूर्ण तैयारी पूरी हो गई है!</span>
            </div>
          )}

          {/* All Days Complete Celebration Banner */}
          {isAllComplete && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-amber-500/20 border-2 border-amber-500 text-stone-900 dark:text-amber-100 text-center font-bold text-base sm:text-lg shadow-lg space-y-1">
              <div>🎉 जय छठी मईया! छठ महापर्व 2026 की संपूर्ण 20 तैयारियां पूरी हो चुकी हैं!</div>
              <p className="text-xs font-normal text-stone-700 dark:text-amber-200">
                आपका व्रत सफल, आरोग्यप्रद एवं मंगलमय हो।
              </p>
            </div>
          )}
        </div>

        {/* 5. Detailed Rituals & Food Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* Rituals list */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-3">
            <h5 className="font-rozha text-lg font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>प्रमुख नियम व विधि</span>
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              {currentDayInfo.rituals.map((r, rIdx) => (
                <li key={rIdx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Food & Importance */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-2">
              <h5 className="font-rozha text-lg font-bold text-amber-800 dark:text-amber-300">
                विशेष आहार / प्रसाद
              </h5>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {currentDayInfo.food}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-2">
              <h5 className="font-rozha text-lg font-bold text-orange-800 dark:text-orange-300">
                आध्यात्मिक महत्व
              </h5>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {currentDayInfo.importance}
              </p>
            </div>
          </div>

        </div>

        {/* 6. Contextual CTAs & Links */}
        <div className="pt-4 border-t border-amber-500/15 grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
          
          {/* Arghya timing CTA for Day 3 & 4 */}
          {(currentDayInfo.id === 'sandhya-arghya' || currentDayInfo.id === 'usha-arghya') && (
            <button
              onClick={() => onNavigate('/CHHATH/chhath-arghya-time-2026/')}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-900 font-bold text-sm flex items-center justify-between shadow-sm hover:brightness-105 transition-all"
            >
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                <span>
                  {currentDayInfo.id === 'sandhya-arghya' ? 'संध्या अर्घ्य का सटीक समय देखें →' : 'उषा अर्घ्य का सटीक समय देखें →'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Samagri checklist link for all days */}
          <button
            onClick={() => onNavigate('/CHHATH/chhath-samagri/')}
            className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-amber-500" />
              <span>पूजा की सामग्री की पूरी checklist देखें →</span>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-500" />
          </button>
        </div>

        {/* 7. Previous / Next Day Navigation Buttons */}
        <div className="print:hidden pt-4 border-t border-amber-500/15 flex items-center justify-between gap-4">
          <button
            onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
            disabled={activeTab === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border transition-all ${
              activeTab === 0
                ? 'opacity-40 cursor-not-allowed border-stone-300 dark:border-stone-800 text-stone-400'
                : 'border-amber-500/30 hover:border-amber-500 text-stone-800 dark:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← पिछला दिन</span>
          </button>

          <span className="text-xs text-stone-500 font-semibold">
            दिन {activeTab + 1} / 4
          </span>

          <button
            onClick={() => setActiveTab(prev => Math.min(days.length - 1, prev + 1))}
            disabled={activeTab === days.length - 1}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border transition-all ${
              activeTab === days.length - 1
                ? 'opacity-40 cursor-not-allowed border-stone-300 dark:border-stone-800 text-stone-400'
                : 'border-amber-500/30 hover:border-amber-500 text-stone-800 dark:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <span>अगला दिन →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 8. Contextual Chhath Calendar Card */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>छठ पूजा कैलेंडर 2026</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300">
            13 नवंबर (नहाय-खाय) • 14 नवंबर (खरना) • 15 नवंबर (संध्या अर्घ्य) • 16 नवंबर (उषा अर्घ्य)
          </p>
        </div>

        <button
          onClick={() => onNavigate('/CHHATH/chhath-calendar-2026/')}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/30 hover:border-amber-500 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
        >
          <span>संपूर्ण कैलेंडर देखें</span>
          <ArrowRight className="w-4 h-4 text-amber-500" />
        </button>
      </div>

    </div>
  );
};
