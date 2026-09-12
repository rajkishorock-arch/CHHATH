import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChatMessage, 
  Conversation, 
  ChatPrivacySettings, 
  CallSession, 
  CallType, 
  ReelUser, 
  MessageType,
  RichCardPayload 
} from '../types';
import { useAuth } from './AuthContext';
import { ChatStorage } from '../services/chat/chatStorage';
import { realtimeEngine, RealtimeEventPayload } from '../services/chat/realtimeEngine';
import { webrtcCallEngine } from '../services/chat/webrtcCallEngine';

export type ChatFilterType = 'all' | 'unread' | 'groups' | 'requests';

export interface ShareData {
  type: 'reel' | 'song' | 'ghat' | 'plan';
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  metadata?: any;
}

const DEFAULT_GUEST_USER: ReelUser = {
  id: 'guest_user',
  username: 'guest',
  name: 'अतिथि भक्त',
  email: 'guest@chhath.local',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
  bio: 'जय छठी मइया',
  city: 'पटना',
  state: 'बिहार',
  language: 'hi',
  role: 'user',
  followersCount: 0,
  followingCount: 0,
  totalLikesCount: 0,
  reelsCount: 0,
  verified: false,
  interests: ['culture', 'songs'],
  onboardingCompleted: true,
  createdAt: new Date().toISOString()
};

interface ChatContextType {
  // Navigation & UI Modal State
  isConnectOpen: boolean;
  openConnect: (conversationId?: string) => void;
  closeConnect: () => void;
  activeFilter: ChatFilterType;
  setActiveFilter: (filter: ChatFilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Conversations & Messages
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  unreadCount: number;
  typingUsers: string[];
  selectConversation: (conversationId: string | null) => void;
  openChatWithUser: (userId: string) => Promise<string>;

  // Actions
  sendMessage: (payload: {
    text?: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaDuration?: number;
    voiceDuration?: number;
    voiceWaveform?: number[];
    richCard?: RichCardPayload;
    replyTo?: ChatMessage;
  }) => Promise<ChatMessage | null>;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string, forEveryone: boolean) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  votePoll: (messageId: string, pollId: string, optionId: string) => void;
  createGroup: (name: string, description: string, participantIds: string[], avatar?: string) => Conversation;
  acceptRequest: (conversationId: string) => void;
  rejectRequest: (conversationId: string) => void;
  togglePin: (conversationId: string) => void;
  toggleMute: (conversationId: string, durationMs?: number) => void;
  clearHistory: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  setTyping: (isTyping: boolean) => void;

  // Privacy
  privacySettings: ChatPrivacySettings;
  updatePrivacySettings: (updates: Partial<ChatPrivacySettings>) => void;

  // Universal Share Modal
  shareModalOpen: boolean;
  shareData: ShareData | null;
  openShareModal: (data: ShareData) => void;
  closeShareModal: () => void;
  shareContentToConversations: (conversationIds: string[], note?: string) => Promise<void>;

  // Call Engine
  activeCall: CallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  startCall: (targetUser: ReelUser, type: CallType) => Promise<{ success: boolean; error?: string }>;
  acceptCall: () => Promise<void>;
  endCall: () => void;
  toggleCallAudio: () => void;
  toggleCallVideo: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, openAuthModal } = useAuth();
  
  // Connect Modal state
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ChatFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Conversations list & active messages
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState<ChatPrivacySettings>(() => {
    return currentUser ? ChatStorage.getPrivacySettings(currentUser.id) : {
      whoCanMessageMe: 'everyone',
      whoCanAddToGroups: 'everyone',
      whoCanCallMe: 'everyone',
      activityStatus: true
    };
  });

  // Share Modal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData | null>(null);

  // Call State
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Effective current user (authenticated or guest default)
  const currentUserId = currentUser?.id || 'guest_user';

  // Fetch conversations
  const refreshConversations = useCallback(() => {
    const list = ChatStorage.getConversations(currentUserId);
    setConversations(list);
    setUnreadCount(ChatStorage.getUnreadCount(currentUserId));
  }, [currentUserId]);

  // Handle Realtime Events
  const handleRealtimeEvent = useCallback((event: RealtimeEventPayload) => {
    if (event.type === 'new_message') {
      const msg: ChatMessage = event.data;
      if (msg.conversationId === activeConversationId) {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        ChatStorage.markAsRead(activeConversationId, currentUserId);
      }
      refreshConversations();
    } else if (event.type === 'typing_start' || event.type === 'typing_stop') {
      if (event.conversationId === activeConversationId) {
        setTypingUsers(realtimeEngine.getTypingUsers(activeConversationId));
      }
    } else if (event.type === 'message_reaction' || event.type === 'poll_voted') {
      if (event.conversationId === activeConversationId) {
        setMessages(ChatStorage.getMessages(activeConversationId));
      }
    } else if (event.type === 'call_signal' && event.data?.signalType === 'call_offer') {
      // Incoming call signal received
      refreshConversations();
    }
  }, [activeConversationId, currentUserId, refreshConversations]);

  // 1. Initialize realtime engine and storage
  useEffect(() => {
    ChatStorage.ensureInitialized(currentUserId);
    realtimeEngine.init(currentUserId);
    refreshConversations();

    // Subscribe to realtime broadcast events
    const unsub = realtimeEngine.subscribe(handleRealtimeEvent);

    // Subscribe to WebRTC call state changes
    const unsubCall = webrtcCallEngine.subscribe((session, local, remote) => {
      setActiveCall(session);
      setLocalStream(local);
      setRemoteStream(remote);
    });

    return () => {
      unsub();
      unsubCall();
    };
  }, [currentUserId, handleRealtimeEvent, refreshConversations]);

  // Refresh privacy when user changes
  useEffect(() => {
    if (currentUser) {
      setPrivacySettings(ChatStorage.getPrivacySettings(currentUser.id));
    }
  }, [currentUser]);

  // 3. Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      const msgs = ChatStorage.getMessages(activeConversationId);
      setMessages(msgs);
      ChatStorage.markAsRead(activeConversationId, currentUserId);
      refreshConversations();
      // Update typing users
      setTypingUsers(realtimeEngine.getTypingUsers(activeConversationId));
    } else {
      setMessages([]);
      setTypingUsers([]);
    }
  }, [activeConversationId, currentUserId, refreshConversations]);

  // Active Conversation Object
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Open / Close modal
  const openConnect = (convId?: string) => {
    if (convId) {
      setActiveConversationId(convId);
    }
    setIsConnectOpen(true);
  };

  const closeConnect = () => {
    setIsConnectOpen(false);
  };

  const selectConversation = (id: string | null) => {
    setActiveConversationId(id);
  };

  // Open Chat with a specific user (creates DM if not exists)
  const openChatWithUser = async (targetUserId: string): Promise<string> => {
    if (!currentUser) {
      openAuthModal('login', 'संदेश भेजने के लिए कृपया लॉगिन करें।');
      return '';
    }
    const conv = ChatStorage.getOrCreateDirectConversation(currentUser.id, targetUserId);
    refreshConversations();
    setActiveConversationId(conv.id);
    setIsConnectOpen(true);
    return conv.id;
  };

  // Send Message
  const sendMessage = async (payload: {
    text?: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaDuration?: number;
    voiceDuration?: number;
    voiceWaveform?: number[];
    richCard?: RichCardPayload;
    replyTo?: ChatMessage;
  }): Promise<ChatMessage | null> => {
    if (!activeConversationId) return null;

    const sender: ReelUser = currentUser || DEFAULT_GUEST_USER;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: activeConversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderUsername: sender.username,
      senderAvatar: sender.avatarUrl,
      type: payload.type || 'text',
      text: payload.text || '',
      mediaUrl: payload.mediaUrl,
      mediaDuration: payload.mediaDuration,
      voiceDuration: payload.voiceDuration,
      voiceWaveform: payload.voiceWaveform,
      richCard: payload.richCard,
      replyTo: payload.replyTo ? {
        id: payload.replyTo.id,
        senderName: payload.replyTo.senderName,
        text: payload.replyTo.text || (payload.replyTo.type === 'voice' ? 'वॉयस संदेश' : 'मीडिया संदेश'),
        type: payload.replyTo.type
      } : undefined,
      status: 'delivered',
      readBy: { [sender.id]: Date.now() },
      deliveredTo: { [sender.id]: Date.now() },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally
    ChatStorage.saveMessage(newMsg);

    // Relay via RealtimeEngine
    realtimeEngine.broadcast('new_message', newMsg, activeConversationId);

    // Post to backend relay server
    try {
      fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      }).catch(() => {});
    } catch {}

    // Update local state immediately
    setMessages(prev => [...prev, newMsg]);
    refreshConversations();

    // Auto-stop typing
    realtimeEngine.sendTypingStop(activeConversationId);

    return newMsg;
  };

  // Edit Message
  const editMessage = (messageId: string, newText: string) => {
    if (!activeConversationId) return;
    ChatStorage.updateMessage(messageId, activeConversationId, {
      text: newText,
      isEdited: true
    });
    setMessages(ChatStorage.getMessages(activeConversationId));
    refreshConversations();
  };

  // Delete Message
  const deleteMessage = (messageId: string, forEveryone: boolean) => {
    if (!activeConversationId) return;
    ChatStorage.deleteMessage(messageId, activeConversationId, currentUserId, forEveryone);
    setMessages(ChatStorage.getMessages(activeConversationId));
    refreshConversations();
  };

  // React
  const reactToMessage = (messageId: string, emoji: string) => {
    if (!activeConversationId) return;
    ChatStorage.addReaction(messageId, activeConversationId, currentUserId, emoji);
    realtimeEngine.broadcast('message_reaction', { messageId, emoji }, activeConversationId);
    setMessages(ChatStorage.getMessages(activeConversationId));
  };

  // Vote Poll
  const votePoll = (messageId: string, pollId: string, optionId: string) => {
    if (!activeConversationId) return;
    ChatStorage.votePoll(messageId, activeConversationId, pollId, optionId, currentUserId);
    realtimeEngine.broadcast('poll_voted', { messageId, pollId, optionId }, activeConversationId);
    setMessages(ChatStorage.getMessages(activeConversationId));
  };

  // Create Group
  const createGroup = (name: string, description: string, participantIds: string[], avatar?: string): Conversation => {
    const grp = ChatStorage.createGroupConversation(currentUserId, name, description, participantIds, avatar);
    refreshConversations();
    setActiveConversationId(grp.id);
    return grp;
  };

  // Accept Request
  const acceptRequest = (convId: string) => {
    ChatStorage.acceptMessageRequest(convId);
    refreshConversations();
  };

  // Reject Request
  const rejectRequest = (convId: string) => {
    ChatStorage.rejectMessageRequest(convId, currentUserId);
    if (activeConversationId === convId) {
      setActiveConversationId(null);
    }
    refreshConversations();
  };

  // Toggle Pin
  const togglePin = (convId: string) => {
    ChatStorage.togglePin(convId, currentUserId);
    refreshConversations();
  };

  // Toggle Mute
  const toggleMute = (convId: string, durationMs?: number) => {
    ChatStorage.toggleMute(convId, currentUserId, durationMs);
    refreshConversations();
  };

  // Clear History
  const clearHistory = (convId: string) => {
    ChatStorage.clearMessages(convId);
    setMessages([]);
    refreshConversations();
  };

  // Delete Conversation
  const deleteConversation = (convId: string) => {
    ChatStorage.deleteConversation(convId, currentUserId);
    if (activeConversationId === convId) {
      setActiveConversationId(null);
    }
    refreshConversations();
  };

  // Typing state
  const setTyping = (isTyping: boolean) => {
    if (!activeConversationId) return;
    if (isTyping) {
      realtimeEngine.sendTypingStart(activeConversationId);
    } else {
      realtimeEngine.sendTypingStop(activeConversationId);
    }
  };

  // Privacy Settings
  const updatePrivacySettings = (updates: Partial<ChatPrivacySettings>) => {
    const updated = ChatStorage.updatePrivacySettings(currentUserId, updates);
    setPrivacySettings(updated);
  };

  // Universal Share Modal
  const openShareModal = (data: ShareData) => {
    setShareData(data);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setShareData(null);
  };

  const shareContentToConversations = async (conversationIds: string[], note?: string): Promise<void> => {
    if (!shareData) return;

    for (const convId of conversationIds) {
      const richCard: RichCardPayload = {
        type: shareData.type,
        id: shareData.id,
        title: shareData.title,
        subtitle: shareData.subtitle,
        thumbnail: shareData.thumbnail,
        url: window.location.origin + (shareData.type === 'reel' ? `/reels?reelId=${shareData.id}` : shareData.type === 'song' ? `/songs?songId=${shareData.id}` : shareData.type === 'ghat' ? `/ghats?ghatId=${shareData.id}` : `/planner?planId=${shareData.id}`),
        metadata: shareData.metadata
      };

      const sender: ReelUser = currentUser || DEFAULT_GUEST_USER;

      const msg: ChatMessage = {
        id: `msg_share_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        conversationId: convId,
        senderId: sender.id,
        senderName: sender.name,
        senderUsername: sender.username,
        senderAvatar: sender.avatarUrl,
        type: 'rich_card',
        text: note?.trim() || `साझा किया: ${shareData.title}`,
        richCard,
        status: 'delivered',
        readBy: { [sender.id]: Date.now() },
        deliveredTo: { [sender.id]: Date.now() },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      ChatStorage.saveMessage(msg);
      realtimeEngine.broadcast('new_message', msg, convId);
    }

    refreshConversations();
    closeShareModal();
  };

  // Call Engine Actions
  const startCall = async (targetUser: ReelUser, type: CallType) => {
    const caller = currentUser || DEFAULT_GUEST_USER;
    return webrtcCallEngine.startCall(caller, targetUser, type);
  };

  const acceptCall = async () => {
    await webrtcCallEngine.acceptCall();
  };

  const endCall = () => {
    webrtcCallEngine.endCall();
  };

  const toggleCallAudio = () => {
    const enabled = webrtcCallEngine.toggleAudio();
    setIsAudioMuted(!enabled);
  };

  const toggleCallVideo = () => {
    const enabled = webrtcCallEngine.toggleVideo();
    setIsVideoOff(!enabled);
  };

  return (
    <ChatContext.Provider
      value={{
        isConnectOpen,
        openConnect,
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
        shareModalOpen,
        shareData,
        openShareModal,
        closeShareModal,
        shareContentToConversations,
        activeCall,
        localStream,
        remoteStream,
        isAudioMuted,
        isVideoOff,
        startCall,
        acceptCall,
        endCall,
        toggleCallAudio,
        toggleCallVideo
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
