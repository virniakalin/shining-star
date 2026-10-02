import React, { useState } from 'react';
import { Calendar, Clock, Bell, X } from 'lucide-react';
import { Task, Priority } from '../../types/task';

interface Props {
  task: Task | null;
  onDismiss: () => void;
  onSave: (taskData: {
    id?: number;
    title: string;
    description: string;
    dueDate: number;
    priority: Priority;
    notificationEnabled: boolean;
  }) => void;
}

export const AddEditBottomSheet: React.FC<Props> = ({
  task,
  onDismiss,
  onSave
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'MEDIUM');
  const [notificationEnabled, setNotificationEnabled] = useState(
    task ? task.notificationEnabled : true
  );

  // Date and Time calculation
  const initialDate = task ? new Date(task.dueDate) : new Date(Date.now() + 1000 * 60 * 60 * 2);
  const [selectedDate, setSelectedDate] = useState(
    initialDate.toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState(
    initialDate.toTimeString().slice(0, 5)
  );
  const [titleError, setTitleError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const dueDate = new Date(year, month - 1, day, hours, minutes).getTime();

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      notificationEnabled
    });
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-40 flex items-end justify-center animate-in fade-in duration-200">
      <div className="w-full bg-[#1e232b] text-slate-100 rounded-t-3xl border-t border-slate-700/70 p-5 max-h-[90%] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
              placeholder="e.g., Finalize Compose ViewModel"
              className={`w-full bg-[#14181f] text-sm text-white rounded-xl px-3.5 py-2.5 border ${
                titleError ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
              } focus:outline-none focus:border-blue-500 placeholder:text-slate-500`}
            />
            {titleError && (
              <p className="text-[11px] text-red-400 mt-1">Title is required</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key steps, checklist, or context..."
              rows={2}
              className="w-full bg-[#14181f] text-xs text-white rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  LOW: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
                  MEDIUM: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
                  HIGH: 'text-red-400 border-red-500/50 bg-red-500/10'
                }[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${colors} ring-1 ring-offset-1 ring-offset-[#1e232b] ring-blue-500 shadow-sm`
                        : 'border-slate-700 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date & Time Pickers */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Due Date & Reminder Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#14181f] text-xs text-white rounded-xl px-3 py-2.5 pl-8 border border-slate-700 focus:outline-none focus:border-blue-500"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5 pointer-events-none" />
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#14181f] text-xs text-white rounded-xl px-3 py-2.5 pl-8 border border-slate-700 focus:outline-none focus:border-blue-500"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Push Notification Switch */}
          <div className="flex items-center justify-between py-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">Push Notification Reminder</p>
                <p className="text-[10px] text-slate-400">Fires exact alarm at due time</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationEnabled(!notificationEnabled)}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationEnabled ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onDismiss}
              className="flex-1 py-2.5 px-4 bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
