import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Music, 
  Heart, 
  Bookmark, 
  Edit3, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  X, 
  Share2, 
  User, 
  LogOut,
  Camera,
  Settings,
  Trash2,
  Check,
  Mail,
  Lock,
  Upload,
  ChevronRight
} from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { UserSyncService } from '../../services/userSyncService';

interface MyChhathDashboardProps {
  onNavigate?: (tab: string) => void;
}

interface PersonalVow {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export const MyChhathDashboard: React.FC<MyChhathDashboardProps> = ({ onNavigate }) => {
  const { userLocation, favoriteSongs, songs, favoriteGhats, ghats } = useChhathData();
  const { currentUser, updateProfile, logout, openAuthModal, resetPassword } = useAuth();
  const { playSong } = useAudio();

  // Active Tab: 'vows' | 'songs' | 'ghats' | 'credentials'
  const [activeTab, setActiveTab] = useState<'vows' | 'songs' | 'ghats' | 'credentials'>('vows');

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [usernameInput, setUsernameInput] = useState(currentUser?.username || '');
  const [cityInput, setCityInput] = useState(currentUser?.city || userLocation.city || '');
  const [stateInput, setStateInput] = useState(currentUser?.state || userLocation.state || '');
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState<string>(currentUser?.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Personal Vows & Diary (0 vows by default for new users, persisted per-account across devices)
  const [vows, setVows] = useState<PersonalVow[]>(() => {
    try {
      const stored = localStorage.getItem(currentUser?.id ? `chhath_vows_${currentUser.id}` : 'chhath_personal_vows');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy vows like 'vow-1', 'vow-2', 'vow-3'
          return parsed.filter(v => v.id && !v.id.startsWith('vow-1') && !v.id.startsWith('vow-2') && !v.id.startsWith('vow-3'));
        }
      }
    } catch {}
    return [];
  });
  const [newVowText, setNewVowText] = useState('');

  // Persist vows to localStorage per-user cache
  useEffect(() => {
    try {
      const storageKey = currentUser?.id ? `chhath_vows_${currentUser.id}` : 'chhath_personal_vows';
      localStorage.setItem(storageKey, JSON.stringify(vows));
    } catch {}
  }, [vows, currentUser?.id]);

  // Sync with cloud data when user changes or logs in
  useEffect(() => {
    if (currentUser?.id) {
      UserSyncService.fetchUserData(currentUser.id).then((cloudData) => {
        if (cloudData) {
          if (Array.isArray(cloudData.vows)) {
            setVows(cloudData.vows);
          }
          if (cloudData.avatarUrl && !avatarPreview) {
            setAvatarPreview(cloudData.avatarUrl);
          }
        }
      }).catch(() => {});
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name);
      setUsernameInput(currentUser.username || '');
      setCityInput(currentUser.city || userLocation.city || '');
      setStateInput(currentUser.state || userLocation.state || '');
      setBioInput(currentUser.bio || '');
      setAvatarPreview(currentUser.avatarUrl || '');
    }
  }, [currentUser, userLocation]);

  const handleToggleVow = (id: string) => {
    const updated = vows.map(v => v.id === id ? { ...v, completed: !v.completed } : v);
    setVows(updated);
    if (currentUser?.id) {
      UserSyncService.saveUserData(currentUser.id, { vows: updated }).catch(() => {});
    }
  };

  const handleAddVow = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newVowText.trim();
    if (!trimmed) return;
    const newVow: PersonalVow = {
      id: `vow_${Date.now()}`,
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updated = [newVow, ...vows];
    setVows(updated);
    setNewVowText('');
    showToast('नया संकल्प छठ डायरी में जोड़ा गया!');
    if (currentUser?.id) {
      UserSyncService.saveUserData(currentUser.id, { vows: updated }).catch(() => {});
    }
  };

  const handleDeleteVow = (id: string) => {
    const updated = vows.filter(v => v.id !== id);
    setVows(updated);
    showToast('संकल्प हटाया गया');
    if (currentUser?.id) {
      UserSyncService.saveUserData(currentUser.id, { vows: updated }).catch(() => {});
    }
  };

  // Image Upload handler with Canvas Compression (max 240x240 JPEG ~12KB for instant cross-device sync)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('फ़ोटो का आकार 8MB से कम होना चाहिए।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (!dataUri) return;

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 240;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setAvatarPreview(compressed);
            showToast('फ़ोटो चुनी गई! "परिवर्तन सहेजें" पर क्लिक करें।');
          } else {
            setAvatarPreview(dataUri);
            showToast('फ़ोटो चुनी गई! "परिवर्तन सहेजें" पर क्लिक करें।');
          }
        } catch {
          setAvatarPreview(dataUri);
          showToast('फ़ोटो चुनी गई! "परिवर्तन सहेजें" पर क्लिक करें।');
        }
      };
      img.onerror = () => {
        setAvatarPreview(dataUri);
        showToast('फ़ोटो चुनी गई! "परिवर्तन सहेजें" पर क्लिक करें।');
      };
      img.src = dataUri;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('कृपया अपना नाम दर्ज करें');
      return;
    }

    let cleanUser = usernameInput.trim();
    if (cleanUser && !cleanUser.startsWith('@')) {
      cleanUser = `@${cleanUser}`;
    }

    const updates = {
      name: nameInput.trim(),
      username: cleanUser || currentUser?.username,
      city: cityInput.trim(),
      state: stateInput.trim(),
      bio: bioInput.trim(),
      avatarUrl: avatarPreview
    };

    updateProfile(updates);

    if (currentUser?.id) {
      UserSyncService.saveUserData(currentUser.id, updates).catch(e => console.warn(e));
    }

    setEditModalOpen(false);
    showToast('प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई! ✨');
  };

  const handleShareProfile = async () => {
    const shareText = `${currentUser?.name || 'छठ श्रद्धालु'} की छठ महापर्व 2026 प्रोफ़ाइल:\n${window.location.origin}/#my-chhath`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'छठ महापर्व 2026 प्रोफ़ाइल',
          text: shareText,
          url: `${window.location.origin}/#my-chhath`
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('प्रोफ़ाइल लिंक कॉपी हो गया!');
    }
  };

  const handleSendResetPassword = async () => {
    if (!currentUser?.email) return;
    const res = await resetPassword(currentUser.email);
    if (res.success) {
      setResetSent(true);
      showToast('पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया!');
    } else {
      showToast(res.error || 'रीसेट लिंक भेजने में त्रुटि हुई');
    }
  };

  const goToSettings = () => {
    if (onNavigate) {
      onNavigate('settings');
    } else {
      window.location.hash = '#settings';
    }
  };

  // Filtered favorite songs and ghats
  const myFavoriteSongsList = songs.filter(s => favoriteSongs.includes(s.id));
  const myFavoriteGhatsList = ghats.filter(g => favoriteGhats.includes(g.id));

  // User Initial Letter
  const userInitial = currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : '👤';

  return (
    <section id="my-chhath" className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-20 pt-2 sm:pt-6 font-mukta transition-colors">
      <div className="max-w-2xl mx-auto px-1.5 sm:px-4">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-stone-950 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Instagram-Style Top Bar Header */}
        <div className="flex items-center justify-between py-2 mb-3 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base sm:text-lg font-bold font-sans tracking-tight text-stone-900 dark:text-stone-100">
              {currentUser?.username || '@devotee_chhath'}
            </h1>
            {currentUser?.verified && (
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold" title="सत्यापित खाता">
                ✓
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="प्रोफ़ाइल शेयर करें"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={goToSettings}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="सेटिंग्स"
            >
              <Settings className="w-5 h-5" />
            </button>
            {currentUser && (
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="लॉग आउट"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Instagram Profile Card */}
        {currentUser ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs mb-5">
            {/* Top row: Avatar + 3 Stats */}
            <div className="flex items-center justify-between gap-4 mb-4">
              {/* Avatar with Camera badge */}
              <div 
                onClick={() => setEditModalOpen(true)}
                className="relative cursor-pointer group shrink-0"
                title="प्रोफ़ाइल फ़ोटो बदलें"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 shadow-sm transition-transform active:scale-95">
                  <div className="w-full h-full rounded-full overflow-hidden bg-amber-50 dark:bg-stone-800 flex items-center justify-center border-2 border-white dark:border-stone-900">
                    {currentUser.avatarUrl ? (
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 dark:text-amber-200 font-sans">
                        {userInitial}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-amber-500 text-stone-950 border-2 border-white dark:border-stone-900 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Instagram Stats Column */}
              <div className="flex-1 grid grid-cols-3 text-center gap-1">
                <div 
                  onClick={() => setActiveTab('vows')}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 font-sans">
                    {vows.length}
                  </div>
                  <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                    संकल्प
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('songs')}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 font-sans">
                    {favoriteSongs.length + favoriteGhats.length}
                  </div>
                  <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                    पसंदीदा
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('credentials')}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-400 font-sans">
                    2026
                  </div>
                  <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                    छठ महापर्व
                  </div>
                </div>
              </div>
            </div>

            {/* User Bio & Details */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
                  {currentUser.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  छठ व्रती
                </span>
              </div>

              {currentUser.email && (
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-sans">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentUser.email}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-md">
                    सत्यापित
                  </span>
                </div>
              )}

              {(currentUser.city || currentUser.state) && (
                <div className="flex items-center gap-1 text-xs text-amber-800 dark:text-amber-400 font-semibold pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{[currentUser.city, currentUser.state].filter(Boolean).join(', ')}</span>
                </div>
              )}

              {currentUser.bio ? (
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                  {currentUser.bio}
                </p>
              ) : null}
            </div>

            {/* Instagram Full-Width Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setEditModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>प्रोफ़ाइल संपादित करें</span>
              </button>

              <button
                onClick={handleShareProfile}
                className="py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>प्रोफ़ाइल शेयर करें</span>
              </button>
            </div>
          </div>
        ) : (
          /* Guest Profile Prompt */
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm text-center mb-5">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              छठ महापर्व डिजिटल प्रोफ़ाइल
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 max-w-sm mx-auto">
              लॉग इन करके अपनी छठ डायरी, संकल्प, पसंदीदा गीत और निजी अर्घ्य मुहूर्त सुरक्षित रखें।
            </p>
            <button
              onClick={() => openAuthModal('login')}
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              लॉग इन या साइन अप करें →
            </button>
          </div>
        )}

        {/* 3. Instagram-Style Tabs Switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 mb-4 bg-white dark:bg-stone-900 rounded-2xl shadow-2xs overflow-hidden">
          <button
            onClick={() => setActiveTab('vows')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'vows'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/30'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>मेरी डायरी ({vows.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('songs')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'songs'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/30'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>गीत ({favoriteSongs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ghats')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'ghats'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/30'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>घाट ({favoriteGhats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'credentials'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/30'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>खाता</span>
          </button>
        </div>

        {/* 4. Tab Content Panels */}
        
        {/* TAB 1: मेरी डायरी व संकल्प (My Vows & Diary) */}
        {activeTab === 'vows' && (
          <div className="space-y-3">
            {/* Add New Vow Form */}
            <form onSubmit={handleAddVow} className="flex gap-2">
              <input
                type="text"
                value={newVowText}
                onChange={(e) => setNewVowText(e.target.value)}
                placeholder="नया संकल्प या निजी व्रत नियम जोड़ें..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>जोड़ें</span>
              </button>
            </form>

            {/* Vows List */}
            {vows.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                <Bookmark className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
                <h4 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                  अभी कोई संकल्प नहीं जोड़ा गया है
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  छठ महापर्व 2026 के लिए अपने निजी नियम, व्रत मन्नत या संकल्प ऊपर लिखकर &ldquo;जोड़ें&rdquo; पर क्लिक करें।
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {vows.map((vow) => (
                  <div
                    key={vow.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      vow.completed 
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-stone-500 dark:text-stone-400' 
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleVow(vow.id)}
                      className="flex items-start gap-3 text-left flex-1 cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        vow.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-stone-300 dark:border-stone-700 hover:border-amber-500'
                      }`}>
                        {vow.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium leading-relaxed ${vow.completed ? 'line-through text-stone-400 dark:text-stone-500' : ''}`}>
                        {vow.text}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteVow(vow.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: पसंदीदा गीत (Saved Songs) */}
        {activeTab === 'songs' && (
          <div className="space-y-2">
            {myFavoriteSongsList.length > 0 ? (
              myFavoriteSongsList.map((song) => (
                <div
                  key={song.id}
                  className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 dark:hover:border-amber-500/50 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => playSong(song)}
                      className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <div className="truncate">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {song.singer} • {song.language}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-stone-400 dark:text-stone-500 font-mono shrink-0">
                    {song.duration}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                <Music className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
                  आपने अभी कोई गीत पसंदीदा नहीं बनाया है।
                </p>
                <button
                  onClick={() => onNavigate ? onNavigate('songs') : (window.location.hash = '#songs')}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs cursor-pointer"
                >
                  छठ गीत सुनें →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: पसंदीदा घाट (Saved Ghats) */}
        {activeTab === 'ghats' && (
          <div className="space-y-2">
            {myFavoriteGhatsList.length > 0 ? (
              myFavoriteGhatsList.map((ghat) => (
                <div
                  key={ghat.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        {ghat.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {ghat.city}, {ghat.state} • {ghat.river}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate ? onNavigate('ghats') : (window.location.hash = '#ghats')}
                    className="p-2 text-stone-400 hover:text-amber-600 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                <MapPin className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
                  कोई पसंदीदा घाट सहेजा नहीं गया है।
                </p>
                <button
                  onClick={() => onNavigate ? onNavigate('ghats') : (window.location.hash = '#ghats')}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs cursor-pointer"
                >
                  घाट डायरेक्टरी देखें →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: खाता व क्रेडेंशियल (Credentials & Security) */}
        {activeTab === 'credentials' && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>प्रमाणीकरण व क्रेडेंशियल जानकारी</span>
            </h3>

            {currentUser ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">यूज़र आईडी (UID):</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200 truncate max-w-[180px]">
                      {currentUser.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">पंजीकृत ईमेल:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{currentUser.email || 'उपलब्ध नहीं'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">खाता सुरक्षा:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Firebase Authentication 🔒</span>
                  </div>
                </div>

                {currentUser.email && (
                  <div className="pt-1">
                    <button
                      onClick={handleSendResetPassword}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{resetSent ? 'रीसेट लिंक भेजा जा चुका है' : 'पासवर्ड रीसेट लिंक ईमेल पर भेजें'}</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => logout()}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>इस डिवाइस से लॉग आउट करें</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">वर्तमान में आप अतिथि सत्र में हैं।</p>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs cursor-pointer"
                >
                  लॉग इन करें
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Instagram-Style "Edit Profile" (प्रोफ़ाइल संपादित करें) Modal */}
      {editModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setEditModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                प्रोफ़ाइल संपादित करें
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Change Profile Photo Section */}
            <div className="flex flex-col items-center mb-5 text-center">
              <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md mb-2.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-amber-50 dark:bg-stone-800 flex items-center justify-center border-2 border-white dark:border-stone-900">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-3xl font-extrabold text-amber-900 dark:text-amber-200 font-sans">
                      {nameInput ? nameInput.trim().charAt(0).toUpperCase() : '👤'}
                    </span>
                  )}
                </div>
              </div>

              {/* Hidden File Picker */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>फ़ोटो अपलोड करें</span>
                </button>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview('');
                      showToast('फ़ोटो हटा दी गई');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं</span>
                  </button>
                )}
              </div>

              {/* Spiritual Emoji Avatars */}
              <div className="flex items-center gap-1.5 mt-3">
                <span className="text-[11px] text-stone-400 dark:text-stone-500 font-medium">अवतार:</span>
                {['☀️', '🪔', '🙏', '🌸', '🌅', '🚩'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setAvatarPreview(emoji);
                      showToast(`अवतार ${emoji} चुना गया`);
                    }}
                    className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Fields Form */}
            <form onSubmit={handleSaveProfile} className="space-y-3 font-mukta">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="अपना नाम दर्ज करें"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  यूज़रनेम (Username)
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="@your_username"
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  बायो (Bio / संदेश)
                </label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={2}
                  maxLength={150}
                  placeholder="छठी मईया की जय! अपने भाव लिखें..."
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 resize-none"
                />
                <span className="block text-right text-[10px] text-stone-400 dark:text-stone-500">
                  {bioInput.length}/150
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    शहर (City)
                  </label>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="उदा. पटना"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    राज्य (State)
                  </label>
                  <input
                    type="text"
                    value={stateInput}
                    onChange={(e) => setStateInput(e.target.value)}
                    placeholder="उदा. बिहार"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>परिवर्तन सहेजें (Save Changes)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
