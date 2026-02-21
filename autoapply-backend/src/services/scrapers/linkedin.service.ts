import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';
import { BaseScraper, IJobScraper } from './base.scraper';
import { 
  ScraperOptions, 
  JobListing, 
  UserProfile, 
  ApplicationResult, 
  PlatformCredentials 
} from './types';

puppeteer.use(StealthPlugin());

export class LinkedInScraper extends BaseScraper implements IJobScraper {
  async init() {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' });
    
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--start-maximized'
      ],
      defaultViewport: null,
      ignoreDefaultArgs: ['--enable-automation']
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent(userAgent.toString());
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setJavaScriptEnabled(true);
    
    console.log('✅ LinkedIn scraper initialized - Browser will open visibly');
  }

  async login(credentials: PlatformCredentials): Promise<{ success: boolean; cookies?: any[]; error?: string }> {
    try {
      console.log('🔑 Logging into LinkedIn...');
      
      await this.page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
      await this.page.waitForSelector('#username', { timeout: 10000 });
      
      await this.page.type('#username', credentials.username, { delay: 50 });
      await this.page.type('#password', credentials.password, { delay: 50 });
      await this.page.click('button[type="submit"]');
      
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
      
      this.isAuthenticated = true;
      console.log('✅ LinkedIn login successful');
      return { success: true, cookies: await this.page.cookies() };
    } catch (error) {
      console.error('❌ LinkedIn login failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async searchJobs(jobTitles: string[], locations: string[]): Promise<JobListing[]> {
    if (!this.isAuthenticated) throw new Error('Must login first');

    const allJobs: JobListing[] = [];

    for (const title of jobTitles) {
      for (const location of locations) {
        console.log(`🔍 Searching: "${title}" in "${location}"...`);
        
        const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}&f_AL=true&sortBy=DD`;
        
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        
        try {
          await this.page.waitForSelector('.jobs-search__results-list', { timeout: 15000 });
        } catch {
          console.log('⏳ No jobs found, continuing...');
          continue;
        }

        await this.autoScroll();
        await this.delay(3000);

        const jobs = await this.page.evaluate(() => {
          return Array.from(document.querySelectorAll('.job-search-card')).map(card => ({
            title: card.querySelector('.base-search-card__title')?.textContent?.trim() || '',
            company: card.querySelector('.base-search-card__subtitle')?.textContent?.trim() || '',
            location: card.querySelector('.job-search-card__location')?.textContent?.trim() || '',
            url: card.querySelector('a.base-card__full-link')?.getAttribute('href') || '',
            easyApply: !!card.querySelector('.jobs-apply-button--easy-apply'),
            platform: 'linkedin',
            postedDate: card.querySelector('.job-search-card__listdate')?.textContent?.trim() || '',
            scrapedAt: new Date().toISOString()
          }));
        });

        console.log(`✅ Found ${jobs.length} jobs`);
        allJobs.push(...jobs);
        await this.delay(5000);
      }
    }

    return allJobs;
  }

  async applyToJob(job: JobListing, profile: UserProfile): Promise<ApplicationResult> {
    if (!job.easyApply) {
      return { success: false, company: job.company, title: job.title, error: 'Not Easy Apply', platform: 'linkedin', jobUrl: job.url };
    }

    let page = null;
    
    try {
      console.log(`\n🤖 APPLYING TO: ${job.title} at ${job.company}`);
      
      page = await this.browser.newPage();
      await page.goto(job.url, { waitUntil: 'networkidle2' });

      await page.waitForSelector('.jobs-apply-button--easy-apply button', { timeout: 10000 });
      const applyBtn = await page.$('.jobs-apply-button--easy-apply button');
      await applyBtn.click();
      console.log('✅ Clicked Easy Apply');
      await this.delay(3000);

      let step = 1;
      let submitted = false;

      while (step <= 10 && !submitted) {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput && profile.resumePath) {
          await fileInput.uploadFile(profile.resumePath);
          console.log('📄 Resume uploaded');
          await this.delay(2000);
        }

        const phoneInput = await page.$('input[type="tel"], input[name*="phone"], input[id*="phone"]');
        if (phoneInput) {
          await phoneInput.click();
          await page.evaluate(() => (document.activeElement as HTMLInputElement).value = '');
          await phoneInput.type(profile.phone || '555-123-4567', { delay: 50 });
          console.log('📱 Phone entered');
        }

        const submitBtn = await page.$('button[aria-label="Submit application"], button[type="submit"]');
        if (submitBtn) {
          await submitBtn.click();
          console.log('✅✅ SUBMITTED APPLICATION! ✅✅');
          submitted = true;
          await this.delay(5000);
          break;
        }

        const nextBtn = await page.$('button[aria-label="Next"]');
        if (nextBtn) {
          await nextBtn.click();
          console.log(`➡️ Step ${step} completed`);
          step++;
          await this.delay(3000);
        } else {
          break;
        }
      }

      await page.close();

      return {
        success: true,
        company: job.company,
        title: job.title,
        appliedAt: new Date().toISOString(),
        platform: 'linkedin',
        jobUrl: job.url
      };

    } catch (error) {
      console.error(`❌ Application failed:`, error.message);
      if (page) await page.close();
      return { success: false, company: job.company, title: job.title, error: error.message, platform: 'linkedin', jobUrl: job.url };
    }
  }

  private async autoScroll() {
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 200;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve(true);
          }
        }, 300);
      });
    });
  }

  async close() {
    await super.close();
  }
}
