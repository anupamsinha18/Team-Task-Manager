import {
  Task,
  TaskFilterState,
  TaskStats,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStatus,
} from '../types/task';
import { PaginatedResult } from '../types/common';
import { INITIAL_MOCK_TASKS, MOCK_USERS } from './mockData';
import { simulateNetworkDelay } from './apiClient';

const TASKS_STORAGE_KEY = 'project_dashboard_tasks';

// Initialize tasks in LocalStorage if not present
const getStoredTasks = (): Task[] => {
  const raw = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_TASKS));
    return INITIAL_MOCK_TASKS;
  }
  try {
    const tasks: Task[] = JSON.parse(raw);
    // If local storage contains old AI-sounding task titles, replace with human-like titles
    if (tasks.some((t) => t.title.includes('Implement OAuth') || t.title.includes('Design Dashboard Analytics'))) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_TASKS));
      return INITIAL_MOCK_TASKS;
    }
    return tasks;
  } catch {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_TASKS));
    return INITIAL_MOCK_TASKS;
  }
};

const saveStoredTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  async getTasks(filters: TaskFilterState): Promise<PaginatedResult<Task>> {
    const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

    if (USE_MOCK_API) {
      await simulateNetworkDelay(200);
      let tasks = getStoredTasks();

      // 1. Search filter by title or description
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        tasks = tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(query)))
        );
      }

      // 2. Filter by status
      if (filters.status !== 'All') {
        tasks = tasks.filter((t) => t.status === filters.status);
      }

      // 3. Filter by priority
      if (filters.priority !== 'All') {
        tasks = tasks.filter((t) => t.priority === filters.priority);
      }

      // 4. Sorting
      tasks.sort((a, b) => {
        let fieldA: string | number = '';
        let fieldB: string | number = '';

        if (filters.sortBy === 'dueDate') {
          fieldA = new Date(a.dueDate).getTime();
          fieldB = new Date(b.dueDate).getTime();
        } else if (filters.sortBy === 'createdAt') {
          fieldA = new Date(a.createdAt).getTime();
          fieldB = new Date(b.createdAt).getTime();
        } else if (filters.sortBy === 'title') {
          fieldA = a.title.toLowerCase();
          fieldB = b.title.toLowerCase();
        } else if (filters.sortBy === 'priority') {
          const priorityWeight = { High: 3, Medium: 2, Low: 1 };
          fieldA = priorityWeight[a.priority] || 0;
          fieldB = priorityWeight[b.priority] || 0;
        }

        if (fieldA < fieldB) return filters.sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // 5. Pagination
      const total = tasks.length;
      const pageSize = filters.pageSize || 10;
      const currentPage = filters.currentPage || 1;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = tasks.slice(startIndex, startIndex + pageSize);

      return {
        data: paginatedData,
        total,
        page: currentPage,
        pageSize,
        totalPages,
      };
    }

    // Real API Endpoint integration
    const params = new URLSearchParams({
      search: filters.searchQuery,
      status: filters.status,
      priority: filters.priority,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: filters.currentPage.toString(),
      limit: filters.pageSize.toString(),
    });

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks from server');
    }
    return await response.json();
  },

  async getTaskStats(): Promise<TaskStats> {
    const tasks = getStoredTasks();
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const highPriority = tasks.filter((t) => t.priority === 'High').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      highPriority,
      completionRate,
    };
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

    if (USE_MOCK_API) {
      await simulateNetworkDelay(250);
      const tasks = getStoredTasks();

      const assignedUser = MOCK_USERS.find((u) => u.id === payload.assignedUserId) || MOCK_USERS[0];

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        assignedUser,
        priority: payload.priority,
        status: payload.status,
        dueDate: payload.dueDate,
        createdAt: new Date().toISOString(),
        tags: payload.tags || ['Task'],
      };

      tasks.unshift(newTask);
      saveStoredTasks(tasks);
      return newTask;
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
  },

  async updateTask(payload: UpdateTaskPayload): Promise<Task> {
    const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

    if (USE_MOCK_API) {
      await simulateNetworkDelay(250);
      const tasks = getStoredTasks();
      const index = tasks.findIndex((t) => t.id === payload.id);
      if (index === -1) throw new Error('Task not found');

      const existing = tasks[index];
      const assignedUser = payload.assignedUserId
        ? MOCK_USERS.find((u) => u.id === payload.assignedUserId) || existing.assignedUser
        : existing.assignedUser;

      const updatedTask: Task = {
        ...existing,
        ...payload,
        assignedUser,
        updatedAt: new Date().toISOString(),
      };

      tasks[index] = updatedTask;
      saveStoredTasks(tasks);
      return updatedTask;
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks/${payload.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask({ id, status });
  },

  async deleteTask(id: string): Promise<string> {
    const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

    if (USE_MOCK_API) {
      await simulateNetworkDelay(200);
      const tasks = getStoredTasks();
      const filtered = tasks.filter((t) => t.id !== id);
      saveStoredTasks(filtered);
      return id;
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete task');
    return id;
  },
};
