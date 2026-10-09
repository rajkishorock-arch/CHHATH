import React, { useState, useEffect } from 'react';
import { X, Bell, BellRing, Check, Volume2, Clock, Sparkles } from 'lucide-react';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface DailyPujaAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AlarmSettings {
  morningEnabled: boolean;
  morningTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

const STORAGE_KEY = 'daily_puja_alarm_settings';

export const DailyPujaAlarmModal: React.FC<DailyPujaAlarmModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AlarmSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      morningEnabled: true,
      morningTime: '05:30',
      eveningEnabled: true,
      eveningTime: '18:30',
      soundEnabled: true,
      notificationsEnabled: false
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSuccess(true);
      spiritualAudio.playTempleBell();
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 900);
    } catch {
      onClose();
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('आपके ब्राउज़र में नोटिफिकेशन सपोर्ट उपलब्ध नहीं है।');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
        new Notification('सनातन दैनिक पूजा अलार्म', {
          body: 'दैनिक पूजा अलार्म सफलतापूर्वक सक्रिय हो गया है!',
          icon: '/icons/icon-192x192.png'
        });
      }
    } catch {
      // ignore
    }
  };

  const handleTestChime = () => {
    spiritualAudio.playTempleBell();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <BellRing className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">दैनिक पूजा अलार्म</h2>
              <p className="text-xs text-amber-100">प्रातः एवं सायं नित्य पूजन स्मरण सेवा</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Morning Puja Alarm */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🌅</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">प्रातः ब्रह्म मुहूर्त / पूजन</h3>
                  <p className="text-xs text-gray-500">सुबह की मंगल आरती व ध्यान</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.morningEnabled}
                  onChange={e => setSettings(s => ({ ...s, morningEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {settings.morningEnabled && (
              <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
                <span className="text-xs font-medium text-gray-600 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> समय चुनें:
                </span>
                <input
                  type="time"
                  value={settings.morningTime}
                  onChange={e => setSettings(s => ({ ...s, morningTime: e.target.value }))}
                  className="px-3 py-1.5 text-sm font-semibold text-amber-900 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Evening Sandhya Alarm */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/40 border border-amber-200/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🪔</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">सायं संध्या व महाआरती</h3>
                  <p className="text-xs text-gray-500">दीपक प्रज्वलन एवं संध्या वंदन</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.eveningEnabled}
                  onChange={e => setSettings(s => ({ ...s, eveningEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {settings.eveningEnabled && (
              <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
                <span className="text-xs font-medium text-gray-600 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> समय चुनें:
                </span>
                <input
                  type="time"
                  value={settings.eveningTime}
                  onChange={e => setSettings(s => ({ ...s, eveningTime: e.target.value }))}
                  className="px-3 py-1.5 text-sm font-semibold text-amber-900 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Sound & Notification Options */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-gray-800">मंदिर की पावन घंटी ध्वनि</span>
              </div>
              <button
                type="button"
                onClick={handleTestChime}
                className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 font-medium transition-colors"
              >
                सुनकर देखें 🔔
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-gray-800">मोबाइल / ब्राउज़र नोटिफिकेशन</span>
              </div>
              {settings.notificationsEnabled ? (
                <span className="text-xs font-bold text-green-600 flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" /> सक्रिय
                </span>
              ) : (
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  अनुमति दें
                </button>
              )}
            </div>
          </div>

          {/* Spiritual Note */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>शास्त्र प्रमाण:</strong> प्रतिदिन नियमित समय पर दीप प्रज्वलन एवं संध्या वंदन करने से घर में सकारात्मक ऊर्जा एवं मां लक्ष्मी का वास होता है।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            रद्द करें
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>सुरक्षित हो गया!</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>अलार्म सुरक्षित करें</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
