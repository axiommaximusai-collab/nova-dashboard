# Nova Dashboard - Learning System Tab Specification

## Overview
A comprehensive knowledge management system to track books, courses, skills, mentor insights, and personal evolution. Documents what you're learning so it compounds over time.

---

## Core Purpose
1. **Book tracking** - What you've read, key takeaways, implementation notes
2. **Course completion** - Online courses, certifications, skills gained
3. **Skill development** - What you're building, proficiency levels, progress
4. **Mentor insights** - Documented wisdom from Francis and other advisors
5. **Mistake log** - Failures and lessons learned
6. **Weekly learning goal** - "One new thing per week" tracker
7. **Knowledge search** - Find insights when you need them

---

## Data Models

### Book Entry
```json
{
  "id": "learn-book-001",
  "type": "book",
  "title": "The Almanack of Naval Ravikant",
  "author": "Eric Jorgenson",
  "category": "Wealth/Business",
  "status": "completed",
  "startDate": "2026-01-15",
  "finishDate": "2026-01-20",
  "rating": 5,
  "format": "audiobook",
  "timeInvested": "6 hours",
  
  "keyInsights": [
    "Seek wealth, not money or status",
    "Play iterated games - compound returns",
    "Learn to sell, learn to build"
  ],
  
  "implementation": [
    {
      "insight": "Play iterated games",
      "action": "Focus on long-term relationships in business",
      "implemented": true,
      "date": "2026-01-25"
    }
  ],
  
  "quotes": [
    "The purpose of life is not happiness, it's fulfillment"
  ],
  
  "linkedToGoals": ["q1-obj-1", "30m-wealth-goal"],
  
  "notes": "Re-read annually. Critical for wealth mindset.",
  "createdAt": "2026-01-15T00:00:00Z"
}
```

### Course Entry
```json
{
  "id": "learn-course-001",
  "type": "course",
  "title": "Advanced Node.js Patterns",
  "provider": "Frontend Masters",
  "instructor": "Scott Moss",
  "category": "Engineering",
  "status": "in_progress",
  "progress": 60,
  "startDate": "2026-02-01",
  "expectedFinish": "2026-02-15",
  
  "modules": [
    {"name": "Event Loop Deep Dive", "completed": true, "notes": "Critical for performance"},
    {"name": "Stream Processing", "completed": true, "notes": ""},
    {"name": "Clustering & Workers", "completed": false, "notes": ""}
  ],
  
  "skillsGained": ["Performance optimization", "Architecture patterns"],
  
  "application": {
    "project": "Nova Dashboard Backend",
    "howApplied": "Using streams for file processing",
    "impact": "40% faster uploads"
  },
  
  "certification": null,
  "createdAt": "2026-02-01T00:00:00Z"
}
```

### Skill Tracker
```json
{
  "id": "skill-001",
  "name": "System Architecture",
  "category": "Technical",
  "currentLevel": "intermediate",
  "targetLevel": "expert",
  
  "levels": {
    "beginner": { "achieved": true, "date": "2025-06-01" },
    "intermediate": { "achieved": true, "date": "2026-01-01" },
    "advanced": { "achieved": false },
    "expert": { "achieved": false }
  },
  
  "learningResources": [
    {"type": "book", "title": "Designing Data-Intensive Applications", "contribution": "high"},
    {"type": "course", "title": "System Design Primer", "contribution": "medium"}
  ],
  
  "appliedInProjects": ["proj-nova-dashboard", "proj-inventory-system"],
  
  "evidence": [
    "Designed Nova Dashboard architecture",
    "Migrated legacy system to microservices"
  ],
  
  "nextSteps": [
    "Complete distributed systems course",
    "Lead architecture review for new project"
  ],
  
  "updatedAt": "2026-02-05T00:00:00Z"
}
```

### Mentor Insight
```json
{
  "id": "insight-001",
  "mentor": "Francis Tran",
  "date": "2026-02-01",
  "context": "Weekly strategy call",
  
  "insight": "Don't optimize for revenue in year 1. Optimize for learning and systems.",
  
  "topic": "Business Strategy",
  
  "yourSituation": "Pushing hard for sales in Q1",
  
  "application": {
    "action": "Shift focus to building Nova dashboard and workflows",
    "implemented": true,
    "outcome": "Better foundation for scaling"
  },
  
  "relatedInsights": ["insight-042", "insight-067"],
  
  "quotes": [
    "Revenue is a lagging indicator. Systems are leading."
  ],
  
  "gratitude": {
    "thanked": true,
    "how": "Sent follow-up email with implementation plan",
    "date": "2026-02-02"
  }
}
```

### Mistake Log
```json
{
  "id": "mistake-001",
  "date": "2025-12-15",
  "category": "Hiring",
  
  "whatHappened": "Hired first installer without proper vetting. Quit after 2 weeks.",
  
  "cost": {
    "time": "40 hours",
    "money": "$2,500",
    "opportunity": "Delayed 3 installations"
  },
  
  "rootCause": "Rushed hiring due to demand pressure. Skipped reference checks.",
  
  "lesson": "Never skip reference checks. Hire slow, fire fast.",
  
  "systemCreated": {
    "name": "Installer Hiring Checklist",
    "implemented": true,
    "date": "2026-01-05"
  },
  
  "preventedRecurrence": true,
  "subsequentHires": 2,
  "subsequentSuccess": "100% retention"
}
```

### Weekly Learning Goal
```json
{
  "id": "week-learn-2026-06",
  "week": "2026-02-03",
  
  "goal": "Learn one new thing about system architecture",
  
  "learning": {
    "type": "book_chapter",
    "title": "Designing Data-Intensive Applications - Chapter 3",
    "timeInvested": "2 hours"
  },
  
  "keyTakeaway": "Storage and retrieval strategies dramatically impact performance",
  
  "applied": {
    "where": "Nova Dashboard database design",
    "how": "Restructured JSON storage for faster reads",
    "impact": "20% performance improvement"
  },
  
  "completed": true,
  "completionDate": "2026-02-05"
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ LEARNING SYSTEM                                  [+ Add]    │
├─────────────────────────────────────────────────────────────┤
│ [Books] [Courses] [Skills] [Insights] [Mistakes] [Weekly]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📚 CURRENTLY READING                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  The Almanack of Naval Ravikant                            │
│  75% complete | 6 hours invested                           │
│  Last read: Today | Key insight: "Seek wealth, not money" │
│  [Continue] [Add Notes] [Mark Complete]                   │
│                                                             │
│  📖 RECENTLY COMPLETED                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✅ Zero to One (Jan 28) - Rating: 5/5                    │
│     Key: Monopolies, Definite optimism                    │
│     Applied: Thinking bigger for Studio Shade             │
│                                                             │
│  🎯 SKILLS IN PROGRESS                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  System Architecture      ████████████░░ 70%              │
│  Sales & Negotiation      ██████░░░░░░░░ 40%              │
│  Real Estate Investment   ███░░░░░░░░░░░ 20%              │
│                                                             │
│  💡 RECENT MENTOR INSIGHTS                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Francis (Feb 1): "Optimize for learning, not revenue"    │
│  [View Full Insight] [See All from Francis]               │
│                                                             │
│  📈 THIS WEEK'S LEARNING                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Goal: Learn one new thing about system architecture      │
│  Status: ✅ Complete (Feb 5)                              │
│  What: Database storage strategies                        │
│  Applied: Restructured Nova JSON storage                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

1. **Book tracking** with takeaways and implementation
2. **Course progress** with module breakdown
3. **Skill levels** (beginner → intermediate → advanced → expert)
4. **Mentor wisdom** preservation with application tracking
5. **Mistake documentation** with lessons learned
6. **Weekly learning goal** (one new thing minimum)
7. **Search** across all knowledge
8. **Goal alignment** - link learning to objectives
9. **Time tracking** - hours invested in learning
10. **Dark theme** matching Nova

---

## Success Criteria

- [ ] Add books with insights and implementation
- [ ] Track course progress module by module
- [ ] Document skills with proficiency levels
- [ ] Save mentor insights with application notes
- [ ] Log mistakes with lessons learned
- [ ] Weekly learning goal tracking
- [ ] Search knowledge base
- [ ] See learning time invested
- [ ] Link to goals and projects
- [ ] Data syncs to GitHub

---

**Status: Ready to build** 🚀
