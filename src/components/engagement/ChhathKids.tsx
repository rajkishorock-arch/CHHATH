import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Sun, Heart, Cookie, Droplet, Star } from 'lucide-react';

export const ChhathKids: React.FC = () => {
  const { t } = useLanguage();

  const kidTopics = [
    {
      title: "1. छठ पूजा क्या है? (What is Chhath?)",
      icon: Sun,
      color: "text-amber-500",
      content: "छठ हमारी प्रकृति, सूरज दादा और साफ-सफाई का सबसे प्यारा त्योहार है! इसमें 4 दिनों तक पूरा परिवार मिलकर नदी किनारे जाता है और प्रकृति को 'थैंक यू' (धन्यवाद) कहता है।"
    },
    {
      title: "2. छठी मईया कौन हैं? (Who is Chhathi Maiya?)",
      icon: Heart,
      color: "text-red-500",
      content: "छठी मईया बच्चों की सबसे प्यारी और ममतामयी देवी हैं! वे सभी बच्चों की रक्षा करती हैं, उन्हें स्वस्थ रखती हैं और खूब सारा प्यार व आशीर्वाद देती हैं।"
    },
    {
      title: "3. सूरज दादा की पूजा क्यों करते हैं? (Why Sun is Worshipped?)",
      icon: Star,
      color: "text-orange-500",
      content: "सूरज दादा हमें रोशनी, गर्मी और ऊर्जा देते हैं, जिससे पेड़-पौधे उगते हैं और हम सब जीवित रहते हैं। इसलिए हम हाथ जोड़कर सूरज दादा को प्रणाम करते हैं।"
    },
    {
      title: "4. अर्घ्य क्या होता है? (What is Arghya?)",
      icon: Droplet,
      color: "text-sky-500",
      content: "बांस के सुंदर सूप में मीठे फल, गन्ना और नारियल रखकर पानी में खड़े होकर सूरज दादा को दूध और पानी चढ़ाने को 'अर्घ्य' कहते हैं।"
    },
    {
      title: "5. ठेकुआ क्या होता है? (What is Thekua?)",
      icon: Cookie,
      color: "text-amber-700",
      content: "ठेकुआ आटे और गुड़ से बनी एक बहुत ही क्रंची और स्वादिष्ट पारंपरिक कुकी (बिस्कुट) है, जिसे लकड़ी के सुंदर सांचे पर दबाकर बनाया जाता है!"
    }
  ];

  return (
    <section id="kids" className="section-padding bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>बाल वाटिका • नन्हे-मुन्नों के लिए छठ</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.kidsTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            सरल, रोचक और चित्रमय कहानियों के माध्यम से नई पीढ़ी को अपनी समृद्ध संस्कृति और प्रकृति-प्रेम से परिचित कराएं।
          </p>
        </div>

        {/* Illustrated Showcase Layout */}
        <div className="chhath-glass p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Illustrated Storybook Picture */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/40 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src="/images/kids_chhath.jpg"
                alt="Children celebrating Chhath"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="p-3 bg-white/90 dark:bg-stone-900/90 rounded-xl shadow border border-amber-500/20 text-center text-xs font-mukta font-bold text-amber-800 dark:text-amber-300 mt-3">
              &ldquo;सूरज दादा की किरणें चमकीं, घाट सजे दीपों से!&rdquo;
            </div>
          </div>

          {/* Right: Fun Explanations */}
          <div className="lg:col-span-7 space-y-3 font-mukta">
            {kidTopics.map((topic, idx) => {
              const Icon = topic.icon;

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500/40 shadow-sm transition-all space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${topic.color}`} />
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {topic.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-6">
                    {topic.content}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
