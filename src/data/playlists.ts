import { Song } from '../types';

export interface ChhathPlaylist {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  thumbnail: string;
  youtubeId: string;
  trackCount: number;
  durationText: string;
  description: string;
  tracks: Song[];
}

export const chhathPlaylists: ChhathPlaylist[] = [
  {
    id: 'playlist-sharda',
    title: 'Mix - शारदा सिन्हा अमर छठ महापर्व संग्रह',
    subtitle: 'पद्मभूषण शारदा सिन्हा, टी-सीरीज़ भक्ति • Playlist',
    category: 'sharda',
    thumbnail: 'https://i.ytimg.com/vi/9sc-qdxLFwU/hqdefault.jpg',
    youtubeId: '9sc-qdxLFwU',
    trackCount: 8,
    durationText: '10+ गीत (नॉनस्टॉप)',
    description: 'स्वर कोकिला शारदा सिन्हा जी के सबसे पावन और अमर छठ भजनों का सम्पूर्ण संग्रह।',
    tracks: [
      {
        id: 'pl-sharda-1',
        title: 'पहिले पहिल हम कईनी छठी मईया',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '6:05',
        youtubeId: 'BsAFCc901MM',
        thumbnail: 'https://i.ytimg.com/vi/BsAFCc901MM/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-sharda-2',
        title: 'केलवा के पात पर उगेलन सुरुज देव',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '8:35',
        youtubeId: 'knZ8b5YnQiY',
        thumbnail: 'https://i.ytimg.com/vi/knZ8b5YnQiY/hqdefault.jpg',
        category: 'Surya Dev'
      },
      {
        id: 'pl-sharda-3',
        title: 'काँच ही बाँस के बहंगिया (मूल धुन)',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '5:28',
        youtubeId: 'OSQI61ilOsM',
        thumbnail: 'https://i.ytimg.com/vi/OSQI61ilOsM/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-sharda-4',
        title: 'कार्तिक मास इजोरिया छठी माई',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '6:15',
        youtubeId: 'UwqtDSb0pLI',
        thumbnail: 'https://i.ytimg.com/vi/UwqtDSb0pLI/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-sharda-5',
        title: 'हो दीनानाथ हे सुरुज देव',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '6:40',
        youtubeId: 'k8x7GFr5EQw',
        thumbnail: 'https://i.ytimg.com/vi/k8x7GFr5EQw/hqdefault.jpg',
        category: 'Surya Dev'
      },
      {
        id: 'pl-sharda-6',
        title: 'सुपवा लेले ठाढ़ बानी',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '5:15',
        youtubeId: 's256QAoPt4I',
        thumbnail: 'https://i.ytimg.com/vi/s256QAoPt4I/hqdefault.jpg',
        category: 'Arghya Geet'
      },
      {
        id: 'pl-sharda-7',
        title: 'हे छठी मईया तोहार महिमा अपार',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '7:12',
        youtubeId: 'kYJ5oP6q320',
        thumbnail: 'https://i.ytimg.com/vi/kYJ5oP6q320/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-sharda-8',
        title: 'शारदा सिन्हा अमर छठ भजन संग्रह जूकबॉक्स',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '10:20',
        youtubeId: '9sc-qdxLFwU',
        thumbnail: 'https://i.ytimg.com/vi/9sc-qdxLFwU/hqdefault.jpg',
        category: 'Jukebox'
      }
    ]
  },
  {
    id: 'playlist-anuradha',
    title: 'Mix - अनुराधा पौडवाल सम्पूर्ण छठ पूजा जूकबॉक्स',
    subtitle: 'अनुराधा पौडवाल, टी-सीरीज़ भक्ति • Playlist',
    category: 'anuradha',
    thumbnail: 'https://i.ytimg.com/vi/poJwkanrYAU/hqdefault.jpg',
    youtubeId: 'poJwkanrYAU',
    trackCount: 6,
    durationText: '47 मिनट (नॉनस्टॉप)',
    description: 'अनुराधा पौडवाल जी के स्वर में भक्तिमय 47 मिनट का संपूर्ण छठ भजन संग्रह।',
    tracks: [
      {
        id: 'pl-anuradha-1',
        title: 'उग हो सुरुज देव अरघ के बेरा (सम्पूर्ण जूकबॉक्स)',
        singer: 'अनुराधा पौडवाल (Anuradha Paudwal)',
        duration: '47:15',
        youtubeId: 'poJwkanrYAU',
        thumbnail: 'https://i.ytimg.com/vi/poJwkanrYAU/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-anuradha-2',
        title: 'काँच ही बाँस के बहंगिया लचकत जाए',
        singer: 'अनुराधा पौडवाल (Anuradha Paudwal)',
        duration: '5:42',
        youtubeId: 'OSQI61ilOsM',
        thumbnail: 'https://i.ytimg.com/vi/OSQI61ilOsM/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-anuradha-3',
        title: 'केलवा के पात पर उगेलन सुरुज देव',
        singer: 'अनुराधा पौडवाल (Anuradha Paudwal)',
        duration: '6:18',
        youtubeId: 'knZ8b5YnQiY',
        thumbnail: 'https://i.ytimg.com/vi/knZ8b5YnQiY/hqdefault.jpg',
        category: 'Surya Dev'
      },
      {
        id: 'pl-anuradha-4',
        title: 'हे छठी मईया सुन लीं पुकार',
        singer: 'अनुराधा पौडवाल (Anuradha Paudwal)',
        duration: '7:05',
        youtubeId: 'BsAFCc901MM',
        thumbnail: 'https://i.ytimg.com/vi/BsAFCc901MM/hqdefault.jpg',
        category: 'Traditional'
      }
    ]
  },
  {
    id: 'playlist-pawan',
    title: 'Mix - पवन सिंह सुपरहिट छठ पूजा स्पेशल 2026',
    subtitle: 'पवन सिंह, डीआरजे रिकॉर्ड्स, वेव • Playlist',
    category: 'pawan',
    thumbnail: 'https://i.ytimg.com/vi/NtSKpRCht6o/hqdefault.jpg',
    youtubeId: 'NtSKpRCht6o',
    trackCount: 6,
    durationText: '8+ गीत (सुपरहिट मिक्स)',
    description: 'पवन सिंह के नए और लोकप्रिय छठ गीतों का ऊर्जावान भक्ति संग्रह।',
    tracks: [
      {
        id: 'pl-pawan-1',
        title: 'जल बीच खड़ा होई अरघिया देब',
        singer: 'पवन सिंह (Pawan Singh)',
        duration: '5:18',
        youtubeId: 'NtSKpRCht6o',
        thumbnail: 'https://i.ytimg.com/vi/NtSKpRCht6o/hqdefault.jpg',
        category: 'Surya Dev'
      },
      {
        id: 'pl-pawan-2',
        title: 'उ जे केरवा जे फरेला घवद से',
        singer: 'पवन सिंह (Pawan Singh)',
        duration: '5:40',
        youtubeId: 'NtSKpRCht6o',
        thumbnail: 'https://i.ytimg.com/vi/NtSKpRCht6o/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-pawan-3',
        title: 'जोड़िले जोड़िया फलवा सुरुज देव',
        singer: 'पवन सिंह (Pawan Singh)',
        duration: '4:55',
        youtubeId: 'NtSKpRCht6o',
        thumbnail: 'https://i.ytimg.com/vi/NtSKpRCht6o/hqdefault.jpg',
        category: 'Surya Dev'
      }
    ]
  },
  {
    id: 'playlist-khesari',
    title: 'Mix - खेसारी लाल यादव पावन छठ भक्ति संग्रह',
    subtitle: 'खेसारी लाल यादव, वेव म्यूज़िक • Playlist',
    category: 'khesari',
    thumbnail: 'https://i.ytimg.com/vi/fCuHD3YBQKY/hqdefault.jpg',
    youtubeId: 'fCuHD3YBQKY',
    trackCount: 5,
    durationText: '6+ गीत (भक्ति मिक्स)',
    description: 'खेसारी लाल यादव के सुपरहिट पारंपरिक छठ गीतों का संग्रह।',
    tracks: [
      {
        id: 'pl-khesari-1',
        title: 'छठ घाटे चलीं सब सखियां मिली के',
        singer: 'खेसारी लाल यादव (Khesari Lal)',
        duration: '4:29',
        youtubeId: 'fCuHD3YBQKY',
        thumbnail: 'https://i.ytimg.com/vi/fCuHD3YBQKY/hqdefault.jpg',
        category: 'Ghat Geet'
      },
      {
        id: 'pl-khesari-2',
        title: 'घूँटी भर मोर धोती भीजे',
        singer: 'खेसारी लाल यादव (Khesari Lal)',
        duration: '3:54',
        youtubeId: 'IKAJdLAviYw',
        thumbnail: 'https://i.ytimg.com/vi/IKAJdLAviYw/hqdefault.jpg',
        category: 'Traditional'
      },
      {
        id: 'pl-khesari-3',
        title: 'अइली छठी माई हमरा अंगना',
        singer: 'खेसारी लाल यादव (Khesari Lal)',
        duration: '4:18',
        youtubeId: 'qFwoGr1ex_g',
        thumbnail: 'https://i.ytimg.com/vi/qFwoGr1ex_g/hqdefault.jpg',
        category: 'Traditional'
      }
    ]
  },
  {
    id: 'playlist-maithili',
    title: 'Mix - मैथिली ठाकुर पारम्परिक छठ महापर्व वंदना',
    subtitle: 'मैथिली ठाकुर, रिशव, अयाची • Playlist',
    category: 'maithili',
    thumbnail: 'https://i.ytimg.com/vi/vSJO-AElAog/hqdefault.jpg',
    youtubeId: 'vSJO-AElAog',
    trackCount: 4,
    durationText: 'पारंपरिक मैथिली भजन',
    description: 'मैथिली ठाकुर के सुरीले पारंपरिक मैथिली छठ लोकगीतों का संग्रह।',
    tracks: [
      {
        id: 'pl-maithili-1',
        title: 'उग हो सुरुज देव अरघ के बेरा',
        singer: 'मैथिली ठाकुर (Maithili Thakur)',
        duration: '7:40',
        youtubeId: 'vSJO-AElAog',
        thumbnail: 'https://i.ytimg.com/vi/vSJO-AElAog/hqdefault.jpg',
        category: 'Maithili'
      },
      {
        id: 'pl-maithili-2',
        title: 'सोना सातकुनिया हो दीनानाथ',
        singer: 'मैथिली ठाकुर (Maithili Thakur)',
        duration: '5:45',
        youtubeId: 'fwX2g9jjo1o',
        thumbnail: 'https://i.ytimg.com/vi/fwX2g9jjo1o/hqdefault.jpg',
        category: 'Maithili'
      }
    ]
  },
  {
    id: 'playlist-arghya',
    title: 'Mix - संध्या अर्घ्य व उषा अर्घ्य स्पेशल भक्ति जूकबॉक्स',
    subtitle: 'विभिन्न लोक कलाकार • Chhath Mahaparv Jukebox • Playlist',
    category: 'arghya',
    thumbnail: 'https://i.ytimg.com/vi/B4qzjtlTakA/hqdefault.jpg',
    youtubeId: 'B4qzjtlTakA',
    trackCount: 15,
    durationText: '1+ घंटा (नॉनस्टॉप)',
    description: 'संध्या अर्घ्य और प्रातःकालीन उषा अर्घ्य के लिए शीर्ष 15 पावन भजनों का 1 घंटे से अधिक लंबा नॉनस्टॉप जूकबॉक्स।',
    tracks: [
      {
        id: 'pl-arghya-1',
        title: 'शीर्ष 15 पावन छठ पूजा स्पेशल नॉनस्टॉप जूकबॉक्स (1+ घंटा)',
        singer: 'टी-सीरीज़ भक्ति संग्रह (T-Series)',
        duration: '1:02:40',
        youtubeId: 'B4qzjtlTakA',
        thumbnail: 'https://i.ytimg.com/vi/B4qzjtlTakA/hqdefault.jpg',
        category: 'Jukebox'
      },
      {
        id: 'pl-arghya-2',
        title: 'संध्या अर्घ्य पावन आरती व सूर्य वंदना',
        singer: 'पारंपरिक छठ भजन',
        duration: '8:15',
        youtubeId: 'knZ8b5YnQiY',
        thumbnail: 'https://i.ytimg.com/vi/knZ8b5YnQiY/hqdefault.jpg',
        category: 'Arghya'
      },
      {
        id: 'pl-arghya-3',
        title: 'उषा अर्घ्य भोरवा के दर्शन',
        singer: 'शारदा सिन्हा (Sharda Sinha)',
        duration: '6:40',
        youtubeId: 'k8x7GFr5EQw',
        thumbnail: 'https://i.ytimg.com/vi/k8x7GFr5EQw/hqdefault.jpg',
        category: 'Arghya'
      }
    ]
  }
];
