import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageCircle, 
  Users, 
  ShieldCheck, 
  LogIn, 
  Sparkles, 
  Smile, 
  CheckCheck,
  Search,
  Flame,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';

interface RealChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderCity?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  channelId: string;
}

interface ChatChannel {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  isOfficial?: boolean;
}

const CHANNELS: ChatChannel[] = [
  {
    id: 'global-choupal',
    name: 'छठ वैश्विक चौपाल',
    tagline: 'समस्त श्रद्धालुओं का लाइव संवाद',
    icon: '🪔',
    isOfficial: true
  },
  {
    id: 'ghat-live',
    name: 'लाइव घाट दर्शन व स्थिति',
    tagline: 'विभिन्न घाटों से वास्तविक अपडेट्स',
    icon: '🌊',
    isOfficial: true
  },
  {
    id: 'prasad-seva',
    name: 'महाप्रसाद व सेवादार केंद्र',
    tagline: 'ठेकुआ, सूप व दउरा सहयोग',
    icon: '🌾',
    isOfficial: false
  }
];

const INITIAL_COMMUNITY_MSGS: RealChatMessage[] = [
  {
    id: 'msg-welcome-official',
    senderId: 'official-trust',
    senderName: 'छठ डिजिटल सेवा ट्रस्ट',
    senderCity: 'पटना, बिहार',
    senderAvatar: '',
    text: 'जय छठी मईया! 🙏 यह छठ महापर्व 2026 का आधिकारिक वास्तविक संवाद केंद्र है। सभी श्रद्धालु यहाँ पावन विचार, घाट की स्थिति एवं शुभकामनाएं साझा कर सकते हैं।',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    channelId: 'global-choupal'
  }
];

interface ChhathChatPageProps {
  onNavigate: (tab: string) => void;
}

export const ChhathChatPage: React.FC<ChhathChatPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  const [activeChannelId, setActiveChannelId] = useState<string>('global-choupal');
  const [messages, setMessages] = useState<RealChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load real messages and establish real-time cross-tab sync
  useEffect(() => {
    try {
      const stored = localStorage.getItem('chhath_real_community_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages(INITIAL_COMMUNITY_MSGS);
        localStorage.setItem('chhath_real_community_messages', JSON.stringify(INITIAL_COMMUNITY_MSGS));
      }
    } catch {
      setMessages(INITIAL_COMMUNITY_MSGS);
    }

    // Real-time broadcast channel for instant multi-window / multi-tab synchronization
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('chhath_realtime_chat_v1');
      channel.onmessage = (event) => {
        if (event.data?.type === 'NEW_MESSAGE' && event.data?.message) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === event.data.message.id);
            if (exists) return prev;
            return [...prev, event.data.message];
          });
        }
      };
      broadcastChannelRef.current = channel;

      return () => {
        channel.close();
      };
    }
  }, []);

  // Scroll to bottom on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  // Handle Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    // STRICT AUTH GATE: Unauthenticated users are prevented from sending!
    if (!isAuthenticated || !currentUser) {
      openAuthModal('login', 'छठ संवाद में संदेश भेजने के लिए कृपया लॉगिन करें');
      return;
    }

    const newMsg: RealChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderId: currentUser.id,
      senderName: currentUser.name || 'छठ श्रद्धालु',
      senderCity: currentUser.city ? `${currentUser.city}` : undefined,
      senderAvatar: currentUser.avatarUrl,
      text,
      timestamp: new Date().toISOString(),
      channelId: activeChannelId
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInputText('');

    try {
      localStorage.setItem('chhath_real_community_messages', JSON.stringify(nextMessages.slice(-200)));
    } catch {}

    // Broadcast in real-time
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'NEW_MESSAGE',
        message: newMsg
      });
    } catch {}
  };

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 font-mukta flex flex-col">
      <SeoHead
        title="छठ संवाद व कम्युनिटी चैट | Chhath Connect Community"
        description="छठ महापर्व पर देश-विदेश के श्रद्धालुओं का लाइव पावन संवाद, घाट स्थिति व विचार साझा करें।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/chat/"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto px-2 sm:px-6 py-4 flex flex-col flex-1 h-[calc(100vh-80px)]">

        {/* Sleek Action Toolbar (No back button, Clean White UI) */}
        <div className="flex items-center justify-between gap-3 bg-white border border-stone-200/90 rounded-2xl p-3 shadow-xs shrink-0 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold font-rozha text-stone-950 leading-tight">
                  छठ संवाद केंद्र
                </h1>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>लाइव</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-amber-700 font-semibold leading-none">
                Instagram शैली में पावन सामुदायिक संवाद
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[90px] sm:max-w-[120px]">{currentUser.name || 'सत्यापित'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login', 'छठ संवाद में संदेश भेजने के लिए लॉगिन करें')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉगिन</span>
              </button>
            )}
          </div>
        </div>

        {/* Instagram DM Style Layout (Channels on left, Chat stream on right) */}
        <div className="flex-1 flex bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs">
          
          {/* Left Column: Channels / Devotee Rooms */}
          <div className="w-full sm:w-72 lg:w-80 border-r border-stone-200/90 flex flex-col shrink-0">
            <div className="p-3 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                संवाद कक्ष (Channels)
              </span>
              <div className="space-y-1">
                {CHANNELS.map((ch) => {
                  const isActive = ch.id === activeChannelId;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setActiveChannelId(ch.id)}
                      className={`w-full p-2.5 rounded-2xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 border border-amber-500/30 text-stone-950'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-lg shrink-0">
                        {ch.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold truncate leading-tight">{ch.name}</h4>
                          {ch.isOfficial && (
                            <span className="text-[9px] px-1 rounded-sm bg-amber-500/20 text-amber-800 font-bold shrink-0">
                              पुष्ट
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate leading-tight mt-0.5">{ch.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Devotee Info Box */}
            <div className="p-3 mt-auto bg-stone-50 border-t border-stone-100 text-[11px] text-stone-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>सक्रिय श्रद्धालु ऑनलाइन</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Right Column: Chat Conversation Stream */}
          <div className="hidden sm:flex flex-1 flex-col bg-white">
            
            {/* Room Header */}
            <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeChannel.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-stone-950 flex items-center gap-1.5">
                    <span>{activeChannel.name}</span>
                    {activeChannel.isOfficial && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                  </h3>
                  <p className="text-[11px] text-stone-500">{activeChannel.tagline}</p>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {channelMessages.map((msg) => {
                const isMine = currentUser?.id && msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[75%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    {!isMine && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700 mb-1 px-1">
                        <span>{msg.senderName}</span>
                        {msg.senderCity && (
                          <span className="text-[10px] text-stone-400 font-normal">({msg.senderCity})</span>
                        )}
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMine
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-medium rounded-tr-xs shadow-xs'
                          : 'bg-stone-100 text-stone-900 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5 px-1">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && <CheckCheck className="w-3 h-3 text-amber-600" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-100 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isAuthenticated 
                    ? "छठ संवाद में संदेश लिखें..." 
                    : "संदेश लिखने व भेजने के लिए लॉगिन आवश्यक है..."
                }
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-amber-500 font-medium placeholder:text-stone-400"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>भेजें</span>
              </button>
            </form>

          </div>

          {/* Mobile view of messages if on phone */}
          <div className="sm:hidden flex-1 flex flex-col bg-white">
            <div className="p-2 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <span>{activeChannel.icon}</span>
                <span>{activeChannel.name}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {channelMessages.map((msg) => {
                const isMine = currentUser?.id && msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    {!isMine && (
                      <span className="text-[10px] font-bold text-stone-700 mb-0.5 px-1">{msg.senderName}</span>
                    )}
                    <div
                      className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMine
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-medium rounded-tr-xs shadow-xs'
                          : 'bg-stone-100 text-stone-900 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-stone-400 mt-0.5 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t border-stone-100 flex items-center gap-1.5 bg-white">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isAuthenticated ? "संदेश लिखें..." : "भेजने के लिए लॉगिन करें..."}
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-amber-500 text-stone-950 font-bold active:scale-95 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
};
