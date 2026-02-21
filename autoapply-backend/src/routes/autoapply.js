const express = require('express');
const router = express.Router();

// GET auto-apply status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      enabled: false,
      maxPerDay: 25,
      appliedToday: 0,
      remainingToday: 25,
      lastRun: null,
      nextRun: null
    }
  });
});

// POST enable auto-apply
router.post('/enable', (req, res) => {
  res.json({
    success: true,
    data: {
      enabled: true,
      enabledAt: new Date().toISOString()
    },
    message: 'Auto-apply enabled successfully'
  });
});

// POST disable auto-apply
router.post('/disable', (req, res) => {
  res.json({
    success: true,
    data: {
      enabled: false,
      disabledAt: new Date().toISOString()
    },
    message: 'Auto-apply disabled successfully'
  });
});

// POST start auto-apply session
router.post('/start', (req, res) => {
  const { jobTitles, locations } = req.body;
  
  const sessionId = 'session-' + Date.now();
  
  res.json({
    success: true,
    data: {
      sessionId,
      startedAt: new Date().toISOString(),
      status: 'running',
      jobTitles: jobTitles || ['Software Engineer'],
      locations: locations || ['San Francisco, CA'],
      estimatedJobs: 10
    },
    message: 'Auto-apply session started'
  });
});

// POST stop auto-apply session
router.post('/stop/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  res.json({
    success: true,
    data: {
      sessionId,
      stoppedAt: new Date().toISOString(),
      status: 'stopped',
      jobsApplied: 5
    },
    message: 'Auto-apply session stopped'
  });
});

// GET session status
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  res.json({
    success: true,
    data: {
      sessionId,
      status: 'running',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      jobsFound: 15,
      jobsApplied: 3,
      failed: 1,
      skipped: 11,
      estimatedCompletion: new Date(Date.now() + 7200000).toISOString()
    }
  });
});

// GET today's applications
router.get('/today', (req, res) => {
  res.json({
    success: true,
    data: {
      count: 3,
      applications: [
        {
          id: '1',
          jobTitle: 'Software Engineer',
          company: 'Google',
          appliedAt: new Date().toISOString(),
          status: 'applied'
        },
        {
          id: '2',
          jobTitle: 'Frontend Developer',
          company: 'Meta',
          appliedAt: new Date().toISOString(),
          status: 'applied'
        },
        {
          id: '3',
          jobTitle: 'Backend Engineer',
          company: 'Amazon',
          appliedAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'applied'
        }
      ]
    }
  });
});

// GET settings
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    data: {
      maxPerDay: 25,
      platforms: ['linkedin', 'indeed'],
      remoteOnly: false,
      easyApplyOnly: true,
      blacklistedCompanies: [],
      preferredIndustries: ['Technology', 'Software']
    }
  });
});

// PUT update settings
router.put('/settings', (req, res) => {
  res.json({
    success: true,
    data: {
      ...req.body,
      updatedAt: new Date().toISOString()
    },
    message: 'Auto-apply settings updated'
  });
});

// GET analytics
router.get('/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      totalApplications: 127,
      totalSessions: 23,
      successRate: 78.5,
      averageResponseTime: '5.2 days',
      topCompanies: [
        { name: 'Google', count: 15 },
        { name: 'Meta', count: 12 },
        { name: 'Amazon', count: 10 }
      ]
    }
  });
});

module.exports = router;
