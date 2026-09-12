import React from 'react';
import { thekuaRecipeDetails, chhathPrasadItems } from '../../data/prasad';
import { X, ChefHat, Clock, Users, Flame, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface ThekuaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThekuaModal: React.FC<ThekuaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const thekuaItem = chhathPrasadItems[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-500/30 font-mukta">
        
        {/* Header Hero Banner */}
        <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-3xl">
          <img
            src="/images/thekua_prasad.jpg"
            alt="Thekua Prasad"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-600/90 text-xs font-bold">
              <ChefHat className="w-3.5 h-3.5" />
              <span>परम पावन महाप्रसाद</span>
            </div>
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">
              {thekuaRecipeDetails.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-stone-300 font-medium">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> तैयारी: {thekuaRecipeDetails.preparationTime}</span>
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> पकाने का समय: {thekuaRecipeDetails.cookingTime}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> मात्रा: {thekuaRecipeDetails.servings}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Ingredients list */}
          <div>
            <h3 className="font-mukta font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-3 border-b border-amber-500/20 pb-1.5">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span>आवश्यक सामग्री (Ingredients)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-stone-700 dark:text-stone-300">
              {thekuaItem.ingredients.map((ing, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step by Step Method */}
          <div>
            <h3 className="font-mukta font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-3 border-b border-amber-500/20 pb-1.5">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>चरणबद्ध निर्माण विधि (Step-by-Step Preparation)</span>
            </h3>
            <div className="space-y-3">
              {thekuaItem.method.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-start gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sancha molding techniques */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30">
            <h4 className="font-bold text-sm text-orange-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
              <span>काठ का सांचा (Wooden Sancha Technique):</span>
            </h4>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              पारंपरिक रूप से शीशम अथवा सागौन की लकड़ी से बने सांचे पर सूर्य की किरणें अथवा पीपल के पत्ते का नक्काशीदार चित्र होता है। लोई को सांचे के बीच रखकर हथेली के दबाव से दबाएं ताकि सुंदर धार्मिक छाप बने।
            </p>
          </div>

          {/* Pro Tips */}
          <div>
            <h3 className="font-mukta font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>खस्ता व स्वादिष्ट ठेकुआ बनाने के विशेष टिप्स (Pro Tips)</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
              {thekuaRecipeDetails.proTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25">
            <h4 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>सामान्य गलतियों से बचें (Common Mistakes to Avoid)</span>
            </h4>
            <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
              {thekuaRecipeDetails.commonMistakes.map((mis, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>{mis}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Close Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary text-sm px-6 py-2.5"
            >
              विधि समझ ली (Done)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
