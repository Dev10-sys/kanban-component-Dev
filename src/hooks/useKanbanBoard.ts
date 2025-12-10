import { useState, useCallback } from 'react';
import type { KanbanColumn, KanbanTask } from '../components/KanbanBoard/KanbanBoard.types';
import { reorderList, moveTaskBetweenColumns } from '../utils/column.utils';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface UseKanbanBoardProps {
    initialColumns?: KanbanColumn[];
    initialTasks?: Record<string, KanbanTask>;
}

export const useKanbanBoard = ({ initialColumns, initialTasks }: UseKanbanBoardProps = {}) => {
    const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns || []);
    const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks || {});

    const handleTaskMove = useCallback((taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
        setColumns((prevColumns) => {
            const sourceColIndex = prevColumns.findIndex((col) => col.id === fromColumnId);
            const destColIndex = prevColumns.findIndex((col) => col.id === toColumnId);

            if (sourceColIndex === -1 || destColIndex === -1) return prevColumns;

            const sourceCol = prevColumns[sourceColIndex];
            const destCol = prevColumns[destColIndex];

            // Moving within the same column
            if (fromColumnId === toColumnId) {
                const sourceIndex = sourceCol.taskIds.indexOf(taskId);
                if (sourceIndex === -1) return prevColumns; // Safety check

                const newTaskIds = reorderList(sourceCol.taskIds, sourceIndex, newIndex);

                const newColumns = [...prevColumns];
                newColumns[sourceColIndex] = { ...sourceCol, taskIds: newTaskIds };
                return newColumns;
            }

            // Moving to different column
            const sourceIndex = sourceCol.taskIds.indexOf(taskId);
            if (sourceIndex === -1) return prevColumns;

            const { sourceTaskIds, destTaskIds } = moveTaskBetweenColumns(
                sourceCol.taskIds,
                destCol.taskIds,
                sourceIndex,
                newIndex,
                taskId
            );

            const newColumns = [...prevColumns];
            newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
            newColumns[destColIndex] = { ...destCol, taskIds: destTaskIds };

            return newColumns;
        });

        // Update task status if column changed
        if (fromColumnId !== toColumnId) {
            setTasks((prev) => ({
                ...prev,
                [taskId]: { ...prev[taskId], status: toColumnId }
            }));
        }
    }, []);

    const handleTaskCreate = useCallback((columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => { // Internal helper uses Omit, externally we might cast or change
        const newId = generateId();
        const newTask: KanbanTask = {
            ...task,
            id: newId,
            createdAt: new Date(),
            status: columnId,
        };

        setTasks((prev) => ({ ...prev, [newId]: newTask }));
        setColumns((prev) =>
            prev.map((col) =>
                col.id === columnId ? { ...col, taskIds: [...col.taskIds, newId] } : col
            )
        );
    }, []);

    const handleTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
        setTasks((prev) => ({
            ...prev,
            [taskId]: { ...prev[taskId], ...updates }
        }));
    }, []);

    const handleTaskDelete = useCallback((taskId: string) => {
        setTasks((prev) => {
            const newTasks = { ...prev };
            delete newTasks[taskId];
            return newTasks;
        });

        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                taskIds: col.taskIds.filter((id) => id !== taskId)
            }))
        );
    }, []);

    const setEntireState = useCallback((cols: KanbanColumn[], taskMap: Record<string, KanbanTask>) => {
        setColumns(cols);
        setTasks(taskMap);
    }, []);

    return {
        columns,
        tasks,
        setColumns,
        handleTaskMove,
        handleTaskCreate,
        handleTaskUpdate,
        handleTaskDelete,
        setEntireState
    };
};
