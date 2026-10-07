import React from 'react';
import {
  BookOpen,
  Sun,
  Award,
  MessageCircle,
  Compass,
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

interface QuickServicesHubProps {
  onNavigate: (tab: string) => void;
  onOpenFeatureModal: (modal: FeatureModalType) => void;
  onOpenAssistant: () => void;
  onOpenChat: () => void;
}

export const QuickServicesHub: React.FC<QuickServicesHubProps> = ({
  onNavigate,
  onOpenFeatureModal,
  onOpenAssistant,
  onOpenChat
}) => {
  const services = [
    {
      id: 'vidhi',
      label: 'पूजा विधि',
      badge: 'नियम',
      icon: BookOpen,
      gradient: 'from-amber-500 to-orange-500',
      action: () => onNavigate('chhath-puja-vidhi')
    },
    {
      id: 'arghya',
      label: 'अर्घ्य समय',
      badge: 'लाइव',
      icon: Sun,
      gradient: 'from-orange-500 to-rose-500',
      action: () => onNavigate('chhath-arghya-time-2026')
    },
    {
      id: 'certificate',
      label: 'सर्टिफिकेट',
      badge: 'आशीर्वाद',
      icon: Award,
      gradient: 'from-yellow-500 to-amber-600',
      action: () => onOpenFeatureModal('certificate')
    },
    {
      id: 'chat',
      label: 'छठ चैट',
      badge: 'कम्युनिटी',
      icon: MessageCircle,
      gradient: 'from-emerald-500 to-teal-600',
      action: () => onOpenChat()
    },
    {
      id: 'ghat3d',
      label: '3D घाट',
      badge: '3D दर्शन',
      icon: Compass,
      gradient: 'from-violet-500 to-purple-600',
      action: () => onOpenFeatureModal('ghat3d')
    },
    {
      id: 'thekua',
      label: 'ठेकुआ विधि',
      badge: 'प्रसाद',
      icon: UtensilsCrossed,
      gradient: 'from-amber-600 to-red-500',
      action: () => onNavigate('thekua-recipe')
    },
    {
      id: 'samagri',
      label: 'सामग्री सूची',
      badge: 'चेकलिस्ट',
      icon: CheckSquare,
      gradient: 'from-amber-500 to-yellow-600',
      action: () => onNavigate('chhath-samagri')
    },
    {
      id: 'katha',
      label: 'छठ कथा',
      badge: 'पावन',
      icon: Scroll,
      gradient: 'from-orange-600 to-amber-700',
      action: () => onNavigate('chhath-puja-katha')
    },
    {
      id: 'quiz',
      label: 'छठ क्विज़',
      badge: 'ज्ञान',
      icon: Brain,
      gradient: 'from-blue-500 to-indigo-600',
      action: () => onOpenFeatureModal('quiz')
    },
    {
      id: 'memories',
      label: 'संस्मरण',
      badge: 'यादें',
      icon: Camera,
      gradient: 'from-rose-500 to-pink-600',
      action: () => onOpenFeatureModal('memories')
    },
    {
      id: 'ai-pandit',
      label: 'AI पंडित',
      badge: 'AI',
      icon: Bot,
      gradient: 'from-cyan-500 to-blue-600',
      action: () => onOpenAssistant()
    },
    {
      id: 'aarti',
      label: 'आरती व मंत्र',
      badge: 'वैदिक',
      icon: Flame,
      gradient: 'from-red-500 to-orange-500',
      action: () => onNavigate('aarti')
    },
    ...(!isNativeApp() ? [{
      id: 'download-apk',
      label: 'ऐप डाउनलोड',
      badge: 'APK',
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
    <div className="w-full bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-500/20 shadow-sm">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-1.5 font-rozha text-sm sm:text-base font-bold text-stone-900 dark:text-amber-100">
          <span className="text-amber-500">✨</span>
          <span>महापर्व सेवाएं व अनुभव</span>
        </div>
        <span className="font-mukta text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-400/90">
          12 विशेष सेवाएं
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
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none snap-start active:scale-95 transition-transform duration-150"
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
