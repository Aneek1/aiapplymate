import { useState, useCallback } from 'react';
import { resumeAPI } from '@/services/api';
import { toast } from 'sonner';

export interface TailoringFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  company: string;
  resumeText: string;
  jobDescription: string;
}

export interface TailoringResult {
  tailoredResume: string;
  atsScore: number;
  topChanges: string[];
  keywordsAdded: string[];
  coverLetter?: string;
}

interface UseTailoringReturn {
  formData: TailoringFormData;
  result: TailoringResult | null;
  step: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setStep: (step: number) => void;
  updateField: (name: string, value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  generateTailoredContent: () => Promise<void>;
  saveResultToLibrary: () => Promise<void>;
  downloadPDF: (type: 'resume' | 'cover-letter', cvTemplate?: any) => Promise<void>;
  reset: () => void;
}

const INITIAL_FORM_DATA: TailoringFormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  jobTitle: '',
  company: '',
  resumeText: '',
  jobDescription: '',
};

export function useTailoring(): UseTailoringReturn {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TailoringFormData>(INITIAL_FORM_DATA);
  const [result, setResult] = useState<TailoringResult | null>(null);

  const updateField = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const generateTailoredContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await resumeAPI.tailorFull({
        resumeText: formData.resumeText,
        jobDescription: formData.jobDescription,
        jobTitle: formData.jobTitle,
        company: formData.company,
      });
      setResult(response.data);
      setStep(3);
      toast.success('Tailored content generated!');
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to generate tailored content. Please check your API connection.'
      );
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const saveResultToLibrary = useCallback(async () => {
    if (!result) return;
    setSaving(true);
    try {
      await resumeAPI.saveTailored({
        ...result,
        coverLetter: result.coverLetter,
        jobTitle: formData.jobTitle,
        company: formData.company,
        name: `Tailored: ${formData.jobTitle} at ${formData.company}`,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      });
      toast.success('Saved to My Resumes!');
    } catch (err: any) {
      toast.error('Failed to save result');
    } finally {
      setSaving(false);
    }
  }, [result, formData]);

  const downloadPDF = useCallback(
    async (type: 'resume' | 'cover-letter', cvTemplate?: any) => {
      if (!result) return;
      try {
        const payload =
          type === 'resume'
            ? {
                tailoredResume: result.tailoredResume,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                jobTitle: formData.jobTitle,
                summary: 'Tailored summary based on AI optimization',
                keywordsAdded: result.keywordsAdded,
                template: cvTemplate || {
                  layout: 'modern',
                  columns: 'two',
                  headerStyle: 'centered',
                  colorScheme: 'blue',
                  fontSize: 'medium',
                  spacing: 'normal'
                }
              }
            : {
                coverLetter: result.coverLetter,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
              };

        const blob =
          type === 'resume'
            ? await resumeAPI.downloadTailoredResume(payload)
            : await resumeAPI.downloadCoverLetter(payload);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${type}-${formData.company || 'tailored'}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          link.remove();
          window.URL.revokeObjectURL(url);
        }, 5000);
        toast.success(`${type === 'resume' ? 'Resume' : 'Cover Letter'} download started!`);
      } catch (err) {
        toast.error('Failed to download PDF');
      }
    },
    [result, formData, cvTemplate]
  );

  const reset = useCallback(() => {
    setStep(1);
    setFormData(INITIAL_FORM_DATA);
    setResult(null);
    setError(null);
  }, []);

  return {
    formData,
    result,
    step,
    loading,
    saving,
    error,
    setStep,
    updateField,
    handleInputChange,
    generateTailoredContent,
    saveResultToLibrary,
    downloadPDF,
    reset,
  };
}
