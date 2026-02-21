import { IJobScraper } from './base.scraper';
import { LinkedInScraper } from './linkedin.service';
import { 
  ScraperOptions, 
  JobListing, 
  UserProfile, 
  ApplicationResult,
  PlatformCredentials 
} from './types';

export type JobPlatform = 'linkedin' | 'indeed' | 'greenhouse' | 'lever';

export class ScraperFactory {
  static createScraper(platform: JobPlatform, options: ScraperOptions): IJobScraper {
    switch (platform) {
      case 'linkedin':
        return new LinkedInScraper(options);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}

export class MultiPlatformScraper {
  private scrapers: Map<JobPlatform, IJobScraper> = new Map();

  constructor(private options: ScraperOptions) {}

  async initializePlatforms(platforms: JobPlatform[]) {
    for (const platform of platforms) {
      const scraper = ScraperFactory.createScraper(platform, this.options);
      await scraper.init();
      this.scrapers.set(platform, scraper);
    }
  }

  async loginToPlatform(platform: JobPlatform, credentials: PlatformCredentials) {
    const scraper = this.scrapers.get(platform);
    if (!scraper) throw new Error(`Scraper for ${platform} not initialized`);
    return await scraper.login(credentials);
  }

  async searchAllPlatforms(jobTitles: string[], locations: string[]): Promise<JobListing[]> {
    const allJobs: JobListing[] = [];
    for (const [platform, scraper] of this.scrapers) {
      try {
        const jobs = await scraper.searchJobs(jobTitles, locations);
        allJobs.push(...jobs);
      } catch (error) {
        console.error(`Failed to search ${platform}:`, error.message);
      }
    }
    return allJobs;
  }

  async applyToJobAcrossPlatforms(job: JobListing, profile: UserProfile): Promise<ApplicationResult> {
    const scraper = this.scrapers.get(job.platform as JobPlatform);
    if (!scraper) {
      return { success: false, company: job.company, title: job.title, error: `No scraper for ${job.platform}`, platform: job.platform };
    }
    return await scraper.applyToJob(job, profile);
  }

  async closeAll() {
    for (const scraper of this.scrapers.values()) {
      await scraper.close();
    }
  }
}
