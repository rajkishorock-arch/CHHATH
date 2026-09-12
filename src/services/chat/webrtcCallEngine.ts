import { CallSession, CallType, CallStatus, ReelUser } from '../../types';
import { realtimeEngine } from './realtimeEngine';
import { ChatStorage } from './chatStorage';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

type CallStateChangeListener = (session: CallSession | null, localStream: MediaStream | null, remoteStream: MediaStream | null) => void;

class WebRTCCallEngine {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private currentCall: CallSession | null = null;
  private listeners: Set<CallStateChangeListener> = new Set();
  private ringtoneOscillator1: OscillatorNode | null = null;
  private ringtoneOscillator2: OscillatorNode | null = null;
  private ringtoneAudioContext: AudioContext | null = null;
  private callTimeoutTimer: any = null;

  constructor() {
    // Listen for realtime signaling events
    realtimeEngine.subscribe((event) => {
      this.handleSignalingEvent(event);
    });
  }

  public subscribe(listener: CallStateChangeListener): () => void {
    this.listeners.add(listener);
    // Initial notification
    listener(this.currentCall, this.localStream, this.remoteStream);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try {
        l(this.currentCall, this.localStream, this.remoteStream);
      } catch (err) {
        console.error('Call listener error', err);
      }
    });
  }

  // --- START A CALL (CALLER) ---
  public async startCall(
    caller: ReelUser,
    receiver: ReelUser,
    type: CallType
  ): Promise<{ success: boolean; error?: string }> {
    if (this.currentCall && this.currentCall.status !== 'ended') {
      return { success: false, error: 'कॉल पहले से सक्रिय है।' };
    }

    try {
      // 1. Get User Media
      const isVideo = type === 'video';
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo ? { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } : false
      });

      // 2. Initialize Peer Connection
      this.peerConnection = new RTCPeerConnection(RTC_CONFIG);
      this.remoteStream = new MediaStream();

      // Add local tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // Handle incoming remote tracks
      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
          this.remoteStream?.addTrack(track);
        });
        this.notify();
      };

      // Handle ICE Candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.currentCall) {
          realtimeEngine.broadcast('call_signal', {
            callId: this.currentCall.callId,
            signalType: 'ice_candidate',
            candidate: event.candidate
          }, undefined, receiver.id);
        }
      };

      // 3. Create Session Record
      const session: CallSession = {
        callId: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        callerId: caller.id,
        callerName: caller.name,
        callerAvatar: caller.avatarUrl,
        receiverId: receiver.id,
        type,
        status: 'ringing',
        startedAt: Date.now()
      };
      this.currentCall = session;

      // 4. Create & Send SDP Offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      realtimeEngine.broadcast('call_signal', {
        callId: session.callId,
        signalType: 'call_offer',
        callSession: session,
        offer
      }, undefined, receiver.id);

      // Start outgoing ringtone
      this.playRingtone();

      // 30 seconds timeout if receiver doesn't answer
      this.callTimeoutTimer = setTimeout(() => {
        if (this.currentCall && this.currentCall.status === 'ringing') {
          this.endCall('missed');
        }
      }, 30000);

      this.notify();
      return { success: true };
    } catch (err: any) {
      this.cleanup();
      return { 
        success: false, 
        error: err.name === 'NotAllowedError' 
          ? 'माइक्रोफोन / कैमरा अनुमति अस्वीकृत है।' 
          : `कॉल प्रारंभ करने में त्रुटि: ${err.message}` 
      };
    }
  }

  // --- ACCEPT INCOMING CALL (RECEIVER) ---
  public async acceptCall(): Promise<{ success: boolean; error?: string }> {
    if (!this.currentCall || !this.currentCall.callId) {
      return { success: false, error: 'कोई सक्रिय कॉल नहीं मिली।' };
    }

    try {
      this.stopRingtone();
      if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);

      const isVideo = this.currentCall.type === 'video';
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo ? { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } : false
      });

      this.peerConnection = new RTCPeerConnection(RTC_CONFIG);
      this.remoteStream = new MediaStream();

      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
          this.remoteStream?.addTrack(track);
        });
        this.notify();
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.currentCall) {
          realtimeEngine.broadcast('call_signal', {
            callId: this.currentCall.callId,
            signalType: 'ice_candidate',
            candidate: event.candidate
          }, undefined, this.currentCall.callerId);
        }
      };

      // Create answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.currentCall.status = 'connected';

      realtimeEngine.broadcast('call_signal', {
        callId: this.currentCall.callId,
        signalType: 'call_answer',
        answer
      }, undefined, this.currentCall.callerId);

      this.notify();
      return { success: true };
    } catch (err: any) {
      this.endCall('declined');
      return { success: false, error: 'कॉल स्वीकार करने में त्रुटि।' };
    }
  }

  // --- DECLINE OR END CALL ---
  public endCall(status: CallStatus = 'ended') {
    this.stopRingtone();
    if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);

    if (this.currentCall) {
      this.currentCall.status = status;
      this.currentCall.endedAt = Date.now();
      this.currentCall.durationSeconds = Math.round((this.currentCall.endedAt - this.currentCall.startedAt) / 1000);

      // Save call session to history
      ChatStorage.saveCallSession(this.currentCall);

      // Signal remote party
      realtimeEngine.broadcast('call_signal', {
        callId: this.currentCall.callId,
        signalType: 'call_ended',
        status
      });
    }

    this.cleanup();
  }

  // --- MEDIA TOGGLES ---
  public toggleAudio(): boolean {
    if (!this.localStream) return false;
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.notify();
      return audioTrack.enabled;
    }
    return false;
  }

  public toggleVideo(): boolean {
    if (!this.localStream) return false;
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.notify();
      return videoTrack.enabled;
    }
    return false;
  }

  // --- HANDLE INCOMING SIGNALS ---
  private async handleSignalingEvent(event: any) {
    if (event.type !== 'call_signal' || !event.data) return;
    const { signalType, callId, callSession, offer, answer, candidate, status } = event.data;

    // 1. Incoming Call Offer
    if (signalType === 'call_offer' && callSession) {
      // If already on another call, decline immediately
      if (this.currentCall && this.currentCall.status !== 'ended') {
        realtimeEngine.broadcast('call_signal', {
          callId,
          signalType: 'call_ended',
          status: 'busy'
        }, undefined, callSession.callerId);
        return;
      }

      this.currentCall = callSession;
      this.playRingtone();
      this.notify();

      // 30 seconds ringing timeout
      this.callTimeoutTimer = setTimeout(() => {
        if (this.currentCall && this.currentCall.status === 'ringing') {
          this.endCall('missed');
        }
      }, 30000);

      // Set remote offer if peerConnection is ready
      if (offer && this.peerConnection) {
        try {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        } catch {}
      }
    }

    // 2. Incoming Call Answer (For Caller)
    else if (signalType === 'call_answer' && answer && this.peerConnection) {
      this.stopRingtone();
      if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);
      try {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        if (this.currentCall) {
          this.currentCall.status = 'connected';
          this.notify();
        }
      } catch (err) {
        console.error('Failed to set remote description answer', err);
      }
    }

    // 3. ICE Candidate
    else if (signalType === 'ice_candidate' && candidate && this.peerConnection) {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {}
    }

    // 4. Call Ended / Declined / Busy
    else if (signalType === 'call_ended') {
      if (this.currentCall && this.currentCall.callId === callId) {
        this.stopRingtone();
        this.currentCall.status = status || 'ended';
        this.cleanup();
      }
    }
  }

  // --- RINGTONE SYNTHESIS VIA WEB AUDIO API ---
  private playRingtone() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ringtoneAudioContext = new AudioCtx();

      // Dual tone frequencies (440Hz + 480Hz telephone standard)
      this.ringtoneOscillator1 = this.ringtoneAudioContext.createOscillator();
      this.ringtoneOscillator2 = this.ringtoneAudioContext.createOscillator();
      const gainNode = this.ringtoneAudioContext.createGain();

      this.ringtoneOscillator1.frequency.setValueAtTime(440, this.ringtoneAudioContext.currentTime);
      this.ringtoneOscillator2.frequency.setValueAtTime(480, this.ringtoneAudioContext.currentTime);

      gainNode.gain.setValueAtTime(0.08, this.ringtoneAudioContext.currentTime);

      this.ringtoneOscillator1.connect(gainNode);
      this.ringtoneOscillator2.connect(gainNode);
      gainNode.connect(this.ringtoneAudioContext.destination);

      this.ringtoneOscillator1.start();
      this.ringtoneOscillator2.start();
    } catch {}
  }

  private stopRingtone() {
    try {
      if (this.ringtoneOscillator1) {
        this.ringtoneOscillator1.stop();
        this.ringtoneOscillator1.disconnect();
        this.ringtoneOscillator1 = null;
      }
      if (this.ringtoneOscillator2) {
        this.ringtoneOscillator2.stop();
        this.ringtoneOscillator2.disconnect();
        this.ringtoneOscillator2 = null;
      }
      if (this.ringtoneAudioContext) {
        this.ringtoneAudioContext.close();
        this.ringtoneAudioContext = null;
      }
    } catch {}
  }

  private cleanup() {
    this.stopRingtone();
    if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);

    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(t => t.stop());
      this.remoteStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.notify();
  }
}

export const webrtcCallEngine = new WebRTCCallEngine();
