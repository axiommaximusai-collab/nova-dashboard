const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data/counsel');

// Ensure data directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Default AI agents configuration
const DEFAULT_AGENTS = [
  {
    id: 'business_strategist',
    name: 'Business Strategist',
    role: 'Long-term thinking, market positioning, competitive advantage',
    model: 'claude-opus',
    avatar: '🏢',
    style: 'Measured, considers second-order effects, focuses on sustainable growth',
    systemPrompt: `You are a Business Strategist. You think in terms of long-term positioning, competitive moats, and sustainable growth. You consider second and third-order effects of decisions. You're not afraid to take calculated risks if they create lasting advantages. Focus on: What moat does this create? How does this position us in 3-5 years? What are the opportunity costs?`
  },
  {
    id: 'data_analyst',
    name: 'Data Analyst',
    role: 'Market research, numbers, trends, competitive analysis',
    model: 'gpt-4',
    avatar: '📊',
    style: 'Data-driven, seeks evidence, quantifies everything',
    systemPrompt: `You are a Data Analyst. You need numbers, evidence, and data to make decisions. You research market sizes, competitor positioning, and historical trends. You calculate ROI, TAM, and success probabilities. You ask: What's the market size? What do the numbers say? What evidence supports this decision?`
  },
  {
    id: 'risk_assessor',
    name: 'Risk Assessor',
    role: "Devil's advocate, what could go wrong, downside scenarios",
    model: 'deepseek-chat',
    avatar: '⚖️',
    style: 'Critical thinking, worst-case planning, contingency focus',
    systemPrompt: `You are a Risk Assessor. Your job is to identify what could go wrong. You think about failure modes, downside scenarios, and contingency plans. You're not pessimistic, but realistic. You ask: What are the 3 ways this could fail? What's our downside if we're wrong? Do we have the resources to recover?`
  },
  {
    id: 'financial_advisor',
    name: 'Financial Advisor',
    role: 'ROI, cash flow, capital allocation, unit economics',
    model: 'gemini-pro',
    avatar: '💰',
    style: 'Numbers-focused, profitability-minded, resource-conscious',
    systemPrompt: `You are a Financial Advisor. You think in terms of ROI, cash flow, and capital efficiency. You calculate payback periods, unit economics, and opportunity costs. You ask: What's the expected ROI? How does this impact cash flow? What's the opportunity cost of this capital?`
  }
];

// Initialize data files
function initializeData() {
  ensureDir(DATA_DIR);
  
  // Create agents.json if it doesn't exist
  const agentsFile = path.join(DATA_DIR, 'agents.json');
  if (!fs.existsSync(agentsFile)) {
    fs.writeFileSync(agentsFile, JSON.stringify(DEFAULT_AGENTS, null, 2));
  }
  
  // Create sessions.json if it doesn't exist - load sample data
  const sessionsFile = path.join(DATA_DIR, 'sessions.json');
  if (!fs.existsSync(sessionsFile)) {
    // Load sample session
    const sampleSession = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../../../data/counsel/sample-session.json'), 
      'utf8'
    ));
    fs.writeFileSync(sessionsFile, JSON.stringify(sampleSession, null, 2));
  }
}

// Get all agents
function getAgents() {
  const agentsFile = path.join(DATA_DIR, 'agents.json');
  if (!fs.existsSync(agentsFile)) {
    return DEFAULT_AGENTS;
  }
  return JSON.parse(fs.readFileSync(agentsFile, 'utf8'));
}

// Get all sessions
function getSessions() {
  const sessionsFile = path.join(DATA_DIR, 'sessions.json');
  if (!fs.existsSync(sessionsFile)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
}

// Get session by ID
function getSession(id) {
  const sessions = getSessions();
  return sessions.find(session => session.id === id);
}

// Create a new counsel session
function createSession(sessionData) {
  const sessions = getSessions();
  
  const newSession = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending', // pending, debating, synthesized, decided
    topic: sessionData.topic,
    category: sessionData.category || 'General',
    context: sessionData.context || {},
    agents: sessionData.agents || getAgents().map(agent => ({
      ...agent,
      position: '',
      keyPoints: [],
      confidence: 0,
      reasoning: '',
      cost: 0,
      time: 0
    })),
    debate: [],
    synthesis: null,
    decision: null,
    stats: {
      totalCost: 0,
      totalTime: 0,
      agentCount: sessionData.agents?.length || DEFAULT_AGENTS.length
    }
  };
  
  sessions.push(newSession);
  fs.writeFileSync(path.join(DATA_DIR, 'sessions.json'), JSON.stringify(sessions, null, 2));
  
  return newSession;
}

// Update agent position in a session
function updateAgentPosition(sessionId, agentId, positionData) {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) {
    throw new Error('Session not found');
  }
  
  const session = sessions[sessionIndex];
  const agentIndex = session.agents.findIndex(a => a.id === agentId);
  
  if (agentIndex === -1) {
    throw new Error('Agent not found in session');
  }
  
  // Update agent position
  session.agents[agentIndex] = {
    ...session.agents[agentIndex],
    ...positionData,
    updatedAt: new Date().toISOString()
  };
  
  // Add to debate log
  session.debate.push({
    agentId,
    agentName: session.agents[agentIndex].name,
    timestamp: new Date().toISOString(),
    position: positionData.position,
    keyPoints: positionData.keyPoints,
    confidence: positionData.confidence
  });
  
  // Update session status
  if (session.status === 'pending') {
    session.status = 'debating';
  }
  
  session.updatedAt = new Date().toISOString();
  
  // Update stats
  session.stats.totalCost += positionData.cost || 0;
  session.stats.totalTime += positionData.time || 0;
  
  sessions[sessionIndex] = session;
  fs.writeFileSync(path.join(DATA_DIR, 'sessions.json'), JSON.stringify(sessions, null, 2));
  
  return session;
}

// Synthesize all agent positions into a recommendation
function synthesizeSession(sessionId, synthesisData) {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) {
    throw new Error('Session not found');
  }
  
  const session = sessions[sessionIndex];
  
  session.synthesis = {
    ...synthesisData,
    synthesizedAt: new Date().toISOString()
  };
  
  session.status = 'synthesized';
  session.updatedAt = new Date().toISOString();
  
  sessions[sessionIndex] = session;
  fs.writeFileSync(path.join(DATA_DIR, 'sessions.json'), JSON.stringify(sessions, null, 2));
  
  return session;
}

// Record a decision based on the counsel session
function recordDecision(sessionId, decisionData) {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) {
    throw new Error('Session not found');
  }
  
  const session = sessions[sessionIndex];
  
  session.decision = {
    ...decisionData,
    decidedAt: new Date().toISOString()
  };
  
  session.status = 'decided';
  session.updatedAt = new Date().toISOString();
  
  sessions[sessionIndex] = session;
  fs.writeFileSync(path.join(DATA_DIR, 'sessions.json'), JSON.stringify(sessions, null, 2));
  
  return session;
}

// Get session statistics
function getSessionStats(sessionId) {
  const session = getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  
  return {
    sessionId,
    topic: session.topic,
    status: session.status,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    stats: session.stats,
    agentCount: session.agents.length,
    debateEntries: session.debate.length,
    hasSynthesis: !!session.synthesis,
    hasDecision: !!session.decision
  };
}

// Get overall counsel statistics
function getOverallStats() {
  const sessions = getSessions();
  
  const stats = {
    totalSessions: sessions.length,
    sessionsByStatus: {
      pending: 0,
      debating: 0,
      synthesized: 0,
      decided: 0
    },
    totalCost: 0,
    totalTime: 0,
    decisionsMade: 0,
    averageConfidence: 0,
    mostActiveCategory: null
  };
  
  const categoryCounts = {};
  let totalConfidence = 0;
  let confidenceCount = 0;
  
  sessions.forEach(session => {
    stats.sessionsByStatus[session.status]++;
    stats.totalCost += session.stats.totalCost;
    stats.totalTime += session.stats.totalTime;
    
    if (session.status === 'decided') {
      stats.decisionsMade++;
    }
    
    // Count categories
    const category = session.category || 'General';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    
    // Calculate average confidence
    session.agents.forEach(agent => {
      if (agent.confidence > 0) {
        totalConfidence += agent.confidence;
        confidenceCount++;
      }
    });
  });
  
  // Find most active category
  let maxCount = 0;
  let maxCategory = null;
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxCategory = category;
    }
  });
  
  stats.mostActiveCategory = maxCategory;
  stats.averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;
  
  return stats;
}

// Initialize data on module load
initializeData();

module.exports = {
  initializeData,
  getAgents,
  getSessions,
  getSession,
  createSession,
  updateAgentPosition,
  synthesizeSession,
  recordDecision,
  getSessionStats,
  getOverallStats
};