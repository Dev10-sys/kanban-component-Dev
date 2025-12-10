export interface KanbanTask {
    id: string;
    title: string;
    description?: string;
    status: string; // matches column id
    priority?: "low" | "medium" | "high" | "urgent";
    assignee?: string; // URL or initials
    tags?: string[];
    createdAt: Date;
    dueDate?: Date;
}

export interface KanbanColumn {
    id: string;
    title: string;
    color: string; // Hex or tailwind class for header accent
    taskIds: string[];
    maxTasks?: number;
}

export interface KanbanViewProps {
    columns: KanbanColumn[];
    tasks: Record<string, KanbanTask>;
    onTaskMove(taskId: string, fromColumn: string, toColumn: string, newIndex: number): void;
    onTaskCreate(columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>): void;
    // Update: The requirement says `onTaskCreate(columnId: string, task: KanbanTask): void;` but usually we pass partial. I will stick to exact requirement signature.
    // "onTaskCreate(columnId: string, task: KanbanTask): void;"
    onTaskUpdate(taskId: string, updates: Partial<KanbanTask>): void;
    onTaskDelete(taskId: string): void;
}

// Re-defining to match exact requirement signature strictly
export interface KanbanViewPropsStrict {
    columns: KanbanColumn[];
    tasks: Record<string, KanbanTask>;
    onTaskMove(taskId: string, fromColumn: string, toColumn: string, newIndex: number): void;
    onTaskCreate(columnId: string, task: KanbanTask): void;
    onTaskUpdate(taskId: string, updates: Partial<KanbanTask>): void;
    onTaskDelete(taskId: string): void;
}
