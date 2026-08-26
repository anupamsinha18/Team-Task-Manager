import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, CreateTaskPayload } from '../../types/task';
import { MOCK_USERS } from '../../services/mockData';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateTaskForm, ValidationErrors } from '../../utils/validators';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  initialTask?: Task | null;
  isLoading?: boolean;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  isLoading = false,
}) => {
  const isEditing = !!initialTask;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedUserId, setAssignedUserId] = useState(MOCK_USERS[0].id);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setAssignedUserId(initialTask.assignedUser.id);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDueDate(initialTask.dueDate);
      setTags(initialTask.tags || []);
    } else {
      // Default reset
      setTitle('');
      setDescription('');
      setAssignedUserId(MOCK_USERS[0].id);
      setPriority('Medium');
      setStatus('Pending');

      // Default due date: 7 days from today
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDueDate(defaultDate.toISOString().split('T')[0]);
      setTags(['Feature']);
    }
    setErrors({});
  }, [initialTask, isOpen]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTaskForm({ title, description, dueDate, assignedUserId });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        assignedUserId,
        priority,
        status,
        dueDate,
        tags,
      });
      onClose();
    } catch {
      // Handled by parent container / toast
    }
  };

  const userOptions = MOCK_USERS.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.role})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="task-form space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Implement OAuth 2.0 Auth Flow"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
          required
        />

        <div className="input-group">
          <label className="input-label">Task Description</label>
          <textarea
            className={`input-field textarea-field ${errors.description ? 'input-error' : ''}`}
            placeholder="Detailed description of deliverables and acceptance criteria..."
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
          />
          {errors.description && <span className="input-error-message">{errors.description}</span>}
        </div>

        <div className="form-row-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Assigned Team Member"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            options={userOptions}
            error={errors.assignedUserId}
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
            required
          />
        </div>

        <div className="form-row-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
          />

          <Select
            label="Current Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />
        </div>

        {/* Tags management */}
        <div className="input-group">
          <label className="input-label">Tags / Labels</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tag (e.g. Security, Frontend)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="tags-chip-list flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="tag-pill tag-pill-removable">
                #{tag}
                <button
                  type="button"
                  className="tag-remove-btn ml-1"
                  onClick={() => handleRemoveTag(tag)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="modal-actions flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
