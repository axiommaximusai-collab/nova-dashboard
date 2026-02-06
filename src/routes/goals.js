const express = require('express');
const router = express.Router();
const goalsService = require('../services/goalsService');
const fs = require('fs').promises;
const path = require('path');

// Legacy daily/weekly/monthly goals endpoints
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

// New hierarchical goals system endpoints
const goalsFilePath = path.join(__dirname, '../../data/goals/goals.json');

// Helper function to read goals
async function readGoals() {
  try {
    const data = await fs.readFile(goalsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { goals: [] };
  }
}

// Helper function to write goals
async function writeGoals(data) {
  await fs.writeFile(goalsFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/goals - Get all goals with optional filters
router.get('/', async (req, res) => {
  try {
    const data = await readGoals();
    let goals = data.goals;

    // Apply filters
    const { timeframe, priority, status, tag, archived } = req.query;

    if (timeframe) {
      goals = goals.filter(g => g.timeframe === timeframe);
    }
    if (priority) {
      goals = goals.filter(g => g.priority === priority);
    }
    if (status) {
      goals = goals.filter(g => g.status === status);
    }
    if (tag) {
      goals = goals.filter(g => g.tags.includes(tag));
    }
    if (archived !== undefined) {
      goals = goals.filter(g => g.archived === (archived === 'true'));
    }

    res.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// GET /api/goals/:id - Get single goal with hierarchy
router.get('/:id', async (req, res) => {
  try {
    const data = await readGoals();
    const goal = data.goals.find(g => g.id === req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Include parent goal info
    let parentGoal = null;
    if (goal.parentGoalId) {
      parentGoal = data.goals.find(g => g.id === goal.parentGoalId);
    }

    // Include child goals
    const childGoals = data.goals.filter(g => goal.childGoalIds.includes(g.id));

    res.json({
      goal,
      parentGoal,
      childGoals
    });
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
});

// POST /api/goals - Create new goal
router.post('/', async (req, res) => {
  try {
    const data = await readGoals();

    const newGoal = {
      id: `goal-${Date.now()}`,
      title: req.body.title,
      description: req.body.description || '',
      timeframe: req.body.timeframe,
      priority: req.body.priority,
      progress: 0,
      status: 'not-started',
      dueDate: req.body.dueDate,
      tags: req.body.tags || [],
      parentGoalId: req.body.parentGoalId || null,
      childGoalIds: [],
      linkedHabits: req.body.linkedHabits || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      completedAt: null,
      archived: false
    };

    data.goals.push(newGoal);

    // If this goal has a parent, add it to parent's childGoalIds
    if (newGoal.parentGoalId) {
      const parent = data.goals.find(g => g.id === newGoal.parentGoalId);
      if (parent && !parent.childGoalIds.includes(newGoal.id)) {
        parent.childGoalIds.push(newGoal.id);
      }
    }

    await writeGoals(data);
    res.json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// PUT /api/goals/:id - Update goal
router.put('/:id', async (req, res) => {
  try {
    const data = await readGoals();
    const goalIndex = data.goals.findIndex(g => g.id === req.params.id);

    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = data.goals[goalIndex];
    const oldParentId = goal.parentGoalId;

    // Update goal fields
    Object.assign(goal, {
      ...req.body,
      id: goal.id, // Preserve ID
      createdAt: goal.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString().split('T')[0]
    });

    // Handle parent change
    if (req.body.parentGoalId !== oldParentId) {
      // Remove from old parent
      if (oldParentId) {
        const oldParent = data.goals.find(g => g.id === oldParentId);
        if (oldParent) {
          oldParent.childGoalIds = oldParent.childGoalIds.filter(id => id !== goal.id);
        }
      }
      // Add to new parent
      if (req.body.parentGoalId) {
        const newParent = data.goals.find(g => g.id === req.body.parentGoalId);
        if (newParent && !newParent.childGoalIds.includes(goal.id)) {
          newParent.childGoalIds.push(goal.id);
        }
      }
    }

    await writeGoals(data);
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// DELETE /api/goals/:id - Delete goal
router.delete('/:id', async (req, res) => {
  try {
    const data = await readGoals();
    const goalIndex = data.goals.findIndex(g => g.id === req.params.id);

    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = data.goals[goalIndex];

    // Remove from parent's childGoalIds
    if (goal.parentGoalId) {
      const parent = data.goals.find(g => g.id === goal.parentGoalId);
      if (parent) {
        parent.childGoalIds = parent.childGoalIds.filter(id => id !== goal.id);
      }
    }

    // Orphan child goals (set their parentGoalId to null)
    goal.childGoalIds.forEach(childId => {
      const child = data.goals.find(g => g.id === childId);
      if (child) {
        child.parentGoalId = null;
      }
    });

    data.goals.splice(goalIndex, 1);
    await writeGoals(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// PUT /api/goals/:id/progress - Update progress
router.put('/:id/progress', async (req, res) => {
  try {
    const data = await readGoals();
    const goal = data.goals.find(g => g.id === req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goal.progress = req.body.progress;
    goal.updatedAt = new Date().toISOString().split('T')[0];

    // Auto-update status based on progress
    if (goal.progress === 0) {
      goal.status = 'not-started';
    } else if (goal.progress === 100) {
      goal.status = 'complete';
      goal.completedAt = new Date().toISOString().split('T')[0];
    } else {
      goal.status = 'in-progress';
    }

    await writeGoals(data);
    res.json(goal);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// PUT /api/goals/:id/status - Update status
router.put('/:id/status', async (req, res) => {
  try {
    const data = await readGoals();
    const goal = data.goals.find(g => g.id === req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goal.status = req.body.status;
    goal.updatedAt = new Date().toISOString().split('T')[0];

    await writeGoals(data);
    res.json(goal);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// PUT /api/goals/:id/complete - Mark complete
router.put('/:id/complete', async (req, res) => {
  try {
    const data = await readGoals();
    const goal = data.goals.find(g => g.id === req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goal.status = 'complete';
    goal.progress = 100;
    goal.completedAt = new Date().toISOString().split('T')[0];
    goal.updatedAt = goal.completedAt;
    goal.archived = req.body.archive === true;

    await writeGoals(data);
    res.json(goal);
  } catch (error) {
    console.error('Error completing goal:', error);
    res.status(500).json({ error: 'Failed to complete goal' });
  }
});

// PUT /api/goals/reorder - Save new order after drag
router.put('/reorder', async (req, res) => {
  try {
    const data = await readGoals();
    const { reorderedGoals } = req.body; // Array of {id, order}

    reorderedGoals.forEach(item => {
      const goal = data.goals.find(g => g.id === item.id);
      if (goal) {
        goal.order = item.order;
        goal.updatedAt = new Date().toISOString().split('T')[0];
      }
    });

    await writeGoals(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering goals:', error);
    res.status(500).json({ error: 'Failed to reorder goals' });
  }
});

module.exports = router;
