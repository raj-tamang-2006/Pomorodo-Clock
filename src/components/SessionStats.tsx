import React from 'react';
import { SessionRecord } from '../types';
import { Award, Clock, Flame, Calendar, Trash2 } from 'lucide-react';

interface SessionStatsProps {
  sessions: SessionRecord[];
  onClearHistory: () => void;
}

export const SessionStats: React.FC<SessionStatsProps> = ({ sessions, onClearHistory }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  
  const todaySessions = sessions.filter((s) => new Date(s.completedAt).setHours(0, 0, 0, 0) === today);
  const totalSecondsToday = todaySessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  
  const hours = Math.floor(totalSecondsToday / 3600);
  const minutes = Math.floor((totalSecondsToday % 3600) / 60);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    return `${m}m`;
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 glass-panel p-5 shadow-2xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <h3 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 flex items-center gap-2">
          <Award size={15} className="text-[#00FFAB]" />
          <span>Focus Analytics</span>
        </h3>
        {sessions.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] font-mono text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            <Trash2 size={12} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Clock size={12} className="text-[#00FFAB]" /> Today's Focus
          </div>
          <div className="text-xl font-light font-mono text-slate-100">
            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          </div>
        </div>

        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Flame size={12} className="text-rose-400" /> Pomodoros
          </div>
          <div className="text-xl font-light font-mono text-slate-100">
            {todaySessions.filter((s) => s.mode === 'pomodoro').length} 🍅
          </div>
        </div>

        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Calendar size={12} className="text-[#4287f5]" /> Total Sessions
          </div>
          <div className="text-xl font-light font-mono text-slate-100">
            {sessions.length}
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h4 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-2">Recent Logged Sessions</h4>
        {sessions.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono italic py-2">No completed sessions logged yet.</p>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
            {sessions.slice(-5).reverse().map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    s.mode === 'pomodoro' ? 'bg-[#00FFAB] shadow-[0_0_8px_#00FFAB]' : s.mode === 'shortBreak' ? 'bg-[#4287f5]' : 'bg-purple-400'
                  }`} />
                  <span className="font-mono text-slate-300 text-xs capitalize">{s.mode}</span>
                  {s.taskTitle && (
                    <span className="text-slate-500 font-mono text-[11px] truncate max-w-[120px]">
                      ({s.taskTitle})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                  <span>{formatDuration(s.durationSeconds)}</span>
                  <span>•</span>
                  <span>{new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
