import { ChhathDayInfo, Language } from '../types';

export const chhathDaysByLang: Record<Language, ChhathDayInfo[]> = {
  hi: [
    {
      dayNumber: 1,
      id: "nahay-khay",
      title: "दिन 1: नहाय-खाय (Nahay Khay)",
      nameKey: "nahayKhay",
      date2026: "13 नवंबर 2026 (शुक्रवार)",
      tithi: "कार्तिक शुक्ल चतुर्थी",
      meaning: "पवित्र स्नान और सात्विक आहार के साथ चार दिवसीय महापर्व का शुभारंभ। 'नहाय' अर्थात गंगा/पवित्र नदी में स्नान और 'खाय' अर्थात शुद्ध सात्विक भोजन ग्रहण करना।",
      rituals: [
        "व्रती प्रातःकाल पवित्र नदी, तालाब या घर पर गंगाजल मिश्रित जल से स्नान करते हैं।",
        "घर तथा पूजा स्थल की विशेष रूप से गंगाजल छिड़क कर पूर्ण शुद्धिकरण की जाती है।",
        "व्रती नए अथवा धौत पवित्र वस्त्र धारण करते हैं।",
        "मिट्टी अथवा पीतल/कांसे के नए बर्तनों में ही भोजन बनाया जाता है।"
      ],
      food: "सेंधा नमक, देशी घी में पकी अरवा चावल की भात, चने की दाल और शुद्ध घी में छौंकी हुई कद्दू (लौकी / घिया) की सब्जी। इसे सबसे पहले व्रती ग्रहण करते हैं, तत्पश्चात परिवार के अन्य सदस्य प्रसाद रूप में पाते हैं।",
      importance: "नहाय-खाय का मुख्य उद्देश्य मन, वचन और कर्म से कायिक शुद्धि प्राप्त करना है ताकि आगामी 36 घंटे के निर्जला व्रत के लिए शरीर और चेतना तैयार हो सके।",
      bgGradient: "from-amber-600 to-orange-500"
    },
    {
      dayNumber: 2,
      id: "kharna",
      title: "दिन 2: खरना / लोहंडा (Kharna)",
      nameKey: "kharna",
      date2026: "14 नवंबर 2026 (शनिवार)",
      tithi: "कार्तिक शुक्ल पंचमी",
      meaning: "'खरना' का अर्थ होता है अंतःकरण का शुद्धिकरण। इस दिन से व्रती का 36 घंटे का कठिन निर्जला उपवास प्रारंभ होता है।",
      rituals: [
        "व्रती पूरे दिन पूर्ण निर्जला उपवास रखते हैं और शाम तक जल की एक बूंद भी नहीं पीते।",
        "सायंकाल मिट्टी के नए चूल्हे पर आम की सूखी लकड़ियों से अग्नि प्रज्वलित की जाती है।",
        "सूर्यास्त के पश्चात व्रती एकांत शांत कमरे में केले के पत्ते पर मां षष्ठी को भोग अर्पित कर पूजन करते हैं।",
        "पूजन के समय घर में पूर्ण शांति रखी जाती है; तनिक भी आवाज होने पर व्रती भोजन वहीं रोक देते हैं।"
      ],
      food: "गुड़ और गाय के दूध में धीमी आंच पर पकी 'रसियाव' (गुड़ की खीर), घी लगी रोटी अथवा सोहारी, और केला। व्रती के प्रसाद पाने के बाद यह अमृतमयी खीर-रोटी महाप्रसाद रूप में आस-पड़ोस और रिश्तेदारों में बांटी जाती है।",
      importance: "खरना मानसिक संकल्प और इंद्रिय संयम का दिन है। यह प्रसाद सात्विकता और अहंकार-मुक्ति का प्रतीक माना जाता है।",
      bgGradient: "from-orange-600 to-red-600"
    },
    {
      dayNumber: 3,
      id: "sandhya-arghya",
      title: "दिन 3: संध्या अर्घ्य (Sandhya Arghya / पहला अर्घ्य)",
      nameKey: "sandhyaArghya",
      date2026: "15 नवंबर 2026 (रविवार)",
      tithi: "कार्तिक शुक्ल षष्ठी",
      meaning: "डूबते हुए अस्ताचलगामी सूर्य को अर्घ्य समर्पित करना। यह विश्व की एकमात्र ऐसी सनातन परंपरा है जहां ढलते हुए सूर्य को भी पूर्ण श्रद्धा से नमन किया जाता है।",
      rituals: [
        "दोपहर में पूर्ण शुद्धि और पवित्रता के साथ ठेकुआ, भुसवा और कसार का महाप्रसाद तैयार किया जाता है।",
        "बांस के सूप और दउरा में ठेकुआ, ईख, फल, नारियल, अदरक का पौधा, मूली आदि सजाए जाते हैं।",
        "परिवार के पुरुष सिर पर दउरा उठाकर नंगे पांव पारंपरिक लोकगीत गाते हुए घाट की ओर प्रस्थान करते हैं।",
        "व्रती कमर तक गंगाजल अथवा नदी/तालाब के पवित्र जल में खड़े होकर अस्ताचलगामी सूर्य को दूध व जल से अर्घ्य अर्पित करते हैं।"
      ],
      food: "व्रती इस पूरे दिन और रात भी निर्जला उपवास पर रहते हैं। रात में घाट पर या घर के आंगन में गन्ने का भव्य मंडप (कोसी) बनाकर दीप जलाए जाते हैं और रात भर जागरण व मंगल गीत होते हैं।",
      importance: "अस्ताचलगामी सूर्य की पूजा यह संदेश देती है कि जीवन में अवसान भी उतना ही वंदनीय है जितना उदय। यह जीवन के उतार-चढ़ाव में कृतज्ञता का प्रतीक है।",
      bgGradient: "from-red-600 to-amber-700"
    },
    {
      dayNumber: 4,
      id: "usha-arghya",
      title: "दिन 4: उषा अर्घ्य / पारण (Usha Arghya)",
      nameKey: "ushaArghya",
      date2026: "16 नवंबर 2026 (सोमवार)",
      tithi: "कार्तिक शुक्ल सप्तमी",
      meaning: "उदित होते हुए बाल-सूर्य को अर्घ्य देकर 36 घंटे के अखंड निर्जला व्रत की पूर्णाहुति एवं पारण।",
      rituals: [
        "सूर्य निकलने से पूर्व ही भोर में (ब्रह्ममुहूर्त) सभी श्रद्धालु पुनः घाट पर एकत्र होते हैं।",
        "व्रती नदी के शीतल जल में उतरकर हाथ में अर्घ्य का सूप लिए सूर्य देव की प्रतीक्षा करते हैं।",
        "पूर्व दिशा में लालिमा बिखरते ही गाय के कच्चे दूध और गंगाजल से उदित होते भुवन भास्कर को अंतिम अर्घ्य दिया जाता है।",
        "छठी मईया से संतान की दीर्घायु, परिवार के कल्याण, आरोग्य और लोक मंगल की प्रार्थना की जाती है।"
      ],
      food: "अर्घ्य के बाद व्रती घाट पर ही कच्चा दूध, अदरक, अंकुरित चना और गुड़ खाकर व्रत का 'पारण' करते हैं। इसके उपरांत सभी को ठेकुआ और फलों का पावन प्रसाद वितरित किया जाता है।",
      importance: "उषा अर्घ्य नई आशा, ऊर्जा, नवजीवन और आरोग्य का संचार करता है। यह महापर्व सामाजिक समरसता का सर्वोच्च प्रमाण है जहां कोई जाति-भेद नहीं होता।",
      bgGradient: "from-amber-500 to-yellow-400"
    }
  ],

  en: [
    {
      dayNumber: 1,
      id: "nahay-khay",
      title: "Day 1: Nahay Khay (Holy Bath & Feast)",
      nameKey: "nahayKhay",
      date2026: "13 November 2026 (Friday)",
      tithi: "Kartik Shukla Chaturthi",
      meaning: "The auspicious commencement of the four-day festival through sacred bathing and pure satvik food. 'Nahay' means holy river bathing, and 'Khay' signifies partaking in sanctified food.",
      rituals: [
        "Fasting devotees (Vrati) take a holy bath in a sacred river, pond, or home with Ganga water at dawn.",
        "The house and puja altar are purified thoroughly by sprinkling holy Ganga water.",
        "Devotees wear clean, fresh, unstitched sacred cotton clothing.",
        "Food is cooked exclusively in earthen, brass, or bronze utensils with complete devotion."
      ],
      food: "Satvik feast cooked with rock salt (sendha namak) in pure cow ghee: aromatic arwa rice, chana dal, and bottle gourd (kaddu / lauki). The vrati eats first, followed by the entire family.",
      importance: "The primary purpose of Nahay-Khay is bodily, mental, and spiritual purification to prepare the consciousness for the rigorous 36-hour waterless fast ahead.",
      bgGradient: "from-amber-600 to-orange-500"
    },
    {
      dayNumber: 2,
      id: "kharna",
      title: "Day 2: Kharna / Lohanda (The Waterless Fast Begins)",
      nameKey: "kharna",
      date2026: "14 November 2026 (Saturday)",
      tithi: "Kartik Shukla Panchami",
      meaning: "'Kharna' symbolizes the purification of the inner consciousness. From this auspicious evening, the rigorous 36-hour uninterrupted waterless fast (Nirjala Vrat) begins.",
      rituals: [
        "The devotee fasts without a drop of water through the entire day until dusk.",
        "In the evening, a sacred fire is lit using dry mango wood on a pristine earthen stove.",
        "After sunset, the vrati offers Rasiyaw, ghee rotis, and bananas to Goddess Shashthi in quiet isolation.",
        "Absolute pin-drop silence is maintained in the household; any sound halts the offering."
      ],
      food: "Rasiyaw (divine slow-cooked jaggery and cow milk kheer), rotis generously coated with pure ghee, and bananas. After the vrati consumes it, this divine prasad is shared with loved ones and neighbors.",
      importance: "Kharna is the ultimate day of spiritual resolve and sensory discipline, embodying detachment and profound devotion.",
      bgGradient: "from-orange-600 to-red-600"
    },
    {
      dayNumber: 3,
      id: "sandhya-arghya",
      title: "Day 3: Sandhya Arghya (Sunset Sun Offering / Pehla Arghya)",
      nameKey: "sandhyaArghya",
      date2026: "15 November 2026 (Sunday)",
      tithi: "Kartik Shukla Shashthi",
      meaning: "Offering oblations (Arghya) to the setting Sun. This is humanity's only timeless Vedic tradition where reverence and gratitude are offered to the setting sun, signifying equanimity.",
      rituals: [
        "In the afternoon, the Mahaprasad of Thekua, Bhuswa, and Kasar is prepared with utmost sanctity.",
        "Bamboo winnows (Sup) and large baskets (Daura) are decorated with Thekua, whole sugarcane, fruits, coconut, and lamps.",
        "Male family members carry the sacred Daura on their heads, walking barefoot while singing soulful folk hymns.",
        "Standing waist-deep in the cool waters of the river/lake, devotees offer raw milk and Ganga water oblations to the setting sun."
      ],
      food: "Devotees continue fasting without water through the entire day and night. At night, a vibrant sugarcane canopy (Kosi) with earthen lamps is erected for night-long devotion and singing.",
      importance: "Worshiping the setting Sun delivers the profound wisdom that departures and endings are as divine as beginnings, cultivating unwavering gratitude.",
      bgGradient: "from-red-600 to-amber-700"
    },
    {
      dayNumber: 4,
      id: "usha-arghya",
      title: "Day 4: Usha Arghya & Paran (Morning Sun Offering & Conclusion)",
      nameKey: "ushaArghya",
      date2026: "16 November 2026 (Monday)",
      tithi: "Kartik Shukla Saptami",
      meaning: "Offering Arghya to the rising Sun at dawn, completing the 36-hour waterless penance, followed by the festive holy feast (Paran).",
      rituals: [
        "Long before dawn (Brahma Muhurta), devotees and families gather once again at the vibrant riverbanks.",
        "Standing in the cold sacred waters holding the Arghya Sup, devotees eagerly await the first crimson dawn of Lord Surya.",
        "As the first rays emerge in the east, the final Arghya of cow milk and holy water is poured to the rising Sun.",
        "Devotees pray to Chhathi Maiya for children's longevity, family health, prosperity, and cosmic peace."
      ],
      food: "After Arghya, devotees break their fast at the ghat with raw milk, ginger, sprouted gram, and jaggery. The blissful Thekua prasad is then distributed universally.",
      importance: "Usha Arghya brings new vitality, healing, and joy. Chhath exemplifies social equality and unity, where all devotees stand shoulder-to-shoulder with zero distinction.",
      bgGradient: "from-amber-500 to-yellow-400"
    }
  ],

  bho: [
    {
      dayNumber: 1,
      id: "nahay-khay",
      title: "दिन 1: नहाय-खाय (Nahay Khay)",
      nameKey: "nahayKhay",
      date2026: "13 नवंबर 2026 (शुक)",
      tithi: "कार्तिक सुक्ल चतुर्थी",
      meaning: "पवित्र असनान आ सुद्ध अहार के साथ चार दिने के महापर्व के सुरुआत। 'नहाय' माने गंगा भा नदी में असनान आ 'खाय' माने सुद्ध सात्विक भोजन कइल।",
      rituals: [
        "बरती सब बिहान के पावन नदी, तलाब भा घरे गंगाजल मिला के असनान करेलीं।",
        "घर आ पूजा के जगहा के गंगाजल छींट के सुद्ध कइल जाला।",
        "बरती नयका आ पवित्र धोवल बस्तर पहिनेलीं।",
        "माटी भा पीतर-कांसा के बर्तन में ही खाना बनेला।"
      ],
      food: "सेंधा नोन, सुद्ध घीव में बनल अरवा चउर के भात, चना के दाल आ लौकी (कद्दू) के तरकारी। पहिले बरती पावेलीं, ओकरा बाद सगरी परिवार परसाद पावेला।",
      importance: "नहाय-खाय के मूल मकसद बा कि मन, बचन आ करम से सरीर के सुद्ध कइल जाव ताकि 36 घंटा के निरजला बरत खातिर सरीर तइयार हो सके।",
      bgGradient: "from-amber-600 to-orange-500"
    },
    {
      dayNumber: 2,
      id: "kharna",
      title: "दिन 2: खरना / लोहंडा (Kharna)",
      nameKey: "kharna",
      date2026: "14 नवंबर 2026 (सनीचर)",
      tithi: "कार्तिक सुक्ल पंचमी",
      meaning: "'खरना' के मतलब होला अंतःकरण के सुद्धता। एही सांझ से बरती के 36 घंटा के कठिन निरजला उपवास सुरू हो जाला।",
      rituals: [
        "बरती दिन भर निरजला रहेलीं आ सांझ ले पानी के एगो बूंद ना पिएलीं।",
        "सांझ के माटी के नयका चूल्हा पर आम के लकड़ी से अगिया जरावल जाला।",
        "सुरुज डूबला के बाद बरती एकांत कोठरी में केरा के पात पर छठी मइया के भोग लगावेलीं।",
        "पूजा के घरी घर में सुमसाम शांति रहेला; तनिक आवाज पर बरती भोजन रोक देवेलीं।"
      ],
      food: "मीठा (गुड़) आ गाय के दूध में धीमा आंच पर पाकल 'रसियाव' (गुड़ के खीर), घीव लागल रोटी आ केरा। ई अमृतमयी परसाद आस-पड़ोस में बांटल जाला।",
      importance: "खरना मानसिक संकल्प आ इंद्रिय संयम के दिन हवे। ई सात्विकता आ अहंकार-मुक्ति के परतीक मानल जाला।",
      bgGradient: "from-orange-600 to-red-600"
    },
    {
      dayNumber: 3,
      id: "sandhya-arghya",
      title: "दिन 3: सँझिया अरघ (Pehla Arghya)",
      nameKey: "sandhyaArghya",
      date2026: "15 नवंबर 2026 (इतवार)",
      tithi: "कार्तिक सुक्ल षष्ठी",
      meaning: "डूबत सुरुज गोसांईं के अरघ देवल। ई दुनिया के एकलौता परंपरा हवे जहां डूबत सुरुज के भी गोड़ लागल जाला।",
      rituals: [
        "दोपहर में नेम से ठेकुआ, भुसवा आ कसार के महापरसाद बनेला।",
        "बांस के सूप आ दउरा में ठेकुआ, ईख, फल, नारियल आ दिया सजावल जाला।",
        "घर के मरद मूड़ी पर दउरा उठा के नंगे पांव गीत गावत घाट ले जालें।",
        "बरती कमर भर पानी में ठाढ़ होके डूबत सुरुज के दूध आ गंगाजल के धार से अरघ देवेलीं।"
      ],
      food: "बरती रात भर भी निरजला रहेलीं। रात में घाट भा घर के अंगना में ईख के कोसी भरल जाला आ रात भर मंगल गीत गावल जाला।",
      importance: "डूबत सुरुज के पूजा ई सिखावेला कि जिनगी में उतार आ चढ़ाव दूनों में भगवान के सरन में रहे के चाहीं।",
      bgGradient: "from-red-600 to-amber-700"
    },
    {
      dayNumber: 4,
      id: "usha-arghya",
      title: "दिन 4: भोरहरिया अरघ / पारन (Usha Arghya)",
      nameKey: "ushaArghya",
      date2026: "16 नवंबर 2026 (सोमार)",
      tithi: "कार्तिक सुक्ल सप्तमी",
      meaning: "उगत सुरुज के अरघ दे के 36 घंटा के अखंड निरजला बरत के पूर्णाहुति आ पारन कइल जाला।",
      rituals: [
        "सुरुज उगला से पहिलहीं सब लोग घाट पर सूप-दउरा सजा के पहुंच जाला।",
        "बरती शीतल जल में उतर के हाथ में अरघ के सूप ले के सुरुज देव के बाट जोहेलीं।",
        "पूरब में लाली लउकते ही गाय के कच्चा दूध आ जल से अंतिम अरघ समर्पित कइल जाला।",
        "छठी मइया से बाल-बच्चा के लमहर उमिर आ कुल के कल्याण के अरदास कइल जाला।"
      ],
      food: "अरघ के बाद घाटहीं पर कच्चा दूध, आदी, अंकुरित चना आ गुड़ खा के पारन कइल जाला। ओकरा बाद ठेकुआ के परसाद बांटल जाला।",
      importance: "भोरहरिया अरघ नई उम्मीद आ ऊर्जा भरेला। ई परब में कवनो जात-पात ना होके सब लोग एक्के भाव से पूजा करेला।",
      bgGradient: "from-amber-500 to-yellow-400"
    }
  ],

  mai: [
    {
      dayNumber: 1,
      id: "nahay-khay",
      title: "दिन 1: नहाय-खाय (Nahay Khay)",
      nameKey: "nahayKhay",
      date2026: "13 नवंबर 2026 (शुक्र)",
      tithi: "कार्तिक शुक्ल चतुर्थी",
      meaning: "पवित्र स्नान ओ सात्विक आहार केर संग चारि दिवसीय महापर्वक शुभारंभ। 'नहाय' अर्थात् गंगा वा पावन नदी में स्नान ओ 'खाय' अर्थात् सात्विक भोजन ग्रहण करब।",
      rituals: [
        "व्रती प्रातःकाल पवित्र नदी, पोखर वा घरहि में गंगाजल मिला कऽ स्नान करैत छथि।",
        "घर तथा पूजा स्थलक गंगाजल छिड़कि कऽ पूर्ण शुद्धिकरण कएल जाइत अछि।",
        "व्रती नव वा धौत पवित्र वस्त्र धारण करैत छथि।",
        "माटिक चूल्हा वा पीतर केर बर्तन में सात्विक भोजन बनैत अछि।"
      ],
      food: "सेंधा नून, देशी घीव में बनल अरवा चामरक भात, चना केर दालि ओ शुद्ध घीव में छौंकल कद्दूक तरकारी। पहिने व्रती प्रसाद ग्रहण करैत छथि, तदनंतर परिवारक लोक।",
      importance: "नहाय-खायक मूल उद्देश्य मन, वचन ओ कर्मक शुद्धि प्राप्त करब अछि जाहिसँ आगामी 36 घंटाक निर्जला व्रतक लेल शरीर सज्ज भऽ सकय।",
      bgGradient: "from-amber-600 to-orange-500"
    },
    {
      dayNumber: 2,
      id: "kharna",
      title: "दिन 2: खरना / लोहंडा (Kharna)",
      nameKey: "kharna",
      date2026: "14 नवंबर 2026 (शनि)",
      tithi: "कार्तिक शुक्ल पंचमी",
      meaning: "'खरना' केर तात्पर्य अंतःकरणक शुद्धिकरण सं अछि। एहि साँझ सं व्रतीक 36 घंटाक कठिन निर्जला उपवास प्रारंभ होइत अछि।",
      rituals: [
        "व्रती दिन भरि निर्जला रहैत छथि ओ साँझ धरि जलक एको बूंद नहि ग्रहण करैत छथि।",
        "साँझक बेरा माटिक नव चूल्हा पर आमक काठ सं अग्नि प्रज्वलित कएल जाइत अछि।",
        "सूर्यास्तक उपरांत व्रती एकांत शांत कक्ष में केराक पात पर षष्ठी देवीक भोग लगा कऽ पूजन करैत छथि।",
        "पूजनक काल घर में पूर्ण नीरवता रहैत अछि; तनिकहू शब्द भेला पर व्रती भोजन रोक देइत छथि।"
      ],
      food: "गुड़ ओ गाय केर दूध में पाकल 'रसियाव' (गुड़क खीर), घीव लागल रोटी वा सोहारी, ओ केला। ई महाप्रसाद आसे-पासे ओ कुटुम-सजन में वितरित कएल जाइत अछि।",
      importance: "खरना मानसिक संकल्प ओ इंद्रिय संयमक दिवस अछि। ई प्रसाद सात्विकता ओ निरहंकारिताक प्रतीक थिक।",
      bgGradient: "from-orange-600 to-red-600"
    },
    {
      dayNumber: 3,
      id: "sandhya-arghya",
      title: "दिन 3: साँझक अर्घ्य (Sandhya Arghya)",
      nameKey: "sandhyaArghya",
      date2026: "15 नवंबर 2026 (रवि)",
      tithi: "कार्तिक शुक्ल षष्ठी",
      meaning: "अस्ताचलगामी सूर्यकेँ अर्घ्य समर्पण। ई समस्त विश्वक अद्वितीय सनातन परंपरा थिक जतय ढलैत सूर्यकेँ सेहो नमन कएल जाइत अछि।",
      rituals: [
        "दोपहर में पूर्ण शुचिताक संग ठेकुआ, भुसवा ओ कसारक महाप्रसाद प्रस्तुत कएल जाइत अछि।",
        "बाँसक सूप ओ दउरा में ठेकुआ, ईख, फल, नारिकेल, आदा, मूली आदि सज़ाओल जाइत अछि।",
        "परिवारक पुरुष माथ पर दउरा लऽ कऽ नंगे पाँव पावन छठि गीत गबैत घाट दिश प्रस्थान करैत छथि।",
        "व्रती कमर भरि जल में ठाढ़ भऽ कऽ अस्ताचलगामी सूर्यकेँ दूध ओ जलक धार सं अर्घ्य अर्पित करैत छथि।"
      ],
      food: "व्रती ई संपूर्ण दिवस ओ रात्रि सेहो निर्जला रहैत छथि। राति में घाट वा आँगने में ईखक कोसी भरल जाइत अछि ओ राति भरि जागरण ओ मंगल गीत होइत अछि।",
      importance: "अस्ताचलगामी सूर्यक पूजा ई बोध करबैत अछि जे जीवनक अवसान सेहो तेतने वंदनीय अछि जतेक उदय।",
      bgGradient: "from-red-600 to-amber-700"
    },
    {
      dayNumber: 4,
      id: "usha-arghya",
      title: "दिन 4: प्रात: अर्घ्य / पारण (Usha Arghya)",
      nameKey: "ushaArghya",
      date2026: "16 नवंबर 2026 (सोम)",
      tithi: "कार्तिक शुक्ल सप्तमी",
      meaning: "उदित होइत बाल-सूर्यकेँ अर्घ्य दऽ कऽ 36 घंटाक अखंड निर्जला व्रतक पूर्णाहुति ओ पारण।",
      rituals: [
        "सूर्योदय सं पूर्वहि भोर में समस्त श्रद्धालु पुनः घाट पर सूप ओ दउरा सज़ा कऽ उपस्थित होइत छथि।",
        "व्रती शीतल जल में उतरि कऽ हाथ में अर्घ्यक सूप लऽ भगवान भास्कराक प्रतीक्षा करैत छथि।",
        "पूर्व दिशा में लालिमा देखाइतहि गाय केर कच्चा दूध ओ जल सं उदित सूर्यकेँ अंतिम अर्घ्य अर्पित कएल जाइत अछि।",
        "छठी मइया सं संतानक दीर्घायु, परिवारक कल्याण ओ लोक-कल्याणक कामना कएल जाइत अछि।"
      ],
      food: "अर्घ्यक उपरांत व्रती घाटहि पर कच्चा दूध, आदा, अंकुरित चना ओ गुड़ खा कऽ व्रतक 'पारण' करैत छथि। तदनंतर ठेकुआक महाप्रसाद वितरित कएल जाइत अछि।",
      importance: "उषा अर्घ्य नव आशा, ऊर्जा ओ नवजीवनक संचार करैत अछि। ई महापर्व सामाजिक समरसताक सर्वोच्च प्रमाण थिक।",
      bgGradient: "from-amber-500 to-yellow-400"
    }
  ],
  mag: [] // Will assign below
};
chhathDaysByLang.mag = chhathDaysByLang.hi;

export const getChhathDays = (lang: Language = 'hi'): ChhathDayInfo[] => {
  return chhathDaysByLang[lang] || chhathDaysByLang.hi;
};

export const chhathDays = chhathDaysByLang.hi;

