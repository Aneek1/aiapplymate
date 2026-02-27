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
import { useTheme } from '@/contexts/ThemeContext';

const Dashboard = () => {
  const { resolvedMode } = useTheme();
  const dark = resolvedMode === 'dark';

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
        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-slate-900'}`}>
          Tailor your future in <span className="text-primary">seconds.</span>
        </h1>
        <p className={`mt-4 text-xl max-w-2xl mx-auto ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          Upload your resume and target job description. Our AI will weave them into a perfect match.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${step >= s ? 'bg-primary border-primary text-white' : dark ? 'border-slate-600 text-slate-500' : 'border-slate-300 text-slate-400'
              }`}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-primary' : dark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Workspace Area */}
      <div className={`rounded-2xl shadow-xl border overflow-hidden min-h-[500px] ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        {error && (
          <div className={`border-b p-4 flex items-center gap-3 ${dark ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-100 text-red-700'}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              <FileText className="text-primary" />
              Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="San Francisco, CA"
                  className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              <Upload className="text-primary" />
              Your Resume
            </h2>

            {/* Mode Toggle */}
            <div className={`flex gap-1 p-1 rounded-xl mb-6 w-fit ${dark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <button
                onClick={() => setResumeMode('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  resumeMode === 'upload'
                    ? dark ? 'bg-slate-600 text-primary shadow-sm' : 'bg-white text-primary shadow-sm'
                    : dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileUp className="w-4 h-4" />
                Upload File
              </button>
              <button
                onClick={() => setResumeMode('paste')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  resumeMode === 'paste'
                    ? dark ? 'bg-slate-600 text-primary shadow-sm' : 'bg-white text-primary shadow-sm'
                    : dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
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
                        ? 'border-primary bg-primary/10'
                        : dark ? 'border-slate-600 hover:border-primary hover:bg-slate-700' : 'border-slate-300 hover:border-primary hover:bg-slate-50'
                    }`}
                  >
                    {parsing ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className={`font-semibold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>Parsing your resume...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-primary/15' : 'bg-primary/10'}`}>
                          <FileUp className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <p className={`font-bold text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>Drop your resume here or click to browse</p>
                          <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Supports PDF, DOCX, and TXT files</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* File Uploaded State */
                  <div className={`border rounded-2xl p-5 ${dark ? 'border-primary/30 bg-primary/10' : 'border-primary/30 bg-primary/5'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-primary/20' : 'bg-primary/10'}`}>
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>{parsedFile.fileName}</p>
                          <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{formatFileSize(parsedFile.fileSize)} &middot; {formData.resumeText.split(/\s+/).length} words extracted</p>
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
                    <div className={`border rounded-xl p-4 max-h-40 overflow-y-auto ${dark ? 'bg-slate-700 border-slate-600' : 'bg-white border-primary/20'}`}>
                      <p className={`text-xs whitespace-pre-wrap leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{formData.resumeText.slice(0, 800)}{formData.resumeText.length > 800 ? '...' : ''}</p>
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
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Paste your current resume content below.</p>
                <textarea
                  name="resumeText"
                  value={formData.resumeText}
                  onChange={handleInputChange}
                  rows={10}
                  placeholder="Experience: Senior Software Engineer at Apple..."
                  className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
            )}

            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.resumeText || !formData.name}
                className="bg-primary hover:opacity-90 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 group"
              >
                Next Step
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              <ClipboardList className="text-primary" />
              Target Opportunity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Job Title</label>
                <input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Product Designer"
                  className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Company Name</label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Google"
                  className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={12}
                placeholder="Paste the requirements and description from LinkedIn or Indeed..."
                className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div className="mt-10 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className={`font-semibold px-6 py-4 rounded-xl transition-all ${dark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Back
              </button>
              <button
                onClick={generateTailoredContent}
                disabled={loading || !formData.jobDescription}
                className="bg-primary hover:opacity-90 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 group"
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
            <div className={`flex flex-col md:flex-row items-center justify-between mb-12 gap-6 p-6 rounded-2xl border ${dark ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/20'}`}>
              <div>
                <h2 className={`text-3xl font-extrabold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>Success!</h2>
                <p className={`font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Your resume has been optimized with a <span className="text-primary font-bold">{result.atsScore}%</span> ATS compatibility score.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={saveResultToLibrary}
                  disabled={saving}
                  className={`border px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${dark ? 'bg-slate-700 text-primary border-slate-600 hover:bg-slate-600' : 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'}`}
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save to Library
                </button>
                <button
                  onClick={() => downloadPDF('resume')}
                  className={`border-2 border-primary px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${dark ? 'bg-transparent text-primary hover:bg-primary hover:text-white' : 'bg-white text-primary hover:bg-primary hover:text-white'}`}
                >
                  <Download className="w-5 h-5" />
                  PDF Resume
                </button>
                <button
                  onClick={() => downloadPDF('cover-letter')}
                  className="bg-primary text-white hover:opacity-90 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  PDF Cover Letter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className={`font-bold text-xl border-b pb-2 ${dark ? 'text-white border-slate-700' : 'text-slate-900 border-slate-200'}`}>Key AI Optimizations</h3>
                <ul className="space-y-4">
                  {result.topChanges.map((change, i) => (
                    <li key={i} className={`flex gap-3 p-4 rounded-xl border group ${dark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="bg-primary/15 text-primary w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <p className={`text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{change}</p>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${dark ? 'text-slate-400' : 'text-slate-700'}`}>Keywords Injected</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordsAdded.map((word, i) => (
                      <span key={i} className={`px-3 py-1 text-xs font-bold rounded-full border ${dark ? 'bg-primary/10 text-primary border-primary/20' : 'bg-primary/5 text-primary border-primary/20'}`}>
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className={`font-bold text-xl border-b pb-2 ${dark ? 'text-white border-slate-700' : 'text-slate-900 border-slate-200'}`}>Preview</h3>
                <div className={`border rounded-xl p-6 h-[400px] overflow-y-auto shadow-inner text-sm font-mono leading-relaxed ${dark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
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
                    className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
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
