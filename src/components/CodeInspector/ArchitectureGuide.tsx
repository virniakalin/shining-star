import React from 'react';
import {
  Layers,
  Database,
  Bell,
  Cpu,
  ShieldCheck,
  RotateCcw,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-300 max-w-4xl mx-auto text-xs leading-relaxed">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          TaskPulse Android System Architecture & Design
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Modern Android architecture guidelines with Jetpack Compose, Room, StateFlow, and exact background notifications.
        </p>
      </div>

      {/* Reactive Architecture Flow Diagram */}
      <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Unidirectional Data Flow (UDF) & Reactive Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-[#1c222e] border border-slate-700/60 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              UI Layer
            </span>
            <h4 className="text-xs font-semibold text-white mt-1">
              Jetpack Compose
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              TaskListScreen & AddEditTaskSheet observe StateFlow
            </p>
          </div>

          <div className="bg-[#1c222e] border border-slate-700/60 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              State Holder
            </span>
            <h4 className="text-xs font-semibold text-white mt-1">
              TaskViewModel
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Exposes immutable TaskUiState via StateFlow
            </p>
          </div>

          <div className="bg-[#1c222e] border border-slate-700/60 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              Data Layer
            </span>
            <h4 className="text-xs font-semibold text-white mt-1">
              TaskRepository
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Coordinating Room SQLite and AlarmScheduler
            </p>
          </div>

          <div className="bg-[#1c222e] border border-slate-700/60 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              System Services
            </span>
            <h4 className="text-xs font-semibold text-white mt-1">
              Room & AlarmManager
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              SQLite persistence & Doze-resistant exact alarms
            </p>
          </div>
        </div>
      </div>

      {/* Feature Deep Dives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room Persistence */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>1. Room Persistence & Reactive Coroutine Flows</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            The database uses Room with Kotlin Symbol Processing (KSP). Rather than one-off suspend calls, <code className="text-emerald-300">TaskDao.getAllTasks()</code> returns a Kotlin <code className="text-emerald-300">Flow&lt;List&lt;Task&gt;&gt;</code>, which automatically emits updated lists whenever any row is inserted, updated, or deleted.
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><code className="text-slate-300">@Entity(tableName = "tasks")</code> with auto-generated ID</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><code className="text-slate-300">Converters.kt</code> for storing enum Priority cleanly</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Thread-safe Singleton database with destructive migration fallback</span>
            </li>
          </ul>
        </div>

        {/* AlarmManager Exact Reminders */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Bell className="w-4 h-4 text-blue-400" />
            <span>2. Exact Local Alarms & Doze Mode</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Unlike standard timers which are batched by Android to conserve battery, TaskPulse utilizes <code className="text-blue-300">AlarmManager.setExactAndAllowWhileIdle()</code>. This ensures reminders trigger at the exact minute requested even when the phone is in deep sleep/Doze state.
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Handles Android 12+ <code className="text-slate-300">SCHEDULE_EXACT_ALARM</code> checks</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Cancelled automatically if task is completed or deleted</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Includes WorkManager worker alternative for periodic sync</span>
            </li>
          </ul>
        </div>

        {/* Notification Channels & Android 13+ Permissions */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>3. Android 13+ Runtime Permissions & Channels</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Starting with Android 13 (API 33), apps cannot show notifications without runtime permission. TaskPulse checks and requests <code className="text-cyan-300">Manifest.permission.POST_NOTIFICATIONS</code> using <code className="text-cyan-300">rememberLauncherForActivityResult</code> on launch.
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span><code className="text-slate-300">NotificationChannel</code> with <code className="text-slate-300">IMPORTANCE_HIGH</code> for heads-up banners</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Deep-linking PendingIntent opens task directly in MainActivity</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Audible chime and vibration pattern for immediate awareness</span>
            </li>
          </ul>
        </div>

        {/* Device Boot Reschedule */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            <span>4. Device Reboot Resilience (BootReceiver)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            All system alarms registered with AlarmManager are cleared when an Android device is restarted. TaskPulse includes a registered <code className="text-indigo-300">BootReceiver</code> listening for <code className="text-indigo-300">ACTION_BOOT_COMPLETED</code>.
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Uses <code className="text-slate-300">goAsync()</code> and CoroutineScope to query pending tasks</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Re-registers all future alarms into AlarmManager automatically</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>No missed reminders even after system updates or battery exhaustion</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Jetpack Compose Material 3 Specs */}
      <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>5. Modern Jetpack Compose & Material Design 3 Patterns</span>
        </div>
        <p className="text-slate-400 text-xs">
          The user interface adheres strictly to modern Material 3 guidelines:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div className="p-3 rounded-xl bg-[#1c222e] border border-slate-700/50">
            <strong className="text-white block mb-1">SwipeToDismissBox</strong>
            Swipe left on any task card to reveal the error-container delete zone and instantly delete with an Undo Snackbar.
          </div>
          <div className="p-3 rounded-xl bg-[#1c222e] border border-slate-700/50">
            <strong className="text-white block mb-1">ModalBottomSheet</strong>
            Slide-up sheet with native DatePickerDialog, TimePickerDialog, and dynamic priority chip selectors.
          </div>
          <div className="p-3 rounded-xl bg-[#1c222e] border border-slate-700/50">
            <strong className="text-white block mb-1">Dynamic Color (M3)</strong>
            Light and Dark ColorScheme matching Android 12+ wallpaper extraction with fallback Material 3 palette.
          </div>
        </div>
      </div>
    </div>
  );
};
