const express = require('express');
const router = express.Router();
const counselService = require('../services/counselService');

// Get all counsel sessions
router.get('/sessions', (req, res) => {
  try {
    const sessions = counselService.getSessions();
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Error getting counsel sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get counsel sessions'
    });
  }
});

// Get a specific session
router.get('/sessions/:id', (req, res) => {
  try {
    const session = counselService.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error getting counsel session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get counsel session'
    });
  }
});

// Create a new counsel session
router.post('/sessions', (req, res) => {
  try {
    const { topic, category, context, agents } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }
    
    const session = counselService.createSession({
      topic,
      category,
      context,
      agents
    });
    
    res.status(201).json({
      success: true,
      message: 'Counsel session created',
      data: session
    });
  } catch (error) {
    console.error('Error creating counsel session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create counsel session'
    });
  }
});

// Update agent position in a session
router.put('/sessions/:sessionId/agents/:agentId/position', (req, res) => {
  try {
    const { sessionId, agentId } = req.params;
    const { position, keyPoints, confidence, reasoning, cost, time } = req.body;
    
    if (!position) {
      return res.status(400).json({
        success: false,
        error: 'Position is required'
      });
    }
    
    const session = counselService.updateAgentPosition(sessionId, agentId, {
      position,
      keyPoints: keyPoints || [],
      confidence: confidence || 0,
      reasoning: reasoning || '',
      cost: cost || 0,
      time: time || 0
    });
    
    res.json({
      success: true,
      message: 'Agent position updated',
      data: session
    });
  } catch (error) {
    console.error('Error updating agent position:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update agent position'
    });
  }
});

// Synthesize session (create recommendation)
router.put('/sessions/:id/synthesize', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      recommendation, 
      confidence, 
      keyPoints, 
      risks, 
      opportunities,
      nextSteps 
    } = req.body;
    
    if (!recommendation) {
      return res.status(400).json({
        success: false,
        error: 'Recommendation is required'
      });
    }
    
    const session = counselService.synthesizeSession(id, {
      recommendation,
      confidence: confidence || 0,
      keyPoints: keyPoints || [],
      risks: risks || [],
      opportunities: opportunities || [],
      nextSteps: nextSteps || []
    });
    
    res.json({
      success: true,
      message: 'Session synthesized',
      data: session
    });
  } catch (error) {
    console.error('Error synthesizing session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to synthesize session'
    });
  }
});

// Record decision for a session
router.put('/sessions/:id/decide', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      decision, 
      rationale, 
      actionItems,
      followUpDate,
      confidence 
    } = req.body;
    
    if (!decision) {
      return res.status(400).json({
        success: false,
        error: 'Decision is required'
      });
    }
    
    const session = counselService.recordDecision(id, {
      decision,
      rationale: rationale || '',
      actionItems: actionItems || [],
      followUpDate: followUpDate || null,
      confidence: confidence || 0
    });
    
    res.json({
      success: true,
      message: 'Decision recorded',
      data: session
    });
  } catch (error) {
    console.error('Error recording decision:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to record decision'
    });
  }
});

// Get session statistics
router.get('/sessions/:id/stats', (req, res) => {
  try {
    const { id } = req.params;
    const stats = counselService.getSessionStats(id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting session stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get session stats'
    });
  }
});

// Get overall counsel statistics
router.get('/stats', (req, res) => {
  try {
    const stats = counselService.getOverallStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting counsel stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get counsel stats'
    });
  }
});

// Get all agents
router.get('/agents', (req, res) => {
  try {
    const agents = counselService.getAgents();
    
    res.json({
      success: true,
      data: agents,
      count: agents.length
    });
  } catch (error) {
    console.error('Error getting agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get agents'
    });
  }
});

module.exports = router;