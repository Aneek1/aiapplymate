import { MultiPlatformScraper } from './services/scrapers/scraper.factory';

async function test() {
  console.log('🚀 Testing MultiPlatformScraper...\n');
  
  const scraper = new MultiPlatformScraper({ headless: true });
  
  try {
    // Initialize LinkedIn
    await scraper.initializePlatforms(['linkedin']);
    console.log('✅ Platforms initialized\n');
    
    // Search for jobs
    const jobs = await scraper.searchAllPlatforms(
      ['Software Engineer', 'Full Stack Developer'],
      ['San Francisco, CA', 'Remote']
    );
    
    console.log(`📊 Found ${jobs.length} total jobs\n`);
    console.log('📋 First 3 jobs:');
    jobs.slice(0, 3).forEach((job, i) => {
      console.log(`  ${i + 1}. ${job.title} at ${job.company}`);
      console.log(`     ${job.location} - Easy Apply: ${job.easyApply ? '✅' : '❌'}\n`);
    });
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await scraper.closeAll();
  }
}

test();
