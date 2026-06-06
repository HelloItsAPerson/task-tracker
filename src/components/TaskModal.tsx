import { useState } from 'react'
import { Task } from '../types'
import { X, Clock, Plus } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import { formatDate, formatMinutes } from '../utils/helpers'
import { generateId } from '../utils/helpers'

interface TaskModalProps {
  task: Task
  onClose: () => void
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [timeSpent, setTimeSpent] = useState(task.timeSpent)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const handleSave = () => {
    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      timeSpent,
    })
    setIsEditing(false)
  }

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask = {
        id: generateId(),
        title: newSubtaskTitle.trim(),
        completed: false,
      }
      updateTask(task.id, {
        subtasks: [...task.subtasks, newSubtask],
      })
      setNewSubtaskTitle('')
    }
  }

  const completedSubtasks = task.subtasks.filter((st) => st.completed).length

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field mb-2"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl font-bold">{task.title}</h2>
            )}
          </div>
          <button onClick={onClose} className="btn-icon p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Description</h3>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows={4}
              />
            ) : (
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{task.description || 'No description'}</p>
            )}
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Priority</p>
              <p className="font-medium">{task.priority.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Category</p>
              <p className="font-medium">{task.category}</p>
            </div>
            {task.dueDate && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Due Date</p>
                <p className="font-medium">{formatDate(task.dueDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Created</p>
              <p className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Time Tracking */}
          <div>
            <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Time Tracking</h3>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  min="0"
                  className="input-field w-32"
                />
                <span className="text-slate-600 dark:text-slate-400">minutes</span>
              </div>
            ) : (
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatMinutes(task.timeSpent)}</span>
              </p>
            )}
            {task.timeEstimate && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Estimated: {formatMinutes(task.timeEstimate)}
              </p>
            )}
          </div>

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                Subtasks ({completedSubtasks}/{task.subtasks.length})
              </h3>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <label key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(task.id, subtask.id)}
                      className="w-4 h-4"
                    />
                    <span className={subtask.completed ? 'line-through text-slate-500' : ''}>
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add Subtask */}
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                placeholder="Add a subtask..."
                className="input-field text-sm"
              />
              <button type="button" onClick={handleAddSubtask} className="btn-primary px-3">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn-primary flex-1">
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-primary flex-1">
                Edit
              </button>
              <button onClick={onClose} className="btn-secondary flex-1">
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
