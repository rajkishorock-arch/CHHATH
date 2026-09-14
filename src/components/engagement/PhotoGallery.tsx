import React, { useState } from 'react';
import { Camera, X, ZoomIn, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Ghats' | 'Arghya' | 'Prasad' | 'Sunrise' | 'Devotion';
  src: string;
  caption: string;
}

export const PhotoGallery: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      title: "सूर्योदय व उषा अर्घ्य दर्शन",
      category: "Sunrise",
      src: "/images/hero_sunrise.jpg",
      caption: "पवित्र गंगाजल में खड़े होकर उदीयमान सूर्य नारायण को पहला अर्घ्य समर्पित करते श्रद्धालु।"
    },
    {
      id: "gal-2",
      title: "सूप में सजा पारंपरिक ठेकुआ महाप्रसाद",
      category: "Prasad",
      src: "/images/thekua_prasad.jpg",
      caption: "लकड़ी के सांचे से निर्मित सूर्य व पत्ते की छाप वाले खस्ता ठेकुआ और ऋतु फल।"
    },
    {
      id: "gal-3",
      title: "दीपमालिका से जगमगाता संध्या अर्घ्य घाट",
      category: "Ghats",
      src: "/images/sandhya_arghya.jpg",
      caption: "कार्तिक शुक्ल षष्ठी की शाम गंगा किनारे हजारों दीपकों के साथ संध्या अर्घ्य का दिव्य दृश्य।"
    },
    {
      id: "gal-4",
      title: "बांस का दउरा, सूप और ईख मंडप",
      category: "Arghya",
      src: "/images/daura_arghya.jpg",
      caption: "सुथनी, डाभा नींबू, केला, नारियल और गन्ने से सुसज्जित पावन बांस की टोकरी (दउरा)।"
    },
    {
      id: "gal-5",
      title: "सूर्य देव और मां षष्ठी की दिव्य अनुकम्पा",
      category: "Devotion",
      src: "/images/surya_chhathi_divine.jpg",
      caption: "सप्त-अश्व रथारूढ़ भगवान भास्कर और संतान-दायिनी षष्ठी देवी की आध्यात्मिक छवि।"
    },
    {
      id: "gal-6",
      title: "बाल वाटिका में छठ की लोक परंपरा",
      category: "Devotion",
      src: "/images/kids_chhath.jpg",
      caption: "नई पीढ़ी को प्रकृति प्रेम और पारिवारिक संस्कारों से जोड़ती बाल वाटिका चित्रमय प्रस्तुति।"
    }
  ];

  const categories = ['All', 'Sunrise', 'Prasad', 'Ghats', 'Arghya', 'Devotion'];

  const filteredItems = galleryItems.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <section id="gallery" className="section-padding bg-gradient-to-b from-transparent via-amber-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <Camera className="w-3.5 h-3.5" />
            <span>दिव्य दर्शन एवं झांकियां</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.galleryTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            घाटों की जगमगाहट, उषा की पहली किरण, सूप में सजा महाप्रसाद और आस्था के अद्वितीय क्षण।
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
              }`}
            >
              {cat === 'All' ? 'सभी चित्र (All)' : cat}
            </button>
          ))}
        </div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md cursor-pointer border border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1"
            >
              <img
                src={getImageUrl(item.src)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => handleImageError(e, item.src)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-amber-300" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white font-mukta space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-600 text-white inline-block">
                  {item.category}
                </span>
                <h3 className="font-rozha text-lg font-bold text-amber-300 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-200 line-clamp-1 opacity-90">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in"
            onClick={() => setLightboxImage(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-stone-950/80 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={getImageUrl(lightboxImage.src)}
                  alt={lightboxImage.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                  onError={(e) => handleImageError(e, lightboxImage.src)}
                />
              </div>

              <div className="p-6 font-mukta text-stone-100 space-y-2 bg-stone-900">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-600 text-white">
                    {lightboxImage.category}
                  </span>
                  <h3 className="font-rozha text-xl sm:text-2xl text-amber-400 font-bold">
                    {lightboxImage.title}
                  </h3>
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {lightboxImage.caption}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
