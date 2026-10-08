import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Award, 
  Download, 
  Share2, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Flame 
} from 'lucide-react';

export const BlessingCertificate: React.FC = () => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [devoteeName, setDevoteeName] = useState('श्रद्धा कुमारी');
  const [cityOrGotra, setCityOrGotra] = useState('पटना, बिहार');
  const [role, setRole] = useState<'व्रती' | 'श्रद्धालु' | 'सेवादार'>('व्रती');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Redraw certificate on changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: 1200 x 850 HD
    canvas.width = 1200;
    canvas.height = 850;

    // 1. Royal Obsidian Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGrad.addColorStop(0, '#0c0e18');
    bgGrad.addColorStop(0.5, '#16192b');
    bgGrad.addColorStop(1, '#080a12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Subtle radial aura in center
    const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 550);
    radial.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
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
    ctx.letterSpacing = '4px';
    ctx.fillText('॥ श्री सूर्य षष्ठी महाव्रत • कार्तिक मास 2026 ॥', 600, 105);

    // Main Title
    ctx.font = 'bold 44px serif';
    ctx.fillStyle = goldGrad;
    ctx.fillText('छठ महापर्व — पुण्य आशीष पत्र', 600, 165);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.letterSpacing = '2px';
    ctx.fillText('ROYAL DEVOTIONAL BLESSING OF SURYA DEV & CHHATHI MAIYA', 600, 200);

    // Golden Divider Line
    ctx.beginPath();
    ctx.moveTo(350, 225);
    ctx.lineTo(850, 225);
    ctx.lineWidth = 2;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    // 4. Salutation & Devotee Name Plaque
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.letterSpacing = '1px';
    ctx.fillText(`यह पावन प्रमाण पत्र गौरवपूर्वक समर्पित है:`, 600, 280);

    // Devotee Name in Grand Serif
    ctx.font = 'bold 54px serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fillText(devoteeName || 'आस्थावान व्रती', 600, 360);
    ctx.shadowBlur = 0; // reset

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

    // Sacred Vedic Sloka in Gold Pod
    ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.fillRect(250, 585, 700, 55);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.strokeRect(250, 585, 700, 55);

    ctx.font = 'bold 18px serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('ॐ ह्रीं ह्रीं सूर्याय सहस्रकिरणाय मनोवांछित फलम् देहि देहि स्वाहा॥', 600, 620);

    // 6. Bottom Seals & Date
    // Left: Issue Date
    ctx.textAlign = 'left';
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('पावन तिथि: कार्तिक शुक्ल षष्ठी-सप्तमी 2026', 100, 730);
    ctx.fillText('स्थान: पावन गंगा-यमुना तट व तीर्थ स्थल', 100, 755);

    // Right: Divine Seal Stamp
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText('॥ जय छठी मईया • सूर्योपासना ॥', 1100, 730);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('छठ महापर्व डिजिटल सेवा ट्रस्ट मुहर', 1100, 755);

  }, [devoteeName, cityOrGotra, role]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    setTimeout(() => {
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Chhath_Blessing_Certificate_${devoteeName.replace(/\s+/g, '_')}.png`;
      link.href = imageUri;
      link.click();
      setDownloading(false);
    }, 400);
  };

  const handleShare = () => {
    const text = `मैंने छठ महापर्व 2026 का 'पुण्य आशीष पत्र' प्राप्त किया है! जय छठी मईया 🙏\nआप भी अपना पत्र बनाएं: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'छठ महापर्व पुण्य आशीष पत्र',
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="blessing-certificate" className="py-8 relative overflow-hidden bg-transparent">
      
      <div className="container-custom relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>शाही डिजिटल वंदना • ROYAL BLESSING CERTIFICATE</span>
          </div>
          <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            वीआईपी छठ महापर्व पुण्य-आशीष पत्र
          </h2>
          <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            व्रती व श्रद्धालु जन अपना नाम दर्ज करके 24 कैरेट स्वर्ण बॉर्डर वाला पावन आशीष पत्र तैयार करें और व्हाट्सएप या सोशल मीडिया पर साझा करें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
          
          {/* Controls Form */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3.5 font-mukta">
            <h3 className="font-rozha text-lg text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-800 pb-2.5">
              विवरण दर्ज करें
            </h3>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                श्रद्धालु / व्रती का शुभ नाम
              </label>
              <input
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder="उदा. आरती देवी"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                शहर / गोत्र
              </label>
              <input
                type="text"
                value={cityOrGotra}
                onChange={(e) => setCityOrGotra(e.target.value)}
                placeholder="उदा. पटना, बिहार / कश्यप गोत्र"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                भूमिका चयन
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['व्रती', 'श्रद्धालु', 'सेवादार'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      role === r
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-xs ring-1 ring-amber-400 font-extrabold'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'तैयार हो रहा है...' : 'HD आशीष पत्र डाउनलोड करें'}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                <span>{copied ? 'लिंक कॉपी हो गया!' : 'व्हाट्सएप पर शेयर करें'}</span>
              </button>
            </div>
          </div>

          {/* Certificate Live Canvas Preview */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 bg-stone-950 p-1">
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl object-contain shadow-2xl"
              />
            </div>
            <span className="text-[11px] text-amber-400/80 font-mukta mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>हाई-डेफिनिशन 1200x850 पिक्सल रेडी — स्टेटस व फ्रेमिंग हेतु उपयुक्त</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
