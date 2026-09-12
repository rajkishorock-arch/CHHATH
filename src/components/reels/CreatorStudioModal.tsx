import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reelId: string) => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  isOpen,
  onClose,
  onSelectReel
}) => {
  const { allReels } = useReels();
  const { currentUser } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | 'all'>('7d');

  if (!isOpen || !currentUser) return null;

  const myReels = allReels.filter(r => r.creatorId === currentUser.id);

  // Totals
  const totalViews = myReels.reduce((acc, r) => acc + r.viewsCount, 0);
  const totalLikes = myReels.reduce((acc, r) => acc + r.likesCount, 0);
  const totalComments = myReels.reduce((acc, r) => acc + r.commentsCount, 0);
  const totalShares = myReels.reduce((acc, r) => acc + r.sharesCount, 0);
  const totalSaves = myReels.reduce((acc, r) => acc + r.savesCount, 0);

  // Top performing reel
  const topReel = [...myReels].sort((a, b) => b.viewsCount - a.viewsCount)[0];

  // Simulated day-by-day views for 7 days
  const daysData = [
    { day: 'सोम', views: Math.round(totalViews * 0.12) || 450 },
    { day: 'मंगल', views: Math.round(totalViews * 0.14) || 620 },
    { day: 'बुध', views: Math.round(totalViews * 0.11) || 510 },
    { day: 'गुरु', views: Math.round(totalViews * 0.18) || 840 },
    { day: 'शुक्र', views: Math.round(totalViews * 0.15) || 720 },
    { day: 'शनि', views: Math.round(totalViews * 0.22) || 1100 },
    { day: 'रवि', views: Math.round(totalViews * 0.25) || 1450 }
  ];
  const maxDayView = Math.max(...daysData.map(d => d.views), 1);

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-800 bg-stone-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-rozha text-xl font-bold leading-tight">छठ क्रिएटर स्टूडियो (Creator Studio)</h2>
              <span className="text-[10px] text-stone-400 font-mono">{currentUser.username} • एनालिटिक्स</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>कुल व्यूज (Views)</span>
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {totalViews.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4% इस सप्ताह
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>कुल लाइक्स (Likes)</span>
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {totalLikes.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12.1%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>फॉलोअर्स (Followers)</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {currentUser.followersCount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-amber-400">
                {currentUser.followingCount} फॉलोइंग
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>टिप्पणियां (Comments)</span>
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {totalComments.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>शेयर्स (Shares)</span>
                <Share2 className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {totalShares.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>सेव्ड (Saves)</span>
                <Bookmark className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {totalSaves.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Views Over Time Visual Chart */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>दैनिक व्यूज वृद्धि (Views Over Time)</span>
              </div>
              <div className="flex gap-1 bg-stone-900 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setSelectedTimeframe('7d')}
                  className={`px-2 py-0.5 rounded ${selectedTimeframe === '7d' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'}`}
                >
                  7 दिन
                </button>
                <button
                  onClick={() => setSelectedTimeframe('30d')}
                  className={`px-2 py-0.5 rounded ${selectedTimeframe === '30d' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'}`}
                >
                  30 दिन
                </button>
              </div>
            </div>

            {/* Bar Chart Visual */}
            <div className="h-36 flex items-end justify-between gap-2 pt-6 px-2">
              {daysData.map((d, i) => {
                const heightPercent = Math.max(15, Math.round((d.views / maxDayView) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] text-stone-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.views}
                    </span>
                    <div 
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-yellow-400 group-hover:brightness-110 transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-stone-400 font-bold">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performing Reel */}
          {topReel && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-orange-950/30 border border-amber-500/30 flex items-center gap-4">
              <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-amber-500/40">
                <img src={topReel.thumbnailUrl} alt={topReel.title} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 p-0.5 rounded bg-amber-500 text-stone-950">
                  <Award className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  सर्वश्रेष्ठ प्रदर्शन वाली रील (Top Performing)
                </div>
                <h4 className="font-rozha text-base text-white truncate font-bold">{topReel.title}</h4>
                <div className="flex items-center gap-3 text-xs text-stone-300 font-mono">
                  <span>👁️ {topReel.viewsCount.toLocaleString('en-IN')}</span>
                  <span>❤️ {topReel.likesCount.toLocaleString('en-IN')}</span>
                  <span>💬 {topReel.commentsCount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                onClick={() => onSelectReel(topReel.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shrink-0 shadow"
              >
                देखें
              </button>
            </div>
          )}

          {/* Reel-by-Reel Detailed Performance */}
          <div className="space-y-3">
            <h3 className="font-rozha text-base font-bold text-white">आपकी सभी रील्स का विस्तृत विश्लेषण</h3>
            {myReels.length === 0 ? (
              <div className="text-center py-6 text-stone-400 text-xs">
                आपने अभी तक कोई रील प्रकाशित नहीं की है।
              </div>
            ) : (
              <div className="space-y-2">
                {myReels.map(r => (
                  <div
                    key={r.id}
                    onClick={() => onSelectReel(r.id)}
                    className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-400/40 flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={r.thumbnailUrl} alt={r.title} className="w-10 h-14 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate font-mukta">{r.title}</div>
                        <div className="text-[10px] text-amber-400 font-mono">{r.category} • {r.status}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-300 font-mono shrink-0">
                      <span className="text-center">
                        <div className="font-bold text-white">{r.viewsCount}</div>
                        <div className="text-[9px] text-stone-500">व्यूज</div>
                      </span>
                      <span className="text-center">
                        <div className="font-bold text-red-400">{r.likesCount}</div>
                        <div className="text-[9px] text-stone-500">लाइक्स</div>
                      </span>
                      <span className="text-center">
                        <div className="font-bold text-amber-400">{r.sharesCount}</div>
                        <div className="text-[9px] text-stone-500">शेयर</div>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
