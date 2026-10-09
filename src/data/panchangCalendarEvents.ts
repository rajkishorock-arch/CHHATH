export interface CalendarEventItem {
  id: string;
  title: string;
  hindiName: string;
  subtitle: string;
  date: string; // ISO format YYYY-MM-DD for precise comparisons
  formattedDate: string; // e.g. "11 अक्टूबर 2026"
  tithi: string;
  category: 'puja' | 'vrat' | 'jayanti' | 'holiday' | 'mahaparv';
  image: string; // High-res authentic real photograph
  vratId?: string;
  isChhath?: boolean;
}

export interface DynamicBannerItem extends CalendarEventItem {
  status: 'past' | 'today' | 'upcoming';
  badge: string;
}

// Comprehensive Hindu Panchang Calendar 2026 with exact dates & real high-res photography
export const PANCHANG_CALENDAR_2026: CalendarEventItem[] = [
  // January
  {
    id: 'makar-sankranti',
    title: 'मकर संक्रांति व पोंगल',
    hindiName: 'मकर संक्रांति',
    subtitle: 'सूर्य देव का मकर राशि में प्रवेश, गंगा स्नान एवं दान-पुण्य महापर्व',
    date: '2026-01-14',
    formattedDate: '14 जनवरी 2026',
    tithi: 'पौष शुक्ल द्वादशी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'vasant-panchami',
    title: 'वसंत पंचमी (सरस्वती पूजा)',
    hindiName: 'वसंत पंचमी',
    subtitle: 'विद्या, बुद्धि एवं ज्ञान प्रदायिनी माँ सरस्वती का पावन प्राकट्योत्सव',
    date: '2026-01-23',
    formattedDate: '23 जनवरी 2026',
    tithi: 'माघ शुक्ल पंचमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-annapurna'
  },

  // February
  {
    id: 'mahashivratri-2026',
    title: 'महाशिवरात्रि महापर्व',
    hindiName: 'महाशिवरात्रि',
    subtitle: 'देवाधिदेव महादेव व माता पार्वती का महाकल्याणकारी पावन शिव विवाह व रुद्राभिषेक',
    date: '2026-02-15',
    formattedDate: '15 फरवरी 2026',
    tithi: 'फाल्गुन कृष्ण चतुर्दशी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'mahashivratri'
  },

  // March
  {
    id: 'holika-dahan',
    title: 'होलिका दहन व होली उत्सव',
    hindiName: 'होलिका दहन',
    subtitle: 'भक्त प्रह्लाद की रक्षा, बुराई पर अच्छाई की विजय एवं रंगों का महापर्व',
    date: '2026-03-03',
    formattedDate: '03 मार्च 2026',
    tithi: 'फाल्गुन पूर्णिमा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'chaitra-navratri',
    title: 'चैत्र नवरात्रि व नव संवत्सर',
    hindiName: 'चैत्र नवरात्रि',
    subtitle: 'हिंदू नव वर्ष 2083 का आरंभ एवं माँ दुर्गा के नव स्वरूपों की कलश स्थापना',
    date: '2026-03-20',
    formattedDate: '20 मार्च 2026',
    tithi: 'चैत्र शुक्ल प्रतिपदा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-durga'
  },
  {
    id: 'ram-navami',
    title: 'श्री राम नवमी',
    hindiName: 'श्री राम नवमी',
    subtitle: 'मर्यादा पुरुषोत्तम भगवान श्री रामचंद्र जी का पावन प्राकट्य दिवस',
    date: '2026-03-28',
    formattedDate: '28 मार्च 2026',
    tithi: 'चैत्र शुक्ल नवमी',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },

  // April
  {
    id: 'hanuman-jayanti',
    title: 'श्री हनुमान जन्मोत्सव',
    hindiName: 'हनुमान जयंती',
    subtitle: 'संकटमोचन पवनपुत्र केसरी नंदन श्री हनुमान जी का दिव्य प्राकट्य पर्व',
    date: '2026-04-02',
    formattedDate: '02 अप्रैल 2026',
    tithi: 'चैत्र पूर्णिमा',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'akshaya-tritiya-2026',
    title: 'अक्षय तृतीया (आखा तीज)',
    hindiName: 'अक्षय तृतीया',
    subtitle: 'अक्षय पुण्य, स्वर्ण क्रय, माँ लक्ष्मी व श्री नारायण की अमोघ कृपा',
    date: '2026-04-20',
    formattedDate: '20 अप्रैल 2026',
    tithi: 'वैशाख शुक्ल तृतीया',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },

  // May
  {
    id: 'ganga-dussehra',
    title: 'माँ गंगा दशहरा',
    hindiName: 'गंगा दशहरा',
    subtitle: 'माँ भगवती गंगा का पृथ्वी पर अवतरण दिवस, दस प्रकार के पापों का शमन',
    date: '2026-05-26',
    formattedDate: '26 मई 2026',
    tithi: 'ज्येष्ठ शुक्ल दशमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },
  {
    id: 'nirjala-ekadashi',
    title: 'निर्जला एकादशी (भीमसेनी)',
    hindiName: 'निर्जला एकादशी',
    subtitle: 'वर्ष की सबसे कठिन व महापुण्य फलदायी निर्जला एकादशी साधना',
    date: '2026-05-27',
    formattedDate: '27 मई 2026',
    tithi: 'ज्येष्ठ शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // July
  {
    id: 'jagannath-rath-yatra',
    title: 'श्री जगन्नाथ रथ यात्रा',
    hindiName: 'जगन्नाथ रथ यात्रा',
    subtitle: 'पुरी धाम में महाप्रभु जगन्नाथ, बलभद्र व सुभद्रा जी की पावन रथ यात्रा',
    date: '2026-07-16',
    formattedDate: '16 जुलाई 2026',
    tithi: 'आषाढ़ शुक्ल द्वितीया',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'guru-purnima',
    title: 'गुरु पूर्णिमा (व्यास पूजा)',
    hindiName: 'गुरु पूर्णिमा',
    subtitle: 'सद्गुरु पूजन, वेद व्यास जयंती एवं आध्यात्मिक गुरुओं के प्रति कृतज्ञता',
    date: '2026-07-29',
    formattedDate: '29 जुलाई 2026',
    tithi: 'आषाढ़ पूर्णिमा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'bhoomi-pujan'
  },

  // August
  {
    id: 'hariyali-teej',
    title: 'हरियाली तीज व्रत',
    hindiName: 'हरियाली तीज',
    subtitle: 'माता पार्वती और भगवान शिव के पुनर्मिलन का पावन सुहाग पर्व',
    date: '2026-08-15',
    formattedDate: '15 अगस्त 2026',
    tithi: 'श्रावण शुक्ल तृतीया',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1000&auto=format&fit=crop&q=80',
    vratId: 'gangaur'
  },
  {
    id: 'nag-panchami',
    title: 'नाग पंचमी पूजन',
    hindiName: 'नाग पंचमी',
    subtitle: 'नाग देवता पूजन, कालसर्प दोष निवारण एवं पारिवारिक सुरक्षा प्रार्थना',
    date: '2026-08-18',
    formattedDate: '18 अगस्त 2026',
    tithi: 'श्रावण शुक्ल पंचमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'mahashivratri'
  },
  {
    id: 'raksha-bandhan',
    title: 'रक्षाबंधन पर्व',
    hindiName: 'रक्षाबंधन',
    subtitle: 'भाई-बहन के अटूट प्रेम, रक्षा सूत्र बंधन एवं सावन पूर्णिमा स्नान',
    date: '2026-08-28',
    formattedDate: '28 अगस्त 2026',
    tithi: 'श्रावण पूर्णिमा',
    category: 'holiday',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // September
  {
    id: 'krishna-janmashtami',
    title: 'श्री कृष्ण जन्माष्टमी',
    hindiName: 'श्री कृष्ण जन्माष्टमी',
    subtitle: 'भगवान श्री कृष्ण का पावन रोहिणी नक्षत्र में मध्यरात्रि प्राकट्योत्सव',
    date: '2026-09-04',
    formattedDate: '04 सितंबर 2026',
    tithi: 'भाद्रपद कृष्ण अष्टमी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1567591414240-e29035e4663a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'krishna-janmashtami'
  },
  {
    id: 'hartalika-teej',
    title: 'हरितालिका तीज व्रत',
    hindiName: 'हरितालिका तीज',
    subtitle: 'गौरी-शंकर पूजन, अखंड सौभाग्य व पति की दीर्घायु हेतु 24 घंटे निर्जला तप',
    date: '2026-09-14',
    formattedDate: '14 सितंबर 2026',
    tithi: 'भाद्रपद शुक्ल तृतीया',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1000&auto=format&fit=crop&q=80',
    vratId: 'karwa-chauth'
  },
  {
    id: 'ganesh-chaturthi',
    title: 'गणेश चतुर्थी (विनायक जन्मोत्सव)',
    hindiName: 'गणेश चतुर्थी',
    subtitle: 'प्रथम पूज्य भगवान श्री गणेश जी की घटस्थापना, मोदक भोग एवं 10 दिवसीय उत्सव',
    date: '2026-09-14',
    formattedDate: '14 सितंबर 2026',
    tithi: 'भाद्रपद शुक्ल चतुर्थी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1567591414240-e29035e4663a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'shri-ganesh'
  },
  {
    id: 'anant-chaturdashi',
    title: 'अनंत चतुर्दशी व विसर्जन',
    hindiName: 'अनंत चतुर्दशी',
    subtitle: 'भगवान अनंत (श्री हरि) का 14 गांठों वाला रक्षासूत्र पूजन व गणेश विसर्जन',
    date: '2026-09-25',
    formattedDate: '25 सितंबर 2026',
    tithi: 'भाद्रपद शुक्ल चतुर्दशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // October
  {
    id: 'jitiya-vrat',
    title: 'जीवित्पुत्रिका (जिउतिया) व्रत',
    hindiName: 'जीवित्पुत्रिका व्रत',
    subtitle: 'संतान के आरोग्य, दीर्घायु एवं रक्षा हेतु माताओं का कठोर निर्जला व्रत',
    date: '2026-10-03',
    formattedDate: '03 अक्टूबर 2026',
    tithi: 'आश्विन कृष्ण अष्टमी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1200&auto=format&fit=crop&q=80',
    vratId: 'jitiya-vrat'
  },
  {
    id: 'shardiya-navratri-kalash',
    title: 'शारदीय नवरात्रि (कलश स्थापना)',
    hindiName: 'शारदीय नवरात्रि',
    subtitle: 'माँ शैलपुत्री पूजन, अखंड ज्योति एवं 9 दिवसीय पावन शक्ति आराधना',
    date: '2026-10-11',
    formattedDate: '11 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल प्रतिपदा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1601055903647-87cb73dfcbb4?w=1200&auto=format&fit=crop&q=80',
    vratId: 'shardiya-navratri-kalash'
  },
  {
    id: 'durga-maha-ashtami',
    title: 'दुर्गा महाअष्टमी व संधि पूजा',
    hindiName: 'दुर्गा महाअष्टमी',
    subtitle: 'माँ महागौरी पूजन, कन्या पूजन एवं महिषासुरमर्दिनी का अमोघ तेज',
    date: '2026-10-18',
    formattedDate: '18 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल अष्टमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8e4?w=1200&auto=format&fit=crop&q=80',
    vratId: 'durga-maha-ashtami'
  },
  {
    id: 'vijayadashami-dussehra',
    title: 'विजयादशमी (दशहरा)',
    hindiName: 'विजयादशमी',
    subtitle: 'अधर्म पर धर्म की विजय, रावण दहन, शस्त्र पूजन एवं अपराजिता स्तुति',
    date: '2026-10-20',
    formattedDate: '20 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल दशमी',
    category: 'holiday',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    vratId: 'vijayadashami-dussehra'
  },
  {
    id: 'karwa-chauth',
    title: 'करवा चौथ (कर्क चतुर्थी)',
    hindiName: 'करवा चौथ',
    subtitle: 'अखंड सौभाग्य, चंद्र अर्घ्य एवं पति की दीर्घायु का निर्जला व्रत',
    date: '2026-10-29',
    formattedDate: '29 अक्टूबर 2026',
    tithi: 'कार्तिक कृष्ण चतुर्थी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    vratId: 'karwa-chauth'
  },

  // November
  {
    id: 'dhanteras-kuber',
    title: 'धनतेरस व कुबेर जयंती',
    hindiName: 'धनतेरस',
    subtitle: 'भगवान धन्वंतरि प्राकट्य दिवस, सुख-समृद्धि एवं बर्तन-स्वर्ण क्रय का पर्व',
    date: '2026-11-06',
    formattedDate: '06 नवंबर 2026',
    tithi: 'कार्तिक कृष्ण त्रयोदशी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    vratId: 'dhanteras-kuber'
  },
  {
    id: 'diwali-lakshmi-puja',
    title: 'दीपावली (महालक्ष्मी पूजन)',
    hindiName: 'दीपावली',
    subtitle: 'माँ महालक्ष्मी-श्री गणेश पूजन, दीपमालिका एवं अंधकार पर प्रकाश की विजय',
    date: '2026-11-08',
    formattedDate: '08 नवंबर 2026',
    tithi: 'कार्तिक अमावस्या',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
    vratId: 'diwali-lakshmi-puja'
  },
  {
    id: 'govardhan-puja',
    title: 'गोवर्धन पूजा व अन्नकूट',
    hindiName: 'गोवर्धन पूजा',
    subtitle: 'भगवान श्री कृष्ण द्वारा गोवर्धन पर्वत धारण, गौ माता व प्रकृति पूजन',
    date: '2026-11-09',
    formattedDate: '09 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल प्रतिपदा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1567591414240-e29035e4663a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'krishna-janmashtami'
  },
  {
    id: 'bhai-dooj',
    title: 'भाई दूज (यम द्वितीया)',
    hindiName: 'भाई दूज',
    subtitle: 'बहन-भाई के स्नेह का पवित्र बंधन, यमराज व यमुना जी का मंगल मिलन',
    date: '2026-11-10',
    formattedDate: '10 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल द्वितीया',
    category: 'holiday',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'chhath-mahaparv-nahay-khay',
    title: 'छठ महापर्व — नहाय खाय',
    hindiName: 'छठ नहाय खाय',
    subtitle: 'पवित्र नदी स्नान, आत्मशुद्धि एवं सात्विक कद्दू-भात ग्रहण से 4-दिवसीय अनुष्ठान का आरंभ',
    date: '2026-11-13',
    formattedDate: '13 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल चतुर्थी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    isChhath: true,
    vratId: 'chhath-mahaparv-nahay-khay'
  },
  {
    id: 'chhath-mahaparv-kharna',
    title: 'छठ महापर्व — खरना',
    hindiName: 'छठ खरना',
    subtitle: 'दिनभर निर्जला उपवास के बाद मिट्टी के चूल्हे पर बनी गुड़ की खीर व रोटी का पावन महाप्रसाद',
    date: '2026-11-14',
    formattedDate: '14 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल पंचमी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
    isChhath: true,
    vratId: 'chhath-mahaparv-kharna'
  },
  {
    id: 'chhath-mahaparv-sandhya-arghya',
    title: 'छठ महापर्व — संध्या अर्घ्य',
    hindiName: 'छठ संध्या अर्घ्य',
    subtitle: 'गंगा व नदी तटों पर अस्ताचलगामी भुवन भास्कर सूर्य देव को सूप-दउरा से प्रथम अर्घ्य अर्पण',
    date: '2026-11-15',
    formattedDate: '15 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल षष्ठी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    isChhath: true,
    vratId: 'chhath-mahaparv-sandhya-arghya'
  },
  {
    id: 'chhath-mahaparv-usha-arghya',
    title: 'छठ महापर्व — उषा अर्घ्य व पारण',
    hindiName: 'छठ उषा अर्घ्य',
    subtitle: 'उदीयमान सूर्य देव को प्रातःकालीन अर्घ्य दान, 36 घंटे के निर्जला महातप की पूर्णता व पारण',
    date: '2026-11-16',
    formattedDate: '16 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल सप्तमी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    isChhath: true,
    vratId: 'chhath-mahaparv-usha-arghya'
  },
  {
    id: 'dev-uthani-ekadashi',
    title: 'देवउठनी एकादशी (तुलसी विवाह)',
    hindiName: 'देवउठनी एकादशी',
    subtitle: 'चातुर्मास की समाप्ति, भगवान विष्णु का योग निद्रा से जागरण व मांगलिक कार्यों का शुभारंभ',
    date: '2026-11-21',
    formattedDate: '21 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'kartik-purnima',
    title: 'कार्तिक पूर्णिमा व देव दीपावली',
    hindiName: 'कार्तिक पूर्णिमा',
    subtitle: 'काशी के घाटों पर भव्य देव दीपावली, गंगा स्नान व दीपदान का अनंत महात्म्य',
    date: '2026-11-24',
    formattedDate: '24 नवंबर 2026',
    tithi: 'कार्तिक पूर्णिमा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },

  // December
  {
    id: 'gita-jayanti',
    title: 'श्रीमद्भगवद्गीता जयंती',
    hindiName: 'गीता जयंती',
    subtitle: 'कुरुक्षेत्र में भगवान श्री कृष्ण द्वारा अर्जुन को दिए गए अमर गीता उपदेश का प्राकट्य दिवस',
    date: '2026-12-20',
    formattedDate: '20 दिसंबर 2026',
    tithi: 'मार्गशीर्ष शुक्ल एकादशी',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'krishna-janmashtami'
  }
];

/**
 * Automatically computes:
 * - 5 past festivals immediately preceding the current date
 * - 5 upcoming festivals on or after the current date
 * Dynamic: Always adapts in real-time according to present calendar date!
 */
export function getDynamicCalendarBanners(currentDate: Date = new Date()): DynamicBannerItem[] {
  // Format current date in YYYY-MM-DD
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Sort full calendar chronologically
  const sorted = [...PANCHANG_CALENDAR_2026].sort((a, b) => a.date.localeCompare(b.date));

  // Separate into past and upcoming
  const pastList = sorted.filter(item => item.date < todayStr);
  const upcomingList = sorted.filter(item => item.date >= todayStr);

  // Take the 5 most recent past items (closest to today)
  const recent5Past = pastList.slice(-5).map(item => ({
    ...item,
    status: 'past' as const,
    badge: 'हाल ही में सम्पन्न'
  }));

  // Take the 5 upcoming items (including today)
  const next5Upcoming = upcomingList.slice(0, 5).map(item => ({
    ...item,
    status: (item.date === todayStr ? 'today' : 'upcoming') as ('today' | 'upcoming'),
    badge: item.date === todayStr ? '🌟 आज का महापर्व' : '✨ आगामी महापर्व'
  }));

  // If there are fewer than 5 past (e.g. beginning of year), pad with remaining
  let combined = [...recent5Past, ...next5Upcoming];

  // If still fewer than 10, fill from available
  if (combined.length < 10 && sorted.length >= 10) {
    const existingIds = new Set(combined.map(c => c.id));
    for (const item of sorted) {
      if (!existingIds.has(item.id)) {
        combined.push({
          ...item,
          status: item.date < todayStr ? 'past' : 'upcoming',
          badge: item.date < todayStr ? 'विगत पर्व' : 'आगामी पर्व'
        });
        if (combined.length >= 10) break;
      }
    }
  }

  return combined;
}
