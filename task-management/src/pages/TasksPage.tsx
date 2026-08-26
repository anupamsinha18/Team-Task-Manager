import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchTasks,
  setPage,
  setPageSize,
  setSelectedTask,
  createNewTask,
  updateExistingTask,
  updateStatusQuick,
  deleteTaskById,
} from '../store/slices/taskSlice';
import {
  setCreateModalOpen,
  setEditModalOpen,
  setDetailModalOpen,
  addToast,
} from '../store/slices/uiSlice';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskGrid } from '../components/tasks/TaskGrid';
import { TaskList } from '../components/tasks/TaskList';
import { TaskKanban } from '../components/tasks/TaskKanban';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Plus } from 'lucide-react';
import { Task, TaskStatus, CreateTaskPayload } from '../types/task';

export const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    tasks,
    totalTasks,
    totalPages,
    isLoading,
    selectedTask,
    filters,
  } = useAppSelector((state) => state.tasks);

  const { isCreateModalOpen, isEditModalOpen, isDetailModalOpen, viewMode } = useAppSelector(
    (state) => state.ui
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [
    dispatch,
    filters.searchQuery,
    filters.status,
    filters.priority,
    filters.sortBy,
    filters.sortOrder,
    filters.currentPage,
    filters.pageSize,
  ]);

  // Handlers memoized with useCallback
  const handleEditClick = useCallback(
    (task: Task) => {
      dispatch(setSelectedTask(task));
      dispatch(setEditModalOpen(true));
    },
    [dispatch]
  );

  const handleDeleteClick = useCallback((task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }, []);

  const handleViewClick = useCallback(
    (task: Task) => {
      dispatch(setSelectedTask(task));
      dispatch(setDetailModalOpen(true));
    },
    [dispatch]
  );

  const handleStatusChange = useCallback(
    async (id: string, newStatus: TaskStatus) => {
      try {
        await dispatch(updateStatusQuick({ id, status: newStatus })).unwrap();
        dispatch(
          addToast({
            type: 'success',
            title: 'Status Updated',
            message: `Task status changed to ${newStatus}.`,
          })
        );
      } catch (err: any) {
        dispatch(
          addToast({
            type: 'error',
            title: 'Update Failed',
            message: err || 'Could not update status',
          })
        );
      }
    },
    [dispatch]
  );

  const handleCreateSubmit = async (payload: CreateTaskPayload) => {
    try {
      await dispatch(createNewTask(payload)).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Task Created',
          message: `"${payload.title}" has been successfully added.`,
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Creation Failed',
          message: err || 'Failed to create task',
        })
      );
      throw err;
    }
  };

  const handleEditSubmit = async (payload: CreateTaskPayload) => {
    if (!selectedTask) return;
    try {
      await dispatch(updateExistingTask({ ...payload, id: selectedTask.id })).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Task Updated',
          message: `"${payload.title}" updated successfully.`,
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: err || 'Failed to update task',
        })
      );
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await dispatch(deleteTaskById(taskToDelete.id)).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Task Deleted',
          message: `Task "${taskToDelete.title}" was removed.`,
        })
      );
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Deletion Failed',
          message: err || 'Failed to delete task',
        })
      );
    }
  };

  return (
    <div className="tasks-page space-y-6">
      {/* Header section */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold">Task Management</h1>
          <p className="page-subtitle text-muted text-sm">
            Search, filter, sort, and manage all your project deliverables in one workspace.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => dispatch(setCreateModalOpen(true))}
          icon={<Plus size={18} />}
        >
          Create Task
        </Button>
      </div>

      {/* Requirement #4: Debounced Search, Filters, Sorting & View Toggle */}
      <TaskFilterBar />

      {/* Task Views: Grid | List | Kanban */}
      {viewMode === 'grid' && (
        <TaskGrid
          tasks={tasks}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          onStatusChange={handleStatusChange}
          onCreateNew={() => dispatch(setCreateModalOpen(true))}
        />
      )}

      {viewMode === 'list' && (
        <TaskList
          tasks={tasks}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          onStatusChange={handleStatusChange}
        />
      )}

      {viewMode === 'kanban' && (
        <TaskKanban
          tasks={tasks}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Requirement #4: Pagination */}
      {viewMode !== 'kanban' && (
        <Pagination
          currentPage={filters.currentPage}
          totalPages={totalPages}
          totalItems={totalTasks}
          pageSize={filters.pageSize}
          onPageChange={(page) => dispatch(setPage(page))}
          onPageSizeChange={(size) => dispatch(setPageSize(size))}
        />
      )}

      {/* Create Task Modal */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => dispatch(setCreateModalOpen(false))}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Task Modal */}
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => dispatch(setEditModalOpen(false))}
        onSubmit={handleEditSubmit}
        initialTask={selectedTask}
      />

      {/* View Task Details Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => dispatch(setDetailModalOpen(false))}
        task={selectedTask}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Task Confirmation"
        message={`Are you sure you want to permanently delete task "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
      />
    </div>
  );
};
