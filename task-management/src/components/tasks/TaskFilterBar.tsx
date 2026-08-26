import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setSearchQuery,
  setStatusFilter,
  setPriorityFilter,
  setSortBy,
  setSortOrder,
  resetFilters,
} from '../../store/slices/taskSlice';
import { setViewMode } from '../../store/slices/uiSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { TaskStatus, TaskPriority, SortByOption } from '../../types/task';
import { Search, RotateCcw, LayoutGrid, List, Columns, ArrowUpDown } from 'lucide-react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export const TaskFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.tasks.filters);
  const viewMode = useAppSelector((state) => state.ui.viewMode);

  // Local state for instant feedback on typing
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  // Requirement #4: Search functionality with DEBOUNCING
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStatusFilter(e.target.value as TaskStatus | 'All'));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPriorityFilter(e.target.value as TaskPriority | 'All'));
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value as SortByOption));
  };

  const toggleSortOrder = () => {
    dispatch(setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetFilters());
  };

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-row">
        {/* Search input with debouncing */}
        <div className="search-input-wrapper flex-1">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title, description or tag..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Filter Controls */}
        <div className="filter-selects-group flex items-center gap-3">
          <Select
            label=""
            value={filters.status}
            onChange={handleStatusChange}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />

          <Select
            label=""
            value={filters.priority}
            onChange={handlePriorityChange}
            options={[
              { value: 'All', label: 'All Priorities' },
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' },
            ]}
          />

          <Select
            label=""
            value={filters.sortBy}
            onChange={handleSortByChange}
            options={[
              { value: 'dueDate', label: 'Sort by Due Date' },
              { value: 'priority', label: 'Sort by Priority' },
              { value: 'title', label: 'Sort by Title' },
              { value: 'createdAt', label: 'Sort by Created Date' },
            ]}
          />

          <button
            type="button"
            className="sort-direction-btn"
            onClick={toggleSortOrder}
            title={`Sort Order: ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown size={16} />
            <span className="text-xs uppercase font-medium">{filters.sortOrder}</span>
          </button>

          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={15} />}
            onClick={handleReset}
            title="Reset Filters"
          >
            Reset
          </Button>
        </div>

        {/* View Mode Switcher */}
        <div className="view-mode-toggle flex items-center bg-card-bg border rounded-lg p-1">
          <button
            type="button"
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => dispatch(setViewMode('grid'))}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => dispatch(setViewMode('list'))}
            title="List View"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => dispatch(setViewMode('kanban'))}
            title="Kanban Board View"
          >
            <Columns size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
