import React, { useState } from 'react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Clock, Calendar, User, ArrowRight, X, Share2 } from 'lucide-react';
import { BlogPost } from '../../types';

export const BlogSection: React.FC = () => {
  const { t } = useLanguage();
  const { blogs } = useChhathData();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleShare = (post: BlogPost) => {
    const text = `📖 *${post.title}*\n\n${post.excerpt}\n\nलेखक: ${post.author}\nपूरा लेख पढ़ें: https://chhathmahaparv.org`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="blog" className="section-padding bg-gradient-to-b from-transparent via-amber-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <BookOpen className="w-3.5 h-3.5" />
            <span>सांस्कृतिक अनुसंधान एवं आलेख</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.blogTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            छठ के वैज्ञानिक, पर्यावरणीय, सामाजिक और संगीतमय पहलुओं पर विद्वानों के शोधपूर्ण आलेख।
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {blogs.map((post) => (
            <div
              key={post.id}
              className="chhath-card overflow-hidden flex flex-col justify-between group border-amber-500/20 hover:border-amber-500/40"
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 text-amber-300 text-[10px] font-bold backdrop-blur-sm border border-amber-500/30">
                    {post.category}
                  </span>
                </div>

                <div className="p-4 font-mukta space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>

                  <h3 className="font-mukta font-bold text-base text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-amber-500/10 flex items-center justify-between font-mukta">
                <span className="text-[11px] text-stone-500 truncate max-w-[130px]">
                  {post.author}
                </span>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-xs font-bold text-orange-600 dark:text-amber-400 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>पढ़ें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Full Article Reader Modal */}
        {selectedPost && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedPost(null)}
          >
            <div 
              className="relative max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/40 font-mukta space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-amber-500/20 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400">
                    {selectedPost.category} • {selectedPost.readTime} पठन
                  </span>
                  <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {selectedPost.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-2">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-orange-500" /> {selectedPost.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-56 rounded-2xl overflow-hidden shadow">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="font-mukta text-stone-800 dark:text-stone-200 text-base leading-relaxed space-y-4 text-justify">
                <p className="font-semibold text-orange-800 dark:text-amber-300 italic bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  {selectedPost.excerpt}
                </p>
                <p>
                  {selectedPost.content}
                </p>
              </div>

              <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between">
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="btn-outline-gold text-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>यह आलेख शेयर करें</span>
                </button>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="btn-primary text-xs py-2 px-5"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
