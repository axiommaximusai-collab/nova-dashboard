# NOVA Dashboard

**The Collective Mind** for Studio Shade Co.

## Overview

Nova is an integrated dashboard for tracking goals, tasks, projects, workflows, habits, and memory. It's designed as a "collective mind" — giving Nick visibility into everything Axiom is working on while providing a structured system for personal and business execution.

## Architecture

```
VISION & STRATEGY (Company direction, quarterly themes)
    ↓
GOALS (Quarterly → Monthly → Weekly → Daily)
    ↓
PROJECTS (Multi-week/month endeavors)
    ↓
WORKFLOWS (Processes, SOPs, documented rules)
    ↓
TASKS (Daily execution, individual actions)
    ↓
HABITS & ROUTINES (Personal systems, daily rhythms)
    ↓
MEMORY (Knowledge base, everything learned)
```

## Tabs

1. **Dashboard** - Home view with today's focus, week stats, active projects, recent memory
2. **Goals** - Daily/Weekly/Monthly goal setting with themes
3. **Tasks** - Weekly task execution with rollover support
4. **Projects** - Multi-week initiatives with progress tracking
5. **Workflows** - SOPs and documented processes
6. **Habits** - Streak-based habit tracker
7. **Memory** - Searchable knowledge base with tags

## Quick Start

```bash
cd /Users/axiom/clawd/Axiom/nova
npm install
npm start
open http://localhost:3333
```

## File Structure

```
nova/
├── src/
│   ├── server.js              # Express server
│   ├── routes/                # API endpoints
│   │   ├── goals.js
│   │   ├── tasks.js
│   │   ├── habits.js
│   │   ├── workflows.js
│   │   ├── memory.js
│   │   └── projects.js
│   ├── services/              # Business logic
│   │   ├── goalsService.js
│   │   ├── tasksService.js
│   │   ├── habitsService.js
│   │   ├── workflowsService.js
│   │   ├── memoryService.js
│   │   └── projectsService.js
│   └── renderer/              # Frontend
│       ├── index.html
│       ├── styles/
│       │   └── nova.css
│       └── modules/
│           └── nova.js
├── data/                      # JSON data storage
│   ├── goals/
│   ├── habits/
│   ├── memory/
│   ├── workflows/
│   ├── projects/
│   └── tasks/
└── package.json
```

## API Endpoints

### Goals
- `GET /api/goals/daily/:date` - Get daily goals
- `POST /api/goals/daily/:date` - Save daily goals
- `GET /api/goals/weekly/:year/:week` - Get weekly goals
- `POST /api/goals/weekly/:year/:week` - Save weekly goals

### Tasks
- `GET /api/tasks/:year/:week` - Get weekly tasks
- `POST /api/tasks/:year/:week` - Save weekly tasks
- `PATCH /api/tasks/:id/complete` - Complete a task
- `POST /api/tasks/rollover` - Rollover incomplete tasks

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create project
- `PATCH /api/projects/:id/progress` - Update progress

### Habits
- `GET /api/habits/` - List all habits
- `POST /api/habits/` - Create habit
- `POST /api/habits/:id/log` - Log habit completion

### Workflows
- `GET /api/workflows/` - List all workflows
- `POST /api/workflows/` - Create workflow
- `POST /api/workflows/:id/execute` - Log execution

### Memory
- `GET /api/memory/timeline` - Get recent memories
- `GET /api/memory/search?q=query` - Search memory
- `POST /api/memory/` - Create memory entry

## Features

- ✅ Daily/Weekly/Monthly goal tracking
- ✅ Task management with weekly rollover
- ✅ Project tracking with progress bars
- ✅ Workflow/SOP management
- ✅ Habit tracking with streaks
- ✅ Memory system with search
- ✅ Dark theme UI
- ✅ Responsive design

## Data Storage

All data is stored as JSON files in the `data/` directory, making it easy to:
- Back up
- Version control
- Sync to GitHub
- Inspect manually

## Next Steps

1. **GitHub Sync** - Push/pull data to GitHub for Axiom access
2. **Notifications** - Cron-based accountability system
3. **Workflow Builder** - Visual workflow diagram editor
4. **Analytics** - Charts and insights
5. **Mobile App** - React Native companion

---

*Built for Studio Shade Co.*
*February 2026*
