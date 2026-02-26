import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ClipboardList,
  Save
} from 'lucide-react';
import { resumeAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    company: '',
    resumeText: '',
    jobDescription: ''
  });

  // Pre-fill from user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        location: user.location ? `${user.location.city}, ${user.location.state}` : prev.location,
      }));
    }
  }, [user]);

  // Result State
  const [result, setResult] = useState<{
    tailoredResume: string;
    atsScore: number;
    topChanges: string[];
    keywordsAdded: string[];
    coverLetter?: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTailoredContent = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Generate Tailored Resume
      const resumeRes = await resumeAPI.tailor({
        resumeText: formData.resumeText,
        jobDescription: formData.jobDescription,
        jobTitle: formData.jobTitle,
        company: formData.company
      });

      // 2. Generate Cover Letter
      const clRes = await resumeAPI.generateCoverLetter({
        resumeText: formData.resumeText,
        jobDescription: formData.jobDescription,
        jobTitle: formData.jobTitle,
        company: formData.company
      });

      setResult({
        ...resumeRes.data,
        coverLetter: clRes.data.coverLetter
      });
      setStep(3);
      toast.success('Tailored content generated!');
    } catch (err: any) {
      setError(err.message || 'Failed to generate tailored content. Please check your API connection.');
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const saveResultToLibrary = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await resumeAPI.saveTailored({
        ...result,
        coverLetter: result?.coverLetter,
        jobTitle: formData.jobTitle,
        company: formData.company,
        name: `Tailored: ${formData.jobTitle} at ${formData.company}`,
        email: formData.email,
        phone: formData.phone,
        location: formData.location
      });
      toast.success('Saved to My Resumes!');
    } catch (err: any) {
      toast.error('Failed to save result');
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async (type: 'resume' | 'cover-letter') => {
    try {
      const payload = type === 'resume'
        ? {
          tailoredResume: result?.tailoredResume,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          summary: "Tailored summary based on AI optimization",
          keywordsAdded: result?.keywordsAdded
        }
        : {
          coverLetter: result?.coverLetter,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company
        };

      const blob = type === 'resume'
        ? await resumeAPI.downloadTailoredResume(payload)
        : await resumeAPI.downloadCoverLetter(payload);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${formData.company || 'tailored'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Tailor your future in <span className="text-emerald-600">seconds.</span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
          Upload your resume and target job description. Our AI will weave them into a perfect match.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${step >= s ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 text-slate-400'
              }`}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Workspace Area */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
        {error && (
          <div className="bg-red-50 border-b border-red-100 p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <FileText className="text-emerald-600" />
              Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Upload className="text-emerald-600" />
              Existing Resume
            </h2>
            <div className="space-y-4">
              <p className="text-slate-500 text-sm">Paste your current resume content below to get started.</p>
              <textarea
                name="resumeText"
                value={formData.resumeText}
                onChange={handleInputChange}
                rows={10}
                placeholder="Experience: Senior Software Engineer at Apple..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.resumeText || !formData.name}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 group"
              >
                Next Step
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <ClipboardList className="text-emerald-600" />
              Target Opportunity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Job Title</label>
                <input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Product Designer"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Company Name</label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Google"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={12}
                placeholder="Paste the requirements and description from LinkedIn or Indeed..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="mt-10 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-slate-600 font-semibold px-6 py-4 hover:bg-slate-50 rounded-xl transition-all"
              >
                Back
              </button>
              <button
                onClick={generateTailoredContent}
                disabled={loading || !formData.jobDescription}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI Tailoring in progress...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Tailored Results
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="p-8 md:p-12 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <div>
                <h2 className="text-3xl font-extrabold text-emerald-900 mb-2">Success!</h2>
                <p className="text-emerald-700 font-medium">Your resume has been optimized with a <span className="text-emerald-600 font-bold">{result.atsScore}%</span> ATS compatibility score.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={saveResultToLibrary}
                  disabled={saving}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save to Library
                </button>
                <button
                  onClick={() => downloadPDF('resume')}
                  className="bg-white text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  PDF Resume
                </button>
                <button
                  onClick={() => downloadPDF('cover-letter')}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  PDF Cover Letter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-slate-900 text-xl border-b pb-2">Key AI Optimizations</h3>
                <ul className="space-y-4">
                  {result.topChanges.map((change, i) => (
                    <li key={i} className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 group">
                      <div className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{change}</p>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Keywords Injected</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordsAdded.map((word, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-slate-900 text-xl border-b pb-2">Preview</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-[400px] overflow-y-auto shadow-inner text-sm font-mono text-slate-600 leading-relaxed">
                  <div className="mb-8">
                    <h4 className="font-bold border-b mb-4">Tailored Resume</h4>
                    <p className="whitespace-pre-wrap">{result.tailoredResume}</p>
                  </div>
                  <div className="border-t pt-8">
                    <h4 className="font-bold border-b mb-4">Cover Letter</h4>
                    <p className="whitespace-pre-wrap">{result.coverLetter}</p>
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="text-emerald-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Start New Tailoring
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
