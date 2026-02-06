const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const goalsRoutes = require('./routes/goals');
const tasksRoutes = require('./routes/tasks');
const habitsRoutes = require('./routes/habits');
const workflowsRoutes = require('./routes/workflows');
const memoryRoutes = require('./routes/memory');
const projectsRoutes = require('./routes/projects');
const networkRoutes = require('./routes/network');
const gitSyncRoutes = require('./routes/gitSync');
const counselRoutes = require('./routes/counsel');
const learningRoutes = require('./routes/learning');
const dashboardRoutes = require('./routes/dashboard');

// Import git sync and initialize hooks
const { initializeServiceHooks } = require('./services/gitSyncHooks');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'renderer')));

// API Routes
app.use('/api/goals', goalsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/workflows', workflowsRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/git-sync', gitSyncRoutes);
app.use('/api/counsel', counselRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Git sync status endpoint
app.get('/api/sync-status', (req, res) => {
  const { gitSync } = require('./services/gitSync');
  res.json(gitSync.getStatus());
});

// Main dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'renderer', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 NOVA DASHBOARD - The Collective Mind             ║
║   Studio Shade Co.                                    ║
║                                                        ║
║   Running at: http://localhost:${PORT}                    ║
║                                                        ║
║   🔄 Git Sync: Active (5-min debounce)                ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
