import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTaskStats, fetchTasks } from '../store/slices/taskSlice';
import { setCreateModalOpen, setDetailModalOpen } from '../store/slices/uiSlice';
import { setSelectedTask, createNewTask } from '../store/slices/taskSlice';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { PriorityDistributionChart } from '../components/dashboard/PriorityDistributionChart';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { Button } from '../components/common/Button';
import { Plus, ArrowRight } from 'lucide-react';
import { Task, CreateTaskPayload, TaskStats } from '../types/task';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { stats, tasks, isStatsLoading, selectedTask, totalTasks } = useAppSelector((state) => state.tasks);
  const { isCreateModalOpen, isDetailModalOpen } = useAppSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchTaskStats());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Derive live statistics: strictly calculated from actual database tasks
  const liveStats: TaskStats = useMemo(() => {
    const actualTotal = totalTasks !== undefined && totalTasks > 0 ? totalTasks : tasks.length;
    
    // If backend stats are available and match the active tasks count, use them
    if (stats && stats.total === actualTotal) {
      return stats;
    }

    // Dynamic direct calculation to prevent any stale/phantom mock numbers
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const highPriority = tasks.filter((t) => t.priority === 'High').length;
    const completionRate = actualTotal > 0 ? Math.round((completed / actualTotal) * 100) : 0;

    return {
      total: actualTotal,
      pending,
      inProgress,
      completed,
      highPriority,
      completionRate,
    };
  }, [stats, tasks, totalTasks]);

  // Priority Distribution calculation strictly from active tasks
  const priorityCounts = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return { high: 0, medium: 0, low: 0, total: 0 };
    }
    const high = tasks.filter((t) => t.priority === 'High').length;
    const medium = tasks.filter((t) => t.priority === 'Medium').length;
    const low = tasks.filter((t) => t.priority === 'Low').length;
    return { high, medium, low, total: tasks.length };
  }, [tasks]);

  const handleViewTask = useCallback(
    (task: Task) => {
      dispatch(setSelectedTask(task));
      dispatch(setDetailModalOpen(true));
    },
    [dispatch]
  );

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    await dispatch(createNewTask(payload)).unwrap();
  };

  return (
    <div className="dashboard-page space-y-6">
      {/* Welcome & Action Banner */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold">Project Dashboard</h1>
          <p className="page-subtitle text-muted text-sm">
            Real-time project overview, task status metrics, and task activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/tasks')}
            icon={<ArrowRight size={16} />}
          >
            Manage Tasks
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(setCreateModalOpen(true))}
            icon={<Plus size={16} />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Requirement #2: Metrics Cards Overview */}
      <MetricsOverview stats={liveStats} isLoading={isStatsLoading} />

      {/* Analytics Breakdown & Recent Tasks Feed */}
      <div className="dashboard-content-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PriorityDistributionChart
            highCount={priorityCounts.high}
            mediumCount={priorityCounts.medium}
            lowCount={priorityCounts.low}
            total={priorityCounts.total}
          />
        </div>

        <div className="lg:col-span-2">
          <RecentActivityFeed tasks={tasks} onViewTask={handleViewTask} />
        </div>
      </div>

      {/* Create Task Modal */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => dispatch(setCreateModalOpen(false))}
        onSubmit={handleCreateTask}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => dispatch(setDetailModalOpen(false))}
        task={selectedTask}
        onEdit={(task) => {
          dispatch(setSelectedTask(task));
          navigate('/tasks');
        }}
        onDelete={(task) => {
          dispatch(setSelectedTask(task));
          navigate('/tasks');
        }}
      />
    </div>
  );
};
