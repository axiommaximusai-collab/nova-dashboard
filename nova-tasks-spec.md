# Nova Dashboard - Tasks Tab Specification

## Overview
A comprehensive task management system for weekly execution. Tasks are derived from Projects and aligned with Goals. Features a unique rollover system that forces intentional decisions on incomplete work.

---

## Core Purpose
1. **Weekly execution** - Daily task lists derived from projects
2. **Priority management** - High/Medium/Low with focus on big rocks
3. **Rollover system** - Force decision on incomplete tasks (not auto-carry)
4. **Goal alignment** - Show how tasks connect to weekly objectives
5. **Completion tracking** - Daily scores and weekly summaries
6. **Backlog management** - Clear separation of active vs deferred work

---

## Key Concept: Reschedule & Adjust System

**When a task isn't completed by week's end, you MUST decide:**

```
INCOMPLETE TASK: "Create API endpoints"
├─ [ ] Move to next week
├─ [ ] Break into smaller tasks
├─ [ ] Reschedule to specific date
├─ [ ] Convert to project (bigger than thought)
└─ [ ] Delete (no longer needed/priority)
```

**Why this matters:**
- Prevents "zombie tasks" that roll forever
- Forces intentionality
- Keeps weekly lists realistic
- Identifies scope creep early

---

## File Structure

```
nova/
├── src/
│   ├── routes/
│   │   └── tasks.js               # API routes
│   ├── services/
│   │   └── tasksService.js        # Business logic
│   └── renderer/
│       ├── tasks.html             # Main page
│       ├── styles/
│       │   └── tasks.css          # Styling
│       └── modules/
│           └── tasks.js           # Frontend logic
└── data/
    └── tasks/
        ├── weekly.json            # Current week tasks
        ├── backlog.json           # Deferred tasks
        ├── archive.json           # Completed tasks history
        └── rollover-decisions.json # Record of rollover choices
```

---

## Data Models

### Weekly Task
```json
{
  "id": "task-001",
  "weekId": "week-2026-06",
  "title": "Create Goals Tab API endpoints",
  "description": "Build all backend API routes for goals hierarchy",
  "projectId": "proj-nova-dashboard",
  "projectName": "Nova Dashboard",
  "goalAlignment": "q1-obj-1",
  "goalName": "Launch Nova Dashboard v1.0",
  
  "priority": "high",
  "category": "Development",
  
  "status": "in_progress",
  "completionPercentage": 60,
  
  "dueDate": "2026-02-07",
  "scheduledDate": "2026-02-05",
  
  "estimatedTime": "4 hours",
  "actualTime": "2.5 hours",
  
  "subtasks": [
    {
      "id": "sub-001",
      "title": "Create quarterly goals endpoints",
      "completed": true,
      "completedAt": "2026-02-05T10:00:00Z"
    },
    {
      "id": "sub-002",
      "title": "Create monthly milestones endpoints",
      "completed": true,
      "completedAt": "2026-02-05T12:00:00Z"
    },
    {
      "id": "sub-003",
      "title": "Create weekly objectives endpoints",
      "completed": false
    },
    {
      "id": "sub-004",
      "title": "Create daily priorities endpoints",
      "completed": false
    }
  ],
  
  "deliverables": [
    {
      "type": "code",
      "description": "API routes file",
      "required": true,
      "provided": false
    },
    {
      "type": "test",
      "description": "Postman collection",
      "required": true,
      "provided": false
    }
  ],
  
  "blockers": null,
  
  "notes": "Going smoothly, 60% complete",
  
  "createdAt": "2026-02-03T09:00:00Z",
  "updatedAt": "2026-02-05T14:00:00Z",
  "completedAt": null
}
```

### Rollover Decision
```json
{
  "id": "rollover-001",
  "originalTaskId": "task-042",
  "taskTitle": "Write monthly report",
  "week": "week-2026-05",
  "decision": "reschedule",
  "newDueDate": "2026-02-15",
  "reason": "Waiting on data from Francis",
  "newTaskId": "task-089",
  "decidedAt": "2026-02-02T18:00:00Z",
  "decidedBy": "weekly_review"
}
```

### Weekly Summary
```json
{
  "weekId": "week-2026-06",
  "weekOf": "2026-02-03",
  "status": "in_progress",
  
  "stats": {
    "totalTasks": 15,
    "completed": 6,
    "inProgress": 5,
    "pending": 4,
    "completionRate": 40,
    
    "highPriority": {
      "total": 5,
      "completed": 3,
      "rate": 60
    },
    
    "byCategory": {
      "Development": {"total": 8, "completed": 4},
      "Sales": {"total": 4, "completed": 1},
      "Operations": {"total": 3, "completed": 1}
    },
    
    "byProject": {
      "proj-nova-dashboard": {"total": 10, "completed": 5},
      "proj-sales-pipeline": {"total": 5, "completed": 1}
    }
  },
  
  "rolledOver": {
    "count": 2,
    "tasks": ["task-067", "task-068"],
    "decisions": [
      {"task": "Write proposal", "decision": "move_to_next_week"},
      {"task": "Research competitors", "decision": "reschedule", "date": "2026-02-20"}
    ]
  },
  
  "backlogAdded": 1,
  
  "score": 75,
  
  "notes": "Strong development progress. Sales tasks need attention.",
  
  "createdAt": "2026-02-03T00:00:00Z",
  "updatedAt": "2026-02-05T19:00:00Z"
}
```

### Backlog Item
```json
{
  "id": "backlog-001",
  "title": "Research new CRM options",
  "description": "Evaluate Salesforce vs HubSpot for Studio Shade",
  "projectId": "proj-crm-upgrade",
  "priority": "medium",
  "category": "Research",
  "originallyScheduled": "2026-01-15",
  "deferredAt": "2026-01-22",
  "deferredReason": "Higher priority tasks emerged",
  "suggestedReview": "2026-03-01",
  "status": "deferred"
}
```

---

## Backend API Endpoints

```javascript
// WEEKLY TASKS
GET    /api/tasks/weekly                      # Get current week tasks
GET    /api/tasks/weekly/:weekId              # Get specific week
POST   /api/tasks/weekly                      # Create task
PUT    /api/tasks/:id                         # Update task
PUT    /api/tasks/:id/complete                # Mark complete
PUT    /api/tasks/:id/progress                # Update progress %
PUT    /api/tasks/:id/subtask/:subId          # Update subtask
DELETE /api/tasks/:id                         # Delete task

// ROLLOVER
POST   /api/tasks/:id/rollover                # Rollover to next week
Body: { decision: 'next_week'|'break_down'|'reschedule'|'project'|'delete', reason, newDueDate? }

GET    /api/tasks/rollovers                   # Get rollover history
GET    /api/tasks/rollovers/patterns          # Get rollover pattern analytics

// BACKLOG
GET    /api/tasks/backlog                     # Get backlog items
POST   /api/tasks/backlog                     # Add to backlog
PUT    /api/tasks/backlog/:id/activate        # Move to active week
DELETE /api/tasks/backlog/:id                 # Delete from backlog

// VIEWS
GET    /api/tasks/today                       # Get today's tasks
GET    /api/tasks/tomorrow                    # Get tomorrow's tasks
GET    /api/tasks/by-project/:projectId       # Get tasks by project
GET    /api/tasks/by-goal/:goalId             # Get tasks by goal alignment
GET    /api/tasks/by-priority/:priority       # Get tasks by priority

// SUMMARIES
GET    /api/tasks/weekly-summary              # Get current week summary
GET    /api/tasks/weekly-summary/:weekId      # Get specific week summary
GET    /api/tasks/stats                       # Get task statistics
```

---

## Frontend UI Components

### 1. Main Tasks View
```
┌─────────────────────────────────────────────────────────────┐
│ TASKS                                          [+ Add Task] │
├─────────────────────────────────────────────────────────────┤
│ [Today] [This Week] [Backlog] [All]          [By Project ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TODAY - THURSDAY, FEB 5                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  HIGH PRIORITY                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🔄 Review Claude's Workflows build                        │
│     Project: Nova Dashboard | Goal: Launch Nova v1.0       │
│     80% complete | Due: Today 5pm                         │
│     [Complete] [Update Progress] [Add Note]               │
│                                                             │
│  ⏳ Review Claude's Projects build                         │
│     Project: Nova Dashboard | Goal: Launch Nova v1.0       │
│     Not started | Due: Today 5pm                          │
│     [Start] [Reschedule] [Move to Backlog]                │
│                                                             │
│  MEDIUM PRIORITY                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ⏳ Plan Goals & Tasks specs                               │
│     Project: Nova Dashboard | Goal: Launch Nova v1.0       │
│     Not started | Due: Tomorrow                           │
│                                                             │
│  COMPLETED TODAY ✅                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✅ File organization (3 files)                           │
│  ✅ Team standup meeting                                  │
│                                                             │
│  TODAY'S SCORE: 50/100 (2 done, 2 pending)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Weekly View
```
┌─────────────────────────────────────────────────────────────┐
│ THIS WEEK: FEB 3-9, 2026                                   │
│ Theme: Goals & Tasks Implementation                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WEEKLY PROGRESS                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ██████████████░░░░░░░░░ 40% complete                     │
│  6 of 15 tasks done | 2 days left                         │
│                                                             │
│  BY DAY:                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Mon ████████████ 4/4 ✅                                  │
│  Tue ████████████ 3/3 ✅                                  │
│  Wed ██████░░░░░░ 2/4 🟡                                  │
│  Thu ████░░░░░░░░ 1/4 🟡 (in progress)                   │
│  Fri ░░░░░░░░░░░░ 0/4 ⏳ (scheduled)                     │
│                                                             │
│  HIGH PRIORITY TASKS (5)                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✅ Build Goals Tab API (Done Mon)                        │
│  ✅ Build Projects UI (Done Tue)                          │
│  🔄 Build Goals UI (Due Thu)                              │
│  ⏳ Build Tasks API (Due Fri)                             │
│  ⏳ Build Tasks UI (Due Fri)                              │
│                                                             │
│  BY PROJECT:                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Nova Dashboard: 5/10 complete (50%)                      │
│  Sales Pipeline: 1/5 complete (20%) ⚠️                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Rollover Decision Dialog
```
┌─────────────────────────────────────────────────────────────┐
│ WEEKLY REVIEW: HANDLE INCOMPLETE TASKS                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  3 tasks were not completed this week:                     │
│                                                             │
│  TASK 1: "Write proposal for ABC Corp"                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  What should happen to this task?                          │
│                                                             │
│  (•) Move to next week's task list                        │
│  ( ) Break into smaller tasks                             │
│  ( ) Reschedule to specific date: [________]              │
│  ( ) Convert to project (larger scope)                    │
│  ( ) Delete (no longer needed)                            │
│                                                             │
│  Reason: [_________________________________________]      │
│                                                             │
│  [Next Task]  [Skip for Now]  [Bulk Decide]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Backlog View
```
┌─────────────────────────────────────────────────────────────┐
│ BACKLOG - 12 ITEMS                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DEFERRED TASKS                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ⏳ Research new CRM options                               │
│     Deferred: Jan 22 | Originally: Jan 15                  │
│     Reason: Higher priority tasks emerged                  │
│     Suggested review: Mar 1                                │
│     [Activate This Week] [Set Review Date] [Delete]       │
│                                                             │
│  ⏳ Update website copy                                    │
│     Deferred: Jan 20 | Originally: Jan 10                  │
│     Reason: Waiting on brand guidelines                    │
│     [Activate This Week] [Set Review Date] [Delete]       │
│                                                             │
│  ⏳ Organize Q4 documents                                  │
│     Deferred: Feb 1 | Originally: Jan 25                   │
│     Reason: Not urgent                                     │
│     [Activate This Week] [Set Review Date] [Delete]       │
│                                                             │
│  BACKLOG PATTERNS                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Most deferred category: Research (5 items)               │
│  Average time in backlog: 18 days                         │
│  Items activated this month: 3                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. Task Detail Panel
```
┌─────────────────────────────────────────────────────────────┐
│ Create Goals Tab API endpoints                  [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│ Status: 🟡 In Progress (60%)                              │
│ Priority: HIGH | Category: Development                    │
│                                                             │
│  PROJECT & GOAL ALIGNMENT                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Project: Nova Dashboard                                   │
│  Goal: Launch Nova Dashboard v1.0 (Q1 Objective)          │
│  This task advances quarterly progress by 5%              │
│                                                             │
│  TIMING                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Created: Mon, Feb 3                                       │
│  Due: Fri, Feb 7 at 5:00 PM                               │
│  Estimated: 4 hours                                        │
│  Actual so far: 2.5 hours                                  │
│  Remaining estimate: 1.5 hours                            │
│                                                             │
│  SUBTASKS                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✅ Create quarterly goals endpoints                      │
│  ✅ Create monthly milestones endpoints                   │
│  ⏳ Create weekly objectives endpoints                    │
│  ⏳ Create daily priorities endpoints                     │
│  ⏳ Write API documentation                               │
│  ⏳ Create Postman collection                             │
│                                                             │
│  DELIVERABLES                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ⏳ API routes file (required)                            │
│  ⏳ Postman collection (required)                         │
│                                                             │
│  [+ Add Subtask] [Add Deliverable] [Add Note]             │
│  [Mark Complete] [Update Progress] [Reschedule]           │
└─────────────────────────────────────────────────────────────┘
```

---

## Styling (Match Nova Theme)

```css
/* Dark theme */
.tasks-container {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
}

.task-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-card:hover {
  border-color: #3b82f6;
}

/* Priority indicators */
.priority-high { 
  border-left: 4px solid #ef4444;
}
.priority-medium { 
  border-left: 4px solid #f59e0b;
}
.priority-low { 
  border-left: 4px solid #10b981;
}

/* Status */
.status-completed { 
  opacity: 0.6;
  text-decoration: line-through;
}
.status-in_progress {
  border-color: #3b82f6;
}

/* Progress bar */
.task-progress {
  background: #334155;
  border-radius: 4px;
  height: 8px;
  width: 100px;
}

.task-progress-fill {
  background: #3b82f6;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Checkbox */
.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #475569;
  border-radius: 4px;
  cursor: pointer;
}

.task-checkbox.completed {
  background: #10b981;
  border-color: #10b981;
}

/* Tabs */
.task-tab {
  background: #1e293b;
  border: 1px solid #334155;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.task-tab.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

/* Rollover warning */
.rollover-warning {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 12px;
  color: #ef4444;
}

/* Daily score */
.daily-score {
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
}

.daily-score.good { color: #10b981; }
.daily-score.warning { color: #f59e0b; }
.daily-score.bad { color: #ef4444; }
```

---

## Sample Data for Testing

### weekly.json
```json
{
  "weekId": "week-2026-06",
  "weekOf": "2026-02-03",
  "tasks": [
    {
      "id": "task-001",
      "title": "Create Goals Tab API endpoints",
      "projectId": "proj-nova-dashboard",
      "priority": "high",
      "status": "in_progress",
      "completionPercentage": 60,
      "dueDate": "2026-02-07",
      "scheduledDate": "2026-02-05"
    },
    {
      "id": "task-002",
      "title": "Build Goals Tab UI components",
      "projectId": "proj-nova-dashboard",
      "priority": "high",
      "status": "pending",
      "completionPercentage": 0,
      "dueDate": "2026-02-07",
      "scheduledDate": "2026-02-06"
    },
    {
      "id": "task-003",
      "title": "Call 3 leads",
      "projectId": "proj-sales-pipeline",
      "priority": "high",
      "status": "in_progress",
      "completionPercentage": 33,
      "dueDate": "2026-02-05",
      "scheduledDate": "2026-02-05"
    },
    {
      "id": "task-004",
      "title": "Weekly planning session",
      "projectId": "proj-accountability",
      "priority": "medium",
      "status": "scheduled",
      "completionPercentage": 0,
      "dueDate": "2026-02-08",
      "scheduledDate": "2026-02-08"
    }
  ]
}
```

### backlog.json
```json
{
  "backlog": [
    {
      "id": "backlog-001",
      "title": "Research new CRM options",
      "projectId": "proj-crm-upgrade",
      "priority": "medium",
      "category": "Research",
      "originallyScheduled": "2026-01-15",
      "deferredAt": "2026-01-22",
      "deferredReason": "Higher priority tasks emerged",
      "suggestedReview": "2026-03-01"
    },
    {
      "id": "backlog-002",
      "title": "Update website copy",
      "projectId": "proj-website",
      "priority": "low",
      "category": "Marketing",
      "originallyScheduled": "2026-01-10",
      "deferredAt": "2026-01-20",
      "deferredReason": "Waiting on brand guidelines",
      "suggestedReview": "2026-02-20"
    }
  ]
}
```

### rollover-decisions.json
```json
{
  "rollovers": [
    {
      "id": "rollover-001",
      "originalTaskId": "task-042",
      "taskTitle": "Write monthly report",
      "week": "week-2026-05",
      "decision": "reschedule",
      "newDueDate": "2026-02-15",
      "reason": "Waiting on data from Francis",
      "newTaskId": "task-089"
    },
    {
      "id": "rollover-002",
      "originalTaskId": "task-043",
      "taskTitle": "Research competitors",
      "week": "week-2026-05",
      "decision": "break_down",
      "reason": "Too big for one task",
      "newTasks": ["task-090", "task-091", "task-092"]
    }
  ]
}
```

---

## Build Checklist

### Backend
- [ ] Create tasks JSON structure (weekly, backlog, archive, rollovers)
- [ ] Create API routes for all endpoints
- [ ] Create tasksService for file operations
- [ ] Implement rollover logic with decision tracking
- [ ] Add routes to server.js
- [ ] Create sample data
- [ ] Test API endpoints

### Frontend
- [ ] Create tasks.html page
- [ ] Add navigation link in index.html
- [ ] Create tabs (Today/This Week/Backlog/All)
- [ ] Create task cards with priority indicators
- [ ] Create weekly view with day-by-day breakdown
- [ ] Create rollover decision dialog
- [ ] Create backlog view
- [ ] Create task detail panel
- [ ] Add styling (tasks.css)
- [ ] Connect to backend API
- [ ] Test full flow

### Sample Data
- [ ] Week of Feb 3-9 with 15 tasks (mix of complete/in progress/pending)
- [ ] 2-3 backlog items
- [ ] 1-2 rollover decisions from last week

---

## Success Criteria

- [ ] Can view today's tasks with priorities
- [ ] Can view full week with progress
- [ ] Can see tasks by project and goal alignment
- [ ] Rollover system forces decision (not auto-carry)
- [ ] Backlog management works
- [ ] Daily and weekly scores calculate correctly
- [ ] Data syncs to GitHub
- [ ] Responsive design
- [ ] Task detail panel shows all info

---

**Ready for Claude AI to build!** 🚀
