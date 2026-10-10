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
  // January 2026
  {
    id: 'paush-putrada-ekadashi',
    title: 'पौष पुत्रदा एकादशी',
    hindiName: 'पौष पुत्रदा एकादशी',
    subtitle: 'संतान सुख, वंश वृद्धि एवं श्री नारायण की असीम अनुकंपा का पावन उपवास',
    date: '2026-01-03',
    formattedDate: '03 जनवरी 2026',
    tithi: 'पौष शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'makar-sankranti',
    title: 'मकर संक्रांति व पोंगल',
    hindiName: 'मकर संक्रांति',
    subtitle: 'सूर्य देव का मकर राशि में प्रवेश, उत्तरायण आरंभ, गंगा स्नान एवं दान-पुण्य महापर्व',
    date: '2026-01-14',
    formattedDate: '14 जनवरी 2026',
    tithi: 'पौष शुक्ल द्वादशी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'shattila-ekadashi',
    title: 'षटतिला एकादशी',
    hindiName: 'षटतिला एकादशी',
    subtitle: 'तिल के 6 प्रकार के उपयोग से समस्त पापों का नाश एवं मोक्ष प्राप्ति का व्रत',
    date: '2026-01-18',
    formattedDate: '18 जनवरी 2026',
    tithi: 'माघ कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'vasant-panchami',
    title: 'वसंत पंचमी (सरस्वती पूजा)',
    hindiName: 'वसंत पंचमी',
    subtitle: 'विद्या, बुद्धि, ज्ञान व कला प्रदायिनी माँ सरस्वती का पावन प्राकट्योत्सव',
    date: '2026-01-23',
    formattedDate: '23 जनवरी 2026',
    tithi: 'माघ शुक्ल पंचमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-annapurna'
  },
  {
    id: 'jaya-ekadashi',
    title: 'जया एकादशी व्रत',
    hindiName: 'जया एकादशी',
    subtitle: 'पिशाच योनि से मुक्ति व भगवान विष्णु के वैकुंठ धाम की प्राप्ति कराने वाला एकादशी व्रत',
    date: '2026-01-31',
    formattedDate: '31 जनवरी 2026',
    tithi: 'माघ शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // February 2026
  {
    id: 'magha-purnima',
    title: 'माघ पूर्णिमा स्नान व रविदास जयंती',
    hindiName: 'माघ पूर्णिमा',
    subtitle: 'माघ मास का अंतिम महास्नान, प्रयागराज कल्पवास पूर्णता एवं संत रविदास जयंती',
    date: '2026-02-01',
    formattedDate: '01 फरवरी 2026',
    tithi: 'माघ पूर्णिमा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },
  {
    id: 'vijaya-ekadashi',
    title: 'विजया एकादशी व्रत',
    hindiName: 'विजया एकादशी',
    subtitle: 'कठिन से कठिन परिस्थिति में विजय प्रदाता एकादशी, लंका विजय हेतु प्रभु राम ने रखा था व्रत',
    date: '2026-02-13',
    formattedDate: '13 फरवरी 2026',
    tithi: 'फाल्गुन कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'mahashivratri-2026',
    title: 'महाशिवरात्रि महापर्व',
    hindiName: 'महाशिवरात्रि',
    subtitle: 'देवाधिदेव महादेव व माता पार्वती का महाकल्याणकारी पावन शिव विवाह, रुद्राभिषेक व चार प्रहर पूजा',
    date: '2026-02-15',
    formattedDate: '15 फरवरी 2026',
    tithi: 'फाल्गुन कृष्ण चतुर्दशी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'mahashivratri'
  },
  {
    id: 'amalaki-ekadashi',
    title: 'आमलकी एकादशी (आंवला एकादशी)',
    hindiName: 'आमलकी एकादशी',
    subtitle: 'आंवले के वृक्ष में साक्षात् भगवान विष्णु व शिव का वास मानकर किया जाने वाला पावन पूजन',
    date: '2026-02-27',
    formattedDate: '27 फरवरी 2026',
    tithi: 'फाल्गुन शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // March 2026
  {
    id: 'holika-dahan',
    title: 'होलिका दहन',
    hindiName: 'होलिका दहन',
    subtitle: 'भक्त प्रह्लाद की रक्षा, अधर्म व अहंकार की अग्नि में भस्म, बुराई पर अच्छाई की विजय',
    date: '2026-03-03',
    formattedDate: '03 मार्च 2026',
    tithi: 'फाल्गुन पूर्णिमा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'holi-dhulandi',
    title: 'होली उत्सव (धुलंडी / रंगोत्सव)',
    hindiName: 'होली धुलंडी',
    subtitle: 'उमंग, आनंद व रंगों का महापर्व, राधा-कृष्ण की दिव्य प्रेम लीला एवं सामाजिक सौहार्द',
    date: '2026-03-04',
    formattedDate: '04 मार्च 2026',
    tithi: 'चैत्र कृष्ण प्रतिपदा',
    category: 'holiday',
    image: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'papmochini-ekadashi',
    title: 'पापमोचिनी एकादशी',
    hindiName: 'पापमोचिनी एकादशी',
    subtitle: 'संवत के समस्त पापों का शमन करने वाली वर्ष की अंतिम एकादशी का पावन व्रत',
    date: '2026-03-15',
    formattedDate: '15 मार्च 2026',
    tithi: 'चैत्र कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'chaitra-navratri',
    title: 'चैत्र नवरात्रि व नव संवत्सर 2083',
    hindiName: 'चैत्र नवरात्रि',
    subtitle: 'हिंदू नव वर्ष (विक्रम संवत 2083) आरंभ, गुड़ी पड़वा एवं माँ दुर्गा के नव स्वरूपों की घटस्थापना',
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
    subtitle: 'मर्यादा पुरुषोत्तम भगवान श्री रामचंद्र जी का पावन मध्याह्न प्राकट्य जन्मोत्सव',
    date: '2026-03-28',
    formattedDate: '28 मार्च 2026',
    tithi: 'चैत्र शुक्ल नवमी',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'kamada-ekadashi',
    title: 'कामदा एकादशी',
    hindiName: 'कामदा एकादशी',
    subtitle: 'समस्त मनोकामनाओं की पूर्ति करने वाली नववर्ष की प्रथम एकादशी साधना',
    date: '2026-03-29',
    formattedDate: '29 मार्च 2026',
    tithi: 'चैत्र शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // April 2026
  {
    id: 'hanuman-jayanti',
    title: 'श्री हनुमान जन्मोत्सव',
    hindiName: 'हनुमान जयंती',
    subtitle: 'संकटमोचन पवनपुत्र केसरी नंदन श्री हनुमान जी का दिव्य प्राकट्य पर्व व सुंदरकांड पाठ',
    date: '2026-04-02',
    formattedDate: '02 अप्रैल 2026',
    tithi: 'चैत्र पूर्णिमा',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'varuthini-ekadashi',
    title: 'वरुथिनी एकादशी',
    hindiName: 'वरुथिनी एकादशी',
    subtitle: 'अन्न व कन्यादान के बराबर महापुण्य फल प्रदान करने वाला पावन एकादशी उपवास',
    date: '2026-04-13',
    formattedDate: '13 अप्रैल 2026',
    tithi: 'वैशाख कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'akshaya-tritiya-2026',
    title: 'अक्षय तृतीया व परशुराम जयंती',
    hindiName: 'अक्षय तृतीया',
    subtitle: 'अक्षय पुण्य, स्वर्ण क्रय, भगवान परशुराम प्राकट्योत्सव एवं बद्रीनाथ धाम के कपाट उद्घाटन',
    date: '2026-04-20',
    formattedDate: '20 अप्रैल 2026',
    tithi: 'वैशाख शुक्ल तृतीया',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'mochini-ekadashi',
    title: 'मोहिनी एकादशी',
    hindiName: 'मोहिनी एकादशी',
    subtitle: 'भगवान विष्णु के मोहिनी स्वरूप की आराधना, मोह-माया के बंधनों से मुक्ति का व्रत',
    date: '2026-04-27',
    formattedDate: '27 अप्रैल 2026',
    tithi: 'वैशाख शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // May 2026
  {
    id: 'buddha-purnima',
    title: 'बुद्ध पूर्णिमा (कूर्म जयंती)',
    hindiName: 'बुद्ध पूर्णिमा',
    subtitle: 'वैशाख पूर्णिमा, भगवान बुद्ध का ज्ञान दिवस एवं भगवान विष्णु के कूर्म अवतार की पावन तिथि',
    date: '2026-05-01',
    formattedDate: '01 मई 2026',
    tithi: 'वैशाख पूर्णिमा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },
  {
    id: 'apara-ekadashi',
    title: 'अपरा एकादशी',
    hindiName: 'अपरा एकादशी',
    subtitle: 'अपार धन-धान्य, यश और कीर्ति प्रदायिनी ज्येष्ठ कृष्ण एकादशी का व्रत',
    date: '2026-05-12',
    formattedDate: '12 मई 2026',
    tithi: 'ज्येष्ठ कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'vat-savitri-vrat',
    title: 'वट सावित्री व्रत',
    hindiName: 'वट सावित्री व्रत',
    subtitle: 'सती सावित्री द्वारा यमराज से सत्यवान के प्राण वापस लाने का पावन सुहाग वटवृक्ष पूजन',
    date: '2026-05-16',
    formattedDate: '16 मई 2026',
    tithi: 'ज्येष्ठ अमावस्या',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1000&auto=format&fit=crop&q=80',
    vratId: 'karwa-chauth'
  },
  {
    id: 'ganga-dussehra',
    title: 'माँ गंगा दशहरा',
    hindiName: 'गंगा दशहरा',
    subtitle: 'माँ भगवती गंगा का पृथ्वी पर दिव्य अवतरण दिवस, दस प्रकार के कायिक, वाचिक व मानसिक पापों का शमन',
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
    subtitle: 'वर्ष की समस्त 24 एकादशियों का पुण्य फल अकेले देने वाली जल-त्याग की महाकठिन साधना',
    date: '2026-05-27',
    formattedDate: '27 मई 2026',
    tithi: 'ज्येष्ठ शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // June 2026
  {
    id: 'yogini-ekadashi',
    title: 'योगिनी एकादशी',
    hindiName: 'योगिनी एकादशी',
    subtitle: 'समस्त चर्मरोगों व शापों से मुक्ति दिलाकर परम सुख प्रदान करने वाला आषाढ़ एकादशी व्रत',
    date: '2026-06-11',
    formattedDate: '11 जून 2026',
    tithi: 'आषाढ़ कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'jagannath-rath-yatra',
    title: 'श्री जगन्नाथ रथ यात्रा',
    hindiName: 'जगन्नाथ रथ यात्रा',
    subtitle: 'पुरी धाम में महाप्रभु जगन्नाथ, बलभद्र व माता सुभद्रा जी की विश्वप्रसिद्ध पावन रथ यात्रा',
    date: '2026-06-16',
    formattedDate: '16 जून 2026',
    tithi: 'आषाढ़ शुक्ल द्वितीया',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'devshayani-ekadashi',
    title: 'देवशयनी एकादशी (चातुर्मास आरंभ)',
    hindiName: 'देवशयनी एकादशी',
    subtitle: 'भगवान विष्णु का क्षीरसागर में योगनिद्रा में शयन, 4 माह के चातुर्मास व्रत-तप का शुभारंभ',
    date: '2026-06-25',
    formattedDate: '25 जून 2026',
    tithi: 'आषाढ़ शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'guru-purnima',
    title: 'गुरु पूर्णिमा (व्यास पूजा)',
    hindiName: 'गुरु पूर्णिमा',
    subtitle: 'महर्षि वेदव्यास जयंती, सद्गुरु पूजन, दीक्षा व आध्यात्मिक गुरुओं के प्रति सर्वोच्च कृतज्ञता',
    date: '2026-06-29',
    formattedDate: '29 जून 2026',
    tithi: 'आषाढ़ पूर्णिमा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'bhoomi-pujan'
  },

  // July 2026
  {
    id: 'sawan-somwar-first',
    title: 'श्रावण मास प्रथम सोमवार व्रत',
    hindiName: 'सावन सोमवार',
    subtitle: 'पवित्र श्रावण मास का प्रथम सोमवार, भगवान भोलेनाथ का गंगाजल व बेलपत्र से महाअभिषेक',
    date: '2026-07-06',
    formattedDate: '06 जुलाई 2026',
    tithi: 'श्रावण कृष्ण सप्तमी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'mahashivratri'
  },
  {
    id: 'kamika-ekadashi',
    title: 'कामिका एकादशी',
    hindiName: 'कामिका एकादशी',
    subtitle: 'श्रावण मास में भगवान श्री हरि की तुलसीदल से आराधना, अश्वमेध यज्ञ तुल्य फल',
    date: '2026-07-10',
    formattedDate: '10 जुलाई 2026',
    tithi: 'श्रावण कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'hariyali-amavasya',
    title: 'हरियाली अमावस्या (श्रावणी अमावस्या)',
    hindiName: 'हरियाली अमावस्या',
    subtitle: 'प्रकृति पूजन, वृक्षारोपण, पितृ तर्पण एवं भगवान शिव-पार्वती की अमोघ कृपा का पर्व',
    date: '2026-07-14',
    formattedDate: '14 जुलाई 2026',
    tithi: 'श्रावण अमावस्या',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },
  {
    id: 'shravana-putrada-ekadashi',
    title: 'श्रावण पुत्रदा एकादशी',
    hindiName: 'श्रावण पुत्रदा एकादशी',
    subtitle: 'योग्य संतान की प्राप्ति एवं परिवार में सुख-शांति हेतु श्रावण शुक्ल एकादशी का पावन उपवास',
    date: '2026-07-25',
    formattedDate: '25 जुलाई 2026',
    tithi: 'श्रावण शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },

  // August 2026
  {
    id: 'hariyali-teej',
    title: 'हरियाली तीज व्रत',
    hindiName: 'हरियाली तीज',
    subtitle: 'माता पार्वती और भगवान शिव के पुनर्मिलन का पावन सुहाग पर्व, झूला उत्सव व अखंड सौभाग्य',
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
    subtitle: 'नाग देवता पूजन, कालसर्प दोष निवारण, दुग्ध अर्पण एवं पारिवारिक रक्षा प्रार्थना',
    date: '2026-08-18',
    formattedDate: '18 अगस्त 2026',
    tithi: 'श्रावण शुक्ल पंचमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'mahashivratri'
  },
  {
    id: 'raksha-bandhan',
    title: 'रक्षाबंधन व श्रावणी पूर्णिमा',
    hindiName: 'रक्षाबंधन',
    subtitle: 'भाई-बहन के अटूट स्नेह का रक्षा सूत्र बंधन, श्रावणी उपाकर्म एवं सावन पूर्णिमा महास्नान',
    date: '2026-08-28',
    formattedDate: '28 अगस्त 2026',
    tithi: 'श्रावण पूर्णिमा',
    category: 'holiday',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'kajari-teej',
    title: 'कजरी तीज (बड़ी तीज)',
    hindiName: 'कजरी तीज',
    subtitle: 'भाद्रपद कृष्ण तृतीया का पावन सुहाग पर्व, नीमड़ी माता पूजन एवं सत्तू का महाप्रसाद',
    date: '2026-08-31',
    formattedDate: '31 अगस्त 2026',
    tithi: 'भाद्रपद कृष्ण तृतीया',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1000&auto=format&fit=crop&q=80',
    vratId: 'gangaur'
  },

  // September 2026
  {
    id: 'krishna-janmashtami',
    title: 'श्री कृष्ण जन्माष्टमी',
    hindiName: 'श्री कृष्ण जन्माष्टमी',
    subtitle: 'भगवान श्री कृष्ण का पावन रोहिणी नक्षत्र में मध्यरात्रि दिव्य प्राकट्योत्सव, माखन-मिश्री भोग',
    date: '2026-09-04',
    formattedDate: '04 सितंबर 2026',
    tithi: 'भाद्रपद कृष्ण अष्टमी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=1200&auto=format&fit=crop&q=80',
    vratId: 'krishna-janmashtami'
  },
  {
    id: 'aja-ekadashi',
    title: 'अजा एकादशी',
    hindiName: 'अजा एकादशी',
    subtitle: 'राजा हरिश्चंद्र को उनका खोया राज्य व पुत्र वापस दिलाने वाला पावन एकादशी व्रत',
    date: '2026-09-08',
    formattedDate: '08 सितंबर 2026',
    tithi: 'भाद्रपद कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'hartalika-teej',
    title: 'हरितालिका तीज व्रत',
    hindiName: 'हरितालिका तीज',
    subtitle: 'गौरी-शंकर पूजन, अखंड सौभाग्य व पति की दीर्घायु हेतु 24 घंटे का कठोर निर्जला तप',
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
    subtitle: 'प्रथम पूज्य भगवान श्री गणेश जी की घटस्थापना, मोदक भोग एवं 10 दिवसीय गणेशोत्सव का शुभारंभ',
    date: '2026-09-15',
    formattedDate: '15 सितंबर 2026',
    tithi: 'भाद्रपद शुक्ल चतुर्थी',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=1200&auto=format&fit=crop&q=80',
    vratId: 'shri-ganesh'
  },
  {
    id: 'rishi-panchami',
    title: 'ऋषि पंचमी पूजन',
    hindiName: 'ऋषि पंचमी',
    subtitle: 'सप्तर्षियों के प्रति कृतज्ञता अर्पण, अनजाने में हुए पापों का प्रायश्चित एवं सात्विक आहार',
    date: '2026-09-16',
    formattedDate: '16 सितंबर 2026',
    tithi: 'भाद्रपद शुक्ल पंचमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'bhoomi-pujan'
  },
  {
    id: 'radha-ashtami',
    title: 'राधा अष्टमी जन्मोत्सव',
    hindiName: 'राधा अष्टमी',
    subtitle: 'बरसाना में वृषभानु दुलारी श्री राधा रानी का पावन प्राकट्य दिवस, कृष्ण भक्ति का परम रस',
    date: '2026-09-20',
    formattedDate: '20 सितंबर 2026',
    tithi: 'भाद्रपद शुक्ल अष्टमी',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=1200&auto=format&fit=crop&q=80',
    vratId: 'krishna-janmashtami'
  },
  {
    id: 'anant-chaturdashi',
    title: 'अनंत चतुर्दशी व विसर्जन',
    hindiName: 'अनंत चतुर्दशी',
    subtitle: 'भगवान अनंत (श्री हरि) का 14 गांठों वाला रक्षासूत्र पूजन एवं 10 दिवसीय गणपति विसर्जन',
    date: '2026-09-25',
    formattedDate: '25 सितंबर 2026',
    tithi: 'भाद्रपद शुक्ल चतुर्दशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'pitru-paksha-aarambh',
    title: 'पितृपक्ष आरंभ (श्राद्ध पक्ष)',
    hindiName: 'पितृपक्ष आरंभ',
    subtitle: 'पूर्वजों व पितरों के प्रति कृतज्ञता, तर्पण, पिंडदान एवं श्राद्ध कर्म का 16 दिवसीय काल',
    date: '2026-09-26',
    formattedDate: '26 सितंबर 2026',
    tithi: 'भाद्रपद पूर्णिमा / आश्विन कृष्ण प्रतिपदा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },

  // October 2026
  {
    id: 'jitiya-vrat',
    title: 'जीवित्पुत्रिका (जिउतिया) व्रत',
    hindiName: 'जीवित्पुत्रिका व्रत',
    subtitle: 'संतान के आरोग्य, दीर्घायु एवं संकट से रक्षा हेतु माताओं का 36 घंटे का कठोर निर्जला व्रत',
    date: '2026-10-03',
    formattedDate: '03 अक्टूबर 2026',
    tithi: 'आश्विन कृष्ण अष्टमी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1200&auto=format&fit=crop&q=80',
    vratId: 'jitiya-vrat'
  },
  {
    id: 'indira-ekadashi',
    title: 'इन्दिरा एकादशी',
    hindiName: 'इन्दिरा एकादशी',
    subtitle: 'पितृपक्ष में पितरों को यमलोक की यातनाओं से मुक्ति दिलाकर वैकुंठ भेजने वाली एकादशी',
    date: '2026-10-06',
    formattedDate: '06 अक्टूबर 2026',
    tithi: 'आश्विन कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'sarva-pitru-amavasya',
    title: 'सर्वपितृ अमावस्या (महालया)',
    hindiName: 'सर्वपितृ अमावस्या',
    subtitle: 'समस्त ज्ञात-अज्ञात पितरों का विदाई श्राद्ध, तर्पण एवं महालया चंडी पाठ का पावन दिन',
    date: '2026-10-10',
    formattedDate: '10 अक्टूबर 2026',
    tithi: 'आश्विन अमावस्या',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },
  {
    id: 'shardiya-navratri-kalash',
    title: 'शारदीय नवरात्रि (कलश स्थापना)',
    hindiName: 'शारदीय नवरात्रि',
    subtitle: 'माँ शैलपुत्री पूजन, अखंड ज्योति प्रज्वलन एवं 9 दिवसीय पावन शक्ति आराधना का महाप्रारंभ',
    date: '2026-10-11',
    formattedDate: '11 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल प्रतिपदा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1200&auto=format&fit=crop&q=80',
    vratId: 'shardiya-navratri-kalash'
  },
  {
    id: 'durga-maha-ashtami',
    title: 'दुर्गा महाअष्टमी व संधि पूजा',
    hindiName: 'दुर्गा महाअष्टमी',
    subtitle: 'माँ महागौरी पूजन, कन्या पूजन, संधि पूजा एवं महिषासुरमर्दिनी के दिव्य स्वरूप की स्तुति',
    date: '2026-10-18',
    formattedDate: '18 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल अष्टमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1200&auto=format&fit=crop&q=80',
    vratId: 'durga-maha-ashtami'
  },
  {
    id: 'durga-maha-navami',
    title: 'दुर्गा महानवमी व आयुध पूजा',
    hindiName: 'दुर्गा महानवमी',
    subtitle: 'माँ सिद्धिदात्री पूजन, हवन यज्ञ, पूर्णाहुति एवं शस्त्र-आयुध पूजन का पावन दिन',
    date: '2026-10-19',
    formattedDate: '19 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल नवमी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1200&auto=format&fit=crop&q=80',
    vratId: 'durga-maha-ashtami'
  },
  {
    id: 'vijayadashami-dussehra',
    title: 'विजयादशमी (दशहरा)',
    hindiName: 'विजयादशमी',
    subtitle: 'अधर्म पर धर्म की विजय, रावण दहन, शमी पूजन, सीमोल्लंघन एवं अपराजिता स्तुति',
    date: '2026-10-20',
    formattedDate: '20 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल दशमी',
    category: 'holiday',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    vratId: 'vijayadashami-dussehra'
  },
  {
    id: 'papankusha-ekadashi',
    title: 'पापांकुशा एकादशी',
    hindiName: 'पापांकुशा एकादशी',
    subtitle: 'पाप रूपी हाथी को अंकुश लगाने वाली, यम यातनाओं से मुक्ति प्रदायिनी एकादशी',
    date: '2026-10-22',
    formattedDate: '22 अक्टूबर 2026',
    tithi: 'आश्विन शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'sharad-purnima',
    title: 'शरद पूर्णिमा (कोजागरी व्रत / अमृत वर्षा)',
    hindiName: 'शरद पूर्णिमा',
    subtitle: 'चंद्रमा की सोलह कलाएं, खुले आसमान में रखी खीर पर अमृत वर्षा एवं माँ लक्ष्मी का रात्रि जागरण',
    date: '2026-10-25',
    formattedDate: '25 अक्टूबर 2026',
    tithi: 'आश्विन पूर्णिमा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    vratId: 'diwali-lakshmi-puja'
  },
  {
    id: 'karwa-chauth',
    title: 'करवा चौथ (कर्क चतुर्थी)',
    hindiName: 'करवा चौथ',
    subtitle: 'अखंड सौभाग्य, चंद्र अर्घ्य एवं पति की दीर्घायु हेतु सुहागिनों का निर्जला व्रत',
    date: '2026-10-29',
    formattedDate: '29 अक्टूबर 2026',
    tithi: 'कार्तिक कृष्ण चतुर्थी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    vratId: 'karwa-chauth'
  },

  // November 2026
  {
    id: 'ahoi-ashtami',
    title: 'अहोई अष्टमी व्रत',
    hindiName: 'अहोई अष्टमी',
    subtitle: 'संतान के कल्याण व दीर्घायु हेतु माताओं द्वारा तारों के दर्शन व अर्घ्य का पावन उपवास',
    date: '2026-11-02',
    formattedDate: '02 नवंबर 2026',
    tithi: 'कार्तिक कृष्ण अष्टमी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1200&auto=format&fit=crop&q=80',
    vratId: 'karwa-chauth'
  },
  {
    id: 'rama-ekadashi',
    title: 'रमा एकादशी',
    hindiName: 'रमा एकादशी',
    subtitle: 'दीपावली से पूर्व माँ लक्ष्मी (रमा) व भगवान विष्णु की कृपा से दरिद्रता निवारक एकादशी',
    date: '2026-11-05',
    formattedDate: '05 नवंबर 2026',
    tithi: 'कार्तिक कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'dhanteras-kuber',
    title: 'धनतेरस व कुबेर जयंती',
    hindiName: 'धनतेरस',
    subtitle: 'भगवान धन्वंतरि प्राकट्य दिवस, सुख-समृद्धि, यम दीपदान एवं बर्तन-स्वर्ण क्रय का महापर्व',
    date: '2026-11-06',
    formattedDate: '06 नवंबर 2026',
    tithi: 'कार्तिक कृष्ण त्रयोदशी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    vratId: 'dhanteras-kuber'
  },
  {
    id: 'narak-chaturdashi',
    title: 'नरक चतुर्दशी (रूप चौदस / छोटी दीवाली)',
    hindiName: 'नरक चतुर्दशी',
    subtitle: 'भगवान श्री कृष्ण द्वारा भौमासुर (नरकासुर) वध, उबटन स्नान एवं 14 दीपकों का प्रज्वलन',
    date: '2026-11-07',
    formattedDate: '07 नवंबर 2026',
    tithi: 'कार्तिक कृष्ण चतुर्दशी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
    vratId: 'diwali-lakshmi-puja'
  },
  {
    id: 'diwali-lakshmi-puja',
    title: 'दीपावली (महालक्ष्मी पूजन)',
    hindiName: 'दीपावली',
    subtitle: 'माँ महालक्ष्मी-श्री गणेश पूजन, दीपमालिका, कुबेर आराधना एवं अंधकार पर प्रकाश की विजय',
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
    subtitle: 'भगवान श्री कृष्ण द्वारा गोवर्धन पर्वत धारण, 56 भोग अन्नकूट, गौ माता व प्रकृति पूजन',
    date: '2026-11-09',
    formattedDate: '09 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल प्रतिपदा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80',
    vratId: 'krishna-janmashtami'
  },
  {
    id: 'bhai-dooj',
    title: 'भाई दूज (यम द्वितीया)',
    hindiName: 'भाई दूज',
    subtitle: 'बहन-भाई के अगाध स्नेह का पवित्र बंधन, यमराज व यमुना जी का मंगल मिलन एवं तिलक',
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
    hindiName: 'छठ नहाय खay',
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
    title: 'देवउठनी एकादशी (प्रबोधिनी)',
    hindiName: 'देवउठनी एकादशी',
    subtitle: 'चातुर्मास की समाप्ति, भगवान विष्णु का योगनिद्रा से जागरण एवं समस्त मांगलिक कार्यों का शुभारंभ',
    date: '2026-11-20',
    formattedDate: '20 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'tulsi-vivah',
    title: 'तुलसी विवाह उत्सव',
    hindiName: 'तुलसी विवाह',
    subtitle: 'माता तुलसी और भगवान शालिग्राम का पावन वैवाहिक गठबंधन, कन्यादान तुल्य महापुण्य फल',
    date: '2026-11-21',
    formattedDate: '21 नवंबर 2026',
    tithi: 'कार्तिक शुक्ल द्वादशी',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    vratId: 'akshaya-tritiya'
  },
  {
    id: 'kartik-purnima',
    title: 'कार्तिक पूर्णिमा व देव दीपावली',
    hindiName: 'कार्तिक पूर्णिमा',
    subtitle: 'काशी के पावन घाटों पर लाखों दीपों से भव्य देव दीपावली, त्रिपुरारी शिव पूजन व गंगा स्नान',
    date: '2026-11-24',
    formattedDate: '24 नवंबर 2026',
    tithi: 'कार्तिक पूर्णिमा',
    category: 'mahaparv',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
  },

  // December 2026
  {
    id: 'utpanna-ekadashi',
    title: 'उत्पन्ना एकादशी',
    hindiName: 'उत्पन्ना एकादशी',
    subtitle: 'मुर दैत्य के वध हेतु भगवान विष्णु के शरीर से एकादशी देवी का प्राकट्य दिवस, समस्त व्रतों की जननी',
    date: '2026-12-05',
    formattedDate: '05 दिसंबर 2026',
    tithi: 'मार्गशीर्ष कृष्ण एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'mokshada-ekadashi',
    title: 'मोक्षदा एकादशी',
    hindiName: 'मोक्षदा एकादशी',
    subtitle: 'मोक्ष प्रदायिनी एकादशी, इसी पावन दिन भगवान श्री कृष्ण ने कुरुक्षेत्र में दिया था गीता का अमर ज्ञान',
    date: '2026-12-19',
    formattedDate: '19 दिसंबर 2026',
    tithi: 'मार्गशीर्ष शुक्ल एकादशी',
    category: 'vrat',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'anant-chaturdashi'
  },
  {
    id: 'gita-jayanti',
    title: 'श्रीमद्भगवद्गीता जयंती',
    hindiName: 'गीता जयंती',
    subtitle: 'कुरुक्षेत्र में भगवान श्री कृष्ण द्वारा अर्जुन को दिए गए कालजयी गीता उपदेश का प्राकट्योत्सव',
    date: '2026-12-20',
    formattedDate: '20 दिसंबर 2026',
    tithi: 'मार्गशीर्ष शुक्ल एकादशी / द्वादशी',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    vratId: 'krishna-janmashtami'
  },
  {
    id: 'dattatreya-jayanti',
    title: 'भगवान दत्तात्रेय जयंती',
    hindiName: 'दत्तात्रेय जयंती',
    subtitle: 'ब्रह्मा, विष्णु, महेश के संयुक्त त्रिदेव स्वरूप भगवान दत्तात्रेय का पावन प्राकट्य दिवस',
    date: '2026-12-23',
    formattedDate: '23 दिसंबर 2026',
    tithi: 'मार्गशीर्ष पूर्णिमा',
    category: 'jayanti',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
    vratId: 'bhoomi-pujan'
  },
  {
    id: 'margashirsha-purnima',
    title: 'मार्गशीर्ष पूर्णिमा (बत्तीसी पूर्णिमा)',
    hindiName: 'मार्गशीर्ष पूर्णिमा',
    subtitle: 'सत्यनारायण भगवान की विशेष पूजा, पवित्र नदी स्नान एवं 32 गुना अधिक पुण्य फल प्राप्ति',
    date: '2026-12-24',
    formattedDate: '24 दिसंबर 2026',
    tithi: 'मार्गशीर्ष पूर्णिमा',
    category: 'puja',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    vratId: 'maa-ganga'
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
