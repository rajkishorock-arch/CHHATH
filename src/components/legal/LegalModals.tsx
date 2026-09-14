import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Trash2, Flag } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'privacy' | 'terms' | 'deletion' | 'guidelines' | 'report' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!activeModal) return null;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Privacy Policy */}
        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-stone-100">गोपनीयता नीति (Privacy Policy)</h2>
            </div>
            <div className="font-mukta text-sm text-stone-700 dark:text-stone-300 space-y-3 leading-relaxed">
              <p>
                छठ महापर्व डिजिटल मंच पर आपकी निजता और डाटा सुरक्षा हमारी सर्वोच्च प्राथमिकता है।
              </p>
              <h3 className="font-bold text-stone-900 dark:text-stone-100">१. सार्वजनिक पहुँच</h3>
              <p>
                हमारा मंच बिना किसी लॉगिन के संपूर्ण धार्मिक सामग्री (अर्घ्य समय, पूजा विधि, सामग्री चेकलिस्ट, घाट निर्देश) तक निःशुल्क पहुँच प्रदान करता है।
              </p>
              <h3 className="font-bold text-stone-900 dark:text-stone-100">२. व्यक्तिगत डेटा संग्रह</h3>
              <p>
                यदि आप खाता बनाते हैं, तो हम केवल आपका नाम, ईमेल/उपयोगकर्ता नाम और शहर की पसंद ही सुरक्षित रखते हैं। हम कभी भी आपका व्यक्तिगत डेटा किसी तीसरे पक्ष को नहीं बेचते।
              </p>
              <h3 className="font-bold text-stone-900 dark:text-stone-100">३. कुकीज़ एवं लोकल स्टोरेज</h3>
              <p>
                आपकी भाषा, विषय (डार्क/लाइट मोड) और ऑफलाइन चेकलिस्ट को केवल आपके ब्राउज़र के लोकल स्टोरेज में ही सहेजा जाता है।
              </p>
            </div>
          </div>
        )}

        {/* Community Guidelines */}
        {activeModal === 'guidelines' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <FileText className="w-6 h-6" />
              <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-stone-100">समुदाय दिशा-निर्देश (Community Guidelines)</h2>
            </div>
            <div className="font-mukta text-sm text-stone-700 dark:text-stone-300 space-y-3 leading-relaxed">
              <p>
                छठ महापर्व भक्ति, पवित्रता और सामाजिक सद्भाव का उत्सव है।
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>किसी भी प्रकार की अभद्र भाषा, घृणास्पद टिप्पणी या अश्लील सामग्री पूरी तरह प्रतिबंधित है।</li>
                <li>धार्मिक भावनाओं को ठेस पहुँचाने वाले झूठे या असत्यापित दावों से बचें।</li>
                <li>प्रशासनिक सुरक्षा निर्देशों एवं घाट व्यवस्था का आदर करें।</li>
              </ul>
            </div>
          </div>
        )}

        {/* Data Deletion */}
        {activeModal === 'deletion' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
              <Trash2 className="w-6 h-6" />
              <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-stone-100">डेटा विलोपन अनुरोध (Data Deletion)</h2>
            </div>
            <div className="font-mukta text-sm text-stone-700 dark:text-stone-300 space-y-3 leading-relaxed">
              <p>
                आप किसी भी समय अपना खाता और उससे जुड़ी समस्त जानकारी (सहेजे गए गीत, चेकलिस्ट, परिवार के कार्य) स्थायी रूप से हटा सकते हैं।
              </p>
              <p>
                खाता हटाने के लिए अपनी प्रोफ़ाइल से <strong>अकाउंट सेटिंग्स → खाता हटाएँ</strong> पर जाएँ या support@chhathmahaparv.org पर ईमेल करें।
              </p>
            </div>
          </div>
        )}

        {/* Report Content */}
        {activeModal === 'report' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-amber-400 font-bold">
              <Flag className="w-6 h-6" />
              <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-stone-100">सामग्री की शिकायत करें (Report Content)</h2>
            </div>
            {reportSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mukta font-bold text-center">
                ✓ आपकी शिकायत दर्ज कर ली गई है। हमारी टीम 24 घंटे में समीक्षा करेगी।
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <p className="font-mukta text-sm text-stone-700 dark:text-stone-300">
                  यदि आपको किसी पोस्ट या कमेंट में आपत्तिजनक या गलत जानकारी दिखती है, तो कृपया कारण बताएं:
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="शिकायत का विवरण लिखें..."
                  required
                  rows={4}
                  className="w-full p-3 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mukta text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mukta text-sm transition-all"
                >
                  शिकायत भेजें (Submit Report)
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
