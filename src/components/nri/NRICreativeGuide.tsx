import React, { useState } from 'react';
import { Globe, MapPin, Clock, Sun, Sunset, Sunrise, Building2, Info, Compass } from 'lucide-react';

interface DiasporaHub {
  country: string;
  flag: string;
  city: string;
  communityName: string;
  locationVenue: string;
  timeZone: string;
  sandhyaSunsetLocal: string;
  ushaSunriseLocal: string;
  indoorArghyaTip: string;
}

const DIASPORA_HUBS: DiasporaHub[] = [
  {
    country: 'USA',
    flag: '🇺🇸',
    city: 'New Jersey / New York',
    communityName: 'Bihar Jharkhand Association of North America (BJANA)',
    locationVenue: 'Monroe Township Lake / Papaianni Park Edison',
    timeZone: 'EST (UTC-5)',
    sandhyaSunsetLocal: '4:42 PM (15 Nov)',
    ushaSunriseLocal: '6:48 AM (16 Nov)',
    indoorArghyaTip: 'यदि ठंड या स्थानीय नियमों के कारण झील पर जाना संभव न हो, तो बालकनी अथवा धूप वाली खिड़की के पास तांबे या पीतल के बड़े बर्तन (परात) में गंगाजल मिलाकर अर्घ्य दें।'
  },
  {
    country: 'USA',
    flag: '🇺🇸',
    city: 'California (Bay Area)',
    communityName: 'Bay Area Prabasi Community',
    locationVenue: 'Coyote Point Park Beach, San Mateo',
    timeZone: 'PST (UTC-8)',
    sandhyaSunsetLocal: '4:58 PM (15 Nov)',
    ushaSunriseLocal: '6:52 AM (16 Nov)',
    indoorArghyaTip: 'कैलिफोर्निया में सार्वजनिक उद्यानों में खुले में अर्घ्य देने हेतु पूर्व अनुमति आवश्यक हो सकती है।'
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    city: 'London',
    communityName: 'UK Bihar Foundation & Maurya Pariwar UK',
    locationVenue: 'Thames Riverside Community / Hounslow Mandir Grounds',
    timeZone: 'GMT (UTC+0)',
    sandhyaSunsetLocal: '4:11 PM (15 Nov)',
    ushaSunriseLocal: '7:22 AM (16 Nov)',
    indoorArghyaTip: 'लंदन की ठंडी हवाओं से बचने हेतु इनडोर हीटर वाले प्रांगण या अस्थायी जलकुंड में सूप अर्पण करें।'
  },
  {
    country: 'UAE',
    flag: '🇦🇪',
    city: 'Dubai',
    communityName: 'UAE Chhath Seva Samiti',
    locationVenue: 'Al Mamzar Beach Park / Hindu Temple Bur Dubai',
    timeZone: 'GST (UTC+4)',
    sandhyaSunsetLocal: '5:33 PM (15 Nov)',
    ushaSunriseLocal: '6:41 AM (16 Nov)',
    indoorArghyaTip: 'दुबई के समुद्र तटों पर अनुमति अनुसार शांतिपूर्वक अर्घ्य दिया जाता है।'
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    city: 'Toronto (GTA)',
    communityName: 'Canada Bihar Association',
    locationVenue: 'Bluffer\'s Park Beach / Hindu Heritage Centre',
    timeZone: 'EST (UTC-5)',
    sandhyaSunsetLocal: '4:48 PM (15 Nov)',
    ushaSunriseLocal: '7:15 AM (16 Nov)',
    indoorArghyaTip: 'कनाडा में शून्य से नीचे तापमान होने पर इनडोर बैकयार्ड या पोर्टेबल टब में अर्घ्य समर्पण किया जाता है।'
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    city: 'Sydney',
    communityName: 'Bihari Diaspora of Australia (BDA)',
    locationVenue: 'Parramatta River Park / Blacktown Lake Grounds',
    timeZone: 'AEDT (UTC+11)',
    sandhyaSunsetLocal: '7:42 PM (15 Nov)',
    ushaSunriseLocal: '5:49 AM (16 Nov)',
    indoorArghyaTip: 'ऑस्ट्रेलिया में नवंबर में ग्रीष्म ऋतु होती है, अतः नदी तट पर अर्घ्य अत्यंत सुगम होता है।'
  }
];

export const NRICreativeGuide: React.FC = () => {
  const [selectedHubIdx, setSelectedHubIdx] = useState(0);
  const hub = DIASPORA_HUBS[selectedHubIdx];

  return (
    <section id="nri-chhath" className="section-padding relative overflow-hidden bg-white dark:bg-stone-900 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>वैश्विक छठ निर्देशिका (Chhath for NRIs & Global Diaspora)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            सात समंदर पार छठ महापर्व 🌎
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            अमेरिका, लंदन, दुबई, कनाडा व ऑस्ट्रेलिया में रहने वाले प्रवासी व्रतियों हेतु स्थानीय समय पर अर्घ्य व इनडोर पूजा विधान।
          </p>
        </div>

        {/* Country Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {DIASPORA_HUBS.map((h, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedHubIdx(idx)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedHubIdx === idx
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-500/20'
              }`}
            >
              <span>{h.flag}</span>
              <span>{h.city}</span>
            </button>
          ))}
        </div>

        {/* Selected Hub Details Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-stone-50 dark:bg-stone-800/80 border border-amber-500/30 shadow-2xl space-y-6 paramprik-border">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-500/20 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400">
                {hub.country} • {hub.timeZone}
              </span>
              <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {hub.flag} {hub.city}
              </h3>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                समुदाय आयोजक: {hub.communityName}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{hub.locationVenue}</span>
            </div>
          </div>

          {/* Local Time Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 text-center">
              <Sunset className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <span className="text-xs text-stone-400 block">स्थानीय संध्या अर्घ्य (Sunset)</span>
              <span className="font-rozha text-2xl font-black text-red-600 dark:text-orange-400">
                {hub.sandhyaSunsetLocal}
              </span>
              <span className="text-[10px] text-stone-500 block mt-0.5">कार्तिक षष्ठी स्थानीय समय</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 text-center">
              <Sunrise className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <span className="text-xs text-stone-400 block">स्थानीय उषा अर्घ्य (Sunrise)</span>
              <span className="font-rozha text-2xl font-black text-amber-600 dark:text-amber-400">
                {hub.ushaSunriseLocal}
              </span>
              <span className="text-[10px] text-stone-500 block mt-0.5">कार्तिक सप्तमी स्थानीय समय</span>
            </div>
          </div>

          {/* Foreign / Cold Climate Devotional Tips */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm font-mukta text-stone-700 dark:text-stone-200 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-800 dark:text-amber-300">विदेश में इनडोर / अपार्टमेंट अर्घ्य परामर्श:</strong>
              <p className="mt-1 leading-relaxed">{hub.indoorArghyaTip}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
