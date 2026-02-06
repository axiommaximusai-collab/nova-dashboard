const express = require('express');
const router = express.Router();
const memoryService = require('../services/memoryService');

router.get('/search', (req, res) => {
  const results = memoryService.search(req.query.q);
  res.json(results);
});

router.get('/timeline', (req, res) => {
  const entries = memoryService.getTimeline(req.query.limit || 50);
  res.json(entries);
});

router.post('/', (req, res) => {
  const entry = memoryService.createEntry(req.body);
  res.json(entry);
});

router.get('/tags', (req, res) => {
  const tags = memoryService.getAllTags();
  res.json(tags);
});

router.get('/people', (req, res) => {
  const people = memoryService.getPeople();
  res.json(people);
});

module.exports = router;
