import React, { useState } from 'react';
import { Calendar, MapPin, Plus, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ChhathCommunityEvent } from '../../types';

const INITIAL_EVENTS: ChhathCommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'पटना दीघा पाटीपुल घाट सामूहिक महाआरती व अर्घ्य',
    date: '15 नवंबर 2026',
    time: 'सायं ०३:३० बजे से',
    city: 'पटना (बिहार)',
    location: 'दीघा पाटीपुल घाट, गंगा तट',
    organizer: 'दीघा छठ पूजा सेवा समिति',
    description: '५१,००० दीपों की महाआरती, गंगा जल छिड़काव, निःशुल्क दूध व दातून वितरण एवं प्राथमिक चिकित्सा शिविर।',
    mapLink: 'https://maps.google.com/?q=Digha+Ghat+Patna',
    verified: true
  },
  {
    id: 'evt-2',
    title: 'दशाश्वमेध घाट सामूहिक सूर्य स्तुति व भजन संध्या',
    date: '15 नवंबर 2026',
    time: 'सायं ०४:०० बजे से',
    city: 'वाराणसी (उत्तर प्रदेश)',
    location: 'दशाश्वमेध व अस्सी घाट',
    organizer: 'काशी गंगा सेवा न्यास',
    description: 'वैदिक ब्राह्मणों द्वारा १२-आदित्य स्तुति, पारंपरिक शहनाई वादन व अर्घ्य व्यवस्था।',
    mapLink: 'https://maps.google.com/?q=Dashashwamedh+Ghat+Varanasi',
    verified: true
  },
  {
    id: 'evt-3',
    title: 'आईटीओ यमुना तट छठ महाकुंभ व सांस्कृतिक संध्या',
    date: '15-16 नवंबर 2026',
    time: 'सायं ०३:०० बजे से प्रातः पारण तक',
    city: 'नई दिल्ली',
    location: 'आईटीओ यमुना घाट व कुदसिया घाट',
    organizer: 'पूर्वांचल विकास मंच दिल्ली',
    description: 'भोजपुरी व मैथिली के ख्यातिलब्ध कलाकारों द्वारा सांस्कृतिक भक्ति संगीत व सुरक्षित घाट व्यवस्था।',
    mapLink: 'https://maps.google.com/?q=ITO+Yamuna+Ghat+Delhi',
    verified: true
  }
];

export const EventDirectory: React.FC = () => {
  const [events, setEvents] = useState<ChhathCommunityEvent[]>(INITIAL_EVENTS);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const newEvt: ChhathCommunityEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      date: '15-16 नवंबर 2026',
      time: 'सायं ०३:३० बजे से',
      city: city.trim() || 'स्थानीय नगर',
      location: location.trim(),
      organizer: organizer.trim() || 'स्थानीय समिति',
      description: description.trim() || 'छठ महापर्व का पावन सामुदायिक आयोजन।',
      mapLink: `https://maps.google.com/?q=${encodeURIComponent(location)}`,
      verified: true
    };

    setEvents(prev => [newEvt, ...prev]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setShowSubmitModal(false);
      setTitle('');
      setCity('');
      setLocation('');
      setOrganizer('');
      setDescription('');
    }, 1500);
  };

  return (
    <section id="events" className="section-padding relative overflow-hidden bg-stone-50 dark:bg-stone-900/60 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="badge-saffron inline-flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>सामुदायिक आयोजन निर्देशिका (Chhath Event Directory)</span>
            </div>
            <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
              छठ सामुदायिक आयोजन व उत्सव
            </h2>
            <p className="font-mukta text-base text-stone-600 dark:text-stone-300">
              विभिन्न नगरों व घाटों पर होने वाली सामूहिक महाआरती, भजन संध्या व सेवा शिविरों की सूची।
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md hover:scale-105 transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>आयोजन दर्ज करें (Submit Event)</span>
          </button>
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          {events.map(evt => (
            <div
              key={evt.id}
              className="p-6 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/25 shadow-lg hover:shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-600 dark:text-amber-400 font-mono">
                    {evt.date} • {evt.time}
                  </span>
                  {evt.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-700 dark:text-green-300 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>प्रमाणित</span>
                    </span>
                  )}
                </div>

                <h3 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {evt.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-mukta">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{evt.location}, {evt.city}</span>
                  </span>
                  <span>•</span>
                  <span>आयोजक: <strong>{evt.organizer}</strong></span>
                </div>

                <p className="text-xs font-mukta text-stone-600 dark:text-stone-300 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <a
                href={evt.mapLink}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-amber-500/20 text-stone-800 dark:text-stone-200 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>स्थान देखें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/40 paramprik-border text-stone-900 dark:text-stone-100 space-y-4">
              <h3 className="font-rozha text-2xl font-bold">
                छठ सामुदायिक आयोजन दर्ज करें
              </h3>
              <p className="text-xs font-mukta text-stone-500">
                अपने शहर अथवा घाट पर होने वाले सार्वजनिक अर्घ्य, सेवा शिविर या भजन संध्या की जानकारी साझा करें।
              </p>

              {submittedMessage ? (
                <div className="p-4 rounded-2xl bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>आयोजन सफलतापूर्वक दर्ज कर लिया गया है!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="आयोजन का शीर्षक (उदा. सामूहिक महाआरती व भजन संध्या)..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/30"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="शहर (उदा. पटना, वाराणसी)..."
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/30"
                      required
                    />
                    <input
                      type="text"
                      placeholder="आयोजक संस्था का नाम..."
                      value={organizer}
                      onChange={e => setOrganizer(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/30"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="घाट या स्थल का सटीक पता..."
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/30"
                    required
                  />
                  <textarea
                    placeholder="विशेष सुविधाएं (उदा. निःशुल्क दूध, प्राथमिक चिकित्सा, पार्किंग)..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/30"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 text-xs text-stone-500"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-xs font-bold bg-amber-500 text-stone-950 rounded-xl"
                    >
                      जमा करें
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
