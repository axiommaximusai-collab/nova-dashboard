const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const goalsRoutes = require('./routes/goals');
const tasksRoutes = require('./routes/tasks');
const habitsRoutes = require('./routes/habits');
const workflowsRoutes = require('./routes/workflows');
const memoryRoutes = require('./routes/memory');
const projectsRoutes = require('./routes/projects');
const networkRoutes = require('./routes/network');

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
╚════════════════════════════════════════════════════════╝
  `);
});
