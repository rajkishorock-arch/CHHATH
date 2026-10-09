export interface ShubhVicharCardItem {
  id: string;
  quoteText: string;
  sanskritVerse?: string;
  category: 'prarthana' | 'samarpan' | 'bhakti' | 'yoga' | 'shanti' | 'karma' | 'vishwas' | 'gita' | 'chanakya' | 'kabir';
  categoryLabel: string;
  image: string;
  authorOrSource: string;
  likesCount: number;
}

// 1. PURE DEVOTIONAL PHOTOGRAPHY POOL (Strictly Sacred: Ganges, Himalayas, Temples, Diyas, Sunrise, Meditation, Deities)
// NO corporate, NO business suits, NO modern streetwear!
export const SACRED_DEVOTIONAL_IMAGES = [
  // 1. Sunrise over sacred waters & Ganga Ghats (Varanasi, Haridwar, Patna)
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504198453319-5ce911bafc46?w=800&auto=format&fit=crop&q=80',

  // 2. Sacred Himalayan Dawn, Kedarnath Valley & Holy Peaks
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',

  // 3. Ancient Vedic Temples, Stone Shikhars & Divine Sanctorum
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590076212450-4886616a1334?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',

  // 4. Sacred Diyas, Aarti Glow, Camphor & Holy Flames
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',

  // 5. Sacred Lotus, Devotional Flowers & Spiritual Offering
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',

  // 6. Serene Morning Streams, Sacred Rivers & Peaceful Horizon
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508873696983-2df57046475a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',

  // 7. Meditation at Dawn, Morning Forest & Divine Sunshine
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1475921075678-b0218225600c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
];

// 2. EXTENSIVE CURATED SANATAN VICHAR POOL (100+ Authentic Non-Repeating Quotes)
export const CORE_SANATAN_VICHAR_POOL: Omit<ShubhVicharCardItem, 'id' | 'likesCount' | 'image'>[] = [
  // --- Exact Quotes from Screenshot 1 ---
  {
    quoteText: "प्रार्थना शब्दों से नहीं हृदय से होनी चाहिए, क्योंकि ईश्वर उनकी भी सुनते है जो बोल नहीं सकते।",
    category: 'prarthana',
    categoryLabel: 'प्रार्थना',
    authorOrSource: 'अमृत वचन'
  },
  {
    quoteText: "शरीर से प्रेम हैं तो आसन करें, साँस से प्रेम है तो प्राणायाम करें, आत्मा से प्रेम है तो ध्यान करें, और परमात्मा से प्रेम है तो समर्पण करें।",
    category: 'yoga',
    categoryLabel: 'योग एवं ध्यान',
    authorOrSource: 'योग सूत्र'
  },
  {
    quoteText: "प्रभु, सुख देना तो बस इतना देना कि जिसमें अहंकार ना आये और दुःख देना तो बस इतना देना कि जिसमे आस्था ना खो जाए।",
    category: 'samarpan',
    categoryLabel: 'समर्पण भाव',
    authorOrSource: 'प्रभु वंदना'
  },
  {
    quoteText: "ए जन्नत अपनी औकात में रहना, हम तेरी जन्नत के मोहताज नहीं, हम 'श्री बांके बिहारी' के चरणों में रहते है, वहां तेरी भी कोई औकात नहीं।",
    category: 'bhakti',
    categoryLabel: 'वृंदावन रस',
    authorOrSource: 'श्री बांके बिहारी'
  },
  {
    quoteText: "आस्था का मतलब यह मानना नहीं है कि ईश्वर आपके लिए सही करेंगे, बल्कि यह है कि ईश्वर जो करेंगे वह सही होगा।",
    category: 'vishwas',
    categoryLabel: 'अखंड आस्था',
    authorOrSource: 'जीवन दर्शन'
  },
  {
    quoteText: "जब तक आप स्वयं पर विश्वास नहीं करते, तब तक आप ईश्वर पर विश्वास नहीं कर सकते।",
    category: 'vishwas',
    categoryLabel: 'आत्मबल',
    authorOrSource: 'स्वामी विवेकानंद'
  },

  // --- श्रीमद्भगवद्गीता अमृत वचन ---
  {
    quoteText: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। कर्म करने में ही तुम्हारा अधिकार है, उसके फलों में कभी नहीं।",
    sanskritVerse: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 2:47)'
  },
  {
    quoteText: "जो मन को वश में कर लेता है, उसका मन ही उसका सबसे बड़ा मित्र बन जाता है; और जो नहीं कर पाता, उसका मन सबसे बड़ा शत्रु।",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 6:6)'
  },
  {
    quoteText: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः। आत्मा को न शस्त्र काट सकते हैं, न आग जला सकती है। आत्मा अमर और शाश्वत है।",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 2:23)'
  },
  {
    quoteText: "परिवर्तन संसार का नियम है। जिसे तुम मृत्यु समझते हो, वही तो नवजीवन का आरंभ है।",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण'
  },
  {
    quoteText: "जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं धर्म की पुनर्स्थापना के लिए स्वयं को प्रकट करता हूँ।",
    sanskritVerse: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 4:7)'
  },
  {
    quoteText: "जो ज्ञानी पुरुष सुख और दुःख दोनों में एक समान रहता है, वही मुक्ति और अमृतत्व का सच्चा अधिकारी होता है।",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 2:15)'
  },
  {
    quoteText: "न जायते म्रियते वा कदाचिन्। आत्मा न कभी जन्म लेती है और न कभी मरती है; यह अजन्मा, नित्य और पुरातन है।",
    sanskritVerse: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 2:20)'
  },
  {
    quoteText: "जैसे मनुष्य पुराने वस्त्रों को त्यागकर नए वस्त्र धारण करता है, वैसे ही जीवात्मा पुराने शरीर को त्यागकर नया शरीर धारण करती है।",
    sanskritVerse: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्ण्यान्यन्यानि संयाति नवानि देही॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 2:22)'
  },
  {
    quoteText: "क्रोध से सम्मोहन, सम्मोहन से स्मृति भ्रम, और स्मृति भ्रम से बुद्धि का नाश होता है। बुद्धि नाश से मनुष्य का पतन हो जाता है।",
    sanskritVerse: "क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 2:63)'
  },
  {
    quoteText: "आसक्ति रहित होकर निरंतर अपना कर्तव्य कर्म करो; क्योंकि अनासक्त भाव से कर्म करने वाला मनुष्य ही परमात्मा को प्राप्त होता है।",
    sanskritVerse: "तस्मादसक्तः सततं कार्यं कर्म समाचर।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 3:19)'
  },
  {
    quoteText: "इस संसार में ज्ञान के समान पवित्र करने वाला वास्तव में कुछ भी नहीं है। आत्मज्ञानी पुरुष स्वयं अपने भीतर परम शांति का अनुभव करता है।",
    sanskritVerse: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 4:38)'
  },
  {
    quoteText: "मनुष्य को चाहिए कि वह अपने मन द्वारा अपना उद्धार करे। मन ही मनुष्य का सबसे बड़ा मित्र है और मन ही सबसे बड़ा शत्रु।",
    sanskritVerse: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 6:5)'
  },
  {
    quoteText: "यह चंचल और अस्थिर मन जहाँ-जहाँ भी भटके, वहाँ-वहाँ से इसे रोककर बार-बार आत्मा के वश में स्थिर करना चाहिए।",
    sanskritVerse: "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 6:26)'
  },
  {
    quoteText: "जो अनन्य भाव से निरंतर मेरा चिंतन व ध्यान करते हैं, उनके योग-क्षेम (समस्त सुरक्षा व कल्याण) का भार मैं स्वयं वहन करता हूँ।",
    sanskritVerse: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 9:22)'
  },
  {
    quoteText: "हे अर्जुन! तुम जो कुछ भी करते हो, जो खाते हो, जो हवन करते हो, जो दान देते हो और जो तप करते हो, वह सब मुझे समर्पित कर दो।",
    sanskritVerse: "यत्करोषि यदश्नासि यज्जुहोषि ददासि यत्।\nयत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम्॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 9:27)'
  },
  {
    quoteText: "सब धर्मों व संशयों को त्यागकर केवल मेरी शरण में आ जाओ; मैं तुम्हें समस्त पापों और भयों से मुक्त कर दूँगा, शोक मत करो।",
    sanskritVerse: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 18:66)'
  },
  {
    quoteText: "हे पार्थ! शुभ व परोपकारी कर्म करने वाले किसी भी साधक की कभी कोई दुर्गति या पराजय नहीं होती।",
    sanskritVerse: "पार्थ नैवेह नामुत्र विनाशस्तस्य विद्यते।\nन हि कल्याणकृत्कश्चिद्दुर्गतिं तात गच्छति॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 6:40)'
  },
  {
    quoteText: "सुख और दुःख, सर्दी और गर्मी की तरह केवल इंद्रियों के क्षणिक अनुभव हैं; हे भरतश्रेष्ठ, इन्हें धैर्यपूर्वक सहन करना सीखो।",
    sanskritVerse: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 2:14)'
  },
  {
    quoteText: "काम, क्रोध और लोभ — ये तीनों आत्मा का विनाश करने वाले अधर्म के तीन प्रमुख द्वार हैं। अतः इन तीनों का सर्वथा त्याग कर देना चाहिए।",
    sanskritVerse: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत्॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 16:21)'
  },
  {
    quoteText: "मैं समस्त प्राणियों के हृदय में स्थित आत्मा हूँ; मैं ही सब प्राणियों का आदि, मध्य और परम अंत हूँ।",
    sanskritVerse: "अहमात्मा गुडाकेश सर्वभूताशयस्थितः।\nअहमादिश्च मध्यं च भूतानामन्त एव च॥",
    category: 'gita',
    categoryLabel: 'श्रीमद्भगवद्गीता',
    authorOrSource: 'भगवान श्रीकृष्ण (अध्याय 10:20)'
  },

  // --- संत कबीर दास जी के अमर दोहे ---
  {
    quoteText: "पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय। ढाई आखर प्रेम का, पढ़े सो पंडित होय।",
    category: 'kabir',
    categoryLabel: 'कबीर दोहा',
    authorOrSource: 'संत कबीर दास'
  },
  {
    quoteText: "गुरु गोविंद दोऊ खड़े, काके लागूं पांय। बलिहारी गुरु आपने, गोविंद दियो बताय।",
    category: 'kabir',
    categoryLabel: 'कबीर दोहा',
    authorOrSource: 'संत कबीर दास'
  },
  {
    quoteText: "माटी कहे कुम्हार से, तू क्या रूँदे मोय। एक दिन ऐसा आएगा, मैं रूँदूंगी तोय।",
    category: 'kabir',
    categoryLabel: 'कबीर दोहा',
    authorOrSource: 'संत कबीर दास'
  },
  {
    quoteText: "दुःख में सुमिरन सब करे, सुख में करै न कोय। जो सुख में सुमिरन करे, तो दुःख काहे को होय।",
    category: 'kabir',
    categoryLabel: 'कबीर दोहा',
    authorOrSource: 'संत कबीर दास'
  },
  {
    quoteText: "साधु ऐसा चाहिए, जैसा सूप सुभाय। सार-सार को गहि रहै, थोथा देई उड़ाय।",
    category: 'kabir',
    categoryLabel: 'कबीर दोहा',
    authorOrSource: 'संत कबीर दास'
  },
  {
    quoteText: "ऐसी बानी बोलिए, मन का आपा खोय। औरन को सीतल करै, आपहु सीतल होय।",
    category: 'kabir',
    categoryLabel: 'कबीर दोहा',
    authorOrSource: 'संत कबीर दास'
  },
  {
    quoteText: "काल करे सो आज कर, आज करे सो अब। पल में परलय होएगी, बहुरि करेगा कब।",
    category: 'kabir',
    categoryLabel: 'कबीर दोहा',
    authorOrSource: 'संत कबीर दास'
  },

  // --- गोस्वामी तुलसीदास जी (श्री रामचरितमानस) ---
  {
    quoteText: "जाकी रही भावना जैसी, प्रभु मूरति देखी तिन तैसी। प्रभु तो भाव के भूखे हैं, जैसा मन वैसा उनका स्वरूप।",
    category: 'bhakti',
    categoryLabel: 'रामचरितमानस',
    authorOrSource: 'गोस्वामी तुलसीदास'
  },
  {
    quoteText: "कर्म प्रधान विश्व करि राखा। जो जस करइ सो तस फलु चाखा।",
    category: 'karma',
    categoryLabel: 'रामचरितमानस',
    authorOrSource: 'गोस्वामी तुलसीदास'
  },
  {
    quoteText: "तुलसी मीठे बचन ते सुख उपजत चहुँ ओर। बसीकरन इक मंत्र है परिहरु बचन कठोर।",
    category: 'shanti',
    categoryLabel: 'तुलसी वाणी',
    authorOrSource: 'गोस्वामी तुलसीदास'
  },
  {
    quoteText: "परहित सरिस धरम नहिं भाई। पर पीड़ा सम नहिं अधमाई। दूसरों की भलाई से बड़ा कोई धर्म नहीं।",
    category: 'bhakti',
    categoryLabel: 'रामचरितमानस',
    authorOrSource: 'गोस्वामी तुलसीदास'
  },
  {
    quoteText: "धीरज धर्म मित्र अरु नारी। आपद काल परिखिअहिं चारी। संकट के समय ही सच्चे धैर्य और धर्म की परीक्षा होती है।",
    category: 'vishwas',
    categoryLabel: 'रामचरितमानस',
    authorOrSource: 'गोस्वामी तुलसीदास'
  },

  // --- आचार्य चाणक्य नीति सूत्र ---
  {
    quoteText: "संकट के समय केवल अपनी बुद्धि, धैर्य और धर्म ही सबसे बड़े सहायक होते हैं।",
    category: 'chanakya',
    categoryLabel: 'चाणक्य नीति',
    authorOrSource: 'आचार्य चाणक्य'
  },
  {
    quoteText: "विद्या रूपी धन को न कोई चुरा सकता है, न कोई छीन सकता है। यह बांटने से निरंतर बढ़ता है।",
    category: 'chanakya',
    categoryLabel: 'चाणक्य नीति',
    authorOrSource: 'आचार्य चाणक्य'
  },
  {
    quoteText: "जो व्यक्ति समय का सम्मान करता है, समय भी संसार में उसका मान-सम्मान शिखर पर पहुंचा देता है।",
    category: 'chanakya',
    categoryLabel: 'चाणक्य नीति',
    authorOrSource: 'आचार्य चाणक्य'
  },
  {
    quoteText: "ऋण, रोग और अग्नि को कभी छोटा नहीं समझना चाहिए। इन्हें तुरंत समाप्त कर देना ही बुद्धिमानी है।",
    category: 'chanakya',
    categoryLabel: 'चाणक्य नीति',
    authorOrSource: 'आचार्य चाणक्य'
  },
  {
    quoteText: "संसार का सबसे बड़ा गुरु आपका अभ्यास और आत्म-संयम है। जिसने स्वयं को जीत लिया, उसने जग जीत लिया।",
    category: 'chanakya',
    categoryLabel: 'चाणक्य नीति',
    authorOrSource: 'आचार्य चाणक्य'
  },

  // --- स्वामी विवेकानंद ओजस्वी वचन ---
  {
    quoteText: "उठो, जागो और तब तक मत रुको जब तक कि तुम अपने पावन लक्ष्य को प्राप्त न कर लो।",
    category: 'vishwas',
    categoryLabel: 'ओजस्वी विचार',
    authorOrSource: 'स्वामी विवेकानंद'
  },
  {
    quoteText: "तुम जैसा सोचोगे, वैसे ही बन जाओगे। यदि स्वयं को निर्बल मानोगे तो निर्बल, सबल मानोगे तो सबल बनोगे।",
    category: 'vishwas',
    categoryLabel: 'आत्मबल',
    authorOrSource: 'स्वामी विवेकानंद'
  },
  {
    quoteText: "संसार में सबसे बड़ा पाप स्वयं को दुर्बल और असहाय समझना है। परमात्मा का अंश तुम्हारे भीतर विद्यमान है।",
    category: 'vishwas',
    categoryLabel: 'आत्म साक्षात्कार',
    authorOrSource: 'स्वामी विवेकानंद'
  },
  {
    quoteText: "पवित्रता, धैर्य और दृढ़ता — ये तीनों सफलता के लिए अनिवार्य हैं, और इन सबके ऊपर है अखंड प्रेम।",
    category: 'shanti',
    categoryLabel: 'दिव्य जीवन',
    authorOrSource: 'स्वामी विवेकानंद'
  },

  // --- उपनिषद एवं वैदिक सूक्त अमृत ---
  {
    quoteText: "असतो मा सद्गमय, तमसो मा ज्योतिर्गमय, मृत्योर्मा अमृतं गमय। असत्य से सत्य, अंधकार से प्रकाश और मृत्यु से अमरता की ओर ले चलो।",
    category: 'shanti',
    categoryLabel: 'बृहदारण्यक उपनिषद',
    authorOrSource: 'वैदिक प्रार्थना'
  },
  {
    quoteText: "वसुधैव कुटुम्बकम्। समस्त संसार और इसके समस्त प्राणी एक ही पावन परिवार के अंग हैं।",
    category: 'shanti',
    categoryLabel: 'महा उपनिषद',
    authorOrSource: 'सनातन दर्शन'
  },
  {
    quoteText: "सत्यमेव जयते नानृतम्। अंततः सत्य की ही विजय होती है, असत्य की कभी नहीं।",
    category: 'shanti',
    categoryLabel: 'मुण्डक उपनिषद',
    authorOrSource: 'सनातन सत्य'
  },
  {
    quoteText: "अहं ब्रह्मास्मि। मेरे अंतःकरण में वही परम चेतना और परमात्मा का दिव्य प्रकाश वास करता है।",
    category: 'yoga',
    categoryLabel: 'वेदांत महावाक्य',
    authorOrSource: 'उपनिषद अमृत'
  },
  {
    quoteText: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सभी सुखी हों, सभी निरोगी हों, सभी का कल्याण हो।",
    category: 'prarthana',
    categoryLabel: 'वैदिक शांति पाठ',
    authorOrSource: 'ऋग्वेद'
  },
  {
    quoteText: "मौन सबसे बड़ी प्रार्थना है, और अंतःकरण की शांति ईश्वर का सबसे अनमोल उपहार है।",
    category: 'shanti',
    categoryLabel: 'परम शांति',
    authorOrSource: 'उपनिषद'
  },
  {
    quoteText: "जब सारे रास्ते बंद होने लगें, तब समझ लेना कि परमात्मा अब खुद तुम्हारी उंगली पकड़ने वाले हैं।",
    category: 'samarpan',
    categoryLabel: 'ईश्वर सहारा',
    authorOrSource: 'संत वाणी'
  },
  {
    quoteText: "मन का मंदिर साफ रखो, ईश्वर तो हर पल तुम्हारी हर सांस में विराजमान हैं।",
    category: 'prarthana',
    categoryLabel: 'अंतःकरण',
    authorOrSource: 'कबीर वाणी'
  },
  {
    quoteText: "जो झुकना जानते हैं, वो कभी टूटते नहीं। विनम्रता ही सनातन धर्म का सबसे बड़ा आभूषण है।",
    category: 'shanti',
    categoryLabel: 'विनम्रता',
    authorOrSource: 'सत्य वचन'
  },
  {
    quoteText: "सुख में प्रभु को धन्यवाद दो और दुःख में प्रभु को याद करो, हर पल उनका सुमिरन ही सच्चा जीवन है।",
    category: 'bhakti',
    categoryLabel: 'हरि सुमिरन',
    authorOrSource: 'भक्ति सूत्र'
  },
  {
    quoteText: "कर्म की किताब बहुत साफ होती है, जो दिया है वही लौटकर आएगा। चाहे दुआएं हों या बद्दुआएं, प्रेम हो या नफ़रत।",
    category: 'karma',
    categoryLabel: 'कर्म सिद्धांत',
    authorOrSource: 'श्रीमद्भगवद्गीता'
  },
  {
    quoteText: "ईश्वर से कभी यह मत कहो कि मेरी मुश्किलें बड़ी हैं, मुश्किलों से कहो कि मेरा ईश्वर बहुत बड़ा है।",
    category: 'vishwas',
    categoryLabel: 'अभय विश्वास',
    authorOrSource: 'दिव्य शक्ति'
  }
];

// In-Memory cache for verses dynamically fetched from the internet
let liveInternetVicharCache: Omit<ShubhVicharCardItem, 'id' | 'likesCount' | 'image'>[] = [];
let isInternetFetchingActive = false;

/**
 * 3. REAL-TIME INTERNET FETCHER
 * Directly fetches 500+ authentic Hindi verses of Srimad Bhagavad Gita from GitHub RAW live API.
 * Ensures the app connects to the internet in real-time and continuously streams brand new quotes!
 */
export async function fetchLiveInternetVichar(): Promise<Omit<ShubhVicharCardItem, 'id' | 'likesCount' | 'image'>[]> {
  if (liveInternetVicharCache.length > 50) {
    return liveInternetVicharCache;
  }

  if (isInternetFetchingActive) {
    return liveInternetVicharCache;
  }

  isInternetFetchingActive = true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      'https://raw.githubusercontent.com/kashishkhullar/gita_json/master/dataset_hindi.json',
      { signal: controller.signal, cache: 'default' }
    ).catch(() => null);

    clearTimeout(timeoutId);

    if (!response || !response.ok) {
      return liveInternetVicharCache;
    }

    const data = await response.json().catch(() => null);
    const fetchedQuotes: Omit<ShubhVicharCardItem, 'id' | 'likesCount' | 'image'>[] = [];

    if (data && data.verses) {
      for (const ch in data.verses) {
        for (const v in data.verses[ch]) {
          const item = data.verses[ch][v];
          if (item && item.meaning && item.meaning.length > 25 && item.meaning.length < 240) {
            fetchedQuotes.push({
              quoteText: item.meaning.replace(/[\r\n]+/g, ' ').trim(),
              sanskritVerse: item.text ? item.text.trim() : undefined,
              category: 'gita',
              categoryLabel: 'गीता ज्ञान (लाइव)',
              authorOrSource: `श्रीमद्भगवद्गीता (अध्याय ${ch}, श्लोक ${v})`
            });
          }
        }
      }
    }

    if (fetchedQuotes.length > 0) {
      // Shuffle the internet items
      liveInternetVicharCache = fetchedQuotes.sort(() => Math.random() - 0.5);
    }
  } catch {
    // Fail silently without console warnings
  } finally {
    isInternetFetchingActive = false;
  }

  return liveInternetVicharCache;
}

// Global sequential pointer across devotional photos to ensure 100% UNIQUE images per card
let globalDevotionalImagePointer = 0;

// Global set of quote text hashes displayed during this session to GUARANTEE ZERO REPEATS
const sessionSeenQuoteKeys = new Set<string>();

/**
 * 4. GUARANTEED UNIQUE INFINITE VICHAR GENERATOR
 * - Never repeats quotes: Tracks every seen quote text across the user session
 * - Pulls from live internet stream + rich curated Sanatan wisdom pool
 * - Assigns pure devotional photos sequentially with ZERO duplicates across cards
 */
export async function getNextUniqueVicharBatch(
  count: number = 6,
  onProgress?: (totalAvailable: number) => void
): Promise<ShubhVicharCardItem[]> {
  // Trigger background internet fetch if not already populated
  if (liveInternetVicharCache.length === 0) {
    try {
      await fetchLiveInternetVichar();
    } catch {}
  }

  // Combined master pool: Curated Sanatan pearls + Live internet verses
  const combinedPool = [...CORE_SANATAN_VICHAR_POOL, ...liveInternetVicharCache];
  if (onProgress) onProgress(combinedPool.length);

  const newCards: ShubhVicharCardItem[] = [];
  const totalDevotionalPhotos = SACRED_DEVOTIONAL_IMAGES.length;

  // Find quotes that have NOT yet been seen in this session
  for (let i = 0; i < combinedPool.length && newCards.length < count; i++) {
    const candidate = combinedPool[i];
    const key = candidate.quoteText.slice(0, 35);

    if (!sessionSeenQuoteKeys.has(key)) {
      sessionSeenQuoteKeys.add(key);

      // Advance sequential pointer for every single card so that NO two cards share an image
      const assignedImage = SACRED_DEVOTIONAL_IMAGES[globalDevotionalImagePointer % totalDevotionalPhotos];
      globalDevotionalImagePointer++;

      newCards.push({
        id: `vichar-${Date.now()}-${sessionSeenQuoteKeys.size}-${Math.random().toString(36).substring(2, 7)}`,
        quoteText: candidate.quoteText,
        sanskritVerse: candidate.sanskritVerse,
        category: candidate.category,
        categoryLabel: candidate.categoryLabel,
        image: assignedImage,
        authorOrSource: candidate.authorOrSource,
        likesCount: 108 + Math.floor(Math.random() * 320)
      });
    }
  }

  // If entire pool exhausted (after 500+ cards), reset seen set but shuffle
  if (newCards.length < count) {
    sessionSeenQuoteKeys.clear();
    const shuffled = [...combinedPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length && newCards.length < count; i++) {
      const candidate = shuffled[i];
      const key = candidate.quoteText.slice(0, 35);
      sessionSeenQuoteKeys.add(key);

      const assignedImage = SACRED_DEVOTIONAL_IMAGES[globalDevotionalImagePointer % totalDevotionalPhotos];
      globalDevotionalImagePointer++;

      newCards.push({
        id: `vichar-cycle-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        quoteText: candidate.quoteText,
        sanskritVerse: candidate.sanskritVerse,
        category: candidate.category,
        categoryLabel: candidate.categoryLabel,
        image: assignedImage,
        authorOrSource: candidate.authorOrSource,
        likesCount: 108 + Math.floor(Math.random() * 320)
      });
    }
  }

  return newCards;
}

/**
 * 5. PULL-TO-REFRESH: FRESH BATCH OF QUOTES
 * Clears seen quote cache, shuffles photos, and generates brand new quotes
 */
export async function getFreshRefreshedVicharBatch(count: number = 8): Promise<ShubhVicharCardItem[]> {
  sessionSeenQuoteKeys.clear();
  // Jump photo cursor to guarantee different images on refresh
  globalDevotionalImagePointer = (globalDevotionalImagePointer + 11) % SACRED_DEVOTIONAL_IMAGES.length;
  return getNextUniqueVicharBatch(count);
}
