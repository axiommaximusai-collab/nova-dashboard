const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data/learning');

const BOOKS_FILE = path.join(DATA_DIR, 'books.json');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');
const INSIGHTS_FILE = path.join(DATA_DIR, 'insights.json');
const MISTAKES_FILE = path.join(DATA_DIR, 'mistakes.json');
const WEEKLY_GOALS_FILE = path.join(DATA_DIR, 'weekly-goals.json');

// Ensure data directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initialize files if they don't exist
function initFiles() {
  ensureDir(DATA_DIR);

  if (!fs.existsSync(BOOKS_FILE)) {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(COURSES_FILE)) {
    fs.writeFileSync(COURSES_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(SKILLS_FILE)) {
    fs.writeFileSync(SKILLS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(INSIGHTS_FILE)) {
    fs.writeFileSync(INSIGHTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(MISTAKES_FILE)) {
    fs.writeFileSync(MISTAKES_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(WEEKLY_GOALS_FILE)) {
    fs.writeFileSync(WEEKLY_GOALS_FILE, JSON.stringify([], null, 2));
  }
}

initFiles();

// Generic loaders
function loadBooks() {
  return JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8'));
}

function saveBooks(data) {
  fs.writeFileSync(BOOKS_FILE, JSON.stringify(data, null, 2));
}

function loadCourses() {
  return JSON.parse(fs.readFileSync(COURSES_FILE, 'utf8'));
}

function saveCourses(data) {
  fs.writeFileSync(COURSES_FILE, JSON.stringify(data, null, 2));
}

function loadSkills() {
  return JSON.parse(fs.readFileSync(SKILLS_FILE, 'utf8'));
}

function saveSkills(data) {
  fs.writeFileSync(SKILLS_FILE, JSON.stringify(data, null, 2));
}

function loadInsights() {
  return JSON.parse(fs.readFileSync(INSIGHTS_FILE, 'utf8'));
}

function saveInsights(data) {
  fs.writeFileSync(INSIGHTS_FILE, JSON.stringify(data, null, 2));
}

function loadMistakes() {
  return JSON.parse(fs.readFileSync(MISTAKES_FILE, 'utf8'));
}

function saveMistakes(data) {
  fs.writeFileSync(MISTAKES_FILE, JSON.stringify(data, null, 2));
}

function loadWeeklyGoals() {
  return JSON.parse(fs.readFileSync(WEEKLY_GOALS_FILE, 'utf8'));
}

function saveWeeklyGoals(data) {
  fs.writeFileSync(WEEKLY_GOALS_FILE, JSON.stringify(data, null, 2));
}

const LearningService = {
  // ========== BOOKS ==========

  getAllBooks() {
    return loadBooks();
  },

  getBookById(id) {
    return loadBooks().find(b => b.id === id);
  },

  getBooksByStatus(status) {
    return loadBooks().filter(b => b.status === status);
  },

  createBook(bookData) {
    const books = loadBooks();
    const book = {
      id: `book-${Date.now()}`,
      title: bookData.title,
      author: bookData.author || null,
      status: bookData.status || 'to_read',
      progress: bookData.progress || 0,
      startedDate: bookData.startedDate || null,
      completedDate: bookData.completedDate || null,
      rating: bookData.rating || null,
      summary: bookData.summary || '',
      keyInsights: bookData.keyInsights || [],
      implementation: bookData.implementation || '',
      quotes: bookData.quotes || [],
      linkedGoalId: bookData.linkedGoalId || null,
      linkedProjectId: bookData.linkedProjectId || null,
      lastReadDate: bookData.lastReadDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    books.push(book);
    saveBooks(books);
    return book;
  },

  updateBook(id, updates) {
    const books = loadBooks();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;

    books[index] = {
      ...books[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveBooks(books);
    return books[index];
  },

  deleteBook(id) {
    const books = loadBooks();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;

    books.splice(index, 1);
    saveBooks(books);
    return true;
  },

  // ========== COURSES ==========

  getAllCourses() {
    return loadCourses();
  },

  getCourseById(id) {
    return loadCourses().find(c => c.id === id);
  },

  getCoursesByStatus(status) {
    return loadCourses().filter(c => c.status === status);
  },

  createCourse(courseData) {
    const courses = loadCourses();
    const course = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      platform: courseData.platform || null,
      instructor: courseData.instructor || null,
      status: courseData.status || 'not_started',
      progress: courseData.progress || 0,
      startedDate: courseData.startedDate || null,
      completedDate: courseData.completedDate || null,
      rating: courseData.rating || null,
      totalHours: courseData.totalHours || 0,
      hoursCompleted: courseData.hoursCompleted || 0,
      modules: courseData.modules || [],
      skillsGained: courseData.skillsGained || [],
      application: courseData.application || '',
      certificateUrl: courseData.certificateUrl || null,
      linkedGoalId: courseData.linkedGoalId || null,
      linkedProjectId: courseData.linkedProjectId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    courses.push(course);
    saveCourses(courses);
    return course;
  },

  updateCourse(id, updates) {
    const courses = loadCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return null;

    courses[index] = {
      ...courses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveCourses(courses);
    return courses[index];
  },

  deleteCourse(id) {
    const courses = loadCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return false;

    courses.splice(index, 1);
    saveCourses(courses);
    return true;
  },

  // ========== SKILLS ==========

  getAllSkills() {
    return loadSkills();
  },

  getSkillById(id) {
    return loadSkills().find(s => s.id === id);
  },

  getSkillsByCategory(category) {
    return loadSkills().filter(s => s.category === category);
  },

  createSkill(skillData) {
    const skills = loadSkills();
    const skill = {
      id: `skill-${Date.now()}`,
      name: skillData.name,
      category: skillData.category || null,
      level: skillData.level || 'beginner',
      targetLevel: skillData.targetLevel || null,
      startedDate: skillData.startedDate || null,
      hoursInvested: skillData.hoursInvested || 0,
      evidence: skillData.evidence || '',
      resources: skillData.resources || [],
      practiceLog: skillData.practiceLog || [],
      milestones: skillData.milestones || [],
      linkedGoalId: skillData.linkedGoalId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    skills.push(skill);
    saveSkills(skills);
    return skill;
  },

  updateSkill(id, updates) {
    const skills = loadSkills();
    const index = skills.findIndex(s => s.id === id);
    if (index === -1) return null;

    skills[index] = {
      ...skills[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveSkills(skills);
    return skills[index];
  },

  deleteSkill(id) {
    const skills = loadSkills();
    const index = skills.findIndex(s => s.id === id);
    if (index === -1) return false;

    skills.splice(index, 1);
    saveSkills(skills);
    return true;
  },

  logPractice(skillId, practiceData) {
    const skills = loadSkills();
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return null;

    const practiceEntry = {
      date: practiceData.date || new Date().toISOString().split('T')[0],
      hours: practiceData.hours || 0,
      notes: practiceData.notes || ''
    };

    skill.practiceLog = skill.practiceLog || [];
    skill.practiceLog.push(practiceEntry);
    skill.hoursInvested = (skill.hoursInvested || 0) + practiceEntry.hours;
    skill.updatedAt = new Date().toISOString();

    saveSkills(skills);
    return skill;
  },

  // ========== INSIGHTS ==========

  getAllInsights() {
    return loadInsights();
  },

  getInsightById(id) {
    return loadInsights().find(i => i.id === id);
  },

  getInsightsByMentor(mentorName) {
    return loadInsights().filter(i => i.mentorName === mentorName);
  },

  createInsight(insightData) {
    const insights = loadInsights();
    const insight = {
      id: `insight-${Date.now()}`,
      mentorName: insightData.mentorName,
      date: insightData.date || new Date().toISOString().split('T')[0],
      context: insightData.context || '',
      quote: insightData.quote,
      insight: insightData.insight,
      applicationPlan: insightData.applicationPlan || '',
      applied: insightData.applied || false,
      applicationDate: insightData.applicationDate || null,
      applicationResult: insightData.applicationResult || '',
      gratitudeExpressed: insightData.gratitudeExpressed || false,
      linkedGoalId: insightData.linkedGoalId || null,
      linkedProjectId: insightData.linkedProjectId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    insights.push(insight);
    saveInsights(insights);
    return insight;
  },

  updateInsight(id, updates) {
    const insights = loadInsights();
    const index = insights.findIndex(i => i.id === id);
    if (index === -1) return null;

    insights[index] = {
      ...insights[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveInsights(insights);
    return insights[index];
  },

  deleteInsight(id) {
    const insights = loadInsights();
    const index = insights.findIndex(i => i.id === id);
    if (index === -1) return false;

    insights.splice(index, 1);
    saveInsights(insights);
    return true;
  },

  // ========== MISTAKES ==========

  getAllMistakes() {
    return loadMistakes();
  },

  getMistakeById(id) {
    return loadMistakes().find(m => m.id === id);
  },

  createMistake(mistakeData) {
    const mistakes = loadMistakes();
    const mistake = {
      id: `mistake-${Date.now()}`,
      date: mistakeData.date || new Date().toISOString().split('T')[0],
      title: mistakeData.title,
      whatHappened: mistakeData.whatHappened,
      costFinancial: mistakeData.costFinancial || 0,
      costTime: mistakeData.costTime || 0,
      costOpportunity: mistakeData.costOpportunity || '',
      rootCause: mistakeData.rootCause || '',
      lessonLearned: mistakeData.lessonLearned,
      systemCreated: mistakeData.systemCreated || '',
      systemImplemented: mistakeData.systemImplemented || false,
      wouldRepeat: mistakeData.wouldRepeat || false,
      linkedGoalId: mistakeData.linkedGoalId || null,
      linkedProjectId: mistakeData.linkedProjectId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mistakes.push(mistake);
    saveMistakes(mistakes);
    return mistake;
  },

  updateMistake(id, updates) {
    const mistakes = loadMistakes();
    const index = mistakes.findIndex(m => m.id === id);
    if (index === -1) return null;

    mistakes[index] = {
      ...mistakes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveMistakes(mistakes);
    return mistakes[index];
  },

  deleteMistake(id) {
    const mistakes = loadMistakes();
    const index = mistakes.findIndex(m => m.id === id);
    if (index === -1) return false;

    mistakes.splice(index, 1);
    saveMistakes(mistakes);
    return true;
  },

  // ========== WEEKLY GOALS ==========

  getAllWeeklyGoals() {
    return loadWeeklyGoals();
  },

  getWeeklyGoalById(id) {
    return loadWeeklyGoals().find(w => w.id === id);
  },

  getWeeklyGoalsByStatus(status) {
    return loadWeeklyGoals().filter(w => w.status === status);
  },

  getCurrentWeekGoal() {
    const goals = loadWeeklyGoals();
    const today = new Date().toISOString().split('T')[0];
    return goals.find(g => g.weekStart <= today && g.weekEnd >= today);
  },

  createWeeklyGoal(goalData) {
    const weeklyGoals = loadWeeklyGoals();
    const goal = {
      id: `weekly-${Date.now()}`,
      weekStart: goalData.weekStart,
      weekEnd: goalData.weekEnd,
      goal: goalData.goal,
      category: goalData.category || null,
      status: goalData.status || 'in_progress',
      whatLearned: goalData.whatLearned || null,
      howApplied: goalData.howApplied || null,
      evidence: goalData.evidence || null,
      timeInvested: goalData.timeInvested || 0,
      linkedSkillId: goalData.linkedSkillId || null,
      linkedGoalId: goalData.linkedGoalId || null,
      completedDate: goalData.completedDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    weeklyGoals.push(goal);
    saveWeeklyGoals(weeklyGoals);
    return goal;
  },

  updateWeeklyGoal(id, updates) {
    const weeklyGoals = loadWeeklyGoals();
    const index = weeklyGoals.findIndex(w => w.id === id);
    if (index === -1) return null;

    weeklyGoals[index] = {
      ...weeklyGoals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveWeeklyGoals(weeklyGoals);
    return weeklyGoals[index];
  },

  deleteWeeklyGoal(id) {
    const weeklyGoals = loadWeeklyGoals();
    const index = weeklyGoals.findIndex(w => w.id === id);
    if (index === -1) return false;

    weeklyGoals.splice(index, 1);
    saveWeeklyGoals(weeklyGoals);
    return true;
  },

  // ========== ANALYTICS ==========

  getLearningMetrics() {
    const books = loadBooks();
    const courses = loadCourses();
    const skills = loadSkills();
    const insights = loadInsights();
    const mistakes = loadMistakes();
    const weeklyGoals = loadWeeklyGoals();

    return {
      books: {
        total: books.length,
        completed: books.filter(b => b.status === 'completed').length,
        reading: books.filter(b => b.status === 'reading').length,
        toRead: books.filter(b => b.status === 'to_read').length
      },
      courses: {
        total: courses.length,
        completed: courses.filter(c => c.status === 'completed').length,
        inProgress: courses.filter(c => c.status === 'in_progress').length
      },
      skills: {
        total: skills.length,
        totalHours: skills.reduce((sum, s) => sum + (s.hoursInvested || 0), 0)
      },
      insights: {
        total: insights.length,
        applied: insights.filter(i => i.applied).length
      },
      mistakes: {
        total: mistakes.length,
        systemsCreated: mistakes.filter(m => m.systemImplemented).length,
        totalCostFinancial: mistakes.reduce((sum, m) => sum + (m.costFinancial || 0), 0)
      },
      weeklyGoals: {
        total: weeklyGoals.length,
        completed: weeklyGoals.filter(w => w.status === 'completed').length,
        inProgress: weeklyGoals.filter(w => w.status === 'in_progress').length
      }
    };
  }
};

module.exports = LearningService;
