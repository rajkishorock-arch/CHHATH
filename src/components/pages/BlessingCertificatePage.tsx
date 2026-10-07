import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
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
  Lock,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';

interface BlessingCertificatePageProps {
  onNavigate: (tab: string) => void;
}

export const BlessingCertificatePage: React.FC<BlessingCertificatePageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal, signInWithGoogle } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Devotee input states (pre-filled with real user data if authenticated)
  const [devoteeName, setDevoteeName] = useState<string>('');
  const [cityOrGotra, setCityOrGotra] = useState<string>('');
  const [role, setRole] = useState<'व्रती' | 'श्रद्धालु' | 'सेवादार'>('व्रती');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync real authenticated user profile
  useEffect(() => {
    if (currentUser) {
      setDevoteeName(currentUser.name || '');
      setCityOrGotra(
        currentUser.city && currentUser.state 
          ? `${currentUser.city}, ${currentUser.state}` 
          : (currentUser.city || 'पटना, बिहार')
      );
    }
  }, [currentUser]);

  // Draw HD Certificate on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: 1200 x 850 HD
    canvas.width = 1200;
    canvas.height = 850;

    // 1. Royal Deep Obsidian Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGrad.addColorStop(0, '#0c0e18');
    bgGrad.addColorStop(0.5, '#16192b');
    bgGrad.addColorStop(1, '#080a12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Subtle radial aura in center
    const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 550);
    radial.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
    radial.addColorStop(0.6, 'rgba(234, 88, 12, 0.05)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1200, 850);

    // 2. 24K Gold Foil Outer Border
    ctx.lineWidth = 6;
    const goldGrad = ctx.createLinearGradient(40, 40, 1160, 810);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.25, '#ca8a04');
    goldGrad.addColorStop(0.5, '#fef9c3');
    goldGrad.addColorStop(0.75, '#eab308');
    goldGrad.addColorStop(1, '#a16207');
    ctx.strokeStyle = goldGrad;
    ctx.strokeRect(30, 30, 1140, 790);

    // Inner hairline border
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.strokeRect(45, 45, 1110, 760);

    // Corner decorative swastikas
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 24px serif';
    ctx.fillText('卐', 55, 75);
    ctx.fillText('卐', 1125, 75);
    ctx.fillText('卐', 55, 785);
    ctx.fillText('卐', 1125, 785);

    // 3. Top Royal Surya Crest Inscription
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText('॥ श्री सूर्य षष्ठी महाव्रत • कार्तिक मास 2026 ॥', 600, 105);

    // Main Title
    ctx.font = 'bold 44px serif';
    ctx.fillStyle = goldGrad;
    ctx.fillText('छठ महापर्व — पुण्य आशीष पत्र', 600, 165);

    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('ROYAL DEVOTIONAL BLESSING OF BHAGWAN SURYA & CHHATHI MAIYA', 600, 200);

    // Golden Divider Line
    ctx.beginPath();
    ctx.moveTo(350, 225);
    ctx.lineTo(850, 225);
    ctx.lineWidth = 2;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    // 4. Devotee Salutation Plaque
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`यह पावन प्रमाण पत्र गौरवपूर्वक समर्पित है:`, 600, 280);

    // Devotee Name in Grand Serif
    ctx.font = 'bold 52px serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fillText(devoteeName || 'श्रद्धालु भक्त', 600, 360);
    ctx.shadowBlur = 0;

    // City & Role
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText(`[ ${role} • ${cityOrGotra || 'भारत'} ]`, 600, 415);

    // 5. Blessing Text Body
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('सच्ची श्रद्धा, निर्मल मन और कठोर 36 घंटे के अखंड निर्जला तप से', 600, 480);
    ctx.fillText('भगवान सूर्य नारायण व छठी मईया के चरणों में अर्घ्य व आराधना अर्पित की गई।', 600, 515);
    ctx.fillText('छठी मईया आपके कुल, परिवार और संतति को उत्तम स्वास्थ्य, दीर्घायु व समृद्धि का आशीष दें।', 600, 550);

    // Sacred Vedic Mantra in Gold Box
    ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.fillRect(250, 585, 700, 55);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.strokeRect(250, 585, 700, 55);

    ctx.font = 'bold 18px serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('ॐ ह्रीं ह्रीं सूर्याय सहस्रकिरणाय मनोवांछित फलम् देहि देहि स्वाहा॥', 600, 620);

    // 6. Bottom Seals & Date
    ctx.textAlign = 'left';
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('पावन तिथि: कार्तिक शुक्ल षष्ठी-सप्तमी 2026', 100, 730);
    ctx.fillText('स्थान: पावन गंगा-यमुना तट व सूर्य कुंड', 100, 755);

    ctx.textAlign = 'right';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText('॥ जय छठी मईया • सूर्योपासना ॥', 1100, 730);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('छठ महापर्व डिजिटल सेवा ट्रस्ट मुहर • सत्यापित', 1100, 755);

  }, [devoteeName, cityOrGotra, role]);

  // Download PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    setTimeout(() => {
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Chhath_Blessing_Certificate_${(devoteeName || 'Devotee').replace(/\s+/g, '_')}_2026.png`;
      link.href = imageUri;
      link.click();
      setDownloading(false);
      showToast('📥 सर्टिफिकेट सफलतापूर्वक डाउनलोड हुआ!');

      // Save record to user storage
      if (currentUser?.id) {
        try {
          const record = {
            name: devoteeName,
            cityOrGotra,
            role,
            date: new Date().toISOString()
          };
          localStorage.setItem(`chhath_user_certificate_${currentUser.id}`, JSON.stringify(record));
        } catch {}
      }
    }, 350);
  };

  // Share Link
  const handleShare = () => {
    const text = `मैंने छठ महापर्व 2026 का 'डिजिटल आशीर्वाद प्रमाण पत्र' प्राप्त किया है! जय छठी मईया 🙏\nआप भी अपना आशीर्वाद पत्र बनाएं: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'छठ महापर्व 2026 आशीर्वाद प्रमाण पत्र',
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('🔗 लिंक कॉपी किया गया!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 font-mukta flex flex-col">
      <SeoHead
        title="डिजिटल आशीर्वाद प्रमाण पत्र | Chhath Puja Blessing Certificate 2026"
        description="छठ महापर्व 2026 का अपना व्यक्तिगत डिजिटल आशीर्वाद प्रमाण पत्र प्राप्त करें। सूर्य देव व छठी मईया का पावन आशीष पत्र।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/blessing-certificate/"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-3 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-all cursor-pointer"
            title="होम पर जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-rozha text-stone-950 leading-tight">
                डिजिटल आशीर्वाद प्रमाण पत्र
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-700 font-semibold leading-none">
                छठ महापर्व 2026 • आधिकारिक पुण्य आशीष
              </p>
            </div>
          </div>
        </div>

        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="truncate max-w-[110px]">{currentUser.name || 'सत्यापित'}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('login', 'अपना व्यक्तिगत प्रमाण पत्र प्राप्त करने के लिए लॉगिन करें')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>लॉगिन करें</span>
          </button>
        )}
      </header>

      {/* Main Content Body */}
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 flex-1">

        {/* Auth Gate Banner (If Not Authenticated) */}
        {!isAuthenticated && (
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-amber-700 font-bold text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>पंजीकृत श्रद्धालु विशेषाधिकार</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-rozha text-stone-950">
                अपने नाम का स्थायी प्रमाण पत्र प्राप्त करने के लिए लॉगिन करें
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                लॉगिन करने पर आपका आशीर्वाद पत्र आपके वास्तविक खाते में आजीवन सुरक्षित रहेगा और किसी भी डिवाइस से डाउनलोड किया जा सकेगा।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => signInWithGoogle?.()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Google लॉगिन</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all cursor-pointer"
              >
                ईमेल लॉगिन
              </button>
            </div>
          </div>
        )}

        {/* Input Customizer Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold font-rozha text-stone-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>सर्टिफिकेट विवरण अनुकूलित करें (Customize Certificate)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                श्रद्धालु का नाम *
              </label>
              <input
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder="उदा. राहुल झा / समस्त परिवार"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                शहर अथवा गोत्र
              </label>
              <input
                type="text"
                value={cityOrGotra}
                onChange={(e) => setCityOrGotra(e.target.value)}
                placeholder="उदा. पटना, बिहार (शांडिल्य गोत्र)"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                आस्था पद (Role)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="व्रती">छठ व्रती (साधक)</option>
                <option value="श्रद्धालु">श्रद्धालु भक्त</option>
                <option value="सेवादार">छठ सेवादार</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Canvas Certificate Preview */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-xl bg-stone-950 flex justify-center items-center p-2 sm:p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[580px] rounded-2xl shadow-2xl object-contain block"
          />
        </div>

        {/* Action Buttons */}
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
            onClick={handleShare}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'लिंक कॉपी हुआ' : 'शेयर करें'}</span>
          </button>
        </div>

      </main>
    </div>
  );
};
