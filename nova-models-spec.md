# Nova Dashboard - Model Management Tab Specification

## Overview
Central command for all AI models, their roles, costs, and performance. See which models are connected, what they're doing, and get recommendations for optimization. The "fleet management" for your AI workforce.

---

## Core Purpose
1. **Connected models** - What's online and available
2. **Role assignment** - Which model does what job
3. **Cost optimization** - Are we using the right model for each task?
4. **Performance tracking** - Speed, quality, reliability by model
5. **Usage analytics** - Who's using what, how much
6. **Recommendations** - Should you add Gemini? Switch to DeepSeek?
7. **Model comparison** - Side-by-side capabilities and costs
8. **Auto-routing** - Smart model selection based on task

---

## Models in Fleet

### Current Models:
1. **Claude Opus** ($15/1M tokens) - Deep thinking, strategy, complex reasoning
2. **Claude Sonnet** ($3/1M tokens) - General purpose, coding, analysis
3. **Claude Haiku** ($0.25/1M tokens) - Fast, simple tasks, heartbeats
4. **GPT-4** ($30/1M tokens) - Research, data analysis, web search
5. **GPT-4 Turbo** ($10/1M tokens) - Faster GPT-4 for most tasks
6. **DeepSeek V3** ($0.50/1M tokens) - Coding, ultra-cheap workhorse
7. **Gemini Pro** ($0.50/1M tokens) - Multimodal, Google ecosystem
8. **Gemini Flash** ($0.35/1M tokens) - Fast, cheap, good for images
9. **Kimi K2.5** ($2/1M tokens) - Default, balanced quality/cost

### Future Models (Recommendations):
- **o1/o3** (OpenAI) - Reasoning models for complex problems
- **Llama 3** (Meta) - Open source, self-hostable
- **Mistral Large** - European, privacy-focused
- **Perplexity** - Research-focused with citations

---

## Data Models

### Model Configuration
```json
{
  "id": "model-claude-sonnet-4",
  "name": "Claude Sonnet 4",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  
  "costs": {
    "inputPer1k": "$0.003",
    "outputPer1k": "$0.015",
    "avgPer1k": "$0.009"
  },
  
  "capabilities": {
    "coding": 95,
    "reasoning": 90,
    "creativity": 85,
    "speed": 80,
    "context": 200000
  },
  
  "assignedRoles": [
    {
      "role": "primary_coder",
      "priority": 1,
      "description": "Primary coding agent for Nova builds"
    },
    {
      "role": "general_assistant",
      "priority": 2,
      "description": "General tasks when Opus not needed"
    }
  ],
  
  "routingRules": [
    {
      "condition": "taskType == 'coding' && complexity == 'medium'",
      "priority": 1
    },
    {
      "condition": "taskType == 'debugging'",
      "priority": 2
    }
  ],
  
  "status": "active",
  "health": "healthy",
  
  "usage": {
    "callsToday": 156,
    "tokensToday": 485000,
    "costToday": "$4.37",
    "callsThisMonth": 3420,
    "costThisMonth": "$89.50"
  },
  
  "performance": {
    "avgResponseTime": "8.5 seconds",
    "successRate": "99.2%",
    "qualityScore": 94,
    "userRating": 4.7
  },
  
  "enabled": true,
  "addedAt": "2026-01-15T00:00:00Z",
  "updatedAt": "2026-02-05T18:00:00Z"
}
```

### Usage Analytics
```json
{
  "date": "2026-02-05",
  "models": [
    {
      "modelId": "model-claude-sonnet-4",
      "calls": 156,
      "inputTokens": 245000,
      "outputTokens": 180000,
      "totalTokens": 425000,
      "cost": "$4.37",
      "byTask": {
        "coding": {"calls": 89, "cost": "$2.50"},
        "analysis": {"calls": 45, "cost": "$1.20"},
        "writing": {"calls": 22, "cost": "$0.67"}
      }
    },
    {
      "modelId": "model-deepseek-v3",
      "calls": 234,
      "inputTokens": 320000,
      "outputTokens": 210000,
      "totalTokens": 530000,
      "cost": "$0.27",
      "byTask": {
        "coding": {"calls": 180, "cost": "$0.18"},
        "research": {"calls": 54, "cost": "$0.09"}
      }
    }
  ],
  "totalCost": "$12.47",
  "savingsVsAllSonnet": "$45.20"
}
```

### Cost Optimization Recommendation
```json
{
  "id": "rec-001",
  "type": "cost_savings",
  "priority": "high",
  
  "title": "Switch heartbeat checks to Haiku",
  
  "current": {
    "model": "claude-sonnet-4",
    "frequency": "every 15 minutes",
    "dailyCost": "$2.40"
  },
  
  "recommended": {
    "model": "claude-haiku",
    "frequency": "every 15 minutes",
    "dailyCost": "$0.20"
  },
  
  "savings": {
    "daily": "$2.20",
    "monthly": "$66",
    "yearly": "$792"
  },
  
  "impact": "low",
  "reasoning": "Heartbeat checks are simple status checks. Haiku is sufficient and 12x cheaper.",
  
  "implementation": "Change model alias in heartbeat config",
  "effort": "5 minutes",
  
  "status": "pending"
}
```

### Model Comparison
```json
{
  "comparison": {
    "models": ["claude-sonnet-4", "deepseek-v3", "gpt-4-turbo"],
    "task": "coding_debugging",
    
    "results": [
      {
        "model": "claude-sonnet-4",
        "quality": 95,
        "speed": "12s",
        "cost": "$0.15",
        "bestFor": "Complex bugs, architecture decisions"
      },
      {
        "model": "deepseek-v3",
        "quality": 88,
        "speed": "8s",
        "cost": "$0.02",
        "bestFor": "Routine debugging, simple fixes"
      },
      {
        "model": "gpt-4-turbo",
        "quality": 92,
        "speed": "10s",
        "cost": "$0.08",
        "bestFor": "When Claude is down"
      }
    ],
    
    "recommendation": "Use DeepSeek for routine debugging (85% of cases), Claude for complex issues (15%)"
  }
}
```

---

## UI Layout

### Model Fleet Overview
```
┌─────────────────────────────────────────────────────────────┐
│ MODEL MANAGEMENT                                           │
├─────────────────────────────────────────────────────────────┤
│ [Fleet] [Usage] [Costs] [Recommendations] [Add Model]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ ACTIVE FLEET (8 models)                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  🥇 Claude Sonnet 4                     ✅ Online         │
│     Primary Coder | 156 calls today | $4.37               │
│     Quality: 94% | Speed: 8.5s | Success: 99.2%          │
│     [Config] [View Usage] [Test]                          │
│                                                             │
│  🥈 DeepSeek V3                         ✅ Online         │
│     Cost Optimizer | 234 calls today | $0.27              │
│     Quality: 88% | Speed: 6.2s | Success: 98.5%          │
│     💡 Saving $45/day vs using Sonnet for all             │
│                                                             │
│  🥉 GPT-4 Turbo                         ✅ Online         │
│     Research Lead | 45 calls today | $3.60                │
│     Quality: 92% | Speed: 7.8s | Success: 99.1%          │
│                                                             │
│  Claude Opus                            ⏸️ Standby        │
│     Strategy/Deep Think | 3 calls today | $1.20           │
│     Used for: Complex decisions, planning                 │
│                                                             │
│  Kimi K2.5                              ✅ Online         │
│     Default/General | 89 calls today | $1.78              │
│                                                             │
│  Gemini Flash                           ✅ Online         │
│     Image/Vision | 12 calls today | $0.15                 │
│                                                             │
│  Claude Haiku                           ✅ Online         │
│     Fast Tasks | 456 calls today | $0.11                  │
│                                                             │
│  Gemini Pro                             ✅ Online         │
│     Multimodal | 23 calls today | $0.52                   │
│                                                             │
│  📊 TODAY'S COSTS                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Total: $12.47 | 1,018 calls | 2.4M tokens                │
│  vs yesterday: ↓ 15% | vs budget: ✅ On track             │
│                                                             │
│  💡 OPTIMIZATION RECOMMENDATIONS                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🔥 HIGH IMPACT                                            │
│  • Switch heartbeats to Haiku → Save $66/month           │
│  • Use DeepSeek for 80% of coding → Save $120/month      │
│                                                             │
│  ⭐ MEDIUM IMPACT                                          │
│  • Add Gemini Flash for images → Better quality, same cost│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Model Detail View
```
┌─────────────────────────────────────────────────────────────┐
│ Claude Sonnet 4                               [Edit] [Test]│
├─────────────────────────────────────────────────────────────┤
│ Status: 🟢 Active | Provider: Anthropic                    │
│                                                             │
│  CAPABILITIES                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Coding:        ████████████████████████████ 95/100       │
│  Reasoning:     ██████████████████████████░░ 90/100       │
│  Creativity:    ████████████████████████░░░░ 85/100       │
│  Speed:         ███████████████████████░░░░░ 80/100       │
│  Context:       200,000 tokens                             │
│                                                             │
│  COSTS                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Input:  $0.003 / 1K tokens                                │
│  Output: $0.015 / 1K tokens                                │
│  Avg:    $0.009 / 1K tokens                                │
│                                                             │
│  TODAY'S USAGE                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Calls: 156                                                │
│  Tokens: 425,000                                           │
│  Cost: $4.37                                               │
│                                                             │
│  BY TASK:                                                  │
│  Coding:      89 calls | $2.50 | 57%                      │
│  Analysis:    45 calls | $1.20 | 29%                      │
│  Writing:     22 calls | $0.67 | 14%                      │
│                                                             │
│  ASSIGNED ROLES                                            │
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  1. Primary Coder (Priority: 1)                           │
│     Medium complexity coding, debugging                   │
│                                                             │
│  2. General Assistant (Priority: 2)                       │
│     General tasks when Opus not needed                    │
│                                                             │
│  PERFORMANCE                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Avg response: 8.5 seconds                                 │
│  Success rate: 99.2%                                       │
│  Quality score: 94/100                                     │
│  User rating: 4.7/5                                        │
│                                                             │
│  [View Logs] [Run Diagnostics] [Temp Disable]             │
└─────────────────────────────────────────────────────────────┘
```

### Cost Analytics
```
┌─────────────────────────────────────────────────────────────┐
│ COST ANALYTICS                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📈 SPENDING TRENDS                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Line chart: Daily spend over last 30 days]              │
│                                                             │
│  Today: $12.47                                             │
│  This week: $78.50                                         │
│  This month: $312.40 (projected: $420)                    │
│  Budget: $500/month | ✅ 62% under budget                 │
│                                                             │
│  💰 COST BY MODEL                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Claude Sonnet 4:  ████████████████████ $89.50 (29%)      │
│  GPT-4 Turbo:      ██████████████░░░░░░ $67.20 (21%)      │
│  Claude Opus:      ████████░░░░░░░░░░░░ $34.80 (11%)      │
│  Kimi K2.5:        ██████░░░░░░░░░░░░░░ $23.40 (7%)       │
│  DeepSeek V3:      ███░░░░░░░░░░░░░░░░░ $8.50 (3%)        │
│  Others:           ████████████████████ $89.00 (29%)      │
│                                                             │
│  🎯 COST BY TASK TYPE                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Coding:       $145.20 (46%)                               │
│  Research:     $67.80 (22%)                                │
│  Analysis:     $45.60 (15%)                                │
│  Writing:      $34.20 (11%)                                │
│  Other:        $19.60 (6%)                                 │
│                                                             │
│  💡 OPTIMIZATION OPPORTUNITIES                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Potential monthly savings: $456                           │
│                                                             │
│  1. Switch coding to DeepSeek → Save $240/month          │
│     (88% quality is sufficient for 80% of tasks)         │
│                                                             │
│  2. Use Haiku for heartbeats → Save $66/month            │
│     (Simple status checks don't need Sonnet)             │
│                                                             │
│  3. Batch research tasks → Save $80/month                │
│     (Combine multiple queries into single calls)         │
│                                                             │
│  4. Add Gemini Flash for images → Save $70/month         │
│     (Better than current image processing)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend API

```javascript
// Models
GET    /api/models                     # Get all models
GET    /api/models/:id                 # Get model details
GET    /api/models/:id/usage           # Get model usage
PUT    /api/models/:id/config          # Update model config
PUT    /api/models/:id/roles           # Update assigned roles
POST   /api/models/:id/test            # Test model
POST   /api/models                     # Add new model
DELETE /api/models/:id                 # Remove model

// Analytics
GET    /api/models/analytics/usage     # Usage analytics
GET    /api/models/analytics/costs     # Cost analytics
GET    /api/models/analytics/compare   # Model comparison
GET    /api/models/analytics/trends    # Usage trends

// Optimization
GET    /api/models/recommendations     # Get recommendations
POST   /api/models/optimize            # Auto-optimize routing
GET    /api/models/savings             # Potential savings

// Routing
POST   /api/models/route               # Smart model selection
Body: { task, complexity, context }
```

---

## Key Features

1. **Fleet dashboard** - All models, status, health
2. **Role assignment** - What each model does
3. **Smart routing** - Auto-select best model for task
4. **Cost tracking** - Per-model and total spend
5. **Usage analytics** - Calls, tokens, by task
6. **Performance metrics** - Quality, speed, reliability
7. **Optimization recs** - How to save money
8. **Model comparison** - Side-by-side capabilities
9. **Budget tracking** - Stay within limits
10. **Auto-optimization** - Let system optimize routing

---

## Success Criteria

- [ ] View all connected models with status
- [ ] See assigned roles per model
- [ ] Track costs by model and task
- [ ] View usage analytics
- [ ] Get optimization recommendations
- [ ] Compare models side-by-side
- [ ] Smart routing suggestions
- [ ] Budget tracking and alerts
- [ ] Add/remove models
- [ ] Data syncs to GitHub

---

**Status: Ready to build** 🚀
