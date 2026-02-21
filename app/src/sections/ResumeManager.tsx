import React from 'react';
import { FileText, Upload, Sparkles } from 'lucide-react';

const ResumeManager = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Manager</h1>
          <p className="text-gray-600 mt-1">Upload and manage your resumes.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Resume
        </button>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">Software Engineer Resume</h3>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Primary</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">software-engineer-resume.pdf · 245 KB</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">ATS Score:</span>
                <span className="text-lg font-bold text-green-600">78%</span>
              </div>
            </div>
          </div>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Sparkles className="w-4 h-4 mr-2" />
            Optimize
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
