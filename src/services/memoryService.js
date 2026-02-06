const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data/memory');
const ENTRIES_FILE = path.join(DATA_DIR, 'entries.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadEntries() {
  if (!fs.existsSync(ENTRIES_FILE)) return [];
  return JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf8'));
}

function saveEntries(entries) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
}

function search(query) {
  const entries = loadEntries();
  const q = query.toLowerCase();
  return entries.filter(e => 
    e.content?.toLowerCase().includes(q) ||
    e.tags?.some(t => t.toLowerCase().includes(q)) ||
    e.category?.toLowerCase().includes(q)
  );
}

function getTimeline(limit) {
  const entries = loadEntries();
  return entries
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

function createEntry(entry) {
  const entries = loadEntries();
  entry.id = uuidv4();
  entry.timestamp = new Date().toISOString();
  entries.push(entry);
  saveEntries(entries);
  return entry;
}

function getAllTags() {
  const entries = loadEntries();
  const tags = new Set();
  entries.forEach(e => e.tags?.forEach(t => tags.add(t)));
  return Array.from(tags);
}

function getPeople() {
  const entries = loadEntries().filter(e => e.type === 'person');
  return entries;
}

module.exports = {
  search,
  getTimeline,
  createEntry,
  getAllTags,
  getPeople
};
