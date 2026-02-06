const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'network');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const INTERACTIONS_FILE = path.join(DATA_DIR, 'interactions.json');
const DEAL_FLOW_FILE = path.join(DATA_DIR, 'deal-flow.json');
const INTRODUCTIONS_FILE = path.join(DATA_DIR, 'introductions.json');

// Initialize files if they don't exist
function initFiles() {
  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify({ contacts: [] }, null, 2));
  }
  if (!fs.existsSync(INTERACTIONS_FILE)) {
    fs.writeFileSync(INTERACTIONS_FILE, JSON.stringify({ interactions: [] }, null, 2));
  }
  if (!fs.existsSync(DEAL_FLOW_FILE)) {
    fs.writeFileSync(DEAL_FLOW_FILE, JSON.stringify({ dealSources: [] }, null, 2));
  }
  if (!fs.existsSync(INTRODUCTIONS_FILE)) {
    fs.writeFileSync(INTRODUCTIONS_FILE, JSON.stringify({ introductions: [] }, null, 2));
  }
}

initFiles();

function loadContacts() {
  return JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8'));
}

function saveContacts(data) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(data, null, 2));
}

function loadInteractions() {
  return JSON.parse(fs.readFileSync(INTERACTIONS_FILE, 'utf8'));
}

function saveInteractions(data) {
  fs.writeFileSync(INTERACTIONS_FILE, JSON.stringify(data, null, 2));
}

function loadDealFlow() {
  return JSON.parse(fs.readFileSync(DEAL_FLOW_FILE, 'utf8'));
}

function saveDealFlow(data) {
  fs.writeFileSync(DEAL_FLOW_FILE, JSON.stringify(data, null, 2));
}

function loadIntroductions() {
  return JSON.parse(fs.readFileSync(INTRODUCTIONS_FILE, 'utf8'));
}

function saveIntroductions(data) {
  fs.writeFileSync(INTRODUCTIONS_FILE, JSON.stringify(data, null, 2));
}

const NetworkService = {
  // Contacts
  getContacts() {
    return loadContacts().contacts;
  },

  getContactById(id) {
    return loadContacts().contacts.find(c => c.id === id);
  },

  createContact(contactData) {
    const data = loadContacts();
    const contact = {
      id: `contact-${Date.now()}`,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.contacts.push(contact);
    saveContacts(data);
    return contact;
  },

  updateContact(id, updates) {
    const data = loadContacts();
    const index = data.contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    data.contacts[index] = {
      ...data.contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveContacts(data);
    return data.contacts[index];
  },

  deleteContact(id) {
    const data = loadContacts();
    const index = data.contacts.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    data.contacts.splice(index, 1);
    saveContacts(data);
    return true;
  },

  // Interactions
  getInteractions(contactId = null) {
    const interactions = loadInteractions().interactions;
    return contactId 
      ? interactions.filter(i => i.contactId === contactId)
      : interactions;
  },

  createInteraction(interactionData) {
    const data = loadInteractions();
    const interaction = {
      id: `touch-${Date.now()}`,
      ...interactionData,
      createdAt: new Date().toISOString()
    };
    data.interactions.push(interaction);
    saveInteractions(data);
    
    // Update contact's last contact date
    this.updateContact(interaction.contactId, {
      'interactions.lastContact': interaction.date,
      'interactions.lastMethod': interaction.method
    });
    
    return interaction;
  },

  // Touch reminders - contacts needing attention
  getTouchReminders(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return loadContacts().contacts.filter(c => {
      const lastContact = c.interactions?.lastContact 
        ? new Date(c.interactions.lastContact) 
        : new Date(c.createdAt);
      return lastContact < cutoff;
    }).sort((a, b) => {
      const dateA = new Date(a.interactions?.lastContact || a.createdAt);
      const dateB = new Date(b.interactions?.lastContact || b.createdAt);
      return dateA - dateB;
    });
  },

  // Deal flow
  getDealFlow(contactId = null) {
    const dealFlow = loadDealFlow().dealSources;
    return contactId
      ? dealFlow.filter(d => d.contactId === contactId)
      : dealFlow;
  },

  addDealFlow(dealData) {
    const data = loadDealFlow();
    const deal = {
      id: `deal-${Date.now()}`,
      ...dealData,
      createdAt: new Date().toISOString()
    };
    data.dealSources.push(deal);
    saveDealFlow(data);
    return deal;
  },

  // Introductions
  getIntroductions() {
    return loadIntroductions().introductions;
  },

  createIntroduction(introData) {
    const data = loadIntroductions();
    const intro = {
      id: `intro-${Date.now()}`,
      ...introData,
      createdAt: new Date().toISOString()
    };
    data.introductions.push(intro);
    saveIntroductions(data);
    return intro;
  },

  // Network metrics
  getNetworkMetrics() {
    const contacts = loadContacts().contacts;
    const dealFlow = loadDealFlow().dealSources;
    
    const totalValue = dealFlow.reduce((sum, source) => {
      const value = source.metrics?.totalValue || '0';
      const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
      // Handle 'k' suffix (thousands) - multiply by 1000
      const multiplier = value.toLowerCase().includes('k') ? 1000 : 1;
      return sum + (numericValue * multiplier);
    }, 0);
    
    const dealSources = dealFlow.length;
    const strongRelationships = contacts.filter(c => 
      c.relationship?.strength === 'strong'
    ).length;
    
    // Format total value nicely
    let formattedValue;
    if (totalValue >= 1000000) {
      formattedValue = `$${(totalValue / 1000000).toFixed(1)}M`;
    } else if (totalValue >= 1000) {
      formattedValue = `$${(totalValue / 1000).toFixed(0)}k`;
    } else {
      formattedValue = `$${totalValue}`;
    }
    
    return {
      totalContacts: contacts.length,
      strongRelationships,
      dealSources,
      totalDealValue: formattedValue,
      introductionsMade: loadIntroductions().introductions.length
    };
  },

  // Top deal sources
  getTopDealSources(limit = 5) {
    const dealFlow = loadDealFlow().dealSources;
    return dealFlow
      .sort((a, b) => {
        const valA = parseInt(a.metrics?.totalValue?.replace(/[^0-9]/g, '')) || 0;
        const valB = parseInt(b.metrics?.totalValue?.replace(/[^0-9]/g, '')) || 0;
        return valB - valA;
      })
      .slice(0, limit);
  }
};

module.exports = NetworkService;
