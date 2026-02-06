# Nova Dashboard - Counsel Tab Specification

## Overview
An AI Advisory Board where multiple LLM agents with different personas debate your decisions and synthesize recommendations. Think of it as having Claude, GPT-4, Gemini, and DeepSeek all in a room discussing your next move.

---

## Core Concept

```
YOU: "Should we expand to Texas market or double down on California?"

COUNSEL TAB summons:
├─ 🏢 Business Strategist (Claude - big picture thinking)
├─ 📊 Data Analyst (GPT-4 - research and numbers)
├─ ⚖️ Risk Assessor (DeepSeek - what could go wrong)
├─ 💰 Financial Advisor (Gemini - ROI and cash flow)
└─ 🎯 Synthesizer (Claude again - combines all views)

OUTPUT:
├─ Each agent's position (300 words each)
├─ Points of agreement
├─ Points of disagreement  
├─ Confidence scores
├─ Risk analysis
└─ FINAL RECOMMENDATION with reasoning
```

---

## AI Agent Personas

### 1. Business Strategist (Claude)
**Role:** Long-term thinking, market positioning, competitive advantage
**Style:** Measured, considers second-order effects, focuses on sustainable growth
**Questions they ask:**
- What moat does this create?
- How does this position us in 3-5 years?
- What are the opportunity costs?

### 2. Data Analyst (GPT-4)
**Role:** Market research, numbers, trends, competitive analysis
**Style:** Data-driven, seeks evidence, quantifies everything
**Capabilities:**
- Web search for market data
- Analyze competitor positioning
- Calculate market size and TAM
- Find relevant case studies

### 3. Risk Assessor (DeepSeek)
**Role:** Devil's advocate, what could go wrong, downside scenarios
**Style:** Critical thinking, worst-case planning, contingency focus
**Questions they ask:**
- What are the 3 ways this could fail?
- What's our downside if we're wrong?
- Do we have the resources to recover?

### 4. Financial Advisor (Gemini)
**Role:** ROI, cash flow, capital allocation, unit economics
**Style:** Numbers-focused, profitability-minded, resource-conscious
**Calculates:**
- Expected ROI
- Payback period
- Cash flow impact
- Opportunity cost of capital

### 5. Synthesizer (Claude)
**Role:** Combines all perspectives into actionable recommendation
**Style:** Balanced, acknowledges uncertainty, provides clear next steps
**Output:**
- Consensus view
- Dissenting opinions (and why they matter)
- Confidence level
- Recommended action with rationale

---

## Data Models

### Counsel Session
```json
{
  "id": "counsel-001",
  "topic": "Should we expand to Texas market or focus on California?",
  "category": "Strategy",
  "context": {
    "currentSituation": "Studio Shade has 80% market share in California, saturated",
    "resources": "$500k available for expansion",
    "timeline": "Q2 2026 decision needed",
    "constraints": ["Limited installation team", "Supply chain setup required"]
  },
  
  "agents": [
    {
      "agent": "business_strategist",
      "model": "claude-opus",
      "position": "Expand to Texas. California is saturated...",
      "keyPoints": ["First-mover advantage in Texas", "Diversification reduces risk"],
      "confidence": 85,
      "time": "45 seconds"
    },
    {
      "agent": "data_analyst",
      "model": "gpt-4",
      "position": "California still has 20% growth potential...",
      "keyPoints": ["Texas TAM is $2B vs CA remaining $500M", "TX competition is lighter"],
      "confidence": 78,
      "time": "32 seconds",
      "sources": ["IBISWorld 2025", "Census Bureau"]
    },
    {
      "agent": "risk_assessor",
      "model": "deepseek",
      "position": "High risk in Texas expansion...",
      "keyPoints": ["Supply chain unproven", "Brand unknown in TX", "Hiring challenge"],
      "confidence": 72,
      "time": "28 seconds"
    },
    {
      "agent": "financial_advisor",
      "model": "gemini-pro",
      "position": "Financially viable with conditions...",
      "keyPoints": ["Break-even in 18 months", "ROI of 240% over 3 years"],
      "confidence": 80,
      "calculations": {
        "investment": "$500k",
        "breakEven": "Month 18",
        "roi3Year": "240%",
        "paybackPeriod": "18 months"
      }
    }
  ],
  
  "synthesis": {
    "consensus": "Conditional expansion to Texas",
    "agreementPoints": ["Texas opportunity is real", "Timing is critical"],
    "disagreementPoints": ["Risk tolerance", "Resource allocation"],
    "confidence": 82,
    "recommendation": "Pilot Texas expansion in Q2 with $200k investment...",
    "nextSteps": [
      "Validate supply chain partnerships",
      "Hire 2 installers in Dallas area",
      "Run 3-month pilot with 20 customers"
    ]
  },
  
  "decision": {
    "madeBy": "Nick Oliphant",
    "decision": "Proceed with pilot",
    "rationale": "Aligns with consensus, mitigates risk",
    "date": "2026-02-06",
    "outcome": null // to be filled later
  },
  
  "cost": "$0.47",
  "duration": "2 minutes",
  "createdAt": "2026-02-05T22:00:00Z"
}
```

### Agent Configuration
```json
{
  "agents": [
    {
      "id": "business_strategist",
      "name": "Business Strategist",
      "model": "claude-opus",
      "provider": "anthropic",
      "systemPrompt": "You are a senior business strategist...",
      "costPer1k": "$0.015",
      "enabled": true
    },
    {
      "id": "data_analyst",
      "name": "Data Analyst",
      "model": "gpt-4",
      "provider": "openai",
      "systemPrompt": "You are a data-driven analyst...",
      "costPer1k": "$0.03",
      "enabled": true
    },
    {
      "id": "risk_assessor",
      "name": "Risk Assessor",
      "model": "deepseek-chat",
      "provider": "deepseek",
      "systemPrompt": "You are a critical risk analyst...",
      "costPer1k": "$0.0007",
      "enabled": true
    },
    {
      "id": "financial_advisor",
      "name": "Financial Advisor",
      "model": "gemini-pro",
      "provider": "google",
      "systemPrompt": "You are a financial advisor...",
      "costPer1k": "$0.005",
      "enabled": true
    }
  ]
}
```

---

## UI Layout

### Main Counsel View
```
┌─────────────────────────────────────────────────────────────┐
│ COUNSEL - AI ADVISORY BOARD                     [New Topic] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎯 ASK THE COUNCIL                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [______________________________________________]          │
│  [Quick: Strategy] [Quick: Hiring] [Quick: Investment]     │
│                                                             │
│  📊 RECENT DECISIONS                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • TX vs CA expansion           ✅ Decided: Pilot TX      │
│    Confidence: 82% | Cost: $0.47 | 2 days ago             │
│                                                             │
│  • Hire 3rd installer           ✅ Decided: Wait for Q2   │
│    Confidence: 91% | Cost: $0.32 | 5 days ago             │
│                                                             │
│  💰 COUNSEL STATS                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Total sessions: 12                                        │
│  Avg confidence: 84%                                       │
│  Decision accuracy: 92% (based on outcomes)               │
│  Total cost: $5.40                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Counsel Session Detail
```
┌─────────────────────────────────────────────────────────────┐
│ TX vs CA Expansion                              [$0.47]    │
├─────────────────────────────────────────────────────────────┤
│ Should we expand to Texas or focus on California?          │
│ Category: Strategy | Confidence: 82%                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏢 BUSINESS STRATEGIST (Claude)          Confidence: 85% │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Position: EXPAND TO TEXAS                                 │
│  "California is saturated with 80% market share. Texas    │
│   represents a $2B opportunity with lighter competition..."│
│  Key Points:                                              │
│  • First-mover advantage in Texas                         │
│  • Diversification reduces single-market risk            │
│  • Brand can dominate TX like CA                          │
│                                                             │
│  📊 DATA ANALYST (GPT-4)                  Confidence: 78% │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Position: LEAN TOWARD TEXAS                               │
│  "Market data shows Texas TAM at $2.1B vs CA remaining    │
│   addressable at $500M. Competition analysis..."          │
│  Key Points:                                              │
│  • Texas TAM 4x larger than CA remaining                 │
│  • 12 competitors in CA vs 3 in TX                       │
│  Sources: IBISWorld 2025, Census Bureau                  │
│                                                             │
│  ⚖️ RISK ASSESSOR (DeepSeek)              Confidence: 72% │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Position: HIGH CAUTION                                    │
│  "Three critical risks: supply chain unproven, brand     │
│   unknown in TX, hiring challenge in tight labor market..."│
│  Key Points:                                              │
│  • Supply chain needs 6-month validation                 │
│  • Brand awareness = 0% in TX                            │
│  • Installer hiring historically difficult               │
│                                                             │
│  💰 FINANCIAL ADVISOR (Gemini)            Confidence: 80% │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Position: FINANCIALLY VIABLE WITH CONDITIONS             │
│  "ROI analysis shows 240% return over 3 years if         │
│   execution is solid. Break-even at month 18..."         │
│  Numbers:                                                 │
│  • Investment: $500k                                     │
│  • Break-even: Month 18                                  │
│  • 3-year ROI: 240%                                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎯 SYNTHESIS                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  CONSENSUS: Conditional expansion to Texas                │
│  Overall Confidence: 82%                                   │
│                                                             │
│  Agreement:                                               │
│  ✓ Texas opportunity is real and large                   │
│  ✓ Timing is critical (competition growing)              │
│                                                             │
│  Disagreement:                                            │
│  ⚠ Risk tolerance (Strategist vs Risk Assessor)         │
│  ⚠ Resource allocation priorities                        │
│                                                             │
│  RECOMMENDATION:                                          │
│  "Proceed with PILOT expansion to Texas. Start with      │
│   $200k investment in Dallas area. Validate supply       │
│   chain and hiring before full commitment."              │
│                                                             │
│  Next Steps:                                              │
│  1. Validate supply chain partnerships                   │
│  2. Hire 2 installers in Dallas area                     │
│  3. Run 3-month pilot with 20 customers                  │
│  4. Evaluate and decide on full expansion                │
│                                                             │
│  [✓ Agree & Proceed]  [✗ Reject]  [? Ask Follow-up]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend API

```javascript
// Counsel sessions
POST   /api/counsel/session            # Start new counsel session
Body: { topic, context, category, agentsToInclude }

GET    /api/counsel/sessions           # Get all sessions
GET    /api/counsel/session/:id        # Get specific session
PUT    /api/counsel/session/:id/decide # Record your decision

// Agent management
GET    /api/counsel/agents             # Get all agents
PUT    /api/counsel/agents/:id         # Update agent config
POST   /api/counsel/agents/:id/test    # Test agent response

// Analytics
GET    /api/counsel/stats              # Get counsel statistics
GET    /api/counsel/accuracy           # Track decision outcomes
```

---

## Key Features

1. **Multi-LLM debate** - 4+ models with different personas
2. **Real-time cost tracking** - Per session cost display
3. **Confidence scoring** - Each agent + overall synthesis
4. **Decision tracking** - Log what you decided and outcomes
5. **Quick templates** - Common decision types (strategy, hiring, investment)
6. **Source citations** - Data Analyst includes references
7. **Follow-up questions** - Drill deeper on specific points
8. **Outcome tracking** - Was the advice right? (for model tuning)
9. **Cost optimization** - Use cheaper models where appropriate
10. **Custom agents** - Add your own personas

---

## Success Criteria

- [ ] Can start counsel session on any topic
- [ ] Multiple AI agents respond with different perspectives
- [ ] See each agent's position, key points, confidence
- [ ] Synthesizer combines into recommendation
- [ ] Record your decision and rationale
- [ ] Track decision outcomes over time
- [ ] See cost per session
- [ ] View counsel statistics and accuracy
- [ ] Customize agent personas
- [ ] Data syncs to GitHub

---

**Status: Ready to build** 🚀
