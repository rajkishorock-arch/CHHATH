import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { ReelReport } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  reelTitle: string;
}

const REPORT_REASONS: Array<{ key: ReelReport['reason']; label: string; desc: string }> = [
  { key: 'Spam', label: 'स्पैम या अवांछित प्रचार', desc: 'बार-बार एक ही सामग्री या व्यावसायिक विज्ञापन' },
  { key: 'Copyright', label: 'कॉपीराइट उल्लंघन (Copyright)', desc: 'बिना अनुमति के ऑडियो या वीडियो का उपयोग' },
  { key: 'Harassment', label: 'उत्पीड़न या अपमानजनक व्यवहार', desc: 'किसी व्यक्ति या संस्कृति के प्रति अमर्यादित टिप्पणी' },
  { key: 'Misleading', label: 'भ्रामक या गलत जानकारी', desc: 'धार्मिक रीति-रिवाजों या नियमों की गलत प्रस्तुति' },
  { key: 'Hate', label: 'नफरत या वैमनस्य फैलाने वाली सामग्री', desc: 'साम्प्रदायिक या सामाजिक सौहार्द बिगाड़ने का प्रयास' },
  { key: 'Nudity', label: 'अश्लील या अमर्यादित दृश्य', desc: 'छठ महापर्व की पवित्रता के प्रतिकूल दृश्य' },
  { key: 'Violence', label: 'हिंसा या खतरनाक व्यवहार', desc: 'घाट या पानी में असुरक्षित स्टंट' },
  { key: 'Other', label: 'अन्य कारण', desc: 'कोई अन्य शिकायत' }
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, reelId, reelTitle }) => {
  const { reportReel } = useReels();
  const [selectedReason, setSelectedReason] = useState<ReelReport['reason']>('Spam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportReel(reelId, selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-rozha text-xl text-emerald-300">रिपोर्ट दर्ज कर ली गई है</h3>
            <p className="font-mukta text-xs text-stone-300">
              हमारी मॉडरेशन टीम इस रील की तत्काल समीक्षा करेगी। पवित्रता बनाए रखने में सहयोग के लिए धन्यवाद।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Flag className="w-5 h-5" />
              <h3 className="font-rozha text-xl font-bold">रील की रिपोर्ट करें</h3>
            </div>

            <p className="font-mukta text-xs text-stone-300">
              शीर्षक: <strong className="text-white font-semibold">"{reelTitle}"</strong>
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {REPORT_REASONS.map(item => (
                <label
                  key={item.key}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === item.key
                      ? 'bg-amber-500/15 border-amber-400/60 text-white'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-900'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={item.key}
                    checked={selectedReason === item.key}
                    onChange={() => setSelectedReason(item.key)}
                    className="mt-1 accent-amber-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-amber-200">{item.label}</div>
                    <div className="text-[10px] text-stone-400">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-300 mb-1">
                विस्तार से बताएं (वैकल्पिक)
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="संक्षिप्त विवरण दें..."
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-stone-900 text-stone-300 hover:text-white text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold shadow-lg hover:brightness-110 transition-all"
              >
                रिपोर्ट भेजें
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
