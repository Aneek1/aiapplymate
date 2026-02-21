import api from './index';

export interface Resume {
  id: string;
  name: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  isDefault: boolean;
  atsScore: number;
  keywords: string[];
  optimized: boolean;
  content?: string;
  jobMatches?: any[];
}

export const resumeAPI = {
  // Get all resumes
  getAll: async (): Promise<{ success: boolean; data: Resume[] }> => {
    try {
      const response = await api.get('/resumes');
      return response.data;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      return { success: false, data: [] };
    }
  },

  // Get primary resume
  getPrimary: async (): Promise<{ success: boolean; data: Resume | null }> => {
    try {
      const response = await api.get('/resumes/primary');
      return response.data;
    } catch (error) {
      console.error('Error fetching primary resume:', error);
      return { success: false, data: null };
    }
  },

  // Get single resume
  getById: async (id: string): Promise<{ success: boolean; data: Resume | null }> => {
    try {
      const response = await api.get(`/resumes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resume:', error);
      return { success: false, data: null };
    }
  },

  // Upload resume
  upload: async (formData: FormData, onProgress?: (progress: number) => void): Promise<{ success: boolean; data: Resume; message: string }> => {
    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  },

  // Optimize resume with AI
  optimize: async (id: string, data: { jobTitle: string; industry: string }): Promise<{ success: boolean; data: any; message: string }> => {
    try {
      const response = await api.post(`/resumes/${id}/optimize`, data);
      return response.data;
    } catch (error) {
      console.error('Error optimizing resume:', error);
      throw error;
    }
  },

  // Match resume with job description
  matchJob: async (id: string, data: { jobTitle: string; company: string; jobDescription: string }): Promise<{ success: boolean; data: any; message: string }> => {
    try {
      const response = await api.post(`/resumes/${id}/match-job`, data);
      return response.data;
    } catch (error) {
      console.error('Error matching job:', error);
      throw error;
    }
  },

  // Get job matches for a resume
  getJobMatches: async (id: string): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await api.get(`/resumes/${id}/matches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job matches:', error);
      return { success: false, data: [] };
    }
  },

  // Set resume as default
  setDefault: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.put(`/resumes/${id}/default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default resume:', error);
      throw error;
    }
  },

  // Delete resume
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/resumes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }
};

export default resumeAPI;
