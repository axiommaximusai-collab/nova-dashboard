const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class GitSync {
  constructor() {
    this.repoPath = path.join(__dirname, '../..');
    this.pendingChanges = new Set();
    this.debounceTimer = null;
    this.debounceDelay = 5 * 60 * 1000; // 5 minutes
    this.lastSyncTime = null;
    this.syncStatus = 'idle'; // idle, pending, syncing, error
    
    // Ensure git is configured
    this.ensureGitConfig();
  }

  ensureGitConfig() {
    // Check if git user is configured
    exec('git config user.email', { cwd: this.repoPath }, (err, email) => {
      if (err || !email.trim()) {
        console.warn('Git user email not configured. Setting default...');
        exec('git config user.email "nova@axiommaximusai-collab.com"', { cwd: this.repoPath });
      }
    });
    
    exec('git config user.name', { cwd: this.repoPath }, (err, name) => {
      if (err || !name.trim()) {
        console.warn('Git user name not configured. Setting default...');
        exec('git config user.name "Nova Dashboard"', { cwd: this.repoPath });
      }
    });
  }

  // Track changes from different modules
  trackChange(module, operation, details = {}) {
    const changeKey = `${module}:${operation}:${JSON.stringify(details)}`;
    this.pendingChanges.add(changeKey);
    
    // Debounce the sync
    this.debounceSync();
    
    // Update sync status
    this.syncStatus = 'pending';
    
    console.log(`[GitSync] Change tracked: ${changeKey}`);
    console.log(`[GitSync] Pending changes: ${this.pendingChanges.size}`);
  }

  debounceSync() {
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // Set new timer
    this.debounceTimer = setTimeout(() => {
      this.performSync();
    }, this.debounceDelay);
    
    console.log(`[GitSync] Sync scheduled in ${this.debounceDelay / 1000} seconds`);
  }

  async performSync() {
    if (this.pendingChanges.size === 0) {
      console.log('[GitSync] No changes to sync');
      this.syncStatus = 'idle';
      return;
    }

    this.syncStatus = 'syncing';
    console.log(`[GitSync] Starting sync with ${this.pendingChanges.size} pending changes`);

    try {
      // Get current timestamp for commit message
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
      
      // Determine which modules were changed
      const modules = new Set();
      this.pendingChanges.forEach(change => {
        const [module] = change.split(':');
        modules.add(module);
      });

      // Create commit message
      const moduleList = Array.from(modules).join(', ');
      const commitMessage = `[Nova] Updated ${moduleList} — ${timestamp}`;

      // Git operations
      await this.gitCommand('add .');
      await this.gitCommand(`commit -m "${commitMessage}"`);
      await this.gitCommand('push origin main');

      // Update sync status
      this.lastSyncTime = new Date();
      this.pendingChanges.clear();
      this.syncStatus = 'idle';
      
      console.log(`[GitSync] Sync completed successfully at ${this.lastSyncTime.toISOString()}`);
      
    } catch (error) {
      console.error('[GitSync] Sync failed:', error);
      this.syncStatus = 'error';
      // Keep pending changes for retry
    }
  }

  gitCommand(command) {
    return new Promise((resolve, reject) => {
      exec(`git ${command}`, { cwd: this.repoPath }, (error, stdout, stderr) => {
        if (error) {
          console.error(`[GitSync] git ${command} failed:`, stderr);
          reject(new Error(`git ${command} failed: ${stderr}`));
        } else {
          console.log(`[GitSync] git ${command}: ${stdout.trim()}`);
          resolve(stdout);
        }
      });
    });
  }

  // Manual sync trigger
  async manualSync() {
    console.log('[GitSync] Manual sync triggered');
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    await this.performSync();
  }

  // Get sync status for UI
  getStatus() {
    const status = {
      status: this.syncStatus,
      pendingChanges: this.pendingChanges.size,
      lastSync: this.lastSyncTime ? this.lastSyncTime.toISOString() : null,
      nextSyncIn: this.debounceTimer ? this.debounceDelay : 0
    };

    // Human-readable status for UI
    if (this.syncStatus === 'idle' && this.lastSyncTime) {
      const minutesAgo = Math.floor((new Date() - this.lastSyncTime) / 60000);
      status.display = `Synced ${minutesAgo} min ago`;
    } else if (this.syncStatus === 'pending') {
      status.display = `Sync pending... (${this.pendingChanges.size} changes)`;
    } else if (this.syncStatus === 'syncing') {
      status.display = 'Syncing now...';
    } else if (this.syncStatus === 'error') {
      status.display = 'Sync error - retrying soon';
    } else {
      status.display = 'Not synced yet';
    }

    return status;
  }

  // Hook into existing service methods
  createServiceHook(serviceName, methods) {
    const hooks = {};
    
    methods.forEach(method => {
      hooks[method] = function(...args) {
        // Call original method
        const result = this[`_original_${method}`](...args);
        
        // Track the change
        gitSync.trackChange(serviceName, method, { args: args.slice(0, 1) });
        
        return result;
      };
    });
    
    return hooks;
  }
}

// Create singleton instance
const gitSync = new GitSync();

// Export both instance and class
module.exports = {
  gitSync,
  GitSync
};