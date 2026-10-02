import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Task, Priority, FilterType, SortType } from '../types/task';
import { playNotificationSound } from '../utils/audio';

const STORAGE_KEY = 'taskpulse_tasks_v1';
const PERMISSION_KEY = 'taskpulse_notification_permission';

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'Review Jetpack Compose M3 Architecture',
    description: 'Ensure ViewModel uses StateFlow and Room Dao returns Flow<List<Task>>',
    dueDate: Date.now() + 1000 * 60 * 60 * 2, // 2 hours from now
    priority: 'HIGH',
    isCompleted: false,
    notificationEnabled: true,
    createdAt: Date.now() - 1000 * 60 * 30
  },
  {
    id: 2,
    title: 'Verify POST_NOTIFICATIONS runtime permission',
    description: 'Android 13+ requires dynamic user consent before dispatching reminders',
    dueDate: Date.now() + 1000 * 60 * 60 * 5, // 5 hours from now
    priority: 'MEDIUM',
    isCompleted: false,
    notificationEnabled: true,
    createdAt: Date.now() - 1000 * 60 * 60
  },
  {
    id: 3,
    title: 'Test exact alarms with AlarmManager',
    description: 'Verify setExactAndAllowWhileIdle handles Doze mode without battery drain',
    dueDate: Date.now() + 1000 * 60 * 60 * 24, // tomorrow
    priority: 'HIGH',
    isCompleted: true,
    notificationEnabled: true,
    createdAt: Date.now() - 1000 * 60 * 120
  },
  {
    id: 4,
    title: 'Check BootReceiver after system reboot',
    description: 'Ensure ACTION_BOOT_COMPLETED reschedules pending alarms into system queue',
    dueDate: Date.now() + 1000 * 60 * 60 * 48,
    priority: 'LOW',
    isCompleted: false,
    notificationEnabled: false,
    createdAt: Date.now() - 1000 * 60 * 180
  }
];

export interface ActiveNotification {
  id: number;
  taskId: number;
  title: string;
  description: string;
  priority: Priority;
  timestamp: number;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_TASKS;
  });

  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sort, setSort] = useState<SortType>('DUE_DATE_ASC');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyDeleted, setRecentlyDeleted] = useState<Task | null>(null);
  
  // Notification states
  const [activeNotification, setActiveNotification] = useState<ActiveNotification | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(() => {
    return localStorage.getItem(PERMISSION_KEY) === 'granted';
  });
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(false);

  // Persistence to local storage (acts as Room DB)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage error
    }
  }, [tasks]);

  // Request Android 13+ permission dialog if not yet decided
  useEffect(() => {
    const perm = localStorage.getItem(PERMISSION_KEY);
    if (!perm) {
      // Show Android system permission dialog after brief delay
      const timer = setTimeout(() => {
        setShowPermissionDialog(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const grantPermission = useCallback(() => {
    localStorage.setItem(PERMISSION_KEY, 'granted');
    setHasNotificationPermission(true);
    setShowPermissionDialog(false);

    // Also request browser Notification if supported
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const denyPermission = useCallback(() => {
    localStorage.setItem(PERMISSION_KEY, 'denied');
    setHasNotificationPermission(false);
    setShowPermissionDialog(false);
  }, []);

  const triggerNotification = useCallback((task: Task) => {
    playNotificationSound();
    const notif: ActiveNotification = {
      id: Date.now(),
      taskId: task.id,
      title: task.title,
      description: task.description || 'Your scheduled task is due now!',
      priority: task.priority,
      timestamp: Date.now()
    };
    setActiveNotification(notif);

    // Browser Notification API as bonus
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`TaskPulse: ${task.title}`, {
          body: task.description || 'Task is due now',
          icon: '/favicon.ico'
        });
      } catch {
        // Ignore
      }
    }
  }, []);

  // Background Alarm scheduler check (runs every 10 seconds to catch due tasks)
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;
  const notifiedTasksRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tasksRef.current.forEach(task => {
        if (
          task.notificationEnabled &&
          !task.isCompleted &&
          task.dueDate <= now &&
          task.dueDate > now - 60000 &&
          !notifiedTasksRef.current.has(task.id)
        ) {
          notifiedTasksRef.current.add(task.id);
          triggerNotification(task);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [triggerNotification]);

  // Quick Demo: schedule an immediate test notification in 5 seconds
  const testAlarmReminder = useCallback((taskId?: number) => {
    let target = tasks.find(t => t.id === taskId);
    if (!target) {
      target = tasks[0] || {
        id: 999,
        title: 'Review Jetpack Compose Code',
        description: 'Scheduled reminder triggered successfully via AlarmReceiver',
        dueDate: Date.now(),
        priority: 'HIGH' as Priority,
        isCompleted: false,
        notificationEnabled: true,
        createdAt: Date.now()
      };
    }
    triggerNotification(target);
  }, [tasks, triggerNotification]);

  // CRUD Operations
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((updated: Task) => {
    setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  }, []);

  const toggleTaskCompletion = useCallback((id: number) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return { ...t, isCompleted: !t.isCompleted };
        }
        return t;
      })
    );
  }, []);

  const deleteTask = useCallback((id: number) => {
    const toDelete = tasks.find(t => t.id === id);
    if (toDelete) {
      setRecentlyDeleted(toDelete);
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  }, [tasks]);

  const undoDelete = useCallback(() => {
    if (recentlyDeleted) {
      setTasks(prev => [recentlyDeleted, ...prev]);
      setRecentlyDeleted(null);
    }
  }, [recentlyDeleted]);

  const clearRecentlyDeleted = useCallback(() => {
    setRecentlyDeleted(null);
  }, []);

  const dismissNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  const resetSampleTasks = useCallback(() => {
    setTasks(INITIAL_TASKS);
  }, []);

  // Filter & Sort logic (matching ViewModel)
  const filteredTasks = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

    let result = tasks.filter(task => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter
      switch (filter) {
        case 'PENDING':
          return !task.isCompleted;
        case 'COMPLETED':
          return task.isCompleted;
        case 'HIGH_PRIORITY':
          return task.priority === 'HIGH';
        case 'TODAY':
          return task.dueDate >= startOfToday && task.dueDate <= endOfToday;
        case 'ALL':
        default:
          return true;
      }
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'DUE_DATE_ASC':
          return a.dueDate - b.dueDate;
        case 'DUE_DATE_DESC':
          return b.dueDate - a.dueDate;
        case 'PRIORITY': {
          const weight: Record<Priority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        case 'TITLE':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filter, sort, searchQuery]);

  return {
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
  };
}
