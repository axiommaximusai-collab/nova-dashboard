const express = require('express');
const router = express.Router();
const tasksService = require('../services/tasksService');

router.get('/:year/:week', (req, res) => {
  const tasks = tasksService.getWeeklyTasks(req.params.year, req.params.week);
  res.json(tasks);
});

router.post('/:year/:week', (req, res) => {
  const tasks = tasksService.saveWeeklyTasks(req.params.year, req.params.week, req.body);
  res.json(tasks);
});

router.patch('/:taskId/complete', (req, res) => {
  const task = tasksService.completeTask(req.params.taskId);
  res.json(task);
});

router.post('/rollover', (req, res) => {
  const result = tasksService.rolloverIncompleteTasks(req.body.fromWeek, req.body.toWeek);
  res.json(result);
});

module.exports = router;
