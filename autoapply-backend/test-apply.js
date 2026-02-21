const { LinkedInScraper } = require('./dist/services/scrapers/linkedin.service.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function testApply() {
  console.log('🤖 LinkedIn Auto-Apply Test\n');
  
  const email = await askQuestion('Enter LinkedIn email: ');
  const password = await askQuestion('Enter LinkedIn password: ');
  const resumePath = await askQuestion('Enter path to resume (e.g., ./resume.pdf): ');
  
  const scraper = new LinkedInScraper({ 
    headless: false, // Set to false so you can see what's happening
    timeout: 60000,
    debug: true
  });

  try {
    // Initialize
    await scraper.init();
    console.log('\n✅ Scraper initialized');

    // Login
    console.log('\n🔑 Logging in...');
    const loginResult = await scraper.login({
      platform: 'linkedin',
      username: email,
      password: password
    });
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.error);
      return;
    }
    console.log('✅ Login successful');

    // Search for Easy Apply jobs
    console.log('\n🔍 Searching for Easy Apply jobs...');
    const jobs = await scraper.searchJobs(
      ['Software Engineer', 'Full Stack Developer'],
      ['San Francisco Bay Area', 'Remote']
    );
    
    const easyApplyJobs = jobs.filter(j => j.easyApply);
    console.log(`\n📊 Found ${jobs.length} total jobs, ${easyApplyJobs.length} Easy Apply jobs`);

    if (easyApplyJobs.length === 0) {
      console.log('❌ No Easy Apply jobs found');
      return;
    }

    // Show first 5 jobs
    console.log('\n📋 Top 5 Easy Apply jobs:');
    easyApplyJobs.slice(0, 5).forEach((job, i) => {
      console.log(`\n  ${i + 1}. ${job.title} at ${job.company}`);
      console.log(`     📍 ${job.location}`);
      console.log(`     🔗 ${job.url}`);
    });

    // Ask if user wants to apply
    const apply = await askQuestion('\n⚠️  Do you want to apply to the first job? (yes/no): ');
    
    if (apply.toLowerCase() === 'yes') {
      console.log('\n📝 Applying to job...');
      
      const result = await scraper.applyToJob(easyApplyJobs[0], {
        fullName: 'Test User',
        email: email,
        linkedinEmail: email,
        linkedinPassword: password,
        phone: '555-123-4567',
        location: 'San Francisco, CA',
        resumePath: resumePath
      });
      
      if (result.success) {
        console.log('✅ Successfully applied!');
        console.log(`   Applied at: ${result.appliedAt}`);
      } else {
        console.log('❌ Application failed:', result.error);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await scraper.close();
    rl.close();
  }
}

testApply();
