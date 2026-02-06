const express = require('express');
const router = express.Router();
const habitsService = require('../services/habitsService');

router.get('/', (req, res) => {
  const habits = habitsService.getAllHabits();
  res.json(habits);
});

router.post('/', (req, res) => {
  const habit = habitsService.createHabit(req.body);
  res.json(habit);
});

router.post('/:id/log', (req, res) => {
  const entry = habitsService.logHabit(req.params.id, req.body.date);
  res.json(entry);
});

router.get('/:id/history', (req, res) => {
  const history = habitsService.getHabitHistory(req.params.id);
  res.json(history);
});

module.exports = router;
