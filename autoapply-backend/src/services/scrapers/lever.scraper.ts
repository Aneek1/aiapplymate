// src/services/scrapers/lever.scraper.ts
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BaseScraper } from './base.scraper';
import { 
  ScraperOptions, 
  JobListing, 
  UserProfile, 
  ApplicationResult,
  PlatformCredentials 
} from './types';

puppeteer.use(StealthPlugin());

export class LeverScraper extends BaseScraper {
  async init() {
    this.browser = await puppeteer.launch({
      headless: this.options.headless || false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 800 }
    });

    this.page = await this.browser.newPage();
    console.log('✓ Lever scraper initialized');
  }

  async login(credentials: PlatformCredentials): Promise<{ success: boolean; cookies?: any[]; error?: string }> {
    return { success: true };
  }

  async searchJobs(jobTitles: string[], locations: string[]): Promise<JobListing[]> {
    return [];
  }

  async applyToJob(job: JobListing, profile: UserProfile): Promise<ApplicationResult> {
    try {
      console.log(`Lever: Applying to ${job.title} at ${job.company}`);
      
      this.page = await this.browser.newPage();
      await this.page.goto(job.url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Check if it's a Lever job
      const isLever = await this.page.evaluate(() => {
        return document.body.innerHTML.includes('hire.lever.co');
      });

      if (!isLever) {
        throw new Error('Not a Lever job board');
      }

      // Click apply button
      const applyButton = await this.page.$('.template-btn-submit, button[type="submit"]');
      if (!applyButton) {
        throw new Error('Apply button not found');
      }

      await applyButton.click();
      await this.delay(3000);

      // Wait for application form
      await this.page.waitForSelector('.application-form', { timeout: 10000 });

      // Fill name
      const nameInput = await this.page.$('input[name="name"]');
      if (nameInput) {
        await this.humanType('input[name="name"]', profile.fullName);
      }

      // Fill email
      const emailInput = await this.page.$('input[name="email"]');
      if (emailInput) {
        await this.humanType('input[name="email"]', profile.email);
      }

      // Fill phone
      const phoneInput = await this.page.$('input[name="phone"]');
      if (phoneInput) {
        await this.humanType('input[name="phone"]', profile.phone);
      }

      // Upload resume
      const resumeUpload = await this.page.$('input[type="file"]');
      if (resumeUpload) {
        await resumeUpload.uploadFile(profile.resumePath);
        await this.delay(3000);
      }

      // Submit application
      const submitButton = await this.page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await this.delay(5000);
      }

      await this.page.close();

      return {
        success: true,
        company: job.company,
        title: job.title,
        appliedAt: new Date().toISOString(),
        platform: 'lever'
      };

    } catch (error) {
      console.error('Lever application failed:', error);
      return {
        success: false,
        company: job.company,
        title: job.title,
        error: error.message,
        platform: 'lever'
      };
    }
  }
}