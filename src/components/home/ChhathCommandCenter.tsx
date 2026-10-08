import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Sunset, 
  Sunrise, 
  Calendar, 
  Clock, 
  ListChecks, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Music, 
  ExternalLink,
  ShieldCheck,
  Check,
  ChevronRight,
  Utensils,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { calculateChhathStatus } from '../hero/LiveFestivalExperience';
import { getChhathDays } from '../../data/days';
import { chhathSamagriList } from '../../data/samagri';
import { vidhiChecklistData } from '../vidhi/ChhathVidhiInteractive';
import { cityArghyaData } from '../../data/astronomy';

interface ChhathCommandCenterProps {
  onNavigate: (url: string) => void;
}

const SAMAGRI_STORAGE_KEY = 'chhath-samagri-checklist-2026-v1';
const VIDHI_STORAGE_KEY = 'chhath-vidhi-checklist-2026-v1';

export const ChhathCommandCenter: React.FC<ChhathCommandCenterProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const days = getChhathDays(language);
  const { stateData, targetMs } = calculateChhathStatus(new Date(), language);

  // 1. Live Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetMs - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  // 2. Read Progress from LocalStorage (READ-ONLY)
  const [samagriCheckedCount, setSamagriCheckedCount] = useState<number>(0);
  const [vidhiCheckedCount, setVidhiCheckedCount] = useState<number>(0);

  useEffect(() => {
    // Read Samagri checked items count
    try {
      const samSaved = localStorage.getItem(SAMAGRI_STORAGE_KEY);
      if (samSaved) {
        const parsed = JSON.parse(samSaved);
        if (Array.isArray(parsed)) {
          setSamagriCheckedCount(parsed.length);
        }
      }
    } catch (e) {
      console.warn('Error reading Samagri progress on homepage:', e);
    }

    // Read Vidhi checked items count
    try {
      const vidSaved = localStorage.getItem(VIDHI_STORAGE_KEY);
      if (vidSaved) {
        const parsed = JSON.parse(vidSaved);
        if (Array.isArray(parsed)) {
          setVidhiCheckedCount(parsed.length);
        }
      }
    } catch (e) {
      console.warn('Error reading Vidhi progress on homepage:', e);
    }
  }, []);

  const totalSamagriItems = chhathSamagriList.length; // 40
  const totalVidhiItems = vidhiChecklistData.length;   // 20
  const totalCombinedItems = totalSamagriItems + totalVidhiItems; // 60
  const totalCheckedItems = samagriCheckedCount + vidhiCheckedCount;
  const overallPercent = Math.round((totalCheckedItems / totalCombinedItems) * 100);

  const samagriRemaining = totalSamagriItems - samagriCheckedCount;
  const vidhiRemaining = totalVidhiItems - vidhiCheckedCount;
  const isBothComplete = samagriCheckedCount === totalSamagriItems && vidhiCheckedCount === totalVidhiItems;

  // 3. City Arghya Card Selection State
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
  const selectedCity = cityArghyaData[selectedCityIndex] || cityArghyaData[0];

  const cmdText = {
    hi: {
      liveBadge: 'छठ कमांड सेंटर • Asia/Kolkata live',
      datesBadge: '13 – 16 नवंबर 2026',
      prepStatus: 'आपकी छठ तैयारी',
      prepDone: 'तैयारी संपन्न',
      nextRitualTitle: 'अगला महत्वपूर्ण अनुष्ठान',
      dateLabel: 'तारीख:',
      days: 'दिन',
      hours: 'घंटे',
      minutes: 'मिनट',
      seconds: 'सेकंड',
      viewDetails: 'विस्तार से देखें',
      myPrepTitle: '🙏 मेरी छठ तैयारी (Dashboard)',
      browserProgress: 'ब्राउज़र स्थानीय प्रगति',
      samagriChecklist: '📦 सामग्री चेकलिस्ट',
      samagriReady: 'तैयार',
      vidhiChecklist: '🙏 पूजा विधि चेकलिस्ट',
      vidhiReady: 'पूरे',
      totalCombined: 'कुल संयुक्त तैयारी',
      cityArghyaTitle: 'मेरे शहर का अर्घ्य समय',
      sandhyaArghyaLabel: '15 नवंबर • संध्या अर्घ्य',
      sunsetTimeLabel: 'सूर्यास्त समय',
      ushaArghyaLabel: '16 नवंबर • उषा अर्घ्य',
      sunriseTimeLabel: 'सूर्योदय समय',
      weatherLabel: 'मौसम:',
      viewAllCityArghya: 'पूरा शहरवार अर्घ्य समय देखें →',
      fourDayScheduleTitle: '4-दिवसीय समय-सारणी 2026',
      tithiHeader: 'कार्तिक शुक्ल 4 - 7',
      viewFullCalendar: 'पूरा कैलेंडर देखें →',
      todaysActionsTitle: "आज क्या करें? (Today's Actions)",
      todaysActionsSub: 'पर्व की वर्तमान तिथि के अनुसार मुख्य अनुष्ठानिक कार्य',
      viewAction: 'देखें',
      commandGridTitle: 'त्वरित सेवाएं एवं गाइड (Command Grid)',
      commandGridSub: 'छठ महापर्व 2026 के सभी 6 मुख्य अनुभागों पर तुरंत पहुंचें',
      gridCalendar: 'छठ कैलेंडर',
      gridCalendarSub: '4 दिनों की तारीख',
      gridDates: 'छठ तिथियां 2026',
      gridDatesSub: 'तिथि एवं समय चक्र',
      gridVidhi: 'पूजा विधि',
      gridVidhiSub: 'नहाय-खाय से पारण',
      gridSamagri: 'पूजा सामग्री',
      gridSamagriSub: 'Checklist 2026',
      gridArghya: 'अर्घ्य समय',
      gridArghyaSub: 'सूर्योदय/सूर्यास्त',
      gridGhat: 'पटना गंगा घाट',
      gridGhatSub: 'घाट व स्थानीय समय',
      gridSongs: 'छठ गीत',
      gridSongsSub: 'लोकगीत व भजन',
      gridKatha: 'छठ कथा',
      gridKathaSub: 'पौराणिक कथा',
      badgeNext: '→ अगला',
      badgeUpcoming: 'आगामी',
      badgeToday: '🟢 आज (Today)',
      badgeDone: '✓ संपन्न',
      prepAllDone: '🎉 आपकी संपूर्ण तैयारी 100% पूरी है! (कैलेंडर देखें →)',
      continueSamagri: 'सामग्री चेकलिस्ट जारी रखें',
      continueVidhi: 'पूजा विधि चेकलिस्ट जारी रखें'
    },
    en: {
      liveBadge: 'Chhath Command Center • Asia/Kolkata live',
      datesBadge: '13 – 16 Nov 2026',
      prepStatus: 'Your Chhath Preparation',
      prepDone: 'Preparation Complete',
      nextRitualTitle: 'Next Key Ritual',
      dateLabel: 'Date:',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Mins',
      seconds: 'Secs',
      viewDetails: 'View Details',
      myPrepTitle: '🙏 My Chhath Preparation (Dashboard)',
      browserProgress: 'Local Browser Progress',
      samagriChecklist: '📦 Samagri Checklist',
      samagriReady: 'ready',
      vidhiChecklist: '🙏 Puja Vidhi Checklist',
      vidhiReady: 'done',
      totalCombined: 'Overall Combined Progress',
      cityArghyaTitle: "My City's Arghya Timings",
      sandhyaArghyaLabel: '15 Nov • Sandhya Arghya',
      sunsetTimeLabel: 'Sunset Time',
      ushaArghyaLabel: '16 Nov • Usha Arghya',
      sunriseTimeLabel: 'Sunrise Time',
      weatherLabel: 'Weather:',
      viewAllCityArghya: 'View All City Solar Timings →',
      fourDayScheduleTitle: '4-Day Sacred Schedule 2026',
      tithiHeader: 'Kartik Shukla 4 - 7',
      viewFullCalendar: 'View Full Calendar →',
      todaysActionsTitle: "Today's Sacred Actions",
      todaysActionsSub: 'Rituals and guidelines mapped to festival calendar',
      viewAction: 'View',
      commandGridTitle: 'Quick Command Grid',
      commandGridSub: 'Instant access to all key sections of Chhath 2026',
      gridCalendar: 'Chhath Calendar',
      gridCalendarSub: '4-Day Dates',
      gridDates: 'Chhath Dates 2026',
      gridDatesSub: 'Tithi & Solar Cycle',
      gridVidhi: 'Puja Vidhi',
      gridVidhiSub: 'Nahay-Khay to Paran',
      gridSamagri: 'Puja Samagri',
      gridSamagriSub: 'Checklist 2026',
      gridArghya: 'Arghya Timings',
      gridArghyaSub: 'Sunrise / Sunset',
      gridGhat: 'Patna Ganga Ghat',
      gridGhatSub: 'Ghat Status & Time',
      gridSongs: 'Chhath Songs',
      gridSongsSub: 'Folk Songs & Bhajans',
      gridKatha: 'Chhath Katha',
      gridKathaSub: 'Sacred Legends',
      badgeNext: '→ Next',
      badgeUpcoming: 'Upcoming',
      badgeToday: '🟢 Today',
      badgeDone: '✓ Done',
      prepAllDone: '🎉 Your preparation is 100% complete! (View Calendar →)',
      continueSamagri: 'Continue Samagri Checklist',
      continueVidhi: 'Continue Puja Vidhi Checklist'
    },
    bho: {
      liveBadge: 'छठ कमांड सेंटर • Asia/Kolkata live',
      datesBadge: '13 – 16 नवंबर 2026',
      prepStatus: 'राउर छठ तइयारी',
      prepDone: 'तइयारी पूरा भइल',
      nextRitualTitle: 'अगिला महत्वपूर्ण नेग-नेम',
      dateLabel: 'तारीख:',
      days: 'दिन',
      hours: 'घंटा',
      minutes: 'मिनट',
      seconds: 'सेकंड',
      viewDetails: 'बिस्तार से देखीं',
      myPrepTitle: '🙏 हमार छठ तइयारी (Dashboard)',
      browserProgress: 'ब्राउज़र प्रगति',
      samagriChecklist: '📦 सामग्री चेकलिस्ट',
      samagriReady: 'तइयार',
      vidhiChecklist: '🙏 पूजा बिधि चेकलिस्ट',
      vidhiReady: 'पूरा',
      totalCombined: 'कुल संयुक्त तइयारी',
      cityArghyaTitle: 'हमार सहर के अरघ समय',
      sandhyaArghyaLabel: '15 नवंबर • सँझिया अरघ',
      sunsetTimeLabel: 'सूर्यास्त बेरा',
      ushaArghyaLabel: '16 नवंबर • भोरहरिया अरघ',
      sunriseTimeLabel: 'सूर्योदय बेरा',
      weatherLabel: 'मौसम:',
      viewAllCityArghya: 'सगरी सहर के अरघ समय देखीं →',
      fourDayScheduleTitle: '4-दिने के समय-सारणी 2026',
      tithiHeader: 'कार्तिक सुक्ल 4 - 7',
      viewFullCalendar: 'पूरा कैलेंडर देखीं →',
      todaysActionsTitle: "आज का करीं? (Today's Actions)",
      todaysActionsSub: 'तिथि के हिसाब से आज के मुख्य काम',
      viewAction: 'देखीं',
      commandGridTitle: 'त्वरित सेवा आ गाइड (Command Grid)',
      commandGridSub: 'छठ महापर्व के सगरी मुख्य अनुभाग',
      gridCalendar: 'छठ कैलेंडर',
      gridCalendarSub: '4 दिने के तारीख',
      gridDates: 'छठ तिथि 2026',
      gridDatesSub: 'तिथि आ समय चक्र',
      gridVidhi: 'पूजा बिधि',
      gridVidhiSub: 'नहाय-खाय से पारन',
      gridSamagri: 'पूजा सामान',
      gridSamagriSub: 'Checklist 2026',
      gridArghya: 'अरघ समय',
      gridArghyaSub: 'सूर्योदय/सूर्यास्त',
      gridGhat: 'पटना गंगा घाट',
      gridGhatSub: 'घाट आ समय',
      gridSongs: 'छठ गीत',
      gridSongsSub: 'लोकगीत आ भजन',
      gridKatha: 'छठ कथा',
      gridKathaSub: 'पावन कथा',
      badgeNext: '→ अगिला',
      badgeUpcoming: 'आवे वाला',
      badgeToday: '🟢 आज',
      badgeDone: '✓ पूरा',
      prepAllDone: '🎉 राउर सगरी तइयारी 100% पूरा भइल! (कैलेंडर देखीं →)',
      continueSamagri: 'सामग्री चेकलिस्ट जारी रखीं',
      continueVidhi: 'पूजा बिधि चेकलिस्ट जारी रखीं'
    },
    mai: {
      liveBadge: 'छठि कमांड सेंटर • Asia/Kolkata live',
      datesBadge: '13 – 16 नवंबर 2026',
      prepStatus: 'अहाँक छठि तैयारी',
      prepDone: 'तैयारी संपन्न',
      nextRitualTitle: 'आगामी महत्वपूर्ण अनुष्ठान',
      dateLabel: 'दिनांक:',
      days: 'दिन',
      hours: 'घंटा',
      minutes: 'मिनट',
      seconds: 'सेकंड',
      viewDetails: 'विस्तार सं देखू',
      myPrepTitle: '🙏 हमर छठि तैयारी (Dashboard)',
      browserProgress: 'स्थानीय प्रगति',
      samagriChecklist: '📦 सामग्री चेकलिस्ट',
      samagriReady: 'तैयार',
      vidhiChecklist: '🙏 पूजा विधि चेकलिस्ट',
      vidhiReady: 'संपन्न',
      totalCombined: 'कुल संयुक्त तैयारी',
      cityArghyaTitle: 'अपन नगरक अर्घ्य समय',
      sandhyaArghyaLabel: '15 नवंबर • साँझक अर्घ्य',
      sunsetTimeLabel: 'सूर्यास्त काल',
      ushaArghyaLabel: '16 नवंबर • प्रात: अर्घ्य',
      sunriseTimeLabel: 'सूर्योदय काल',
      weatherLabel: 'मौसम:',
      viewAllCityArghya: 'नगरवार अर्घ्य समय देखू →',
      fourDayScheduleTitle: '4-दिवसीय समय-सारणी 2026',
      tithiHeader: 'कार्तिक शुक्ल 4 - 7',
      viewFullCalendar: 'सम्पूर्ण कैलेंडर देखू →',
      todaysActionsTitle: "आइ की करी? (Today's Actions)",
      todaysActionsSub: 'पर्वक वर्तमान तिथिक अनुसार मुख्य कार्य',
      viewAction: 'देखू',
      commandGridTitle: 'त्वरित सेवा ओ गाइड (Command Grid)',
      commandGridSub: 'छठि महापर्वक समस्त मुख्य अनुभाग',
      gridCalendar: 'छठि कैलेंडर',
      gridCalendarSub: '4 दिवसक दिनांक',
      gridDates: 'छठि तिथि 2026',
      gridDatesSub: 'तिथि ओ समय चक्र',
      gridVidhi: 'पूजा विधि',
      gridVidhiSub: 'नहाय-खाय सं पारण',
      gridSamagri: 'पूजा सामग्री',
      gridSamagriSub: 'Checklist 2026',
      gridArghya: 'अर्घ्य समय',
      gridArghyaSub: 'सूर्योदय/सूर्यास्त',
      gridGhat: 'पटना गंगा घाट',
      gridGhatSub: 'घाट ओ स्थानीय समय',
      gridSongs: 'छठि गीत',
      gridSongsSub: 'लोकगीत ओ भजन',
      gridKatha: 'छठि कथा',
      gridKathaSub: 'पौराणिक कथा',
      badgeNext: '→ आगामी',
      badgeUpcoming: 'आगामी',
      badgeToday: '🟢 आइ',
      badgeDone: '✓ संपन्न',
      prepAllDone: '🎉 अहाँक सम्पूर्ण तैयारी 100% पूरा अछि! (कैलेंडर देखू →)',
      continueSamagri: 'सामग्री चेकलिस्ट जारी राखू',
      continueVidhi: 'पूजा विधि चेकलिस्ट जारी राखू'
    },
    mag: {
      liveBadge: 'छठ कमांड सेंटर • Asia/Kolkata live',
      datesBadge: '13 – 16 नवंबर 2026',
      prepStatus: 'अपन छठ तैयारी',
      prepDone: 'तैयारी संपन्न',
      nextRitualTitle: 'अगिला महत्वपूर्ण अनुष्ठान',
      dateLabel: 'तारीख:',
      days: 'दिन',
      hours: 'घंटा',
      minutes: 'मिनट',
      seconds: 'सेकंड',
      viewDetails: 'विस्तार से देखी',
      myPrepTitle: '🙏 हमर छठ तैयारी (Dashboard)',
      browserProgress: 'ब्राउज़र प्रगति',
      samagriChecklist: '📦 सामग्री चेकलिस्ट',
      samagriReady: 'तैयार',
      vidhiChecklist: '🙏 पूजा विधि चेकलिस्ट',
      vidhiReady: 'पूरा',
      totalCombined: 'कुल संयुक्त तैयारी',
      cityArghyaTitle: 'हमार शहर के अर्घ्य समय',
      sandhyaArghyaLabel: '15 नवंबर • संध्या अर्घ्य',
      sunsetTimeLabel: 'सूर्यास्त समय',
      ushaArghyaLabel: '16 नवंबर • उषा अर्घ्य',
      sunriseTimeLabel: 'सूर्योदय समय',
      weatherLabel: 'मौसम:',
      viewAllCityArghya: 'शहरवार अर्घ्य समय देखी →',
      fourDayScheduleTitle: '4-दिने के समय-सारणी 2026',
      tithiHeader: 'कार्तिक शुक्ल 4 - 7',
      viewFullCalendar: 'पूरा कैलेंडर देखी →',
      todaysActionsTitle: "आज का करीं? (Today's Actions)",
      todaysActionsSub: 'पर्व के वर्तमान तिथि के अनुसार मुख्य कार्य',
      viewAction: 'देखी',
      commandGridTitle: 'त्वरित सेवा आ गाइड (Command Grid)',
      commandGridSub: 'छठ महापर्व के सभे मुख्य अनुभाग',
      gridCalendar: 'छठ कैलेंडर',
      gridCalendarSub: '4 दिन के तारीख',
      gridDates: 'छठ तिथियां 2026',
      gridDatesSub: 'तिथि व समय चक्र',
      gridVidhi: 'पूजा विधि',
      gridVidhiSub: 'नहाय-खाय से पारण',
      gridSamagri: 'पूजा सामग्री',
      gridSamagriSub: 'Checklist 2026',
      gridArghya: 'अर्घ्य समय',
      gridArghyaSub: 'सूर्योदय/सूर्यास्त',
      gridGhat: 'पटना गंगा घाट',
      gridGhatSub: 'घाट व समय',
      gridSongs: 'छठ गीत',
      gridSongsSub: 'लोकगीत व भजन',
      gridKatha: 'छठ कथा',
      gridKathaSub: 'पौराणिक कथा',
      badgeNext: '→ अगिला',
      badgeUpcoming: 'आवे वाला',
      badgeToday: '🟢 आज',
      badgeDone: '✓ संपन्न',
      prepAllDone: '🎉 आपकी संपूर्ण तैयारी 100% पूरी है! (कैलेंडर देखी →)',
      continueSamagri: 'सामग्री चेकलिस्ट जारी रखी',
      continueVidhi: 'पूजा विधि चेकलिस्ट जारी रखी'
    }
  }[language] || {
    liveBadge: 'छठ कमांड सेंटर • Asia/Kolkata live',
    datesBadge: '13 – 16 नवंबर 2026',
    prepStatus: 'आपकी छठ तैयारी',
    prepDone: 'तैयारी संपन्न',
    nextRitualTitle: 'अगला महत्वपूर्ण अनुष्ठान',
    dateLabel: 'तारीख:',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    viewDetails: 'विस्तार से देखें',
    myPrepTitle: '🙏 मेरी छठ तैयारी (Dashboard)',
    browserProgress: 'ब्राउज़र स्थानीय प्रगति',
    samagriChecklist: '📦 सामग्री चेकलिस्ट',
    samagriReady: 'तैयार',
    vidhiChecklist: '🙏 पूजा विधि चेकलिस्ट',
    vidhiReady: 'पूरे',
    totalCombined: 'कुल संयुक्त तैयारी',
    cityArghyaTitle: 'मेरे शहर का अर्घ्य समय',
    sandhyaArghyaLabel: '15 नवंबर • संध्या अर्घ्य',
    sunsetTimeLabel: 'सूर्यास्त समय',
    ushaArghyaLabel: '16 नवंबर • उषा अर्घ्य',
    sunriseTimeLabel: 'सूर्योदय समय',
    weatherLabel: 'मौसम:',
    viewAllCityArghya: 'पूरा शहरवार अर्घ्य समय देखें →',
    fourDayScheduleTitle: '4-दिवसीय समय-सारणी 2026',
    tithiHeader: 'कार्तिक शुक्ल 4 - 7',
    viewFullCalendar: 'पूरा कैलेंडर देखें →',
    todaysActionsTitle: "आज क्या करें? (Today's Actions)",
    todaysActionsSub: 'पर्व की वर्तमान तिथि के अनुसार मुख्य अनुष्ठानिक कार्य',
    viewAction: 'देखें',
    commandGridTitle: 'त्वरित सेवाएं एवं गाइड (Command Grid)',
    commandGridSub: 'छठ महापर्व 2026 के सभी 6 मुख्य अनुभागों पर तुरंत पहुंचें',
    gridCalendar: 'छठ कैलेंडर',
    gridCalendarSub: '4 दिनों की तारीख',
    gridDates: 'छठ तिथियां 2026',
    gridDatesSub: 'तिथि एवं समय चक्र',
    gridVidhi: 'पूजा विधि',
    gridVidhiSub: 'नहाय-खाय से पारण',
    gridSamagri: 'पूजा सामग्री',
    gridSamagriSub: 'Checklist 2026',
    gridArghya: 'अर्घ्य समय',
    gridArghyaSub: 'सूर्योदय/सूर्यास्त',
    gridGhat: 'पटना गंगा घाट',
    gridGhatSub: 'घाट व स्थानीय समय',
    gridSongs: 'छठ गीत',
    gridSongsSub: 'लोकगीत व भजन',
    gridKatha: 'छठ कथा',
    gridKathaSub: 'पौराणिक कथा',
    badgeNext: '→ अगला',
    badgeUpcoming: 'आगामी',
    badgeToday: '🟢 आज (Today)',
    badgeDone: '✓ संपन्न',
    prepAllDone: '🎉 आपकी संपूर्ण तैयारी 100% पूरी है! (कैलेंडर देखें →)',
    continueSamagri: 'सामग्री चेकलिस्ट जारी रखें',
    continueVidhi: 'पूजा विधि चेकलिस्ट जारी रखें'
  };

  // Helper for dynamic "Continue Preparation" CTA
  const getContinueCta = () => {
    if (isBothComplete) {
      return {
        text: cmdText.prepAllDone,
        url: '/CHHATH/chhath-calendar-2026/'
      };
    }
    if (samagriRemaining >= vidhiRemaining) {
      return {
        text: `${cmdText.continueSamagri} (${samagriCheckedCount}/${totalSamagriItems}) →`,
        url: '/CHHATH/chhath-samagri/'
      };
    } else {
      return {
        text: `${cmdText.continueVidhi} (${vidhiCheckedCount}/${totalVidhiItems}) →`,
        url: '/CHHATH/chhath-puja-vidhi/'
      };
    }
  };

  const continueCta = getContinueCta();

  // Helper for status badge per day step
  const getTimelineBadge = (dayNum: number) => {
    if (stateData.activeStep === 0) {
      if (dayNum === 1) return { label: cmdText.badgeNext, cls: 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40' };
      return { label: cmdText.badgeUpcoming, cls: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/20' };
    }
    if (stateData.activeStep > 0 && stateData.activeStep <= 4) {
      if (dayNum === stateData.activeStep) {
        return { label: cmdText.badgeToday, cls: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-500/50 font-bold' };
      }
      if (dayNum < stateData.activeStep) {
        return { label: cmdText.badgeDone, cls: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/20' };
      }
      if (dayNum === stateData.activeStep + 1) {
        return { label: cmdText.badgeNext, cls: 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40' };
      }
    }
    if (stateData.activeStep === 5) {
      return { label: cmdText.badgeDone, cls: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/20' };
    }
    return { label: cmdText.badgeUpcoming, cls: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/20' };
  };

  // Dynamic Today's Action items based on stage
  const getTodayActions = () => {
    const isEn = language === 'en';
    const isBho = language === 'bho';
    const isMai = language === 'mai';
    const isMag = language === 'mag';

    switch (stateData.stateKey) {
      case 'pre-chhath':
        if (isEn) {
          return [
            { title: 'Verify Samagri Checklist', desc: 'Gather bamboo daura, soop, yellow garments, and kaddu-bhat ration.', url: '/CHHATH/chhath-samagri/' },
            { title: 'Read 4-Day Ritual Guide', desc: 'Understand sacred guidelines from Nahay-Khay to Paran.', url: '/CHHATH/chhath-puja-vidhi/' },
            { title: 'Check City Solar Timings', desc: 'Accurate sunrise & sunset times for 15 & 16 November.', url: '/CHHATH/chhath-arghya-time-2026/' }
          ];
        }
        if (isBho) {
          return [
            { title: 'सामग्री चेकलिस्ट जाँचीं', desc: 'बाँस के दउरा, सूप, पीयर कपड़ा आ कद्दू-भात के राशन जुटाईं।', url: '/CHHATH/chhath-samagri/' },
            { title: 'चारो दिन के पूजा विधि पढ़ीं', desc: 'नहाय-खाय से पारण ले के सात्विक नियम समझीं।', url: '/CHHATH/chhath-puja-vidhi/' },
            { title: 'अपन शहर के अर्घ्य समय देखीं', desc: '15 आ 16 नवंबर के सूर्यास्त आ सूर्योदय के सही समय।', url: '/CHHATH/chhath-arghya-time-2026/' }
          ];
        }
        if (isMai) {
          return [
            { title: 'सामग्री चेकलिस्ट जाँचू', desc: 'बाँसक दउरा, सूप, पीयर वस्त्र ओ कद्दू-भात राशन एकत्र करू।', url: '/CHHATH/chhath-samagri/' },
            { title: 'चारू दिवसक पूजा विधि पढ़ू', desc: 'नहाय-खाय सं पारण धरि सात्विक नियम बुझू।', url: '/CHHATH/chhath-puja-vidhi/' },
            { title: 'अपन नगरक अर्घ्य समय देखू', desc: '15 ओ 16 नवंबर क सूर्यास्त ओ सूर्योदय काल।', url: '/CHHATH/chhath-arghya-time-2026/' }
          ];
        }
        if (isMag) {
          return [
            { title: 'सामग्री चेकलिस्ट जाँची', desc: 'बाँस के दउरा, सूप, पीयर कपड़ा आ कद्दू-भात के राशन जुटाईं।', url: '/CHHATH/chhath-samagri/' },
            { title: 'चारो दिन के पूजा विधि पढ़ी', desc: 'नहाय-खाय से पारण तक के सात्विक नियम समझीं।', url: '/CHHATH/chhath-puja-vidhi/' },
            { title: 'अपन शहर के अर्घ्य समय देखी', desc: '15 आ 16 नवंबर के सूर्यास्त आ सूर्योदय के सही समय।', url: '/CHHATH/chhath-arghya-time-2026/' }
          ];
        }
        return [
          { title: 'सामग्री चेकलिस्ट की जांच करें', desc: 'बांस का दउरा, सूप, पीला वस्त्र व कद्दू-भात का राशन एकत्र करें।', url: '/CHHATH/chhath-samagri/' },
          { title: 'चारों दिनों की पूजा विधि पढ़ें', desc: 'नहाय-खाय से पारण तक के सात्विक नियमों को समझें।', url: '/CHHATH/chhath-puja-vidhi/' },
          { title: 'अपने शहर का अर्घ्य समय देखें', desc: '15 व 16 नवंबर को सूर्यास्त व सूर्योदय का सटीक समय।', url: '/CHHATH/chhath-arghya-time-2026/' }
        ];
      case 'nahay-khay':
        return [
          { title: isEn ? 'Purify With Sacred Bath' : 'पवित्र नदी/जल से स्नान', desc: isEn ? 'Purify the kitchen with Ganga jal and wear clean pious clothes.' : 'गंगाजल छिड़ककर घर व रसोईघर की शुद्धि करें एवं नए वस्त्र पहनें।', url: '/CHHATH/chhath-puja-vidhi/' },
          { title: isEn ? 'Cook Kaddu-Bhat Prasad' : 'कद्दू-भात प्रसाद तैयार करें', desc: isEn ? 'Pure satvik meal prepared in rock salt and cow ghee.' : 'सेंधा नमक व देसी घी में अरवा चावल, चने की दाल व कद्दू का भोजन।', url: '/CHHATH/chhath-puja-vidhi/' },
          { title: isEn ? 'Prepare for Kharna Fast' : 'खरना उपवास की तैयारी करें', desc: isEn ? 'Gather new clay stove and dry mango wood.' : 'मिट्टी का नया चूल्हा व आम की सूखी लकड़ियां एकत्र रखें।', url: '/CHHATH/chhath-samagri/' }
        ];
      case 'kharna':
        return [
          { title: isEn ? 'Observe Strict Nirjala Fast' : 'अखंड निर्जला उपवास रखें', desc: isEn ? 'Do not consume even a single drop of water until sunset.' : 'सूर्यास्त तक जल की एक बूंद भी ग्रहण न करें।', url: '/CHHATH/chhath-puja-vidhi/' },
          { title: isEn ? 'Prepare Rasiyaav Kheer' : 'रसियाव खीर व रोटी का प्रसाद बनाएं', desc: isEn ? 'Jaggery and cow milk kheer prepared on sacred firewood.' : 'गुड़ व गाय के दूध की खीर नए चूल्हे पर तैयार करें।', url: '/CHHATH/thekua-recipe/' },
          { title: isEn ? 'Offer Prasad in Solitude' : 'एकांत में नैवेद्य अर्पित करें', desc: isEn ? 'Offer bhog on banana leaf, initiating the 36-hour fast.' : 'केले के पत्ते पर मां षष्ठी को भोग लगाकर 36 घंटे का व्रत शुरू करें।', url: '/CHHATH/chhath-puja-vidhi/' }
        ];
      case 'sandhya-arghya':
        return [
          { title: isEn ? 'Adorn Soop and Daura' : 'सूप व दउरा सजाएं', desc: isEn ? 'Place thekua, coconut, sugarcane, and sacred lamp in soop.' : 'ठेकुआ, नारियल, गन्ना, डाभा नींबू व जलता दीया सूप में रखें।', url: '/CHHATH/chhath-samagri/' },
          { title: isEn ? 'Procession to Ghat' : 'नदी/घाट प्रस्थान करें', desc: isEn ? 'Carry daura on head barefoot while singing Chhath melodies.' : 'सिर पर दउरा उठाकर नंगे पांव पारंपरिक छठ गीत गाते हुए चलें।', url: '/CHHATH/chhath-puja-geet/' },
          { title: isEn ? 'Offer Evening Arghya' : 'अस्ताचलगामी सूर्य को अर्घ्य दें', desc: isEn ? 'Stand in cool water and offer stream of milk and holy water.' : 'शीतल जल में खड़े होकर दूध व जल की धारा अर्पित करें।', url: '/CHHATH/chhath-arghya-time-2026/' }
        ];
      case 'usha-arghya':
        return [
          { title: isEn ? 'Reach Ghat at Brahmamuhurta' : 'ब्रह्ममुहूर्त में घाट पहुंचें', desc: isEn ? 'Stand facing east in the river awaiting sunrise.' : 'पूर्व दिशा की ओर जल में खड़े होकर सूर्यदेव की प्रतीक्षा करें।', url: '/CHHATH/chhath-arghya-time-2026/' },
          { title: isEn ? 'Offer Morning Arghya' : 'उदित सूर्यदेव को अंतिम अर्घ्य दें', desc: isEn ? 'Offer morning arghya as dawn spreads crimson light.' : 'लालिमा बिखरते ही दूध व जल से प्रातःकालीन अर्घ्य दें।', url: '/CHHATH/chhath-puja-vidhi/' },
          { title: isEn ? 'Conclude Fast (Paran)' : 'अदरक व दूध से व्रत का पारण करें', desc: isEn ? 'Conclude fast right after Arghya and share Mahaprasad.' : 'अर्घ्य के तुरंत बाद पारण कर ठेकुआ महाप्रसाद बांटें।', url: '/CHHATH/thekua-recipe/' }
        ];
      case 'post-chhath':
        return [
          { title: isEn ? 'Chhath Mahaparv 2026 Concluded' : 'छठ महापर्व 2026 संपन्न', desc: isEn ? 'May Chhathi Maiya bless all devotees with peace and prosperity.' : 'छठी मैया सभी व्रतियों एवं श्रद्धालुओं का कल्याण करें।', url: '/CHHATH/chhath-calendar-2026/' }
        ];
    }
  };

  const todayActions = getTodayActions();

  return (
    <section aria-label="Chhath Mahaparv 2026 Command Center" className="w-full space-y-8 font-mukta">
      
      {/* ==================================================
          1. HEADER & LIVE FESTIVAL STATUS BANNER
      ================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-amber-500/10 border border-amber-500/30 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/15 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest">
              {cmdText.liveBadge}
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
            {cmdText.datesBadge}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-rozha text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
              {stateData.title}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 text-base sm:text-lg leading-relaxed">
              {stateData.desc}
            </p>
          </div>

          {/* Quick Stats Banner Pill */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/25 space-y-2 min-w-[220px] shrink-0 text-center shadow-sm">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block uppercase tracking-wider">
              {cmdText.prepStatus}
            </span>
            <div className="font-rozha text-3xl font-black text-amber-600 dark:text-amber-400">
              {totalCheckedItems} / {totalCombinedItems}
            </div>
            <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" 
                style={{ width: `${overallPercent}%` }} 
              />
            </div>
            <span className="text-xs font-bold text-stone-600 dark:text-stone-300 block">
              {overallPercent}% {cmdText.prepDone}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          GRID ROW 1: NEXT EVENT CARD & MY PREPARATION DASHBOARD
      ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. NEXT EVENT CARD ("अगला अनुष्ठान") */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">
                  {cmdText.nextRitualTitle}
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300">
                {stateData.countdownLabel}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-rozha text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-300">
                {stateData.nextMilestoneTitle}
              </h4>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block">
                {cmdText.dateLabel} {stateData.nextMilestoneDate}
              </span>
            </div>

            {/* Countdown Display Box */}
            <div className="grid grid-cols-4 gap-2 text-center pt-2">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-rozha text-2xl font-black text-stone-900 dark:text-amber-100 block">{timeLeft.days}</span>
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">{cmdText.days}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-rozha text-2xl font-black text-stone-900 dark:text-amber-100 block">{timeLeft.hours}</span>
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">{cmdText.hours}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-rozha text-2xl font-black text-stone-900 dark:text-amber-100 block">{timeLeft.minutes}</span>
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">{cmdText.minutes}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-rozha text-2xl font-black text-stone-900 dark:text-amber-100 block">{timeLeft.seconds}</span>
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">{cmdText.seconds}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate(stateData.nextMilestoneUrl)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{stateData.primaryCtaText || cmdText.viewDetails} →</span>
          </button>
        </div>

        {/* 3. MY CHHATH PREPARATION DASHBOARD ("🙏 मेरी छठ तैयारी") */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-amber-500" />
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">
                  {cmdText.myPrepTitle}
                </h3>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                {cmdText.browserProgress}
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Samagri Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-800 dark:text-stone-200">{cmdText.samagriChecklist}</span>
                  <span className="text-amber-700 dark:text-amber-400">{samagriCheckedCount} / {totalSamagriItems} {cmdText.samagriReady}</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${(samagriCheckedCount / totalSamagriItems) * 100}%` }}
                  />
                </div>
              </div>

              {/* Vidhi Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-800 dark:text-stone-200">{cmdText.vidhiChecklist}</span>
                  <span className="text-amber-700 dark:text-amber-400">{vidhiCheckedCount} / {totalVidhiItems} {cmdText.vidhiReady}</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${(vidhiCheckedCount / totalVidhiItems) * 100}%` }}
                  />
                </div>
              </div>

              {/* Combined Summary Card */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs font-bold">
                <span className="text-stone-800 dark:text-stone-200">{cmdText.totalCombined}</span>
                <span className="text-amber-800 dark:text-amber-300 font-rozha text-lg">
                  {totalCheckedItems} / {totalCombinedItems} ({overallPercent}%)
                </span>
              </div>

            </div>
          </div>

          {/* Continue Preparation CTA */}
          <button
            onClick={() => onNavigate(continueCta.url)}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>{continueCta.text}</span>
          </button>
        </div>

      </div>

      {/* ==================================================
          GRID ROW 2: CITY-WISE ARGHYA CARD & FOUR-DAY TIMELINE
      ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 4. CITY-WISE ARGHYA CARD ("मेरे शहर का अर्घ्य समय") */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">
                  {cmdText.cityArghyaTitle}
                </h3>
              </div>

              {/* City Dropdown Selector */}
              <select
                value={selectedCityIndex}
                onChange={(e) => setSelectedCityIndex(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-stone-800 dark:text-amber-200 text-xs font-bold outline-none cursor-pointer"
              >
                {cityArghyaData.map((c, idx) => (
                  <option key={idx} value={idx} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                    📍 {c.cityName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedCity.cityName} • {selectedCity.state} ({selectedCity.river})</span>
              </div>
            </div>

            {/* Sunset & Sunrise display boxes */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              
              {/* Sandhya Arghya */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  <Sunset className="w-4 h-4 text-orange-500" />
                  <span>{cmdText.sandhyaArghyaLabel}</span>
                </div>
                <span className="font-rozha text-2xl font-black text-stone-900 dark:text-amber-100 block">
                  {selectedCity.sandhyaSunset}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-semibold">
                  {cmdText.sunsetTimeLabel}
                </span>
              </div>

              {/* Usha Arghya */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  <Sunrise className="w-4 h-4 text-amber-400" />
                  <span>{cmdText.ushaArghyaLabel}</span>
                </div>
                <span className="font-rozha text-2xl font-black text-stone-900 dark:text-amber-100 block">
                  {selectedCity.ushaSunrise}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-semibold">
                  {cmdText.sunriseTimeLabel}
                </span>
              </div>

            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400 font-semibold bg-stone-100 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{cmdText.weatherLabel} {selectedCity.weatherTemp} ({selectedCity.weatherCondition})</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/CHHATH/chhath-arghya-time-2026/')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{cmdText.viewAllCityArghya}</span>
          </button>
        </div>

        {/* 5. FOUR-DAY QUICK TIMELINE ("4-दिवसीय समय-सारणी") */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">
                  {cmdText.fourDayScheduleTitle}
                </h3>
              </div>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                {cmdText.tithiHeader}
              </span>
            </div>

            {/* 4 Days list */}
            <div className="space-y-2.5">
              {days.map((day, idx) => {
                const badge = getTimelineBadge(idx + 1);
                return (
                  <div
                    key={day.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {day.dayNumber}
                      </div>
                      <div>
                        <h4 className="font-rozha font-bold text-stone-900 dark:text-amber-100 text-sm sm:text-base">
                          {day.title}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400 block">
                          {day.date2026.split('(')[0]}
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/CHHATH/chhath-calendar-2026/')}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>{cmdText.viewFullCalendar}</span>
          </button>
        </div>

      </div>

      {/* ==================================================
          6. TODAY'S ACTIONS ("आज क्या करें?")
      ================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/25 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{cmdText.todaysActionsTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              {cmdText.todaysActionsSub}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {todayActions.map((act, aIdx) => (
            <a
              key={aIdx}
              href={act.url}
              onClick={(e) => { e.preventDefault(); onNavigate(act.url); }}
              className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500 hover:shadow-md transition-all space-y-2 flex flex-col justify-between text-decoration-none group"
            >
              <div className="space-y-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                  {aIdx + 1}
                </span>
                <h4 className="font-rozha text-base font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {act.desc}
                </p>
              </div>
              <div className="pt-3 flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{cmdText.viewAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ==================================================
          7. QUICK ACTION GRID (6 CORE SEO PAGES)
      ================================================== */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
            {cmdText.commandGridTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {cmdText.commandGridSub}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Card 1: Calendar */}
          <a
            href="/CHHATH/chhath-calendar-2026/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-calendar-2026/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridCalendar}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridCalendarSub}</span>
          </a>

          {/* Card 2: Chhath Puja Date 2026 */}
          <a
            href="/CHHATH/chhath-puja-date-2026/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-date-2026/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridDates}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridDatesSub}</span>
          </a>

          {/* Card 3: Puja Vidhi */}
          <a
            href="/CHHATH/chhath-puja-vidhi/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-vidhi/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridVidhi}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridVidhiSub}</span>
          </a>

          {/* Card 4: Samagri */}
          <a
            href="/CHHATH/chhath-samagri/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-samagri/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <ListChecks className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridSamagri}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridSamagriSub}</span>
          </a>

          {/* Card 5: Arghya Time */}
          <a
            href="/CHHATH/chhath-arghya-time-2026/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridArghya}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridArghyaSub}</span>
          </a>

          {/* Card 6: Patna Ganga Ghat Chhath */}
          <a
            href="/CHHATH/patna-chhath-puja-2026/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/patna-chhath-puja-2026/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridGhat}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridGhatSub}</span>
          </a>

          {/* Card 7: Songs */}
          <a
            href="/CHHATH/chhath-puja-geet/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-geet/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridSongs}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridSongsSub}</span>
          </a>

          {/* Card 8: Katha */}
          <a
            href="/CHHATH/chhath-puja-katha/"
            onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-katha/'); }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 hover:shadow-md transition-all text-center space-y-2 text-decoration-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="font-rozha text-sm font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600">
              {cmdText.gridKatha}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">{cmdText.gridKathaSub}</span>
          </a>

        </div>
      </div>

    </section>
  );
};
