import React, { useState, useEffect, useRef } from 'react';
import { useChat, ChatFilterType } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useChhathData } from '../../context/ChhathDataContext';
import { ReelsStorage } from '../../services/reelsStorage';
import { realtimeEngine } from '../../services/chat/realtimeEngine';
import { 
  ChatMessage, 
  Conversation, 
  ReelUser, 
  ChatPrivacySettings, 
  ChatPoll 
} from '../../types';
import { 
  X, 
  Search, 
  Send, 
  Phone, 
  Video, 
  Users, 
  Pin, 
  BellOff, 
  Trash2, 
  Edit3, 
  Smile, 
  Reply, 
  Sparkles, 
  Mic, 
  MicOff, 
  Paperclip, 
  BarChart2, 
  Film, 
  Music, 
  MapPin, 
  Calendar, 
  Play, 
  Pause, 
  Check, 
  CheckCheck, 
  Shield, 
  Plus, 
  Globe, 
  Clock, 
  ArrowLeft,
  Volume2
} from 'lucide-react';

const REACTION_EMOJIS = ['🙏', '❤️', '🔥', '😍', '👍', '😂', '🌺', '🕉️'];

export const ChhathConnectModal: React.FC = () => {
  const { 
    isConnectOpen, 
    closeConnect,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    unreadCount,
    typingUsers,
    selectConversation,
    openChatWithUser,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    votePoll,
    createGroup,
    acceptRequest,
    rejectRequest,
    togglePin,
    toggleMute,
    clearHistory,
    deleteConversation,
    setTyping,
    privacySettings,
    updatePrivacySettings,
    startCall
  } = useChat();

  const { currentUser, openAuthModal } = useAuth();
  const { playSong } = useAudio();
  const { ghats } = useChhathData();

  // Local state for input bar
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showEmojiPickerForMsg, setShowEmojiPickerForMsg] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Modals inside chat
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAiSummaryModal, setShowAiSummaryModal] = useState(false);
  const [aiSummaryContent, setAiSummaryContent] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Group creation form state
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Poll creation form state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');
  const [pollOption3, setPollOption3] = useState('');

  // Voice recording state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<any>(null);

  // Voice playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const voiceAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Message scroll anchor
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);

  if (!isConnectOpen) return null;

  // Filter conversations list
  const filteredConversations = conversations.filter(c => {
    if (activeFilter === 'unread') {
      const lastMsg = c.lastMessage;
      if (!lastMsg) return false;
      const isRead = lastMsg.readBy?.[currentUser?.id || ''];
      return !isRead && lastMsg.senderId !== currentUser?.id;
    }
    if (activeFilter === 'groups') {
      return c.type === 'group';
    }
    if (activeFilter === 'requests') {
      return c.isMessageRequest;
    }
    return true;
  }).filter(c => {
    let name = c.name || '';
    if (c.type === 'direct' && currentUser) {
      const otherId = c.participantIds.find(id => id !== currentUser.id) || '';
      const otherUser = ReelsStorage.findUserById(otherId);
      name = otherUser?.name || otherUser?.username || '';
    }
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get active other user if DM
  const otherParticipant: ReelUser | null = (() => {
    if (!activeConversation || activeConversation.type !== 'direct' || !currentUser) return null;
    const otherId = activeConversation.participantIds.find(id => id !== currentUser.id) || '';
    return ReelsStorage.findUserById(otherId) || null;
  })();

  const isOtherOnline = otherParticipant ? realtimeEngine.isUserOnline(otherParticipant.id) : false;

  // Handle Send Text
  const handleSendText = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');
    const replyTarget = replyingTo;
    setReplyingTo(null);

    await sendMessage({
      text: textToSend,
      type: 'text',
      replyTo: replyTarget || undefined
    });
  };

  // Voice Note Recording Functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          // Send voice message
          await sendMessage({
            type: 'voice',
            mediaUrl: base64Audio,
            voiceDuration: voiceSeconds,
            voiceWaveform: [30, 60, 90, 45, 80, 100, 70, 50, 85, 40, 65, 95]
          });
        };
        // Stop all tracks
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setVoiceSeconds(0);

      voiceTimerRef.current = setInterval(() => {
        setVoiceSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      alert('माइक्रोफोन अनुमति की आवश्यकता है।');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    audioChunksRef.current = [];
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
  };

  // Play voice message
  const playVoiceMessage = (msgId: string, url?: string) => {
    if (!url) return;
    if (playingVoiceId === msgId) {
      voiceAudioElementRef.current?.pause();
      setPlayingVoiceId(null);
      return;
    }

    if (voiceAudioElementRef.current) {
      voiceAudioElementRef.current.pause();
    }

    const audio = new Audio(url);
    voiceAudioElementRef.current = audio;
    setPlayingVoiceId(msgId);

    audio.play().catch(() => setPlayingVoiceId(null));
    audio.onended = () => {
      setPlayingVoiceId(null);
    };
  };

  // Smart suggestions from Chhathi AI
  const smartSuggestions = [
    'जय छठी मइया! 🙏',
    'घाट पर अर्घ्य का समय क्या है?',
    'ठेकुआ प्रसाद तैयार हो गया क्या? 🌺',
    'संध्या अर्घ्य पर साथ चलते हैं!'
  ];

  // AI Translation simulation (Bhojpuri / Maithili / Hindi)
  const handleTranslate = (lang: string) => {
    if (!inputText.trim()) return;
    if (lang === 'bho') {
      setInputText(prev => `जय छठी मइया! रउआ सब के छठ पर्व के बहुत-बहुत बधाई। ${prev}`);
    } else if (lang === 'mai') {
      setInputText(prev => `जय छठी माय! अहां सब के छठ पूजाक हार्दिक शुभकामना। ${prev}`);
    } else if (lang === 'hi') {
      setInputText(prev => `जय छठी मइया! आप सभी को छठ महापर्व की पावन शुभकामनाएं। ${prev}`);
    }
  };

  // AI Chat Summary
  const handleSummarizeGroup = () => {
    setIsSummarizing(true);
    setShowAiSummaryModal(true);
    setTimeout(() => {
      setAiSummaryContent(
        `📌 **छठी AI समूह सारांश (पटना छठ संगम परिवार):**\n\n` +
        `• **घाट की तैयारी:** दीघा पाटीपुल घाट पर कल दोपहर 2:00 बजे सभी सदस्य एकत्रित होंगे।\n` +
        `• **प्रसाद सामग्री:** ठेकुआ, खजूर एवं फल प्रसाद की टोकरी (दउरा) तैयार कर ली गई है।\n` +
        `• **अर्घ्य समय:** संध्या अर्घ्य सायं 05:08 बजे एवं प्रातःकालीन अर्घ्य सुबह 06:12 बजे नियत है।\n` +
        `• **सुरक्षा एवं लाइव दर्शन:** घाट मार्ग पर दीप प्रज्वलन व स्वच्छ जल सेवा का समन्वय पूर्ण है।`
      );
      setIsSummarizing(false);
    }, 800);
  };

  // Submit Poll
  const handleCreatePoll = async () => {
    if (!pollQuestion.trim() || !pollOption1.trim() || !pollOption2.trim()) return;
    const poll: ChatPoll = {
      id: `poll_${Date.now()}`,
      question: pollQuestion.trim(),
      options: [
        { id: 'opt_1', text: pollOption1.trim(), voterIds: [], votes: [] },
        { id: 'opt_2', text: pollOption2.trim(), voterIds: [], votes: [] },
        ...(pollOption3.trim() ? [{ id: 'opt_3', text: pollOption3.trim(), voterIds: [], votes: [] }] : [])
      ],
      createdBy: currentUser?.id || 'guest_user',
      createdAt: new Date().toISOString()
    };

    await sendMessage({
      type: 'poll',
      text: `📊 पोल: ${poll.question}`,
      richCard: {
        type: 'poll',
        id: poll.id,
        title: poll.question,
        metadata: { poll }
      }
    });

    setShowPollModal(false);
    setPollQuestion('');
    setPollOption1('');
    setPollOption2('');
    setPollOption3('');
  };

  // Submit Group
  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    createGroup(groupName.trim(), groupDesc.trim(), selectedMembers);
    setShowCreateGroupModal(false);
    setGroupName('');
    setGroupDesc('');
    setSelectedMembers([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[880px] bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-white">
        
        {/* ================= LEFT SIDEBAR (CONVERSATIONS) ================= */}
        <div className={`w-full md:w-80 lg:w-96 bg-slate-950/90 border-r border-slate-800 flex flex-col h-full ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">छठ कनेक्ट</h2>
                <div className="flex items-center space-x-1.5 text-xs text-amber-400/90 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>पवित्र सामाजिक संवाद</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                title="नया समूह बनाएं"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="गोपनीयता सेटिंग्स"
              >
                <Shield className="w-4 h-4" />
              </button>
              <button
                onClick={closeConnect}
                className="md:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="p-3 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="वार्तालाप या भक्त खोजें..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center space-x-1 overflow-x-auto text-xs font-semibold">
            {(['all', 'unread', 'groups', 'requests'] as ChatFilterType[]).map(tab => {
              const label = tab === 'all' ? 'सभी' : tab === 'unread' ? 'अपठित' : tab === 'groups' ? 'समूह' : 'अनुरोध';
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {label}
                  {tab === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                कोई संवाद उपलब्ध नहीं है।
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = activeConversationId === conv.id;
                let convTitle = conv.name || '';
                let convAvatar = conv.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80';
                let isOnline = false;

                if (conv.type === 'direct' && currentUser) {
                  const otherId = conv.participantIds.find(id => id !== currentUser.id) || '';
                  const other = ReelsStorage.findUserById(otherId);
                  if (other) {
                    convTitle = other.name;
                    convAvatar = other.avatarUrl;
                    isOnline = realtimeEngine.isUserOnline(other.id);
                  }
                }

                const lastMsg = conv.lastMessage;
                const isPinned = currentUser ? conv.pinnedBy?.includes(currentUser.id) : false;
                const isMuted = currentUser ? Boolean(conv.mutedBy?.[currentUser.id] && conv.mutedBy[currentUser.id] > Date.now()) : false;

                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center space-x-3 border ${
                      isSelected 
                        ? 'bg-amber-500/15 border-amber-500/40 shadow-md' 
                        : 'bg-slate-900/40 border-slate-800/40 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    {/* Avatar with status dot */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={convAvatar} 
                        alt={convTitle} 
                        className="w-11 h-11 rounded-2xl object-cover border border-amber-500/20"
                      />
                      {conv.type === 'direct' && isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="text-sm font-semibold text-white truncate">{convTitle}</span>
                          {conv.type === 'group' && <Users className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        </div>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-500 flex-shrink-0">
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <p className="truncate pr-2">
                          {conv.isMessageRequest ? '🔔 नया संदेश अनुरोध' : (lastMsg ? lastMsg.text || (lastMsg.type === 'voice' ? '🎙️ वॉयस संदेश' : '🖼️ मीडिया') : 'संवाद शुरू करें...')}
                        </p>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {isPinned && <Pin className="w-3 h-3 text-amber-400" />}
                          {isMuted && <BellOff className="w-3 h-3 text-slate-500" />}
                        </div>
                      </div>

                      {/* Request action buttons */}
                      {conv.isMessageRequest && (
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); acceptRequest(conv.id); }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white transition-colors"
                          >
                            स्वीकारें
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); rejectRequest(conv.id); }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 transition-colors"
                          >
                            हटाएं
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ================= RIGHT MAIN CHAT AREA ================= */}
        <div className={`flex-1 bg-slate-900/60 flex flex-col h-full ${
          !activeConversationId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {activeConversation ? (
            <>
              {/* Active Conversation Top Bar */}
              <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => selectConversation(null)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <img 
                      src={activeConversation.type === 'direct' ? (otherParticipant?.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80') : (activeConversation.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80')} 
                      alt="Avatar"
                      className="w-10 h-10 rounded-2xl object-cover border border-amber-500/30"
                    />
                    {activeConversation.type === 'direct' && isOtherOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <span>{activeConversation.type === 'direct' ? (otherParticipant?.name || 'छठ भक्त') : activeConversation.name}</span>
                      {activeConversation.type === 'group' && <Users className="w-3.5 h-3.5 text-amber-400" />}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                      {typingUsers.length > 0 ? (
                        <span className="text-amber-400 font-semibold animate-pulse">लिख रहे हैं...</span>
                      ) : activeConversation.type === 'direct' ? (
                        isOtherOnline ? <span className="text-emerald-400 font-medium">ऑनलाइन</span> : <span>अंतिम दर्शन सक्रिय</span>
                      ) : (
                        <span>{activeConversation.participantIds.length} सदस्य जुड़े हैं</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Call & Utility Actions */}
                <div className="flex items-center space-x-1.5">
                  {activeConversation.type === 'direct' && otherParticipant && (
                    <>
                      <button
                        onClick={() => startCall(otherParticipant, 'voice')}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition-colors"
                        title="वॉयस कॉल करें"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startCall(otherParticipant, 'video')}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition-colors"
                        title="वीडियो कॉल करें"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {activeConversation.type === 'group' && (
                    <button
                      onClick={handleSummarizeGroup}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold transition-colors"
                      title="छठी AI द्वारा समूह सारांश"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">AI सारांश</span>
                    </button>
                  )}

                  <button
                    onClick={() => togglePin(activeConversation.id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                    title="पिन / अनपिन करें"
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleMute(activeConversation.id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                    title="म्यूट / अनम्यूट करें"
                  >
                    <BellOff className="w-4 h-4" />
                  </button>
                  <button
                    onClick={closeConnect}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                      <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">पावन संवाद का शुभारंभ करें</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      जय छठी मइया! आप यहाँ भक्तिमय संदेश, भजन, रील, घाट की जानकारी अथवा वॉयस संदेश साझा कर सकते हैं।
                    </p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === (currentUser?.id || 'guest_user');
                    const isPlayingVoice = playingVoiceId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                      >
                        {/* Sender name for group chats if inbound */}
                        {!isMe && activeConversation.type === 'group' && (
                          <span className="text-[11px] text-amber-400/90 font-medium ml-2 mb-1">
                            {msg.senderName}
                          </span>
                        )}

                        {/* Reply Header Preview if present */}
                        {msg.replyTo && (
                          <div className={`text-[10px] mb-1 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 max-w-xs truncate ${
                            isMe ? 'mr-1' : 'ml-1'
                          }`}>
                            <span className="font-semibold text-amber-400">@{msg.replyTo.senderName}: </span>
                            {msg.replyTo.text}
                          </div>
                        )}

                        {/* Message Bubble Container */}
                        <div className="relative max-w-[85%] sm:max-w-[70%]">
                          <div className={`p-3.5 rounded-3xl text-sm leading-relaxed shadow-lg ${
                            isMe 
                              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-tr-sm' 
                              : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-sm'
                          }`}>
                            
                            {/* TEXT CONTENT */}
                            {msg.text && (
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            )}

                            {/* VOICE NOTE CONTENT */}
                            {msg.type === 'voice' && (
                              <div className="flex items-center space-x-3 py-1 min-w-[200px]">
                                <button
                                  onClick={() => playVoiceMessage(msg.id, msg.mediaUrl)}
                                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-transform active:scale-95"
                                >
                                  {isPlayingVoice ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-1 h-6">
                                    {(msg.voiceWaveform || [30, 60, 90, 45, 80, 100, 70, 50, 85, 40, 65, 95]).map((h, i) => (
                                      <div
                                        key={i}
                                        className={`w-1 rounded-full ${isPlayingVoice ? 'bg-amber-300 animate-pulse' : 'bg-white/60'}`}
                                        style={{ height: `${h}%` }}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-white/80 font-mono mt-0.5 block">
                                    {Math.floor((msg.voiceDuration || 0) / 60)}:{( (msg.voiceDuration || 0) % 60 ).toString().padStart(2, '0')} वॉयस संदेश
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* RICH CARDS (REEL / SONG / GHAT / PLAN / POLL) */}
                            {msg.richCard && (
                              <div className="mt-2.5 p-3 rounded-2xl bg-black/30 border border-white/10 text-white">
                                {msg.richCard.type === 'reel' && (
                                  <div className="space-y-2">
                                    {msg.richCard.thumbnail && (
                                      <img 
                                        src={msg.richCard.thumbnail} 
                                        alt={msg.richCard.title}
                                        className="w-full h-36 object-cover rounded-xl border border-white/10"
                                      />
                                    )}
                                    <div className="flex items-center justify-between">
                                      <div className="min-w-0 pr-2">
                                        <div className="flex items-center space-x-1 text-xs text-pink-400 font-semibold">
                                          <Film className="w-3.5 h-3.5" />
                                          <span>छठ रील</span>
                                        </div>
                                        <h5 className="text-xs font-bold truncate">{msg.richCard.title}</h5>
                                      </div>
                                      <a
                                        href={`/reels?reelId=${msg.richCard.id}`}
                                        className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold whitespace-nowrap shadow transition-colors"
                                      >
                                        ▶ रील देखें
                                      </a>
                                    </div>
                                  </div>
                                )}

                                {msg.richCard.type === 'song' && (
                                  <div className="flex items-center justify-between space-x-3">
                                    <div className="flex items-center space-x-2.5 min-w-0">
                                      {msg.richCard.thumbnail && (
                                        <img 
                                          src={msg.richCard.thumbnail} 
                                          alt={msg.richCard.title}
                                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                                        />
                                      )}
                                      <div className="truncate">
                                        <div className="text-[10px] text-amber-300 font-semibold flex items-center space-x-1">
                                          <Music className="w-3 h-3" />
                                          <span>छठ भजन</span>
                                        </div>
                                        <h5 className="text-xs font-bold truncate">{msg.richCard.title}</h5>
                                        <span className="text-[10px] text-slate-300 truncate block">{msg.richCard.subtitle}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        playSong({
                                          id: msg.richCard!.id,
                                          title: msg.richCard!.title,
                                          singer: msg.richCard!.subtitle || 'पारंपरिक',
                                          duration: '5:00',
                                          thumbnail: msg.richCard!.thumbnail || '',
                                          youtubeId: msg.richCard!.metadata?.youtubeId,
                                          language: 'Hindi',
                                          category: 'Traditional',
                                          audioUrl: ''
                                        });
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold whitespace-nowrap shadow transition-colors"
                                    >
                                      ▶ सुनें
                                    </button>
                                  </div>
                                )}

                                {msg.richCard.type === 'ghat' && (
                                  <div className="space-y-2">
                                    {msg.richCard.thumbnail && (
                                      <img 
                                        src={msg.richCard.thumbnail} 
                                        alt={msg.richCard.title}
                                        className="w-full h-28 object-cover rounded-xl border border-white/10"
                                      />
                                    )}
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                                          <MapPin className="w-3 h-3" />
                                          <span>छठ घाट विवरण</span>
                                        </div>
                                        <h5 className="text-xs font-bold">{msg.richCard.title}</h5>
                                        <span className="text-[10px] text-slate-300">{msg.richCard.subtitle}</span>
                                      </div>
                                      <a
                                        href={`/ghats?ghatId=${msg.richCard.id}`}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                                      >
                                        घाट देखें
                                      </a>
                                    </div>
                                  </div>
                                )}

                                {msg.richCard.type === 'poll' && msg.richCard.metadata?.poll && (
                                  <div className="space-y-2.5">
                                    <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                                      <BarChart2 className="w-4 h-4" />
                                      <span>{msg.richCard.metadata.poll.question}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                      {msg.richCard.metadata.poll.options.map((opt: any) => {
                                        const totalVotes = msg.richCard!.metadata.poll.options.reduce((acc: number, curr: any) => acc + curr.votes.length, 0);
                                        const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                                        const hasVoted = currentUser && opt.votes.includes(currentUser.id);

                                        return (
                                          <div
                                            key={opt.id}
                                            onClick={() => votePoll(msg.id, msg.richCard!.metadata.poll.id, opt.id)}
                                            className={`p-2 rounded-xl text-xs cursor-pointer border relative overflow-hidden transition-all ${
                                              hasVoted 
                                                ? 'border-amber-400 bg-amber-500/20' 
                                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                          >
                                            <div 
                                              className="absolute top-0 bottom-0 left-0 bg-amber-500/20 transition-all duration-300"
                                              style={{ width: `${pct}%` }}
                                            />
                                            <div className="relative flex items-center justify-between z-10">
                                              <span className="font-medium">{opt.text}</span>
                                              <span className="font-bold text-[10px] opacity-80">{pct}% ({opt.votes.length})</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Meta footer inside bubble */}
                            <div className={`flex items-center justify-end space-x-1.5 mt-1 text-[10px] ${
                              isMe ? 'text-white/80' : 'text-slate-400'
                            }`}>
                              {msg.isEdited && <span className="italic">(संपादित)</span>}
                              <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && (
                                msg.status === 'read' 
                                  ? <CheckCheck className="w-3.5 h-3.5 text-blue-300 stroke-[2.5]" />
                                  : msg.status === 'delivered'
                                    ? <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                                    : <Check className="w-3.5 h-3.5 text-white/50" />
                              )}
                            </div>

                          </div>

                          {/* Quick Reactions Bar on Hover */}
                          <div className={`absolute top-0 ${isMe ? '-left-28' : '-right-28'} hidden group-hover:flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded-full px-2 py-1 shadow-xl z-20`}>
                            {REACTION_EMOJIS.slice(0, 4).map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => reactToMessage(msg.id, emoji)}
                                className="hover:scale-125 transition-transform text-sm"
                              >
                                {emoji}
                              </button>
                            ))}
                            <button
                              onClick={() => setReplyingTo(msg)}
                              className="p-1 hover:text-amber-400 text-slate-400"
                              title="उत्तर दें"
                            >
                              <Reply className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Message Reactions Pills */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className={`flex items-center space-x-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              {Object.entries(msg.reactions).map(([emoji, users]) => (
                                <span
                                  key={emoji}
                                  className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] shadow-sm"
                                >
                                  {emoji} {users.length > 1 && <span className="text-[9px] text-slate-400">{users.length}</span>}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messageEndRef} />
              </div>

              {/* Smart Chhathi AI Toolbar & Quick Suggestions */}
              <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-xs">
                <div className="flex items-center space-x-1 text-amber-400 font-bold flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px]">छठी AI:</span>
                </div>
                {smartSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(sug)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 hover:text-amber-300 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors text-[11px]"
                  >
                    {sug}
                  </button>
                ))}
                <div className="h-4 w-px bg-slate-700 flex-shrink-0" />
                <button
                  onClick={() => handleTranslate('bho')}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold whitespace-nowrap"
                  title="भोजपुरी में अनुवाद"
                >
                  भोजपुरी
                </button>
                <button
                  onClick={() => handleTranslate('mai')}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold whitespace-nowrap"
                  title="मैथिली में अनुवाद"
                >
                  मैथिली
                </button>
              </div>

              {/* Reply target notification bar */}
              {replyingTo && (
                <div className="px-4 py-2 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center space-x-2 truncate">
                    <Reply className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="font-semibold text-amber-400">@{replyingTo.senderName}</span>
                    <span className="truncate">{replyingTo.text || 'मीडिया संदेश'}</span>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Voice Recording In-Progress Bar */}
              {isRecordingVoice ? (
                <div className="p-4 bg-slate-950 border-t border-amber-500/40 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
                    <span className="text-sm font-semibold text-red-400">
                      वॉयस संदेश रिकॉर्ड हो रहा है ({Math.floor(voiceSeconds / 60)}:{(voiceSeconds % 60).toString().padStart(2, '0')})
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={cancelVoiceRecording}
                      className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      रद्द करें
                    </button>
                    <button
                      onClick={stopVoiceRecording}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>भेजें</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Bottom Input Box */
                <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-2">
                  
                  {/* Attachment Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="संलग्न करें"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    {showAttachMenu && (
                      <div className="absolute bottom-12 left-0 w-48 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-30 space-y-1 text-xs">
                        <button
                          onClick={() => { setShowPollModal(true); setShowAttachMenu(false); }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left text-slate-200"
                        >
                          <BarChart2 className="w-4 h-4 text-amber-400" />
                          <span>पोल बनाएं</span>
                        </button>
                        <a
                          href="/reels"
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left text-slate-200"
                        >
                          <Film className="w-4 h-4 text-pink-400" />
                          <span>रील से साझा करें</span>
                        </a>
                        <a
                          href="/ghats"
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left text-slate-200"
                        >
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span>घाट खोजें व साझा करें</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setTyping(e.target.value.length > 0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendText();
                      }
                    }}
                    placeholder="छठी मइया का पावन संदेश लिखें..."
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
                  />

                  {/* Voice Note Button */}
                  <button
                    onClick={startVoiceRecording}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                    title="वॉयस संदेश रिकॉर्ड करें"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  {/* Send Button */}
                  <button
                    disabled={!inputText.trim()}
                    onClick={handleSendText}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>

                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">छठ कनेक्ट संवाद केंद्र</h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                बाईं ओर से किसी मित्र, परिवार सदस्य या समूह का चयन करें, अथवा नया समूह बनाकर पावन पर्व पर जुड़े रहें।
              </p>
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20"
              >
                + नया समूह बनाएं
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ================= MODAL: CREATE GROUP ================= */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">नया छठ समूह बनाएं</h3>
              <button onClick={() => setShowCreateGroupModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">समूह का नाम</label>
                <input 
                  type="text" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="उदा: पटना घाट सेवा परिवार"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">विवरण (Description)</label>
                <input 
                  type="text" 
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="उदा: दीघा घाट पर अर्घ्य अर्पण समन्वय"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">सदस्यों को जोड़ें</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {ReelsStorage.getUsers().filter(u => u.id !== currentUser?.id).map(user => {
                    const isSelected = selectedMembers.includes(user.id);
                    return (
                      <div 
                        key={user.id}
                        onClick={() => {
                          setSelectedMembers(prev => 
                            prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                          );
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs ${
                          isSelected ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span>{user.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  रद्द करें
                </button>
                <button
                  disabled={!groupName.trim()}
                  onClick={handleCreateGroup}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40"
                >
                  समूह बनाएं
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE POLL ================= */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-amber-400" />
                <span>नया पोल बनाएं</span>
              </h3>
              <button onClick={() => setShowPollModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">प्रश्न</label>
                <input 
                  type="text" 
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="उदा: संध्या अर्घ्य के लिए कौन सा घाट उचित रहेगा?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">विकल्प 1</label>
                <input 
                  type="text" 
                  value={pollOption1}
                  onChange={(e) => setPollOption1(e.target.value)}
                  placeholder="दीघा पाटीपुल घाट"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">विकल्प 2</label>
                <input 
                  type="text" 
                  value={pollOption2}
                  onChange={(e) => setPollOption2(e.target.value)}
                  placeholder="गांधी घाट"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">विकल्प 3 (वैकल्पिक)</label>
                <input 
                  type="text" 
                  value={pollOption3}
                  onChange={(e) => setPollOption3(e.target.value)}
                  placeholder="घर की छत पर अर्घ्य"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  onClick={() => setShowPollModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  रद्द करें
                </button>
                <button
                  disabled={!pollQuestion.trim() || !pollOption1.trim() || !pollOption2.trim()}
                  onClick={handleCreatePoll}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40"
                >
                  पोल साझा करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRIVACY SETTINGS ================= */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>संवाद गोपनीयता सेटिंग्स</span>
              </h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">मुझे कौन संदेश भेज सकता है?</label>
                <select 
                  value={privacySettings.whoCanMessageMe}
                  onChange={(e) => updatePrivacySettings({ whoCanMessageMe: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="everyone">सभी भक्त (Everyone)</option>
                  <option value="following">केवल जिन्हें मैं फॉलो करता हूँ (Following only)</option>
                  <option value="none">कोई नहीं (Nobody)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">मुझे समूहों में कौन जोड़ सकता है?</label>
                <select 
                  value={privacySettings.whoCanAddToGroups}
                  onChange={(e) => updatePrivacySettings({ whoCanAddToGroups: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="everyone">सभी भक्त (Everyone)</option>
                  <option value="following">केवल जिन्हें मैं फॉलो करता हूँ (Following only)</option>
                  <option value="none">कोई नहीं (Nobody)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">मुझे वॉयस / वीडियो कॉल कौन कर सकता है?</label>
                <select 
                  value={privacySettings.whoCanCallMe}
                  onChange={(e) => updatePrivacySettings({ whoCanCallMe: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="everyone">सभी भक्त (Everyone)</option>
                  <option value="following">केवल जिन्हें मैं फॉलो करता हूँ (Following only)</option>
                  <option value="none">कोई नहीं (Nobody)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h5 className="text-xs font-semibold text-white">सक्रियता स्थिति (Activity Status)</h5>
                  <p className="text-[10px] text-slate-400">ऑनलाइन व अंतिम दर्शन स्थिति दिखाएं</p>
                </div>
                <input 
                  type="checkbox"
                  checked={privacySettings.activityStatus}
                  onChange={(e) => updatePrivacySettings({ activityStatus: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  सेटिंग्स सहेजें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: AI SUMMARY ================= */}
      {showAiSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center space-x-2 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <span>छठी AI समूह सारांश</span>
              </h3>
              <button onClick={() => setShowAiSummaryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSummarizing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-8 h-8 text-amber-400 animate-spin mb-3" />
                <p className="text-xs text-slate-300">समूह चर्चा का गहन विश्लेषण किया जा रहा है...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed text-slate-200 whitespace-pre-line">
                  {aiSummaryContent}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAiSummaryModal(false)}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    ठीक है
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
