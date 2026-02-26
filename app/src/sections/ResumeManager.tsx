import React from 'react';
import { FileText, Upload, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeManager = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Resumes</h1>
          <p className="text-slate-600 mt-2 text-lg">Manage your base resumes for different industries.</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all gap-2">
          <Upload className="w-5 h-5" />
          Upload New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 transition-colors duration-300">
              <FileText className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Software Engineer Resume</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">Primary</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">software-engineer-resume.pdf · 245 KB · Last updated 2 days ago</p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peak ATS Match:</span>
                  <span className="text-lg font-extrabold text-emerald-600">88%</span>
                </div>

                <div className="hidden sm:block h-6 w-px bg-slate-200 mx-2" />

                <Link to="/dashboard" className="inline-flex items-center text-emerald-600 font-bold hover:gap-2 transition-all">
                  Tailor for a new job
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
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
