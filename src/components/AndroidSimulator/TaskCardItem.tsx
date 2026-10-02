import React, { useState } from 'react';
import { Check, Calendar, Bell, Trash2 } from 'lucide-react';
import { Task } from '../../types/task';

interface Props {
  task: Task;
  onToggleComplete: () => void;
  onClick: () => void;
  onDelete: () => void;
}

export const TaskCardItem: React.FC<Props> = ({
  task,
  onToggleComplete,
  onClick,
  onDelete
}) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const isOverdue = !task.isCompleted && task.dueDate < Date.now();

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (isToday) return `Today, ${timeStr}`;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow =
      d.getDate() === tomorrow.getDate() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getFullYear() === tomorrow.getFullYear();
    if (isTomorrow) return `Tomorrow, ${timeStr}`;

    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  };

  const priorityColors = {
    HIGH: {
      text: 'text-red-400',
      border: 'border-l-red-500',
      bg: 'bg-red-500/10'
    },
    MEDIUM: {
      text: 'text-amber-400',
      border: 'border-l-amber-500',
      bg: 'bg-amber-500/10'
    },
    LOW: {
      text: 'text-emerald-400',
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-500/10'
    }
  }[task.priority];

  // Touch/Mouse swipe handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    // Allow dragging only towards the left (negative diff)
    if (diff < 0) {
      setDragOffset(Math.max(diff, -100));
    } else {
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset < -60) {
      onDelete();
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none group transition-all">
      {/* Background delete container revealed on swipe */}
      <div className="absolute inset-0 bg-red-600 flex items-center justify-end px-5 text-white font-medium text-xs">
        <div className="flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </div>
      </div>

      {/* Main Task Surface */}
      <div
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        className={`relative bg-[#1c222b] hover:bg-[#222a36] border border-slate-700/60 border-l-4 ${
          priorityColors.border
        } p-3.5 transition-colors cursor-pointer ${
          task.isCompleted ? 'opacity-65' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
              task.isCompleted
                ? 'bg-blue-600 text-white border border-blue-500'
                : 'border-2 border-slate-500 hover:border-blue-400 bg-transparent'
            }`}
          >
            {task.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Body */}
          <div className="flex-1 min-w-0" onClick={onClick}>
            <div className="flex items-center gap-2">
              <h4
                className={`text-sm font-semibold truncate transition-all ${
                  task.isCompleted
                    ? 'line-through text-slate-400 font-normal'
                    : 'text-slate-100'
                }`}
              >
                {task.title}
              </h4>
            </div>

            {task.description && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-medium' : ''}`}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
                {isOverdue && ' (Overdue)'}
              </span>

              <span>·</span>

              <span className={`font-semibold ${priorityColors.text}`}>
                {task.priority}
              </span>

              {task.notificationEnabled && (
                <>
                  <span>·</span>
                  <span className="flex items-center text-blue-400" title="Reminder active">
                    <Bell className="w-3 h-3" />
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Delete action button on hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
