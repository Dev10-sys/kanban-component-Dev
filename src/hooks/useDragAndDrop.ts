import { useState, useCallback } from 'react';

interface DragState {
    isDragging: boolean;
    draggedTaskId: string | null;
    draggedColumnId: string | null; // The column the task currently belongs to
    initialColumnId: string | null; // where it started
    placeholderIndex: number | null;
    placeholderColumnId: string | null; // The column where placeholder shows
}

export const useDragAndDrop = (onTaskMove: (taskId: string, fromCol: string, toCol: string, index: number) => void) => {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedTaskId: null,
        draggedColumnId: null,
        initialColumnId: null,
        placeholderIndex: null,
        placeholderColumnId: null,
    });

    const onDragStart = useCallback((e: React.DragEvent, taskId: string, columnId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify({ taskId, columnId }));

        // Set a transparent drag image or custom one if needed/possible, 
        // but default ghost is usually fine or we hide the original.
        // For custom look, we might modify the DOM or use setDragImage.

        // setTimeout to allow the drag ghost to be created before we hide or style the source
        setTimeout(() => {
            setDragState({
                isDragging: true,
                draggedTaskId: taskId,
                draggedColumnId: columnId,
                initialColumnId: columnId,
                placeholderIndex: null,
                placeholderColumnId: null,
            });
        }, 0);
    }, []);

    const onDragOver = useCallback((e: React.DragEvent, columnId: string) => {
        e.preventDefault(); // Essential to allow dropping
        e.dataTransfer.dropEffect = 'move';

        if (!dragState.isDragging || !dragState.draggedTaskId) return;

        // Calculate insertion index
        // We can simulate this by finding the element under cursor
        const list = e.currentTarget as HTMLElement;
        // Assuming thecurrentTarget is the column body/list

        // Simple logic: find closest child
        const children = Array.from(list.children).filter(c => c.getAttribute('data-task-id'));
        let newIndex = children.length;

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            const rect = child.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            if (e.clientY < midY) {
                newIndex = i;
                break;
            }
        }

        // Don't update if same
        if (dragState.placeholderColumnId === columnId && dragState.placeholderIndex === newIndex) {
            return;
        }

        setDragState(prev => ({
            ...prev,
            placeholderColumnId: columnId,
            placeholderIndex: newIndex,
        }));
    }, [dragState.isDragging, dragState.draggedTaskId, dragState.placeholderColumnId, dragState.placeholderIndex]);

    const onDrop = useCallback((e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        const { draggedTaskId, initialColumnId, placeholderIndex } = dragState;

        if (draggedTaskId && initialColumnId && placeholderIndex !== null) {
            onTaskMove(draggedTaskId, initialColumnId, columnId, placeholderIndex);
        }

        // Reset
        setDragState({
            isDragging: false,
            draggedTaskId: null,
            draggedColumnId: null,
            initialColumnId: null,
            placeholderIndex: null,
            placeholderColumnId: null,
        });
    }, [dragState, onTaskMove]);

    const onDragEnd = useCallback(() => {
        setDragState({
            isDragging: false,
            draggedTaskId: null,
            draggedColumnId: null,
            initialColumnId: null,
            placeholderIndex: null,
            placeholderColumnId: null,
        });
    }, []);

    return {
        dragState,
        onDragStart,
        onDragOver,
        onDrop,
        onDragEnd,
    };
};
