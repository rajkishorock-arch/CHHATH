import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  User, 
  Lock, 
  Eye, 
  Users, 
  Bot, 
  Download, 
  Trash2, 
  Smartphone, 
  Check, 
  AlertCircle, 
  Globe, 
  MapPin, 
  Sparkles,
  UserCheck,
  UserX,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/authService';
import { ReelUser } from '../../types';

interface AccountCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const AccountCenterModal: React.FC<AccountCenterModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile'
}) => {
  const {
    currentUser,
    userSettings,
    updateProfile,
    updateUserSettings,
    activeSessions,
    refreshActiveSessions,
    revokeSession,
    logoutAllOtherSessions,
    pendingFollowRequests,
    refreshPendingFollowRequests,
    acceptFollowRequest,
    rejectFollowRequest,
    downloadMyDataPackage,
    logout
  } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Profile Form state
  const [displayName, setDisplayName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username.replace(/^@/, '') || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [city, setCity] = useState(currentUser?.city || 'Patna');
  const [state, setState] = useState(currentUser?.state || 'Bihar');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Blocked users state
  const [blockedUsers, setBlockedUsers] = useState<ReelUser[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);

  // Data download & deletion states
  const [exportingData, setExportingData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Synchronize initial state when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      if (currentUser) {
        setDisplayName(currentUser.name);
        setUsername(currentUser.username.replace(/^@/, ''));
        setBio(currentUser.bio);
        setWebsite(currentUser.website || '');
        setCity(currentUser.city || 'Patna');
        setState(currentUser.state || 'Bihar');
        setAvatarUrl(currentUser.avatarUrl || '');
      }
      refreshActiveSessions();
      refreshPendingFollowRequests();
      loadBlockedUsers();
    }
  }, [isOpen, initialTab, currentUser]);

  const loadBlockedUsers = async () => {
    setLoadingBlocked(true);
    try {
      const list = await AuthService.getBlockedUsers();
      setBlockedUsers(list);
    } catch {
      setBlockedUsers([]);
    } finally {
      setLoadingBlocked(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (cleanUsername.length < 3) {
      setProfileErrorMsg('यूजरनेम कम से कम 3 अक्षरों का होना चाहिए।');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setProfileErrorMsg('यूजरनेम में केवल अंग्रेजी अक्षर, संख्याएं और अंडरस्कोर (_) अनुमत हैं।');
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await AuthService.updateProfile({
        name: displayName.trim(),
        username: `@${cleanUsername}`,
        bio: bio.trim(),
        website: website.trim(),
        city: city.trim(),
        state: state.trim(),
        avatarUrl: avatarUrl.trim()
      });

      if (updated) {
        updateProfile(updated);
        setProfileSuccessMsg('प्रोफ़ाइल विवरण सफलतापूर्वक अपडेट कर दिया गया है!');
      } else {
        setProfileErrorMsg('अपडेट करने में विफल। यह यूजरनेम पहले से लिया जा चुका हो सकता है।');
      }
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'त्रुटि हुई।');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।', isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।', isError: true });
      return;
    }

    setChangingPassword(true);
    const res = await AuthService.changePassword(oldPassword, newPassword);
    setChangingPassword(false);

    if (res.success) {
      setPasswordMsg({ text: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!', isError: false });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ text: res.error || 'पासवर्ड बदलने में त्रुटि हुई।', isError: true });
    }
  };

  // Handle Unblock User
  const handleUnblock = async (userId: string) => {
    await AuthService.unblockUser(userId);
    setBlockedUsers(prev => prev.filter(u => u.id !== userId && u.user_id !== userId));
  };

  // Handle Accept Follow Request
  const handleAcceptRequest = async (requesterId: string) => {
    await acceptFollowRequest(requesterId);
  };

  // Handle Reject Follow Request
  const handleRejectRequest = async (requesterId: string) => {
    await rejectFollowRequest(requesterId);
  };

  // Handle Data Download
  const handleDownloadData = async () => {
    setExportingData(true);
    try {
      const data = await downloadMyDataPackage();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chhath_data_export_${currentUser.username.replace('@', '')}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'डेटा डाउनलोड करने में विफल।');
    } finally {
      setExportingData(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('पुष्टि करने के लिए ठीक "DELETE" टाइप करें।');
      return;
    }
    setDeletingAccount(true);
    setDeleteError(null);
    const res = await AuthService.deleteAccount('DELETE');
    setDeletingAccount(false);
    if (res.success) {
      logout();
      onClose();
    } else {
      setDeleteError(res.error || 'खाता हटाने में त्रुटि।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a0f08] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-white bg-black/40 hover:bg-black/60 rounded-full border border-white/10 transition-colors"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-amber-900/30 bg-[#120a05] p-5 flex flex-col shrink-0">
          <div className="flex items-center gap-3 pb-6 border-b border-white/5 mb-4">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-900/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-200">अकाउंट सेंटर</h3>
              <p className="text-xs text-stone-400">पहचान व सुरक्षा प्रबंधन</p>
            </div>
          </div>

          <nav className="space-y-1.5 flex-1 overflow-y-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>प्रोफ़ाइल विवरण</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>पासवर्ड व सुरक्षा</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'privacy'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>गोपनीयता व संपर्क</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'requests'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>फॉलो अनुरोध</span>
              </div>
              {pendingFollowRequests.length > 0 && (
                <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingFollowRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'blocked'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>ब्लॉक किए गए खाते</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI प्राथमिकताएं</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'data'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>डेटा व खाता नियंत्रण</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>इस डिवाइस से लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[80vh] md:max-h-[90vh]">
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-amber-300">व्यक्तिगत प्रोफ़ाइल विवरण</h2>
                <p className="text-xs text-stone-400">आपकी सांस्कृतिक पहचान और पब्लिक प्रोफाइल डेटा।</p>
              </div>

              {profileSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}
              {profileErrorMsg && (
                <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                  <img
                    src={avatarUrl || currentUser.avatarUrl}
                    alt={displayName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-md"
                  />
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-stone-300 mb-1">अवतार इमेज URL</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">पूरा नाम (Display Name)</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      यूनिक यूजरनेम (@username)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-stone-500">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full pl-7 pr-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">सांस्कृतिक परिचय (Bio)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">शहर (City)</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">राज्य (State)</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">वेबसाइट या ब्लॉग लिंक</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-stone-900 font-bold rounded-xl text-xs transition-all shadow-lg disabled:opacity-50"
                  >
                    {savingProfile ? 'अपडेट हो रहा है...' : 'परिवर्तन सहेजें'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-amber-300 mb-1">पासवर्ड व लॉगिन सुरक्षा</h2>
                <p className="text-xs text-stone-400">पासवर्ड बदलें और सक्रिय डिवाइस सत्रों की निगरानी करें।</p>
              </div>

              {passwordMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  passwordMsg.isError 
                    ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' 
                    : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                }`}>
                  {passwordMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              {/* Password Change Form */}
              <form onSubmit={handleChangePassword} className="space-y-3 max-w-md bg-black/30 p-4 rounded-2xl border border-white/5">
                <h3 className="text-sm font-semibold text-stone-200">पासवर्ड बदलें</h3>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">वर्तमान पासवर्ड</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">नया पासवर्ड (न्यूनतम 6 अक्षर)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">नए पासवर्ड की पुष्टि करें</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {changingPassword ? 'सहेजा जा रहा है...' : 'पासवर्ड अपडेट करें'}
                </button>
              </form>

              {/* Active Sessions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-200">सक्रिय लॉगिन डिवाइस व सत्र</h3>
                    <p className="text-xs text-stone-400">जिन उपकरणों पर आपका खाता वर्तमान में खुला हुआ है।</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={refreshActiveSessions}
                      className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                      title="ताजा करें"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    {activeSessions.length > 1 && (
                      <button
                        onClick={logoutAllOtherSessions}
                        className="px-3 py-1.5 bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-medium transition-colors"
                      >
                        अन्य सभी डिवाइस से लॉगआउट करें
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {activeSessions.length === 0 ? (
                    <div className="p-4 bg-black/20 rounded-xl text-center text-xs text-stone-400">
                      कोई अतिरिक्त सत्र दर्ज नहीं है।
                    </div>
                  ) : (
                    activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-stone-200">{session.deviceName}</span>
                              {session.isCurrent && (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded-md">
                                  वर्तमान डिवाइस
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-400">
                              {session.locationCity || 'Patna'} • IP: {session.ipAddress} • {new Date(session.lastActiveAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {!session.isCurrent && (
                          <button
                            onClick={() => revokeSession(session.id)}
                            className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                          >
                            लॉगआउट
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY & VISIBILITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-300 mb-1">गोपनीयता व संपर्क नियंत्रण</h2>
                <p className="text-xs text-stone-400">तय करें कि कौन आपके साथ संवाद कर सकता है और आपकी रील्स देख सकता है।</p>
              </div>

              {/* Private Account Switch */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-200">निजी खाता (Private Account)</h3>
                  <p className="text-xs text-stone-400 max-w-md">
                    सक्रिय होने पर, केवल स्वीकृत फॉलोअर्स ही आपकी रील्स, पोस्ट व विवरण देख सकेंगे। नए अनुयायियों को आपका अनुमोदन चाहिए होगा।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(userSettings?.is_private_account ?? currentUser.isPrivate)}
                    onChange={(e) => updateUserSettings({ is_private_account: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Direct Messages Permission */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-2">
                <h3 className="text-sm font-semibold text-stone-200">मुझे सीधे संदेश (Direct Messages) कौन भेज सकता है?</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['everyone', 'following', 'nobody'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateUserSettings({ who_can_message: opt })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        userSettings?.who_can_message === opt
                          ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                          : 'bg-black/20 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {opt === 'everyone' ? 'सभी भक्त' : opt === 'following' ? 'जिन्हें मैं फॉलो करता हूँ' : 'कोई नहीं'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice & Video Calls Permission */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-2">
                <h3 className="text-sm font-semibold text-stone-200">मुझे वॉइस व वीडियो कॉल कौन कर सकता है?</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['everyone', 'following', 'nobody'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateUserSettings({ who_can_call: opt })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        userSettings?.who_can_call === opt
                          ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                          : 'bg-black/20 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {opt === 'everyone' ? 'सभी' : opt === 'following' ? 'मेरे फॉलोअर्स' : 'कोई नहीं'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Permission */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-2">
                <h3 className="text-sm font-semibold text-stone-200">मेरी रील्स पर टिप्पणी कौन कर सकता है?</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['everyone', 'following', 'nobody'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateUserSettings({ who_can_comment: opt })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        userSettings?.who_can_comment === opt
                          ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                          : 'bg-black/20 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {opt === 'everyone' ? 'सभी भक्त' : opt === 'following' ? 'केवल अनुयायी' : 'बंद'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Status Toggle */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-200">सक्रियता स्थिति दिखाएं (Activity Status)</h3>
                  <p className="text-xs text-stone-400">दिखाएं कि आप छठ कनेक्ट में कब ऑनलाइन हैं।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(userSettings?.show_activity_status ?? true)}
                    onChange={(e) => updateUserSettings({ show_activity_status: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: FOLLOW REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-amber-300 mb-1">लंबित फॉलो अनुरोध</h2>
                <p className="text-xs text-stone-400">यदि आपका खाता निजी है, तो नए उपयोगकर्ता आपसे जुड़ने के लिए अनुरोध भेजते हैं।</p>
              </div>

              {pendingFollowRequests.length === 0 ? (
                <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5">
                  <UserCheck className="w-10 h-10 text-stone-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-300">कोई लंबित अनुरोध नहीं है</p>
                  <p className="text-xs text-stone-500">जब कोई नया भक्त आपको फॉलो करना चाहेगा, वह यहाँ दिखाई देगा।</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingFollowRequests.map((reqUser) => (
                    <div
                      key={reqUser.id}
                      className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={reqUser.avatarUrl}
                          alt={reqUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                        />
                        <div>
                          <p className="text-xs font-semibold text-stone-100">{reqUser.name}</p>
                          <p className="text-[11px] text-amber-400/80">{reqUser.username} • {reqUser.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptRequest(reqUser.id)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-lg text-xs transition-colors"
                        >
                          स्वीकार करें
                        </button>
                        <button
                          onClick={() => handleRejectRequest(reqUser.id)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-lg text-xs transition-colors"
                        >
                          अस्वीकार
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BLOCKED ACCOUNTS */}
          {activeTab === 'blocked' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-amber-300 mb-1">ब्लॉक किए गए खाते</h2>
                <p className="text-xs text-stone-400">ब्लॉक किए गए खाते आपकी सामग्री नहीं देख सकते और न ही आपको संदेश भेज सकते हैं।</p>
              </div>

              {loadingBlocked ? (
                <div className="p-8 text-center text-xs text-stone-400">लोड हो रहा है...</div>
              ) : blockedUsers.length === 0 ? (
                <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5">
                  <UserX className="w-10 h-10 text-stone-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-300">कोई ब्लॉक किया गया खाता नहीं है</p>
                  <p className="text-xs text-stone-500">आपने किसी भी उपयोगकर्ता को ब्लॉक नहीं किया है।</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {blockedUsers.map((bUser) => (
                    <div
                      key={bUser.id}
                      className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={bUser.avatarUrl}
                          alt={bUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-700"
                        />
                        <div>
                          <p className="text-xs font-semibold text-stone-100">{bUser.name}</p>
                          <p className="text-[11px] text-stone-400">{bUser.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnblock(bUser.id)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        अनब्लॉक करें
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AI PREFERENCES */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-300 mb-1">AI प्राथमिकताएं व वैयक्तिकरण</h2>
                <p className="text-xs text-stone-400">छठ महापर्व AI एजेंट और सांस्कृतिक सहायक के व्यवहार को नियंत्रित करें।</p>
              </div>

              {/* Cultural Personalization */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-stone-200">AI सांस्कृतिक वैयक्तिकरण</h3>
                  </div>
                  <p className="text-xs text-stone-400 max-w-md">
                    आपकी रुचि, भक्ति गीतों के इतिहास और पूजा विधि के आधार पर होम फ़ीड और सुझावों को स्वतः अनुकूलित करें।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(userSettings?.ai_personalization_enabled ?? true)}
                    onChange={(e) => updateUserSettings({ ai_personalization_enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* AI Voice Assistant */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-200">AI वॉइस असिस्टेंट (Voice Synthesis)</h3>
                  <p className="text-xs text-stone-400 max-w-md">
                    पूजा विधि व कथाओं का उत्तर पारंपरिक व मधुर स्वर में सुनकर प्राप्त करें।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(userSettings?.ai_voice_enabled ?? true)}
                    onChange={(e) => updateUserSettings({ ai_voice_enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Chat Smart Suggestions */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-200">चैट में स्मार्ट सांस्कृतिक सुझाव</h3>
                  <p className="text-xs text-stone-400 max-w-md">
                    छठ कनेक्ट संदेशों में छठ गीत, घाट और बधाई संदेशों के त्वरित स्मार्ट कार्ड सुझाव दिखाएं।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(userSettings?.ai_chat_suggestions ?? true)}
                    onChange={(e) => updateUserSettings({ ai_chat_suggestions: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 7: DATA DOWNLOAD & ACCOUNT DELETION */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-300 mb-1">आपकी जानकारी व डेटा अधिकार</h2>
                <p className="text-xs text-stone-400">अपने सभी डेटा की प्रतिलिपि डाउनलोड करें या खाता निष्क्रिय/हटाएं।</p>
              </div>

              {/* Download My Data */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-stone-200">अपनी संपूर्ण जानकारी डाउनलोड करें (Download My Data)</h3>
                  </div>
                  <p className="text-xs text-stone-400 max-w-md">
                    आपकी प्रोफ़ाइल, अपलोड की गई रील्स, टिप्पणियां, लाइक, सहेजे गए वीडियो, संदेश, सक्रिय डिवाइस और सेटिंग्स का संपूर्ण JSON पैकेज।
                  </p>
                </div>
                <button
                  onClick={handleDownloadData}
                  disabled={exportingData}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl text-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  {exportingData ? 'तैयार हो रहा है...' : 'डेटा निर्यात करें (JSON)'}
                </button>
              </div>

              {/* Danger Zone: Account Deletion */}
              <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                  <h3 className="text-sm font-bold">खाता स्थायी रूप से हटाएं (Delete Account)</h3>
                </div>
                <p className="text-xs text-stone-400">
                  चेतावनी: यह क्रिया अपरिवर्तनीय है। आपकी प्रोफ़ाइल, सभी रील्स, टिप्पणियां, संदेश, फ़ॉलोअर्स और सेटिंग्स हमारे रिलेशनल डेटाबेस से हमेशा के लिए हटा दिए जाएंगे।
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-semibold transition-colors"
                  >
                    मेरा खाता हटाएं...
                  </button>
                ) : (
                  <div className="pt-2 space-y-2 max-w-sm">
                    {deleteError && (
                      <p className="text-xs text-rose-400">{deleteError}</p>
                    )}
                    <label className="block text-xs text-stone-300">
                      पुष्टि करने के लिए नीचे <strong>DELETE</strong> टाइप करें:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="w-full px-3 py-2 bg-black/60 border border-rose-500/50 rounded-xl text-xs text-white uppercase focus:outline-none"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount || deleteConfirmText !== 'DELETE'}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-40"
                      >
                        {deletingAccount ? 'हटाया जा रहा है...' : 'हाँ, स्थायी रूप से हटाएं'}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                          setDeleteError(null);
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-stone-300 rounded-xl text-xs"
                      >
                        रद्द करें
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
