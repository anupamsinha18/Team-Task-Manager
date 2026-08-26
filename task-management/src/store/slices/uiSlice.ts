import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastMessage } from '../../types/common';

export type ViewMode = 'grid' | 'list' | 'kanban';

interface UiState {
  toasts: ToastMessage[];
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailModalOpen: boolean;
  viewMode: ViewMode;
}

const initialState: UiState = {
  toasts: [],
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDetailModalOpen: false,
  viewMode: 'grid',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      state.toasts.push({ id, ...action.payload });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isCreateModalOpen = action.payload;
    },
    setEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isEditModalOpen = action.payload;
    },
    setDetailModalOpen(state, action: PayloadAction<boolean>) {
      state.isDetailModalOpen = action.payload;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  setCreateModalOpen,
  setEditModalOpen,
  setDetailModalOpen,
  setViewMode,
} = uiSlice.actions;

export default uiSlice.reducer;
