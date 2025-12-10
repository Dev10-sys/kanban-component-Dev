import React from 'react'
import ReactDOM from 'react-dom/client'
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard'
import { useKanbanBoard } from './hooks/useKanbanBoard'
import type { KanbanColumn, KanbanTask } from './components/KanbanBoard/KanbanBoard.types'
import './styles/globals.css'

// Demo Data
const initialColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#3b82f6', taskIds: ['t1', 't2'] },
  { id: 'doing', title: 'In Progress', color: '#f59e0b', taskIds: ['t3'], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: ['t4'] },
];

const initialTasks: Record<string, KanbanTask> = {
  t1: { id: 't1', title: 'Welcome to Kanban', description: 'Drag me to another column!', status: 'todo', priority: 'low', createdAt: new Date() },
  t2: { id: 't2', title: 'Try editing me', description: 'Click to open the modal.', status: 'todo', priority: 'medium', createdAt: new Date(), tags: ['Onboarding'] },
  t3: { id: 't3', title: 'WIP Limits', description: 'This column has a limit of 3.', status: 'doing', priority: 'high', createdAt: new Date(), assignee: 'Dev' },
  t4: { id: 't4', title: 'You did it!', status: 'done', priority: 'urgent', createdAt: new Date() },
};

const App = () => {
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete
  } = useKanbanBoard({ initialColumns, initialTasks });

  return (
    <div className="h-screen w-screen bg-gray-100 overflow-hidden">
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
