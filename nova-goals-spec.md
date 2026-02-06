# Nova Dashboard - Goals Tab Specification

## Overview
A comprehensive goal tracking system with hierarchical structure: Quarterly → Monthly → Weekly → Daily. Goals provide the strategic direction that connects to Projects and daily Tasks.

---

## Core Purpose
1. **Set strategic direction** (quarterly company and personal goals)
2. **Break down into milestones** (monthly checkpoints)
3. **Weekly objectives** (what we're working toward this week)
4. **Daily priorities** (today's focus)
5. **Track progress** across all timeframes
6. **Align execution** (connect daily work to quarterly vision)

---

## Hierarchy Structure

```
┌─────────────────────────────────────────┐
│      QUARTERLY GOALS (3 months)         │
│   "Launch Nova Dashboard & Close 50    │
│    customers in Q1 2026"               │
└──────────────┬──────────────────────────┘
               │ breaks down to
┌──────────────▼──────────────────────────┐
│      MONTHLY MILESTONES                 │
│   February: Complete Workflows tab      │
│   March: Launch beta, close 25 deals    │
└──────────────┬──────────────────────────┘
               │ breaks down to
┌──────────────▼──────────────────────────┐
│      WEEKLY OBJECTIVES                  │
│   Week of Feb 10: Build Goals tab       │
│   Week of Feb 17: Build Tasks tab       │
└──────────────┬──────────────────────────┘
               │ breaks down to
┌──────────────▼──────────────────────────┐
│      DAILY PRIORITIES                   │
│   Monday: Create API endpoints          │
│   Tuesday: Build UI components          │
└─────────────────────────────────────────┘
```

---

## File Structure

```
nova/
├── src/
│   ├── routes/
│   │   └── goals.js               # API routes
│   ├── services/
│   │   └── goalsService.js        # Business logic
│   └── renderer/
│       ├── goals.html             # Main page
│       ├── styles/
│       │   └── goals.css          # Styling
│       └── modules/
│           └── goals.js           # Frontend logic
└── data/
    └── goals/
        ├── quarterly.json         # Quarterly goals
        ├── monthly.json           # Monthly milestones
        ├── weekly.json            # Weekly objectives
        └── daily.json             # Daily priorities
```

---

## Data Models

### Quarterly Goal
```json
{
  "id": "q1-2026",
  "year": 2026,
  "quarter": 1,
  "name": "Q1 2026: Launch Nova & Scale Operations",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "status": "active",
  "progress": 65,
  "objectives": [
    {
      "id": "q1-obj-1",
      "title": "Launch Nova Dashboard v1.0",
      "description": "Complete core features: Goals, Projects, Tasks, Workflows, Habits",
      "category": "Product",
      "target": 100,
      "current": 65,
      "status": "on_track",
      "owner": "Nick",
      "priority": "high"
    },
    {
      "id": "q1-obj-2",
      "title": "Close 50 new customers",
      "description": "Achieve 50 new customer contracts through direct sales",
      "category": "Sales",
      "target": 50,
      "current": 23,
      "status": "at_risk",
      "owner": "Nick",
      "priority": "high"
    },
    {
      "id": "q1-obj-3",
      "title": "Reduce install time by 20%",
      "description": "Optimize installation process through workflow improvements",
      "category": "Operations",
      "target": 20,
      "current": 12,
      "status": "on_track",
      "owner": "Francis",
      "priority": "medium"
    },
    {
      "id": "q1-obj-4",
      "title": "Hire 2 installers",
      "description": "Recruit and onboard 2 field installation technicians",
      "category": "HR",
      "target": 2,
      "current": 0,
      "status": "behind",
      "owner": "Francis",
      "priority": "high"
    }
  ],
  "notes": "Product development ahead of schedule. Sales slightly behind target. Hiring needs acceleration.",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-02-05T18:00:00Z"
}
```

### Monthly Milestone
```json
{
  "id": "feb-2026",
  "year": 2026,
  "month": 2,
  "name": "February 2026: Complete Core Features",
  "quarterId": "q1-2026",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28",
  "theme": "Dashboard Completion",
  "status": "active",
  "progress": 70,
  "milestones": [
    {
      "id": "feb-ms-1",
      "title": "Complete Workflows Tab",
      "description": "Visual workflows, inbox, execution tracking",
      "targetDate": "2026-02-07",
      "completed": true,
      "completedDate": "2026-02-05"
    },
    {
      "id": "feb-ms-2",
      "title": "Complete Projects Tab",
      "description": "Project cards, timelines, milestones",
      "targetDate": "2026-02-10",
      "completed": true,
      "completedDate": "2026-02-05"
    },
    {
      "id": "feb-ms-3",
      "title": "Complete Goals Tab",
      "description": "Hierarchy, progress tracking, alignment",
      "targetDate": "2026-02-12",
      "completed": false,
      "status": "in_progress"
    },
    {
      "id": "feb-ms-4",
      "title": "Complete Tasks Tab",
      "description": "Weekly execution, rollover system",
      "targetDate": "2026-02-17",
      "completed": false,
      "status": "pending"
    },
    {
      "id": "feb-ms-5",
      "title": "Beta test with team",
      "description": "Internal testing and feedback",
      "targetDate": "2026-02-24",
      "completed": false,
      "status": "pending"
    }
  ],
  "keyMetrics": [
    { "name": "Features Complete", "target": 5, "current": 2 },
    { "name": "Bugs Fixed", "target": 20, "current": 15 }
  ],
  "notes": "Development moving fast. On track to complete all features by month end.",
  "createdAt": "2026-02-01T00:00:00Z",
  "updatedAt": "2026-02-05T18:00:00Z"
}
```

### Weekly Objective
```json
{
  "id": "week-2026-06",
  "year": 2026,
  "week": 6,
  "startDate": "2026-02-03",
  "endDate": "2026-02-09",
  "theme": "Goals & Tasks Implementation",
  "monthId": "feb-2026",
  "status": "active",
  "progress": 40,
  "bigRocks": [
    {
      "id": "week6-br-1",
      "title": "Build Goals Tab",
      "description": "Complete goals hierarchy and UI",
      "priority": "high",
      "status": "in_progress",
      "targetCompletion": "2026-02-07"
    },
    {
      "id": "week6-br-2",
      "title": "Build Tasks Tab",
      "description": "Task management with rollover",
      "priority": "high",
      "status": "pending",
      "targetCompletion": "2026-02-09"
    },
    {
      "id": "week6-br-3",
      "title": "Weekly planning session",
      "description": "Saturday planning with Axiom",
      "priority": "medium",
      "status": "scheduled",
      "targetCompletion": "2026-02-08"
    }
  ],
  "targets": {
    "tasksComplete": 15,
    "habitsComplete": {
      "gym": 4,
      "reading": 5,
      "salesCalls": 15
    }
  },
  "notes": "Focus week on core dashboard features",
  "createdAt": "2026-02-03T00:00:00Z",
  "updatedAt": "2026-02-05T18:00:00Z"
}
```

### Daily Priority
```json
{
  "id": "day-2026-02-05",
  "date": "2026-02-05",
  "weekId": "week-2026-06",
  "theme": "Workflow & Project Completion",
  "priorities": [
    {
      "id": "day-0205-p1",
      "title": "Review Claude's Workflows build",
      "description": "Test and approve workflows tab implementation",
      "priority": "high",
      "category": "Product",
      "status": "completed",
      "completedAt": "2026-02-05T14:00:00Z",
      "projectId": "proj-nova-dashboard"
    },
    {
      "id": "day-0205-p2",
      "title": "Review Claude's Projects build",
      "description": "Test and approve projects tab implementation",
      "priority": "high",
      "category": "Product",
      "status": "completed",
      "completedAt": "2026-02-05T16:00:00Z",
      "projectId": "proj-nova-dashboard"
    },
    {
      "id": "day-0205-p3",
      "title": "Plan Goals & Tasks specs",
      "description": "Create detailed specs for next tabs",
      "priority": "medium",
      "category": "Product",
      "status": "completed",
      "completedAt": "2026-02-05T19:00:00Z"
    },
    {
      "id": "day-0205-p4",
      "title": "Call 3 leads",
      "description": "Follow up on pending opportunities",
      "priority": "high",
      "category": "Sales",
      "status": "in_progress",
      "projectId": "proj-sales-pipeline"
    }
  ],
  "habits": {
    "gym": { "target": true, "completed": false, "scheduledTime": "17:00" },
    "reading": { "target": 30, "completed": 0, "unit": "minutes" },
    "salesCalls": { "target": 3, "completed": 1 }
  },
  "notes": "Strong product focus day. Sales calls need attention this evening.",
  "score": 75,
  "createdAt": "2026-02-05T08:00:00Z",
  "updatedAt": "2026-02-05T19:00:00Z"
}
```

---

## Backend API Endpoints

```javascript
// QUARTERLY GOALS
GET    /api/goals/quarterly                    # Get all quarterly goals
GET    /api/goals/quarterly/current            # Get current quarter
GET    /api/goals/quarterly/:id                # Get specific quarter
POST   /api/goals/quarterly                    # Create quarterly goal
PUT    /api/goals/quarterly/:id                # Update quarterly goal
DELETE /api/goals/quarterly/:id                # Delete quarterly goal
GET    /api/goals/quarterly/:id/progress       # Get progress summary

// MONTHLY MILESTONES
GET    /api/goals/monthly                      # Get all monthly milestones
GET    /api/goals/monthly/current              # Get current month
GET    /api/goals/monthly/:id                  # Get specific month
POST   /api/goals/monthly                      # Create monthly milestone
PUT    /api/goals/monthly/:id                  # Update monthly milestone
PUT    /api/goals/monthly/:id/complete         # Mark milestone complete
GET    /api/goals/monthly/:id/progress         # Get progress

// WEEKLY OBJECTIVES
GET    /api/goals/weekly                       # Get all weekly objectives
GET    /api/goals/weekly/current               # Get current week
GET    /api/goals/weekly/:id                   # Get specific week
POST   /api/goals/weekly                       # Create weekly objectives
PUT    /api/goals/weekly/:id                   # Update weekly objectives
PUT    /api/goals/weekly/:id/complete          # Mark big rock complete

// DAILY PRIORITIES
GET    /api/goals/daily                        # Get all daily priorities
GET    /api/goals/daily/today                  # Get today's priorities
GET    /api/goals/daily/:date                  # Get specific day
POST   /api/goals/daily                        # Create daily priorities
PUT    /api/goals/daily/:date                  # Update daily priorities
PUT    /api/goals/daily/:date/priority/:id     # Update single priority
PUT    /api/goals/daily/:date/complete         # Mark priority complete
PUT    /api/goals/daily/:date/score            # Update daily score

// ALIGNMENT & OVERVIEW
GET    /api/goals/alignment                    # Get goal alignment view
GET    /api/goals/dashboard                    # Get dashboard summary
GET    /api/goals/stats                        # Get goal statistics
```

---

## Frontend UI Components

### 1. Main Goals View
```
┌─────────────────────────────────────────────────────────────┐
│ GOALS                                           [+ New Goal]│
├─────────────────────────────────────────────────────────────┤
│ [Quarterly] [Monthly] [Weekly] [Daily]         [Alignment]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  QUARTERLY VIEW (Q1 2026)                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  🎯 Q1 2026: Launch Nova & Scale Operations                │
│  Feb 1 - Mar 31, 2026                                      │
│  Progress: ████████████░░░░ 65%                           │
│  55 days remaining                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🟢 Launch Nova Dashboard v1.0              On Track │   │
│  │ Product | Owner: Nick | Priority: High             │   │
│  │ ████████████████████░░░░ 65% complete             │   │
│  │ Target: 100% | Current: 65%                        │   │
│  │                                                     │   │
│  │ Milestones:                                        │   │
│  │ ✅ Workflows Tab (Feb 5)                          │   │
│  │ ✅ Projects Tab (Feb 5)                           │   │
│  │ 🔄 Goals Tab (Feb 7)                              │   │
│  │ ⏳ Tasks Tab (Feb 9)                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🟡 Close 50 new customers                  At Risk  │   │
│  │ Sales | Owner: Nick | Priority: High               │   │
│  │ ██████████████░░░░░░░░░░ 46% complete             │   │
│  │ Target: 50 | Current: 23                           │   │
│  │                                                     │   │
│  │ ⚠️ Behind by 4 customers                          │   │
│  │ Action needed: Increase call volume                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 Hire 2 installers                       Behind   │   │
│  │ HR | Owner: Francis | Priority: High               │   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░ 0% complete              │   │
│  │ Target: 2 | Current: 0                             │   │
│  │                                                     │   │
│  │ ⚠️ Critical: Post job listings ASAP               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Monthly View
```
┌─────────────────────────────────────────────────────────────┐
│ FEBRUARY 2026                                              │
│ Theme: Dashboard Completion                                │
│ Progress: ██████████████░░░░ 70%                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MILESTONES                                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ✅ Complete Workflows Tab                    Feb 5        │
│     Completed 2 days early!                                │
│                                                             │
│  ✅ Complete Projects Tab                     Feb 5        │
│     Completed 5 days early!                                │
│                                                             │
│  🔄 Complete Goals Tab                        Feb 12       │
│     Due in 7 days | In progress                            │
│                                                             │
│  ⏳ Complete Tasks Tab                        Feb 17       │
│     Due in 12 days | Pending                               │
│                                                             │
│  ⏳ Beta test with team                       Feb 24       │
│     Due in 19 days | Scheduled                             │
│                                                             │
│  KEY METRICS                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Features Complete: 2/5 (40%)                              │
│  Bugs Fixed: 15/20 (75%)                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Weekly View
```
┌─────────────────────────────────────────────────────────────┐
│ WEEK OF FEB 3-9, 2026                                      │
│ Theme: Goals & Tasks Implementation                        │
│ Progress: ████████░░░░░░░░ 40%                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BIG ROCKS (3-5 must-do items)                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  🔄 1. Build Goals Tab                          HIGH       │
│     Target: Feb 7 | Status: In Progress                    │
│                                                             │
│  ⏳ 2. Build Tasks Tab                          HIGH       │
│     Target: Feb 9 | Status: Pending                        │
│                                                             │
│  ⏳ 3. Weekly planning session                  MEDIUM    │
│     Target: Feb 8 | Status: Scheduled                      │
│                                                             │
│  WEEKLY TARGETS                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Tasks Complete: 6/15 (40%)                                │
│  Gym: 3/4 days (75%)                                       │
│  Reading: 3/5 hours (60%)                                  │
│  Sales Calls: 5/15 (33%) ⚠️                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Daily View
```
┌─────────────────────────────────────────────────────────────┐
│ THURSDAY, FEBRUARY 5, 2026                                 │
│ Theme: Workflow & Project Completion                       │
│ Score: 75/100                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TODAY'S PRIORITIES                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ✅ Review Claude's Workflows build           HIGH        │
│     Product | Completed at 2:00 PM                         │
│                                                             │
│  ✅ Review Claude's Projects build            HIGH        │
│     Product | Completed at 4:00 PM                         │
│                                                             │
│  ✅ Plan Goals & Tasks specs                  MEDIUM      │
│     Product | Completed at 7:00 PM                         │
│                                                             │
│  🔄 Call 3 leads                              HIGH        │
│     Sales | 1/3 complete                                   │
│                                                             │
│  HABITS                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ⏳ Gym @ 5:00 PM                                           │
│  ⏳ Read 30 min                                              │
│  🔄 Sales calls (1/3 done)                                  │
│                                                             │
│  NOTES                                                     │
│  Strong product focus day. Sales calls need attention.     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. Alignment View (The Big Picture)
```
┌─────────────────────────────────────────────────────────────┐
│ GOAL ALIGNMENT                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HOW TODAY CONNECTS TO THE QUARTER                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  QUARTER: Launch Nova & Scale Operations (65%)            │
│       ↓                                                     │
│  MONTH: Complete Core Features (70%)                      │
│       ↓                                                     │
│  WEEK: Goals & Tasks Implementation (40%)                 │
│       ↓                                                     │
│  TODAY: Workflow & Project Completion (75%)               │
│       ↓                                                     │
│  THIS TASK: Review Claude's Workflows build ✅            │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  YOUR WORK TODAY ADVANCES:                                 │
│  • Q1 Objective: Launch Nova Dashboard (+5%)              │
│  • Feb Milestone: Complete Workflows Tab ✅               │
│  • Feb Milestone: Complete Projects Tab ✅                │
│  • Weekly Big Rock: Build Goals Tab (in progress)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Styling (Match Nova Theme)

```css
/* Dark theme */
.goals-container {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
}

.goal-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.goal-card:hover {
  border-color: #3b82f6;
}

/* Status colors */
.status-on_track { color: #10b981; border-left: 4px solid #10b981; }
.status-at_risk { color: #f59e0b; border-left: 4px solid #f59e0b; }
.status-behind { color: #ef4444; border-left: 4px solid #ef4444; }
.status-completed { color: #3b82f6; border-left: 4px solid #3b82f6; }

/* Progress bars */
.progress-bar {
  background: #334155;
  border-radius: 8px;
  height: 12px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  height: 100%;
  transition: width 0.3s ease;
}

/* Timeframe tabs */
.timeframe-tab {
  background: #1e293b;
  border: 1px solid #334155;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.timeframe-tab.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

/* Category badges */
.category-product { background: #8b5cf6; }
.category-sales { background: #3b82f6; }
.category-operations { background: #10b981; }
.category-hr { background: #ec4899; }
.category-finance { background: #f59e0b; }
```

---

## Sample Data for Testing

### quarterly.json
```json
{
  "quarters": [
    {
      "id": "q1-2026",
      "year": 2026,
      "quarter": 1,
      "name": "Q1 2026: Launch Nova & Scale Operations",
      "startDate": "2026-01-01",
      "endDate": "2026-03-31",
      "status": "active",
      "progress": 65,
      "objectives": [
        {
          "id": "q1-obj-1",
          "title": "Launch Nova Dashboard v1.0",
          "category": "Product",
          "target": 100,
          "current": 65,
          "status": "on_track",
          "owner": "Nick",
          "priority": "high"
        },
        {
          "id": "q1-obj-2",
          "title": "Close 50 new customers",
          "category": "Sales",
          "target": 50,
          "current": 23,
          "status": "at_risk",
          "owner": "Nick",
          "priority": "high"
        }
      ]
    }
  ]
}
```

### monthly.json
```json
{
  "months": [
    {
      "id": "feb-2026",
      "year": 2026,
      "month": 2,
      "name": "February 2026: Complete Core Features",
      "quarterId": "q1-2026",
      "theme": "Dashboard Completion",
      "progress": 70,
      "milestones": [
        {
          "id": "feb-ms-1",
          "title": "Complete Workflows Tab",
          "targetDate": "2026-02-07",
          "completed": true,
          "completedDate": "2026-02-05"
        },
        {
          "id": "feb-ms-2",
          "title": "Complete Projects Tab",
          "targetDate": "2026-02-10",
          "completed": true,
          "completedDate": "2026-02-05"
        },
        {
          "id": "feb-ms-3",
          "title": "Complete Goals Tab",
          "targetDate": "2026-02-12",
          "completed": false,
          "status": "in_progress"
        },
        {
          "id": "feb-ms-4",
          "title": "Complete Tasks Tab",
          "targetDate": "2026-02-17",
          "completed": false,
          "status": "pending"
        }
      ]
    }
  ]
}
```

### weekly.json
```json
{
  "weeks": [
    {
      "id": "week-2026-06",
      "year": 2026,
      "week": 6,
      "startDate": "2026-02-03",
      "endDate": "2026-02-09",
      "theme": "Goals & Tasks Implementation",
      "monthId": "feb-2026",
      "progress": 40,
      "bigRocks": [
        {
          "id": "week6-br-1",
          "title": "Build Goals Tab",
          "priority": "high",
          "status": "in_progress",
          "targetCompletion": "2026-02-07"
        },
        {
          "id": "week6-br-2",
          "title": "Build Tasks Tab",
          "priority": "high",
          "status": "pending",
          "targetCompletion": "2026-02-09"
        }
      ]
    }
  ]
}
```

### daily.json
```json
{
  "days": [
    {
      "id": "day-2026-02-05",
      "date": "2026-02-05",
      "weekId": "week-2026-06",
      "theme": "Workflow & Project Completion",
      "score": 75,
      "priorities": [
        {
          "id": "day-0205-p1",
          "title": "Review Claude's Workflows build",
          "priority": "high",
          "category": "Product",
          "status": "completed",
          "completedAt": "2026-02-05T14:00:00Z"
        },
        {
          "id": "day-0205-p2",
          "title": "Review Claude's Projects build",
          "priority": "high",
          "category": "Product",
          "status": "completed",
          "completedAt": "2026-02-05T16:00:00Z"
        },
        {
          "id": "day-0205-p3",
          "title": "Call 3 leads",
          "priority": "high",
          "category": "Sales",
          "status": "in_progress"
        }
      ]
    }
  ]
}
```

---

## Build Checklist

### Backend
- [ ] Create goals JSON structure (quarterly, monthly, weekly, daily)
- [ ] Create API routes for all endpoints
- [ ] Create goalsService for file operations
- [ ] Add routes to server.js
- [ ] Create sample data for all 4 timeframes
- [ ] Test API endpoints

### Frontend
- [ ] Create goals.html page
- [ ] Add navigation link in index.html
- [ ] Create timeframe tabs (Quarterly/Monthly/Weekly/Daily)
- [ ] Create goal cards with progress bars
- [ ] Create milestone/rock tracking
- [ ] Create alignment view
- [ ] Add styling (goals.css)
- [ ] Connect to backend API
- [ ] Test full flow

### Sample Data
- [ ] Q1 2026 quarterly goal
- [ ] February 2026 monthly milestones
- [ ] Week of Feb 3-9 weekly objectives
- [ ] Feb 5 daily priorities

---

## Success Criteria

- [ ] Can view quarterly goals with progress
- [ ] Can view monthly milestones
- [ ] Can view weekly big rocks
- [ ] Can view daily priorities
- [ ] Can see alignment (how today connects to quarter)
- [ ] Progress bars update correctly
- [ ] Status indicators work (on track/at risk/behind)
- [ ] Data syncs to GitHub
- [ ] Responsive design

---

**Ready for Claude AI to build!** 🚀
