import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Flag, 
  Eye, 
  Sliders, 
  UserX,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { ReelsStorage } from '../../services/reelsStorage';

interface ReelsModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reelId: string) => void;
}

export const ReelsModerationModal: React.FC<ReelsModerationModalProps> = ({
  isOpen,
  onClose,
  onSelectReel
}) => {
  const { 
    allReels, 
    reports, 
    resolveReport, 
    adminApproveReel, 
    adminRejectReel, 
    adminDeleteReel 
  } = useReels();
  const { currentUser } = useAuth();

  const [tab, setTab] = useState<'pending' | 'reported' | 'settings'>('pending');
  const [autoPublish, setAutoPublish] = useState<boolean>(() => ReelsStorage.isAutoPublishEnabled());

  if (!isOpen) return null;

  const pendingReels = allReels.filter(r => r.status === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');

  const handleToggleAutoPublish = () => {
    const next = !autoPublish;
    setAutoPublish(next);
    ReelsStorage.setAutoPublishEnabled(next);
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-stone-950 border border-red-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-800 bg-stone-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldCheck className="w-5 h-5" />
            <div>
              <h2 className="font-rozha text-xl font-bold text-white leading-tight">
                छठ मॉडरेशन व सुरक्षा डैशबोर्ड (Admin Moderation)
              </h2>
              <span className="text-[10px] text-stone-400">पवित्रता, कॉपीराइट व संस्कृति संरक्षण कंसोल</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-900/30">
          <button
            onClick={() => setTab('pending')}
            className={`flex-1 py-3 text-xs font-bold font-mukta flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'pending'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>स्वीकृति हेतु लंबित ({pendingReels.length})</span>
          </button>

          <button
            onClick={() => setTab('reported')}
            className={`flex-1 py-3 text-xs font-bold font-mukta flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'reported'
                ? 'border-red-500 text-red-400 bg-red-500/10'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>रिपोर्ट की गई रील्स ({pendingReports.length})</span>
          </button>

          <button
            onClick={() => setTab('settings')}
            className={`flex-1 py-3 text-xs font-bold font-mukta flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'settings'
                ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>सुरक्षा नियम (Rules)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* PENDING APPROVAL REELS */}
          {tab === 'pending' && (
            pendingReels.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <Check className="w-10 h-10 mx-auto text-emerald-400" />
                <p className="font-rozha text-base text-stone-300">सभी रील्स स्वीकृत हैं!</p>
                <p className="text-xs text-stone-500">कोई नई रील समीक्षा के लिए प्रतीक्षारत नहीं है।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReels.map(reel => (
                  <div
                    key={reel.id}
                    className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={reel.thumbnailUrl} alt={reel.title} className="w-12 h-16 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-rozha text-sm font-bold text-white truncate">{reel.title}</h4>
                        <div className="text-xs text-amber-400 font-mono">{reel.creatorName} ({reel.creatorUsername})</div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 inline-block mt-1">
                          {reel.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onSelectReel(reel.id)}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1"
                        title="देखें"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => adminRejectReel(reel.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold"
                      >
                        अस्वीकार (Reject)
                      </button>
                      <button
                        onClick={() => adminApproveReel(reel.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>स्वीकृत करें (Approve)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* REPORTED CONTENT */}
          {tab === 'reported' && (
            pendingReports.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <Flag className="w-10 h-10 mx-auto text-stone-600" />
                <p className="font-mukta text-sm text-stone-300">कोई सक्रिय रिपोर्ट नहीं है।</p>
                <p className="text-xs text-stone-500">मंच पूर्णतः स्वच्छ व मर्यादित है।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReports.map(rep => (
                  <div
                    key={rep.id}
                    className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-300">
                        {rep.reason}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(rep.timestamp).toLocaleDateString('hi-IN')}
                      </span>
                    </div>

                    <div className="text-xs text-white">
                      <strong>रील:</strong> {rep.reelTitle}
                    </div>

                    {rep.details && (
                      <p className="text-xs text-stone-300 bg-stone-900/60 p-2 rounded-xl font-mukta">
                        “{rep.details}”
                      </p>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => onSelectReel(rep.reelId)}
                        className="px-3 py-1 rounded-xl bg-stone-900 text-xs text-stone-300 hover:text-white"
                      >
                        रील देखें
                      </button>
                      <button
                        onClick={() => { adminDeleteReel(rep.reelId); resolveReport(rep.id); }}
                        className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> रील हटाएं
                      </button>
                      <button
                        onClick={() => resolveReport(rep.id)}
                        className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
                      >
                        खारिज करें (Dismiss)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* RULES & AUTO-PUBLISH SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">ऑटो-पब्लिश (Auto-Publishing)</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    सक्रिय होने पर सत्यापित भक्तों की रील्स तुरंत लाइव होंगी बिना मैनुअल अप्रूवल के।
                  </p>
                </div>
                <button
                  onClick={handleToggleAutoPublish}
                  className={`w-12 h-6 rounded-full transition-colors relative ${autoPublish ? 'bg-emerald-600' : 'bg-stone-800'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${autoPublish ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
                <h4 className="font-bold text-sm text-amber-300">छठ महापर्व सांस्कृतिक दिशा-निर्देश</h4>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4 font-mukta">
                  <li>केवल छठ पूजा, सूर्य उपासना, घाट दर्शन, पारंपरिक गीत व महाप्रसाद से संबंधित वीडियो मान्य हैं।</li>
                  <li>अश्लील, अमर्यादित, या क्षेत्रीय सौहार्द बिगाड़ने वाली किसी भी सामग्री पर तत्काल स्थायी रोक।</li>
                  <li>पारंपरिक लोकगीतों के कॉपीराइट का पूर्ण सम्मान किया जाए।</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
