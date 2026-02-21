export interface ScraperOptions {
  headless?: boolean;
  timeout?: number;
  proxy?: string;
  debug?: boolean;
}

export interface BrowserConfig {
  headless: boolean;
  viewportWidth: number;
  viewportHeight: number;
  userAgent?: string;
  stealth: boolean;
  proxy?: string;
  timeout: number;
  actionDelay: number;
  devtools: boolean;
}

export interface UserProfile {
  fullName: string;
  email: string;
  linkedinEmail: string;
  linkedinPassword: string;
  indeedEmail?: string;
  indeedPassword?: string;
  phone: string;
  location: string;
  resumePath: string;
  workAuthorization?: string;
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  yearsOfExperience?: number;
  education?: string;
  skills?: string[];
  languages?: string[];
}

export interface JobListing {
  title: string;
  company: string;
  location: string;
  url: string;
  easyApply: boolean;
  platform: string;
  description?: string;
  salary?: string;
  jobType?: string;
  scrapedAt: string;
  jobId?: string;
  companyLogo?: string;
  experienceRequired?: string;
  skills?: string[];
  postedDate?: string;
  numApplicants?: string;
  applicationDeadline?: string;
  benefits?: string[];
  workType?: 'remote' | 'onsite' | 'hybrid' | 'unspecified';
}

export interface ApplicationResult {
  success: boolean;
  company: string;
  title: string;
  appliedAt?: string;
  error?: string;
  reason?: string;
  applicationId?: string;
  jobUrl?: string;
  platform?: string;
}

export interface PlatformCredentials {
  platform: string;
  username: string;
  password: string;
  cookies?: any[];
  lastLogin?: string;
  isValid?: boolean;
}

export interface ScrapingJobConfig {
  jobTitles: string[];
  locations: string[];
  maxJobs?: number;
  easyApplyOnly?: boolean;
  datePosted?: '24h' | 'week' | 'month' | 'any';
  experienceLevel?: string[];
  jobType?: string[];
  industries?: string[];
  companySize?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  remotePreference?: 'remote' | 'hybrid' | 'onsite' | 'any';
  platforms?: string[];
}

export interface ApplicationAnalytics {
  totalApplications: number;
  successful: number;
  failed: number;
  byPlatform: Record<string, number>;
  byDate: Record<string, number>;
  failureReasons: Record<string, number>;
  topCompanies: Array<{ name: string; count: number }>;
  averageApplyTimeMs: number;
  successRate: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  delayBetweenRequests: number;
  maxApplicationsPerDay: number;
  cooldownPeriod: number;
  maxConcurrentSessions: number;
}

export interface AutoApplySession {
  id: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  config: ScrapingJobConfig;
  jobsFound: number;
  easyApplyJobs: number;
  applicationsSubmitted: number;
  failures: number;
  skipped: number;
  error?: string;
  results?: ApplicationResult[];
}

export interface ResumeData {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  parsedText?: string;
  extractedSkills?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export enum ScraperErrorType {
  AUTHENTICATION = 'authentication_failed',
  NETWORK = 'network_error',
  TIMEOUT = 'timeout',
  NOT_FOUND = 'not_found',
  RATE_LIMIT = 'rate_limited',
  CAPTCHA = 'captcha_detected',
  UNKNOWN = 'unknown_error'
}

export interface ScraperError {
  type: ScraperErrorType;
  message: string;
  stack?: string;
  timestamp: string;
  context?: Record<string, any>;
}

export interface ApplicationTemplate {
  id: string;
  name: string;
  coverLetter?: string;
  commonAnswers?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}
