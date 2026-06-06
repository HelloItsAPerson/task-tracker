import { create } from 'zustand';
import { Task, Filter, Category } from '../types';
import { generateId, getStorageKey } from '../utils/helpers';

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  filters: Filter;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  setFilters: (filters: Filter) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  getTasks: () => Task[];
  getFilteredTasks: () => Task[];
  exportData: () => string;
  importData: (data: string) => void;
  clearData: () => void;
}

const STORAGE_KEY = 'taskflow_data';
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#6366f1', icon: '💼' },
  { id: '2', name: 'Personal', color: '#f472b6', icon: '🎯' },
  { id: '3', name: 'Shopping', color: '#fbbf24', icon: '🛒' },
  { id: '4', name: 'Health', color: '#34d399', icon: '💪' },
];

const loadFromStorage = (): { tasks: Task[]; categories: Category[] } => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load from storage:', error);
  }
  return { tasks: [], categories: DEFAULT_CATEGORIES };
};

const saveToStorage = (tasks: Task[], categories: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, categories }));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

export const useTaskStore = create<TaskStore>((set, get) => {
  const { tasks: initialTasks, categories: initialCategories } = loadFromStorage();

  return {
    tasks: initialTasks,
    categories: initialCategories,
    filters: {},
    
    addTask: (taskData) => {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: taskData.subtasks || [],
        tags: taskData.tags || [],
        dependencies: taskData.dependencies || [],
        timeSpent: taskData.timeSpent || 0,
        progress: taskData.progress || 0,
      };
      
      set((state) => {
        const newTasks = [...state.tasks, newTask];
        saveToStorage(newTasks, state.categories);
        return { tasks: newTasks };
      });
    },

    updateTask: (id, updates) => {
      set((state) => {
        const newTasks = state.tasks.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        );
        saveToStorage(newTasks, state.categories);
        return { tasks: newTasks };
      });
    },

    deleteTask: (id) => {
      set((state) => {
        const newTasks = state.tasks.filter((task) => task.id !== id);
        saveToStorage(newTasks, state.categories);
        return { tasks: newTasks };
      });
    },

    toggleTask: (id) => {
      set((state) => {
        const newTasks = state.tasks.map((task) =>
          task.id === id
            ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : 0 }
            : task
        );
        saveToStorage(newTasks, state.categories);
        return { tasks: newTasks };
      });
    },

    toggleSubtask: (taskId, subtaskId) => {
      set((state) => {
        const newTasks = state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, completed: !st.completed } : st
                ),
              }
            : task
        );
        saveToStorage(newTasks, state.categories);
        return { tasks: newTasks };
      });
    },

    setFilters: (filters) => {
      set({ filters });
    },

    addCategory: (category) => {
      const newCategory: Category = {
        ...category,
        id: generateId(),
      };

      set((state) => {
        const newCategories = [...state.categories, newCategory];
        saveToStorage(state.tasks, newCategories);
        return { categories: newCategories };
      });
    },

    deleteCategory: (id) => {
      set((state) => {
        const newCategories = state.categories.filter((cat) => cat.id !== id);
        saveToStorage(state.tasks, newCategories);
        return { categories: newCategories };
      });
    },

    getTasks: () => get().tasks,

    getFilteredTasks: () => {
      const { tasks, filters } = get();
      return tasks.filter((task) => {
        if (filters.status === 'completed' && !task.completed) return false;
        if (filters.status === 'pending' && task.completed) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.category && task.category !== filters.category) return false;
        if (filters.search) {
          const search = filters.search.toLowerCase();
          if (
            !task.title.toLowerCase().includes(search) &&
            !task.description.toLowerCase().includes(search)
          ) {
            return false;
          }
        }
        return true;
      });
    },

    exportData: () => {
      const { tasks, categories } = get();
      return JSON.stringify({ tasks, categories }, null, 2);
    },

    importData: (data: string) => {
      try {
        const parsed = JSON.parse(data);
        saveToStorage(parsed.tasks || [], parsed.categories || DEFAULT_CATEGORIES);
        set({
          tasks: parsed.tasks || [],
          categories: parsed.categories || DEFAULT_CATEGORIES,
        });
      } catch (error) {
        console.error('Failed to import data:', error);
      }
    },

    clearData: () => {
      set({ tasks: [], categories: DEFAULT_CATEGORIES });
      localStorage.removeItem(STORAGE_KEY);
    },
  };
});
