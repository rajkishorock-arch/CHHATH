import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { 
  ArrowUp, 
  Bell, 
  Sun, 
  Music, 
  Share2, 
  Check, 
  Bot, 
  Sliders, 
  Film, 
  MessageCircle 
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface FloatingQuickDockProps {
  onOpenAssistant?: () => void;
  onOpenMixer?: () => void;
  onOpenReels?: () => void;
}

export const FloatingQuickDock: React.FC<FloatingQuickDockProps> = ({
  onOpenAssistant,
  onOpenMixer,
  onOpenReels
}) => {
  const { ringBell, isPlaying, togglePlay } = useAudio();
  const { openConnect, unreadCount } = useChat();
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'छठ महापर्व — संपूर्ण डिजिटल सेवा पोर्टल',
        text: 'छठ महापर्व 2026: अर्घ्य समय, पावन गीत, पूजा विधि, सामग्री चेकलिस्ट और घाट दर्शन।',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Desktop & Tablet Floating Quick Dock (Hidden on mobile to prevent clutter & overlap) */}
      <aside
        aria-label="त्वरित सेवा डॉक"
        className="hidden md:flex fixed bottom-6 right-4 z-40 flex-col items-end gap-2 pointer-events-none select-none"
      >
        {/* Dock Container */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-stone-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl shadow-black/60 text-stone-200">
          
          {/* Quick Assistant AI */}
          {onOpenAssistant && (
            <button
              onClick={onOpenAssistant}
              title="छठी सहायक (AI Cultural Guide)"
              className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 font-bold shadow-md hover:scale-110 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4" />
            </button>
          )}

          {/* Ambient Atmosphere Mixer */}
          {onOpenMixer && (
            <button
              onClick={onOpenMixer}
              title="पवित्र माहौल ऑडियो (Chhath Atmosphere Mixer)"
              className="p-2.5 rounded-full hover:bg-amber-500/20 text-sky-400 hover:text-sky-300 transition-all hover:scale-110 active:scale-95"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {/* Chhath Reels */}
          {onOpenReels && (
            <button
              onClick={onOpenReels}
              title="छठ रील्स / लघु वीडियो (Chhath Reels)"
              className="p-2.5 rounded-full hover:bg-amber-500/20 text-pink-400 hover:text-pink-300 transition-all hover:scale-110 active:scale-95"
            >
              <Film className="w-4 h-4" />
            </button>
          )}

          {/* Chhath Connect */}
          <button
            onClick={() => openConnect()}
            title="छठ कनेक्ट — सामाजिक संवाद (Chhath Connect)"
            className="p-2.5 rounded-full hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all hover:scale-110 active:scale-95 relative"
          >
            <MessageCircle className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          {/* Quick Bell Ring */}
          <button
            onClick={ringBell}
            title="घंटी बजाएं (Ring Sacred Bell)"
            className="p-2.5 rounded-full hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all hover:scale-110 active:scale-95 group"
          >
            <Bell className="w-4 h-4 group-hover:animate-bell-sway" />
          </button>

          {/* Music Play/Pause */}
          <button
            onClick={togglePlay}
            title={isPlaying ? "संगीत रोकें" : "छठ गीत चलाएं"}
            className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
              isPlaying 
                ? 'bg-amber-500 text-stone-950 animate-pulse' 
                : 'hover:bg-amber-500/20 text-amber-400'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Surya Namaskar / Puja Vidhi Jump */}
          <a
            href="#arghya-times"
            title="अर्घ्य समय (Arghya Timings)"
            className="p-2.5 rounded-full hover:bg-amber-500/20 text-orange-400 hover:text-orange-300 transition-all hover:scale-110 active:scale-95 text-decoration-none"
          >
            <Sun className="w-4 h-4" />
          </a>

          {/* Share Portal Button */}
          <button
            onClick={handleShare}
            title="महापर्व पोर्टल साझा करें"
            className="p-2.5 rounded-full hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all hover:scale-110 active:scale-95 relative"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Scroll to Top */}
          {showTopBtn && (
            <button
              onClick={scrollToTop}
              title="शीर्ष पर जाएं (Back to Top)"
              className="p-2.5 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all border border-amber-500/30"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}

        </div>
      </aside>

      {/* Mobile-Only Clean Floating Back-to-Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          title="शीर्ष पर जाएं (Back to Top)"
          className="md:hidden fixed bottom-20 right-4 z-40 p-2.5 rounded-full bg-amber-500/90 backdrop-blur-md text-stone-950 font-bold shadow-xl border border-yellow-200 active:scale-90 transition-all"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </>
  );
};
