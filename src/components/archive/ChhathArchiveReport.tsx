import React, { useState } from 'react';
import { Archive, FileText, Download, Printer, Globe, Users, Flame, Music, Share2, Sparkles } from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';

interface ArchiveYearData {
  year: string;
  nahayKhayDate: string;
  sandhyaDate: string;
  totalDevoteesEst: string;
  keyHighlight: string;
  participatingNations: number;
}

const ARCHIVE_YEARS: Record<string, ArchiveYearData> = {
  '2026': {
    year: '2026',
    nahayKhayDate: '13 नवंबर 2026',
    sandhyaDate: '15 नवंबर 2026',
    totalDevoteesEst: '12 करोड़+',
    keyHighlight: 'डिजिटल छठ पोर्टल, ३डी घाट दर्शन व वैश्विक दीप श्रृंखला का ऐतिहासिक प्रारंभ।',
    participatingNations: 42
  },
  '2025': {
    year: '2025',
    nahayKhayDate: '25 अक्टूबर 2025',
    sandhyaDate: '27 अक्टूबर 2025',
    totalDevoteesEst: '11.5 करोड़',
    keyHighlight: 'गंगा एक्सप्रेसवे के नए रिवरफ्रंट घाटों पर लाखों श्रद्धालुओं का सुगम अर्घ्य अर्पण।',
    participatingNations: 38
  },
  '2024': {
    year: '2024',
    nahayKhayDate: '05 नवंबर 2024',
    sandhyaDate: '07 नवंबर 2024',
    totalDevoteesEst: '10.8 करोड़',
    keyHighlight: 'पर्यावरण संरक्षण व निर्मल गंगा अभियान के तहत शून्य-प्लास्टिक छठ का संकल्प।',
    participatingNations: 35
  },
  '2023': {
    year: '2023',
    nahayKhayDate: '17 नवंबर 2023',
    sandhyaDate: '19 नवंबर 2023',
    totalDevoteesEst: '10.2 करोड़',
    keyHighlight: 'विदेशों में भारतीय दूतावासों व प्रवासी संस्थाओं द्वारा अभूतपूर्व सार्वजनिक आयोजन।',
    participatingNations: 30
  }
};

export const ChhathArchiveReport: React.FC = () => {
  const { totalGlobalDiyas } = useChhathData();
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [showAnnualReportModal, setShowAnnualReportModal] = useState<boolean>(false);

  const data = ARCHIVE_YEARS[selectedYear] || ARCHIVE_YEARS['2026'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="archive" className="section-padding relative overflow-hidden bg-stone-900 text-white border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="badge-saffron inline-flex items-center gap-1.5 mb-2">
              <Archive className="w-3.5 h-3.5" />
              <span>सांस्कृतिक अभिलेखागार (Multi-Year Archive & Report)</span>
            </div>
            <h2 className="font-rozha text-3xl sm:text-5xl font-bold gold-foil-text">
              छठ महापर्व वार्षिक रिपोर्ट व पुरालेख
            </h2>
            <p className="font-mukta text-base text-stone-300">
              विगत वर्षों के पावन पर्व आंकड़े, तिथियां एवं डिजिटल उत्सव की विस्तृत वार्षिक रिपोर्ट।
            </p>
          </div>

          <button
            onClick={() => setShowAnnualReportModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-stone-950 font-rozha shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>वार्षिक रिपोर्ट २०२६ देखें</span>
          </button>
        </div>

        {/* Year Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {Object.keys(ARCHIVE_YEARS).map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedYear === yr
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md scale-105'
                  : 'bg-stone-800 text-stone-300 border border-stone-700 hover:border-amber-500/40'
              }`}
            >
              छठ वर्ष {yr}
            </button>
          ))}
        </div>

        {/* Year Archive Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-stone-950 border border-amber-500/30 shadow-2xl space-y-6 paramprik-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3">
            <div>
              <span className="text-xs uppercase font-bold text-amber-400 font-mono">
                अभिलेख वर्ष (Historical Record)
              </span>
              <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-white mt-0.5">
                छठ महापर्व — {data.year}
              </h3>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>{data.participatingNations} देशों में पावन उत्सव</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block font-mukta">नहाय-खाय व संध्या अर्घ्य</span>
              <span className="font-bold text-base text-amber-300 block mt-1">{data.nahayKhayDate}</span>
              <span className="text-xs text-orange-400 block font-mukta">अर्घ्य: {data.sandhyaDate}</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block font-mukta">अनुमानित श्रद्धालु भागीदारी</span>
              <span className="font-bold text-xl text-white block mt-1">{data.totalDevoteesEst}</span>
              <span className="text-[10px] text-green-400 block font-mukta">अखिल भारतीय व प्रवासी</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block font-mukta">डिजिटल दीप प्रज्वलन</span>
              <span className="font-bold text-xl text-amber-400 block mt-1">{totalGlobalDiyas.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-stone-400 block font-mukta">सत्यापित ऑनलाइन अर्पण</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-mukta text-amber-200">
            <strong>वर्ष का विशेष संस्मरण:</strong> {data.keyHighlight}
          </div>
        </div>

        {/* Annual Report Modal */}
        {showAnnualReportModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-2xl bg-stone-950 rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-500/50 text-white space-y-6 max-h-[85vh] overflow-y-auto paramprik-border">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    आधिकारिक राष्ट्रीय रिपोर्ट
                  </span>
                  <h3 className="font-rozha text-2xl sm:text-3xl font-bold gold-foil-text mt-0.5">
                    छठ महापर्व २०२६ — डिजिटल उत्सव रिपोर्ट
                  </h3>
                </div>
                <button
                  onClick={() => setShowAnnualReportModal(false)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mukta text-stone-300 leading-relaxed">
                <p>
                  छठ महापर्व २०२६ ने लोक आस्था और डिजिटल तकनीक के संगम का एक स्वर्णिम अध्याय लिखा है। देश-विदेश के लाखों श्रद्धालुओं ने इस डिजिटल सांस्कृतिक मंच के माध्यम से सूर्य अर्घ्य, वैदिक मंत्र, प्रामाणिक विधि और भक्ति संगीत का लाभ उठाया।
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-4">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="font-rozha text-xl font-bold text-amber-400 block">२.४ लाख+</span>
                    <span className="text-[10px] text-stone-400">वेबसाइट आगंतुक</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="font-rozha text-xl font-bold text-amber-400 block">{totalGlobalDiyas.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-stone-400">डिजिटल दीप प्रज्वलित</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="font-rozha text-xl font-bold text-amber-400 block">१८,०००+</span>
                    <span className="text-[10px] text-stone-400">बधाई पत्र जनरेट</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="font-rozha text-xl font-bold text-amber-400 block">४२</span>
                    <span className="text-[10px] text-stone-400">भागीदार देश</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <strong className="text-amber-300 block mb-1">आध्यात्मिक व सांस्कृतिक प्रभाव:</strong>
                  पहली बार प्रवासी भारतीयों ने अमेरिका, लंदन व दुबई से स्थानीय समय अनुसार लाइव अर्घ्य मुहूर्त का लाभ लिया और अपने पूर्वजों की परंपरा को नई पीढ़ी तक पहुंचाया।
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 rounded-full text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिंट / PDF डाउनलोड</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
