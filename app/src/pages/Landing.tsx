import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle,
  Upload,
  ClipboardList,
  Download,
  Star,
  ChevronDown,
  Github,
  Code2,
  Target,
  BarChart3,
  Shield,
  Globe,
  MessageCircle,
  Play,
  Monitor,
} from 'lucide-react';

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  const [activeDemo, setActiveDemo] = useState(0);
  const demoInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const demoSlides = [
    { label: 'Enter Your Info', src: '/demo/dashboard-step1.png', description: 'Fill in your name, email, phone, and location. Upload or paste your resume.' },
    { label: 'Paste Resume', src: '/demo/dashboard-resume.png', description: 'Paste your current resume text or upload a PDF/DOCX file. The AI needs your experience to work with.' },
    { label: 'Add Job Description', src: '/demo/dashboard-step2.png', description: 'Enter the target job title, company name, and paste the full job description.' },
    { label: 'Generate & Download', src: '/demo/dashboard-generate.png', description: 'Hit generate — AI tailors your resume, writes a cover letter, and scores ATS compatibility.' },
  ];

  const startDemoAutoplay = useCallback(() => {
    if (demoInterval.current) clearInterval(demoInterval.current);
    demoInterval.current = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 4);
    }, 4000);
  }, []);

  useEffect(() => {
    startDemoAutoplay();
    return () => { if (demoInterval.current) clearInterval(demoInterval.current); };
  }, [startDemoAutoplay]);

  const steps = [
    {
      step: '01',
      icon: Upload,
      title: 'Paste Your Resume',
      description: 'Copy-paste your existing resume text. No account needed, no file uploads required.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      step: '02',
      icon: ClipboardList,
      title: 'Add the Job Description',
      description: 'Paste the target job posting. Include the title, company, and full description for best results.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '03',
      icon: Sparkles,
      title: 'AI Tailors Everything',
      description: 'Our AI rewrites your resume to match the job, generates a cover letter, and calculates your ATS score.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      step: '04',
      icon: Download,
      title: 'Download & Apply',
      description: 'Get professional PDFs of your tailored resume and cover letter. Save them to your library for later.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const features = [
    {
      icon: Target,
      title: 'ATS-Optimized Output',
      description: 'Every tailored resume is scored against ATS systems. Keywords from the job description are woven naturally into your experience.',
    },
    {
      icon: FileText,
      title: 'AI Resume Tailoring',
      description: 'Your resume is rewritten to highlight the most relevant skills and experience for each specific job posting.',
    },
    {
      icon: Sparkles,
      title: 'Cover Letter Generation',
      description: 'A professional, personalized cover letter is generated alongside your resume, matched to the role and company.',
    },
    {
      icon: BarChart3,
      title: 'ATS Score & Keywords',
      description: 'See your compatibility score and exactly which keywords were added. Know your resume strength before you apply.',
    },
    {
      icon: Download,
      title: 'PDF Downloads',
      description: 'Download beautifully formatted PDFs for both your tailored resume and cover letter, ready to submit.',
    },
    {
      icon: Shield,
      title: 'Resume Library',
      description: 'Every tailoring is saved to your library. Build a collection of role-specific resumes you can reuse anytime.',
    },
  ];

  const faqs = [
    {
      q: 'What does AIApplyMate actually do?',
      a: 'AIApplyMate takes your existing resume and a target job description, then uses AI to rewrite your resume to match the job. It also generates a tailored cover letter and gives you an ATS compatibility score. You get downloadable PDFs of everything.',
    },
    {
      q: 'Do I need to create an account?',
      a: 'No. AIApplyMate is fully open-source and requires no authentication. Just open the app, paste your resume and job description, and get results immediately. Your tailored resumes are saved in your browser session.',
    },
    {
      q: 'Is this really free and open source?',
      a: 'Yes! The entire codebase is available on GitHub. You can self-host it, contribute to it, or use the hosted version at no cost. We believe job seekers deserve free tools.',
    },
    {
      q: 'How does the ATS scoring work?',
      a: 'The AI analyzes the job description for required skills, qualifications, and keywords, then checks how well your tailored resume matches. The score reflects keyword coverage, relevance of experience, and formatting compatibility with ATS systems.',
    },
    {
      q: 'What AI model powers this?',
      a: 'AIApplyMate uses Google Gemini to analyze job descriptions and rewrite resumes. The AI understands context, so it doesn\'t just keyword-stuff — it naturally integrates relevant terms into your actual experience.',
    },
    {
      q: 'Can I use this for multiple job applications?',
      a: 'Absolutely. That\'s the whole point. Each tailoring creates a unique resume + cover letter combo optimized for that specific job. Your library stores all of them so you can track which version you sent where.',
    },
  ];

  const testimonials = [
    { name: 'Alex R.', role: 'Recent Graduate', text: 'I went from zero callbacks to 5 interviews in a week. The ATS score feature showed me exactly what I was missing.', avatar: 'AR', color: 'from-violet-500 to-purple-600' },
    { name: 'Jess G.', role: 'Marketing Professional', text: 'The cover letter generator alone saved me hours. And the tailored resume actually got me past the ATS for the first time.', avatar: 'JG', color: 'from-pink-500 to-rose-600' },
    { name: 'Rohit K.', role: 'Software Engineer', text: 'Open source, no login, no BS. Pasted my resume, pasted the JD, got a perfectly tailored output in 10 seconds. This is how tools should work.', avatar: 'RK', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">AI<span className="text-emerald-600">ApplyMate</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">How It Works</a>
              <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Demo</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Testimonials</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Aneek1/aiapplymate" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <Link to="/app">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 py-2 shadow-lg shadow-emerald-100">
                  Open App
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-violet-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-8">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">100% Open Source & Free</span>
              <span className="text-sm text-emerald-500">No account required</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
              Tailor Your Resume{' '}
              <span className="text-emerald-600">For Every Job</span>{' '}
              In Seconds
            </h1>

            <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
              Paste your resume + a job description. Our AI rewrites your resume to match, generates a cover letter, and scores your ATS compatibility. Download PDFs instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/app">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-10 py-6 rounded-xl font-bold shadow-xl shadow-emerald-200 transition-all hover:shadow-2xl hover:-translate-y-0.5">
                  Start Tailoring — It's Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works" className="text-slate-600 font-semibold flex items-center gap-2 hover:text-emerald-600 transition-colors">
                See how it works
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Inline demo preview */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-1 overflow-hidden">
                <div className="bg-slate-50 rounded-xl p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Upload className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-slate-900 text-sm">Your Resume</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-200 rounded w-full" />
                        <div className="h-2 bg-slate-200 rounded w-4/5" />
                        <div className="h-2 bg-slate-200 rounded w-3/4" />
                        <div className="h-2 bg-slate-100 rounded w-full mt-3" />
                        <div className="h-2 bg-slate-100 rounded w-5/6" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">AI Tailoring</span>
                        <div className="hidden md:flex flex-col items-center gap-1">
                          <div className="w-px h-4 bg-emerald-300" />
                          <ArrowRight className="w-4 h-4 text-emerald-400 rotate-90 md:rotate-0" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border-2 border-emerald-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="font-bold text-slate-900 text-sm">Tailored Output</span>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">92% ATS</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-emerald-200 rounded w-full" />
                        <div className="h-2 bg-emerald-200 rounded w-5/6" />
                        <div className="h-2 bg-emerald-100 rounded w-4/5" />
                        <div className="flex gap-1 mt-3">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">React</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">TypeScript</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">Node.js</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        ref={(el) => { sectionRefs.current['how-it-works'] = el; }}
        className="py-24 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Simple 4-Step Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              From Resume to Tailored Application in Under 30 Seconds
            </h2>
            <p className="text-lg text-slate-600">
              No signup. No credit card. Just paste, generate, and download.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${isVisible('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="text-5xl font-black text-slate-100 absolute top-4 right-4">{item.step}</div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/app">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8 py-4 shadow-lg shadow-emerald-100">
                Try It Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section
        id="demo"
        ref={(el) => { sectionRefs.current['demo'] = el; }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${isVisible('demo') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
              <Play className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">See It In Action</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Watch How It Works
            </h2>
            <p className="text-lg text-slate-600">
              From pasting your resume to downloading a tailored PDF — here's the full flow.
            </p>
          </div>

          <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible('demo') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Tab buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {demoSlides.map((slide, i) => (
                <button
                  key={slide.label}
                  onClick={() => { setActiveDemo(i); startDemoAutoplay(); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeDemo === i
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeDemo === i ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{slide.label}</span>
                </button>
              ))}
            </div>

            {/* Screenshot display */}
            <div className="relative bg-slate-900 rounded-2xl p-2 shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 rounded-t-xl">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-4 py-1 text-xs text-slate-400">
                    <Monitor className="w-3 h-3" />
                    localhost:5173/app/dashboard
                  </div>
                </div>
              </div>

              {/* Screenshot */}
              <div className="relative overflow-hidden rounded-b-xl bg-white" style={{ aspectRatio: '16/10' }}>
                {demoSlides.map((slide, i) => (
                  <img
                    key={slide.label}
                    src={slide.src}
                    alt={slide.label}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ${
                      activeDemo === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-2 right-2 flex gap-1 p-1">
                {demoSlides.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all ${
                        activeDemo === i ? 'bg-emerald-400 animate-[grow_4s_linear]' : i < activeDemo ? 'bg-emerald-400 w-full' : 'bg-transparent w-0'
                      }`}
                      style={activeDemo === i ? { animation: 'grow 4s linear forwards' } : i < activeDemo ? { width: '100%' } : { width: '0%' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="text-center mt-6">
              <p className="text-sm font-bold text-slate-900">
                Step {activeDemo + 1}: {demoSlides[activeDemo].label}
              </p>
              <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
                {demoSlides[activeDemo].description}
              </p>
            </div>

            <div className="text-center mt-8">
              <Link to="/app">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8 py-4 shadow-lg shadow-emerald-100">
                  Try It Yourself
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={(el) => { sectionRefs.current['features'] = el; }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">What You Get</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Everything You Need to Land More Interviews
            </h2>
            <p className="text-lg text-slate-600">
              Built by job seekers, for job seekers. Every feature is designed to maximize your chances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Banner */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
                <Globe className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white/90">Open Source</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
                Built in the Open. Free Forever.
              </h2>
              <p className="text-lg text-emerald-100 max-w-2xl">
                No paywalls, no premium tiers, no data selling. AIApplyMate is fully open-source.
                Self-host it, fork it, or contribute. Your job search tools should be free.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://github.com/Aneek1/aiapplymate" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl px-8 py-4 shadow-lg">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </Button>
              </a>
              <Link to="/app">
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl px-8 py-4 border border-emerald-500">
                  Launch App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        ref={(el) => { sectionRefs.current['testimonials'] = el; }}
        className="py-24 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full mb-6">
              <Star className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">What People Say</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Loved by Job Seekers Everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-500 ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        ref={(el) => { sectionRefs.current['faq'] = el; }}
        className="py-24 bg-white"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mb-6">
              <MessageCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-emerald-200 shadow-md' : 'border-slate-200'}`}
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Stop Sending Generic Resumes
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Every job deserves a tailored application. Start getting callbacks with resumes that actually match what employers are looking for.
          </p>
          <Link to="/app">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-10 py-6 rounded-xl font-bold shadow-xl shadow-emerald-900/30 transition-all hover:shadow-2xl hover:-translate-y-0.5">
              Open AIApplyMate — Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="mt-6 text-sm text-slate-500">No account needed. No credit card. Just results.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">AI<span className="text-emerald-500">ApplyMate</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="https://github.com/Aneek1/aiapplymate" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <Link to="/app" className="hover:text-white transition-colors">App</Link>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} AIApplyMate. Open source under MIT.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
