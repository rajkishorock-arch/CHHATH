import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Home, 
  Sun, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Sunrise, 
  Utensils, 
  Flame, 
  FileText, 
  Compass, 
  Sparkles, 
  Music, 
  Film, 
  Sliders, 
  Layers, 
  Award, 
  Camera, 
  Brain, 
  Heart, 
  Settings, 
  User, 
  Share2, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  BellRing
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useReels } from '../../context/ReelsContext';
import { SeoHead } from '../seo/SeoHead';

interface AllFeaturesPageProps {
  onNavigate: (tab: string) => void;
  onOpenMixer?: () => void;
  onOpenAssistant?: () => void;
  onOpenJapMala?: () => void;
}

export const AllFeaturesPage: React.FC<AllFeaturesPageProps> = ({
  onNavigate,
  onOpenMixer,
  onOpenAssistant,
  onOpenJapMala
}) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { currentUser, isAuthenticated, openAuthModal, openAccountCenter } = useAuth();
  const { openReelsPlatform } = useReels();

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'छठ महापर्व एवं सनातन व्रत डिजिटल सेवा',
      text: 'छठ महापर्व 2026 की संपूर्ण पूजा विधि, अर्घ्य समय, छठ गीत, कथा, आरती व 20+ फीचर्स:',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      showToast('ऐप लिंक क्लिपबोर्ड में कॉपी हो गया!');
    }
  };

  const handleAction = (item: { id: string; action?: () => void }) => {
    if (item.action) {
      item.action();
      return;
    }
    if (item.id === 'reels') {
      openReelsPlatform('foryou');
      return;
    }
    if (item.id === 'mixer') {
      onOpenMixer?.();
      return;
    }
    if (item.id === 'ai-pandit') {
      if (onOpenAssistant) {
        onOpenAssistant();
      } else {
        onNavigate('ai-pandit');
      }
      return;
    }
    if (item.id === 'jap_mala' || item.id === 'jap-mala') {
      onNavigate('jap-mala');
      return;
    }
    if (item.id === 'account') {
      if (isAuthenticated) {
        openAccountCenter('profile');
      } else {
        openAuthModal('login');
      }
      return;
    }
    if (item.id === 'share') {
      handleShareApp();
      return;
    }

    onNavigate(item.id);
  };

  // Structured categories containing all features
  const categories = [
    {
      id: 'chhath-core',
      title: 'छठ महापर्व सेवाएं व अनुष्ठान',
      subtitle: 'Chhath Mahaparv Services & Rituals',
      badge: 'महापर्व',
      items: [
        {
          id: 'chhath',
          title: 'छठ महापर्व डिजिटल हब',
          desc: 'गीत, अर्घ्य समय, घाट व संपूर्ण पावन पूजन सामग्री',
          icon: Sun,
          badge: 'मुख्य',
          highlight: true
        },
        {
          id: 'guide',
          title: '4 दिवसीय पावन टाइमलाइन',
          desc: 'नहाय-खाय से उषा अर्घ्य व पारण तक की विस्तृत समय-सारिणी',
          icon: Calendar,
          badge: 'पंचांग'
        },
        {
          id: 'chhath-puja-vidhi',
          title: 'प्रामाणिक पूजा विधि',
          desc: 'षष्ठी मैया पूजन के नियम, विधि, व्रत संकल्प व सावधानियां',
          icon: BookOpen,
          badge: 'विस्तृत'
        },
        {
          id: 'chhath-samagri',
          title: 'सूप व दौरा सामग्री चेकलिस्ट',
          desc: 'डलिया, दौरा, ठेकुआ, फल व संपूर्ण वैदिक सामग्री की सूची',
          icon: CheckSquare
        },
        {
          id: 'chhath-arghya-time-2026',
          title: 'सूर्य अर्घ्य मुहूर्त व समय',
          desc: 'संध्या व उषा अर्घ्य का सटीक ज्योतिषीय सूर्योदय-सूर्यास्त समय',
          icon: Sunrise,
          badge: 'मुहूर्त',
          highlight: true
        },
        {
          id: 'thekua-recipe',
          title: 'ठेकुआ व महाप्रसाद विधि',
          desc: 'पारंपरिक काठ के सांचे से शुद्ध घी के ठेकुआ व खजूर रेसिपी',
          icon: Utensils
        },
        {
          id: 'chhath-puja-katha',
          title: 'छठ व्रत पावन कथा',
          desc: 'राजा प्रियव्रत, सुव्रत व माता षष्ठी की पौराणिक प्रामाणिक कथा',
          icon: FileText
        },
        {
          id: 'aarti',
          title: 'सूर्य देव मंत्र व आरती',
          desc: 'आदित्य हृदय स्तोत्र, गायत्री मंत्र व पावन सूर्य देव वंदना',
          icon: Flame
        },
        {
          id: 'ghats',
          title: 'पावन घाट व सुरक्षा निर्देशिका',
          desc: 'गंगा घाट चयन, आपातकालीन सहायता व अर्घ्य सुरक्षा निर्देश',
          icon: Compass
        },
        {
          id: 'patna-chhath-puja-2026',
          title: 'पटना छठ महापर्व गाइड',
          desc: 'पटना के प्रमुख गंगा घाट, ट्रैफिक रूट व प्रशासन व्यवस्था',
          icon: Compass
        }
      ]
    },
    {
      id: 'sanatan-vrats',
      title: 'सनातन व्रत एवं महापर्व महामंच',
      subtitle: 'Universal Hindu Vrat & Festival Hub',
      badge: 'सनातन',
      items: [
        {
          id: 'all-vrats',
          title: 'समस्त सनातन व्रत एवं महापर्व',
          desc: '17+ महापर्व, पंचांग, इतिहास, मुहूर्त व प्रामाणिक विधान',
          icon: Sparkles,
          badge: 'महामंच',
          highlight: true
        },
        {
          id: 'vrat-katha',
          title: 'संपूर्ण व्रत कथा संग्रह',
          desc: 'एकादशी, महाशिवरात्रि, करवा चौथ, हरतालिका तीज, सकट कथाएं',
          icon: BookOpen
        },
        {
          id: 'aarti-sangrah',
          title: 'संपूर्ण आरती संग्रह',
          desc: 'गणेश, शिव, हनुमान, दुर्गा, लक्ष्मी, सूर्य, राम, कृष्ण आरतियां',
          icon: Flame
        },
        {
          id: 'paath-chalisa',
          title: 'नित्य पाठ व चालीसा संग्रह',
          desc: 'हनुमान चालीसा, शिव चालीसा, दुर्गा चालीसा व देवी कवच',
          icon: FileText
        },
        {
          id: 'shubh-vichar',
          title: 'दैनिक शुभ विचार व अमृत वचन',
          desc: 'श्रीमद्भगवद्गीता श्लोक, कबीर दोहे व आध्यात्मिक प्रेरणा',
          icon: Sun,
          badge: 'दैनिक'
        },
        {
          id: 'famous-temples',
          title: 'प्रसिद्ध मंदिर व तीर्थ धाम',
          desc: 'देव सूर्य मंदिर, काशी विश्वनाथ, अयोध्या राम मंदिर, तिरुपति',
          icon: Compass
        },
        {
          id: 'jap-mala',
          title: '108 डिजिटल जप माला',
          desc: 'रुद्राक्ष, तुलसी व कमलगट्टा मनकों वाली पावन जप माला ध्वनि सहित',
          icon: Sparkles,
          badge: '108 जप',
          highlight: true
        }
      ]
    },
    {
      id: 'music-media',
      title: 'भक्ति संगीत, रील्स व ऑडियो',
      subtitle: 'Devotional Songs, Reels & Ambience',
      badge: 'मीडिया',
      items: [
        {
          id: 'music',
          title: 'छठ भक्ति संगीत स्टूडियो',
          desc: 'शारदा सिन्हा, अनुराधा पौडवाल, पवन सिंह व पावन छठ भजन',
          icon: Music,
          badge: 'संगीत',
          highlight: true
        },
        {
          id: 'reels',
          title: 'छठ रील्स व शॉर्ट वीडियो',
          desc: '9:16 पूर्ण स्क्रीन पावन भक्ति रील्स, स्टेटस व वीडियो',
          icon: Film,
          badge: 'रील्स',
          highlight: true
        },
        {
          id: 'mixer',
          title: 'वातावरण ऑडियो मिक्सर',
          desc: 'गंगा लहर, मंदिर घंटी, बांसुरी, दीया व ध्यान ध्वनि',
          icon: Sliders,
          badge: 'मिक्सर'
        }
      ]
    },
    {
      id: 'interactive-ai',
      title: 'डिजिटल अनुभव व एआई टूल्स',
      subtitle: '3D Darshan, AI Pandit & Certificates',
      badge: 'डिजिटल',
      items: [
        {
          id: '3d-ghat',
          title: '3D घाट 360° दर्शन',
          desc: 'आभासी सूर्य अर्घ्य, दीपदान व पावन गंगा घाट 360° दृश्य',
          icon: Layers,
          badge: '3D'
        },
        {
          id: 'blessing-certificate',
          title: 'डिजिटल आशीर्वाद प्रमाण पत्र',
          desc: 'व्यक्तिगत HD संकल्प पत्र व आशीर्वाद प्रमाण पत्र डाउनलोड',
          icon: Award,
          badge: 'डाउनलोड'
        },
        {
          id: 'chhath-memories',
          title: 'छठ संस्मरण व फोटो एल्बम',
          desc: 'पारिवारिक पावन स्मृतियां व फोटो डायरी सहेजें',
          icon: Camera,
          badge: 'स्मृति'
        },
        {
          id: 'chhath-quiz',
          title: 'छठ महापर्व ज्ञान क्विज',
          desc: 'सनातन संस्कृति व छठ महापर्व प्रश्नोत्तरी में भाग लें',
          icon: Brain,
          badge: 'क्विज'
        },
        {
          id: 'ai-pandit',
          title: 'छठी मइया AI पंडित',
          desc: '24x7 वैदिक शंका समाधान व आध्यात्मिक परामर्श',
          icon: Sparkles,
          badge: 'AI'
        }
      ]
    },
    {
      id: 'personal-settings',
      title: 'मेरी छठ, सेटिंग्स व प्रोफ़ाइल',
      subtitle: 'Personal Diary, Settings & Preferences',
      badge: 'सिस्टम',
      items: [
        {
          id: 'my-chhath',
          title: 'मेरी छठ डायरी व संकल्प',
          desc: 'व्यक्तिगत व्रत चेकलिस्ट, संकल्प व व्रती डैशबोर्ड',
          icon: Heart,
          highlight: true
        },
        {
          id: 'settings',
          title: 'ऐप सेटिंग्स व कस्टमाइजेशन',
          desc: 'डार्क/लाइट थीम, अर्घ्य अलार्म, भाषा चयन, कैशे प्रबंधन',
          icon: Settings,
          badge: 'पेज',
          highlight: true
        },
        {
          id: 'account',
          title: isAuthenticated ? 'खाता व प्रोफ़ाइल केंद्र' : 'श्रद्धालु लॉगिन व नया खाता',
          desc: isAuthenticated ? (currentUser?.name || 'लॉग इन विवरण') : '1-टैप व्रती प्रवेश / साइन अप',
          icon: User
        },
        {
          id: 'share',
          title: 'मित्रों व परिजनों को शेयर करें',
          desc: 'छठ महापर्व डिजिटल ऐप का लिंक परिजनों को भेजें',
          icon: Share2
        }
      ]
    }
  ];

  // Search filter
  const filterMatches = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  const filteredCategories = categories.map(cat => {
    const matchingItems = cat.items.filter(item => 
      filterMatches(item.title) || 
      filterMatches(item.desc) || 
      filterMatches(cat.title)
    );
    return {
      ...cat,
      items: matchingItems
    };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-3 pt-2 sm:pt-6 font-mukta transition-colors">
      <SeoHead
        title="छठ महापर्व एवं सनातन फीचर्स | All Features & Services - ChhathVibes"
        description="छठ पूजा व सनातन धर्म के सभी डिजिटल फीचर्स: 3D घाट, अर्घ्य समय कैलकुलेटर, पूजा विधि, सामग्री चेकलिस्ट, ऑडियो मिक्सर व आरती संग्रह।"
        canonicalUrl="https://chhathvibes.vercel.app/all-features"
      />
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6">

        {/* Action Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-stone-950 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header Bar (Matching SettingsPage Style) */}
        <div className="flex items-center gap-3 py-2 mb-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 -ml-1 text-stone-700 dark:text-stone-300 hover:text-amber-600 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="मुख्य पृष्ठ पर वापस जाएं"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 dark:from-amber-200 dark:via-orange-300 dark:to-amber-200 bg-clip-text text-transparent">
              सभी फीचर्स व सेवाएं
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              छठ महापर्व एवं सनातन धर्म के संपूर्ण 20+ डिजिटल साधन
            </p>
          </div>
        </div>

        {/* 2. Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="फीचर्स खोजें (पूजा विधि, अर्घ्य समय, गीत, कथा, आरती, 3D घाट)..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-amber-500 focus:bg-white dark:focus:bg-stone-900 rounded-2xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3. Empty Search State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <Search className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300 mb-1">
              कोई फीचर नहीं मिला
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              "{searchQuery}" से संबंधित कोई सुविधा उपलब्ध नहीं है।
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
            >
              सभी फीचर्स देखें
            </button>
          </div>
        )}

        {/* 4. Categorized Feature Sections */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-2.5">
              
              {/* Category Header */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                    <span>{category.title}</span>
                    {category.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {category.badge}
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {category.subtitle}
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-400">
                  {category.items.length} सेवाएं
                </span>
              </div>

              {/* Cards Grid: 1 column on mobile, 2 columns on tablet/desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAction(item)}
                      className={`group p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-stone-900 border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:shadow-md active:scale-[0.99] ${
                        item.highlight
                          ? 'border-amber-400/50 hover:border-amber-500 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent'
                          : 'border-stone-200/80 dark:border-stone-800 hover:border-amber-400/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon Badge */}
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                          item.highlight
                            ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 shadow-md shadow-amber-500/20'
                            : 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                              {item.title}
                            </h3>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 line-clamp-1 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right Arrow Indicator */}
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Footer Quick Tip */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-center">
          <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold">
            🌅 जय छठी मइया • संपूर्ण पावन आस्था, नियम व वैदिक भक्ति डिजिटल मंच
          </p>
        </div>

      </div>
    </div>
  );
};
