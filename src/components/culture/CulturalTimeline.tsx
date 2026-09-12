import React from 'react';
import { History, Sparkles, BookOpen, Sun, Globe } from 'lucide-react';

interface EraItem {
  era: string;
  hindiTitle: string;
  type: 'Established History' | 'Puranic / Epic Tradition' | 'Cultural Evolution';
  description: string;
  historicalNote: string;
}

const TIMELINE_ERAS: EraItem[] = [
  {
    era: '१५०० ई.पू. — वैदिक काल (Vedic Origins)',
    hindiTitle: 'ऋग्वैदिक उषा व सूर्य आराधना',
    type: 'Established History',
    description: 'ऋग्वेद के प्रथम मंडल में भगवान सविता (सूर्य) एवं देवी उषा की स्तुतियों का विस्तार से वर्णन है। सूर्य को "जगत की आत्मा" (सूर्य आत्मा जगतस्तस्थुषश्च) मानकर नमन करने की परंपरा यहीं से प्रारंभ हुई।',
    historicalNote: 'ऋग्वेद में गायत्री मंत्र एवं आदित्य स्तुति सूर्य के प्रत्यक्ष ब्रह्म स्वरूप की साक्षी हैं।'
  },
  {
    era: 'महाभारत काल (Epic Era)',
    hindiTitle: 'सूर्यपुत्र कर्ण व महारानी द्रौपदी की साधना',
    type: 'Puranic / Epic Tradition',
    description: 'अंग देश (वर्तमान भागलपुर व मुंगेर, बिहार) के राजा कर्ण नित्य गंगाजल में कमर तक खड़े होकर भगवान सूर्य को अर्घ्य दिया करते थे। वहीं वनवास काल में द्रौपदी ने पांडवों के राज्य की पुनर्प्राप्ति हेतु धौम्य ऋषि के परामर्श पर सूर्य षष्ठी व्रत किया था।',
    historicalNote: 'महाभारत के वन पर्व में सूर्य आराधना एवं अक्षय पात्र प्राप्ति का विस्तृत आख्यान है।'
  },
  {
    era: 'रामायण काल (Ramayana Legend)',
    hindiTitle: 'माता सीता द्वारा मुंगेर गंगा तट पर छठ अनुष्ठान',
    type: 'Puranic / Epic Tradition',
    description: 'लंका विजय के उपरांत अयोध्या लौटने पर श्रीराम व माता सीता ने कुलगुरु वशिष्ठ के निर्देश पर मुद्गल ऋषि के आश्रम (वर्तमान मुंगेर, बिहार) में गंगा तट पर कार्तिक शुक्ल षष्ठी का पावन व्रत किया था।',
    historicalNote: 'मुंगेर में आज भी सीता कुंड और सीता चरण मंदिर इस सांस्कृतिक परंपरा का साक्ष्य प्रस्तुत करता है।'
  },
  {
    era: 'मध्यकाल से १९वीं सदी (Regional Folk Evolution)',
    hindiTitle: 'भोजपुरी व मैथिली लोकगीतों व प्रकृति पूजा का विकास',
    type: 'Cultural Evolution',
    description: 'बिना किसी पुरोहित या मूर्ति के केवल नदी, मिट्टी, बांस और प्रकृति के फल-अन्न से पूजा करने का यह स्वरूप बिहार, झारखंड और पूर्वी उत्तर प्रदेश में जन-आंदोलन बना। कांच ही बांस के बहंगिया जैसे अमर लोकगीतों ने इसे मौखिक परंपरा में जीवित रखा।',
    historicalNote: 'छठ की सबसे बड़ी विशिष्टता सामाजिक समानता है, जहाँ धनी-निर्धन सभी एक ही घाट पर एक जैसे सूप से अर्घ्य देते हैं।'
  },
  {
    era: '२१वीं सदी (Modern Global Diaspora)',
    hindiTitle: 'वैश्विक महापर्व: गंगा तट से टेम्स व हडसन तक',
    type: 'Cultural Evolution',
    description: 'आज छठ पर्व केवल भारत तक सीमित नहीं है। अमेरिका के न्यू जर्सी, लंदन की टेम्स नदी, दुबई, सिडनी और टोरंटो के भारतीय समुदाय अपनी जड़ों से जुड़कर पूरी निष्ठा के साथ सूर्य अर्घ्य अर्पित करते हैं।',
    historicalNote: 'छठ अब पर्यावरण संरक्षण, जल शुद्धि और वैश्विक सांस्कृतिक एकात्मता का प्रतीक बन चुका है।'
  }
];

export const CulturalTimeline: React.FC = () => {
  return (
    <section id="cultural-timeline" className="section-padding relative overflow-hidden bg-stone-50 dark:bg-stone-900 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>इतिहास व सांस्कृतिक विकास (Historical Evolution)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            छठ संस्कृति की ऐतिहासिक यात्रा 📜
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            ऋग्वैदिक सूर्य उपासना से लेकर महाभारत, रामायण और आज के २१वीं सदी के वैश्विक स्वरूप तक का प्रामाणिक कालक्रम।
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="relative border-l-2 border-amber-500/40 ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-10">
          {TIMELINE_ERAS.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 border-4 border-white dark:border-stone-900 shadow-md group-hover:scale-125 transition-transform" />

              <div className="p-6 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/25 shadow-lg hover:shadow-xl transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400 font-mono">
                    {item.era}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold self-start ${
                    item.type === 'Established History'
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                      : item.type === 'Puranic / Epic Tradition'
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                      : 'bg-green-500/15 text-green-700 dark:text-green-300'
                  }`}>
                    {item.type}
                  </span>
                </div>

                <h3 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {item.hindiTitle}
                </h3>

                <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-amber-500/15 text-[11px] font-mukta text-stone-500 dark:text-stone-400 italic">
                  📖 <strong>ऐतिहासिक संदर्भ:</strong> {item.historicalNote}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
