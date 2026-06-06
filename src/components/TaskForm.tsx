import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { Task, Subtask } from '../types'
import { Plus, X } from 'lucide-react'
import { generateId } from '../utils/helpers'

interface TaskFormProps {
  task?: Task
  onSuccess: () => void
}

export default function TaskForm({ task, onSuccess }: TaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const categories = useTaskStore((state) => state.categories)

  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [category, setCategory] = useState(task?.category || categories[0]?.name || '')
  const [dueDate, setDueDate] = useState(task?.dueDate || '')
  const [tags, setTags] = useState(task?.tags.join(', ') || '')
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || [])
  const [newSubtask, setNewSubtask] = useState('')
  const [timeEstimate, setTimeEstimate] = useState(task?.timeEstimate || 0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!category) newErrors.category = 'Category is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority: priority as 'low' | 'medium' | 'high',
      category,
      dueDate: dueDate || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
      subtasks,
      timeEstimate: timeEstimate || undefined,
      completed: task?.completed || false,
      dependencies: task?.dependencies || [],
      timeSpent: task?.timeSpent || 0,
      progress: task?.progress || 0,
    }

    if (task) {
      updateTask(task.id, taskData)
    } else {
      addTask(taskData)
    }

    onSuccess()
  }

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: generateId(), title: newSubtask, completed: false }])
      setNewSubtask('')
    }
  }

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id))
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">{task ? 'Edit Task' : 'Create New Task'}</h1>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Task Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="input-field"
          />
          {errors.title && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            rows={4}
            className="input-field"
          />
        </div>

        {/* Priority & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field">
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Due Date & Time Estimate */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Estimate (minutes)</label>
            <input
              type="number"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(Number(e.target.value))}
              placeholder="0"
              min="0"
              className="input-field"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Separate tags with commas (e.g. urgent, bugfix, feature)"
            className="input-field"
          />
        </div>

        {/* Subtasks */}
        <div>
          <label className="block text-sm font-medium mb-2">Subtasks</label>
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <input type="checkbox" checked={subtask.completed} readOnly className="w-4 h-4" />
                <span className={subtask.completed ? 'line-through text-slate-500' : ''}>{subtask.title}</span>
                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="ml-auto btn-icon p-1"
                >
                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                placeholder="Add a subtask..."
                className="input-field text-sm"
              />
              <button type="button" onClick={addSubtask} className="btn-primary px-3">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 mt-8">
        <button type="submit" className="btn-primary flex-1">
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
