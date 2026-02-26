// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Generic fetch wrapper
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; pagination?: any }> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend server. Please make sure the backend is running on http://localhost:5000');
    }
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) =>
    fetchAPI<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    fetchAPI<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    fetchAPI<{ user: User }>('/auth/me'),

  updateProfile: (updates: Partial<User>) =>
    fetchAPI<{ user: User }>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// User API
export const userAPI = {
  getStats: () =>
    fetchAPI<UserStats>('/users/stats'),

  getActivity: () =>
    fetchAPI<ActivityItem[]>('/users/activity'),
};

// Resume API
export const resumeAPI = {
  getAll: () =>
    fetchAPI<Resume[]>('/resumes'),

  getById: (id: string) =>
    fetchAPI<Resume>(`/resumes/${id}`),

  create: (data: Partial<Resume>) =>
    fetchAPI<Resume>('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  upload: async (file: File, name: string) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('name', name);

    const response = await fetch(`${API_BASE_URL}/resumes/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken() || ''}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  update: (id: string, data: Partial<Resume>) =>
    fetchAPI<Resume>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/resumes/${id}`, {
      method: 'DELETE',
    }),

  setDefault: (id: string) =>
    fetchAPI<Resume>(`/resumes/${id}/set-default`, {
      method: 'POST',
    }),

  optimize: (id: string, jobTitle?: string, jobDescription?: string) =>
    fetchAPI<{ resume: Resume; optimization: OptimizationResult }>(
      `/resumes/${id}/optimize`,
      {
        method: 'POST',
        body: JSON.stringify({ jobTitle, jobDescription }),
      }
    ),

  tailor: (data: { resumeText: string; jobDescription: string; jobTitle: string; company: string }) =>
    fetchAPI<any>('/gemini/tailor-resume', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateCoverLetter: (data: { resumeText: string; jobDescription: string; jobTitle: string; company: string }) =>
    fetchAPI<any>('/gemini/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  saveTailored: (data: any) =>
    fetchAPI<any>('/gemini/save-tailored', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  tailorFull: (data: { resumeText: string; jobDescription: string; jobTitle: string; company: string }) =>
    fetchAPI<any>('/gemini/tailor-full', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  downloadTailoredResume: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/gemini/download-tailored-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken() || ''}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  },

  downloadCoverLetter: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/gemini/download-cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken() || ''}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  },
};

// Application API
export const applicationAPI = {
  getAll: (params?: { status?: string; page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    return fetchAPI<Application[]>(`/applications?${queryParams.toString()}`);
  },

  getStats: () =>
    fetchAPI<ApplicationStats>('/applications/stats/overview'),

  getById: (id: string) =>
    fetchAPI<Application>(`/applications/${id}`),

  create: (data: Partial<Application>) =>
    fetchAPI<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Application>) =>
    fetchAPI<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/applications/${id}`, {
      method: 'DELETE',
    }),

  addInterview: (id: string, interview: Partial<Interview>) =>
    fetchAPI<Application>(`/applications/${id}/interviews`, {
      method: 'POST',
      body: JSON.stringify(interview),
    }),

  addNote: (id: string, content: string) =>
    fetchAPI<Application>(`/applications/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  getUpcomingInterviews: () =>
    fetchAPI<UpcomingInterview[]>('/applications/upcoming/interviews'),
};

// Preference API
export const preferenceAPI = {
  get: () =>
    fetchAPI<Preference>('/preferences'),

  update: (data: Partial<Preference>) =>
    fetchAPI<Preference>('/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleAutoApply: (enabled: boolean) =>
    fetchAPI<Preference>('/preferences/auto-apply', {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }),

  getMatches: () =>
    fetchAPI<{ matches: JobMatch[]; total: number }>('/preferences/matches'),
};

// AutoApply API
export const autoApplyAPI = {
  getStatus: () =>
    fetchAPI<AutoApplyStatus>('/autoapply/status'),

  start: () =>
    fetchAPI<{ applied: number; applications: Application[] }>(
      '/autoapply/start',
      { method: 'POST' }
    ),

  pause: () =>
    fetchAPI('/autoapply/pause', { method: 'POST' }),

  resume: () =>
    fetchAPI('/autoapply/resume', { method: 'POST' }),

  getHistory: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return fetchAPI(`/autoapply/history?${params.toString()}`);
  },

  getQueue: () =>
    fetchAPI<{ queue: QueuedJob[]; total: number }>('/autoapply/queue'),
};

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  linkedinUrl?: string;
  portfolioUrl?: string;
  headline?: string;
  summary?: string;
  subscription: {
    plan: 'free' | 'pro' | 'premium';
    startDate?: string;
    endDate?: string;
  };
  stats: {
    totalApplications: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
}

export interface UserStats {
  overview: User['stats'];
  recentActivity: {
    applicationsThisMonth: number;
    interviewsThisMonth: number;
  };
}

export interface ActivityItem {
  _id: string;
  company: { name: string };
  position: { title: string };
  status: string;
  lastActivityAt: string;
}

export interface Resume {
  _id: string;
  user: string;
  name: string;
  isDefault: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: 'pdf' | 'docx' | 'txt';
  headline?: string;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  atsScore?: number;
  aiOptimized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface OptimizationResult {
  atsScore: number;
  keywords: string[];
  suggestions: string[];
}

export interface Application {
  _id: string;
  user: string;
  resume?: string;
  company: {
    name: string;
    website?: string;
    logo?: string;
    size?: 'startup' | 'small' | 'mid' | 'large' | 'enterprise';
    industry?: string;
  };
  position: {
    title: string;
    department?: string;
    level?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
    type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
    location: {
      city?: string;
      state?: string;
      country?: string;
      isRemote: boolean;
      remoteType?: 'fully-remote' | 'hybrid' | 'onsite';
    };
    salary?: {
      min?: number;
      max?: number;
      currency?: string;
      period?: string;
    };
  };
  jobUrl?: string;
  jobDescription?: string;
  status: 'saved' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  stage: string;
  source: 'autoapply' | 'manual' | 'referral' | 'jobboard' | 'linkedin' | 'company';
  appliedAt: string;
  lastActivityAt: string;
  coverLetter?: string;
  contacts?: Contact[];
  interviews?: Interview[];
  notes?: Note[];
  nextStep?: string;
  nextStepDate?: string;
  matchScore?: number;
}

export interface Contact {
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

export interface Interview {
  _id: string;
  round: number;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'final';
  scheduledAt: string;
  completedAt?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  feedback?: string;
}

export interface Note {
  content: string;
  createdAt: string;
}

export interface UpcomingInterview {
  applicationId: string;
  company: Application['company'];
  position: Application['position'];
  interview: Interview;
}

export interface ApplicationStats {
  statusCounts: Record<string, number>;
  total: number;
  weeklyApplications: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Preference {
  _id: string;
  user: string;
  jobTitles: string[];
  industries: string[];
  jobTypes: string[];
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  locations: { city: string; state: string; country: string }[];
  remotePreference: 'remote-only' | 'hybrid' | 'onsite' | 'no-preference';
  willingToRelocate: boolean;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  companySizes: ('startup' | 'small' | 'mid' | 'large' | 'enterprise')[];
  preferredCompanies: { name: string; website?: string }[];
  excludedCompanies: { name: string; reason?: string }[];
  skills: { name: string; isRequired: boolean }[];
  autoApply: {
    enabled: boolean;
    maxApplicationsPerDay: number;
    minMatchScore: number;
    applyOnWeekends: boolean;
    preferredTimes: { day: string; startTime: string; endTime: string }[];
    excludeRecruiters: boolean;
    requireSalary: boolean;
    maxApplicationsPerCompany: number;
  };
  notifications: {
    email: {
      dailySummary: boolean;
      newMatches: boolean;
      applicationUpdates: boolean;
      interviewReminders: boolean;
    };
    push: {
      enabled: boolean;
      newMatches: boolean;
      interviewReminders: boolean;
    };
  };
  isActive: boolean;
}

export interface JobMatch {
  id: string;
  company: {
    name: string;
    size: string;
    industry: string;
  };
  position: {
    title: string;
    level: string;
    type: string;
    location: {
      city: string;
      state: string;
      isRemote: boolean;
    };
    salary: {
      min: number;
      max: number;
    };
  };
  matchScore: number;
  matchedSkills: string[];
  postedAt: string;
}

export interface AutoApplyStatus {
  enabled: boolean;
  config: Preference['autoApply'];
  stats: {
    today: number;
    thisWeek: number;
    maxPerDay: number;
  };
}

export interface QueuedJob {
  id: string;
  company: { name: string };
  position: { title: string };
  scheduledFor: string;
  status: string;
}
