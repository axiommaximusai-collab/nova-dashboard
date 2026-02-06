const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data/habits');
const CONFIG_FILE = path.join(DATA_DIR, 'habits.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return { habits: [] };
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}

function saveConfig(config) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function getAllHabits() {
  return loadConfig().habits;
}

function createHabit(habit) {
  const config = loadConfig();
  habit.id = uuidv4();
  habit.createdAt = new Date().toISOString();
  habit.currentStreak = 0;
  habit.bestStreak = 0;
  habit.history = [];
  config.habits.push(habit);
  saveConfig(config);
  return habit;
}

function logHabit(habitId, date) {
  const config = loadConfig();
  const habit = config.habits.find(h => h.id === habitId);
  if (!habit) return null;
  
  const dateStr = date || new Date().toISOString().split('T')[0];
  if (!habit.history.includes(dateStr)) {
    habit.history.push(dateStr);
    habit.history.sort();
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkStr = checkDate.toISOString().split('T')[0];
      if (habit.history.includes(checkStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    habit.currentStreak = streak;
    if (streak > habit.bestStreak) habit.bestStreak = streak;
  }
  
  saveConfig(config);
  return { habitId, date: dateStr, streak: habit.currentStreak };
}

function getHabitHistory(habitId) {
  const config = loadConfig();
  const habit = config.habits.find(h => h.id === habitId);
  return habit ? habit.history : [];
}

module.exports = {
  getAllHabits,
  createHabit,
  logHabit,
  getHabitHistory
};
