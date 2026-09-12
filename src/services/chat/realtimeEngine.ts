import { ChatMessage, CallSession } from '../../types';
import { ChatStorage } from './chatStorage';

export type RealtimeEventType = 
  | 'new_message'
  | 'message_status_update'
  | 'message_reaction'
  | 'typing_start'
  | 'typing_stop'
  | 'presence_heartbeat'
  | 'poll_voted'
  | 'call_signal'
  | 'call_ended';

export interface RealtimeEventPayload {
  type: RealtimeEventType;
  senderId: string;
  conversationId?: string;
  targetUserId?: string;
  data: any;
  timestamp: number;
}

type RealtimeListener = (payload: RealtimeEventPayload) => void;

class RealtimeEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<RealtimeListener> = new Set();
  private typingTimers: Map<string, any> = new Map(); // `${convId}_${userId}` -> timer
  private activeTypingUsers: Map<string, Set<string>> = new Map(); // convId -> Set of userIds
  private onlineUsers: Map<string, number> = new Map(); // userId -> lastSeen timestamp
  private heartbeatInterval: any = null;
  private currentUserId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('chhath_connect_realtime');
        this.channel.onmessage = (event) => {
          this.handleIncomingEvent(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported in this environment, using fallback');
      }

      // Storage event listener fallback for older browsers
      window.addEventListener('storage', (e) => {
        if (e.key === 'chhath_connect_event_dispatch' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.handleIncomingEvent(parsed);
          } catch {}
        }
      });
    }
  }

  public init(userId: string) {
    this.currentUserId = userId;
    this.startPresenceHeartbeat();
  }

  public subscribe(listener: RealtimeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(type: RealtimeEventType, data: any, conversationId?: string, targetUserId?: string) {
    if (!this.currentUserId) return;

    const payload: RealtimeEventPayload = {
      type,
      senderId: this.currentUserId,
      conversationId,
      targetUserId,
      data,
      timestamp: Date.now()
    };

    // Broadcast across tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch {}
    }

    // Local dispatch
    try {
      localStorage.setItem('chhath_connect_event_dispatch', JSON.stringify(payload));
    } catch {}

    // Trigger local listeners
    this.handleIncomingEvent(payload);
  }

  private handleIncomingEvent(payload: RealtimeEventPayload) {
    if (!payload || !payload.type) return;

    // Handle internal tracking for typing & presence
    if (payload.type === 'typing_start' && payload.conversationId) {
      this.addTypingUser(payload.conversationId, payload.senderId);
    } else if (payload.type === 'typing_stop' && payload.conversationId) {
      this.removeTypingUser(payload.conversationId, payload.senderId);
    } else if (payload.type === 'presence_heartbeat') {
      this.onlineUsers.set(payload.senderId, payload.timestamp);
    }

    // Notify all active subscribers
    this.listeners.forEach(listener => {
      try {
        listener(payload);
      } catch (err) {
        console.error('Error in realtime listener', err);
      }
    });
  }

  // --- TYPING INDICATORS ---
  public sendTypingStart(conversationId: string) {
    this.broadcast('typing_start', {}, conversationId);
  }

  public sendTypingStop(conversationId: string) {
    this.broadcast('typing_stop', {}, conversationId);
  }

  private addTypingUser(convId: string, userId: string) {
    const key = `${convId}_${userId}`;
    if (this.typingTimers.has(key)) {
      clearTimeout(this.typingTimers.get(key));
    }

    let set = this.activeTypingUsers.get(convId);
    if (!set) {
      set = new Set();
      this.activeTypingUsers.set(convId, set);
    }
    set.add(userId);

    // Auto expire typing indicator after 3 seconds
    const timer = setTimeout(() => {
      this.removeTypingUser(convId, userId);
    }, 3000);
    this.typingTimers.set(key, timer);
  }

  private removeTypingUser(convId: string, userId: string) {
    const set = this.activeTypingUsers.get(convId);
    if (set) {
      set.delete(userId);
      if (set.size === 0) {
        this.activeTypingUsers.delete(convId);
      }
    }
  }

  public getTypingUsers(convId: string): string[] {
    const set = this.activeTypingUsers.get(convId);
    if (!set) return [];
    // Don't show typing for self
    return Array.from(set).filter(id => id !== this.currentUserId);
  }

  // --- PRESENCE & ONLINE STATUS ---
  private startPresenceHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (!this.currentUserId) return;

    // Check privacy setting: if user disabled activityStatus, do not broadcast
    const privacy = ChatStorage.getPrivacySettings(this.currentUserId);
    if (!privacy.activityStatus) return;

    // Initial heartbeat
    this.broadcast('presence_heartbeat', {});

    this.heartbeatInterval = setInterval(() => {
      const p = ChatStorage.getPrivacySettings(this.currentUserId!);
      if (p.activityStatus) {
        this.broadcast('presence_heartbeat', {});
      }
    }, 25000);
  }

  public isUserOnline(userId: string): boolean {
    // Current user is always online
    if (userId === this.currentUserId) return true;

    // Check privacy setting of the target user
    const privacy = ChatStorage.getPrivacySettings(userId);
    if (!privacy.activityStatus) return false;

    const lastSeen = this.onlineUsers.get(userId);
    if (!lastSeen) return false;
    return Date.now() - lastSeen < 60000; // within last 60 seconds
  }

  public cleanup() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.channel) {
      try {
        this.channel.close();
      } catch {}
    }
  }
}

export const realtimeEngine = new RealtimeEngine();
