const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data/counsel');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');

// Ensure data directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initialize files if they don't exist
function initFiles() {
  ensureDir(DATA_DIR);

  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(AGENTS_FILE)) {
    // Default agents configuration
    const defaultAgents = [
      {
        id: 'business-strategist',
        name: 'Business Strategist',
        model: 'Claude',
        role: 'Strategic Advisor',
        perspective: 'High-level strategic thinking, focus on long-term positioning, competitive advantage, and market dynamics',
        systemPrompt: 'You are a strategic business advisor. Analyze the user\'s question from a high-level strategic perspective. Consider: competitive positioning, market dynamics, long-term vision, operational complexity, and strategic risk. Provide clear recommendations with reasoning. Be direct and actionable.',
        strengths: [
          'Long-term strategic planning',
          'Competitive analysis',
          'Market positioning',
          'Operational complexity assessment'
        ],
        icon: '🎯',
        color: '#8b5cf6'
      },
      {
        id: 'data-analyst',
        name: 'Data Analyst',
        model: 'GPT-4',
        role: 'Quantitative Analyst',
        perspective: 'Data-driven, research-based, numerical analysis with focus on metrics, ROI, and quantifiable outcomes',
        systemPrompt: 'You are a data analyst. Analyze the user\'s question using numbers, metrics, and data-driven reasoning. Calculate ROI, estimate timelines, compare scenarios quantitatively. Provide specific numbers and projections where possible. Show your math. Be precise and analytical.',
        strengths: [
          'Quantitative analysis',
          'ROI calculations',
          'Metric-based reasoning',
          'Data interpretation'
        ],
        icon: '📊',
        color: '#3b82f6'
      },
      {
        id: 'risk-assessor',
        name: 'Risk Assessor',
        model: 'DeepSeek',
        role: 'Contrarian Thinker',
        perspective: 'Contrarian viewpoint, challenge assumptions, identify blind spots, highlight risks and alternative perspectives',
        systemPrompt: 'You are a risk assessor and contrarian thinker. Your job is to challenge the obvious answer, identify what could go wrong, highlight blind spots, and present alternative perspectives others might miss. Don\'t just agree with consensus - find the holes in the logic and present legitimate counterarguments. Still provide a recommendation, but make people think twice.',
        strengths: [
          'Risk identification',
          'Contrarian analysis',
          'Assumption challenging',
          'Blind spot detection'
        ],
        icon: '⚠️',
        color: '#ef4444'
      },
      {
        id: 'financial-advisor',
        name: 'Financial Advisor',
        model: 'Gemini',
        role: 'Financial Analyst',
        perspective: 'Cash flow, burn rate, ROI, financial sustainability, and capital efficiency',
        systemPrompt: 'You are a financial advisor. Analyze the user\'s question from a financial perspective. Focus on: cash flow implications, burn rate, ROI, payback period, financial risk, and capital efficiency. Calculate financial scenarios. Recommend the option with the best financial outcomes. Be specific with numbers.',
        strengths: [
          'Cash flow analysis',
          'ROI calculations',
          'Financial modeling',
          'Capital efficiency'
        ],
        icon: '💰',
        color: '#10b981'
      },
      {
        id: 'synthesizer',
        name: 'Synthesizer',
        model: 'Claude',
        role: 'Decision Synthesizer',
        perspective: 'Combines all agent perspectives into a unified, actionable recommendation',
        systemPrompt: 'You are a decision synthesizer. You\'ve received input from 4 different advisors (Business Strategist, Data Analyst, Risk Assessor, Financial Advisor). Your job is to:\n\n1. Analyze all four perspectives\n2. Identify consensus vs. disagreement\n3. Weigh the strength of each argument\n4. Provide a clear, unified recommendation\n5. Acknowledge trade-offs and uncertainties\n6. Give specific next steps\n\nBe decisive. If there\'s consensus, state it confidently. If there\'s disagreement, explain your reasoning for which perspective weighs more heavily and why. Provide confidence score (0-100%).',
        strengths: [
          'Multi-perspective synthesis',
          'Decision clarity',
          'Trade-off analysis',
          'Actionable recommendations'
        ],
        icon: '🧠',
        color: '#ec4899'
      }
    ];
    fs.writeFileSync(AGENTS_FILE, JSON.stringify(defaultAgents, null, 2));
  }
}

initFiles();

function loadSessions() {
  if (!fs.existsSync(SESSIONS_FILE)) return [];
  return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
}

function saveSessions(sessions) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

function loadAgents() {
  if (!fs.existsSync(AGENTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf8'));
}

function saveAgents(agents) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
}

const CounselService = {
  // ========== SESSIONS ==========

  getAllSessions() {
    return loadSessions();
  },

  getSessionById(id) {
    return loadSessions().find(s => s.id === id);
  },

  getSessionsByStatus(status) {
    return loadSessions().filter(s => s.status === status);
  },

  getSessionsByCategory(category) {
    return loadSessions().filter(s => s.category === category);
  },

  createSession(sessionData) {
    const sessions = loadSessions();
    const session = {
      id: `session-${Date.now()}`,
      topic: sessionData.topic,
      context: sessionData.context || '',
      category: sessionData.category || 'General',
      status: 'pending', // pending, in-progress, completed
      createdAt: new Date().toISOString(),
      completedAt: null,
      agentResponses: [],
      synthesis: null,
      decision: null
    };
    sessions.push(session);
    saveSessions(sessions);
    return session;
  },

  updateSession(id, updates) {
    const sessions = loadSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;

    sessions[index] = {
      ...sessions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveSessions(sessions);
    return sessions[index];
  },

  deleteSession(id) {
    const sessions = loadSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return false;

    sessions.splice(index, 1);
    saveSessions(sessions);
    return true;
  },

  // ========== AGENT RESPONSES ==========

  addAgentResponse(sessionId, agentResponse) {
    const sessions = loadSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return null;

    const response = {
      agentId: agentResponse.agentId,
      agentName: agentResponse.agentName,
      response: agentResponse.response,
      confidence: agentResponse.confidence || 50,
      keyPoints: agentResponse.keyPoints || [],
      timestamp: new Date().toISOString()
    };

    session.agentResponses.push(response);
    session.status = 'in-progress';
    saveSessions(sessions);
    return response;
  },

  getAgentResponses(sessionId) {
    const session = this.getSessionById(sessionId);
    return session ? session.agentResponses : [];
  },

  // ========== SYNTHESIS ==========

  addSynthesis(sessionId, synthesisData) {
    const sessions = loadSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return null;

    session.synthesis = {
      recommendation: synthesisData.recommendation,
      reasoning: synthesisData.reasoning,
      confidence: synthesisData.confidence || 50,
      keyTakeaways: synthesisData.keyTakeaways || [],
      nextSteps: synthesisData.nextSteps || [],
      createdAt: new Date().toISOString()
    };

    saveSessions(sessions);
    return session.synthesis;
  },

  // ========== DECISIONS ==========

  recordDecision(sessionId, decisionData) {
    const sessions = loadSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return null;

    session.decision = {
      chosen: decisionData.chosen,
      reasoning: decisionData.reasoning || '',
      implementationPlan: decisionData.implementationPlan || '',
      recordedAt: new Date().toISOString()
    };

    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    saveSessions(sessions);
    return session.decision;
  },

  // ========== AGENTS CONFIGURATION ==========

  getAllAgents() {
    return loadAgents();
  },

  getAgentById(id) {
    return loadAgents().find(a => a.id === id);
  },

  updateAgent(id, updates) {
    const agents = loadAgents();
    const index = agents.findIndex(a => a.id === id);
    if (index === -1) return null;

    agents[index] = {
      ...agents[index],
      ...updates
    };
    saveAgents(agents);
    return agents[index];
  },

  // ========== ANALYTICS ==========

  getSessionMetrics() {
    const sessions = loadSessions();
    const completed = sessions.filter(s => s.status === 'completed');

    // Category breakdown
    const categoryCount = {};
    sessions.forEach(s => {
      categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
    });

    // Average confidence by agent
    const agentConfidence = {};
    sessions.forEach(session => {
      session.agentResponses?.forEach(response => {
        if (!agentConfidence[response.agentId]) {
          agentConfidence[response.agentId] = { total: 0, count: 0 };
        }
        agentConfidence[response.agentId].total += response.confidence;
        agentConfidence[response.agentId].count += 1;
      });
    });

    const avgConfidenceByAgent = {};
    Object.keys(agentConfidence).forEach(agentId => {
      const { total, count } = agentConfidence[agentId];
      avgConfidenceByAgent[agentId] = Math.round(total / count);
    });

    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      pendingSessions: sessions.filter(s => s.status === 'pending').length,
      inProgressSessions: sessions.filter(s => s.status === 'in-progress').length,
      categoryBreakdown: categoryCount,
      avgConfidenceByAgent,
      recentSessions: sessions.slice(-5).reverse()
    };
  }
};

module.exports = CounselService;
