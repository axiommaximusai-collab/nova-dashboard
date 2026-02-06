const express = require('express');
const router = express.Router();
const projectsService = require('../services/projectsService');

router.get('/', (req, res) => {
  const projects = projectsService.getAllProjects();
  res.json(projects);
});

router.get('/:id', (req, res) => {
  const project = projectsService.getProject(req.params.id);
  res.json(project);
});

router.post('/', (req, res) => {
  const project = projectsService.createProject(req.body);
  res.json(project);
});

router.patch('/:id/progress', (req, res) => {
  const project = projectsService.updateProgress(req.params.id, req.body.progress);
  res.json(project);
});

module.exports = router;
