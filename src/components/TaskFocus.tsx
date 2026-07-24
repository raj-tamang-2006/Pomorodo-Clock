import React, { useState } from 'react';
import { FocusTask } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, Target, Check } from 'lucide-react';

interface TaskFocusProps {
  tasks: FocusTask[];
  activeTaskId: string | null;
  onSelectActiveTask: (taskId: string | null) => void;
  onAddTask: (title: string, estimatedPomodoros: number) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskFocus: React.FC<TaskFocusProps> = ({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [estimated, setEstimated] = useState(2);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), estimated);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 glass-panel p-5 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
        <div className="flex items-center gap-2 text-slate-200 font-mono text-[11px] tracking-widest uppercase">
          <Target size={15} className="text-[#00FFAB]" />
          <span>Current Focus Tasks</span>
        </div>
        {!isAdding && (
          <button
            id="add-task-open-btn"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-[11px] font-mono tracking-wider text-[#00FFAB] hover:text-[#00FFAB]/80 bg-[#00FFAB]/10 hover:bg-[#00FFAB]/20 px-3 py-1 rounded-full border border-[#00FFAB]/30 transition-all uppercase"
          >
            <Plus size={13} />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-3.5 bg-white/[0.02] border border-white/[0.08] rounded-2xl space-y-3">
          <input
            id="new-task-title-input"
            type="text"
            placeholder="What are you focusing on?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            className="w-full px-3.5 py-2 bg-black/40 border border-white/[0.1] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00FFAB] font-mono"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              Est. Pomodoros:
              <input
                type="number"
                min="1"
                max="20"
                value={estimated}
                onChange={(e) => setEstimated(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 px-2 py-1 bg-black/40 border border-white/[0.1] rounded text-center text-slate-200"
              />
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-new-task-btn"
                className="px-3.5 py-1 bg-[#00FFAB] text-black font-semibold rounded-lg hover:bg-[#00FFAB]/90 transition-all shadow-[0_0_15px_rgba(0,255,171,0.3)]"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-6 text-slate-500 font-mono text-xs">
          No tasks added yet. Add a focus goal to track your pomodoro progress!
        </div>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {tasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00FFAB]/10 border-[#00FFAB]/40 shadow-[0_0_15px_rgba(0,255,171,0.1)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleTaskComplete(task.id)}
                    className="text-slate-500 hover:text-[#00FFAB] transition-colors flex-shrink-0"
                    title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={18} className="text-[#00FFAB] fill-[#00FFAB]/20" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>

                  <div
                    onClick={() => onSelectActiveTask(isActive ? null : task.id)}
                    className="cursor-pointer min-w-0 flex-1"
                  >
                    <div className={`text-xs sm:text-sm font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>🍅 {task.completedPomodoros}/{task.estimatedPomodoros}</span>
                      {isActive && (
                        <span className="text-[#00FFAB] font-semibold text-[9px] uppercase tracking-wider bg-[#00FFAB]/20 px-2 py-0.5 rounded-full border border-[#00FFAB]/30">
                          Active Focus
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete task"
                    className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-white/[0.06] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
