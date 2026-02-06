# Nova Dashboard - Skills & Integrations Tab Specification

## Overview
Central command for all your AI skills, API integrations, and capability management. See what's connected, what's available, and what's on deck for future implementation.

---

## Core Purpose
1. **Active skills** - What's running right now
2. **Available integrations** - What you could connect
3. **Skill pipeline** - Ideas for future capabilities
4. **Health monitoring** - Are skills working properly?
5. **Cost tracking** - Per-skill usage and efficiency
6. **Quick actions** - Enable/disable skills, run diagnostics

---

## Data Models

### Active Skill
```json
{
  "id": "skill-github",
  "name": "GitHub Integration",
  "category": "Development",
  "status": "active",
  "provider": "GitHub",
  
  "capabilities": [
    "Push code changes",
    "Create pull requests",
    "Review commits",
    "Manage issues"
  ],
  
  "usage": {
    "lastUsed": "2026-02-05T18:00:00Z",
    "usesToday": 12,
    "usesThisWeek": 45,
    "avgResponseTime": "2.3 seconds"
  },
  
  "cost": {
    "model": "free",
    "monthlyCost": "$0",
    "monthlyQuota": "5000 requests",
    "quotaUsed": 1876
  },
  
  "health": {
    "status": "healthy",
    "uptime": "99.9%",
    "lastError": null,
    "errorCount24h": 0
  },
  
  "workflowsUsing": [
    "wf-file-organization",
    "wf-contract-generation",
    "wf-daily-backup"
  ],
  
  "config": {
    "repo": "axiommaximusai-collab/axiom-memory",
    "branch": "main",
    "autoCommit": true
  },
  
  "installedAt": "2026-01-15T00:00:00Z",
  "updatedAt": "2026-02-05T18:00:00Z"
}
```

### Available Integration
```json
{
  "id": "integration-slack",
  "name": "Slack",
  "category": "Communication",
  "provider": "Slack",
  "status": "available",
  
  "description": "Send messages and notifications to Slack channels",
  
  "capabilities": [
    "Send channel messages",
    "Create alerts",
    "Monitor mentions",
    "Automate responses"
  ],
  
  "useCases": [
    "Team notifications from Nova",
    "Alert on task completion",
    "Daily summary reports"
  ],
  
  "cost": {
    "model": "free",
    "notes": "Free tier: 10k messages/month"
  },
  
  "requirements": [
    "Slack workspace admin access",
    "Bot token creation",
    "Channel permissions"
  ],
  
  "estimatedSetupTime": "15 minutes",
  "priority": "medium",
  
  "similarTo": ["discord", "teams"]
}
```

### Skill Pipeline (On Deck)
```json
{
  "id": "pipeline-001",
  "name": "QuickBooks Integration",
  "category": "Finance",
  
  "description": "Sync invoices, track expenses, generate financial reports",
  
  "businessValue": "Automate invoicing, reduce manual bookkeeping by 5hrs/week",
  
  "estimatedCost": {
    "setup": "$50 (one-time)",
    "monthly": "$0",
    "apiCalls": "~$5/month"
  },
  
  "priority": "high",
  "requestedBy": "Nick",
  "requestedDate": "2026-02-01",
  
  "dependencies": [
    "Complete finance workflow",
    "Set up QuickBooks account"
  ],
  
  "notes": "Critical for scaling. Francis wants automated invoicing.",
  
  "status": "planned",
  "targetDate": "2026-03-01"
}
```

### API Health Status
```json
{
  "id": "health-check",
  "timestamp": "2026-02-05T22:00:00Z",
  
  "apis": [
    {
      "name": "GitHub",
      "status": "healthy",
      "responseTime": "234ms",
      "lastCheck": "2026-02-05T22:00:00Z",
      "errorRate": "0%"
    },
    {
      "name": "Google Drive",
      "status": "healthy",
      "responseTime": "456ms",
      "lastCheck": "2026-02-05T22:00:00Z",
      "errorRate": "0%"
    },
    {
      "name": "Telegram",
      "status": "warning",
      "responseTime": "1200ms",
      "lastCheck": "2026-02-05T22:00:00Z",
      "errorRate": "2%",
      "message": "Slower than usual, investigating"
    }
  ]
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ SKILLS & INTEGRATIONS                          [+ Pipeline] │
├─────────────────────────────────────────────────────────────┤
│ [Active] [Available] [On Deck] [Health]                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ ACTIVE SKILLS (8)                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  🟢 GitHub Integration            Dev      ✅ Healthy     │
│     45 uses this week | 2.3s avg response                  │
│     Used by: File Org, Contracts, Backup                  │
│     [Config] [Diagnostics]                                │
│                                                             │
│  🟢 Google Drive                  Data     ✅ Healthy     │
│     89 uses this week | 456ms avg response                │
│     Used by: File Org, Contracts                          │
│                                                             │
│  🟢 Telegram                      Comms    ✅ Healthy     │
│     156 uses this week | Axiom messages                   │
│                                                             │
│  🟢 Google Sheets                 Data     ✅ Healthy     │
│     Used by: Contract Generation                          │
│                                                             │
│  📊 API HEALTH                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  GitHub:     ✅ 234ms   | 0% errors                        │
│  Drive:      ✅ 456ms   | 0% errors                        │
│  Telegram:   ⚠️ 1200ms  | 2% errors  | Investigating      │
│  Sheets:     ✅ 312ms   | 0% errors                        │
│                                                             │
│  💡 AVAILABLE TO CONNECT                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🔌 Slack                       Comms    15 min setup     │
│     Team notifications, alerts, daily reports             │
│     [Connect] [Learn More]                                │
│                                                             │
│  🔌 Notion                      Productivity              │
│     Knowledge base, documentation                         │
│     [Connect]                                              │
│                                                             │
│  🔌 QuickBooks                  Finance    ⭐ HIGH PRIORITY│
│     Invoicing, expense tracking                           │
│     [Connect] [Priority: High]                            │
│                                                             │
│  🎯 ON DECK (Ideas)                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📋 Zapier Integration        Automation  High Value      │
│     Connect 5000+ apps                                     │
│     Est. setup: 2 hours | Value: Massive                  │
│     [Move to Pipeline] [Details]                          │
│                                                             │
│  📋 HubSpot CRM               Sales        Medium Value   │
│     Customer relationship management                      │
│     Est. setup: 4 hours | Value: High                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Skill Detail View

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Integration                              [Edit] [✕]  │
├─────────────────────────────────────────────────────────────┤
│ Status: 🟢 Active | Category: Development                  │
│                                                             │
│  CAPABILITIES                                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✓ Push code changes                                      │
│  ✓ Create pull requests                                   │
│  ✓ Review commits                                         │
│  ✓ Manage issues                                          │
│                                                             │
│  USAGE THIS WEEK                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Total calls: 45                                           │
│  Avg response time: 2.3 seconds                           │
│  Success rate: 100%                                        │
│  Peak usage: Tuesday 2pm (12 calls)                       │
│                                                             │
│  WORKFLOWS USING THIS SKILL                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • File Organization System (12 calls)                    │
│  • Contract Generation (8 calls)                          │
│  • Daily Backup (15 calls)                                │
│  • Nova Dashboard Sync (10 calls)                         │
│                                                             │
│  CONFIGURATION                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Repository: axiommaximusai-collab/axiom-memory           │
│  Branch: main                                              │
│  Auto-commit: ✅ Enabled                                  │
│  Commit message: "Auto-sync from Nova"                    │
│                                                             │
│  [Run Diagnostics] [View Logs] [Disable Skill]            │
└─────────────────────────────────────────────────────────────┘
```

---

## On Deck / Pipeline View

```
┌─────────────────────────────────────────────────────────────┐
│ SKILL PIPELINE                                  [+ Add Idea]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔥 HIGH PRIORITY                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📋 QuickBooks Integration              Finance           │
│     Value: Automate invoicing, save 5hrs/week             │
│     Cost: $50 setup + $5/month                            │
│     Target: March 2026                                     │
│     [Start Implementation] [Details] [Move to Active]     │
│                                                             │
│  📋 Zapier Integration                  Automation        │
│     Value: Connect 5000+ apps                             │
│     Cost: $20/month                                        │
│     Target: February 2026                                  │
│     [Start Implementation] [Details]                      │
│                                                             │
│  ⭐ MEDIUM PRIORITY                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📋 HubSpot CRM                         Sales             │
│     Value: Customer management                            │
│     Cost: $50/month                                        │
│     Target: Q2 2026                                        │
│                                                             │
│  📋 Twilio SMS                          Communication     │
│     Value: SMS notifications to customers                 │
│     Cost: $0.01/SMS                                        │
│     Target: Q2 2026                                        │
│                                                             │
│  💡 IDEAS POOL                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Asana project management                               │
│  • Zoom meeting automation                                │
│  • Calendly scheduling                                    │
│  • Stripe payment processing                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend API

```javascript
// Skills
GET    /api/skills/active          # Get active skills
GET    /api/skills/available       # Get available integrations
GET    /api/skills/pipeline        # Get pipeline ideas
GET    /api/skills/:id             # Get skill details
PUT    /api/skills/:id/config      # Update skill config
POST   /api/skills/:id/enable      # Enable skill
POST   /api/skills/:id/disable     # Disable skill
POST   /api/skills/:id/test        # Test skill

// Pipeline
POST   /api/skills/pipeline        # Add to pipeline
PUT    /api/skills/pipeline/:id    # Update pipeline item
DELETE /api/skills/pipeline/:id    # Remove from pipeline
PUT    /api/skills/pipeline/:id/activate  # Move to active

// Health
GET    /api/skills/health          # Get health status
POST   /api/skills/:id/diagnostics # Run diagnostics
GET    /api/skills/:id/logs        # Get skill logs
```

---

## Key Features

1. **Active skills dashboard** - What's running now
2. **Available integrations** - What you could connect
3. **Skill pipeline** - Ideas prioritized by value
4. **Health monitoring** - Real-time status of all APIs
5. **Usage tracking** - Which skills get used most
6. **Workflow mapping** - Which workflows use which skills
7. **Cost tracking** - Per-skill cost analysis
8. **Quick setup** - One-click connect for available skills
9. **Diagnostics** - Test and troubleshoot skills
10. **Idea submission** - Add new skill ideas to pipeline

---

## Success Criteria

- [ ] View all active skills with status
- [ ] See available integrations to connect
- [ ] Manage skill pipeline (prioritized ideas)
- [ ] Monitor API health in real-time
- [ ] Track usage per skill
- [ ] See which workflows use each skill
- [ ] Run diagnostics on any skill
- [ ] Quick enable/disable skills
- [ ] Add new skill ideas to pipeline
- [ ] Data syncs to GitHub

---

**Status: Ready to build** 🚀
