import React from 'react';
import { clsx } from 'clsx';
import type { KanbanTask } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';
import { formatDueDate, isOverdue } from '../../utils/task.utils';

interface KanbanCardProps {
    task: KanbanTask;
    onClick?: () => void;
    onDragStart?: (e: React.DragEvent) => void;
    isDragging?: boolean;
    style?: React.CSSProperties;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
    task,
    onClick,
    onDragStart,
    isDragging,
    style,
    isSelected,
    onToggleSelect,
}) => {
    const priorityColors = {
        low: 'border-l-priority-low',
        medium: 'border-l-priority-medium',
        high: 'border-l-priority-high',
        urgent: 'border-l-priority-urgent',
    };

    const priorityBadges = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800',
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={clsx(
                'group relative flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md cursor-grab active:cursor-grabbing focus:ring-2 focus:ring-primary-500 focus:outline-none select-none',
                task.priority ? `border-l-4 ${priorityColors[task.priority]}` : 'border-l-4 border-l-gray-300',
                isDragging && 'opacity-50',
                isSelected && 'ring-2 ring-primary-500 bg-primary-50'
            )}
            style={style}
            draggable={!isDragging} // Prevent dragging the ghost itself if handled specially, but usually true
            onDragStart={onDragStart}
            onClick={(e) => {
                if (!e.defaultPrevented) onClick?.();
            }}
            data-task-id={task.id}
            aria-label={`Task: ${task.title}`}
        >
            <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {task.title}
                </h4>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelect?.();
                    }}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 opacity-0 group-hover:opacity-100 transition-opacity aria-selected:opacity-100"
                    aria-selected={isSelected}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {task.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex flex-wrap gap-1">
                {task.priority && (
                    <span className={clsx(
                        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide',
                        priorityBadges[task.priority]
                    )}>
                        {task.priority}
                    </span>
                )}
                {task.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                    <Avatar name={task.assignee} src={task.assignee?.includes('http') ? task.assignee : undefined} size="sm" />
                    {/* If assignee is just name/initials, src is undefined. If url, use it. */}
                </div>

                {task.dueDate && (
                    <div className={clsx(
                        'flex items-center text-xs font-medium',
                        isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-400'
                    )}>
                        <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDueDate(task.dueDate)}
                    </div>
                )}
            </div>
        </div>
    );
};
