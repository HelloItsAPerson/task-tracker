import { useTaskStore } from '../store/taskStore'
import { calculateStats } from '../utils/helpers'
import { TrendingUp, CheckCircle2, AlertCircle, Zap } from 'lucide-react'

export default function Dashboard() {
  const tasks = useTaskStore((state) => state.getTasks())
  const stats = calculateStats(tasks)

  const categoryStats = tasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { total: 0, completed: 0 }
      }
      acc[task.category].total += 1
      if (task.completed) acc[task.category].completed += 1
      return acc
    },
    {} as { [key: string]: { total: number; completed: number } }
  )

  const priorityStats = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },
    {} as { [key: string]: number }
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Track your productivity and task progress</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <Zap className="w-12 h-12 text-primary-500 opacity-20" />
          </div>
        </div>

        {/* Completed */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        {/* Pending */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2 text-amber-600 dark:text-amber-400">{stats.pending}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-amber-500 opacity-20" />
          </div>
        </div>

        {/* Overdue */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">{stats.overdue}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Completion Rate</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 min-w-fit">
            {stats.completionRate}%
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        <div className="space-y-3">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">{category}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stats.completed}/{stats.total}
                </p>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">By Priority</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-medium">🔴 High</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
              {priorityStats['high'] || 0}
            </p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-amber-600 dark:text-amber-400 font-medium">🟡 Medium</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {priorityStats['medium'] || 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-600 dark:text-green-400 font-medium">🟢 Low</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {priorityStats['low'] || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
