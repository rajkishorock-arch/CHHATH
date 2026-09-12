import { Language } from '../types';

export interface VidhiStepData {
  stepNumber: number;
  title: string;
  time: string;
  description: string;
  instructions: string[];
}

export interface BeginnerGuideData {
  intro: string;
  points: { title: string; desc: string }[];
}

export const vidhiStepsByLang: Record<Language, VidhiStepData[]> = {
  hi: [
    {
      stepNumber: 1,
      title: "पूजा की पूर्व तैयारी एवं शुद्धि",
      time: "पर्व से 1-2 दिन पूर्व",
      description: "छठ पूजा पूर्ण सात्विकता और निष्ठा का महापर्व है। पूजा प्रारंभ होने से पूर्व घर की संपूर्ण स्वच्छता और सामग्री एकत्र करना आवश्यक है।",
      instructions: [
        "संपूर्ण घर, विशेषकर रसोईघर की पूर्ण धुलाई कर गंगाजल छिड़कें।",
        "मिट्टी का नया चूल्हा अथवा केवल छठ पूजा हेतु सुरक्षित अलग गैस चूल्हा तैयार करें।",
        "गेहूं को पवित्रता से धोकर धूप में सुखाएं (ध्यान रहे कोई पक्षी या जूठा न छुए)।",
        "बांस के नए दउरा, सूप और मिट्टी के दीये धोकर शुद्ध कर लें।"
      ]
    },
    {
      stepNumber: 2,
      title: "नहाय-खाय विधि (प्रथम दिवस)",
      time: "कार्तिक शुक्ल चतुर्थी",
      description: "स्नान और सात्विक आहार के माध्यम से शरीर और मन का शुद्धिकरण।",
      instructions: [
        "प्रातःकाल पवित्र नदी अथवा गंगाजल मिश्रित जल से स्नान कर सूर्य देव को नमन करें।",
        "नए बिना सिले वस्त्र अथवा धुले हुए शुद्ध वस्त्र धारण करें।",
        "सेंधा नमक और देशी घी में कद्दू (लौकी) की सब्जी, अरवा चावल का भात और चने की दाल तैयार करें।",
        "सर्वप्रथम व्रती सूर्य देव को भोग लगाकर प्रसाद पाएं, उसके बाद पूरा परिवार भोजन करे।"
      ]
    },
    {
      stepNumber: 3,
      title: "खरना अनुष्ठान (द्वितीय दिवस)",
      time: "कार्तिक शुक्ल पंचमी",
      description: "अंतःकरण की शुद्धि और 36 घंटे के निर्जला व्रत का पावन संकल्प।",
      instructions: [
        "पूरे दिन निर्जला उपवास रखें; शाम तक जल की एक बूंद भी ग्रहण न करें।",
        "शाम को आम की लकड़ी की आंच पर नए मिट्टी के बर्तन में गुड़ और गाय के दूध की खीर (रसियाव) बनाएं।",
        "एकांत शांत पूजा कक्ष में केले के पत्ते पर मां षष्ठी को खीर, घी लगी रोटी व केला अर्पित करें।",
        "पूजा के समय घर में पूर्ण नीरवता रहे; व्रती शांत चित्त होकर प्रसाद ग्रहण करें।"
      ]
    },
    {
      stepNumber: 4,
      title: "संध्या अर्घ्य विधि (तृतीय दिवस)",
      time: "कार्तिक शुक्ल षष्ठी",
      description: "अस्ताचलगामी सूर्य को सूप में महाप्रसाद सजाकर अर्घ्य समर्पण।",
      instructions: [
        "दोपहर में पवित्रता से देशी घी में गेहूं के आटे और गुड़ का ठेकुआ व भुसवा तैयार करें।",
        "बांस के सूप में ठेकुआ, नारियल, गन्ना, डाभा नींबू, मौसमी फल और जलता हुआ दीया रखें।",
        "दउरा सिर पर रखकर नंगे पांव परिवार सहित लोकगीत गाते हुए छठ घाट पहुंचें।",
        "कमर तक नदी/तालाब के जल में खड़े होकर अस्ताचलगामी सूर्य को दूध व जल की धार से अर्घ्य दें।"
      ]
    },
    {
      stepNumber: 5,
      title: "उषा अर्घ्य विधि (चतुर्थ दिवस)",
      time: "कार्तिक शुक्ल सप्तमी",
      description: "उदीयमान सूर्य को अर्घ्य एवं महापर्व की पूर्णाहुति।",
      instructions: [
        "सूर्योदय से पूर्व ब्रह्ममुहूर्त में घाट पर पहुंचें और सूप व दउरा सजाएं।",
        "शीतल जल में खड़े होकर हाथ में अर्घ्य का सूप लेकर भगवान भास्कर के उदय की प्रतीक्षा करें।",
        "पूर्व दिशा में सूर्य की पहली लालिमा दिखते ही दूध और जल से प्रातःकालीन अर्घ्य अर्पित करें।",
        "छठी मईया की आरती गाएं और संतान व परिवार की सुख-समृद्धि का आशीर्वाद मांगें।"
      ]
    },
    {
      stepNumber: 6,
      title: "व्रत समाप्ति एवं पारण",
      time: "उषा अर्घ्य के तुरंत बाद",
      description: "36 घंटे के निर्जला उपवास को समाप्त कर महाप्रसाद का वितरण।",
      instructions: [
        "अर्घ्य संपन्न होने के बाद घाट पर ही व्रती कच्चा दूध, अदरक का टुकड़ा, गुड़ व अंकुरित चना खाकर पारण करें।",
        "घाट पर उपस्थित सभी श्रद्धालुओं, परिवारजनों और पड़ोसियों में ठेकुआ का महाप्रसाद वितरित करें।",
        "बुजुर्गों के चरण स्पर्श कर आशीर्वाद लें और छठी मईया का आभार व्यक्त करें।"
      ]
    }
  ],

  en: [
    {
      stepNumber: 1,
      title: "Pre-Puja Preparation & Purification",
      time: "1-2 Days Before Festival",
      description: "Chhath is the festival of utmost purity and austerity. Thorough cleaning of the home and procurement of sacred items are essential before starting.",
      instructions: [
        "Clean and wash the entire home, especially the kitchen, and sprinkle sacred Ganga water.",
        "Prepare a new earthen stove or reserve a separate clean stove exclusively for Chhath cooking.",
        "Wash whole wheat grains with sacred care and sun-dry them, ensuring no birds or impurities touch them.",
        "Wash and purify new bamboo baskets (Daura), winnowing trays (Soop), and earthen lamps."
      ]
    },
    {
      stepNumber: 2,
      title: "Nahay-Khay Ritual (Day 1)",
      time: "Kartik Shukla Chaturthi",
      description: "Purification of the body, mind, and home through holy bath and pure satvik food.",
      instructions: [
        "Take a holy dip in a sacred river or bath with Gangajal in early morning and bow to Surya Dev.",
        "Wear clean, unstitched or freshly washed traditional attire.",
        "Cook Kaddu-Bhat (bottle gourd with rock salt and desi ghee), Arwa rice, and chana dal.",
        "Vrati offers bhog to Surya Dev first before partaking in the meal; followed by family members."
      ]
    },
    {
      stepNumber: 3,
      title: "Kharna Ritual (Day 2)",
      time: "Kartik Shukla Panchami",
      description: "Inner purification and taking the solemn vow for the continuous 36-hour waterless fast.",
      instructions: [
        "Observe a strict waterless fast throughout the day; not even a drop of water until evening.",
        "In the evening, prepare Rasiyaw (jaggery kheer made with pure cow milk) on mango wood fire in a new earthen pot.",
        "Offer kheer, ghee rotis, and bananas on banana leaves to Chhathi Maiya in complete silence.",
        "The Vrati consumes prasad in deep meditative silence before the 36-hour nirjala fast commences."
      ]
    },
    {
      stepNumber: 4,
      title: "Sandhya Arghya Ritual (Day 3)",
      time: "Kartik Shukla Shashthi",
      description: "Offering the evening Arghya to the setting sun with decorated bamboo soop and divine prasad.",
      instructions: [
        "Prepare sacred Thekua and bhuswa in pure desi ghee with utmost devotion during the afternoon.",
        "Decorate bamboo soop with thekua, whole coconut, sugarcane, grapefruit, seasonal fruits, and lighted earthen lamp.",
        "Carry the Daura on head and walk barefoot to the river ghat singing traditional Chhath folk songs.",
        "Stand waist-deep in water and offer Arghya to the setting sun with continuous streams of cow milk and holy water."
      ]
    },
    {
      stepNumber: 5,
      title: "Usha Arghya Ritual (Day 4)",
      time: "Kartik Shukla Saptami",
      description: "Offering morning Arghya to the rising sun and successful culmination of the Mahavrat.",
      instructions: [
        "Reach the river ghat in Brahma Muhurta before dawn and arrange all soops and offerings facing east.",
        "Stand in the cold river water holding the offering tray waiting for the golden rays of Surya Dev.",
        "Offer the morning Arghya with milk and holy water as the first crimson rays of the rising sun illuminate the horizon.",
        "Sing Chhathi Maiya's Aarti and seek divine blessings for health, prosperity, and lineage."
      ]
    },
    {
      stepNumber: 6,
      title: "Parana & Fast Completion",
      time: "Immediately After Usha Arghya",
      description: "Breaking the 36-hour waterless fast and distributing the divine Mahaprasad to all.",
      instructions: [
        "Break the fast right at the ghat by consuming raw milk, ginger slice, jaggery, and sprouted gram.",
        "Distribute sacred Thekua prasad generously to every devotee, pilgrim, and family member at the ghat.",
        "Touch the feet of elders for blessings and express boundless gratitude to Chhathi Maiya."
      ]
    }
  ],

  bho: [
    {
      stepNumber: 1,
      title: "पूजा के पहिले तैयारी आ सुद्धता",
      time: "परब से 1-2 दिन पहिले",
      description: "छठ पूजा पूरा नेम-निष्ठा आ सात्विकता के परब ह। पूजा शुरू होखे से पहिले घर के पूरा सफाई आ सामग्री जुटावल जरूरी बा।",
      instructions: [
        "पूरा घर आ खास कइ के रसोईघर धो के गंगाजल छिड़कीं।",
        "माटी के नया चूल्हा चाहे छठ पूजा खातिर अलगे चूल्हा के इंतज़ाम करीं।",
        "गेंहू धो के धूप में सुखाईं (चिरई-चुरुंग जूठ ना करे पावे)।",
        "नया बांस के दउरा, सूप आ माटी के दीया धो के पवित्र क लीं।"
      ]
    },
    {
      stepNumber: 2,
      title: "नहाय-खाय बिधि (पहिला दिन)",
      time: "कार्तिक सुक्ल चतुर्थी",
      description: "अस्नान आ सात्विक भोजन से तन आ मन के सुद्धिकरण।",
      instructions: [
        "सबेरे गंगा नदी चाहे पवित्र पानी से नहा के सुरुज गोसांईं के गोड़ लागीं।",
        "साफ-सुथरा धोती चाहे साड़ी पहिनीं।",
        "सेंधा नून आ देसी घीव में कद्दू (लौकी) के तरकारी, अरवा चावल के भात आ चना के दाल बनाईं।",
        "पहिले बरतिया सुरुज भगवान के भोग लगा के प्रसाद पाईं, ओकरा बाद पूरा परिवार भोजन करी।"
      ]
    },
    {
      stepNumber: 3,
      title: "खरना अनुष्ठान (दूसरका दिन)",
      time: "कार्तिक सुक्ल पंचमी",
      description: "मन के सुद्धता आ 36 घंटा के निर्जला बरत के पावन संकल्प।",
      instructions: [
        "दिन भर निर्जला उपवास रखीं; संझा तक पानी के एगो बूंदो ना लेवे के बा।",
        "संझा के आम के लकरी पर नया माटी के बर्तन में गुड़ आ दूध के खीर (रसियाव) बनाईं।",
        "एकांत कमरा में केरा के पात पर छठी मईया के रसियाव, घीव लगल रोटी आ केरा चढ़ाईं।",
        "पूजा के समय घर में एकदम्मे संन्नाटा रहे; बरतिया शांत मन से प्रसाद ग्रहण करीहें।"
      ]
    },
    {
      stepNumber: 4,
      title: "सँझिया अरघ बिधि (तीसरका दिन)",
      time: "कार्तिक सुक्ल षष्ठी",
      description: "डूबत सुरुज देव के सूप में महाप्रसाद सजा के अरघ देहल।",
      instructions: [
        "दोपहर में नेम-निष्ठा से देसी घीव में गेंहू के आटा आ गुड़ के ठेकुआ-भुसवा बनाईं।",
        "बांस के सूप में ठेकुआ, नारियल, ईख, डाभ नीबू, फल आ बरत के दीया रखीं।",
        "दउरा माथा पर उठा के नंगे पांव गीत गावत-गावत घाट पर पहुंचीं।",
        "कमर भर पानी में खड़ा होके डूबत सुरुज के दूध आ पानी के धार से अरघ दीं।"
      ]
    },
    {
      stepNumber: 5,
      title: "भोरवा अरघ बिधि (चौथा दिन)",
      time: "कार्तिक सुक्ल सप्तमी",
      description: "उगत सुरुज के अरघ आ महापर्व के संपूर्णता।",
      instructions: [
        "सबेरे भोरही में घाट पर पहुंच के सूप आ दउरा सजाईं।",
        "ठंढा पानी में खड़ा होके हाथ में अरघ के सूप लेके सुरुज देव के उगे के बाट जोहीं।",
        "पूरब में सुरुज के पहिला लाली लउकते दूध आ गंगाजल से सबेरे के अरघ दीं।",
        "छठी मईया के आरती गाईं आ लइका-परिवार के सुख-समृद्धि के असीस मांगीं।"
      ]
    },
    {
      stepNumber: 6,
      title: "बरत के पारण",
      time: "उषा अरघ के तुरंते बाद",
      description: "36 घंटा के निर्जला बरत पूरा कइ के महाप्रसाद बंटावल।",
      instructions: [
        "अरघ पूरा भइला पर घाटे पर बरतिया कच्चा दूध, आदी, गुड़ आ अंकुरित चना खाके पारण करीहें।",
        "घाटे पर सब श्रद्धालु, परिवार आ आस-पड़ोस में ठेकुआ के महाप्रसाद बांटीं।",
        "बुजुर्गन के गोड़ छू के आशीर्वाद लीं आ छठी मईया के आभार करीं।"
      ]
    }
  ],

  mai: [
    {
      stepNumber: 1,
      title: "पूजाक पूर्व तैयारी ओ शुद्धि",
      time: "पर्व सं 1-2 दिन पूर्व",
      description: "छठि पूजा पूर्ण सात्विकता ओ निष्ठाक महापर्व थिक। पूजा प्रारंभ होय सं पूर्व घरक संपूर्ण स्वच्छता ओ सामग्री एकत्र करब आवश्यक अछि।",
      instructions: [
        "संपूर्ण घर, विशेष रूप सं भानस (रसोई) धो क' गंगाजल छिड़कू।",
        "माटिक नव चूल्हा अथवा छठि पूजा हेतु सुरक्षित अलग चूल्हा तैयार करू।",
        "गेहूँ पवित्रता सं धो क' धूप में सुखाउ (चिरई वा अपवित्र स्पर्श नहि होअय)।",
        "बाँसक नव दउरा, सूप आ माटिक दीप धो क' शुद्ध क' लिय।"
      ]
    },
    {
      stepNumber: 2,
      title: "नहाय-खाय विधि (प्रथम दिवस)",
      time: "कार्तिक शुक्ल चतुर्थी",
      description: "स्नान ओ सात्विक आहारक माध्यम सं शरीर ओ मनक शुद्धिकरण।",
      instructions: [
        "प्रातःकाल पवित्र नदी वा गंगाजल मिश्रित जल सं स्नान क' सूर्य देवकेँ नमन करू।",
        "नव बिना सीयल वस्त्र वा धोयल शुद्ध वस्त्र धारण करू।",
        "सेंधा नून ओ देशी घीव में कद्दू (सब्जी), अरवा चाउरक भात ओ चना दालि तैयार करू।",
        "सर्वप्रथम व्रती सूर्य देवकेँ भोग लगा क' प्रसाद ग्रहण करथि, तदोपरांत पूरा परिवार भोजन करथि।"
      ]
    },
    {
      stepNumber: 3,
      title: "खरना अनुष्ठान (द्वितीय दिवस)",
      time: "कार्तिक शुक्ल पंचमी",
      description: "अंतःकरणक शुद्धि ओ 36 घंटाक निर्जला व्रतक पावन संकल्प।",
      instructions: [
        "दिन भरि निर्जला उपवास राखू; सांझ धरि जलक एको बूंद नहि ग्रहण करब।",
        "सांझ में आमक काठक आंचि पर नव माटिक बासन में गुड़ ओ दूधक खीर (रसियाव) बनाउ।",
        "एकांत शांत पूजा कक्ष में केराक पात पर मां षष्ठीकेँ रसियाव, घीव लगल रोटी ओ केरा अर्पित करू।",
        "पूजाक समय घर में पूर्ण नीरवता रहय; व्रती शांत चित्त भ' क' प्रसाद ग्रहण करथि।"
      ]
    },
    {
      stepNumber: 4,
      title: "सँझुका अर्घ्य विधि (तृतीय दिवस)",
      time: "कार्तिक शुक्ल षष्ठी",
      description: "अस्ताचलगामी सूर्यकेँ सूप में महाप्रसाद सजा क' अर्घ्य समर्पण।",
      instructions: [
        "दोपहर में पवित्रता सं देशी घीव में गेहूँक आटा ओ गुड़क ठेकुआ-भुसवा तैयार करू।",
        "बाँसक सूप में ठेकुआ, नारिकेल, ऊखि, डाभा नीबू, फल ओ जलैत दीप राखू।",
        "दउरा माथ पर राखि क' नंगे पैर परिवार सहित लोकगीत गबैत छठि घाट पहुँचू।",
        "कमर धरि जल में ठाढ़ भ' क' डूबैत सूर्यकेँ दूध ओ जलक धार सं अर्घ्य दिअ।"
      ]
    },
    {
      stepNumber: 5,
      title: "भोरका अर्घ्य विधि (चतुर्थ दिवस)",
      time: "कार्तिक शुक्ल सप्तमी",
      description: "उदीयमान सूर्यकेँ अर्घ्य ओ महापर्वक पूर्णाहुति।",
      instructions: [
        "सूर्योदय सं पूर्व ब्रह्ममुहूर्त में घाट पर पहुँचू आ सूप ओ दउरा सजाउ।",
        "शीतल जल में ठाढ़ भ' क' हाथ में अर्घ्यक सूप ल' भगवान भाष्करक उदित हेबाक प्रतीक्षा करू।",
        "पूर्व दिशा में सूर्यक प्रथम लालिमा देखिते दूध ओ जल सं प्रातःकालीन अर्घ्य अर्पित करू।",
        "छठी मइयाक आरती गाउ ओ संतान व परिवारक सुख-समृद्धिक आशीर्वाद मांगू।"
      ]
    },
    {
      stepNumber: 6,
      title: "व्रत समाप्ति ओ पारण",
      time: "उषा अर्घ्यक उपरांत",
      description: "36 घंटाक निर्जला उपवास समाप्त क' महाप्रसादाक वितरण।",
      instructions: [
        "अर्घ्य संपन्न भेलाक बाद घाटहि पर व्रती काँच दूध, अदि, गुड़ ओ अंकुरित चना खा क' पारण करथि।",
        "घाट पर उपस्थित समस्त श्रद्धालु, परिजन ओ पड़ोसी लोकनि में ठेकुआक महाप्रसाद वितरण करू।",
        "ज्येष्ठ लोकनिक चरण स्पर्श क' आशीर्वाद लिय ओ छठी मइयाक आभार व्यक्त करू।"
      ]
    }
  ],
  mag: []
};
vidhiStepsByLang.mag = vidhiStepsByLang.hi;

export const beginnerGuideByLang: Record<Language, BeginnerGuideData> = {
  hi: {
    intro: "छठ पूजा में सबसे महत्वपूर्ण तत्व है 'मन की शुद्धि और निष्कपट भाव'। किसी भी प्रकार के भय या अंधविश्वास के बिना श्रद्धा से यह व्रत किया जाता है।",
    points: [
      { title: "1. संकल्प और शुद्धि:", desc: "पूजा के चारों दिन घर में प्याज, लहसुन और तामसिक भोजन का पूर्ण निषेध रहता है।" },
      { title: "2. सादगी सर्वोपरि:", desc: "महंगे आभूषणों की आवश्यकता नहीं होती; सूती पीला या लाल वस्त्र और बांस का सूप ही पर्याप्त है।" },
      { title: "3. घर पर अर्घ्य की व्यवस्था:", desc: "यदि नदी घाट दूर हो तो घर की छत या बालकनी में स्वच्छ टब/कुंड में जल भरकर भी अर्घ्य दिया जा सकता है।" },
      { title: "4. पारिवारिक सहयोग:", desc: "छठ किसी अकेले व्यक्ति का नहीं, पूरे परिवार का सामूहिक उत्सव है जिसमें सब हाथ बंटाते हैं।" }
    ]
  },
  en: {
    intro: "The essence of Chhath Puja lies in 'purity of intention, simplicity, and selfless devotion'. It is performed with love and reverence without fear or superstition.",
    points: [
      { title: "1. Vow & Purification:", desc: "Complete abstention from onion, garlic, non-veg, and tamasic food across all 4 days." },
      { title: "2. Simplicity Above All:", desc: "No expensive jewels or elaborate temples needed; yellow or red cotton garments and bamboo soop suffice." },
      { title: "3. Home Arghya Alternative:", desc: "If natural river ghats are distant, arghya can be offered reverently on rooftops or terraces in a clean water pool or tub." },
      { title: "4. Family Collective Spirit:", desc: "Chhath is not a solitary ritual; it unites families where every generation joyfully contributes and serves." }
    ]
  },
  bho: {
    intro: "छठ पूजा में सबसे बड़ बात बा 'मन के सुद्धता आ सच्चा भाव'। बिना कौनों डर भा वहम के नेह-नेम से ई बरत कइल जाला।",
    points: [
      { title: "1. संकल्प आ पवित्रता:", desc: "चारों दिन घर में पियाज, लहसुन आ मांसाहार एकदम्मे मना रहेला।" },
      { title: "2. सादगी सबले ऊपर:", desc: "कौनों महंग गहना-कपड़ा के जरूरत नइखे; सादा धोती-साड़ी आ बाँस के सूप ही काफी बा।" },
      { title: "3. घरे पर अरघ के उपाय:", desc: "जदि नदी दूर होखे त छत भा आंगन में साफ टब/कुंड में पानी भर के भी अरघ देहल जा सकेला।" },
      { title: "4. पूरा परिवार के साथ:", desc: "छठ अकेले के पूजा नइखे, पूरा परिवार मिल-जुल के हाथ बंटावेला आ सेवा करेला।" }
    ]
  },
  mai: {
    intro: "छठि पूजामें सर्वाधिक महत्त्वपूर्ण तत्व अछि 'मनक शुद्धि ओ निष्कपट भाव'। कोनो प्रकारक भय वा भ्रमक बिना श्रद्धापूर्वक ई व्रत कयल जाइत अछि।",
    points: [
      { title: "1. संकल्प ओ शुद्धि:", desc: "चारू दिन घरमें पियाज, लहसुन ओ तामसिक भोजन पूर्णतः वर्जित रहैत अछि।" },
      { title: "2. सादगी सर्वोपरि:", desc: "कोनो महंग गहनाक आवश्यकता नहि अछि; सूती पीयर वा लाल वस्त्र ओ बाँसक सूपहि पर्याप्त अछि।" },
      { title: "3. घरहि पर अर्घ्यक व्यवस्था:", desc: "जँ नदी घाट दूर होअय तँ छत वा आंगन में स्वच्छ टब/कुंड में जल भरि क' सेहो अर्घ्य देल जा सकैत अछि।" },
      { title: "4. पारिवारिक सहयोग:", desc: "छठि कोनो एक गोटे केर नहि, अपितु सम्पूर्ण परिवारक सामूहिक उत्सव थिक जाहिमे सभ हाथ बँटबैत छथि।" }
    ]
  },
  mag: {
    intro: "छठ पूजा में सबसे बड़ बात बा 'मन के शुद्धि आ सच्चा भाव'। बिना कौनों डर भा वहम के ई बरत कइल जाला।",
    points: [
      { title: "1. संकल्प व शुद्धि:", desc: "चारों दिन घर में लहसुन, प्याज आ तामसिक भोजन मना रहेला।" },
      { title: "2. सादगी सर्वोपरि:", desc: "महंगा गहना के जरूरत नइखे; सूती पीला या लाल कपड़ा आ बांस के सूप ही काफी बा।" },
      { title: "3. घरे पर अर्घ्य के उपाय:", desc: "नदी दूर होवे पर छत या आंगन में साफ टब में जल भर के भी अर्घ्य देल जा सकैत है।" },
      { title: "4. पूरा परिवार के सहयोग:", desc: "छठ पूरा परिवार के सामूहिक पर्व है जेकरा में सब हाथ बंटावेला।" }
    ]
  }
};

export const getVidhiSteps = (lang: Language): VidhiStepData[] => {
  return vidhiStepsByLang[lang] || vidhiStepsByLang.hi;
};

export const getBeginnerGuide = (lang: Language): BeginnerGuideData => {
  return beginnerGuideByLang[lang] || beginnerGuideByLang.hi;
};
