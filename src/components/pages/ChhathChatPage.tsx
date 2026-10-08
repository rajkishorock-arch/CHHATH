import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft,
  Phone, 
  Video, 
  Send, 
  Search, 
  Sparkles, 
  CheckCheck, 
  Check, 
  Users, 
  Info, 
  X, 
  ShieldCheck, 
  LogIn,
  Smile,
  Mic,
  Image as ImageIcon,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { ReelsStorage } from '../../services/reelsStorage';
import { ReelUser, Conversation } from '../../types';
import { SeoHead } from '../seo/SeoHead';

interface ChhathChatPageProps {
  onNavigate?: (tab: string) => void;
}

export const ChhathChatPage: React.FC<ChhathChatPageProps> = ({ onNavigate }) => {
  const { 
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    selectConversation,
    openChatWithUser,
    sendMessage,
    startCall
  } = useChat();

  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  const [mobileView, setMobileView] = useState<'inbox' | 'chat'>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync mobile view with activeConversationId
  useEffect(() => {
    if (activeConversationId) {
      setMobileView('chat');
    }
  }, [activeConversationId]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (mobileView === 'chat' || activeConversationId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mobileView, activeConversationId]);

  // All registered devotees for contact list & active stories
  const allUsers = useMemo(() => {
    try {
      const users = ReelsStorage.getUsers();
      if (currentUser?.id) {
        return users.filter(u => u.id !== currentUser.id);
      }
      return users;
    } catch {
      return [];
    }
  }, [currentUser]);

  // Filtered users by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;
    const q = searchQuery.toLowerCase();
    return allUsers.filter(u => 
      u.name.toLowerCase().includes(q) || 
      (u.city && u.city.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q))
    );
  }, [allUsers, searchQuery]);

  // Identify other participant in active conversation
  const otherParticipant = useMemo<ReelUser | null>(() => {
    if (!activeConversation) return null;
    const otherId = activeConversation.participantIds.find(id => id !== currentUser?.id);
    if (!otherId) return null;
    return ReelsStorage.findUserById(otherId) || null;
  }, [activeConversation, currentUser]);

  // Handle selecting a devotee to chat
  const handleSelectUser = async (user: ReelUser) => {
    try {
      await openChatWithUser(user.id);
      setMobileView('chat');
    } catch (err) {
      console.warn('Error opening chat with user:', err);
    }
  };

  // Back to inbox on mobile
  const handleBackToInbox = () => {
    setMobileView('inbox');
    selectConversation(null);
  };

  // Send message with strict auth gate
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (!isAuthenticated || !currentUser) {
      openAuthModal('login', 'छठ संवाद में संदेश भेजने के लिए कृपया लॉगिन करें');
      return;
    }

    try {
      await sendMessage({ text: inputText.trim() });
      setInputText('');
    } catch (err) {
      showToast('संदेश भेजने में त्रुटि हुई');
    }
  };

  // Quick Emoji reaction / sticker
  const handleSendEmoji = async (emoji: string) => {
    if (!isAuthenticated || !currentUser) {
      openAuthModal('login', 'प्रतिक्रिया भेजने के लिए कृपया लॉगिन करें');
      return;
    }
    try {
      await sendMessage({ text: emoji });
    } catch {}
  };

  // Initiate voice / video call with auth gate
  const handleTriggerCall = (type: 'voice' | 'video') => {
    if (!isAuthenticated || !currentUser) {
      openAuthModal('login', `${type === 'video' ? 'वीडियो' : 'वॉयस'} कॉल करने के लिए कृपया लॉगिन करें`);
      return;
    }

    if (!otherParticipant) {
      showToast('कॉल के लिए श्रद्धालु उपलब्ध नहीं हैं');
      return;
    }

    startCall(otherParticipant, type);
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-[#faf9f5] text-stone-900 font-mukta overflow-hidden select-none">
      <SeoHead
        title="छठ संवाद व कम्युनिटी चैट | Chhath Connect Direct Messages"
        description="छठ महापर्व पर देश-विदेश के श्रद्धालुओं से इंस्टाग्राम शैली में डायरेक्ट संदेश, वॉयस कॉल व वीडियो कॉल करें।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/chat/"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Instagram DM Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex h-full overflow-hidden bg-white sm:border-x border-stone-200/90 shadow-sm">
        
        {/* ========================================================
            LEFT COLUMN: INBOX & DEVOTEE CONVERSATIONS LIST
            (Visible on Desktop always; On Mobile only when mobileView === 'inbox')
           ======================================================== */}
        <div 
          className={`w-full sm:w-80 md:w-96 flex flex-col border-r border-stone-200/90 bg-white h-full ${
            mobileView === 'chat' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Top Inbox Header */}
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                <MessageCircle className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <h1 className="text-base font-bold font-rozha text-stone-950 leading-tight">
                  छठ संवाद
                </h1>
                <p className="text-[10px] text-amber-700 font-semibold leading-none">
                  Instagram Direct Messages
                </p>
              </div>
            </div>

            {/* Auth status / Login Button */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[80px]">{currentUser.name || 'सत्यापित'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login', 'छठ संवाद में लॉगिन करें')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉगिन</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="p-2.5 border-b border-stone-100 shrink-0">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="श्रद्धालु या घाट खोजें..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Stories Row (Instagram DM Active Online Devotees) */}
          <div className="p-3 border-b border-stone-100 overflow-x-auto scrollbar-none flex items-center gap-3.5 shrink-0 bg-stone-50/40">
            {/* User's own story/status */}
            <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
              <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-amber-400 p-0.5">
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&q=80'}
                  alt="My status"
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold border-2 border-white">
                  +
                </span>
              </div>
              <span className="text-[10px] font-medium text-stone-600 truncate max-w-[50px]">आप</span>
            </div>

            {/* Active devotees online */}
            {allUsers.slice(0, 8).map((u) => (
              <div 
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="relative w-12 h-12 rounded-full ring-2 ring-emerald-500/80 p-0.5 group-hover:scale-105 transition-transform">
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80'}
                    alt={u.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400" />
                </div>
                <span className="text-[10px] font-semibold text-stone-700 truncate max-w-[54px]">
                  {u.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Conversations & Devotee Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 scrollbar-thin">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                कोई श्रद्धालु नहीं मिला
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = otherParticipant?.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/10 border-l-4 border-amber-500' 
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    {/* User Avatar with online badge */}
                    <div className="relative w-12 h-12 rounded-full shrink-0">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80'}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border border-stone-200"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    {/* User info & last snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {user.name}
                        </h3>
                        <span className="text-[10px] text-stone-400 font-medium shrink-0">
                          सक्रिय
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate leading-tight">
                        {user.city ? `📍 ${user.city} • पावन संवाद प्रारंभ करें` : 'जय छठी मईया 🙏'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: DEVOTEE CHAT ROOM & DASHBOARD
            (Visible on Desktop always; On Mobile only when mobileView === 'chat')
           ======================================================== */}
        <div 
          className={`flex-1 flex flex-col bg-white h-full ${
            mobileView === 'inbox' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {otherParticipant ? (
            <>
              {/* Chat Header (Instagram style with Back, Avatar, Name, Phone & Video Calling) */}
              <div className="p-3 sm:p-3.5 border-b border-stone-200/90 flex items-center justify-between gap-2 bg-white shrink-0 shadow-2xs">
                
                {/* Left: Back Arrow (Mobile) + Devotee Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Phone View Back Button */}
                  <button
                    type="button"
                    onClick={handleBackToInbox}
                    className="sm:hidden p-1.5 -ml-1 text-stone-700 hover:text-stone-950 active:scale-95 transition-transform cursor-pointer"
                    title="वापस इनबॉक्स"
                    aria-label="वापस इनबॉक्स"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative w-10 h-10 rounded-full shrink-0">
                    <img
                      src={otherParticipant.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80'}
                      alt={otherParticipant.name}
                      className="w-full h-full rounded-full object-cover border border-stone-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-stone-950 truncate flex items-center gap-1 leading-tight">
                      <span>{otherParticipant.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    </h2>
                    <p className="text-[10px] text-emerald-600 font-semibold leading-tight flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>सक्रिय अभी (Active Now)</span>
                    </p>
                  </div>
                </div>

                {/* Right: Audio Call, Video Call & Info Signs */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {/* Voice / Audio Call Button */}
                  <button
                    type="button"
                    onClick={() => handleTriggerCall('voice')}
                    className="p-2 sm:p-2.5 rounded-full bg-stone-100 hover:bg-amber-500/20 text-stone-800 hover:text-amber-800 transition-all active:scale-95 cursor-pointer border border-stone-200/80 shadow-2xs"
                    title="वॉयस कॉल करें (Audio Call)"
                    aria-label="वॉयस कॉल करें"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  {/* Video Call Button */}
                  <button
                    type="button"
                    onClick={() => handleTriggerCall('video')}
                    className="p-2 sm:p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    title="वीडियो कॉल करें (Video Call)"
                    aria-label="वीडियो कॉल करें"
                  >
                    <Video className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 scrollbar-thin bg-gradient-to-b from-[#faf9f5]/50 to-white">
                
                {/* Devotee Profile Intro Card in Chat Stream */}
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400/80 p-0.5 mb-2 shadow-xs">
                    <img
                      src={otherParticipant.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80'}
                      alt={otherParticipant.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-stone-900">{otherParticipant.name}</h3>
                  <p className="text-xs text-stone-500">
                    {otherParticipant.city ? `📍 ${otherParticipant.city}` : 'छठ श्रद्धालु'} • Instagram Direct
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1 max-w-xs">
                    जय छठी मईया! पवित्र पर्व पर निष्ठा और सद्भाव से संवाद करें।
                  </p>
                </div>

                {/* Real Conversation Messages */}
                {messages.map((msg) => {
                  const isMine = currentUser?.id && msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                        isMine ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-medium rounded-br-xs shadow-xs'
                            : 'bg-stone-100 text-stone-900 rounded-bl-xs border border-stone-200/60'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1 font-mono">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMine && <CheckCheck className="w-3 h-3 text-amber-600" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Devotional Emoji Reactions Strip */}
              <div className="px-3 py-1.5 border-t border-stone-100 flex items-center justify-around bg-stone-50/60 text-base shrink-0">
                {['🙏', '🪔', '☀️', '❤️', '🌾', '🥥', '👍'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSendEmoji(emoji)}
                    className="hover:scale-125 active:scale-95 transition-transform cursor-pointer p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <form 
                onSubmit={handleSend}
                className="p-2.5 sm:p-3 border-t border-stone-200/90 flex items-center gap-2 bg-white shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isAuthenticated 
                      ? `${otherParticipant.name.split(' ')[0]} को संदेश भेजें...` 
                      : "संदेश भेजने के लिए लॉगिन करें..."
                  }
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-amber-500 font-medium placeholder:text-stone-400"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold active:scale-95 shadow-xs transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  title="संदेश भेजें"
                  aria-label="संदेश भेजें"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            /* Empty State when no conversation is selected (Desktop View) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-50/30">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-base sm:text-lg font-bold font-rozha text-stone-900 mb-1">
                आपके सीधे संदेश (Direct Messages)
              </h2>
              <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
                बाईं ओर से किसी भी श्रद्धालु को चुनें और पावन पर्व पर विचार, वॉयस कॉल व वीडियो कॉल साझा करें।
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
