const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data/tasks');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getWeeklyTasks(year, week) {
  const file = path.join(DATA_DIR, `${year}-W${week}.json`);
  if (!fs.existsSync(file)) {
    return { year, week, tasks: [], completed: 0, total: 0 };
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveWeeklyTasks(year, week, data) {
  ensureDir(DATA_DIR);
  const file = path.join(DATA_DIR, `${year}-W${week}.json`);
  data.total = data.tasks?.length || 0;
  data.completed = data.tasks?.filter(t => t.completed).length || 0;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data;
}

function completeTask(taskId) {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    const task = data.tasks?.find(t => t.id === taskId);
    if (task) {
      task.completed = true;
      task.completedAt = new Date().toISOString();
      saveWeeklyTasks(data.year, data.week, data);
      return task;
    }
  }
  return null;
}

function rolloverIncompleteTasks(fromWeek, toWeek) {
  const fromData = getWeeklyTasks(fromWeek.year, fromWeek.week);
  const toData = getWeeklyTasks(toWeek.year, toWeek.week);
  
  const incomplete = fromData.tasks?.filter(t => !t.completed) || [];
  incomplete.forEach(task => {
    task.id = uuidv4();
    task.carriedFrom = `${fromWeek.year}-W${fromWeek.week}`;
    task.carried = true;
  });
  
  toData.tasks = [...(toData.tasks || []), ...incomplete];
  saveWeeklyTasks(toWeek.year, toWeek.week, toData);
  
  return { rolled: incomplete.length, tasks: incomplete };
}

module.exports = {
  getWeeklyTasks,
  saveWeeklyTasks,
  completeTask,
  rolloverIncompleteTasks
};
