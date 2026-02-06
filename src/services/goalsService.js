const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data/goals');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getDailyGoals(date) {
  const file = path.join(DATA_DIR, 'daily', `${date}.json`);
  if (!fs.existsSync(file)) {
    return { date, goals: [], theme: '', notes: '' };
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveDailyGoals(date, data) {
  ensureDir(path.join(DATA_DIR, 'daily'));
  const file = path.join(DATA_DIR, 'daily', `${date}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data;
}

function getWeeklyGoals(year, week) {
  const file = path.join(DATA_DIR, 'weekly', `${year}-W${week}.json`);
  if (!fs.existsSync(file)) {
    return { year, week, goals: [], theme: '', priorities: [] };
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveWeeklyGoals(year, week, data) {
  ensureDir(path.join(DATA_DIR, 'weekly'));
  const file = path.join(DATA_DIR, 'weekly', `${year}-W${week}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data;
}

function getMonthlyGoals(year, month) {
  const file = path.join(DATA_DIR, 'monthly', `${year}-${month}.json`);
  if (!fs.existsSync(file)) {
    return { year, month, goals: [], theme: '', milestones: [] };
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveMonthlyGoals(year, month, data) {
  ensureDir(path.join(DATA_DIR, 'monthly'));
  const file = path.join(DATA_DIR, 'monthly', `${year}-${month}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data;
}

module.exports = {
  getDailyGoals,
  saveDailyGoals,
  getWeeklyGoals,
  saveWeeklyGoals,
  getMonthlyGoals,
  saveMonthlyGoals
};
