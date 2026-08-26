import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../components/tasks/TaskCard';
import { Task } from '../types/task';

const mockTask: Task = {
  id: 'task-test-1',
  title: 'Implement OAuth 2.0 Flow',
  description: 'Add secure token authentication and session expiry handling.',
  assignedUser: {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex@company.com',
  },
  priority: 'High',
  status: 'In Progress',
  dueDate: '2026-08-30',
  createdAt: '2026-08-20T00:00:00.000Z',
  tags: ['Security', 'Auth'],
};

describe('TaskCard Component', () => {
  it('renders task title, priority badge, and assigned user name correctly', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleView = vi.fn();
    const handleStatusChange = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onStatusChange={handleStatusChange}
      />
    );

    expect(screen.getByText('Implement OAuth 2.0 Flow')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
  });

  it('triggers onView callback when view button or card body is clicked', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleView = vi.fn();
    const handleStatusChange = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onStatusChange={handleStatusChange}
      />
    );

    const titleElement = screen.getByText('Implement OAuth 2.0 Flow');
    fireEvent.click(titleElement);

    expect(handleView).toHaveBeenCalledWith(mockTask);
  });
});
