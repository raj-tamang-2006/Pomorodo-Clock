import React from 'react';
import { TimerMode } from '../types';
import { Flame, Coffee, Palmtree } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  isRunning: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  isRunning,
}) => {
  const modes: { id: TimerMode; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'pomodoro',
      label: 'Focus',
      icon: <Flame size={16} className="text-amber-400" />,
      color: 'from-amber-500/20 to-rose-500/20 border-amber-500/40 text-amber-300',
    },
    {
      id: 'shortBreak',
      label: 'Short Break',
      icon: <Coffee size={16} className="text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'longBreak',
      label: 'Long Break',
      icon: <Palmtree size={16} className="text-sky-400" />,
      color: 'from-sky-500/20 to-indigo-500/20 border-sky-500/40 text-sky-300',
    },
  ];

  return (
    <div className="flex items-center justify-center p-1.5 bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-full max-w-md mx-auto mb-8 shadow-2xl">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            id={`mode-btn-${mode.id}`}
            onClick={() => {
              if (isRunning && currentMode !== mode.id) {
                if (window.confirm('Timer is active. Switching mode will reset the current timer. Continue?')) {
                  onSelectMode(mode.id);
                }
              } else {
                onSelectMode(mode.id);
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all duration-250 ${
              isActive
                ? 'bg-[#00FFAB]/10 border border-[#00FFAB]/40 text-[#00FFAB] shadow-[0_0_20px_rgba(0,255,171,0.2)]'
                : 'text-slate-400/60 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
