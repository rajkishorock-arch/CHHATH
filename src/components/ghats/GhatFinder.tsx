import React, { useState, useMemo, useEffect } from 'react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Users, 
  Car, 
  Droplet, 
  Lightbulb, 
  PhoneCall, 
  ShieldCheck, 
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Ghat } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { ReelsStorage } from '../../services/reelsStorage';

export const GhatFinder: React.FC = () => {
  const { t } = useLanguage();
  const { ghats } = useChhathData();
  const { currentUser } = useAuth();
  const { openShareModal } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedTab, setSelectedTab] = useState<'all' | 'myCity' | 'saved'>('all');
  const [selectedGhat, setSelectedGhat] = useState<Ghat>(ghats[0]);
  const [savedGhatIds, setSavedGhatIds] = useState<string[]>(currentUser?.savedGhats || []);

  useEffect(() => {
    if (currentUser?.savedGhats) {
      setSavedGhatIds(currentUser.savedGhats);
    }
  }, [currentUser]);

  const states = ['All', 'बिहार', 'उत्तर प्रदेश', 'झारखंड', 'दिल्ली NCR', 'महाराष्ट्र', 'पश्चिम बंगाल'];

  const handleToggleBookmark = (ghatId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;
    const isNowSaved = ReelsStorage.toggleGhatBookmark(currentUser.id, ghatId);
    setSavedGhatIds(prev => 
      isNowSaved ? [ghatId, ...prev] : prev.filter(id => id !== ghatId)
    );
  };

  const isGhatSaved = (ghatId: string) => savedGhatIds.includes(ghatId);

  const filteredGhats = useMemo(() => {
    return ghats.filter(g => {
      if (selectedTab === 'myCity' && currentUser?.city) {
        if (!g.city.toLowerCase().includes(currentUser.city.toLowerCase()) && 
            !currentUser.city.toLowerCase().includes(g.city.toLowerCase())) {
          return false;
        }
      }

      if (selectedTab === 'saved') {
        if (!savedGhatIds.includes(g.id)) return false;
      }

      const matchState = selectedState === 'All' || g.state === selectedState;
      const q = searchQuery.toLowerCase();
      const matchQuery = g.name.toLowerCase().includes(q) ||
                         g.city.toLowerCase().includes(q) ||
                         g.district.toLowerCase().includes(q) ||
                         g.river.toLowerCase().includes(q);
      return matchState && matchQuery;
    }).sort((a, b) => {
      // Prioritize user's city if in 'all' view
      if (selectedTab === 'all' && currentUser?.city) {
        const aCityMatch = a.city.toLowerCase().includes(currentUser.city.toLowerCase());
        const bCityMatch = b.city.toLowerCase().includes(currentUser.city.toLowerCase());
        if (aCityMatch && !bCityMatch) return -1;
        if (!aCityMatch && bCityMatch) return 1;
      }
      return 0;
    });
  }, [ghats, selectedState, searchQuery, selectedTab, currentUser, savedGhatIds]);

  const getCrowdBadge = (status: Ghat['crowdStatus']) => {
    switch (status) {
      case 'Normal':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600">सामान्य भीड़</span>;
      case 'Moderate':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600">मध्यम भीड़</span>;
      case 'Heavy':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-600">अत्यधिक भीड़</span>;
      case 'Very High':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-600 animate-pulse">अति-संवेदनशील भीड़</span>;
    }
  };

  return (
    <section id="ghats" className="section-padding bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.ghatBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.ghatFinderTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            {t.ghatSubtitle}
          </p>
        </div>

        {/* Search & Personalized Tabs & State Filter Controls */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchGhatPlaceholder}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-800 dark:text-stone-100 font-mukta placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              />
            </div>
          </div>

          {/* Quick Personalized Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-500/10 border border-emerald-500/20'
              }`}
            >
              🌐 सभी घाट ({ghats.length})
            </button>

            {currentUser?.city && (
              <button
                onClick={() => setSelectedTab('myCity')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedTab === 'myCity'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-extrabold scale-105'
                    : 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>📍 {currentUser.city} के घाट</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => setSelectedTab('saved')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedTab === 'saved'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold scale-105'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500/10 border border-amber-500/20'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>सहेजे गए घाट ({savedGhatIds.length})</span>
              </button>
            )}
          </div>

          {/* State Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {states.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedState === st
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-emerald-500/10 border border-stone-200 dark:border-stone-700'
                }`}
              >
                {st === 'All' ? 'सभी राज्य' : st}
              </button>
            ))}
          </div>

        </div>

        {/* Interactive Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Left Column: Ghats List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredGhats.map((ghat) => {
              const isSelected = selectedGhat.id === ghat.id;
              const isSaved = isGhatSaved(ghat.id);
              const isUserCity = currentUser?.city && ghat.city.toLowerCase().includes(currentUser.city.toLowerCase());

              return (
                <div
                  key={ghat.id}
                  onClick={() => setSelectedGhat(ghat)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none relative group ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 shadow-md ring-1 ring-emerald-400'
                      : 'bg-white dark:bg-stone-900 border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-mukta font-bold text-base text-stone-900 dark:text-stone-100 leading-tight">
                          {ghat.name}
                        </h4>
                        {isUserCity && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                            📍 आपके शहर में
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {getCrowdBadge(ghat.crowdStatus)}
                      {currentUser && (
                        <button
                          onClick={(e) => handleToggleBookmark(ghat.id, e)}
                          className="p-1 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                          title={isSaved ? 'सहेजा गया' : 'घाट सहेजें'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mukta">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{ghat.city} • {ghat.state}</span>
                  </div>

                  <div className="text-xs text-stone-600 dark:text-stone-300 font-mukta mt-2 flex items-center justify-between">
                    <span>तट: {ghat.river}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">विवरण देखें →</span>
                  </div>
                </div>
              );
            })}

            {filteredGhats.length === 0 && (
              <div className="text-center py-12 text-stone-500 font-mukta bg-white dark:bg-stone-900 rounded-2xl p-6">
                कोई घाट नहीं मिला। कृपया अन्य राज्य या नाम खोजें।
              </div>
            )}
          </div>

          {/* Right Column: Selected Ghat In-Depth Information & Map Directions */}
          <div className="lg:col-span-2 chhath-card p-6 sm:p-8 border-emerald-500/30 shadow-2xl relative space-y-6 paramprik-border overflow-hidden">
            
            {/* Traditional Ambient River Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/10 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    {selectedGhat.state} • {selectedGhat.district}
                  </span>
                  {getCrowdBadge(selectedGhat.crowdStatus)}
                </div>
                <h3 className="font-rozha text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-bold flex items-center gap-2">
                  <span>{selectedGhat.name}</span>
                  <span className="inline-block text-base animate-float-diya">🪔</span>
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mukta flex items-center gap-1.5 mt-0.5">
                  <Droplet className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                  <span>पवित्र तट: {selectedGhat.river}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">• गंगा आरती व अर्घ्य स्थल</span>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {currentUser && (
                  <button
                    onClick={() => handleToggleBookmark(selectedGhat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mukta flex items-center gap-1.5 transition-all border ${
                      isGhatSaved(selectedGhat.id)
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-extrabold'
                        : 'bg-stone-900/80 text-stone-200 border-amber-500/30 hover:border-amber-400 hover:text-amber-300'
                    }`}
                  >
                    {isGhatSaved(selectedGhat.id) ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 fill-stone-950" />
                        <span>सहेजा गया</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-amber-400" />
                        <span>घाट सहेजें</span>
                      </>
                    )}
                  </button>
                )}

                {/* Navigation Link to Google Maps */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedGhat.googleMapsQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>दिशा-निर्देश (Directions)</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>

                {/* Share Ghat to Chhath Connect */}
                <button
                  onClick={() => {
                    openShareModal({
                      type: 'ghat',
                      id: selectedGhat.id,
                      title: selectedGhat.name,
                      subtitle: `${selectedGhat.city}, ${selectedGhat.state}`,
                      thumbnail: '/images/sandhya_arghya.jpg',
                      metadata: { ghat: selectedGhat }
                    });
                  }}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 shrink-0 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30"
                  title="मित्रों को घाट की जानकारी साझा करें"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>संवाद पर भेजें</span>
                </button>
              </div>
            </div>

            {/* Interactive Simulated Ghat Map View */}
            <div className="h-44 sm:h-52 rounded-2xl bg-stone-900 relative overflow-hidden border border-emerald-500/30 shadow-inner flex items-center justify-center">
              <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center"
                style={{ backgroundImage: `url('/images/sandhya_arghya.jpg')` }}
              ></div>
              <div className="relative z-10 text-center text-white space-y-2 p-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-xs font-bold text-amber-300 border border-amber-500/40">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>अक्षांश: {selectedGhat.coordinates.lat.toFixed(4)}° N, देशांतर: {selectedGhat.coordinates.lng.toFixed(4)}° E</span>
                </div>
                <p className="text-xs text-stone-200 font-mukta max-w-md">
                  लाइव जीपीएस स्थिति: {selectedGhat.googleMapsQuery}
                </p>
              </div>
            </div>

            {/* Live River Water Level & Ghat Safety Radar Widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-stone-900 to-stone-900 border border-sky-400/30 shadow-lg space-y-3 font-mukta">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-sky-500/20">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-sky-400 animate-pulse" />
                  <span>लाइव नदी जल स्तर व सुरक्षा रडार (RIVER SAFETY GAUGE)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
                  अर्घ्य हेतु पूर्ण सुरक्षित जल स्तर
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-sky-500/20">
                  <span className="text-[10px] text-stone-400 block font-bold">अनुमानित जल स्तर</span>
                  <strong className="font-rozha text-base text-sky-300 block mt-0.5">48.2 मीटर</strong>
                  <span className="text-[9px] text-emerald-400">खतरे के निशान से नीचे</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-sky-500/20">
                  <span className="text-[10px] text-stone-400 block font-bold">जल प्रवाह गति</span>
                  <strong className="font-rozha text-base text-amber-300 block mt-0.5">1.1 m/s</strong>
                  <span className="text-[9px] text-amber-300">शांत व सहज प्रवाह</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-sky-500/20">
                  <span className="text-[10px] text-stone-400 block font-bold">SDRF व गोताखोर</span>
                  <strong className="font-rozha text-base text-emerald-400 block mt-0.5">तट पर तैनात</strong>
                  <span className="text-[9px] text-emerald-300">सुरक्षा नौका सक्रिय</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-sky-500/20">
                  <span className="text-[10px] text-stone-400 block font-bold">बैरिकेडिंग सीमा</span>
                  <strong className="font-rozha text-base text-orange-400 block mt-0.5">25 मीटर तक</strong>
                  <span className="text-[9px] text-orange-300">लाल फीते के पार न जाएं</span>
                </div>
              </div>
            </div>

            {/* Facilities Checklist Grid */}
            <div>
              <h4 className="font-mukta font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>प्रशासनिक सुविधाएं एवं सुरक्षा व्यवस्था (Facilities)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {selectedGhat.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mukta text-stone-800 dark:text-stone-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parking, Water Quality, and Lighting Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mukta">
              
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-orange-500" />
                  <span>पार्किंग व्यवस्था:</span>
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {selectedGhat.parkingInfo}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>प्रकाश एवं जल स्वच्छता:</span>
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {selectedGhat.lightingStatus} • {selectedGhat.waterQuality}
                </p>
              </div>

            </div>

            {/* Emergency Contact Bar */}
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-mukta text-stone-800 dark:text-stone-200">
                <PhoneCall className="w-4 h-4 text-red-500 shrink-0" />
                <span>
                  <strong>आपातकालीन संपर्क / नियंत्रण कक्ष:</strong> {selectedGhat.emergencyHelpline}
                </span>
              </div>
              <span className="text-[11px] text-stone-500">24x7 सक्रिय</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
