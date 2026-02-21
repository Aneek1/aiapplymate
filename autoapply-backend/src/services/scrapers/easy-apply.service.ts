import { JobListing, UserProfile, ApplicationResult } from './types';

export class EasyApplyService {
  private page: any;

  constructor(private browser: any) {}

  async applyToJob(job: JobListing, profile: UserProfile): Promise<ApplicationResult> {
    if (!job.easyApply) {
      return {
        success: false,
        company: job.company,
        title: job.title,
        error: 'Not an Easy Apply job',
        platform: job.platform,
        reason: 'skipped',
        jobUrl: job.url
      };
    }

    try {
      console.log(`Applying to ${job.title} at ${job.company}...`);
      
      this.page = await this.browser.newPage();
      await this.page.goto(job.url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Click Easy Apply button
      const easyApplyButton = await this.page.$('.jobs-apply-button--easy-apply button');
      
      if (!easyApplyButton) {
        throw new Error('Easy Apply button not found');
      }

      await easyApplyButton.click();
      await this.delay(3000);

      // Handle the application modal
      let isLastStep = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isLastStep && attempts < maxAttempts) {
        attempts++;
        
        // Check if we need to upload resume
        const resumeUpload = await this.page.$('input[type="file"]');
        if (resumeUpload && profile.resumePath) {
          await resumeUpload.uploadFile(profile.resumePath);
          await this.delay(2000);
        }

        // Check for text inputs
        const textInputs = await this.page.$$('input[type="text"], textarea');
        for (const input of textInputs) {
          const placeholder = await input.evaluate(el => el.placeholder?.toLowerCase() || '');
          const id = await input.evaluate(el => el.id?.toLowerCase() || '');
          const name = await input.evaluate(el => el.name?.toLowerCase() || '');
          
          if (placeholder.includes('phone') || id.includes('phone') || name.includes('phone')) {
            await input.type(profile.phone || '', { delay: 30 });
          } else if (placeholder.includes('city') || placeholder.includes('location')) {
            await input.type(profile.location || '', { delay: 30 });
          }
        }

        // Check for next/submit button
        const submitButton = await this.page.$('button[aria-label="Submit"]');
        if (submitButton) {
          await submitButton.click();
          isLastStep = true;
          console.log(`✓ Successfully applied to ${job.title} at ${job.company}`);
        } else {
          const nextButton = await this.page.$('button[aria-label="Next"]');
          if (nextButton) {
            await nextButton.click();
          } else {
            break;
          }
        }
        await this.delay(2000);
      }

      await this.page.close();

      return {
        success: true,
        company: job.company,
        title: job.title,
        appliedAt: new Date().toISOString(),
        platform: job.platform,
        jobUrl: job.url
      };

    } catch (error) {
      console.error('Application failed:', error);
      if (this.page) await this.page.close();
      return {
        success: false,
        company: job.company,
        title: job.title,
        error: error.message,
        platform: job.platform,
        jobUrl: job.url
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
