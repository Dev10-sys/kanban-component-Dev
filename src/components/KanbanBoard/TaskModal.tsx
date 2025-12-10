import React, { useState, useEffect } from 'react';
import type { KanbanTask, KanbanColumn } from './KanbanBoard.types';
import { Button } from '../primitives/Button';
import { Modal } from '../primitives/Modal';
import { Avatar } from '../primitives/Avatar';
import { format } from 'date-fns';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: KanbanTask; // If undefined, creating new
    columns: KanbanColumn[];
    onSave: (task: Partial<KanbanTask>) => void;
    onDelete?: (taskId: string) => void;
    initialColumnId?: string; // For creating new task in specific column
}

const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    task,
    columns,
    onSave,
    onDelete,
    initialColumnId,
}) => {
    const [formData, setFormData] = useState<Partial<KanbanTask>>({
        title: '',
        description: '',
        status: initialColumnId || columns[0]?.id || '',
        priority: 'medium',
        assignee: '',
        tags: [],
        dueDate: undefined,
    });

    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (task) {
                setFormData({
                    ...task,
                    dueDate: task.dueDate ? new Date(task.dueDate) : undefined
                });
            } else {
                setFormData({
                    title: '',
                    description: '',
                    status: initialColumnId || columns[0]?.id || '',
                    priority: 'medium',
                    assignee: '',
                    tags: [],
                    dueDate: undefined,
                });
            }
        }
    }, [isOpen, task, initialColumnId, columns]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(t => t !== tag)
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={task ? 'Edit Task' : 'Create Task'}
            width="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        autoFocus
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        value={formData.title || ''}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Task title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        value={formData.description || ''}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed description..."
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                            value={formData.status}
                            onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        >
                            {columns.map(col => (
                                <option key={col.id} value={col.id}>{col.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                            value={formData.priority}
                            onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                            value={formData.dueDate ? format(new Date(formData.dueDate), 'yyyy-MM-dd') : ''}
                            onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value ? new Date(e.target.value) : undefined }))}
                        />
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assignee</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                className="block w-full rounded-md border-gray-300 sm:text-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500 pl-10"
                                placeholder="Name or URL"
                                value={formData.assignee || ''}
                                onChange={e => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                            />
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <Avatar name={formData.assignee} size="sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {formData.tags?.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                            placeholder="Add tag..."
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                        />
                        <Button type="button" onClick={handleAddTag} variant="secondary" size="sm">Add</Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                        {task && onDelete && (
                            <Button type="button" variant="danger" onClick={() => {
                                if (confirm('Are you sure you want to delete this task?')) {
                                    onDelete(task.id);
                                    onClose();
                                }
                            }}>
                                Delete
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default TaskModal;
