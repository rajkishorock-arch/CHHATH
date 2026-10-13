import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Share2, 
  Sparkles, 
  LogIn, 
  Calendar, 
  Check, 
  X,
  Heart,
  Loader2,
  BookOpen, 
  Printer, 
  Play, 
  Pause, 
  Mic, 
  Square, 
  Volume2, 
  VolumeX, 
  Download, 
  MapPin, 
  Users, 
  Music, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowLeft, 
  Wand2, 
  Eye, 
  Layers,
  Flame,
  Award,
  RefreshCw,
  FolderHeart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';
import { UserSyncService, type UserMemoryItem } from '../../services/userSyncService';
import { devotionalAudio } from '../../utils/audioEngine';

export type MemoryItem = UserMemoryItem;

interface MemoryAlbumPageProps {
  onNavigate: (tab: string) => void;
}

// 6 Real, Culturally Accurate Showcase Memories for Inspiration
export const SAMPLE_SHOWCASE_MEMORIES: MemoryItem[] = [
  {
    id: 'sample-1',
    year: '2026',
    title: 'गंगा तट पर संध्या अर्घ्य का पावन समर्पण',
    caption: 'दीघा घाट पटना पर पूरे परिवार के साथ अस्ताचलगामी सूर्य देव को नमन कर पहला अर्घ्य अर्पित किया। माँ गंगा के पावन जल में तैरते दीपकों ने आस्था का अलौकिक दृश्य रच दिया।',
    category: 'Arghya',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
    date: '14 नवंबर 2026',
    ghatLocation: 'दीघा घाट, पटना',
    riverName: 'पावन गंगा जी',
    frameStyle: 'gold_royal',
    familyMembers: 'माँ, दादीजी, पिताजी, भैया',
    shlokaTag: 'ॐ ऐहि सूर्य सहस्त्रांशो तेजोराशे जगत्पते। अनुकम्पय मां भक्त्या गृहाणार्घ्यं दिवाकर॥',
    audioNoteTitle: 'दादीजी के मुख से छठ लोकगीत',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    year: '2026',
    title: 'मिट्टी के नए चूल्हे पर शुद्ध घी का खस्ता ठेकुआ',
    caption: 'आम की सूखी लकड़ी और मिट्टी के चूल्हे पर शुद्ध देशी घी, गुड़ और सौंफ का पारंपरिक ठेकुआ महाप्रसाद तैयार हुआ। पूरे घर में छठी मईया की कृपा की पावन सुगंध व्याप्त हो गई।',
    category: 'Prasad',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&auto=format&fit=crop&q=80',
    date: '13 नवंबर 2026',
    ghatLocation: 'पैतृक गृह, मुजफ्फरपुर',
    riverName: 'गंडक कछार',
    frameStyle: 'diya_garland',
    familyMembers: 'माँ, चाचीजी, भाभी',
    shlokaTag: 'शुद्धिमन्तः पवित्राणि हवींषि प्रतिगृह्णताम्॥',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-3',
    year: '2025',
    title: 'कांच ही बांस के बहंगिया — सिर पर दउरा उठाए प्रस्थान',
    caption: 'पिताजी और भैया के साथ सिर पर बांस का दउरा लिए "कांच ही बांस के बहंगिया बहंगी लचकत जाय" गाते हुए घाट की ओर नंगे पांव प्रस्थान। भक्ति का यह क्षण जीवन का सबसे अनमोल संस्मरण है।',
    category: 'Family',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    date: '07 नवंबर 2025',
    ghatLocation: 'दशाश्वमेध घाट, वाराणसी',
    riverName: 'माँ गंगा',
    frameStyle: 'bamboo_soop',
    familyMembers: 'पिताजी, भैया, चाचाजी',
    shlokaTag: 'काँचहि बाँस के बहँगिया, बहँगी लचकत जाय...',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-4',
    year: '2025',
    title: 'प्रातःकालीन उषा अर्घ्य व 36 घंटे निर्जला व्रत पारण',
    caption: 'भोर की ठंडी बयार में कमर भर जल में खड़े होकर भुवन भास्कर के उदय की लालिमा का साक्षात्कार। कच्चे गाय के दूध की धार से अर्घ्य समर्पित कर 36 घंटे का अखंड निर्जला तप संपन्न हुआ।',
    category: 'Arghya',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    date: '08 नवंबर 2025',
    ghatLocation: 'काली घाट, कोलकाता',
    riverName: 'हुगली (भागीरथी)',
    frameStyle: 'ganga_arghya',
    familyMembers: 'समस्त परिवार',
    shlokaTag: 'ॐ ह्रीं ह्रीं सूर्याय सहस्रकिरणाय मनोवांछित फलम् देहि देहि स्वाहा॥',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-5',
    year: '2024',
    title: 'खरना की सात्विक गुड़ की खीर व मौन साधना',
    caption: 'कार्तिक शुक्ल पंचमी को दिनभर के निर्जला उपवास के बाद मिट्टी के बर्तन में बनी शुद्ध गुड़ की खीर (रसियाव) और घी लगी रोटी का महाप्रसाद। पूर्ण मौन में ग्रहण किया गया अमृत।',
    category: 'Prasad',
    imageUrl: 'https://images.unsplash.com/photo-1601055903647-87cb73dfcbb4?w=1200&auto=format&fit=crop&q=80',
    date: '27 अक्टूबर 2024',
    ghatLocation: 'घर का पूजा मंडप, पटना',
    riverName: 'गंगाजल अभिमंत्रित',
    frameStyle: 'gold_royal',
    familyMembers: 'दादीजी, माँ',
    shlokaTag: 'ॐ नमो भगवते वासुदेवाय नमः॥',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-6',
    year: '2024',
    title: 'घाट पर तैरते 1100 दीपकों का विहंगम महा दीपदान',
    caption: 'संध्या ढलते ही गंगा जी की लहरों पर श्रद्धालुओं द्वारा प्रवाहित अनगिनत मिट्टी के दीपकों का अलौकिक दृश्य। ऐसा प्रतीत हुआ मानो आकाश के सारे तारे गंगा तट पर उतर आए हों।',
    category: 'Ghat',
    imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1200&auto=format&fit=crop&q=80',
    date: '28 अक्टूबर 2024',
    ghatLocation: 'कलेक्ट्रेट घाट, पटना',
    riverName: 'माँ गंगा',
    frameStyle: 'diya_garland',
    familyMembers: 'मित्र व परिजन',
    shlokaTag: 'दीपो ज्योतिः परं ब्रह्म दीपो ज्योतिर्जनार्दनः॥',
    createdAt: new Date().toISOString()
  }
];

// Presets for the AI / Vedic Caption & Shloka Assistant
const VEDIC_CAPTION_PRESETS = [
  {
    id: 'arghya-sandhya',
    tag: '🌅 संध्या अर्घ्य समर्पण',
    title: 'गंगा तट पर प्रथम संध्या अर्घ्य समर्पण',
    category: 'Arghya' as const,
    shloka: 'ॐ ऐहि सूर्य सहस्त्रांशो तेजोराशे जगत्पते। अनुकम्पय मां भक्त्या गृहाणार्घ्यं दिवाकर॥',
    caption: 'बांस के सूप में दीया और ऋतुफल सजाकर ढलते सूर्य को पहला सांध्य अर्घ्य अर्पित किया। माँ गंगा के तट पर तैरते दीपकों ने आस्था का अलौकिक आलोक बिखेर दिया।',
    suggestedGhat: 'दीघा घाट, पटना'
  },
  {
    id: 'arghya-usha',
    tag: '🌄 उषा अर्घ्य व पारण',
    title: 'अरुणोदय बेला में प्रातःकालीन उषा अर्घ्य',
    category: 'Arghya' as const,
    shloka: 'ॐ ह्रीं ह्रीं सूर्याय सहस्रकिरणाय मनोवांछित फलम् देहि देहि स्वाहा॥',
    caption: 'भोर की शीतल बयार में कमर भर जल में खड़े होकर भुवन भास्कर के उदय का इंतजार किया। दूध की पावन धार के साथ अर्घ्य समर्पित कर 36 घंटे का अखंड व्रत संपन्न हुआ।',
    suggestedGhat: 'कलेक्ट्रेट घाट, पटना'
  },
  {
    id: 'bahangi-yatra',
    tag: '🎋 बहंगी व दउरा प्रस्थान',
    title: 'कांच ही बांस के बहंगिया — दउरा यात्रा',
    category: 'Family' as const,
    shloka: 'काँचहि बाँस के बहँगिया, बहँगी लचकत जाय...',
    caption: 'सिर पर बांस का दउरा उठाए पूरे परिवार के साथ नंगे पांव घाट की ओर प्रस्थान किया। पारंपरिक लोकगीतों और जय छठी मईया के जयकारों से पूरा वातावरण गूंज उठा।',
    suggestedGhat: 'गाय घाट, पटना'
  },
  {
    id: 'kharna-kheer',
    tag: '🍯 खरना का पावन रसियाव',
    title: 'मिट्टी के चूल्हे पर बना खरना का रसियाव',
    category: 'Prasad' as const,
    shloka: 'ॐ नमो भगवते सूर्याय नमः॥',
    caption: 'मिट्टी के नए चूल्हे पर आम की लकड़ी से बना शुद्ध गुड़ का रसियाव (खीर) और घी लगी रोटी। पूर्ण एकांत और सात्विकता में ग्रहण किया गया अमृत तुल्य महाप्रसाद।',
    suggestedGhat: 'गृह पूजा मंडप'
  },
  {
    id: 'thekua-nirman',
    tag: '🪔 खस्ता ठेकुआ निर्माण',
    title: 'शुद्ध देशी घी और गुड़ का ठेकुआ महाप्रसाद',
    category: 'Prasad' as const,
    shloka: 'सदा सुहागिन रहिहैं, अन-धन से भरल भंडार रहै।',
    caption: 'दादीजी और माँ के हाथों से बने शुद्ध देशी घी, गेहूं के आटे और गुड़ के खस्ता ठेकुआ की महक ने घर के हर कोने में छठ महापर्व की पावन मिठास घोल दी।',
    suggestedGhat: 'पारिवारिक रसोई'
  },
  {
    id: 'kosi-deepdaan',
    tag: '✨ कोसी भराई व दीपदान',
    title: '24 दीपकों से सजी पावन कोसी व दीपदान',
    category: 'Ghat' as const,
    shloka: 'दीपो ज्योतिः परं ब्रह्म दीपो ज्योतिर्जनार्दनः॥',
    caption: 'गन्ने के भव्य मंडप तले 24 दीपकों से सजी कोसी भरी और छठी मईया के सम्मुख अखंड दीप प्रज्वलित किया। माँ षष्ठी हमारे परिवार पर सदा अपनी कृपा बनाए रखें।',
    suggestedGhat: 'दशाश्वमेध घाट, वाराणसी'
  }
];

export const MemoryAlbumPage: React.FC<MemoryAlbumPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  // Primary states
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [activeTabMode, setActiveTabMode] = useState<'my' | 'showcase'>('my');
  const [viewLayout, setViewLayout] = useState<'grid' | 'book' | 'timeline'>('grid');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [lightboxItem, setLightboxItem] = useState<MemoryItem | null>(null);
  const [studioItem, setStudioItem] = useState<MemoryItem | null>(null);
  const [showCaptionAssistant, setShowCaptionAssistant] = useState<boolean>(false);
  const [slideshowOpen, setSlideshowOpen] = useState<boolean>(false);
  const [slideshowIndex, setSlideshowIndex] = useState<number>(0);
  const [slideshowPlaying, setSlideshowPlaying] = useState<boolean>(true);
  const [ambientAudioActive, setAmbientAudioActive] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Book mode page tracker
  const [bookPageIndex, setBookPageIndex] = useState<number>(0);

  // Audio Note Playback tracker
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newYear, setNewYear] = useState<'2026' | '2025' | '2024' | string>('2026');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('Family');
  const [newImagePreview, setNewImagePreview] = useState<string>('');
  const [newGhatLocation, setNewGhatLocation] = useState<string>('दीघा घाट, पटना');
  const [newRiverName, setNewRiverName] = useState<string>('पावन गंगा जी');
  const [newFamilyMembers, setNewFamilyMembers] = useState<string>('');
  const [newShlokaTag, setNewShlokaTag] = useState<string>('ॐ सूर्याय नमः');
  const [newFrameStyle, setNewFrameStyle] = useState<MemoryItem['frameStyle']>('gold_royal');

  // Audio Voice Memo Recorder States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioNoteUrl, setAudioNoteUrl] = useState<string>('');
  const [audioNoteTitle, setAudioNoteTitle] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Load user memories from Local Cache + Universal Cloud
  useEffect(() => {
    if (currentUser?.id) {
      // 1. Local Cache for instant render
      try {
        const saved = localStorage.getItem(`chhath_user_memories_${currentUser.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setMemories(parsed);
        }
      } catch {}

      // 2. Fresh Cloud fetch
      setIsSyncing(true);
      UserSyncService.fetchUserMemories(currentUser.id)
        .then((cloudMemories) => {
          if (Array.isArray(cloudMemories) && cloudMemories.length > 0) {
            setMemories(cloudMemories);
            try {
              localStorage.setItem(`chhath_user_memories_${currentUser.id}`, JSON.stringify(cloudMemories));
            } catch {}
          }
        })
        .catch(err => console.warn('[Memories] Cloud fetch notice:', err))
        .finally(() => setIsSyncing(false));
    } else {
      // Guest: check anonymous local memories
      try {
        const anon = localStorage.getItem('chhath_user_memories_anon');
        if (anon) {
          const parsed = JSON.parse(anon);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMemories(parsed);
          }
        }
      } catch {}
    }
  }, [currentUser?.id]);

  // Audio Voice Memo Recorder Logic
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('आपके ब्राउज़र में ऑडियो रिकॉर्डिंग समर्थित नहीं है');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioNoteUrl(base64Audio);
          setAudioNoteTitle(audioNoteTitle || 'दादी/माँ का लोकगीत या आशीर्वाद');
          showToast('🎙️ कंठ स्मृति (ऑडियो रिकॉर्डिंग) सफलतापूर्वक तैयार!');
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds(sec => {
          if (sec >= 59) {
            stopRecording();
            return 60;
          }
          return sec + 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast('माइक्रोफ़ोन अनुमति नहीं मिली। कृपया माइक की अनुमति दें।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  const playVoiceMemo = (audioUrl: string, id: string) => {
    if (playingAudioId === id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      setPlayingAudioId(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    setPlayingAudioId(id);

    audio.onended = () => {
      setPlayingAudioId(null);
    };

    audio.play().catch(err => {
      console.warn('Voice memo playback error:', err);
      setPlayingAudioId(null);
    });
  };

  // Image Upload with Retina Canvas Compression (800px ~50-80KB HD)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('कृपया 15MB से छोटी फोटो चुनें');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (!dataUri) {
        setIsCompressing(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 900;
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
            setNewImagePreview(compressed);
          } else {
            setNewImagePreview(dataUri);
          }
        } catch {
          setNewImagePreview(dataUri);
        } finally {
          setIsCompressing(false);
        }
      };
      img.onerror = () => {
        setNewImagePreview(dataUri);
        setIsCompressing(false);
      };
      img.src = dataUri;
    };
    reader.readAsDataURL(file);
  };

  // Add Memory Handler
  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImagePreview) {
      showToast('कृपया शीर्षक और फोटो जोड़ें');
      return;
    }

    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      year: newYear,
      title: newTitle.trim(),
      caption: newCaption.trim() || 'छठी मईया की असीम अनुकम्पा का एक पावन पारिवारिक संस्मरण।',
      category: newCategory,
      imageUrl: newImagePreview,
      date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      ghatLocation: newGhatLocation.trim() || 'गंगा घाट',
      riverName: newRiverName.trim() || 'माँ गंगा',
      familyMembers: newFamilyMembers.trim() || 'समस्त परिवार',
      shlokaTag: newShlokaTag.trim() || 'ॐ सूर्याय नमः',
      frameStyle: newFrameStyle || 'gold_royal',
      audioNoteUrl: audioNoteUrl || undefined,
      audioNoteTitle: audioNoteUrl ? (audioNoteTitle || 'पारिवारिक कंठ स्मृति') : undefined,
      createdAt: new Date().toISOString()
    };

    const nextMemories = [newItem, ...memories];
    setMemories(nextMemories);

    // Save locally
    const storageKey = currentUser?.id 
      ? `chhath_user_memories_${currentUser.id}` 
      : 'chhath_user_memories_anon';
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextMemories));
    } catch {}

    // Reset Form
    setShowAddForm(false);
    setNewTitle('');
    setNewCaption('');
    setNewImagePreview('');
    setAudioNoteUrl('');
    setAudioNoteTitle('');
    setActiveTabMode('my');
    devotionalAudio.ringTempleBell();
    showToast('✨ आपकी छठ यादें सुरक्षित सहेज दी गईं!');

    // Persist to Cloud if authenticated
    if (currentUser?.id) {
      setIsSyncing(true);
      try {
        await UserSyncService.saveUserMemories(currentUser.id, nextMemories);
      } catch (err) {
        console.warn('[Memories] Cloud save notice:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Delete Memory
  const handleDeleteMemory = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = memories.filter(m => m.id !== id);
    setMemories(next);

    const storageKey = currentUser?.id 
      ? `chhath_user_memories_${currentUser.id}` 
      : 'chhath_user_memories_anon';
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}

    if (currentUser?.id) {
      UserSyncService.saveUserMemories(currentUser.id, next).catch(() => {});
    }
    if (lightboxItem?.id === id) setLightboxItem(null);
    showToast('संस्मरण हटाया गया');
  };

  // Apply Frame with Canvas & Download / Save
  const renderFramedCanvas = (
    mem: MemoryItem, 
    frameType: MemoryItem['frameStyle'] = 'gold_royal',
    isStory916: boolean = false
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(mem.imageUrl);

        if (isStory916) {
          // 1080 x 1920 Instagram / WhatsApp 9:16 Vertical Story
          canvas.width = 1080;
          canvas.height = 1920;

          // Vedic Sunset Gradient Background
          const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
          bgGrad.addColorStop(0, '#1c0702');
          bgGrad.addColorStop(0.3, '#3d1205');
          bgGrad.addColorStop(0.7, '#7c2d12');
          bgGrad.addColorStop(1, '#1c0702');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, 1080, 1920);

          // Top Radiant Sun Motif
          ctx.save();
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 36px Rozha One, serif';
          ctx.textAlign = 'center';
          ctx.fillText('॥ जय छठी मईया ॥', 540, 180);

          ctx.fillStyle = '#fbbf24';
          ctx.font = '24px Mukta, sans-serif';
          ctx.fillText('छठ महापर्व पारिवारिक संस्मरण • ' + mem.year, 540, 230);

          // Center Image Container
          const photoW = 920;
          const photoH = (photoW * 9) / 16;
          const photoX = 80;
          const photoY = 460;

          // Draw Photo
          ctx.drawImage(img, photoX, photoY, photoW, photoH);

          // Gold Border
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 10;
          ctx.strokeRect(photoX - 5, photoY - 5, photoW + 10, photoH + 10);

          // Bottom Title & Caption
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 44px Rozha One, serif';
          ctx.fillText(mem.title, 540, photoY + photoH + 100);

          ctx.fillStyle = '#fde68a';
          ctx.font = '28px Mukta, sans-serif';
          if (mem.ghatLocation) {
            ctx.fillText('📍 ' + mem.ghatLocation + ' • ' + (mem.riverName || 'माँ गंगा'), 540, photoY + photoH + 160);
          }

          if (mem.shlokaTag) {
            ctx.fillStyle = '#fcd34d';
            ctx.font = 'italic 26px Mukta, sans-serif';
            ctx.fillText('"' + mem.shlokaTag + '"', 540, photoY + photoH + 220);
          }

          // Footer Family Blessing
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 22px Mukta, sans-serif';
          ctx.fillText('सदा सुहागिन रहिहैं, अन-धन से भरल भंडार रहै।', 540, 1780);
          ctx.restore();

          resolve(canvas.toDataURL('image/png', 0.95));
        } else {
          // Standard Frame on Photo Dimensions
          const w = img.width;
          const h = img.height;
          canvas.width = w;
          canvas.height = h;

          // Draw Image
          ctx.drawImage(img, 0, 0, w, h);

          // Draw Selected Decorative Divine Frame
          ctx.save();
          if (frameType === 'gold_royal') {
            // 24K Gold Royal Border with Sun rays
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = Math.max(12, Math.round(w * 0.025));
            ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);

            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = Math.max(3, Math.round(w * 0.006));
            ctx.strokeRect(ctx.lineWidth * 2.5, ctx.lineWidth * 2.5, w - ctx.lineWidth * 5, h - ctx.lineWidth * 5);

            // Top Gold Badge
            ctx.fillStyle = 'rgba(0,0,0,0.65)';
            ctx.fillRect(w / 2 - 160, 0, 320, 44);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `bold ${Math.max(16, Math.round(w * 0.03))}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('॥ जय छठी मईया ॥', w / 2, 30);
          } else if (frameType === 'diya_garland') {
            // Saffron Marigold & Diya Border
            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = Math.max(14, Math.round(w * 0.03));
            ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);

            ctx.fillStyle = '#ea580c';
            ctx.font = `bold ${Math.max(14, Math.round(w * 0.026))}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('🪔 ॐ सूर्याय नमः 🪔', w / 2, h - 25);
          } else if (frameType === 'bamboo_soop') {
            // Bamboo Weave Frame
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = Math.max(16, Math.round(w * 0.032));
            ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
          } else if (frameType === 'ganga_arghya') {
            // Ganga Sunset Gradient Bottom Overlay
            const bottomGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
            bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
            bottomGrad.addColorStop(1, 'rgba(124,45,18,0.85)');
            ctx.fillStyle = bottomGrad;
            ctx.fillRect(0, h * 0.7, w, h * 0.3);

            ctx.fillStyle = '#fde68a';
            ctx.font = `bold ${Math.max(14, Math.round(w * 0.028))}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('🌊 पावन गंगा अर्घ्य • छठ ' + mem.year, w / 2, h - 30);
          }
          ctx.restore();

          resolve(canvas.toDataURL('image/jpeg', 0.92));
        }
      };
      img.onerror = () => resolve(mem.imageUrl);
      img.src = mem.imageUrl;
    });
  };

  const handleDownloadFramedPhoto = async (mem: MemoryItem, isStory: boolean = false) => {
    showToast(isStory ? '📱 9:16 स्टोरी तैयार हो रही है...' : '🖼️ HD फोटो तैयार हो रही है...');
    try {
      const dataUri = await renderFramedCanvas(mem, mem.frameStyle || 'gold_royal', isStory);
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = isStory 
        ? `chhath_story_9_16_${mem.id}.png` 
        : `chhath_sansmaran_${mem.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('डाउनलोड पूरा हुआ!');
    } catch {
      showToast('डाउनलोड में समस्या आई');
    }
  };

  // Determine active display pool (User Memories vs Showcase Inspiration)
  const currentPool = activeTabMode === 'my' 
    ? memories 
    : SAMPLE_SHOWCASE_MEMORIES;

  // Filter Memories
  const filteredMemories = currentPool.filter(mem => {
    const matchYear = selectedYear === 'all' || mem.year === selectedYear;
    const matchCat = selectedCategory === 'all' || mem.category === selectedCategory;
    const matchQuery = !searchQuery.trim() || 
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mem.ghatLocation && mem.ghatLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mem.familyMembers && mem.familyMembers.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchYear && matchCat && matchQuery;
  });

  // Calculate devotee statistics
  const totalUserCount = memories.length;
  const uniqueYears = Array.from(new Set(memories.map(m => m.year))).length;
  const uniqueGhats = Array.from(new Set(memories.map(m => m.ghatLocation).filter(Boolean))).length;
  const voiceMemosCount = memories.filter(m => !!m.audioNoteUrl).length;

  // Slideshow advance timer
  useEffect(() => {
    let timer: any;
    if (slideshowOpen && slideshowPlaying && filteredMemories.length > 0) {
      timer = setInterval(() => {
        setSlideshowIndex(prev => (prev + 1) % filteredMemories.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [slideshowOpen, slideshowPlaying, filteredMemories.length]);

  // Ambient sound handler during slideshow
  const toggleAmbientSound = () => {
    if (ambientAudioActive) {
      devotionalAudio.stopRiverWaves();
      setAmbientAudioActive(false);
    } else {
      devotionalAudio.startRiverWaves(0.35);
      setAmbientAudioActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-mukta flex flex-col selection:bg-amber-500/20">
      <SeoHead
        title="छठ संस्मरण व डिजिटल स्मृति मंजूषा | Chhath Memories Studio"
        description="अपने परिवार की पीढ़ियों के पावन अर्घ्य, प्रसाद और घाट संस्मरणों को सहेजें। वैदिक फोटो फ्रेम, कंठ स्मृति व A4 स्मृति पत्रिका।"
        canonicalUrl="https://chhathvibes.vercel.app/chhath-memories"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 border border-amber-400 text-amber-200 px-5 py-2.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1">
        
        {/* Top Studio Hero & Navigation Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-amber-950/90 to-stone-900 border border-amber-500/30 text-white p-4 sm:p-7 shadow-xl">
          {/* Subtle Golden Ray Overlay */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="मुख्य पृष्ठ पर लौटें"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">होम</span>
                </button>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-stone-950" />
                  अलौकिक डिजिटल स्मृति मंजूषा
                </span>

                {isSyncing && (
                  <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> क्लाउड सिंक...
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-3xl font-extrabold font-rozha text-amber-100 leading-tight">
                  छठ संस्मरण व पारिवारिक स्मृति ग्रन्थ
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 font-mukta max-w-2xl leading-relaxed mt-1">
                  पीढ़ियों से संजोए गए अर्घ्य, खस्ता ठेकुआ, पावन घाट और दादी-माँ के कंठ से निकले लोकगीतों की अनमोल स्मृतियां — अब सदा के लिए अमर।
                </p>
              </div>

              {/* Devotee Statistics Quick Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-amber-200/90 font-mono">
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>कुल संस्मरण: <strong>{totalUserCount}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>वर्ष संग्रह: <strong>{uniqueYears || 1}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  <span>घाट दर्शन: <strong>{uniqueGhats || 1}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>कंठ स्मृतियां: <strong>{voiceMemosCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Top Action Suite */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('login', 'पारिवारिक छठ संस्मरण जोड़ने हेतु लॉगिन करें');
                  } else {
                    setShowAddForm(true);
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>नया संस्मरण जोड़ें</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSlideshowIndex(0);
                  setSlideshowOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
                title="फुलस्क्रीन दर्शन मोड"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">स्मरण दर्शन</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
                title="A4 पारिवारिक पत्रिका प्रिंट / PDF"
              >
                <Printer className="w-4 h-4 text-orange-300" />
                <span className="hidden sm:inline">A4 पत्रिका</span>
              </button>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => openAuthModal('login', 'क्लाउड सिंक और आजीवन सुरक्षा हेतु लॉगिन करें')}
                  className="px-3.5 py-2.5 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold text-xs transition-all cursor-pointer border border-amber-400/30 flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>लॉगिन</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* View Mode & Studio Controller */}
        <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Toggle Pool (My Album vs Showcase Inspiration) */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTabMode('my')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTabMode === 'my'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>मेरा परिवार एल्बम ({memories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabMode('showcase')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTabMode === 'showcase'
                  ? 'bg-stone-900 text-amber-200 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>प्रेरणादायक संस्मरण (6)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="शीर्षक, घाट या नाम खोजें..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Layout Switcher (Grid vs 3D Photobook) */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-bold text-stone-500 hidden sm:inline mr-1">दृश्य:</span>
            <button
              type="button"
              onClick={() => setViewLayout('grid')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewLayout === 'grid'
                  ? 'bg-amber-500 text-stone-950 font-extrabold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
              title="ग्रिड गैलरी दृश्य"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">ग्रिड</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewLayout('book');
                devotionalAudio.ringTempleBell();
              }}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewLayout === 'book'
                  ? 'bg-amber-500 text-stone-950 font-extrabold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
              title="3D स्मृति ग्रन्थ (Photobook Flip Mode)"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">स्मृति ग्रन्थ</span>
            </button>
          </div>
        </div>

        {/* Filter Strip (Years + Sacred Phases) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {/* Year Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'सभी वर्ष' },
              { key: '2026', label: '2026' },
              { key: '2025', label: '2025' },
              { key: '2024', label: '2024' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedYear(tab.key)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedYear === tab.key
                    ? 'bg-stone-900 text-amber-300 shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'सभी' },
              { key: 'Arghya', label: '🌅 अर्घ्य' },
              { key: 'Prasad', label: '🍯 प्रसाद' },
              { key: 'Family', label: '👨‍👩‍👦 परिवार' },
              { key: 'Ghat', label: '🌊 घाट' }
            ].map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.key
                    ? 'bg-amber-500/20 text-amber-900 border border-amber-500 font-extrabold'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notice when viewing Showcase Inspiration */}
        {activeTabMode === 'showcase' && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs sm:text-sm font-mukta flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>प्रेरणादायक संस्मरण संग्रह:</strong> ये पावन संस्मरण यह दर्शाने के लिए हैं कि आपका पारिवारिक एल्बम कितना भव्य दिखेगा।
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              अपनी पहली याद जोड़ें
            </button>
          </div>
        )}

        {/* MAIN DISPLAY AREA */}

        {/* 1. Empty State (When user has 0 memories and in 'my' tab) */}
        {activeTabMode === 'my' && memories.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold font-rozha text-stone-900">
                {isAuthenticated 
                  ? 'आपके पारिवारिक एल्बम में अभी कोई संस्मरण नहीं जुड़ा है' 
                  : 'अपने परिवार के छठ संस्मरण सहेजने के लिए शुरू करें'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                घाट पर अर्घ्य, मिट्टी के चूल्हे पर बने ठेकुआ और दादी-माँ के आशीर्वाद की तस्वीरों को अपलोड करें और जीवनभर के लिए सुरक्षित रखें।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>पहली पारिवारिक फोटो जोड़ें</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabMode('showcase')}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>प्रेरणादायक नमूने देखें (Sample Gallery)</span>
              </button>
            </div>
          </div>
        ) : filteredMemories.length === 0 ? (
          /* Filter zero results */
          <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-2">
            <Search className="w-8 h-8 text-stone-400 mx-auto" />
            <h4 className="text-sm font-bold text-stone-700">कोई संस्मरण नहीं मिला</h4>
            <p className="text-xs text-stone-400">कृपया फ़िल्टर या खोज शब्द बदलें।</p>
          </div>
        ) : viewLayout === 'book' ? (
          /* 2. 3D Divine Photobook / स्मृति ग्रन्थ Mode */
          <div className="p-4 sm:p-8 rounded-3xl bg-[#f5ede1] border-2 border-amber-600/30 shadow-2xl relative overflow-hidden text-stone-900">
            {/* Book Spine Texture Overlay */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-stone-900/10 via-amber-950/20 to-stone-900/10 pointer-events-none hidden md:block" />

            <div className="flex items-center justify-between pb-4 border-b border-amber-700/20 text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5 font-rozha text-sm">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>॥ श्री छठ स्मृति ग्रन्थ • पृष्ठ {bookPageIndex + 1} / {filteredMemories.length} ॥</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={bookPageIndex <= 0}
                  onClick={() => {
                    setBookPageIndex(p => Math.max(0, p - 1));
                    devotionalAudio.ringTempleBell();
                  }}
                  className="p-2 rounded-xl bg-amber-700/10 hover:bg-amber-700/20 disabled:opacity-30 text-amber-950 transition-all cursor-pointer"
                  title="पिछला पृष्ठ"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={bookPageIndex >= filteredMemories.length - 1}
                  onClick={() => {
                    setBookPageIndex(p => Math.min(filteredMemories.length - 1, p + 1));
                    devotionalAudio.ringTempleBell();
                  }}
                  className="p-2 rounded-xl bg-amber-700/10 hover:bg-amber-700/20 disabled:opacity-30 text-amber-950 transition-all cursor-pointer"
                  title="अगला पृष्ठ"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Book Page View */}
            {filteredMemories[bookPageIndex] && (() => {
              const currentMem = filteredMemories[bookPageIndex];
              return (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left: Golden Framed High-Res Photograph */}
                  <div className="relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden bg-black shadow-xl border-4 border-amber-500/60 group">
                    <img
                      src={currentMem.imageUrl}
                      alt={currentMem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-amber-300 font-mono font-bold">
                      छठ {currentMem.year}
                    </div>
                    {currentMem.audioNoteUrl && (
                      <button
                        type="button"
                        onClick={() => playVoiceMemo(currentMem.audioNoteUrl!, currentMem.id)}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                      >
                        {playingAudioId === currentMem.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{playingAudioId === currentMem.id ? 'रुकें' : 'कंठ स्मृति सुनें'}</span>
                      </button>
                    )}
                  </div>

                  {/* Right: Traditional Calligraphy & Devotional Narrative */}
                  <div className="space-y-3 p-2 sm:p-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-600/20 text-amber-900 border border-amber-600/30">
                        {currentMem.category}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        {currentMem.date}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-bold font-rozha text-stone-950 leading-snug">
                      {currentMem.title}
                    </h3>

                    {currentMem.shlokaTag && (
                      <div className="p-3 rounded-xl bg-amber-600/10 border-l-4 border-amber-600 text-amber-950 text-xs italic font-mukta">
                        "{currentMem.shlokaTag}"
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-mukta">
                      {currentMem.caption}
                    </p>

                    <div className="pt-2 border-t border-amber-700/20 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                      <div>
                        <span className="text-stone-400 block">पवित्र घाट:</span>
                        <strong className="text-stone-900">{currentMem.ghatLocation || 'गंगा तट'}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">पारिवारिक सदस्य:</span>
                        <strong className="text-stone-900">{currentMem.familyMembers || 'समस्त परिवार'}</strong>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadFramedPhoto(currentMem, false)}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>HD फोटो डाउनलोड</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadFramedPhoto(currentMem, true)}
                        className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>9:16 स्टेटस स्टोरी</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* 3. Ultra-Premium Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMemories.map(mem => (
              <div
                key={mem.id}
                onClick={() => setLightboxItem(mem)}
                className="group rounded-3xl overflow-hidden bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-xs flex flex-col relative"
              >
                {/* Photo Container with Frame Effect */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-black/75 text-amber-300 backdrop-blur-md">
                      छठ {mem.year}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-stone-950">
                      {mem.category}
                    </span>
                  </div>

                  {/* Delete Button (Only for user's personal memories) */}
                  {activeTabMode === 'my' && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMemory(mem.id, e)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-stone-300 hover:text-red-400 hover:bg-black/90 transition-all"
                      title="संस्मरण हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Ghat Tag */}
                  {mem.ghatLocation && (
                    <div className="absolute bottom-2.5 left-2.5 text-[11px] text-amber-200 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span className="truncate max-w-[200px]">{mem.ghatLocation}</span>
                    </div>
                  )}

                  {/* Voice Memo Badge */}
                  {mem.audioNoteUrl && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoiceMemo(mem.audioNoteUrl!, mem.id);
                      }}
                      className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-[10px] font-extrabold flex items-center gap-1 shadow-md active:scale-95"
                    >
                      {playingAudioId === mem.id ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>रुकें</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>कंठ स्मृति</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold font-rozha text-stone-950 leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                      {mem.title}
                    </h4>

                    {mem.shlokaTag && (
                      <p className="text-[11px] text-amber-800 font-semibold line-clamp-1 italic">
                        "{mem.shlokaTag}"
                      </p>
                    )}

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {mem.caption}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{mem.date}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFramedPhoto(mem, false);
                        }}
                        className="p-1 text-stone-400 hover:text-amber-600 transition-colors"
                        title="HD फोटो डाउनलोड"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFramedPhoto(mem, true);
                        }}
                        className="p-1 text-stone-400 hover:text-orange-600 transition-colors"
                        title="9:16 स्टेटस स्टोरी बनाएं"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= MODALS & EXPANDED VIEWS ================= */}

        {/* 1. Add Memory Form Modal */}
        {showAddForm && (
          <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200 overflow-y-auto"
            onClick={() => setShowAddForm(false)}
          >
            <div 
              className="w-full max-w-xl bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-2xl relative text-left my-8 max-h-[92vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-rozha text-stone-950 leading-tight">
                      नया छठ संस्मरण जोड़ें
                    </h3>
                    <p className="text-[10px] sm:text-xs text-amber-700 font-semibold">
                      पारिवारिक स्मृति ग्रन्थ में सुरक्षित सहेजें
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMemory} className="space-y-4">
                
                {/* AI / Vedic Presets Helper Strip */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold">
                    <Wand2 className="w-4 h-4 text-amber-600" />
                    <span>दिव्य संस्मरण वाणी (AI / वैदिक सहायक):</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCaptionAssistant(true)}
                    className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-[11px] shadow-xs cursor-pointer active:scale-95"
                  >
                    ✨ सुझाव चुनें
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    संस्मरण शीर्षक *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="उदा. गंगा तट पर प्रथम संध्या अर्घ्य समर्पण"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* Year, Category, Ghat */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      वर्ष
                    </label>
                    <select
                      value={newYear}
                      onChange={e => setNewYear(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="2026">2026 (वर्तमान)</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023 व पूर्व</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      श्रेणी
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Arghya">🌅 अर्घ्य अनुष्ठान</option>
                      <option value="Prasad">🍯 ठेकुआ व प्रसाद</option>
                      <option value="Family">👨‍👩‍👦 परिवार व बहंगी</option>
                      <option value="Ghat">🌊 पावन घाट दर्शन</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      पवित्र घाट / स्थान
                    </label>
                    <input
                      type="text"
                      value={newGhatLocation}
                      onChange={e => setNewGhatLocation(e.target.value)}
                      placeholder="उदा. दीघा घाट, पटना"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Photo Upload with Retina Canvas Engine */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      छठ फोटो अपलोड करें *
                    </label>
                    {isCompressing && (
                      <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> फोटो ऑप्टिमाइज़ हो रही है...
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={isCompressing}
                    className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-400 cursor-pointer disabled:opacity-50"
                  />
                </div>

                {/* Preview with Frame Overlay */}
                {newImagePreview && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-black shadow-md">
                    <img
                      src={newImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-amber-300 backdrop-blur-md">
                      फ्रेम: {newFrameStyle}
                    </div>
                  </div>
                )}

                {/* Frame Style Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    वैदिक फोटो फ्रेम शैली
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold">
                    {[
                      { key: 'gold_royal', label: '👑 स्वर्ण सूर्य फ्रेम' },
                      { key: 'diya_garland', label: '🪔 दीपमाला व अल्पना' },
                      { key: 'bamboo_soop', label: '🎋 बहंगिया फ्रेम' },
                      { key: 'ganga_arghya', label: '🌅 गंगा संध्या आभा' }
                    ].map(f => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setNewFrameStyle(f.key as any)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          newFrameStyle === f.key
                            ? 'bg-amber-500/20 border-amber-500 text-stone-950 font-extrabold shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption / Devotional Narrative */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    संस्मरण विवरण व भावना
                  </label>
                  <textarea
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    rows={2}
                    placeholder="उस पावन पल की विशेष याद, भावना या प्रार्थना..."
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                  />
                </div>

                {/* Audio Voice Memo Recorder (कंठ स्मृति) */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-emerald-600" />
                      <span>कंठ स्मृति (दादी/माँ की आवाज में लोकगीत या आशीर्वाद)</span>
                    </label>
                    {audioNoteUrl && (
                      <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3" /> रिकॉर्डेड
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 animate-pulse cursor-pointer shadow-md"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>रिकॉर्डिंग रोकें ({recordingSeconds}s / 60s)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{audioNoteUrl ? 'पुनः रिकॉर्ड करें' : 'माइक से रिकॉर्ड करें (1 मिनट)'}</span>
                      </button>
                    )}

                    {audioNoteUrl && !isRecording && (
                      <button
                        type="button"
                        onClick={() => playVoiceMemo(audioNoteUrl, 'preview')}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        {playingAudioId === 'preview' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>सुनें</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Shloka Tag & Family Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      वैदिक श्लोक / लोकगीत पंक्ति
                    </label>
                    <input
                      type="text"
                      value={newShlokaTag}
                      onChange={e => setNewShlokaTag(e.target.value)}
                      placeholder="उदा. ॐ सूर्याय नमः"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      तस्वीर में उपस्थित परिजन
                    </label>
                    <input
                      type="text"
                      value={newFamilyMembers}
                      onChange={e => setNewFamilyMembers(e.target.value)}
                      placeholder="उदा. माँ, दादीजी, भैया"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isCompressing || isSyncing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>क्लाउड में सुरक्षित सहेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>स्मृति ग्रन्थ में सुरक्षित सहेजें</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 2. AI / Vedic Caption Assistant Modal */}
        {showCaptionAssistant && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
            onClick={() => setShowCaptionAssistant(false)}
          >
            <div 
              className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-left max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold font-rozha text-stone-950">
                    दिव्य संस्मरण वाणी सुझाव
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCaptionAssistant(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {VEDIC_CAPTION_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setNewTitle(preset.title);
                      setNewCaption(preset.caption);
                      setNewCategory(preset.category);
                      setNewShlokaTag(preset.shloka);
                      setNewGhatLocation(preset.suggestedGhat);
                      setShowCaptionAssistant(false);
                      showToast('सुझाव सफलतापूर्वक लागू किया गया!');
                    }}
                    className="p-3.5 rounded-2xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">
                        {preset.tag}
                      </span>
                      <span className="text-[10px] text-amber-600 font-bold group-hover:underline">
                        लागू करें →
                      </span>
                    </div>
                    <h5 className="text-sm font-bold font-rozha text-stone-900">
                      {preset.title}
                    </h5>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {preset.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Detailed Lightbox Modal */}
        {lightboxItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
            onClick={() => setLightboxItem(null)}
          >
            <div 
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 bg-stone-950 border-b border-amber-500/30 flex items-center justify-between text-white">
                <div>
                  <h3 className="text-base font-bold font-rozha text-amber-100">
                    {lightboxItem.title}
                  </h3>
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    छठ {lightboxItem.year} • {lightboxItem.date}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain"
                />

                {/* Floating Audio Play in Lightbox */}
                {lightboxItem.audioNoteUrl && (
                  <button
                    type="button"
                    onClick={() => playVoiceMemo(lightboxItem.audioNoteUrl!, lightboxItem.id)}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-2xl active:scale-95 cursor-pointer"
                  >
                    {playingAudioId === lightboxItem.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{playingAudioId === lightboxItem.id ? 'ऑडियो रोकें' : 'कंठ स्मृति सुनें'}</span>
                  </button>
                )}
              </div>

              <div className="p-5 bg-white space-y-3">
                {lightboxItem.shlokaTag && (
                  <div className="p-3 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-amber-950 text-xs italic font-mukta">
                    "{lightboxItem.shlokaTag}"
                  </div>
                )}

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-mukta">
                  {lightboxItem.caption}
                </p>

                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-mono">
                    {lightboxItem.ghatLocation && (
                      <span className="flex items-center gap-1 text-stone-800">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {lightboxItem.ghatLocation}
                      </span>
                    )}
                    {lightboxItem.familyMembers && (
                      <span className="flex items-center gap-1 text-stone-800">
                        <Users className="w-3.5 h-3.5 text-orange-500" />
                        {lightboxItem.familyMembers}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadFramedPhoto(lightboxItem, false)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>HD डाउनलोड</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadFramedPhoto(lightboxItem, true)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>9:16 स्टेटस</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Fullscreen Slideshow Mode (🎬 स्मरण दर्शन) */}
        {slideshowOpen && filteredMemories.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300">
            {/* Top Slideshow Controller */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="font-rozha text-lg text-amber-300">
                  ॥ छठ स्मरण दर्शन ॥
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {slideshowIndex + 1} / {filteredMemories.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAmbientSound}
                  className={`p-2 rounded-full border transition-all cursor-pointer ${
                    ambientAudioActive
                      ? 'bg-amber-500 text-stone-950 border-amber-500'
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                  title="गंगा तट ध्वनि"
                >
                  {ambientAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSlideshowPlaying(!slideshowPlaying)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  {slideshowPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSlideshowOpen(false);
                    devotionalAudio.stopRiverWaves();
                    setAmbientAudioActive(false);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slideshow Main Stage */}
            {(() => {
              const currentSlide = filteredMemories[slideshowIndex];
              return (
                <div className="flex-1 flex flex-col items-center justify-center my-4 relative max-w-4xl mx-auto w-full">
                  <div className="relative max-h-[65vh] w-full flex items-center justify-center">
                    <img
                      src={currentSlide.imageUrl}
                      alt={currentSlide.title}
                      className="max-h-[65vh] max-w-full rounded-2xl object-contain shadow-2xl border-2 border-amber-500/40"
                    />
                  </div>

                  <div className="mt-4 text-center space-y-1.5 max-w-2xl px-4">
                    <h3 className="text-xl sm:text-2xl font-bold font-rozha text-amber-200">
                      {currentSlide.title}
                    </h3>
                    {currentSlide.shlokaTag && (
                      <p className="text-xs text-amber-400 italic">
                        "{currentSlide.shlokaTag}"
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {currentSlide.caption}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between max-w-md mx-auto w-full z-10 pt-2">
              <button
                type="button"
                onClick={() => setSlideshowIndex(prev => (prev - 1 + filteredMemories.length) % filteredMemories.length)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {filteredMemories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideshowIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      slideshowIndex === i ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSlideshowIndex(prev => (prev + 1) % filteredMemories.length)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 5. A4 Printable Photobook Modal */}
        {showPrintModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setShowPrintModal(false)}
          >
            <div 
              className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl relative text-left my-6 max-h-[95vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base sm:text-lg font-bold font-rozha text-stone-900">
                    A4 पारिवारिक स्मृति पत्रिका प्रिंट / PDF पूर्वावलोकन
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>प्रिंट करें / PDF सहेजें</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Area */}
              <div className="p-6 rounded-2xl border-4 border-amber-600/30 bg-[#faf8f5] space-y-6">
                <div className="text-center space-y-1 pb-4 border-b border-amber-600/30">
                  <span className="text-xs text-amber-800 font-bold tracking-widest uppercase">
                    ॥ श्री गणेशाय नमः ॥ जय छठी मईया ॥
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-rozha text-stone-950">
                    छठ महापर्व • पारिवारिक स्मृति पत्रिका
                  </h2>
                  <p className="text-xs text-stone-600 font-mukta">
                    {currentUser?.name || 'परिवार'} की पावन स्मृतियां • संकलन वर्ष 2024-2026
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {filteredMemories.slice(0, 6).map(mem => (
                    <div key={mem.id} className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-xs font-bold font-rozha text-stone-950 line-clamp-1">{mem.title}</h4>
                      <p className="text-[10px] text-stone-600 line-clamp-2 leading-tight">{mem.caption}</p>
                      <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                        <span>{mem.ghatLocation}</span>
                        <span>{mem.date}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4 border-t border-amber-600/30 text-xs text-amber-900 font-mukta italic">
                  "सदा सुहागिन रहिहैं, अन-धन से भरल भंडार रहै। जय छठी मईया।"
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
