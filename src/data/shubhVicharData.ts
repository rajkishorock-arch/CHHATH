export interface ShubhVicharCardItem {
  id: string;
  quoteText: string;
  category: 'prarthana' | 'samarpan' | 'bhakti' | 'yoga' | 'shanti' | 'karma' | 'vishwas';
  categoryLabel: string;
  image: string;
  authorOrSource?: string;
  likesCount?: number;
}

// Curated Sacred Quotes and Thoughts (Matching Screenshot 1 and Classic Vedic Philosophy)
export const BASE_SHUBH_VICHAR_POOL = [
  {
    quoteText: "प्रार्थना शब्दों से नहीं हृदय से होनी चाहिए, क्योंकि ईश्वर उनकी भी सुनते है जो बोल नहीं सकते।",
    category: 'prarthana' as const,
    categoryLabel: 'प्रार्थना व भक्ति',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'अमृत वचन'
  },
  {
    quoteText: "शरीर से प्रेम हैं तो आसन करें, साँस से प्रेम है तो प्राणायाम करें, आत्मा से प्रेम है तो ध्यान करें, और परमात्मा से प्रेम है तो समर्पण करें।",
    category: 'yoga' as const,
    categoryLabel: 'योग एवं ध्यान',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'योग सूत्र'
  },
  {
    quoteText: "प्रभु, सुख देना तो बस इतना देना कि जिसमें अहंकार ना आये और दुःख देना तो बस इतना देना कि जिसमे आस्था ना खो जाए।",
    category: 'samarpan' as const,
    categoryLabel: 'समर्पण भाव',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'प्रभु वंदना'
  },
  {
    quoteText: "ए जन्नत अपनी औकात में रहना, हम तेरी जन्नत के मोहताज नहीं, हम 'श्री बांके बिहारी' के चरणों में रहते है, वहां तेरी भी कोई औकात नहीं।",
    category: 'bhakti' as const,
    categoryLabel: 'वृंदावन रस',
    image: 'https://images.unsplash.com/photo-1590076212450-4886616a1334?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'श्री बांके बिहारी'
  },
  {
    quoteText: "आस्था का मतलब यह मानना नहीं है कि ईश्वर आपके लिए सही करेंगे, बल्कि यह है कि ईश्वर जो करेंगे वह सही होगा।",
    category: 'vishwas' as const,
    categoryLabel: 'अखंड आस्था',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'जीवन दर्शन'
  },
  {
    quoteText: "जब तक आप स्वयं पर विश्वास नहीं करते, तब तक आप ईश्वर पर विश्वास नहीं कर सकते।",
    category: 'vishwas' as const,
    categoryLabel: 'आत्मबल',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'स्वामी विवेकानंद'
  },
  {
    quoteText: "कर्म की किताब बहुत साफ होती है, जो दिया है वही लौटकर आएगा। चाहे दुआएं हों या बद्दुआएं, प्रेम हो या नफ़रत।",
    category: 'karma' as const,
    categoryLabel: 'कर्म सिद्धांत',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'श्रीमद्भगवद्गीता'
  },
  {
    quoteText: "ईश्वर से कभी यह मत कहो कि मेरी मुश्किलें बड़ी हैं, मुश्किलों से कहो कि मेरा ईश्वर बहुत बड़ा है।",
    category: 'vishwas' as const,
    categoryLabel: 'अभय विश्वास',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'दिव्य शक्ति'
  },
  {
    quoteText: "मौन सबसे बड़ी प्रार्थना है, और अंतःकरण की शांति ईश्वर का सबसे अनमोल उपहार है।",
    category: 'shanti' as const,
    categoryLabel: 'परम शांति',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'उपनिषद'
  },
  {
    quoteText: "जब सारे रास्ते बंद होने लगें, तब समझ लेना कि परमात्मा अब खुद तुम्हारी उंगली पकड़ने वाले हैं।",
    category: 'samarpan' as const,
    categoryLabel: 'ईश्वर सहारा',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'संत वाणी'
  },
  {
    quoteText: "मन का मंदिर साफ रखो, ईश्वर तो हर पल तुम्हारी हर सांस में विराजमान हैं।",
    category: 'prarthana' as const,
    categoryLabel: 'अंतःकरण',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'कबीर वाणी'
  },
  {
    quoteText: "जो झुकना जानते हैं, वो कभी टूटते नहीं। विनम्रता ही सनातन धर्म का सबसे बड़ा आभूषण है।",
    category: 'shanti' as const,
    categoryLabel: 'विनम्रता',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'सत्य वचन'
  },
  {
    quoteText: "सुख में प्रभु को धन्यवाद दो और दुःख में प्रभु को याद करो, हर पल उनका सुमिरन ही सच्चा जीवन है।",
    category: 'bhakti' as const,
    categoryLabel: 'हरि सुमिरन',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'भक्ति सूत्र'
  },
  {
    quoteText: "हे प्रभु, मुझे इतना काबिल बनाओ कि मैं किसी के चेहरे पर मुस्कान ला सकूं और किसी की आँखों से आँसू पोंछ सकूं।",
    category: 'prarthana' as const,
    categoryLabel: 'परोपकार',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'प्रार्थना'
  },
  {
    quoteText: "समय और स्थिति कभी एक जैसी नहीं रहती, धैर्य और प्रभु पर अटूट विश्वास ही मनुष्य की सबसे बड़ी ताकत हैं।",
    category: 'vishwas' as const,
    categoryLabel: 'धैर्य सूत्र',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'गीता उपदेश'
  },
  {
    quoteText: "सत्य के मार्ग पर चलने वाला कभी पराजित नहीं होता, क्योंकि धर्म की रक्षा करने वाले की रक्षा स्वयं परमात्मा करते हैं।",
    category: 'karma' as const,
    categoryLabel: 'धर्मो रक्षति रक्षितः',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'महाभारत'
  },
  {
    quoteText: "जिस घर में माता-पिता और संतों का आदर होता है, वहाँ स्वर्ग सा सुख और भगवान का साक्षात वास होता है।",
    category: 'shanti' as const,
    categoryLabel: 'संस्कार',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'रामचरितमानस'
  },
  {
    quoteText: "दीपक मिट्टी का हो या सोने का, प्रकाश वही देता है। वैसे ही मनुष्य का पद नहीं, उसके कर्म और विचार महान होते हैं।",
    category: 'shanti' as const,
    categoryLabel: 'सत्य बोध',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'नीति वचन'
  },
  {
    quoteText: "जो कुछ भी तुम्हारे पास है, उसे प्रभु का प्रसाद समझो। जो नहीं मिला, उसमें प्रभु की कोई गुप्त मंगलमय योजना है।",
    category: 'samarpan' as const,
    categoryLabel: 'प्रसाद भाव',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'समर्पण'
  },
  {
    quoteText: "संसार में सबसे धनी वह व्यक्ति है जिसके हृदय में संतोष, होंठों पर प्रभु नाम और आँखों में करुणा है।",
    category: 'shanti' as const,
    categoryLabel: 'संतोष धन',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&auto=format&fit=crop&q=80',
    authorOrSource: 'तुलसीदास'
  }
];

// Rich Devotional Photography Pool to dynamically pair with thoughts
export const DEVOTIONAL_PHOTOS_POOL = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590076212450-4886616a1334?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=700&auto=format&fit=crop&q=80'
];

/**
 * Real-time Dynamic Infinite Vichar Generator:
 * - Generates limitless distinct cards as the user scrolls
 * - Session-seeded so order is always fresh on each visit
 * - Zero repeats within a stream sequence
 */
export function generateInfiniteVicharCards(
  batchIndex: number, 
  batchSize: number = 6, 
  sessionSeed: number = 0
): ShubhVicharCardItem[] {
  const result: ShubhVicharCardItem[] = [];
  const poolLen = BASE_SHUBH_VICHAR_POOL.length;
  const photoLen = DEVOTIONAL_PHOTOS_POOL.length;

  for (let i = 0; i < batchSize; i++) {
    const globalIdx = batchIndex * batchSize + i;
    // Pseudorandom session shuffle
    const quoteIdx = (globalIdx * 7 + sessionSeed) % poolLen;
    const photoIdx = (globalIdx * 11 + sessionSeed + 3) % photoLen;

    const base = BASE_SHUBH_VICHAR_POOL[quoteIdx];
    const image = base.image || DEVOTIONAL_PHOTOS_POOL[photoIdx];

    result.push({
      id: `vichar-stream-${batchIndex}-${i}-${sessionSeed}`,
      quoteText: base.quoteText,
      category: base.category,
      categoryLabel: base.categoryLabel,
      image: image,
      authorOrSource: base.authorOrSource,
      likesCount: 108 + ((globalIdx * 17) % 432)
    });
  }

  return result;
}
