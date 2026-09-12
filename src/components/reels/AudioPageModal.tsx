import React from 'react';
import { X, Music, Play, Disc, Sparkles, Film, ExternalLink } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { ReelsStorage } from '../../services/reelsStorage';
import { DynamicReel } from '../../types';

interface AudioPageModalProps {
  audioId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reelId: string, customList?: DynamicReel[]) => void;
  onUseAudio: (audioId: string) => void;
}

export const AudioPageModal: React.FC<AudioPageModalProps> = ({
  audioId,
  isOpen,
  onClose,
  onSelectReel,
  onUseAudio
}) => {
  const { allReels } = useReels();
  const audioTracks = ReelsStorage.getAudioTracks();

  if (!isOpen || !audioId) return null;

  const audio = audioTracks.find(a => a.id === audioId) || audioTracks[0];
  const reelsWithThisAudio = allReels.filter(r => r.audioId === audio.id && r.status === 'approved');

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-800 bg-stone-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <Music className="w-5 h-5 text-amber-400" />
            <h2 className="font-rozha text-xl font-bold">छठ पावन धुन (Chhath Audio)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Audio Banner Header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-3xl bg-stone-900/60 border border-stone-800">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black shadow-xl border border-amber-500/40 shrink-0">
              <img src={audio.coverUrl} alt={audio.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Disc className="w-10 h-10 text-amber-400 animate-spin-slow" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h3 className="font-rozha text-2xl font-bold text-white leading-snug">
                {audio.title}
              </h3>
              <p className="text-sm text-amber-400 font-semibold">{audio.artist}</p>
              <div className="text-xs text-stone-400 font-mono pt-1">
                {reelsWithThisAudio.length} रील्स • {audio.duration}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { onUseAudio(audio.id); onClose(); }}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 mx-auto sm:mx-0 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>इस धुन पर रील बनाएं (Use this audio)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reels using this Audio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Film className="w-4 h-4 text-amber-400" />
              <span>इस पावन धुन की सभी रील्स ({reelsWithThisAudio.length})</span>
            </div>

            {reelsWithThisAudio.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                अभी तक किसी श्रद्धालु ने इस धुन पर रील नहीं बनाई है। पहली रील आप बनाएं!
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {reelsWithThisAudio.map(reel => (
                  <div
                    key={reel.id}
                    onClick={() => { onSelectReel(reel.id, reelsWithThisAudio); onClose(); }}
                    className="relative aspect-[9/16] bg-stone-900 rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white font-mukta line-clamp-1 font-bold">
                      {reel.title}
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
