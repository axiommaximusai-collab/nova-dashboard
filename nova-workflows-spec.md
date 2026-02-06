# Nova Dashboard - Workflows Tab Specification

## Overview
A Workflow Management Dashboard to display, track, and manage operational workflows and SOPs. This is a **view/management system** (not a builder) - workflows are created by Axiom and displayed for the team to reference and track.

---

## Core Purpose
1. **Display active workflows** Axiom is following
2. **Visual workflow diagrams** (simple flowcharts)
3. **Step-by-step documentation** for each workflow
4. **Track execution status** (last run, run count, success rate)
5. **Inbox for new workflow requests**
6. **Reference library** for all SOPs and processes

---

## File Structure

```
nova/
├── src/
│   ├── routes/
│   │   └── workflows.js           # API routes
│   ├── services/
│   │   └── workflowsService.js    # Business logic
│   └── renderer/
│       ├── workflows.html         # Main page
│       ├── styles/
│       │   └── workflows.css      # Styling
│       └── modules/
│           └── workflows.js       # Frontend logic
└── data/
    └── workflows/
        ├── workflows.json         # All workflow definitions
        ├── inbox.json             # Pending workflow requests
        └── executions.json        # Execution history/log
```

---

## Data Models

### Workflow Definition
```json
{
  "id": "wf-001",
  "name": "File Organization System",
  "status": "active",
  "category": "Operations",
  "description": "Automatically organize files sent by team members into the Studio Shade Co shared drive",
  "trigger": "Team member sends file via Telegram",
  
  "visual": {
    "type": "linear",
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "File Received", "x": 50, "y": 50},
      {"id": "n2", "type": "action", "label": "Analyze", "x": 200, "y": 50},
      {"id": "n3", "type": "action", "label": "Suggest Location", "x": 350, "y": 50},
      {"id": "n4", "type": "action", "label": "Confirm", "x": 500, "y": 50},
      {"id": "n5", "type": "action", "label": "Upload", "x": 650, "y": 50},
      {"id": "n6", "type": "end", "label": "Complete", "x": 800, "y": 50}
    ],
    "connections": [
      {"from": "n1", "to": "n2"},
      {"from": "n2", "to": "n3"},
      {"from": "n3", "to": "n4"},
      {"from": "n4", "to": "n5"},
      {"from": "n5", "to": "n6"}
    ]
  },
  
  "steps": [
    {
      "order": 1,
      "title": "File Received",
      "description": "Team member sends file via Telegram",
      "owner": "Any team member",
      "trigger": "New file attachment",
      "inputs": ["File attachment"],
      "outputs": ["File metadata"],
      "tools": ["Telegram"],
      "time_estimate": "Instant"
    },
    {
      "order": 2,
      "title": "Analyze Content",
      "description": "Read file content and determine type/category",
      "owner": "Axiom",
      "inputs": ["File content"],
      "outputs": ["File classification"],
      "tools": ["File reader", "Content analyzer"],
      "time_estimate": "30 seconds"
    },
    {
      "order": 3,
      "title": "Suggest Destination",
      "description": "Propose best folder location in shared drive based on file type",
      "owner": "Axiom",
      "inputs": ["File classification"],
      "outputs": ["Suggested folder path"],
      "tools": ["studio-shade-file-system.md reference"],
      "time_estimate": "10 seconds"
    },
    {
      "order": 4,
      "title": "Confirm with Sender",
      "description": "Ask team member if suggested location is correct",
      "owner": "Axiom",
      "inputs": ["Suggested path"],
      "outputs": ["Confirmation or correction"],
      "tools": ["Telegram messaging"],
      "time_estimate": "1-5 minutes (waiting for response)"
    },
    {
      "order": 5,
      "title": "Upload File",
      "description": "Upload to Google Drive with proper naming convention",
      "owner": "Axiom",
      "inputs": ["Confirmed file", "Destination folder"],
      "outputs": ["Uploaded file", "Shareable link"],
      "tools": ["gog drive upload", "Google Drive API"],
      "naming_convention": "YYYY-MM-DD - Description - Version",
      "time_estimate": "30 seconds"
    },
    {
      "order": 6,
      "title": "Provide Confirmation",
      "description": "Send success message with file link to team member",
      "owner": "Axiom",
      "inputs": ["File URL"],
      "outputs": ["Confirmation message"],
      "tools": ["Telegram messaging"],
      "time_estimate": "10 seconds"
    }
  ],
  
  "references": [
    {
      "name": "File System Map",
      "path": "studio-shade-file-system.md",
      "type": "document"
    },
    {
      "name": "Organization Rule",
      "path": "MEMORY.md",
      "type": "document",
      "section": "File Organization Rule"
    },
    {
      "name": "Studio Shade Co Shared Drive",
      "url": "https://drive.google.com/drive/u/1/folders/0AM-zxjILmsWMUk9PVA",
      "type": "link"
    }
  ],
  
  "stats": {
    "created": "2026-02-05T10:00:00Z",
    "activated": "2026-02-05T10:00:00Z",
    "lastRun": "2026-02-05T16:30:00Z",
    "runsToday": 12,
    "runsThisWeek": 45,
    "runsTotal": 156,
    "successRate": 100,
    "avgExecutionTime": "2 minutes"
  },
  
  "automation": true,
  "owner": "Axiom"
}
```

### Inbox Item
```json
{
  "id": "inbox-001",
  "requestedBy": "noliphant@studioshadeco.com",
  "requestedAt": "2026-02-05T17:00:00Z",
  "title": "Lead Qualification Process",
  "description": "Create workflow for qualifying new leads from initial contact to qualified opportunity",
  "category": "Sales",
  "priority": "high",
  "status": "pending",
  "notes": "Need to include: initial response, discovery questions, qualification criteria, handoff to sales"
}
```

### Execution Log
```json
{
  "workflowId": "wf-001",
  "executionId": "exec-001",
  "startedAt": "2026-02-05T16:30:00Z",
  "completedAt": "2026-02-05T16:32:00Z",
  "duration": 120,
  "status": "success",
  "triggeredBy": "noliphant@studioshadeco.com",
  "inputs": {
    "fileName": "contract-template.pdf",
    "fileType": "application/pdf"
  },
  "outputs": {
    "destination": "SALES/Training Materials",
    "fileUrl": "https://drive.google.com/...",
    "fileId": "1KAuXZr1uyXYGMZs46wG6FhzWAWcT2Tax"
  },
  "stepsCompleted": [1, 2, 3, 4, 5, 6],
  "notes": "Successfully uploaded to Training Materials folder"
}
```

---

## Backend API Endpoints

```javascript
// Get all workflows
GET /api/workflows
Query params: ?status=active|draft|archived&category=Sales|Operations|...

// Get single workflow
GET /api/workflows/:id

// Get workflow with execution history
GET /api/workflows/:id/history

// Log workflow execution
POST /api/workflows/:id/execute
Body: { triggeredBy, inputs, outputs, status, duration }

// Get inbox items
GET /api/workflows/inbox

// Add to inbox (new workflow request)
POST /api/workflows/inbox
Body: { title, description, category, priority, requestedBy }

// Approve inbox item (create workflow)
PUT /api/workflows/inbox/:id/approve
Body: { workflowDefinition }

// Reject inbox item
PUT /api/workflows/inbox/:id/reject
Body: { reason }

// Update workflow
PUT /api/workflows/:id
Body: { updates to workflow definition }

// Get execution stats
GET /api/workflows/stats
Returns: { activeWorkflows, totalRunsToday, avgSuccessRate, recentExecutions }
```

---

## Frontend UI Components

### 1. Main Layout
```
┌─────────────────────────────────────────────────────────────┐
│ WORKFLOWS                                       [+ Request] │
├─────────────────────────────────────────────────────────────┤
│ [Inbox (2)] [Active (3)] [All] [Sales] [Ops] [Product] ...  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INBOX SECTION (when Inbox tab selected)                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📥 New workflow requests awaiting implementation          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Lead Qualification Process                   [High] │   │
│  │ Requested by: Nick Oliphant    2 hours ago         │   │
│  │ Create workflow for qualifying new leads...        │   │
│  │ [View Details] [Start Building] [Reject]           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ACTIVE WORKFLOWS SECTION                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📁 File Organization System              [Active]   │   │
│  │                                                     │   │
│  │  ┌────────┐    ┌────────┐    ┌────────┐           │   │
│  │  │ Trigger│───▶│Analyze │───▶│Suggest │           │   │
│  │  │  File  │    │ Content│    │Location│           │   │
│  │  └────────┘    └────────┘    └────────┘           │   │
│  │                                    │                │   │
│  │  ┌────────┐    ┌────────┐    ┌────▼───┐           │   │
│  │  │Confirm │◀───│ Upload │◀───│ Confirm│           │   │
│  │  │  Done  │    │  File  │    │  Path  │           │   │
│  │  └────────┘    └────────┘    └────────┘           │   │
│  │                                                     │   │
│  │  Last run: 2 min ago  |  Today: 12 runs            │   │
│  │  [View Steps] [View Files] [Run History]           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 Contract Generation                   [Active]   │   │
│  │  ┌────────┐    ┌────────┐    ┌────────┐           │   │
│  │  │ Order  │───▶│ Fetch  │───▶│Generate│           │   │
│  │  │ Number │    │ Sheets │    │  PDF   │           │   │
│  │  └────────┘    └────────┘    └────────┘           │   │
│  │                                                     │   │
│  │  Last run: 5 min ago  |  Today: 8 runs             │   │
│  │  [View Steps] [View Files] [Run History]           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Workflow Detail Modal/Panel
```
┌─────────────────────────────────────────────────────────────┐
│ File Organization System                          [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│ Status: ✅ Active  |  Category: Operations                  │
│                                                             │
│ VISUAL FLOW                                                 │
│ [Simple SVG or HTML flow diagram showing all steps]        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ STEP-BY-STEP PROCESS                                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                             │
│ Step 1: File Received                                      │
│ ├─ Trigger: Team member sends file                         │
│ ├─ Owner: Any team member                                  │
│ └─ Tools: Telegram                                         │
│                                                             │
│ Step 2: Analyze Content                                    │
│ ├─ Action: Read file content and determine type            │
│ ├─ Owner: Axiom                                            │
│ ├─ Tools: File reader, Content analyzer                    │
│ └─ Time: 30 seconds                                        │
│                                                             │
│ Step 3: Suggest Destination                                │
│ ├─ Action: Propose best folder location                    │
│ ├─ Owner: Axiom                                            │
│ └─ Reference: studio-shade-file-system.md                  │
│    [View Reference File]                                   │
│                                                             │
│ [Expand all steps] [Collapse all]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ REFERENCE FILES                                            │
│ • studio-shade-file-system.md                              │
│ • MEMORY.md (File Organization Rule)                       │
│ • Google Drive: Studio Shade Co shared drive               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ EXECUTION STATS                                            │
│ • Created: Feb 5, 2026                                     │
│ • Total runs: 156                                          │
│ • Success rate: 100%                                       │
│ • Last run: 2 minutes ago                                  │
│ • Runs today: 12                                           │
│ • Avg execution time: 2 minutes                            │
│                                                             │
│ [View Full History]                                        │
└─────────────────────────────────────────────────────────────┘
```

### 3. Inbox Request Form
```
┌─────────────────────────────────────────────────────────────┐
│ Request New Workflow                              [✕ Cancel]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Workflow Name: [_______________________________]            │
│                                                             │
│ Category: [Sales ▼] [Operations ▼] [Product ▼] ...        │
│                                                             │
│ Priority: [Low] [Medium] [High] [Critical]                 │
│                                                             │
│ Description:                                                │
│ ┌─────────────────────────────────────────────────────┐    │
│ │                                                     │    │
│ │ Describe what this workflow should do, when it      │    │
│ │ should trigger, and what the steps should be.       │    │
│ │                                                     │    │
│ │ Example: "When a new lead comes in, automatically   │    │
│ │ send welcome email, add to CRM, and notify sales    │    │
│ │ team within 5 minutes"                              │    │
│ │                                                     │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ Additional Notes:                                           │
│ ┌─────────────────────────────────────────────────────┐    │
│ │                                                     │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│              [Submit Request]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Styling (Match Nova Theme)

```css
/* Dark theme matching other Nova tabs */
.workflows-container {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
}

.workflow-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.workflow-card:hover {
  border-color: #3b82f6;
}

.status-active {
  color: #10b981; /* Green */
}

.status-pending {
  color: #f59e0b; /* Amber */
}

.status-draft {
  color: #6b7280; /* Gray */
}

/* Visual flow diagram styling */
.flow-node {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
  margin: 4px;
}

.flow-node.trigger {
  background: #3b82f6; /* Blue */
}

.flow-node.action {
  background: #10b981; /* Green */
}

.flow-node.decision {
  background: #f59e0b; /* Amber */
  border-radius: 50%; /* Diamond shape via clip or SVG */
}

.flow-node.end {
  background: #ef4444; /* Red */
}

.flow-arrow {
  color: #94a3b8;
  margin: 0 8px;
}

/* Category badges */
.category-sales { background: #3b82f6; }
.category-operations { background: #10b981; }
.category-product { background: #8b5cf6; }
.category-finance { background: #f59e0b; }
.category-hr { background: #ec4899; }
```

---

## Sample Data for Testing

### workflows.json
```json
{
  "workflows": [
    {
      "id": "wf-001",
      "name": "File Organization System",
      "status": "active",
      "category": "Operations",
      "description": "Automatically organize files sent by team members",
      "trigger": "Team member sends file",
      "visual": {
        "type": "linear",
        "nodes": [
          {"id": "n1", "type": "trigger", "label": "File Received"},
          {"id": "n2", "type": "action", "label": "Analyze"},
          {"id": "n3", "type": "action", "label": "Suggest"},
          {"id": "n4", "type": "action", "label": "Confirm"},
          {"id": "n5", "type": "action", "label": "Upload"},
          {"id": "n6", "type": "end", "label": "Done"}
        ]
      },
      "steps": [
        {"order": 1, "title": "File Received", "description": "Team member sends file", "owner": "Team Member"},
        {"order": 2, "title": "Analyze Content", "description": "Read and categorize file", "owner": "Axiom"},
        {"order": 3, "title": "Suggest Location", "description": "Propose folder in drive", "owner": "Axiom"},
        {"order": 4, "title": "Confirm with Sender", "description": "Ask if location is correct", "owner": "Axiom"},
        {"order": 5, "title": "Upload File", "description": "Upload to Google Drive", "owner": "Axiom"},
        {"order": 6, "title": "Provide Link", "description": "Send confirmation", "owner": "Axiom"}
      ],
      "stats": {
        "lastRun": "2026-02-05T16:30:00Z",
        "runsToday": 12,
        "runsTotal": 156,
        "successRate": 100
      }
    },
    {
      "id": "wf-002",
      "name": "Contract Generation",
      "status": "active",
      "category": "Sales",
      "description": "Generate customer contracts from Google Sheet orders",
      "trigger": "Order number provided",
      "visual": {
        "type": "linear",
        "nodes": [
          {"id": "n1", "type": "trigger", "label": "Order Number"},
          {"id": "n2", "type": "action", "label": "Fetch Data"},
          {"id": "n3", "type": "action", "label": "Generate PDF"},
          {"id": "n4", "type": "action", "label": "Send Contract"},
          {"id": "n5", "type": "end", "label": "Complete"}
        ]
      },
      "steps": [
        {"order": 1, "title": "Receive Order Number", "description": "User provides ORD-XXXX", "owner": "Team Member"},
        {"order": 2, "title": "Fetch Order Data", "description": "Pull from Google Sheets", "owner": "Axiom", "tools": ["Google Sheets API"]},
        {"order": 3, "title": "Generate Contract", "description": "Create PDF with ReportLab", "owner": "Axiom"},
        {"order": 4, "title": "Rename & Deliver", "description": "Rename with customer name, send via Telegram", "owner": "Axiom"}
      ],
      "stats": {
        "lastRun": "2026-02-05T16:25:00Z",
        "runsToday": 8,
        "runsTotal": 89,
        "successRate": 100
      }
    }
  ]
}
```

### inbox.json
```json
{
  "inbox": [
    {
      "id": "inbox-001",
      "requestedBy": "noliphant@studioshadeco.com",
      "requestedAt": "2026-02-05T17:00:00Z",
      "title": "Lead Qualification Process",
      "description": "Create workflow for qualifying new leads from initial contact to qualified opportunity. Should include: welcome email, discovery questions, qualification scoring, CRM entry, sales team notification.",
      "category": "Sales",
      "priority": "high",
      "status": "pending"
    },
    {
      "id": "inbox-002",
      "requestedBy": "ftran@studioshadeco.com",
      "requestedAt": "2026-02-05T16:00:00Z",
      "title": "Monthly Reporting Workflow",
      "description": "Automated monthly business report generation. Pull sales data, calculate metrics, create visualizations, email to leadership team.",
      "category": "Finance",
      "priority": "medium",
      "status": "pending"
    }
  ]
}
```

---

## Build Checklist

### Backend (API & Data)
- [ ] Create workflows JSON structure
- [ ] Create API routes (GET, POST, PUT)
- [ ] Create workflowsService for file operations
- [ ] Add routes to server.js
- [ ] Create sample data
- [ ] Test API endpoints

### Frontend (UI)
- [ ] Create workflows.html page
- [ ] Add navigation link in index.html
- [ ] Create tabs (Inbox, Active, All)
- [ ] Create workflow cards component
- [ ] Create visual flow diagram (simple SVG or HTML)
- [ ] Create step-by-step detail panel
- [ ] Create inbox request form
- [ ] Add styling (workflows.css)
- [ ] Connect to backend API
- [ ] Test full flow

### Sample Workflows to Pre-Load
- [ ] File Organization System
- [ ] Contract Generation
- [ ] 2-3 inbox requests (pending)

---

## Key Features Summary

1. **Inbox** - New workflow requests awaiting implementation
2. **Active Workflows** - Currently running workflows with visual diagrams
3. **Step-by-Step Docs** - Detailed process for each workflow
4. **Reference Files** - Links to related documents
5. **Execution Tracking** - Last run, run count, success rate
6. **Categories** - Sales, Operations, Product, Finance, HR
7. **Request Form** - Submit new workflow ideas

---

## Success Criteria

- [ ] Can view all workflows in a list
- [ ] Can see visual diagram for each workflow
- [ ] Can click to see step-by-step details
- [ ] Can see reference files
- [ ] Can track execution stats
- [ ] Can submit new workflow requests to inbox
- [ ] Data syncs to GitHub
- [ ] Responsive design (works on mobile)

---

**Ready for Claude AI to build!** 🚀
