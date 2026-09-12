import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Send, 
  Check, 
  Search, 
  Film, 
  Music, 
  MapPin, 
  Calendar,
  Users
} from 'lucide-react';
import { ReelsStorage } from '../../services/reelsStorage';

export const ShareToChatModal: React.FC = () => {
  const { 
    shareModalOpen, 
    shareData, 
    closeShareModal, 
    conversations, 
    shareContentToConversations 
  } = useChat();

  const { currentUser } = useAuth();
  const [selectedConvIds, setSelectedConvIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!shareModalOpen || !shareData) return null;

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedConvIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    let name = c.name || '';
    if (c.type === 'direct' && currentUser) {
      const otherId = c.participantIds.find(id => id !== currentUser.id) || '';
      const otherUser = ReelsStorage.findUserById(otherId);
      name = otherUser?.name || otherUser?.username || '';
    }
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSend = async () => {
    if (selectedConvIds.length === 0) return;
    setIsSending(true);
    await shareContentToConversations(selectedConvIds, note);
    setIsSending(false);
    setSelectedConvIds([]);
    setNote('');
  };

  const getIcon = () => {
    switch (shareData.type) {
      case 'reel': return <Film className="w-4 h-4 text-pink-400" />;
      case 'song': return <Music className="w-4 h-4 text-amber-400" />;
      case 'ghat': return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'plan': return <Calendar className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {getIcon()}
            </span>
            <div>
              <h3 className="text-base font-bold text-white">छठ कनेक्ट पर साझा करें</h3>
              <p className="text-xs text-slate-400">मित्रों एवं परिवार समूहों को भेजें</p>
            </div>
          </div>
          <button 
            onClick={closeShareModal}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Preview Card */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            {shareData.thumbnail && (
              <img 
                src={shareData.thumbnail} 
                alt={shareData.title}
                className="w-14 h-14 rounded-xl object-cover border border-amber-500/30"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold mb-0.5">
                {getIcon()}
                <span className="capitalize">{shareData.type === 'reel' ? 'रील' : shareData.type === 'song' ? 'भजन' : shareData.type === 'ghat' ? 'घाट' : 'योजना'}</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate">{shareData.title}</h4>
              {shareData.subtitle && (
                <p className="text-xs text-slate-400 truncate">{shareData.subtitle}</p>
              )}
            </div>
          </div>

          {/* Optional Note input */}
          <div className="mt-3">
            <input 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="एक पावन संदेश लिखें... (उदा: जय छठी मइया! 🙏)"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>
        </div>

        {/* Search recipients */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="संपर्क या समूह खोजें..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              कोई संपर्क या समूह नहीं मिला।
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = selectedConvIds.includes(conv.id);
              let convName = conv.name || '';
              let convAvatar = conv.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80';
              let convSub = conv.type === 'group' ? `${conv.participantIds.length} सदस्य` : 'सीधा संवाद';

              if (conv.type === 'direct' && currentUser) {
                const otherId = conv.participantIds.find(id => id !== currentUser.id) || '';
                const otherUser = ReelsStorage.findUserById(otherId);
                if (otherUser) {
                  convName = otherUser.name;
                  convAvatar = otherUser.avatarUrl;
                  convSub = `@${otherUser.username}`;
                }
              }

              return (
                <div
                  key={conv.id}
                  onClick={() => toggleSelect(conv.id)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-amber-500/20 border-amber-500/50' 
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={convAvatar} 
                      alt={convName} 
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center space-x-1.5">
                        <span>{convName}</span>
                        {conv.type === 'group' && <Users className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="text-xs text-slate-400">{convSub}</div>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' 
                      : 'border-slate-600 text-transparent'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Send Button */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {selectedConvIds.length} चयनित
          </span>

          <button
            disabled={selectedConvIds.length === 0 || isSending}
            onClick={handleSend}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>{isSending ? 'भेज रहे हैं...' : 'साझा करें'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
