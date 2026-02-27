import React, { useRef, useState, useCallback } from 'react';
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
  Save,
  X,
  FileUp,
  ClipboardPaste
} from 'lucide-react';
import { useTailoring } from '@/hooks/use-tailoring';
import { useFileParser } from '@/hooks/use-file-parser';

const Dashboard = () => {
  const {
    formData,
    result,
    step,
    loading,
    saving,
    error,
    setStep,
    handleInputChange,
    updateField,
    generateTailoredContent,
    saveResultToLibrary,
    downloadPDF,
    reset,
  } = useTailoring();

  const { parsedFile, parsing, parseError, parseFile, clearFile } = useFileParser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeMode, setResumeMode] = useState<'upload' | 'paste'>('upload');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const text = await parseFile(file);
      updateField('resumeText', text);
    } catch {
      // error is surfaced via parseError
    }
  }, [parseFile, updateField]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback(() => {
    clearFile();
    updateField('resumeText', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [clearFile, updateField]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Upload className="text-emerald-600" />
              Your Resume
            </h2>

            {/* Mode Toggle */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
              <button
                onClick={() => setResumeMode('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  resumeMode === 'upload'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileUp className="w-4 h-4" />
                Upload File
              </button>
              <button
                onClick={() => setResumeMode('paste')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  resumeMode === 'paste'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ClipboardPaste className="w-4 h-4" />
                Paste Text
              </button>
            </div>

            {resumeMode === 'upload' ? (
              <div className="space-y-4">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {!parsedFile ? (
                  /* Drop Zone */
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                    }`}
                  >
                    {parsing ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                        <p className="text-slate-600 font-semibold">Parsing your resume...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                          <FileUp className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold text-lg">Drop your resume here or click to browse</p>
                          <p className="text-slate-500 text-sm mt-1">Supports PDF, DOCX, and TXT files</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* File Uploaded State */
                  <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{parsedFile.fileName}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(parsedFile.fileSize)} &middot; {formData.resumeText.split(/\s+/).length} words extracted</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-white border border-emerald-100 rounded-xl p-4 max-h-40 overflow-y-auto">
                      <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">{formData.resumeText.slice(0, 800)}{formData.resumeText.length > 800 ? '...' : ''}</p>
                    </div>
                  </div>
                )}

                {parseError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">{parseError}</p>
                      <button
                        onClick={() => setResumeMode('paste')}
                        className="text-sm text-red-600 underline mt-1 hover:text-red-700"
                      >
                        Switch to paste mode instead
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-500 text-sm">Paste your current resume content below.</p>
                <textarea
                  name="resumeText"
                  value={formData.resumeText}
                  onChange={handleInputChange}
                  rows={10}
                  placeholder="Experience: Senior Software Engineer at Apple..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

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
                    onClick={reset}
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
