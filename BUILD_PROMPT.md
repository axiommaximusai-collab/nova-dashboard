# BUILD PROMPT — Current Priority

**Date:** 2026-02-06  
**Builder:** Claude (Nova Build Sub-agent)  
**Location:** `/Users/axiom/clawd/Axiom/nova/`  
**Repo:** `https://github.com/axiommaximusai-collab/nova-dashboard`

---

## ✅ WHAT'S ALREADY BUILT (DO NOT TOUCH)

These 7 tabs are complete and working:
1. Goals — Daily/Weekly/Monthly/Quarterly
2. Tasks — Weekly execution with rollover
3. Projects — Cards, timelines, milestones
4. Workflows — Visual workflows, inbox, execution
5. Habits — Streak-based tracking
6. Memory — Searchable timeline
7. Network CRM — Contacts, deal flow, touch reminders

**Do not rebuild these.** Reference them for patterns only.

---

## 🚧 BUILD THESE NOW (In Order)

### 1. GITHUB SYNC INTEGRATION ⭐ FIRST

**Purpose:** Auto-commit all Nova data to GitHub when changes happen.

**Why first:** Everything else depends on data persistence.

**Implementation:**
```
File: src/services/gitSync.js
- Hook into ALL service layer writes (goalsService, tasksService, etc.)
- Debounce: Wait 5 min after last change, then commit
- Commit message: "[Nova] Updated [tab] — 2026-02-06 14:30"
- Push to origin main
- Status indicator in UI footer: "Synced 2 min ago"
```

**Test:**
1. Change a goal
2. Wait 5 minutes
3. Verify commit appears on github.com/axiommaximusai-collab/nova-dashboard

---

### 2. COUNSEL TAB ⭐ SECOND

**Purpose:** AI Advisory Board — multiple LLMs debate your decisions.

**Read spec:** `../nova-counsel-spec.md`

**Build:**
```
Backend:
- src/routes/counsel.js
- src/services/counselService.js
- data/counsel/sessions.json
- data/counsel/agents.json

Frontend:
- Add "Counsel" tab to navigation
- New session form (topic, context, category)
- Agent response cards (4 agents)
- Synthesis section
- Decision recording
```

**Agents:**
1. Business Strategist (Claude) — big picture
2. Data Analyst (GPT-4) — research, numbers
3. Risk Assessor (DeepSeek) — devil's advocate
4. Financial Advisor (Gemini) — ROI, cash flow
5. Synthesizer (Claude) — combines all

**Pre-load sample:**
- Topic: "Expand to Texas or focus on California?"
- Full 4-agent debate with positions, confidence scores, key points
- Synthesis with recommendation

**Test:** Start session → See 4 responses → See synthesis → Record decision

---

### 3. LEARNING SYSTEM TAB ⭐ THIRD

**Purpose:** Knowledge management — books, courses, skills, mentor insights, mistakes.

**Read spec:** `../nova-learning-system-spec.md`

**Build:**
```
Backend:
- src/routes/learning.js
- src/services/learningService.js
- data/learning/books.json
- data/learning/courses.json
- data/learning/skills.json
- data/learning/insights.json
- data/learning/mistakes.json
- data/learning/weekly-goals.json

Frontend:
- Add "Learning" tab to navigation
- Sub-tabs: [Books] [Courses] [Skills] [Insights] [Mistakes] [Weekly]
```

**Pre-load sample data:**
- Books: "Naval Almanack" (completed, insights), "Zero to One" (reading)
- Course: "Advanced Node.js Patterns" (60% complete, 3 modules)
- Skills: System Architecture (intermediate), Sales (beginner), Real Estate (beginner)
- Insights: 2 from Francis (wisdom + application tracking)
- Mistakes: 1 hiring mistake with lesson learned
- Weekly: 1 completed goal

**Test:** Click each sub-tab → See sample data → Add new item → Verify save

---

### 4. ANALYTICS/INSIGHTS TAB ⭐ FOURTH

**Purpose:** Cross-tab metrics and pattern recognition.

**Build:**
```
Backend:
- src/routes/analytics.js
- src/services/analyticsService.js

Frontend:
- Add "Analytics" tab
- Simple CSS/SVG charts (no heavy libraries)
```

**Charts:**
- Tasks completed per week (8-week bar chart)
- Habit streak history (line graph)
- Learning hours per week
- Network touches per week
- Goal completion rate (donut chart)

**Insights:**
- "You've completed 85% of tasks this week"
- "Habit streak: 12 days (personal best!)"
- "Network: 3 contacts need attention"

**Test:** Charts render → Insights generate → Data updates when other tabs change

---

### 5. DASHBOARD HOME ENHANCEMENT ⭐ FIFTH

**Purpose:** Overview page pulling live data from ALL tabs.

**Enhance existing Dashboard tab:**
- This week's focus (from Goals)
- Today's tasks preview (from Tasks)
- Active projects progress (from Projects)
- Habit streaks (from Habits)
- Books reading (from Learning — once built)
- Network touches needed (from Network CRM)
- Recent counsel sessions (from Counsel — once built)
- Quick action buttons: "Log habit", "Add task", "Start counsel"

**Test:** Dashboard shows live data from 7+ tabs → Quick actions work

---

## 🎨 DESIGN RULES

- Dark theme: #0f172a background, #1e293b cards
- Match existing Goals/Tasks/Network CRM styling EXACTLY
- Responsive design
- Modal forms for adding items
- JSON file storage (consistent with existing)

---

## ✅ SUCCESS CHECKLIST

Before saying "done":
- [ ] GitHub sync: Change data → Verify commit on GitHub within 5 min
- [ ] Counsel: Full 4-agent debate works → Can record decision
- [ ] Learning: All 6 sub-tabs work → Sample data visible
- [ ] Analytics: Charts render with real data
- [ ] Dashboard: Shows live data from all tabs
- [ ] All 10 tabs in navigation
- [ ] Everything pushed to GitHub
- [ ] README updated

---

## 🚀 START NOW

1. Read this fully
2. Start with GitHub Sync (foundation)
3. Then Counsel, Learning, Analytics, Dashboard
4. Commit and push each feature separately
5. Report what was built

**Build working code. Test thoroughly. Push to GitHub.**

Let's go. 🚀
