import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Heart, 
  Flame, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  Share2,
  ShieldCheck,
  FileText,
  Trash2,
  Flag
} from 'lucide-react';
import { LegalModals } from '../legal/LegalModals';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'deletion' | 'guidelines' | 'report' | null>(null);

  return (
    <footer className="relative bg-stone-950 text-stone-300 pt-16 pb-28 lg:pb-16 border-t border-amber-500/30 overflow-hidden">
      
      {/* Devotional Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand & Cultural Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌅</span>
              <div>
                <h3 className="font-rozha text-2xl text-amber-400 font-bold tracking-wide">
                  {t.siteTitle} | Chhath Mahaparv
                </h3>
                <p className="text-xs text-stone-400 font-mukta">
                  पावन आस्था एवं भक्ति डिजिटल सेवा
                </p>
              </div>
            </div>
            
            <p className="text-sm text-stone-400 font-mukta leading-relaxed">
              छठ महापर्व की संपूर्ण जानकारी, अर्घ्य समय, पावन विधि, गीत व घाट सुरक्षा निर्देश सर्व-सुलभ रूप से उपलब्ध।
            </p>

            <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-orange-500 shrink-0" />
              <span>स्रोत: दृक् पंचांग एवं स्थानिक खगोलीय गणना • अंतिम अपडेट: 2026</span>
            </div>
          </div>

          {/* Core Devotional Links */}
          <div>
            <h4 className="font-mukta font-bold text-stone-100 mb-4 text-base border-l-2 border-orange-500 pl-2">
              मुख्य अनुभाग
            </h4>
            <ul className="space-y-2 text-sm font-mukta text-stone-400 list-none p-0">
              <li><a href="/CHHATH/chhath-puja-vidhi/" className="hover:text-amber-400 transition-colors">छठ पूजा विधि 2026</a></li>
              <li><a href="/CHHATH/chhath-samagri/" className="hover:text-amber-400 transition-colors">छठ पूजा सामग्री सूची</a></li>
              <li><a href="/CHHATH/chhath-arghya-time-2026/" className="hover:text-amber-400 transition-colors">छठ अर्घ्य समय 2026</a></li>
              <li><a href="/CHHATH/thekua-recipe/" className="hover:text-amber-400 transition-colors">ठेकुआ प्रसाद रेसिपी</a></li>
              <li><a href="/CHHATH/chhath-puja-geet/" className="hover:text-amber-400 transition-colors">छठ पूजा के गीत 2026</a></li>
              <li><a href="/CHHATH/chhath-puja-katha/" className="hover:text-amber-400 transition-colors">छठ पूजा कथा 2026</a></li>
              <li><a href="#ghats" className="hover:text-amber-400 transition-colors">घाट एवं सुरक्षा निर्देश</a></li>
              <li><a href="#aarti" className="hover:text-amber-400 transition-colors">मंत्र, आरती व गीत</a></li>
            </ul>
          </div>

          {/* Legal & Safety Policies */}
          <div>
            <h4 className="font-mukta font-bold text-stone-100 mb-4 text-base border-l-2 border-amber-500 pl-2">
              सुरक्षा एवं कानूनी नीतियां
            </h4>
            <ul className="space-y-2.5 text-sm font-mukta text-stone-400 list-none p-0">
              <li>
                <button onClick={() => setLegalModal('privacy')} className="hover:text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>गोपनीयता नीति (Privacy Policy)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setLegalModal('guidelines')} className="hover:text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>समुदाय दिशा-निर्देश (Guidelines)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setLegalModal('deletion')} className="hover:text-amber-400 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>डेटा हटाएँ (Data Deletion)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setLegalModal('report')} className="hover:text-amber-400 flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-orange-400" />
                  <span>शिकायत करें (Report Content)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="font-mukta font-bold text-stone-100 mb-4 text-base border-l-2 border-red-500 pl-2">
              आपातकालीन हेल्पलाइन
            </h4>
            <div className="space-y-2 text-xs font-mukta text-stone-400">
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between">
                <span>राष्ट्रीय आपातकाल (Police / Help):</span>
                <span className="text-amber-400 font-bold text-sm">112</span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between">
                <span>एम्बुलेंस (Medical Help):</span>
                <span className="text-amber-400 font-bold text-sm">102 / 108</span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between">
                <span>आपदा प्रबंधन (SDRF):</span>
                <span className="text-amber-400 font-bold text-sm">1070</span>
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
            © 2026 छठ महापर्व। लोक सेवा एवं आस्था हेतु समर्पित सार्वजनिक मंच।
          </div>

          <div className="flex items-center gap-1">
            <span>समस्त व्रतियों एवं श्रद्धालुओं को सादर नमन</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>

      <LegalModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
      />
    </footer>
  );
};

