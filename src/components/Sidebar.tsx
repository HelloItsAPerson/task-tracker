import { useTaskStore } from '../store/taskStore'
import { Plus, LayoutGrid, BarChart3, Settings } from 'lucide-react'

interface SidebarProps {
  selectedCategory: string
  onCategorySelect: (category: string) => void
  onViewChange: (view: 'tasks' | 'dashboard' | 'form') => void
  currentView: string
}

export default function Sidebar({
  selectedCategory,
  onCategorySelect,
  onViewChange,
  currentView,
}: SidebarProps) {
  const categories = useTaskStore((state) => state.categories)
  const tasks = useTaskStore((state) => state.getTasks())

  const getTaskCountByCategory = (categoryName: string): number => {
    if (categoryName === 'all') return tasks.filter((t) => !t.completed).length
    if (categoryName === 'completed') return tasks.filter((t) => t.completed).length
    return tasks.filter((t) => t.category === categoryName && !t.completed).length
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">✨ TaskFlow</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onViewChange('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              currentView === 'tasks'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Tasks
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              currentView === 'dashboard'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
        </div>

        {/* Categories */}
        <div>
          <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Categories
          </h3>
          <button
            onClick={() => onCategorySelect('all')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            All Tasks
            <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
              {getTaskCountByCategory('all')}
            </span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.name)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
              <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
                {getTaskCountByCategory(category.name)}
              </span>
            </button>
          ))}

          <button
            onClick={() => onCategorySelect('completed')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'completed'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="text-lg">✓</span>
            Completed
            <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
              {getTaskCountByCategory('completed')}
            </span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onViewChange('form')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>
    </aside>
  )
}
