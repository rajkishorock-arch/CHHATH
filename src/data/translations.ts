import { Language } from '../types';

export interface TranslationDict {
  // Core Brand & Site
  siteTitle: string;
  siteSubtitle: string;
  heroHeading: string;
  heroSubheading: string;
  heroBadge: string;
  exploreChhath: string;
  listenSongs: string;
  pauseSong: string;
  countdownTitle: string;
  daysRemaining: string;
  hours: string;
  minutes: string;
  seconds: string;
  nahayKhay: string;
  kharna: string;
  sandhyaArghya: string;
  ushaArghya: string;

  // Nav items
  navTimeline: string;
  navArghya: string;
  navSongs: string;
  navVidhi: string;
  navSamagri: string;
  navPrasad: string;
  navGhats: string;
  navWishes: string;
  navQuiz: string;
  navKids: string;

  // Timeline section
  timelineBadge: string;
  timelineTitle: string;
  timelineSubtitle: string;
  daySignificance: string;
  dateAndTithi: string;
  meaningAndSignificance: string;
  coreObjective: string;
  ritualsAndRules: string;
  prasadAndDiet: string;
  nextDayBtn: string;

  // Arghya section
  arghyaTimeTitle: string;
  arghyaSubtitle: string;
  arghyaBadge: string;
  sunsetTime: string;
  sunriseTime: string;
  selectedLocation: string;
  riverBank: string;

  // Songs section
  songsBadge: string;
  songsSectionTitle: string;
  songsSubtitle: string;
  tabAllSongs: string;
  tabPlaylists: string;
  tabCustomLink: string;
  searchSongPlaceholder: string;
  playSongBtn: string;
  playingNow: string;

  // Vidhi section
  vidhiBadge: string;
  vidhiSectionTitle: string;
  vidhiSubtitle: string;
  beginnerGuideTitle: string;
  beginnerGuideSubtitle: string;

  // Samagri section
  samagriBadge: string;
  samagriTitle: string;
  samagriSubtitle: string;
  prepProgress: string;
  printBtn: string;
  downloadBtn: string;
  catAll: string;
  catVessels: string;
  catFruits: string;
  catPrasad: string;
  catRituals: string;

  // Prasad section
  prasadBadge: string;
  prasadTitle: string;
  prasadSubtitle: string;
  thekuaRecipeBtn: string;

  // Katha section
  kathaBadge: string;
  kathaTitle: string;
  kathaSubtitle: string;

  // Mantra section
  mantraBadge: string;
  mantraTitle: string;
  mantraSubtitle: string;

  // Ghat section
  ghatBadge: string;
  ghatFinderTitle: string;
  ghatSubtitle: string;
  searchGhatPlaceholder: string;

  // Wishes section
  wishesBadge: string;
  wishesTitle: string;
  wishesSubtitle: string;
  greetingCardTitle: string;

  // Gallery, Quiz, Kids, Blog, Admin
  galleryTitle: string;
  quizTitle: string;
  kidsTitle: string;
  blogTitle: string;
  adminTitle: string;

  // Footer
  footerAbout: string;
  copyright: string;
}

export const translations: Record<Language, TranslationDict> = {
  hi: {
    siteTitle: "छठ महापर्व",
    siteSubtitle: "आस्था, श्रद्धा और सूर्य उपासना का महापर्व",
    heroHeading: "जय छठी मईया 🙏",
    heroSubheading: "लोक आस्था, पवित्रता और सूर्य उपासना का पावन महापर्व — बिहार, झारखंड और पूर्वांचल की अमिट सांस्कृतिक विरासत",
    heroBadge: "कार्तिक शुक्ल षष्ठी • लोक आस्था का महापर्व • 2026",
    exploreChhath: "छठ दर्शन करें",
    listenSongs: "छठ गीत सुनें 🎵",
    pauseSong: "गीत रोकें (Pause)",
    countdownTitle: "छठ महापर्व में अब इतना समय बाकी है",
    daysRemaining: "दिन शेष",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
    nahayKhay: "नहाय खाय",
    kharna: "खरना",
    sandhyaArghya: "संध्या अर्घ्य",
    ushaArghya: "उषा अर्घ्य",

    navTimeline: "नहाय खाय व 4 दिन",
    navArghya: "अर्घ्य समय",
    navSongs: "छठ गीत",
    navVidhi: "पूजा विधि",
    navSamagri: "सामग्री सूची",
    navPrasad: "ठेकुआ व प्रसाद",
    navGhats: "छठ घाट",
    navWishes: "शुभकामनाएं",
    navQuiz: "क्विज",
    navKids: "बाल वाटिका",

    timelineBadge: "चार दिवसीय पावन महाव्रत",
    timelineTitle: "छठ महापर्व के चार पावन दिन",
    timelineSubtitle: "नहाय-खाय की शुद्धि से लेकर उषा अर्घ्य के पारण तक — 36 घंटे के अखंड निर्जला तप की संपूर्ण आध्यात्मिक यात्रा।",
    daySignificance: "दिवस का महात्म्य",
    dateAndTithi: "तारीख व तिथि:",
    meaningAndSignificance: "अर्थ एवं महत्व (Significance)",
    coreObjective: "साधना का मूल उद्देश्य:",
    ritualsAndRules: "मुख्य अनुष्ठान व नियम (Rituals & Process)",
    prasadAndDiet: "आहार व महाप्रसाद (Holy Prasad)",
    nextDayBtn: "अगले दिन का विवरण देखें (Next Day)",

    arghyaTimeTitle: "अर्घ्य का शुभ समय",
    arghyaSubtitle: "अपने शहर के अनुसार संध्या अर्घ्य (सूर्यास्त) एवं उषा अर्घ्य (सूर्योदय) का सटीक समय जानें।",
    arghyaBadge: "खगोलीय समय गणना (Astronomical Solar Timings)",
    sunsetTime: "संध्या अर्घ्य (सूर्यास्त)",
    sunriseTime: "उषा अर्घ्य (सूर्योदय)",
    selectedLocation: "चयनित छठ क्षेत्र",
    riverBank: "तट",

    songsBadge: "पावन छठ गीतों का अमृत रस",
    songsSectionTitle: "छठ पूजा के मधुर लोकगीत 🎵",
    songsSubtitle: "यूट्यूब पर कोई भी गीत या भजन लाइव खोजें, सम्पूर्ण प्लेलिस्ट बजाएं या अपना पसंदीदा लिंक तुरंत सुनें।",
    tabAllSongs: "पावन छठ गीत",
    tabPlaylists: "🎶 सम्पूर्ण छठ प्लेलिस्ट व जूकबॉक्स",
    tabCustomLink: "⚡ अपना मनपसंद लिंक बजाएं",
    searchSongPlaceholder: "गीत या गायक खोजें (उदा. पवन सिंह, शारदा सिन्हा, कांच ही बांस...)",
    playSongBtn: "गाना बजाएं (Play)",
    playingNow: "चल रहा है (Playing)",

    vidhiBadge: "वैदिक व प्रामाणिक नियम",
    vidhiSectionTitle: "छठ पूजा की संपूर्ण विधि",
    vidhiSubtitle: "छठ पूजा की संपूर्ण चरणबद्ध विधि — शुद्धता, सरलता और निष्ठा के साथ सूर्य देव और छठी मईया की आराधना।",
    beginnerGuideTitle: "पहली बार छठ व्रत कर रहे हैं? जानिए: \"पूजा कैसे करें?\"",
    beginnerGuideSubtitle: "सरल, सुगम और बुनियादी दिशानिर्देश नए व्रतियों और परिवारों के लिए",

    samagriBadge: "इंटरैक्टिव पूजा तैयारी",
    samagriTitle: "छठ पूजा सामग्री चेकलिस्ट 🪔",
    samagriSubtitle: "दउरा, सूप, फल, ठेकुआ सामग्री और पूजन द्रव्यों की संपूर्ण जांच सूची। सामग्री चेक करें और प्रिंट या डाउनलोड करें।",
    prepProgress: "तैयारी प्रगति:",
    printBtn: "प्रिंट (Print)",
    downloadBtn: "डाउनलोड (Download)",
    catAll: "समस्त सामग्री (All)",
    catVessels: "दउरा, सूप व पात्र",
    catFruits: "ऋतु फल, ईख व केला",
    catPrasad: "ठेकुआ व प्रसाद सामग्री",
    catRituals: "सिंदूर, गंगाजल व दीप द्रव्य",

    prasadBadge: "पवित्र नैवेद्य एवं स्वाद",
    prasadTitle: "छठ का पावन प्रसाद 🍪",
    prasadSubtitle: "गेहूं, देशी गुड़ और शुद्ध घी से बना अमृततुल्य ठेकुआ, रसियाव और ऋतु फलों का पावन नैवेद्य।",
    thekuaRecipeBtn: "पारंपरिक बिहारी ठेकुआ रेसिपी गाइड",

    kathaBadge: "पौराणिक एवं ऐतिहासिक आख्यान",
    kathaTitle: "छठ पूजा की पावन कथा 📖",
    kathaSubtitle: "ब्रह्मवैवर्त पुराण, महाभारत और रामायण से जुड़ी वे अमर कथाएं जो छठ महापर्व की अटूट महिमा को उजागर करती हैं।",

    mantraBadge: "वैदिक ऋचाएं एवं स्तुति",
    mantraTitle: "सूर्य देव एवं छठी मईया मंत्र व आरती 🙏",
    mantraSubtitle: "भगवान भुवन भास्कर और मां षष्ठी की कृपा प्राप्ति हेतु प्रामाणिक वैदिक मंत्र, स्तोत्र और पावन आरती।",

    ghatBadge: "पवित्र नदी तट व निर्देशिका",
    ghatFinderTitle: "नजदीकी छठ घाट खोजें 📍",
    ghatSubtitle: "पटना, भागलपुर, वाराणसी, रांची और अन्य शहरों के प्रमुख छठ घाटों की लाइव स्थिति, सुविधाएं व मार्ग खोजें।",
    searchGhatPlaceholder: "शहर, घाट का नाम या नदी खोजें (उदा. पटना, गंगा, दीघा...)",

    wishesBadge: "पारस्परिक सौहार्द एवं नेह",
    wishesTitle: "छठ महापर्व की मंगल शुभकामनाएं ❤️",
    wishesSubtitle: "छठ महापर्व के पावन अवसर पर अपने परिजनों, मित्रों और श्रद्धालुओं को भेजें भक्तिमय मंगलकामनाएं।",
    greetingCardTitle: "डिजिटल छठ बधाई पत्र बनाएं 🎴",

    galleryTitle: "छठ महापर्व दिव्य दर्शन (गैलरी) 📸",
    quizTitle: "छठ ज्ञानोत्थान क्विज 🧠",
    kidsTitle: "बच्चों के लिए छठ कथा 🧒",
    blogTitle: "छठ संस्कृति एवं धरोहर ✍️",
    adminTitle: "प्रबंधन डैशबोर्ड (Admin)",

    footerAbout: "छठ महापर्व डिजिटल सेवा ट्रस्ट — सूर्य उपासना और छठी मईया की पावन संस्कृति को जन-जन तक पहुंचाने का एक विनम्र प्रयास।",
    copyright: "सर्वाधिकार सुरक्षित। जय छठी मईया 🙏"
  },

  bho: {
    siteTitle: "छठ महापर्व",
    siteSubtitle: "आस्था, नेह आ सुरुज गोसांईं के उपासना के महापर्व",
    heroHeading: "जय छठी मईया 🙏",
    heroSubheading: "हमार लोक आस्था, नेह आ सुरुज देव के पावन बरत — भोजपुरिया माटी के सबसे पावन परब",
    heroBadge: "कार्तिक सुक्ल षष्ठी • लोक आस्था के महापर्व • 2026",
    exploreChhath: "छठ परब जानीं",
    listenSongs: "छठ गीत सुनीं 🎵",
    pauseSong: "गीत रोकीं (Pause)",
    countdownTitle: "छठ पूजा में एतना दिन बाकी बा",
    daysRemaining: "दिन बाचल बा",
    hours: "घंटा",
    minutes: "मिनट",
    seconds: "सेकंड",
    nahayKhay: "नहाय खाय",
    kharna: "खरना",
    sandhyaArghya: "सँझिया अरघ",
    ushaArghya: "भोरहरिया अरघ",

    navTimeline: "नहाय खाय आ 4 दिन",
    navArghya: "अरघ के समय",
    navSongs: "छठ गीत",
    navVidhi: "पूजा बिधि",
    navSamagri: "सामग्री",
    navPrasad: "ठेकुआ आ परसाद",
    navGhats: "छठ घाट",
    navWishes: "सुभकामना",
    navQuiz: "क्विज",
    navKids: "बबुआ-बच्ची",

    timelineBadge: "चार दिवसीय पावन महाबरत",
    timelineTitle: "छठ महापर्व के चार पावन दिन",
    timelineSubtitle: "नहाय-खाय के नेग से लेके भोरहरिया अरघ के पारन तक — 36 घंटा के अखंड निर्जला तप के पावन यात्रा।",
    daySignificance: "दिन के महातम",
    dateAndTithi: "तारीख आ तिथि:",
    meaningAndSignificance: "अरथ आ महत्व",
    coreObjective: "साधना के मूल मकसद:",
    ritualsAndRules: "मुख्य नेग-नेम आ नियम",
    prasadAndDiet: "अहार आ महापरसाद",
    nextDayBtn: "अगिला दिन के देखीं",

    arghyaTimeTitle: "अरघ देवे के सुभ घरी",
    arghyaSubtitle: "आपन सहर के हिसाब से सँझिया अरघ आ भोरहरिया अरघ के सही घरी जानीं।",
    arghyaBadge: "खगोलीय घरी गणना (Astronomical Solar Timings)",
    sunsetTime: "सँझिया अरघ (सुरुज डूबते घरी)",
    sunriseTime: "भोरहरिया अरघ (सुरुज उगते घरी)",
    selectedLocation: "चुनल छठ क्षेत्र",
    riverBank: "तीर",

    songsBadge: "पावन छठ गीतन के रस",
    songsSectionTitle: "छठ के मधुर पारंपरिक गीत 🎵",
    songsSubtitle: "यूट्यूब पर कवनो गीत लाइव खोजीं, पूरा प्लेलिस्ट बजाईं भा आपन लिंक तुरंत सुनीं।",
    tabAllSongs: "सगरी छठ गीत",
    tabPlaylists: "🎶 पूरा छठ प्लेलिस्ट व जूकबॉक्स",
    tabCustomLink: "⚡ आपन मनपसंद लिंक बजाईं",
    searchSongPlaceholder: "गीत भा गायक खोजीं (उदा. शारदा सिन्हा, पवन सिंह...)",
    playSongBtn: "गीत बजाईं (Play)",
    playingNow: "बजत बा (Playing)",

    vidhiBadge: "वैदिक आ सच्चा नेम-धरम",
    vidhiSectionTitle: "छठ पूजा के सगरी नेग-नेम आ बिधि",
    vidhiSubtitle: "छठ पूजा के सगरी बिधि-बिधान — सुद्धता, सरलता आ नेम से सुरुज देव के आराधना।",
    beginnerGuideTitle: "पहिले बेर छठ बरत कर रहल बानी? जानीं: \"पूजा कइसे करीं?\"",
    beginnerGuideSubtitle: "नयका बरतियन खातिर सीधा आ सरल नेम",

    samagriBadge: "पूजा तइयारी चेकलिस्ट",
    samagriTitle: "छठ सामग्री के चेकलिस्ट 🪔",
    samagriSubtitle: "दउरा, सूप, फल, ठेकुआ के सगरी सामग्री सूची। सामान चेक करीं आ डाउनलोड करीं।",
    prepProgress: "तइयारी प्रगति:",
    printBtn: "प्रिंट करीं",
    downloadBtn: "डाउनलोड करीं",
    catAll: "सगरी सामान",
    catVessels: "दउरा, सूप आ बरतन",
    catFruits: "ऋतु फल, ईख आ केला",
    catPrasad: "ठेकुआ आ परसाद सामान",
    catRituals: "सेंदुर, गंगाजल आ दिया बाती",

    prasadBadge: "पावन परसाद आ सवाद",
    prasadTitle: "छठ मइया के परसाद 🍪",
    prasadSubtitle: "गेहूं, देशी गुड़ आ घीव से बनल अमृत नियन ठेकुआ आ रसियाव के पावन परसाद।",
    thekuaRecipeBtn: "भोजपुरिया ठेकुआ बनावे के बिधि",

    kathaBadge: "पौराणिक आ ऐतिहासिक कथा",
    kathaTitle: "छठ बरत के पावन कथा 📖",
    kathaSubtitle: "पुराण, महाभारत आ रामायण से जुड़ल पावन कथा जे छठ के महिमा बतावेलीं।",

    mantraBadge: "वैदिक मंतर आ स्तुति",
    mantraTitle: "सुरुज देव आ छठी मइया के अरदास व आरती 🙏",
    mantraSubtitle: "भगवान सुरुज देव आ छठी मइया के किरपा खातिर वैदिक मंतर आ आरती।",

    ghatBadge: "पवित्र नदी घाट निर्देशिका",
    ghatFinderTitle: "आपन नजदीकी छठ घाट खोजीं 📍",
    ghatSubtitle: "पटना, भागलपुर, बनारस, रांची आ बाकी सहरन के प्रमुख छठ घाटन के जानकारी खोजीं।",
    searchGhatPlaceholder: "सहर भा घाट के नाम खोजीं...",

    wishesBadge: "आपसी नेह आ सुभकामना",
    wishesTitle: "छठ के मंगल सुभकामना ❤️",
    wishesSubtitle: "छठ के पावन बेरा पर आपन परिवार आ संगी-साथी के भेजीं सुभकामना।",
    greetingCardTitle: "डिजिटल बधाई पाती बनाईं 🎴",

    galleryTitle: "छठ पूजा के सुंदर तसवीर 📸",
    quizTitle: "छठ ज्ञान क्विज 🧠",
    kidsTitle: "बबुआ-बच्ची खातिर छठ 🧒",
    blogTitle: "छठ परब के संस्कृति आ इतिहास ✍️",
    adminTitle: "प्रबंधक पटल (Admin)",

    footerAbout: "छठ महापर्व डिजिटल सेवा ट्रस्ट — सुरुज गोसांईं आ छठी मइया के संस्कृति के दुनिया भर में फइलावे के एगो प्रयास।",
    copyright: "सब हक सुरक्षित। जय छठी मईया 🙏"
  },

  mai: {
    siteTitle: "छठ महापर्व",
    siteSubtitle: "आस्था, निष्ठा ओ सूर्य उपासना केर महापर्व",
    heroHeading: "जय छठी मइया 🙏",
    heroSubheading: "मिथिला ओ समस्त पूर्वांचल केर परम पावन लोक महापर्व — सूर्य नारायण ओ छठी मइया केर अनुग्रह",
    heroBadge: "कार्तिक शुक्ल षष्ठी • लोक आस्थाक महापर्व • 2026",
    exploreChhath: "छठिक महत्व बुझू",
    listenSongs: "छठि गीत सुनू 🎵",
    pauseSong: "गीत रोकू (Pause)",
    countdownTitle: "छठ महापर्व मे एतेक समय शेष अछि",
    daysRemaining: "दिन बाँकी",
    hours: "घंटा",
    minutes: "मिनट",
    seconds: "सेकंड",
    nahayKhay: "नहाय खाय",
    kharna: "खरना",
    sandhyaArghya: "साँझक अर्घ्य",
    ushaArghya: "प्रात: अर्घ्य (उषा)",

    navTimeline: "नहाय खाय ओ 4 दिन",
    navArghya: "अर्घ्य समय",
    navSongs: "छठि गीत",
    navVidhi: "पूजा विधि",
    navSamagri: "सामग्री सूची",
    navPrasad: "ठेकुआ ओ प्रसाद",
    navGhats: "छठ घाट",
    navWishes: "शुभकामना",
    navQuiz: "प्रश्नोत्तरी",
    navKids: "बाल वाटिका",

    timelineBadge: "चारि दिवसीय पावन महाव्रत",
    timelineTitle: "छठि महापर्वक चारि पावन दिवस",
    timelineSubtitle: "नहाय-खायक शुद्धि सं लऽ कऽ उषा अर्घ्यक पारण धरि — 36 घंटाक अखंड निर्जला तप।",
    daySignificance: "दिवसक महात्म्य",
    dateAndTithi: "तिथि ओ दिनांक:",
    meaningAndSignificance: "अर्थ ओ महत्व",
    coreObjective: "साधनाक मूल उद्देश्य:",
    ritualsAndRules: "मुख्य अनुष्ठान ओ नियम",
    prasadAndDiet: "आहार ओ महाप्रसाद",
    nextDayBtn: "आगामी दिवस देखू",

    arghyaTimeTitle: "अर्घ्य दानक शुभ समय",
    arghyaSubtitle: "अपन नगरक अनुसार साँझक ओ प्रात: अर्घ्यक सटीक समय जानू।",
    arghyaBadge: "खगोलीय समय गणना (Astronomical Solar Timings)",
    sunsetTime: "साँझक अर्घ्य (सूर्यास्त)",
    sunriseTime: "प्रात: अर्घ्य (सूर्योदय)",
    selectedLocation: "चयनित छठ क्षेत्र",
    riverBank: "तट",

    songsBadge: "पावन छठि गीतक अमृत",
    songsSectionTitle: "छठिक पावन मैथिली ओ पारंपरिक गीत 🎵",
    songsSubtitle: "यूट्यूब पर कोनो गीत लाइव खोजू, सम्पूर्ण प्लेलिस्ट बजाउ वा अपन लिंक तुरंत सुनू।",
    tabAllSongs: "समस्त छठि गीत",
    tabPlaylists: "🎶 सम्पूर्ण छठि प्लेलिस्ट ओ जूकबॉक्स",
    tabCustomLink: "⚡ अपन मनपसंद लिंक बजाउ",
    searchSongPlaceholder: "गीत वा गायक खोजू (उदा. शारदा सिन्हा...)",
    playSongBtn: "गीत बजाउ (Play)",
    playingNow: "बजि रहल अछि (Playing)",

    vidhiBadge: "वैदिक ओ प्रामाणिक नियम",
    vidhiSectionTitle: "छठि पूजाक सम्पूर्ण विधि-विधान",
    vidhiSubtitle: "छठि पूजाक सम्पूर्ण विधि-विधान — शुद्धता, सरलता ओ निष्ठापूर्वक सूर्य देवक आराधना।",
    beginnerGuideTitle: "पहिल बेर छठि व्रत कऽ रहल छी? जानू: \"पूजा कोना करी?\"",
    beginnerGuideSubtitle: "नव व्रती लोकनिक लेल सरल ओ प्रामाणिक नियम",

    samagriBadge: "इंटरैक्टिव पूजा तैयारी",
    samagriTitle: "छठिक सामग्री सूची 🪔",
    samagriSubtitle: "दउरा, सूप, फल, ठेकुआ सामग्रीक सम्पूर्ण सूची। सामग्री चेक करू ओ डाउनलोड करू।",
    prepProgress: "तैयारीक प्रगति:",
    printBtn: "प्रिंट करू",
    downloadBtn: "डाउनलोड करू",
    catAll: "समस्त सामग्री",
    catVessels: "दउरा, सूप ओ पात्र",
    catFruits: "ऋतु फल, ईख ओ केला",
    catPrasad: "ठेकुआ ओ प्रसाद सामग्री",
    catRituals: "सिंदूर, गंगाजल ओ दीप",

    prasadBadge: "पवित्र नैवेद्य ओ स्वाद",
    prasadTitle: "छठिक परम पावन प्रसाद 🍪",
    prasadSubtitle: "गहुम, देशी गुड़ ओ शुद्ध घीव सं बनल अमृततुल्य ठेकुआ, रसियाव ओ ऋतु फलक नैवेद्य।",
    thekuaRecipeBtn: "पारंपरिक ठेकुआ बनेबाक विधि",

    kathaBadge: "पौराणिक ओ ऐतिहासिक आख्यान",
    kathaTitle: "छठि माएक पावन आख्यान 📖",
    kathaSubtitle: "ब्रह्मवैवर्त पुराण, महाभारत ओ रामायण सं जुड़ल अमर कथा।",

    mantraBadge: "वैदिक ऋचा ओ स्तुति",
    mantraTitle: "सूर्य देव ओ षष्ठी देवी मंत्र व आरती 🙏",
    mantraSubtitle: "भगवान भुवन भास्कर ओ षष्ठी देवीक कृपा लेल प्रामाणिक वैदिक मंत्र ओ आरती।",

    ghatBadge: "पवित्र नदी तट ओ निर्देशिका",
    ghatFinderTitle: "निकटवर्ती छठ घाट खोजू 📍",
    ghatSubtitle: "पटना, भागलपुर, वाराणसी, राँची आदि प्रमुख छठ घाटक लाइव स्थिति ओ सुविधा खोजू।",
    searchGhatPlaceholder: "नगर वा घाटक नाम खोजू...",

    wishesBadge: "पारस्परिक सौहार्द ओ नेह",
    wishesTitle: "छठ महापर्वक हार्दिक शुभकामना ❤️",
    wishesSubtitle: "छठिक पावन अवसर पर अपन परिजन ओ मित्र लोकनिकेँ पठाउ भक्तिमय मंगलकामना।",
    greetingCardTitle: "अपन नाम सं बधाई पत्र बनाउ 🎴",

    galleryTitle: "छठिक दिव्य झांकी व चित्र 📸",
    quizTitle: "छठि ज्ञानोत्थान प्रश्नोत्तरी 🧠",
    kidsTitle: "बच्चा लोकनिक लेल छठि कथा 🧒",
    blogTitle: "छठिक संस्कृति ओ परंपरा ✍️",
    adminTitle: "व्यवस्थापक पटल (Admin)",

    footerAbout: "छठि महापर्व डिजिटल सेवा ट्रस्ट — सूर्य उपासना ओ छठी मइयाक पावन संस्कृतिकेँ जन-जन धरि पहुँचाबय केर विनम्र प्रयास।",
    copyright: "सर्वाधिकार सुरक्षित। जय छठी मइया 🙏"
  },

  en: {
    siteTitle: "Chhath Mahaparv",
    siteSubtitle: "The Supreme Vedic Festival of Devotion & Sun Worship",
    heroHeading: "Jai Chhathi Maiya 🙏",
    heroSubheading: "The supreme festival of purity, austere devotion, and nature thanksgiving — celebrating Surya Dev & Chhathi Maiya across Bihar, Jharkhand, Eastern UP & the world",
    heroBadge: "Kartik Shukla Shashthi • The Grand Vedic Sun Festival • 2026",
    exploreChhath: "Explore Chhath",
    listenSongs: "Listen to Songs 🎵",
    pauseSong: "Pause Music",
    countdownTitle: "Countdown to Chhath Mahaparv",
    daysRemaining: "Days Left",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
    nahayKhay: "Nahay Khay",
    kharna: "Kharna",
    sandhyaArghya: "Sandhya Arghya",
    ushaArghya: "Usha Arghya",

    navTimeline: "Nahay Khay & 4 Days",
    navArghya: "Arghya Timings",
    navSongs: "Chhath Songs",
    navVidhi: "Puja Vidhi",
    navSamagri: "Samagri Checklist",
    navPrasad: "Thekua & Prasad",
    navGhats: "Chhath Ghats",
    navWishes: "Wishes",
    navQuiz: "Quiz",
    navKids: "Kids Corner",

    timelineBadge: "Four-Day Sacred Mahavrat",
    timelineTitle: "The Four Sacred Days of Chhath Mahaparv",
    timelineSubtitle: "From the purification of Nahay-Khay to the conclusion of Usha Arghya — a 36-hour spiritual journey of austere waterless fasting.",
    daySignificance: "Significance of Day",
    dateAndTithi: "Date & Tithi:",
    meaningAndSignificance: "Meaning & Significance",
    coreObjective: "Core Spiritual Objective:",
    ritualsAndRules: "Key Rituals & Process",
    prasadAndDiet: "Sacred Diet & Holy Prasad",
    nextDayBtn: "View Next Day",

    arghyaTimeTitle: "Auspicious Arghya Timings",
    arghyaSubtitle: "Check precise sunset and sunrise timings for Sandhya and Usha Arghya across major cities.",
    arghyaBadge: "Astronomical Solar Timings",
    sunsetTime: "Sandhya Arghya (Sunset)",
    sunriseTime: "Usha Arghya (Sunrise)",
    selectedLocation: "Selected Region",
    riverBank: "Bank",

    songsBadge: "Divine Nectar of Chhath Folk Songs",
    songsSectionTitle: "Soulful Chhath Folk Songs & Bhajans 🎵",
    songsSubtitle: "Search any song live on YouTube, stream complete curated jukeboxes, or play your custom link instantly.",
    tabAllSongs: "All Chhath Songs",
    tabPlaylists: "🎶 Complete Playlists & Jukeboxes",
    tabCustomLink: "⚡ Play Any Custom Link",
    searchSongPlaceholder: "Search song, singer, or lyrics (e.g., Sharda Sinha, Pawan Singh...)",
    playSongBtn: "Play Song",
    playingNow: "Playing Now",

    vidhiBadge: "Vedic & Authentic Guidelines",
    vidhiSectionTitle: "Complete Chhath Puja Vidhi & Rituals",
    vidhiSubtitle: "Step-by-step complete procedure of Chhath Puja — worship of Surya Dev and Chhathi Maiya with purity, austerity, and devotion.",
    beginnerGuideTitle: "Observing Chhath for the first time? Know: \"How to perform the puja?\"",
    beginnerGuideSubtitle: "Simple, accessible, and foundational guidelines for first-time fasting devotees and families",

    samagriBadge: "Interactive Puja Checklist",
    samagriTitle: "Puja Samagri Interactive Checklist 🪔",
    samagriSubtitle: "Complete checklist for baskets, winnows, seasonal fruits, prasad ingredients, and sacred items. Track, print, or download.",
    prepProgress: "Preparation Progress:",
    printBtn: "Print (Print)",
    downloadBtn: "Download (Download)",
    catAll: "All Items (All)",
    catVessels: "Baskets, Winnows & Vessels",
    catFruits: "Seasonal Fruits & Sugarcane",
    catPrasad: "Thekua & Prasad Ingredients",
    catRituals: "Vermillion, Holy Water & Lamps",

    prasadBadge: "Sacred Offerings & Divine Taste",
    prasadTitle: "Sacred Chhath Prasad 🍪",
    prasadSubtitle: "Divine offerings of crispy Thekua made of whole wheat, jaggery & pure ghee, Rasiyaw kheer, and holy fruits.",
    thekuaRecipeBtn: "Traditional Bihari Thekua Recipe Guide",

    kathaBadge: "Puranic & Historical Legends",
    kathaTitle: "Chhath Mahaparv Sacred Legends 📖",
    kathaSubtitle: "Immortal legends from Brahma Vaivarta Purana, Mahabharata, and Ramayana illuminating the glory of Chhath.",

    mantraBadge: "Vedic Chants & Invocations",
    mantraTitle: "Surya Dev & Chhathi Maiya Mantras & Aarti 🙏",
    mantraSubtitle: "Authentic Vedic solar mantras, hymns, and sacred Aarti for the divine blessings of Surya and Chhathi Maiya.",

    ghatBadge: "Sacred River Ghats Directory",
    ghatFinderTitle: "Find Chhath Ghat Near Me 📍",
    ghatSubtitle: "Explore major Chhath ghats across Patna, Varanasi, Ranchi, and more with crowd status, route, and amenities.",
    searchGhatPlaceholder: "Search city, ghat name, or river (e.g., Patna, Ganga, Digha...)",

    wishesBadge: "Festive Greetings & Warmth",
    wishesTitle: "Chhath Puja Wishes & Messages ❤️",
    wishesSubtitle: "Share heartfelt devotion and warm wishes with family and friends on this auspicious occasion.",
    greetingCardTitle: "Create Digital Chhath Greeting Card 🎴",

    galleryTitle: "Chhath Visual Gallery & Darshan 📸",
    quizTitle: "Chhath Knowledge Quiz 🧠",
    kidsTitle: "Chhath for Children 🧒",
    blogTitle: "Chhath Cultural Heritage Articles ✍️",
    adminTitle: "Admin Dashboard",

    footerAbout: "Chhath Mahaparv Digital Seva Trust — A devotional initiative dedicated to preserving and sharing the sublime culture of Chhath Puja worldwide.",
    copyright: "All rights reserved. Jai Chhathi Maiya 🙏"
  },
  mag: {
    siteTitle: "छठ महापर्व — आस्था आ भक्ति के महासंगम",
    siteSubtitle: "सूर्य देव आ छठी मईया के पावन महाव्रत के डिजिटल संगम",
    heroHeading: "जय छठी मईया",
    heroSubheading: "लोक आस्था, सात्विकता आ प्रकृति पूजा के महापर्व पर रउआ सब के हार्दिक जोहार।",
    heroBadge: "कार्तिक शुक्ल षष्ठी २०२६ • पावन महाव्रत",
    exploreChhath: "महापर्व जाने (Explore)",
    listenSongs: "छठ गीत सुने (Songs)",
    pauseSong: "गीत रोके (Pause)",
    countdownTitle: "छठ महापर्व २०२६ उल्टी गिनती (Countdown)",
    daysRemaining: "दिन बाचल",
    hours: "घंटा",
    minutes: "मिनट",
    seconds: "सेकंड",
    nahayKhay: "नहाय-खाय",
    kharna: "खरना",
    sandhyaArghya: "संध्या अर्घ्य",
    ushaArghya: "उषा अर्घ्य",

    navTimeline: "चार दिन",
    navArghya: "अर्घ्य समय",
    navSongs: "छठ गीत",
    navVidhi: "पूजा विधि",
    navSamagri: "सामग्री",
    navPrasad: "ठेकुआ प्रसाद",
    navGhats: "छठ घाट",
    navWishes: "शुभकामना",
    navQuiz: "क्विज",
    navKids: "बाल वाटिका",

    timelineBadge: "चार दिन के पावन महाव्रत",
    timelineTitle: "छठ महापर्व के चार पावन दिन",
    timelineSubtitle: "नहाय-खाय से लेके उषा अर्घ्य के पारण तक — ३६ घंटा के अखंड निर्जला तप।",
    daySignificance: "दिन के महातम",
    dateAndTithi: "तारीख आ तिथि:",
    meaningAndSignificance: "अर्थ आ महातम (Significance)",
    coreObjective: "साधना के मूल उद्देश्य:",
    ritualsAndRules: "मुख्य नियम व अनुष्ठान (Rituals & Process)",
    prasadAndDiet: "आहार व महाप्रसाद (Holy Prasad)",
    nextDayBtn: "अगिला दिन देखी (Next Day)",

    arghyaTimeTitle: "अर्घ्य के शुभ समय",
    arghyaSubtitle: "अपन शहर के हिसाब से संध्या अर्घ्य आ उषा अर्घ्य के सटीक समय जानी।",
    arghyaBadge: "खगोलीय समय गणना (Astronomical Solar Timings)",
    sunsetTime: "संध्या अर्घ्य (सूर्यास्त)",
    sunriseTime: "उषा अर्घ्य (सूर्योदय)",
    selectedLocation: "चुनल छठ क्षेत्र",
    riverBank: "तट",

    songsBadge: "मधुर छठ गीत",
    songsSectionTitle: "छठ पूजा के अमृत लोकगीत 🎵",
    songsSubtitle: "शारदा सिन्हा, पवन सिंह, अनुराधा पौडवाल के अमर गीत आ भजन सुनी।",
    tabAllSongs: "सभे छठ गीत",
    tabPlaylists: "🎶 सम्पूर्ण प्लेलिस्ट",
    tabCustomLink: "⚡ मनपसंद लिंक बजाईं",
    searchSongPlaceholder: "गीत या गायक खोजीं...",
    playSongBtn: "गाना बजाईं",
    playingNow: "चल रहल बा",

    vidhiBadge: "वैदिक व पारंपरिक नियम",
    vidhiSectionTitle: "छठ पूजा के संपूर्ण विधि",
    vidhiSubtitle: "शुद्धता, सरलता आ निष्ठा के संगे सूर्य देव आ छठी मईया के आराधना।",
    beginnerGuideTitle: "पहिली बार छठ कर रहल बानी? जानी: \"पूजा कइसे करीं?\"",
    beginnerGuideSubtitle: "नए व्रती आ परिवार खातिर सरल दिशानिर्देश",

    samagriBadge: "पूजा सामग्री तैयारी",
    samagriTitle: "छठ पूजा सामग्री चेकलिस्ट 🪔",
    samagriSubtitle: "दउरा, सूप, फल, ठेकुआ सामग्री के संपूर्ण जांच सूची।",
    prepProgress: "तैयारी के प्रगति:",
    printBtn: "प्रिंट (Print)",
    downloadBtn: "डाउनलोड (Download)",
    catAll: "सभे सामग्री (All)",
    catVessels: "दउरा, सूप व पातर",
    catFruits: "फल व ईख (गन्ना)",
    catPrasad: "ठेकुआ व प्रसाद सामग्री",
    catRituals: "सिन्दूर, गंगाजल व दीप",

    prasadBadge: "महाप्रसाद व पारंपरिक स्वाद",
    prasadTitle: "पवित्र छठ प्रसाद 🍪",
    prasadSubtitle: "गेहूं के आटा, शुद्ध घीव आ गुड़ से बनल खस्ता ठेकुआ व रसियाव खीर।",
    thekuaRecipeBtn: "पारंपरिक ठेकुआ बनावे के विधि",

    kathaBadge: "पौराणिक व ऐतिहासिक कथा",
    kathaTitle: "छठ महापर्व के पावन कथा 📖",
    kathaSubtitle: "राजा प्रियव्रत, द्रौपदी आ कर्ण के सूर्य उपासना के अमर कथा।",

    mantraBadge: "वैदिक मंत्र व स्तुति",
    mantraTitle: "सूर्य देव व छठी मईया मंत्र व आरती 🙏",
    mantraSubtitle: "सूर्य अर्घ्य मंत्र, गायत्री मंत्र व छठी मईया के पावन आरती।",

    ghatBadge: "पवित्र नदी घाट निर्देशिका",
    ghatFinderTitle: "नजदीकी छठ घाट खोजीं 📍",
    ghatSubtitle: "पटना, बनारस, रांची आ अन्य शहर के प्रमुख घाट, भीड़ स्थिति आ सुविधा।",
    searchGhatPlaceholder: "शहर या घाट के नाम खोजीं...",

    wishesBadge: "शुभकामना व मंगलकामना",
    wishesTitle: "छठ पूजा संदेश व बधाई ❤️",
    wishesSubtitle: "अपन परिवार आ सगे-संबंधी के छठ पर्व के बधाई भेजीं।",
    greetingCardTitle: "डिजिटल छठ शुभकामना पत्र बनाईं 🎴",

    galleryTitle: "छठ दर्शन व फोटो गैलरी 📸",
    quizTitle: "छठ ज्ञान क्विज 🧠",
    kidsTitle: "बाल वाटिका 🧒",
    blogTitle: "छठ संस्कृति आ लेख ✍️",
    adminTitle: "व्यवस्थापक डैशबोर्ड (Admin)",

    footerAbout: "छठ महापर्व डिजिटल सेवा न्यास — लोक आस्था आ सनातन संस्कृति के समर्पित डिजिटल मंच।",
    copyright: "सर्वाधिकार सुरक्षित। जय छठी मईया 🙏"
  }
};

