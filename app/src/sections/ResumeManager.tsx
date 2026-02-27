import { FileText, Upload, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

const ResumeManager = () => {
  const { resolvedMode } = useTheme();
  const dark = resolvedMode === 'dark';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className={`text-4xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>My Resumes</h1>
          <p className={`mt-2 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Manage your base resumes for different industries.</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all gap-2">
          <Upload className="w-5 h-5" />
          Upload New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start gap-6">
            <div className={`p-4 rounded-2xl group-hover:bg-primary transition-colors duration-300 ${dark ? 'bg-primary/15' : 'bg-primary/10'}`}>
              <FileText className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>Software Engineer Resume</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${dark ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'}`}>Primary</span>
              </div>
              <p className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>software-engineer-resume.pdf · 245 KB · Last updated 2 days ago</p>

              <div className="flex flex-wrap items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${dark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Peak ATS Match:</span>
                  <span className="text-lg font-extrabold text-primary">88%</span>
                </div>

                <div className={`hidden sm:block h-6 w-px mx-2 ${dark ? 'bg-slate-600' : 'bg-slate-200'}`} />

                <Link to="/app/dashboard" className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all">
                  Tailor for a new job
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className={`p-2 text-slate-400 rounded-lg transition-all ${dark ? 'hover:text-slate-200 hover:bg-slate-700' : 'hover:text-slate-600 hover:bg-slate-50'}`}>
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
