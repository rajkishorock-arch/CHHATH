import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Heart, 
  Film, 
  Bookmark, 
  FileText, 
  Share2, 
  UserCheck, 
  UserPlus, 
  Check, 
  Edit3, 
  Play, 
  Eye, 
  Sparkles,
  ShieldCheck,
  MessageCircle,
  UserX,
  Lock
} from 'lucide-react';
import { ReelUser, DynamicReel } from '../../types';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { ReelsStorage } from '../../services/reelsStorage';

interface UserProfileModalProps {
  user: ReelUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reelId: string, customList?: DynamicReel[]) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSelectReel
}) => {
  const { allReels, userDrafts } = useReels();
  const { currentUser, toggleFollow, isFollowing, updateProfile, openAccountCenter, blockUser } = useAuth();
  const { openChatWithUser } = useChat();

  const [activeTab, setActiveTab] = useState<'reels' | 'liked' | 'saved' | 'drafts'>('reels');
  const [copiedProfile, setCopiedProfile] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState(user?.bio || '');
  const [editCityText, setEditCityText] = useState(user?.city || '');

  if (!isOpen || !user) return null;

  const isOwnProfile = currentUser?.id === user.id;
  const following = isFollowing(user.id);
  const isPrivateLocked = Boolean(user.isPrivate || user.is_private) && !isOwnProfile && !following;

  // Compute user reels
  const userReels = allReels.filter(r => r.creatorId === user.id && (r.status === 'approved' || isOwnProfile));

  // Compute liked reels
  const likesMap = ReelsStorage.getLikesMap();
  const likedReels = allReels.filter(r => likesMap[`${user.id}_${r.id}`] && r.status === 'approved');

  // Compute saved reels
  const savesMap = ReelsStorage.getSavesMap();
  const savedReels = allReels.filter(r => savesMap[`${user.id}_${r.id}`] && r.status === 'approved');

  const handleShareProfile = () => {
    const url = `${window.location.origin}${window.location.pathname}#user/${user.username}`;
    if (navigator.share) {
      navigator.share({
        title: `${user.name} (${user.username}) — छठ महापर्व प्रोफाइल`,
        text: `छठ महापर्व पर ${user.name} की पावन रील्स देखें।`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedProfile(true);
      setTimeout(() => setCopiedProfile(false), 2000);
    }
  };

  const handleSaveProfileEdit = () => {
    updateProfile({
      bio: editBioText.trim(),
      city: editCityText.trim()
    });
    setIsEditingBio(false);
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Top Bar */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-amber-300">{user.username}</span>
            {user.verified && (
              <span className="text-xs text-sky-400 font-bold" title="सत्यापित सांस्कृतिक खाता">✓</span>
            )}
            {(user.isPrivate || user.is_private) && (
              <span className="text-xs text-amber-400 flex items-center gap-0.5" title="निजी खाता">
                <Lock className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
              title="प्रोफाइल शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Profile Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Profile Header Block */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 shadow-xl shadow-amber-500/20 shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
              {user.role === 'admin' && (
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-red-600 text-white shadow" title="एडमिन">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-rozha text-2xl font-bold text-white leading-tight">
                    {user.name}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                    <span className="text-xs text-amber-400 font-mono font-semibold">{user.username}</span>
                    {user.city && (
                      <span className="text-[11px] text-stone-400 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {user.city}
                      </span>
                    )}
                  </div>
                </div>

                {/* Follow or Edit Profile Button & Direct Message */}
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          openAccountCenter('profile');
                        }}
                        className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        title="अकाउंट सेंटर व सुरक्षा सेटिंग्स"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>अकाउंट सेंटर</span>
                      </button>
                      <button
                        onClick={() => setIsEditingBio(!isEditingBio)}
                        className="px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-bold text-stone-200 flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isEditingBio ? 'रद्द करें' : 'संपादित करें'}</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleFollow(user.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                          following
                            ? 'bg-stone-900 text-stone-300 border border-stone-700 hover:text-red-400'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-stone-950'
                        }`}
                      >
                        {following ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>फॉलोइंग</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>फॉलो करें</span>
                          </>
                        )}
                      </button>

                      {/* Direct Message via Chhath Connect */}
                      <button
                        onClick={async () => {
                          await openChatWithUser(user.id);
                          onClose();
                        }}
                        className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1.5 shadow-sm"
                        title="छठ कनेक्ट पर संदेश भेजें"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>संदेश भेजें</span>
                      </button>

                      {/* Block User Button */}
                      <button
                        onClick={async () => {
                          if (window.confirm(`क्या आप ${user.name} को ब्लॉक करना चाहते हैं?`)) {
                            await blockUser(user.id);
                            onClose();
                          }
                        }}
                        className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-rose-400 border border-stone-800 transition-colors"
                        title="उपयोगकर्ता को ब्लॉक करें"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              {isEditingBio ? (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    value={editBioText}
                    onChange={e => setEditBioText(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white resize-none"
                    placeholder="अपना बायो लिखें..."
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editCityText}
                      onChange={e => setEditCityText(e.target.value)}
                      className="flex-1 px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white"
                      placeholder="शहर"
                    />
                    <button
                      onClick={handleSaveProfileEdit}
                      className="px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                    >
                      सुरक्षित करें
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-mukta text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md">
                  “{user.bio}”
                </p>
              )}

              {/* Stats Counters */}
              <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                <div className="text-center sm:text-left">
                  <div className="font-mono text-sm sm:text-base font-bold text-white">
                    {userReels.length}
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">रील्स</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="font-mono text-sm sm:text-base font-bold text-white">
                    {(user.followersCount + (following && !isOwnProfile ? 1 : 0)).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">फॉलोअर्स</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="font-mono text-sm sm:text-base font-bold text-white">
                    {user.followingCount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">फॉलोइंग</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="font-mono text-sm sm:text-base font-bold text-white">
                    {user.totalLikesCount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">कुल लाइक्स</div>
                </div>
              </div>

            </div>
          </div>

          {copiedProfile && (
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs text-center border border-amber-500/40">
              प्रोफाइल लिंक कॉपी हो गया है! 📋
            </div>
          )}

          {/* Profile Navigation Tabs */}
          <div className="flex border-b border-stone-800">
            <button
              onClick={() => setActiveTab('reels')}
              className={`flex-1 py-3 text-xs font-bold font-mukta flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'reels'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>रील्स ({userReels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-3 text-xs font-bold font-mukta flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'liked'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>पसंद (Liked)</span>
            </button>

            {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`flex-1 py-3 text-xs font-bold font-mukta flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    activeTab === 'saved'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                      : 'border-transparent text-stone-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>सेव्ड ({savedReels.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`flex-1 py-3 text-xs font-bold font-mukta flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    activeTab === 'drafts'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                      : 'border-transparent text-stone-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>ड्राफ्ट्स ({userDrafts.length})</span>
                </button>
              </>
            )}
          </div>

          {/* Reel Grid / Empty State or Private Locked State */}
          {isPrivateLocked ? (
            <div className="p-12 text-center bg-black/40 border border-white/5 rounded-3xl space-y-3 my-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white font-rozha">यह खाता निजी (Private) है</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                इस भक्त की छठ रील्स, सहेजे गए वीडियो और पोस्ट देखने के लिए फॉलो अनुरोध भेजें।
              </p>
            </div>
          ) : (
            <div>
              {activeTab === 'reels' && (
                userReels.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 space-y-2">
                    <span className="text-4xl block">🪔</span>
                    <p className="font-rozha text-base text-amber-200">
                      अभी इस घाट पर कोई Reel नहीं पहुँची है 🪔
                    </p>
                    {isOwnProfile && (
                      <button
                        onClick={onClose}
                        className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-xs font-bold shadow-lg"
                      >
                        पहली Reel बनाएं 🎥
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {userReels.map(reel => (
                      <div
                        key={reel.id}
                        onClick={() => onSelectReel(reel.id, userReels)}
                        className="relative aspect-[9/16] bg-stone-900 rounded-xl overflow-hidden cursor-pointer group border border-stone-800 hover:border-amber-400/50 transition-all"
                      >
                        <img
                          src={reel.thumbnailUrl}
                          alt={reel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white font-mono">
                          <span className="flex items-center gap-1 font-bold">
                            <Eye className="w-3 h-3 text-amber-400" />
                            {reel.viewsCount.toLocaleString('en-IN')}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5 text-red-400 fill-red-400" />
                            {reel.likesCount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'liked' && (
                likedReels.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 space-y-2">
                    <Heart className="w-8 h-8 mx-auto text-stone-600" />
                    <p className="font-mukta text-xs">कोई पसंद की गई रील नहीं मिली।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {likedReels.map(reel => (
                      <div
                        key={reel.id}
                        onClick={() => onSelectReel(reel.id, likedReels)}
                        className="relative aspect-[9/16] bg-stone-900 rounded-xl overflow-hidden cursor-pointer group"
                      >
                        <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1.5 left-2 text-[10px] text-white font-mono font-bold flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                          {reel.likesCount}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {isOwnProfile && activeTab === 'saved' && (
                savedReels.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto text-stone-600" />
                    <p className="font-mukta text-xs">कोई सेव की गई रील नहीं मिली।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {savedReels.map(reel => (
                      <div
                        key={reel.id}
                        onClick={() => onSelectReel(reel.id, savedReels)}
                        className="relative aspect-[9/16] bg-stone-900 rounded-xl overflow-hidden cursor-pointer group"
                      >
                        <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1.5 left-2 text-[10px] text-white font-mono font-bold flex items-center gap-1">
                          <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                          सेव्ड
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {isOwnProfile && activeTab === 'drafts' && (
                userDrafts.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-stone-600" />
                    <p className="font-mukta text-xs">कोई ड्राफ्ट नहीं है।</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userDrafts.map(draft => (
                      <div
                        key={draft.id}
                        className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-amber-300">{draft.title}</h4>
                          <span className="text-[10px] text-stone-400 font-mono">
                            अंतिम संपादन: {new Date(draft.updatedAt).toLocaleDateString('hi-IN')}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                          {draft.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
