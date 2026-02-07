// NOVA Dashboard - Main Application
const Nova = {
  currentTab: 'dashboard',
  currentGoalView: 'daily',
  taskFilter: 'all',
  showPushedColumn: false,
  showArchivedColumn: false,
  showArchivedWorkflows: false,
  currentWorkflowId: null,
  projectCategoryFilter: 'all',
  currentProjectId: null,

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
    document.getElementById('addTaskBtn').addEventListener('click', () => this.showAddTaskModal());

    // New Goals system event listeners
    document.querySelectorAll('.add-goal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const timeframe = e.target.dataset.timeframe;
        this.openCreateGoal(timeframe);
      });
    });

    document.querySelectorAll('.goal-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.goal-filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentGoalFilter = e.target.dataset.filter;
        this.loadGoals();
      });
    });

    const showArchivedBtn = document.getElementById('showArchivedBtn');
    if (showArchivedBtn) {
      showArchivedBtn.addEventListener('click', () => {
        this.showArchived = !this.showArchived;
        showArchivedBtn.textContent = this.showArchived ? '📦 Hide Archived' : '📦 Show Archived';
        this.loadGoals();
      });
    }

    // Goal detail modal
    document.querySelector('.goal-detail-close')?.addEventListener('click', () => this.closeGoalDetail());
    document.querySelector('.goal-back-btn')?.addEventListener('click', () => this.closeGoalDetail());

    // Create goal modal
    document.querySelector('.create-goal-close')?.addEventListener('click', () => this.closeCreateGoal());
    document.getElementById('createGoalNextBtn')?.addEventListener('click', () => this.nextCreateGoalStep());
    document.getElementById('createGoalBackBtn')?.addEventListener('click', () => this.backCreateGoalStep());
    document.getElementById('createGoalSubmitBtn')?.addEventListener('click', () => this.submitCreateGoal());

    // Parent goal radio toggle
    document.querySelectorAll('input[name="goalParent"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const parentSelect = document.getElementById('newGoalParent');
        if (parentSelect) {
          parentSelect.style.display = e.target.value === 'supports' ? 'block' : 'none';
        }
      });
    });

    // Tasks kanban event listeners
    document.querySelectorAll('.add-task-day-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const day = e.target.dataset.day;
        this.openTaskModal(day);
      });
    });

    document.getElementById('priorityFilter')?.addEventListener('change', (e) => {
      this.currentPriorityFilter = e.target.value;
      this.loadTasks();
    });

    document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
      this.currentCategoryFilter = e.target.value;
      this.loadTasks();
    });

    // Task modal
    document.querySelector('.task-modal-close')?.addEventListener('click', () => this.closeTaskModal());
    document.getElementById('taskModalCancel')?.addEventListener('click', () => this.closeTaskModal());
    document.getElementById('taskModalSave')?.addEventListener('click', () => this.saveTask());

    // Task project dropdown - show existing project tasks when selected
    document.getElementById('taskProjectInput')?.addEventListener('change', (e) => {
      const projectId = e.target.value;
      if (projectId) {
        this.showProjectTasks(projectId);
      } else {
        document.getElementById('projectTasksGroup').style.display = 'none';
      }
    });

    // Weekly action buttons
    document.getElementById('viewPushedTasksBtn')?.addEventListener('click', () => this.viewPushedTasks());
    document.getElementById('viewArchivedTasksBtn')?.addEventListener('click', () => this.viewArchivedTasks());
    document.getElementById('clearWeekBtn')?.addEventListener('click', () => this.clearWeek());

    document.getElementById('newProjectBtn').addEventListener('click', () => this.openCreateProject());

    // Projects kanban
    document.getElementById('projectCategoryFilter')?.addEventListener('change', (e) => {
      this.projectCategoryFilter = e.target.value;
      this.loadProjects();
    });

    document.querySelector('.project-detail-close')?.addEventListener('click', () => this.closeProjectDetail());
    document.querySelector('.project-edit-close')?.addEventListener('click', () => this.closeProjectEdit());
    document.getElementById('projectEditCancel')?.addEventListener('click', () => this.closeProjectEdit());
    document.getElementById('projectEditSave')?.addEventListener('click', () => this.saveProject());

    document.querySelector('.backlog-task-close')?.addEventListener('click', () => this.closeBacklogTaskModal());
    document.getElementById('backlogTaskCancel')?.addEventListener('click', () => this.closeBacklogTaskModal());
    document.getElementById('backlogTaskSave')?.addEventListener('click', () => this.saveBacklogTask());

    document.querySelectorAll('.add-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const status = e.target.dataset.status;
        this.openCreateProject(status);
      });
    });
    document.getElementById('newHabitBtn').addEventListener('click', () => this.showAddHabitModal());
    document.getElementById('quickAddMemory').addEventListener('click', () => this.showAddMemoryModal());
    document.getElementById('newWorkflowBtn').addEventListener('click', () => this.showAddWorkflowModal());
    document.getElementById('toggleArchivedWorkflowsBtn')?.addEventListener('click', () => this.toggleArchivedWorkflows());
    document.getElementById('rolloverBtn').addEventListener('click', () => this.rolloverTasks());
    document.getElementById('newContactBtn').addEventListener('click', () => this.showAddContactModal());
    document.getElementById('newCounselBtn').addEventListener('click', () => this.showAddCounselModal());
    document.getElementById('addBookBtn').addEventListener('click', () => this.showAddBookModal());
    document.getElementById('addCourseBtn').addEventListener('click', () => this.showAddCourseModal());
    document.getElementById('addSkillBtn').addEventListener('click', () => this.showAddSkillModal());
    document.getElementById('addInsightBtn').addEventListener('click', () => this.showAddInsightModal());
    document.getElementById('addMistakeBtn').addEventListener('click', () => this.showAddMistakeModal());
    document.getElementById('addWeeklyGoalBtn').addEventListener('click', () => this.showAddWeeklyGoalModal());

    // Quick action buttons
    document.getElementById('quickTaskBtn').addEventListener('click', () => {
      this.switchTab('tasks');
      this.showAddTaskModal();
    });
    document.getElementById('quickHabitBtn').addEventListener('click', () => {
      this.switchTab('habits');
      this.showAddHabitModal();
    });
    document.getElementById('quickCounselBtn').addEventListener('click', () => {
      this.switchTab('counsel');
      this.showAddCounselModal();
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

  async apiPut(endpoint, data) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async apiDelete(endpoint) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'DELETE'
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

    // Load dashboard stats
    const stats = await this.apiGet('/dashboard/stats');
    document.getElementById('tasksCompleted').textContent = stats.tasksDone || 0;
    document.getElementById('tasksTotal').textContent = stats.tasksTotal || 0;
    document.getElementById('habitStreak').textContent = stats.streakDays || 0;
    const progress = stats.tasksTotal ? (stats.tasksDone / stats.tasksTotal * 100) : 0;
    document.getElementById('weekProgress').style.width = `${progress}%`;

    // Load urgent items
    const urgent = await this.apiGet('/dashboard/urgent');
    document.getElementById('urgentCount').textContent = urgent.count || 0;
    document.getElementById('urgentList').innerHTML = urgent.items?.length
      ? urgent.items.map(item => `
        <div class="urgent-item" onclick="Nova.switchTab('${item.link.substring(1)}')">
          <span class="urgent-type ${item.type}">${item.type === 'task' ? '📋' : item.type === 'network' ? '👤' : '⚖️'}</span>
          <span class="urgent-title">${item.title}</span>
        </div>
      `).join('')
      : '<p style="color: var(--text-muted); font-size: 13px;">All caught up!</p>';

    // Load skills progress
    const skillsData = await this.apiGet('/dashboard/skills-progress');
    document.getElementById('skillsList').innerHTML = skillsData.skills?.length
      ? skillsData.skills.map(skill => `
        <div class="skill-item">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-hours">${skill.hoursThisWeek}h this week</span>
        </div>
      `).join('')
      : '<p style="color: var(--text-muted); font-size: 13px;">No skills logged this week</p>';

    // Load suggestions
    const suggestionsData = await this.apiGet('/dashboard/suggestions');
    document.getElementById('suggestionsList').innerHTML = suggestionsData.suggestions?.length
      ? suggestionsData.suggestions.slice(0, 3).map(sugg => `
        <div class="suggestion-item">
          <div class="suggestion-header">
            <span class="suggestion-category ${sugg.priority}">${sugg.category}</span>
          </div>
          <p class="suggestion-text">${sugg.text}</p>
          <div class="suggestion-actions">
            <button class="suggestion-btn" onclick="Nova.dismissSuggestion('${sugg.id}')">Dismiss</button>
            <button class="suggestion-btn primary" onclick="Nova.markSuggestionDone('${sugg.id}')">Done</button>
          </div>
        </div>
      `).join('')
      : '<p style="color: var(--text-muted); font-size: 13px;">No suggestions</p>';

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

    // Load sync status
    this.updateSyncStatus();
  },

  async updateSyncStatus() {
    try {
      const syncData = await this.apiGet('/dashboard/sync-status');
      const syncEl = document.getElementById('syncStatus');

      if (syncData.status === 'synced') {
        syncEl.className = 'sync-status synced';
        syncEl.innerHTML = `<span class="sync-icon">✓</span><span class="sync-text">${syncData.timeAgo}</span>`;
      } else if (syncData.status === 'pending') {
        syncEl.className = 'sync-status pending';
        syncEl.innerHTML = `<span class="sync-icon">⟳</span><span class="sync-text">Sync pending</span>`;
      } else {
        syncEl.className = 'sync-status';
        syncEl.innerHTML = `<span class="sync-icon">⟳</span><span class="sync-text">N/A</span>`;
      }
    } catch (err) {
      console.error('Failed to load sync status:', err);
    }
  },

  dismissSuggestion(id) {
    // TODO: Implement dismiss logic
    console.log('Dismiss suggestion:', id);
  },

  markSuggestionDone(id) {
    // TODO: Implement done logic
    console.log('Mark suggestion done:', id);
  },
  
  // Goals
  // New Goals System
  currentGoalFilter: 'all',
  showArchived: false,
  createGoalStep: 1,
  currentGoalData: {},

  async loadGoals() {
    try {
      const params = new URLSearchParams();
      if (this.currentGoalFilter !== 'all') {
        params.append('tag', this.currentGoalFilter);
      }
      if (!this.showArchived) {
        params.append('archived', 'false');
      }

      const data = await this.apiGet(`/goals?${params.toString()}`);
      const goals = data.goals || [];

      // Organize goals by timeframe
      const shortTerm = goals.filter(g => g.timeframe === 'short');
      const midTerm = goals.filter(g => g.timeframe === 'mid');
      const longTerm = goals.filter(g => g.timeframe === 'long');

      this.renderGoalsList('goalsShortTerm', shortTerm);
      this.renderGoalsList('goalsMidTerm', midTerm);
      this.renderGoalsList('goalsLongTerm', longTerm);

      this.setupGoalsDragAndDrop();
    } catch (err) {
      console.error('Failed to load goals:', err);
    }
  },

  renderGoalsList(containerId, goals) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (goals.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px;">No goals yet</p>';
      return;
    }

    container.innerHTML = goals.map(goal => this.createGoalCard(goal)).join('');
  },

  createGoalCard(goal) {
    const dueDateText = goal.dueDate ? `Due: ${new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No due date';
    const priorityColor = this.getPriorityColor(goal.priority);

    return `
      <div class="goal-card" data-id="${goal.id}" draggable="true" onclick="Nova.openGoalDetail('${goal.id}')" style="border-left: 4px solid ${priorityColor}">
        <div class="goal-title">${goal.title}</div>
        <div class="goal-progress">
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
          </div>
          <div class="goal-progress-text">${goal.progress}% complete</div>
        </div>
        <div class="goal-meta">
          <span class="goal-due">${dueDateText}</span>
        </div>
        ${goal.tags.length > 0 ? `
          <div class="goal-tags">
            ${goal.tags.map(tag => `<span class="goal-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
        <div class="goal-actions" onclick="event.stopPropagation()">
          <button class="goal-action-btn" onclick="Nova.quickCompleteGoal('${goal.id}')">✓</button>
          <button class="goal-action-btn" onclick="Nova.openEditGoal('${goal.id}')">✎</button>
          <button class="goal-action-btn delete" onclick="Nova.deleteGoal('${goal.id}')">🗑️</button>
        </div>
      </div>
    `;
  },

  async openGoalDetail(goalId) {
    try {
      const data = await this.apiGet(`/goals/${goalId}`);
      const { goal, parentGoal, childGoals } = data;

      const modal = document.getElementById('goalDetailModal');
      const body = document.getElementById('goalDetailBody');

      body.innerHTML = `
        <div class="goal-detail-section">
          <div class="priority-badge ${goal.priority}">${goal.priority.toUpperCase()} PRIORITY</div>
          <h1 class="goal-detail-title">${goal.title}</h1>
        </div>

        <div class="goal-detail-info">
          <div class="info-item">
            <div class="info-label">Progress</div>
            <div class="info-value">${goal.progress}%</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">${goal.status.replace('-', ' ')}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Timeframe</div>
            <div class="info-value">${goal.timeframe === 'short' ? '1-90 days' : goal.timeframe === 'mid' ? '6-12 months' : '2-5 years'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Due Date</div>
            <div class="info-value">${goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'Not set'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Category</div>
            <div class="info-value">${goal.tags.join(', ') || 'None'}</div>
          </div>
        </div>

        ${goal.description ? `
          <div class="goal-detail-section">
            <h3>Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${goal.description}</p>
          </div>
        ` : ''}

        ${parentGoal || childGoals.length > 0 ? `
          <div class="goal-detail-section">
            <h3>Hierarchy</h3>
            ${parentGoal ? `
              <div style="margin-bottom: 20px;">
                <div class="info-label" style="margin-bottom: 8px;">SUPPORTS (Parent Goal):</div>
                <div class="goal-hierarchy-item" onclick="Nova.openGoalDetail('${parentGoal.id}')">
                  <div class="hierarchy-title">→ ${parentGoal.title}</div>
                  <div class="hierarchy-progress">
                    <div class="hierarchy-progress-bar">
                      <div class="hierarchy-progress-fill" style="width: ${parentGoal.progress}%"></div>
                    </div>
                    <span class="hierarchy-progress-text">${parentGoal.progress}%</span>
                  </div>
                </div>
              </div>
            ` : ''}
            ${childGoals.length > 0 ? `
              <div>
                <div class="info-label" style="margin-bottom: 8px;">COMPRISED OF (Child Goals):</div>
                ${childGoals.map(child => `
                  <div class="goal-hierarchy-item" onclick="Nova.openGoalDetail('${child.id}')">
                    <div class="hierarchy-title">• ${child.title}</div>
                    <div class="hierarchy-progress">
                      <div class="hierarchy-progress-bar">
                        <div class="hierarchy-progress-fill" style="width: ${child.progress}%"></div>
                      </div>
                      <span class="hierarchy-progress-text">${child.progress}%</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="goal-detail-actions">
          <button class="btn-secondary" onclick="Nova.closeGoalDetail()">Close</button>
          <button class="btn-secondary" onclick="Nova.openEditGoal('${goal.id}')">Edit</button>
          <button class="btn-primary" onclick="Nova.completeGoal('${goal.id}')">Mark Complete</button>
        </div>
      `;

      modal.classList.add('active');
    } catch (err) {
      console.error('Failed to load goal detail:', err);
    }
  },

  closeGoalDetail() {
    document.getElementById('goalDetailModal').classList.remove('active');
  },

  async quickCompleteGoal(goalId) {
    try {
      await this.apiPut(`/goals/${goalId}/complete`, { archive: true });
      this.loadGoals();
      this.showNotification('Goal completed!');
    } catch (err) {
      console.error('Failed to complete goal:', err);
    }
  },

  async completeGoal(goalId) {
    try {
      await this.apiPut(`/goals/${goalId}/complete`, { archive: false });
      this.closeGoalDetail();
      this.loadGoals();
      this.showNotification('Goal completed!');
    } catch (err) {
      console.error('Failed to complete goal:', err);
    }
  },

  async deleteGoal(goalId) {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      await this.apiDelete(`/goals/${goalId}`);
      this.loadGoals();
      this.showNotification('Goal deleted');
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  },

  openCreateGoal(timeframe = null) {
    this.createGoalStep = 1;
    this.currentGoalData = { timeframe };

    // Pre-select timeframe if provided
    if (timeframe) {
      setTimeout(() => {
        document.querySelector(`input[name="goalTimeframe"][value="${timeframe}"]`).checked = true;
      }, 100);
    }

    document.getElementById('createGoalModal').classList.add('active');
    this.updateCreateGoalStep();
  },

  closeCreateGoal() {
    document.getElementById('createGoalModal').classList.remove('active');
    this.createGoalStep = 1;
    this.currentGoalData = {};
  },

  nextCreateGoalStep() {
    // Validate current step
    if (this.createGoalStep === 1) {
      const title = document.getElementById('newGoalTitle').value.trim();
      if (!title) {
        alert('Please enter a goal title');
        return;
      }
      this.currentGoalData.title = title;
    } else if (this.createGoalStep === 2) {
      const timeframe = document.querySelector('input[name="goalTimeframe"]:checked')?.value;
      if (!timeframe) {
        alert('Please select a timeframe');
        return;
      }
      this.currentGoalData.timeframe = timeframe;
    } else if (this.createGoalStep === 3) {
      const priority = document.querySelector('input[name="goalPriority"]:checked')?.value;
      if (!priority) {
        alert('Please select a priority');
        return;
      }
      this.currentGoalData.priority = priority;
    } else if (this.createGoalStep === 4) {
      this.currentGoalData.dueDate = document.getElementById('newGoalDueDate').value;
    } else if (this.createGoalStep === 5) {
      const parentType = document.querySelector('input[name="goalParent"]:checked')?.value;
      if (parentType === 'supports') {
        this.currentGoalData.parentGoalId = document.getElementById('newGoalParent').value || null;
      } else {
        this.currentGoalData.parentGoalId = null;
      }
    } else if (this.createGoalStep === 6) {
      const tags = [];
      document.querySelectorAll('input[name="goalTags"]:checked').forEach(cb => {
        tags.push(cb.value);
      });
      const customTag = document.getElementById('newGoalCustomTag').value.trim();
      if (customTag) tags.push(customTag);
      this.currentGoalData.tags = tags;
    } else if (this.createGoalStep === 7) {
      this.currentGoalData.description = document.getElementById('newGoalDescription').value;
    }

    if (this.createGoalStep < 8) {
      this.createGoalStep++;
      this.updateCreateGoalStep();
    }
  },

  backCreateGoalStep() {
    if (this.createGoalStep > 1) {
      this.createGoalStep--;
      this.updateCreateGoalStep();
    }
  },

  updateCreateGoalStep() {
    // Update step indicators
    document.querySelectorAll('.step-indicator .step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index + 1 < this.createGoalStep) {
        step.classList.add('completed');
      } else if (index + 1 === this.createGoalStep) {
        step.classList.add('active');
      }
    });

    // Show/hide steps
    document.querySelectorAll('.goal-step').forEach((step, index) => {
      step.classList.toggle('active', index + 1 === this.createGoalStep);
    });

    // Update buttons
    document.getElementById('createGoalBackBtn').style.display = this.createGoalStep > 1 ? 'block' : 'none';
    document.getElementById('createGoalNextBtn').style.display = this.createGoalStep < 8 ? 'block' : 'none';
    document.getElementById('createGoalSubmitBtn').style.display = this.createGoalStep === 8 ? 'block' : 'none';
  },

  async submitCreateGoal() {
    // Get linked habits
    const linkedHabits = [];
    document.querySelectorAll('#habitsList input:checked').forEach(cb => {
      linkedHabits.push(cb.value);
    });
    this.currentGoalData.linkedHabits = linkedHabits;

    try {
      await this.apiPost('/goals', this.currentGoalData);
      this.closeCreateGoal();
      this.loadGoals();
      this.showNotification('Goal created!');
    } catch (err) {
      console.error('Failed to create goal:', err);
      alert('Failed to create goal');
    }
  },

  setupGoalsDragAndDrop() {
    const cards = document.querySelectorAll('.goal-card');
    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });

    const lists = document.querySelectorAll('.goals-list');
    lists.forEach(list => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const afterElement = this.getDragAfterElement(list, e.clientY);
        if (afterElement) {
          list.insertBefore(dragging, afterElement);
        } else {
          list.appendChild(dragging);
        }
      });
    });
  },

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.goal-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },
  
  // Tasks - New Kanban System
  currentPriorityFilter: 'all',
  currentCategoryFilter: 'all',
  categories: [],
  projectsLoaded: false,
  goalsLoaded: false,
  currentTaskYear: null,
  currentTaskWeek: null,
  editingTaskId: null,

  async loadTasks() {
    try {
      const year = new Date().getFullYear();
      const week = this.getWeekNumber(new Date());
      this.currentTaskYear = year;
      this.currentTaskWeek = week;

      // Load categories if not already loaded
      if (this.categories.length === 0) {
        const categoriesData = await this.apiGet('/tasks/categories');
        this.categories = categoriesData.categories;

        // Populate category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
          this.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.icon} ${cat.name}`;
            categoryFilter.appendChild(option);
          });
        }

        // Populate modal category dropdown
        const taskCategoryInput = document.getElementById('taskCategoryInput');
        if (taskCategoryInput) {
          this.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.icon} ${cat.name}`;
            taskCategoryInput.appendChild(option);
          });
        }
      }

      // Load projects and populate dropdown
      if (!this.projectsLoaded) {
        try {
          const projectsData = await this.apiGet('/projects');
          const projects = projectsData.projects || [];

          const taskProjectInput = document.getElementById('taskProjectInput');
          if (taskProjectInput) {
            // Clear existing options except first
            while (taskProjectInput.options.length > 1) {
              taskProjectInput.remove(1);
            }

            projects.forEach(proj => {
              const option = document.createElement('option');
              option.value = proj.id;
              option.textContent = proj.name;
              taskProjectInput.appendChild(option);
            });
          }
          this.projectsLoaded = true;
        } catch (err) {
          console.error('Failed to load projects:', err);
        }
      }

      // Load goals and populate dropdown
      if (!this.goalsLoaded) {
        try {
          const goalsData = await this.apiGet('/goals');
          const goals = goalsData.goals || [];

          const taskGoalInput = document.getElementById('taskGoalInput');
          if (taskGoalInput) {
            // Clear existing options except first
            while (taskGoalInput.options.length > 1) {
              taskGoalInput.remove(1);
            }

            goals.filter(g => !g.archived && g.status !== 'completed').forEach(goal => {
              const option = document.createElement('option');
              option.value = goal.id;
              option.textContent = goal.title;
              taskGoalInput.appendChild(option);
            });
          }
          this.goalsLoaded = true;
        } catch (err) {
          console.error('Failed to load goals:', err);
        }
      }

      // Load tasks with filters
      const params = new URLSearchParams({
        week: `${year}-${week}`,
        priority: this.currentPriorityFilter,
        category: this.currentCategoryFilter
      });

      const data = await this.apiGet(`/tasks?${params.toString()}`);
      const tasks = data.tasks || [];

      // Update week range display
      this.updateWeekRange(year, week);

      // Update dates for each column
      this.updateColumnDates(year, week);

      // Organize tasks by day (filter out archived tasks)
      const tasksByDay = {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
        Friday: [], Saturday: [], Sunday: []
      };

      tasks.filter(t => !t.archived).forEach(task => {
        if (tasksByDay[task.day]) {
          tasksByDay[task.day].push(task);
        }
      });

      // Render tasks for each day
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
        this.renderDayTasks(day, tasksByDay[day]);
      });

      // Setup drag and drop
      this.setupTasksDragAndDrop();

    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  },

  updateWeekRange(year, week) {
    const weekRange = document.getElementById('weekRange');
    if (!weekRange) return;

    const startDate = this.getDateOfWeek(week, year);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const options = { month: 'short', day: 'numeric' };
    weekRange.textContent = `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${year}`;
  },

  updateColumnDates(year, week) {
    const startDate = this.getDateOfWeek(week, year);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach((day, index) => {
      const dateEl = document.getElementById(`date-${day}`);
      if (dateEl) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + index);
        const options = { month: 'short', day: 'numeric' };
        dateEl.textContent = dayDate.toLocaleDateString('en-US', options);
      }
    });
  },

  getDateOfWeek(week, year) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    return ISOweekStart;
  },

  renderDayTasks(day, tasks) {
    const container = document.getElementById(`tasks-${day}`);
    if (!container) return;

    if (tasks.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); font-size: 12px; text-align: center; padding: 20px 10px;">No tasks</p>';
      return;
    }

    container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
  },

  getPriorityColor(priority) {
    const colors = {
      'high': '#dc2626',
      'medium': '#f59e0b',
      'low': '#10b981'
    };
    return colors[priority] || colors.medium;
  },

  createTaskCard(task) {
    const category = this.categories.find(c => c.id === task.category);
    const categoryDisplay = category ? `<span class="task-card-category" style="color: ${category.color}">${category.icon} ${category.name}</span>` : '';

    let linkDisplay = '';
    if (task.projectId) {
      linkDisplay = `<div class="task-card-link">→ Project</div>`;
    } else if (task.goalId) {
      linkDisplay = `<div class="task-card-link">→ Goal</div>`;
    }

    const priorityColor = this.getPriorityColor(task.priority);

    return `
      <div class="task-card ${task.completed ? 'completed' : ''} ${task.archived ? 'archived' : ''}"
           data-id="${task.id}"
           draggable="true"
           onclick="Nova.openTaskEdit('${task.id}')"
           style="border-left: 4px solid ${priorityColor}">
        <div class="task-card-title">${task.title}</div>
        ${categoryDisplay}
        ${linkDisplay}
        <div class="task-card-actions" onclick="event.stopPropagation()">
          <button class="task-action-btn" onclick="Nova.toggleTaskComplete('${task.id}', ${!task.completed})" title="${task.completed ? 'Reopen' : 'Complete'}">${task.completed ? '↺' : '✓'}</button>
          <button class="task-action-btn" onclick="Nova.openTaskEdit('${task.id}')" title="Edit">✎</button>
          <button class="task-action-btn" onclick="Nova.pushTask('${task.id}')" title="Push to next week">→</button>
          <button class="task-action-btn" onclick="Nova.archiveTask('${task.id}')" title="Archive">📦</button>
          <button class="task-action-btn delete" onclick="Nova.deleteTask('${task.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  },

  async toggleTaskComplete(taskId, completed) {
    try {
      await this.apiPut(`/tasks/${taskId}/complete`, {
        year: this.currentTaskYear,
        week: this.currentTaskWeek,
        completed
      });
      this.loadTasks();
      this.showNotification(completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  },

  async deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;

    try {
      await this.apiDelete(`/tasks/${taskId}?year=${this.currentTaskYear}&week=${this.currentTaskWeek}`);
      this.loadTasks();
      this.showNotification('Task deleted');
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  },

  openTaskModal(day = null, projectId = null) {
    this.editingTaskId = null;
    document.getElementById('taskModalTitle').textContent = 'Add Task';
    document.getElementById('taskTitleInput').value = '';
    document.getElementById('taskDescriptionInput').value = '';

    // Pre-select day if provided
    if (day) {
      document.querySelector(`input[name="taskDay"][value="${day}"]`).checked = true;
    }

    // Reset other fields
    document.querySelector('input[name="taskPriority"][value="medium"]').checked = true;
    document.getElementById('taskCategoryInput').value = '';
    document.getElementById('taskProjectInput').value = projectId || '';
    document.getElementById('taskGoalInput').value = '';

    // If project is pre-selected, show project tasks
    if (projectId) {
      this.showProjectTasks(projectId);
    } else {
      document.getElementById('projectTasksGroup').style.display = 'none';
    }

    document.getElementById('taskModal').classList.add('active');
  },

  async openTaskEdit(taskId) {
    try {
      const params = new URLSearchParams({ week: `${this.currentTaskYear}-${this.currentTaskWeek}` });
      const data = await this.apiGet(`/tasks?${params.toString()}`);
      const task = data.tasks.find(t => t.id === taskId);

      if (!task) return;

      this.editingTaskId = taskId;
      document.getElementById('taskModalTitle').textContent = 'Edit Task';
      document.getElementById('taskTitleInput').value = task.title;
      document.getElementById('taskDescriptionInput').value = task.description || '';
      document.querySelector(`input[name="taskDay"][value="${task.day}"]`).checked = true;
      document.querySelector(`input[name="taskPriority"][value="${task.priority}"]`).checked = true;
      document.getElementById('taskCategoryInput').value = task.category;
      document.getElementById('taskProjectInput').value = task.projectId || '';
      document.getElementById('taskGoalInput').value = task.goalId || '';

      // Show project tasks if project is linked
      if (task.projectId) {
        this.showProjectTasks(task.projectId);
      } else {
        document.getElementById('projectTasksGroup').style.display = 'none';
      }

      document.getElementById('taskModal').classList.add('active');
    } catch (err) {
      console.error('Failed to load task for editing:', err);
    }
  },

  closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    this.editingTaskId = null;
  },

  async saveTask() {
    const title = document.getElementById('taskTitleInput').value.trim();
    const day = document.querySelector('input[name="taskDay"]:checked')?.value;
    const priority = document.querySelector('input[name="taskPriority"]:checked')?.value;
    const category = document.getElementById('taskCategoryInput').value;
    const projectId = document.getElementById('taskProjectInput').value || null;
    const goalId = document.getElementById('taskGoalInput').value || null;
    const description = document.getElementById('taskDescriptionInput').value.trim() || '';

    if (!title) {
      alert('Please enter a task title');
      return;
    }

    if (!day) {
      alert('Please select a day');
      return;
    }

    if (!category) {
      alert('Please select a category');
      return;
    }

    try {
      const taskData = {
        title,
        day,
        priority,
        category,
        projectId,
        goalId,
        description,
        year: this.currentTaskYear,
        week: this.currentTaskWeek
      };

      if (this.editingTaskId) {
        await this.apiPut(`/tasks/${this.editingTaskId}`, taskData);
        this.showNotification('Task updated');
      } else {
        await this.apiPost('/tasks', taskData);
        this.showNotification('Task created');
      }

      this.closeTaskModal();
      this.loadTasks();
    } catch (err) {
      console.error('Failed to save task:', err);
      alert('Failed to save task');
    }
  },

  setupTasksDragAndDrop() {
    const cards = document.querySelectorAll('.task-card');
    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.id);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });

    const lists = document.querySelectorAll('.tasks-list');
    lists.forEach(list => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (!dragging) return;

        const afterElement = this.getDragAfterElement(list, e.clientY);
        if (afterElement) {
          list.insertBefore(dragging, afterElement);
        } else {
          list.appendChild(dragging);
        }
      });

      list.addEventListener('drop', async (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const newDay = list.dataset.day;

        try {
          await this.apiPut(`/tasks/${taskId}/move`, {
            year: this.currentTaskYear,
            week: this.currentTaskWeek,
            day: newDay
          });
          this.loadTasks();
        } catch (err) {
          console.error('Failed to move task:', err);
        }
      });
    });
  },

  async showProjectTasks(projectId) {
    try {
      const params = new URLSearchParams({ week: `${this.currentTaskYear}-${this.currentTaskWeek}` });
      const data = await this.apiGet(`/tasks?${params.toString()}`);
      const projectTasks = data.tasks.filter(t => t.projectId === projectId);

      const projectTasksList = document.getElementById('projectTasksList');
      const projectTasksGroup = document.getElementById('projectTasksGroup');

      if (projectTasks.length > 0) {
        projectTasksList.innerHTML = projectTasks.map(t => `
          <div class="preview-task">
            <strong>${t.title}</strong> • ${t.day} • ${t.completed ? '✓ Done' : 'Pending'}
          </div>
        `).join('');
        projectTasksGroup.style.display = 'block';
      } else {
        projectTasksList.innerHTML = '<div class="empty-preview">No tasks yet for this project</div>';
        projectTasksGroup.style.display = 'block';
      }
    } catch (err) {
      console.error('Failed to load project tasks:', err);
    }
  },

  async archiveTask(taskId) {
    if (!confirm('Archive this task?')) return;

    try {
      await this.apiPut(`/tasks/${taskId}/archive`, {
        year: this.currentTaskYear,
        week: this.currentTaskWeek
      });
      this.loadTasks();
      this.showNotification('Task archived');
    } catch (err) {
      console.error('Failed to archive task:', err);
      alert('Failed to archive task');
    }
  },

  async pushTask(taskId) {
    if (!confirm('Push this task to next week?')) return;

    try {
      await this.apiPut(`/tasks/${taskId}/push`, {
        year: this.currentTaskYear,
        week: this.currentTaskWeek
      });
      this.loadTasks();
      this.showNotification('Task pushed to next week');
    } catch (err) {
      console.error('Failed to push task:', err);
      alert('Failed to push task');
    }
  },

  async clearWeek() {
    if (!confirm('Clear all incomplete tasks from this week? (This will archive them)')) return;

    try {
      await this.apiPost('/tasks/clear-week', {
        year: this.currentTaskYear,
        week: this.currentTaskWeek
      });
      this.loadTasks();
      this.showNotification('Week cleared - incomplete tasks archived');
    } catch (err) {
      console.error('Failed to clear week:', err);
      alert('Failed to clear week');
    }
  },

  async viewPushedTasks() {
    try {
      const tasks = await this.apiGet('/tasks/pushed');

      if (!tasks || tasks.length === 0) {
        alert('No pushed tasks found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'task-modal active';
      modal.innerHTML = `
        <div class="task-modal-content">
          <button class="task-modal-close" onclick="this.closest('.task-modal').remove()">&times;</button>
          <h2>⏭️ Pushed Tasks</h2>
          <div class="task-modal-body">
            <p style="color: var(--text-secondary); margin-bottom: 16px;">Tasks pushed to future weeks</p>
            ${tasks.map(task => {
              const priorityColor = this.getPriorityColor(task.priority);
              return `
                <div class="pushed-task-item" style="border-left: 4px solid ${priorityColor}; padding: 12px; background: var(--card-bg); margin-bottom: 8px; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-weight: 500;">${task.title}</div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                        Target: Week ${task.targetWeek} ${task.targetYear || ''}
                      </div>
                    </div>
                    <button class="btn-primary btn-sm" onclick="Nova.bringBackTask('${task.id}')">
                      Bring Back
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="task-modal-footer">
            <button class="btn-secondary" onclick="this.closest('.task-modal').remove()">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (err) {
      console.error('Failed to load pushed tasks:', err);
      alert('Failed to load pushed tasks');
    }
  },

  async viewArchivedTasks() {
    try {
      const tasks = await this.apiGet('/tasks/archived');

      if (!tasks || tasks.length === 0) {
        alert('No archived tasks found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'task-modal active';
      modal.innerHTML = `
        <div class="task-modal-content">
          <button class="task-modal-close" onclick="this.closest('.task-modal').remove()">&times;</button>
          <h2>📦 Archived Tasks</h2>
          <div class="task-modal-body">
            <p style="color: var(--text-secondary); margin-bottom: 16px;">Completed or archived tasks</p>
            ${tasks.map(task => {
              const priorityColor = this.getPriorityColor(task.priority);
              return `
                <div class="archived-task-item" style="border-left: 4px solid ${priorityColor}; padding: 12px; background: var(--card-bg); margin-bottom: 8px; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-weight: 500; ${task.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${task.title}</div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                        Archived: ${task.archivedAt ? new Date(task.archivedAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <button class="btn-secondary btn-sm" onclick="Nova.restoreTask('${task.id}')">
                        Restore
                      </button>
                      <button class="btn-danger btn-sm" onclick="Nova.deleteTask('${task.id}')">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="task-modal-footer">
            <button class="btn-secondary" onclick="this.closest('.task-modal').remove()">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (err) {
      console.error('Failed to load archived tasks:', err);
      alert('Failed to load archived tasks');
    }
  },

  async bringBackTask(taskId) {
    if (!confirm('Bring this task back to the current week?')) return;

    try {
      await this.apiPut(`/tasks/${taskId}/bringback`, {
        year: this.currentTaskYear,
        week: this.currentTaskWeek
      });
      this.loadTasks();
      this.showNotification('Task brought back to current week');
      // Close the modal
      document.querySelector('.task-modal')?.remove();
    } catch (err) {
      console.error('Failed to bring back task:', err);
      alert('Failed to bring back task');
    }
  },

  async restoreTask(taskId) {
    if (!confirm('Restore this task from archive?')) return;

    try {
      await this.apiPut(`/tasks/${taskId}/restore`, {
        year: this.currentTaskYear,
        week: this.currentTaskWeek
      });
      this.loadTasks();
      this.showNotification('Task restored');
      // Refresh the archived tasks view
      document.querySelector('.task-modal')?.remove();
      this.viewArchivedTasks();
    } catch (err) {
      console.error('Failed to restore task:', err);
      alert('Failed to restore task');
    }
  },

  // Projects
  async loadProjects() {
    try {
      const projectsData = await this.apiGet('/projects/');
      const projects = projectsData.projects || projectsData;

      // Filter by category
      const filtered = this.projectCategoryFilter === 'all'
        ? projects
        : projects.filter(p => p.category === this.projectCategoryFilter);

      // Populate each kanban column
      const statuses = ['backlog', 'in-progress', 'review', 'done', 'archived'];

      for (const status of statuses) {
        const statusProjects = filtered.filter(p => p.status === status);
        const container = document.getElementById(`projects-${status}`);
        const countElement = document.getElementById(`count-${status}`);

        if (container) {
          container.innerHTML = statusProjects.length
            ? statusProjects.map(p => this.createProjectCard(p)).join('')
            : '<div style="color: var(--text-muted); text-align: center; padding: 20px; font-size: 14px;">No projects</div>';
        }

        if (countElement) {
          countElement.textContent = statusProjects.length;
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  },

  createProjectCard(project) {
    const categoryEmojis = {
      'Business': '💼',
      'Tech': '💻',
      'Personal': '👤',
      'Health': '❤️',
      'Finance': '💰'
    };

    const categoryEmoji = categoryEmojis[project.category] || '📁';
    const progress = project.progress || 0;
    const deadline = project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline';

    // Get backlog task count
    const backlogCount = project.backlogCount || 0;

    // Get linked goal name (simplified for now)
    const goalLink = project.goalId ? `<div class="project-goal-link">→ ${project.goalName || 'Goal'}</div>` : '';

    return `
      <div class="project-card" onclick="Nova.viewProjectDetail('${project.id}')" draggable="true">
        <div class="project-card-header">
          <div class="project-card-title">${project.name}</div>
          <div class="project-card-category">${categoryEmoji} ${project.category}</div>
        </div>

        <div class="project-card-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${progress}%</span>
        </div>

        ${goalLink}

        <div class="project-card-footer">
          <span class="project-backlog-count">📋 ${backlogCount} backlog</span>
          <span class="project-deadline">${deadline}</span>
        </div>
      </div>
    `;
  },

  // Workflows
  async loadWorkflows() {
    try {
      const workflows = await this.apiGet('/workflows/');

      let filteredWorkflows = workflows.filter(w => {
        if (this.showArchivedWorkflows) {
          return w.archived;
        } else {
          return !w.archived;
        }
      });

      document.getElementById('workflowsList').innerHTML = filteredWorkflows.length
        ? filteredWorkflows.map(w => this.createWorkflowCard(w)).join('')
        : `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
            <p>${this.showArchivedWorkflows ? 'No archived workflows' : 'No workflows defined yet.'}</p>
            ${!this.showArchivedWorkflows ? '<p style="font-size: 14px; margin-top: 8px;">Create SOPs and processes here.</p>' : ''}
          </div>`;
    } catch (err) {
      console.error('Failed to load workflows:', err);
      document.getElementById('workflowsList').innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">Failed to load workflows</p>';
    }
  },

  createWorkflowCard(workflow) {
    const statusIcon = workflow.active ? '🟢' : '⚫';
    const statusText = workflow.active ? 'Active' : 'Inactive';

    return `
      <div class="workflow-card" onclick="Nova.viewWorkflow('${workflow.id}')">
        <div class="workflow-card-header">
          <div class="workflow-card-title">${workflow.name}</div>
          <div class="workflow-card-status">
            <span>${statusIcon} ${statusText}</span>
          </div>
        </div>
        <div class="workflow-card-category">${workflow.category || 'General'}</div>
        <div class="workflow-card-actions" onclick="event.stopPropagation()">
          <button class="btn-icon" onclick="Nova.viewWorkflow('${workflow.id}')" title="View">👁️</button>
          <button class="btn-icon" onclick="Nova.editWorkflow('${workflow.id}')" title="Edit">✎</button>
          <button class="btn-icon btn-danger" onclick="Nova.deleteWorkflow('${workflow.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  },

  async viewWorkflow(workflowId) {
    try {
      const workflow = await this.apiGet(`/workflows/${workflowId}`);
      this.currentWorkflowId = workflowId;

      const modal = document.getElementById('workflowDetailModal');
      const body = document.getElementById('workflowDetailBody');

      const steps = Array.isArray(workflow.steps) ? workflow.steps :
                    (workflow.steps ? workflow.steps.split('\n').filter(s => s.trim()) : []);

      body.innerHTML = `
        <div class="workflow-detail-header">
          <h1>${workflow.name}</h1>
          <div class="workflow-detail-meta">
            <span class="workflow-badge">${workflow.category || 'General'}</span>
            <span class="workflow-status-badge ${workflow.active ? 'active' : 'inactive'}">
              ${workflow.active ? '🟢 Active' : '⚫ Inactive'}
            </span>
          </div>
        </div>

        ${workflow.description ? `
          <div class="workflow-detail-section">
            <h3>Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${workflow.description}</p>
          </div>
        ` : ''}

        <div class="workflow-detail-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3>Step-by-Step Procedure</h3>
            <button class="btn-secondary btn-sm" onclick="Nova.editWorkflow('${workflow.id}')">✎ Edit Steps</button>
          </div>
          ${steps.length > 0 ? `
            <ol class="workflow-steps-list">
              ${steps.map(step => `<li>${step.replace(/^\d+\.\s*/, '')}</li>`).join('')}
            </ol>
          ` : '<p style="color: var(--text-muted);">No steps defined yet</p>'}
        </div>

        <div class="workflow-detail-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3>📎 Attached Documents</h3>
            <button class="btn-secondary btn-sm" onclick="Nova.showAttachFileDialog('${workflow.id}')">+ Attach</button>
          </div>
          ${workflow.attachments && workflow.attachments.length > 0 ? `
            <div class="attachments-list">
              ${workflow.attachments.map(att => `
                <div class="attachment-item">
                  <span>📎 ${att.name}</span>
                  <button class="btn-icon btn-danger" onclick="Nova.deleteAttachment('${workflow.id}', '${att.id}')">🗑️</button>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color: var(--text-muted);">No attachments</p>'}
        </div>

        <div class="workflow-detail-actions">
          <button class="btn-secondary" onclick="Nova.closeWorkflowDetail()">Close</button>
          <button class="btn-secondary" onclick="Nova.toggleWorkflowStatus('${workflow.id}', ${!workflow.active})">
            ${workflow.active ? 'Mark Inactive' : 'Mark Active'}
          </button>
          <button class="btn-secondary" onclick="Nova.archiveWorkflow('${workflow.id}', ${!workflow.archived})">
            ${workflow.archived ? 'Unarchive' : 'Archive'}
          </button>
          <button class="btn-danger" onclick="Nova.deleteWorkflow('${workflow.id}')">Delete</button>
        </div>
      `;

      modal.classList.add('active');
    } catch (err) {
      console.error('Failed to load workflow:', err);
      alert('Failed to load workflow details');
    }
  },

  closeWorkflowDetail() {
    document.getElementById('workflowDetailModal').classList.remove('active');
  },

  toggleArchivedWorkflows() {
    this.showArchivedWorkflows = !this.showArchivedWorkflows;
    const btn = document.getElementById('toggleArchivedWorkflowsBtn');
    if (btn) {
      btn.textContent = this.showArchivedWorkflows ? '📦 Hide Archived' : '📦 Show Archived';
    }
    this.loadWorkflows();
  },

  showAddWorkflowModal() {
    this.currentWorkflowId = null;
    document.getElementById('workflowEditTitle').textContent = 'Create Workflow';
    document.getElementById('workflowNameInput').value = '';
    document.getElementById('workflowCategoryInput').value = 'Operations';
    document.getElementById('workflowDescriptionInput').value = '';
    document.getElementById('workflowStepsInput').value = '';

    const modal = document.getElementById('workflowEditModal');
    modal.classList.add('active');

    // Setup event listeners
    document.getElementById('workflowEditClose').onclick = () => this.closeWorkflowEditModal();
    document.getElementById('workflowEditCancel').onclick = () => this.closeWorkflowEditModal();
    document.getElementById('workflowEditSave').onclick = () => this.saveWorkflow();
  },

  async editWorkflow(workflowId) {
    try {
      const workflow = await this.apiGet(`/workflows/${workflowId}`);
      this.currentWorkflowId = workflowId;

      document.getElementById('workflowEditTitle').textContent = 'Edit Workflow';
      document.getElementById('workflowNameInput').value = workflow.name || '';
      document.getElementById('workflowCategoryInput').value = workflow.category || 'Operations';
      document.getElementById('workflowDescriptionInput').value = workflow.description || '';

      const steps = Array.isArray(workflow.steps) ? workflow.steps.join('\n') : (workflow.steps || '');
      document.getElementById('workflowStepsInput').value = steps;

      const modal = document.getElementById('workflowEditModal');
      modal.classList.add('active');

      // Close detail modal if open
      this.closeWorkflowDetail();

      // Setup event listeners
      document.getElementById('workflowEditClose').onclick = () => this.closeWorkflowEditModal();
      document.getElementById('workflowEditCancel').onclick = () => this.closeWorkflowEditModal();
      document.getElementById('workflowEditSave').onclick = () => this.saveWorkflow();
    } catch (err) {
      console.error('Failed to load workflow for editing:', err);
      alert('Failed to load workflow');
    }
  },

  closeWorkflowEditModal() {
    document.getElementById('workflowEditModal').classList.remove('active');
  },

  async saveWorkflow() {
    const name = document.getElementById('workflowNameInput').value.trim();
    const category = document.getElementById('workflowCategoryInput').value;
    const description = document.getElementById('workflowDescriptionInput').value.trim();
    const stepsText = document.getElementById('workflowStepsInput').value.trim();

    if (!name) {
      alert('Please enter a workflow name');
      return;
    }

    const steps = stepsText.split('\n').filter(s => s.trim());

    const workflowData = {
      name,
      category,
      description,
      steps,
      active: true,
      archived: false
    };

    try {
      if (this.currentWorkflowId) {
        await this.apiPut(`/workflows/${this.currentWorkflowId}`, workflowData);
        this.showNotification('Workflow updated');
      } else {
        await this.apiPost('/workflows/', workflowData);
        this.showNotification('Workflow created');
      }

      this.closeWorkflowEditModal();
      this.loadWorkflows();
    } catch (err) {
      console.error('Failed to save workflow:', err);
      alert('Failed to save workflow');
    }
  },

  async deleteWorkflow(workflowId) {
    if (!confirm('Delete this workflow? This cannot be undone.')) return;

    try {
      await this.apiDelete(`/workflows/${workflowId}`);
      this.showNotification('Workflow deleted');
      this.closeWorkflowDetail();
      this.loadWorkflows();
    } catch (err) {
      console.error('Failed to delete workflow:', err);
      alert('Failed to delete workflow');
    }
  },

  async toggleWorkflowStatus(workflowId, active) {
    try {
      await this.apiPut(`/workflows/${workflowId}`, { active });
      this.showNotification(`Workflow marked ${active ? 'active' : 'inactive'}`);
      this.closeWorkflowDetail();
      this.loadWorkflows();
    } catch (err) {
      console.error('Failed to update workflow status:', err);
      alert('Failed to update workflow status');
    }
  },

  async archiveWorkflow(workflowId, archived) {
    try {
      await this.apiPut(`/workflows/${workflowId}`, { archived });
      this.showNotification(archived ? 'Workflow archived' : 'Workflow unarchived');
      this.closeWorkflowDetail();
      this.loadWorkflows();
    } catch (err) {
      console.error('Failed to archive workflow:', err);
      alert('Failed to archive workflow');
    }
  },

  showAttachFileDialog(workflowId) {
    alert('File attachment feature coming soon!\n\nThis will allow you to upload documents, PDFs, and other files to your workflows.');
  },

  async deleteAttachment(workflowId, attachmentId) {
    if (!confirm('Delete this attachment?')) return;

    try {
      await this.apiDelete(`/workflows/${workflowId}/attachments/${attachmentId}`);
      this.showNotification('Attachment deleted');
      this.viewWorkflow(workflowId); // Reload the detail view
    } catch (err) {
      console.error('Failed to delete attachment:', err);
      alert('Failed to delete attachment');
    }
  },

  // Project Operations
  openCreateProject(status = 'backlog') {
    this.currentProjectId = null;
    document.getElementById('projectEditTitle').textContent = 'Create Project';
    document.getElementById('projectNameInput').value = '';
    document.getElementById('projectDescriptionInput').value = '';
    document.getElementById('projectCategoryInput').value = 'Business';
    document.getElementById('projectDeadlineInput').value = '';
    document.getElementById('projectGoalInput').value = '';

    // Set status radio button
    document.querySelectorAll('input[name="projectStatus"]').forEach(radio => {
      radio.checked = radio.value === status;
    });

    // Load goals into dropdown
    this.loadGoalsForProject();

    document.getElementById('projectEditModal').classList.add('active');
  },

  async loadGoalsForProject() {
    try {
      const goals = await this.apiGet('/goals/');
      const goalSelect = document.getElementById('projectGoalInput');
      goalSelect.innerHTML = '<option value="">None</option>';

      goals.forEach(goal => {
        const option = document.createElement('option');
        option.value = goal.id;
        option.textContent = goal.title;
        goalSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Failed to load goals:', err);
    }
  },

  closeProjectEdit() {
    document.getElementById('projectEditModal').classList.remove('active');
    this.currentProjectId = null;
  },

  async saveProject() {
    const name = document.getElementById('projectNameInput').value.trim();
    const description = document.getElementById('projectDescriptionInput').value.trim();
    const category = document.getElementById('projectCategoryInput').value;
    const deadline = document.getElementById('projectDeadlineInput').value || null;
    const goalId = document.getElementById('projectGoalInput').value || null;
    const status = document.querySelector('input[name="projectStatus"]:checked')?.value || 'backlog';

    if (!name) {
      alert('Please enter a project name');
      return;
    }

    const projectData = {
      name,
      description,
      category,
      deadline,
      goalId,
      status,
      progress: 0,
      backlogCount: 0
    };

    try {
      if (this.currentProjectId) {
        await this.apiPut(`/projects/${this.currentProjectId}`, projectData);
        this.showNotification('Project updated');
      } else {
        await this.apiPost('/projects/', projectData);
        this.showNotification('Project created');
      }

      this.closeProjectEdit();
      this.loadProjects();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project');
    }
  },

  async viewProjectDetail(projectId) {
    try {
      const project = await this.apiGet(`/projects/${projectId}`);
      this.currentProjectId = projectId;

      // Get backlog tasks for this project
      const tasksData = await this.apiGet('/tasks/');
      const allTasks = tasksData.tasks || tasksData;
      const backlogTasks = allTasks.filter(t => t.projectId === projectId && !t.week && !t.day);
      const activeTasks = allTasks.filter(t => t.projectId === projectId && t.week && !t.completed);
      const completedTasks = allTasks.filter(t => t.projectId === projectId && t.completed);

      const modal = document.getElementById('projectDetailModal');
      const body = document.getElementById('projectDetailBody');

      const categoryEmojis = {
        'Business': '💼',
        'Tech': '💻',
        'Personal': '👤',
        'Health': '❤️',
        'Finance': '💰'
      };
      const categoryEmoji = categoryEmojis[project.category] || '📁';

      body.innerHTML = `
        <div class="project-detail-header">
          <h1>${project.name}</h1>
          <div class="project-detail-meta">
            <span class="project-badge">${categoryEmoji} ${project.category}</span>
            <span class="progress-badge">${project.progress || 0}% Complete</span>
          </div>
        </div>

        ${project.description ? `
          <div class="project-detail-section">
            <h3>Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${project.description}</p>
          </div>
        ` : ''}

        <div class="project-detail-section">
          <div class="section-header">
            <h3>📋 Backlog Tasks</h3>
            <button class="btn-sm btn-primary" onclick="Nova.openBacklogTaskModal('${projectId}')">+ Add Task</button>
          </div>
          ${backlogTasks.length > 0 ? `
            <div class="backlog-tasks-list">
              ${backlogTasks.map(task => `
                <div class="backlog-task-item">
                  <div class="backlog-task-title">${task.title}</div>
                  <button class="btn-sm btn-secondary" onclick="Nova.scheduleTaskToWeek('${task.id}')">Add to Week</button>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color: var(--text-muted); margin-top: 12px;">No backlog tasks</p>'}
        </div>

        ${activeTasks.length > 0 ? `
          <div class="project-detail-section">
            <h3>⚡ Active Tasks (This Week)</h3>
            <div class="active-tasks-list">
              ${activeTasks.map(task => `
                <div class="active-task-item">
                  <div>${task.title}</div>
                  <span class="task-week-label">${task.day || 'Unscheduled'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${completedTasks.length > 0 ? `
          <div class="project-detail-section">
            <h3>✅ Completed Tasks</h3>
            <div class="completed-tasks-list">
              ${completedTasks.map(task => `
                <div class="completed-task-item">${task.title}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="project-detail-actions">
          <button class="btn-secondary" onclick="Nova.editProject('${projectId}')">Edit Project</button>
          <button class="btn-danger" onclick="Nova.deleteProject('${projectId}')">Delete Project</button>
        </div>
      `;

      modal.classList.add('active');
    } catch (err) {
      console.error('Failed to load project detail:', err);
      alert('Failed to load project details');
    }
  },

  closeProjectDetail() {
    document.getElementById('projectDetailModal').classList.remove('active');
    this.currentProjectId = null;
  },

  async editProject(projectId) {
    try {
      const project = await this.apiGet(`/projects/${projectId}`);
      this.currentProjectId = projectId;

      document.getElementById('projectEditTitle').textContent = 'Edit Project';
      document.getElementById('projectNameInput').value = project.name;
      document.getElementById('projectDescriptionInput').value = project.description || '';
      document.getElementById('projectCategoryInput').value = project.category;
      document.getElementById('projectDeadlineInput').value = project.deadline || '';
      document.getElementById('projectGoalInput').value = project.goalId || '';

      document.querySelectorAll('input[name="projectStatus"]').forEach(radio => {
        radio.checked = radio.value === project.status;
      });

      await this.loadGoalsForProject();
      this.closeProjectDetail();
      document.getElementById('projectEditModal').classList.add('active');
    } catch (err) {
      console.error('Failed to load project for editing:', err);
      alert('Failed to load project');
    }
  },

  async deleteProject(projectId) {
    if (!confirm('Delete this project? This cannot be undone.')) return;

    try {
      await this.apiDelete(`/projects/${projectId}`);
      this.showNotification('Project deleted');
      this.closeProjectDetail();
      this.loadProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project');
    }
  },

  openBacklogTaskModal(projectId) {
    this.currentProjectId = projectId;
    document.getElementById('backlogTaskTitleInput').value = '';
    this.apiGet(`/projects/${projectId}`).then(project => {
      document.getElementById('backlogTaskProjectName').value = project.name;
    });
    document.getElementById('backlogTaskModal').classList.add('active');
  },

  closeBacklogTaskModal() {
    document.getElementById('backlogTaskModal').classList.remove('active');
  },

  async saveBacklogTask() {
    const title = document.getElementById('backlogTaskTitleInput').value.trim();

    if (!title) {
      alert('Please enter a task title');
      return;
    }

    if (!this.currentProjectId) {
      alert('No project selected');
      return;
    }

    try {
      const taskData = {
        title,
        projectId: this.currentProjectId,
        status: 'backlog',
        week: null,
        day: null,
        completed: false,
        createdAt: new Date().toISOString()
      };

      await this.apiPost('/tasks/', taskData);
      this.showNotification('Task added to backlog');
      this.closeBacklogTaskModal();
      this.viewProjectDetail(this.currentProjectId); // Reload project detail
      this.loadProjects(); // Reload to update backlog count
    } catch (err) {
      console.error('Failed to create backlog task:', err);
      alert('Failed to create task');
    }
  },

  async scheduleTaskToWeek(taskId) {
    try {
      // Get current week number
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const weekNum = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
      const currentWeek = `${now.getFullYear()}-${weekNum}`;

      // Update task with week but no day yet (unscheduled in weekly view)
      await this.apiPut(`/tasks/${taskId}`, {
        week: currentWeek,
        day: null,
        status: 'todo'
      });

      this.showNotification('Task added to this week');
      this.viewProjectDetail(this.currentProjectId);
      this.loadTasks(); // Reload tasks tab
      this.loadProjects(); // Update project
    } catch (err) {
      console.error('Failed to schedule task:', err);
      alert('Failed to schedule task');
    }
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

    // Setup subtab switchers
    document.querySelectorAll('.learning-subtabs .subtab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.learning-subtabs .subtab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.learning-subtab').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        const subtab = e.target.dataset.subtab;
        document.getElementById(`subtab-${subtab}`).classList.add('active');
      });
    });
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
