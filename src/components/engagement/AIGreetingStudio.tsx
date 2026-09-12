import React, { useState } from 'react';
import { Sparkles, Copy, Share2, Check, Heart, Wand2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

type ToneOption = 'Emotional' | 'Traditional' | 'Short' | 'Devotional' | 'Family' | 'Lighthearted';

interface RelationTemplate {
  name: string;
  hindi: string;
}

const RELATIONSHIPS: RelationTemplate[] = [
  { name: 'Parents', hindi: 'माता-पिता' },
  { name: 'Friend', hindi: 'मित्र / सखा' },
  { name: 'Family', hindi: 'संपूर्ण परिवार' },
  { name: 'Spouse', hindi: 'जीवनसाथी' },
  { name: 'Elder / Guru', hindi: 'गुरुजन व आदरणीय' },
  { name: 'Children', hindi: 'पुत्र / पुत्री' }
];

export const AIGreetingStudio: React.FC = () => {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('माता-पिता');
  const [tone, setTone] = useState<ToneOption>('Devotional');
  const [generatedWish, setGeneratedWish] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const to = recipientName.trim() || 'प्रियजन';
    const from = senderName.trim() ? `— आपके अपने, ${senderName.trim()}` : '— जय छठी मईया 🙏';

    let wish = '';
    if (tone === 'Emotional') {
      wish = `आदरणीय ${to} जी,\n\nगंगा मइया के निर्मल जल और डूबते-उगते सूर्य देव की साक्षी में छठ का यह महापर्व आपके जीवन के समस्त कष्टों को हर ले। आपकी गोद, आपका आँगन और आपका हृदय सदा सुख, शांति और आरोग्य से भरा रहे। छठी मइया से यही विनम्र प्रार्थना है।\n\n${from}`;
    } else if (tone === 'Traditional') {
      wish = `जय छठी मईया!\n\nसदा सुहागन रहियौ, दूध-पूत से भरल संसार रहौ। छठी मईया के असीम अनुकम्पा से ${to} रउआ के घर-आँगन में सुख, समृद्धि आ शांति के अखंड दीप जरत रहे।\n\nउग हे सुरुज देव अरघ के रे बेर!\n\n${from}`;
    } else if (tone === 'Devotional') {
      wish = `ॐ सूर्याय नमः! ॐ ह्रीं षष्ठीदेव्यै नमः!\n\nप्रिय ${to} जी, भगवान भुवन भास्कर का तेजोमय प्रकाश आपके जीवन में ज्ञान, आरोग्य और सफलता का संचार करे। छठ के पावन संध्या व उषा अर्घ्य का पुण्य आपको व आपके सकल परिवार को प्राप्त हो।\n\n${from}`;
    } else if (tone === 'Family') {
      wish = `प्रिय ${to},\n\nदउरा-सूप के साथ घाट पर एक साथ अर्घ्य देने का आनंद और घर पर मिट्टी के चूल्हे पर बने ठेकुआ की मिठास हमारे पारिवारिक प्रेम को और प्रगाढ़ करे। छठी मईया हमारे पूरे परिवार को एक सूत्र में बांधे रखें।\n\nछठ महापर्व की हार्दिक बधाई!\n\n${from}`;
    } else if (tone === 'Short') {
      wish = `जय छठी मईया! 🌅\nप्रिय ${to}, छठ महापर्व की कोटि-कोटि मंगलकामनाएं। सूर्य देव आपको दीर्घायु, उत्तम स्वास्थ्य व अटूट ऐश्वर्य प्रदान करें।\n\n${from}`;
    } else {
      // Lighthearted
      wish = `अरे ${to}! सुनिए जी,\n\nछठ आ गया है, घाट पर सूप सजाने से लेकर ठेकुआ की चोरी-छिपे पहरेदारी तक का समय आ गया है! छठी मईया आपको बहुत सारी खुशियाँ दें और आपका ठेकुआ का कोटा कभी खत्म न हो!\n\nHappy Chhath Puja! 🍪\n\n${from}`;
    }

    setGeneratedWish(wish);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#ea580c', '#e11d48']
    });
  };

  const handleCopy = () => {
    if (!generatedWish) return;
    navigator.clipboard.writeText(generatedWish);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!generatedWish) return;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedWish)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="ai-greeting-generator" className="section-padding relative overflow-hidden bg-stone-50 dark:bg-stone-900/60 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>एआई शुभकामना सृजन (AI Wishes Studio)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            AI से अपनी छठ शुभकामना बनाएं ✨
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            माता-पिता, मित्र या परिवार के लिए मनचाहे भाव (भावुक, पारंपरिक, भक्तिमय) में तुरंत व्यक्तिगत बधाई संदेश तैयार करें।
          </p>
        </div>

        {/* Studio Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (5 cols) */}
          <form onSubmit={handleGenerate} className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-800/90 border border-amber-500/30 shadow-xl space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                १. शुभकामना पाने वाले का नाम (Recipient Name):
              </label>
              <input
                type="text"
                placeholder="उदा. माँ और पिताजी, रोहन भैया..."
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                २. संबंध (Relationship):
              </label>
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {RELATIONSHIPS.map(r => (
                  <option key={r.name} value={r.hindi}>
                    {r.hindi} ({r.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                ३. आपका नाम (Your Name):
              </label>
              <input
                type="text"
                placeholder="उदा. आपका प्यारा बेटा विकास..."
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1.5">
                ४. भाव व शैली (Tone):
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Devotional', 'Emotional', 'Traditional', 'Family', 'Short', 'Lighthearted'] as ToneOption[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-mukta font-semibold border transition-all ${
                      tone === t
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {t === 'Devotional' && 'भक्तिमय'}
                    {t === 'Emotional' && 'भावुक (Emotional)'}
                    {t === 'Traditional' && 'पारंपरिक ठेठ'}
                    {t === 'Family' && 'पारिवारिक'}
                    {t === 'Short' && 'संक्षिप्त (Short)'}
                    {t === 'Lighthearted' && 'उत्साह व खुशी'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-rozha text-sm sm:text-base font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 text-stone-950 shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>AI शुभकामना तैयार करें</span>
            </button>
          </form>

          {/* Result Box (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/30 shadow-xl flex flex-col justify-between min-h-[380px] paramprik-border relative">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400">
                  ✨ जनरेट किया गया व्यक्तिगत संदेश
                </span>
                <span className="text-xs text-stone-400 font-mukta">शैली: {tone}</span>
              </div>

              {generatedWish ? (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-stone-800 dark:text-stone-100 font-mukta text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {generatedWish}
                </div>
              ) : (
                <div className="text-center py-16 text-stone-400 space-y-2">
                  <Sparkles className="w-10 h-10 text-amber-400 mx-auto opacity-50 animate-pulse" />
                  <p className="font-mukta text-sm">
                    बाईं ओर विवरण दर्ज करें और <strong>"AI शुभकामना तैयार करें"</strong> पर क्लिक करें।
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            {generatedWish && (
              <div className="pt-4 mt-6 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-700 hover:bg-amber-500/20 text-stone-800 dark:text-stone-200 border border-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-green-600 hover:bg-green-500 text-white shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp शेयर</span>
                  </button>
                </div>

                <a
                  href="#greeting-card"
                  className="text-xs font-bold text-orange-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>इस संदेश का डिजिटल कार्ड बनाएं</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
