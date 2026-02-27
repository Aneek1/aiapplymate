import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useResumeLibrary } from '@/hooks/use-resume-library';
import { useTheme } from '@/contexts/ThemeContext';

const ApplicationsPage = () => {
  const { resolvedMode } = useTheme();
  const dark = resolvedMode === 'dark';
  const { applications, loading, error, downloadingId, downloadPDF } = useResumeLibrary();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className={`font-bold animate-pulse ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className={`text-4xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>Tailored History</h1>
          <p className={`mt-2 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>View and download your previously optimized documents.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl border ${dark ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/20'}`}>
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Total Resumes</p>
          <p className="text-2xl font-black text-primary leading-none mt-1">{applications.length}</p>
        </div>
      </div>

      {error && (
        <div className={`border p-4 rounded-xl flex items-center gap-3 mb-8 ${dark ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-100 text-red-700'}`}>
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <div key={app._id} className={`rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all group ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl group-hover:bg-primary transition-colors duration-300 ${dark ? 'bg-primary/15' : 'bg-primary/10'}`}>
                  <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-bold tracking-tight truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{app.name}</h3>
                  <p className={`font-medium flex items-center gap-2 mt-1 truncate ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {app.headline || 'General Optimization'}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {app.aiOptimized ? 'AI Optimized' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-2xl font-extrabold text-primary">{app.atsScore || 0}%</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">ATS Match</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadPDF(app, 'resume')}
                      disabled={downloadingId !== null}
                      className={`border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 ${dark ? 'bg-transparent' : 'bg-white'}`}
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
                      className={`border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 ${dark ? 'bg-transparent' : 'bg-white'}`}
                    >
                      {downloadingId === `${app._id}-cover-letter` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Cover Letter"
                      )}
                    </button>
                  </div>
                  <button className="text-slate-400 text-xs font-bold flex items-center gap-1 hover:text-primary transition-all">
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
        <div className={`text-center py-24 rounded-3xl border-2 border-dashed ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <FileText className={`w-12 h-12 mx-auto mb-4 ${dark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>No tailored resumes yet</h3>
          <p className={`mt-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Start your first tailoring process on the workspace.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
