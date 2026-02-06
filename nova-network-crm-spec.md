# Nova Dashboard - Network CRM Tab Specification

## Overview
A relationship intelligence system to track key contacts, deal flow sources, value exchanges, and "touches." Your network is your net worth—this systematizes it.

---

## Core Purpose
1. **Contact management** - Key relationships with full context
2. **Deal flow tracking** - Who brings you opportunities
3. **Value exchange log** - What you've given vs received
4. **Introduction tracking** - Who connected you to whom
5. **Touch reminders** - Never let relationships go cold
6. **Relationship strength scoring** - Who are your real advocates
7. **Gratitude tracking** - Who you've thanked and how
8. **Network value** - Calculate worth of relationships

---

## Data Models

### Contact
```json
{
  "id": "contact-001",
  "name": "Francis Tran",
  "email": "ftran@studioshadeco.com",
  "phone": "+1-xxx-xxx-xxxx",
  "company": "LoanDepot / Studio Shade Co",
  "title": "Co-founder",
  
  "relationship": {
    "type": "mentor",
    "strength": "strong", // weak, medium, strong
    "since": "2025-06-01",
    "source": "Mutual connection - John Smith"
  },
  
  "categories": ["Business Partner", "Mentor", "Investor"],
  
  "valueExchange": {
    "given": [
      {"what": "Introduced to BlindMatrix team", "date": "2026-01-15", "value": "high"},
      {"what": "Weekly strategy advice", "date": "ongoing", "value": "high"}
    ],
    "received": [
      {"what": "Manufacturing partnership", "date": "2025-07-01", "value": "critical"},
      {"what": "Co-founder investment", "date": "2025-08-01", "value": "high"}
    ],
    "balance": "positive" // positive, neutral, negative
  },
  
  "dealFlow": {
    "brought": 5,
    "converted": 3,
    "value": "$450,000",
    "deals": [
      {"name": "ABC Corp contract", "value": "$150k", "date": "2025-11-01"},
      {"name": "XYZ Homes order", "value": "$200k", "date": "2026-01-10"}
    ]
  },
  
  "introductions": {
    "made": [
      {"who": "Chad Nickolas (Forma Living)", "date": "2025-08-01", "outcome": "Manufacturing partnership"},
      {"who": "Hung Dang", "date": "2025-09-01", "outcome": "Tech support"}
    ],
    "received": [
      {"who": "John Smith", "date": "2025-06-01", "outcome": "Initial connection"}
    ]
  },
  
  "interactions": {
    "lastContact": "2026-02-05",
    "lastMethod": "weekly strategy call",
    "frequency": "weekly",
    "nextTouch": "2026-02-12",
    "totalInteractions": 45
  },
  
  "notes": "Critical mentor and business partner. Weekly calls every Saturday.",
  
  "createdAt": "2025-06-01T00:00:00Z",
  "updatedAt": "2026-02-05T00:00:00Z"
}
```

### Touch/Interaction
```json
{
  "id": "touch-001",
  "contactId": "contact-001",
  "date": "2026-02-05",
  "method": "video_call",
  "duration": "60 minutes",
  
  "context": "Weekly strategy call",
  
  "topics": ["Nova Dashboard progress", "Q1 sales strategy", "Hiring plans"],
  
  "insights": [
    "Don't optimize for revenue in year 1, optimize for learning",
    "Focus on systems before scaling"
  ],
  
  "actions": [
    {"what": "Implement Nova workflows", "due": "2026-02-07", "completed": false},
    {"what": "Schedule installer interviews", "due": "2026-02-10", "completed": false}
  ],
  
  "valueExchange": {
    "gave": "Update on product progress",
    "received": "Strategic direction"
  },
  
  "followUp": {
    "needed": true,
    "date": "2026-02-12",
    "topic": "Progress review"
  },
  
  "createdAt": "2026-02-05T10:00:00Z"
}
```

### Deal Flow Source
```json
{
  "id": "deal-source-001",
  "contactId": "contact-003",
  "contactName": "Sarah Johnson",
  
  "opportunities": [
    {
      "id": "opp-001",
      "name": "Luxury Home Builders Association",
      "description": "Introduction to 12 builders",
      "dateReceived": "2026-01-10",
      "status": "in_progress",
      "value": "$500k potential",
      "converted": false,
      "notes": "Hot lead, need to follow up"
    },
    {
      "id": "opp-002",
      "name": "Metro Property Management",
      "description": "200 unit order",
      "dateReceived": "2025-12-01",
      "status": "closed_won",
      "value": "$180k",
      "converted": true,
      "closedDate": "2026-01-15"
    }
  ],
  
  "metrics": {
    "totalDealsBrought": 5,
    "conversionRate": 60,
    "totalValue": "$680k",
    "averageDealSize": "$136k"
  },
  
  "quality": "high" // hot, warm, cold
}
```

### Introduction Chain
```json
{
  "id": "intro-001",
  "from": "John Smith",
  "to": "Francis Tran",
  "date": "2025-06-01",
  "context": "Met at real estate conference",
  
  "outcome": {
    "status": "successful",
    "result": "Co-founded Studio Shade Co",
    "value": "Immeasurable"
  },
  
  "gratitude": {
    "thanked": true,
    "how": "Dinner + equity offer (declined)",
    "date": "2025-12-01"
  },
  
  "payItForward": [
    {"introduced": "Chad Nickolas to Francis", "date": "2025-08-01", "outcome": "Manufacturing partnership"}
  ]
}
```

### Gratitude Log
```json
{
  "id": "gratitude-001",
  "contactId": "contact-001",
  "date": "2025-12-01",
  
  "reason": "6 months of mentorship and partnership",
  
  "how": {
    "method": "dinner",
    "gift": null,
    "note": "Handwritten thank you card",
    "equityOffered": true,
    "equityAccepted": false
  },
  
  "impact": "Strengthened relationship significantly",
  
  "followUp": "Continue weekly calls"
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ NETWORK CRM                                      [+ Contact]│
├─────────────────────────────────────────────────────────────┤
│ [All] [Mentors] [Investors] [Partners] [Deal Sources]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚠️ TOUCH NEEDED (3)                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🔴 Michael Chen - 45 days since last contact             │
│     High-value contact, deal source                        │
│     [Schedule Call] [Send Message]                        │
│                                                             │
│  🟡 Sarah Johnson - 28 days since last contact            │
│     Warm lead source                                       │
│     [Quick Check-in]                                      │
│                                                             │
│  💪 TOP RELATIONSHIPS                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🥇 Francis Tran                                           │
│     Mentor + Business Partner | Strong relationship       │
│     Value received: Manufacturing partnership + Investment │
│     Deal flow: 5 deals, $450k value                       │
│     Last contact: Today (weekly call)                     │
│     [View Profile] [Schedule] [Log Interaction]           │
│                                                             │
│  🥈 Chad Nickolas                                          │
│     Manufacturing Partner | Strong relationship           │
│     Value received: Production capacity + Quality         │
│     Deal flow: 12 orders, $380k value                     │
│     Last contact: 3 days ago                              │
│                                                             │
│  📊 NETWORK METRICS                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Total contacts: 47                                        │
│  Strong relationships: 12                                  │
│  Deal sources: 8                                           │
│  Deal flow this quarter: $1.2M                            │
│  Introductions made: 15                                    │
│  Network value (est): $5M+                                │
│                                                             │
│  💰 TOP DEAL SOURCES                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  1. Francis Tran      $450k  |  5 deals  |  60% convert   │
│  2. Sarah Johnson     $680k  |  5 deals  |  60% convert   │
│  3. Real Estate Group $320k  |  8 deals  |  40% convert   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Contact Detail View

```
┌─────────────────────────────────────────────────────────────┐
│ Francis Tran                                    [Edit] [✕]  │
├─────────────────────────────────────────────────────────────┤
│ ftran@studioshadeco.com | Co-founder, Studio Shade Co      │
│                                                             │
│  RELATIONSHIP                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Type: Mentor, Business Partner, Investor                 │
│  Strength: Strong (45 interactions since Jun 2025)        │
│  Source: Introduced by John Smith                         │
│                                                             │
│  VALUE EXCHANGE                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Received: Manufacturing partnership, $50k investment     │
│  Given: BlindMatrix intro, weekly product updates         │
│  Balance: Strongly positive                               │
│                                                             │
│  DEAL FLOW (5 deals, $450k)                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✅ ABC Corp contract          $150k  | Nov 2025          │
│  ✅ XYZ Homes order            $200k  | Jan 2026          │
│  🔄 Metro Properties            TBD   | In discussion     │
│                                                             │
│  INTRODUCTIONS MADE                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  → Chad Nickolas (Forma Living)  | Aug 2025 | Manufacturing│
│  → Hung Dang (Tech)              | Sep 2025 | Support     │
│                                                             │
│  RECENT INTERACTIONS                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Today: Weekly strategy call (60 min)                     │
│    Topics: Nova progress, Q1 strategy, hiring             │
│    Insight: "Optimize for learning, not revenue"          │
│                                                             │
│  Jan 29: Quick check-in (15 min)                          │
│    Topics: Contract generation workflow                   │
│                                                             │
│  [Log New Interaction] [Schedule Next Touch]              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

1. **Contact profiles** with relationship strength
2. **Deal flow tracking** - who brings opportunities
3. **Value exchange** log (given vs received)
4. **Introduction tracking** - who connected whom
5. **Touch reminders** - never let relationships go cold
6. **Interaction logging** - every call, email, meeting
7. **Gratitude tracking** - who you've thanked
8. **Network analytics** - total value, conversion rates
9. **Introduction chains** - track the full network effect
10. **Search** by category, strength, deal source

---

## Success Criteria

- [ ] Add contacts with full context
- [ ] Track deal flow by source
- [ ] Log value exchanges
- [ ] Record introductions made/received
- [ ] Set and receive touch reminders
- [ ] Log every interaction
- [ ] Track gratitude (how you thanked people)
- [ ] See network metrics (total value, etc.)
- [ ] Identify top deal sources
- [ ] Data syncs to GitHub

---

**Status: Ready to build** 🚀
