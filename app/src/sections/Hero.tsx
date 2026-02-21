import { useEffect, useState } from 'react'
import { ArrowRight, Star, Users, CheckCircle, Sparkles, FileText, Send, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onGetStarted: () => void
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const [animatedStats, setAnimatedStats] = useState({ users: 0, jobs: 0, success: 0 })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedStats({
        users: Math.floor(1166440 * easeOut),
        jobs: Math.floor(372241 * easeOut),
        success: Math.floor(80 * easeOut),
      })
      
      if (step >= steps) clearInterval(timer)
    }, interval)
    
    return () => clearInterval(timer)
  }, [])

  const companies = [
    { name: 'Coinbase', color: 'text-blue-600' },
    { name: 'Spotify', color: 'text-green-600' },
    { name: 'Microsoft', color: 'text-blue-700' },
    { name: 'Meta', color: 'text-blue-800' },
    { name: 'SpaceX', color: 'text-gray-800' },
  ]

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Trust Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">Excellent</span>
            <span className="text-sm text-gray-500">on Trustpilot</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Stop Applying for Weeks
            <br />
            <span className="gradient-text">Start Interviewing in Days</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AutoApply finds high-match roles, tailors your resume & cover letter, 
            auto-applies, and coaches you live - so you move from submit to getting a job fast.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            onClick={onGetStarted}
            className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
          >
            Start now
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
            <span className="text-sm">
              Loved by <span className="font-semibold text-gray-900">{animatedStats.users.toLocaleString()}</span> users
            </span>
          </div>
        </div>

        {/* Company Logos */}
        <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-gray-500 mb-4">Get hired by top companies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {companies.map((company) => (
              <span key={company.name} className={`text-xl font-bold ${company.color}`}>
                {company.name}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
          {/* Cover Letter Card */}
          <div className="feature-card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Optimized Cover Letter</span>
              </div>
              <span className="tag tag-purple">99.8% match</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
              <p className="mb-2">Dear HR Manager,</p>
              <p className="line-clamp-4">
                I'm reaching out about the role at TechCorp. You're looking for someone who challenges 
                conventions and builds products that redefine industries—well, that's been the foundation 
                of my career. With 5+ years of experience in software engineering...
              </p>
            </div>
          </div>

          {/* Resume Card */}
          <div className="feature-card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Optimized Resume</span>
              </div>
              <span className="tag tag-pink">99.8% match</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-center mb-3">
                <h4 className="font-bold text-gray-900">Jane Smith</h4>
                <p className="text-sm text-gray-500">San Francisco, CA</p>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="tag tag-blue text-xs">React</span>
                  <span className="tag tag-purple text-xs">Node.js</span>
                  <span className="tag tag-pink text-xs">Python</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Senior Developer • TechCorp</p>
                  <p className="text-gray-400">2020 - Present</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auto Apply Card */}
          <div className="feature-card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Auto Apply To Jobs</span>
              </div>
              <span className="tag tag-green">587 jobs</span>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Data Analyst, Stripe', dept: 'Finance', status: 'Applied', color: 'green' },
                { title: 'Strategy Partner, Microsoft', dept: 'Corporate', status: 'Pending', color: 'yellow' },
                { title: 'Product Manager', dept: 'Technology', status: 'Applied', color: 'green' },
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.dept}</p>
                  </div>
                  <span className={`tag tag-${job.color} text-xs`}>{job.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-3xl font-bold text-gray-900">{animatedStats.success}%</span>
            </div>
            <p className="text-sm text-gray-600">More likely to get hired</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Send className="w-5 h-5 text-purple-500" />
              <span className="text-3xl font-bold text-gray-900">{animatedStats.jobs.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600">Jobs applied to</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">3x</span>
            </div>
            <p className="text-sm text-gray-600">Faster job search</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
