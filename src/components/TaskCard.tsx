import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { Task } from '../types'
import { Trash2, Edit2, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { formatDateShort, isOverdue, getPriorityCategoryColor, formatMinutes } from '../utils/helpers'
import TaskModal from './TaskModal'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const [showModal, setShowModal] = useState(false)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const categories = useTaskStore((state) => state.categories)

  const category = categories.find((c) => c.name === task.category)
  const isTaskOverdue = !task.completed && task.dueDate && isOverdue(task.dueDate)
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length

  return (
    <>
      <div
        className={`card p-4 hover:shadow-md transition-all cursor-pointer ${
          task.completed ? 'opacity-60' : ''
        }`}
      >
        <div className="flex gap-4">
          {/* Checkbox */}
          <button
            onClick={() => toggleTask(task.id)}
            className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0" onClick={() => setShowModal(true)}>
            <div className="flex items-start gap-2">
              <h3
                className={`font-semibold text-base flex-1 ${
                  task.completed
                    ? 'line-through text-slate-500 dark:text-slate-400'
                    : 'text-slate-900 dark:text-slate-50'
                }`}
              >
                {task.title}
              </h3>
              {isTaskOverdue && (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
            </div>

            {task.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Priority Badge */}
              <span className={`badge ${getPriorityCategoryColor(task.priority)}`}>
                {task.priority === 'high'
                  ? '🔴'
                  : task.priority === 'medium'
                  ? '🟡'
                  : '🟢'}{' '}
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              {/* Category */}
              {category && (
                <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {category.icon} {category.name}
                </span>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <span
                  className={`badge ${
                    isTaskOverdue
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  📅 {formatDateShort(task.dueDate)}
                </span>
              )}

              {/* Time Tracking */}
              {task.timeSpent > 0 && (
                <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  <Clock className="w-3 h-3" /> {formatMinutes(task.timeSpent)}
                </span>
              )}

              {/* Tags */}
              {task.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="badge bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs"
                >
                  #{tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>

            {/* Subtasks Progress */}
            {task.subtasks.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(completedSubtasks / task.subtasks.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {completedSubtasks}/{task.subtasks.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowModal(true)}
              className="btn-icon p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="btn-icon p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal task={task} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
