import React, { Suspense, lazy, useEffect } from 'react';
import { X, Award, Compass, Brain, Camera } from 'lucide-react';

const BlessingCertificate = lazy(() =>
  import('../engagement/BlessingCertificate').then(m => ({ default: m.BlessingCertificate }))
);
const Interactive3DGhat = lazy(() =>
  import('../ghats/Interactive3DGhat').then(m => ({ default: m.Interactive3DGhat }))
);
const VirtualArghyaSimulator = lazy(() =>
  import('../spiritual/VirtualArghyaSimulator').then(m => ({ default: m.VirtualArghyaSimulator }))
);
const ChhathQuiz = lazy(() =>
  import('../engagement/ChhathQuiz').then(m => ({ default: m.ChhathQuiz }))
);
const MemoryAlbum = lazy(() =>
  import('../memory/MemoryAlbum').then(m => ({ default: m.MemoryAlbum }))
);

export type FeatureModalType = 'certificate' | 'ghat3d' | 'quiz' | 'memories' | null;

interface FeatureExperienceModalProps {
  activeModal: FeatureModalType;
  onClose: () => void;
}

const ModalLoadingSpinner: React.FC = () => (
  <div className="py-20 flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
    <span className="font-mukta text-xs font-semibold text-stone-500 dark:text-stone-400">अनुभव लोड हो रहा है...</span>
  </div>
);

export const FeatureExperienceModal: React.FC<FeatureExperienceModalProps> = ({
  activeModal,
  onClose
}) => {
  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const modalMeta = {
    certificate: {
      title: 'डिजिटल आशीर्वाद प्रमाण पत्र',
      icon: Award,
      badge: 'प्रमाण पत्र'
    },
    ghat3d: {
      title: '3D पावन गंगा घाट व अर्घ्य दर्शन',
      icon: Compass,
      badge: 'वर्चुअल दर्शन'
    },
    quiz: {
      title: 'छठ महापर्व ज्ञान प्रश्नोत्तरी',
      icon: Brain,
      badge: 'क्विज़'
    },
    memories: {
      title: 'छठ संस्मरण व फोटो एल्बम',
      icon: Camera,
      badge: 'यादें'
    }
  }[activeModal];

  const Icon = modalMeta.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-stone-50 dark:bg-stone-950 border border-amber-500/30 rounded-3xl shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/70 dark:border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-rozha text-base sm:text-lg font-bold text-stone-900 dark:text-amber-100 leading-tight">
                {modalMeta.title}
              </h2>
              <span className="font-mukta text-[10px] font-bold text-amber-700 dark:text-amber-400">
                {modalMeta.badge}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="बंद करें"
            className="w-8 h-8 rounded-full bg-stone-200/80 dark:bg-stone-800/80 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-transform active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-3 sm:p-6 flex-1">
          <Suspense fallback={<ModalLoadingSpinner />}>
            {activeModal === 'certificate' && <BlessingCertificate />}
            {activeModal === 'ghat3d' && (
              <div className="space-y-8">
                <Interactive3DGhat />
                <VirtualArghyaSimulator />
              </div>
            )}
            {activeModal === 'quiz' && <ChhathQuiz />}
            {activeModal === 'memories' && <MemoryAlbum />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};
