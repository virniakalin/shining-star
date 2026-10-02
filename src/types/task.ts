export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: number; // timestamp in ms
  priority: Priority;
  isCompleted: boolean;
  notificationEnabled: boolean;
  createdAt: number;
}

export type FilterType = 'ALL' | 'PENDING' | 'COMPLETED' | 'HIGH_PRIORITY' | 'TODAY';
export type SortType = 'DUE_DATE_ASC' | 'DUE_DATE_DESC' | 'PRIORITY' | 'TITLE';

export interface AndroidProjectFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'markdown';
  category: 'build' | 'manifest' | 'data' | 'ui' | 'notification' | 'docs';
  content: string;
  description: string;
}
