import React, { useState } from 'react';
import { ShoppingBag, Tag, Sparkles, Check, Info, Store } from 'lucide-react';
import { ShoppingSamagriItem } from '../../types';

const SHOPPING_ITEMS: ShoppingSamagriItem[] = [
  {
    id: 'shop-1',
    name: 'Handcrafted Bamboo Daura (दउरा)',
    hindiName: 'हस्तनिर्मित बांस का दउरा',
    category: 'Bamboo',
    recommendedPriceRange: '₹150 - ₹250',
    significance: 'समस्त फलों व अर्घ्य सूप को गंगा तट तक ले जाने वाला मुख्य पवित्र पात्र।',
    procurementTip: 'बांस नया, बिना कीड़ा लगा और बिना गांठ टूटा हुआ होना चाहिए। स्थानीय बुनकरों से ही खरीदें।'
  },
  {
    id: 'shop-2',
    name: 'Natural Bamboo / Brass Sup (सूप)',
    hindiName: 'पीतल अथवा बांस का सूप',
    category: 'Bamboo',
    recommendedPriceRange: '₹60 - ₹120 (बांस) / ₹400 - ₹800 (पीतल)',
    significance: 'प्रत्यक्ष सूर्य को फल, ठेकुआ व सिन्दूर अर्पित करने हेतु प्रयुक्त पावन अर्घ्य थाल।',
    procurementTip: 'सूप में कहीं भी छिद्र या दरार नहीं होनी चाहिए।'
  },
  {
    id: 'shop-3',
    name: 'Organic Clay Diyas & Kalash (मिट्टी के दीये व कलश)',
    hindiName: 'पंचतत्व मिट्टी के दीये व कलश',
    category: 'Earthen',
    recommendedPriceRange: '₹50 - ₹100 (50 दीयों का सेट)',
    significance: 'घाट पर अखंड दीप जलाने और कलश में गंगाजल भरकर अर्घ्य देने हेतु।',
    procurementTip: 'बिना रंग-रोगन वाले शुद्ध कुम्हार के चाक पर बने नए कच्चे दीये ही सात्विक माने जाते हैं।'
  },
  {
    id: 'shop-4',
    name: 'Pure Cotton Yellow/Orange Dhoti & Saree',
    hindiName: 'सात्विक सूती पीतांबरी / लाल साड़ी व धोती',
    category: 'Clothing',
    recommendedPriceRange: '₹300 - ₹700',
    significance: 'सूर्य उपासना में पीला व केसरिया रंग तेज और आरोग्य का प्रतीक है।',
    procurementTip: '१००% शुद्ध खादी अथवा सूती वस्त्र ही चुनें, जिसमें किसी प्रकार का सिंथेटिक या चमकीला प्लास्टिक धागा न हो।'
  },
  {
    id: 'shop-5',
    name: 'Desi Cow Ghee & Sugarcane (शुद्ध घी व ईख)',
    hindiName: 'देशी गाय का घी व 4 गांठदार ईख (गन्ना)',
    category: 'Prasad Raw',
    recommendedPriceRange: '₹650 - ₹850/किलो (घी) / ₹100 - ₹200 (गन्ना)',
    significance: 'महाप्रसाद ठेकुआ तलने और सूर्य मंडप सजाने की अनिवार्य सामग्री।',
    procurementTip: 'ईख ऊपर से पत्तियों सहित ताजी हरी होनी चाहिए।'
  }
];

export const ShoppingGuide: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filtered = selectedCat === 'All'
    ? SHOPPING_ITEMS
    : SHOPPING_ITEMS.filter(i => i.category === selectedCat);

  return (
    <section id="shopping-guide" className="section-padding relative overflow-hidden bg-white dark:bg-stone-900 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>सात्विक खरीदारी संदर्शिका (Chhath Shopping Guide)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            छठ सामग्री बाजार व खरीदारी गाइड 🛍️
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            बांस का दउरा, सूप, मिट्टी के दीये, पीतांबरी वस्त्र व प्रसाद की शुद्धता परखने के नियम और उचित मूल्य बेंचमार्क।
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Bamboo', 'Earthen', 'Clothing', 'Prasad Raw'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-500/20'
              }`}
            >
              {cat === 'All' ? 'समस्त सामग्री' : cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/80 border border-amber-500/25 shadow-lg hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-green-600 dark:text-green-400">
                    उचित मूल्य: {item.recommendedPriceRange}
                  </span>
                </div>

                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-stone-100">
                  {item.hindiName}
                </h3>
                <span className="text-xs text-stone-500 block font-mukta">{item.name}</span>

                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  <strong>महत्व:</strong> {item.significance}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mukta text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>खरीदारी टिप:</strong> {item.procurementTip}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Local Artisan Support Note */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center text-xs font-mukta text-stone-700 dark:text-stone-300 max-w-2xl mx-auto">
          ❤️ <strong>लोकल कारीगरों का सम्मान:</strong> छठ पर्व पर बांस के दउरा व मिट्टी के दीये बनाने वाले स्थानीय बुनकरों व कुम्हारों से बिना मोलभाव किए खरीदारी करें, यही इस पर्व की असली सामाजिक समरसता है।
        </div>

      </div>
    </section>
  );
};
