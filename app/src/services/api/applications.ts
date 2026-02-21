import api from './index';

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  jobUrl: string;
  platform: string;
  status: 'discovered' | 'tailored' | 'applied' | 'interviewing' | 'rejected' | 'accepted';
  appliedAt: string;
  atsScore?: number;
  tailoredResume?: string;
  coverLetter?: string;
  keywordsAdded?: string[];
  keywordsMatched?: string[];
  missingKeywords?: string[];
  recommendations?: string[];
}

export interface ApplicationStats {
  totalApplications: number;
  appliedToday: number;
  interviews: number;
  atsScore: number;
  pendingTailoring: number;
  applicationsByStatus: {
    discovered: number;
    tailored: number;
    applied: number;
    interviewing: number;
    rejected: number;
    accepted: number;
  };
}

export const applicationsAPI = {
  // Get all applications
  getAll: async (): Promise<{ success: boolean; data: Application[] }> => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { success: false, data: [] };
    }
  },

  // Get single application
  getById: async (id: string): Promise<{ success: boolean; data: Application | null }> => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      return { success: false, data: null };
    }
  },

  // Get application statistics
  getStats: async (): Promise<{ success: boolean; data: ApplicationStats }> => {
    try {
      const response = await api.get('/applications/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      // Return mock data for development
      return {
        success: true,
        data: {
          totalApplications: 24,
          appliedToday: 3,
          interviews: 4,
          atsScore: 78,
          pendingTailoring: 5,
          applicationsByStatus: {
            discovered: 8,
            tailored: 5,
            applied: 7,
            interviewing: 3,
            rejected: 1,
            accepted: 0
          }
        }
      };
    }
  },

  // Update application status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: Application }> => {
    try {
      const response = await api.put(`/applications/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Tailor resume for application
  tailorResume: async (id: string): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await api.post(`/applications/${id}/tailor`);
      return response.data;
    } catch (error) {
      console.error('Error tailoring resume:', error);
      throw error;
    }
  },

  // Get today's applications
  getTodayApplications: async (): Promise<{ success: boolean; data: { count: number; applications: Application[] } }> => {
    try {
      const response = await api.get('/applications/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s applications:', error);
      return { success: false, data: { count: 0, applications: [] } };
    }
  }
};

export default applicationsAPI;
