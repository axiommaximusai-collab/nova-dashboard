const express = require('express');
const router = express.Router();
const tasksService = require('../services/tasksService');
const fs = require('fs').promises;
const path = require('path');

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categoriesPath = path.join(__dirname, '../../data/categories.json');
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Helper functions for new tasks system
const getTasksFilePath = (year, week) => {
  return path.join(__dirname, `../../data/tasks/weekly-${year}-${week}.json`);
};

async function readTasks(year, week) {
  try {
    const filePath = getTasksFilePath(year, week);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { year, week, tasks: [] };
  }
}

async function writeTasks(year, week, data) {
  const filePath = getTasksFilePath(year, week);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/tasks?week=2026-6&priority=high&category=business
router.get('/', async (req, res) => {
  try {
    const { week, priority, category } = req.query;

    if (!week) {
      return res.status(400).json({ error: 'Week parameter required (format: YYYY-W)' });
    }

    const [year, weekNum] = week.split('-');
    const data = await readTasks(year, weekNum);
    let tasks = data.tasks || [];

    // Apply filters
    if (priority && priority !== 'all') {
      tasks = tasks.filter(t => t.priority === priority);
    }
    if (category && category !== 'all') {
      tasks = tasks.filter(t => t.category === category);
    }

    res.json({ ...data, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const { year, week } = req.body;
    const data = await readTasks(year, week);

    const newTask = {
      id: `task-${Date.now()}`,
      title: req.body.title,
      day: req.body.day,
      priority: req.body.priority || 'medium',
      category: req.body.category || 'personal',
      projectId: req.body.projectId || null,
      goalId: req.body.goalId || null,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    data.tasks.push(newTask);
    await writeTasks(year, week, data);
    res.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { year, week } = req.body;
    const data = await readTasks(year, week);
    const taskIndex = data.tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = data.tasks[taskIndex];
    Object.assign(task, {
      ...req.body,
      id: task.id,
      createdAt: task.createdAt,
      updatedAt: new Date().toISOString().split('T')[0]
    });

    await writeTasks(year, week, data);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { year, week } = req.query;
    const data = await readTasks(year, week);
    const taskIndex = data.tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    data.tasks.splice(taskIndex, 1);
    await writeTasks(year, week, data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// PUT /api/tasks/:id/move - Move task to different day
router.put('/:id/move', async (req, res) => {
  try {
    const { year, week, day } = req.body;
    const data = await readTasks(year, week);
    const task = data.tasks.find(t => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.day = day;
    task.updatedAt = new Date().toISOString().split('T')[0];

    await writeTasks(year, week, data);
    res.json(task);
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ error: 'Failed to move task' });
  }
});

// PUT /api/tasks/:id/complete - Toggle complete
router.put('/:id/complete', async (req, res) => {
  try {
    const { year, week, completed } = req.body;
    const data = await readTasks(year, week);
    const task = data.tasks.find(t => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = completed;
    task.updatedAt = new Date().toISOString().split('T')[0];

    await writeTasks(year, week, data);

    // TODO: Auto-update project/goal progress when task is completed
    // if (completed && (task.projectId || task.goalId)) {
    //   // Calculate and update project or goal progress
    // }

    res.json(task);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// PUT /api/tasks/:id/archive - Archive task
router.put('/:id/archive', async (req, res) => {
  try {
    const { year, week } = req.body;
    const data = await readTasks(year, week);
    const task = data.tasks.find(t => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.archived = true;
    task.archivedAt = new Date().toISOString().split('T')[0];

    await writeTasks(year, week, data);
    res.json(task);
  } catch (error) {
    console.error('Error archiving task:', error);
    res.status(500).json({ error: 'Failed to archive task' });
  }
});

// PUT /api/tasks/:id/push - Push task to next week
router.put('/:id/push', async (req, res) => {
  try {
    const { year, week } = req.body;
    const data = await readTasks(year, week);
    const taskIndex = data.tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = data.tasks[taskIndex];

    // Remove from current week
    data.tasks.splice(taskIndex, 1);
    await writeTasks(year, week, data);

    // Calculate next week
    const currentWeek = parseInt(week);
    const nextWeek = currentWeek + 1;
    const nextYear = year;

    // Add to next week
    const nextWeekData = await readTasks(nextYear, nextWeek);
    task.week = nextWeek;
    task.year = nextYear;
    task.pushedFrom = `${year}-${week}`;
    task.updatedAt = new Date().toISOString().split('T')[0];

    nextWeekData.tasks.push(task);
    await writeTasks(nextYear, nextWeek, nextWeekData);

    res.json({ message: 'Task pushed to next week', task });
  } catch (error) {
    console.error('Error pushing task:', error);
    res.status(500).json({ error: 'Failed to push task' });
  }
});

// POST /api/tasks/clear-week - Clear week (archive all incomplete tasks)
router.post('/clear-week', async (req, res) => {
  try {
    const { year, week } = req.body;
    const data = await readTasks(year, week);

    let archivedCount = 0;
    data.tasks.forEach(task => {
      if (!task.completed && !task.archived) {
        task.archived = true;
        task.archivedAt = new Date().toISOString().split('T')[0];
        archivedCount++;
      }
    });

    await writeTasks(year, week, data);
    res.json({ message: `Cleared ${archivedCount} incomplete tasks`, archivedCount });
  } catch (error) {
    console.error('Error clearing week:', error);
    res.status(500).json({ error: 'Failed to clear week' });
  }
});

// Legacy endpoints
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

// GET /api/tasks/pushed - Get all pushed tasks
router.get('/pushed', async (req, res) => {
  try {
    const tasksDir = path.join(__dirname, '../../data/tasks');
    const files = await fs.readdir(tasksDir);
    const pushedTasks = [];

    for (const file of files) {
      if (file.startsWith('weekly-') && file.endsWith('.json')) {
        const filePath = path.join(tasksDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const weekData = JSON.parse(data);
        
        if (weekData.tasks) {
          weekData.tasks.forEach(task => {
            if (task.pushed || task.status === 'pushed') {
              pushedTasks.push({
                ...task,
                year: weekData.year,
                week: weekData.week
              });
            }
          });
        }
      }
    }

    res.json(pushedTasks);
  } catch (error) {
    console.error('Error fetching pushed tasks:', error);
    res.status(500).json({ error: 'Failed to fetch pushed tasks' });
  }
});

// GET /api/tasks/archived - Get all archived tasks
router.get('/archived', async (req, res) => {
  try {
    const tasksDir = path.join(__dirname, '../../data/tasks');
    const files = await fs.readdir(tasksDir);
    const archivedTasks = [];

    for (const file of files) {
      if (file.startsWith('weekly-') && file.endsWith('.json')) {
        const filePath = path.join(tasksDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const weekData = JSON.parse(data);
        
        if (weekData.tasks) {
          weekData.tasks.forEach(task => {
            if (task.archived || task.status === 'archived') {
              archivedTasks.push({
                ...task,
                year: weekData.year,
                week: weekData.week
              });
            }
          });
        }
      }
    }

    res.json(archivedTasks);
  } catch (error) {
    console.error('Error fetching archived tasks:', error);
    res.status(500).json({ error: 'Failed to fetch archived tasks' });
  }
});

module.exports = router;
