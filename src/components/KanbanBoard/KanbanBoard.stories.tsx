import type { Meta, StoryObj } from '@storybook/react';

import { KanbanBoard } from './KanbanBoard';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';

const meta: Meta<typeof KanbanBoard> = {
    title: 'Components/KanbanBoard',
    component: KanbanBoard,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;

// --- Mock Data ---

const initialColumns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: '#3b82f6', taskIds: ['t1', 't2', 't3'] },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', taskIds: ['t4'], maxTasks: 3 },
    { id: 'review', title: 'Review', color: '#8b5cf6', taskIds: [] },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: ['t5'] },
];

const initialTasks: Record<string, KanbanTask> = {
    t1: { id: 't1', title: 'Research competitors', description: 'Analyze top 3 competitors in the market.', status: 'todo', priority: 'high', createdAt: new Date(), assignee: 'JD', tags: ['Strategy'] },
    t2: { id: 't2', title: 'Draft product roadmap', status: 'todo', priority: 'medium', createdAt: new Date(), dueDate: new Date(Date.now() + 86400000), assignee: 'https://i.pravatar.cc/150?u=1' },
    t3: { id: 't3', title: 'Update dependencies', status: 'todo', priority: 'low', createdAt: new Date(), tags: ['Dev', 'Maintenance'] },
    t4: { id: 't4', title: 'Implement drag and drop', description: 'Use HTML5 API.', status: 'in-progress', priority: 'urgent', createdAt: new Date(), assignee: 'Me' },
    t5: { id: 't5', title: 'Setup Repo', status: 'done', priority: 'medium', createdAt: new Date() },
};

// --- Wrapper for state management ---

const BoardWrapper = ({
    initialCols = initialColumns,
    initialTsk = initialTasks
}) => {
    const {
        columns,
        tasks,
        handleTaskMove,
        handleTaskCreate,
        handleTaskUpdate,
        handleTaskDelete
    } = useKanbanBoard({ initialColumns: initialCols, initialTasks: initialTsk });

    return (
        <div className="h-screen w-full bg-gray-100 p-4">
            <KanbanBoard
                columns={columns}
                tasks={tasks}
                onTaskMove={handleTaskMove}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
            />
        </div>
    );
};

// --- Stories ---

export const Default: StoryObj<typeof KanbanBoard> = {
    render: () => <BoardWrapper />,
};

export const Empty: StoryObj<typeof KanbanBoard> = {
    render: () => <BoardWrapper initialCols={initialColumns.map(c => ({ ...c, taskIds: [] }))} initialTsk={{}} />,
};

// Large Dataset Generator
const generateLargeDataset = () => {
    const cols = JSON.parse(JSON.stringify(initialColumns));
    const tasks: Record<string, KanbanTask> = {};

    // Clear initial tasks
    cols.forEach((c: any) => c.taskIds = []);

    for (let i = 0; i < 50; i++) {
        const id = `task-${i}`;
        const colIndex = i % 4;
        const colId = cols[colIndex].id;
        cols[colIndex].taskIds.push(id);

        tasks[id] = {
            id,
            title: `Task ${i} - Generated Content`,
            description: i % 3 === 0 ? 'Lorem ipsum dolor sit amet.' : undefined,
            status: colId,
            priority: ['low', 'medium', 'high', 'urgent'][i % 4] as any,
            createdAt: new Date(),
            assignee: i % 2 === 0 ? 'User' : undefined,
            tags: i % 5 === 0 ? ['Bulk'] : [],
        };
    }
    return { cols, tasks };
};

export const LargeDataset: StoryObj<typeof KanbanBoard> = {
    render: () => {
        const { cols, tasks } = generateLargeDataset();
        return <BoardWrapper initialCols={cols} initialTsk={tasks} />;
    },
};

export const MobileView: StoryObj<typeof KanbanBoard> = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    render: () => <BoardWrapper />,
};

export const InteractivePlayground: StoryObj<any> = {
    argTypes: {
        columnCount: { control: { type: 'range', min: 2, max: 6, step: 1 } },
        addCannedTask: { action: 'clicked' },
    },
    render: (args: any) => {
        // This is a bit tricky to control via args cleanly without remounting, 
        // but we can simulate passing fresh props to a key-ed wrapper

        const dynamicCols = Array.from({ length: args.columnCount || 4 }, (_, i) => ({
            id: `col-${i}`,
            title: `Column ${i + 1}`,
            color: ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#6366f1'][i],
            taskIds: [],
        }));

        return (
            <BoardWrapper
                key={args.columnCount} // Remount on count change
                initialCols={dynamicCols}
                initialTsk={{}}
            />
        );
    },
    args: {
        columnCount: 4,
    }
};
