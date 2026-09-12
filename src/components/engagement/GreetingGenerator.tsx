import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Palette, 
  Crown, 
  Flame, 
  BookOpen, 
  HeartHandshake, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

type CardTheme = 'royal_crimson' | 'sapphire_twilight' | 'vedic_amber' | 'emerald_nature';

interface WishPreset {
  id: string;
  label: string;
  tag: string;
  text: string;
}

const WISH_PRESETS: WishPreset[] = [
  {
    id: 'vip_prosperity',
    label: '🏆 समृद्धि व यश (VVIP Blessing)',
    tag: 'सर्वाधिक लोकप्रिय',
    text: 'भगवान भुवन भास्कर और मां षष्ठी की असीम अनुकम्पा से आपके जीवन में यश, कीर्ति, उत्तम स्वास्थ्य, सुख एवं अपार समृद्धि का निरंतर सूर्योदय हो।'
  },
  {
    id: 'family_harmony',
    label: '✨ पारिवारिक शांति व नेह',
    tag: 'पारिवारिक',
    text: 'छठी मईया आपके घर-आंगन को सदा खुशहाली, आरोग्य और सद्भाव से आलोकित रखें। छठ महापर्व की सपरिवार कोटि-कोटि मंगलकामनाएं!'
  },
  {
    id: 'bhojpuri_folk',
    label: '🌺 पारंपरिक भोजपुरी भावना',
    tag: 'माटी के नेह',
    text: 'सुरुज देव आ छठी मईया के किरपा से रउआ सभे के परिवार में धन-धान्य, सुखी जीवन आ निरोगी काया बनल रहे। पावन छठ परब के गाढ़ा बधाई!'
  },
  {
    id: 'spiritual_dignified',
    label: '🙏 गरिमामय व संक्षिप्त',
    tag: 'औपचारिक',
    text: 'सूर्य उपासना, त्याग और लोक आस्था के महापर्व छठ की आपको एवं आपके समस्त परिवार को हार्दिक एवं भक्तिमय मंगलकामनाएं।'
  }
];

export const GreetingGenerator: React.FC = () => {
  const [name, setName] = useState('श्री रोहन सिंह व समस्त परिवार');
  const [senderTitle, setSenderTitle] = useState('⚜️ सप्रेम सपरिवार शुभकामना प्रेषक ⚜️');
  const [theme, setTheme] = useState<CardTheme>('royal_crimson');
  const [customWish, setCustomWish] = useState(WISH_PRESETS[0].text);
  const [showShloka, setShowShloka] = useState(true);
  const [showDiyas, setShowDiyas] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw canvas whenever parameters update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High Definition 1200 x 900 canvas (Ultra-Crisp 4:3 Ratio)
    const W = 1200;
    const H = 900;
    canvas.width = W;
    canvas.height = H;

    // 1. BASE ROYAL BACKGROUND GRADIENT
    if (theme === 'royal_crimson') {
      const bgGrad = ctx.createRadialGradient(W / 2, 280, 50, W / 2, H / 2, 750);
      bgGrad.addColorStop(0, '#5a0d0d'); // Luminous deep garnet
      bgGrad.addColorStop(0.35, '#3b0606'); // Imperial velvet crimson
      bgGrad.addColorStop(0.7, '#240303'); // Dark royal burgundy
      bgGrad.addColorStop(1, '#130101'); // Rich black-cherry base
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Solar flare aura in upper center
      const aura = ctx.createRadialGradient(W / 2, 240, 20, W / 2, 240, 320);
      aura.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
      aura.addColorStop(0.5, 'rgba(234, 88, 12, 0.15)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, W, H);
    } else if (theme === 'sapphire_twilight') {
      const bgGrad = ctx.createRadialGradient(W / 2, 280, 50, W / 2, H / 2, 750);
      bgGrad.addColorStop(0, '#0f274a'); // Deep royal sapphire
      bgGrad.addColorStop(0.4, '#081427'); // Midnight ocean
      bgGrad.addColorStop(0.75, '#040b17'); // Twilight abyss
      bgGrad.addColorStop(1, '#02050b'); // Night sky
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Holy river reflection aura
      const riverAura = ctx.createRadialGradient(W / 2, 750, 40, W / 2, 750, 450);
      riverAura.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
      riverAura.addColorStop(0.6, 'rgba(217, 119, 6, 0.05)');
      riverAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = riverAura;
      ctx.fillRect(0, 0, W, H);
    } else if (theme === 'vedic_amber') {
      const bgGrad = ctx.createRadialGradient(W / 2, 280, 50, W / 2, H / 2, 750);
      bgGrad.addColorStop(0, '#5c2206'); // Glowing temple amber
      bgGrad.addColorStop(0.4, '#3e1503'); // Warm earthen saffron
      bgGrad.addColorStop(0.75, '#260c02'); // Deep copper
      bgGrad.addColorStop(1, '#150601'); // Espresso warmth
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const sunAura = ctx.createRadialGradient(W / 2, 240, 20, W / 2, 240, 360);
      sunAura.addColorStop(0, 'rgba(253, 224, 71, 0.35)');
      sunAura.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
      sunAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunAura;
      ctx.fillRect(0, 0, W, H);
    } else {
      // emerald_nature
      const bgGrad = ctx.createRadialGradient(W / 2, 280, 50, W / 2, H / 2, 750);
      bgGrad.addColorStop(0, '#063f2e'); // Sacred royal emerald
      bgGrad.addColorStop(0.4, '#03251b'); // Forest jade
      bgGrad.addColorStop(0.75, '#021610'); // Deep dark spruce
      bgGrad.addColorStop(1, '#010c09'); // Midnight malachite
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const natureAura = ctx.createRadialGradient(W / 2, 240, 20, W / 2, 240, 340);
      natureAura.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
      natureAura.addColorStop(0.6, 'rgba(52, 211, 153, 0.1)');
      natureAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = natureAura;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. CELESTIAL GOLDEN STARDUST & SPARKS
    ctx.save();
    const sparks = [
      { x: 180, y: 140, r: 2.2, a: 0.6 },
      { x: 300, y: 90, r: 1.5, a: 0.5 },
      { x: 920, y: 110, r: 2.0, a: 0.6 },
      { x: 1040, y: 160, r: 1.8, a: 0.7 },
      { x: 140, y: 460, r: 1.6, a: 0.4 },
      { x: 1070, y: 480, r: 2.1, a: 0.5 },
      { x: 230, y: 620, r: 1.8, a: 0.5 },
      { x: 980, y: 640, r: 2.0, a: 0.55 },
      { x: 500, y: 120, r: 2.5, a: 0.7 },
      { x: 700, y: 130, r: 2.5, a: 0.7 }
    ];
    sparks.forEach(s => {
      ctx.fillStyle = `rgba(254, 240, 138, ${s.a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Mini 4-point twinkle
      ctx.strokeStyle = `rgba(254, 240, 138, ${s.a * 0.7})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x - s.r * 3, s.y);
      ctx.lineTo(s.x + s.r * 3, s.y);
      ctx.moveTo(s.x, s.y - s.r * 3);
      ctx.lineTo(s.x, s.y + s.r * 3);
      ctx.stroke();
    });
    ctx.restore();

    // 3. INTRICATE 24K GOLD FOIL ROYAL BORDERS
    const drawRoyalFrame = () => {
      ctx.save();

      // Outer Gold Foil Border Gradient
      const goldGrad = ctx.createLinearGradient(0, 0, W, H);
      goldGrad.addColorStop(0, '#fef08a'); // Bright gold highlight
      goldGrad.addColorStop(0.25, '#f59e0b'); // Warm rich gold
      goldGrad.addColorStop(0.5, '#fbbf24'); // Sunlit gold
      goldGrad.addColorStop(0.75, '#b45309'); // Antique burnished bronze
      goldGrad.addColorStop(1, '#fef08a'); // Gold rim

      // Primary Outer Thick Frame (Beveled Edge)
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 6;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
      ctx.shadowBlur = 14;
      ctx.strokeRect(32, 32, W - 64, H - 64);
      ctx.shadowBlur = 0;

      // Fine Inset Pin-Stripe Frame
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(44, 44, W - 88, H - 88);

      // Inner Intricate Lace Frame with Rounded Corners
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(56, 56, W - 112, H - 112, 18);
      ctx.stroke();

      // Tiny Beaded Border Pattern along inside edges
      ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
      const step = 28;
      for (let x = 80; x <= W - 80; x += step) {
        ctx.fillRect(x, 48, 3, 3);
        ctx.fillRect(x, H - 51, 3, 3);
      }
      for (let y = 80; y <= H - 80; y += step) {
        ctx.fillRect(48, y, 3, 3);
        ctx.fillRect(W - 51, y, 3, 3);
      }

      // 4 Corner Ornate Filigree Mandalas (Pure Vector Art)
      const drawFiligreeCorner = (cx: number, cy: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        ctx.strokeStyle = goldGrad;
        ctx.lineWidth = 2;
        ctx.fillStyle = '#fef08a';

        // Outer corner quadrant arc
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI / 2);
        ctx.stroke();

        // Corner Diamond Petal
        ctx.beginPath();
        ctx.moveTo(14, 14);
        ctx.lineTo(26, 8);
        ctx.lineTo(38, 38);
        ctx.lineTo(8, 26);
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.fill();
        ctx.stroke();

        // Radiant corner studs
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(36, 12, 2.5, 0, Math.PI * 2);
        ctx.arc(12, 36, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      drawFiligreeCorner(56, 56, 0); // Top-Left
      drawFiligreeCorner(W - 56, 56, Math.PI / 2); // Top-Right
      drawFiligreeCorner(W - 56, H - 56, Math.PI); // Bottom-Right
      drawFiligreeCorner(56, H - 56, (Math.PI * 3) / 2); // Bottom-Left

      ctx.restore();
    };

    drawRoyalFrame();

    // 4. TOP SACRED BANNER / MANTRA
    ctx.save();
    ctx.textAlign = 'center';

    // Royal Crest Ribbon at Very Top
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.beginPath();
    ctx.roundRect(W / 2 - 280, 68, 560, 34, 17);
    ctx.fill();
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 15px "Mukta", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.letterSpacing = '2px';
    ctx.fillText('⚜️ श्री सूर्योपासना महापर्व २०२६ • कार्तिक शुक्ल षष्ठी ⚜️', W / 2, 91);
    ctx.restore();

    // 5. VECTOR DIVINE SURYA MANDALA & LOTUS CREST (No low-res emojis!)
    const drawDivineSurya = (cx: number, cy: number) => {
      ctx.save();
      ctx.translate(cx, cy);

      const goldSunGrad = ctx.createLinearGradient(-50, -50, 50, 50);
      goldSunGrad.addColorStop(0, '#fffbeb');
      goldSunGrad.addColorStop(0.3, '#fde047');
      goldSunGrad.addColorStop(0.7, '#f59e0b');
      goldSunGrad.addColorStop(1, '#b45309');

      // Radiating Sunbeams (24 Alternating Long and Short Diamond Rays)
      const numRays = 24;
      for (let i = 0; i < numRays; i++) {
        const angle = (i * Math.PI * 2) / numRays;
        const isLong = i % 2 === 0;
        const outerR = isLong ? 76 : 58;
        const baseW = isLong ? 0.08 : 0.06;

        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 34);
        ctx.lineTo(-baseW * 40, 44);
        ctx.lineTo(0, outerR);
        ctx.lineTo(baseW * 40, 44);
        ctx.closePath();
        ctx.fillStyle = goldSunGrad;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
      }

      // Outer Golden Beaded Ring
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Glowing Core Disc
      const coreGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 32);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, '#fef08a');
      coreGrad.addColorStop(0.7, '#ea580c');
      coreGrad.addColorStop(1, '#9a3412');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();

      // Sacred OM "ॐ" in Solar Heart
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 32px "Rozha One", serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 6;
      ctx.fillText('ॐ', 0, 2);

      ctx.restore();
    };

    drawDivineSurya(W / 2, 178);

    // 6. TWIN GOLDEN ORNATE DIYAS ON SIDES (If enabled)
    if (showDiyas) {
      const drawRoyalDiya = (cx: number, cy: number, flip: boolean) => {
        ctx.save();
        ctx.translate(cx, cy);
        if (flip) ctx.scale(-1, 1);

        const brassGrad = ctx.createLinearGradient(-24, 0, 24, 20);
        brassGrad.addColorStop(0, '#fef08a');
        brassGrad.addColorStop(0.5, '#f59e0b');
        brassGrad.addColorStop(1, '#78350f');

        // Diya Base / Stand
        ctx.fillStyle = brassGrad;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;

        // Brass Cup
        ctx.beginPath();
        ctx.ellipse(0, 10, 28, 12, 0, 0, Math.PI);
        ctx.lineTo(-28, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pedestal
        ctx.beginPath();
        ctx.moveTo(-8, 18);
        ctx.lineTo(-18, 30);
        ctx.lineTo(18, 30);
        ctx.lineTo(8, 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Radiant Diya Flame
        const flameGrad = ctx.createRadialGradient(4, 2, 2, 4, -4, 24);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.2, '#fde047');
        flameGrad.addColorStop(0.6, '#ea580c');
        flameGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

        ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
        ctx.shadowBlur = 24;

        ctx.beginPath();
        ctx.moveTo(-8, 8);
        ctx.bezierCurveTo(-14, -2, -6, -20, 4, -30);
        ctx.bezierCurveTo(14, -20, 18, -2, 10, 8);
        ctx.closePath();
        ctx.fillStyle = flameGrad;
        ctx.fill();

        ctx.restore();
      };

      drawRoyalDiya(260, 186, false);
      drawRoyalDiya(W - 260, 186, true);
    }

    // 7. SACRED SANSKRIT SHLOKA (If enabled)
    if (showShloka) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = 'italic 16px "Mukta", sans-serif';
      ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText('॥ आदिदेव नमस्तुभ्यं प्रसीद मम भास्कर । दिवाकर नमस्तुभ्यं प्रभाकर नमोऽस्तु ते ॥', W / 2, 272);
      ctx.restore();
    }

    // 8. MAJESTIC DEVANAGARI TITLE (Embossed 3D Gold Gradient)
    ctx.save();
    ctx.textAlign = 'center';

    const titleGrad = ctx.createLinearGradient(0, 290, 0, 360);
    titleGrad.addColorStop(0, '#ffffff');
    titleGrad.addColorStop(0.35, '#fef08a');
    titleGrad.addColorStop(0.7, '#f59e0b');
    titleGrad.addColorStop(1, '#b45309');

    ctx.font = 'bold 54px "Rozha One", serif';
    ctx.fillStyle = titleGrad;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
    ctx.shadowBlur = 22;
    ctx.fillText('॥ जय छठी मईया ॥', W / 2, 345);

    // Gold filigree line under title
    ctx.shadowBlur = 0;
    const dividerGrad = ctx.createLinearGradient(W / 2 - 250, 0, W / 2 + 250, 0);
    dividerGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
    dividerGrad.addColorStop(0.5, '#fde047');
    dividerGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.strokeStyle = dividerGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 250, 366);
    ctx.lineTo(W / 2 + 250, 366);
    ctx.stroke();

    // Small Diamond in divider center
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(W / 2, 366, 4, 0, Math.PI * 2);
    ctx.fill();

    // Subtitle
    ctx.font = 'bold 22px "Mukta", sans-serif';
    ctx.fillStyle = '#fed7aa';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('सूर्य उपासना एवं लोक आस्था के महापर्व छठ की पावन मंगलकामनाएं', W / 2, 404);
    ctx.restore();

    // 9. CENTRAL PARCHMENT WISH BODY
    ctx.save();
    ctx.textAlign = 'center';

    // Velvet parchment backdrop for the message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.roundRect(140, 440, W - 280, 220, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Word Wrap and Layout for Custom Wish
    const maxWishWidth = W - 360;
    const words = customWish.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    ctx.font = 'bold 26px "Mukta", sans-serif';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWishWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    // Draw Wish Lines Centered
    const startY = 475 + (lines.length === 1 ? 40 : lines.length === 2 ? 25 : 12);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;

    lines.forEach((line, idx) => {
      ctx.fillText(line, W / 2, startY + idx * 38);
    });

    // Secondary Eternal Blessing Subtext
    ctx.font = 'italic 19px "Mukta", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.shadowBlur = 4;
    ctx.fillText('सदा निरोगी रहें, यशस्वी बनें एवं सूर्य देव व छठी मईया का वरदहस्त बना रहे।', W / 2, 624);

    ctx.restore();

    // 10. VVIP SENDER PLAQUE (भव्य राजसी प्रेषक पटल)
    ctx.save();
    ctx.textAlign = 'center';

    const plaqueW = 680;
    const plaqueH = 92;
    const plaqueX = (W - plaqueW) / 2;
    const plaqueY = 690;

    // Outer Plaque Drop Shadow & Glow
    ctx.shadowColor = 'rgba(245, 158, 11, 0.55)';
    ctx.shadowBlur = 20;

    // Plaque Beveled Gradient
    const plaqueGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX + plaqueW, plaqueY + plaqueH);
    plaqueGrad.addColorStop(0, '#310d04');
    plaqueGrad.addColorStop(0.5, '#6b1e06');
    plaqueGrad.addColorStop(1, '#310d04');
    ctx.fillStyle = plaqueGrad;
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 20);
    ctx.fill();

    // Plaque 24K Gold Border
    const plaqueBorderGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX + plaqueW, plaqueY);
    plaqueBorderGrad.addColorStop(0, '#fde047');
    plaqueBorderGrad.addColorStop(0.5, '#f59e0b');
    plaqueBorderGrad.addColorStop(1, '#fde047');
    ctx.strokeStyle = plaqueBorderGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Plaque Left & Right Decorative Brackets
    ctx.fillStyle = '#fde047';
    ctx.font = '20px serif';
    ctx.fillText('❖', plaqueX + 28, plaqueY + plaqueH / 2 + 6);
    ctx.fillText('❖', plaqueX + plaqueW - 28, plaqueY + plaqueH / 2 + 6);

    // Sender Prefix Tag
    ctx.font = 'bold 15px "Mukta", sans-serif';
    ctx.fillStyle = '#fdba74';
    ctx.fillText(senderTitle, W / 2, plaqueY + 28);

    // Main VIP Sender Name (High-Contrast Bold)
    ctx.font = 'bold 32px "Mukta", sans-serif';
    const nameGrad = ctx.createLinearGradient(0, plaqueY + 36, 0, plaqueY + 76);
    nameGrad.addColorStop(0, '#ffffff');
    nameGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = nameGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 6;
    ctx.fillText(name.trim() || 'आप और आपका परिवार', W / 2, plaqueY + 68);

    ctx.restore();

    // 11. BOTTOM AUTHENTICITY SEAL & WATERMARK
    ctx.save();
    ctx.font = '13px "Mukta", sans-serif';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';

    ctx.textAlign = 'left';
    ctx.fillText('⚜️ राष्ट्रीय सांस्कृतिक धरोहर • छठ सेवा न्यास', 65, H - 42);

    ctx.textAlign = 'center';
    ctx.fillText('॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥', W / 2, H - 42);

    ctx.textAlign = 'right';
    ctx.fillText('chhathmahaparv.org', W - 65, H - 42);

    ctx.restore();

  }, [name, senderTitle, theme, customWish, showShloka, showDiyas]);

  // Download High-Resolution 1200x900 PNG Image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsGenerating(true);
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.65 }
    });

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `Chhath_Royal_Greeting_${name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setIsGenerating(false);
    }, 200);
  };

  // Direct WhatsApp Share with Rich Formatted Message
  const handleShareWhatsApp = () => {
    const text = `🌅 *॥ जय छठी मईया ॥* 🙏\n*सूर्य उपासना एवं लोक आस्था का महापर्व २०२६*\n\n${customWish}\n\n*— ${senderTitle.replace(/⚜️/g, '').trim()}:* *${name}*\n\n🎴 *आप भी अपना शाही छठ बधाई पत्र मुफ्त बनाएं:* https://chhathmahaparv.org/#wishes`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Copy Formatted Text
  const handleCopyText = () => {
    const text = `🌅 ॥ जय छठी मईया ॥ 🙏\n\n${customWish}\n\n— ${senderTitle.replace(/⚜️/g, '').trim()}: ${name}\n\nhttps://chhathmahaparv.org`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="chhath-glass p-6 sm:p-10 rounded-3xl border-2 border-amber-500/40 shadow-2xl w-full max-w-6xl mx-auto my-12 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-amber-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>शाही डिजिटल बधाई पत्र मेकर (Royal VVIP Edition)</span>
          </div>
          <h3 className="font-rozha text-2xl sm:text-4xl text-stone-900 dark:text-stone-100 font-bold">
            अपने नाम से बनाएं शाही छठ बधाई पत्र 🎴
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-mukta mt-1">
            24K स्वर्ण बॉर्डर, वैदिक श्लोक, दिव्य सूर्य आभा और अपने नाम के साथ उच्च गुणवत्ता (1200x900 HD) में ग्रीटिंग कार्ड बनाएं।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-xs font-bold text-orange-600 dark:text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ultra HD 1200x900</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Customization Controls */}
        <div className="lg:col-span-5 space-y-5 font-mukta">
          
          {/* User Name Input */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/90 border border-amber-500/30 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5 flex items-center justify-between">
                <span>आपका अथवा परिवार का नाम:</span>
                <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">कार्ड के मुख्य पटल पर दिखेगा</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा: श्री रोहन सिंह व समस्त परिवार"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-amber-500/40 text-stone-900 dark:text-stone-100 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            {/* Sender Prefix Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                प्रेषक पदवी / शीर्षक (Sender Title):
              </label>
              <select
                value={senderTitle}
                onChange={(e) => setSenderTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-amber-500/30 text-stone-800 dark:text-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="⚜️ सप्रेम सपरिवार शुभकामना प्रेषक ⚜️">⚜️ सप्रेम सपरिवार शुभकामना प्रेषक</option>
                <option value="⚜️ सादर प्रेषक (With Best Compliments) ⚜️">⚜️ सादर प्रेषक (With Best Compliments)</option>
                <option value="⚜️ शुभचिंतक एवं स्नेहीजन ⚜️">⚜️ शुभचिंतक एवं स्नेहीजन</option>
                <option value="⚜️ विनीत / सप्रेम भेंट ⚜️">⚜️ विनीत / सप्रेम भेंट</option>
                <option value="⚜️ भवदीय एवं समस्त मित्रगण ⚜️">⚜️ भवदीय एवं समस्त मित्रगण</option>
              </select>
            </div>
          </div>

          {/* 1-Click VIP Wish Presets */}
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center justify-between">
              <span>शाही शुभकामना संदेश चुनें (Quick Presets):</span>
              <span className="text-[11px] font-normal text-orange-600 dark:text-amber-400">1-क्लिक में बदलें</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WISH_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setCustomWish(preset.text)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    customWish === preset.text
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md scale-102'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/20 hover:border-amber-500/40 hover:bg-orange-500/5'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{preset.label}</div>
                  <div className={`text-[10px] mt-0.5 ${customWish === preset.text ? 'text-orange-100' : 'text-stone-500'}`}>
                    {preset.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
              संदेश संपादित करें (Edit Message):
            </label>
            <textarea
              rows={3}
              value={customWish}
              onChange={(e) => setCustomWish(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed font-mukta"
            />
          </div>

          {/* 4 Royal Themes Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
              शाही पृष्ठभूमि व थीम (Royal Color Themes):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('royal_crimson')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  theme === 'royal_crimson'
                    ? 'bg-red-950 text-amber-300 border-amber-400 shadow-lg ring-1 ring-amber-400'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/20'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-900 to-amber-500 border border-amber-300 shrink-0"></div>
                <div className="text-left leading-tight">
                  <div>शाही सिंदूरी</div>
                  <div className="text-[10px] font-normal opacity-75">Crimson & Gold</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('sapphire_twilight')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  theme === 'sapphire_twilight'
                    ? 'bg-blue-950 text-amber-300 border-amber-400 shadow-lg ring-1 ring-amber-400'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/20'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-950 to-amber-400 border border-amber-300 shrink-0"></div>
                <div className="text-left leading-tight">
                  <div>शाही नील संध्या</div>
                  <div className="text-[10px] font-normal opacity-75">Sapphire Twilight</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('vedic_amber')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  theme === 'vedic_amber'
                    ? 'bg-amber-950 text-amber-300 border-amber-400 shadow-lg ring-1 ring-amber-400'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/20'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-300 border border-amber-300 shrink-0"></div>
                <div className="text-left leading-tight">
                  <div>वैदिक केसरिया</div>
                  <div className="text-[10px] font-normal opacity-75">Amber Sunburst</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('emerald_nature')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  theme === 'emerald_nature'
                    ? 'bg-emerald-950 text-amber-300 border-amber-400 shadow-lg ring-1 ring-amber-400'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/20'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-900 to-amber-300 border border-amber-300 shrink-0"></div>
                <div className="text-left leading-tight">
                  <div>शाही मरकत</div>
                  <div className="text-[10px] font-normal opacity-75">Royal Emerald</div>
                </div>
              </button>
            </div>
          </div>

          {/* Ornate Toggles */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showShloka}
                onChange={(e) => setShowShloka(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="font-bold text-stone-800 dark:text-stone-200">वैदिक श्लोक शामिल करें</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDiyas}
                onChange={(e) => setShowDiyas(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="font-bold text-stone-800 dark:text-stone-200">शाही दीपक (Diyas)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 scale-102 font-bold"
            >
              <Download className="w-5 h-5" />
              <span>{isGenerating ? 'कार्ड तैयार हो रहा है...' : 'शाही कार्ड डाउनलोड करें (Ultra HD 1200x900)'}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp पर शेयर</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border border-amber-500/20"
                title="टेक्स्ट संदेश कॉपी करें"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कॉपी हो गया' : 'टेक्स्ट कॉपी'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right: Royal Bezel Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Royal Bezel Frame with Metallic Gold Accents */}
          <div className="w-full p-2.5 sm:p-3 rounded-3xl bg-gradient-to-b from-amber-600 via-yellow-600 to-amber-800 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-2 border-yellow-300 relative group">
            
            {/* Top Frame Gold Header */}
            <div className="flex items-center justify-between px-3 py-1.5 mb-1 text-[11px] font-bold text-stone-950 font-mukta">
              <div className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-stone-950" />
                <span>VVIP ROYAL GREETING FRAME</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
                <span>LIVE ULTRA-HD PREVIEW</span>
              </div>
            </div>

            {/* Inner Canvas Display */}
            <div className="rounded-2xl overflow-hidden shadow-inner bg-black border border-amber-400/40">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block transform group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>

          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mukta text-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              यह कार्ड डाउनलोड करने पर <strong>1200x900 पिक्सल</strong> के संपूर्ण हाई-डेफिनिशन रेजोल्यूशन में सहेजा जाएगा।
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
