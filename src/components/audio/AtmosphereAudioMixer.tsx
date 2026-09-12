import React, { useState } from 'react';
import { Volume2, VolumeX, Sliders, Waves, Bell, Wind, Flame, Sparkles, X } from 'lucide-react';
import { devotionalAudio } from '../../utils/audioEngine';

interface AtmosphereAudioMixerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackState {
  id: string;
  name: string;
  hindiName: string;
  icon: typeof Waves;
  volume: number;
  active: boolean;
}

export const AtmosphereAudioMixer: React.FC<AtmosphereAudioMixerProps> = ({ isOpen, onClose }) => {
  const [tracks, setTracks] = useState<TrackState[]>([
    { id: 'river', name: 'Ganga Holy Waves', hindiName: 'गंगाजी की पावन लहरें', icon: Waves, volume: 40, active: false },
    { id: 'bell', name: 'Sacred Temple Bell', hindiName: 'मंदिर का पावन घंटा', icon: Bell, volume: 60, active: false },
    { id: 'birds', name: 'Dawn Ambience & Birds', hindiName: 'उषा काल व शंख ध्वनि', icon: Wind, volume: 50, active: false },
    { id: 'diya', name: 'Diya Flame Crackle', hindiName: 'अखंड दीप शिखा', icon: Flame, volume: 35, active: false }
  ]);

  const [masterPlaying, setMasterPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleTrack = (id: string) => {
    setTracks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextActive = !t.active;
          if (t.id === 'river') {
            if (nextActive) devotionalAudio.startRiverWaves(t.volume / 100);
            else devotionalAudio.stopRiverWaves();
          } else if (t.id === 'bell') {
            if (nextActive) devotionalAudio.ringTempleBell(587.33);
          } else if (t.id === 'birds') {
            if (nextActive) devotionalAudio.blowShankh();
          }
          return { ...t, active: nextActive };
        }
        return t;
      })
    );
  };

  const updateVolume = (id: string, newVol: number) => {
    setTracks(prev =>
      prev.map(t => {
        if (t.id === id) {
          if (t.id === 'river' && t.active) {
            devotionalAudio.setVolume(newVol / 100);
          }
          return { ...t, volume: newVol };
        }
        return t;
      })
    );
  };

  const handleMasterToggle = () => {
    if (masterPlaying) {
      // Stop all
      devotionalAudio.stopRiverWaves();
      setTracks(prev => prev.map(t => ({ ...t, active: false })));
      setMasterPlaying(false);
    } else {
      // Start river + ring bell
      devotionalAudio.startRiverWaves(0.4);
      devotionalAudio.ringTempleBell(587.33);
      setTracks(prev =>
        prev.map(t => (t.id === 'river' || t.id === 'bell' ? { ...t, active: true } : t))
      );
      setMasterPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/40 paramprik-border text-stone-900 dark:text-stone-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-500/20">
          <div>
            <div className="badge-saffron inline-flex items-center gap-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>पवित्र ध्वनि वातावरण (Sacred Ambience)</span>
            </div>
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold">
              छठ वातावरण (Chhath Atmosphere)
            </h2>
            <p className="text-xs font-mukta text-stone-500 dark:text-stone-400 mt-1">
              गंगाजी की पावन लहरें, मंदिर घंटा और प्रभात शंखनाद का दिव्य मिश्रण स्वयं तैयार करें।
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Control */}
        <div className="my-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold block">मास्टर वातावरण ध्वनि</span>
              <span className="text-xs text-stone-500 font-mukta">
                {masterPlaying ? 'ध्वनि सक्रिय है • पूर्ण ध्यान मुद्रा' : 'ध्वनि बंद है • शुरू करने हेतु क्लिक करें'}
              </span>
            </div>
          </div>
          <button
            onClick={handleMasterToggle}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              masterPlaying
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg hover:scale-105'
            }`}
          >
            {masterPlaying ? 'सब बंद करें (Mute)' : 'आरंभ करें (Play)'}
          </button>
        </div>

        {/* Track Sliders */}
        <div className="space-y-4">
          {tracks.map(track => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  track.active
                    ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleTrack(track.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        track.active
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-xs font-bold block leading-tight">{track.hindiName}</span>
                      <span className="text-[10px] text-stone-500 font-mukta">{track.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {track.volume}%
                    </span>
                    <button
                      onClick={() => toggleTrack(track.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        track.active
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {track.active ? 'सक्रिय' : 'बंद'}
                    </button>
                  </div>
                </div>

                {/* Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={track.volume}
                  onChange={e => updateVolume(track.id, parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-5 text-center text-[11px] font-mukta text-stone-500 dark:text-stone-400">
          नोट: सभी ध्वनियां वेब ऑडियो एपीआई द्वारा शुद्ध रूप से वास्तविक समय में सिंथेसाइज होती हैं। कोई बाहरी डेटा खर्च नहीं होता।
        </div>

      </div>
    </div>
  );
};
