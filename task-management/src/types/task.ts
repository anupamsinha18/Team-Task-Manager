export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedUser: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  tags?: string[];
}

export type SortByOption = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortOrderOption = 'asc' | 'desc';

export interface TaskFilterState {
  searchQuery: string;
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  sortBy: SortByOption;
  sortOrder: SortOrderOption;
  currentPage: number;
  pageSize: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
  completionRate: number;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  assignedUserId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  tags?: string[];
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  id: string;
}
