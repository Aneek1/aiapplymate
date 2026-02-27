import { useState, useEffect, useCallback } from 'react';
import { resumeAPI } from '@/services/api';
import { toast } from 'sonner';

export interface LibraryItem {
  _id: string;
  name: string;
  headline?: string;
  content?: string;
  coverLetter?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  keywords?: string[];
  atsScore?: number;
  aiOptimized: boolean;
  createdAt: string;
}

interface UseResumeLibraryReturn {
  applications: LibraryItem[];
  loading: boolean;
  error: string | null;
  downloadingId: string | null;
  refresh: () => Promise<void>;
  downloadPDF: (app: LibraryItem, type: 'resume' | 'cover-letter') => Promise<void>;
}

export function useResumeLibrary(): UseResumeLibraryReturn {
  const [applications, setApplications] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await resumeAPI.getAll();
      setApplications((response.data as any) || []);
    } catch (err: any) {
      setError('Failed to load application history');
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const downloadPDF = useCallback(async (app: LibraryItem, type: 'resume' | 'cover-letter') => {
    const downloadKey = `${app._id}-${type}`;
    if (downloadingId === downloadKey) return;

    setDownloadingId(downloadKey);
    try {
      const payload = type === 'resume'
        ? {
            tailoredResume: app.content,
            name: app.name.split(':')[1]?.split('at')[0]?.trim() || 'Applicant',
            email: app.email || 'applicant@example.com',
            phone: app.phone || '',
            location: app.location || '',
            summary: app.summary || '',
            keywordsAdded: app.keywords || [],
          }
        : {
            coverLetter: app.coverLetter,
            name: app.name.split(':')[1]?.split('at')[0]?.trim() || 'Applicant',
            email: app.email || 'applicant@example.com',
            phone: app.phone || '',
            company: app.name.split('at')[1]?.trim() || 'Company',
          };

      if (type === 'cover-letter' && !app.coverLetter) {
        toast.error('No cover letter available for this tailoring');
        return;
      }

      if (type === 'resume' && !app.content) {
        toast.error('Resume content missing for this entry');
        return;
      }

      const rawBlob = type === 'resume'
        ? await resumeAPI.downloadTailoredResume(payload)
        : await resumeAPI.downloadCoverLetter(payload);

      if (rawBlob.size < 100) {
        throw new Error('Received an invalid or empty file from the server');
      }

      const blob = new Blob([rawBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const safeName = app.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      link.setAttribute('download', `${type}-${safeName}.pdf`);

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 5000);

      toast.success(`${type === 'resume' ? 'Resume' : 'Cover Letter'} download started!`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  }, [downloadingId]);

  return {
    applications,
    loading,
    error,
    downloadingId,
    refresh: fetchApplications,
    downloadPDF,
  };
}
