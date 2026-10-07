import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  ArrowLeft, 
  Sun, 
  Sunset, 
  Moon, 
  Volume2, 
  VolumeX, 
  Compass, 
  Maximize, 
  Minimize, 
  Play, 
  Pause, 
  RotateCw, 
  Sparkles, 
  X, 
  Heart, 
  Share2, 
  Check, 
  Flame, 
  Droplets, 
  Layers, 
  ChevronRight, 
  Info,
  ChevronDown,
  MapPin,
  Eye,
  ExternalLink,
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { sacredAudio } from '../../utils/sacredAudioEngine';

interface Ghat3DExperiencePageProps {
  onNavigate?: (tab: string) => void;
}

type LightingMode = 'morning' | 'sunset' | 'night';

interface GhatSpotInfo {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  desc: string;
  significance: string;
  mantra?: string;
  position: [number, number, number];
  targetAngle: { lon: number; lat: number };
}

interface HolyGhatData {
  id: string;
  name: string;
  city: string;
  state: string;
  tagline: string;
  description: string;
  waterColor: {
    morning: string;
    sunset: string;
    night: string;
  };
}

interface GhatVideoHighlight {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  location: string;
  tag: string;
}

const HOLY_GHATS: HolyGhatData[] = [
  {
    id: 'patna-collectorate',
    name: 'कलेक्ट्रेट घाट (Collectorate Ghat)',
    city: 'पटना',
    state: 'बिहार',
    tagline: 'हजारों छठ व्रतियों का महासंगम व भव्य गंगा तट',
    description: 'पटना का ऐतिहासिक एवं सबसे विशाल छठ घाट, जहाँ षष्ठी व सप्तमी को लाखों श्रद्धालु अस्ताचलगामी व उदीयमान सूर्य को अर्घ्य अर्पित करते हैं।',
    waterColor: {
      morning: '#38bdf8',
      sunset: '#f97316',
      night: '#0c4a6e'
    }
  },
  {
    id: 'patna-digha',
    name: 'दीघा घाट 93 (Digha Ghat)',
    city: 'पटना',
    state: 'बिहार',
    tagline: 'विशाल रेतीला तट और असीम गंगा विस्तार',
    description: 'गंगा सेतु के निकट स्थित दीघा घाट पर खुला विस्तृत रेत का मैदान छठ पूजा के पवित्र ईख के मंडप और अखंड दीपों से जगमगा उठता है।',
    waterColor: {
      morning: '#0ea5e9',
      sunset: '#fb923c',
      night: '#075985'
    }
  },
  {
    id: 'varanasi-assi',
    name: 'अस्सी घाट (Assi Ghat)',
    city: 'वाराणसी',
    state: 'उत्तर प्रदेश',
    tagline: 'प्राचीन अर्धचंद्राकार गंगा तट व दीपदान संगम',
    description: 'असि और गंगा के पावन संगम पर स्थित अस्सी घाट पर छठ महापर्व की संध्या गंगा आरती और अर्घ्य का अलौकिक दृश्य प्रस्तुत करती है।',
    waterColor: {
      morning: '#0284c7',
      sunset: '#ea580c',
      night: '#1e1b4b'
    }
  },
  {
    id: 'haridwar-harki',
    name: 'हर की पौड़ी (Har Ki Pauri)',
    city: 'हरिद्वार',
    state: 'उत्तराखंड',
    tagline: 'पावन ब्रह्मकुंड व हिमालयी निर्मल जलधारा',
    description: 'माँ गंगा की तीव्र व पावन धारा के बीच ब्रह्मकुंड पर सूर्य देव को संध्या व उषा अर्घ्य अर्पित करना महापुण्यदायी माना जाता है।',
    waterColor: {
      morning: '#06b6d4',
      sunset: '#f59e0b',
      night: '#083344'
    }
  }
];

const HOTSPOTS: GhatSpotInfo[] = [
  {
    id: 'surya',
    name: 'Bhagwan Surya (Sun God)',
    hindiName: 'प्रत्यक्ष देव भगवान सूर्य',
    category: 'उपासना',
    desc: 'समस्त जगत के प्राण, ऊर्जा व चक्षु। छठ महापर्व में षष्ठी को अस्ताचलगामी और सप्तमी को उदीयमान सूर्य की प्रत्यक्ष पूजा होती है।',
    significance: 'सूर्य देव की किरणें आरोग्य, तेज, बुद्धि और वंश वृद्धि का वरदान प्रदान करती हैं।',
    mantra: 'ॐ घृणिः सूर्य आदित्यः क्लीं ॐ | ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।',
    position: [120, 140, -420],
    targetAngle: { lon: 90, lat: 12 }
  },
  {
    id: 'ganga',
    name: 'Holy Ganga River (Ganga Jal)',
    hindiName: 'मोक्षदायिनी पावन गंगा',
    category: 'पवित्र जल',
    desc: 'शीतल पापनाशिनी भागीरथी गंगा। व्रती कमर तक जल में खड़े होकर दोनों हाथों में सूप लेकर सूर्य देव की प्रतीक्षा करते हैं।',
    significance: 'गंगाजल में खड़े होने से शरीर के पंचतत्व संतुलित होते हैं और मन शांत व एकाग्र होता है।',
    mantra: 'गंगे च यमुने चैव गोदावरि सरस्वति। नर्मदे सिन्धु कावेरि जलेऽस्मिन् संनिधिं कुरु॥',
    position: [0, -90, -320],
    targetAngle: { lon: 0, lat: -18 }
  },
  {
    id: 'daura',
    name: 'Bamboo Daura & Sup',
    hindiName: 'बांस का दउरा व पीतल सूप',
    category: 'महाप्रसाद',
    desc: 'शुद्ध घी से निर्मित ठेकुआ, कसार, मौसमी फल, नारियल, सिन्दूर व सुथनी से सुसज्जित पवित्र दउरा।',
    significance: 'बांस प्रकृति से जुड़ाव और सामाजिक समानता का शाश्वत संदेश देता है।',
    mantra: 'ॐ अन्नपते अन्नस्य नो देहि अनमीवस्य शुष्मिणः। प्र प्र दातारं तारिष ऊर्जं नो धेहि द्विपदे चतुष्पदे॥',
    position: [-160, -95, -280],
    targetAngle: { lon: 160, lat: -12 }
  },
  {
    id: 'sugarcane',
    name: 'Sacred Sugarcane Canopy',
    hindiName: 'पवित्र ईख का मंडप (गन्ना)',
    category: 'मंडप',
    desc: 'शीर्ष पर हरी पत्तियों सहित चार गांठेदार गन्नों को बांधकर सूर्य देव व षष्ठी माता का पावन मंडप बनाया जाता है।',
    significance: 'ईख की मिठास व पोर-पोर जीवन की निरंतरता, कृषि समृद्धि व मिठास का प्रतीक है।',
    position: [170, -75, -290],
    targetAngle: { lon: 175, lat: -8 }
  },
  {
    id: 'diya',
    name: 'Floating Earthen Lamps',
    hindiName: 'गंगा में तैरते दीप (दीपदान)',
    category: 'दीपदान',
    desc: 'गाय के शुद्ध घी से प्रज्वलित मिट्टी के अखंड दीप, जो गंगा की लहरों पर तैरते हुए संपूर्ण घाट को आलोकित करते हैं।',
    significance: 'अज्ञान और अंधकार पर प्रकाश, सत्य व निष्कलंक भक्ति की विजय का प्रतीक।',
    mantra: 'शुभं करोति कल्याणमारोग्यं धनसंपदा। शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तुते॥',
    position: [-40, -110, -220],
    targetAngle: { lon: 270, lat: -22 }
  },
  {
    id: 'vrati',
    name: 'Chhath Vrati Devotee',
    hindiName: 'छठ व्रती व तपस्वी साधक',
    category: 'साधना',
    desc: '36 घंटे का अखंड निर्जला उपवास रखकर, पीले वस्त्र धारण किए निष्ठापूर्वक सूर्य उपासना में लीन व्रती।',
    significance: 'व्रती की तपस्या समस्त परिवार, समाज और विश्व के कल्याण व आरोग्य हेतु होती है।',
    position: [70, -100, -260],
    targetAngle: { lon: 135, lat: -15 }
  }
];

const REAL_GHAT_VIDEOS: GhatVideoHighlight[] = [
  {
    id: 'vid-1',
    title: 'पटना गंगा घाट संध्या अर्घ्य 4K विहंगम दृश्य',
    youtubeId: 'u0nOfHGb5FQ',
    duration: '0:35',
    location: 'कलेक्ट्रेट घाट, पटना',
    tag: '4K संध्या अर्घ्य'
  },
  {
    id: 'vid-2',
    title: 'दीघा पाटीपुल घाट संध्या अर्घ्य लाइव दृश्य',
    youtubeId: 'dZr4KPbBjNo',
    duration: '0:35',
    location: 'दीघा घाट 93, पटना',
    tag: 'विशाल रेतीला तट'
  },
  {
    id: 'vid-3',
    title: 'काशी अस्सी घाट पर छठ महापर्व व संध्या आरती',
    youtubeId: 'w9AiKa0gGMs',
    duration: '0:42',
    location: 'अस्सी घाट, वाराणसी',
    tag: 'काशी दीपदान'
  },
  {
    id: 'vid-4',
    title: 'काठ के सांचे पर ठेकुआ निर्माण महाप्रसाद',
    youtubeId: 'Jegu3rAfrHY',
    duration: '0:30',
    location: 'पारंपरिक रसोई, बिहार',
    tag: 'ठेकुआ महाप्रसाद'
  },
  {
    id: 'vid-5',
    title: 'पावन कोसी भराई अनुष्ठान व रातभर जागरण',
    youtubeId: 'GaU5JxThjHY',
    duration: '0:38',
    location: 'दरभंगा, बिहार',
    tag: 'कोसी भराई'
  },
  {
    id: 'vid-6',
    title: 'सिर पर दउरा उठाकर नंगे पांव घाट यात्रा',
    youtubeId: 'pe8IZ2DlwNI',
    duration: '0:48',
    location: 'गंगा तट, बक्सर',
    tag: 'श्रद्धा व समर्पण'
  }
];

export const Ghat3DExperiencePage: React.FC<Ghat3DExperiencePageProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [selectedGhat, setSelectedGhat] = useState<HolyGhatData>(HOLY_GHATS[0]);
  const [lighting, setLighting] = useState<LightingMode>('morning');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isGyroActive, setIsGyroActive] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<GhatSpotInfo | null>(null);
  const [arghyaModalOpen, setArghyaModalOpen] = useState<boolean>(false);
  const [diyaModalOpen, setDiyaModalOpen] = useState<boolean>(false);
  const [ghatInfoOpen, setGhatInfoOpen] = useState<boolean>(false);
  const [videoModalId, setVideoModalId] = useState<string | null>(null);
  const [diyaName, setDiyaName] = useState<string>('');
  const [diyaWish, setDiyaWish] = useState<string>('');
  const [floatedDiyasCount, setFloatedDiyasCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chhath_user_floated_diyas');
      return saved ? parseInt(saved, 10) : 7;
    } catch {
      return 7;
    }
  });
  const [compassHeading, setCompassHeading] = useState<number>(90); // 90° East (Facing Sun)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const waterPlaneRef = useRef<THREE.Mesh | null>(null);
  const diyasGroupRef = useRef<THREE.Group | null>(null);
  const hotspotsGroupRef = useRef<THREE.Group | null>(null);

  // Interaction References
  const isUserInteractingRef = useRef<boolean>(false);
  const onPointerDownPointerXRef = useRef<number>(0);
  const onPointerDownPointerYRef = useRef<number>(0);
  const lonRef = useRef<number>(90); // Start facing East (facing Sun)
  const onPointerDownLonRef = useRef<number>(90);
  const latRef = useRef<number>(0);
  const onPointerDownLatRef = useRef<number>(0);
  const phiRef = useRef<number>(0);
  const thetaRef = useRef<number>(0);

  // Clean exit back to main app
  const handleBack = () => {
    sacredAudio.stop();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.hash = '#home';
    }
  };

  // Fullscreen toggle (Expands 360 viewer to full viewport)
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    if (!isFullscreen) {
      showToast('🌟 360° पूर्ण विहंगम मोड सक्रिय');
    } else {
      showToast('साधारण दृश्य मोड');
    }
  };

  // Sound toggle
  const toggleAudio = () => {
    const active = sacredAudio.toggle();
    setIsAudioPlaying(active);
    if (active) {
      showToast('🔔 पवित्र गंगाजल व मंदिर घंटियों की ध्वनि चालू');
    } else {
      showToast('ध्वनि बंद');
    }
  };

  // Quick Camera Direction Focus with Smooth Transition
  const focusCameraTowards = (directionAngle: number, pitchAngle: number = 0) => {
    lonRef.current = directionAngle;
    latRef.current = pitchAngle;
    setIsAutoRotate(false);
    // Smooth scroll back to 360 viewer if user was scrolled down
    if (containerRef.current && !isFullscreen) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Directional Nudge buttons
  const nudgeCamera = (dLon: number, dLat: number) => {
    lonRef.current += dLon;
    latRef.current = Math.max(-75, Math.min(75, latRef.current + dLat));
    setIsAutoRotate(false);
  };

  // Generate 360 Panoramic Texture onto HTML Canvas
  const generatePanoramaTexture = useCallback((ghat: HolyGhatData, mode: LightingMode): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Sky Gradient based on Lighting
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    if (mode === 'morning') {
      skyGrad.addColorStop(0, '#581c87'); // Deep dawn purple zenith
      skyGrad.addColorStop(0.25, '#c2410c'); // Vermillion morning glow
      skyGrad.addColorStop(0.5, '#ea580c'); // Radiant saffron
      skyGrad.addColorStop(0.85, '#fde047'); // Golden horizon
      skyGrad.addColorStop(1, '#fef9c3'); // Brilliant morning light
    } else if (mode === 'sunset') {
      skyGrad.addColorStop(0, '#311042'); // Dusk violet
      skyGrad.addColorStop(0.3, '#991b1b'); // Crimson red
      skyGrad.addColorStop(0.65, '#ea580c'); // Deep orange
      skyGrad.addColorStop(0.88, '#f59e0b'); // Amber
      skyGrad.addColorStop(1, '#fed7aa'); // Sunset horizon
    } else {
      // Night mode
      skyGrad.addColorStop(0, '#030712'); // Pitch black cosmos
      skyGrad.addColorStop(0.4, '#0f172a'); // Midnight blue
      skyGrad.addColorStop(0.8, '#1e293b'); // Dark indigo
      skyGrad.addColorStop(1, '#334155'); // Soft horizon ambient glow
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Night Stars & Galaxy Dust
    if (mode === 'night') {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 400; i++) {
        const sx = Math.random() * w;
        const sy = Math.random() * (h * 0.6);
        const radius = Math.random() * 1.6 + 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.globalAlpha = Math.random() * 0.8 + 0.2;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Crescent Moon in Night Mode
      const moonX = w * 0.72;
      const moonY = h * 0.22;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(moonX + 12, moonY - 6, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
    }

    // 3. Bhagwan Surya (Sun) in Morning / Sunset Mode
    if (mode === 'morning' || mode === 'sunset') {
      const sunX = w * 0.25; // Centered at 90° East
      const sunY = mode === 'morning' ? h * 0.44 : h * 0.52;
      const sunRadius = mode === 'morning' ? 48 : 56;

      // Outer Divine Corona Glow
      const glowGrad = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 4.5);
      if (mode === 'morning') {
        glowGrad.addColorStop(0, 'rgba(255, 245, 150, 0.95)');
        glowGrad.addColorStop(0.3, 'rgba(251, 191, 36, 0.75)');
        glowGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.35)');
        glowGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(254, 215, 170, 0.95)');
        glowGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.8)');
        glowGrad.addColorStop(0.8, 'rgba(225, 29, 72, 0.4)');
        glowGrad.addColorStop(1, 'rgba(159, 18, 57, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Sun Core Disk
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = mode === 'morning' ? '#ffffff' : '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 50;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 4. Distant Shore & Holy Ganga River Bank Silhouettes
    const horizonY = h * 0.60;
    ctx.fillStyle = mode === 'night' ? '#090d16' : '#451a03';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    for (let x = 0; x <= w; x += 30) {
      const hillHeight = Math.sin(x * 0.015) * 12 + Math.cos(x * 0.04) * 8;
      ctx.lineTo(x, horizonY - hillHeight);
    }
    ctx.lineTo(w, horizonY + 30);
    ctx.lineTo(0, horizonY + 30);
    ctx.fill();

    // Distant Temple Domes & Shikhara Silhouettes
    const templePoints = [w * 0.12, w * 0.42, w * 0.58, w * 0.85];
    templePoints.forEach(tx => {
      ctx.beginPath();
      ctx.moveTo(tx - 20, horizonY);
      ctx.lineTo(tx, horizonY - 45);
      ctx.lineTo(tx + 20, horizonY);
      ctx.fill();

      // Sacred Temple Flag
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx, horizonY - 45);
      ctx.lineTo(tx, horizonY - 60);
      ctx.lineTo(tx + 12, horizonY - 54);
      ctx.stroke();
    });

    // 5. River Water Base Surface (Bottom 40% of sphere)
    const waterGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    if (mode === 'morning') {
      waterGrad.addColorStop(0, '#fbbf24');
      waterGrad.addColorStop(0.2, '#0284c7');
      waterGrad.addColorStop(0.6, '#0369a1');
      waterGrad.addColorStop(1, '#075985');
    } else if (mode === 'sunset') {
      waterGrad.addColorStop(0, '#f97316');
      waterGrad.addColorStop(0.25, '#c2410c');
      waterGrad.addColorStop(0.7, '#7c2d12');
      waterGrad.addColorStop(1, '#431407');
    } else {
      waterGrad.addColorStop(0, '#0f172a');
      waterGrad.addColorStop(0.3, '#0c4a6e');
      waterGrad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    // 6. Shimmering Water Reflection of Surya Dev
    if (mode === 'morning' || mode === 'sunset') {
      const sunX = w * 0.25;
      const refGrad = ctx.createLinearGradient(sunX, horizonY, sunX, h);
      refGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      refGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.45)');
      refGrad.addColorStop(1, 'rgba(249, 115, 22, 0.05)');
      ctx.fillStyle = refGrad;

      for (let y = horizonY; y < h; y += 8) {
        const spread = (y - horizonY) * 0.28;
        const offset = Math.sin(y * 0.1) * 14;
        ctx.fillRect(sunX - spread / 2 + offset, y, spread, 4);
      }
    }

    // 7. Stone Ghat Steps & Devotee Platforms
    ctx.fillStyle = mode === 'night' ? '#18181b' : '#78350f';
    const stepsStartX = w * 0.55;
    const stepsEndX = w * 0.95;
    ctx.beginPath();
    ctx.moveTo(stepsStartX, h);
    ctx.lineTo(stepsStartX + 40, h * 0.78);
    ctx.lineTo(stepsEndX, h * 0.78);
    ctx.lineTo(stepsEndX + 60, h);
    ctx.fill();

    // Sacred Marigold Flowers on Steps
    for (let i = 0; i < 45; i++) {
      const dx = stepsStartX + 50 + Math.random() * (stepsEndX - stepsStartX - 60);
      const dy = h * 0.80 + Math.random() * (h * 0.18);
      ctx.beginPath();
      ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }, []);

  // Create 3D Diya Mesh with Clay Cup and Glowing Flame Light
  const createDiyaMesh = (): THREE.Group => {
    const group = new THREE.Group();

    // Clay Cup
    const cupGeo = new THREE.ConeGeometry(7, 4, 16);
    cupGeo.rotateX(Math.PI);
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.85
    });
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    group.add(cupMesh);

    // Glowing Flame Core
    const flameGeo = new THREE.SphereGeometry(2.5, 12, 12);
    flameGeo.scale(0.8, 1.8, 0.8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 3.5;
    group.add(flameMesh);

    // Point Light casting golden radiance
    const diyaLight = new THREE.PointLight(0xf59e0b, 1.2, 55);
    diyaLight.position.set(0, 4, 0);
    group.add(diyaLight);

    return group;
  };

  // Create Glowing 3D Hotspot Sprite
  const createHotspotSprite = (_spot: GhatSpotInfo): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Concentric glowing divine rings
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 58);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.95)');
    grad.addColorStop(0.7, 'rgba(234, 88, 12, 0.55)');
    grad.addColorStop(1, 'rgba(234, 88, 12, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.fill();

    // White Center Core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 64, 14, 0, Math.PI * 2);
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(38, 38, 1);
    return sprite;
  };

  // Pointer Interaction Handlers for 360 Navigation
  const handlePointerDown = (e: React.PointerEvent) => {
    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = lonRef.current;
    onPointerDownLatRef.current = latRef.current;
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isUserInteractingRef.current) return;
    const deltaX = e.clientX - onPointerDownPointerXRef.current;
    const deltaY = e.clientY - onPointerDownPointerYRef.current;

    lonRef.current = onPointerDownLonRef.current - deltaX * 0.18;
    latRef.current = onPointerDownLatRef.current + deltaY * 0.18;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isUserInteractingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const fov = cameraRef.current.fov + e.deltaY * 0.05;
    cameraRef.current.fov = Math.max(38, Math.min(95, fov));
    cameraRef.current.updateProjectionMatrix();
  };

  // Canvas Click for Hotspot Selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !hotspotsGroupRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const intersects = raycaster.intersectObjects(hotspotsGroupRef.current.children);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const spotId = hit.userData.spotId;
      const spot = HOTSPOTS.find(s => s.id === spotId);
      if (spot) {
        setSelectedSpot(spot);
        sacredAudio.playTempleBell();
      }
    }
  };

  // Initialize Three.js Scene, Camera, WebGL Renderer, 3D Water & 3D Diyas
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // 3. 360 Sky Sphere (Normals inverted to look inward)
    const sphereGeo = new THREE.SphereGeometry(800, 64, 48);
    sphereGeo.scale(-1, 1, 1);

    const panoTexture = generatePanoramaTexture(selectedGhat, lighting);
    const sphereMat = new THREE.MeshBasicMaterial({ map: panoTexture });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // 4. 3D Ganga Water Mesh with gentle Sinusoidal Ripple Animation
    const waterGeo = new THREE.PlaneGeometry(900, 900, 48, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedGhat.waterColor[lighting]),
      roughness: 0.25,
      metalness: 0.65,
      transparent: true,
      opacity: 0.88
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -110;
    scene.add(waterMesh);
    waterPlaneRef.current = waterMesh;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(
      lighting === 'night' ? 0x2e3856 : (lighting === 'sunset' ? 0xff7733 : 0xfffae6),
      lighting === 'night' ? 0.7 : 1.2
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      lighting === 'night' ? 0x6366f1 : (lighting === 'sunset' ? 0xf97316 : 0xfde047),
      lighting === 'night' ? 0.4 : 1.4
    );
    sunLight.position.set(150, 180, -350);
    scene.add(sunLight);

    // 6. 3D Floating Diya Group
    const diyasGroup = new THREE.Group();
    diyasGroupRef.current = diyasGroup;
    scene.add(diyasGroup);

    // Populate initial floating diyas
    const diyaCount = lighting === 'night' ? 36 : 18;
    for (let i = 0; i < diyaCount; i++) {
      const diyaMesh = createDiyaMesh();
      const angle = (Math.PI * 2 * i) / diyaCount + (Math.random() - 0.5) * 0.4;
      const dist = 120 + Math.random() * 260;
      diyaMesh.position.set(Math.cos(angle) * dist, -108, Math.sin(angle) * dist);
      diyasGroup.add(diyaMesh);
    }

    // 7. 3D Hotspot Sprites Group
    const hotspotsGroup = new THREE.Group();
    hotspotsGroupRef.current = hotspotsGroup;
    scene.add(hotspotsGroup);

    HOTSPOTS.forEach((spot) => {
      const sprite = createHotspotSprite(spot);
      sprite.position.set(...spot.position);
      sprite.userData = { spotId: spot.id };
      hotspotsGroup.add(sprite);
    });

    // 8. Animation & Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto-Rotation when enabled and user not interacting
      if (isAutoRotate && !isUserInteractingRef.current && !isGyroActive) {
        lonRef.current += 0.06;
      }

      // Lat / Lon to Camera Target Conversion
      latRef.current = Math.max(-80, Math.min(80, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      const targetY = 500 * Math.cos(phiRef.current);
      const targetZ = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      camera.lookAt(targetX, targetY, targetZ);

      // Update Compass Heading
      const normalizedLon = ((lonRef.current % 360) + 360) % 360;
      setCompassHeading(Math.round(normalizedLon));

      // Gentle Water Wave Animation
      const posAttr = waterGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        const wave = Math.sin(u * 0.035 + elapsedTime * 1.8) * 2.5 + Math.cos(v * 0.04 + elapsedTime * 1.4) * 2.2;
        posAttr.setZ(i, wave);
      }
      posAttr.needsUpdate = true;

      // Bob floating diyas on waves
      diyasGroup.children.forEach((diya, idx) => {
        const bob = Math.sin(elapsedTime * 2.2 + idx) * 1.8;
        diya.position.y = -108 + bob;
        diya.position.x += 0.04;
        if (diya.position.x > 380) diya.position.x = -380;
      });

      // Pulse Hotspot Sprites
      hotspotsGroup.children.forEach((sprite, idx) => {
        const pulse = 1 + Math.sin(elapsedTime * 3.5 + idx * 0.8) * 0.12;
        sprite.scale.set(38 * pulse, 38 * pulse, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer for dynamic container changes
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      renderer.dispose();
      sphereGeo.dispose();
      waterGeo.dispose();
      panoTexture.dispose();
    };
  }, [selectedGhat, lighting, generatePanoramaTexture, isAutoRotate, isGyroActive, isFullscreen]);

  // Gyroscope Mobile Device Orientation
  useEffect(() => {
    if (!isGyroActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null) {
        lonRef.current = e.alpha;
        latRef.current = Math.max(-75, Math.min(75, (e.beta - 45) * 0.9));
      }
    };

    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((perm: string) => {
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            setIsGyroActive(false);
            showToast('मोशन सेंसर की अनुमति अस्वीकृत');
          }
        })
        .catch(() => setIsGyroActive(false));
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isGyroActive]);

  // Float a new Diya into 3D Ganga
  const handleFloatDiyaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneRef.current || !diyasGroupRef.current) return;

    const newDiya = createDiyaMesh();
    // Spawn right in front of camera
    const rad = THREE.MathUtils.degToRad(lonRef.current);
    newDiya.position.set(Math.sin(rad) * 110, -106, -Math.cos(rad) * 110);
    diyasGroupRef.current.add(newDiya);

    const nextCount = floatedDiyasCount + 1;
    setFloatedDiyasCount(nextCount);
    try {
      localStorage.setItem('chhath_user_floated_diyas', nextCount.toString());
    } catch {}

    setDiyaModalOpen(false);
    setDiyaName('');
    setDiyaWish('');
    sacredAudio.playArghyaChime();
    showToast('✨ आपका पावन दीप गंगाजी में प्रवाहित हो गया!');
  };

  // Perform Virtual Arghya Ceremony
  const handlePerformArghya = () => {
    sacredAudio.playArghyaChime();
    setArghyaModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white font-mukta overflow-y-auto selection:bg-amber-500 selection:text-black flex flex-col">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[80] bg-stone-900/95 border border-amber-500/50 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          TOP NAVIGATION BAR (Sticky Glassmorphic Header)
         ======================================================== */}
      <header className="sticky top-0 z-50 bg-stone-950/85 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-lg">
        
        {/* Left: Back & Ghat Switcher Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white transition-all cursor-pointer"
            title="वापस जाएं (Back)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setGhatInfoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-left transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '24s' }} />
            <div>
              <p className="text-xs sm:text-sm font-bold leading-tight truncate max-w-[130px] sm:max-w-[210px] text-amber-200 font-rozha">
                {selectedGhat.name}
              </p>
              <p className="text-[10px] text-amber-300/80 leading-none">
                {selectedGhat.city}, {selectedGhat.state} • 360° दर्शन
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-amber-300 ml-0.5" />
          </button>
        </div>

        {/* Center: Compass Heading Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/15 text-xs font-mono font-bold text-amber-300">
          <span>{compassHeading}°</span>
          <span className="text-[11px] text-white/80 font-mukta">
            {compassHeading >= 45 && compassHeading < 135 ? 'पूर्व (सूर्य देव ☀️)' : 
             compassHeading >= 135 && compassHeading < 225 ? 'दक्षिण (घाट सीढ़ियाँ)' :
             compassHeading >= 225 && compassHeading < 315 ? 'पश्चिम (तट विस्तार)' : 'उत्तर (गंगा धारा 🌊)'}
          </span>
        </div>

        {/* Right: Sound, Auto-Tour, Gyro, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
              isAudioPlaying 
                ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-lg shadow-amber-500/30' 
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
            title={isAudioPlaying ? "ध्वनि बंद करें" : "गंगा व मंदिर ध्वनि चालू करें"}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto Rotate Drone Tour */}
          <button
            type="button"
            onClick={() => {
              setIsAutoRotate(!isAutoRotate);
              showToast(isAutoRotate ? 'ऑटो-दर्शन बंद' : '360° स्वतः दर्शन चालू');
            }}
            className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
              isAutoRotate 
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400' 
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white/80'
            }`}
            title="360° स्वतः दर्शन"
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '14s' }} />
          </button>

          {/* Fullscreen Immersion Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all active:scale-95 cursor-pointer"
            title="फुलस्क्रीन 360° मोड"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================
          HERO 3D 360° INTERACTIVE GHAT VIEWPORT
         ======================================================== */}
      <section 
        ref={containerRef}
        className={`w-full relative bg-black select-none ${
          isFullscreen 
            ? 'fixed inset-0 z-[70] h-screen w-screen overflow-hidden' 
            : 'h-[58vh] sm:h-[72vh] min-h-[440px] max-h-[760px] border-b border-stone-800 shadow-2xl'
        }`}
      >
        {/* 3D WebGL Canvas Layer */}
        <canvas 
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
        />

        {/* 360° Interaction Hint Ribbon (Disappears on touch) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[11px] font-bold text-amber-200 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
          <span>🔄</span>
          <span>स्क्रीन पर स्वाइप करके 360° चारों तरफ देखें</span>
        </div>

        {/* Fullscreen Exit Button (When in Fullscreen) */}
        {isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-40 p-2.5 rounded-2xl bg-black/70 hover:bg-black/90 border border-white/30 text-white cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xl backdrop-blur-md"
          >
            <Minimize className="w-4 h-4" />
            <span>सामान्य दृश्य</span>
          </button>
        )}

        {/* Quick Pan Directional Controls (Mobile Friendly Touch Arrows) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1 pointer-events-auto bg-black/55 p-1 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => nudgeCamera(0, 15)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 active:scale-90"
            title="ऊपर आकाश देखें"
          >
            <MoveUp className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => nudgeCamera(-25, 0)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 active:scale-90"
              title="बाईं ओर घूमें"
            >
              <MoveLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => nudgeCamera(25, 0)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 active:scale-90"
              title="दाईं ओर घूमें"
            >
              <MoveRight className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => nudgeCamera(0, -15)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 active:scale-90"
            title="नीचे जल देखें"
          >
            <MoveDown className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Perspective Shortcuts & Sacred Actions Overlay */}
        <div className="absolute bottom-3 left-2 right-2 sm:left-4 sm:right-4 z-30 pointer-events-none flex flex-col items-center gap-2">
          
          {/* Angle Focus Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md pointer-events-auto shadow-2xl overflow-x-auto max-w-full scrollbar-none">
            <button
              type="button"
              onClick={() => focusCameraTowards(90, 10)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-amber-500 hover:text-stone-950 transition-colors shrink-0"
            >
              ☀️ सूर्य देव
            </button>
            <button
              type="button"
              onClick={() => focusCameraTowards(0, -18)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-sky-500 hover:text-stone-950 transition-colors shrink-0"
            >
              🌊 गंगाजल
            </button>
            <button
              type="button"
              onClick={() => focusCameraTowards(160, -12)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-orange-500 hover:text-stone-950 transition-colors shrink-0"
            >
              🎋 दउरा व ईख
            </button>
            <button
              type="button"
              onClick={() => focusCameraTowards(270, -20)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-amber-500 hover:text-stone-950 transition-colors shrink-0"
            >
              🪔 दीपदान
            </button>
          </div>

          {/* Time of Day Lighting & Actions Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
            {/* Time of Day Lighting Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-black/75 border border-white/20 backdrop-blur-md shadow-2xl">
              <button
                type="button"
                onClick={() => setLighting('morning')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lighting === 'morning'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>उषा अर्घ्य</span>
              </button>

              <button
                type="button"
                onClick={() => setLighting('sunset')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lighting === 'sunset'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
                <span>संध्या अर्घ्य</span>
              </button>

              <button
                type="button"
                onClick={() => setLighting('night')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lighting === 'night'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>रात्रि दीप</span>
              </button>
            </div>

            {/* Float 3D Diya Action */}
            <button
              type="button"
              onClick={() => setDiyaModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>दीया प्रवाहित करें ({floatedDiyasCount})</span>
            </button>

            {/* Virtual Arghya Action */}
            <button
              type="button"
              onClick={handlePerformArghya}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 fill-current" />
              <span>वर्चुअल अर्घ्य दें</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SCROLL PROMPT CUE (Smooth Page Scroll Guide)
         ======================================================== */}
      {!isFullscreen && (
        <div className="py-2.5 px-4 bg-stone-900/90 border-b border-stone-800 flex items-center justify-center gap-2 text-xs text-amber-300/90 font-medium">
          <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
          <span>नीचे स्क्रॉल करें: पावन घाट चयन, 6 पवित्र दर्शन बिंदु व वास्तविक वीडियो ↓</span>
        </div>
      )}

      {/* ========================================================
          SCROLLABLE DETAILS & RICH FEATURE SECTIONS
         ======================================================== */}
      {!isFullscreen && (
        <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8 flex-1">

          {/* ----------------------------------------------------
              SECTION 1: पावन घाट चयन (HOLY GHATS SWITCHER)
             ---------------------------------------------------- */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🌊</span>
                  <span>पावन घाट चयन (Explore Historic Holy Ghats in 3D)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  किसी भी घाट पर क्लिक करें — 360° दृश्य व गंगाजल रंग तुरंत बदल जाएगा
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {HOLY_GHATS.map((ghat) => {
                const isSelected = selectedGhat.id === ghat.id;
                return (
                  <div
                    key={ghat.id}
                    onClick={() => {
                      setSelectedGhat(ghat);
                      showToast(`${ghat.name} का 3D दृश्य लोड हुआ`);
                      focusCameraTowards(90, 8);
                    }}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-lg flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/40 text-white'
                        : 'bg-stone-900 border-stone-800 hover:border-amber-500/40 text-stone-300 hover:bg-stone-800/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-amber-400 border border-white/10">
                          {ghat.city}, {ghat.state}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold font-rozha text-amber-100">
                        {ghat.name}
                      </h4>
                      <p className="text-[11px] text-amber-300/80 font-medium mt-0.5">
                        {ghat.tagline}
                      </p>
                      <p className="text-xs text-stone-400 mt-2 line-clamp-3 leading-relaxed">
                        {ghat.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-bold text-amber-400">
                      <span>{isSelected ? 'सक्रिय 3D दृश्य' : '360° में देखें →'}</span>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ----------------------------------------------------
              SECTION 2: 3D घाट के 6 पावन दर्शन बिंदु (SACRED HOTSPOTS)
             ---------------------------------------------------- */}
          <section className="space-y-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                <span>🪔</span>
                <span>घाट के 6 पावन दर्शन बिंदु (6 Sacred 3D Hotspots)</span>
              </h3>
              <p className="text-xs text-stone-400">
                कार्ड पर क्लिक कर 3D कैमरे को सीधे उस पावन स्थल की ओर घुमाएं
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {HOTSPOTS.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpot(spot);
                    focusCameraTowards(spot.targetAngle.lon, spot.targetAngle.lat);
                    sacredAudio.playTempleBell();
                    showToast(`${spot.hindiName} की ओर कैमरा घुमाया गया`);
                  }}
                  className="p-4 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg hover:-translate-y-0.5 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {spot.category}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {spot.targetAngle.lon}° दिशा
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold font-rozha text-white">
                      {spot.hindiName}
                    </h4>
                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mt-1">
                      {spot.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>360° में इस ओर देखें</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------
              SECTION 3: समय बेला व प्रकाश व्यवस्था (LIGHTING MODES)
             ---------------------------------------------------- */}
          <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 space-y-4 shadow-xl">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                <span>☀️</span>
                <span>समय बेला व प्रकाश व्यवस्था (Sacred Time Modes)</span>
              </h3>
              <p className="text-xs text-stone-400">
                छठ महापर्व के विभिन्न प्रहरों की वास्तविक आभा का 360° अनुभव करें
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => {
                  setLighting('morning');
                  showToast('उषा अर्घ्य (प्रातःकाल) दृश्य सक्रिय');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  lighting === 'morning'
                    ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-400'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                  <Sun className="w-4 h-4" />
                  <span>उषा अर्घ्य (प्रातः बेला)</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  सप्तमी की ब्रह्मबेला। उदीयमान भगवान सूर्य की स्वर्णिम किरणें, लालिमा युक्त क्षितिज और गंगाजल में दूध अर्पण।
                </p>
              </div>

              <div
                onClick={() => {
                  setLighting('sunset');
                  showToast('संध्या अर्घ्य (सायंकाल) दृश्य सक्रिय');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  lighting === 'sunset'
                    ? 'bg-orange-500/20 border-orange-500 text-white ring-1 ring-orange-400'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm mb-1">
                  <Sunset className="w-4 h-4" />
                  <span>संध्या अर्घ्य (अस्ताचलगामी)</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  षष्ठी की पावन गोधूलि बेला। डूबते सूर्य को प्रथम अर्घ्य, सिंदूरी क्षितिज और लाखों व्रतियों का महासंगम।
                </p>
              </div>

              <div
                onClick={() => {
                  setLighting('night');
                  showToast('रात्रि दीप (अखंड दीपमाला) दृश्य सक्रिय');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  lighting === 'night'
                    ? 'bg-indigo-600/25 border-indigo-500 text-white ring-1 ring-indigo-400'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
                  <Moon className="w-4 h-4" />
                  <span>रात्रि दीप (अखंड दीपमाला)</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  तारों भरा नीला आकाश, दूज का चंद्रमा और गंगा की लहरों पर तैरते अनगिनत अखंड दीपों का अलौकिक दृश्य।
                </p>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              SECTION 4: वास्तविक 4K घाट वीडियो व साक्षात दर्शन
             ---------------------------------------------------- */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🎥</span>
                  <span>वास्तविक घाट वीडियो व साक्षात दर्शन (Real 4K Videos)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  पटना, वाराणसी व बिहार के घाटों का वास्तविक वीडियो देखें
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {REAL_GHAT_VIDEOS.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setVideoModalId(vid.youtubeId)}
                  className="group rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg flex flex-col hover:-translate-y-0.5"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <div className="w-11 h-11 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950">
                      {vid.tag}
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 font-rozha leading-snug line-clamp-2">
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{vid.location}</span>
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] font-bold text-amber-400">
                      <span>वीडियो चलाएं</span>
                      <Play className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------
              SECTION 5: पावन अनुष्ठान बैनर (DIYA & ARGHYA)
             ---------------------------------------------------- */}
          <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-900 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div className="space-y-1.5 max-w-xl">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🪔 डिजिटल गंगा दीपदान व अर्घ्य
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-rozha text-amber-100">
                मां गंगा की 3D धारा में दीप प्रवाहित करें
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                आपका नाम और मनोकामना 3D गंगा जल पर तैरते दीप के साथ प्रज्वलित रहेगी। अब तक कुल <strong className="text-amber-400">{floatedDiyasCount}</strong> दीप प्रवाहित हुए हैं।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setDiyaModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>अभी दीप प्रवाहित करें</span>
              </button>
              <button
                type="button"
                onClick={handlePerformArghya}
                className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Droplets className="w-4 h-4 fill-current" />
                <span>सूर्य देव को अर्घ्य दें</span>
              </button>
            </div>
          </section>

        </main>
      )}

      {/* ========================================================
          HOTSPOT DETAIL DRAWER / POPUP
         ======================================================== */}
      {selectedSpot && (
        <div 
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedSpot(null)}
        >
          <div 
            className="w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedSpot.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-rozha text-amber-100 mt-1">
                  {selectedSpot.hindiName}
                </h3>
                <p className="text-xs text-stone-400 font-sans">{selectedSpot.name}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed mb-3">
              {selectedSpot.desc}
            </p>

            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs mb-3 space-y-1">
              <p className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>धार्मिक व आध्यात्मिक महत्व:</span>
              </p>
              <p className="leading-relaxed">{selectedSpot.significance}</p>
            </div>

            {selectedSpot.mantra && (
              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700 text-xs font-mono text-amber-200 mb-4">
                <p className="text-[10px] text-stone-400 font-sans mb-0.5">पवित्र वैदिक मंत्र:</p>
                <p className="italic">{selectedSpot.mantra}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  focusCameraTowards(selectedSpot.targetAngle.lon, selectedSpot.targetAngle.lat);
                  setSelectedSpot(null);
                  showToast(`${selectedSpot.hindiName} की ओर 3D कैमरा केंद्रित हुआ`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>360° में देखें</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FLOAT 3D DIYA MODAL
         ======================================================== */}
      {diyaModalOpen && (
        <div 
          className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setDiyaModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <h3 className="text-base font-bold text-amber-100 font-rozha">
                  3D गंगा में पावन दीप प्रवाहित करें
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDiyaModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFloatDiyaSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  श्रद्धालु / परिवार का नाम *
                </label>
                <input
                  type="text"
                  value={diyaName}
                  onChange={(e) => setDiyaName(e.target.value)}
                  placeholder="उदा. राहुल, अंजलि व समस्त परिवार"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  मनोकामना या प्रार्थना (Prayer / Wish)
                </label>
                <textarea
                  value={diyaWish}
                  onChange={(e) => setDiyaWish(e.target.value)}
                  rows={2}
                  maxLength={120}
                  placeholder="समस्त परिवार के सुख, शांति व आरोग्य हेतु..."
                  className="w-full px-3.5 py-2 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                🪔 आपका दीप वास्तविक 3D गंगा धारा पर प्रज्वलित होगा और लहरों पर तैरता रहेगा।
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>दीप प्रज्वलित कर प्रवाहित करें</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIRTUAL ARGHYA CEREMONY MODAL
         ======================================================== */}
      {arghyaModalOpen && (
        <div 
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-300"
          onClick={() => setArghyaModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/90 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setArghyaModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Radiant Sun Motif */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-2xl shadow-amber-500/50 mb-3 animate-pulse">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-3xl">
                ☀️
              </div>
            </div>

            <h3 className="font-rozha text-xl sm:text-2xl text-amber-200 mb-1">
              भगवान सूर्य को पावन अर्घ्य समर्पित
            </h3>
            <p className="text-xs text-amber-400/90 font-medium mb-3">
              गायत्री मंत्र व दुग्ध अर्घ्य अनुष्ठान संपन्न हुआ
            </p>

            <div className="p-3.5 rounded-2xl bg-stone-800/90 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-mono leading-relaxed mb-4">
              &ldquo;ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥&rdquo;
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mb-5">
              छठी मईया व भुवन भास्कर सूर्य देव की असीम कृपा से आपके व आपके संपूर्ण परिवार के जीवन में सुख, शांति, आरोग्य और अखंड सौभाग्य का संचार हो।
            </p>

            <button
              type="button"
              onClick={() => {
                setArghyaModalOpen(false);
                showToast('✨ अर्घ्य दर्शन सफल रहा! जय छठी मईया!');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              प्रणाम स्वीकार करें (जय सूर्य देव)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          GHAT INFORMATION & SWITCHER MODAL
         ======================================================== */}
      {ghatInfoOpen && (
        <div 
          className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setGhatInfoOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
              <h3 className="text-base sm:text-lg font-bold text-amber-100 font-rozha">
                पावन घाट चयन (Holy Ghat Switcher)
              </h3>
              <button
                type="button"
                onClick={() => setGhatInfoOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {HOLY_GHATS.map((ghat) => (
                <div
                  key={ghat.id}
                  onClick={() => {
                    setSelectedGhat(ghat);
                    setGhatInfoOpen(false);
                    showToast(`${ghat.name} का 3D दृश्य लोड हुआ`);
                    focusCameraTowards(90, 8);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedGhat.id === ghat.id
                      ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/40'
                      : 'border-stone-800 bg-stone-800/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-amber-200 leading-snug font-rozha">
                        {ghat.name}
                      </h4>
                      <p className="text-[11px] text-amber-400 font-medium">
                        {ghat.city}, {ghat.state} • {ghat.tagline}
                      </p>
                    </div>
                    {selectedGhat.id === ghat.id && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    {ghat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIDEO PLAYER MODAL (Inline HD Video Player)
         ======================================================== */}
      {videoModalId && (
        <div 
          className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setVideoModalId(null)}
        >
          <div 
            className="w-full max-w-3xl bg-stone-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-stone-950 flex items-center justify-between border-b border-stone-800">
              <span className="text-xs font-bold text-amber-300 font-rozha">
                वास्तविक घाट दर्शन वीडियो
              </span>
              <button
                type="button"
                onClick={() => setVideoModalId(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoModalId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Ghat Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
