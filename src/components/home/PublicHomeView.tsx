import React from 'react';
import { HeroSection } from '../hero/HeroSection';
import { ArghyaTimeCalc } from '../astronomy/ArghyaTimeCalc';
import { FourDaysTimeline } from '../timeline/FourDaysTimeline';
import { SamagriChecklist } from '../vidhi/SamagriChecklist';
import { GhatFinder } from '../ghats/GhatFinder';
import { GhatSafetySection } from '../ghats/GhatSafetySection';
import { PrasadSection } from '../prasad/PrasadSection';
import { MantraAarti } from '../spiritual/MantraAarti';
import { SongsSection } from '../audio/SongsSection';
import { MyFirstChhath } from '../beginner/MyFirstChhath';
import {
  Sun,
  Calendar,
  CheckSquare,
  MapPin,
  Utensils,
  Music,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  Users
} from 'lucide-react';

interface PublicHomeViewProps {
  onNavigate: (tab: string) => void;
}

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({ onNavigate }) => {
  const utilityCards = [
    {
      id: 'arghya',
      title: 'आज का अर्घ्य समय',
      desc: 'सूर्यास्त एवं सूर्योदय का सटीक स्थानीय समय व खगोलीय गणना।',
      icon: Sun,
      color: 'from-amber-500/20 to-orange-500/20',
      badge: 'समय'
    },
    {
      id: 'guide',
      title: 'चार दिन की पूजा गाइड',
      desc: 'नहाय-खाय, खरना, संध्या व उषा अर्घ्य के पावन नियम।',
      icon: Calendar,
      color: 'from-orange-500/20 to-amber-500/20',
      badge: 'नियम'
    },
    {
      id: 'samagri',
      title: 'सामग्री सूची',
      desc: 'दउरा, सूप, फल, ठेकुआ व पूजा सामग्री की चेकलिस्ट।',
      icon: CheckSquare,
      color: 'from-yellow-500/20 to-amber-500/20',
      badge: 'चेकलिस्ट'
    },
    {
      id: 'ghats',
      title: 'पास के घाट',
      desc: 'नजदीकी पवित्र घाट, पार्किंग सुविधा व भीड़ सुरक्षा गाइड।',
      icon: MapPin,
      color: 'from-amber-500/20 to-yellow-500/20',
      badge: 'घाट'
    },
    {
      id: 'prasad',
      title: 'प्रसाद व रेसिपी',
      desc: 'सात्विक ठेकुआ, कसार व छठ रेसिपी बनाने की सरल विधि।',
      icon: Utensils,
      color: 'from-orange-500/20 to-red-500/20',
      badge: 'रेसिपी'
    },
    {
      id: 'aarti',
      title: 'मंत्र, आरती व गीत',
      desc: 'पारंपरिक छठ गीत, सूर्य मंत्र, स्तोत्र एवं पवित्र आरती।',
      icon: Music,
      color: 'from-amber-500/20 to-orange-500/20',
      badge: 'संगीत'
    }
  ];

  const sampleCommunityStories = [
    {
      id: '1',
      author: 'सुनीता देवी (पटना)',
      title: 'गंगा घाट की पावन संध्या आरती व दीप दान',
      time: '2 घंटे पहले',
      image: '/images/hero_sunrise.jpg'
    },
    {
      id: '2',
      author: 'राजेश सिंह (मुजफ्फरपुर)',
      title: 'घर के आँगन में पारंपरिक ठेकुआ प्रसाद निर्माण',
      time: '5 घंटे पहले',
      image: '/images/hero_sunrise.jpg'
    },
    {
      id: '3',
      author: 'अंजली गुप्ता (वाराणसी)',
      title: 'परिवार के साथ दउरा सजाने की सुंदर परंपरा',
      time: '1 दिन पहले',
      image: '/images/hero_sunrise.jpg'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Six Primary Utility Cards */}
      <section className="container-custom max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-amber-100">
            छठ पूजा 2026: मुख्य सेवाएं एवं गाइड
          </h2>
          <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300">
            आपकी पूजा की संपूर्ण तैयारी के लिए आवश्यक 6 मुख्य अनुभाग
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {utilityCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group p-6 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm hover:shadow-md hover:border-amber-400 text-left transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mukta font-bold text-[11px]">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold font-mukta text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>देखें</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Section Containers according to user choice */}

      {/* Today's Arghya Details */}
      <section id="arghya" className="container-custom max-w-5xl mx-auto px-4 scroll-mt-24">
        <ArghyaTimeCalc />
      </section>

      {/* 4 Days Timeline */}
      <section id="guide" className="container-custom max-w-5xl mx-auto px-4 scroll-mt-24">
        <FourDaysTimeline />
      </section>

      {/* "पहली बार छठ?" Beginner Mode Section */}
      <section className="container-custom max-w-5xl mx-auto px-4">
        <MyFirstChhath />
      </section>

      {/* Puja Samagri Checklist */}
      <section id="samagri" className="container-custom max-w-5xl mx-auto px-4 scroll-mt-24">
        <SamagriChecklist />
      </section>

      {/* Nearby Ghats */}
      <section id="ghats" className="container-custom max-w-5xl mx-auto px-4 scroll-mt-24">
        <GhatFinder />
      </section>

      {/* Prasad & Recipes */}
      <section id="prasad" className="container-custom max-w-5xl mx-auto px-4 scroll-mt-24">
        <PrasadSection />
      </section>

      {/* Mantra & Aarti & Songs */}
      <section id="aarti" className="container-custom max-w-5xl mx-auto px-4 scroll-mt-24 space-y-8">
        <MantraAarti />
        <SongsSection />
      </section>

      {/* 4. Trust & Safety Section */}
      <section className="container-custom max-w-5xl mx-auto px-4">
        <GhatSafetySection />

        {/* Data Source & Last Updated Box */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400 font-mukta">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>विश्वसनीय स्रोत:</strong> दृक् पंचांग एवं क्षेत्रीय खगोलीय वेधशाला आंकड़े • अंतिम अद्यतन: सितंबर 2026
            </span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-500 font-mono">
            स्थानिक अक्षांश-रेखांश गणना आधारित
          </div>
        </div>
      </section>

      {/* 5. Community Preview (Maximum 3 posts) */}
      <section className="container-custom max-w-5xl mx-auto px-4">
        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span>श्रद्धालु अनुभव व संस्मरण</span>
              </h3>
              <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                समुदाय से चुनिंदा पावन क्षण (Community Highlights)
              </p>
            </div>

            <button
              onClick={() => onNavigate('explore')}
              className="px-4 py-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta flex items-center gap-1.5 transition-all"
            >
              <span>सभी देखें (Explore)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sampleCommunityStories.map((story) => (
              <div
                key={story.id}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/15 space-y-2.5 shadow-sm"
              >
                <div className="text-[11px] font-bold font-mukta text-amber-700 dark:text-amber-400">
                  {story.author} • {story.time}
                </div>
                <h4 className="font-rozha text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-2">
                  {story.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
