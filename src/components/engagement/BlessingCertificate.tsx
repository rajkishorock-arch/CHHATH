import React, { useState, useRef, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Share2, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  FESTIVAL_CERTIFICATE_CONFIGS, 
  FestivalCertificateConfig 
} from '../../data/certificateFestivalData';

export const BlessingCertificate: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFestId, setSelectedFestId] = useState<string>('chhath');
  const activeFestival = FESTIVAL_CERTIFICATE_CONFIGS.find(f => f.id === selectedFestId) || FESTIVAL_CERTIFICATE_CONFIGS[0];

  const [devoteeName, setDevoteeName] = useState('श्रद्धा कुमारी');
  const [cityOrGotra, setCityOrGotra] = useState('पटना, बिहार');
  const [role, setRole] = useState<string>(activeFestival.roles[0] || 'व्रती');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadedBgDeity, setLoadedBgDeity] = useState<HTMLImageElement | null>(null);

  // Load background deity image
  useEffect(() => {
    if (!activeFestival.bgImage) {
      setLoadedBgDeity(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeFestival.bgImage;
    img.onload = () => setLoadedBgDeity(img);
    img.onerror = () => setLoadedBgDeity(null);
  }, [activeFestival.bgImage]);

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
    bgGrad.addColorStop(0, '#0a0c16');
    bgGrad.addColorStop(0.5, '#15192c');
    bgGrad.addColorStop(1, '#070912');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Deity background watermark
    if (loadedBgDeity) {
      ctx.save();
      ctx.globalAlpha = 0.22;
      const bgW = 1200;
      const bgH = 850;
      const imgAspect = loadedBgDeity.width / loadedBgDeity.height;
      let drawW = bgW;
      let drawH = bgW / imgAspect;
      if (drawH < bgH) {
        drawH = bgH;
        drawW = bgH * imgAspect;
      }
      ctx.drawImage(loadedBgDeity, (bgW - drawW) / 2, (bgH - drawH) / 2, drawW, drawH);
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, 1200, 850);
      ctx.restore();
    }

    // Subtle radial aura in center
    const radial = ctx.createRadialGradient(600, 425, 40, 600, 425, 550);
    radial.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
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

    // 3. Top Royal Crest Inscription
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(activeFestival.headerSanskrit, 600, 95);

    // Main Title
    ctx.font = 'bold 42px serif';
    ctx.fillStyle = goldGrad;
    ctx.fillText(activeFestival.title, 600, 155);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(activeFestival.englishSub, 600, 190);

    // Golden Divider Line
    ctx.beginPath();
    ctx.moveTo(350, 215);
    ctx.lineTo(850, 215);
    ctx.lineWidth = 2;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    // 4. Center Medallion Emblem
    const emblemY = 275;
    ctx.beginPath();
    ctx.arc(600, emblemY, 44, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();
    ctx.font = '36px serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(activeFestival.icon, 600, emblemY + 12);

    // 5. Salutation & Devotee Name Plaque
    ctx.font = '19px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('यह पावन प्रमाण पत्र गौरवपूर्वक समर्पित है:', 600, 360);

    // Grand Devotee Name with Aura
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
    ctx.shadowBlur = 12;
    ctx.fillText(devoteeName || 'श्रद्धालु भक्त', 600, 420);
    ctx.shadowBlur = 0;

    // Subtitle Line
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText(`[ ${role} • ${cityOrGotra || 'भारत'} • ${activeFestival.dhams[0]} ]`, 600, 460);

    // 6. Sacred Blessing Lines
    const preset = activeFestival.blessingPresets[0];
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(preset.line1, 600, 515);
    ctx.fillText(preset.line2, 600, 545);

    // Sacred Vedic Mantra Box
    const boxY = 585;
    ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.fillRect(180, boxY, 840, 48);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.strokeRect(180, boxY, 840, 48);

    ctx.font = 'bold 16px serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(preset.mantra, 600, boxY + 30);

    // 7. Bottom Verification & Trust Row
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`SANATAN-2026-${activeFestival.serialPrefix}-78921`, 80, 715);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText(`सत्यापित डिजिटल पुण्य पत्र • ${activeFestival.hindiName} 2026`, 80, 735);

    // Center Gold Seal
    ctx.beginPath();
    ctx.arc(600, 720, 36, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 9.5px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(activeFestival.sealText, 600, 710);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('सत्यापित मुहर', 600, 725);
    ctx.font = '8px sans-serif';
    ctx.fillText('★ VERIFIED ★', 600, 738);

    // Right Signature
    ctx.textAlign = 'right';
    ctx.font = 'italic bold 18px serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText('Acharya Vidyadhar', 1110, 706);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('मुख्य धर्माधिकारी / प्रधान पुरोहित', 1110, 726);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(activeFestival.trustName, 1110, 742);

  }, [devoteeName, cityOrGotra, role, activeFestival, loadedBgDeity]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    setTimeout(() => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanName = devoteeName.replace(/\s+/g, '_') || 'Devotee';
      link.download = `${activeFestival.name}_Blessing_Certificate_${cleanName}_2026.png`;
      link.href = image;
      link.click();
      setDownloading(false);
    }, 200);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#blessing-certificate`;
    const shareText = `🌸 *${activeFestival.hindiName} 2026* — दिव्य आशीर्वाद प्रमाण पत्र\n\nश्रद्धालु: ${devoteeName}\nस्थान: ${cityOrGotra}\n\nआप भी समस्त सनातन पर्वों का अपना पावन प्रमाण पत्र प्राप्त करें:\n${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${activeFestival.hindiName} आशीर्वाद प्रमाण पत्र`,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-6 bg-stone-50 dark:bg-stone-950 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>सर्व सनातन डिजिटल आशीर्वाद पत्र • UNIVERSAL BLESSING CERTIFICATE</span>
          </div>
          <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {activeFestival.hindiName} पुण्य-आशीष पत्र
          </h2>
          <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            छठ, महाशिवरात्रि, जन्माष्टमी, नवरात्रि, दीपावली सहित समस्त सनातन पर्वों का अपना 24K स्वर्ण बॉर्डर वाला पावन आशीष पत्र तैयार करें।
          </p>
        </div>

        {/* Festival Quick Pill Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {FESTIVAL_CERTIFICATE_CONFIGS.map((fest) => {
            const isSelected = selectedFestId === fest.id;
            return (
              <button
                key={fest.id}
                type="button"
                onClick={() => {
                  setSelectedFestId(fest.id);
                  setRole(fest.roles[0] || 'व्रती');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-xs ring-1 ring-amber-400'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-400'
                }`}
              >
                <span>{fest.icon}</span>
                <span>{fest.hindiName}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
          
          {/* Controls Form */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3.5 font-mukta">
            <h3 className="font-rozha text-lg text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-800 pb-2.5">
              {activeFestival.hindiName} विवरण
            </h3>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                श्रद्धालु / व्रती का शुभ नाम
              </label>
              <input
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder="उदा. आरती देवी / सपरिवार"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                साधना पद (Role)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {activeFestival.roles.slice(0, 4).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate ${
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
                <span>{downloading ? 'तैयार हो रहा है...' : `HD ${activeFestival.hindiName} पत्र डाउनलोड`}</span>
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
              <span>1200x850 पिक्सल रेडी — देव स्वरूप पृष्ठभूमि व वैदिक मंत्र सहित</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
