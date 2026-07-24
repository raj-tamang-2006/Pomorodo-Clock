import React from 'react';
import { TimerSettings, SoundPreset, AmbientSoundType } from '../types';
import { X, Volume2, Play, Bell, Clock, Sliders, Music, Sparkles } from 'lucide-react';
import { playStartSound, playPauseSound, playCompletionSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSaveSettings: (settings: TimerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = React.useState<TimerSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleChange = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const testStartAlert = () => {
    playStartSound(localSettings.volume, localSettings.soundPreset);
  };

  const testPauseAlert = () => {
    playPauseSound(localSettings.volume, localSettings.soundPreset);
  };

  const testCompletionAlert = () => {
    playCompletionSound(localSettings.volume, localSettings.soundPreset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c0c14] border border-white/[0.1] rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[#00FFAB]" />
            <h2 className="text-xs font-mono tracking-widest uppercase text-slate-100">Timer & Sound Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: Timer Durations */}
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-[#00FFAB] mb-3">
              <Clock size={14} />
              <span>Timer Durations (Minutes)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Focus Mode</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.pomodoroMinutes}
                  onChange={(e) => handleChange('pomodoroMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-slate-100 font-mono text-center focus:border-[#00FFAB] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.shortBreakMinutes}
                  onChange={(e) => handleChange('shortBreakMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-slate-100 font-mono text-center focus:border-[#4287f5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakMinutes}
                  onChange={(e) => handleChange('longBreakMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-slate-100 font-mono text-center focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sound Effects & Alerts */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#00FFAB]">
                <Bell size={14} />
                <span>Audio Alert Sound Effects</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00FFAB]"></div>
              </label>
            </div>

            {localSettings.soundEnabled && (
              <>
                {/* Sound Preset Theme */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Alert Sound Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'zen', name: 'Zen Bell' },
                      { id: 'digital', name: 'Digital Synth' },
                      { id: 'marimba', name: 'Warm Marimba' },
                      { id: 'softPulse', name: 'Soft Pulse' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleChange('soundPreset', preset.id as SoundPreset)}
                        className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all ${
                          localSettings.soundPreset === preset.id
                            ? 'bg-[#00FFAB]/15 border-[#00FFAB]/40 text-[#00FFAB]'
                            : 'bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span className="flex items-center gap-1"><Volume2 size={13} /> Master Alert Volume</span>
                    <span>{Math.round(localSettings.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={localSettings.volume}
                    onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                    className="w-full accent-[#00FFAB] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Audio Effect Test Buttons */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="block text-[11px] font-mono text-slate-400 mb-2">Test Sound Effects:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      id="test-start-sound-btn"
                      onClick={testStartAlert}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-black/40 hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-mono text-slate-200 transition-all"
                    >
                      <Play size={12} className="text-[#00FFAB] fill-[#00FFAB]/20" />
                      <span>Start Alert</span>
                    </button>
                    <button
                      type="button"
                      id="test-pause-sound-btn"
                      onClick={testPauseAlert}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-black/40 hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-mono text-slate-200 transition-all"
                    >
                      <Play size={12} className="text-[#4287f5] fill-[#4287f5]/20" />
                      <span>Pause Alert</span>
                    </button>
                    <button
                      type="button"
                      id="test-completion-sound-btn"
                      onClick={testCompletionAlert}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-black/40 hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-mono text-slate-200 transition-all"
                    >
                      <Play size={12} className="text-purple-400 fill-purple-400/20" />
                      <span>Complete Alert</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section 3: Ambient Focus Background Noise */}
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-[#00FFAB] mb-3">
              <Music size={14} />
              <span>Ambient Focus Sound</span>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Off' },
                  { id: 'pinkNoise', label: 'Pink Noise' },
                  { id: 'brownNoise', label: 'Brown Noise' },
                  { id: 'focusDrone', label: 'Focus Drone' },
                ].map((amb) => (
                  <button
                    key={amb.id}
                    type="button"
                    onClick={() => handleChange('ambientSound', amb.id as AmbientSoundType)}
                    className={`py-2 px-2 rounded-xl border text-xs font-mono transition-all ${
                      localSettings.ambientSound === amb.id
                        ? 'bg-[#00FFAB]/15 border-[#00FFAB]/40 text-[#00FFAB]'
                        : 'bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {amb.label}
                  </button>
                ))}
              </div>

              {localSettings.ambientSound !== 'none' && (
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Ambient Volume</span>
                    <span>{Math.round(localSettings.ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={localSettings.ambientVolume}
                    onChange={(e) => handleChange('ambientVolume', parseFloat(e.target.value))}
                    className="w-full accent-[#00FFAB] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Automation Toggles */}
          <div className="space-y-3 border-t border-white/[0.06] pt-4 font-mono text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Auto-start Breaks</span>
              <input
                type="checkbox"
                checked={localSettings.autoStartBreaks}
                onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                className="rounded bg-black border-white/20 text-[#00FFAB] focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Auto-start Pomodoros</span>
              <input
                type="checkbox"
                checked={localSettings.autoStartPomodoros}
                onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                className="rounded bg-black border-white/20 text-[#00FFAB] focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-white/[0.02] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            id="save-settings-btn"
            className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#00FFAB] text-black font-semibold hover:bg-[#00FFAB]/90 rounded-full transition-all shadow-[0_0_20px_rgba(0,255,171,0.3)]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
