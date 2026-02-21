import { useEffect, useRef, useState } from 'react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const Testimonials = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const testimonials = [
    {
      name: 'Alex R.',
      role: 'Recent College Graduate',
      content: 'AutoApply was a lifeline. Their tools helped me identify key skills I needed to develop and connected me with the right opportunities. I got my dream job within a month!',
      rating: 5,
      highlight: 'lifeline',
      avatar: 'AR',
      color: 'from-violet-500 to-purple-600',
    },
    {
      name: 'Jess G.',
      role: 'Marketing Professional',
      content: 'SO GLAD I SUBSCRIBED!! Got a job in a week using the application kit and interview help. The AI cover letter generator is incredible!',
      rating: 5,
      highlight: 'job in a week',
      avatar: 'JG',
      color: 'from-pink-500 to-rose-600',
    },
    {
      name: 'Jordan M.',
      role: 'Job Seeker in Tech',
      content: "AutoApply's AI-driven resume builder helped me craft a resume that really stood out. I got callbacks from companies I've been eyeing for years. This tool is a game-changer for anyone job hunting in the tech industry!",
      rating: 5,
      highlight: 'game-changer',
      avatar: 'JM',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Liam S.',
      role: 'Experienced Professional',
      content: 'With AutoApply, I took my career to the next level. The AI resume builder and direct access to opportunities opened doors I didn\'t know existed. It\'s a must-have for anyone serious about career growth.',
      rating: 5,
      highlight: 'next level',
      avatar: 'LS',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Maria G.',
      role: 'Career Changer',
      content: 'Switching careers was daunting, but AutoApply made it seamless. Their tailored resumes and job recommendations helped me transition smoothly into a new field. I\'ve never felt more confident in my professional journey!',
      rating: 5,
      highlight: 'seamless',
      avatar: 'MG',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Rohit K.',
      role: 'Software Engineer',
      content: 'Finally starting getting interviews at Apple and Google and nailed the interviews with the help of AutoApply. The interview buddy feature is like having a personal coach. Thank you!',
      rating: 5,
      highlight: 'Apple and Google',
      avatar: 'RK',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Poppy B.',
      role: 'UX Designer',
      content: 'The resume builder and interview prep is like magic! I got a job in a week after applying for months without success. AutoApply completely transformed my job search.',
      rating: 5,
      highlight: 'like magic',
      avatar: 'PB',
      color: 'from-fuchsia-500 to-pink-600',
    },
    {
      name: 'Tim K.',
      role: 'Product Manager',
      content: 'I used to dread writing cover letters, but this AI tool has made it a breeze. It\'s like it reads my mind and knows exactly what to say. Highly recommend!',
      rating: 5,
      highlight: 'breeze',
      avatar: 'TK',
      color: 'from-violet-500 to-purple-600',
    },
    {
      name: 'Riz A.',
      role: 'Data Scientist',
      content: 'I got $100K/year job at Google with AutoApply\'s cover letter! The AI optimization helped me stand out from thousands of applicants. Best investment I ever made.',
      rating: 5,
      highlight: '$100K/year job',
      avatar: 'RA',
      color: 'from-green-500 to-emerald-600',
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 px-1 rounded">{part}</span>
      ) : part
    )
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Quote className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            We Help Job Seekers Succeed
          </h2>
          <p className="text-lg text-gray-600">
            Join over <span className="font-semibold text-purple-600">1,166,440+</span> experienced job seekers 
            who found their dream jobs with AutoApply.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              ref={(el) => { cardRefs.current[index] = el }}
              data-index={index}
              className={`transition-all duration-700 ${
                visibleCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{highlightText(testimonial.content, testimonial.highlight)}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-medium text-sm`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <p className="text-4xl font-bold mb-2">1.1M+</p>
                  <p className="text-violet-200">Happy Users</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">370K+</p>
                  <p className="text-violet-200">Jobs Applied</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">80%</p>
                  <p className="text-violet-200">Success Rate</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">4.9★</p>
                  <p className="text-violet-200">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
