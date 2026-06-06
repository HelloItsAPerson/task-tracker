import { useState, useEffect } from 'react'
import { useTaskStore } from './store/taskStore'
import Sidebar from './components/Sidebar'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import Dashboard from './components/Dashboard'
import { Moon, Sun } from 'lucide-react'

type View = 'tasks' | 'dashboard' | 'form'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [view, setView] = useState<View>('tasks')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const tasks = useTaskStore((state) => state.getTasks())
  const categories = useTaskStore((state) => state.categories)

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onViewChange={setView}
            currentView={view}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-auto flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="px-8 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    TaskFlow
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Organize your work, achieve your goals
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="btn-icon p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-8">
              {view === 'tasks' && (
                <TaskList 
                  selectedCategory={selectedCategory}
                  onNewTask={() => setView('form')}
                />
              )}
              {view === 'dashboard' && <Dashboard />}
              {view === 'form' && (
                <div className="max-w-2xl">
                  <button
                    onClick={() => setView('tasks')}
                    className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2"
                  >
                    ← Back to Tasks
                  </button>
                  <TaskForm onSuccess={() => setView('tasks')} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
