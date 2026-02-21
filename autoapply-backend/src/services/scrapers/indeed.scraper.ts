// src/services/scrapers/indeed.scraper.ts
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';
import { BaseScraper } from './base.scraper';
import { 
  ScraperOptions, 
  JobListing, 
  UserProfile, 
  ApplicationResult,
  PlatformCredentials 
} from './types';

puppeteer.use(StealthPlugin());

export class IndeedScraper extends BaseScraper {
  async init() {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' });
    
    this.browser = await puppeteer.launch({
      headless: this.options.headless || false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled',
        `--window-size=1280,800`
      ],
      defaultViewport: null
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent(userAgent.toString());
    await this.page.setViewport({
      width: 1280 + Math.floor(Math.random() * 100),
      height: 800 + Math.floor(Math.random() * 100)
    });

    console.log('✓ Indeed scraper initialized');
  }

  async login(credentials: PlatformCredentials): Promise<{ success: boolean; cookies?: any[]; error?: string }> {
    try {
      console.log('Logging into Indeed...');
      
      await this.page.goto('https://secure.indeed.com/account/login', {
        waitUntil: 'networkidle2',
        timeout: this.options.timeout || 30000
      });

      // Wait for email field
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.humanType('input[name="email"]', credentials.username);
      
      await this.page.click('button[type="submit"]');
      await this.delay(2000);

      // Wait for password field
      await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });
      await this.humanType('input[name="password"]', credentials.password);
      
      await this.page.click('button[type="submit"]');
      
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
      
      this.isAuthenticated = true;
      console.log('✓ Indeed login successful');
      
      const cookies = await this.page.cookies();
      return { success: true, cookies };
    } catch (error) {
      console.error('Indeed login failed:', error);
      return { success: false, error: error.message };
    }
  }

  async searchJobs(jobTitles: string[], locations: string[]): Promise<JobListing[]> {
    if (!this.isAuthenticated) {
      throw new Error('Must login first');
    }

    const allJobs: JobListing[] = [];

    for (const title of jobTitles) {
      for (const location of locations) {
        console.log(`Indeed: Searching for "${title}" in "${location}"...`);
        
        const encodedTitle = encodeURIComponent(title);
        const encodedLocation = encodeURIComponent(location);
        
        const searchUrl = `https://www.indeed.com/jobs?q=${encodedTitle}&l=${encodedLocation}&sort=date`;
        
        await this.page.goto(searchUrl, {
          waitUntil: 'networkidle2',
          timeout: this.options.timeout || 30000
        });

        try {
          await this.page.waitForSelector('#mosaic-jobResults', { timeout: 10000 });
        } catch (e) {
          console.log('No jobs found on Indeed');
          continue;
        }

        await this.autoScroll();
        await this.delay(2000);

        const jobs = await this.extractJobListings();
        allJobs.push(...jobs);
        
        console.log(`Indeed: Found ${jobs.length} jobs`);
        await this.delay(3000);
      }
    }

    return allJobs;
  }

  private async extractJobListings(): Promise<JobListing[]> {
    return await this.page.evaluate(() => {
      const jobs: any[] = [];
      const jobCards = document.querySelectorAll('.job_seen_beacon');
      
      jobCards.forEach((card) => {
        const titleEl = card.querySelector('h2 a span');
        const companyEl = card.querySelector('.companyName');
        const locationEl = card.querySelector('.companyLocation');
        const linkEl = card.querySelector('h2 a');
        const salaryEl = card.querySelector('.salary-snippet');
        const descEl = card.querySelector('.job-snippet');
        
        jobs.push({
          title: titleEl?.textContent?.trim() || '',
          company: companyEl?.textContent?.trim() || '',
          location: locationEl?.textContent?.trim() || '',
          url: linkEl ? 'https://www.indeed.com' + linkEl.getAttribute('href') : '',
          easyApply: false, // Indeed doesn't have Easy Apply
          platform: 'indeed',
          description: descEl?.textContent?.trim() || '',
          salary: salaryEl?.textContent?.trim(),
          scrapedAt: new Date().toISOString(),
          jobId: linkEl?.getAttribute('href')?.split('?')[0].split('/').pop() || ''
        });
      });
      
      return jobs;
    });
  }

  async applyToJob(job: JobListing, profile: UserProfile): Promise<ApplicationResult> {
    try {
      console.log(`Indeed: Applying to ${job.title} at ${job.company}`);
      
      this.page = await this.browser.newPage();
      await this.page.goto(job.url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Click apply button
      const applyButton = await this.page.$('#applyButton');
      if (!applyButton) {
        throw new Error('Apply button not found - external redirect');
      }

      await applyButton.click();
      await this.delay(3000);

      // Check if it's an external ATS
      const currentUrl = this.page.url();
      if (currentUrl.includes('greenhouse') || currentUrl.includes('lever')) {
        return {
          success: false,
          company: job.company,
          title: job.title,
          error: 'External ATS - handle separately',
          platform: 'indeed'
        };
      }

      // Handle Indeed's internal application
      await this.page.waitForSelector('form', { timeout: 10000 });
      
      // Fill basic info
      const nameInput = await this.page.$('input[name*="name"]');
      if (nameInput) {
        await this.humanType('input[name*="name"]', profile.fullName);
      }

      const emailInput = await this.page.$('input[type="email"]');
      if (emailInput) {
        await this.humanType('input[type="email"]', profile.email);
      }

      const phoneInput = await this.page.$('input[type="tel"]');
      if (phoneInput) {
        await this.humanType('input[type="tel"]', profile.phone);
      }

      // Upload resume
      const resumeUpload = await this.page.$('input[type="file"]');
      if (resumeUpload) {
        await resumeUpload.uploadFile(profile.resumePath);
        await this.delay(2000);
      }

      // Submit application
      const submitButton = await this.page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await this.delay(3000);
      }

      await this.page.close();

      return {
        success: true,
        company: job.company,
        title: job.title,
        appliedAt: new Date().toISOString(),
        platform: 'indeed'
      };

    } catch (error) {
      console.error('Indeed application failed:', error);
      return {
        success: false,
        company: job.company,
        title: job.title,
        error: error.message,
        platform: 'indeed'
      };
    }
  }

  private async autoScroll() {
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve(true);
          }
        }, 200);
      });
    });
  }
}