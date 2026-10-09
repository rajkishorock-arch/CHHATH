import React, { useState } from 'react';
import { ArrowLeft, Landmark, MapPin, Clock, Calendar, Sparkles, X } from 'lucide-react';
import { FAMOUS_TEMPLES_DATA, TempleItem } from '../../data/famousTemplesData';

interface FamousTemplesListViewProps {
  onBack?: () => void;
}

export const FamousTemplesListView: React.FC<FamousTemplesListViewProps> = ({ onBack }) => {
  const [selectedTemple, setSelectedTemple] = useState<TempleItem | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 flex items-center">
                <Landmark className="w-6 h-6 mr-2 text-amber-600" />
                प्रसिद्ध सनातन मंदिर व तीर्थ धाम
              </h1>
              <p className="text-xs text-gray-500">देव सूर्य मंदिर, काशी, अयोध्या, वैष्णो देवी एवं ज्योतिर्लिंग</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FAMOUS_TEMPLES_DATA.map(temple => (
            <div
              key={temple.id}
              onClick={() => setSelectedTemple(temple)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/90 font-medium">
                      {temple.state}
                    </span>
                    <h3 className="text-base font-bold font-serif mt-1">
                      {temple.hindiName}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-amber-700 font-medium flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    ईष्ट देव: {temple.deity}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {temple.location}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {temple.significance}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">आरती व दर्शन समय</span>
                  <span className="text-amber-600 font-bold">
                    विवरण देखें →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temple Detail Modal */}
      {selectedTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-56 bg-amber-600 overflow-hidden shrink-0">
              <img
                src={selectedTemple.image}
                alt={selectedTemple.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
              <button
                onClick={() => setSelectedTemple(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 font-semibold">
                  {selectedTemple.state}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                  {selectedTemple.hindiName}
                </h2>
                <p className="text-xs text-amber-200 mt-0.5">
                  ईष्ट देव: {selectedTemple.deity} • {selectedTemple.location}
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-gray-800 text-sm">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  तीर्थ का महत्व व महात्म्य
                </h4>
                <p className="leading-relaxed font-serif text-gray-800">
                  {selectedTemple.significance}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                  <Landmark className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  ऐतिहासिक व पौराणिक पृष्ठभूमि
                </h4>
                <p className="leading-relaxed text-gray-700">
                  {selectedTemple.history}
                </p>
              </div>

              <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200">
                <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wider mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-orange-600" />
                  नित्य आरती व दर्शन समय
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-orange-950">
                  {selectedTemple.aartiTimings}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  प्रमुख उत्सव व महापर्व
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemple.majorFestivals.map((fest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 rounded-xl text-xs font-medium text-gray-700"
                    >
                      {fest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
