const express = require('express');
const router = express.Router();
const goalsService = require('../services/goalsService');

router.get('/daily/:date', (req, res) => {
  const goals = goalsService.getDailyGoals(req.params.date);
  res.json(goals);
});

router.post('/daily/:date', (req, res) => {
  const goals = goalsService.saveDailyGoals(req.params.date, req.body);
  res.json(goals);
});

router.get('/weekly/:year/:week', (req, res) => {
  const goals = goalsService.getWeeklyGoals(req.params.year, req.params.week);
  res.json(goals);
});

router.post('/weekly/:year/:week', (req, res) => {
  const goals = goalsService.saveWeeklyGoals(req.params.year, req.params.week, req.body);
  res.json(goals);
});

router.get('/monthly/:year/:month', (req, res) => {
  const goals = goalsService.getMonthlyGoals(req.params.year, req.params.month);
  res.json(goals);
});

router.post('/monthly/:year/:month', (req, res) => {
  const goals = goalsService.saveMonthlyGoals(req.params.year, req.params.month, req.body);
  res.json(goals);
});

module.exports = router;
