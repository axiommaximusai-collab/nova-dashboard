const express = require('express');
const router = express.Router();
const learningService = require('../services/learningService');

// ========== BOOKS ==========

router.get('/books', (req, res) => {
  const { status } = req.query;
  const books = status
    ? learningService.getBooksByStatus(status)
    : learningService.getAllBooks();
  res.json(books);
});

router.get('/books/:id', (req, res) => {
  const book = learningService.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

router.post('/books', (req, res) => {
  try {
    const book = learningService.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

router.put('/books/:id', (req, res) => {
  const updated = learningService.updateBook(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(updated);
});

router.delete('/books/:id', (req, res) => {
  const deleted = learningService.deleteBook(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json({ success: true });
});

// ========== COURSES ==========

router.get('/courses', (req, res) => {
  const { status } = req.query;
  const courses = status
    ? learningService.getCoursesByStatus(status)
    : learningService.getAllCourses();
  res.json(courses);
});

router.get('/courses/:id', (req, res) => {
  const course = learningService.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

router.post('/courses', (req, res) => {
  try {
    const course = learningService.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.put('/courses/:id', (req, res) => {
  const updated = learningService.updateCourse(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(updated);
});

router.delete('/courses/:id', (req, res) => {
  const deleted = learningService.deleteCourse(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ success: true });
});

// ========== SKILLS ==========

router.get('/skills', (req, res) => {
  const { category } = req.query;
  const skills = category
    ? learningService.getSkillsByCategory(category)
    : learningService.getAllSkills();
  res.json(skills);
});

router.get('/skills/:id', (req, res) => {
  const skill = learningService.getSkillById(req.params.id);
  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  res.json(skill);
});

router.post('/skills', (req, res) => {
  try {
    const skill = learningService.createSkill(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/skills/:id', (req, res) => {
  const updated = learningService.updateSkill(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  res.json(updated);
});

router.delete('/skills/:id', (req, res) => {
  const deleted = learningService.deleteSkill(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  res.json({ success: true });
});

router.post('/skills/:id/practice', (req, res) => {
  try {
    const skill = learningService.logPractice(req.params.id, req.body);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log practice' });
  }
});

// ========== INSIGHTS ==========

router.get('/insights', (req, res) => {
  const { mentor } = req.query;
  const insights = mentor
    ? learningService.getInsightsByMentor(mentor)
    : learningService.getAllInsights();
  res.json(insights);
});

router.get('/insights/:id', (req, res) => {
  const insight = learningService.getInsightById(req.params.id);
  if (!insight) {
    return res.status(404).json({ error: 'Insight not found' });
  }
  res.json(insight);
});

router.post('/insights', (req, res) => {
  try {
    const insight = learningService.createInsight(req.body);
    res.status(201).json(insight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create insight' });
  }
});

router.put('/insights/:id', (req, res) => {
  const updated = learningService.updateInsight(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Insight not found' });
  }
  res.json(updated);
});

router.delete('/insights/:id', (req, res) => {
  const deleted = learningService.deleteInsight(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Insight not found' });
  }
  res.json({ success: true });
});

// ========== MISTAKES ==========

router.get('/mistakes', (req, res) => {
  const mistakes = learningService.getAllMistakes();
  res.json(mistakes);
});

router.get('/mistakes/:id', (req, res) => {
  const mistake = learningService.getMistakeById(req.params.id);
  if (!mistake) {
    return res.status(404).json({ error: 'Mistake not found' });
  }
  res.json(mistake);
});

router.post('/mistakes', (req, res) => {
  try {
    const mistake = learningService.createMistake(req.body);
    res.status(201).json(mistake);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create mistake' });
  }
});

router.put('/mistakes/:id', (req, res) => {
  const updated = learningService.updateMistake(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Mistake not found' });
  }
  res.json(updated);
});

router.delete('/mistakes/:id', (req, res) => {
  const deleted = learningService.deleteMistake(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Mistake not found' });
  }
  res.json({ success: true });
});

// ========== WEEKLY GOALS ==========

router.get('/weekly-goals', (req, res) => {
  const { status } = req.query;
  const weeklyGoals = status
    ? learningService.getWeeklyGoalsByStatus(status)
    : learningService.getAllWeeklyGoals();
  res.json(weeklyGoals);
});

router.get('/weekly-goals/current', (req, res) => {
  const goal = learningService.getCurrentWeekGoal();
  if (!goal) {
    return res.json(null);
  }
  res.json(goal);
});

router.get('/weekly-goals/:id', (req, res) => {
  const goal = learningService.getWeeklyGoalById(req.params.id);
  if (!goal) {
    return res.status(404).json({ error: 'Weekly goal not found' });
  }
  res.json(goal);
});

router.post('/weekly-goals', (req, res) => {
  try {
    const goal = learningService.createWeeklyGoal(req.body);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create weekly goal' });
  }
});

router.put('/weekly-goals/:id', (req, res) => {
  const updated = learningService.updateWeeklyGoal(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Weekly goal not found' });
  }
  res.json(updated);
});

router.delete('/weekly-goals/:id', (req, res) => {
  const deleted = learningService.deleteWeeklyGoal(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Weekly goal not found' });
  }
  res.json({ success: true });
});

// ========== ANALYTICS ==========

router.get('/metrics', (req, res) => {
  const metrics = learningService.getLearningMetrics();
  res.json(metrics);
});

module.exports = router;
