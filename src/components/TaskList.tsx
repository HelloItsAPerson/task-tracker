import { useState, useMemo } from 'react'
import { useTaskStore } from '../store/taskStore'
import TaskCard from './TaskCard'
import SearchBar from './SearchBar'
import { ChevronDown } from 'lucide-react'

interface TaskListProps {
  selectedCategory: string
  onNewTask: () => void
}

type SortBy = 'dueDate' | 'priority' | 'created' | 'progress'

export default function TaskList({ selectedCategory, onNewTask }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('dueDate')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['pending']))
  
  const tasks = useTaskStore((state) => state.getTasks())
  const setFilters = useTaskStore((state) => state.setFilters)

  const filteredTasks = useMemo(() => {
    let result = tasks

    // Filter by category
    if (selectedCategory === 'completed') {
      result = result.filter((t) => t.completed)
    } else if (selectedCategory === 'all') {
      result = result.filter((t) => !t.completed)
    } else {
      result = result.filter((t) => t.category === selectedCategory && !t.completed)
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'progress':
          return b.progress - a.progress
        default:
          return 0
      }
    })

    return sorted
  }, [tasks, selectedCategory, searchQuery, sortBy])

  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: typeof filteredTasks } = {}

    filteredTasks.forEach((task) => {
      let group = 'other'
      if (task.dueDate) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        if (dueDate < today) {
          group = 'overdue'
        } else if (dueDate.getTime() === today.getTime()) {
          group = 'today'
        } else {
          group = 'upcoming'
        }
      }
      if (!groups[group]) groups[group] = []
      groups[group].push(task)
    })

    return groups
  }, [filteredTasks])

  const groupOrder = ['overdue', 'today', 'upcoming', 'other']
  const sortedGroups = groupOrder.filter((g) => g in groupedTasks)

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  const getGroupLabel = (group: string): string => {
    const labels: { [key: string]: string } = {
      overdue: '⚠️ Overdue',
      today: '📋 Today',
      upcoming: '📅 Upcoming',
      other: '🎯 No Due Date',
    }
    return labels[group] || group
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="input-field appearance-none pr-10"
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="created">Sort: Created</option>
              <option value="progress">Sort: Progress</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-500" />
          </div>
        </div>
      </div>

      {/* Task Groups */}
      {sortedGroups.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">No tasks found</p>
          <button onClick={onNewTask} className="btn-primary">
            Create your first task
          </button>
        </div>
      ) : (
        sortedGroups.map((group) => (
          <div key={group}>
            <button
              onClick={() => toggleGroup(group)}
              className="flex items-center gap-2 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg w-full mb-2 transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 text-slate-500 transition-transform ${
                  expandedGroups.has(group) ? '' : '-rotate-90'
                }`}
              />
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                {getGroupLabel(group)}
              </h2>
              <span className="ml-auto bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                {groupedTasks[group]?.length || 0}
              </span>
            </button>

            {expandedGroups.has(group) && (
              <div className="space-y-3 pl-4">
                {groupedTasks[group]?.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
