// Test the scrapers
async function test() {
  console.log('🚀 Testing scrapers...\n');
  
  try {
    // Import the compiled files
    const { LinkedInScraper } = require('./dist/services/scrapers/linkedin.service.js');
    
    const scraper = new LinkedInScraper({ headless: true });
    await scraper.init();
    console.log('✅ LinkedIn scraper initialized\n');
    
    // Mock login
    await scraper.login({
      platform: 'linkedin',
      username: 'test@example.com',
      password: 'password'
    });
    console.log('✅ Login successful\n');
    
    // Search for jobs (mock)
    const jobs = await scraper.searchJobs(['Software Engineer'], ['San Francisco']);
    console.log(`📊 Found ${jobs.length} jobs\n`);
    
    await scraper.close();
    console.log('✅ Test passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();
