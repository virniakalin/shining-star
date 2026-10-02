import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { ActiveNotification } from '../../hooks/useTasks';

interface Props {
  notification: ActiveNotification;
  onDismiss: () => Unit;
  onOpenTask: (taskId: number) => Unit;
  onMarkDone: (taskId: number) => Unit;
}

type Unit = void;

export const NotificationHeadsUp: React.FC<Props> = ({
  notification,
  onDismiss,
  onOpenTask,
  onMarkDone
}) => {
  return (
    <div className="absolute top-10 left-3 right-3 z-50 animate-in slide-in-from-top-6 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/60 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Bell className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-200">TaskPulse</span>
            <span>·</span>
            <span>Now</span>
            {notification.priority === 'HIGH' && (
              <span className="text-[10px] text-red-400 font-bold bg-red-950/60 px-1.5 py-0.2 rounded border border-red-800/50">
                HIGH PRIORITY
              </span>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div
          onClick={() => onOpenTask(notification.taskId)}
          className="cursor-pointer group"
        >
          <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
            {notification.title}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
            {notification.description}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => onMarkDone(notification.taskId)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-xs font-medium rounded-lg transition-colors border border-blue-500/30"
          >
            <Check className="w-3.5 h-3.5" />
            Mark as Done
          </button>
          <button
            onClick={() => onOpenTask(notification.taskId)}
            className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700/60"
          >
            Open Details
          </button>
        </div>
      </div>
    </div>
  );
};
