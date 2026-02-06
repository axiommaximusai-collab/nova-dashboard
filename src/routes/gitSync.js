const express = require('express');
const router = express.Router();
const { gitSync } = require('../services/gitSync');

// Get sync status
router.get('/status', (req, res) => {
  try {
    const status = gitSync.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting git sync status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sync status'
    });
  }
});

// Trigger manual sync
router.post('/sync', async (req, res) => {
  try {
    await gitSync.manualSync();
    const status = gitSync.getStatus();
    
    res.json({
      success: true,
      message: 'Manual sync triggered',
      data: status
    });
  } catch (error) {
    console.error('Error triggering manual sync:', error);
    res.status(500).json({
      success: false,
      error: 'Manual sync failed'
    });
  }
});

// Get sync history (last few commits)
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    gitSync.gitCommand(`log --oneline -n ${limit}`)
      .then(output => {
        const commits = output.trim().split('\n').map(line => {
          const [hash, ...messageParts] = line.split(' ');
          return {
            hash,
            message: messageParts.join(' ')
          };
        });
        
        res.json({
          success: true,
          data: commits
        });
      })
      .catch(error => {
        throw error;
      });
  } catch (error) {
    console.error('Error getting sync history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sync history'
    });
  }
});

module.exports = router;