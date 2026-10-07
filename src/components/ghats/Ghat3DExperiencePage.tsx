import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Droplets,
  Share2,
  Heart,
  Search,
  X,
  ExternalLink,
  Film,
  Camera,
  Tv,
  Layers,
  Sun,
  Sunset,
  Moon,
  Maximize2,
  ChevronRight,
  Info,
  Check,
  RotateCcw,
  Eye,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';
import { sacredAudio } from '../../utils/sacredAudioEngine';
import { searchYouTubeVideos, YouTubeSearchSong } from '../../services/youtubeSearchService';

interface Ghat3DExperiencePageProps {
  onNavigate?: (tab: string) => void;
}

export type VideoCategory =
  | 'all'
  | 'rituals'
  | 'ghats'
  | 'thekua'
  | 'kosi'
  | 'drone'
  | 'songs';

export interface VisualChhathVideo {
  id: string;
  youtubeId: string;
  title: string;
  subtitle: string;
  category: VideoCategory;
  categoryLabel: string;
  duration: string;
  quality: '4K ULTRA HD' | '1080p HD';
  location: string;
  state: string;
  description: string;
  culturalInsight: string;
  badge?: string;
  featured?: boolean;
}

// ============================================================================
// CURATED REAL HD / 4K CHHATH PUJA VISUAL ARCHIVE
// Real footage: No animations, no synthetic 3D dots. Authentic reality of Chhath.
// ============================================================================
const REAL_CHHATH_ARCHIVE: VisualChhathVideo[] = [
  // --- 1. FEATURED / REAL GHAT SPECTACLE ---
  {
    id: 'patna-sandhya-4k',
    youtubeId: 'u0nOfHGb5FQ',
    title: 'पटना गंगा घाट संध्या अर्घ्य 4K विहंगम दृश्य',
    subtitle: 'लाखों दीपों व गंगा जल में खड़े व्रतियों का महासंगम',
    category: 'ghats',
    categoryLabel: 'पावन घाट दर्शन',
    duration: '0:35',
    quality: '4K ULTRA HD',
    location: 'कलेक्ट्रेट व मरीन ड्राइव घाट, पटना',
    state: 'बिहार',
    description: 'गंगा के पावन तट पर लाखों व्रती कमर तक जल में खड़े होकर अस्ताचलगामी भगवान सूर्य को अर्घ्य अर्पित करते हैं। पूरे घाट पर दीपों की अविरल माला जगमगाती है।',
    culturalInsight: 'षष्ठी के दिन डूबते सूर्य को प्रथम अर्घ्य दिया जाता है, जो यह संदेश देता है कि कृतज्ञ समाज ढलते सूर्य को भी नमन करता है।',
    badge: 'मुख्य आकर्षण • 4K',
    featured: true
  },
  {
    id: 'patna-digha-ghat-4k',
    youtubeId: 'dZr4KPbBjNo',
    title: 'दीघा पाटीपुल घाट संध्या अर्घ्य लाइव दृश्य',
    subtitle: 'विशाल रेतीले तट पर ईख के मंडप और अखंड दीप',
    category: 'ghats',
    categoryLabel: 'पावन घाट दर्शन',
    duration: '0:35',
    quality: '1080p HD',
    location: 'दीघा घाट 93, पटना',
    state: 'बिहार',
    description: 'गंगा सेतु के निकट फैले विशाल रेतीले तट पर हजारों परिवार अपने-अपने ईख के मंडप सजाकर सूर्य देव के आगमन व विदाई की साक्षी बनते हैं।',
    culturalInsight: 'दीघा का रेतीला मैदान प्रकृति के खुले आंगन में स्वच्छता और श्रद्धा का अनुपम उदाहरण प्रस्तुत करता है।',
    badge: 'पटना विशाल घाट'
  },
  {
    id: 'varanasi-assi-ghat-hd',
    youtubeId: 'w9AiKa0gGMs',
    title: 'काशी अस्सी घाट पर छठ महापर्व व संध्या आरती',
    subtitle: 'प्राचीन अर्धचंद्राकार पाषाण सीढ़ियों पर दीपदान',
    category: 'ghats',
    categoryLabel: 'पावन घाट दर्शन',
    duration: '0:42',
    quality: '1080p HD',
    location: 'अस्सी व दशाश्वमेध घाट, वाराणसी',
    state: 'उत्तर प्रदेश',
    description: 'भगवान शिव की नगरी काशी में गंगा किनारे छठ पूजा के दौरान संध्या अर्घ्य और वैदिक गंगा आरती का अद्भुत संगम देखने को मिलता है।',
    culturalInsight: 'काशी के घाटों पर छठ महापर्व का दृश्य सनातन संस्कृति की अखंड परंपरा को दर्शाता है।',
    badge: 'काशी महाआरती संगम'
  },
  {
    id: 'surya-mandir-aurangabad',
    youtubeId: 'qFwoGr1ex_g',
    title: 'देव सूर्य मंदिर व पवित्र सूर्य कुंड दर्शन',
    subtitle: 'पश्चिमाभिमुख प्राचीन सूर्य मंदिर में अर्घ्य अनुष्ठान',
    category: 'ghats',
    categoryLabel: 'पावन घाट दर्शन',
    duration: '0:42',
    quality: '1080p HD',
    location: 'देव सूर्य मंदिर, औरंगाबाद',
    state: 'बिहार',
    description: 'त्रेतायुगीन पश्चिमाभिमुख सूर्य मंदिर के पावन कुंड में लाखों श्रद्धालु मनोकामना पूर्ति हेतु अर्घ्य अर्पित करते हैं।',
    culturalInsight: 'देव का सूर्य मंदिर विश्व का एकमात्र पश्चिमाभिमुख सूर्य मंदिर है जहां छठ पूजा का फल सहस्र गुना माना जाता है।',
    badge: 'प्राचीन ऐतिहासिक तीर्थ'
  },

  // --- 2. 4-DAY REAL RITUALS (चारों दिन की साक्षात पूजा विधि) ---
  {
    id: 'day1-nahay-khay-real',
    youtubeId: 's256QAoPt4I',
    title: 'पहला दिन: नहाय-खाय पवित्र गंगा स्नान व कद्दू-भात',
    subtitle: 'पवित्रता का संकल्प और सात्विक प्रसाद निर्माण',
    category: 'rituals',
    categoryLabel: '4-दिवसीय विधि',
    duration: '0:40',
    quality: '1080p HD',
    location: 'समस्तीपुर व पटना',
    state: 'बिहार',
    description: 'छठ का पहला पावन दिन नहाय-खाय। प्रातः गंगा नदी में पवित्र स्नान के पश्चात मिट्टी के चूल्हे पर शुद्ध घी व सेंधा नमक से चने की दाल और कद्दू-भात बनता है।',
    culturalInsight: 'कद्दू जल तत्व का प्रतीक है जो शरीर को शीतलता और 36 घंटे के निर्जला उपवास के लिए आवश्यक ऊर्जा प्रदान करता है।',
    badge: 'दिवस 1 • नहाय-खाय'
  },
  {
    id: 'day2-kharna-real',
    youtubeId: 'GYAFUlc6b54',
    title: 'दूसरा दिन: खरना — मिट्टी के चूल्हे पर रसियाव खीर व रोटी',
    subtitle: 'शांत एकांत में नैवेद्य अर्पण व 36 घंटे अखंड निर्जला व्रत आरंभ',
    category: 'rituals',
    categoryLabel: '4-दिवसीय विधि',
    duration: '0:32',
    quality: '1080p HD',
    location: 'गया व दरभंगा',
    state: 'बिहार',
    description: 'कार्तिक शुक्ल पंचमी की शाम व्रती दिनभर उपवास के बाद मिट्टी के नए चूल्हे पर आम की लकड़ी से गुड़ व गाय के दूध की खीर (रसियाव) और घी चुपड़ी रोटी बनाते हैं।',
    culturalInsight: 'खरना का अर्थ है शुद्धिकरण। इस प्रसाद को ग्रहण करने के बाद व्रती का 36 घंटे का अखंड निर्जला व्रत प्रारंभ होता है।',
    badge: 'दिवस 2 • खरना'
  },
  {
    id: 'day3-sandhya-arghya-real',
    youtubeId: 'TN7j4Fojlqo',
    title: 'तीसरा दिन: संध्या अर्घ्य — अस्ताचलगामी सूर्य को प्रथम अर्घ्य',
    subtitle: 'दउरा व सूप लेकर गंगा जल में खड़े व्रतियों की साधना',
    category: 'rituals',
    categoryLabel: '4-दिवसीय विधि',
    duration: '0:36',
    quality: '4K ULTRA HD',
    location: 'पटना गंगा रिवरफ्रंट',
    state: 'बिहार',
    description: 'कार्तिक शुक्ल षष्ठी की संध्या। समस्त परिवार सिर पर दउरा लेकर बाजे-गाजे के साथ घाट पहुंचते हैं। सूप में ठेकुआ, मौसमी फल और दीप रखकर ढलते सूर्य को अर्घ्य दिया जाता है।',
    culturalInsight: 'दुनिया उगते को सलाम करती है, किंतु छठ महापर्व सर्वप्रथम ढलते सूर्य को प्रणाम कर कृतज्ञता का पाठ पढ़ाता है।',
    badge: 'दिवस 3 • संध्या अर्घ्य'
  },
  {
    id: 'day4-usha-arghya-real',
    youtubeId: '3XQDVtg2aIA',
    title: 'चौथा दिन: उषा अर्घ्य व पारण — उदीयमान सूर्य को प्रातः अर्घ्य',
    subtitle: 'शीतल जल में भोर की प्रतीक्षा और महाव्रत का पूर्ण समापन',
    category: 'rituals',
    categoryLabel: '4-दिवसीय विधि',
    duration: '0:45',
    quality: '4K ULTRA HD',
    location: 'मुजफ्फरपुर व पटना घाट',
    state: 'बिहार',
    description: 'सप्तमी की ब्रह्मबेला (प्रातः 4 बजे) में व्रती शीतल जल में उतरते हैं। जैसे ही पूर्व दिशा में लालिमा फूटती है, कच्चे दूध व गंगाजल से उदीयमान सूर्य को अर्घ्य दिया जाता है।',
    culturalInsight: 'उषा अर्घ्य के बाद व्रती अदरक, गुड़ और कच्चे चने से व्रत का पारण करते हैं और सभी को महाप्रसाद बांटते हैं।',
    badge: 'दिवस 4 • उषा अर्घ्य'
  },

  // --- 3. THEKUA & MAHAPRASAD (ठेकुआ निर्माण व महाप्रसाद) ---
  {
    id: 'thekua-making-village',
    youtubeId: 'Jegu3rAfrHY',
    title: 'काठ के पारंपरिक सांचे पर शुद्ध ठेकुआ महाप्रसाद निर्माण',
    subtitle: 'गेहूं का आटा, देसी घी, गुड़ व मिट्टी का चूल्हा',
    category: 'thekua',
    categoryLabel: 'ठेकुआ व महाप्रसाद',
    duration: '0:30',
    quality: '1080p HD',
    location: 'ग्रामीण बिहार रसोई',
    state: 'बिहार',
    description: 'लकड़ी के नक्काशीदार सांचे पर हाथ से दबाकर बने ठेकुआ। आम की सूखी लकड़ी और गाय के शुद्ध घी में तले जाने वाला छठ का सर्वोपरि प्रसाद।',
    culturalInsight: 'ठेकुआ बनाते समय पूरी शुचिता और पवित्रता का पालन होता है; इसे बनाने वाले भी स्नान कर नए वस्त्र धारण करते हैं।',
    badge: 'पारंपरिक ठेकुआ'
  },
  {
    id: 'daura-sup-sajawat',
    youtubeId: 'SsQEyUz8l2E',
    title: 'बांस के दउरा व पीतल सूप की सात्विक सजावट',
    subtitle: 'ठेकुआ, केला, नारियल, सुथनी, मूली व हल्दी गांठ का श्रृंगार',
    category: 'thekua',
    categoryLabel: 'ठेकुआ व महाप्रसाद',
    duration: '0:42',
    quality: '1080p HD',
    location: 'वाराणसी व छपरा',
    state: 'बिहार/यूपी',
    description: 'कांच ही बांस के बहंगिया और दउरा में प्रकृति की समस्त उपजों को सलीके से सजाया जाता है। इसमें कोई भी कृत्रिम वस्तु नहीं होती।',
    culturalInsight: 'दउरा में वही फल और अन्न रखे जाते हैं जो किसान की मेहनत और प्रकृति के साक्षात वरदान होते हैं।',
    badge: 'दउरा व सूप'
  },

  // --- 4. KOSI BHARAI & TRADITIONS (कोसी भराई व परंपराएं) ---
  {
    id: 'kosi-bharai-night-vigil',
    youtubeId: 'GaU5JxThjHY',
    title: 'पावन कोसी भराई अनुष्ठान — रातभर दीपों का जागरण',
    subtitle: '5 गन्ने का मंडप, 24 मिट्टी के दीप और पारंपरिक कोसी गीत',
    category: 'kosi',
    categoryLabel: 'कोसी व परंपराएं',
    duration: '0:38',
    quality: '1080p HD',
    location: 'दरभंगा व मधुबनी',
    state: 'बिहार',
    description: 'मनोकामना पूर्ण होने पर आंगन या घाट पर मिट्टी के हाथी व कलश के चारों ओर पांच गन्नों का मंडप बनाकर 24 दीप जलाए जाते हैं और रातभर महिलाएं गीत गाती हैं।',
    culturalInsight: 'कोसी भराई संतान सुख, आरोग्य और कठिन विपदा टलने पर देवी षष्ठी के प्रति सर्वोच्च कृतज्ञता का अनुष्ठान है।',
    badge: 'कोसी भराई'
  },
  {
    id: 'daura-on-head-barefoot',
    youtubeId: 'pe8IZ2DlwNI',
    title: 'सिर पर दउरा उठाकर नंगे पांव घाट यात्रा व घर वापसी',
    subtitle: 'श्रद्धा और समर्पण का वह दृश्य जो आंखें नम कर दे',
    category: 'kosi',
    categoryLabel: 'कोसी व परंपराएं',
    duration: '0:48',
    quality: '1080p HD',
    location: 'पटना व बक्सर',
    state: 'बिहार',
    description: 'परिवार के मुखिया या युवा सिर पर भारी दउरा उठाए नंगे पांव मीलों चलकर गंगा घाट पहुंचते हैं। रास्ते भर लोग उनके चरण स्पर्श कर आशीर्वाद लेते हैं।',
    culturalInsight: 'छठ पूजा में कोई छोटा या बड़ा नहीं होता; हर वर्ग का व्यक्ति सिर पर दउरा उठाकर प्रकृति के प्रति नतमस्तक होता है।',
    badge: 'छठ समर्पण'
  },

  // --- 5. DRONE AERIAL OVERVIEWS (4K ड्रोन विहंगम दृश्य) ---
  {
    id: 'patna-drone-overview-4k',
    youtubeId: '3wTOA1GkVf0',
    title: 'पटना गंगा रिवरफ्रंट 4K ड्रोन विहंगम दर्शन',
    subtitle: 'किलोमीटरों तक फैला दीपों और श्रद्धालुओं का समंदर',
    category: 'drone',
    categoryLabel: 'ड्रोन दर्शन',
    duration: '0:35',
    quality: '4K ULTRA HD',
    location: 'गंगा पथ मरीन ड्राइव, पटना',
    state: 'बिहार',
    description: 'आसमान से लिए गए ड्रोन दृश्यों में गंगा नदी के दोनों किनारों पर लाखों दीपों की कतार और आस्था का महासागर दिखाई देता है।',
    culturalInsight: 'विश्व में ऐसा कोई दूसरा पर्व नहीं है जहां करोड़ों लोग एक साथ, बिना किसी पुरोहित के, नदी तट पर प्रकृति की प्रत्यक्ष पूजा करते हैं।',
    badge: '4K ड्रोन नजारा'
  },
  {
    id: 'buxar-ganga-drone',
    youtubeId: '2QFWCKQjRdM',
    title: 'बक्सर व पूर्वांचल गंगा तट 4K ड्रोन दृश्य',
    subtitle: 'प्राचीन महर्षि विश्वामित्र की पावन भूमि पर छठ महापर्व',
    category: 'drone',
    categoryLabel: 'ड्रोन दर्शन',
    duration: '0:35',
    quality: '1080p HD',
    location: 'रामरेखा घाट, बक्सर',
    state: 'बिहार',
    description: 'बक्सर के ऐतिहासिक रामरेखा घाट पर सूर्यास्त के समय गंगा की लहरों पर तैरते अनगिनत दीप और व्रतियों का भव्य समागम।',
    culturalInsight: 'रामरेखा घाट वह पावन स्थल है जहां भगवान श्रीराम और लक्ष्मण ने महर्षि विश्वामित्र के साथ गंगा पार की थी।',
    badge: 'पूर्वांचल ड्रोन'
  },

  // --- 6. LEGENDARY SACRED FOLK SONGS & HERITAGE (अमर लोकगीत) ---
  {
    id: 'sharda-sinha-bahangiya-classic',
    youtubeId: 'HnirJpqQKSU',
    title: 'कांच ही बांस के बहंगिया — पद्मभूषण शारदा सिन्हा',
    subtitle: 'जिस गीत के बिना छठ का कोई भी घाट अधूरा है',
    category: 'songs',
    categoryLabel: 'अमर लोकगीत',
    duration: '5:40',
    quality: '1080p HD',
    location: 'अमर सांस्कृतिक धरोहर',
    state: 'बिहार',
    description: 'पद्मभूषण शारदा सिन्हा जी के अमर कंठ से निकला यह लोकगीत छठ महापर्व का राष्ट्रीय प्रतीक बन चुका है।',
    culturalInsight: 'इस गीत में बांस, सूप, फल और दौरा की पवित्रता का ऐसा मार्मिक वर्णन है जो हर प्रवासी बिहारी को घर खींच लाता है।',
    badge: 'अमर स्वर • शारदा सिन्हा'
  },
  {
    id: 'anuradha-paudwal-ug-he-suruj',
    youtubeId: 'xi-hTKJeLag',
    title: 'उग हे सुरुज देव भइल अरघ के बेर — अनुराधा पौडवाल',
    subtitle: 'भोर की ठंड में जल में खड़े होकर सूर्य देव की प्रतीक्षा',
    category: 'songs',
    categoryLabel: 'अमर लोकगीत',
    duration: '0:48',
    quality: '1080p HD',
    location: 'उषा अर्घ्य अमृत ध्वनि',
    state: 'भारत',
    description: 'सप्तमी के प्रातःकाल जब व्रती ठंडे पानी में कांपते हुए भगवान भास्कर की एक किरण की प्रतीक्षा करते हैं, तब यह गीत गूंज उठता है।',
    culturalInsight: 'सूर्य देव से प्रत्यक्ष विनती कि हे दीनानाथ, अब अपनी लालिमा बिखेरिए और हमारे अर्घ्य को स्वीकार कीजिए।',
    badge: 'उषा अर्घ्य अमृत'
  },
  {
    id: 'sharda-sinha-pahile-pahil',
    youtubeId: 'Oj0sXD3OR8M',
    title: 'पहिले पहिल हम कईनी छठी मईया व्रत तोहार — शारदा सिन्हा',
    subtitle: 'प्रथम बार व्रत रखने वाले श्रद्धालु की भक्तिमय प्रार्थना',
    category: 'songs',
    categoryLabel: 'अमर लोकगीत',
    duration: '6:12',
    quality: '1080p HD',
    location: 'पारंपरिक भक्ति संग्रह',
    state: 'बिहार',
    description: 'जब कोई नई बहू या नया व्रती पहली बार छठ का महाकठिन व्रत उठाता है, तो छठी मईया से भूल-चूक क्षमा करने की यह मार्मिक प्रार्थना गाई जाती है।',
    culturalInsight: 'यह गीत छठ व्रत की कठिन तपस्या और मां के वात्सल्य की अटूट डोर का साक्षात संगीत है।',
    badge: 'छठी मईया वंदना'
  },
  {
    id: 'sharda-sinha-kelwa-ke-paat',
    youtubeId: 'izQSepgaL7E',
    title: 'केलवा के पात पर उगेलन सुरुज देव — शारदा सिन्हा',
    subtitle: 'केले के पत्तों पर सूर्य देव का प्रत्यक्ष तेज व आह्वान',
    category: 'songs',
    categoryLabel: 'अमर लोकगीत',
    duration: '4:50',
    quality: '1080p HD',
    location: 'सांस्कृतिक धरोहर',
    state: 'बिहार',
    description: 'प्रकृति और सूर्य के शाश्वत संबंध का सबसे कर्णप्रिय पारंपरिक छठ गीत।',
    culturalInsight: 'केला शुद्धता और पूर्णता का प्रतीक है जिसे छठ के दउरा में साबुत घौद के रूप में चढ़ाया जाता है।',
    badge: 'सूर्य आह्वान'
  }
];

// Available Filter Tabs
const FILTER_TABS: { key: VideoCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'सभी दर्शन (All)', icon: '🌟' },
  { key: 'rituals', label: '4-दिवसीय विधि (Rituals)', icon: '🌅' },
  { key: 'ghats', label: 'पावन घाट (Holy Ghats)', icon: '🌊' },
  { key: 'thekua', label: 'ठेकुआ व महाप्रसाद (Prasad)', icon: '🪔' },
  { key: 'kosi', label: 'कोसी व परंपराएं (Kosi)', icon: '🎋' },
  { key: 'drone', label: '4K ड्रोन दृश्य (Drone)', icon: '🛸' },
  { key: 'songs', label: 'अमर लोकगीत (Songs)', icon: '🎶' }
];

export const Ghat3DExperiencePage: React.FC<Ghat3DExperiencePageProps> = ({ onNavigate }) => {
  // Navigation
  const handleBack = () => {
    sacredAudio.stop();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.hash = '#home';
    }
  };

  // State
  const [activeCategory, setActiveCategory] = useState<VideoCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalVideo, setActiveModalVideo] = useState<VisualChhathVideo | null>(null);
  const [heroVideo, setHeroVideo] = useState<VisualChhathVideo>(REAL_CHHATH_ARCHIVE[0]);
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Digital Diya Offering State
  const [diyaModalOpen, setDiyaModalOpen] = useState<boolean>(false);
  const [diyaDevoteeName, setDiyaDevoteeName] = useState<string>('');
  const [diyaDevoteeWish, setDiyaDevoteeWish] = useState<string>('');
  const [diyaGhatChoice, setDiyaGhatChoice] = useState<string>('कलेक्ट्रेट घाट, पटना');
  const [floatedCount, setFloatedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chhath_real_floated_diyas');
      return saved ? parseInt(saved, 10) : 12;
    } catch {
      return 12;
    }
  });

  // Virtual Arghya Offering State
  const [arghyaModalOpen, setArghyaModalOpen] = useState<boolean>(false);
  const [arghyaCompleted, setArghyaCompleted] = useState<boolean>(false);

  // Liked Videos (Persistent in LocalStorage)
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('chhath_liked_videos');
      return saved ? new Set(JSON.parse(saved)) : new Set(['patna-sandhya-4k']);
    } catch {
      return new Set(['patna-sandhya-4k']);
    }
  });

  // Live YouTube Dynamic Search Results
  const [dynamicYtResults, setDynamicYtResults] = useState<YouTubeSearchSong[]>([]);
  const [isSearchingYt, setIsSearchingYt] = useState<boolean>(false);

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Toggle ambient temple audio
  const toggleAudio = () => {
    const active = sacredAudio.toggle();
    setIsAudioPlaying(active);
    if (active) {
      showToast('🔔 पावन गंगाजल व मंदिर घंटियों की ध्वनि सक्रिय');
    } else {
      showToast('ध्वनि बंद');
    }
  };

  // Toggle Like on Video
  const toggleLike = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedVideoIds((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) {
        next.delete(videoId);
        showToast('पसंद से हटाया गया');
      } else {
        next.add(videoId);
        showToast('❤️ आपकी पसंद में जोड़ा गया!');
      }
      try {
        localStorage.setItem('chhath_liked_videos', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Share Video Link
  const handleShareVideo = (video: VisualChhathVideo, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('🔗 वीडियो लिंक कॉपी किया गया!');
      }).catch(() => {
        showToast(`लिंक: ${shareUrl}`);
      });
    } else {
      showToast(`लिंक: ${shareUrl}`);
    }
  };

  // Diya Float Submit
  const handleDiyaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diyaDevoteeName.trim()) return;
    const newCount = floatedCount + 1;
    setFloatedCount(newCount);
    try {
      localStorage.setItem('chhath_real_floated_diyas', newCount.toString());
    } catch {
      // ignore
    }
    setDiyaModalOpen(false);
    showToast(`🪔 ${diyaDevoteeName} जी का दीप ${diyaGhatChoice} पर प्रवाहित हुआ!`);
    setDiyaDevoteeName('');
    setDiyaDevoteeWish('');
  };

  // Perform Virtual Arghya
  const triggerArghyaOffering = () => {
    setArghyaModalOpen(true);
    setArghyaCompleted(false);
    // Play sacred Vedic chime harmonic
    sacredAudio.playArghyaChime();
  };

  // Handle Search Input & Dynamic YouTube Query
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query || query.length < 3) {
      setDynamicYtResults([]);
      setIsSearchingYt(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingYt(true);
      try {
        const res = await searchYouTubeVideos(`Chhath Puja ${query} HD real video`);
        if (res && res.results && res.results.length > 0) {
          setDynamicYtResults(res.results.slice(0, 8));
        }
      } catch (err) {
        console.error('Dynamic search error:', err);
      } finally {
        setIsSearchingYt(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtered Archive Videos
  const filteredVideos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return REAL_CHHATH_ARCHIVE.filter((video) => {
      const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        video.title.toLowerCase().includes(q) ||
        video.subtitle.toLowerCase().includes(q) ||
        video.location.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        video.culturalInsight.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* ======================================================================
          TOAST ALERT
         ====================================================================== */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 border border-amber-500/50 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================================
          TOP APP HEADER (Edge-to-Edge Sticky Navigation)
         ====================================================================== */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-lg">
        {/* Left: Back & Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
            title="मुख्य पृष्ठ पर जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <h1 className="text-sm sm:text-base font-bold font-rozha text-amber-100 truncate">
                साक्षात छठ दर्शन
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider shrink-0 hidden xs:inline-block">
                Real 4K App
              </span>
            </div>
            <p className="text-[11px] text-stone-400 truncate hidden sm:block">
              चारों दिन की पूजा विधि, प्रसिद्ध पावन घाट, ठेकुआ व कोसी के वास्तविक HD वीडियो
            </p>
          </div>
        </div>

        {/* Right: Quick Sacred Actions & Audio Engine */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Audio Ambient Button */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              isAudioPlaying
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-stone-900 text-stone-300 hover:text-white border-stone-800'
            }`}
            title="गंगाजल व मंदिर ध्वनि"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span className="hidden md:inline">ध्वनि चालू</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden md:inline">ध्वनि</span>
              </>
            )}
          </button>

          {/* Diya Button */}
          <button
            type="button"
            onClick={() => setDiyaModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xs:inline">दीपदान ({floatedCount})</span>
            <span className="xs:hidden">दीप</span>
          </button>

          {/* Arghya Button */}
          <button
            type="button"
            onClick={triggerArghyaOffering}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">वर्चुअल अर्घ्य</span>
            <span className="sm:hidden">अर्घ्य</span>
          </button>
        </div>
      </header>

      {/* ======================================================================
          MAIN SCROLLABLE CONTENT BODY
         ====================================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 space-y-6">

        {/* ====================================================================
            HERO SPOTLIGHT CINEMA SHOWCASE (Main 4K Theater Feature)
           ==================================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-stone-900 shadow-2xl">
          <div className="relative aspect-video sm:aspect-21/9 w-full max-h-[460px] bg-black">
            {isHeroPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${heroVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={heroVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div 
                className="relative w-full h-full group cursor-pointer overflow-hidden"
                onClick={() => setIsHeroPlaying(true)}
              >
                {/* Real High-Res YouTube Thumbnail */}
                <img
                  src={`https://i.ytimg.com/vi/${heroVideo.youtubeId}/hqdefault.jpg`}
                  alt={heroVideo.title}
                  className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Ambient Cinematic Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-transparent hidden sm:block" />

                {/* Glowing Play Center Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/60 group-hover:scale-110 group-active:scale-95 transition-all">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-red-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    {heroVideo.quality}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-black/60 text-amber-300 border border-white/20 backdrop-blur-md">
                    📍 {heroVideo.location}
                  </span>
                </div>

                {/* Bottom Metadata & 1-Tap Play Bar */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="max-w-2xl">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                      {heroVideo.categoryLabel}
                    </span>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-rozha text-white mt-1 leading-tight drop-shadow-md">
                      {heroVideo.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                      {heroVideo.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHeroPlaying(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>अभी देखें (Play HD)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => toggleLike(heroVideo.id, e)}
                      className={`p-2.5 rounded-xl border backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
                        likedVideoIds.has(heroVideo.id)
                          ? 'bg-rose-500/30 border-rose-500 text-rose-400'
                          : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
                      }`}
                      title="पसंद करें"
                    >
                      <Heart className={`w-4 h-4 ${likedVideoIds.has(heroVideo.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleShareVideo(heroVideo, e)}
                      className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 backdrop-blur-md text-white transition-all active:scale-95 cursor-pointer"
                      title="शेयर करें"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================================
            INTERACTIVE SEARCH & CATEGORY PILL FILTER BAR
           ==================================================================== */}
        <section className="space-y-3">
          {/* Live Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खोजें: ठेकुआ विधि, पटना घाट, संध्या अर्घ्य, कोसी भराई, शारदा सिन्हा, 4K ड्रोन..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 focus:border-amber-500/60 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Smooth Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map((tab) => {
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ====================================================================
            LIVE YOUTUBE DYNAMIC SEARCH RESULTS (When devotee types a search query)
           ==================================================================== */}
        {searchQuery.trim().length >= 3 && (
          <section className="p-4 rounded-3xl bg-stone-900/80 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-200">
                  &ldquo;{searchQuery}&rdquo; के लाइव YouTube परिणाम ({dynamicYtResults.length})
                </h3>
              </div>
              {isSearchingYt && (
                <span className="text-[11px] text-amber-400 animate-pulse">खोज जारी है...</span>
              )}
            </div>

            {dynamicYtResults.length === 0 && !isSearchingYt ? (
              <p className="text-xs text-stone-400">कोई अतिरिक्त परिणाम नहीं मिला। कृपया नीचे संकलित वीडियो देखें।</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {dynamicYtResults.map((ytItem) => (
                  <div
                    key={ytItem.youtubeId}
                    onClick={() => {
                      setActiveModalVideo({
                        id: ytItem.youtubeId,
                        youtubeId: ytItem.youtubeId,
                        title: ytItem.title,
                        subtitle: ytItem.channelTitle,
                        category: 'all',
                        categoryLabel: 'लाइव सर्च दर्शन',
                        duration: ytItem.duration || '5:00',
                        quality: '1080p HD',
                        location: 'भारत • लाइव यूट्यूब',
                        state: 'बिहार/यूपी',
                        description: ytItem.description || ytItem.title,
                        culturalInsight: 'श्रद्धालुओं द्वारा साझा किया गया छठ महापर्व का पावन वीडियो।'
                      });
                    }}
                    className="group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={ytItem.thumbnailUrl}
                        alt={ytItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white">
                        {ytItem.duration || 'HD'}
                      </span>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-stone-200 line-clamp-2 group-hover:text-amber-300">
                        {ytItem.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-1 truncate">
                        {ytItem.channelTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ====================================================================
            SECTION 1: चारों दिन की साक्षात वीडियो विधि (THE 4-DAY RITUALS)
           ==================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'rituals') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🌅</span>
                  <span>चारों दिन की साक्षात पूजा विधि (4-Day Real Rituals)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  नहाय-खाय से उषा अर्घ्य पारण तक: देखें कैसे की जाती है वास्तविक छठ पूजा
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {REAL_CHHATH_ARCHIVE.filter((v) => v.category === 'rituals').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLiked={likedVideoIds.has(video.id)}
                  onPlay={() => setActiveModalVideo(video)}
                  onSetHero={() => {
                    setHeroVideo(video);
                    setIsHeroPlaying(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToggleLike={(e) => toggleLike(video.id, e)}
                  onShare={(e) => handleShareVideo(video, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION 2: प्रसिद्ध पावन घाट दर्शन (FAMOUS REAL GHATS IN 4K/HD)
           ==================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'ghats') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🌊</span>
                  <span>प्रसिद्ध पावन घाट दर्शन (Famous Sacred Ghats)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  पटना कलेक्ट्रेट, दीघा, काशी अस्सी घाट व देव सूर्य मंदिर का साक्षात दृश्य
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {REAL_CHHATH_ARCHIVE.filter((v) => v.category === 'ghats').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLiked={likedVideoIds.has(video.id)}
                  onPlay={() => setActiveModalVideo(video)}
                  onSetHero={() => {
                    setHeroVideo(video);
                    setIsHeroPlaying(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToggleLike={(e) => toggleLike(video.id, e)}
                  onShare={(e) => handleShareVideo(video, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION 3: ठेकुआ निर्माण व महाप्रसाद (AUTHENTIC THEKUA & PRASAD)
           ==================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'thekua') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🪔</span>
                  <span>ठेकुआ निर्माण व महाप्रसाद (Authentic Thekua Making)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  काठ के सांचे, मिट्टी के चूल्हे और देसी घी पर बने ठेकुआ महाप्रसाद का साक्षात वीडियो
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              {REAL_CHHATH_ARCHIVE.filter((v) => v.category === 'thekua').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLiked={likedVideoIds.has(video.id)}
                  onPlay={() => setActiveModalVideo(video)}
                  onSetHero={() => {
                    setHeroVideo(video);
                    setIsHeroPlaying(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToggleLike={(e) => toggleLike(video.id, e)}
                  onShare={(e) => handleShareVideo(video, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION 4: कोसी भराई व जीवंत परंपराएं (KOSI BHARAI & TRADITIONS)
           ==================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'kosi') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🎋</span>
                  <span>कोसी भराई व जीवंत परंपराएं (Kosi Bharai & Traditions)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  5 गन्नों का मंडप, 24 अखंड दीप और सिर पर दउरा उठाकर नंगे पांव घाट यात्रा
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              {REAL_CHHATH_ARCHIVE.filter((v) => v.category === 'kosi').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLiked={likedVideoIds.has(video.id)}
                  onPlay={() => setActiveModalVideo(video)}
                  onSetHero={() => {
                    setHeroVideo(video);
                    setIsHeroPlaying(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToggleLike={(e) => toggleLike(video.id, e)}
                  onShare={(e) => handleShareVideo(video, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION 5: 4K ड्रोन विहंगम दृश्य (BIP-DRONE AERIAL OVERVIEWS)
           ==================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'drone') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🛸</span>
                  <span>4K ड्रोन विहंगम दृश्य (Aerial 4K Drone Overviews)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  आसमान से देखें गंगा तट पर लाखों दीपों और करोड़ों श्रद्धालुओं का अलौकिक नजारा
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              {REAL_CHHATH_ARCHIVE.filter((v) => v.category === 'drone').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLiked={likedVideoIds.has(video.id)}
                  onPlay={() => setActiveModalVideo(video)}
                  onSetHero={() => {
                    setHeroVideo(video);
                    setIsHeroPlaying(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToggleLike={(e) => toggleLike(video.id, e)}
                  onShare={(e) => handleShareVideo(video, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION 6: अमर छठ लोकगीत व भक्ति धारा (IMMORTAL FOLK SONGS)
           ==================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'songs') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-rozha text-amber-200 flex items-center gap-2">
                  <span>🎶</span>
                  <span>अमर छठ लोकगीत (Legendary Chhath Songs with Real Video)</span>
                </h3>
                <p className="text-xs text-stone-400">
                  पद्मभूषण शारदा सिन्हा व अनुराधा पौडवाल की अमर आवाज में पारंपरिक छठ महिमा
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {REAL_CHHATH_ARCHIVE.filter((v) => v.category === 'songs').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isLiked={likedVideoIds.has(video.id)}
                  onPlay={() => setActiveModalVideo(video)}
                  onSetHero={() => {
                    setHeroVideo(video);
                    setIsHeroPlaying(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToggleLike={(e) => toggleLike(video.id, e)}
                  onShare={(e) => handleShareVideo(video, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
            SACRED ENGAGEMENT BANNER: डिजिटल दीपदान व अर्घ्य संकल्प
           ==================================================================== */}
        <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-950/70 via-stone-900 to-stone-900 border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div className="max-w-xl space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🪔 पावन गंगा दीपदान अनुष्ठान
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-rozha text-amber-100">
                मां गंगा की पावन धारा में अपना दीप प्रज्वलित करें
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                अब तक कुल <strong className="text-amber-400">{floatedCount}</strong> श्रद्धालुओं ने अपने परिवार के सुख, शांति व आरोग्य हेतु दीपदान संकल्प लिया है।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setDiyaModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>अभी दीप प्रवाहित करें</span>
              </button>
              <button
                type="button"
                onClick={triggerArghyaOffering}
                className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Droplets className="w-4 h-4 fill-current" />
                <span>सूर्य देव को अर्घ्य दें</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ======================================================================
          FULLSCREEN VIDEO THEATER MODAL (When any card is clicked)
         ====================================================================== */}
      {activeModalVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalVideo(null)}
        >
          <div 
            className="w-full max-w-4xl bg-stone-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Video Header */}
            <div className="px-4 py-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {activeModalVideo.quality}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate font-rozha">
                  {activeModalVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded 16:9 YouTube Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeModalVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={activeModalVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Details & Cultural Insights */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-amber-100 font-rozha">
                    {activeModalVideo.title}
                  </h4>
                  <p className="text-xs text-amber-300/80 font-medium">
                    📍 {activeModalVideo.location} • {activeModalVideo.categoryLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeModalVideo.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      likedVideoIds.has(activeModalVideo.id)
                        ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedVideoIds.has(activeModalVideo.id) ? 'fill-current' : ''}`} />
                    <span>{likedVideoIds.has(activeModalVideo.id) ? 'पसंद किया' : 'पसंद करें'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareVideo(activeModalVideo)}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>शेयर</span>
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>यूट्यूब पर देखें</span>
                  </a>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activeModalVideo.description}
              </p>

              {activeModalVideo.culturalInsight && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>आध्यात्मिक व सांस्कृतिक महत्व:</span>
                  </p>
                  <p className="leading-relaxed">{activeModalVideo.culturalInsight}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          FLOAT A DIYA MODAL (डिजिटल दीपदान)
         ====================================================================== */}
      {diyaModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setDiyaModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <h3 className="text-base font-bold text-amber-100 font-rozha">
                  गंगा में पावन दीप प्रवाहित करें
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDiyaModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDiyaSubmit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  श्रद्धालु / परिवार का नाम *
                </label>
                <input
                  type="text"
                  value={diyaDevoteeName}
                  onChange={(e) => setDiyaDevoteeName(e.target.value)}
                  placeholder="उदा. राहुल, अंजलि व समस्त परिवार"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  पावन घाट चयन करें
                </label>
                <select
                  value={diyaGhatChoice}
                  onChange={(e) => setDiyaGhatChoice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="कलेक्ट्रेट घाट, पटना">कलेक्ट्रेट घाट, पटना</option>
                  <option value="दीघा घाट, पटना">दीघा पाटीपुल घाट, पटना</option>
                  <option value="अस्सी घाट, वाराणसी">अस्सी घाट, वाराणसी</option>
                  <option value="दशाश्वमेध घाट, वाराणसी">दशाश्वमेध घाट, वाराणसी</option>
                  <option value="देव सूर्य कुंड, औरंगाबाद">देव सूर्य कुंड, औरंगाबाद</option>
                  <option value="हर की पौड़ी, हरिद्वार">हर की पौड़ी, हरिद्वार</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  मनोकामना या प्रार्थना (Prayer / Wish)
                </label>
                <textarea
                  value={diyaDevoteeWish}
                  onChange={(e) => setDiyaDevoteeWish(e.target.value)}
                  rows={2}
                  maxLength={120}
                  placeholder="समस्त परिवार के सुख, शांति व आरोग्य हेतु..."
                  className="w-full px-3.5 py-2 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                🪔 आपका दीप मां गंगा की पावन धारा पर प्रज्वलित होगा और छठी मईया की कृपा सदैव बनी रहेगी।
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>दीप प्रज्वलित कर प्रवाहित करें</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          VIRTUAL ARGHYA CEREMONY MODAL (वर्चुअल अर्घ्य अनुष्ठान)
         ====================================================================== */}
      {arghyaModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-300"
          onClick={() => setArghyaModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/90 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setArghyaModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Sun Emblem */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-2xl shadow-amber-500/50 mb-3 animate-pulse">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-3xl">
                ☀️
              </div>
            </div>

            <h3 className="font-rozha text-xl sm:text-2xl text-amber-200 mb-1">
              भगवान सूर्य को पावन अर्घ्य समर्पित
            </h3>
            <p className="text-xs text-amber-400/90 font-medium mb-3">
              गायत्री मंत्र व दुग्ध-जल अर्घ्य अनुष्ठान
            </p>

            <div className="p-3.5 rounded-2xl bg-stone-800/90 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-mono leading-relaxed mb-4">
              &ldquo;ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥&rdquo;
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mb-5">
              छठी मईया व प्रत्यक्ष देव भगवान सूर्य की कृपा से आपके जीवन से समस्त अंधकार, रोग व कष्ट दूर हों और अखंड सौभाग्य की प्राप्ति हो।
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setArghyaModalOpen(false);
                  showToast('✨ अर्घ्य अर्पण सफल हुआ! जय छठी मईया!');
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer"
              >
                प्रणाम स्वीकार करें (जय सूर्य देव)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ============================================================================
// VIDEO CARD COMPONENT (Mobile-Optimized Edge-to-Edge Visual Card)
// ============================================================================
interface VideoCardProps {
  video: VisualChhathVideo;
  isLiked: boolean;
  onPlay: () => void;
  onSetHero: () => void;
  onToggleLike: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isLiked,
  onPlay,
  onSetHero,
  onToggleLike,
  onShare
}) => {
  return (
    <div
      onClick={onPlay}
      className="group rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/90 hover:border-amber-500/50 transition-all duration-300 cursor-pointer shadow-lg flex flex-col hover:-translate-y-0.5"
    >
      {/* 16:9 Thumbnail Header */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <img
          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Center Hover Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all">
          <div className="w-11 h-11 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-black/70 text-amber-300 border border-white/20 backdrop-blur-md">
            {video.quality}
          </span>
          {video.badge && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/90 text-stone-950">
              {video.badge}
            </span>
          )}
        </div>

        {/* Bottom Time & Location */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-bold text-white">
          <span className="flex items-center gap-1 truncate max-w-[70%]">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{video.location}</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-black/80 font-mono">
            {video.duration}
          </span>
        </div>
      </div>

      {/* Card Content & Meta */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 font-rozha leading-snug">
            {video.title}
          </h4>
          <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {video.subtitle}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wide">
            {video.categoryLabel}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleLike}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLiked ? 'text-rose-400' : 'text-stone-400 hover:text-white'
              }`}
              title="पसंद करें"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onShare}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
