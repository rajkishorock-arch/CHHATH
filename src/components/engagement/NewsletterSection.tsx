import React, { useState } from 'react';
import { Mail, Sparkles, Check, Send } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-r from-orange-600/10 via-amber-500/15 to-orange-600/10 border-t border-b border-amber-500/20">
      <div className="container-custom max-w-4xl mx-auto text-center space-y-6">
        
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-xl">
          <Mail className="w-7 h-7" />
        </div>

        <div className="space-y-2 font-mukta">
          <div className="badge-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>छठ सेवा बुलेटिन • निःशुल्क सदस्यता</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            छठ महापर्व की पावन सूचनाएं व अर्घ्य समय अपने इनबॉक्स में पाएं 📬
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            आगामी छठ पूजा के मुहूर्त, सूर्योदय-सूर्यास्त का सटीक समय, नई भक्ति रचनाएं और घाट सुरक्षा अलर्ट सीधे प्राप्त करें।
          </p>
        </div>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 max-w-md mx-auto font-mukta font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>हार्दिक धन्यवाद! आप छठ सेवा बुलेटिन से जुड़ चुके हैं। जय छठी मईया 🙏</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto font-mukta">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="आपका ईमेल पता दर्ज करें (Enter your email)..."
              required
              className="w-full px-5 py-3 rounded-full bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
            />
            <button
              type="submit"
              className="w-full sm:w-auto btn-primary text-sm px-6 py-3 shrink-0 flex items-center justify-center gap-1.5 shadow-lg"
            >
              <span>सदस्यता लें</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-[11px] text-stone-500 font-mukta">
          🔒 आपकी गोपनीयता हमारे लिए सर्वोपरि है। कोई स्पैम नहीं, केवल पवित्र छठ जानकारी।
        </div>

      </div>
    </section>
  );
};
