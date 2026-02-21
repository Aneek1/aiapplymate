import { 
  ScraperOptions, 
  JobListing, 
  UserProfile, 
  ApplicationResult,
  PlatformCredentials 
} from './types';

export interface IJobScraper {
  init(): Promise<void>;
  login(credentials: PlatformCredentials): Promise<{ success: boolean; cookies?: any[]; error?: string }>;
  searchJobs(jobTitles: string[], locations: string[]): Promise<JobListing[]>;
  applyToJob(job: JobListing, profile: UserProfile): Promise<ApplicationResult>;
  close(): Promise<void>;
}

export abstract class BaseScraper implements IJobScraper {
  protected browser: any = null;
  protected page: any = null;
  protected isAuthenticated = false;

  constructor(protected options: ScraperOptions) {}

  abstract init(): Promise<void>;
  abstract login(credentials: PlatformCredentials): Promise<{ success: boolean; cookies?: any[]; error?: string }>;
  abstract searchJobs(jobTitles: string[], locations: string[]): Promise<JobListing[]>;
  abstract applyToJob(job: JobListing, profile: UserProfile): Promise<ApplicationResult>;

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log(`${this.constructor.name} browser closed`);
    }
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms + Math.floor(Math.random() * 1000)));
  }

  protected async humanType(selector: string, text: string): Promise<void> {
    if (!text) return;
    await this.page.click(selector);
    await this.page.evaluate((sel) => {
      const input = document.querySelector(sel) as HTMLInputElement;
      if (input) input.value = '';
    }, selector);
    for (const char of text) {
      await this.page.type(selector, char, { delay: 50 + Math.floor(Math.random() * 100) });
    }
  }
}
