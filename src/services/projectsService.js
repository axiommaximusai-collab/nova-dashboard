const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data/projects');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
}

function saveProjects(projects) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function getAllProjects() {
  return loadProjects();
}

function getProject(id) {
  return loadProjects().find(p => p.id === id);
}

function createProject(project) {
  const projects = loadProjects();
  project.id = uuidv4();
  project.createdAt = new Date().toISOString();
  project.status = project.status || 'active';
  project.progress = 0;
  projects.push(project);
  saveProjects(projects);
  return project;
}

function updateProgress(id, progress) {
  const projects = loadProjects();
  const project = projects.find(p => p.id === id);
  if (project) {
    project.progress = progress;
    project.updatedAt = new Date().toISOString();
    saveProjects(projects);
  }
  return project;
}

function updateProject(id, updates) {
  const projects = loadProjects();
  const project = projects.find(p => p.id === id);
  if (project) {
    Object.assign(project, updates);
    project.updatedAt = new Date().toISOString();
    saveProjects(projects);
  }
  return project;
}

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProgress,
  updateProject
};
