import React from 'react';
import { Bell } from 'lucide-react';

interface Props {
  onAllow: () => void;
  onDeny: () => void;
}

export const PermissionDialog: React.FC<Props> = ({ onAllow, onDeny }) => {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e232a] text-slate-100 rounded-3xl p-6 max-w-[310px] w-full shadow-2xl border border-slate-700/50">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <Bell className="w-6 h-6" />
        </div>

        <h3 className="text-base font-semibold text-center text-white mb-2">
          Allow TaskPulse to send you notifications?
        </h3>

        <p className="text-xs text-slate-400 text-center mb-6 leading-relaxed">
          TaskPulse uses exact notifications to alert you when scheduled tasks and reminders reach their due time (Android 13+).
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onAllow}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Allow
          </button>
          <button
            onClick={onDeny}
            className="w-full py-2 px-4 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            Don't allow
          </button>
        </div>
      </div>
    </div>
  );
};
