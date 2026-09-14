import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Camera, 
  Upload, 
  Play, 
  Check, 
  CheckSquare, 
  MapPin, 
  Music, 
  Clock, 
  Share2, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Eye, 
  Compass, 
  Utensils, 
  FileText,
  ShieldCheck,
  MessageSquare,
  Radio
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useChhathData } from '../../context/ChhathDataContext';
import { useAudio } from '../../context/AudioContext';
import { useReels } from '../../context/ReelsContext';
import { AIService, AIMessage, VisionAnalysisResult } from '../../services/ai/aiService';
import { chhathSongs } from '../../data/songs';

type ActiveAssistantTab = 'chat' | 'voice' | 'vision';

const SUGGESTED_QUERIES = [
  'कल का अर्घ्य समय क्या है?',
  'ठेकुआ की असली रेसिपी बताओ',
  'पटना का सबसे अच्छा घाट कौन सा है?',
  'शारदा सिन्हा का पारंपरिक गीत सुनाओ',
  'छठ पूजा सामग्री की लिस्ट बना दो',
  'पापा के लिए एक भावुक बधाई संदेश लिखो'
];

export const ChhathiAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate?: (tab: string) => void }> = ({ isOpen, onClose, onNavigate }) => {
  const { userLocation } = useChhathData();
  const { playSong } = useAudio();
  const { openReelsPlatform } = useReels();

  const [activeTab, setActiveTab] = useState<ActiveAssistantTab>('chat');
  const [selectedLang, setSelectedLang] = useState<'hi' | 'en' | 'bho' | 'mai'>('hi');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Messages stream
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `प्रणाम! मैं आपका "छठी सहायक" (Chhathi AI Agent) हूँ 🙏। मैं केवल चैटबॉट नहीं, अपितु वास्तविक कार्यों में आपकी सहायता करता हूँ—जैसे अर्घ्य समय गणना, घाट खोज, ठेकुआ रेसिपी, सामग्री चेकलिस्ट निर्माण, एवं पावन लोकगीत।\n\nआप हिंदी, English, भोजपुरी अथवा मैथिली में पूछ सकते हैं, या सीधे "Talk to AI" टैब से बोलकर बात कर सकते हैं।`,
      lang: 'hi',
      timestamp: new Date().toISOString()
    }
  ]);

  // Voice AI State (Part 6)
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState<string>('माइक पर टैप करके बोलना शुरू करें');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const activeSpeakerCancelRef = useRef<(() => void) | null>(null);

  // Vision AI State (Part 7)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Clean up audio on unmount or close
  useEffect(() => {
    if (!isOpen) {
      if (activeSpeakerCancelRef.current) {
        activeSpeakerCancelRef.current();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Text/Agent Chat Submission
  const handleSend = async (overrideText?: string) => {
    const q = overrideText || inputPrompt;
    if (!q.trim() || isTyping) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      lang: selectedLang,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    try {
      const botResponse = await AIService.chat(q, messages, selectedLang, userLocation);
      setMessages(prev => [...prev, botResponse]);

      // If in voice tab or auto-speak enabled, speak aloud
      if (!isMuted && (activeTab === 'voice' || botResponse.toolResults?.some(t => t.toolName === 'get_arghya_time'))) {
        setIsSpeaking(true);
        const cancelObj = AIService.speakText(botResponse.text, selectedLang, () => {
          setIsSpeaking(false);
        });
        activeSpeakerCancelRef.current = cancelObj.cancel;
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `क्षमा करें, क्वेरी निष्पादन में समस्या आई। डेटाबेस से पुनः प्रयास करें। (${err?.message || 'Error'})`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Real-Time Voice AI (Part 6)
  const startListening = () => {
    setVoiceError(null);
    if (activeSpeakerCancelRef.current) {
      activeSpeakerCancelRef.current();
      setIsSpeaking(false);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('आपके ब्राउज़र में स्पीच रिकॉग्निशन (Web Speech API) समर्थित नहीं है। कृपया Google Chrome या Edge का उपयोग करें।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === 'en' ? 'en-IN' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('सुन रहा हूँ... बोलिए (Listening...)');
        setVoiceTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const final = event.results[i][0].transcript;
            setVoiceTranscript(final);
            setVoiceStatus(`प्राप्त: "${final}"`);
            recognition.stop();
            handleVoiceSubmit(final);
            return;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setVoiceTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError('माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र में माइक की अनुमति दें।');
        } else if (event.error === 'no-speech') {
          setVoiceStatus('कोई आवाज़ नहीं सुनाई दी। पुनः प्रयास करें।');
        } else {
          setVoiceError(`वॉइस त्रुटि: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setVoiceError(`माइक प्रारंभ करने में त्रुटि: ${err?.message}`);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleVoiceSubmit = async (spokenText: string) => {
    if (!spokenText.trim()) return;
    await handleSend(spokenText);
  };

  const stopSpeaking = () => {
    if (activeSpeakerCancelRef.current) {
      activeSpeakerCancelRef.current();
    }
    setIsSpeaking(false);
  };

  // Vision AI Handler (Part 7)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = async () => {
      setSelectedImagePreview(reader.result as string);
      setIsAnalyzingVision(true);
      setVisionResult(null);

      try {
        const result = await AIService.analyzeImage(file);
        setVisionResult(result);
      } catch (err) {
        // Fallback result
        setVisionResult({
          objectName: 'छठ पूजा सामग्री / पारंपरिक वस्तु',
          confidence: 'Medium',
          culturalContext: 'यह छवि छठ महापर्व से संबंधित प्रतीत होती है।',
          confidenceDisclaimer: 'सटीक परिणाम हेतु स्पष्ट प्रकाश में फोटो लें।'
        });
      } finally {
        setIsAnalyzingVision(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-500/40 paramprik-border flex flex-col h-[90vh] max-h-[780px] overflow-hidden text-stone-900 dark:text-stone-100">
        
        {/* Header with Navigation Tabs */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 flex flex-col gap-3 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center shadow-lg animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-rozha text-xl font-bold">छठी सहायक (Chhathi AI Agent)</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    AI Agent Active
                  </span>
                </div>
                <span className="text-xs font-mukta text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <span>उपकरण-आधारित बुद्धिमत्ता</span>
                  <span>•</span>
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{userLocation.city}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switch */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-0.5 border border-amber-500/20 text-xs">
                {(['hi', 'bho', 'mai', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setSelectedLang(l)}
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      selectedLang === l ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-amber-500'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Mute/Sound toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setIsMuted(!isMuted);
                }}
                className={`p-2 rounded-full border transition-all ${
                  isMuted 
                    ? 'border-stone-300 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800' 
                    : 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                }`}
                title={isMuted ? 'ध्वनि चालू करें' : 'ध्वनि म्यूट करें'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs (Agent Chat, Talk to AI, Ask AI About This) */}
          <div className="flex items-center gap-2 pt-1 border-t border-amber-500/10">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>छठी सहायक (Agent Chat)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('voice');
                if (!isListening) startListening();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'voice'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Radio className="w-4 h-4 animate-pulse text-red-500" />
              <span>Talk to AI (रियल-टाइम वॉइस)</span>
            </button>

            <button
              onClick={() => setActiveTab('vision')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'vision'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Ask AI About This (विज़न स्कैनर)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AGENT CHAT */}
        {activeTab === 'chat' && (
          <>
            {/* Suggested Question Chips */}
            <div className="px-4 py-2 bg-stone-50 dark:bg-stone-800/40 border-b border-amber-500/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1 rounded-full text-[11px] font-mukta whitespace-nowrap bg-white dark:bg-stone-800 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-stone-700 dark:text-stone-300 shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-amber-500 text-stone-950 font-bold text-xs'
                        : 'bg-gradient-to-tr from-orange-600 to-amber-500 text-stone-950'
                    }`}
                  >
                    {m.sender === 'user' ? 'आप' : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] space-y-2`}>
                    {/* Tool Badges if executed */}
                    {m.toolResults && m.toolResults.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {m.toolResults.map((tr, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Tool: {tr.toolName}()</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-sm font-mukta leading-relaxed shadow-sm whitespace-pre-line ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-medium rounded-tr-none'
                          : 'bg-stone-100 dark:bg-stone-800 border border-amber-500/20 text-stone-800 dark:text-stone-100 rounded-tl-none'
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Interactive Result Cards */}
                    {m.toolResults?.map((tr, idx) => {
                      // 1. Songs Result Card
                      if (tr.toolName === 'search_songs' && tr.data?.songs?.length > 0) {
                        const song = tr.data.songs[0];
                        const fullSong = chhathSongs.find(s => s.id === song.id) || chhathSongs[0];
                        return (
                          <div key={idx} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Music className="w-5 h-5 text-amber-500 shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-xs truncate">{song.title}</p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400">{song.singer} • {song.language}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => playSong(fullSong)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm shrink-0 hover:bg-amber-400 transition-all"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>गीत सुनें</span>
                            </button>
                          </div>
                        );
                      }

                      // 2. Ghat Result Card
                      if (tr.toolName === 'search_ghats' && tr.data?.ghats?.length > 0) {
                        const ghat = tr.data.ghats[0];
                        return (
                          <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-amber-500/30 rounded-xl space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {ghat.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 font-bold">
                                {ghat.river}
                              </span>
                            </div>
                            <p className="text-stone-600 dark:text-stone-300">पार्किंग: {ghat.parking}</p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {ghat.facilities?.slice(0, 3).map((f: string, fIdx: number) => (
                                <span key={fIdx} className="text-[10px] px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                  ✓ {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // 3. Wish Card with Copy
                      if (tr.toolName === 'generate_wish' && tr.data?.text) {
                        return (
                          <div key={idx} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-600 dark:text-amber-400">✨ तैयार किया गया संदेश</span>
                              <button
                                onClick={() => copyToClipboard(tr.data.text, m.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-400 transition-all"
                              >
                                {copiedId === m.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === m.id ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-stone-400 text-xs font-mukta">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span>छठी सहायक सोच रहा है और डेटा सत्यापित कर रहा है...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-amber-500/20 bg-stone-50 dark:bg-stone-900/60">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={e => setInputPrompt(e.target.value)}
                  placeholder={`छठी सहायक से कुछ भी पूछें (उदा. ${userLocation.city} का अर्घ्य समय, ठेकुआ रेसिपी)...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-amber-500/30 focus:border-amber-500 outline-none text-sm font-mukta text-stone-900 dark:text-stone-100"
                />

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('voice');
                    startListening();
                  }}
                  className="p-2.5 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-amber-500/20 text-stone-700 dark:text-stone-300 transition-colors"
                  title="बोलकर पूछें (Voice)"
                >
                  <Mic className="w-5 h-5 text-amber-500" />
                </button>

                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isTyping}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">भेजें</span>
                </button>
              </form>
            </div>
          </>
        )}

        {/* TAB 2: REAL-TIME VOICE AI (Part 6) */}
        {activeTab === 'voice' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-between text-center overflow-y-auto">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Talk to Chhathi AI (Real-Time Audio)</span>
              </div>
              <h4 className="text-xl font-bold font-rozha">बोलकर पूछें, सीधे जवाब पाएं</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                "मुझे कल का अर्घ्य समय बताओ", "पटना में अच्छा घाट बताओ", या "शारदा सिन्हा का गीत चलाओ"
              </p>
            </div>

            {/* Pulsing Dynamic Visualizer */}
            <div className="relative my-8 flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full bg-orange-500/25 animate-pulse" />
                </>
              )}
              {isSpeaking && (
                <div className="absolute w-40 h-40 rounded-full bg-green-500/20 animate-pulse" />
              )}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
                  isListening
                    ? 'bg-gradient-to-tr from-red-600 to-amber-500 text-white scale-110'
                    : isSpeaking
                    ? 'bg-gradient-to-tr from-green-600 to-emerald-400 text-stone-950 animate-pulse'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 hover:scale-105'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-10 h-10 animate-bounce" />
                    <span className="text-[10px] font-bold mt-1">सुन रहे हैं...</span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Volume2 className="w-10 h-10 animate-pulse" />
                    <span className="text-[10px] font-bold mt-1">बोल रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10" />
                    <span className="text-[10px] font-bold mt-1">टैप करें</span>
                  </>
                )}
              </button>
            </div>

            {/* Transcript & Status Output */}
            <div className="w-full max-w-lg space-y-3">
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-amber-500/20 min-h-[70px] flex items-center justify-center text-sm font-mukta">
                {voiceTranscript ? (
                  <p className="font-medium text-stone-900 dark:text-stone-100 italic">"{voiceTranscript}"</p>
                ) : (
                  <p className="text-stone-400">{voiceStatus}</p>
                )}
              </div>

              {voiceError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{voiceError}</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {isListening && (
                  <button
                    onClick={stopListening}
                    className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold"
                  >
                    रोकें (Stop)
                  </button>
                )}

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>आवाज़ रोकें (Stop Speaking)</span>
                  </button>
                )}

                <button
                  onClick={startListening}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-amber-400 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>पुनः बोलें (Retry)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI VISION SCANNER (Part 7) */}
        {activeTab === 'vision' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="text-center space-y-1.5 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>Ask AI About This (विज़न एनालाइज़र)</span>
              </div>
              <h4 className="text-xl font-bold font-rozha">छठ सामग्री, ठेकुआ या घाट की फोटो दिखाएं</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                AI पहचान करेगा और उसकी सांस्कृतिक महत्ता, बनाने की विधि व सामग्री की जानकारी देगा।
              </p>
            </div>

            {/* Upload Area */}
            <div className="max-w-md mx-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              {!selectedImagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-amber-500/40 rounded-3xl p-8 text-center cursor-pointer hover:bg-amber-500/5 transition-all space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">फोटो अपलोड करें या कैमरा से लें</p>
                    <p className="text-xs text-stone-400 mt-1">PNG, JPG, WebP समर्थित</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-sm hover:bg-amber-400 transition-all"
                  >
                    गैलरी / कैमरा खोलें
                  </button>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-lg max-h-64 flex items-center justify-center bg-black">
                  <img
                    src={selectedImagePreview}
                    alt="Chhath Media"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setSelectedImagePreview(null);
                      setVisionResult(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Analyzing Spinner */}
            {isAnalyzingVision && (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-amber-500">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-xs font-bold">छवि का सांस्कृतिक व दृश्य विश्लेषण जारी है...</span>
              </div>
            )}

            {/* Vision Analysis Output Card */}
            {visionResult && (
              <div className="max-w-xl mx-auto p-5 rounded-3xl bg-stone-50 dark:bg-stone-800/90 border border-amber-500/30 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                      पहचाना गया विषय
                    </span>
                    <h4 className="text-lg font-bold font-rozha text-stone-900 dark:text-stone-100">
                      {visionResult.objectName}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    visionResult.confidence === 'High' 
                      ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                      : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  }`}>
                    विश्वास: {visionResult.confidence}
                  </span>
                </div>

                {/* Cultural Significance */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                    सांस्कृतिक महत्ता (Cultural Context)
                  </span>
                  <p className="text-xs text-stone-700 dark:text-stone-300 font-mukta leading-relaxed">
                    {visionResult.culturalContext}
                  </p>
                </div>

                {/* Ingredients / Components */}
                {visionResult.ingredientsOrComponents && visionResult.ingredientsOrComponents.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-amber-500" />
                      सामग्री एवं अंग
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-stone-600 dark:text-stone-300">
                      {visionResult.ingredientsOrComponents.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dos and Don'ts */}
                {visionResult.traditionalDosAndDonts && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      पवित्र नियम व सावधानियां
                    </span>
                    {visionResult.traditionalDosAndDonts.map((d, idx) => (
                      <p key={idx} className="text-stone-600 dark:text-stone-300">
                        • {d}
                      </p>
                    ))}
                  </div>
                )}

                {/* Low Confidence Disclaimer (Part 7) */}
                {visionResult.confidenceDisclaimer && (
                  <div className="p-2.5 rounded-xl bg-stone-200 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{visionResult.confidenceDisclaimer}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
