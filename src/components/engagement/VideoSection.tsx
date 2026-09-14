import React, { useState } from 'react';
import { Play, Video, Film, ExternalLink } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

interface VideoItem {
  id: string;
  title: string;
  category: 'Chhath Songs' | 'Puja Vidhi' | 'Recipes' | 'Ghat Videos' | 'Documentary';
  duration: string;
  creator: string;
  embedId: string;
  thumbnail: string;
  description: string;
}

export const VideoSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  const videos: VideoItem[] = [
    {
      id: "vid-1",
      title: "पद्मभूषण शारदा सिन्हा — छठ महापर्व के अमर पारंपरिक लोकगीत",
      category: "Chhath Songs",
      duration: "14:20",
      creator: "T-Series Bhakti Sagar",
      embedId: "qZ16qN-Y76k",
      thumbnail: "/images/hero_sunrise.jpg",
      description: "काँच ही बाँस के बहँगिया, केरवा जे फरेला घवद से — संपूर्ण अमर संकलन।"
    },
    {
      id: "vid-2",
      title: "पारंपरिक छठ पूजा की प्रामाणिक विधि एवं नियम",
      category: "Puja Vidhi",
      duration: "18:45",
      creator: "संस्कृति ज्ञान दर्शन",
      embedId: "vBvH2M_WjN0",
      thumbnail: "/images/sandhya_arghya.jpg",
      description: "नहाय-खाय से पारण तक व्रती के लिए आवश्यक विधि-विधान एवं अर्घ्य समर्पण की पूरी प्रक्रिया।"
    },
    {
      id: "vid-3",
      title: "खस्ता बिहारी ठेकुआ बनाने का सबसे प्रामाणिक तरीका (काठ के सांचे पर)",
      category: "Recipes",
      duration: "11:10",
      creator: "Bihari Swad Rasoi",
      embedId: "mN28fJ0X-Qk",
      thumbnail: "/images/thekua_prasad.jpg",
      description: "देशी घी का सही मोयन, गुड़ का पानी और सांचे पर सही नक्काशी की संपूर्ण रेसिपी।"
    },
    {
      id: "vid-4",
      title: "पटना गंगा रिवरफ्रंट: 100+ घाटों पर संध्या अर्घ्य की अलौकिक ड्रोन झलकियां",
      category: "Ghat Videos",
      duration: "08:35",
      creator: "Bihar Tourism",
      embedId: "tV98aK2M_Wp",
      thumbnail: "/images/daura_arghya.jpg",
      description: "दीघा से गायघाट तक लाखों श्रद्धालुओं की आस्था और जगमगाते दीपों का विहंगम दृश्य।"
    },
    {
      id: "vid-5",
      title: "छठ: प्रकृति, समाज और सूर्य उपासना की वैदिक विरासत (डॉक्यूमेंट्री)",
      category: "Documentary",
      duration: "24:15",
      creator: "National Geographic India / Doordarshan",
      embedId: "dK91_bN7X4a",
      thumbnail: "/images/surya_chhathi_divine.jpg",
      description: "जाति-भेद रहित इस प्राचीन सौर उत्सव का समाजशास्त्रीय एवं पर्यावरणीय अध्ययन।"
    }
  ];

  const categories = ['All', 'Chhath Songs', 'Puja Vidhi', 'Recipes', 'Ghat Videos', 'Documentary'];

  const filteredVideos = videos.filter(
    v => activeCategory === 'All' || v.category === activeCategory
  );

  return (
    <section id="videos" className="section-padding bg-gradient-to-b from-transparent via-orange-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <Video className="w-3.5 h-3.5" />
            <span>दृश्य-श्रव्य संकलन (Video Showcase)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            छठ वीडियो एवं वृत्तचित्र 🎥
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            छठ गीतों के आधिकारिक वीडियो, विधि, घाट के विहंगम दृश्य एवं प्रामाणिक वृत्तचित्र।
          </p>
        </div>

        {/* Category Filter Pills */}
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
              {cat === 'All' ? 'सभी वीडियो (All)' : cat}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="chhath-card overflow-hidden flex flex-col justify-between group border-amber-500/20 hover:border-amber-500/40"
            >
              <div>
                {/* Thumbnail with Play Icon */}
                <div 
                  className="h-48 relative overflow-hidden bg-stone-900 cursor-pointer"
                  onClick={() => setPlayingVideo(video)}
                >
                  <img
                    src={getImageUrl(video.thumbnail)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => handleImageError(e, '/images/hero_sunrise.jpg')}
                  />
                  <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                    {video.duration}
                  </span>

                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    {video.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 font-mukta space-y-2">
                  <h3 className="font-mukta font-bold text-base text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    स्रोत / प्रस्तुति: <strong className="text-amber-700 dark:text-amber-400">{video.creator}</strong>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setPlayingVideo(video)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-orange-700 dark:text-amber-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>वीडियो देखें (Watch Video)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {playingVideo && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in"
            onClick={() => setPlayingVideo(null)}
          >
            <div 
              className="relative max-w-3xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl p-6 font-mukta"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                    {playingVideo.category} • {playingVideo.creator}
                  </span>
                  <h3 className="font-mukta font-bold text-lg text-white">
                    {playingVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="text-stone-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Simulated Responsive Video Frame */}
              <div className="my-4 aspect-video rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center relative border border-stone-800">
                <img 
                  src={getImageUrl(playingVideo.thumbnail)} 
                  alt={playingVideo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30" 
                  onError={(e) => handleImageError(e, '/images/hero_sunrise.jpg')}
                />
                <div className="relative z-10 text-center space-y-3 p-4">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl mx-auto">
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  </div>
                  <h4 className="text-white font-bold text-base max-w-md">
                    {playingVideo.title}
                  </h4>
                  <p className="text-xs text-stone-300">
                    यह वीडियो छठ महापर्व के आधिकारिक सांस्कृतिक संग्रह से संबंधित है।
                  </p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(playingVideo.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5"
                  >
                    <span>YouTube पर देखें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="text-xs text-stone-400">
                {playingVideo.description}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
