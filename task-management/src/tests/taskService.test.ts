import { describe, it, expect, beforeEach } from 'vitest';
import { taskService } from '../services/taskService';
import { TaskFilterState } from '../types/task';

describe('taskService API & Data Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const defaultFilters: TaskFilterState = {
    searchQuery: '',
    status: 'All',
    priority: 'All',
    sortBy: 'dueDate',
    sortOrder: 'asc',
    currentPage: 1,
    pageSize: 10,
  };

  it('fetches tasks with pagination and calculates statistics', async () => {
    const result = await taskService.getTasks(defaultFilters);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.total).toBeGreaterThan(0);

    const stats = await taskService.getTaskStats();
    expect(stats.total).toEqual(result.total);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
  });

  it('creates a new task and retrieves it in task list', async () => {
    const newTask = await taskService.createTask({
      title: 'Unit Test Task Item',
      description: 'Testing task creation flow',
      assignedUserId: 'user-1',
      priority: 'High',
      status: 'Pending',
      dueDate: '2026-09-01',
      tags: ['Test'],
    });

    expect(newTask.id).toBeDefined();
    expect(newTask.title).toBe('Unit Test Task Item');

    const result = await taskService.getTasks({
      ...defaultFilters,
      searchQuery: 'Unit Test Task Item',
    });

    expect(result.data.some((t) => t.id === newTask.id)).toBe(true);
  });

  it('deletes a task by ID successfully', async () => {
    const created = await taskService.createTask({
      title: 'Task To Delete',
      description: 'To be removed',
      assignedUserId: 'user-1',
      priority: 'Low',
      status: 'Pending',
      dueDate: '2026-09-10',
    });

    const deletedId = await taskService.deleteTask(created.id);
    expect(deletedId).toBe(created.id);

    const result = await taskService.getTasks(defaultFilters);
    expect(result.data.some((t) => t.id === created.id)).toBe(false);
  });
});
