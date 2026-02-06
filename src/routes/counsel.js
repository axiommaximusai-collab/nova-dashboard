const express = require('express');
const router = express.Router();
const counselService = require('../services/counselService');

// ========== SESSIONS ==========

// Get all sessions
router.get('/sessions', (req, res) => {
  const { status, category } = req.query;

  let sessions;
  if (status) {
    sessions = counselService.getSessionsByStatus(status);
  } else if (category) {
    sessions = counselService.getSessionsByCategory(category);
  } else {
    sessions = counselService.getAllSessions();
  }

  res.json(sessions);
});

// Get session by ID
router.get('/sessions/:id', (req, res) => {
  const session = counselService.getSessionById(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// Create new session
router.post('/sessions', (req, res) => {
  try {
    const session = counselService.createSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session
router.put('/sessions/:id', (req, res) => {
  const updated = counselService.updateSession(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(updated);
});

// Delete session
router.delete('/sessions/:id', (req, res) => {
  const deleted = counselService.deleteSession(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ success: true });
});

// ========== AGENT RESPONSES ==========

// Get agent responses for a session
router.get('/sessions/:id/responses', (req, res) => {
  const responses = counselService.getAgentResponses(req.params.id);
  res.json(responses);
});

// Add agent response to session
router.post('/sessions/:id/responses', (req, res) => {
  try {
    const response = counselService.addAgentResponse(req.params.id, req.body);
    if (!response) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add agent response' });
  }
});

// ========== SYNTHESIS ==========

// Add synthesis to session
router.post('/sessions/:id/synthesis', (req, res) => {
  try {
    const synthesis = counselService.addSynthesis(req.params.id, req.body);
    if (!synthesis) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(201).json(synthesis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add synthesis' });
  }
});

// ========== DECISIONS ==========

// Record user decision
router.post('/sessions/:id/decision', (req, res) => {
  try {
    const decision = counselService.recordDecision(req.params.id, req.body);
    if (!decision) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(201).json(decision);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record decision' });
  }
});

// ========== AGENTS CONFIGURATION ==========

// Get all agents
router.get('/agents', (req, res) => {
  const agents = counselService.getAllAgents();
  res.json(agents);
});

// Get agent by ID
router.get('/agents/:id', (req, res) => {
  const agent = counselService.getAgentById(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

// Update agent configuration
router.put('/agents/:id', (req, res) => {
  const updated = counselService.updateAgent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(updated);
});

// ========== ANALYTICS ==========

// Get session metrics
router.get('/metrics', (req, res) => {
  const metrics = counselService.getSessionMetrics();
  res.json(metrics);
});

module.exports = router;
