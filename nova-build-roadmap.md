# Nova Dashboard - Build Roadmap & Action Items

## 🚀 CURRENT STATUS (Feb 5, 2026)

### ✅ COMPLETED (Tonight)
1. **Workflows Tab** - Visual workflows, inbox, execution tracking
2. **Projects Tab** - Project cards, timelines, milestones
3. **Goals Tab** - Quarterly → Monthly → Weekly → Daily hierarchy
4. **Tasks Tab** - Weekly execution, rollover system

### 🚧 IN PROGRESS / NEXT UP
5. **Network CRM Tab** - Relationship intelligence, deal flow tracking ⭐ PRIORITY
6. **Learning System Tab** - Knowledge management, skill tracking

---

## 📋 ACTION ITEMS FOR CLAUDE

### **NEXT BUILD: Network CRM Tab**
**Priority:** HIGH  
**Time Estimate:** 4-6 hours  
**Why:** Track deal flow, relationships, introductions - critical for scaling

**Build from spec:** `nova-network-crm-spec.md`

**Key Features:**
- [ ] Contact profiles with relationship strength (weak/medium/strong)
- [ ] Deal flow tracking (who brings opportunities, $ value, conversion rates)
- [ ] Touch reminders (alert when 30+ days no contact)
- [ ] Value exchange log (what you've given vs received)
- [ ] Introduction tracking (who connected whom)
- [ ] Interaction logging
- [ ] Network analytics (total deal flow, network value estimate)

**Pre-load sample data:**
- Francis Tran (mentor, business partner, deal source - 5 deals, $450k)
- Chad Nickolas (manufacturing partner)
- Hung Dang (tech support)
- 2-3 sample deal flow sources

**UI:**
- Main view: Touch needed alerts, top relationships, deal sources, network metrics
- Contact detail: Full profile, deal history, interactions, value exchange

---

### **FOLLOWING BUILD: Learning System Tab**
**Priority:** MEDIUM  
**Time Estimate:** 3-4 hours  
**Why:** Knowledge compounding, skill tracking for $30M journey

**Build from spec:** `nova-learning-system-spec.md`

**Key Features:**
- [ ] Book tracking (insights, implementation, quotes)
- [ ] Course progress (module breakdown, skills gained)
- [ ] Skill tracker (beginner → intermediate → advanced → expert)
- [ ] Mentor insights (Francis's wisdom, application tracking)
- [ ] Mistake log (lessons learned, systems created)
- [ ] Weekly learning goal ("one new thing per week")

**Pre-load sample data:**
- 2-3 books (Naval Almanack, Zero to One)
- 1 course in progress
- 3 skills (System Architecture, Sales, Real Estate)
- 2-3 mentor insights from Francis
- 1 mistake with lesson

---

### **FUTURE BUILDS (After Network CRM + Learning)**
7. **Dashboard Home** - Collective mind overview, pulls from all tabs
8. **Habits Tab Completion** - Daily tracking, streaks, accountability
9. **Analytics/Insights** - Patterns, productivity trends, recommendations
10. **Accountability System** - Cron jobs, Telegram integration (Axiom's job)

---

## 🎯 DESIGN PRINCIPLES

### **All tabs should:**
- ✅ Dark theme (#0f172a background, #1e293b cards)
- ✅ Match Nova styling (consistent with Workflows/Projects/Goals/Tasks)
- ✅ GitHub sync (auto-commit data changes)
- ✅ Responsive design (mobile-friendly)
- ✅ Pre-loaded sample data (shows value immediately)
- ✅ JSON file storage (in `nova/data/[tab-name]/`)

### **Navigation:**
```
Dashboard (Home)
Goals
Projects
Tasks
Workflows
Habits
Memory
Learning (NEW)
Network (NEW)
Analytics
```

---

## 💾 DATA STRUCTURE

### Network CRM Files:
```
nova/data/network/
├── contacts.json          # All contact profiles
├── interactions.json      # Touch/communication log
├── deal-flow.json         # Opportunities by source
├── introductions.json     # Who introduced whom
└── gratitude.json         # Thank you tracking
```

### Learning System Files:
```
nova/data/learning/
├── books.json            # Reading list with insights
├── courses.json          # Course progress
├── skills.json           # Skill proficiency tracking
├── insights.json         # Mentor wisdom
├── mistakes.json         # Failure log
└── weekly-goals.json     # Learning goals
```

---

## 🎨 UI COMPONENTS TO REUSE

From existing tabs, use these patterns:
- **Card layout** (from Projects/Workflows)
- **Progress bars** (from Goals)
- **Tab navigation** (from Tasks)
- **Status badges** (on track/at risk/behind)
- **Priority indicators** (High/Medium/Low)
- **Form modals** (for adding/editing)
- **Detail panels** (slide-out or modal)

---

## 📊 SUCCESS METRICS

### Network CRM Success:
- [ ] Can add contacts with full context
- [ ] See deal flow by source with $ values
- [ ] Receive touch reminders (30+ days alert)
- [ ] Log interactions with notes
- [ ] See network value estimate
- [ ] Track introductions made/received

### Learning System Success:
- [ ] Add books with key insights
- [ ] Track course progress by module
- [ ] Document skills with levels
- [ ] Save mentor insights
- [ ] Log mistakes with lessons
- [ ] Set and track weekly learning goals

---

## 🚀 BUILD ORDER RECOMMENDATION

**Tonight (Feb 5-6):**
1. ✅ Workflows (DONE)
2. ✅ Projects (DONE)
3. ✅ Goals (DONE)
4. ✅ Tasks (DONE)
5. 🚧 **Network CRM** (BUILD NOW)

**Tomorrow (Feb 6-7):**
6. Learning System
7. Review all tabs with Nick
8. Iterate based on feedback

**This Week:**
9. Dashboard Home (overview page)
10. Habits completion
11. Analytics/Insights

---

## ⚠️ IMPORTANT NOTES

1. **Network CRM is HIGHEST PRIORITY** - Nick has active deal flow and relationships to track
2. **Pre-load realistic sample data** - Shows immediate value
3. **Make it visual** - Charts for deal flow, network value, etc.
4. **Focus on DEAL FLOW tracking** - This is what generates revenue
5. **Touch reminders are critical** - Don't let relationships go cold

---

## 📝 SPEC FILES LOCATION

All specs available at:
https://github.com/axiommaximusai-collab/nova-dashboard

- `nova-workflows-spec.md` - ✅ BUILT
- `nova-goals-spec.md` - ✅ BUILT
- `nova-tasks-spec.md` - ✅ BUILT
- `nova-network-crm-spec.md` - 🚧 BUILD NEXT
- `nova-learning-system-spec.md` - ⏳ BUILD AFTER

---

**Status:** Ready for Network CRM build  
**Next Review:** With Nick tomorrow morning  
**Goal:** $30M wealth-building operating system
