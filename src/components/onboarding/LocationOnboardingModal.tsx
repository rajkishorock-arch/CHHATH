import React, { useState } from 'react';
import { MapPin, Sparkles, Check, Globe, X } from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import { cityArghyaData } from '../../data/astronomy';

interface LocationOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGION_OPTIONS = [
  { id: 'Bihar', label: 'बिहार (Bihar)', defaultCity: 'Patna' },
  { id: 'Jharkhand', label: 'झारखंड (Jharkhand)', defaultCity: 'Ranchi' },
  { id: 'Uttar Pradesh', label: 'उत्तर प्रदेश (UP)', defaultCity: 'Varanasi' },
  { id: 'Delhi', label: 'दिल्ली-एनसीआर (Delhi)', defaultCity: 'Delhi NCR' },
  { id: 'Maharashtra', label: 'महाराष्ट्र (Mumbai)', defaultCity: 'Mumbai' },
  { id: 'West Bengal', label: 'पश्चिम बंगाल (Kolkata)', defaultCity: 'Kolkata' },
  { id: 'Other India', label: 'अन्य भारत (Other India)', defaultCity: 'Bengaluru' },
  { id: 'Outside India', label: 'विदेश / अनिवासी (Outside India)', defaultCity: 'Global Diaspora' }
];

const CITIES_BY_STATE: Record<string, string[]> = {
  Bihar: ['Patna', 'Muzaffarpur', 'Bhagalpur', 'Gaya', 'Darbhanga', 'Munger', 'Purnia', 'Chhapra', 'Arrah'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
  'Uttar Pradesh': ['Varanasi', 'Prayagraj', 'Gorakhpur', 'Lucknow', 'Kanpur', 'Ayodhya', 'Noida'],
  Delhi: ['Delhi NCR', 'Yamuna Ghat', 'Kalindi Kunj', 'Vasundhara'],
  Maharashtra: ['Mumbai', 'Juhu Beach', 'Thane', 'Pune', 'Navi Mumbai'],
  'West Bengal': ['Kolkata', 'Howrah Ghat', 'Asansol', 'Siliguri'],
  'Other India': ['Bengaluru', 'Hyderabad', 'Ahmedabad', 'Surat', 'Jaipur', 'Chandigarh'],
  'Outside India': ['New York (USA)', 'New Jersey (USA)', 'London (UK)', 'Dubai (UAE)', 'Toronto (Canada)', 'Sydney (Australia)', 'Mauritius', 'Kathmandu (Nepal)']
};

export const LocationOnboardingModal: React.FC<LocationOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userLocation, setUserLocation } = useChhathData();
  const [selectedState, setSelectedState] = useState<string>(userLocation.state || 'Bihar');
  const [selectedCity, setSelectedCity] = useState<string>(userLocation.city || 'Patna');
  const [customCityInput, setCustomCityInput] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    const finalCity = customCityInput.trim() || selectedCity;
    setUserLocation({
      state: selectedState,
      city: finalCity,
      isCustom: Boolean(customCityInput.trim())
    });
    localStorage.setItem('chhath_onboarding_done', 'true');
    onClose();
  };

  // Find match in astronomy data
  const matchedCityData = cityArghyaData.find(c => 
    c.cityName.toLowerCase().includes(selectedCity.toLowerCase()) || 
    c.state.toLowerCase().includes(selectedState.toLowerCase())
  ) || cityArghyaData[0];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/40 paramprik-border text-stone-900 dark:text-stone-100 overflow-hidden">
        
        {/* Background Decorative Solar Arc */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/0 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-500/20">
          <div>
            <div className="badge-saffron inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सांस्कृतिक वैयक्तिकरण (Personalization)</span>
            </div>
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              आप इस बार छठ कहाँ मना रहे हैं?
            </h2>
            <p className="text-xs sm:text-sm font-mukta text-stone-600 dark:text-stone-300 mt-1">
              अपने राज्य व शहर का चयन करें, ताकि आपको सटीक अर्घ्य समय, मौसम व नजदीकी घाट की जानकारी मिल सके।
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Selection Grid */}
        <div className="mt-5 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            १. अपना राज्य / क्षेत्र चुनें (Select Region):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {REGION_OPTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedState(item.id);
                  const defaultCity = CITIES_BY_STATE[item.id]?.[0] || item.defaultCity;
                  setSelectedCity(defaultCity);
                  setCustomCityInput('');
                }}
                className={`p-2.5 rounded-xl text-xs font-mukta font-bold text-center border transition-all ${
                  selectedState === item.id
                    ? 'bg-orange-600 text-white border-orange-500 shadow-md scale-[1.02]'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* City Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
              २. अपना प्रमुख शहर चुनें (Select City):
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 scrollbar-thin">
              {(CITIES_BY_STATE[selectedState] || []).map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setCustomCityInput('');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-mukta font-semibold border transition-all flex items-center gap-1 ${
                    selectedCity === city && !customCityInput
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-sm'
                      : 'bg-white dark:bg-stone-800 border-amber-500/20 text-stone-700 dark:text-stone-300 hover:bg-amber-500/10'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{city}</span>
                  {selectedCity === city && !customCityInput && <Check className="w-3 h-3 text-stone-950" />}
                </button>
              ))}
            </div>

            {/* Custom City Write-in */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="या अपना शहर यहाँ लिखें (Or type your city here)..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Live Preview of Personalization */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {customCityInput || selectedCity}, {selectedState}
                </span>
                <span className="block text-[11px] text-stone-500 dark:text-stone-400">
                  संध्या अर्घ्य: {matchedCityData.sandhyaSunset} • उषा अर्घ्य: {matchedCityData.ushaSunrise} • {matchedCityData.weatherTemp}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider shrink-0">
              ✓ लाइव सिंक
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-amber-500/20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
          >
            बाद में (Later)
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>छठ अनुभव प्रारंभ करें</span>
            <Check className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
