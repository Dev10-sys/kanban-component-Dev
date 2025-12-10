import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import type { KanbanTask } from '../components/KanbanBoard/KanbanBoard.types';

export const formatDueDate = (date?: Date | string): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM d');
};

export const isOverdue = (date?: Date | string): boolean => {
    if (!date) return false;
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isPast(d) && !isToday(d);
};

export const filterTasks = (
    tasks: KanbanTask[],
    filters: {
        priority?: string[];
        tags?: string[];
        assignee?: string[];
        search?: string;
    }
): KanbanTask[] => {
    return tasks.filter(task => {
        if (filters.priority?.length && task.priority && !filters.priority.includes(task.priority)) return false;
        if (filters.tags?.length && (!task.tags || !task.tags.some(t => filters.tags!.includes(t)))) return false;
        if (filters.assignee?.length && (!task.assignee || !filters.assignee.includes(task.assignee))) return false;
        if (filters.search) {
            const q = filters.search.toLowerCase();
            if (!task.title.toLowerCase().includes(q) && !task.description?.toLowerCase().includes(q)) return false;
        }
        return true;
    });
};
