import { 
  ChatMessage, 
  Conversation, 
  ChatPrivacySettings, 
  CallSession, 
  MessageStatus,
  ReelUser
} from '../../types';
import { ReelsStorage } from '../reelsStorage';
import { getImageUrl } from '../../utils/imageUtils';

const KEYS = {
  CONVERSATIONS: 'chhath_connect_conversations',
  MESSAGES_PREFIX: 'chhath_connect_msgs_',
  PRIVACY_PREFIX: 'chhath_connect_privacy_',
  RESTRICTED_PREFIX: 'chhath_connect_restricted_',
  CALLS_PREFIX: 'chhath_connect_calls_',
  INITIALIZED: 'chhath_connect_seed_v1'
};

const DEFAULT_PRIVACY: ChatPrivacySettings = {
  whoCanMessageMe: 'everyone',
  whoCanAddToGroups: 'everyone',
  whoCanCallMe: 'everyone',
  activityStatus: true
};

export const ChatStorage = {
  /**
   * Get all conversations involving the user
   */
  getConversations(userId: string): Conversation[] {
    this.ensureInitialized(userId);
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    if (!raw) return [];
    try {
      const all: Conversation[] = JSON.parse(raw);
      return all
        .filter(c => c.participantIds.includes(userId))
        .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    } catch {
      return [];
    }
  },

  /**
   * Get a single conversation by ID
   */
  getConversationById(convId: string): Conversation | null {
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    if (!raw) return null;
    try {
      const all: Conversation[] = JSON.parse(raw);
      return all.find(c => c.id === convId) || null;
    } catch {
      return null;
    }
  },

  /**
   * Get or create a direct conversation between two users
   */
  getOrCreateDirectConversation(userAId: string, userBId: string, asRequest: boolean = false): Conversation {
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    const all: Conversation[] = raw ? JSON.parse(raw) : [];

    const existing = all.find(
      c => c.type === 'direct' && 
      c.participantIds.includes(userAId) && 
      c.participantIds.includes(userBId)
    );

    if (existing) return existing;

    const userB = ReelsStorage.findUserById(userBId);
    const userA = ReelsStorage.findUserById(userAId);

    // Check target's privacy settings to determine if it should be a message request
    const bPrivacy = this.getPrivacySettings(userBId);
    const isBFollowingA = ReelsStorage.isFollowing(userBId, userAId);
    
    let isRequest = asRequest;
    if (bPrivacy.whoCanMessageMe === 'following' && !isBFollowingA) {
      isRequest = true;
    }

    const newConv: Conversation = {
      id: `conv_dm_${[userAId, userBId].sort().join('_')}`,
      type: 'direct',
      participantIds: [userAId, userBId],
      createdBy: userAId,
      lastMessageAt: new Date().toISOString(),
      pinnedBy: [],
      mutedBy: {},
      isMessageRequest: isRequest,
      requestStatus: isRequest ? 'pending' : 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.unshift(newConv);
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(all));
    return newConv;
  },

  /**
   * Create a group conversation
   */
  createGroupConversation(
    creatorId: string,
    name: string,
    description: string,
    participantIds: string[],
    avatar?: string
  ): Conversation {
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    const all: Conversation[] = raw ? JSON.parse(raw) : [];

    const uniqueParticipants = Array.from(new Set([creatorId, ...participantIds]));

    const newGroup: Conversation = {
      id: `conv_grp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'group',
      name: name.trim(),
      description: description.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      participantIds: uniqueParticipants,
      admins: [creatorId],
      createdBy: creatorId,
      lastMessageAt: new Date().toISOString(),
      pinnedBy: [],
      mutedBy: {},
      isMessageRequest: false,
      requestStatus: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.unshift(newGroup);
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(all));

    // Add initial system message
    const creator = ReelsStorage.findUserById(creatorId);
    const sysMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      conversationId: newGroup.id,
      senderId: 'system',
      senderName: 'सिस्टम',
      senderUsername: '@system',
      senderAvatar: '',
      type: 'system',
      text: `${creator?.name || 'सदस्य'} ने समूह "${name}" बनाया।`,
      status: 'read',
      readBy: {},
      deliveredTo: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.saveMessage(sysMsg);

    return newGroup;
  },

  /**
   * Update conversation metadata (name, avatar, pinned, muted, theme, disappearing)
   */
  updateConversation(convId: string, updates: Partial<Conversation>): Conversation | null {
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    if (!raw) return null;
    try {
      const all: Conversation[] = JSON.parse(raw);
      const idx = all.findIndex(c => c.id === convId);
      if (idx === -1) return null;

      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(all));
      return all[idx];
    } catch {
      return null;
    }
  },

  /**
   * Toggle Pin conversation
   */
  togglePin(convId: string, userId: string): boolean {
    const conv = this.getConversationById(convId);
    if (!conv) return false;
    const isPinned = conv.pinnedBy.includes(userId);
    const updated = isPinned 
      ? conv.pinnedBy.filter(id => id !== userId) 
      : [...conv.pinnedBy, userId];
    this.updateConversation(convId, { pinnedBy: updated });
    return !isPinned;
  },

  /**
   * Toggle Mute conversation
   */
  toggleMute(convId: string, userId: string, durationMs: number = 24 * 60 * 60 * 1000): boolean {
    const conv = this.getConversationById(convId);
    if (!conv) return false;
    const isMuted = Boolean(conv.mutedBy?.[userId] && conv.mutedBy[userId] > Date.now());
    const map = { ...(conv.mutedBy || {}) };
    if (isMuted) {
      delete map[userId];
    } else {
      map[userId] = Date.now() + durationMs;
    }
    this.updateConversation(convId, { mutedBy: map });
    return !isMuted;
  },

  /**
   * Accept a message request
   */
  acceptMessageRequest(convId: string): boolean {
    const updated = this.updateConversation(convId, {
      isMessageRequest: false,
      requestStatus: 'accepted'
    });
    return Boolean(updated);
  },

  /**
   * Reject / delete a message request
   */
  rejectMessageRequest(convId: string, userId: string): boolean {
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    if (!raw) return false;
    try {
      const all: Conversation[] = JSON.parse(raw);
      const filtered = all.filter(c => c.id !== convId);
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(filtered));
      localStorage.removeItem(`${KEYS.MESSAGES_PREFIX}${convId}`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get messages for a conversation
   */
  getMessages(convId: string, limit: number = 50): ChatMessage[] {
    const raw = localStorage.getItem(`${KEYS.MESSAGES_PREFIX}${convId}`);
    if (!raw) return [];
    try {
      const msgs: ChatMessage[] = JSON.parse(raw);
      return msgs.slice(-limit);
    } catch {
      return [];
    }
  },

  /**
   * Save a new message into conversation
   */
  saveMessage(message: ChatMessage): ChatMessage {
    const key = `${KEYS.MESSAGES_PREFIX}${message.conversationId}`;
    const raw = localStorage.getItem(key);
    const msgs: ChatMessage[] = raw ? JSON.parse(raw) : [];

    // Avoid duplicates by ID
    const existingIdx = msgs.findIndex(m => m.id === message.id);
    if (existingIdx >= 0) {
      msgs[existingIdx] = message;
    } else {
      msgs.push(message);
    }

    localStorage.setItem(key, JSON.stringify(msgs));

    // Update conversation last message
    this.updateConversation(message.conversationId, {
      lastMessage: message,
      lastMessageAt: message.createdAt
    });

    return message;
  },

  /**
   * Update delivery / read status of message
   */
  updateMessageStatus(messageId: string, convId: string, status: MessageStatus, userId?: string): boolean {
    const key = `${KEYS.MESSAGES_PREFIX}${convId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    try {
      const msgs: ChatMessage[] = JSON.parse(raw);
      const target = msgs.find(m => m.id === messageId);
      if (!target) return false;

      target.status = status;
      if (userId) {
        if (status === 'delivered') {
          target.deliveredTo = { ...(target.deliveredTo || {}), [userId]: new Date().toISOString() };
        } else if (status === 'read') {
          target.readBy = { ...(target.readBy || {}), [userId]: new Date().toISOString() };
        }
      }

      localStorage.setItem(key, JSON.stringify(msgs));

      // If this was the last message, update in conversation record
      const conv = this.getConversationById(convId);
      if (conv?.lastMessage?.id === messageId) {
        this.updateConversation(convId, { lastMessage: target });
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get unread messages count across all conversations
   */
  getUnreadCount(userId: string): number {
    const convs = this.getConversations(userId);
    let count = 0;
    convs.forEach(c => {
      const msgs = this.getMessages(c.id, 30);
      msgs.forEach(m => {
        if (m.senderId !== userId && (!m.readBy || !m.readBy[userId])) {
          count++;
        }
      });
    });
    return count;
  },

  /**
   * Mark all unread messages in conversation as read by a user
   */
  markConversationAsRead(convId: string, userId: string): number {
    const key = `${KEYS.MESSAGES_PREFIX}${convId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return 0;

    try {
      const msgs: ChatMessage[] = JSON.parse(raw);
      let markedCount = 0;
      const now = Date.now();

      msgs.forEach(m => {
        if (m.senderId !== userId && (!m.readBy || !m.readBy[userId])) {
          m.readBy = { ...(m.readBy || {}), [userId]: now };
          m.status = 'read';
          markedCount++;
        }
      });

      if (markedCount > 0) {
        localStorage.setItem(key, JSON.stringify(msgs));
        const last = msgs[msgs.length - 1];
        if (last) {
          this.updateConversation(convId, { lastMessage: last });
        }
      }

      return markedCount;
    } catch {
      return 0;
    }
  },

  markAsRead(convId: string, userId: string): number {
    return this.markConversationAsRead(convId, userId);
  },

  /**
   * Edit own recent text message
   */
  editMessage(messageId: string, convId: string, newText: string): boolean {
    return this.updateMessage(messageId, convId, { text: newText, isEdited: true });
  },

  /**
   * Update message
   */
  updateMessage(messageId: string, convId: string, updates: Partial<ChatMessage>): boolean {
    const key = `${KEYS.MESSAGES_PREFIX}${convId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    try {
      const msgs: ChatMessage[] = JSON.parse(raw);
      const target = msgs.find(m => m.id === messageId);
      if (!target) return false;

      Object.assign(target, updates, { updatedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(msgs));

      const conv = this.getConversationById(convId);
      if (conv?.lastMessage?.id === messageId) {
        this.updateConversation(convId, { lastMessage: target });
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Delete message (Delete for me vs Delete for everyone)
   */
  deleteMessage(messageId: string, convId: string, userIdOrForEveryone: string | boolean, forEveryone: boolean = false): boolean {
    const key = `${KEYS.MESSAGES_PREFIX}${convId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    try {
      const msgs: ChatMessage[] = JSON.parse(raw);
      const target = msgs.find(m => m.id === messageId);
      if (!target) return false;

      const isForEveryone = typeof userIdOrForEveryone === 'boolean' ? userIdOrForEveryone : forEveryone;
      const userId = typeof userIdOrForEveryone === 'string' ? userIdOrForEveryone : '';

      if (isForEveryone) {
        target.isDeletedForEveryone = true;
        target.text = 'यह संदेश मिटा दिया गया है (This message was deleted)';
        target.mediaUrl = undefined;
        target.richCard = undefined;
      } else if (userId) {
        const deletedFor = target.deletedFor || [];
        if (!deletedFor.includes(userId)) {
          deletedFor.push(userId);
        }
        target.deletedFor = deletedFor;
      }

      localStorage.setItem(key, JSON.stringify(msgs));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Toggle emoji reaction on a message
   */
  toggleReaction(messageId: string, convId: string, userId: string, emoji: string): boolean {
    const key = `${KEYS.MESSAGES_PREFIX}${convId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    try {
      const msgs: ChatMessage[] = JSON.parse(raw);
      const target = msgs.find(m => m.id === messageId);
      if (!target) return false;

      const reactions = target.reactions || {};
      const currentList = reactions[emoji] || [];

      if (currentList.includes(userId)) {
        // Remove reaction
        reactions[emoji] = currentList.filter(id => id !== userId);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        // Remove other reactions from this user to avoid duplicates
        Object.keys(reactions).forEach(k => {
          reactions[k] = reactions[k].filter(id => id !== userId);
          if (reactions[k].length === 0) delete reactions[k];
        });
        reactions[emoji] = [...(reactions[emoji] || []), userId];
      }

      target.reactions = reactions;
      localStorage.setItem(key, JSON.stringify(msgs));
      return true;
    } catch {
      return false;
    }
  },

  addReaction(messageId: string, convId: string, userId: string, emoji: string): boolean {
    return this.toggleReaction(messageId, convId, userId, emoji);
  },

  /**
   * Clear messages in a conversation
   */
  clearMessages(convId: string): boolean {
    localStorage.removeItem(`${KEYS.MESSAGES_PREFIX}${convId}`);
    this.updateConversation(convId, { lastMessage: undefined, lastMessageAt: new Date().toISOString() });
    return true;
  },

  /**
   * Delete conversation
   */
  deleteConversation(convId: string, userId?: string): boolean {
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    if (!raw) return false;
    try {
      const all: Conversation[] = JSON.parse(raw);
      const filtered = all.filter(c => c.id !== convId);
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(filtered));
      localStorage.removeItem(`${KEYS.MESSAGES_PREFIX}${convId}`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Vote on a Chat Poll
   */
  votePoll(messageId: string, convId: string, pollIdOrOptionId: string, optionIdOrUserId: string, maybeUserId?: string): boolean {
    const key = `${KEYS.MESSAGES_PREFIX}${convId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    try {
      const msgs: ChatMessage[] = JSON.parse(raw);
      const target = msgs.find(m => m.id === messageId);
      if (!target) return false;

      const optionId = maybeUserId ? optionIdOrUserId : pollIdOrOptionId;
      const userId = maybeUserId || optionIdOrUserId;

      // Check in metadata.pollOptions or richCard.metadata.poll.options
      const options = target.metadata?.pollOptions || target.richCard?.metadata?.poll?.options;
      if (!options || !Array.isArray(options)) return false;

      options.forEach((opt: any) => {
        // Remove prior vote to enforce 1 vote per devotee
        if (opt.votes && Array.isArray(opt.votes)) {
          opt.votes = opt.votes.filter((id: string) => id !== userId);
          if (opt.id === optionId) {
            opt.votes.push(userId);
          }
        }
        if (opt.voterIds && Array.isArray(opt.voterIds)) {
          opt.voterIds = opt.voterIds.filter((id: string) => id !== userId);
          if (opt.id === optionId) {
            opt.voterIds.push(userId);
          }
        }
      });

      localStorage.setItem(key, JSON.stringify(msgs));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Privacy settings per user
   */
  getPrivacySettings(userId: string): ChatPrivacySettings {
    const raw = localStorage.getItem(`${KEYS.PRIVACY_PREFIX}${userId}`);
    if (!raw) return DEFAULT_PRIVACY;
    try {
      return { ...DEFAULT_PRIVACY, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PRIVACY;
    }
  },

  updatePrivacySettings(userId: string, settings: Partial<ChatPrivacySettings>): ChatPrivacySettings {
    const current = this.getPrivacySettings(userId);
    const updated = { ...current, ...settings };
    localStorage.setItem(`${KEYS.PRIVACY_PREFIX}${userId}`, JSON.stringify(updated));
    return updated;
  },

  /**
   * Call Session History
   */
  getCallHistory(userId: string): CallSession[] {
    const raw = localStorage.getItem(`${KEYS.CALLS_PREFIX}${userId}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveCallSession(call: CallSession) {
    const forCaller = this.getCallHistory(call.callerId);
    forCaller.unshift(call);
    localStorage.setItem(`${KEYS.CALLS_PREFIX}${call.callerId}`, JSON.stringify(forCaller.slice(0, 50)));

    const forReceiver = this.getCallHistory(call.receiverId);
    forReceiver.unshift(call);
    localStorage.setItem(`${KEYS.CALLS_PREFIX}${call.receiverId}`, JSON.stringify(forReceiver.slice(0, 50)));
  },

  /**
   * Initial Devotee Seed Data - Clean and Empty (Zero dummy / fake data)
   */
  ensureInitialized(_currentUserId?: string) {
    // Clear out any legacy dummy conversations
    const raw = localStorage.getItem(KEYS.CONVERSATIONS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter((c: any) => 
            c.id && 
            !c.id.includes('sharda') && 
            !c.id.includes('bihari') && 
            !c.id.includes('conv_grp_patna')
          );
          localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(clean));
        }
      } catch {}
    } else {
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify([]));
    }
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  }
};
