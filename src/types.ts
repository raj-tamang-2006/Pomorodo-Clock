export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export type SoundPreset = 'zen' | 'digital' | 'marimba' | 'softPulse';

export type AmbientSoundType = 'none' | 'pinkNoise' | 'brownNoise' | 'focusDrone';

export interface TimerSettings {
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  volume: number; // 0 to 1
  soundPreset: SoundPreset;
  ambientSound: AmbientSoundType;
  ambientVolume: number; // 0 to 1
}

export interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: number;
}

export interface SessionRecord {
  id: string;
  mode: TimerMode;
  durationSeconds: number;
  completedAt: number;
  taskTitle?: string;
}
