import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Sparkles,
  Volume2,
  Users
} from 'lucide-react';

export const CallScreenModal: React.FC = () => {
  const { 
    activeCall, 
    localStream, 
    remoteStream, 
    isAudioMuted, 
    isVideoOff, 
    acceptCall, 
    endCall, 
    toggleCallAudio, 
    toggleCallVideo 
  } = useChat();

  const { currentUser } = useAuth();
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Attach media streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, activeCall?.status]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, activeCall?.status]);

  // Call timer when connected
  useEffect(() => {
    let interval: any = null;
    if (activeCall && activeCall.status === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall?.status]);

  if (!activeCall || activeCall.status === 'ended' || activeCall.status === 'declined' || activeCall.status === 'missed') {
    return null;
  }

  const isIncoming = activeCall.receiverId === currentUser?.id && activeCall.status === 'ringing';
  const isOutgoing = activeCall.callerId === currentUser?.id && activeCall.status === 'ringing';
  const isConnected = activeCall.status === 'connected';
  const isVideo = activeCall.type === 'video';

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const displayName = isIncoming ? activeCall.callerName : (currentUser?.id === activeCall.callerId ? 'छठ व्रती' : activeCall.callerName);
  const displayAvatar = isIncoming ? activeCall.callerAvatar : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl h-[85vh] max-h-[720px] bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Top Header info */}
        <div className="pt-6 pb-2 px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <span className="inline-flex p-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
              छठ कनेक्ट {isVideo ? '• वीडियो कॉल' : '• वॉयस कॉल'}
            </span>
          </div>

          <div className="text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
            {isConnected ? formatTime(callDuration) : isIncoming ? 'इनकमिंग कॉल...' : 'कॉलिंग...'}
          </div>
        </div>

        {/* Center Content Body */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-6 text-center">
          
          {/* Video Feeds (if video call and connected) */}
          {isVideo && isConnected ? (
            <div className="absolute inset-0 w-full h-full bg-black">
              {/* Remote Video (Full) */}
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />

              {/* Local Video PiP in bottom-right */}
              <div className="absolute bottom-24 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-xl bg-slate-900">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                />
                {isVideoOff && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400">
                    <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                    कैमरा बंद
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Audio Call or Ringing State Screen */
            <div className="flex flex-col items-center z-10 max-w-sm">
              {/* Pulsing Avatar */}
              <div className="relative mb-6">
                <div className={`absolute -inset-4 rounded-full bg-amber-500/20 blur-xl ${isIncoming || isOutgoing ? 'animate-pulse' : ''}`} />
                <div className="relative w-28 h-28 rounded-full border-4 border-amber-500/60 overflow-hidden shadow-2xl p-1 bg-gradient-to-tr from-amber-600 to-orange-500">
                  <img 
                    src={displayAvatar} 
                    alt={displayName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1 tracking-wide">{displayName}</h2>
              <p className="text-sm text-amber-300/80 mb-6 font-medium">
                {isIncoming && 'आपको छठ पर्व संवाद पर कॉल कर रहे हैं...'}
                {isOutgoing && 'छठ व्रती से संपर्क साधा जा रहा है...'}
                {isConnected && 'सुरक्षित पीयर-टू-पीयर पावन संवाद जारी है'}
              </p>

              {/* Audio Wave visualization when connected */}
              {isConnected && (
                <div className="flex items-center space-x-1.5 h-8 mb-4">
                  {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50].map((height, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-amber-400 rounded-full animate-pulse"
                      style={{ 
                        height: `${height}%`, 
                        animationDelay: `${i * 100}ms`,
                        animationDuration: '1.2s' 
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom Controls Bar */}
        <div className="p-6 pb-8 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 z-20 flex items-center justify-center space-x-6">
          
          {/* Incoming Call: Accept & Decline Buttons */}
          {isIncoming ? (
            <div className="flex items-center space-x-12">
              <button
                onClick={endCall}
                className="flex flex-col items-center space-y-2 group"
                title="अस्वीकार करें"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-95">
                  <PhoneOff className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-300">अस्वीकार</span>
              </button>

              <button
                onClick={acceptCall}
                className="flex flex-col items-center space-y-2 group"
                title="स्वीकार करें"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-600/40 animate-bounce transition-transform active:scale-95">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-semibold text-emerald-400">स्वीकार करें</span>
              </button>
            </div>
          ) : (
            /* Active Connected or Outgoing Call Controls */
            <div className="flex items-center space-x-4 sm:space-x-6">
              
              {/* Audio Mute Toggle */}
              <button
                onClick={toggleCallAudio}
                className={`p-3.5 rounded-full border transition-all ${
                  isAudioMuted 
                    ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                    : 'bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700'
                }`}
                title={isAudioMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
              >
                {isAudioMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* Video Camera Toggle (only if video call) */}
              {isVideo && (
                <button
                  onClick={toggleCallVideo}
                  className={`p-3.5 rounded-full border transition-all ${
                    isVideoOff 
                      ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                      : 'bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700'
                  }`}
                  title={isVideoOff ? 'कैमरा चालू करें' : 'कैमरा बंद करें'}
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
              )}

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 transition-transform active:scale-95"
                title="कॉल समाप्त करें"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
