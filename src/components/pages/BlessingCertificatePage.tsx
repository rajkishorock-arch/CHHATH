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
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';

interface BlessingCertificatePageProps {
  onNavigate: (tab: string) => void;
}

// 4 Royal Themes
type CertificateTheme = 'gold_obsidian' | 'vedic_saffron' | 'royal_ivory' | 'ganga_azure';

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
    badge: 'शाही लग्जरी',
    borderPreview: 'from-amber-400 via-yellow-200 to-amber-600 bg-stone-950'
  },
  {
    id: 'vedic_saffron',
    name: 'वैदिक केसरिया व रोली',
    subName: 'Vedic Saffron & Crimson',
    badge: 'मंदिर पावन',
    borderPreview: 'from-amber-400 via-orange-300 to-red-600 bg-red-950'
  },
  {
    id: 'royal_ivory',
    name: 'शाही रेशम व भोजपत्र',
    subName: 'Royal Silk Ivory & Parchment',
    badge: 'प्राचीन भोजपत्र',
    borderPreview: 'from-amber-600 via-amber-300 to-amber-700 bg-stone-100'
  },
  {
    id: 'ganga_azure',
    name: 'गंगा जल व नीलम',
    subName: 'Ganga Jal Royal Azure',
    badge: 'पवित्र धारा',
    borderPreview: 'from-sky-300 via-cyan-100 to-amber-400 bg-sky-950'
  }
];

// Sacred Blessing Presets
interface BlessingPreset {
  id: string;
  title: string;
  icon: string;
  line1: string;
  line2: string;
  mantra: string;
}

const BLESSING_PRESETS: BlessingPreset[] = [
  {
    id: 'arogya',
    title: 'आरोग्य व दीर्घायु संकल्प',
    icon: '🌟',
    line1: 'भगवान सूर्य नारायण व छठी मईया आपके जीवन से समस्त व्याधि, रोग व संताप हरें।',
    line2: '36 घंटे के अखंड निर्जला तप के पुण्य से आपको अक्षय स्वास्थ्य व नवऊर्जा प्राप्त हो।',
    mantra: 'ॐ ह्रीं ह्रीं सूर्याय सहस्रकिरणाय मनोवांछित फलम् देहि देहि स्वाहा॥'
  },
  {
    id: 'santan',
    title: 'संतान रक्षा व कुल वृद्धि',
    icon: '👶',
    line1: 'छठी मईया आपकी संतति व परिवार को दीर्घायु, सुसंस्कार, विद्या व अखंड रक्षा का आशीष दें।',
    line2: 'सच्ची निष्ठा से अर्पित अर्घ्य आपके कुल में यश, कीर्ति और सुख-समृद्धि का प्रकाश फैलाए।',
    mantra: 'ॐ षष्ठी देव्यै नमः • संतानं पालय पालय सर्व कार्येषु विजयं देहि॥'
  },
  {
    id: 'manokamna',
    title: 'मनोकामना सिद्धि व सौभाग्य',
    icon: '🪔',
    line1: 'निर्मल मन व निष्कपट भाव से अर्पित सूप-दउरा के पुण्य से सर्व मनोकामनाएं पूर्ण हों।',
    line2: 'भगवान भास्कर आपके घर-आंगन को अखंड सौभाग्य, ऐश्वर्य व शांति से परिपूर्ण रखें।',
    mantra: 'ॐ सूर्याय नमः • आदित्य हृदयम् पुण्यं सर्वशत्रु विनाशनम् जयावहम्॥'
  },
  {
    id: 'samriddhi',
    title: 'सुख-समृद्धि व पावन अर्घ्य',
    icon: '🌾',
    line1: 'अस्ताचलगामी व उदीयमान सूर्य देव को समर्पित पावन अर्घ्य आपके जीवन को आलोकित करे।',
    line2: 'ठेकुआ, ईख, फल व नवधान्य का दिव्य प्रसाद आपके कुल में अन्न-धन की अखंड वर्षा करे।',
    mantra: 'ॐ नमो भगवते श्रीसूर्याय आदित्याय अमोघवीर्याय सर्वकष्ट निवारणाय॥'
  }
];

// Divine Holy Avatars (for devotees who don't upload personal photo)
const HOLY_AVATARS = [
  {
    id: 'chhathi_maiya',
    name: 'छठी मईया',
    icon: '🙏',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'
  },
  {
    id: 'surya_bhagwan',
    name: 'भगवान सूर्य देव',
    icon: '☀️',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200'
  },
  {
    id: 'pavitra_soop',
    name: 'पावन सूप व अर्घ्य',
    icon: '🌾',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=200'
  },
  {
    id: 'akhand_deep',
    name: 'सूर्य कुंड दीप',
    icon: '🪔',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200'
  }
];

const GHAT_PRESETS = [
  'दीघा घाट, पटना',
  'गंगा तट, वाराणसी',
  'सूर्य मंदिर घाट, देव (औरंगाबाद)',
  'कष्टहरणी घाट, मुंगेर',
  'काली घाट, कोलकाता',
  'हर की पौड़ी, हरिद्वार',
  'स्थानीय पावन छठ घाट'
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

  // Studio Customization States
  const [theme, setTheme] = useState<CertificateTheme>('gold_obsidian');
  const [devoteeName, setDevoteeName] = useState<string>('');
  const [cityOrGotra, setCityOrGotra] = useState<string>('');
  const [ghatName, setGhatName] = useState<string>('दीघा घाट, पटना');
  const [role, setRole] = useState<string>('छठ मुख्य व्रती (साधक)');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('arogya');
  const [customLine1, setCustomLine1] = useState<string>('');
  const [customLine2, setCustomLine2] = useState<string>('');
  const [devoteePhoto, setDevoteePhoto] = useState<string | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('chhathi_maiya');
  const [loadedPhotoImg, setLoadedPhotoImg] = useState<HTMLImageElement | null>(null);

  // Verification Serial ID
  const [serialId] = useState<string>(() => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `CHHATH-2026-ARGH-${random}`;
  });

  // UI Tabs & Feedback
  const [activeTab, setActiveTab] = useState<'theme' | 'devotee' | 'blessing'>('theme');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync authenticated user details
  useEffect(() => {
    if (currentUser) {
      if (!devoteeName) setDevoteeName(currentUser.name || '');
      if (!cityOrGotra) {
        setCityOrGotra(
          currentUser.city && currentUser.state 
            ? `${currentUser.city}, ${currentUser.state}` 
            : (currentUser.city || 'पटना, बिहार')
        );
      }
      if (currentUser.avatarUrl && !devoteePhoto) {
        setDevoteePhoto(currentUser.avatarUrl);
      }
    }
  }, [currentUser]);

  // Load photo into HTMLImageElement
  useEffect(() => {
    const targetUrl = devoteePhoto || HOLY_AVATARS.find(a => a.id === selectedAvatarId)?.url;
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
  }, [devoteePhoto, selectedAvatarId]);

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
  const activePreset = BLESSING_PRESETS.find(p => p.id === selectedPresetId) || BLESSING_PRESETS[0];
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

    // 1. Background Fill & Gradients
    if (isObsidian) {
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#0a0c14');
      grad.addColorStop(0.5, '#151928');
      grad.addColorStop(1, '#080910');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      radial.addColorStop(0.6, 'rgba(234, 88, 12, 0.05)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    } else if (isSaffron) {
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#2c0404');
      grad.addColorStop(0.5, '#450a0a');
      grad.addColorStop(1, '#200303');
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
      grad.addColorStop(0, '#041726');
      grad.addColorStop(0.5, '#0c2e4e');
      grad.addColorStop(1, '#020e18');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(14, 165, 233, 0.18)');
      radial.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    } else {
      // Royal Silk Ivory
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#fbf8f1');
      grad.addColorStop(0.5, '#f5eee0');
      grad.addColorStop(1, '#eee2cc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 580);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      radial.addColorStop(1, 'rgba(120, 53, 15, 0.03)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1200, 850);
    }

    // 2. 24K Gold Foil Borders & Corner Embellishments
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

    // 3. Top Header Inscription
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = isIvory ? '#b45309' : '#fde047';
    ctx.fillText('॥ श्री सूर्य षष्ठी महाव्रत • कार्तिक शुक्ल षष्ठी-सप्तमी 2026 ॥', 600, 95);

    // Main Certificate Title
    ctx.font = 'bold 42px serif';
    ctx.fillStyle = isIvory ? '#78350f' : goldGrad;
    ctx.fillText('छठ महापर्व — पुण्य आशीष पत्र', 600, 150);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = isIvory ? '#57534e' : '#cbd5e1';
    ctx.letterSpacing = '1px';
    ctx.fillText('ROYAL DEVOTIONAL BLESSINGS OF BHAGWAN SURYA & CHHATHI MAIYA', 600, 180);
    ctx.letterSpacing = '0px';

    // Golden Divider Ribbon
    ctx.beginPath();
    ctx.moveTo(340, 202);
    ctx.lineTo(860, 202);
    ctx.lineWidth = 2;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    // 4. Center Medallion: Devotee Photo / Divine Avatar (Gold Framed Ring)
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
      // Golden Sun Crest Default
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.fillStyle = isIvory ? 'rgba(245, 158, 11, 0.15)' : 'rgba(250, 204, 21, 0.15)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = goldGrad;
      ctx.stroke();

      ctx.font = '40px serif';
      ctx.fillStyle = isIvory ? '#b45309' : '#fde047';
      ctx.fillText('☀️', photoCenterX, photoCenterY + 14);
    }

    // 5. Devotee Salutation & Name
    ctx.font = '18px sans-serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#fef08a';
    ctx.fillText('यह पावन प्रमाण पत्र गौरवपूर्वक समर्पित है:', 600, 368);

    // Devotee Name (Grand Title)
    ctx.font = 'bold 46px serif';
    ctx.fillStyle = isIvory ? '#1c1917' : '#ffffff';
    if (!isIvory) {
      ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
      ctx.shadowBlur = 12;
    }
    ctx.fillText(devoteeName || 'श्रद्धालु भक्त', 600, 428);
    ctx.shadowBlur = 0;

    // Devotee Designation, City & Sacred Ghat
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = isIvory ? '#b45309' : '#facc15';
    ctx.fillText(`[ ${role} • ${cityOrGotra || 'भारत'} • ${ghatName} ]`, 600, 468);

    // 6. Sacred Blessing Lines
    ctx.font = '19px sans-serif';
    ctx.fillStyle = isIvory ? '#292524' : '#e2e8f0';
    ctx.fillText(blessingLine1, 600, 520);
    ctx.fillText(blessingLine2, 600, 552);

    // Sacred Vedic Mantra Box
    const boxY = 590;
    ctx.fillStyle = isIvory ? 'rgba(217, 119, 6, 0.1)' : 'rgba(234, 179, 8, 0.12)';
    ctx.fillRect(220, boxY, 760, 50);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isIvory ? 'rgba(180, 83, 9, 0.35)' : 'rgba(250, 204, 21, 0.4)';
    ctx.strokeRect(220, boxY, 760, 50);

    ctx.font = 'bold 17px serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#fef08a';
    ctx.fillText(sacredMantra, 600, boxY + 31);

    // 7. Bottom Verification & Seal Row
    // Left: Real Procedural 2D QR Code & Verification ID
    drawProceduralQRCode(ctx, 80, 680, 80, serialId, !isIvory);

    ctx.textAlign = 'left';
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = isIvory ? '#44403c' : '#94a3b8';
    ctx.fillText(serialId, 175, 710);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#facc15';
    ctx.fillText('सत्यापित डिजिटल पुण्य पत्र • Chhath 2026', 175, 730);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = isIvory ? '#78716c' : '#64748b';
    ctx.fillText(`स्थान: ${ghatName} • कार्तिक शुक्ल षष्ठी`, 175, 748);

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
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = isIvory ? '#92400e' : '#fef08a';
    ctx.fillText('छठ महापर्व 2026', sealCenterX, sealCenterY - 10);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('आधिकारिक मुहर', sealCenterX, sealCenterY + 6);
    ctx.font = '8px sans-serif';
    ctx.fillText('★ VERIFIED SEAL ★', sealCenterX, sealCenterY + 20);

    // Right: Authorized Trust Digital Signatures
    ctx.textAlign = 'right';
    ctx.font = 'italic bold 18px serif';
    ctx.fillStyle = isIvory ? '#78350f' : '#fde047';
    ctx.fillText('Acharya Vidyadhar', 1110, 706);

    ctx.beginPath();
    ctx.moveTo(960, 715);
    ctx.lineTo(1110, 715);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isIvory ? '#a8a29e' : '#475569';
    ctx.stroke();

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = isIvory ? '#292524' : '#cbd5e1';
    ctx.fillText('आचार्य / मुख्य पुरोहित', 1110, 734);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = isIvory ? '#78716c' : '#94a3b8';
    ctx.fillText('श्री सूर्य षष्ठी सेवा ट्रस्ट • पावन गंगा न्यास', 1110, 750);

  }, [
    theme, 
    devoteeName, 
    cityOrGotra, 
    ghatName, 
    role, 
    blessingLine1, 
    blessingLine2, 
    sacredMantra, 
    loadedPhotoImg, 
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
      link.download = `Chhath_Blessing_Certificate_${cleanName}_2026.png`;
      link.href = imageUri;
      link.click();
      setDownloading(false);
      showToast('📥 HD सर्टिफिकेट सफलतापूर्वक डाउनलोड हुआ!');

      // Save record in localStorage
      if (currentUser?.id) {
        try {
          const record = {
            name: devoteeName,
            cityOrGotra,
            ghatName,
            role,
            theme,
            serialId,
            date: new Date().toISOString()
          };
          localStorage.setItem(`chhath_user_certificate_${currentUser.id}`, JSON.stringify(record));
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
            <title>छठ महापर्व 2026 आशीर्वाद प्रमाण पत्र - ${devoteeName || 'श्रद्धालु'}</title>
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
    const text = `🪔 जय छठी मईया! मैंने छठ महापर्व 2026 का 'डिजिटल आशीर्वाद प्रमाण पत्र' प्राप्त किया है।\n\nश्रद्धालु: ${devoteeName || 'भक्त'}\nआस्था पद: ${role}\nपावन घाट: ${ghatName}\nसत्यापन आईडी: ${serialId}\n\nआप भी अपना व्यक्तिगत आशीर्वाद पत्र बनाएं:\n${window.location.origin}/#blessing-certificate`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Share / Copy Link
  const handleShare = () => {
    const text = `मैंने छठ महापर्व 2026 का 'डिजिटल आशीर्वाद प्रमाण पत्र' प्राप्त किया है! जय छठी मईया 🙏\nअपना प्रमाण पत्र बनाएं: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'छठ महापर्व 2026 आशीर्वाद प्रमाण पत्र',
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
    setRole('छठ मुख्य व्रती (साधक)');
    setSelectedPresetId('arogya');
    setCustomLine1('');
    setCustomLine2('');
    setGhatName('दीघा घाट, पटना');
    setDevoteePhoto(null);
    setSelectedAvatarId('chhathi_maiya');
    if (currentUser) {
      setDevoteeName(currentUser.name || '');
      setCityOrGotra(currentUser.city || 'पटना, बिहार');
    } else {
      setDevoteeName('');
      setCityOrGotra('');
    }
    showToast('🔄 सेटिंग्स रीसेट की गईं');
  };

  return (
    <div className="bg-[#fcfbf7] text-stone-900 font-mukta flex flex-col pb-3">
      <SeoHead
        title="डिजिटल आशीर्वाद प्रमाण पत्र स्टूडियो | Chhath Puja Blessing Certificate Studio 2026"
        description="छठ महापर्व 2026 का 4 शाही थीम में अपना व्यक्तिगत डिजिटल आशीर्वाद प्रमाण पत्र बनाएं। फोटो अपलोड, पावन घाट, वैदिक मंत्र व QR कोड सहित HD डाउनलोड।"
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
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1">

        {/* Top Header & Navigation Bar */}
        <div className="flex items-center justify-between gap-3 bg-white border border-stone-200/90 rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
              title="वापस मुख्य पृष्ठ"
              aria-label="वापस मुख्य पृष्ठ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-rozha text-stone-950 leading-tight">
                आशीर्वाद प्रमाण पत्र स्टूडियो
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-700 font-semibold leading-none">
                छठ महापर्व 2026 • 4K HD डिजिटल पुण्य पत्र
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                <span>लॉगिन करें</span>
              </button>
            )}
          </div>
        </div>

        {/* Studio Customizer Tabs */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
          
          {/* Tab Navigation Switches */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'theme' 
                    ? 'bg-amber-500 text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>1. थीम व शैली</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('devotee')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'devotee' 
                    ? 'bg-amber-500 text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>2. श्रद्धालु व फ़ोटो</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('blessing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'blessing' 
                    ? 'bg-amber-500 text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>3. आशीर्वाद व घाट</span>
              </button>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>लाइव प्रिव्यू</span>
            </span>
          </div>

          {/* TAB 1: ROYAL THEME SELECTOR */}
          {activeTab === 'theme' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-stone-600 font-medium">
                चार शाही प्रमाण पत्र शैलियों में से अपनी पसंदीदा थीम चुनें:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {THEMES.map((th) => {
                  const isSelected = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-28 cursor-pointer ${
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

          {/* TAB 2: DEVOTEE DETAILS & DEVOTEE PHOTO / AVATAR */}
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
                    placeholder="उदा. राहुल कुमार झा / समस्त परिवार"
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
                    placeholder="उदा. पटना, बिहार (शांडिल्य गोत्र)"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    आस्था पद (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
                  >
                    <option value="छठ मुख्य व्रती (साधक)">छठ मुख्य व्रती (साधक)</option>
                    <option value="सह-व्रती (सहायक)">सह-व्रती (सहायक)</option>
                    <option value="श्रद्धालु भक्त">श्रद्धालु भक्त</option>
                    <option value="पवित्र घाट सेवादार">पवित्र घाट सेवादार</option>
                  </select>
                </div>
              </div>

              {/* Devotee Photo / Divine Holy Avatar Selection */}
              <div className="pt-3 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-500" />
                    <span>सर्टिफिकेट पर फ़ोटो अथवा पावन प्रतीक चिन्ह</span>
                  </label>
                  {devoteePhoto && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>फ़ोटो हटाएं</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl border border-dashed border-amber-500 hover:border-amber-600 bg-amber-50/50 hover:bg-amber-50 text-amber-950 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>अपनी फ़ोटो अपलोड करें</span>
                  </button>

                  <span className="text-xs text-stone-400 font-semibold">अथवा पावन अवतार चुनें:</span>

                  {/* Holy Avatar Selection Chips */}
                  <div className="flex items-center gap-2">
                    {HOLY_AVATARS.map((av) => {
                      const isSelected = !devoteePhoto && selectedAvatarId === av.id;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            setDevoteePhoto(null);
                            setSelectedAvatarId(av.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-2xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          <span>{av.icon}</span>
                          <span>{av.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SACRED BLESSINGS PRESET & GHAT SELECTION */}
          {activeTab === 'blessing' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                  पावन आशीर्वाद संकल्प (Blessing Preset)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BLESSING_PRESETS.map((p) => {
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPresetId(p.id)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-400'
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

              {/* Sacred Ghat Location */}
              <div className="pt-3 border-t border-stone-100">
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                  पावन छठ घाट (Sacred Ghat / Location)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {GHAT_PRESETS.map((gh) => (
                    <button
                      key={gh}
                      type="button"
                      onClick={() => setGhatName(gh)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        ghatName === gh
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {gh}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={ghatName}
                  onChange={(e) => setGhatName(e.target.value)}
                  placeholder="अपना विशिष्ट घाट नाम लिखें..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
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
            <span>{downloading ? 'डाउनलोड जारी...' : 'HD सर्टिफिकेट डाउनलोड करें (PNG)'}</span>
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
