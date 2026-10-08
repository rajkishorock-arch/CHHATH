import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Copy, 
  Check, 
  ShieldCheck, 
  LogIn, 
  Flame,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChhathData } from '../../context/ChhathDataContext';
import { AIService, AIMessage } from '../../services/ai/aiService';
import { SeoHead } from '../seo/SeoHead';

const SUGGESTED_QUERIES = [
  'संध्या व उषा अर्घ्य का समय क्या है?',
  'ठेकुआ की प्रामाणिक विधि बताएं',
  'खरना के नियम व गुड़ की खीर कैसे बनती है?',
  'भगवान सूर्य का शक्तिशाली वैदिक मंत्र क्या है?',
  'छठ पूजा की संपूर्ण सामग्री सूची दिखाएं'
];

interface ChhathiAIPageProps {
  onNavigate: (tab: string) => void;
}

export const ChhathiAIPage: React.FC<ChhathiAIPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const { userLocation } = useChhathData();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialGreeting: AIMessage = {
    id: 'init-pandit',
    sender: 'assistant',
    text: `प्रणाम! 🙏 मैं आपका 'छठ AI पंडित' हूँ। छठ महापर्व की संपूर्ण पूजा विधि, शुभ अर्घ्य मुहूर्त, ठेकुआ व महाप्रसाद, खरना नियम अथवा किसी भी वैदिक शंका के समाधान के लिए निसंकोच पूछें। जय छठी मईया!`,
    lang: 'hi',
    timestamp: new Date().toISOString()
  };

  const [messages, setMessages] = useState<AIMessage[]>([initialGreeting]);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load user conversation history if authenticated
  useEffect(() => {
    if (currentUser?.id) {
      try {
        const saved = localStorage.getItem(`chhath_user_ai_chat_${currentUser.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch {}
    } else {
      setMessages([initialGreeting]);
    }
  }, [currentUser?.id]);

  // Scroll to bottom on message change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Text-to-Speech handler
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  // Process and send query
  const handleSendPrompt = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt) return;

    // STRICT AUTH GATE: Unauthenticated users are prompted to log in upon sending!
    if (!isAuthenticated) {
      openAuthModal('login', 'AI पंडित से परामर्श प्राप्त करने के लिए कृपया लॉगिन करें');
      return;
    }

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      lang: 'hi',
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputPrompt('');
    setIsTyping(true);

    try {
      const location = userLocation?.city ? { city: userLocation.city, state: userLocation.state || 'Bihar' } : { city: 'Patna', state: 'Bihar' };
      const response = await AIService.chat(prompt, nextMessages, 'hi', location);
      
      const updatedMessages = [...nextMessages, response];
      setMessages(updatedMessages);
      setIsTyping(false);

      speakText(response.text);

      // Save persistent chat history for authenticated account
      if (currentUser?.id) {
        try {
          localStorage.setItem(`chhath_user_ai_chat_${currentUser.id}`, JSON.stringify(updatedMessages.slice(-30)));
        } catch {}
      }
    } catch (err) {
      setIsTyping(false);
      const errorMsg: AIMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'क्षमा करें, इस समय संपर्क स्थापित नहीं हो सका। कृपया पुनः पूछें। जय छठी मईया 🙏',
        lang: 'hi',
        timestamp: new Date().toISOString()
      };
      setMessages([...nextMessages, errorMsg]);
    }
  };

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'आवाज से पूछने के लिए कृपया लॉगिन करें');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('आपके ब्राउज़र में वॉइस रिकॉग्निशन समर्थित नहीं है');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('सुन रहे हैं... बोलिए 🙏');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputPrompt(transcript);
          handleSendPrompt(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('संदेश कॉपी हुआ');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([initialGreeting]);
    if (currentUser?.id) {
      localStorage.removeItem(`chhath_user_ai_chat_${currentUser.id}`);
    }
    showToast('वार्तालाप साफ़ किया गया');
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 font-mukta flex flex-col">
      <SeoHead
        title="छठ AI पंडित व वैदिक सहायक | Chhath AI Pandit 2026"
        description="छठ महापर्व 2026 की संपूर्ण पूजा विधि, अर्घ्य समय, मंत्र एवं परंपराओं के लिए 24x7 AI पंडित परामर्श।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/ai-pandit/"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col flex-1 h-[calc(100vh-80px)]">

        {/* Sleek Action Toolbar (No back button, Clean White UI) */}
        <div className="flex items-center justify-between gap-3 bg-white border border-stone-200/90 rounded-2xl p-3 shadow-xs shrink-0 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold font-rozha text-stone-950 leading-tight">
                  छठ AI पंडित
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="सक्रिय" />
              </div>
              <p className="text-[10px] sm:text-xs text-amber-700 font-semibold leading-none">
                वैदिक परामर्श व 24x7 मार्गदर्शक
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all cursor-pointer"
              title={isMuted ? 'ध्वनि चालू करें' : 'ध्वनि बंद करें'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all cursor-pointer"
              title="वार्तालाप साफ़ करें"
            >
              <RotateCcw className="w-4 h-4 text-stone-500" />
            </button>

            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[80px] sm:max-w-[110px]">{currentUser.name || 'सत्यापित'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login', 'AI पंडित से परामर्श प्राप्त करने के लिए लॉगिन करें')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉगिन</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto space-y-4 p-3 sm:p-5 bg-white border border-stone-200/90 rounded-3xl shadow-xs scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[90%] sm:max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
                    <Flame className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-medium rounded-tr-xs shadow-xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-900 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {!isUser && (
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/50 text-[10px] text-stone-400">
                      <span>छठ AI पंडित</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-stone-800 transition-colors cursor-pointer"
                        title="कॉपी करें"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 max-w-[80%] mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-semibold text-amber-800">पंडित जी विचार कर रहे हैं...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Chips Tray */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 scrollbar-none shrink-0">
          {SUGGESTED_QUERIES.map((query, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendPrompt(query)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 text-stone-700 text-[11px] font-medium shrink-0 shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-1.5 sm:p-2 shadow-xs shrink-0 flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isListening 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
            title="माइक से बोलें"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-600" />}
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendPrompt();
              }
            }}
            placeholder={isAuthenticated ? "पंडित जी से पूछें (उदा. कल अर्घ्य का समय क्या है?)..." : "पूछने हेतु संदेश लिखें (Enter दबाने पर लॉगिन आवश्यक)..."}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent border-none text-stone-900 focus:outline-none placeholder:text-stone-400 font-medium"
          />

          <button
            type="button"
            onClick={() => handleSendPrompt()}
            disabled={!inputPrompt.trim() && !isTyping}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">पूछें</span>
          </button>
        </div>

      </main>
    </div>
  );
};
