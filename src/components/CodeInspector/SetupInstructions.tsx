import React from 'react';
import {
  Download,
  FolderSync,
  Play,
  Settings,
  BellRing,
  Code2,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../../utils/exportZip';

export const SetupInstructions: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 max-w-4xl mx-auto text-xs leading-relaxed">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          How to Setup & Run TaskPulse in Android Studio
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Complete step-by-step instructions to import, compile, and run the TaskPulse Kotlin Jetpack Compose project.
        </p>
      </div>

      {/* Quick Download CTA */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">
            Download Complete Android Studio Project (.ZIP)
          </h3>
          <p className="text-xs text-blue-200/80 mt-1">
            Pre-configured with <code className="font-mono text-blue-300">build.gradle.kts</code>, <code className="font-mono text-blue-300">AndroidManifest.xml</code>, Room DAOs, and all Kotlin files.
          </p>
        </div>
        <button
          onClick={() => downloadAndroidProjectZip()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Android Project</span>
        </button>
      </div>

      {/* Step by Step cards */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
              1
            </div>
            <h3 className="text-sm font-semibold text-white">
              Prerequisites & Environment
            </h3>
          </div>
          <div className="pl-10 space-y-2">
            <p className="text-slate-400">
              Ensure you have the following installed on your development machine:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#1c222e] p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">IDE</span>
                <p className="text-white font-medium mt-0.5">Android Studio</p>
                <span className="text-[11px] text-slate-400">Hedgehog (2023.1.1) or newer</span>
              </div>
              <div className="bg-[#1c222e] p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">JDK</span>
                <p className="text-white font-medium mt-0.5">Java 17 or 21</p>
                <span className="text-[11px] text-slate-400">Bundled with Android Studio</span>
              </div>
              <div className="bg-[#1c222e] p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Android SDK</span>
                <p className="text-white font-medium mt-0.5">Compile SDK 35</p>
                <span className="text-[11px] text-slate-400">Min SDK: 24 (Android 7.0+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
              2
            </div>
            <h3 className="text-sm font-semibold text-white">
              Open & Sync in Android Studio
            </h3>
          </div>
          <div className="pl-10 space-y-2 text-slate-400">
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Extract the downloaded <code className="text-slate-200">TaskPulse_Android_Project.zip</code> into your projects folder.</li>
              <li>Open Android Studio and click <strong>Open</strong> (or <strong>File &gt; Open</strong>).</li>
              <li>Select the extracted folder containing <code className="text-slate-200">settings.gradle.kts</code> and click <strong>OK</strong>.</li>
              <li>Wait for Android Studio to index and run <strong>Gradle Sync</strong> automatically.</li>
            </ol>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
              3
            </div>
            <h3 className="text-sm font-semibold text-white">
              Configure Exact Alarm Permission (Android 12+)
            </h3>
          </div>
          <div className="pl-10 space-y-2 text-slate-400">
            <p>
              On devices running Android 12 (API 31) and newer, Android requires explicit authorization for exact alarms:
            </p>
            <div className="bg-[#1c222e] p-3 rounded-xl border border-slate-700/50 space-y-1 text-[11px]">
              <p className="text-slate-300 font-medium">Verify in Device Settings:</p>
              <p>Navigate to: <strong>Settings &gt; Apps &gt; TaskPulse &gt; Alarms &amp; reminders &gt; Allow setting alarms and reminders</strong> (Toggle ON).</p>
              <p className="text-slate-500">TaskPulse automatically detects this via <code className="text-blue-300">alarmManager.canScheduleExactAlarms()</code> and falls back gracefully if not granted.</p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
              4
            </div>
            <h3 className="text-sm font-semibold text-white">
              Run on Emulator or Physical Device
            </h3>
          </div>
          <div className="pl-10 space-y-2 text-slate-400">
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Select your target device (e.g. <strong>Pixel 8 - API 35 AVD</strong> or a physical phone connected with USB debugging enabled).</li>
              <li>Click the green <strong>Run 'app' (Shift + F10)</strong> button in the top toolbar.</li>
              <li>When the app launches for the first time on Android 13+, tap <strong>Allow</strong> on the Notification permission dialog.</li>
            </ol>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              5
            </div>
            <h3 className="text-sm font-semibold text-white">
              Testing Notifications & Alarms
            </h3>
          </div>
          <div className="pl-10 space-y-2 text-slate-400">
            <p>To verify the notification system operates correctly:</p>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Create a task with a due time 2 minutes into the future and leave the app in the background.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Notice the heads-up notification alerting with sound and vibration right on schedule.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Tap the notification: TaskPulse opens directly to that specific task sheet via the deep link intent.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
