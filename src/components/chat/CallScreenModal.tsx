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
  VolumeX,
  RotateCcw,
  ChevronDown,
  Maximize2,
  ShieldCheck,
  Lock
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
    toggleCallVideo,
    flipCamera
  } = useChat();

  const { currentUser } = useAuth();
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [flippingCamera, setFlippingCamera] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Attach media streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, activeCall?.status, isVideoOff]);

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
  const isVideo = activeCall.type === 'video' && !isVideoOff;

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const displayName = isIncoming 
    ? activeCall.callerName 
    : (currentUser?.id === activeCall.callerId ? (activeCall.receiverId ? 'छठ श्रद्धालु' : 'छठ व्रती') : activeCall.callerName);
  
  const displayAvatar = isIncoming 
    ? activeCall.callerAvatar 
    : (activeCall.callerAvatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80');

  const handleFlipCamera = async () => {
    setFlippingCamera(true);
    try {
      await flipCamera();
    } finally {
      setTimeout(() => setFlippingCamera(false), 400);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };

  // =========================================================================
  // 1. MINIMIZED FLOATING PILL (Allows user to explore app while talking)
  // =========================================================================
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[250] bg-white border border-amber-300 shadow-2xl rounded-full p-2 pr-4 flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95 transition-all select-none animate-in slide-in-from-bottom-6 duration-300"
      >
        <div className="relative w-10 h-10 rounded-full shrink-0">
          <img 
            src={displayAvatar} 
            alt={displayName} 
            className="w-full h-full rounded-full object-cover border border-amber-400"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </div>

        <div className="min-w-0 pr-1">
          <div className="text-xs font-bold text-stone-900 truncate max-w-[120px]">{displayName}</div>
          <div className="text-[10px] text-emerald-600 font-mono font-bold leading-none">
            {isConnected ? formatTime(callDuration) : 'कॉलिंग...'}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            endCall();
          }}
          className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
          title="कॉल समाप्त करें"
        >
          <PhoneOff className="w-3.5 h-3.5" />
        </button>

        <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
      </div>
    );
  }

  // =========================================================================
  // 2. FULL-SCREEN INSTAGRAM CALL ROOM (PURE WHITE / LUXURY MINIMALIST UI)
  // =========================================================================
  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white text-stone-900 select-none overflow-hidden page-transition-enter">
      
      {/* Background Soft Golden Halo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-200/40 via-orange-100/30 to-amber-100/10 blur-3xl opacity-70" />
      </div>

      {/* Top Header Navigation Bar */}
      <header className="relative z-20 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-stone-100/90 bg-white/80 backdrop-blur-md">
        
        {/* Left: Minimize / Return Button */}
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="p-2 -ml-1 rounded-2xl hover:bg-stone-100 text-stone-700 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
          title="छोटा करें"
        >
          <ChevronDown className="w-5 h-5 text-stone-700" />
          <span className="hidden sm:inline text-stone-500 text-xs">ऐप देखें</span>
        </button>

        {/* Center: Devotee & Encryption Badge */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold font-rozha text-stone-950">
            <span>{displayName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500 font-medium">
            <Lock className="w-2.5 h-2.5 text-emerald-600" />
            <span>छठ महापर्व 2026 • एंड-टू-एंड एन्क्रिप्टेड</span>
          </div>
        </div>

        {/* Right: Quick Settings / Camera Flip */}
        <div className="flex items-center gap-2">
          {isVideo && (
            <button
              type="button"
              onClick={handleFlipCamera}
              disabled={flippingCamera}
              className={`p-2 rounded-2xl border border-stone-200 hover:bg-stone-100 text-stone-700 active:scale-90 transition-all cursor-pointer ${
                flippingCamera ? 'animate-spin' : ''
              }`}
              title="कैमरा पलटें"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleSpeaker}
            className={`p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
              isSpeakerOn 
                ? 'bg-amber-50 border-amber-300 text-amber-900' 
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
            title={isSpeakerOn ? 'स्पीकर चालू' : 'स्पीकर बंद'}
          >
            {isSpeakerOn ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Center Body: Calling & Media Stream Arena */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
        
        {/* ====================================================
            VIDEO CALL MODE (When Video is On & Active)
           ==================================================== */}
        {isVideo && isConnected ? (
          <div className="absolute inset-0 w-full h-full bg-stone-950">
            {/* Remote Video Stream (Main Viewport) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Sacred Devotional Watermark Overlay */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>छठ लाइव दर्शन संवाद</span>
            </div>

            {/* Local Video Picture-in-Picture (PiP) Window */}
            <div className="absolute bottom-24 sm:bottom-28 right-4 sm:right-6 w-28 h-40 sm:w-36 sm:h-52 rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-stone-900 z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'scale-x-[-1]'}`}
              />
              {isVideoOff && (
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-stone-400 p-2 text-center">
                  <VideoOff className="w-5 h-5 mb-1 text-stone-500" />
                  <span>कैमरा बंद</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ====================================================
              VOICE CALL MODE & RINGING STATE (PURE WHITE LUXURY)
             ==================================================== */
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full px-4">
            
            {/* Glowing Concentric Animated Pulse Avatar */}
            <div className="relative mb-6 sm:mb-8">
              {/* Expanding Pulse Wave 1 */}
              <div className="absolute -inset-6 rounded-full bg-amber-400/20 blur-xl animate-call-pulse" />
              {/* Expanding Pulse Wave 2 */}
              <div className="absolute -inset-12 rounded-full bg-orange-400/15 blur-2xl animate-call-pulse" style={{ animationDelay: '600ms' }} />

              {/* Devotee Avatar Ring */}
              <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {isConnected && (
                  <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-md animate-pulse" />
                )}
              </div>
            </div>

            {/* Devotee Name & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-bold font-rozha text-stone-950 mb-1.5">
              {displayName}
            </h2>

            <p className="text-xs sm:text-sm text-stone-500 mb-4 font-medium">
              {isIncoming && 'छठ महापर्व संवाद पर आपको कॉल कर रहे हैं...'}
              {isOutgoing && 'छठ महापर्व संवाद से जोड़ा जा रहा है...'}
              {isConnected && 'पावन छठ संवाद सक्रिय है 🙏'}
            </p>

            {/* Live Status Pill with State Badging */}
            <div className="mb-6">
              {isConnected ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-mono font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{formatTime(callDuration)}</span>
                </div>
              ) : isIncoming ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold animate-pulse shadow-xs">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>इनकमिंग कॉल...</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold animate-pulse shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>रिंगिंग...</span>
                </div>
              )}
            </div>

            {/* Live Audio Equalizer Waveform Bars when Connected */}
            {isConnected && (
              <div className="flex items-center justify-center gap-1.5 h-10 px-6 py-2 rounded-2xl bg-amber-50/60 border border-amber-200/60 shadow-xs">
                {[30, 60, 95, 45, 80, 100, 65, 40, 85, 55, 75, 40, 90, 50].map((height, i) => (
                  <div
                    key={i}
                    className="w-1 bg-amber-500 rounded-full animate-pulse"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${i * 90}ms`,
                      animationDuration: '1.1s'
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Bottom Controls Dock (Instagram Style Floating Action Bar) */}
      <footer className="relative z-20 pb-8 sm:pb-10 pt-4 flex items-center justify-center bg-white/95 backdrop-blur-lg border-t border-stone-100">
        
        {/* ====================================================
            INCOMING CALL CONTROLS (Accept / Decline)
           ==================================================== */}
        {isIncoming ? (
          <div className="flex items-center gap-12 sm:gap-16">
            
            {/* Decline Button (Red) */}
            <button
              type="button"
              onClick={endCall}
              className="flex flex-col items-center gap-2 group cursor-pointer"
              title="अस्वीकार करें"
            >
              <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/40 active:scale-90 transition-transform">
                <PhoneOff className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-stone-600">अस्वीकार</span>
            </button>

            {/* Accept Button (Green) */}
            <button
              type="button"
              onClick={acceptCall}
              className="flex flex-col items-center gap-2 group cursor-pointer"
              title="स्वीकार करें"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 animate-bounce active:scale-90 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-emerald-700">स्वीकार करें</span>
            </button>

          </div>
        ) : (
          /* ====================================================
              CONNECTED OR OUTGOING CONTROLS (INSTAGRAM DOCK)
             ==================================================== */
          <div className="flex items-center gap-3 sm:gap-5 px-6 py-3 rounded-full bg-stone-50 border border-stone-200/90 shadow-lg">
            
            {/* Microphone Toggle (Mute/Unmute) */}
            <button
              type="button"
              onClick={toggleCallAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-90 cursor-pointer ${
                isAudioMuted
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800'
              }`}
              title={isAudioMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
            >
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Camera Toggle (On/Off) */}
            <button
              type="button"
              onClick={toggleCallVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-90 cursor-pointer ${
                isVideoOff
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800'
              }`}
              title={isVideoOff ? 'कैमरा चालू करें' : 'कैमरा बंद करें'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Flip Camera (if video active) */}
            {isVideo && (
              <button
                type="button"
                onClick={handleFlipCamera}
                disabled={flippingCamera}
                className="w-12 h-12 rounded-full bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                title="कैमरा पलटें"
              >
                <RotateCcw className={`w-5 h-5 ${flippingCamera ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Speaker Toggle */}
            <button
              type="button"
              onClick={toggleSpeaker}
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-90 cursor-pointer ${
                isSpeakerOn
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-600'
              }`}
              title={isSpeakerOn ? 'स्पीकर चालू' : 'स्पीकर बंद'}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5 text-amber-600" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Red Instagram End Call Button */}
            <button
              type="button"
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/50 active:scale-90 transition-transform cursor-pointer ml-1 sm:ml-2"
              title="कॉल समाप्त करें"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

          </div>
        )}

      </footer>

    </div>
  );
};
