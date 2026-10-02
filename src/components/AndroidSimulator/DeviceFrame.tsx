import React, { useState } from 'react';
import {
  Search,
  Plus,
  Wifi,
  Battery,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';
import { Task, FilterType, SortType } from '../../types/task';
import { ActiveNotification } from '../../hooks/useTasks';
import { TaskCardItem } from './TaskCardItem';
import { AddEditBottomSheet } from './AddEditBottomSheet';
import { NotificationHeadsUp } from './NotificationHeadsUp';
import { PermissionDialog } from './PermissionDialog';

interface Props {
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  sort: SortType;
  setSort: (s: SortType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeNotification: ActiveNotification | null;
  hasNotificationPermission: boolean;
  showPermissionDialog: boolean;
  grantPermission: () => void;
  denyPermission: () => void;
  recentlyDeleted: Task | null;
  undoDelete: () => void;
  clearRecentlyDeleted: () => void;
  dismissNotification: () => void;
  onAddTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onTriggerTestAlarm: () => void;
  onResetTasks: () => void;
}

export const DeviceFrame: React.FC<Props> = ({
  filteredTasks,
  filter,
  setFilter,
  sort,
  setSort,
  searchQuery,
  setSearchQuery,
  activeNotification,
  showPermissionDialog,
  grantPermission,
  denyPermission,
  recentlyDeleted,
  undoDelete,
  dismissNotification,
  onAddTask,
  onUpdateTask,
  onToggleComplete,
  onDeleteTask,
  onTriggerTestAlarm,
  onResetTasks
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const filterLabels: { key: FilterType; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'HIGH_PRIORITY', label: 'High Priority' },
    { key: 'TODAY', label: 'Today' }
  ];

  return (
    <div className="relative mx-auto w-[360px] sm:w-[390px] h-[750px] bg-[#0c0f14] rounded-[48px] p-3 shadow-2xl border-[6px] border-slate-700/80 flex flex-col justify-between select-none">
      {/* Dynamic Island / Bezel Top with Speaker & Camera */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800" />
      </div>

      {/* Screen Inner Container */}
      <div className="relative w-full h-full bg-[#11141a] rounded-[38px] overflow-hidden flex flex-col text-slate-100">
        {/* Status Bar */}
        <div className="h-10 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-400 z-30 pt-1">
          <span>{currentTime}</span>
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] text-slate-400 font-bold">5G</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px]">98%</span>
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Heads-up Notification Overlay */}
        {activeNotification && (
          <NotificationHeadsUp
            notification={activeNotification}
            onDismiss={dismissNotification}
            onOpenTask={(taskId) => {
              const t = filteredTasks.find((item) => item.id === taskId);
              if (t) setEditingTask(t);
              dismissNotification();
            }}
            onMarkDone={(taskId) => {
              onToggleComplete(taskId);
              dismissNotification();
            }}
          />
        )}

        {/* System Permission Dialog Overlay */}
        {showPermissionDialog && (
          <PermissionDialog onAllow={grantPermission} onDeny={denyPermission} />
        )}

        {/* Top App Bar (Material Design 3) */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-[#161a22]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between">
            {isSearchActive ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  autoFocus
                  className="w-full bg-[#1e2430] text-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery('');
                  }}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-white leading-tight">
                      TaskPulse
                    </h2>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Jetpack Compose
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsSearchActive(true)}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    title="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Sort"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    {isSortOpen && (
                      <div className="absolute right-0 top-10 w-44 bg-[#1f2633] border border-slate-700 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                        <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Sort By
                        </div>
                        <button
                          onClick={() => {
                            setSort('DUE_DATE_ASC');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-700/50 ${
                            sort === 'DUE_DATE_ASC' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          Due Date (Earliest)
                        </button>
                        <button
                          onClick={() => {
                            setSort('DUE_DATE_DESC');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-700/50 ${
                            sort === 'DUE_DATE_DESC' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          Due Date (Latest)
                        </button>
                        <button
                          onClick={() => {
                            setSort('PRIORITY');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-700/50 ${
                            sort === 'PRIORITY' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          Priority (High → Low)
                        </button>
                        <button
                          onClick={() => {
                            setSort('TITLE');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-700/50 ${
                            sort === 'TITLE' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          Alphabetical (A - Z)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Filter Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1">
            {filterLabels.map(({ key, label }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Task Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 border border-blue-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200">
                {searchQuery ? 'No matching tasks' : 'All clear!'}
              </h4>
              <p className="text-xs text-slate-400 max-w-[220px] mt-1">
                {searchQuery
                  ? 'No task matches your search query. Try another keyword.'
                  : 'Tap "+ Add Task" to schedule your next reminder.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onResetTasks}
                  className="mt-4 flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors border border-blue-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Load Sample Tasks
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCardItem
                key={task.id}
                task={task}
                onToggleComplete={() => onToggleComplete(task.id)}
                onClick={() => setEditingTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))
          )}
        </div>

        {/* Floating Action Button (Extended FAB) */}
        <div className="absolute right-5 bottom-8 z-30">
          <button
            onClick={() => setIsAddSheetOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-4 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span className="text-xs font-bold tracking-wide">New Task</span>
          </button>
        </div>

        {/* Undo Snackbar */}
        {recentlyDeleted && (
          <div className="absolute bottom-20 left-4 right-4 z-30 bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-xl flex items-center justify-between text-xs animate-in slide-in-from-bottom duration-200">
            <span className="text-slate-300 truncate max-w-[180px]">
              Task deleted
            </span>
            <button
              onClick={undoDelete}
              className="text-blue-400 hover:text-blue-300 font-bold px-2 py-0.5 rounded transition-colors"
            >
              Undo
            </button>
          </div>
        )}

        {/* Bottom Gesture Bar */}
        <div className="h-6 flex items-center justify-center bg-[#11141a]">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Add / Edit Task Modal Sheet */}
        {(isAddSheetOpen || editingTask) && (
          <AddEditBottomSheet
            task={editingTask}
            onDismiss={() => {
              setIsAddSheetOpen(false);
              setEditingTask(null);
            }}
            onSave={(data) => {
              if (data.id) {
                const existing = filteredTasks.find((t) => t.id === data.id);
                if (existing) {
                  onUpdateTask({
                    ...existing,
                    ...data
                  });
                }
              } else {
                onAddTask({
                  title: data.title,
                  description: data.description,
                  dueDate: data.dueDate,
                  priority: data.priority,
                  notificationEnabled: data.notificationEnabled,
                  isCompleted: false
                });
              }
              setIsAddSheetOpen(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>

      {/* Simulator Device Controls Bar (outside the screen) */}
      <div className="absolute -bottom-14 left-0 right-0 flex items-center justify-center gap-3">
        <button
          onClick={onTriggerTestAlarm}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-blue-300 rounded-xl transition-colors shadow-sm"
          title="Fires AlarmReceiver heads-up notification instantly"
        >
          <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          Test Notification Chime
        </button>
        <button
          onClick={onResetTasks}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 rounded-xl transition-colors shadow-sm"
          title="Reset to default sample tasks"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Tasks
        </button>
      </div>
    </div>
  );
};
