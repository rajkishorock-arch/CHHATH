import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Upload, 
  Video, 
  Music, 
  Play, 
  Pause, 
  Check, 
  Layers, 
  Film, 
  Hash, 
  Wand2, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  CheckCircle2, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { ReelsStorage } from '../../services/reelsStorage';
import { ReelCategory, ReelPrivacy } from '../../types';

interface StoryboardScene {
  id: string;
  name: string;
  thumbnail: string;
  suggestedDuration: string;
}

export const AIReelStudioModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { createReel, openReelsPlatform } = useReels();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<'upload' | 'analyzing' | 'studio' | 'published'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [scenes, setScenes] = useState<StoryboardScene[]>([]);
  
  // Generated & Editable Metadata
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<ReelCategory>('Chhath Geet');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#ChhathPuja', '#ChhathiMaiya', '#Bihar', '#MahaParv']);
  const [selectedAudioId, setSelectedAudioId] = useState<string>('audio_1');
  const [privacy, setPrivacy] = useState<ReelPrivacy>('public');
  const [publishedReelId, setPublishedReelId] = useState<string | null>(null);

  // Preview video state
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioTracks = ReelsStorage.getAudioTracks();

  if (!isOpen) return null;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadedFiles(files);
    setStep('analyzing');

    // Simulate AI Storyboard & Metadata generation
    setTimeout(() => {
      const generatedScenes: StoryboardScene[] = [
        {
          id: 'sc-1',
          name: 'दृश्य 1: सूप व दउरा सज्जा (Preparation)',
          thumbnail: '/images/daura_arghya.jpg',
          suggestedDuration: '0:12'
        },
        {
          id: 'sc-2',
          name: 'दृश्य 2: गंगा तट की पावन शोभा (Ghat Procession)',
          thumbnail: '/images/hero_sunrise.jpg',
          suggestedDuration: '0:18'
        },
        {
          id: 'sc-3',
          name: 'दृश्य 3: अस्ताचलगामी सूर्य को अर्घ्य (Sandhya Arghya)',
          thumbnail: '/images/chhath_sandhya_arghya.jpg',
          suggestedDuration: '0:15'
        }
      ];

      setScenes(generatedScenes);
      setTitle('छठ महापर्व की पावन छटा — अस्ताचलगामी सूर्य को प्रथम अर्घ्य');
      setCaption('पवित्रता, अनुशासन और अगाध आस्था का महापर्व छठ। गंगा तट पर गूंजते शारदा सिन्हा जी के पावन गीत और जल में खड़े व्रतियों की भक्ति। जय छठी मईया! 🙏✨');
      setCategory('Sandhya Arghya');
      setSelectedAudioId('audio_1');
      setStep('studio');
    }, 1800);
  };

  const handlePublish = async () => {
    if (!currentUser) return;

    const selectedTrack = audioTracks.find(t => t.id === selectedAudioId) || audioTracks[0];

    const newReel = await createReel({
      title,
      description: caption,
      category,
      tags: selectedTags,
      videoUrl: '/videos/sample3.mp4', // Local high-performance video stream
      thumbnailUrl: '/images/chhath_sandhya_arghya.jpg',
      videoDuration: '0:45',
      privacy,
      audioId: selectedTrack.id,
      audioTitle: selectedTrack.title,
      audioArtist: selectedTrack.artist
    });

    if (newReel) {
      setPublishedReelId(newReel.id);
      setStep('published');
    }
  };

  const togglePreviewPlay = () => {
    if (videoRef.current) {
      if (isPlayingPreview) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlayingPreview(!isPlayingPreview);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-500/40 paramprik-border flex flex-col h-[90vh] max-h-[820px] overflow-hidden text-stone-900 dark:text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-stone-950 flex items-center justify-center shadow-lg">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-rozha text-xl font-bold">AI Reel Studio (रील क्रिएटर)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                  9:16 AI Powered
                </span>
              </div>
              <span className="text-xs font-mukta text-stone-500 dark:text-stone-400">
                फोटो व वीडियो से स्वचालित स्टोरीबोर्ड, शीर्षक, हैशटैग व अनुमोदित संगीत
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: UPLOAD MEDIA */}
        {step === 'upload' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xl">
              <Film className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md">
              <h4 className="font-rozha text-2xl font-bold">छठ पूजा की फोटो अथवा वीडियो क्लिप्स चुनें</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mukta leading-relaxed">
                AI आपके मीडिया का अनुक्रम तय करेगा, कथा क्रम बनाएगा, पारंपरिक भक्ति गीत जोड़ेगा और सोशल मीडिया हेतु 9:16 रील तैयार करेगा।
              </p>
            </div>

            <label className="cursor-pointer group">
              <input
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <div className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm shadow-xl flex items-center gap-2 transition-all group-hover:scale-105">
                <Upload className="w-4 h-4" />
                <span>मीडिया अपलोड करें (Upload Clips)</span>
              </div>
            </label>

            <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-4">
              <span>✓ 100% कॉपीराइट सुरक्षित अनुमोदित संगीत</span>
              <span>•</span>
              <span>✓ 9:16 वर्टिकल स्नैप</span>
              <span>•</span>
              <span>✓ स्वचालित कैप्शन</span>
            </div>
          </div>
        )}

        {/* STEP 2: ANALYZING SPINNER */}
        {step === 'analyzing' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-rozha text-xl font-bold">AI दृश्य व अनुक्रम का विश्लेषण कर रहा है...</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                कहानी क्रम, भक्तिपूर्ण शीर्षक, और शारदा सिन्हा जी के पावन संगीत का मिलान किया जा रहा है।
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: STUDIO EDITOR */}
        {step === 'studio' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: 9:16 Video Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[260px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-amber-500/40 shadow-2xl flex items-center justify-center group">
                <video
                  ref={videoRef}
                  src="/videos/sample3.mp4"
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={togglePreviewPlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-80 hover:opacity-100 transition-opacity"
                >
                  {isPlayingPreview ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 fill-white" />}
                </button>

                {/* Live Caption & Hashtag Preview Overlay */}
                <div className="absolute bottom-4 left-3 right-3 text-white pointer-events-none space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 font-mono">@{currentUser?.username || 'creator'}</span>
                  <p className="text-[11px] font-mukta line-clamp-2 leading-tight drop-shadow-md">
                    {caption}
                  </p>
                  <p className="text-[9px] text-amber-300 font-mono">
                    {selectedTags.join(' ')}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-stone-400 mt-2 font-mono">
                9:16 Instagram / Reels Format Preview
              </span>
            </div>

            {/* Right: Studio Controls & Storyboard */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* AI Generated Storyboard Sequence */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>AI अनुशंसित दृश्य क्रम (Storyboard Sequence)</span>
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {scenes.map(s => (
                    <div key={s.id} className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/20 text-center space-y-1">
                      <img src={s.thumbnail} alt={s.name} className="w-full h-14 rounded-lg object-cover" />
                      <p className="text-[10px] font-bold truncate">{s.name}</p>
                      <span className="text-[9px] text-stone-400 block font-mono">{s.suggestedDuration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Caption Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300">रील शीर्षक (Title)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-amber-500/30 text-xs font-mukta text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300">कैप्शन (Caption)</label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-amber-500/30 text-xs font-mukta text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Audio Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-500" />
                  <span>अनुमोदित पारंपरिक भक्ति संगीत (Approved Audio)</span>
                </label>

                <select
                  value={selectedAudioId}
                  onChange={e => setSelectedAudioId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-amber-500/30 text-xs text-stone-900 dark:text-stone-100 outline-none"
                >
                  {audioTracks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} — {t.artist} ({t.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold"
                >
                  रद्द करें
                </button>

                <button
                  onClick={handlePublish}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>रील प्रकाशित करें (Publish Reel)</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* STEP 4: PUBLISHED SUCCESS */}
        {step === 'published' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shadow-2xl">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="font-rozha text-2xl font-bold">रील सफलतापूर्वक प्रकाशित हो गई! 🎉</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                आपकी छठ रील अब डायनामिक फीड में सक्रिय है। सभी श्रद्धालु इसे देख सकते हैं।
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (publishedReelId) {
                    openReelsPlatform('foryou', publishedReelId);
                  } else {
                    openReelsPlatform('foryou');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-400"
              >
                <Eye className="w-4 h-4" />
                <span>अभी रील देखें</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
