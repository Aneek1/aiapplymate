const express = require('express');
const router = express.Router();
const { LinkedInScraper } = require('../services/scrapers/linkedin.service');

router.post('/start', async (req, res) => {
  try {
    const { preferences, credentials, resumePath, phone } = req.body;
    
    console.log('\n🚀🚀🚀 STARTING REAL AUTO-APPLY 🚀🚀🚀');
    console.log(`📋 Jobs: ${preferences.jobTitles?.join(', ')}`);
    console.log(`📍 Locations: ${preferences.locations?.map(l => `${l.city}, ${l.state}`).join(', ')}`);
    
    const scraper = new LinkedInScraper({ headless: false, timeout: 60000 });
    await scraper.init();
    
    console.log('🔑 Logging into LinkedIn...');
    const login = await scraper.login({
      platform: 'linkedin',
      username: credentials.email,
      password: credentials.password
    });
    
    if (!login.success) throw new Error('Login failed');
    console.log('✅ Logged in!');
    
    res.json({ 
      success: true, 
      message: '✅ Auto-apply started! Watch the Chrome window.',
      data: { status: 'running' }
    });
    
    setTimeout(async () => {
      try {
        const locations = preferences.locations?.map(l => `${l.city}, ${l.state}`) || 
          ['San Francisco, CA', 'Remote', 'New York, NY'];
        
        const jobs = await scraper.searchJobs(preferences.jobTitles || ['Software Engineer'], locations);
        const easyApplyJobs = jobs.filter(j => j.easyApply);
        
        console.log(`\n📊 Found ${easyApplyJobs.length} Easy Apply jobs`);
        
        let applied = 0;
        for (let i = 0; i < Math.min(easyApplyJobs.length, 5); i++) {
          const job = easyApplyJobs[i];
          const result = await scraper.applyToJob(job, {
            fullName: req.body.fullName || 'Test User',
            email: credentials.email,
            linkedinEmail: credentials.email,
            linkedinPassword: credentials.password,
            phone: phone || '555-123-4567',
            location: job.location,
            resumePath: resumePath || './uploads/resume.pdf'
          });
          
          if (result.success) {
            applied++;
            console.log(`✅ [${i+1}/${easyApplyJobs.length}] Applied to ${job.company}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 15000));
        }
        
        console.log(`\n🎉 Completed! Applied to ${applied} jobs`);
        await scraper.close();
        
      } catch (error) {
        console.error('Auto-apply error:', error);
        await scraper.close();
      }
    }, 2000);
    
  } catch (error) {
    console.error('Failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
