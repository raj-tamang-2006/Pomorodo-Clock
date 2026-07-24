import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { CircularTimer } from './components/CircularTimer';
import { TimerControls } from './components/TimerControls';
import { TaskFocus } from './components/TaskFocus';
import { SettingsModal } from './components/SettingsModal';
import { SessionStats } from './components/SessionStats';
import { TimerMode, TimerSettings, FocusTask, SessionRecord } from './types';
import {
  playStartSound,
  playPauseSound,
  playCompletionSound,
  startAmbientSound,
  stopAmbientSound,
  updateAmbientVolume,
} from './utils/audio';

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  volume: 0.8,
  soundPreset: 'zen',
  ambientSound: 'none',
  ambientVolume: 0.3,
};

export default function App() {
  // Load settings from localStorage or defaults
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('pomodoro_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SETTINGS.pomodoroMinutes * 60);
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_SETTINGS.pomodoroMinutes * 60);

  // Stats & Sessions state
  const [completedPomodorosCount, setCompletedPomodorosCount] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>(() => {
    const saved = localStorage.getItem('pomodoro_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Tasks state
  const [tasks, setTasks] = useState<FocusTask[]>(() => {
    const saved = localStorage.getItem('pomodoro_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // UI Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Refs for timer interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current duration in seconds based on mode
  const getModeSeconds = (m: TimerMode, customSettings = settings) => {
    switch (m) {
      case 'pomodoro':
        return customSettings.pomodoroMinutes * 60;
      case 'shortBreak':
        return customSettings.shortBreakMinutes * 60;
      case 'longBreak':
        return customSettings.longBreakMinutes * 60;
    }
  };

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
    updateAmbientVolume(settings.ambientVolume);
  }, [settings]);

  // Save history & count
  useEffect(() => {
    localStorage.setItem('pomodoro_history', JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  useEffect(() => {
    localStorage.setItem('pomodoro_count', completedPomodorosCount.toString());
  }, [completedPomodorosCount]);

  useEffect(() => {
    localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Update browser tab title
  useEffect(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeName = mode === 'pomodoro' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';
    document.title = `${timeStr} - ${modeName} | Pomodoro Clock`;
  }, [secondsLeft, mode]);

  // Handle mode change
  const handleSelectMode = (newMode: TimerMode) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    stopAmbientSound();

    const secs = getModeSeconds(newMode);
    setMode(newMode);
    setSecondsLeft(secs);
    setTotalSeconds(secs);
  };

  // Start or Pause handler with sound triggers
  const handleTogglePlayPause = () => {
    if (isRunning) {
      // PAUSE TRIGGER
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      stopAmbientSound();

      if (settings.soundEnabled) {
        playPauseSound(settings.volume, settings.soundPreset);
      }
    } else {
      // START TRIGGER
      setIsRunning(true);

      if (settings.soundEnabled) {
        playStartSound(settings.volume, settings.soundPreset);
      }

      if (settings.ambientSound !== 'none') {
        startAmbientSound(settings.ambientSound, settings.ambientVolume);
      }
    }
  };

  // Timer Tick Interval Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleTimerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, settings, activeTaskId]);

  // Completion Logic
  const handleTimerCompletion = () => {
    setIsRunning(false);
    stopAmbientSound();

    // COMPLETION SOUND EFFECT ALERT
    if (settings.soundEnabled) {
      playCompletionSound(settings.volume, settings.soundPreset);
    }

    // Record session log
    const activeTask = tasks.find((t) => t.id === activeTaskId);
    const newRecord: SessionRecord = {
      id: Date.now().toString(),
      mode,
      durationSeconds: totalSeconds,
      completedAt: Date.now(),
      taskTitle: activeTask?.title,
    };
    setSessionHistory((prev) => [...prev, newRecord]);

    // Handle session count and mode transition
    if (mode === 'pomodoro') {
      const nextCount = completedPomodorosCount + 1;
      setCompletedPomodorosCount(nextCount);

      // Update task pomodoro count if active
      if (activeTaskId) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === activeTaskId
              ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
              : t
          )
        );
      }

      // Determine next break mode
      const isLongBreakTime = nextCount > 0 && nextCount % settings.longBreakInterval === 0;
      const nextMode: TimerMode = isLongBreakTime ? 'longBreak' : 'shortBreak';
      const nextSecs = getModeSeconds(nextMode);

      setMode(nextMode);
      setSecondsLeft(nextSecs);
      setTotalSeconds(nextSecs);

      if (settings.autoStartBreaks) {
        setTimeout(() => {
          setIsRunning(true);
          if (settings.soundEnabled) playStartSound(settings.volume, settings.soundPreset);
        }, 800);
      }
    } else {
      // Break finished, return to Pomodoro
      setMode('pomodoro');
      const nextSecs = getModeSeconds('pomodoro');
      setSecondsLeft(nextSecs);
      setTotalSeconds(nextSecs);

      if (settings.autoStartPomodoros) {
        setTimeout(() => {
          setIsRunning(true);
          if (settings.soundEnabled) playStartSound(settings.volume, settings.soundPreset);
        }, 800);
      }
    }
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    stopAmbientSound();

    const secs = getModeSeconds(mode);
    setSecondsLeft(secs);
    setTotalSeconds(secs);
  };

  // Skip timer
  const handleSkip = () => {
    if (window.confirm('Skip current session?')) {
      setIsRunning(false);
      stopAmbientSound();

      if (mode === 'pomodoro') {
        const nextMode: TimerMode = 'shortBreak';
        const secs = getModeSeconds(nextMode);
        setMode(nextMode);
        setSecondsLeft(secs);
        setTotalSeconds(secs);
      } else {
        setMode('pomodoro');
        const secs = getModeSeconds('pomodoro');
        setSecondsLeft(secs);
        setTotalSeconds(secs);
      }
    }
  };

  // Adjust time by +/- seconds
  const handleAdjustTime = (amountSeconds: number) => {
    setSecondsLeft((prev) => {
      const next = Math.max(10, prev + amountSeconds);
      setTotalSeconds((t) => Math.max(t, next));
      return next;
    });
  };

  // Task handlers
  const handleAddTask = (title: string, estimatedPomodoros: number) => {
    const newTask: FocusTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      estimatedPomodoros,
      completedPomodoros: 0,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    if (!activeTaskId) setActiveTaskId(newTask.id);
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTaskId === taskId) setActiveTaskId(null);
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="min-h-screen atmosphere-bg text-slate-100 flex flex-col font-sans selection:bg-[#00FFAB]/30 selection:text-[#00FFAB]">
      <Header
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleStats={() => setShowStats(!showStats)}
        showStats={showStats}
        completedTodayCount={completedPomodorosCount}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-16 flex flex-col items-center justify-center">
        {/* Mode Selector Tabs */}
        <ModeSelector
          currentMode={mode}
          onSelectMode={handleSelectMode}
          isRunning={isRunning}
        />

        {/* Circular Progress Clock Display */}
        <CircularTimer
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          mode={mode}
          isRunning={isRunning}
          onAdjustTime={handleAdjustTime}
          activeTaskTitle={activeTask?.title}
        />

        {/* Main Controls (Start, Pause, Reset, Skip) */}
        <TimerControls
          isRunning={isRunning}
          onTogglePlayPause={handleTogglePlayPause}
          onReset={handleReset}
          onSkip={handleSkip}
          mode={mode}
          soundEnabled={settings.soundEnabled}
        />

        {/* Statistics or Task Section */}
        {showStats ? (
          <SessionStats
            sessions={sessionHistory}
            onClearHistory={() => setSessionHistory([])}
          />
        ) : (
          <TaskFocus
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectActiveTask={setActiveTaskId}
            onAddTask={handleAddTask}
            onToggleTaskComplete={handleToggleTaskComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          // Update current timer if not running to reflect new duration
          if (!isRunning) {
            const secs = getModeSeconds(mode, newSettings);
            setSecondsLeft(secs);
            setTotalSeconds(secs);
          }
        }}
      />
    </div>
  );
}
