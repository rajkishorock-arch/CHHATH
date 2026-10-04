import React, { useRef, useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  MoreVertical, 
  Music, 
  Check, 
  UserPlus, 
  Copy, 
  Flag, 
  EyeOff, 
  UserX,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { DynamicReel, ReelUser } from '../../types';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { CommentsDrawer } from './CommentsDrawer';
import { ReportModal } from './ReportModal';
import { YouTubeReelPlayer } from './YouTubeReelPlayer';
import { InstagramReelPlayer } from './InstagramReelPlayer';
import { getImageUrl, getVideoUrl } from '../../utils/imageUtils';

interface VerticalReelPlayerProps {
  reel: DynamicReel;
  isActive: boolean;
  isNearby?: boolean;
  onOpenProfile: (username: string) => void;
  onOpenAudio: (audioId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onPlaybackError?: (reelId: string, videoId: string, errorCode: number) => void;
  onClose?: () => void;
}

const VerticalReelPlayerComponent: React.FC<VerticalReelPlayerProps> = ({
  reel,
  isActive,
  isNearby = true,
  onOpenProfile,
  onOpenAudio,
  onNext,
  onPrev,
  onPlaybackError,
  onClose
}) => {
  const { 
    isLiked, 
    toggleLike, 
    isSaved, 
    toggleSave, 
    recordView,
    isMuted, 
    toggleMute,
    setSelectedHashtag,
    setFeedType,
    markNotInterested
  } = useReels();

  const { currentUser, toggleFollow, isFollowing, blockUser, openAuthModal } = useAuth();
  const { openShareModal } = useChat();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const liked = isLiked(reel.id);
  const saved = isSaved(reel.id);
  const following = isFollowing(reel.creatorId);
  const isOwnReel = currentUser?.id === reel.creatorId;

  // Auto-play when visible, pause when scrolled away
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            // Autoplay may be restricted by browser policy
            setIsPlaying(false);
            setIsLoading(false);
          });
      }

      // Track view after 3 seconds of continuous playback
      const viewTimer = setTimeout(() => {
        if (isActive && !video.paused) {
          recordView(reel.id);
        }
      }, 3000);

      return () => clearTimeout(viewTimer);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, reel.id]);

  // Track view for YouTube embeds after 3 seconds
  useEffect(() => {
    if (isActive && reel.youtubeVideoId) {
      const timer = setTimeout(() => {
        recordView(reel.id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, reel.id, reel.youtubeVideoId]);

  // Handle video progress
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleVideoClick = () => {
    if (reel.youtubeVideoId) {
      setIsPlaying(prev => !prev);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Double tap to like
  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      toggleLike(reel.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  const handleShare = async () => {
    openShareModal({
      type: 'reel',
      id: reel.id,
      title: reel.title,
      subtitle: `@${reel.creatorUsername} • ${reel.category}`,
      thumbnail: reel.thumbnailUrl,
      metadata: { reel }
    });
  };

  const handleHashtagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHashtag(tag);
    setFeedType('hashtag');
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      
      {/* Ambient Backdrop (Desktop Minimal GPU Load) */}
      <div 
        className="hidden sm:block absolute inset-0 bg-cover bg-center opacity-25 scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
      />
      <div className="hidden sm:block absolute inset-0 bg-stone-950/75 pointer-events-none" />

      {/* Main Centered Phone Player (Desktop & Mobile Full-bleed) */}
      <div 
        className="relative w-full h-full sm:max-w-[430px] sm:h-[calc(100%-16px)] sm:max-h-[840px] bg-black sm:rounded-3xl overflow-hidden sm:border border-amber-500/30 sm:shadow-2xl shadow-black/80 flex flex-col justify-between select-none"
        onDoubleClick={handleDoubleTap}
      >
        {/* Transparent Native Touch & Gesture Pass-Through Overlay for 60fps Swiping & Play/Pause */}
        <div 
          className="absolute inset-0 z-10 touch-pan-y cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleVideoClick();
          }}
        />

        {/* Video / Media Viewport (YouTube Iframe, Instagram Iframe Fallback, or Native Video) */}
        {reel.youtubeVideoId ? (
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
            {isActive ? (
              <YouTubeReelPlayer
                key={reel.youtubeVideoId}
                videoId={reel.youtubeVideoId}
                title={reel.title}
                isActive={isActive}
                isPlaying={isPlaying}
                isMuted={isMuted}
                onPlaybackError={(vId, code) => onPlaybackError?.(reel.id, vId, code)}
              />
            ) : (
              <img 
                src={reel.thumbnailUrl} 
                alt={reel.title} 
                loading={isNearby ? 'eager' : 'lazy'}
                className="w-full h-full object-cover" 
              />
            )}

            {/* Top & Bottom Readability Gradients */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />
          </div>
        ) : (reel.sourceType === 'INSTAGRAM' && (!reel.videoUrl || reel.videoUrl.includes('instagram.com/reel') || reel.videoUrl.includes('instagram.com/p'))) ? (
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
            {isActive ? (
              <InstagramReelPlayer
                key={reel.instagramShortcode || reel.id}
                shortcode={reel.instagramShortcode || reel.id}
                instagramUrl={reel.instagramUrl}
                title={reel.title}
                isActive={isActive}
                isMuted={isMuted}
                onPlaybackError={(shortcode, code) => onPlaybackError?.(reel.id, shortcode, code)}
              />
            ) : (
              <img 
                src={reel.thumbnailUrl} 
                alt={reel.title} 
                loading={isNearby ? 'eager' : 'lazy'}
                className="w-full h-full object-cover" 
              />
            )}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-black cursor-pointer" onClick={handleVideoClick}>
            <video
              ref={videoRef}
              src={getVideoUrl(reel.videoUrl)}
              poster={getImageUrl(reel.thumbnailUrl)}
              preload={isActive ? 'auto' : isNearby ? 'metadata' : 'none'}
              playsInline
              loop={true}
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => { setIsLoading(false); setIsPlaying(true); }}
              onCanPlay={() => setIsLoading(false)}
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setIsPlaying(false);
                onPlaybackError?.(reel.id, reel.youtubeVideoId || reel.instagramShortcode || '', 100);
              }}
              className="w-full h-full object-cover"
            />

            {/* Top & Bottom Shadow Gradients for UI readability */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

            {/* Buffer / Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              </div>
            )}

            {/* Minimal Tap to Play Overlay if paused */}
            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="p-3.5 sm:p-4 rounded-full bg-black/60 backdrop-blur-md text-white scale-110 shadow-2xl border border-white/20">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-0.5" />
                </div>
              </div>
            )}

            {/* Heart Burst on Double Tap */}
            {showHeartBurst && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                <Heart className="w-24 h-24 text-red-500 fill-red-500 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
              </div>
            )}
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="relative z-20 pt-3 sm:pt-4 px-3 sm:px-4 flex items-center justify-end pointer-events-auto">
          {/* Sound & More Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); toggleMute(); }}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-amber-400 hover:bg-black/80 transition-all shadow-md"
              title={isMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={e => { e.stopPropagation(); setMoreMenuOpen(!moreMenuOpen); }}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-amber-400 hover:bg-black/80 transition-all shadow-md"
              title="अधिक विकल्प"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* More Actions Floating Popup */}
        {moreMenuOpen && (
          <div 
            className="absolute top-16 right-4 z-30 w-52 bg-stone-950 border border-stone-800 rounded-2xl p-1.5 shadow-2xl text-xs text-stone-200 animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { handleShare(); setMoreMenuOpen(false); }}
              className="w-full px-3 py-2 rounded-xl hover:bg-stone-900 text-left flex items-center gap-2 text-stone-300 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>लिंक कॉपी करें</span>
            </button>

            {(reel.externalSourceUrl || reel.instagramUrl) && (
              <a
                href={reel.externalSourceUrl || reel.instagramUrl || `https://www.youtube.com/watch?v=${reel.youtubeVideoId || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMoreMenuOpen(false)}
                className="w-full px-3 py-2 rounded-xl hover:bg-stone-900 text-left flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>मूल वीडियो देखें (Open Original)</span>
              </a>
            )}

            {/* Not Interested Signal (#UserFeedback) */}
            <button
              onClick={() => {
                markNotInterested(reel.id, reel.category, reel.tags, reel.youtubeVideoId, reel.channelTitle);
                setMoreMenuOpen(false);
                onNext();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-stone-900 text-left flex items-center gap-2 text-stone-300 hover:text-white transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span>रुचि नहीं है (Not Interested)</span>
            </button>

            {!isOwnReel && (
              <>
                <button
                  onClick={() => { blockUser(reel.creatorId); setMoreMenuOpen(false); alert('इस क्रिएटर को ब्लॉक कर दिया गया है।'); }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-stone-900 text-left flex items-center gap-2 text-stone-300 hover:text-white"
                >
                  <UserX className="w-3.5 h-3.5 text-orange-400" />
                  <span>क्रिएटर को ब्लॉक करें</span>
                </button>

                <button
                  onClick={() => { setReportOpen(true); setMoreMenuOpen(false); }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-red-950/40 text-left flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>रिपोर्ट करें (Report)</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Right Vertical Action Rail (Compact & sleek on mobile) */}
        <div className="relative z-10 self-end mr-2 sm:mr-3.5 mb-20 sm:mb-8 flex flex-col items-center gap-2.5 sm:gap-3.5 pointer-events-auto">
          
          {/* Creator Avatar with Follow Plus Badge */}
          <div className="relative mb-0.5">
            <button
              onClick={() => onOpenProfile(reel.creatorUsername)}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-orange-500 shadow-lg hover:scale-105 transition-transform overflow-hidden"
              title={reel.creatorName}
            >
              <img
                src={reel.creatorAvatar}
                alt={reel.creatorName}
                className="w-full h-full rounded-full object-cover"
              />
            </button>

            {!isOwnReel && (
              <button
                onClick={e => { e.stopPropagation(); toggleFollow(reel.creatorId); }}
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold shadow-md transition-all ${
                  following
                    ? 'bg-stone-800 text-amber-400 border border-amber-500/40'
                    : 'bg-red-600 text-white hover:scale-110'
                }`}
                title={following ? 'फॉलोइंग' : 'फॉलो करें'}
              >
                {following ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : '+'}
              </button>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={e => { e.stopPropagation(); toggleLike(reel.id); }}
            className="flex flex-col items-center gap-0.5 sm:gap-1 group"
          >
            <div className={`p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all ${
              liked 
                ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-600/50' 
                : 'bg-black/40 text-white group-hover:bg-black/70 group-hover:scale-105'
            }`}>
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[10px] sm:text-[11px] text-white font-mono font-bold drop-shadow-md">
              {reel.likesCount.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={e => { e.stopPropagation(); setCommentsOpen(true); }}
            className="flex flex-col items-center gap-0.5 sm:gap-1 group"
          >
            <div className="p-2 sm:p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md group-hover:bg-black/70 group-hover:scale-105 transition-all">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-white font-mono font-bold drop-shadow-md">
              {reel.commentsCount.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Save / Bookmark Button */}
          <button
            onClick={e => { e.stopPropagation(); toggleSave(reel.id); }}
            className="flex flex-col items-center gap-0.5 sm:gap-1 group"
          >
            <div className={`p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all ${
              saved 
                ? 'bg-amber-500 text-stone-950 scale-110 shadow-lg shadow-amber-500/50' 
                : 'bg-black/40 text-white group-hover:bg-black/70 group-hover:scale-105'
            }`}>
              <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${saved ? 'fill-stone-950' : ''}`} />
            </div>
            <span className="text-[10px] sm:text-[11px] text-white font-mono font-bold drop-shadow-md">
              {reel.savesCount.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={e => { e.stopPropagation(); handleShare(); }}
            className="flex flex-col items-center gap-0.5 sm:gap-1 group"
          >
            <div className="p-2 sm:p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md group-hover:bg-black/70 group-hover:scale-105 transition-all">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-white font-mono font-bold drop-shadow-md">
              {copiedLink ? 'कॉपी!' : reel.sharesCount.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Audio Spinning Vinyl */}
          {reel.audioId && (
            <button
              onClick={e => { e.stopPropagation(); onOpenAudio(reel.audioId!); }}
              className="mt-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full p-1 bg-stone-950/80 border border-amber-500/60 shadow-lg animate-spin-slow flex items-center justify-center overflow-hidden"
              title={`ऑडियो: ${reel.audioTitle}`}
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

        </div>

        {/* Bottom Details Section (Clean Instagram / Shorts Style) */}
        <div className="relative z-10 p-3.5 sm:p-4 pb-16 sm:pb-3 space-y-1.5 pointer-events-auto text-white max-w-[85%] select-none">
          {/* Creator Line */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenProfile(reel.creatorUsername)}
              className="flex items-center gap-1.5 hover:underline text-left group flex-wrap"
            >
              <span className="font-bold text-amber-300 text-xs sm:text-sm drop-shadow">
                {reel.creatorName}
              </span>
              <span className="text-[11px] text-stone-300 font-mono opacity-80">
                {reel.creatorUsername}
              </span>
            </button>
          </div>

          {/* Clean Caption (1-2 lines max) */}
          <p className="font-mukta text-xs sm:text-[13px] text-white line-clamp-2 leading-snug drop-shadow-md">
            {reel.title || reel.description}
          </p>

          {/* Audio Ticker (Instagram Style) */}
          <div 
            onClick={() => reel.audioId && onOpenAudio(reel.audioId)}
            className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-mukta cursor-pointer hover:underline pt-0.5"
          >
            <Music className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate max-w-[200px] sm:max-w-[280px]">
              {reel.audioTitle ? `${reel.audioTitle} • ${reel.audioArtist || 'पारंपरिक धुन'}` : 'छठ महापर्व पावन ध्वनि (Original Audio)'}
            </span>
          </div>

          {/* Progress Indicator Bar */}
          <div className="w-full h-1 bg-stone-700/60 rounded-full overflow-hidden mt-1.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Threaded Comments Drawer */}
      <CommentsDrawer
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        reelId={reel.id}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        reelId={reel.id}
        reelTitle={reel.title}
      />

    </div>
  );
};

export const VerticalReelPlayer = React.memo(VerticalReelPlayerComponent, (prev, next) => {
  return (
    prev.reel.id === next.reel.id &&
    prev.isActive === next.isActive &&
    prev.isNearby === next.isNearby
  );
});
