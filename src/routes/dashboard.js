const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Helper to get current week number
function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// GET /api/dashboard/stats — Tasks, streak, projects count
router.get('/stats', async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const week = getWeekNumber();

    // Get tasks data
    let tasksDone = 0;
    let tasksTotal = 0;
    try {
      const tasksPath = path.join(__dirname, '../../data/tasks', `weekly-${year}-${week}.json`);
      const tasksData = await fs.readFile(tasksPath, 'utf8');
      const tasks = JSON.parse(tasksData);
      tasksTotal = tasks.tasks.length;
      tasksDone = tasks.tasks.filter(t => t.completed).length;
    } catch (err) {
      // No tasks file, return 0s
    }

    // Calculate streak (simplified - count days with completed tasks)
    let streakDays = 0;
    try {
      const habitsPath = path.join(__dirname, '../../data/habits/habits.json');
      const habitsData = await fs.readFile(habitsPath, 'utf8');
      const habits = JSON.parse(habitsData);

      // Count consecutive days with completed habits
      const today = new Date();
      let currentDate = new Date(today);
      let streak = 0;

      for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasCompletedHabits = habits.some(h =>
          h.completions && h.completions.some(c => c.date === dateStr)
        );

        if (hasCompletedHabits) {
          streak++;
        } else if (i > 0) {
          break;
        }

        currentDate.setDate(currentDate.getDate() - 1);
      }

      streakDays = streak;
    } catch (err) {
      // No habits data
    }

    // Get projects count
    let projectsCount = 0;
    try {
      const projectsPath = path.join(__dirname, '../../data/projects/projects.json');
      const projectsData = await fs.readFile(projectsPath, 'utf8');
      const projects = JSON.parse(projectsData);
      projectsCount = projects.filter(p => p.status === 'Active').length;
    } catch (err) {
      // No projects data
    }

    res.json({
      tasksDone,
      tasksTotal,
      streakDays,
      projectsCount
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/dashboard/urgent — Overdue tasks, network 30+ days, counsel pending
router.get('/urgent', async (req, res) => {
  try {
    const items = [];

    // Check for overdue tasks
    const year = new Date().getFullYear();
    const week = getWeekNumber();
    try {
      const tasksPath = path.join(__dirname, '../../data/tasks', `weekly-${year}-${week}.json`);
      const tasksData = await fs.readFile(tasksPath, 'utf8');
      const tasks = JSON.parse(tasksData);

      const incompleteTasks = tasks.tasks.filter(t => !t.completed);
      incompleteTasks.forEach(task => {
        items.push({
          type: 'task',
          title: task.title,
          link: '/tasks'
        });
      });
    } catch (err) {
      // No tasks
    }

    // Check network contacts (30+ days since last touch)
    try {
      const networkPath = path.join(__dirname, '../../data/network/contacts.json');
      const networkData = await fs.readFile(networkPath, 'utf8');
      const contacts = JSON.parse(networkData);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      contacts.forEach(contact => {
        const lastTouch = contact.lastTouch ? new Date(contact.lastTouch) : null;
        if (!lastTouch || lastTouch < thirtyDaysAgo) {
          items.push({
            type: 'network',
            title: `Contact ${contact.name}`,
            link: '/network'
          });
        }
      });
    } catch (err) {
      // No network data
    }

    // Check counsel pending decisions
    try {
      const counselPath = path.join(__dirname, '../../data/counsel');
      const counselFiles = await fs.readdir(counselPath);

      for (const file of counselFiles) {
        if (file.endsWith('.json') && file !== 'templates.json') {
          const filePath = path.join(counselPath, file);
          const counselData = await fs.readFile(filePath, 'utf8');
          const counsel = JSON.parse(counselData);

          if (counsel.status === 'pending') {
            items.push({
              type: 'counsel',
              title: counsel.topic || 'Pending decision',
              link: '/counsel'
            });
          }
        }
      }
    } catch (err) {
      // No counsel data
    }

    res.json({
      count: items.length,
      items: items.slice(0, 10) // Limit to 10 items
    });
  } catch (error) {
    console.error('Error fetching urgent items:', error);
    res.status(500).json({ error: 'Failed to fetch urgent items' });
  }
});

// GET /api/dashboard/skills-progress — Hours per skill this week
router.get('/skills-progress', async (req, res) => {
  try {
    const skills = [];

    try {
      const skillsPath = path.join(__dirname, '../../data/learning/skills.json');
      const skillsData = await fs.readFile(skillsPath, 'utf8');
      const skillsList = JSON.parse(skillsData);

      // Calculate hours this week for each skill
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      skillsList.forEach(skill => {
        let hoursThisWeek = 0;

        if (skill.sessions) {
          skill.sessions.forEach(session => {
            const sessionDate = new Date(session.date);
            if (sessionDate >= weekStart) {
              hoursThisWeek += session.hours || 0;
            }
          });
        }

        if (hoursThisWeek > 0) {
          skills.push({
            name: skill.name,
            hoursThisWeek
          });
        }
      });

      // Sort by hours descending
      skills.sort((a, b) => b.hoursThisWeek - a.hoursThisWeek);
    } catch (err) {
      // No skills data
    }

    res.json({ skills });
  } catch (error) {
    console.error('Error fetching skills progress:', error);
    res.status(500).json({ error: 'Failed to fetch skills progress' });
  }
});

// GET /api/dashboard/sync-status — Last git sync time
router.get('/sync-status', async (req, res) => {
  try {
    // Check git status to determine sync state
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
      const dataPath = path.join(__dirname, '../../data');

      // Check if there are uncommitted changes
      const { stdout: statusOutput } = await execPromise('git status --porcelain', {
        cwd: dataPath
      });

      const hasChanges = statusOutput.trim().length > 0;

      // Get last commit time
      const { stdout: logOutput } = await execPromise('git log -1 --format=%ct', {
        cwd: dataPath
      });

      const lastCommitTimestamp = parseInt(logOutput.trim()) * 1000;
      const lastSync = new Date(lastCommitTimestamp);
      const now = new Date();
      const minutesAgo = Math.floor((now - lastSync) / 60000);

      let timeAgo;
      if (minutesAgo < 1) {
        timeAgo = 'just now';
      } else if (minutesAgo < 60) {
        timeAgo = `${minutesAgo}m ago`;
      } else if (minutesAgo < 1440) {
        timeAgo = `${Math.floor(minutesAgo / 60)}h ago`;
      } else {
        timeAgo = `${Math.floor(minutesAgo / 1440)}d ago`;
      }

      res.json({
        lastSync: lastSync.toISOString(),
        pending: hasChanges,
        status: hasChanges ? 'pending' : 'synced',
        timeAgo
      });
    } catch (gitErr) {
      // Not a git repo or git not available
      res.json({
        lastSync: null,
        pending: false,
        status: 'unknown',
        timeAgo: 'N/A'
      });
    }
  } catch (error) {
    console.error('Error checking sync status:', error);
    res.status(500).json({ error: 'Failed to check sync status' });
  }
});

// GET /api/dashboard/suggestions — AI recommendations
router.get('/suggestions', async (req, res) => {
  try {
    // Load suggestions from file or return default ones
    let suggestions = [
      {
        id: 'sugg-001',
        category: 'Process',
        text: 'Automate weekly task reminders via cron',
        priority: 'high'
      },
      {
        id: 'sugg-002',
        category: 'Investment',
        text: 'Review real estate market trends for Q2',
        priority: 'medium'
      },
      {
        id: 'sugg-003',
        category: 'Workflow',
        text: 'Create SOP for new client onboarding',
        priority: 'medium'
      }
    ];

    try {
      const suggestionsPath = path.join(__dirname, '../../data/suggestions.json');
      const suggestionsData = await fs.readFile(suggestionsPath, 'utf8');
      suggestions = JSON.parse(suggestionsData);
    } catch (err) {
      // Use default suggestions
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
