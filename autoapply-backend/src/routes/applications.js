const express = require('express');
const router = express.Router();

// GET all applications for user
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        jobTitle: 'Software Engineer',
        company: 'Google',
        location: 'San Francisco, CA',
        appliedAt: new Date().toISOString(),
        status: 'applied',
        platform: 'linkedin'
      },
      {
        id: '2',
        jobTitle: 'Full Stack Developer',
        company: 'Meta',
        location: 'Remote',
        appliedAt: new Date().toISOString(),
        status: 'applied',
        platform: 'linkedin'
      }
    ]
  });
});

// GET single application
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      jobTitle: 'Software Engineer',
      company: 'Google',
      location: 'San Francisco, CA',
      appliedAt: new Date().toISOString(),
      status: 'applied',
      platform: 'linkedin',
      jobUrl: 'https://linkedin.com/jobs/view/123'
    }
  });
});

// POST create new application
router.post('/', (req, res) => {
  const { jobTitle, company, location, jobUrl, platform } = req.body;
  
  res.json({
    success: true,
    data: {
      id: Date.now().toString(),
      jobTitle,
      company,
      location,
      jobUrl,
      platform,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      userId: req.user?.id || 'test-user-123'
    },
    message: 'Application recorded successfully'
  });
});

// PUT update application status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  
  res.json({
    success: true,
    data: {
      id: req.params.id,
      status: status || 'updated',
      updatedAt: new Date().toISOString()
    },
    message: `Application status updated to ${status || 'updated'}`
  });
});

// GET applications by date range
router.get('/range/:start/:end', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        jobTitle: 'Software Engineer',
        company: 'Google',
        appliedAt: new Date().toISOString(),
        status: 'applied'
      }
    ]
  });
});

// GET today's applications
router.get('/today', (req, res) => {
  res.json({
    success: true,
    data: {
      count: 2,
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
          jobTitle: 'Full Stack Developer',
          company: 'Meta',
          appliedAt: new Date().toISOString(),
          status: 'applied'
        }
      ]
    }
  });
});

// GET applications stats
router.get('/stats/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      total: 10,
      today: 2,
      thisWeek: 5,
      thisMonth: 8,
      successRate: 80,
      byPlatform: {
        linkedin: 8,
        indeed: 2
      }
    }
  });
});

module.exports = router;
