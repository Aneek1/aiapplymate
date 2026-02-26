import { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { resumeAPI } from '@/services/api';
import { toast } from 'sonner';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await resumeAPI.getAll();
      setApplications(response.data || []);
    } catch (err: any) {
      setError('Failed to load application history');
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (app: any, type: 'resume' | 'cover-letter') => {
    const downloadKey = `${app._id}-${type}`;
    if (downloadingId === downloadKey) return;

    setDownloadingId(downloadKey);
    try {
      const payload = type === 'resume'
        ? {
          tailoredResume: app.content,
          name: app.name.split(':')[1]?.split('at')[0]?.trim() || "Applicant",
          email: app.email || "applicant@example.com",
          phone: app.phone || "",
          location: app.location || "",
          summary: app.summary || "",
          keywordsAdded: app.keywords || []
        }
        : {
          coverLetter: app.coverLetter,
          name: app.name.split(':')[1]?.split('at')[0]?.trim() || "Applicant",
          email: app.email || "applicant@example.com",
          phone: app.phone || "",
          company: app.name.split('at')[1]?.trim() || "Company"
        };

      if (type === 'cover-letter' && !app.coverLetter) {
        toast.error('No cover letter available for this tailoring');
        return;
      }

      if (type === 'resume' && !app.content) {
        toast.error('Resume content missing for this entry');
        return;
      }

      const blob = type === 'resume'
        ? await resumeAPI.downloadTailoredResume(payload)
        : await resumeAPI.downloadCoverLetter(payload);

      // Verify the blob is actually a PDF or at least has content
      if (blob.size < 100) {
        throw new Error('Received an invalid or empty file from the server');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Clean filename
      const safeName = app.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      link.setAttribute('download', `${type}-${safeName}.pdf`);

      document.body.appendChild(link);
      link.click();

      // Delay removal and revocation to ensure the browser captures the download
      // Mac/Chrome sometimes need a larger window for the intent
      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 5000);

      toast.success(`${type === 'resume' ? 'Resume' : 'Cover Letter'} download started! Check your downloads.`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tailored History</h1>
          <p className="text-slate-600 mt-2 text-lg">View and download your previously optimized documents.</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Resumes</p>
          <p className="text-2xl font-black text-emerald-600 leading-none mt-1">{applications.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700 mb-8">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-600 transition-colors duration-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight truncate">{app.name}</h3>
                  <p className="text-slate-600 font-medium flex items-center gap-2 mt-1 truncate">
                    <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    {app.headline || 'General Optimization'}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-bold">
                      {app.aiOptimized ? 'AI Optimized' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-2xl font-extrabold text-emerald-600">{app.atsScore || 0}%</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">ATS Match</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadPDF(app, 'resume')}
                      disabled={downloadingId !== null}
                      className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2"
                    >
                      {downloadingId === `${app._id}-resume` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Resume PDF"
                      )}
                    </button>
                    <button
                      onClick={() => downloadPDF(app, 'cover-letter')}
                      disabled={downloadingId !== null}
                      className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2"
                    >
                      {downloadingId === `${app._id}-cover-letter` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Cover Letter"
                      )}
                    </button>
                  </div>
                  <button className="text-slate-400 text-xs font-bold flex items-center gap-1 hover:text-emerald-600 transition-all">
                    Details
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No tailored resumes yet</h3>
          <p className="text-slate-500 mt-2">Start your first tailoring process on the workspace.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
