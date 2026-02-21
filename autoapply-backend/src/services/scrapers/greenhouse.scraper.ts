// src/services/scrapers/greenhouse.scraper.ts
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

export class GreenhouseScraper extends BaseScraper {
  async init() {
    this.browser = await puppeteer.launch({
      headless: this.options.headless || false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 800 }
    });

    this.page = await this.browser.newPage();
    console.log('✓ Greenhouse scraper initialized');
  }

  async login(credentials: PlatformCredentials): Promise<{ success: boolean; cookies?: any[]; error?: string }> {
    // Greenhouse is an ATS - companies have their own portals
    // No global login required
    return { success: true };
  }

  async searchJobs(jobTitles: string[], locations: string[]): Promise<JobListing[]> {
    // Greenhouse doesn't have a global job search
    // Jobs are found via Indeed/LinkedIn redirects
    return [];
  }

  async applyToJob(job: JobListing, profile: UserProfile): Promise<ApplicationResult> {
    try {
      console.log(`Greenhouse: Applying to ${job.title} at ${job.company}`);
      
      this.page = await this.browser.newPage();
      await this.page.goto(job.url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Check if it's a Greenhouse job
      const isGreenhouse = await this.page.evaluate(() => {
        return document.body.innerHTML.includes('boards.greenhouse.io');
      });

      if (!isGreenhouse) {
        throw new Error('Not a Greenhouse job board');
      }

      // Wait for form to load
      await this.page.waitForSelector('.application-form', { timeout: 10000 });

      // Fill basic info
      const firstName = await this.page.$('input[name="first_name"]');
      if (firstName) {
        await this.humanType('input[name="first_name"]', profile.fullName.split(' ')[0]);
      }

      const lastName = await this.page.$('input[name="last_name"]');
      if (lastName) {
        await this.humanType('input[name="last_name"]', profile.fullName.split(' ').slice(1).join(' '));
      }

      const email = await this.page.$('input[name="email"]');
      if (email) {
        await this.humanType('input[name="email"]', profile.email);
      }

      const phone = await this.page.$('input[name="phone"]');
      if (phone) {
        await this.humanType('input[name="phone"]', profile.phone);
      }

      // Upload resume
      const resumeUpload = await this.page.$('input[name="resume"]');
      if (resumeUpload) {
        await resumeUpload.uploadFile(profile.resumePath);
        await this.delay(3000);
      }

      // Handle custom questions
      await this.handleCustomQuestions(profile);

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
        platform: 'greenhouse'
      };

    } catch (error) {
      console.error('Greenhouse application failed:', error);
      return {
        success: false,
        company: job.company,
        title: job.title,
        error: error.message,
        platform: 'greenhouse'
      };
    }
  }

  private async handleCustomQuestions(profile: UserProfile) {
    // Handle Yes/No questions
    const yesNoQuestions = await this.page.$$('fieldset');
    for (const question of yesNoQuestions) {
      const legend = await question.$('legend');
      if (legend) {
        const text = await legend.evaluate(el => el.textContent?.toLowerCase() || '');
        
        if (text.includes('sponsor') || text.includes('visa')) {
          const yesRadio = await question.$('input[value="Yes"]');
          if (yesRadio) await yesRadio.click();
        }
        
        if (text.includes('authorized') || text.includes('work in')) {
          const yesRadio = await question.$('input[value="Yes"]');
          if (yesRadio) await yesRadio.click();
        }
        
        if (text.includes('gender') || text.includes('race') || text.includes('veteran')) {
          const preferNotTo = await question.$('input[value="I don\'t wish to answer"]');
          if (preferNotTo) await preferNotTo.click();
        }
      }
    }

    // Handle dropdowns
    const selects = await this.page.$$('select');
    for (const select of selects) {
      const options = await select.$$('option');
      if (options.length > 1) {
        await options[1].click(); // Select first non-default option
      }
    }
  }
}