import React, { useState, Suspense, useMemo } from 'react';
import type { KanbanTask, KanbanViewProps } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { Button } from '../primitives/Button';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { filterTasks } from '../../utils/task.utils';

// Lazy load TaskModal
const TaskModal = React.lazy(() => import('./TaskModal'));

export const KanbanBoard: React.FC<KanbanViewProps> = ({
    columns,
    tasks,
    onTaskMove,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
}) => {
    // Filters State
    const [filterPriority, setFilterPriority] = useState<string[]>([]);
    // const [filterTags, setFilterTags] = useState<string[]>([]);
    // const [filterAssignee, setFilterAssignee] = useState<string[]>([]); // Removed unused
    const [searchQuery, setSearchQuery] = useState('');

    // Selection State
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<KanbanTask | undefined>(undefined);
    const [modalColumnId, setModalColumnId] = useState<string | undefined>(undefined);

    // Collapse State
    const [collapsedColumns, setCollapsedColumns] = useState<string[]>([]);

    // Drag and Drop
    const { dragState, onDragStart, onDragOver, onDrop } = useDragAndDrop(onTaskMove);

    // Derived: Filtered Tasks
    const taskList = useMemo(() => Object.values(tasks), [tasks]);

    const filteredTasks = useMemo(() => {
        return filterTasks(taskList, {
            priority: filterPriority.length ? filterPriority : undefined,
            // tags: filterTags.length ? filterTags : undefined, 
            search: searchQuery
        });
    }, [taskList, filterPriority, searchQuery]);

    // Handlers
    const handleTaskClick = (task: KanbanTask) => {
        setEditingTask(task);
        setModalColumnId(task.status);
        setIsModalOpen(true);
    };

    const handleAddTask = (columnId: string) => {
        setEditingTask(undefined);
        setModalColumnId(columnId);
        setIsModalOpen(true);
    };

    const handleSaveTask = (updates: Partial<KanbanTask>) => {
        if (editingTask) {
            onTaskUpdate(editingTask.id, updates);
        } else if (modalColumnId) {
            onTaskCreate(modalColumnId, updates as KanbanTask);
        }
    };

    const toggleTaskSelection = (taskId: string) => {
        setSelectedTaskIds(prev =>
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedTaskIds.length} tasks?`)) {
            selectedTaskIds.forEach(id => onTaskDelete(id));
            setSelectedTaskIds([]);
        }
    };

    const toggleCollapse = (colId: string) => {
        setCollapsedColumns(prev =>
            prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]
        );
    };

    return (
        <div className="flex flex-col h-full bg-white text-gray-900 font-sans" role="application" aria-label="Kanban Board">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b gap-4 bg-white sticky left-0 right-0">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 border w-full sm:w-64"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <select
                            multiple
                            className="rounded-md border border-gray-300 text-xs h-9 p-1 hidden sm:block w-32"
                            onChange={(e) => {
                                setFilterPriority(Array.from(e.target.selectedOptions, o => o.value));
                            }}
                            aria-label="Filter by priority"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {selectedTaskIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-fade-in bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                            <span className="text-sm font-medium text-blue-700">{selectedTaskIds.length} selected</span>
                            <Button variant="danger" size="sm" onClick={handleBulkDelete}>Delete All</Button>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTaskIds([])}>Cancel</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Columns Container */}
            <div
                className="flex-1 overflow-x-auto overflow-y-hidden"
                onDragOver={(e) => e.preventDefault()} // Generic allowing drop around
            >
                <div className="h-full flex flex-col sm:flex-row px-4 pb-4 pt-2 gap-4 min-w-full sm:w-max items-start">
                    {columns.map(col => {
                        const colTasks = col.taskIds
                            .map(id => tasks[id])
                            .filter(t => t && filteredTasks.includes(t)); // Ensure we only show existing and filtered

                        return (
                            <KanbanColumn
                                key={col.id}
                                column={col}
                                tasks={colTasks}
                                onAddTask={() => handleAddTask(col.id)}
                                onTaskClick={handleTaskClick}
                                draggedTaskId={dragState.draggedTaskId}
                                onDragStart={onDragStart}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                placeholderIndex={dragState.placeholderColumnId === col.id ? dragState.placeholderIndex : null}
                                showPlaceholder={dragState.placeholderColumnId === col.id}
                                selectedTaskIds={selectedTaskIds}
                                onToggleTaskSelect={toggleTaskSelection}
                                isCollapsed={collapsedColumns.includes(col.id)}
                                onToggleCollapse={() => toggleCollapse(col.id)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Edit Modal */}
            <Suspense fallback={null}>
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={editingTask}
                    columns={columns}
                    initialColumnId={modalColumnId}
                    onSave={handleSaveTask}
                    onDelete={onTaskDelete}
                />
            </Suspense>
        </div>
    );
};
