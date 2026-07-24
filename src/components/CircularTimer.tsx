import React from 'react';
import { TimerMode } from '../types';
import { Plus, Minus } from 'lucide-react';

interface CircularTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  mode: TimerMode;
  isRunning: boolean;
  onAdjustTime: (amountSeconds: number) => void;
  activeTaskTitle?: string;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  secondsLeft,
  totalSeconds,
  mode,
  isRunning,
  onAdjustTime,
  activeTaskTitle,
}) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressRatio = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const radius = 135;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Mode specific color themes (Immersive UI)
  const modeColors = {
    pomodoro: {
      strokeGradient: ['#00FFAB', '#4287f5'], // neon mint to electric blue
      glow: 'shadow-[0_0_60px_rgba(0,255,171,0.2)]',
      textColor: 'text-[#00FFAB]',
      glowClass: 'timer-glow-emerald',
      tagBg: 'bg-[#00FFAB]/10 text-[#00FFAB] border-[#00FFAB]/30',
      label: 'Focus Session',
    },
    shortBreak: {
      strokeGradient: ['#38bdf8', '#818cf8'], // sky to indigo
      glow: 'shadow-[0_0_60px_rgba(56,189,248,0.2)]',
      textColor: 'text-sky-400',
      glowClass: 'timer-glow-sky',
      tagBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      label: 'Short Break',
    },
    longBreak: {
      strokeGradient: ['#c084fc', '#f43f5e'], // purple to rose
      glow: 'shadow-[0_0_60px_rgba(192,132,252,0.2)]',
      textColor: 'text-purple-300',
      glowClass: 'timer-glow-amber',
      tagBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      label: 'Long Break',
    },
  }[mode];

  return (
    <div className="relative flex flex-col items-center justify-center my-6">
      {/* Outer concentric decorative glass rings from Immersive UI design */}
      <div className="absolute w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] border border-white/[0.04] rounded-full pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] sm:w-[410px] sm:h-[410px] border border-white/[0.02] rounded-full pointer-events-none" />

      {/* Main Container with glass panel styling and glowing shadow */}
      <div className={`relative w-[310px] h-[310px] sm:w-[370px] sm:h-[370px] rounded-full flex items-center justify-center bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl transition-all duration-500 ${modeColors.glow}`}>
        
        {/* Animated outer ring pulse when running */}
        {isRunning && (
          <div className="absolute inset-0 rounded-full border border-[#00FFAB]/25 animate-ping pointer-events-none opacity-30" style={{ animationDuration: '3s' }} />
        )}

        {/* SVG Progress Circle */}
        <svg className="w-full h-full transform -rotate-90 p-4">
          <defs>
            <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={modeColors.strokeGradient[0]} />
              <stop offset="100%" stopColor={modeColors.strokeGradient[1]} />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/[0.05] fill-none"
          />

          {/* Animated Progress Ring */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={`url(#gradient-${mode})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-none transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Clock Contents */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Mode Tag */}
          <span className={`text-[10px] font-mono tracking-[0.2em] uppercase px-3.5 py-1 rounded-full border mb-2 backdrop-blur-md ${modeColors.tagBg}`}>
            {isRunning ? '• RUNNING' : 'PAUSED'} — {modeColors.label}
          </span>

          {/* Digits Display */}
          <div className="flex items-center justify-center gap-1 my-1">
            <span id="timer-digits-display" className={`font-mono text-6xl sm:text-7xl font-light tracking-tighter text-slate-100 ${modeColors.glowClass}`}>
              {formattedTime}
            </span>
          </div>

          {/* Active Task Focus Indicator */}
          {activeTaskTitle ? (
            <div className="mt-2 max-w-[220px] truncate text-xs text-slate-300 font-mono bg-white/[0.04] px-3.5 py-1 rounded-full border border-white/[0.08]">
              <span className="text-[#00FFAB] font-semibold mr-1">Focusing:</span>
              <span>{activeTaskTitle}</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-2">Ready to focus</span>
          )}

          {/* Quick Adjust Buttons */}
          <div className="flex items-center gap-3 mt-4 opacity-60 hover:opacity-100 transition-opacity">
            <button
              id="adjust-time-minus"
              onClick={() => onAdjustTime(-60)}
              title="Subtract 1 minute"
              className="p-1.5 px-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all text-xs font-mono flex items-center gap-1"
            >
              <Minus size={13} />
              <span>1m</span>
            </button>
            <button
              id="adjust-time-plus"
              onClick={() => onAdjustTime(60)}
              title="Add 1 minute"
              className="p-1.5 px-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all text-xs font-mono flex items-center gap-1"
            >
              <Plus size={13} />
              <span>1m</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
