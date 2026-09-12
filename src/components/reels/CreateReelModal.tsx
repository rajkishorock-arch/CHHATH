import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Camera, 
  Sparkles, 
  Scissors, 
  Image as ImageIcon, 
  Music, 
  Globe, 
  Lock, 
  Users, 
  FileText, 
  Check, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { ReelCategory, ReelPrivacy } from '../../types';
import { ReelsStorage } from '../../services/reelsStorage';
import { AIReelStudioModal } from './AIReelStudioModal';

const CATEGORIES: ReelCategory[] = [
  'Chhath Geet',
  'Puja Preparation',
  'Sandhya Arghya',
  'Usha Arghya',
  'Ghat',
  'Thekua / Prasad',
  'Chhath Decoration',
  'Family',
  'Culture',
  'Travel',
  'Devotional',
  'Other'
];

const SUGGESTED_HASHTAGS = [
  '#ChhathPuja',
  '#ChhathiMaiya',
  '#Chhath2026',
  '#Bihar',
  '#ChhathGeet',
  '#SandhyaArghya',
  '#UshaArghya',
  '#ChhathGhat',
  '#ThekuaPrasad',
  '#MahaParv'
];

export const CreateReelModal: React.FC = () => {
  const { createModalOpen, closeCreateModal, createReel, saveDraft } = useReels();
  const { currentUser } = useAuth();

  // Mode: upload | record
  const [creationMode, setCreationMode] = useState<'upload' | 'record'>('upload');
  const [aiStudioOpen, setAiStudioOpen] = useState(false);

  // Video source & recording
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);

  // Form Fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<ReelCategory>('Chhath Geet');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#ChhathPuja', '#ChhathiMaiya']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [privacy, setPrivacy] = useState<ReelPrivacy>('public');
  const [selectedAudioId, setSelectedAudioId] = useState<string>('audio_1');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  // Trimming State
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [videoDurationSec, setVideoDurationSec] = useState(30);

  // Processing & UI
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const livePreviewRef = useRef<HTMLVideoElement>(null);

  const audioTracks = ReelsStorage.getAudioTracks();

  // Clean up camera on unmount or close
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  if (!createModalOpen) return null;

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMsg('कृपया केवल वीडियो फाइल (MP4, WebM, MOV) अपलोड करें।');
      return;
    }

    if (file.size > 80 * 1024 * 1024) {
      setErrorMsg('वीडियो का आकार 80MB से कम होना चाहिए।');
      return;
    }

    setErrorMsg(null);
    setVideoFile(file);
    setVideoBlob(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Auto extract thumbnail
    generateThumbnailFromUrl(url);
  };

  // Live Camera Recording
  const startCameraRecording = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 1280 }, facingMode: 'user' },
        audio: true
      });
      cameraStreamRef.current = stream;
      if (livePreviewRef.current) {
        livePreviewRef.current.srcObject = stream;
      }

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(recordedBlob);
        const url = URL.createObjectURL(recordedBlob);
        setVideoPreviewUrl(url);
        generateThumbnailFromUrl(url);
        if (cameraStreamRef.current) {
          cameraStreamRef.current.getTracks().forEach(t => t.stop());
          cameraStreamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(200);
      setIsRecording(true);
      setRecordDuration(0);

      const timer = setInterval(() => {
        setRecordDuration(prev => {
          if (prev >= 60) {
            stopCameraRecording();
            clearInterval(timer);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      setErrorMsg('कैमरा या माइक्रोफोन का एक्सेस नहीं मिल सका। कृपया अनुमति जांचें।');
    }
  };

  const stopCameraRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Extract Thumbnail via Canvas
  const generateThumbnailFromUrl = (url: string) => {
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
    video.currentTime = 1;
    video.onloadeddata = () => {
      video.currentTime = Math.min(1.5, video.duration / 2);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 854;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbData = canvas.toDataURL('image/jpeg', 0.85);
          setThumbnailUrl(thumbData);
        }
      } catch {
        // fallback
      }
    };
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const addCustomTag = () => {
    let clean = customTagInput.trim();
    if (!clean) return;
    if (!clean.startsWith('#')) clean = `#${clean}`;
    if (!selectedTags.includes(clean)) {
      setSelectedTags(prev => [...prev, clean]);
    }
    setCustomTagInput('');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoBlob && !videoPreviewUrl) {
      setErrorMsg('कृपया पहले वीडियो चुनें या रिकॉर्ड करें।');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('कृपया रील का शीर्षक लिखें।');
      return;
    }

    setErrorMsg(null);
    setIsPublishing(true);
    setUploadProgress(10);

    // Simulate smooth processing progress
    const progressInterval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return p + 20;
      });
    }, 250);

    try {
      const selectedAudio = audioTracks.find(a => a.id === selectedAudioId);
      await createReel({
        title,
        description: caption,
        category,
        tags: selectedTags,
        privacy,
        videoBlob: videoBlob || undefined,
        videoUrl: videoPreviewUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        audioId: selectedAudioId,
        audioTitle: selectedAudio?.title || 'कांच ही बांस के बहंगिया',
        audioArtist: selectedAudio?.artist || 'शारदा सिन्हा',
        videoDuration: `0:${Math.round(videoDurationSec)}`
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsPublishing(false);
      setPublishSuccess(true);

      setTimeout(() => {
        setPublishSuccess(false);
        closeCreateModal();
      }, 1500);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsPublishing(false);
      setErrorMsg(err?.message || 'अपलोड में त्रुटि हुई।');
    }
  };

  const handleSaveAsDraft = () => {
    if (!title.trim() && !videoPreviewUrl) {
      setErrorMsg('ड्राफ्ट के लिए कम से कम शीर्षक या वीडियो आवश्यक है।');
      return;
    }
    saveDraft({
      title: title.trim() || 'शीर्षक रहित ड्राफ्ट',
      description: caption,
      category,
      tags: selectedTags,
      privacy,
      thumbnailUrl
    });
    alert('रील ड्राफ्ट के रूप में सुरक्षित हो गई है। आप इसे अपनी प्रोफ़ाइल में देख सकते हैं।');
    closeCreateModal();
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-rozha text-xl font-bold">छठ रील बनाएं (Create Reel)</h2>
          </div>
          <button
            onClick={closeCreateModal}
            className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {publishSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-rozha text-2xl text-emerald-300">रील सफलतापूर्वक प्रकाशित हुई! 🪔</h3>
              <p className="font-mukta text-xs text-stone-300">
                आपकी छठ रील अब फीड में श्रद्धालुओं के दर्शन के लिए उपलब्ध है।
              </p>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-6">
              
              {/* AI Reel Studio Launch Banner */}
              <button
                type="button"
                onClick={() => setAiStudioOpen(true)}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:text-white flex items-center justify-between transition-all group hover:border-amber-400"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-amber-300 group-hover:text-amber-200">AI Reel Studio (अनुशंसित)</p>
                    <p className="text-[10px] text-stone-400 font-mukta">फोटो/वीडियो से स्वचालित स्टोरीबोर्ड, संगीत व कैप्शन</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">शुरू करें →</span>
              </button>

              {/* Media Selection: Upload OR Live Camera */}
              <div className="space-y-3">
                <div className="flex p-1 rounded-xl bg-stone-900 border border-stone-800">
                  <button
                    type="button"
                    onClick={() => { setCreationMode('upload'); }}
                    className={`flex-1 py-2 text-xs font-bold font-mukta rounded-lg flex items-center justify-center gap-2 transition-all ${
                      creationMode === 'upload' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>गैलरी से वीडियो अपलोड (Upload)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCreationMode('record'); }}
                    className={`flex-1 py-2 text-xs font-bold font-mukta rounded-lg flex items-center justify-center gap-2 transition-all ${
                      creationMode === 'record' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>लाइव रिकॉर्ड करें (Camera Record)</span>
                  </button>
                </div>

                {/* Video Preview / Upload Area */}
                {creationMode === 'upload' ? (
                  videoPreviewUrl ? (
                    <div className="relative w-full max-w-[260px] mx-auto h-[380px] rounded-2xl overflow-hidden bg-black border border-amber-500/30">
                      <video
                        ref={videoElementRef}
                        src={videoPreviewUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setVideoPreviewUrl(null); setVideoFile(null); setVideoBlob(null); }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600"
                        title="हटाएं"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-amber-500/30 rounded-2xl hover:border-amber-400 cursor-pointer bg-stone-900/40 transition-all p-4 text-center">
                      <Video className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
                      <span className="font-rozha text-sm text-stone-200">वीडियो फाइल चुनें (MP4, WebM, MOV)</span>
                      <span className="text-[11px] text-stone-400 mt-1 font-mukta">
                        अधिकतम 80MB • 9:16 वर्टिकल फॉर्मेट अनुशंसित
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )
                ) : (
                  /* Camera Record Area */
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full max-w-[260px] h-[380px] rounded-2xl overflow-hidden bg-black border border-amber-500/30 flex items-center justify-center">
                      {videoPreviewUrl ? (
                        <video
                          src={videoPreviewUrl}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          ref={livePreviewRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      )}

                      {isRecording && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span>0:{recordDuration < 10 ? `0${recordDuration}` : recordDuration} / 1:00</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {!isRecording && !videoPreviewUrl && (
                        <button
                          type="button"
                          onClick={startCameraRecording}
                          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>रिकॉर्डिंग शुरू करें</span>
                        </button>
                      )}

                      {isRecording && (
                        <button
                          type="button"
                          onClick={stopCameraRecording}
                          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg"
                        >
                          रिकॉर्डिंग रोकें (Stop)
                        </button>
                      )}

                      {videoPreviewUrl && (
                        <button
                          type="button"
                          onClick={() => { setVideoPreviewUrl(null); setVideoBlob(null); }}
                          className="px-4 py-2 rounded-full bg-stone-800 text-stone-300 hover:text-white text-xs flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> पुनः रिकॉर्ड करें
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Trimmer Slider */}
              {videoPreviewUrl && (
                <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5" /> वीडियो ट्रिमर (Basic Trimmer)
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">0:00 - 0:{Math.round(videoDurationSec)}s</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-stone-400">प्रारंभ</span>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={trimStart}
                      onChange={e => setTrimStart(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={trimEnd}
                      onChange={e => setTrimEnd(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <span className="text-[10px] text-stone-400">समाप्त</span>
                  </div>
                </div>
              )}

              {/* Title & Caption */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    शीर्षक (Reel Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="उदा. कांच ही बांस के बहंगिया — घाट दर्शन"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    कैप्शन व विवरण (Caption / Description)
                  </label>
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="इस रील के बारे में अपने विचार या अनुभव लिखें..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Category Dropdown (12 Sacred Categories) */}
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">
                  श्रेणी चुनें (Category) *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ReelCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audio Library Attachment */}
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  <span>छठ पावन धुन जोड़ें (Select Audio)</span>
                </label>
                <select
                  value={selectedAudioId}
                  onChange={e => setSelectedAudioId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  {audioTracks.map(audio => (
                    <option key={audio.id} value={audio.id}>
                      🎵 {audio.title} — {audio.artist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hashtag Selector */}
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1.5">
                  हैशटैग्स (Hashtags)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_HASHTAGS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-amber-500/40'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={e => setCustomTagInput(e.target.value)}
                    placeholder="#नया_हैशटैग जोड़ें"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-amber-300 font-bold"
                  >
                    + जोड़ें
                  </button>
                </div>
              </div>

              {/* Privacy Setting */}
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1.5">
                  गोपनीयता सेटिंग्स (Privacy)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'public', label: 'सार्वजनिक (Public)', icon: Globe },
                    { key: 'followers', label: 'फॉलोअर्स (Followers)', icon: Users },
                    { key: 'private', label: 'निजी (Private)', icon: Lock }
                  ].map(item => {
                    const Icon = item.icon;
                    const isSel = privacy === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setPrivacy(item.key as ReelPrivacy)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                          isSel
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Publishing Progress Bar */}
              {isPublishing && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-amber-300">
                    <span>रील प्रोसेस और अपलोड हो रही है...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white font-bold text-xs sm:text-sm transition-all"
                >
                  ड्राफ्ट में रखें (Save Draft)
                </button>
                <button
                  type="submit"
                  disabled={isPublishing || (!videoPreviewUrl && !videoBlob)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPublishing ? 'प्रकाशन जारी है...' : 'रील प्रकाशित करें (Publish)'}
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}
        </div>
      </div>

      {/* AI Reel Studio Modal */}
      <AIReelStudioModal
        isOpen={aiStudioOpen}
        onClose={() => {
          setAiStudioOpen(false);
          closeCreateModal();
        }}
      />
    </div>
  );
};
