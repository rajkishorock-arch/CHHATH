import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { 
  Heart, 
  Send, 
  Flame, 
  Sparkles, 
  MessageSquare, 
  MapPin, 
  Filter, 
  PlusCircle, 
  CheckCircle2 
} from 'lucide-react';

interface Sankalp {
  id: string;
  name: string;
  city: string;
  category: string;
  message: string;
  timestamp: string;
  diyasCount: number;
}

const INITIAL_SANKALPS: Sankalp[] = [
  {
    id: 's1',
    name: 'कौशल्या देवी',
    city: 'पटना, बिहार',
    category: 'संतान सुख',
    message: 'हे छठी मईया! हमारे पूरे परिवार पर अपनी कृपा दृष्टि बनाए रखें और हमारे बच्चों को उत्तम स्वास्थ्य व विद्या प्रदान करें।',
    timestamp: 'आज प्रातः',
    diyasCount: 148
  },
  {
    id: 's2',
    name: 'संजय कुमार झा',
    city: 'दरभंगा, मिथिला',
    category: 'परिवार आरोग्य',
    message: 'माई के आशीर्वाद से घर में शांति और समृद्धि रहे। छठी मईया सबकी मनोकामना पूरी करें। जय दीनानाथ!',
    timestamp: '2 घंटे पूर्व',
    diyasCount: 96
  },
  {
    id: 's3',
    name: 'प्रियंका सिंह',
    city: 'वाराणसी, उत्तर प्रदेश',
    category: 'मनोकामना पूर्ति',
    message: 'गंगा किनारे संध्या अर्घ्य देने का सौभाग्य मिल रहा है। छठी मईया मेरे माता-पिता को दीर्घायु दें।',
    timestamp: '4 घंटे पूर्व',
    diyasCount: 182
  },
  {
    id: 's4',
    name: 'अमरनाथ मिश्रा',
    city: 'रांची, झारखंड',
    category: 'विश्व शांति',
    message: 'हे भगवान भास्कर! समस्त संसार में सुख, शांति और उत्तम स्वास्थ्य का प्रकाश फैलाएं।',
    timestamp: 'कल संध्या',
    diyasCount: 64
  }
];

export const SankalpWall: React.FC = () => {
  const { t } = useLanguage();
  const { ringBell } = useAudio();

  const [sankalps, setSankalps] = useState<Sankalp[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_sankalp_wall_items');
      return saved ? JSON.parse(saved) : INITIAL_SANKALPS;
    } catch {
      return INITIAL_SANKALPS;
    }
  });

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('परिवार आरोग्य');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('chhath_sankalp_wall_items', JSON.stringify(sankalps));
    } catch {}
  }, [sankalps]);

  const handleAddSankalp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newS: Sankalp = {
      id: Date.now().toString(),
      name: name.trim(),
      city: city.trim() || 'भारत',
      category,
      message: message.trim(),
      timestamp: 'अभी-अभी',
      diyasCount: 1
    };

    setSankalps([newS, ...sankalps]);
    setName('');
    setCity('');
    setMessage('');
    setSubmitted(true);
    ringBell();
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleLightDiya = (id: string) => {
    ringBell();
    setSankalps(prev =>
      prev.map(item =>
        item.id === id ? { ...item, diyasCount: item.diyasCount + 1 } : item
      )
    );
  };

  const categories = ['all', 'परिवार आरोग्य', 'संतान सुख', 'मनोकामना पूर्ति', 'विश्व शांति'];

  const filtered = sankalps.filter(
    s => selectedCat === 'all' || s.category === selectedCat
  );

  return (
    <section id="sankalp-wall" className="section-padding relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      
      <div className="container-custom relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-royal swarna-gold-sheen">
            <Flame className="w-3.5 h-3.5 text-yellow-300 animate-diya-flicker" />
            <span>सामुदायिक आस्था पट्टिका • COMMUNITY PRAYER WALL</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-100 gold-foil-text">
            डिजिटल छठ मन्नत व संकल्प पट्टिका
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-300">
            छठी मईया के चरणों में अपनी मन्नत, प्रार्थना या कृतज्ञता अर्पित करें और अन्य श्रद्धालुओं की प्रार्थना पर दीपक जलाकर आशीष दें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Left Column: Post Your Mannat Form */}
          <div className="royal-card-luxury p-6 sm:p-7 rounded-3xl border-amber-400/40 shadow-2xl">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-amber-500/25">
              <PlusCircle className="w-5 h-5 text-amber-300" />
              <h3 className="font-rozha text-xl text-stone-100 font-bold">
                अपनी मन्नत / संकल्प लिखें
              </h3>
            </div>

            <form onSubmit={handleAddSankalp} className="space-y-4 font-mukta">
              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">
                  आपका शुभ नाम *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. आरती देवी / राहुल मिश्रा"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">
                  शहर / राज्य
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="उदा. पटना, बिहार या मुंबई"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">
                  प्रार्थना श्रेणी
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="परिवार आरोग्य">परिवार आरोग्य व सुख</option>
                  <option value="संतान सुख">संतान सुख व रक्षा</option>
                  <option value="मनोकामना पूर्ति">मनोकामना पूर्ति व मन्नत</option>
                  <option value="विश्व शांति">विश्व शांति व सद्भाव</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">
                  आपकी पावन प्रार्थना / मन्नत *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="हे छठी मईया!..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-royal-gold py-3 text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>पट्टिका पर मन्नत अर्पित करें</span>
              </button>

              {submitted && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>आपकी मन्नत श्रद्धापूर्वक पट्टिका पर जोड़ दी गई है! जय छठी मईया।</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Live Prayers Grid & Filters */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCat === cat
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 shadow-md ring-1 ring-yellow-300'
                      : 'bg-stone-900/80 text-stone-300 border border-amber-500/25 hover:border-amber-400'
                  }`}
                >
                  {cat === 'all' ? 'समस्त मन्नतें' : cat}
                </button>
              ))}
            </div>

            {/* Prayers Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-1">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="royal-card-luxury p-5 rounded-2xl border-amber-500/30 flex flex-col justify-between hover:border-amber-400 transition-all group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
                        {s.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mukta">{s.timestamp}</span>
                    </div>

                    <p className="font-mukta text-sm text-stone-200 leading-relaxed italic">
                      "{s.message}"
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-amber-500/20 flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-stone-100 block font-mukta">{s.name}</strong>
                      <span className="text-[11px] text-amber-400/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{s.city}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleLightDiya(s.id)}
                      title="दीपक जलाकर आशीर्वाद दें (Bless with Diya)"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 group/btn"
                    >
                      <span className="text-base group-hover/btn:animate-diya-flicker">🪔</span>
                      <span>{s.diyasCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
