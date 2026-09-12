import React, { useRef, useEffect, useState } from 'react';
import { Sun, Sunset, Moon, Rotate3d, ZoomIn, ZoomOut, Sparkles, Info, Eye } from 'lucide-react';

type LightingMode = 'morning' | 'sunset' | 'night';

interface SelectedObjectInfo {
  name: string;
  hindiName: string;
  desc: string;
  significance: string;
}

const OBJECT_DETAILS: Record<string, SelectedObjectInfo> = {
  sun: {
    name: 'Bhagwan Surya (Sun)',
    hindiName: 'भगवान सूर्य देव',
    desc: 'समस्त जगत के प्रत्यक्ष देवता, ऊर्जा व जीवन के शाश्वत स्रोत।',
    significance: 'छठ में षष्ठी को अस्ताचलगामी एवं सप्तमी को उदीयमान सूर्य को अर्घ्य दिया जाता है।'
  },
  river: {
    name: 'Holy Ganga River',
    hindiName: 'पवित्र गंगाजल व तरंगें',
    desc: 'पापनाशिनी व मोक्षदायिनी भागीरथी गंगा, जिनके जल में खड़े होकर व्रती तप करते हैं।',
    significance: 'कमर तक शीतल जल में खड़े होकर सूर्य को अर्घ्य अर्पित करना आंतरिक ताप व विकार नष्ट करता है।'
  },
  daura: {
    name: 'Bamboo Daura & Sup',
    hindiName: 'बांस का दउरा व पीतल/बांस का सूप',
    desc: 'पवित्र फल, ठेकुआ, कसार, नारियल व सिन्दूर से सज्जित पावन पूजा का थाल।',
    significance: 'बांस प्रकृति और समानता का प्रतीक है; यह सामाजिक समरसता को दर्शाता है।'
  },
  sugarcane: {
    name: 'Sacred Sugarcane (ईख)',
    hindiName: 'पवित्र गांठदार ईख (गन्ना)',
    desc: 'शीर्ष पर हरी पत्तियों सहित चार गन्ने का मंडप बनाकर सूर्य देव का आह्वान किया जाता है।',
    significance: 'ईख की मिठास व पोर-पोर में जीवन की निरंतरता व समृद्धि का वास माना गया है।'
  },
  diya: {
    name: 'Earthen Clay Diya',
    hindiName: 'मिट्टी का अखंड दीपक',
    desc: 'शुद्ध गाय के घी अथवा तिल के तेल से प्रज्वलित पवित्र पंचतत्व दीप।',
    significance: 'अज्ञान के अंधकार पर ज्ञान, प्रकाश व सत्य की विजय का शाश्वत प्रतीक।'
  },
  devotee: {
    name: 'Vrati Devotee',
    hindiName: 'छठ व्रती साधक',
    desc: '३६ घंटे के अखंड निर्जला तप में लीन, पीत वस्त्र धारण किए श्रद्धा की प्रतिमूर्ति।',
    significance: 'व्रती की साधना पूरे कुल व समाज के आरोग्य एवं संतान कल्याण हेतु होती है।'
  }
};

export const Interactive3DGhat: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lighting, setLighting] = useState<LightingMode>('morning');
  const [rotation, setRotation] = useState<number>(25); // degrees
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [selectedObj, setSelectedObj] = useState<SelectedObjectInfo | null>(OBJECT_DETAILS.sun);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let waveOffset = 0;

    const render = () => {
      waveOffset += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Sky & Atmosphere according to lighting
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      if (lighting === 'morning') {
        skyGrad.addColorStop(0, '#78350f');
        skyGrad.addColorStop(0.3, '#c2410c');
        skyGrad.addColorStop(0.7, '#fbbf24');
        skyGrad.addColorStop(1, '#fef08a');
      } else if (lighting === 'sunset') {
        skyGrad.addColorStop(0, '#4c0519');
        skyGrad.addColorStop(0.3, '#9f1239');
        skyGrad.addColorStop(0.6, '#ea580c');
        skyGrad.addColorStop(1, '#fbbf24');
      } else {
        // Night
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(0.5, '#0f172a');
        skyGrad.addColorStop(1, '#1e293b');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars in Night mode
      if (lighting === 'night') {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 40; i++) {
          const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
          const sy = (Math.cos(i * 33) * 0.5 + 0.5) * (height * 0.4);
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 3) * 0.5 + 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.save();
      // Apply Zoom and Isometric Camera angle
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      const rad = (rotation * Math.PI) / 180;

      // 2. Rising or Setting Sun
      const sunY = lighting === 'morning' ? -height * 0.22 : lighting === 'sunset' ? -height * 0.15 : -height * 0.3;
      const sunRadius = 45;
      
      if (lighting !== 'night') {
        // Sun Glow
        const sunGlow = ctx.createRadialGradient(0, sunY, 10, 0, sunY, 140);
        sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        sunGlow.addColorStop(0.4, lighting === 'morning' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(239, 68, 68, 0.5)');
        sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(0, sunY, 140, 0, Math.PI * 2);
        ctx.fill();

        // Sun Body
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Moon in night
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(width * 0.2, sunY, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. 3D River Surface with Waves
      const riverY = height * 0.05;
      const riverGrad = ctx.createLinearGradient(0, riverY, 0, height * 0.45);
      if (lighting === 'morning') {
        riverGrad.addColorStop(0, '#b45309');
        riverGrad.addColorStop(0.3, '#0284c7');
        riverGrad.addColorStop(1, '#0369a1');
      } else if (lighting === 'sunset') {
        riverGrad.addColorStop(0, '#991b1b');
        riverGrad.addColorStop(0.3, '#7c2d12');
        riverGrad.addColorStop(1, '#0f172a');
      } else {
        riverGrad.addColorStop(0, '#0c4a6e');
        riverGrad.addColorStop(1, '#022c22');
      }
      ctx.fillStyle = riverGrad;
      ctx.beginPath();
      ctx.moveTo(-width, riverY);
      for (let x = -width; x <= width; x += 30) {
        const y = riverY + Math.sin(x * 0.02 + waveOffset) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(-width, height);
      ctx.closePath();
      ctx.fill();

      // 4. 3D Ghat Stone Steps
      const stepCount = 5;
      const stepHeight = 22;
      const stepWidth = width * 1.2;
      const startY = height * 0.15;

      for (let s = 0; s < stepCount; s++) {
        const curY = startY + s * stepHeight;
        const curX = Math.sin(rad) * (s * 8);

        // Top surface of step
        ctx.fillStyle = lighting === 'night' ? (s % 2 === 0 ? '#334155' : '#1e293b') : (s % 2 === 0 ? '#fde68a' : '#fef3c7');
        ctx.beginPath();
        ctx.rect(-stepWidth / 2 + curX, curY, stepWidth, stepHeight * 0.6);
        ctx.fill();

        // Front stone face
        ctx.fillStyle = lighting === 'night' ? '#0f172a' : '#d97706';
        ctx.beginPath();
        ctx.rect(-stepWidth / 2 + curX, curY + stepHeight * 0.6, stepWidth, stepHeight * 0.4);
        ctx.fill();
      }

      // 5. Sugarcane Stalks (ईख) on Left and Right
      const drawSugarcane = (gx: number, gy: number) => {
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.quadraticCurveTo(gx - 10, gy - 80, gx - 5, gy - 160);
        ctx.stroke();

        // Top leaves
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        [-30, -10, 15, 35].forEach(ang => {
          ctx.beginPath();
          ctx.moveTo(gx - 5, gy - 160);
          ctx.quadraticCurveTo(gx - 5 + ang * 1.5, gy - 180, gx + ang * 2, gy - 165);
          ctx.stroke();
        });
      };

      drawSugarcane(-160, startY + 40);
      drawSugarcane(-140, startY + 50);
      drawSugarcane(150, startY + 40);
      drawSugarcane(170, startY + 50);

      // 6. Bamboo Daura & Sup in center step
      const dauraX = -20;
      const dauraY = startY + 30;
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(dauraX, dauraY, 28, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Prasad & Fruits in Daura (Bananas, apples, coconut)
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(dauraX - 8, dauraY - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(dauraX + 8, dauraY - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(dauraX, dauraY - 6, 7, 0, Math.PI * 2);
      ctx.fill();

      // 7. Devotees Silhouette in water (Offering Arghya)
      const devX = 80;
      const devY = riverY + 25;
      // Head
      ctx.fillStyle = lighting === 'night' ? '#0f172a' : '#ea580c';
      ctx.beginPath();
      ctx.arc(devX, devY - 32, 10, 0, Math.PI * 2);
      ctx.fill();
      // Body & Yellow Saree / Kurta
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.moveTo(devX - 14, devY);
      ctx.lineTo(devX, devY - 24);
      ctx.lineTo(devX + 14, devY);
      ctx.closePath();
      ctx.fill();
      // Raised Hands holding Soop towards Sun
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(devX - 6, devY - 18);
      ctx.lineTo(devX - 16, devY - 34);
      ctx.lineTo(devX - 6, devY - 38);
      ctx.stroke();

      // 8. Flickering Floating Diyas on Ganga Water
      const diyas = [
        { x: -90, y: riverY + 15, delay: 0 },
        { x: -30, y: riverY + 30, delay: 1 },
        { x: 40, y: riverY + 18, delay: 2 },
        { x: 120, y: riverY + 35, delay: 3 }
      ];

      diyas.forEach((d, idx) => {
        const floatY = d.y + Math.sin(waveOffset * 1.5 + idx) * 3;
        // Diya Base
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(d.x, floatY, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Flame with glow
        const flicker = Math.sin(waveOffset * 8 + idx * 2) * 2;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(d.x, floatY - 5 + flicker * 0.3, 4 + flicker * 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [lighting, rotation, zoom]);

  // Touch and Mouse Drag Rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    setRotation(prev => prev + delta * 0.2);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - dragStartX;
    setRotation(prev => prev + delta * 0.3);
    setDragStartX(e.touches[0].clientX);
  };

  return (
    <section id="interactive-3d-ghat" className="section-padding relative overflow-hidden bg-stone-950 text-white">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <Rotate3d className="w-3.5 h-3.5" />
            <span>३डी इंटरैक्टिव घाट दर्शन (3D Interactive Ghat)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold gold-foil-text">
            आभासी ३डी छठ घाट अनुभव
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-300">
            पवित्र गंगा, घाट की सीढ़ियां, सूर्य देव, दउरा, ईख व तैरते दीयों को स्पर्श करें और 360° घुमाकर दर्शन करें।
          </p>
        </div>

        {/* 3D Canvas Box */}
        <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-black">
          
          {/* Top Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-stone-950/60 backdrop-blur-md p-3 rounded-2xl border border-amber-500/20">
            
            {/* Lighting Mode Selector */}
            <div className="flex items-center gap-1.5 bg-stone-900/80 p-1 rounded-full border border-amber-500/20">
              <button
                onClick={() => setLighting('morning')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  lighting === 'morning' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>उषा अर्घ्य (Morning)</span>
              </button>

              <button
                onClick={() => setLighting('sunset')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  lighting === 'sunset' ? 'bg-red-600 text-white shadow-md' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
                <span>संध्या अर्घ्य (Sunset)</span>
              </button>

              <button
                onClick={() => setLighting('night')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  lighting === 'night' ? 'bg-indigo-600 text-white shadow-md' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>रात्रि दीप (Night)</span>
              </button>
            </div>

            {/* Zoom & Reset Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
                className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-500/30 transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.7))}
                className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-500/30 transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setRotation(25);
                  setZoom(1.0);
                }}
                className="px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-xs font-bold text-amber-400 border border-amber-500/30"
              >
                रीसेट (Reset)
              </button>
            </div>

          </div>

          {/* Interactive HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={1000}
            height={550}
            className="w-full h-[360px] sm:h-[480px] object-cover cursor-grab active:cursor-grabbing block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          />

          {/* Bottom Object Inspector Bar */}
          <div className="p-4 bg-stone-900/90 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <span className="text-xs font-bold text-amber-400 shrink-0">पवित्र तत्व:</span>
              {Object.entries(OBJECT_DETAILS).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedObj(info)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedObj?.name === info.name
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {info.hindiName}
                </button>
              ))}
            </div>

            {selectedObj && (
              <div className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">{selectedObj.hindiName} ({selectedObj.name})</span>
                  <p className="text-stone-300 font-mukta mt-0.5">{selectedObj.desc}</p>
                  <p className="text-amber-200/80 font-mukta text-[11px] mt-0.5">
                    <strong>महत्व:</strong> {selectedObj.significance}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Drag Instructions */}
            <div className="w-full text-center text-[11px] font-mukta text-stone-400">
              💡 माउस से ड्रैग करें या उंगली से स्वाइप करके 3D कैमरा एंगल घुमाएं। जूम इन/आउट करें।
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
