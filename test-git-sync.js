// Test script for git sync functionality
const { gitSync } = require('./src/services/gitSync');

console.log('Testing Git Sync Integration...\n');

// Test 1: Check initial status
console.log('Test 1: Initial Status');
const initialStatus = gitSync.getStatus();
console.log('Status:', initialStatus);
console.log('Display:', initialStatus.display);
console.log('');

// Test 2: Track a change
console.log('Test 2: Tracking Changes');
gitSync.trackChange('goals', 'saveDailyGoals', { date: '2026-02-06' });
gitSync.trackChange('tasks', 'createTask', { title: 'Test task' });
console.log('Tracked 2 changes');
console.log('Pending changes:', gitSync.pendingChanges.size);
console.log('');

// Test 3: Check status after changes
console.log('Test 3: Status After Changes');
const statusAfter = gitSync.getStatus();
console.log('Status:', statusAfter.status);
console.log('Display:', statusAfter.display);
console.log('Pending changes:', statusAfter.pendingChanges);
console.log('');

// Test 4: Manual sync (commented out for safety)
console.log('Test 4: Manual Sync (commented out)');
console.log('To test manual sync, uncomment the line below:');
console.log('// gitSync.manualSync().then(() => console.log("Manual sync complete"));');
console.log('');

// Test 5: Git command test
console.log('Test 5: Testing git commands');
gitSync.gitCommand('status --short')
  .then(output => {
    console.log('Git status:', output.trim() || '(clean)');
  })
  .catch(error => {
    console.log('Git status error (expected if no changes):', error.message);
  });

console.log('\nTest complete!');
console.log('\nTo see the sync in action:');
console.log('1. Make changes to any data file in /data/');
console.log('2. Wait 5 minutes (or trigger manual sync)');
console.log('3. Check GitHub for the commit');