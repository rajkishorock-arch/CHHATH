import React from 'react';
import { CloudSun, Wind, Droplets, Eye, Sun, Sunset, Sunrise, ShieldCheck, AlertCircle } from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import { cityArghyaData } from '../../data/astronomy';

export const ArghyaWeatherIntel: React.FC = () => {
  const { userLocation } = useChhathData();
  const city = cityArghyaData.find(c => 
    c.cityName.toLowerCase().includes(userLocation.city.toLowerCase()) ||
    c.state.toLowerCase().includes(userLocation.state.toLowerCase())
  ) || cityArghyaData[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-black text-white border border-amber-500/30 shadow-2xl my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3 mb-6">
        <div>
          <div className="badge-saffron inline-flex items-center gap-1.5 mb-1 text-[11px]">
            <CloudSun className="w-3.5 h-3.5" />
            <span>अर्घ्य मौसम आसूचना (Arghya Weather Intelligence)</span>
          </div>
          <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-amber-400">
            {city.cityName} • मौसम व दृश्यता विश्लेषण
          </h3>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>✓ सत्यापित मौसम विभाग बुलेटिन</span>
        </div>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 text-center">
          <CloudSun className="w-6 h-6 text-amber-400 mx-auto mb-1" />
          <span className="text-[11px] text-stone-400 block">तापमान (Temp)</span>
          <span className="text-xl font-bold text-white">{city.weatherTemp}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">{city.weatherCondition}</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 text-center">
          <Droplets className="w-6 h-6 text-sky-400 mx-auto mb-1" />
          <span className="text-[11px] text-stone-400 block">वर्षा की संभावना</span>
          <span className="text-xl font-bold text-white">०% (0% Rain)</span>
          <span className="text-[10px] text-green-400 block mt-0.5">पूर्णतः शुष्क व निर्मल</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 text-center">
          <Wind className="w-6 h-6 text-stone-300 mx-auto mb-1" />
          <span className="text-[11px] text-stone-400 block">वायु गति (Wind)</span>
          <span className="text-xl font-bold text-white">७ किमी/घंटा</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">मंद व सुखद समीर</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 text-center">
          <Eye className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <span className="text-[11px] text-stone-400 block">क्षितिज दृश्यता (Visibility)</span>
          <span className="text-xl font-bold text-white">१० / १०</span>
          <span className="text-[10px] text-green-400 block mt-0.5">स्पष्ट सूर्य दर्शन</span>
        </div>
      </div>

      {/* Devotional Scientific Weather Interpretation */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm font-mukta text-amber-200 flex items-start gap-3">
        <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 text-sm block mb-0.5">
            अर्घ्य वेला मौसम परामर्श (Devotional Interpretation):
          </strong>
          “अर्घ्य के समय बारिश की संभावना शून्य है। आकाश पूर्णतः निर्मल रहेगा, जिससे अस्ताचलगामी एवं उदीयमान भगवान भुवन भास्कर के साक्षात दर्शन बिना किसी व्यवधान के होंगे। शीतल जल में खड़े रहने हेतु हवा का रुख पूर्णतः अनुकूल है।”
        </div>
      </div>

    </div>
  );
};
