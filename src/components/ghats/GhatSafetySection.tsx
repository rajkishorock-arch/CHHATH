import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, MapPin, Users, HeartPulse, Car } from 'lucide-react';

export const GhatSafetySection: React.FC = () => {
  const emergencyContacts = [
    { label: 'पुलिस हेल्पलाइन (Police)', number: '112', icon: PhoneCall },
    { label: 'आपदा प्रबंधन (Disaster Management)', number: '1070', icon: AlertTriangle },
    { label: 'एम्बुलेंस / मेडिकल मदद (Ambulance)', number: '102 / 108', icon: HeartPulse },
    { label: 'घाट सुरक्षा कंट्रोल रूम', number: '0612-2219810', icon: ShieldCheck }
  ];

  const safetyGuidelines = [
    { title: 'भीड़ प्रबंधन एवं सुरक्षा', desc: 'घाट पर छोटे बच्चों की जेब में नाम व फोन नंबर की पर्ची अवश्य रखें। गहरे पानी की लाल चेतावनी रेखा पार न करें।', icon: Users },
    { title: 'पार्किंग व यातायात मार्ग', desc: 'प्रशासन द्वारा चिन्हित नो-व्हीकल जोन का पालन करें। नजदीकी अधिकृत पार्किंग स्थल का ही उपयोग करें।', icon: Car },
    { title: 'मेडिकल एवं स्वच्छता बूथ', desc: 'प्रत्येक मुख्य घाट पर 24x7 प्रथम उपचार सहायता बूथ व अस्थायी शौचालय उपलब्ध हैं।', icon: HeartPulse },
    { title: 'जल सुरक्षा व गोताखोर टीम', desc: 'एनडीआरएफ व एसडीआरएफ की मोटरबोट टीमें अर्घ्य समय में लगातार गश्त पर तैनात रहती हैं।', icon: ShieldCheck }
  ];

  return (
    <section className="py-12 bg-amber-500/5 border-y border-amber-500/20 rounded-3xl my-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>सत्यापित सुरक्षा एवं सहायता निर्देश</span>
          </div>
          <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-amber-100">
            घाट सुरक्षा एवं आपातकालीन हेल्पलाइन
          </h2>
          <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            प्रशासनिक निर्देशों एवं स्थानीय आपदा प्रबंधन टीम द्वारा जारी आधिकारिक दिशा-निर्देश
          </p>
        </div>

        {/* 4 Safety Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyGuidelines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">{item.title}</h3>
                  <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Contacts Ribbon */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-900 dark:text-amber-100">
          <div className="text-xs font-bold font-mukta uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-3 text-center sm:text-left">
            📞 24x7 आपातकालीन नंबर (Direct Emergency Numbers):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {emergencyContacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.number.split(' ')[0]}`}
                className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 flex items-center justify-between hover:border-amber-400 text-decoration-none transition-all"
              >
                <div>
                  <div className="text-xs font-mukta text-stone-600 dark:text-stone-400 font-semibold">{contact.label}</div>
                  <div className="text-sm font-mono font-bold text-amber-700 dark:text-amber-300">{contact.number}</div>
                </div>
                <contact.icon className="w-4 h-4 text-amber-600" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
