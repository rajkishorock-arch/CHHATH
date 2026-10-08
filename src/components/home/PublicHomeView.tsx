import React from 'react';
import { HeroSection } from '../hero/HeroSection';
import { ChhathCommandCenter } from './ChhathCommandCenter';
import { getImageUrl } from '../../utils/imageUtils';
import { ArghyaTimeCalc } from '../astronomy/ArghyaTimeCalc';
import { FourDaysTimeline } from '../timeline/FourDaysTimeline';
import { GhatFinder } from '../ghats/GhatFinder';
import { GhatSafetySection } from '../ghats/GhatSafetySection';
import { SongsSection } from '../audio/SongsSection';
import { MyFirstChhath } from '../beginner/MyFirstChhath';
import {
  Sun,
  Calendar,
  CheckSquare,
  MapPin,
  Utensils,
  Music,
  BookOpen,
  ArrowRight,
  Info,
  Users,
  Flame
} from 'lucide-react';

import { QuickServicesHub } from './QuickServicesHub';
import { FeatureModalType } from './FeatureExperienceModal';
import { useLanguage } from '../../context/LanguageContext';

interface PublicHomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenFeatureModal?: (modal: FeatureModalType) => void;
  onOpenAssistant?: () => void;
  initialQuery?: string;
}

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({
  onNavigate,
  onOpenFeatureModal,
  onOpenAssistant,
  initialQuery
}) => {
  const { language } = useLanguage();
  const [activeSearchQuery, setActiveSearchQuery] = React.useState<string>(initialQuery || '');

  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setActiveSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  React.useEffect(() => {
    const handleMusicSearchEvent = (e: any) => {
      const q = e.detail?.query;
      if (q && q.trim()) {
        setActiveSearchQuery(q.trim());
      }
    };
    window.addEventListener('chhath_music_search', handleMusicSearchEvent);
    return () => window.removeEventListener('chhath_music_search', handleMusicSearchEvent);
  }, []);
  const homeText = {
    hi: {
      servicesTitle: 'छठ पूजा 2026: मुख्य सेवाएं एवं गाइड',
      servicesSub: 'आपकी पूजा की संपूर्ण तैयारी के लिए आवश्यक 6 मुख्य अनुभाग',
      viewBtn: 'देखें',
      seoTitle: 'छठ पूजा 2026 की महत्वपूर्ण गाइड',
      seoSub: 'संपूर्ण नियम, सामग्री, अर्घ्य समय और ठेकुआ रेसिपी की विस्तृत गाइड',
      readMore: 'विस्तार से पढ़ें',
      checkListBtn: 'सामग्री सूची देखें',
      checkTimeBtn: 'समय देखें',
      viewRecipeBtn: 'रेसिपी देखें',
      listenSongsBtn: 'छठ गीत सुनें',
      readKathaBtn: 'कथा पढ़ें',
      samagriCardTitle: 'छठ पूजा सामग्री सूची (Chhath Samagri)',
      samagriCardSub: 'दउरा, सूप, मौसमी अर्घ्य फल, ठेकुआ-कसार सामग्री और घाट की संपूर्ण आवश्यक वस्तुओं की विस्तृत प्रामाणिक सूची।',
      samagriCardPill: '40+ प्रामाणिक पूजन वस्तुएं • संपूर्ण चेकलिस्ट',
      samagriCardBtn: 'संपूर्ण सामग्री सूची देखें',
      prasadCardTitle: 'पावन पकवान व ठेकुआ रेसिपी (Chhath Prasad & Recipes)',
      prasadCardSub: 'पारंपरिक सांचे पर गढ़ा खस्ता ठेकुआ, खरना का अमृततुल्य रसियाव (गुड़ की खीर), चावल के कसार लड्डू और मौसमी फल।',
      prasadCardPill: 'छठ महापर्व के पवित्र महाप्रसाद • विधि व वीडियो गाइड',
      prasadCardBtn: 'सभी पकवान रेसिपी व वीडियो देखें',
      mantraCardTitle: 'सूर्य देव वैदिक मंत्र व छठी मईया आरती (Mantra & Aarti)',
      mantraCardSub: 'सूर्य अर्घ्य समर्पण महामंत्र, षष्ठी देवी ध्यान, सूर्य गायत्री, आदित्य हृदय स्तोत्र और छठी मईया की संपूर्ण पावन आरती।',
      mantraCardPill: 'वैदिक मंत्र, स्तोत्र व पावन आरती • संपूर्ण आध्यात्मिक संग्रह',
      mantraCardBtn: 'संपूर्ण मंत्र, आरती व वीडियो सुनें',
      communityTitle: 'श्रद्धालु अनुभव व संस्मरण',
      communitySub: 'समुदाय से चुनिंदा पावन क्षण (Community Highlights)',
      exploreAllBtn: 'सभी देखें (Explore)',
      trustSource: 'विश्वसनीय स्रोत: दृक् पंचांग एवं क्षेत्रीय खगोलीय वेधशाला आंकड़े • 2026',
      geoBased: 'स्थानिक अक्षांश-रेखांश गणना आधारित'
    },
    en: {
      servicesTitle: 'Chhath Puja 2026: Core Services & Guides',
      servicesSub: 'Essential 6 primary sections for your complete festival preparations',
      viewBtn: 'View',
      seoTitle: 'Chhath Puja 2026 Essential Guides',
      seoSub: 'Complete rules, holy samagri, solar arghya timings, and thekua recipes',
      readMore: 'Read Full Guide',
      checkListBtn: 'View Checklist',
      checkTimeBtn: 'View Timings',
      viewRecipeBtn: 'View Recipe',
      listenSongsBtn: 'Listen to Songs',
      readKathaBtn: 'Read Legends',
      samagriCardTitle: 'Chhath Puja Samagri List (Chhath Samagri)',
      samagriCardSub: 'Exhaustive checklist of bamboo winnows, baskets, holy fruits, thekua ingredients, and ghat essentials.',
      samagriCardPill: '40+ Authentic Sacred Items • Interactive Checklist',
      samagriCardBtn: 'View Complete Samagri List',
      prasadCardTitle: 'Sacred Offerings & Thekua Recipes (Chhath Prasad)',
      prasadCardSub: 'Crispy wooden-mold Thekua, divine Kharna Rasiyaw jaggery kheer, Kasar laddoos, and fresh seasonal offerings.',
      prasadCardPill: 'Sacred Mahaprasad of Chhath • Recipe & Video Guide',
      prasadCardBtn: 'View All Prasad Recipes & Videos',
      mantraCardTitle: 'Vedic Surya Mantras & Chhathi Maiya Aarti',
      mantraCardSub: 'Solar Arghya Dedication Mantras, Shashthi Devi Dhyan, Surya Gayatri, Aditya Hridaya Stotra, and holy Aarti.',
      mantraCardPill: 'Vedic Mantras, Hymns & Sacred Aarti • Complete Spiritual Collection',
      mantraCardBtn: 'Listen to All Mantras & Aarti',
      communityTitle: 'Devotee Experiences & Memories',
      communitySub: 'Heartwarming moments shared by the global Chhath community',
      exploreAllBtn: 'Explore All',
      trustSource: 'Trusted Sources: Drik Panchang & Regional Solar Observatories • 2026',
      geoBased: 'Calculated using geographic latitude and longitude coordinates'
    },
    bho: {
      servicesTitle: 'छठ पूजा 2026: मुख्य सेवा आ गाइड',
      servicesSub: 'पूजा के पूरा तइयारी खातिर जरूरी 6 गो मुख्य अनुभाग',
      viewBtn: 'देखीं',
      seoTitle: 'छठ पूजा 2026 के जरूरी गाइड',
      seoSub: 'सगरी नेम, सामान, अरघ समय आ ठेकुआ के प्रामाणिक बिधि',
      readMore: 'बिस्तार से पढ़ीं',
      checkListBtn: 'सामग्री सूची देखीं',
      checkTimeBtn: 'समय देखीं',
      viewRecipeBtn: 'रेसिपी देखीं',
      listenSongsBtn: 'छठ गीत सुनीं',
      readKathaBtn: 'कथा पढ़ीं',
      samagriCardTitle: 'छठ पूजा सामग्री सूची (Chhath Samagri)',
      samagriCardSub: 'दउरा, सूप, फल, ठेकुआ-कसार आ घाट के सगरी जरूरी सामान के सूची।',
      samagriCardPill: '40+ पूजा सामग्री • पूरा चेकलिस्ट',
      samagriCardBtn: 'सगरी सामान के सूची देखीं',
      prasadCardTitle: 'पावन पकवान आ ठेकुआ रेसिपी (Chhath Prasad)',
      prasadCardSub: 'काठ के सांचा पर बनल खस्ता ठेकुआ, खरना के रसियाव खीर आ कसार लाडू।',
      prasadCardPill: 'छठ महापर्व के पवित्र महापरसाद • बिधि आ वीडियो गाइड',
      prasadCardBtn: 'सगरी पकवान के बिधि देखीं',
      mantraCardTitle: 'सुरुज देव वैदिक मंत्र आ छठी मइया आरती',
      mantraCardSub: 'सुरुज अरघ मंतर, छठी मइया ध्यान, सुरुज गायत्री आ पावन आरती।',
      mantraCardPill: 'वैदिक मंत्र, स्तोत्र आ पावन आरती • आध्यात्मिक संग्रह',
      mantraCardBtn: 'सगरी मंत्र आ आरती सुनीं',
      communityTitle: 'श्रद्धालु अनुभव आ सुरति',
      communitySub: 'समुदाय से चुनल पावन क्षण (Community Highlights)',
      exploreAllBtn: 'सगरी देखीं (Explore)',
      trustSource: 'सच्चा स्रोत: दृक् पंचांग आ खगोलीय वेधशाला आंकड़े • 2026',
      geoBased: 'सहर के अक्षांश-देशांतर के हिसाब से गणना'
    },
    mai: {
      servicesTitle: 'छठि पूजा 2026: मुख्य सेवा ओ गाइड',
      servicesSub: 'पूजाक सम्पूर्ण तैयारी लेल आवश्यक 6 मुख्य अनुभाग',
      viewBtn: 'देखू',
      seoTitle: 'छठि पूजा 2026 केर महत्वपूर्ण गाइड',
      seoSub: 'सम्पूर्ण नियम, सामग्री, अर्घ्य समय ओ ठेकुआ रेसिपीक विस्तृत गाइड',
      readMore: 'विस्तार सं पढ़ू',
      checkListBtn: 'सामग्री सूची देखू',
      checkTimeBtn: 'समय देखू',
      viewRecipeBtn: 'रेसिपी देखू',
      listenSongsBtn: 'छठि गीत सुनू',
      readKathaBtn: 'कथा पढ़ू',
      samagriCardTitle: 'छठि पूजा सामग्री सूची (Chhath Samagri)',
      samagriCardSub: 'दउरा, सूप, फल, ठेकुआ-कसार सामग्रीक सम्पूर्ण प्रामाणिक सूची।',
      samagriCardPill: '40+ प्रामाणिक पूजन सामग्री • सम्पूर्ण चेकलिस्ट',
      samagriCardBtn: 'सम्पूर्ण सामग्री सूची देखू',
      prasadCardTitle: 'पावन पकवान ओ ठेकुआ रेसिपी (Chhath Prasad)',
      prasadCardSub: 'काठक सांचा पर बनल खस्ता ठेकुआ, खरनाक रसियाव खीर ओ कसार लड्डू।',
      prasadCardPill: 'छठि महापर्वक पवित्र महाप्रसाद • विधि ओ वीडियो गाइड',
      prasadCardBtn: 'समस्त पकवान विधि देखू',
      mantraCardTitle: 'सूर्य देव वैदिक मंत्र व षष्ठी देवी आरती',
      mantraCardSub: 'सूर्य अर्घ्य महामंत्र, षष्ठी देवी ध्यान, सूर्य गायत्री ओ पावन आरती।',
      mantraCardPill: 'वैदिक मंत्र, स्तोत्र ओ पावन आरती • सम्पूर्ण आध्यात्मिक संग्रह',
      mantraCardBtn: 'सम्पूर्ण मंत्र ओ आरती सुनू',
      communityTitle: 'श्रद्धालु अनुभव ओ संस्मरण',
      communitySub: 'समुदाय सं चुनल पावन क्षण (Community Highlights)',
      exploreAllBtn: 'समस्त देखू (Explore)',
      trustSource: 'विश्वसनीय स्रोत: दृक् पंचांग एवं क्षेत्रीय खगोलीय आंकड़े • 2026',
      geoBased: 'स्थानिक अक्षांश-रेखांश गणना आधारित'
    },
    mag: {
      servicesTitle: 'छठ पूजा 2026: मुख्य सेवा आ गाइड',
      servicesSub: 'पूजा के संपूर्ण तैयारी खातिर आवश्यक 6 मुख्य अनुभाग',
      viewBtn: 'देखी',
      seoTitle: 'छठ पूजा 2026 के महत्वपूर्ण गाइड',
      seoSub: 'संपूर्ण नियम, सामग्री, अर्घ्य समय आ ठेकुआ रेसिपी के गाइड',
      readMore: 'विस्तार से पढ़ी',
      checkListBtn: 'सामग्री सूची देखी',
      checkTimeBtn: 'समय देखी',
      viewRecipeBtn: 'रेसिपी देखी',
      listenSongsBtn: 'छठ गीत सुनी',
      readKathaBtn: 'कथा पढ़ी',
      samagriCardTitle: 'छठ पूजा सामग्री सूची (Chhath Samagri)',
      samagriCardSub: 'दउरा, सूप, फल, ठेकुआ सामग्री के संपूर्ण जांच सूची।',
      samagriCardPill: '40+ पूजन सामग्री • संपूर्ण चेकलिस्ट',
      samagriCardBtn: 'संपूर्ण सामग्री सूची देखी',
      prasadCardTitle: 'पावन पकवान व ठेकुआ रेसिपी (Chhath Prasad)',
      prasadCardSub: 'पारंपरिक ठेकुआ, खरना के रसियाव खीर आ कसार लड्डू।',
      prasadCardPill: 'छठ महापर्व के पवित्र महाप्रसाद • विधि आ वीडियो गाइड',
      prasadCardBtn: 'सभे पकवान रेसिपी देखी',
      mantraCardTitle: 'सूर्य देव वैदिक मंत्र व छठी मईया आरती',
      mantraCardSub: 'सूर्य अर्घ्य मंत्र, षष्ठी देवी ध्यान, सूर्य गायत्री आ छठी मईया के पावन आरती।',
      mantraCardPill: 'वैदिक मंत्र व पावन आरती • संपूर्ण आध्यात्मिक संग्रह',
      mantraCardBtn: 'संपूर्ण मंत्र व आरती सुनी',
      communityTitle: 'श्रद्धालु अनुभव व संस्मरण',
      communitySub: 'समुदाय से चुनल पावन क्षण (Community Highlights)',
      exploreAllBtn: 'सभे देखी (Explore)',
      trustSource: 'विश्वसनीय स्रोत: दृक् पंचांग एवं खगोलीय वेधशाला आंकड़े • 2026',
      geoBased: 'स्थानिक अक्षांश-रेखांश गणना आधारित'
    }
  }[language] || {
    servicesTitle: 'छठ पूजा 2026: मुख्य सेवाएं एवं गाइड',
    servicesSub: 'आपकी पूजा की संपूर्ण तैयारी के लिए आवश्यक 6 मुख्य अनुभाग',
    viewBtn: 'देखें',
    seoTitle: 'छठ पूजा 2026 की महत्वपूर्ण गाइड',
    seoSub: 'संपूर्ण नियम, सामग्री, अर्घ्य समय और ठेकुआ रेसिपी की विस्तृत गाइड',
    readMore: 'विस्तार से पढ़ें',
    checkListBtn: 'सामग्री सूची देखें',
    checkTimeBtn: 'समय देखें',
    viewRecipeBtn: 'रेसिपी देखें',
    listenSongsBtn: 'छठ गीत सुनें',
    readKathaBtn: 'कथा पढ़ें',
    samagriCardTitle: 'छठ पूजा सामग्री सूची (Chhath Samagri)',
    samagriCardSub: 'दउरा, सूप, मौसमी अर्घ्य फल, ठेकुआ-कसार सामग्री और घाट की संपूर्ण आवश्यक वस्तुओं की विस्तृत प्रामाणिक सूची।',
    samagriCardPill: '40+ प्रामाणिक पूजन वस्तुएं • संपूर्ण चेकलिस्ट',
    samagriCardBtn: 'संपूर्ण सामग्री सूची देखें',
    prasadCardTitle: 'पावन पकवान व ठेकुआ रेसिपी (Chhath Prasad & Recipes)',
    prasadCardSub: 'पारंपरिक सांचे पर गढ़ा खस्ता ठेकुआ, खरना का अमृततुल्य रसियाव (गुड़ की खीर), चावल के कसार लड्डू और मौसमी फल।',
    prasadCardPill: 'छठ महापर्व के पवित्र महाप्रसाद • विधि व वीडियो गाइड',
    prasadCardBtn: 'सभी पकवान रेसिपी व वीडियो देखें',
    mantraCardTitle: 'सूर्य देव वैदिक मंत्र व छठी मईया आरती (Mantra & Aarti)',
    mantraCardSub: 'सूर्य अर्घ्य समर्पण महामंत्र, षष्ठी देवी ध्यान, सूर्य गायत्री, आदित्य हृदय स्तोत्र और छठी मईया की संपूर्ण पावन आरती।',
    mantraCardPill: 'वैदिक मंत्र, स्तोत्र व पावन आरती • संपूर्ण आध्यात्मिक संग्रह',
    mantraCardBtn: 'संपूर्ण मंत्र, आरती व वीडियो सुनें',
    communityTitle: 'श्रद्धालु अनुभव व संस्मरण',
    communitySub: 'समुदाय से चुनिंदा पावन क्षण (Community Highlights)',
    exploreAllBtn: 'सभी देखें (Explore)',
    trustSource: 'विश्वसनीय स्रोत: दृक् पंचांग एवं क्षेत्रीय खगोलीय वेधशाला आंकड़े • 2026',
    geoBased: 'स्थानिक अक्षांश-रेखांश गणना आधारित'
  };

  const utilityCards = {
    hi: [
      { id: 'arghya', title: 'आज का अर्घ्य समय', desc: 'सूर्यास्त एवं सूर्योदय का सटीक स्थानीय समय व खगोलीय गणना।', icon: Sun, badge: 'समय' },
      { id: 'guide', title: 'चार दिन की पूजा गाइड', desc: 'नहाय-खाय, खरना, संध्या व उषा अर्घ्य के पावन नियम।', icon: Calendar, badge: 'नियम' },
      { id: 'samagri', title: 'सामग्री सूची', desc: 'दउरा, सूप, फल, ठेकुआ व पूजा सामग्री की चेकलिस्ट।', icon: CheckSquare, badge: 'चेकलिस्ट' },
      { id: 'ghats', title: 'पास के घाट', desc: 'नजदीकी पवित्र घाट, पार्किंग सुविधा व भीड़ सुरक्षा गाइड।', icon: MapPin, badge: 'घाट' },
      { id: 'prasad', title: 'प्रसाद व रेसिपी', desc: 'सात्विक ठेकुआ, कसार व छठ रेसिपी बनाने की सरल विधि।', icon: Utensils, badge: 'रेसिपी' },
      { id: 'aarti', title: 'मंत्र, आरती व गीत', desc: 'पारंपरिक छठ गीत, सूर्य मंत्र, स्तोत्र एवं पवित्र आरती।', icon: Music, badge: 'संगीत' }
    ],
    en: [
      { id: 'arghya', title: "Today's Arghya Time", desc: 'Accurate local sunset and sunrise solar calculation.', icon: Sun, badge: 'Timing' },
      { id: 'guide', title: '4-Day Puja Guide', desc: 'Sacred rules of Nahay-Khay, Kharna, Sandhya & Usha Arghya.', icon: Calendar, badge: 'Rules' },
      { id: 'samagri', title: 'Samagri Checklist', desc: 'Complete interactive checklist for baskets, winnows & fruits.', icon: CheckSquare, badge: 'Checklist' },
      { id: 'ghats', title: 'Nearby Ghats', desc: 'Nearest holy river ghats, parking, amenities & safety.', icon: MapPin, badge: 'Ghats' },
      { id: 'prasad', title: 'Prasad & Recipes', desc: 'Authentic recipes of crispy Thekua, Rasiyaw kheer & Kasar.', icon: Utensils, badge: 'Recipe' },
      { id: 'aarti', title: 'Mantras, Aarti & Songs', desc: 'Vedic solar hymns, Chhathi Maiya Aarti & devotional songs.', icon: Music, badge: 'Music' }
    ],
    bho: [
      { id: 'arghya', title: 'आज के अरघ समय', desc: 'सुरुज डूबते आ उगते बेरा के सही घरी आ खगोलीय गणना।', icon: Sun, badge: 'समय' },
      { id: 'guide', title: 'चार दिनी पूजा गाइड', desc: 'नहाय-खाय, खरना, सँझिया आ भोरहरिया अरघ के नेम।', icon: Calendar, badge: 'नियम' },
      { id: 'samagri', title: 'सामग्री सूची', desc: 'दउरा, सूप, फल, ठेकुआ आ पूजा सामान के चेकलिस्ट।', icon: CheckSquare, badge: 'चेकलिस्ट' },
      { id: 'ghats', title: 'लगपास के घाट', desc: 'नजदीकी पावन घाट, पार्किंग सुविधा आ भीड़ निर्देशिका।', icon: MapPin, badge: 'घाट' },
      { id: 'prasad', title: 'परसाद आ रेसिपी', desc: 'सात्त्विक ठेकुआ, कसार आ खरना रसियाव बनावे के बिधि।', icon: Utensils, badge: 'रेसिपी' },
      { id: 'aarti', title: 'मंत्र, आरती आ गीत', desc: 'पारंपरिक छठ गीत, सुरुज मंतर, स्तोत्र आ पावन आरती।', icon: Music, badge: 'संगीत' }
    ],
    mai: [
      { id: 'arghya', title: 'आइ केर अर्घ्य समय', desc: 'सूर्यास्त ओ सूर्योदयक सटीक स्थानीय समय व खगोलीय गणना।', icon: Sun, badge: 'समय' },
      { id: 'guide', title: 'चारि दिवसीय पूजा गाइड', desc: 'नहाय-खाय, खरना, साँझक ओ प्रात: अर्घ्यक पावन नियम।', icon: Calendar, badge: 'नियम' },
      { id: 'samagri', title: 'सामग्री सूची', desc: 'दउरा, सूप, फल, ठेकुआ ओ पूजा सामग्रीक चेकलिस्ट।', icon: CheckSquare, badge: 'चेकलिस्ट' },
      { id: 'ghats', title: 'निकटवर्ती घाट', desc: 'नजदीकी पवित्र घाट, पार्किंग सुविधा ओ सुरक्षा गाइड।', icon: MapPin, badge: 'घाट' },
      { id: 'prasad', title: 'प्रसाद ओ रेसिपी', desc: 'सात्विक ठेकुआ, कसार ओ खरनाक रसियाव बनेबाक विधि।', icon: Utensils, badge: 'रेसिपी' },
      { id: 'aarti', title: 'मंत्र, आरती ओ गीत', desc: 'पारंपरिक छठि गीत, सूर्य मंत्र, स्तोत्र ओ पावन आरती।', icon: Music, badge: 'संगीत' }
    ],
    mag: [
      { id: 'arghya', title: 'आज के अर्घ्य समय', desc: 'सूर्यास्त आ सूर्योदय के सटीक स्थानीय समय व खगोलीय गणना।', icon: Sun, badge: 'समय' },
      { id: 'guide', title: 'चार दिन के पूजा गाइड', desc: 'नहाय-खाय, खरना, संध्या आ उषा अर्घ्य के पावन नियम।', icon: Calendar, badge: 'नियम' },
      { id: 'samagri', title: 'सामग्री सूची', desc: 'दउरा, सूप, फल, ठेकुआ व पूजा सामग्री के चेकलिस्ट।', icon: CheckSquare, badge: 'चेकलिस्ट' },
      { id: 'ghats', title: 'पास के घाट', desc: 'नजदीकी पवित्र घाट, पार्किंग सुविधा व भीड़ सुरक्षा गाइड।', icon: MapPin, badge: 'घाट' },
      { id: 'prasad', title: 'प्रसाद व रेसिपी', desc: 'सात्विक ठेकुआ, कसार व छठ रेसिपी बनावे के सरल विधि।', icon: Utensils, badge: 'रेसिपी' },
      { id: 'aarti', title: 'मंत्र, आरती व गीत', desc: 'पारंपरिक छठ गीत, सूर्य मंत्र, स्तोत्र एवं पवित्र आरती।', icon: Music, badge: 'संगीत' }
    ]
  }[language] || [
    { id: 'arghya', title: 'आज का अर्घ्य समय', desc: 'सूर्यास्त एवं सूर्योदय का सटीक स्थानीय समय व खगोलीय गणना।', icon: Sun, badge: 'समय' },
    { id: 'guide', title: 'चार दिन की पूजा गाइड', desc: 'नहाय-खाय, खरना, संध्या व उषा अर्घ्य के पावन नियम।', icon: Calendar, badge: 'नियम' },
    { id: 'samagri', title: 'सामग्री सूची', desc: 'दउरा, सूप, फल, ठेकुआ व पूजा सामग्री की चेकलिस्ट।', icon: CheckSquare, badge: 'चेकलिस्ट' },
    { id: 'ghats', title: 'पास के घाट', desc: 'नजदीकी पवित्र घाट, पार्किंग सुविधा व भीड़ सुरक्षा गाइड।', icon: MapPin, badge: 'घाट' },
    { id: 'prasad', title: 'प्रसाद व रेसिपी', desc: 'सात्विक ठेकुआ, कसार व छठ रेसिपी बनाने की सरल विधि।', icon: Utensils, badge: 'रेसिपी' },
    { id: 'aarti', title: 'मंत्र, आरती व गीत', desc: 'पारंपरिक छठ गीत, सूर्य मंत्र, स्तोत्र एवं पवित्र आरती।', icon: Music, badge: 'संगीत' }
  ];

  const sampleCommunityStories = [
    {
      id: '1',
      author: 'सुनीता देवी (पटना)',
      title: 'गंगा घाट की पावन संध्या आरती व दीप दान',
      time: '2 घंटे पहले',
      image: getImageUrl('/images/hero_sunrise.jpg')
    },
    {
      id: '2',
      author: 'राजेश सिंह (मुजफ्फरपुर)',
      title: 'घर के आँगन में पारंपरिक ठेकुआ प्रसाद निर्माण',
      time: '5 घंटे पहले',
      image: getImageUrl('/images/hero_sunrise.jpg')
    },
    {
      id: '3',
      author: 'अंजली गुप्ता (वाराणसी)',
      title: 'परिवार के साथ दउरा सजाने की सुंदर परंपरा',
      time: '1 दिन पहले',
      image: getImageUrl('/images/hero_sunrise.jpg')
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* Quick Services & Experiences Hub */}
      {onOpenFeatureModal && onOpenAssistant && (
        <section className="container-custom max-w-5xl mx-auto px-1.5 sm:px-4 -mt-4 sm:-mt-6">
          <QuickServicesHub
            onNavigate={onNavigate}
            onOpenFeatureModal={onOpenFeatureModal}
            onOpenAssistant={onOpenAssistant}
          />
        </section>
      )}

      {/* If a search is active, show the YouTube Results Feed right at the top of the Home page */}
      {activeSearchQuery && (
        <section id="search-results-top" className="container-custom max-w-6xl mx-auto px-1.5 sm:px-4 space-y-4">
          <SongsSection initialQuery={activeSearchQuery} />
        </section>
      )}

      {/* 2. Chhath Mahaparv 2026 Command Center */}
      <section className="container-custom max-w-5xl mx-auto px-1 sm:px-4">
        <ChhathCommandCenter onNavigate={onNavigate} />
      </section>

      {/* 3. Six Primary Utility Cards */}
      <section className="container-custom max-w-5xl mx-auto px-1 sm:px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-amber-100">
            {homeText.servicesTitle}
          </h2>
          <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300">
            {homeText.servicesSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {utilityCards.map((card) => {
            const Icon = card.icon;
            const cardHref = card.id === 'arghya' ? '/CHHATH/chhath-arghya-time-2026/'
              : card.id === 'guide' ? '/CHHATH/chhath-puja-vidhi/'
              : card.id === 'samagri' ? '/CHHATH/chhath-samagri/'
              : card.id === 'prasad' ? '/CHHATH/thekua-recipe/'
              : `#${card.id}`;
            return (
              <a
                key={card.id}
                href={cardHref}
                onClick={(e) => {
                  if (cardHref.startsWith('/CHHATH/')) {
                    e.preventDefault();
                    onNavigate(card.id === 'samagri' ? 'chhath-samagri' : card.id);
                  }
                }}
                className="group p-6 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm hover:shadow-md hover:border-amber-400 text-left transition-all flex flex-col justify-between text-decoration-none min-h-[160px]"
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
                  <span>{homeText.viewBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 4. Dedicated SEO Guides Section */}
      <section className="container-custom max-w-5xl mx-auto px-1.5 sm:px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/30 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
              {homeText.seoTitle}
            </h2>
            <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              {homeText.seoSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/CHHATH/chhath-puja-vidhi/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-puja-vidhi');
                window.history.pushState(null, '', '/CHHATH/chhath-puja-vidhi/');
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500 hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-decoration-none"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                  छठ पूजा विधि
                </h3>
                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  चारों दिनों के विस्तृत नियम, नहाय-खाय, खरना, संध्या व उषा अर्घ्य विधि।
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{homeText.readMore}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="/CHHATH/chhath-samagri/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-samagri');
                window.history.pushState(null, '', '/CHHATH/chhath-samagri/');
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500 hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-decoration-none"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h3 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                  छठ पूजा सामग्री
                </h3>
                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  दउरा, सूप, फल, ठेकुआ व अर्घ्य सामग्री की संपूर्ण चेकलिस्ट।
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{homeText.checkListBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="/CHHATH/chhath-arghya-time-2026/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-arghya-time-2026');
                window.history.pushState(null, '', '/CHHATH/chhath-arghya-time-2026/');
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500 hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-decoration-none"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sun className="w-5 h-5" />
                </div>
                <h3 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                  छठ अर्घ्य समय
                </h3>
                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  15 एवं 16 नवंबर 2026 संध्या व उषा अर्घ्य का सटीक समय।
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{homeText.checkTimeBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="/CHHATH/thekua-recipe/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('thekua-recipe');
                window.history.pushState(null, '', '/CHHATH/thekua-recipe/');
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500 hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-decoration-none"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                  ठेकुआ रेसिपी
                </h3>
                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  पारंपरिक खस्ता ठेकुआ बनाने की प्रामाणिक सात्विक विधि।
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{homeText.viewRecipeBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="/CHHATH/chhath-puja-geet/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-puja-geet');
                window.history.pushState(null, '', '/CHHATH/chhath-puja-geet/');
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500 hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-decoration-none"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                  छठ पूजा के गीत
                </h3>
                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  पारंपरिक छठ गीत, छठ मैया भजन व भक्ति म्यूजिक प्लेयर।
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{homeText.listenSongsBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="/CHHATH/chhath-puja-katha/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-puja-katha');
                window.history.pushState(null, '', '/CHHATH/chhath-puja-katha/');
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-500 hover:shadow-md transition-all space-y-3 flex flex-col justify-between text-decoration-none"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                  छठ पूजा कथा
                </h3>
                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  छठी मैया की प्रचलित कथा, राजा प्रियव्रत व पौराणिक परंपराएं।
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{homeText.readKathaBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Today's Arghya Details */}
      <section id="arghya" className="container-custom max-w-5xl mx-auto px-1 sm:px-4 scroll-mt-24">
        <ArghyaTimeCalc />
      </section>

      {/* 4 Days Timeline */}
      <section id="guide" className="container-custom max-w-5xl mx-auto px-1 sm:px-4 scroll-mt-24">
        <FourDaysTimeline />
      </section>

      {/* "पहली बार छठ?" Beginner Mode Section */}
      <section className="container-custom max-w-5xl mx-auto px-1 sm:px-4">
        <MyFirstChhath />
      </section>

      {/* Puja Samagri Compact Intro Card */}
      <section id="samagri" className="container-custom max-w-5xl mx-auto px-1 sm:px-4 scroll-mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/25 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-500/30">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{homeText.samagriCardPill}</span>
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                {homeText.samagriCardTitle}
              </h2>
              <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                {homeText.samagriCardSub}
              </p>
              
              {/* Quick feature pills */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
                <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs">
                  🧺 बाँस का दउरा व सूप
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs">
                  🥥 16+ अर्घ्य फल व द्रव्य
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs">
                  🌾 ठेकुआ व कसार सामग्री
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs">
                  🪔 दीप, कलश व घाट सामग्री
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="shrink-0 flex sm:flex-col justify-end">
              <button
                type="button"
                onClick={() => onNavigate('chhath-samagri')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>{homeText.samagriCardBtn}</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Ghats */}
      <section id="ghats" className="container-custom max-w-5xl mx-auto px-1 sm:px-4 scroll-mt-24">
        <GhatFinder />
      </section>

      {/* Pakwan & Prasad Compact Intro Card */}
      <section id="prasad" className="container-custom max-w-5xl mx-auto px-1 sm:px-4 scroll-mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/25 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-500/30">
                <Utensils className="w-3.5 h-3.5" />
                <span>{homeText.prasadCardPill}</span>
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                {homeText.prasadCardTitle}
              </h2>
              <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                {homeText.prasadCardSub}
              </p>
              
              {/* Quick Pakwan feature pills */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
                <button
                  type="button"
                  onClick={() => onNavigate('thekua-recipe')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  🍪 पारंपरिक खस्ता ठेकुआ
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('thekua-recipe')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  🥣 खरना रसियाव (गुड़ खीर)
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('thekua-recipe')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  🟡 कसार के लड्डू (भुसवा)
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('thekua-recipe')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  🎋 ईख व ऋतु फल
                </button>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 flex items-center gap-1.5 font-bold shadow-2xs">
                  📹 वीडियो प्लेलिस्ट उपलब्ध
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="shrink-0 flex sm:flex-col justify-end">
              <button
                type="button"
                onClick={() => onNavigate('thekua-recipe')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>{homeText.prasadCardBtn}</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mantra & Aarti Compact Intro Card */}
      <section id="aarti" className="container-custom max-w-5xl mx-auto px-1 sm:px-4 scroll-mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/25 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-500/30">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-diya-flicker" />
                <span>{homeText.mantraCardPill}</span>
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                {homeText.mantraCardTitle}
              </h2>
              <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                {homeText.mantraCardSub}
              </p>
              
              {/* Quick Mantra feature pills */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
                <button
                  type="button"
                  onClick={() => onNavigate('aarti')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  🌅 सूर्य अर्घ्य महामंत्र
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('aarti')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  🪔 षष्ठी देवी ध्यान मंत्र
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('aarti')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  ☀️ सूर्य गायत्री 108 जप
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('aarti')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  📜 आदित्य हृदय स्तोत्र
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('aarti')}
                  className="px-3 py-1 rounded-xl bg-white/80 dark:bg-stone-900/80 hover:bg-amber-500/20 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  🔔 संपूर्ण पावन आरती
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <div className="shrink-0 flex sm:flex-col justify-end">
              <button
                type="button"
                onClick={() => onNavigate('aarti')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>{homeText.mantraCardBtn}</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Chhath Music Studio (shown when not shown at top) */}
      {!activeSearchQuery && (
        <section id="music" className="w-full max-w-6xl mx-auto px-0 sm:px-4 scroll-mt-24 space-y-6">
          <SongsSection initialQuery={initialQuery} />
        </section>
      )}

      {/* Trust & Safety Section */}
      <section className="container-custom max-w-5xl mx-auto px-1 sm:px-4">
        <GhatSafetySection />

        {/* Data Source & Last Updated Box */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400 font-mukta">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>{homeText.trustSource}</strong>
            </span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-500 font-mono">
            {homeText.geoBased}
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="container-custom max-w-5xl mx-auto px-1 sm:px-4">
        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span>{homeText.communityTitle}</span>
              </h3>
              <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                {homeText.communitySub}
              </p>
            </div>

            <button
              onClick={() => onNavigate('explore-detailed')}
              className="px-4 py-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta flex items-center gap-1.5 transition-all"
            >
              <span>{homeText.exploreAllBtn}</span>
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
