import React from 'react';
import { Home, Film, PlusCircle, Search, User, MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface MobileNavProps {
  onOpenReels?: () => void;
  onOpenCreate?: () => void;
  onOpenSearch?: () => void;
  onOpenProfile?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onOpenReels,
  onOpenCreate,
  onOpenSearch,
  onOpenProfile
}) => {
  const { openConnect, unreadCount } = useChat();

  return (
    <nav 
      aria-label="मोबाइल नेविगेशन"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-amber-500/30 py-2 px-3 shadow-2xl"
    >
      <div className="flex items-center justify-around">
        {/* 1. Home */}
        <a
          href="#"
          className="flex flex-col items-center gap-0.5 text-stone-400 hover:text-amber-400 text-decoration-none transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-mukta font-bold">होम</span>
        </a>

        {/* 2. Reels */}
        <button
          onClick={onOpenReels}
          className="flex flex-col items-center gap-0.5 text-amber-400 font-bold transition-transform active:scale-90"
        >
          <div className="relative">
            <Film className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
          </div>
          <span className="text-[10px] font-mukta font-bold">रील्स 🔥</span>
        </button>

        {/* 3. Create */}
        <button
          onClick={onOpenCreate}
          className="flex flex-col items-center gap-0.5 -mt-4 text-stone-950 transition-transform active:scale-95 group"
        >
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 shadow-lg shadow-amber-500/40 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center group-hover:bg-stone-900 transition-colors">
              <PlusCircle className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            </div>
          </div>
          <span className="text-[10px] font-mukta font-bold text-amber-300">बनाएं</span>
        </button>

        {/* 4. Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center gap-0.5 text-stone-400 hover:text-amber-400 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-mukta font-bold">सर्च 🔎</span>
        </button>

        {/* 5. Chhath Connect */}
        <button
          onClick={() => openConnect()}
          className="flex flex-col items-center gap-0.5 text-amber-400 hover:text-amber-300 transition-colors relative"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-red-600 text-white font-black text-[9px] animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mukta font-bold">संवाद 💬</span>
        </button>

        {/* 6. Profile */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 text-stone-400 hover:text-amber-400 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-mukta font-bold">प्रोफाइल 👤</span>
        </button>
      </div>
    </nav>
  );
};
