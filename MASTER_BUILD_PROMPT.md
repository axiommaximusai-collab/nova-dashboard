# NOVA DASHBOARD - MASTER BUILD PROMPT

## 🎯 What You're Building
Nova Dashboard - A comprehensive business and personal operating system designed to scale to $30M. Think of it as a "collective mind" that tracks goals, manages workflows, optimizes AI usage, and systematizes everything.

---

## 📚 ALL SPECS AVAILABLE AT:
**https://github.com/axiommaximusai-collab/nova-dashboard**

---

## ✅ ALREADY BUILT (Review & Polish)
1. **Workflows Tab** - Visual workflow diagrams, inbox, execution tracking
2. **Projects Tab** - Project cards, timelines, milestones
3. **Goals Tab** - Quarterly → Monthly → Weekly → Daily hierarchy
4. **Tasks Tab** - Weekly execution with rollover system

**Status:** These exist but may need refinement. Review and iterate based on feedback.

---

## 🚧 CURRENT PRIORITY (Build This First)

### 5. Network CRM Tab
**Spec:** `nova-network-crm-spec.md`

**What:** Relationship intelligence system - track contacts, deal flow, value exchanges, introductions

**Critical Features:**
- Contact profiles with relationship strength (weak/medium/strong)
- Deal flow tracking (who brings opportunities, $ value, conversion rates)
- **TOUCH REMINDERS** - Alert when 30+ days no contact (CRITICAL)
- Value exchange log (what you've given vs received)
- Introduction tracking (who connected whom)
- Network analytics (total deal flow, network value estimate)

**Pre-load with:**
- Francis Tran (mentor, business partner, deal source - 5 deals, $450k)
- Chad Nickolas (manufacturing partner)
- Hung Dang (tech support)
- 2-3 sample deal sources

**Why This Matters:** Nick has active deal flow happening NOW. This tracks who's bringing opportunities and prevents relationships from going cold.

---

## 📋 NEXT BUILDS (In Priority Order)

### 6. Learning System Tab
**Spec:** `nova-learning-system-spec.md`

**What:** Knowledge management - books, courses, skills, mentor insights, mistake log

**Features:**
- Book tracking with insights and implementation notes
- Course progress with module breakdown
- Skill tracker (beginner → intermediate → advanced → expert)
- Mentor insights from Francis (wisdom preservation)
- Mistake log with lessons learned
- Weekly learning goal ("one new thing per week")

**Pre-load:**
- 2-3 books (Naval Almanack, Zero to One)
- 1 course in progress
- 3 skills (System Architecture, Sales, Real Estate)
- 2-3 mentor insights
- 1 mistake with lesson

---

### 7. Habits Tab (Complete)
**Spec:** `nova-habits-spec.md` (was started, needs completion)

**Features:**
- Daily habit tracking with streaks
- Weekly/monthly progress views
- Categories (Health, Learning, Sales, etc.)
- Accountability integration

---

### 8. Dashboard Home
**Spec:** Pull from `nova-complete-feature-list-v2.md`

**What:** Collective mind overview - pulls data from all tabs

**Shows:**
- This week's focus
- Active projects preview
- Today's tasks
- Axiom status (what I'm working on)
- Habit streaks
- Inbox (new requests)
- Quick stats

---

## 🚀 ADVANCED FEATURES (Build After Core)

### 9. Counsel Tab (Multi-LLM Advisory Board)
**Spec:** `nova-counsel-spec.md`

**What:** Multiple AI agents debate decisions

**Agents:**
- Business Strategist (Claude) - big picture thinking
- Data Analyst (GPT-4) - research and numbers
- Risk Assessor (DeepSeek) - what could go wrong
- Financial Advisor (Gemini) - ROI and cash flow
- Synthesizer (Claude) - combines all views

**Use:** Nick asks a question, all 4 agents respond, synthesizer gives final recommendation with confidence score.

---

### 10. Skills & Integrations Tab
**Spec:** `nova-skills-spec.md`

**What:** Manage all AI skills, APIs, integrations

**Shows:**
- Active skills (GitHub, Drive, Telegram, etc.)
- Available integrations to connect (Slack, QuickBooks, etc.)
- Skill pipeline (ideas for future)
- API health monitoring
- Per-skill usage and cost

---

### 11. Department Workflows Tab
**Spec:** `nova-departments-spec.md`

**What:** Workflows organized by business function

**Departments:**
- Sales (lead qual, demos, closing)
- Marketing (content, campaigns)
- Operations (installations, fulfillment)
- Finance (invoicing, reporting)
- HR (hiring, onboarding)

**Features:**
- Department-level analytics
- Cross-functional workflow visualization
- Handoff tracking between departments
- Bottleneck detection
- Resource allocation by department

---

### 12. Model Management Tab
**Spec:** `nova-models-spec.md`

**What:** AI model fleet management and cost optimization

**Shows:**
- All connected models (Claude, GPT, DeepSeek, Gemini, etc.)
- What each model is assigned to do
- Cost per model, per task
- Usage analytics
- Optimization recommendations ("Switch X to DeepSeek, save $120/month")
- Smart routing suggestions

**Models:** Claude Opus/Sonnet/Haiku, GPT-4/Turbo, DeepSeek, Gemini, Kimi

---

### 13. Analytics/Insights Tab
**Spec:** Pull from various specs

**What:** Cross-tab analytics and pattern recognition

**Shows:**
- Productivity trends
- Goal completion rates
- Workflow usage patterns
- Cost optimization opportunities
- Relationship value over time
- Learning progress

---

## 🎨 DESIGN REQUIREMENTS

### All tabs MUST:
- ✅ **Dark theme** (#0f172a background, #1e293b cards)
- ✅ **Match Nova styling** (consistent with Workflows/Projects/Goals/Tasks)
- ✅ **GitHub sync** (auto-commit data changes to repo)
- ✅ **JSON file storage** (`nova/data/[tab-name]/`)
- ✅ **Responsive design** (mobile-friendly)
- ✅ **Pre-loaded sample data** (shows immediate value)

### Navigation Structure:
```
Dashboard (Home)
Goals
Projects
Tasks
Workflows
Habits
Memory
Learning
Network
Skills
Departments
Models
Counsel
Analytics
```

---

## 💾 DATA STRUCTURE

Each tab gets its own folder in `nova/data/`:
```
nova/data/
├── goals/          # quarterly.json, monthly.json, weekly.json, daily.json
├── projects/       # projects.json
├── tasks/          # weekly.json, backlog.json, archive.json
├── workflows/      # workflows.json, inbox.json, executions.json
├── habits/         # habits.json, history.json
├── learning/       # books.json, courses.json, skills.json, insights.json
├── network/        # contacts.json, interactions.json, deal-flow.json
├── skills/         # active.json, available.json, pipeline.json
├── departments/    # departments.json, cross-functional.json
├── models/         # models.json, usage.json, recommendations.json
└── counsel/        # sessions.json, decisions.json
```

---

## 🎯 SUCCESS CRITERIA (Per Tab)

Each spec includes detailed success criteria. General rules:
- [ ] Can view main list/card view
- [ ] Can see detail view/panel
- [ ] Can add/edit/delete items
- [ ] Pre-loaded with realistic sample data
- [ ] Data persists to JSON files
- [ ] GitHub sync works
- [ ] Dark theme applied consistently
- [ ] Mobile responsive

---

## 🚀 BUILD ORDER

**Phase 1 (This Week):**
1. ✅ Workflows (done)
2. ✅ Projects (done)
3. ✅ Goals (done)
4. ✅ Tasks (done)
5. 🚧 **Network CRM** (BUILD NOW)

**Phase 2 (Next Week):**
6. Learning System
7. Complete Habits
8. Dashboard Home

**Phase 3 (Following Week):**
9. Counsel
10. Skills
11. Departments
12. Models

**Phase 4 (Ongoing):**
13. Analytics
14. Iteration based on Nick's usage

---

## ⚠️ IMPORTANT NOTES

1. **Network CRM is HIGHEST PRIORITY** - Nick has active deal flow and relationships to track
2. **Pre-load realistic sample data** - Shows immediate value
3. **Focus on DEAL FLOW tracking** - This generates revenue
4. **Touch reminders are CRITICAL** - Don't let relationships go cold
5. **Cost optimization matters** - Track and minimize API spend
6. **Iterate with Nick** - Build, review, adjust, repeat

---

## 📝 WORKING WITH SPECS

All specs at: **https://github.com/axiommaximusai-collab/nova-dashboard**

Each spec includes:
- Overview and purpose
- Data models (JSON examples)
- API endpoints
- UI layouts (ASCII mockups)
- Sample data
- Build checklist
- Success criteria

**Approach:**
1. Read the spec
2. Build backend (API + data)
3. Build frontend (UI)
4. Add sample data
5. Test full flow
6. Mark as complete
7. Move to next spec

---

## 💬 QUESTIONS?

If anything is unclear:
1. Check the spec file
2. Look at existing tabs for patterns
3. Make reasonable assumptions
4. Build and show Nick - he'll clarify

**Don't wait for perfect clarity. Build, iterate, improve.**

---

## 🎯 THE VISION

**Nova Dashboard = $30M Operating System**

Execution layer (Goals, Tasks, Projects, Workflows)
↓
Intelligence layer (Counsel, Learning, Network CRM)
↓
Management layer (Skills, Departments, Models)
↓
Optimization layer (Cost tracking, Analytics)

**This is Nick's collective mind. Build it to scale.**

---

**START WITH: Network CRM Tab**
**Spec:** https://github.com/axiommaximusai-collab/nova-dashboard/blob/main/nova-network-crm-spec.md

**Build. Iterate. Scale. Let's go.** 🚀
