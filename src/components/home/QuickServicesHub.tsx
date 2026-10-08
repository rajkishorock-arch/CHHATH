import React from 'react';
import {
  Compass,
  BookOpen,
  Sun,
  Award,
  Layers,
  UtensilsCrossed,
  CheckSquare,
  Scroll,
  Brain,
  Camera,
  Bot,
  Flame,
  Download
} from 'lucide-react';
import { FeatureModalType } from './FeatureExperienceModal';
import { isNativeApp, getApkDownloadUrl } from '../../utils/platform';
import { useLanguage } from '../../context/LanguageContext';

interface QuickServicesHubProps {
  onNavigate: (tab: string) => void;
  onOpenFeatureModal: (modal: FeatureModalType) => void;
  onOpenAssistant: () => void;
  onOpenChat?: () => void;
}

export const QuickServicesHub: React.FC<QuickServicesHubProps> = ({
  onNavigate
}) => {
  const { language } = useLanguage();

  const hubText = {
    hi: {
      title: 'महापर्व सेवाएं व अनुभव',
      countBadge: '12 विशेष सेवाएं',
      explore: 'एक्सप्लोर',
      exploreBadge: 'कम्युनिटी',
      vidhi: 'पूजा विधि',
      vidhiBadge: 'नियम',
      arghya: 'अर्घ्य समय',
      arghyaBadge: 'लाइव',
      certificate: 'सर्टिफिकेट',
      certificateBadge: 'आशीर्वाद',
      ghat3d: '3D घाट',
      ghat3dBadge: '3D दर्शन',
      thekua: 'ठेकुआ विधि',
      thekuaBadge: 'प्रसाद',
      samagri: 'सामग्री सूची',
      samagriBadge: 'चेकलिस्ट',
      katha: 'छठ कथा',
      kathaBadge: 'पावन',
      quiz: 'छठ क्विज़',
      quizBadge: 'ज्ञान',
      memories: 'संस्मरण',
      memoriesBadge: 'यादें',
      aiPandit: 'AI पंडित',
      aiPanditBadge: 'AI',
      aarti: 'आरती व मंत्र',
      aartiBadge: 'वैदिक',
      downloadApk: 'ऐप डाउनलोड',
      downloadApkBadge: 'APK'
    },
    en: {
      title: 'Sacred Services & Experiences',
      countBadge: '12 Features',
      explore: 'Explore',
      exploreBadge: 'Community',
      vidhi: 'Puja Vidhi',
      vidhiBadge: 'Guide',
      arghya: 'Arghya Time',
      arghyaBadge: 'Live',
      certificate: 'Certificate',
      certificateBadge: 'Blessing',
      ghat3d: '3D Ghat',
      ghat3dBadge: '3D View',
      thekua: 'Thekua Recipe',
      thekuaBadge: 'Prasad',
      samagri: 'Samagri List',
      samagriBadge: 'Checklist',
      katha: 'Chhath Katha',
      kathaBadge: 'Sacred',
      quiz: 'Chhath Quiz',
      quizBadge: 'Trivia',
      memories: 'Memories',
      memoriesBadge: 'Album',
      aiPandit: 'AI Pandit',
      aiPanditBadge: 'AI',
      aarti: 'Aarti & Mantra',
      aartiBadge: 'Vedic',
      downloadApk: 'Download App',
      downloadApkBadge: 'APK'
    },
    bho: {
      title: 'महापर्व सेवा आ अनुभव',
      countBadge: '12 गो सेवा',
      explore: 'एक्सप्लोर',
      exploreBadge: 'कम्युनिटी',
      vidhi: 'पूजा बिधि',
      vidhiBadge: 'नियम',
      arghya: 'अरघ समय',
      arghyaBadge: 'लाइव',
      certificate: 'सर्टिफिकेट',
      certificateBadge: 'असीस',
      ghat3d: '3D घाट',
      ghat3dBadge: '3D दर्शन',
      thekua: 'ठेकुआ बिधि',
      thekuaBadge: 'परसाद',
      samagri: 'सामग्री सूची',
      samagriBadge: 'चेकलिस्ट',
      katha: 'छठ कथा',
      kathaBadge: 'पावन',
      quiz: 'छठ क्विज',
      quizBadge: 'ज्ञान',
      memories: 'संस्मरण',
      memoriesBadge: 'याद',
      aiPandit: 'AI पंडित',
      aiPanditBadge: 'AI',
      aarti: 'आरती आ मंत्र',
      aartiBadge: 'वैदिक',
      downloadApk: 'ऐप डाउनलोड',
      downloadApkBadge: 'APK'
    },
    mai: {
      title: 'महापर्व सेवा ओ अनुभव',
      countBadge: '12 टा सेवा',
      explore: 'एक्सप्लोर',
      exploreBadge: 'कम्युनिटी',
      vidhi: 'पूजा विधि',
      vidhiBadge: 'नियम',
      arghya: 'अर्घ्य समय',
      arghyaBadge: 'लाइव',
      certificate: 'प्रमाणपत्र',
      certificateBadge: 'आशीर्वाद',
      ghat3d: '3D घाट',
      ghat3dBadge: '3D दर्शन',
      thekua: 'ठेकुआ विधि',
      thekuaBadge: 'प्रसाद',
      samagri: 'सामग्री सूची',
      samagriBadge: 'चेकलिस्ट',
      katha: 'छठि कथा',
      kathaBadge: 'पावन',
      quiz: 'छठि क्विज',
      quizBadge: 'ज्ञान',
      memories: 'स्मृति',
      memoriesBadge: 'याद',
      aiPandit: 'AI पंडित',
      aiPanditBadge: 'AI',
      aarti: 'आरती ओ मंत्र',
      aartiBadge: 'वैदिक',
      downloadApk: 'ऐप डाउनलोड',
      downloadApkBadge: 'APK'
    },
    mag: {
      title: 'महापर्व सेवा आ अनुभव',
      countBadge: '12 गो सेवा',
      explore: 'एक्सप्लोर',
      exploreBadge: 'कम्युनिटी',
      vidhi: 'पूजा विधि',
      vidhiBadge: 'नियम',
      arghya: 'अर्घ्य समय',
      arghyaBadge: 'लाइव',
      certificate: 'सर्टिफिकेट',
      certificateBadge: 'आशीर्वाद',
      ghat3d: '3D घाट',
      ghat3dBadge: '3D दर्शन',
      thekua: 'ठेकुआ विधि',
      thekuaBadge: 'प्रसाद',
      samagri: 'सामग्री सूची',
      samagriBadge: 'चेकलिस्ट',
      katha: 'छठ कथा',
      kathaBadge: 'पावन',
      quiz: 'छठ क्विज',
      quizBadge: 'ज्ञान',
      memories: 'संस्मरण',
      memoriesBadge: 'याद',
      aiPandit: 'AI पंडित',
      aiPanditBadge: 'AI',
      aarti: 'आरती आ मंत्र',
      aartiBadge: 'वैदिक',
      downloadApk: 'ऐप डाउनलोड',
      downloadApkBadge: 'APK'
    }
  }[language] || {
    title: 'महापर्व सेवाएं व अनुभव',
    countBadge: '12 विशेष सेवाएं',
    explore: 'एक्सप्लोर',
    exploreBadge: 'कम्युनिटी',
    vidhi: 'पूजा विधि',
    vidhiBadge: 'नियम',
    arghya: 'अर्घ्य समय',
    arghyaBadge: 'लाइव',
    certificate: 'सर्टिफिकेट',
    certificateBadge: 'आशीर्वाद',
    ghat3d: '3D घाट',
    ghat3dBadge: '3D दर्शन',
    thekua: 'ठेकुआ विधि',
    thekuaBadge: 'प्रसाद',
    samagri: 'सामग्री सूची',
    samagriBadge: 'चेकलिस्ट',
    katha: 'छठ कथा',
    kathaBadge: 'पावन',
    quiz: 'छठ क्विज़',
    quizBadge: 'ज्ञान',
    memories: 'संस्मरण',
    memoriesBadge: 'यादें',
    aiPandit: 'AI पंडित',
    aiPanditBadge: 'AI',
    aarti: 'आरती व मंत्र',
    aartiBadge: 'वैदिक',
    downloadApk: 'ऐप डाउनलोड',
    downloadApkBadge: 'APK'
  };

  const services = [
    // 1. Explore button FIRST (before Puja Vidhi) as explicitly requested - opens detailed explore page
    {
      id: 'explore',
      label: hubText.explore,
      badge: hubText.exploreBadge,
      icon: Compass,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      action: () => onNavigate('explore-detailed')
    },
    // 2. Puja Vidhi
    {
      id: 'vidhi',
      label: hubText.vidhi,
      badge: hubText.vidhiBadge,
      icon: BookOpen,
      gradient: 'from-amber-500 to-orange-500',
      action: () => onNavigate('chhath-puja-vidhi')
    },
    // 3. Arghya Time
    {
      id: 'arghya',
      label: hubText.arghya,
      badge: hubText.arghyaBadge,
      icon: Sun,
      gradient: 'from-orange-500 to-rose-500',
      action: () => onNavigate('chhath-arghya-time-2026')
    },
    // 4. Blessing Certificate
    {
      id: 'certificate',
      label: hubText.certificate,
      badge: hubText.certificateBadge,
      icon: Award,
      gradient: 'from-yellow-500 to-amber-600',
      action: () => onNavigate('blessing-certificate')
    },
    // 5. 3D Ghat Experience
    {
      id: 'ghat3d',
      label: hubText.ghat3d,
      badge: hubText.ghat3dBadge,
      icon: Layers,
      gradient: 'from-violet-500 to-purple-600',
      action: () => onNavigate('3d-ghat')
    },
    // 6. Thekua Recipe
    {
      id: 'thekua',
      label: hubText.thekua,
      badge: hubText.thekuaBadge,
      icon: UtensilsCrossed,
      gradient: 'from-amber-600 to-red-500',
      action: () => onNavigate('thekua-recipe')
    },
    // 7. Samagri Checklist
    {
      id: 'samagri',
      label: hubText.samagri,
      badge: hubText.samagriBadge,
      icon: CheckSquare,
      gradient: 'from-amber-500 to-yellow-600',
      action: () => onNavigate('chhath-samagri')
    },
    // 8. Chhath Katha
    {
      id: 'katha',
      label: hubText.katha,
      badge: hubText.kathaBadge,
      icon: Scroll,
      gradient: 'from-orange-600 to-amber-700',
      action: () => onNavigate('chhath-puja-katha')
    },
    // 9. Chhath Quiz
    {
      id: 'quiz',
      label: hubText.quiz,
      badge: hubText.quizBadge,
      icon: Brain,
      gradient: 'from-blue-500 to-indigo-600',
      action: () => onNavigate('chhath-quiz')
    },
    // 10. Memories Album
    {
      id: 'memories',
      label: hubText.memories,
      badge: hubText.memoriesBadge,
      icon: Camera,
      gradient: 'from-rose-500 to-pink-600',
      action: () => onNavigate('chhath-memories')
    },
    // 11. AI Pandit
    {
      id: 'ai-pandit',
      label: hubText.aiPandit,
      badge: hubText.aiPanditBadge,
      icon: Bot,
      gradient: 'from-cyan-500 to-blue-600',
      action: () => onNavigate('ai-pandit')
    },
    // 12. Aarti & Mantra
    {
      id: 'aarti',
      label: hubText.aarti,
      badge: hubText.aartiBadge,
      icon: Flame,
      gradient: 'from-red-500 to-orange-500',
      action: () => onNavigate('aarti')
    },
    ...(!isNativeApp() ? [{
      id: 'download-apk',
      label: hubText.downloadApk,
      badge: hubText.downloadApkBadge,
      icon: Download,
      gradient: 'from-emerald-600 to-teal-700',
      action: () => {
        const link = document.createElement('a');
        link.href = getApkDownloadUrl();
        link.download = 'chhath-app-debug.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }] : [])
  ];

  return (
    <div className="w-full bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-4 border border-amber-500/20 shadow-sm">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-1.5 font-rozha text-sm sm:text-base font-bold text-stone-900 dark:text-amber-100">
          <span className="text-amber-500">✨</span>
          <span>{hubText.title}</span>
        </div>
        <span className="font-mukta text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-400/90">
          {hubText.countBadge}
        </span>
      </div>

      {/* Horizontal smooth tray */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 pt-1.5 px-0.5 scrollbar-none snap-x snap-mandatory">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              type="button"
              onClick={service.action}
              aria-label={service.label}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none snap-start active:scale-95 transition-transform duration-150 cursor-pointer"
            >
              <div className="relative">
                <div
                  className={`w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-tr ${service.gradient} p-0.5 shadow-md shadow-stone-900/10 dark:shadow-amber-500/10 group-hover:scale-105 transition-transform duration-200`}
                >
                  <div className="w-full h-full rounded-[14px] bg-stone-950/20 backdrop-blur-[1px] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" />
                  </div>
                </div>

                {service.badge && (
                  <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mukta bg-stone-950/90 text-amber-300 border border-amber-500/40 shadow-sm leading-tight">
                    {service.badge}
                  </span>
                )}
              </div>

              <span className="font-mukta text-[11px] sm:text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 text-center tracking-tight truncate max-w-[64px] sm:max-w-[72px] transition-colors">
                {service.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
