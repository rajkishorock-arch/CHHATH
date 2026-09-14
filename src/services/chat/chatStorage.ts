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
   * Initial Devotee Seed Data Generation
   */
  ensureInitialized(currentUserId?: string) {
    if (localStorage.getItem(KEYS.INITIALIZED)) return;

    const users = ReelsStorage.getUsers();
    const shardaTrust = users.find(u => u.username === '@sharda_trust') || users[0];
    const bihariVibes = users.find(u => u.username === '@bihari_vibes') || users[1];
    const adminUser = users.find(u => u.username === '@admin_chhath') || users[2];

    const meId = currentUserId || 'user_guest';

    // 1. Direct Chat with Sharda Trust
    const dmSharda: Conversation = {
      id: `conv_dm_${[meId, shardaTrust.id].sort().join('_')}`,
      type: 'direct',
      participantIds: [meId, shardaTrust.id],
      createdBy: shardaTrust.id,
      lastMessageAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      pinnedBy: [meId],
      mutedBy: {},
      isMessageRequest: false,
      requestStatus: 'accepted',
      theme: 'golden',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    const shardaMsgs: ChatMessage[] = [
      {
        id: 'msg_sd_1',
        conversationId: dmSharda.id,
        senderId: shardaTrust.id,
        senderName: shardaTrust.name,
        senderUsername: shardaTrust.username,
        senderAvatar: shardaTrust.avatarUrl,
        type: 'text',
        text: 'जय छठी मईया! 🙏 इस वर्ष छठ महापर्व पर शारदा सिन्हा जी के पावन अमर भजनों का संकलन जारी किया गया है।',
        status: 'read',
        readBy: { [meId]: new Date().toISOString() },
        deliveredTo: { [meId]: new Date().toISOString() },
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg_sd_2',
        conversationId: dmSharda.id,
        senderId: shardaTrust.id,
        senderName: shardaTrust.name,
        senderUsername: shardaTrust.username,
        senderAvatar: shardaTrust.avatarUrl,
        type: 'song',
        text: 'कांच ही बांस के बहंगिया — अमर पारंपरिक छठ गीत',
        metadata: {
          songId: 'song-1',
          songTitle: 'काँच ही बाँस के बहँगिया (Kanch Hi Baans Ke Bahangiya)',
          songSinger: 'शारदा सिन्हा (Sharda Sinha)',
          songThumbnail: getImageUrl('/images/daura_arghya.jpg')
        },
        status: 'read',
        readBy: { [meId]: new Date().toISOString() },
        deliveredTo: { [meId]: new Date().toISOString() },
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ];
    dmSharda.lastMessage = shardaMsgs[1];

    // 2. Direct Chat with Bihari Vibes (with Reel Card)
    const dmBihari: Conversation = {
      id: `conv_dm_${[meId, bihariVibes.id].sort().join('_')}`,
      type: 'direct',
      participantIds: [meId, bihariVibes.id],
      createdBy: bihariVibes.id,
      lastMessageAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      pinnedBy: [],
      mutedBy: {},
      isMessageRequest: false,
      requestStatus: 'accepted',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    const bihariMsgs: ChatMessage[] = [
      {
        id: 'msg_bv_1',
        conversationId: dmBihari.id,
        senderId: bihariVibes.id,
        senderName: bihariVibes.name,
        senderUsername: bihariVibes.username,
        senderAvatar: bihariVibes.avatarUrl,
        type: 'reel',
        text: 'दीघा पाटीपुल घाट की लाइव ड्रोन झलकियां देखिए!',
        metadata: {
          reelId: 'demo-reel-004',
          reelTitle: 'पटना दीघा घाट पर लाखों दीपों की अलौकिक गंगा आरती',
          reelThumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
          reelCreator: 'Bihari Vibes Official'
        },
        status: 'read',
        readBy: { [meId]: new Date().toISOString() },
        deliveredTo: { [meId]: new Date().toISOString() },
        reactions: { '❤️': [meId], '🙏': [bihariVibes.id] },
        createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      }
    ];
    dmBihari.lastMessage = bihariMsgs[0];

    // 3. Community Group: "पटना छठ संगम परिवार"
    const groupPatna: Conversation = {
      id: `conv_grp_patna_chhath_2026`,
      type: 'group',
      name: 'पटना छठ संगम परिवार 🪔',
      description: 'पटना दीघा, कलेक्ट्रेट व गांधी घाट पर अर्घ्य देने वाले श्रद्धालुओं का पावन समूह।',
      avatar: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=200&q=80',
      participantIds: [meId, shardaTrust.id, bihariVibes.id, adminUser.id],
      admins: [adminUser.id],
      createdBy: adminUser.id,
      lastMessageAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      pinnedBy: [meId],
      mutedBy: {},
      isMessageRequest: false,
      requestStatus: 'accepted',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    const groupMsgs: ChatMessage[] = [
      {
        id: 'msg_grp_1',
        conversationId: groupPatna.id,
        senderId: adminUser.id,
        senderName: adminUser.name,
        senderUsername: adminUser.username,
        senderAvatar: adminUser.avatarUrl,
        type: 'poll',
        text: 'कल संध्या अर्घ्य हेतु आप किस घाट पर प्रस्थान करेंगे?',
        metadata: {
          pollId: 'poll-1',
          pollQuestion: 'कल संध्या अर्घ्य हेतु आप किस घाट पर प्रस्थान करेंगे?',
          pollOptions: [
            { id: 'opt-1', text: 'दीघा पाटीपुल घाट 93', voterIds: [meId, bihariVibes.id] },
            { id: 'opt-2', text: 'गांधी घाट (एनआईटी पटना)', voterIds: [shardaTrust.id] },
            { id: 'opt-3', text: 'कलेक्ट्रेट एवं महेंद्रू घाट', voterIds: [] }
          ]
        },
        status: 'read',
        readBy: {},
        deliveredTo: {},
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ];
    groupPatna.lastMessage = groupMsgs[0];

    const allConvs = [groupPatna, dmSharda, dmBihari];
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(allConvs));
    localStorage.setItem(`${KEYS.MESSAGES_PREFIX}${dmSharda.id}`, JSON.stringify(shardaMsgs));
    localStorage.setItem(`${KEYS.MESSAGES_PREFIX}${dmBihari.id}`, JSON.stringify(bihariMsgs));
    localStorage.setItem(`${KEYS.MESSAGES_PREFIX}${groupPatna.id}`, JSON.stringify(groupMsgs));
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  }
};
