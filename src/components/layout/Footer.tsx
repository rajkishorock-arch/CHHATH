import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Heart, 
  Flame, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  Share2 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-stone-950 text-stone-300 pt-16 pb-28 lg:pb-16 border-t border-amber-500/30 overflow-hidden">
      
      {/* Devotional Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Cultural Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌅</span>
              <div>
                <h3 className="font-rozha text-2xl text-amber-400 font-bold tracking-wide">
                  {t.siteTitle} | Chhath Mahaparv
                </h3>
                <p className="text-xs text-stone-400 font-mukta">
                  {t.siteSubtitle}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-stone-400 font-mukta leading-relaxed">
              {t.footerAbout}
            </p>

            <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-orange-500 shrink-0" />
              <span>&ldquo;प्रकृति के कण-कण में साक्षात सूर्य नारायण और छठी मईया की कृपा व्याप्त है।&rdquo;</span>
            </div>

            {/* Social Share / Connect */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://wa.me/?text=जय%20छठी%20मईया!%20छठ%20महापर्व%20की%20संपूर्ण%20जानकारी%20देखें:%20https://chhathmahaparv.org" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                title="WhatsApp पर शेयर करें"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a 
                href="https://www.youtube.com/results?search_query=chhath+puja+geet" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-red-950 text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                title="YouTube छठ गीत"
              >
                <span className="text-xs font-bold">YT</span>
              </a>
              <a 
                href="https://www.instagram.com/explore/tags/chhathpuja/" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-pink-950 text-pink-400 border border-pink-500/30 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                title="Instagram छठ दर्शन"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
              <span className="text-xs text-stone-500 ml-2">#ChhathMahaparv2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mukta font-bold text-stone-100 mb-4 text-base border-l-2 border-orange-500 pl-2">
              {t.navTimeline}
            </h4>
            <ul className="space-y-2 text-sm font-mukta text-stone-400 list-none p-0">
              <li><a href="#timeline" className="hover:text-amber-400 transition-colors">{t.navTimeline}</a></li>
              <li><a href="#vidhi" className="hover:text-amber-400 transition-colors">{t.navVidhi}</a></li>
              <li><a href="#samagri" className="hover:text-amber-400 transition-colors">{t.navSamagri}</a></li>
              <li><a href="#arghya-times" className="hover:text-amber-400 transition-colors">{t.navArghya}</a></li>
              <li><a href="#prasad" className="hover:text-amber-400 transition-colors">{t.navPrasad}</a></li>
            </ul>
          </div>

          {/* Spiritual & Media Links */}
          <div>
            <h4 className="font-mukta font-bold text-stone-100 mb-4 text-base border-l-2 border-orange-500 pl-2">
              {t.navSongs}
            </h4>
            <ul className="space-y-2 text-sm font-mukta text-stone-400 list-none p-0">
              <li><a href="#songs" className="hover:text-amber-400 transition-colors">{t.navSongs}</a></li>
              <li><a href="#katha" className="hover:text-amber-400 transition-colors">{t.kathaTitle}</a></li>
              <li><a href="#mantras" className="hover:text-amber-400 transition-colors">{t.mantraTitle}</a></li>
              <li><a href="#wishes" className="hover:text-amber-400 transition-colors">{t.navWishes}</a></li>
              <li><a href="#quiz" className="hover:text-amber-400 transition-colors">{t.navQuiz}</a></li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="font-mukta font-bold text-stone-100 mb-4 text-base border-l-2 border-red-500 pl-2">
              आपातकालीन सहायता
            </h4>
            <div className="space-y-3 text-xs font-mukta text-stone-400">
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">राष्ट्रीय आपातकाल:</span>
                  <span className="text-amber-400 font-bold text-sm">112 / 100</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">पटना नियंत्रण कक्ष:</span>
                  <span className="text-amber-400">0612-2219810</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">SDRF जल गश्ती दल:</span>
                  <span className="text-amber-400">1070 / 1077</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-mukta">
          <div className="flex items-center gap-1 text-stone-400">
            <span>जय छठी मईया 🙏 सूर्य नारायणाय नमः</span>
          </div>
          
          <div>
            © 2026 छठ महापर्व (Chhath Mahaparv Digital Trust). सांस्कृतिक एवं जनसेवा हेतु समर्पित।
          </div>

          <div className="flex items-center gap-1">
            <span>बिहार, झारखंड व पूर्वांचल की पावन माटी को सादर नमन</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
