import { getFirebaseApp, getFirebaseFirestore } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  type Unsubscribe 
} from 'firebase/firestore';
import { ReelUser, Conversation, ChatMessage } from '../../types';

export const FirestoreChatService = {
  /**
   * Fetch only REAL registered devotees from Google Cloud Firestore
   * (Zero dummy / fake accounts!)
   */
  async getRealDevotees(currentUserId: string): Promise<ReelUser[]> {
    const db = getFirebaseFirestore();
    const realUsers: ReelUser[] = [];
    const seenIds = new Set<string>();

    if (db) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const uid = docSnap.id;
          if (uid !== currentUserId && !seenIds.has(uid)) {
            seenIds.add(uid);
            realUsers.push({
              id: uid,
              user_id: uid,
              name: data.name || 'छठ श्रद्धालु',
              username: data.username || `@devotee_${uid.slice(0, 5)}`,
              email: data.email || '',
              avatarUrl: data.avatarUrl || '',
              bio: data.bio || 'जय छठी मइया 🙏',
              city: data.city || 'बिहार',
              state: data.state || 'बिहार',
              country: 'India',
              language: 'hi',
              role: 'user',
              followersCount: 0,
              followingCount: 0,
              totalLikesCount: 0,
              reelsCount: 0,
              verified: Boolean(data.verified),
              interests: [],
              onboardingCompleted: true,
              createdAt: data.createdAt || new Date().toISOString()
            });
          }
        });
      } catch (err) {
        console.warn('[FirestoreChat] Fetching devotees notice:', err);
      }
    }

    // Also check Cloud Bin for cross-environment safety
    try {
      const res = await fetch('https://extendsclass.com/api/json-storage/bin/eeeaedd', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        const usersMap = json?.users || {};
        for (const uid of Object.keys(usersMap)) {
          if (uid !== currentUserId && !seenIds.has(uid)) {
            const u = usersMap[uid];
            seenIds.add(uid);
            realUsers.push({
              id: uid,
              user_id: uid,
              name: u.name || 'छठ श्रद्धालु',
              username: u.username || `@devotee_${uid.slice(0, 5)}`,
              email: u.email || '',
              avatarUrl: u.avatarUrl || '',
              bio: u.bio || 'जय छठी मइया 🙏',
              city: u.city || 'बिहार',
              state: u.state || 'बिहार',
              country: 'India',
              language: 'hi',
              role: 'user',
              followersCount: 0,
              followingCount: 0,
              totalLikesCount: 0,
              reelsCount: 0,
              verified: false,
              interests: [],
              onboardingCompleted: true,
              createdAt: u.updatedAt || new Date().toISOString()
            });
          }
        }
      }
    } catch {}

    return realUsers;
  },

  /**
   * Get or create a direct 1-to-1 conversation document in Firestore
   */
  async getOrCreateConversation(userA: ReelUser, userB: ReelUser): Promise<Conversation> {
    const convId = `conv_dm_${[userA.id, userB.id].sort().join('_')}`;
    const db = getFirebaseFirestore();

    const conversationData: Conversation = {
      id: convId,
      type: 'direct',
      participantIds: [userA.id, userB.id],
      createdBy: userA.id,
      lastMessageAt: new Date().toISOString(),
      pinnedBy: [],
      mutedBy: {},
      isMessageRequest: false,
      requestStatus: 'accepted',
      theme: 'golden',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      try {
        const convRef = doc(db, 'conversations', convId);
        const existing = await getDoc(convRef);
        if (existing.exists()) {
          return { ...conversationData, ...existing.data() } as Conversation;
        } else {
          await setDoc(convRef, conversationData);
        }
      } catch (err) {
        console.warn('[FirestoreChat] Conv init notice:', err);
      }
    }

    return conversationData;
  },

  /**
   * Listen to real-time conversations for a user
   */
  listenToConversations(userId: string, callback: (conversations: Conversation[]) => void): Unsubscribe {
    const db = getFirebaseFirestore();
    if (!db || !userId) {
      callback([]);
      return () => {};
    }

    try {
      const q = query(
        collection(db, 'conversations'),
        where('participantIds', 'array-contains', userId)
      );

      return onSnapshot(q, (snapshot) => {
        const list: Conversation[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Conversation);
        });
        list.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        callback(list);
      }, (err) => {
        console.warn('[FirestoreChat] Conversations listener notice:', err);
      });
    } catch (err) {
      console.warn('[FirestoreChat] Listener setup error:', err);
      return () => {};
    }
  },

  /**
   * Listen to real-time messages in a specific conversation
   */
  listenToMessages(convId: string, callback: (messages: ChatMessage[]) => void): Unsubscribe {
    const db = getFirebaseFirestore();
    if (!db || !convId) {
      callback([]);
      return () => {};
    }

    try {
      const msgsRef = collection(db, 'conversations', convId, 'messages');
      const q = query(msgsRef, orderBy('createdAt', 'asc'));

      return onSnapshot(q, (snapshot) => {
        const list: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
        });
        callback(list);
      }, (err) => {
        console.warn('[FirestoreChat] Messages listener notice:', err);
      });
    } catch (err) {
      console.warn('[FirestoreChat] Messages listener error:', err);
      return () => {};
    }
  },

  /**
   * Send a real message to Google Cloud Firestore
   */
  async sendMessage(convId: string, payload: {
    senderId: string;
    senderName: string;
    senderUsername?: string;
    senderAvatar?: string;
    text: string;
    type?: 'text' | 'image' | 'voice';
  }): Promise<ChatMessage> {
    const db = getFirebaseFirestore();
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: convId,
      senderId: payload.senderId,
      senderName: payload.senderName,
      senderUsername: payload.senderUsername || '',
      senderAvatar: payload.senderAvatar || '',
      text: payload.text,
      type: payload.type || 'text',
      status: 'delivered',
      readBy: { [payload.senderId]: Date.now() },
      deliveredTo: { [payload.senderId]: Date.now() },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      try {
        const msgsRef = collection(db, 'conversations', convId, 'messages');
        await addDoc(msgsRef, newMsg);

        // Update last message on conversation
        const convRef = doc(db, 'conversations', convId);
        await setDoc(convRef, {
          lastMessage: payload.text,
          lastMessageAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('[FirestoreChat] Send message notice:', err);
      }
    }

    return newMsg;
  }
};
