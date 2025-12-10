import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import type { KanbanColumn as IKanbanColumn, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../primitives/Button';

interface KanbanColumnProps {
    column: IKanbanColumn;
    tasks: KanbanTask[]; // Tasks belonging to this column, ordered
    onDetailsClick?: () => void;
    onAddTask: () => void;
    onTaskClick: (task: KanbanTask) => void;

    // DnD props
    draggedTaskId: string | null;
    onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
    onDragOver: (e: React.DragEvent, columnId: string) => void;
    onDrop: (e: React.DragEvent, columnId: string) => void;
    placeholderIndex: number | null;
    showPlaceholder: boolean;

    // Bulk selection
    selectedTaskIds: string[];
    onToggleTaskSelect: (taskId: string) => void;

    isCollapsed?: boolean;
    onToggleCollapse: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    tasks,
    onAddTask,
    onTaskClick,
    draggedTaskId,
    onDragStart,
    onDragOver,
    onDrop,
    placeholderIndex,
    showPlaceholder,
    selectedTaskIds,
    onToggleTaskSelect,
    isCollapsed,
    onToggleCollapse,
}) => {
    const taskCount = tasks.length;
    const { maxTasks } = column;

    const wipStatus = useMemo(() => {
        if (!maxTasks) return 'normal';
        if (taskCount > maxTasks) return 'exceeded';
        if (taskCount >= maxTasks * 0.8) return 'near';
        return 'normal';
    }, [taskCount, maxTasks]);

    const borderColor = {
        normal: 'border-t-transparent',
        near: 'border-t-yellow-500',
        exceeded: 'border-t-red-500',
    };

    const bgHeader = {
        normal: 'bg-gray-50',
        near: 'bg-yellow-50',
        exceeded: 'bg-red-50',
    };

    if (isCollapsed) {
        return (
            <div
                className="flex-shrink-0 w-12 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 cursor-pointer hover:bg-gray-200 transition-colors h-full"
                onClick={onToggleCollapse}
                role="region"
                aria-label={`${column.title} column collapsed`}
            >
                <div className="writing-mode-vertical rotate-180 text-sm font-bold text-gray-600 whitespace-nowrap tracking-wider">
                    {column.title} ({taskCount})
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex-shrink-0 w-80 h-full flex flex-col bg-gray-50/50 border-r border-gray-200 last:border-r-0 max-h-full"
            role="region"
            aria-label={`${column.title} column`}
        >
            {/* Sticky Header */}
            <div className={clsx(
                'flex-shrink-0 px-4 py-3 border-b flex flex-col gap-2 sticky top-0 z-10 backdrop-blur-sm transition-colors',
                'border-t-4',
                borderColor[wipStatus],
                bgHeader[wipStatus]
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {column.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                            {taskCount} {maxTasks ? `/ ${maxTasks}` : ''}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button onClick={onToggleCollapse} className="text-gray-400 hover:text-gray-600 p-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6m12 0l-4-4m4 4l-4 4" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* WIP Limit warning */}
                {wipStatus === 'exceeded' && (
                    <div className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                        </svg>
                        Limit Exceeded
                    </div>
                )}
            </div>

            {/* Droppable Body */}
            <div
                className="flex-1 overflow-y-auto px-2 py-2 space-y-3 custom-scrollbar"
                onDragOver={(e) => onDragOver(e, column.id)}
                onDrop={(e) => onDrop(e, column.id)}
            >
                {tasks.map((task, index) => {
                    const isPlaceholderBefore = showPlaceholder && placeholderIndex === index;
                    return (
                        <React.Fragment key={task.id}>
                            {isPlaceholderBefore && (
                                <div className="h-24 bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-lg animate-pulse mb-3" />
                            )}
                            <KanbanCard
                                task={task}
                                isDragging={draggedTaskId === task.id}
                                onDragStart={(e) => onDragStart(e, task.id, column.id)}
                                onClick={() => onTaskClick(task)}
                                isSelected={selectedTaskIds.includes(task.id)}
                                onToggleSelect={() => onToggleTaskSelect(task.id)}
                            />
                        </React.Fragment>
                    );
                })}
                {/* Trailing placeholder if at end */}
                {showPlaceholder && placeholderIndex === tasks.length && (
                    <div className="h-24 bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-lg animate-pulse" />
                )}

                {tasks.length === 0 && !showPlaceholder && (
                    <div className="h-32 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <span className="text-xs">No tasks</span>
                    </div>
                )}
            </div>

            {/* Footer / Add Button */}
            <div className="p-3 border-t bg-gray-50">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-500 hover:text-gray-900"
                    onClick={onAddTask}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                </Button>
            </div>
        </div>
    );
};
