export interface ValidationErrors {
  [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateTaskForm = (data: {
  title: string;
  description: string;
  dueDate: string;
  assignedUserId: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Task title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Task title must be at least 3 characters long';
  }

  if (!data.description || !data.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.dueDate) {
    errors.dueDate = 'Due date is required';
  }

  if (!data.assignedUserId) {
    errors.assignedUserId = 'Please assign a team member';
  }

  return errors;
};
