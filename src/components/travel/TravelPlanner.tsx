import React, { useState } from 'react';
import { Navigation, MapPin, Car, Clock, ShieldAlert, ArrowRight, Compass, Info } from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';

interface TravelRoute {
  origin: string;
  destination: string;
  distanceKm: string;
  durationMins: string;
  parkingZone: string;
  walkingMinsToGhat: string;
  trafficNote: string;
  googleMapsUrl: string;
}

export const TravelPlanner: React.FC = () => {
  const { userLocation } = useChhathData();
  const [startPoint, setStartPoint] = useState('');
  const [targetGhat, setTargetGhat] = useState('गांधी घाट (Gandhi Ghat, Patna)');
  const [planResult, setPlanResult] = useState<TravelRoute | null>(null);

  const handlePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = startPoint.trim() || `${userLocation.city} मुख्य चौराहा`;
    const destination = targetGhat;

    const route: TravelRoute = {
      origin,
      destination,
      distanceKm: '8.4 किमी',
      durationMins: '25-35 मिनट',
      parkingZone: 'अशोक राजपथ निर्धारित छठ पार्किंग स्थल (P-2)',
      walkingMinsToGhat: '5 मिनट पैदल मार्ग',
      trafficNote: '⚠️ सायं ०३:०० से ०७:०० बजे तक अर्घ्य भीड़ के कारण मुख्य घाट मार्ग केवल पैदल यात्रियों हेतु आरक्षित रहेगा। भारी वाहनों का प्रवेश वर्जित है।',
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    };

    setPlanResult(route);
  };

  return (
    <section id="travel-planner" className="section-padding relative overflow-hidden bg-white dark:bg-stone-900 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>सुगम घाट यात्रा योजना (Chhath Travel Planner)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            छठ यात्रा मार्ग व पार्किंग प्लानर 🚗
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            अपने घर से घाट तक का सुरक्षित मार्ग, अनुमानित समय, अधिकृत पार्किंग स्थल व ट्रैफिक परामर्श जानें।
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handlePlan} className="p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-amber-500/30 shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-4 mb-8">
          <div className="sm:col-span-5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              स्थान जहाँ से चलना है (Starting Point):
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="उदा. बोरिंग रोड, पटना / कंकड़बाग..."
                value={startPoint}
                onChange={e => setStartPoint(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="sm:col-span-5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              गंतव्य घाट (Destination Ghat):
            </label>
            <select
              value={targetGhat}
              onChange={e => setTargetGhat(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="गांधी घाट (Gandhi Ghat, Patna)">गांधी घाट (Gandhi Ghat, Patna)</option>
              <option value="दीघा पाटीपुल घाट (Digha Ghat, Patna)">दीघा पाटीपुल घाट (Digha Ghat, Patna)</option>
              <option value="दशाश्वमेध घाट (Dashashwamedh Ghat, Varanasi)">दशाश्वमेध घाट (Dashashwamedh Ghat, Varanasi)</option>
              <option value="अस्सी घाट (Assi Ghat, Varanasi)">अस्सी घाट (Assi Ghat, Varanasi)</option>
              <option value="बड़ा तालाब घाट (Ranchi Lake Ghat)">बड़ा तालाब घाट (Ranchi Lake Ghat)</option>
              <option value="आईटीओ यमुना घाट (ITO Yamuna Ghat, Delhi)">आईटीओ यमुना घाट (ITO Yamuna Ghat, Delhi)</option>
              <option value="जुहू बीच छठ वेदी (Juhu Beach, Mumbai)">जुहू बीच छठ वेदी (Juhu Beach, Mumbai)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-rozha text-sm font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-4 h-4" />
              <span>रूट देखें</span>
            </button>
          </div>
        </form>

        {/* Route Details Card */}
        {planResult && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/40 shadow-2xl space-y-6 animate-fadeIn paramprik-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-500/20 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400">
                  यात्रा विवरण (Travel Summary)
                </span>
                <h3 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {planResult.origin} → {planResult.destination}
                </h3>
              </div>

              <a
                href={planResult.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>गूगल मैप्स नेविगेशन खोलें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Metrics Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <Car className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <span className="text-xs text-stone-500 block">कुल दूरी</span>
                <span className="font-bold text-lg text-stone-800 dark:text-stone-100">{planResult.distanceKm}</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <span className="text-xs text-stone-500 block">अनुमानित यात्रा समय</span>
                <span className="font-bold text-lg text-stone-800 dark:text-stone-100">{planResult.durationMins}</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <MapPin className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <span className="text-xs text-stone-500 block">पार्किंग से पैदल दूरी</span>
                <span className="font-bold text-lg text-stone-800 dark:text-stone-100">{planResult.walkingMinsToGhat}</span>
              </div>
            </div>

            {/* Parking & Traffic Advisory */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-800 dark:text-stone-200 font-mukta flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-800 dark:text-amber-300">अधिकृत पार्किंग स्थल:</strong> {planResult.parkingZone}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-stone-800 dark:text-stone-200 font-mukta flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-700 dark:text-red-400">ट्रैफिक व सुरक्षा परामर्श:</strong> {planResult.trafficNote}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
