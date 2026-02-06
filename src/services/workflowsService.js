const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data/workflows');
const WORKFLOWS_FILE = path.join(DATA_DIR, 'workflows.json');
const EXECUTIONS_FILE = path.join(DATA_DIR, 'executions.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadWorkflows() {
  if (!fs.existsSync(WORKFLOWS_FILE)) return [];
  return JSON.parse(fs.readFileSync(WORKFLOWS_FILE, 'utf8'));
}

function saveWorkflows(workflows) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(WORKFLOWS_FILE, JSON.stringify(workflows, null, 2));
}

function loadExecutions() {
  if (!fs.existsSync(EXECUTIONS_FILE)) return [];
  return JSON.parse(fs.readFileSync(EXECUTIONS_FILE, 'utf8'));
}

function saveExecutions(executions) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(EXECUTIONS_FILE, JSON.stringify(executions, null, 2));
}

function getAllWorkflows() {
  return loadWorkflows();
}

function getWorkflow(id) {
  return loadWorkflows().find(w => w.id === id);
}

function createWorkflow(workflow) {
  const workflows = loadWorkflows();
  workflow.id = uuidv4();
  workflow.createdAt = new Date().toISOString();
  workflow.status = 'active';
  workflow.runCount = 0;
  workflows.push(workflow);
  saveWorkflows(workflows);
  return workflow;
}

function getExecutions(workflowId) {
  return loadExecutions().filter(e => e.workflowId === workflowId);
}

function logExecution(workflowId, data) {
  const executions = loadExecutions();
  const execution = {
    id: uuidv4(),
    workflowId,
    timestamp: new Date().toISOString(),
    status: data.status || 'completed',
    notes: data.notes || ''
  };
  executions.push(execution);
  saveExecutions(executions);
  
  // Update workflow run count
  const workflows = loadWorkflows();
  const workflow = workflows.find(w => w.id === workflowId);
  if (workflow) {
    workflow.runCount = (workflow.runCount || 0) + 1;
    workflow.lastRun = execution.timestamp;
    saveWorkflows(workflows);
  }
  
  return execution;
}

module.exports = {
  getAllWorkflows,
  getWorkflow,
  createWorkflow,
  getExecutions,
  logExecution
};
