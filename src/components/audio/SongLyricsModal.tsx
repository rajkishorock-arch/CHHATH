import React, { useState } from 'react';
import { Song } from '../../types';
import { 
  X, 
  Mic2, 
  Copy, 
  Check, 
  Volume2, 
  Sparkles, 
  Music, 
  Maximize2 
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface SongLyricsModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

// Rich repository of authentic traditional Chhath geet lyrics
const LYRICS_ARCHIVE: Record<string, { bhojpuri: string[]; meaning: string }> = {
  default: {
    bhojpuri: [
      'काँच ही बाँस के बहँगिया, बहँगी लचकत जाए...',
      'बात जे पुछेले बटोहिया, बहँगी केकरा के जाए?',
      'तू त आन्हर हउवे रे बटोहिया, बहँगी छठी माई के जाए।',
      '',
      'काँच ही बाँस के टोकरिया, दौरा घाटे पहुँच जाए...',
      'सुरुज देव देखि मुस्काएले, अरघ के बेरा हो जाए।',
      '',
      'केलवा जे फरेले घवद से, ओह पर सुगा मँडराए...',
      'मारबो रे सुगवा धनुष से, सुगा गिरे मुरझाए।',
      '',
      'उ जे सुगनी जे रोएले वियोग से, आदित होई ना सहाय...',
      'देव दीनानाथ के महिमा, तीनहु लोक में समाए।'
    ],
    meaning: 'बांस की बहंगी में छठी मईया का पावन प्रसाद सजकर घाट की ओर जा रहा है। मार्ग में बटोही पूछता है कि यह किसके लिए जा रहा है, तो श्रद्धालु कहते हैं कि यह परम आदरणीय छठी माई का प्रसाद है। सूर्य देव प्रसन्न होकर दर्शन देते हैं और संपूर्ण जगत में मंगल होता है।'
  },
  'kelwa': {
    bhojpuri: [
      'केलवा जे फरेले घवद से, ओह पर सुगा मँडराए...',
      'उ जे खबरी जनइबो अदिक से, सुगा देले जुठियाए।',
      'उ जे सुगनी जे रोएले वियोग से, आदित होई ना सहाय।',
      '',
      'काँच ही बाँस के सूपवा, अरघ देवे चलली छठी माई...',
      'अरघ के बेरा भईल सुरुज देव, दर्शन दीहीं ना आजु।'
    ],
    meaning: 'केले के सुंदर घवद पर तोते मंडरा रहे हैं। पवित्रता इतनी कठोर है कि पक्षी भी प्रसाद को जूठा न करे। शुद्धता और अगाध निष्ठा के साथ सूर्य देव से प्रार्थना की जा रही है।'
  },
  'pahile': {
    bhojpuri: [
      'पहिले पहिल हम कईनी, छठी मईया बरत तोहार...',
      'करिहा क्षमा छठी माई, भूल-चूक गलती हमार।',
      '',
      'सबके सुहाग अमर रखिहा, गोदी में होवे संतान...',
      'सदा रहे घर में खुशहाली, बांटेली माई वरदान।',
      '',
      'घाट सजल बा गंगा जी के, उमड़ल बा संसार...',
      'हे छठी माई, सुन लीं अरजी हमार।'
    ],
    meaning: 'पहली बार छठ व्रत करने वाली व्रती अत्यंत विनम्रता से छठी मईया से प्रार्थना करती है कि यदि कोई भूल-चूक हो जाए तो क्षमा करें और समस्त परिवार पर सुहाग, संतान और सौभाग्य का वरदान बनाए रखें।'
  },
  'ugaho': {
    bhojpuri: [
      'उग हे सुरुज देव भईल अरघ के बेर...',
      'कब से ठाढ़ बानी जल बीच, दर्शन दीहीं ना आजु।',
      '',
      'अंगना में धुप-दीप बारले बानी, हाथे लीहले अरघ के थाल...',
      'पूरब दिशा से लाली छिटकल, उगीं हे दीनानाथ।'
    ],
    meaning: 'व्रती पवित्र शीतल जल में घंटों से हाथ में सूप लिए खड़े हैं और सूर्य देव से प्रार्थना कर रहे हैं कि हे भगवान भास्कर! अब उदित होकर दर्शन दें और हमारा अर्घ्य स्वीकार करें।'
  }
};

export const SongLyricsModal: React.FC<SongLyricsModalProps> = ({ song, isOpen, onClose }) => {
  const { isPlaying, togglePlay } = useAudio();
  const [copied, setCopied] = useState(false);
  const [karaokeMode, setKaraokeMode] = useState(true);

  if (!isOpen || !song) return null;

  // Match lyrics key
  let lyricsData = LYRICS_ARCHIVE.default;
  const titleLower = song.title.toLowerCase();
  if (titleLower.includes('पहिले') || titleLower.includes('pahile')) {
    lyricsData = LYRICS_ARCHIVE.pahile;
  } else if (titleLower.includes('केलवा') || titleLower.includes('kelwa')) {
    lyricsData = LYRICS_ARCHIVE.kelwa;
  } else if (titleLower.includes('उग') || titleLower.includes('uga')) {
    lyricsData = LYRICS_ARCHIVE.ugaho;
  }

  const handleCopy = () => {
    const text = `${song.title}\nगायक: ${song.singer}\n\nबोल (Lyrics):\n${lyricsData.bhojpuri.join('\n')}\n\nभावार्थ:\n${lyricsData.meaning}\n\nछठ महापर्व २०२६`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="royal-card-luxury w-full max-w-2xl max-h-[90vh] rounded-3xl border-amber-400/50 shadow-2xl overflow-hidden flex flex-col font-mukta">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-stone-900 border-b border-amber-500/25 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center">
                <Mic2 className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="badge-royal text-[10px] py-0.5 px-2 mb-1">
                छठ गीत कराओके व बोल (SING-ALONG)
              </span>
              <h3 className="font-rozha text-xl sm:text-2xl text-stone-100 font-bold gold-foil-text line-clamp-1">
                {song.title}
              </h3>
              <span className="text-xs text-amber-300/90 font-bold block">
                {song.singer}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Lyrics Stream */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Controls bar */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <button
              onClick={() => setKaraokeMode(!karaokeMode)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                karaokeMode
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                  : 'bg-stone-900 text-stone-400 border border-stone-800'
              }`}
            >
              कराओके फॉन्ट: {karaokeMode ? 'बड़ा (Sing-Along)' : 'सामान्य'}
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कॉपी हो गया!' : 'बोल कॉपी करें'}</span>
            </button>
          </div>

          {/* Lyrics Verse Container */}
          <div className={`p-6 rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-900 border border-amber-500/30 text-center space-y-3 ${
            karaokeMode ? 'text-lg sm:text-xl font-bold text-amber-200' : 'text-base font-medium text-stone-200'
          }`}>
            {lyricsData.bhojpuri.map((line, idx) => (
              <p
                key={idx}
                className={line === '' ? 'h-3' : 'leading-relaxed hover:text-yellow-300 transition-colors cursor-default'}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Hindi Meaning / भावार्थ */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <strong className="text-amber-300 block font-bold mb-1">
              पावन भावार्थ व सांस्कृतिक महत्व:
            </strong>
            {lyricsData.meaning}
          </div>

        </div>

        {/* Modal Footer with Music Toggle */}
        <div className="p-4 bg-stone-900/90 border-t border-amber-500/20 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            परिवार व बच्चों के साथ मिलकर पारंपरिक धुन गाएं।
          </span>
          <button
            onClick={togglePlay}
            className="btn-royal-gold text-xs py-2 px-4 flex items-center gap-2"
          >
            <Music className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'गीत रोकें' : 'गीत बजाएं व गाएं'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
