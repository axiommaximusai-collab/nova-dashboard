const { gitSync } = require('./gitSync');

// List of services and their write methods
const SERVICE_HOOKS = {
  goalsService: ['saveDailyGoals', 'saveWeeklyGoals', 'saveMonthlyGoals'],
  tasksService: ['createTask', 'updateTask', 'deleteTask', 'completeTask'],
  habitsService: ['createHabit', 'updateHabit', 'deleteHabit', 'logHabit'],
  workflowsService: ['createWorkflow', 'updateWorkflow', 'deleteWorkflow', 'runWorkflow'],
  memoryService: ['createEntry', 'updateEntry', 'deleteEntry'],
  projectsService: ['createProject', 'updateProject', 'deleteProject'],
  networkService: ['createContact', 'updateContact', 'deleteContact', 'logInteraction']
};

// Function to apply hooks to a service
function applyGitSyncHooks(service, serviceName) {
  const hooks = SERVICE_HOOKS[serviceName];
  if (!hooks) return service;

  const hookedService = { ...service };

  hooks.forEach(methodName => {
    if (typeof service[methodName] === 'function') {
      // Store original method
      const originalMethod = service[methodName];
      
      // Create wrapped method
      hookedService[methodName] = function(...args) {
        // Call original method
        const result = originalMethod.apply(this, args);
        
        // Track the change for git sync
        gitSync.trackChange(serviceName, methodName, {
          timestamp: new Date().toISOString(),
          args: args.length > 0 ? [args[0]] : []
        });
        
        return result;
      };
    }
  });

  return hookedService;
}

// Function to initialize all service hooks
function initializeServiceHooks(services) {
  const hookedServices = {};
  
  Object.keys(services).forEach(serviceName => {
    const service = services[serviceName];
    hookedServices[serviceName] = applyGitSyncHooks(service, serviceName);
  });
  
  return hookedServices;
}

module.exports = {
  applyGitSyncHooks,
  initializeServiceHooks,
  gitSync
};