import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Award, 
  Download, 
  Share2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  LogIn, 
  User, 
  MapPin, 
  Calendar, 
  RotateCcw, 
  ArrowLeft, 
  Printer, 
  Camera, 
  Palette, 
  CheckCircle2, 
  QrCode, 
  Crown, 
  Upload, 
  FileText, 
  Sun,
  Flame,
  X,
  Compass,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';
import { 
  FESTIVAL_CERTIFICATE_CONFIGS, 
  FestivalCertificateConfig 
} from '../../data/certificateFestivalData';

interface BlessingCertificatePageProps {
  onNavigate: (tab: string) => void;
}

// 5 Royal Vedic Themes
export type CertificateTheme = 
  | 'gold_obsidian' 
  | 'vedic_saffron' 
  | 'royal_ivory' 
  | 'ganga_azure' 
  | 'sacred_kesariya';

interface ThemeConfig {
  id: CertificateTheme;
  name: string;
  subName: string;
  badge: string;
  borderPreview: string;
}

const THEMES: ThemeConfig[] = [
  {
    id: 'gold_obsidian',
    name: '24K स्वर्ण व ऑब्सिडियन',
    subName: 'Royal 24K Gold & Obsidian',
    badge: 'शाही स्वर्ण',
    borderPreview: 'from-amber-400 via-yellow-200 to-amber-600 bg-stone-950'
  },
  {
    id: 'vedic_saffron',
    name: 'वैदिक सिंदूरी व रोली',
    subName: 'Vedic Crimson & Temple Roli',
    badge: 'मंदिर पावन',
    borderPreview: 'from-amber-400 via-orange-300 to-red-600 bg-red-950'
  },
  {
    id: 'royal_ivory',
    name: 'शाही रेशम व भोजपत्र',
    subName: 'Ancient Parchment & Silk',
    badge: 'प्राचीन भोजपत्र',
    borderPreview: 'from-amber-600 via-amber-300 to-amber-700 bg-stone-100'
  },
  {
    id: 'ganga_azure',
    name: 'शिव गंगा नील व नीलम',
    subName: 'Ganga Jal Azure & Sapphire',
    badge: 'पवित्र धारा',
    borderPreview: 'from-sky-300 via-cyan-100 to-amber-400 bg-sky-950'
  },
  {
    id: 'sacred_kesariya',
    name: 'पावन केसरिया व चंदन',
    subName: 'Sacred Saffron & Sandalwood',
    badge: 'दिव्य केसरिया',
    borderPreview: 'from-orange-400 via-amber-200 to-orange-600 bg-amber-950'
  }
];

// Authentic Holy Deity Avatars (Matching Local Repository Prints)
const HOLY_AVATARS = [
  { id: 'chhath', name: 'छठी मैया व सूर्य देव', url: '/images/deities/chhath.jpg', icon: '☀️' },
  { id: 'shiva', name: 'भगवान शिव (महादेव)', url: '/images/deities/shiva.jpg', icon: '🔱' },
  { id: 'krishna', name: 'भगवान श्री कृष्ण', url: '/images/deities/krishna.jpg', icon: '🦚' },
  { id: 'durga', name: 'माँ भगवती दुर्गा', url: '/images/deities/durga.jpg', icon: '🌺' },
  { id: 'lakshmi', name: 'माँ महालक्ष्मी', url: '/images/deities/lakshmi.jpg', icon: '🪔' },
  { id: 'ganesha', name: 'श्री गणेश जी', url: '/images/deities/ganesha.jpg', icon: '🐘' },
  { id: 'ram', name: 'प्रभु श्री राम', url: '/images/deities/ram.jpg', icon: '🏹' },
  { id: 'hanuman', name: 'श्री हनुमान जी', url: '/images/deities/hanuman.jpg', icon: '🚩' },
  { id: 'surya', name: 'भगवान सूर्य नारायण', url: '/images/deities/surya.jpg', icon: '☀️' },
  { id: 'satyanarayan', name: 'श्री लक्ष्मीनारायण', url: '/images/deities/satyanarayan.jpg', icon: '📜' },
  { id: 'saraswati', name: 'माँ सरस्वती', url: '/images/deities/saraswati.jpg', icon: '🪕' }
];

// Helper to draw realistic 2D procedural QR Code
function drawProceduralQRCode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  codeSeed: string,
  isDarkTheme: boolean
) {
  // Clean white card for QR Code
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
  ctx.strokeStyle = isDarkTheme ? '#ca8a04' : '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 4, y - 4, size + 8, size + 8);

  const modules = 21;
  const modSize = size / modules;
  const darkColor = '#0f172a';
  const lightColor = '#ffffff';

  // Draw 7x7 corner finder patterns
  const drawFinder = (fx: number, fy: number) => {
    ctx.fillStyle = darkColor;
    ctx.fillRect(x + fx * modSize, y + fy * modSize, 7 * modSize, 7 * modSize);
    ctx.fillStyle = lightColor;
    ctx.fillRect(x + (fx + 1) * modSize, y + (fy + 1) * modSize, 5 * modSize, 5 * modSize);
    ctx.fillStyle = darkColor;
    ctx.fillRect(x + (fx + 2) * modSize, y + (fy + 2) * modSize, 3 * modSize, 3 * modSize);
  };

  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);

  // Timing lines
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = darkColor;
      ctx.fillRect(x + i * modSize, y + 6 * modSize, modSize, modSize);
      ctx.fillRect(x + 6 * modSize, y + i * modSize, modSize, modSize);
    }
  }

  // Data modules
  let hash = 0;
  for (let c = 0; c < codeSeed.length; c++) {
    hash = ((hash << 5) - hash) + codeSeed.charCodeAt(c);
    hash |= 0;
  }

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      const inTL = row < 8 && col < 8;
      const inTR = row < 8 && col >= modules - 8;
      const inBL = row >= modules - 8 && col < 8;
      const inTiming = row === 6 || col === 6;
      if (inTL || inTR || inBL || inTiming) continue;

      const bit = ((row * 31 + col * 17 + hash) ^ (row * col)) % 3;
      if (bit === 0 || (row + col) % 4 === 0) {
        ctx.fillStyle = darkColor;
        ctx.fillRect(x + col * modSize, y + row * modSize, modSize, modSize);
      }
    }
  }
}

export const BlessingCertificatePage: React.FC<BlessingCertificatePageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Core Selection: Selected Festival Config (Default: Chhath Mahaparv)
  const [selectedFestivalId, setSelectedFestivalId] = useState<string>('chhath');
  const activeFestival = FESTIVAL_CERTIFICATE_CONFIGS.find(f => f.id === selectedFestivalId) || FESTIVAL_CERTIFICATE_CONFIGS[0];

  // Studio Customization States
  const [theme, setTheme] = useState<CertificateTheme>('gold_obsidian');
  const [devoteeName, setDevoteeName] = useState<string>('');
  const [cityOrGotra, setCityOrGotra] = useState<string>('');
  const [dhamName, setDhamName] = useState<string>(activeFestival.dhams[0]);
  const [role, setRole] = useState<string>(activeFestival.roles[0]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(activeFestival.blessingPresets[0].id);
  const [customLine1, setCustomLine1] = useState<string>('');
  const [customLine2, setCustomLine2] = useState<string>('');
  const [devoteePhoto, setDevoteePhoto] = useState<string | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(activeFestival.id);
  const [loadedPhotoImg, setLoadedPhotoImg] = useState<HTMLImageElement | null>(null);
  const [loadedBgDeityImg, setLoadedBgDeityImg] = useState<HTMLImageElement | null>(null);

  // Dynamic Serial Verification ID
  const [serialId, setSerialId] = useState<string>(() => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `SANATAN-2026-CHHATH-${random}`;
  });

  // UI Tabs & Feedback
  const [activeTab, setActiveTab] = useState<'festival' | 'theme' | 'devotee' | 'blessing'>('festival');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // When festival changes, update default dham, role, blessing preset, serial, and avatar
  const handleFestivalChange = (fest: FestivalCertificateConfig) => {
    setSelectedFestivalId(fest.id);
    setDhamName(fest.dhams[0]);
    setRole(fest.roles[0]);
    setSelectedPresetId(fest.blessingPresets[0].id);
    setCustomLine1('');
    setCustomLine2('');
    setSelectedAvatarId(fest.id);
    const random = Math.floor(10000 + Math.random() * 90000);
    setSerialId(`SANATAN-2026-${fest.serialPrefix}-${random}`);
    showToast(`🌸 ${fest.hindiName} आशीर्वाद पत्र चुना गया`);
  };

  // Sync authenticated user details
  useEffect(() => {
    if (currentUser) {
      if (!devoteeName) setDevoteeName(currentUser.name || '');
      if (!cityOrGotra) {
        setCityOrGotra(
          currentUser.city && currentUser.state 
            ? `${currentUser.city}, ${currentUser.state}` 
            : (currentUser.city || 'वाराणसी, उत्तर प्रदेश')
        );
      }
      if (currentUser.avatarUrl && !devoteePhoto) {
        setDevoteePhoto(currentUser.avatarUrl);
      }
    }
  }, [currentUser]);

  // Load Background Deity Artwork for the selected festival
  useEffect(() => {
    if (!activeFestival.bgImage) {
      setLoadedBgDeityImg(null);
      return;
    }
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = activeFestival.bgImage;
    bgImg.onload = () => {
      setLoadedBgDeityImg(bgImg);
    };
    bgImg.onerror = () => {
      setLoadedBgDeityImg(null);
    };
  }, [activeFestival.bgImage]);

  // Load Medallion Photo/Avatar into HTMLImageElement
  useEffect(() => {
    const avatarMatch = HOLY_AVATARS.find(a => a.id === selectedAvatarId);
    const targetUrl = devoteePhoto || avatarMatch?.url || activeFestival.bgImage;
    if (!targetUrl) {
      setLoadedPhotoImg(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = targetUrl;
    img.onload = () => {
      setLoadedPhotoImg(img);
    };
    img.onerror = () => {
      setLoadedPhotoImg(null);
    };
  }, [devoteePhoto, selectedAvatarId, activeFestival.bgImage]);

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('⚠️ फ़ोटो का आकार 5MB से कम होना चाहिए');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setDevoteePhoto(result);
        showToast('📸 फ़ोटो सफलतापूर्वक जोड़ी गई!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setDevoteePhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('फ़ोटो हटा दी गई');
  };

  // Active Blessing Preset Content
  const activePreset = activeFestival.blessingPresets.find(p => p.id === selectedPresetId) || activeFestival.blessingPresets[0];
  const blessingLine1 = customLine1.trim() || activePreset.line1;
  const blessingLine2 = customLine2.trim() || activePreset.line2;
  const sacredMantra = activePreset.mantra;

  // =========================================================================
  // DRAW FLAGSHIP HD CERTIFICATE (1200 x 850)
  // =========================================================================
  const renderCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 850;

    const isIvory = theme === 'royal_ivory';
    const isSaffron = theme === 'vedic_saffron';
    const isAzure = theme === 'ganga_azure';
    const isObsidian = theme === 'gold_obsidian';
    const isKesariya = theme === 'sacred_kesariya';

    // 1. Background Fill & Gradients
    if (isObsidian) {
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#090b12');
      grad.addColorStop(0.5, '#141828');
      grad.addColorStop(1, '#07080e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.20)');
      radial.addColorStop(0.6, 'rgba(234, 88, 12, 0.06)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    } else if (isSaffron) {
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#260404');
      grad.addColorStop(0.5, '#420808');
      grad.addColorStop(1, '#1c0202');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(249, 115, 22, 0.22)');
      radial.addColorStop(0.6, 'rgba(220, 38, 38, 0.08)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    } else if (isAzure) {
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#031424');
      grad.addColorStop(0.5, '#0b2b48');
      grad.addColorStop(1, '#020e18');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(14, 165, 233, 0.20)');
      radial.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    } else if (isKesariya) {
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#361104');
      grad.addColorStop(0.5, '#521905');
      grad.addColorStop(1, '#240a02');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      radial.addColorStop(0.6, 'rgba(234, 88, 12, 0.10)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    } else {
      // Royal Silk Ivory
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#fbf8f1');
      grad.addColorStop(0.5, '#f4ece0');
      grad.addColorStop(1, '#ebe0cc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      radial.addColorStop(0.6, 'rgba(120, 53, 15, 0.04)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    }

    // 2. REAL AUTHENTIC DEITY BACKGROUND WATERMARK
    if (loadedBgDeityImg) {
      ctx.save();
      ctx.globalAlpha = isIvory ? 0.20 : 0.26;
      // Position artwork centered across the canvas
      const bgW = 1200;
      const bgH = 850;
      // Draw centered
      const imgAspect = loadedBgDeityImg.width / loadedBgDeityImg.height;
      let drawW = bgW;
      let drawH = bgW / imgAspect;
      if (drawH < bgH) {
        drawH = bgH;
        drawW = bgH * imgAspect;
      }
      const drawX = (bgW - drawW) / 2;
      const drawY = (bgH - drawH) / 2;

      ctx.drawImage(loadedBgDeityImg, drawX, drawY, drawW, drawH);

      // Feathered Dark Overlay to maintain text contrast
      ctx.globalAlpha = isIvory ? 0.35 : 0.45;
      ctx.fillStyle = isIvory ? '#faf5ea' : '#0a0d17';
      ctx.fillRect(0, 0, 1200, 850);
      ctx.restore();
    }

    // 3. 24K Gold Foil Borders & Corner Embellishments
    const goldGrad = ctx.createLinearGradient(40, 40, 1160, 810);
    if (isIvory) {
      goldGrad.addColorStop(0, '#b45309');
      goldGrad.addColorStop(0.25, '#78350f');
      goldGrad.addColorStop(0.5, '#d97706');
      goldGrad.addColorStop(0.75, '#92400e');
      goldGrad.addColorStop(1, '#451a03');
    } else {
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.25, '#ca8a04');
      goldGrad.addColorStop(0.5, '#fef9c3');
      goldGrad.addColorStop(0.75, '#eab308');
      goldGrad.addColorStop(1, '#a16207');
    }

    // Heavy Outer Frame
    ctx.lineWidth = 6;
    ctx.strokeStyle = goldGrad;
    ctx.strokeRect(32, 32, 1136, 786);

    // Fine Hairline Inner Border
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isIvory ? 'rgba(180, 83, 9, 0.4)' : 'rgba(254, 240, 138, 0.45)';
    ctx.strokeRect(46, 46, 1108, 758);

    // Corner Ornaments (Vedic Swastika / Auspicious Symbols)
    ctx.fillStyle = isIvory ? '#92400e' : '#facc15';
    ctx.font = 'bold 24px serif';
    ctx.fillText('卐', 56, 76);
    ctx.fillText('卐', 1124, 76);
    ctx.fillText('卐', 56, 784);
    ctx.fillText('卐', 1124, 784);

    // 4. Top Header Inscription (Dynamic based on selected festival)
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = isIvory ? '#b45309' : '#fde047';
    ctx.fillText(activeFestival.headerSanskrit, 600, 95);

    // Main Certificate Title
    ctx.font = 'bold 40px serif';
    ctx.fillStyle = isIvory ? '#78350f' : goldGrad;
    ctx.fillText(activeFestival.title, 600, 150);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = isIvory ? '#57534e' : '#cbd5e1';
    ctx.letterSpacing = '1px';
    ctx.fillText(activeFestival.englishSub, 600, 180);
    ctx.letterSpacing = '0px';

    // Golden Divider Ribbon
    ctx.beginPath();
    ctx.moveTo(340, 202);
    ctx.lineTo(860, 202);
    ctx.lineWidth = 2;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    // 5. Center Medallion: Devotee Photo / Divine Deity Avatar
    const photoCenterX = 600;
    const photoCenterY = 278;
    const photoRadius = 54;

    if (loadedPhotoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        loadedPhotoImg, 
        photoCenterX - photoRadius, 
        photoCenterY - photoRadius, 
        photoRadius * 2, 
        photoRadius * 2
      );
      ctx.restore();

      // Ornate Gold Medallion Ring
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius + 3, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = goldGrad;
      ctx.stroke();

      // Outer Decorative Dots Ring
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius + 8, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = isIvory ? 'rgba(180,83,9,0.3)' : 'rgba(250,204,21,0.4)';
      ctx.stroke();
    } else {
      // Golden Emblem Default
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.fillStyle = isIvory ? 'rgba(245, 158, 11, 0.15)' : 'rgba(250, 204, 21, 0.15)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = goldGrad;
      ctx.stroke();

      ctx.font = '38px serif';
      ctx.fillStyle = isIvory ? '#b45309' : '#fde047';
      ctx.fillText(activeFestival.icon, photoCenterX, photoCenterY + 14);
    }

    // 6. Devotee Salutation & Name
    ctx.font = '18px sans-serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#fef08a';
    ctx.fillText('यह पावन प्रमाण पत्र गौरवपूर्वक समर्पित है:', 600, 368);

    // Devotee Name (Grand Typography)
    ctx.font = 'bold 46px serif';
    ctx.fillStyle = isIvory ? '#1c1917' : '#ffffff';
    if (!isIvory) {
      ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
      ctx.shadowBlur = 12;
    }
    ctx.fillText(devoteeName || 'श्रद्धालु भक्त', 600, 428);
    ctx.shadowBlur = 0;

    // Devotee Designation, City & Sacred Dham / Ghat
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = isIvory ? '#b45309' : '#facc15';
    ctx.fillText(`[ ${role} • ${cityOrGotra || 'भारत'} • ${dhamName} ]`, 600, 468);

    // 7. Sacred Blessing Lines (Festival-specific)
    ctx.font = '19px sans-serif';
    ctx.fillStyle = isIvory ? '#292524' : '#e2e8f0';
    ctx.fillText(blessingLine1, 600, 520);
    ctx.fillText(blessingLine2, 600, 552);

    // Sacred Vedic Mantra Box
    const boxY = 590;
    ctx.fillStyle = isIvory ? 'rgba(217, 119, 6, 0.1)' : 'rgba(234, 179, 8, 0.12)';
    ctx.fillRect(190, boxY, 820, 50);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isIvory ? 'rgba(180, 83, 9, 0.35)' : 'rgba(250, 204, 21, 0.4)';
    ctx.strokeRect(190, boxY, 820, 50);

    ctx.font = 'bold 16px serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#fef08a';
    ctx.fillText(sacredMantra, 600, boxY + 31);

    // 8. Bottom Verification & Trust Row
    // Left: Real Procedural 2D QR Code & Verification ID
    drawProceduralQRCode(ctx, 80, 680, 80, serialId, !isIvory);

    ctx.textAlign = 'left';
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = isIvory ? '#44403c' : '#94a3b8';
    ctx.fillText(serialId, 175, 710);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#facc15';
    ctx.fillText(`सत्यापित डिजिटल पुण्य पत्र • ${activeFestival.hindiName} 2026`, 175, 730);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = isIvory ? '#78716c' : '#64748b';
    ctx.fillText(`तीर्थ: ${dhamName} • संवत् 2083`, 175, 748);

    // Center: 24K Gold Embossed Seal / Stamp
    const sealCenterX = 600;
    const sealCenterY = 720;
    const sealRadius = 38;

    ctx.beginPath();
    ctx.arc(sealCenterX, sealCenterY, sealRadius, 0, Math.PI * 2);
    ctx.fillStyle = isIvory ? 'rgba(180,83,9,0.1)' : 'rgba(234,179,8,0.15)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(sealCenterX, sealCenterY, sealRadius - 6, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 9.5px sans-serif';
    ctx.fillStyle = isIvory ? '#92400e' : '#fef08a';
    ctx.fillText(activeFestival.sealText, sealCenterX, sealCenterY - 10);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('सत्यापित मुहर', sealCenterX, sealCenterY + 5);
    ctx.font = '8px sans-serif';
    ctx.fillText('★ VERIFIED MUDRA ★', sealCenterX, sealCenterY + 19);

    // Right: Authorized Trust Digital Signatures
    ctx.textAlign = 'right';
    ctx.font = 'italic bold 18px serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#fde047';
    ctx.fillText('आचार्य पं. विद्याधर शास्त्री', 1110, 706);

    ctx.beginPath();
    ctx.moveTo(940, 715);
    ctx.lineTo(1110, 715);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isIvory ? '#a8a29e' : '#475569';
    ctx.stroke();

    ctx.font = 'bold 12.5px sans-serif';
    ctx.fillStyle = isIvory ? '#292524' : '#cbd5e1';
    ctx.fillText('मुख्य धर्माधिकारी / प्रधान पुरोहित', 1110, 734);

    ctx.font = '10.5px sans-serif';
    ctx.fillStyle = isIvory ? '#78716c' : '#94a3b8';
    ctx.fillText(activeFestival.trustName, 1110, 750);

  }, [
    theme, 
    activeFestival,
    devoteeName, 
    cityOrGotra, 
    dhamName, 
    role, 
    blessingLine1, 
    blessingLine2, 
    sacredMantra, 
    loadedPhotoImg, 
    loadedBgDeityImg,
    serialId
  ]);

  // Redraw when dependencies change
  useEffect(() => {
    renderCertificate();
  }, [renderCertificate]);

  // HD PNG Download
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    setTimeout(() => {
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanName = (devoteeName || 'Devotee').replace(/\s+/g, '_');
      const cleanFest = activeFestival.name.replace(/\s+/g, '_');
      link.download = `${cleanFest}_Blessing_Certificate_${cleanName}_2026.png`;
      link.href = imageUri;
      link.click();
      setDownloading(false);
      showToast('📥 HD सर्टिफिकेट सफलतापूर्वक डाउनलोड हुआ!');

      // Save record in localStorage quietly
      if (currentUser?.id) {
        try {
          const record = {
            festivalId: activeFestival.id,
            festivalName: activeFestival.hindiName,
            name: devoteeName,
            cityOrGotra,
            dhamName,
            role,
            theme,
            serialId,
            date: new Date().toISOString()
          };
          localStorage.setItem(`sanatan_user_certificate_${currentUser.id}`, JSON.stringify(record));
        } catch {}
      }
    }, 250);
  };

  // High Resolution Print / PDF Export
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${activeFestival.hindiName} 2026 आशीर्वाद प्रमाण पत्र - ${devoteeName || 'श्रद्धालु'}</title>
            <style>
              @page { size: landscape; margin: 0; }
              body { margin: 0; background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <img src="${dataUrl}" alt="Certificate" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  // Direct WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = `🌸 *${activeFestival.hindiName} 2026* — दिव्य आशीर्वाद प्रमाण पत्र 🌸\n\nश्रद्धालु: ${devoteeName || 'भक्त'}\nआस्था पद: ${role}\nपावन धाम / तीर्थ: ${dhamName}\nसत्यापन आईडी: ${serialId}\n\n✨ प्रभु का पावन अनुग्रह आपके जीवन को सुख, शांति व समृद्धि से परिपूर्ण करे!\n\n📲 आप भी समस्त सनातन पर्वों का अपना डिजिटल आशीर्वाद पत्र बनाएं:\n${window.location.origin}/#blessing-certificate`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Share / Copy Link
  const handleShare = () => {
    const text = `मैंने ${activeFestival.hindiName} 2026 का 'डिजिटल आशीर्वाद प्रमाण पत्र' प्राप्त किया है! जय श्री राम 🙏\nअपना प्रमाण पत्र बनाएं: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: `${activeFestival.hindiName} 2026 आशीर्वाद प्रमाण पत्र`,
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('🔗 लिंक क्लिपबोर्ड पर कॉपी किया गया!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Reset to Defaults
  const handleReset = () => {
    setTheme('gold_obsidian');
    setRole(activeFestival.roles[0]);
    setSelectedPresetId(activeFestival.blessingPresets[0].id);
    setCustomLine1('');
    setCustomLine2('');
    setDhamName(activeFestival.dhams[0]);
    setDevoteePhoto(null);
    setSelectedAvatarId(activeFestival.id);
    if (currentUser) {
      setDevoteeName(currentUser.name || '');
      setCityOrGotra(currentUser.city || 'वाराणसी, उत्तर प्रदेश');
    } else {
      setDevoteeName('');
      setCityOrGotra('');
    }
    showToast('🔄 सेटिंग्स रीसेट की गईं');
  };

  return (
    <div className="bg-[#fcfbf7] text-stone-900 font-mukta flex flex-col pb-3 sm:pb-4">
      <SeoHead
        title="सर्व सनातन डिजिटल आशीर्वाद प्रमाण पत्र स्टूडियो | Hindu Festival Blessing Certificate Studio 2026"
        description="छठ, महाशिवरात्रि, जन्माष्टमी, नवरात्रि, दीपावली, गणेश चतुर्थी, राम नवमी सहित समस्त सनातन पर्वों का व्यक्तिगत डिजिटल आशीर्वाद पत्र बनाएं। फोटो, वैदिक मंत्र व QR कोड सहित HD डाउनलोड।"
        canonicalUrl="https://chhathvibes.vercel.app/blessing-certificate"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-5 space-y-4 sm:space-y-5 flex-1">

        {/* Top Header & Navigation Bar */}
        <div className="flex items-center justify-between gap-3 bg-white border border-stone-200/90 rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer shrink-0"
              title="वापस मुख्य पृष्ठ"
              aria-label="वापस मुख्य पृष्ठ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold font-rozha text-stone-950 leading-tight truncate">
                सर्व सनातन आशीर्वाद प्रमाण पत्र स्टूडियो
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-700 font-semibold leading-none truncate">
                {activeFestival.hindiName} • 4K HD डिजिटल पुण्य पत्र
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer"
              title="डिफ़ॉल्ट सेटिंग्स रीसेट करें"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट</span>
            </button>

            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[95px]">{currentUser.name || 'सत्यापित'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login', 'अपना व्यक्तिगत प्रमाण पत्र प्राप्त करने के लिए लॉगिन करें')}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉगिन</span>
              </button>
            )}
          </div>
        </div>

        {/* Studio Customizer Tabs Container */}
        <div className="bg-white border border-stone-200 rounded-3xl p-3.5 sm:p-5 shadow-xs space-y-4">
          
          {/* Tab Navigation Switches */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('festival')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'festival' 
                    ? 'bg-amber-500 text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>🌸</span>
                <span>1. पर्व व आराध्य</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'theme' 
                    ? 'bg-amber-500 text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>2. थीम व शैली</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('devotee')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'devotee' 
                    ? 'bg-amber-500 text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>3. श्रद्धालु व फ़ोटो</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('blessing')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'blessing' 
                    ? 'bg-amber-500 text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>4. संकल्प व धाम</span>
              </button>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>लाइव प्रिव्यू</span>
            </span>
          </div>

          {/* TAB 1: UNIVERSAL SANATAN FESTIVAL SELECTOR */}
          {activeTab === 'festival' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600 font-semibold">
                  जिस पावन पर्व या पूजा का प्रमाण पत्र बनाना है, उसे चुनें:
                </p>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  12 मुख्य सनातन पर्व
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                {FESTIVAL_CERTIFICATE_CONFIGS.map((fest) => {
                  const isSelected = selectedFestivalId === fest.id;
                  return (
                    <button
                      key={fest.id}
                      type="button"
                      onClick={() => handleFestivalChange(fest)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer active:scale-95 ${
                        isSelected 
                          ? 'border-amber-500 ring-2 ring-amber-400 bg-gradient-to-br from-amber-50/80 to-orange-50/50 shadow-sm' 
                          : 'border-stone-200 hover:border-amber-300 bg-stone-50/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-300/60 shadow-xs shrink-0 bg-stone-900">
                          <img 
                            src={fest.bgImage} 
                            alt={fest.hindiName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="text-sm">{fest.icon}</span>
                      </div>

                      <div>
                        <span className="text-[9.5px] font-bold uppercase text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded block w-fit mb-1">
                          {fest.badge}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-950 leading-tight">
                          {fest.hindiName}
                        </h4>
                        <p className="text-[10px] text-stone-500 truncate mt-0.5">
                          {fest.deity}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 fill-amber-100" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ROYAL THEME SELECTOR */}
          {activeTab === 'theme' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-stone-600 font-medium">
                पाँच शाही वैदिक प्रमाण पत्र शैलियों में से अपनी पसंदीदा थीम चुनें:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                {THEMES.map((th) => {
                  const isSelected = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-28 cursor-pointer active:scale-95 ${
                        isSelected 
                          ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/40 shadow-xs' 
                          : 'border-stone-200 hover:border-amber-300 bg-stone-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                          {th.badge}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                      </div>

                      <div className={`w-full h-3 rounded-full bg-gradient-to-r ${th.borderPreview} border border-amber-300/40 my-2`} />

                      <div>
                        <h4 className="text-xs font-bold text-stone-950 leading-tight">
                          {th.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 truncate">
                          {th.subName}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DEVOTEE DETAILS & DEVOTEE PHOTO / AVATAR */}
          {activeTab === 'devotee' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    श्रद्धालु / व्रती का नाम *
                  </label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder="उदा. राहुल कुमार झा / सपरिवार"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    शहर अथवा गोत्र
                  </label>
                  <input
                    type="text"
                    value={cityOrGotra}
                    onChange={(e) => setCityOrGotra(e.target.value)}
                    placeholder="उदा. वाराणसी (शांडिल्य गोत्र)"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    आस्था पद व साधना प्रकार (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
                  >
                    {activeFestival.roles.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                    <option value="सपरिवार उपासक">सपरिवार उपासक</option>
                    <option value="अनन्य साधक (भक्त)">अनन्य साधक (भक्त)</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload or Holy Avatar Chooser */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">
                      प्रमाण पत्र केंद्र छवि (Personal Photo or Divine Avatar)
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      अपनी व्यक्तिगत फ़ोटो अपलोड करें या नीचे दिए पावन देव स्वरूपों में से चुनें:
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>अपनी फ़ोटो लगाएं</span>
                    </button>

                    {devoteePhoto && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                        title="फ़ोटो हटाएं"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Holy Avatar Choices */}
                {!devoteePhoto && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {HOLY_AVATARS.map((av) => {
                      const isSelected = selectedAvatarId === av.id;
                      return (
                        <div
                          key={av.id}
                          onClick={() => {
                            setSelectedAvatarId(av.id);
                            showToast(`${av.name} स्वरूप चुना गया`);
                          }}
                          className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' 
                              : 'border-stone-200 hover:border-amber-300 bg-stone-50'
                          }`}
                        >
                          <div className="w-9 h-9 mx-auto rounded-full overflow-hidden border border-amber-300/80 mb-1 bg-stone-900">
                            <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-bold text-stone-800 line-clamp-1 block">
                            {av.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BLESSING PRESET & SACRED DHAM / GHAT */}
          {activeTab === 'blessing' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Presets Tailored to Festival */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-stone-700">
                    {activeFestival.hindiName} — पावन आशीर्वाद संकल्प
                  </label>
                  <span className="text-[10.5px] text-amber-700 font-semibold">
                    शास्त्रोक्त फल व महामंत्र
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeFestival.blessingPresets.map((p) => {
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPresetId(p.id)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-400 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                            <span>{p.icon}</span>
                            <span>{p.title}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {p.line1}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sacred Dham / Ghat Location */}
              <div className="pt-3 border-t border-stone-100">
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                  पावन तीर्थ / मंदिर / घाट (Sacred Dham / Location)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {activeFestival.dhams.map((dh, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDhamName(dh)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        dhamName === dh
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {dh}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={dhamName}
                  onChange={(e) => setDhamName(e.target.value)}
                  placeholder="अपना विशिष्ट तीर्थ / मंदिर या घाट लिखें..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>

              {/* Custom Blessing Lines (Optional) */}
              <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    कस्टम आशीर्वाद पंक्ति 1 (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    value={customLine1}
                    onChange={(e) => setCustomLine1(e.target.value)}
                    placeholder="डिफ़ॉल्ट संकल्प बदलने के लिए यहां लिखें..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    कस्टम आशीर्वाद पंक्ति 2 (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    value={customLine2}
                    onChange={(e) => setCustomLine2(e.target.value)}
                    placeholder="दूसरी पंक्ति यहां लिखें..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Live Canvas Certificate Preview */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-stone-950 flex justify-center items-center p-2 sm:p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[580px] rounded-2xl shadow-2xl object-contain block"
          />
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'डाउनलोड जारी...' : `HD ${activeFestival.hindiName} सर्टिफिकेट डाउनलोड करें`}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            title="A4 लैंडस्केप में प्रिंट या PDF सेव करें"
          >
            <Printer className="w-4 h-4 text-stone-700" />
            <span>प्रिंट / PDF सेव करें</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            title="व्हाट्सएप पर शेयर करें"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp पर शेयर</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4 text-amber-600" />}
            <span>{copied ? 'कॉपी हुआ' : 'लिंक शेयर'}</span>
          </button>
        </div>

      </main>
    </div>
  );
};
