import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft,
  Phone, 
  Video, 
  Send, 
  Search, 
  Sparkles, 
  CheckCheck, 
  Users, 
  X, 
  ShieldCheck, 
  LogIn,
  MessageCircle,
  Share2,
  Lock,
  Loader2,
  UserPlus
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { ReelUser, Conversation, ChatMessage } from '../../types';
import { SeoHead } from '../seo/SeoHead';
import { FirestoreChatService } from '../../services/chat/firestoreChatService';

interface ChhathChatPageProps {
  onNavigate?: (tab: string) => void;
}

export const ChhathChatPage: React.FC<ChhathChatPageProps> = ({ onNavigate }) => {
  const { 
    startCall,
    activeConversationId,
    selectConversation
  } = useChat();

  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  // State management
  const [mobileView, setMobileView] = useState<'inbox' | 'chat'>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real devotees & real conversations state
  const [realDevotees, setRealDevotees] = useState<ReelUser[]>([]);
  const [loadingDevotees, setLoadingDevotees] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeOtherUser, setActiveOtherUser] = useState<ReelUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const hasPromptedRef = useRef<boolean>(false);

  // If user lands unauthenticated, trigger login modal once on mount; never loop if user dismisses
  useEffect(() => {
    if (!isAuthenticated && !hasPromptedRef.current) {
      hasPromptedRef.current = true;
      const timer = setTimeout(() => {
        openAuthModal('login', 'छठ संवाद में प्रवेश करने के लिए कृपया पहले लॉगिन करें');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, openAuthModal]);

  // Load real registered devotees from Cloud Firestore
  useEffect(() => {
    if (!currentUser?.id) {
      setRealDevotees([]);
      setLoadingDevotees(false);
      return;
    }

    setLoadingDevotees(true);
    FirestoreChatService.getRealDevotees(currentUser.id)
      .then((users) => {
        setRealDevotees(users);
      })
      .catch((err) => {
        console.warn('[Chat] Error loading real devotees:', err);
        setRealDevotees([]);
      })
      .finally(() => {
        setLoadingDevotees(false);
      });
  }, [currentUser?.id]);

  // Listen to user's real Firestore conversations
  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubscribe = FirestoreChatService.listenToConversations(currentUser.id, (convs) => {
      setConversations(convs);
    });

    return () => unsubscribe();
  }, [currentUser?.id]);

  // Listen to messages of active conversation in real-time
  useEffect(() => {
    if (!activeConversation?.id) {
      setMessages([]);
      return;
    }

    const unsubscribe = FirestoreChatService.listenToMessages(activeConversation.id, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeConversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (mobileView === 'chat' || activeConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mobileView, activeConversation]);

  // Filter devotees by search query
  const filteredDevotees = useMemo(() => {
    if (!searchQuery.trim()) return realDevotees;
    const q = searchQuery.toLowerCase();
    return realDevotees.filter(u => 
      u.name.toLowerCase().includes(q) || 
      (u.city && u.city.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q))
    );
  }, [realDevotees, searchQuery]);

  // Handle selecting a real devotee to chat
  const handleSelectDevotee = async (devotee: ReelUser) => {
    if (!currentUser) return;
    try {
      const conv = await FirestoreChatService.getOrCreateConversation(currentUser, devotee);
      setActiveConversation(conv);
      setActiveOtherUser(devotee);
      setMobileView('chat');
    } catch (err) {
      console.warn('Error opening chat with devotee:', err);
    }
  };

  // Auto-open conversation if activeConversationId is set externally
  useEffect(() => {
    if (activeConversationId && realDevotees.length > 0 && currentUser && !activeConversation) {
      const targetDevotee = realDevotees.find(d => activeConversationId.includes(d.id));
      if (targetDevotee) {
        handleSelectDevotee(targetDevotee);
      }
    }
  }, [activeConversationId, realDevotees, currentUser]);

  // Back to inbox on mobile
  const handleBackToInbox = () => {
    setMobileView('inbox');
    setActiveConversation(null);
    setActiveOtherUser(null);
    selectConversation(null);
  };

  // Send real message to Google Cloud Firestore
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation || !currentUser) return;

    const text = inputText.trim();
    setInputText('');
    setSendingMessage(true);

    try {
      await FirestoreChatService.sendMessage(activeConversation.id, {
        senderId: currentUser.id,
        senderName: currentUser.name || 'छठ श्रद्धालु',
        senderUsername: currentUser.username,
        senderAvatar: currentUser.avatarUrl,
        text
      });
    } catch (err) {
      showToast('संदेश भेजने में त्रुटि हुई');
    } finally {
      setSendingMessage(false);
    }
  };

  // Quick Emoji reaction / sticker
  const handleSendEmoji = async (emoji: string) => {
    if (!activeConversation || !currentUser) return;
    try {
      await FirestoreChatService.sendMessage(activeConversation.id, {
        senderId: currentUser.id,
        senderName: currentUser.name || 'छठ श्रद्धालु',
        senderUsername: currentUser.username,
        senderAvatar: currentUser.avatarUrl,
        text: emoji,
        type: 'text'
      });
    } catch {}
  };

  // Initiate voice / video call
  const handleTriggerCall = (type: 'voice' | 'video') => {
    if (!activeOtherUser) {
      showToast('कॉल के लिए श्रद्धालु उपलब्ध नहीं हैं');
      return;
    }
    startCall(activeOtherUser, type);
  };

  // Share App invite link
  const handleShareApp = async () => {
    const text = `छठ महापर्व 2026 पर मेरे साथ लाइव संवाद और दर्शन में जुड़ें: ${window.location.origin}/#chat`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'छठ संवाद आमंत्रण',
          text,
          url: `${window.location.origin}/#chat`
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(text);
      showToast('लिंक कॉपी हो गया! मित्रों को भेजें।');
    }
  };

  // =========================================================================
  // STRICT AUTHENTICATION GUARD (User not logged in)
  // =========================================================================
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] bg-white text-stone-900 font-mukta flex flex-col items-center justify-center p-4 sm:p-6 select-none">
        <SeoHead
          title="छठ संवाद लॉगिन | Chhath Connect Login Required"
          description="छठ संवाद में देश-विदेश के श्रद्धालुओं से बातचीत करने के लिए लॉगिन करें।"
          canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/chat/"
        />

        <div className="w-full max-w-md text-center p-6 sm:p-8 bg-white border border-stone-200/90 rounded-3xl shadow-xl space-y-5 animate-in fade-in duration-300">
          {/* Glowing Saffron Icon */}
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 mx-auto shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <MessageCircle className="w-9 h-9 text-amber-600" />
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-rozha text-stone-950 mb-2">
              छठ संवाद (Direct Messages)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              यह एक सुरक्षित और व्यक्तिगत संवाद मंच है। देश-विदेश के साथी छठ श्रद्धालुओं से लाइव चैट, वॉयस कॉल व वीडियो कॉल करने के लिए कृपया पहले अपने खाते में लॉगिन करें।
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={() => openAuthModal('login', 'छठ संवाद में प्रवेश करने के लिए लॉगिन करें')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>लॉग इन करें / खाता बनाएं</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('explore') : (window.location.hash = '#explore')}
              className="w-full py-2.5 px-4 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              वापस मुख्य पृष्ठ पर जाएं
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Cloud Firestore एंड-टू-एंड सुरक्षित</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED REAL USER CHAT INTERFACE (Zero Dummy Data, White Minimalist UI)
  // =========================================================================
  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-white text-stone-900 font-mukta overflow-hidden select-none">
      <SeoHead
        title="छठ संवाद व कम्युनिटी चैट | Chhath Connect Direct Messages"
        description="छठ महापर्व पर देश-विदेश के श्रद्धालुओं से इंस्टाग्राम शैली में डायरेक्ट संदेश, वॉयस कॉल व वीडियो कॉल करें।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/chat/"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-amber-400 text-stone-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Full-width Responsive Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex h-full overflow-hidden bg-white sm:border-x border-stone-200/90 shadow-xs">
        
        {/* ========================================================
            LEFT COLUMN: INBOX & REAL REGISTERED DEVOTEES LIST
            (Visible on Desktop always; On Mobile only when mobileView === 'inbox')
           ======================================================== */}
        <div 
          className={`w-full sm:w-80 md:w-96 flex flex-col border-r border-stone-200/90 bg-white h-full ${
            mobileView === 'chat' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Top Inbox Header */}
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between gap-2 shrink-0 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                <MessageCircle className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <h1 className="text-base font-bold font-rozha text-stone-950 leading-tight">
                  छठ संवाद
                </h1>
                <p className="text-[10px] text-amber-700 font-semibold leading-none">
                  Instagram Direct Style
                </p>
              </div>
            </div>

            {/* Current Logged-in User Profile Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[85px]">{currentUser.name || 'सत्यापित'}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-2.5 border-b border-stone-100 shrink-0 bg-white">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="पंजीकृत श्रद्धालु या शहर खोजें..."
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

          {/* Real Devotees Inbox Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y divide-stone-100 scrollbar-thin bg-white">
            {loadingDevotees ? (
              <div className="p-12 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
                <p className="text-xs text-stone-500">क्लाउड से श्रद्धालु लोड हो रहे हैं...</p>
              </div>
            ) : filteredDevotees.length === 0 ? (
              /* Clean Authentic Zero-Dummy Empty State */
              <div className="p-8 sm:p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-rozha text-stone-950">
                    आप पावन संवाद से जुड़ चुके हैं ✨
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                    आपके खाते का क्लाउड कनेक्शन सक्रिय है। जैसे ही अन्य श्रद्धालु इस ऐप पर खाता बनाएंगे, वे यहाँ आपकी बातचीत सूची में स्वतः दिखाई देंगे।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShareApp}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>मित्रों व परिजनों को आमंत्रित करें</span>
                </button>
              </div>
            ) : (
              /* Real Devotees List */
              filteredDevotees.map((devotee) => {
                const isSelected = activeOtherUser?.id === devotee.id;

                return (
                  <div
                    key={devotee.id}
                    onClick={() => handleSelectDevotee(devotee)}
                    className={`p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-50/80 border-l-4 border-amber-500' 
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    {/* Devotee Avatar with Online Status */}
                    <div className="relative w-12 h-12 rounded-full shrink-0">
                      {devotee.avatarUrl ? (
                        <img
                          src={devotee.avatarUrl}
                          alt={devotee.name}
                          className="w-full h-full rounded-full object-cover border border-stone-200"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-stone-950 font-bold flex items-center justify-center text-base">
                          {devotee.name.charAt(0)}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    {/* Devotee Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {devotee.name}
                        </h3>
                        <span className="text-[10px] text-emerald-600 font-semibold shrink-0">
                          सक्रिय
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate leading-tight">
                        {devotee.city ? `📍 ${devotee.city} • संवाद करें` : 'पावन संवाद प्रारंभ करें'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: INSTAGRAM DM CHAT ROOM (FULL-SCREEN WHITE UI)
            (Visible on Desktop always; On Mobile only when mobileView === 'chat')
           ======================================================== */}
        <div 
          className={`flex-1 flex flex-col bg-white h-full ${
            mobileView === 'inbox' 
              ? 'hidden sm:flex' 
              : 'fixed inset-0 z-40 sm:static sm:z-auto sm:flex-1 flex'
          }`}
        >
          {activeOtherUser && activeConversation ? (
            <>
              {/* Instagram Style Clean White Chat Header (Pinned Top Bar) */}
              <div className="p-3 sm:p-3.5 border-b border-stone-200/90 flex items-center justify-between gap-2 bg-white shrink-0 sticky top-0 z-20 shadow-2xs">
                
                {/* Left: Mobile Back Button + Devotee Info */}
                <div className="flex items-center gap-2.5 min-w-0">
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
                    {activeOtherUser.avatarUrl ? (
                      <img
                        src={activeOtherUser.avatarUrl}
                        alt={activeOtherUser.name}
                        className="w-full h-full rounded-full object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-stone-950 font-bold flex items-center justify-center text-sm">
                        {activeOtherUser.name.charAt(0)}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-stone-950 truncate flex items-center gap-1 leading-tight">
                      <span>{activeOtherUser.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    </h2>
                    <p className="text-[10px] text-emerald-600 font-semibold leading-tight flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>सक्रिय अभी (Active Now)</span>
                    </p>
                  </div>
                </div>

                {/* Right: Audio Call & Video Call Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTriggerCall('voice')}
                    className="p-2 sm:p-2.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 transition-all active:scale-95 cursor-pointer border border-stone-200"
                    title="ऑडियो कॉल करें"
                    aria-label="ऑडियो कॉल करें"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerCall('video')}
                    className="p-2 sm:p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    title="वीडियो कॉल करें"
                    aria-label="वीडियो कॉल करें"
                  >
                    <Video className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream (Internal Scrolling Only - Middle Area) */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-5 space-y-3.5 scrollbar-thin bg-white">
                
                {/* Intro Card */}
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400 p-0.5 mb-2 shadow-xs">
                    {activeOtherUser.avatarUrl ? (
                      <img
                        src={activeOtherUser.avatarUrl}
                        alt={activeOtherUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-stone-950 font-bold flex items-center justify-center text-xl">
                        {activeOtherUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-stone-900">{activeOtherUser.name}</h3>
                  <p className="text-xs text-stone-500">
                    {activeOtherUser.city ? `📍 ${activeOtherUser.city}` : 'छठ श्रद्धालु'} • Google Cloud Firestore
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1 max-w-xs">
                    जय छठी मईया! पवित्र पर्व पर निष्ठा और सद्भाव से संवाद करें।
                  </p>
                </div>

                {/* Real Conversation Messages */}
                {messages.length === 0 ? (
                  <div className="text-center py-4">
                    <span className="text-xs text-stone-400 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                      संवाद प्रारंभ करने के लिए नीचे संदेश लिखें 👇
                    </span>
                  </div>
                ) : (
                  messages.map((msg) => {
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
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Devotional Emoji Reactions Strip */}
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

              {/* Message Input Bar (Pinned Bottom Bar) */}
              <form 
                onSubmit={handleSend}
                className="p-2.5 sm:p-3 border-t border-stone-200/90 flex items-center gap-2 bg-white shrink-0 sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`${activeOtherUser.name.split(' ')[0]} को संदेश भेजें...`}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-amber-500 font-medium placeholder:text-stone-400"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || sendingMessage}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold active:scale-95 shadow-xs transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  title="संदेश भेजें"
                  aria-label="संदेश भेजें"
                >
                  {sendingMessage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Empty State when no conversation selected (Desktop View) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200/80">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-base sm:text-lg font-bold font-rozha text-stone-900 mb-1">
                आपके सीधे संदेश (Direct Messages)
              </h2>
              <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
                बाईं ओर से किसी भी पंजीकृत श्रद्धालु को चुनें और पावन पर्व पर वास्तविक विचार, वॉयस कॉल व वीडियो कॉल साझा करें।
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
