import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TimerMode } from '../types';

interface TimerControlsProps {
  isRunning: boolean;
  onTogglePlayPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  mode: TimerMode;
  soundEnabled: boolean;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onTogglePlayPause,
  onReset,
  onSkip,
  mode,
  soundEnabled,
}) => {
  const modeTheme = {
    pomodoro: 'from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-rose-950/50 text-white',
    shortBreak: 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-teal-950/50 text-white',
    longBreak: 'from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-indigo-950/50 text-white',
  }[mode];

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8 my-8">
      {/* Reset Button */}
      <button
        id="timer-reset-btn"
        onClick={onReset}
        title="Reset Timer"
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 active:scale-95 flex items-center justify-center shadow-lg"
      >
        <RotateCcw size={20} />
      </button>

      {/* Main Play / Pause Button - Immersive White Circular Glow Button */}
      <button
        id="timer-play-pause-btn"
        onClick={onTogglePlayPause}
        title={isRunning ? 'Pause Timer' : 'Start Timer'}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 text-stone-950 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {isRunning ? (
          <Pause size={30} className="fill-current" />
        ) : (
          <Play size={30} className="fill-current ml-1" />
        )}
      </button>

      {/* Skip Button */}
      <button
        id="timer-skip-btn"
        onClick={onSkip}
        title="Skip to next session"
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 active:scale-95 flex items-center justify-center shadow-lg"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
};
