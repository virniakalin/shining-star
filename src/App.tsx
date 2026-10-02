import React, { useState } from 'react';
import {
  Smartphone,
  FolderCode,
  Layers,
  BookOpen,
  Download,
  Terminal,
  Bell,
  Database,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Cpu,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { ANDROID_PROJECT_FILES } from './data/androidProjectFiles';
import { AndroidProjectFile } from './types/task';
import { DeviceFrame } from './components/AndroidSimulator/DeviceFrame';
import { ProjectFileTree } from './components/CodeInspector/ProjectFileTree';
import { CodeViewer } from './components/CodeInspector/CodeViewer';
import { ArchitectureGuide } from './components/CodeInspector/ArchitectureGuide';
import { SetupInstructions } from './components/CodeInspector/SetupInstructions';
import { downloadAndroidProjectZip } from './utils/exportZip';

type ActiveTab = 'simulator' | 'code' | 'architecture' | 'setup';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [activeFile, setActiveFile] = useState<AndroidProjectFile>(
    ANDROID_PROJECT_FILES[0]
  );
  const [isExporting, setIsExporting] = useState(false);

  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    sort,
    setSort,
    searchQuery,
    setSearchQuery,
    recentlyDeleted,
    activeNotification,
    hasNotificationPermission,
    showPermissionDialog,
    grantPermission,
    denyPermission,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    undoDelete,
    clearRecentlyDeleted,
    dismissNotification,
    testAlarmReminder,
    resetSampleTasks
  } = useTasks();

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadAndroidProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  const scheduledAlarmsCount = tasks.filter(
    (t) => t.notificationEnabled && !t.isCompleted && t.dueDate > Date.now()
  ).length;

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30">
      {/* Top Bar Contract (Zone 1: Brand, Zone 2: Nav Tabs, Zone 3: Primary CTA) */}
      <header className="h-14 border-b border-slate-800 bg-[#0d121c]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Smartphone className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">
              TaskPulse
            </h1>
            <span className="text-[11px] text-blue-400 font-medium px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/40 hidden sm:inline-block">
              Kotlin Jetpack Compose
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Live Android Demo</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>Project Files ({ANDROID_PROJECT_FILES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hidden md:flex ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture &amp; Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hidden sm:flex ${
              activeTab === 'setup'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Setup Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm shadow-blue-600/30 disabled:opacity-50"
            title="Download full Android Studio project as .zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isExporting ? 'Generating ZIP...' : 'Export Android Project'}
            </span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'simulator' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 max-w-7xl mx-auto w-full">
            {/* Left/Center: Android Phone Device Frame */}
            <div className="shrink-0 mb-16 lg:mb-0">
              <DeviceFrame
                tasks={tasks}
                filteredTasks={filteredTasks}
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeNotification={activeNotification}
                hasNotificationPermission={hasNotificationPermission}
                showPermissionDialog={showPermissionDialog}
                grantPermission={grantPermission}
                denyPermission={denyPermission}
                recentlyDeleted={recentlyDeleted}
                undoDelete={undoDelete}
                clearRecentlyDeleted={clearRecentlyDeleted}
                dismissNotification={dismissNotification}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onToggleComplete={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                onTriggerTestAlarm={() => testAlarmReminder()}
                onResetTasks={resetSampleTasks}
              />
            </div>

            {/* Right: Android System Telemetry & Companion Inspector */}
            <div className="flex-1 w-full max-w-xl space-y-4">
              {/* Architecture Badge Card */}
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">
                      Android System &amp; Runtime State
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Runtime Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="bg-[#181e2b] p-3 rounded-xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      ROOM DATABASE
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {tasks.length} Records
                    </span>
                    <span className="text-[10px] text-slate-400">
                      SQLite local cache
                    </span>
                  </div>

                  <div className="bg-[#181e2b] p-3 rounded-xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      ALARMMANAGER
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {scheduledAlarmsCount} Scheduled
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Exact &amp; Doze-safe
                    </span>
                  </div>

                  <div className="bg-[#181e2b] p-3 rounded-xl border border-slate-700/50 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      POST_NOTIFICATIONS
                    </span>
                    <span
                      className={`text-sm font-bold mt-0.5 block ${
                        hasNotificationPermission ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {hasNotificationPermission ? 'Granted' : 'Pending/Denied'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Android 13+ (API 33)
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification Channel & Scheduled Queue */}
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Notification Channel: <code className="text-xs text-indigo-300 font-mono">taskpulse_reminder_channel</code>
                    </h3>
                  </div>
                  <button
                    onClick={() => testAlarmReminder()}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Trigger Test Alert
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-2">
                  <p>
                    Configured with <code className="text-slate-200">NotificationManager.IMPORTANCE_HIGH</code> for Heads-Up banner popups on Android 8.0+. When triggered, tapping the notification fires a deep-link Intent directly into <code className="text-slate-200">MainActivity</code>.
                  </p>
                  <div className="bg-[#161d2a] p-3 rounded-xl border border-slate-700/60 font-mono text-[11px] text-slate-300">
                    <div className="text-slate-500">// BroadcastReceiver Trigger:</div>
                    <div>val intent = Intent(context, TaskAlarmReceiver::class.java)</div>
                    <div>alarmManager.setExactAndAllowWhileIdle(...)</div>
                  </div>
                </div>
              </div>

              {/* Quick Jump to Source Code Files */}
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FolderCode className="w-4 h-4 text-cyan-400" />
                    Core Android Code Deliverables
                  </h3>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ANDROID_PROJECT_FILES.slice(0, 6).map((file) => (
                    <button
                      key={file.path}
                      onClick={() => {
                        setActiveFile(file);
                        setActiveTab('code');
                      }}
                      className="p-2.5 bg-[#171c26] hover:bg-[#202736] border border-slate-800 rounded-xl text-left transition-colors flex items-center justify-between group"
                    >
                      <div className="truncate min-w-0 pr-2">
                        <span className="font-semibold text-slate-200 block truncate group-hover:text-blue-400">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {file.path}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Android Studio Export Banner */}
              <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#111622] border border-blue-500/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Ready to build in Android Studio?
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Download the complete project zip or inspect the setup instructions.
                  </p>
                </div>
                <button
                  onClick={handleDownloadZip}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-sm"
                >
                  Download .ZIP
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex-1 flex overflow-hidden">
            {/* File Tree Sidebar */}
            <div className="w-64 sm:w-72 shrink-0 border-r border-slate-800">
              <ProjectFileTree
                files={ANDROID_PROJECT_FILES}
                activeFile={activeFile}
                onSelectFile={setActiveFile}
              />
            </div>

            {/* Code Viewer */}
            <div className="flex-1 overflow-hidden">
              <CodeViewer file={activeFile} />
            </div>
          </div>
        )}

        {activeTab === 'architecture' && <ArchitectureGuide />}

        {activeTab === 'setup' && <SetupInstructions />}
      </main>
    </div>
  );
}
