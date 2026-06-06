# ✨ TaskFlow - Modern Task Tracking Application

A beautiful, feature-rich task management application built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

### Core Features
- ✅ **Create, Read, Update, Delete Tasks** - Full CRUD operations
- 📝 **Rich Descriptions** - Add detailed information to each task
- 🎯 **Priority Levels** - High, Medium, Low priority organization
- 📅 **Due Dates & Time Tracking** - Set deadlines and track time spent
- 🏷️ **Categories & Tags** - Organize tasks by project, area, or custom tags
- ✓ **Subtasks** - Break down complex tasks into smaller steps
- 🔗 **Task Dependencies** - Set which tasks must be completed first
- 📊 **Progress Tracking** - Visual progress indicators and completion stats
- 🔄 **Recurring Tasks** - Daily, weekly, monthly automated tasks
- 🔍 **Advanced Search & Filtering** - Find tasks by any criteria
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Easy on the eyes, day and night
- 💾 **Data Persistence** - LocalStorage & optional cloud sync
- 📤 **Import/Export** - Backup and migrate your tasks
- 🎨 **Beautiful UI** - Modern design with smooth animations
- ⌨️ **Keyboard Shortcuts** - Power user shortcuts
- 📈 **Analytics Dashboard** - Task completion statistics and insights
- 🔔 **Notifications & Reminders** - Stay on top of deadlines
- 👥 **Collaboration Ready** - Share tasks and assignments

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
git clone https://github.com/HelloItsAPerson/task-tracker.git
cd task-tracker
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TaskList/       # Main task list
│   ├── TaskForm/       # Create/edit tasks
│   ├── TaskCard/       # Individual task display
│   ├── Sidebar/        # Navigation sidebar
│   ├── Dashboard/      # Analytics dashboard
│   ├── SearchBar/      # Search functionality
│   ├── TaskModal/      # Detailed task view
│   └── ThemeToggle/    # Dark mode switcher
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
├── styles/             # Global styles
├── store/              # State management (Zustand)
└── App.tsx             # Main app component
```

## 🎨 Design Philosophy

- **Clean & Minimal** - Focus on what matters
- **Intuitive Navigation** - Easy to learn and use
- **Smooth Animations** - Delightful interactions
- **Accessible** - WCAG compliant
- **Fast & Responsive** - Optimized performance

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + custom animations
- **Icons**: Lucide React
- **State Management**: Zustand
- **Date Handling**: Day.js
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

## 📝 Usage Guide

### Creating a Task
1. Click the **"+ New Task"** button in the sidebar
2. Enter task title and description
3. Set priority, due date, and category
4. Add subtasks if needed
5. Click **"Create"**

### Organizing Tasks
- Use **Filters** to view specific subsets
- Create **Categories** for different projects
- Apply **Tags** for cross-cutting concerns
- Set up **Dependencies** to sequence work

### Tracking Progress
- Check off completed subtasks
- View **Analytics** dashboard for insights
- Track **Time Spent** on each task
- Monitor **Completion Rates** by category

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + N` - New task
- `Ctrl/Cmd + F` - Search
- `Ctrl/Cmd + D` - Toggle dark mode
- `Escape` - Close modals
- `Enter` - Confirm action

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Support

Need help? Open an issue or check the documentation.

---

Built with ❤️ for productivity
