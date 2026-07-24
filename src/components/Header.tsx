import React from 'react';
import { Volume2, VolumeX, Settings, BarChart2, Sparkles } from 'lucide-react';
import { TimerSettings } from '../types';

interface HeaderProps {
  settings: TimerSettings;
  onUpdateSettings: (newSettings: TimerSettings) => void;
  onOpenSettings: () => void;
  onToggleStats: () => void;
  showStats: boolean;
  completedTodayCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onToggleStats,
  showStats,
  completedTodayCount,
}) => {
  const toggleSound = () => {
    onUpdateSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.06] mb-8">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#00FFAB] shadow-[0_0_12px_#00FFAB] animate-pulse" />
        <div>
          <h1 className="text-xs font-bold text-slate-100 tracking-[0.25em] uppercase flex items-center gap-2">
            Pomodoro Focus v2.0
            <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#00FFAB]/10 text-[#00FFAB] border border-[#00FFAB]/30">
              AUDIO ALERTS
            </span>
          </h1>
          <p className="text-[11px] text-slate-400/80 font-mono mt-0.5">Immersive sound & time management</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Completed count badge */}
        <div 
          title="Completed sessions today"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFAB]"></span>
          <span>{completedTodayCount} done today</span>
        </div>

        {/* Audio Toggle */}
        <button
          id="audio-toggle-btn"
          onClick={toggleSound}
          title={settings.soundEnabled ? 'Mute Sound Alerts' : 'Enable Sound Alerts'}
          className={`p-2.5 rounded-xl border transition-all duration-200 ${
            settings.soundEnabled
              ? 'bg-[#00FFAB]/10 border-[#00FFAB]/30 text-[#00FFAB] shadow-[0_0_15px_rgba(0,255,171,0.15)]'
              : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
          }`}
        >
          {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Analytics Toggle Button */}
        <button
          id="stats-toggle-btn"
          onClick={onToggleStats}
          title="View Session Stats"
          className={`p-2.5 rounded-xl border transition-all duration-200 ${
            showStats
              ? 'bg-[#4287f5]/20 border-[#4287f5]/40 text-[#4287f5] shadow-[0_0_15px_rgba(66,135,245,0.2)]'
              : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <BarChart2 size={18} />
        </button>

        {/* Settings Button */}
        <button
          id="settings-open-btn"
          onClick={onOpenSettings}
          title="Clock & Sound Settings"
          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all duration-200 flex items-center gap-2 text-xs font-mono tracking-wider uppercase"
        >
          <Settings size={18} />
          <span className="hidden md:inline">Settings</span>
        </button>
      </div>
    </header>
  );
};
