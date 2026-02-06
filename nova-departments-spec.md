# Nova Dashboard - Department Workflows Tab Specification

## Overview
Organize and visualize workflows by business department. See what Marketing, Sales, Operations, Finance, and HR are doing at a glance. Department-level analytics and cross-functional views.

---

## Core Purpose
1. **Department organization** - Workflows grouped by function
2. **Cross-functional view** - See how departments interact
3. **Department analytics** - Usage, efficiency, bottlenecks by team
4. **Resource allocation** - Where is effort being spent?
5. **Handoff tracking** - How work moves between departments
6. **Department goals** - What each team is working toward

---

## Departments

### Default Departments:
1. **Sales** - Lead gen, qualification, closing, follow-up
2. **Marketing** - Content, campaigns, social, brand
3. **Operations** - Installations, fulfillment, logistics
4. **Finance** - Invoicing, reporting, budgeting
5. **HR/People** - Hiring, onboarding, training
6. **Product** - Development, features, roadmap
7. **Customer Success** - Support, retention, satisfaction

---

## Data Models

### Department
```json
{
  "id": "dept-sales",
  "name": "Sales",
  "description": "Revenue generation and customer acquisition",
  "color": "#3b82f6", // Blue
  
  "lead": {
    "name": "Nick Oliphant",
    "email": "noliphant@studioshadeco.com"
  },
  
  "workflows": [
    "wf-lead-qualification",
    "wf-demo-scheduling",
    "wf-proposal-generation",
    "wf-contract-closing",
    "wf-follow-up-cadence"
  ],
  
  "metrics": {
    "activeWorkflows": 5,
    "runsThisWeek": 89,
    "runsThisMonth": 342,
    "successRate": 78,
    "avgExecutionTime": "4.2 minutes",
    "timeSaved": "28 hours this month"
  },
  
  "goals": [
    {
      "goalId": "q1-sales-001",
      "title": "Close 50 new customers",
      "target": 50,
      "current": 23,
      "status": "at_risk"
    }
  ],
  
  "handoffs": {
    "receivesFrom": ["dept-marketing"],
    "sendsTo": ["dept-operations", "dept-finance"],
    "activeHandoffs": 12
  },
  
  "team": [
    {"name": "Nick Oliphant", "role": "Sales Lead"},
    {"name": "Axiom", "role": "Sales Support"}
  ],
  
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-02-05T18:00:00Z"
}
```

### Workflow (with department)
```json
{
  "id": "wf-lead-qualification",
  "name": "Lead Qualification Process",
  "departmentId": "dept-sales",
  "departmentName": "Sales",
  
  "description": "Qualify inbound leads from initial contact to opportunity",
  
  "trigger": "New lead enters CRM",
  
  "handoffs": {
    "receivesFrom": "Marketing",
    "sendsTo": "Sales (demo scheduling)",
    "triggersNext": "wf-demo-scheduling"
  },
  
  "steps": [
    {"order": 1, "title": "Receive lead", "owner": "Axiom", "department": "Marketing"},
    {"order": 2, "title": "Enrich data", "owner": "Axiom", "department": "Sales"},
    {"order": 3, "title": "Score lead", "owner": "Axiom", "department": "Sales"},
    {"order": 4, "title": "Qualify", "owner": "Nick", "department": "Sales"},
    {"order": 5, "title": "Route to demo", "owner": "Axiom", "department": "Sales"}
  ],
  
  "stats": {
    "runsThisWeek": 34,
    "conversionRate": 45,
    "avgTime": "12 minutes"
  }
}
```

### Cross-Functional Workflow
```json
{
  "id": "wf-customer-onboarding",
  "name": "Customer Onboarding",
  "type": "cross_functional",
  "departments": ["dept-sales", "dept-operations", "dept-finance"],
  
  "stages": [
    {
      "stage": 1,
      "name": "Contract Signed",
      "department": "dept-sales",
      "handoffTo": "dept-finance",
      "sla": "24 hours"
    },
    {
      "stage": 2,
      "name": "Payment Processed",
      "department": "dept-finance",
      "handoffTo": "dept-operations",
      "sla": "48 hours"
    },
    {
      "stage": 3,
      "name": "Installation Scheduled",
      "department": "dept-operations",
      "handoffTo": "dept-customer-success",
      "sla": "72 hours"
    },
    {
      "stage": 4,
      "name": "Installation Complete",
      "department": "dept-operations",
      "handoffTo": null,
      "sla": "N/A"
    }
  ],
  
  "bottlenecks": [
    {"stage": 3, "issue": "Installer availability", "avgDelay": "2.3 days"}
  ]
}
```

---

## UI Layout

### Department Overview
```
┌─────────────────────────────────────────────────────────────┐
│ DEPARTMENT WORKFLOWS                                       │
├─────────────────────────────────────────────────────────────┤
│ [Overview] [Sales] [Marketing] [Ops] [Finance] [HR] [...]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 ALL DEPARTMENTS                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  💰 SALES                                Runs: 89/week     │
│  ████████████████████░░░░ 78% success rate                 │
│  5 active workflows | 28 hours saved this month           │
│  Goal: 50 customers | Current: 23 | Status: At Risk       │
│  [View Workflows]                                         │
│                                                             │
│  📢 MARKETING                            Runs: 45/week     │
│  ████████████████████████░ 85% success rate                │
│  3 active workflows | 15 hours saved this month           │
│  Goal: 500 leads | Current: 312 | Status: On Track        │
│                                                             │
│  ⚙️ OPERATIONS                           Runs: 156/week    │
│  ████████████████████████░ 92% success rate                │
│  4 active workflows | 45 hours saved this month           │
│  Goal: 40 installs | Current: 38 | Status: On Track       │
│                                                             │
│  💳 FINANCE                              Runs: 67/week     │
│  █████████████████████████ 95% success rate                │
│  3 active workflows | 12 hours saved this month           │
│                                                             │
│  🔗 CROSS-FUNCTIONAL WORKFLOWS                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Customer Onboarding (Sales → Finance → Ops)              │
│  Warranty Claims (Customer → Ops → Finance)               │
│  New Hire (HR → Finance → Ops)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Single Department View
```
┌─────────────────────────────────────────────────────────────┐
│ SALES DEPARTMENT                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📈 DEPARTMENT METRICS                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Active workflows: 5                                       │
│  Runs this week: 89                                        │
│  Success rate: 78%                                         │
│  Time saved: 28 hours this month                           │
│  Avg execution: 4.2 minutes                                │
│                                                             │
│  🎯 DEPARTMENT GOALS                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Q1: Close 50 new customers                               │
│  ██████████████░░░░░░░░░░ 46% complete (23/50)            │
│  Status: At Risk | Behind by 4 customers                  │
│                                                             │
│  ⚡ ACTIVE WORKFLOWS                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  📋 Lead Qualification                                   │
│  ████████████████████░░░░ 80% success | 34 runs/week      │
│  Receives from: Marketing                                  │
│  Hands off to: Demo Scheduling                             │
│  [View Workflow] [Edit] [Analytics]                       │
│                                                             │
│  📋 Demo Scheduling                                      │
│  █████████████████████░░░ 75% success | 28 runs/week      │
│  Receives from: Lead Qualification                         │
│  Hands off to: Proposal Generation                         │
│                                                             │
│  📋 Proposal Generation                                  │
│  ██████████████████░░░░░░ 70% success | 15 runs/week      │
│  Receives from: Demo Scheduling                            │
│  Hands off to: Contract Closing                            │
│                                                             │
│  📋 Contract Closing                                     │
│  ██████████████████████░░ 85% success | 12 runs/week      │
│  Receives from: Proposal Generation                        │
│  Hands off to: Operations (Installation)                   │
│                                                             │
│  📋 Follow-up Cadence                                    │
│  ████████████████████░░░░ 80% success | 45 runs/week      │
│  Runs on: Closed deals, Lost deals                         │
│                                                             │
│  👥 TEAM                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Nick Oliphant - Sales Lead                                │
│  Axiom - Sales Support                                     │
│                                                             │
│  🔗 HANDOFFS                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Receives from: Marketing (12 active handoffs)            │
│  Sends to: Operations (8 active), Finance (4 active)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cross-Functional Flow View
```
┌─────────────────────────────────────────────────────────────┐
│ CUSTOMER ONBOARDING FLOW                                   │
│ Sales → Finance → Operations → Customer Success            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STAGE 1                        STAGE 2                     │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   Contract   │── 24hrs ────▶│   Payment    │            │
│  │    Signed    │              │  Processed   │            │
│  └──────────────┘              └──────────────┘            │
│       Sales                        Finance                  │
│       Avg: 4hrs                    Avg: 18hrs               │
│                                                             │
│                                    │                        │
│                                    │ 48hrs                  │
│                                    ▼                        │
│                             ┌──────────────┐               │
│                             │ Installation │               │
│                             │  Scheduled   │               │
│                             └──────────────┘               │
│                                  Operations                 │
│                                  Avg: 52hrs ⚠️             │
│                                  (SLA: 72hrs)              │
│                                                             │
│                                    │                        │
│                                    │                        │
│                                    ▼                        │
│                             ┌──────────────┐               │
│                             │   Install    │               │
│                             │   Complete   │               │
│                             └──────────────┘               │
│                                  Operations                 │
│                                                             │
│  ⚠️ BOTTLENECK DETECTED                                    │
│  Installation scheduling averaging 52 hours (SLA: 72)     │
│  Issue: Installer availability                             │
│  Recommendation: Hire 2 additional installers             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend API

```javascript
// Departments
GET    /api/departments                 # Get all departments
GET    /api/departments/:id             # Get department details
GET    /api/departments/:id/workflows   # Get dept workflows
GET    /api/departments/:id/metrics     # Get dept metrics
GET    /api/departments/:id/handoffs    # Get handoff tracking

// Cross-functional
GET    /api/workflows/cross-functional  # Get cross-dept workflows
GET    /api/workflows/:id/handoffs      # Get workflow handoffs
GET    /api/bottlenecks                 # Get bottleneck analysis

// Analytics
GET    /api/departments/analytics       # Department comparison
GET    /api/departments/:id/trends      # Department trends
```

---

## Key Features

1. **Department grouping** - Workflows organized by function
2. **Department metrics** - Runs, success rate, time saved
3. **Goal tracking** - Per-department objectives
4. **Handoff tracking** - How work moves between teams
5. **Bottleneck detection** - Where workflows slow down
6. **Cross-functional flows** - End-to-end process visualization
7. **Team view** - Who's in each department
8. **Resource allocation** - Where effort is spent
9. **SLA tracking** - Are handoffs happening on time?
10. **Department comparison** - Benchmark teams against each other

---

## Success Criteria

- [ ] View all departments with metrics
- [ ] See workflows grouped by department
- [ ] Track handoffs between departments
- [ ] View cross-functional workflows
- [ ] Detect bottlenecks in processes
- [ ] Track department goals
- [ ] See resource allocation by department
- [ ] View team members per department
- [ ] Compare department performance
- [ ] Data syncs to GitHub

---

**Status: Ready to build** 🚀
