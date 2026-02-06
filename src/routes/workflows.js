const express = require('express');
const router = express.Router();
const workflowsService = require('../services/workflowsService');

router.get('/', (req, res) => {
  const workflows = workflowsService.getAllWorkflows();
  res.json(workflows);
});

router.get('/:id', (req, res) => {
  const workflow = workflowsService.getWorkflow(req.params.id);
  res.json(workflow);
});

router.post('/', (req, res) => {
  const workflow = workflowsService.createWorkflow(req.body);
  res.json(workflow);
});

router.get('/:id/executions', (req, res) => {
  const executions = workflowsService.getExecutions(req.params.id);
  res.json(executions);
});

router.post('/:id/execute', (req, res) => {
  const execution = workflowsService.logExecution(req.params.id, req.body);
  res.json(execution);
});

module.exports = router;
