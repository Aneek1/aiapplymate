import { useEffect, useRef, useState } from 'react'
import { 
  Send, 
  FileText, 
  Sparkles, 
  MessageSquare, 
  Headphones, 
  Globe,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Features = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const features = [
    {
      icon: Send,
      title: 'Auto Apply',
      description: 'Automate your job search. AutoApply applies to hundreds of matched positions daily while you focus on preparing for interviews.',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      stats: '372,241+ roles applied to',
      image: 'auto-apply'
    },
    {
      icon: FileText,
      title: 'AI Resume Builder',
      description: 'Build ATS-optimized resumes tailored to each job description. Our AI highlights your best skills to help you get more interviews.',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-violet-50 to-purple-50',
      stats: 'Loved by 1,166,440 users',
      image: 'resume'
    },
    {
      icon: Sparkles,
      title: 'AI Cover Letter',
      description: 'Generate personalized cover letters in seconds. Each letter matches the job requirements and showcases why you\'re the perfect fit.',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      stats: '98% success rate',
      image: 'cover-letter'
    },
    {
      icon: MessageSquare,
      title: 'AI Interview Practice',
      description: 'Simulate real interviews with AI. Get role-specific questions, instant feedback, and build the confidence to ace your next interview.',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      stats: '4.7 ★ 387 Ratings',
      image: 'interview'
    },
    {
      icon: Headphones,
      title: 'Interview Buddy',
      description: 'Get live AI coaching during interviews. Receive real-time answer suggestions and talking points through your earpiece or screen.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      stats: 'Real-time assistance',
      image: 'buddy'
    },
    {
      icon: Globe,
      title: 'Resume Translator',
      description: 'Expand your opportunities globally. Professionally translate your resume into 50+ languages while preserving formatting and impact.',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-blue-50',
      stats: '50+ languages',
      image: 'translator'
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'))
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Everything you need to get a job FAST!</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful AI Tools for Your Job Search
          </h2>
          <p className="text-lg text-gray-600">
            From resume optimization to automated applications, we've got you covered 
            at every step of your job search journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => { cardRefs.current[index] = el }}
              data-index={index}
              className={`group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 ${
                visibleCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-5 leading-relaxed">
                {feature.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{feature.stats}</span>
              </div>

              {/* Preview Card */}
              <div className={`${feature.bgColor} rounded-xl p-4 mb-5`}>
                {feature.image === 'auto-apply' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">Software Engineer</p>
                          <p className="text-xs text-gray-500">Google</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Applied</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">Product Manager</p>
                          <p className="text-xs text-gray-500">Meta</p>
                        </div>
                      </div>
                      <span className="text-xs text-yellow-600 font-medium">Applying...</span>
                    </div>
                  </div>
                )}
                {feature.image === 'resume' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">Senior Developer</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {['React', 'Node.js', 'Python'].map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {feature.image === 'cover-letter' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-600 line-clamp-3">
                      Dear Hiring Manager,
                      <br />
                      I am excited to apply for the position at your company. With my extensive experience...
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">Formal</span>
                      <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">Professional</span>
                    </div>
                  </div>
                )}
                {feature.image === 'interview' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">Q</span>
                      </div>
                      <p className="text-xs text-gray-700">Tell me about a challenging project you worked on.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">A</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">In my previous role, I led a team to rebuild the entire...</p>
                    </div>
                  </div>
                )}
                {feature.image === 'buddy' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded">
                      Suggested: Focus on your leadership experience...
                    </p>
                  </div>
                )}
                {feature.image === 'translator' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">English</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Español</span>
                    </div>
                    <p className="text-xs text-gray-600">Ingeniero de Software Senior</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Button 
                variant="ghost" 
                className="group/btn text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto font-medium"
              >
                Start now
                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Ready to transform your job search?</p>
                <p className="text-sm text-gray-600">Join millions of job seekers who found their dream job</p>
              </div>
            </div>
            <Button className="btn-primary whitespace-nowrap">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
