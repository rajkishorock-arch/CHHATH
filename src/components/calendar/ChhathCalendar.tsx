import React from 'react';
import { Calendar as CalendarIcon, Clock, Bell, Plus, Sparkles } from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import { cityArghyaData } from '../../data/astronomy';

interface CalendarDate {
  date: string;
  dayName: string;
  tithi: string;
  ritualName: string;
  description: string;
  highlight?: boolean;
}

const CALENDAR_DATES: CalendarDate[] = [
  {
    date: '13 नवंबर 2026',
    dayName: 'शुक्रवार',
    tithi: 'कार्तिक शुक्ल चतुर्थी',
    ritualName: 'नहाय-खाय (Nahay-Khay)',
    description: 'पवित्र नदी स्नान, सात्विक कद्दू-भात का सेवन व घर की शुद्धि।'
  },
  {
    date: '14 नवंबर 2026',
    dayName: 'शनिवार',
    tithi: 'कार्तिक शुक्ल पंचमी',
    ritualName: 'खरना (Kharna)',
    description: 'दिन भर निर्जला उपवास, सायंकाल गुड़ की रसियाव खीर व रोटी का भोग।'
  },
  {
    date: '15 नवंबर 2026',
    dayName: 'रविवार',
    tithi: 'कार्तिक शुक्ल षष्ठी',
    ritualName: 'संध्या अर्घ्य (Sandhya Arghya)',
    description: 'अस्ताचलगामी (डूबते) सूर्य को प्रथम अर्घ्य अर्पण।',
    highlight: true
  },
  {
    date: '16 नवंबर 2026',
    dayName: 'सोमवार',
    tithi: 'कार्तिक शुक्ल सप्तमी',
    ritualName: 'उषा अर्घ्य व पारण (Usha Arghya)',
    description: 'उदीयमान (उगते) सूर्य को द्वितीय अर्घ्य व ३६ घंटे के व्रत का पारण।',
    highlight: true
  }
];

export const ChhathCalendar: React.FC = () => {
  const { userLocation } = useChhathData();
  const city = cityArghyaData.find(c => 
    c.cityName.toLowerCase().includes(userLocation.city.toLowerCase())
  ) || cityArghyaData[0];

  const addToGoogleCalendar = (title: string, dateStr: string, details: string) => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(city.cityName)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="calendar" className="section-padding relative overflow-hidden bg-white dark:bg-stone-900 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>पावन पर्व पंचांग (Digital Chhath Calendar)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            छठ महापर्व २०२६ कैलेंडर 📅
          </h2>
          <p className="font-mukta text-base text-stone-600 dark:text-stone-300">
            चारों पावन दिनों की आधिकारिक तिथियां, अनुष्ठान विवरण और एक-क्लिक <strong>गूगल कैलेंडर रिमाइंडर</strong>।
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CALENDAR_DATES.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                item.highlight
                  ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/40 shadow-xl paramprik-border'
                  : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 shadow-md'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-orange-600 dark:text-amber-400">
                    {item.date} • {item.dayName}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                    {item.tithi}
                  </span>
                </div>

                <h3 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {item.ritualName}
                </h3>

                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-mukta">
                  {idx === 2 ? `संध्या अर्घ्य: ${city.sandhyaSunset}` : idx === 3 ? `उषा अर्घ्य: ${city.ushaSunrise}` : 'पूर्ण शुद्धि व तप'}
                </span>

                <button
                  onClick={() => addToGoogleCalendar(`छठ महापर्व: ${item.ritualName}`, item.date, item.description)}
                  className="px-3.5 py-1.5 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-amber-500 hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Calendar अलर्ट</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
