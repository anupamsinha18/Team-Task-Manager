import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Task,
  TaskFilterState,
  TaskStats,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStatus,
  TaskPriority,
  SortByOption,
  SortOrderOption,
} from '../../types/task';
import { taskService } from '../../services/taskService';
import { PaginatedResult } from '../../types/common';

interface TaskSliceState {
  tasks: Task[];
  stats: TaskStats | null;
  totalTasks: number;
  totalPages: number;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  selectedTask: Task | null;
  filters: TaskFilterState;
}

const initialState: TaskSliceState = {
  tasks: [],
  stats: null,
  totalTasks: 0,
  totalPages: 1,
  isLoading: false,
  isStatsLoading: false,
  error: null,
  selectedTask: null,
  filters: {
    searchQuery: '',
    status: 'All',
    priority: 'All',
    sortBy: 'dueDate',
    sortOrder: 'asc',
    currentPage: 1,
    pageSize: 6,
  },
};

export const fetchTasks = createAsyncThunk<PaginatedResult<Task>, void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const filters = state.tasks?.filters || {
        searchQuery: '',
        status: 'All',
        priority: 'All',
        sortBy: 'dueDate',
        sortOrder: 'asc',
        currentPage: 1,
        pageSize: 6,
      };
      return await taskService.getTasks(filters);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskStats = createAsyncThunk<TaskStats, void, { rejectValue: string }>(
  'tasks/fetchTaskStats',
  async (_, { rejectWithValue }) => {
    try {
      return await taskService.getTaskStats();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch statistics');
    }
  }
);

export const createNewTask = createAsyncThunk<Task, CreateTaskPayload, { rejectValue: string }>(
  'tasks/createNewTask',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const newTask = await taskService.createTask(payload);
      dispatch(fetchTasks());
      dispatch(fetchTaskStats());
      return newTask;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create task');
    }
  }
);

export const updateExistingTask = createAsyncThunk<Task, UpdateTaskPayload, { rejectValue: string }>(
  'tasks/updateExistingTask',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const updated = await taskService.updateTask(payload);
      dispatch(fetchTasks());
      dispatch(fetchTaskStats());
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update task');
    }
  }
);

export const updateStatusQuick = createAsyncThunk<Task, { id: string; status: TaskStatus }, { rejectValue: string }>(
  'tasks/updateStatusQuick',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const updated = await taskService.updateStatus(id, status);
      dispatch(fetchTasks());
      dispatch(fetchTaskStats());
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update status');
    }
  }
);

export const deleteTaskById = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTaskById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      dispatch(fetchTasks());
      dispatch(fetchTaskStats());
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filters.searchQuery = action.payload;
      state.filters.currentPage = 1;
    },
    setStatusFilter(state, action: PayloadAction<TaskStatus | 'All'>) {
      state.filters.status = action.payload;
      state.filters.currentPage = 1;
    },
    setPriorityFilter(state, action: PayloadAction<TaskPriority | 'All'>) {
      state.filters.priority = action.payload;
      state.filters.currentPage = 1;
    },
    setSortBy(state, action: PayloadAction<SortByOption>) {
      state.filters.sortBy = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrderOption>) {
      state.filters.sortOrder = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.currentPage = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.filters.pageSize = action.payload;
      state.filters.currentPage = 1;
    },
    setSelectedTask(state, action: PayloadAction<Task | null>) {
      state.selectedTask = action.payload;
    },
    resetFilters(state) {
      state.filters = {
        searchQuery: '',
        status: 'All',
        priority: 'All',
        sortBy: 'dueDate',
        sortOrder: 'asc',
        currentPage: 1,
        pageSize: 6,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<PaginatedResult<Task>>) => {
        state.isLoading = false;
        state.tasks = action.payload.data;
        state.totalTasks = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error fetching tasks';
      })

      // fetchTaskStats
      .addCase(fetchTaskStats.pending, (state) => {
        state.isStatsLoading = true;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action: PayloadAction<TaskStats>) => {
        state.isStatsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTaskStats.rejected, (state) => {
        state.isStatsLoading = false;
      });
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setPriorityFilter,
  setSortBy,
  setSortOrder,
  setPage,
  setPageSize,
  setSelectedTask,
  resetFilters,
} = taskSlice.actions;

export default taskSlice.reducer;
