import React from 'react';
import { Sun, Search, Music, MapPin, Calendar, ArrowLeft } from 'lucide-react';

export const NotFound404: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      {/* Sunrise Graphic */}
      <div className="relative flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 blur-2xl opacity-60" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl border-2 border-yellow-200">
          <Sun className="w-12 h-12 text-amber-950 animate-spin" style={{ animationDuration: '30s' }} />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-amber-400 font-mono">
          त्रुटि ४०४ (Page Not Found)
        </span>
        <h2 className="font-rozha text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
          घाट तो मिल जाएगा… लेकिन यह पन्ना नहीं मिला 😄
        </h2>
        <p className="font-mukta text-sm text-stone-600 dark:text-stone-300">
          हो सकता है यह मार्ग गंगा जी की लहरों में कहीं विलीन हो गया हो। आइए वापस मुख्य छठ धाम की ओर चलते हैं।
        </p>
      </div>

      <button
        onClick={onGoHome}
        className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>मुख्य छठ पोर्टल पर लौटें</span>
      </button>
    </div>
  );
};

export const EmptySearchState: React.FC<{ query?: string }> = ({ query }) => {
  return (
    <div className="p-8 text-center space-y-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-dashed border-amber-500/30 max-w-md mx-auto my-6">
      <Search className="w-10 h-10 text-amber-500/60 mx-auto" />
      <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
        कोई परिणाम नहीं मिला
      </h4>
      <p className="font-mukta text-xs text-stone-500">
        {query ? `"${query}" के लिए कोई सामग्री या गीत नहीं मिला।` : 'कृपया अन्य शब्द या गायक का नाम खोजें।'}
      </p>
    </div>
  );
};

export const EmptyGhatsState: React.FC = () => {
  return (
    <div className="p-8 text-center space-y-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-dashed border-amber-500/30 max-w-md mx-auto my-6">
      <MapPin className="w-10 h-10 text-amber-500/60 mx-auto" />
      <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
        इस क्षेत्र में कोई घाट दर्ज नहीं है
      </h4>
      <p className="font-mukta text-xs text-stone-500">
        कृपया किसी अन्य जिले या राज्य का चयन करें अथवा अपना स्थानीय घाट सुझाव में भेजें।
      </p>
    </div>
  );
};
