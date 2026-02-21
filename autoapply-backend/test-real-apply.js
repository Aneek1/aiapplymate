const { LinkedInScraper } = require('./dist/services/scrapers/linkedin.service');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  console.log('\n🔥🔥🔥 REAL LINKEDIN AUTO-APPLY TEST 🔥🔥🔥\n');
  
  const email = await new Promise(r => rl.question('📧 LinkedIn Email: ', r));
  const password = await new Promise(r => rl.question('🔑 LinkedIn Password: ', r));
  const resume = await new Promise(r => rl.question('📄 Full path to resume PDF: ', r));
  
  const scraper = new LinkedInScraper({ headless: false });
  
  try {
    await scraper.init();
    console.log('\n✅ Scraper ready');
    
    const login = await scraper.login({ platform: 'linkedin', username: email, password });
    if (!login.success) throw new Error('Login failed');
    
    const jobs = await scraper.searchJobs(['Software Engineer'], ['San Francisco']);
    const easyJobs = jobs.filter(j => j.easyApply);
    
    console.log(`\n📊 Found ${easyJobs.length} Easy Apply jobs`);
    
    if (easyJobs.length > 0) {
      const job = easyJobs[0];
      console.log(`\n🎯 Testing: ${job.title} at ${job.company}`);
      
      const confirm = await new Promise(r => rl.question('\n⚠️ Apply for real? (yes/no): ', r));
      
      if (confirm === 'yes') {
        const result = await scraper.applyToJob(job, {
          fullName: 'Test User',
          email,
          linkedinEmail: email,
          linkedinPassword: password,
          phone: '555-123-4567',
          location: 'San Francisco, CA',
          resumePath: resume
        });
        
        if (result.success) {
          console.log('\n✅✅✅ APPLICATION SUBMITTED! ✅✅✅');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await scraper.close();
    rl.close();
  }
}

main();
