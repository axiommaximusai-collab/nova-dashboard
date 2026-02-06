// NOVA Dashboard - Main Application
const Nova = {
  currentTab: 'dashboard',
  currentGoalView: 'daily',
  taskFilter: 'all',
  
  init() {
    this.setupNavigation();
    this.setupEventListeners();
    this.updateGreeting();
    this.loadDashboard();
    this.loadGoals();
    this.loadTasks();
    this.loadProjects();
    this.loadWorkflows();
    this.loadHabits();
    this.loadMemory();
    this.loadNetwork();
    this.loadCounsel();
    this.loadLearning();
  },
  
  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
    
    // Goal view toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentGoalView = e.target.dataset.view;
        this.loadGoals();
      });
    });
    
    // Task filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.taskFilter = e.target.dataset.filter;
        this.loadTasks();
      });
    });
  },
  
  setupEventListeners() {
    // Modal
    document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modalCancel').addEventListener('click', () => this.closeModal());
    
    // Add buttons
    document.getElementById('addGoalBtn').addEventListener('click', () => this.addGoalInput());
    document.getElementById('saveGoalsBtn').addEventListener('click', () => this.saveGoals());
    document.getElementById('addTaskBtn').addEventListener('click', () => this.showAddTaskModal());
    document.getElementById('newProjectBtn').addEventListener('click', () => this.showAddProjectModal());
    document.getElementById('newHabitBtn').addEventListener('click', () => this.showAddHabitModal());
    document.getElementById('quickAddMemory').addEventListener('click', () => this.showAddMemoryModal());
    document.getElementById('newWorkflowBtn').addEventListener('click', () => this.showAddWorkflowModal());
    document.getElementById('rolloverBtn').addEventListener('click', () => this.rolloverTasks());
    document.getElementById('newContactBtn').addEventListener('click', () => this.showAddContactModal());
    document.getElementById('newCounselBtn').addEventListener('click', () => this.showAddCounselModal());
    document.getElementById('addBookBtn').addEventListener('click', () => this.showAddBookModal());
    document.getElementById('addCourseBtn').addEventListener('click', () => this.showAddCourseModal());
    document.getElementById('addSkillBtn').addEventListener('click', () => this.showAddSkillModal());
    document.getElementById('addInsightBtn').addEventListener('click', () => this.showAddInsightModal());
    document.getElementById('addMistakeBtn').addEventListener('click', () => this.showAddMistakeModal());
    document.getElementById('addWeeklyGoalBtn').addEventListener('click', () => this.showAddWeeklyGoalModal());

    // Learning subtabs
    document.querySelectorAll('.learning-subtabs .subtab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.learning-subtabs .subtab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.learning-subtab').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        const subtab = e.target.dataset.subtab;
        document.getElementById(`subtab-${subtab}`).classList.add('active');
      });
    });

    // Network filter
    document.querySelectorAll('.contacts-filter .filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.contacts-filter .filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.networkFilter = e.target.dataset.filter;
        this.loadContactsList();
      });
    });
    
    // Search
    document.getElementById('memorySearch').addEventListener('input', (e) => {
      this.searchMemory(e.target.value);
    });
  },
  
  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
  },
  
  updateGreeting() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    document.getElementById('timeGreeting').textContent = greeting;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  },
  
  // API Helpers
  async apiGet(endpoint) {
    const res = await fetch(`/api${endpoint}`);
    return res.json();
  },
  
  async apiPost(endpoint, data) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  // Dashboard
  async loadDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const goals = await this.apiGet(`/goals/daily/${today}`);
    document.getElementById('dailyGoalsPreview').innerHTML = goals.goals?.length 
      ? goals.goals.map(g => `
        <div class="goal-item">
          <div class="goal-checkbox ${g.completed ? 'checked' : ''}">${g.completed ? '✓' : ''}</div>
          <span class="goal-text ${g.completed ? 'completed' : ''}">${g.text}</span>
        </div>
      `).join('')
      : '<p style="color: var(--text-muted);">No goals set for today</p>';
    
    // Load week stats
    const year = new Date().getFullYear();
    const week = this.getWeekNumber(new Date());
    const tasks = await this.apiGet(`/tasks/${year}/${week}`);
    document.getElementById('tasksCompleted').textContent = tasks.completed || 0;
    document.getElementById('tasksTotal').textContent = tasks.total || 0;
    const progress = tasks.total ? (tasks.completed / tasks.total * 100) : 0;
    document.getElementById('weekProgress').style.width = `${progress}%`;
    
    // Load projects preview
    const projects = await this.apiGet('/projects/');
    const activeProjects = projects.slice(0, 3);
    document.getElementById('projectsPreview').innerHTML = activeProjects.length
      ? activeProjects.map(p => `
        <div class="project-card" style="margin-bottom: 12px; padding: 14px;">
          <div style="font-weight: 600; margin-bottom: 8px;">${p.name}</div>
          <div class="project-progress-bar" style="margin-bottom: 6px;">
            <div class="project-progress-fill" style="width: ${p.progress || 0}%"></div>
          </div>
          <div style="font-size: 12px; color: var(--text-muted);">${p.progress || 0}% complete</div>
        </div>
      `).join('')
      : '<p style="color: var(--text-muted);">No active projects</p>';
    
    // Load memory preview
    const memories = await this.apiGet('/memory/timeline?limit=3');
    document.getElementById('memoryPreview').innerHTML = memories.length
      ? memories.map(m => `
        <div class="memory-entry" style="padding: 10px 0;">
          <div class="memory-meta">
            <span class="memory-type">${m.type || 'note'}</span>
            <span>${new Date(m.timestamp).toLocaleDateString()}</span>
          </div>
          <div class="memory-content" style="font-size: 14px;">${m.content?.substring(0, 80)}...</div>
        </div>
      `).join('')
      : '<p style="color: var(--text-muted);">No recent memories</p>';
    
    // Load habit streak
    const habits = await this.apiGet('/habits/');
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0);
    document.getElementById('habitStreak').textContent = maxStreak;
  },
  
  // Goals
  async loadGoals() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const week = this.getWeekNumber(new Date());
    const today = new Date().toISOString().split('T')[0];
    
    let data;
    if (this.currentGoalView === 'daily') {
      data = await this.apiGet(`/goals/daily/${today}`);
    } else if (this.currentGoalView === 'weekly') {
      data = await this.apiGet(`/goals/weekly/${year}/${week}`);
    } else {
      data = await this.apiGet(`/goals/monthly/${year}/${month}`);
    }
    
    document.getElementById('goalTheme').value = data.theme || '';
    document.getElementById('goalNotes').value = data.notes || '';
    
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = '';
    (data.goals || []).forEach((goal, i) => {
      this.addGoalInput(goal.text, goal.completed, i);
    });
  },
  
  addGoalInput(text = '', completed = false, index = null) {
    const div = document.createElement('div');
    div.className = 'goal-input-row';
    div.innerHTML = `
      <input type="text" value="${text}" placeholder="Enter goal..." class="goal-text-input">
      <button onclick="this.parentElement.remove()">✕</button>
    `;
    document.getElementById('goalsList').appendChild(div);
  },
  
  async saveGoals() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const week = this.getWeekNumber(new Date());
    const today = new Date().toISOString().split('T')[0];
    
    const goals = [];
    document.querySelectorAll('.goal-input-row').forEach(row => {
      const text = row.querySelector('input').value.trim();
      if (text) goals.push({ text, completed: false });
    });
    
    const data = {
      theme: document.getElementById('goalTheme').value,
      notes: document.getElementById('goalNotes').value,
      goals
    };
    
    if (this.currentGoalView === 'daily') {
      await this.apiPost(`/goals/daily/${today}`, { ...data, date: today });
    } else if (this.currentGoalView === 'weekly') {
      await this.apiPost(`/goals/weekly/${year}/${week}`, { ...data, year, week });
    } else {
      await this.apiPost(`/goals/monthly/${year}/${month}`, { ...data, year, month });
    }
    
    this.showNotification('Goals saved!');
    this.loadDashboard();
  },
  
  // Tasks
  async loadTasks() {
    const year = new Date().getFullYear();
    const week = this.getWeekNumber(new Date());
    const data = await this.apiGet(`/tasks/${year}/${week}`);
    
    let tasks = data.tasks || [];
    if (this.taskFilter === 'pending') tasks = tasks.filter(t => !t.completed);
    if (this.taskFilter === 'completed') tasks = tasks.filter(t => t.completed);
    
    document.getElementById('tasksList').innerHTML = tasks.length
      ? tasks.map(t => `
        <div class="task-item" data-id="${t.id}">
          <div class="task-priority ${t.priority || 'medium'}"></div>
          <div class="task-content">
            <div class="task-title ${t.completed ? 'completed' : ''}">${t.title}</div>
            <div class="task-meta">${t.project || 'No project'} • ${t.dueDate || 'No due date'}</div>
          </div>
          <span class="task-project">${t.project || 'General'}</span>
          <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="Nova.completeTask('${t.id}')">
        </div>
      `).join('')
      : '<p style="color: var(--text-muted); padding: 20px;">No tasks for this view</p>';
  },
  
  async completeTask(taskId) {
    await fetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' });
    this.loadTasks();
    this.loadDashboard();
  },
  
  async rolloverTasks() {
    const year = new Date().getFullYear();
    const week = this.getWeekNumber(new Date());
    const lastWeek = week > 1 ? week - 1 : 52;
    const lastYear = week > 1 ? year : year - 1;
    
    await this.apiPost('/tasks/rollover', {
      fromWeek: { year: lastYear, week: lastWeek },
      toWeek: { year, week }
    });
    
    this.showNotification('Tasks rolled over!');
    this.loadTasks();
  },
  
  // Projects
  async loadProjects() {
    const projects = await this.apiGet('/projects/');
    document.getElementById('projectsGrid').innerHTML = projects.length
      ? projects.map(p => `
        <div class="project-card" onclick="Nova.viewProject('${p.id}')">
          <div class="project-header">
            <h4>${p.name}</h4>
            <span class="project-status ${p.status}">${p.status}</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 12px;">
            ${p.description?.substring(0, 80) || 'No description'}...
          </p>
          <div class="project-progress">
            <div class="project-progress-bar">
              <div class="project-progress-fill" style="width: ${p.progress || 0}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
              <span>${p.progress || 0}% complete</span>
              <span>${p.deadline || 'No deadline'}</span>
            </div>
          </div>
        </div>
      `).join('')
      : '<p style="color: var(--text-muted);">No projects yet. Create one!</p>';
  },
  
  // Workflows
  async loadWorkflows() {
    const workflows = await this.apiGet('/workflows/');
    document.getElementById('workflowsList').innerHTML = workflows.length
      ? workflows.map(w => `
        <div class="workflow-card" onclick="Nova.viewWorkflow('${w.id}')">
          <div class="workflow-header">
            <div>
              <div class="workflow-category">${w.category || 'General'}</div>
              <h4 style="margin-top: 6px;">${w.name}</h4>
            </div>
            <span style="font-size: 12px; color: var(--text-muted);">${w.status}</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 14px;">${w.description?.substring(0, 100) || ''}...</p>
          <div class="workflow-stats">
            <span>▶ ${w.runCount || 0} runs</span>
            <span>🕐 ${w.lastRun ? new Date(w.lastRun).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>
      `).join('')
      : '<div style="text-align: center; padding: 40px; color: var(--text-muted);">' +
        '<p>No workflows defined yet.</p>' +
        '<p style="font-size: 14px; margin-top: 8px;">Create SOPs and processes here.</p>' +
        '</div>';
  },
  
  // Habits
  async loadHabits() {
    const habits = await this.apiGet('/habits/');
    document.getElementById('habitsList').innerHTML = habits.length
      ? habits.map(h => {
        const last7Days = this.getLast7Days();
        const daysHtml = last7Days.map(d => {
          const completed = h.history?.includes(d);
          return `<div class="habit-day ${completed ? 'completed' : ''}" title="${d}"></div>`;
        }).join('');
        
        return `
        <div class="habit-card">
          <div class="habit-header">
            <span class="habit-name">${h.name}</span>
            <span class="habit-streak">🔥 ${h.currentStreak || 0}</span>
          </div>
          <div class="habit-visual">${daysHtml}</div>
          <div class="habit-actions">
            <button class="btn-primary" onclick="Nova.logHabit('${h.id}')">Log Today</button>
            <button class="btn-secondary" onclick="Nova.viewHabitHistory('${h.id}')">History</button>
          </div>
        </div>
      `}).join('')
      : '<div style="text-align: center; padding: 40px; color: var(--text-muted);">' +
        '<p>No habits tracked yet.</p>' +
        '</div>';
  },
  
  async logHabit(habitId) {
    await this.apiPost(`/habits/${habitId}/log`, {});
    this.loadHabits();
    this.loadDashboard();
  },
  
  // Memory
  async loadMemory() {
    const memories = await this.apiGet('/memory/timeline?limit=20');
    this.renderMemory(memories);
    
    const tags = await this.apiGet('/memory/tags');
    document.getElementById('tagsList').innerHTML = tags.map(t => 
      `<span class="tag" style="cursor: pointer;" onclick="Nova.filterByTag('${t}')">${t}</span>`
    ).join('');
  },
  
  renderMemory(memories) {
    document.getElementById('memoryTimeline').innerHTML = memories.length
      ? memories.map(m => `
        <div class="memory-entry">
          <div class="memory-meta">
            <span class="memory-type">${m.type || 'note'}</span>
            <span>${new Date(m.timestamp).toLocaleDateString()} ${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div class="memory-content">${m.content || ''}</div>
          ${m.tags?.length ? `<div class="memory-tags">${m.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      `).join('')
      : '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No memories found</p>';
  },
  
  async searchMemory(query) {
    if (!query) {
      this.loadMemory();
      return;
    }
    const results = await this.apiGet(`/memory/search?q=${encodeURIComponent(query)}`);
    this.renderMemory(results);
  },
  
  // Modal helpers
  showModal(title, contentHtml, onSave) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = contentHtml;
    document.getElementById('itemModal').classList.add('active');
    
    const saveBtn = document.getElementById('modalSave');
    saveBtn.onclick = () => {
      onSave();
      this.closeModal();
    };
  },
  
  closeModal() {
    document.getElementById('itemModal').classList.remove('active');
  },
  
  showAddTaskModal() {
    this.showModal('Add Task', `
      <div class="form-group">
        <label>Task Title</label>
        <input type="text" id="taskTitle" placeholder="What needs to be done?">
      </div>
      <div class="form-group">
        <label>Project</label>
        <input type="text" id="taskProject" placeholder="Which project?">
      </div>
      <div class="form-group">
        <label>Priority</label>
        <select id="taskPriority" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 6px;">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    `, async () => {
      const year = new Date().getFullYear();
      const week = this.getWeekNumber(new Date());
      const data = await this.apiGet(`/tasks/${year}/${week}`);
      const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('taskTitle').value,
        project: document.getElementById('taskProject').value,
        priority: document.getElementById('taskPriority').value,
        completed: false
      };
      data.tasks = [...(data.tasks || []), newTask];
      await this.apiPost(`/tasks/${year}/${week}`, data);
      this.loadTasks();
      this.loadDashboard();
    });
  },
  
  showAddProjectModal() {
    this.showModal('New Project', `
      <div class="form-group">
        <label>Project Name</label>
        <input type="text" id="projectName" placeholder="Enter project name">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="projectDesc" rows="3" placeholder="What is this project about?"></textarea>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select id="projectStatus" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 6px;">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    `, async () => {
      await this.apiPost('/projects/', {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDesc').value,
        status: document.getElementById('projectStatus').value
      });
      this.loadProjects();
      this.loadDashboard();
    });
  },
  
  showAddHabitModal() {
    this.showModal('New Habit', `
      <div class="form-group">
        <label>Habit Name</label>
        <input type="text" id="habitName" placeholder="e.g., Morning Gym">
      </div>
      <div class="form-group">
        <label>Frequency</label>
        <select id="habitFreq" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 6px;">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
    `, async () => {
      await this.apiPost('/habits/', {
        name: document.getElementById('habitName').value,
        frequency: document.getElementById('habitFreq').value
      });
      this.loadHabits();
    });
  },
  
  showAddMemoryModal() {
    this.showModal('Quick Add Memory', `
      <div class="form-group">
        <label>Content</label>
        <textarea id="memoryContent" rows="4" placeholder="What do you want to remember?"></textarea>
      </div>
      <div class="form-group">
        <label>Type</label>
        <select id="memoryType" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 6px;">
          <option value="note">Note</option>
          <option value="decision">Decision</option>
          <option value="insight">Insight</option>
          <option value="project_update">Project Update</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tags (comma separated)</label>
        <input type="text" id="memoryTags" placeholder="e.g., important, nova, francis">
      </div>
    `, async () => {
      const tags = document.getElementById('memoryTags').value.split(',').map(t => t.trim()).filter(Boolean);
      await this.apiPost('/memory/', {
        content: document.getElementById('memoryContent').value,
        type: document.getElementById('memoryType').value,
        tags
      });
      this.loadMemory();
      this.loadDashboard();
    });
  },
  
  showAddWorkflowModal() {
    this.showModal('New Workflow', `
      <div class="form-group">
        <label>Workflow Name</label>
        <input type="text" id="wfName" placeholder="e.g., Lead Qualification">
      </div>
      <div class="form-group">
        <label>Category</label>
        <input type="text" id="wfCategory" placeholder="e.g., Sales, Operations">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="wfDesc" rows="3" placeholder="What is this workflow for?"></textarea>
      </div>
    `, async () => {
      await this.apiPost('/workflows/', {
        name: document.getElementById('wfName').value,
        category: document.getElementById('wfCategory').value,
        description: document.getElementById('wfDesc').value
      });
      this.loadWorkflows();
    });
  },
  
  // Network CRM
  async loadNetwork() {
    // Load metrics
    const metrics = await this.apiGet('/network/metrics');
    document.getElementById('totalContacts').textContent = metrics.totalContacts || 0;
    document.getElementById('strongRelations').textContent = metrics.strongRelationships || 0;
    document.getElementById('dealSources').textContent = metrics.dealSources || 0;
    document.getElementById('totalDealValue').textContent = metrics.totalDealValue || '$0';
    
    // Load touch reminders
    const reminders = await this.apiGet('/network/touch-reminders');
    document.getElementById('touchRemindersList').innerHTML = reminders.length
      ? reminders.slice(0, 3).map(r => {
          const days = Math.floor((new Date() - new Date(r.interactions?.lastContact || r.createdAt)) / (1000 * 60 * 60 * 24));
          return `
            <div class="touch-reminder-item ${days > 45 ? '' : 'warning'}">
              <div class="touch-reminder-info">
                <h4>${r.name}</h4>
                <p>${r.relationship?.type || 'Contact'} • ${r.company || 'No company'}</p>
              </div>
              <div class="touch-reminder-actions">
                <span class="days-since">${days} days</span>
                <button class="btn-sm" onclick="Nova.showLogInteractionModal('${r.id}')">Log</button>
              </div>
            </div>
          `;
        }).join('')
      : '<p style="color: var(--text-muted);">No touch reminders - all caught up!</p>';
    
    // Load top deal sources
    const topSources = await this.apiGet('/network/top-deal-sources');
    document.getElementById('topDealSourcesList').innerHTML = topSources.length
      ? topSources.map((s, i) => `
          <div class="deal-source-item">
            <div class="deal-source-rank">${i + 1}</div>
            <div class="deal-source-info">
              <h4>${s.contactName}</h4>
              <div class="deal-source-meta">${s.metrics?.totalDealsBrought || 0} deals • ${s.metrics?.conversionRate || 0}% convert</div>
            </div>
            <div class="deal-source-value">
              <div class="value">${s.metrics?.totalValue || '$0'}</div>
              <div class="convert">avg ${s.metrics?.averageDealSize || '$0'}</div>
            </div>
          </div>
        `).join('')
      : '<p style="color: var(--text-muted);">No deal sources yet</p>';
    
    // Load contacts
    this.loadContactsList();
  },
  
  networkFilter: 'all',
  
  async loadContactsList() {
    let contacts = await this.apiGet('/network/contacts');
    if (this.networkFilter !== 'all') {
      contacts = contacts.filter(c => c.relationship?.type === this.networkFilter);
    }
    
    document.getElementById('contactsGrid').innerHTML = contacts.length
      ? contacts.map(c => `
          <div class="contact-card" onclick="Nova.viewContact('${c.id}')">
            <div class="contact-header">
              <div class="contact-avatar">${c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
              <div class="contact-info">
                <h4>${c.name}</h4>
                <p>${c.title || 'No title'} • ${c.company || 'No company'}</p>
              </div>
            </div>
            <div class="contact-tags">
              <span class="contact-tag relationship">${c.relationship?.strength || 'unknown'}</span>
              <span class="contact-tag">${c.relationship?.type || 'contact'}</span>
              ${c.categories?.slice(0, 2).map(cat => `<span class="contact-tag">${cat}</span>`).join('') || ''}
            </div>
            <div class="contact-stats">
              <div class="contact-stat">
                <span>Deals: </span><strong>${c.dealFlow?.brought || 0}</strong>
              </div>
              <div class="contact-stat">
                <span>Value: </span><strong>${c.dealFlow?.value || '$0'}</strong>
              </div>
              <div class="contact-stat">
                <span>Last: </span><strong>${c.interactions?.lastContact ? new Date(c.interactions.lastContact).toLocaleDateString() : 'Never'}</strong>
              </div>
            </div>
          </div>
        `).join('')
      : '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No contacts found</p>';
  },
  
  async viewContact(id) {
    const contact = await this.apiGet(`/network/contacts/${id}`);
    const interactions = await this.apiGet(`/network/interactions?contactId=${id}`);
    
    this.showModal(contact.name, `
      <div class="contact-detail">
        <div class="contact-detail-header">
          <div class="contact-detail-avatar">${contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
          <div class="contact-detail-info">
            <h3>${contact.name}</h3>
            <p>${contact.title || 'No title'} at ${contact.company || 'No company'}</p>
            <p style="font-size: 13px; margin-top: 4px;">${contact.email || ''}</p>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Relationship</h4>
          <div class="detail-row">
            <span class="detail-label">Type</span>
            <span class="detail-value">${contact.relationship?.type || 'Unknown'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Strength</span>
            <span class="detail-value">${contact.relationship?.strength || 'Unknown'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Since</span>
            <span class="detail-value">${contact.relationship?.since ? new Date(contact.relationship.since).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Deal Flow (${contact.dealFlow?.brought || 0} deals, ${contact.dealFlow?.value || '$0'})</h4>
          <div class="deal-list">
            ${(contact.dealFlow?.deals || []).map(d => `
              <div class="deal-item">
                <span>${d.name}</span>
                <span style="color: var(--accent);">${d.value}</span>
              </div>
            `).join('') || '<p style="color: var(--text-muted); font-size: 13px;">No deals yet</p>'}
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Recent Interactions</h4>
          ${interactions.slice(0, 3).map(i => `
            <div class="detail-row">
              <span class="detail-label">${new Date(i.date).toLocaleDateString()}</span>
              <span class="detail-value">${i.context || i.method}</span>
            </div>
          `).join('') || '<p style="color: var(--text-muted); font-size: 13px;">No interactions logged</p>'}
        </div>
        
        ${contact.notes ? `
          <div class="detail-section">
            <h4>Notes</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${contact.notes}</p>
          </div>
        ` : ''}
      </div>
    `, () => {});
    
    // Change save button to close
    document.getElementById('modalSave').textContent = 'Close';
  },
  
  showAddContactModal() {
    this.showModal('Add Contact', `
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="contactName" placeholder="Full name">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="contactEmail" placeholder="email@example.com">
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" id="contactCompany" placeholder="Company name">
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="contactTitle" placeholder="Job title">
      </div>
      <div class="form-group">
        <label>Relationship Type</label>
        <select id="contactType" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 6px;">
          <option value="contact">Contact</option>
          <option value="mentor">Mentor</option>
          <option value="partner">Partner</option>
          <option value="deal_source">Deal Source</option>
          <option value="investor">Investor</option>
          <option value="colleague">Colleague</option>
        </select>
      </div>
      <div class="form-group">
        <label>Relationship Strength</label>
        <select id="contactStrength" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 6px;">
          <option value="weak">Weak</option>
          <option value="medium" selected>Medium</option>
          <option value="strong">Strong</option>
        </select>
      </div>
    `, async () => {
      await this.apiPost('/network/contacts', {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        company: document.getElementById('contactCompany').value,
        title: document.getElementById('contactTitle').value,
        relationship: {
          type: document.getElementById('contactType').value,
          strength: document.getElementById('contactStrength').value
        }
      });
      this.loadNetwork();
    });
  },
  
  showLogInteractionModal(contactId) {
    this.showModal('Log Interaction', `
      <div class="form-group">
        <label>Date</label>
        <input type="date" id="interactionDate" value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label>Method</label>
        <select id="interactionMethod" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; border-radius: 6px;">
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="video_call">Video Call</option>
          <option value="in_person">In Person</option>
          <option value="text">Text</option>
          <option value="slack">Slack</option>
        </select>
      </div>
      <div class="form-group">
        <label>Context</label>
        <input type="text" id="interactionContext" placeholder="e.g., Weekly strategy call">
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea id="interactionNotes" rows="3" placeholder="What did you discuss?"></textarea>
      </div>
    `, async () => {
      await this.apiPost('/network/interactions', {
        contactId,
        date: document.getElementById('interactionDate').value,
        method: document.getElementById('interactionMethod').value,
        context: document.getElementById('interactionContext').value,
        notes: document.getElementById('interactionNotes').value
      });
      this.loadNetwork();
    });
  },

  // ========== COUNSEL ==========

  counselFilter: 'all',
  currentSession: null,

  async loadCounsel() {
    const sessions = await this.apiGet('/counsel/sessions');
    this.displayCounselSessions(sessions);

    // Setup filter listeners
    document.querySelectorAll('.counsel-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.counsel-filters .filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.counselFilter = e.target.dataset.filter;
        this.filterCounselSessions(sessions);
      });
    });

    // Setup back button
    document.getElementById('backToSessions')?.addEventListener('click', () => {
      document.getElementById('counselSessionsList').style.display = 'block';
      document.getElementById('counselSessionDetail').style.display = 'none';
    });
  },

  displayCounselSessions(sessions) {
    const list = document.getElementById('counselSessionsList');
    if (!sessions || sessions.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No counsel sessions yet. Click "+ New Session" to start your first AI advisory session.</p>';
      return;
    }

    list.innerHTML = sessions.map(session => {
      const statusColors = {
        pending: '#fbbf24',
        'in-progress': '#3b82f6',
        completed: '#10b981'
      };
      const statusColor = statusColors[session.status] || '#6b7280';

      return `
        <div class="counsel-session-card" onclick="Nova.viewCounselSession('${session.id}')">
          <div class="session-header">
            <h3>${session.topic}</h3>
            <span class="session-status" style="background: ${statusColor}20; color: ${statusColor};">
              ${session.status}
            </span>
          </div>
          <div class="session-category">${session.category || 'General'}</div>
          <div class="session-meta">
            <span>Created: ${new Date(session.createdAt).toLocaleDateString()}</span>
            ${session.agentResponses ? `<span>${session.agentResponses.length} agent responses</span>` : ''}
            ${session.synthesis ? '<span>✓ Synthesis complete</span>' : ''}
          </div>
          ${session.decision ? '<div class="session-decision">✓ Decision recorded</div>' : ''}
        </div>
      `;
    }).join('');
  },

  filterCounselSessions(sessions) {
    const filtered = this.counselFilter === 'all'
      ? sessions
      : sessions.filter(s => s.status === this.counselFilter);
    this.displayCounselSessions(filtered);
  },

  async viewCounselSession(sessionId) {
    const session = await this.apiGet(`/counsel/sessions/${sessionId}`);
    this.currentSession = session;

    document.getElementById('counselSessionsList').style.display = 'none';
    document.getElementById('counselSessionDetail').style.display = 'block';

    const content = document.getElementById('sessionDetailContent');
    content.innerHTML = `
      <div class="session-detail-header">
        <h2>${session.topic}</h2>
        <span class="session-status">${session.status}</span>
      </div>

      <div class="session-detail-section">
        <h3>Context</h3>
        <p>${session.context || 'No context provided'}</p>
      </div>

      ${session.agentResponses && session.agentResponses.length > 0 ? `
        <div class="session-detail-section">
          <h3>Agent Responses</h3>
          ${session.agentResponses.map(response => `
            <div class="agent-response-card">
              <div class="agent-header">
                <span class="agent-icon">${this.getAgentIcon(response.agentId)}</span>
                <span class="agent-name">${response.agentName}</span>
                <span class="confidence-badge">${response.confidence}% confidence</span>
              </div>
              <div class="agent-response-content">${response.response}</div>
              ${response.keyPoints && response.keyPoints.length > 0 ? `
                <div class="key-points">
                  <strong>Key Points:</strong>
                  <ul>
                    ${response.keyPoints.map(point => `<li>${point}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${session.synthesis ? `
        <div class="session-detail-section synthesis-section">
          <h3>🧠 Synthesis & Recommendation</h3>
          <div class="synthesis-card">
            <h4>${session.synthesis.recommendation}</h4>
            <div class="confidence-score">Confidence: ${session.synthesis.confidence}%</div>
            <div class="synthesis-reasoning">${session.synthesis.reasoning}</div>
            ${session.synthesis.keyTakeaways && session.synthesis.keyTakeaways.length > 0 ? `
              <div class="key-takeaways">
                <strong>Key Takeaways:</strong>
                <ul>
                  ${session.synthesis.keyTakeaways.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            ${session.synthesis.nextSteps && session.synthesis.nextSteps.length > 0 ? `
              <div class="next-steps">
                <strong>Next Steps:</strong>
                <ol>
                  ${session.synthesis.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      ${session.decision ? `
        <div class="session-detail-section decision-section">
          <h3>✓ Your Decision</h3>
          <div class="decision-card">
            <h4>${session.decision.chosen}</h4>
            <p>${session.decision.reasoning}</p>
            ${session.decision.implementationPlan ? `
              <div class="implementation-plan">
                <strong>Implementation Plan:</strong>
                <p>${session.decision.implementationPlan}</p>
              </div>
            ` : ''}
          </div>
        </div>
      ` : session.synthesis ? `
        <div class="session-detail-section">
          <button class="btn-primary" onclick="Nova.showRecordDecisionModal('${session.id}')">
            Record Your Decision
          </button>
        </div>
      ` : ''}
    `;
  },

  getAgentIcon(agentId) {
    const icons = {
      'business-strategist': '🎯',
      'data-analyst': '📊',
      'risk-assessor': '⚠️',
      'financial-advisor': '💰',
      'synthesizer': '🧠'
    };
    return icons[agentId] || '🤖';
  },

  showAddCounselModal() {
    const modal = document.getElementById('itemModal');
    const content = document.querySelector('.modal-content');
    content.innerHTML = `
      <span class="modal-close">&times;</span>
      <h2>New Counsel Session</h2>
      <form id="counselForm">
        <div class="form-group">
          <label>Topic / Decision to Make</label>
          <input type="text" id="counselTopic" placeholder="What decision do you need help with?" required>
        </div>
        <div class="form-group">
          <label>Context</label>
          <textarea id="counselContext" rows="5" placeholder="Provide background, constraints, options, and any relevant details..." required></textarea>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="counselCategory">
            <option>Business Strategy</option>
            <option>Product Development</option>
            <option>Marketing</option>
            <option>Sales</option>
            <option>Finance</option>
            <option>Operations</option>
            <option>Hiring</option>
            <option>Personal</option>
            <option>Other</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" id="modalCancel">Cancel</button>
          <button type="submit" class="btn-primary">Create Session</button>
        </div>
      </form>
    `;

    document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modalCancel').addEventListener('click', () => this.closeModal());

    document.getElementById('counselForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const session = await this.apiPost('/counsel/sessions', {
        topic: document.getElementById('counselTopic').value,
        context: document.getElementById('counselContext').value,
        category: document.getElementById('counselCategory').value
      });
      this.closeModal();
      this.showNotification('Counsel session created! Generating agent responses...');
      this.loadCounsel();

      // Auto-generate agent responses (simulated for now)
      setTimeout(() => this.generateMockAgentResponses(session.id), 1000);
    });

    modal.style.display = 'flex';
  },

  async generateMockAgentResponses(sessionId) {
    // This would call actual LLM APIs in production
    // For now, we'll just notify that responses would be generated
    this.showNotification('In production: AI agents would analyze your question now');
  },

  showRecordDecisionModal(sessionId) {
    const modal = document.getElementById('itemModal');
    const content = document.querySelector('.modal-content');
    content.innerHTML = `
      <span class="modal-close">&times;</span>
      <h2>Record Your Decision</h2>
      <form id="decisionForm">
        <div class="form-group">
          <label>What did you decide?</label>
          <input type="text" id="decisionChosen" placeholder="Your chosen path..." required>
        </div>
        <div class="form-group">
          <label>Why?</label>
          <textarea id="decisionReasoning" rows="3" placeholder="What convinced you?" required></textarea>
        </div>
        <div class="form-group">
          <label>Implementation Plan</label>
          <textarea id="decisionPlan" rows="4" placeholder="How will you execute this decision?"></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" id="modalCancel">Cancel</button>
          <button type="submit" class="btn-primary">Save Decision</button>
        </div>
      </form>
    `;

    document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modalCancel').addEventListener('click', () => this.closeModal());

    document.getElementById('decisionForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.apiPost(`/counsel/sessions/${sessionId}/decision`, {
        chosen: document.getElementById('decisionChosen').value,
        reasoning: document.getElementById('decisionReasoning').value,
        implementationPlan: document.getElementById('decisionPlan').value
      });
      this.closeModal();
      this.showNotification('Decision recorded!');
      this.viewCounselSession(sessionId);
    });

    modal.style.display = 'flex';
  },

  // ========== LEARNING SYSTEM ==========

  currentLearningSubtab: 'books',

  async loadLearning() {
    await this.loadBooks();
    await this.loadCourses();
    await this.loadSkills();
    await this.loadInsights();
    await this.loadMistakes();
    await this.loadWeeklyGoals();
  },

  async loadBooks() {
    const books = await this.apiGet('/learning/books');
    this.displayBooks(books);
  },

  displayBooks(books) {
    const list = document.getElementById('booksList');
    if (!books || books.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No books yet. Click "+ Add Book" to start tracking your reading.</p>';
      return;
    }

    list.innerHTML = books.map(book => `
      <div class="learning-card">
        <div class="learning-card-header">
          <h3>${book.title}</h3>
          <span class="status-badge status-${book.status}">${book.status.replace('_', ' ')}</span>
        </div>
        ${book.author ? `<div class="learning-author">by ${book.author}</div>` : ''}
        ${book.progress > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width: ${book.progress}%"></div></div>` : ''}
        ${book.rating ? `<div class="learning-rating">${'⭐'.repeat(book.rating)}</div>` : ''}
        ${book.summary ? `<p class="learning-summary">${book.summary.substring(0, 150)}...</p>` : ''}
        ${book.keyInsights && book.keyInsights.length > 0 ? `<div class="learning-insights">${book.keyInsights.length} key insights</div>` : ''}
      </div>
    `).join('');
  },

  async loadCourses() {
    const courses = await this.apiGet('/learning/courses');
    this.displayCourses(courses);
  },

  displayCourses(courses) {
    const list = document.getElementById('coursesList');
    if (!courses || courses.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No courses yet. Click "+ Add Course" to track your learning.</p>';
      return;
    }

    list.innerHTML = courses.map(course => `
      <div class="learning-card">
        <div class="learning-card-header">
          <h3>${course.title}</h3>
          <span class="status-badge status-${course.status}">${course.status.replace('_', ' ')}</span>
        </div>
        ${course.instructor ? `<div class="learning-author">by ${course.instructor}</div>` : ''}
        ${course.platform ? `<div class="learning-platform">${course.platform}</div>` : ''}
        ${course.progress > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width: ${course.progress}%"></div></div>` : ''}
        ${course.totalHours ? `<div class="learning-meta">${course.hoursCompleted || 0}/${course.totalHours} hours</div>` : ''}
        ${course.skillsGained && course.skillsGained.length > 0 ? `<div class="learning-skills">${course.skillsGained.slice(0, 3).join(', ')}</div>` : ''}
      </div>
    `).join('');
  },

  async loadSkills() {
    const skills = await this.apiGet('/learning/skills');
    this.displaySkills(skills);
  },

  displaySkills(skills) {
    const list = document.getElementById('skillsList');
    if (!skills || skills.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No skills yet. Click "+ Add Skill" to track your development.</p>';
      return;
    }

    list.innerHTML = skills.map(skill => `
      <div class="learning-card">
        <div class="learning-card-header">
          <h3>${skill.name}</h3>
          <span class="skill-level">${skill.level} → ${skill.targetLevel || 'expert'}</span>
        </div>
        ${skill.category ? `<div class="learning-category">${skill.category}</div>` : ''}
        <div class="skill-hours">${skill.hoursInvested || 0} hours invested</div>
        ${skill.evidence ? `<p class="learning-summary">${skill.evidence.substring(0, 120)}...</p>` : ''}
        ${skill.practiceLog && skill.practiceLog.length > 0 ? `<div class="learning-meta">${skill.practiceLog.length} practice sessions</div>` : ''}
      </div>
    `).join('');
  },

  async loadInsights() {
    const insights = await this.apiGet('/learning/insights');
    this.displayInsights(insights);
  },

  displayInsights(insights) {
    const list = document.getElementById('insightsList');
    if (!insights || insights.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No insights yet. Click "+ Add Insight" to capture mentor wisdom.</p>';
      return;
    }

    list.innerHTML = insights.map(insight => `
      <div class="learning-card insight-card">
        <div class="learning-card-header">
          <h3>${insight.mentorName}</h3>
          <span class="insight-date">${new Date(insight.date).toLocaleDateString()}</span>
        </div>
        <div class="insight-quote">"${insight.quote}"</div>
        <p class="learning-summary">${insight.insight.substring(0, 150)}...</p>
        ${insight.applied ? '<div class="applied-badge">✅ Applied</div>' : '<div class="pending-badge">⏳ Not Applied Yet</div>'}
      </div>
    `).join('');
  },

  async loadMistakes() {
    const mistakes = await this.apiGet('/learning/mistakes');
    this.displayMistakes(mistakes);
  },

  displayMistakes(mistakes) {
    const list = document.getElementById('mistakesList');
    if (!mistakes || mistakes.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No mistakes logged yet. Click "+ Add Mistake" to learn from failures.</p>';
      return;
    }

    list.innerHTML = mistakes.map(mistake => `
      <div class="learning-card mistake-card">
        <div class="learning-card-header">
          <h3>${mistake.title}</h3>
          <span class="mistake-date">${new Date(mistake.date).toLocaleDateString()}</span>
        </div>
        ${mistake.costFinancial ? `<div class="mistake-cost">💸 $${mistake.costFinancial.toLocaleString()}</div>` : ''}
        <p class="learning-summary">${mistake.lessonLearned.substring(0, 150)}...</p>
        ${mistake.systemImplemented ? '<div class="system-badge">🛡️ System Created</div>' : '<div class="no-system-badge">⚠️ No System Yet</div>'}
      </div>
    `).join('');
  },

  async loadWeeklyGoals() {
    const goals = await this.apiGet('/learning/weekly-goals');
    this.displayWeeklyGoals(goals);
  },

  displayWeeklyGoals(goals) {
    const list = document.getElementById('weeklyGoalsList');
    if (!goals || goals.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No weekly goals yet. Click "+ Add Weekly Goal" to track your learning progress.</p>';
      return;
    }

    list.innerHTML = goals.map(goal => `
      <div class="learning-card weekly-card">
        <div class="learning-card-header">
          <h3>${goal.goal}</h3>
          <span class="status-badge status-${goal.status}">${goal.status.replace('_', ' ')}</span>
        </div>
        <div class="weekly-dates">${new Date(goal.weekStart).toLocaleDateString()} - ${new Date(goal.weekEnd).toLocaleDateString()}</div>
        ${goal.category ? `<div class="learning-category">${goal.category}</div>` : ''}
        ${goal.timeInvested ? `<div class="learning-meta">${goal.timeInvested} hours invested</div>` : ''}
        ${goal.whatLearned ? `<p class="learning-summary">${goal.whatLearned.substring(0, 150)}...</p>` : ''}
      </div>
    `).join('');
  },

  // Modal functions (simplified)
  showAddBookModal() {
    this.showNotification('Add Book modal - coming soon!');
  },

  showAddCourseModal() {
    this.showNotification('Add Course modal - coming soon!');
  },

  showAddSkillModal() {
    this.showNotification('Add Skill modal - coming soon!');
  },

  showAddInsightModal() {
    this.showNotification('Add Insight modal - coming soon!');
  },

  showAddMistakeModal() {
    this.showNotification('Add Mistake modal - coming soon!');
  },

  showAddWeeklyGoalModal() {
    this.showNotification('Add Weekly Goal modal - coming soon!');
  },

  // Utilities
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  },
  
  getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  },
  
  showNotification(message) {
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: var(--success); color: white;
      padding: 12px 20px; border-radius: 8px;
      z-index: 2000; animation: slideIn 0.3s ease;
    `;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  },
  
  viewProject(id) { console.log('View project:', id); },
  viewWorkflow(id) { console.log('View workflow:', id); },
  viewHabitHistory(id) { console.log('View habit:', id); },
  filterByTag(tag) { console.log('Filter by tag:', tag); }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => Nova.init());
