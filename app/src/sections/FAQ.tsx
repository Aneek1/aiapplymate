import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'What is AutoApply and how does it work?',
      answer: 'AutoApply is an AI-powered job application platform that automates your job search. Our system finds high-match roles, tailors your resume and cover letter for each application, auto-applies to jobs on your behalf, and provides interview coaching. Simply upload your resume, set your preferences, and let our AI do the heavy lifting.',
    },
    {
      question: 'How can AutoApply help me get a job faster?',
      answer: 'AutoApply accelerates your job search by: (1) Automatically applying to hundreds of relevant jobs daily, (2) Optimizing your resume and cover letter for each specific job using AI, (3) Providing real-time interview coaching and practice, (4) Tracking all your applications in one place. Our users are 80% more likely to get hired faster than traditional job searching.',
    },
    {
      question: 'What features does AutoApply offer?',
      answer: 'AutoApply offers a comprehensive suite of tools including: AI Resume Builder, AI Cover Letter Generator, Auto Apply to Jobs, Interview Practice Simulator, Interview Buddy (real-time coaching), Resume Translator (50+ languages), Application Tracker, and detailed Analytics Dashboard.',
    },
    {
      question: 'Do I need an existing resume to use AutoApply?',
      answer: 'No, you don\'t need an existing resume. Our AI Resume Builder can create a professional, ATS-optimized resume from scratch based on your skills, experience, and career goals. However, if you have an existing resume, you can upload it and our AI will enhance and optimize it for better results.',
    },
    {
      question: 'Will my AutoApply resume be ATS-friendly?',
      answer: 'Absolutely! All resumes created or optimized by AutoApply are specifically designed to pass Applicant Tracking Systems (ATS). We use proven formatting, include relevant keywords, and follow best practices to ensure your resume gets seen by hiring managers. Our average ATS match score is 92%.',
    },
    {
      question: 'Does using AI mean my resume and cover letters will sound generic?',
      answer: 'Not at all. Our AI analyzes each job description and tailors your application materials specifically for that role. It highlights your most relevant skills and experiences, uses industry-specific language, and maintains your unique voice while optimizing for the position.',
    },
    {
      question: 'Can employers tell if I used AI to write my application?',
      answer: 'No, employers cannot detect that you used AutoApply. Our AI generates natural, professional content that sounds like it was written by a human. The content is based on your actual skills and experience, just optimized for each specific job.',
    },
    {
      question: 'Is AutoApply free to use? Do you offer a free trial?',
      answer: 'Yes! We offer a free plan that includes basic resume building and limited job applications. For full access to all features including unlimited auto-apply, advanced AI optimization, and interview coaching, we offer affordable premium plans. You can try premium features risk-free with our 7-day free trial.',
    },
    {
      question: 'What subscription plans and pricing does AutoApply offer?',
      answer: 'We offer three plans: (1) Free Plan - Basic resume builder and 5 job applications/month, (2) Pro Plan ($19/month) - Unlimited applications, AI optimization, and interview practice, (3) Premium Plan ($39/month) - Everything in Pro plus Auto Apply, Interview Buddy, and priority support. Annual plans save you 40%.',
    },
    {
      question: 'Do I have to pay separately for each feature?',
      answer: 'No, all features are included in your subscription plan. There are no hidden fees or additional charges. Pro and Premium subscribers get access to all tools and features without any extra costs.',
    },
    {
      question: 'Do you offer discounts for students or other groups?',
      answer: 'Yes! We offer a 50% student discount with a valid .edu email address. We also have special discounts for recent graduates, military veterans, and non-profit employees. Contact our support team to learn more about eligibility.',
    },
    {
      question: 'What if I\'m not satisfied with AutoApply? Can I cancel or get a refund?',
      answer: 'We offer a 30-day money-back guarantee for all premium plans. If you\'re not satisfied, simply contact our support team within 30 days of your purchase for a full refund. You can also cancel your subscription at any time with no penalties.',
    },
    {
      question: 'Can I create multiple versions of my resume or cover letter?',
      answer: 'Yes! You can create unlimited versions of your resume and cover letter. This is perfect for targeting different industries or job types. Our system will even suggest which version to use based on the specific job you\'re applying for.',
    },
    {
      question: 'Can I edit AI-generated resumes, pick templates, and export in different formats?',
      answer: 'Absolutely! You have full control over your resumes. Choose from 20+ professional templates, edit any section of AI-generated content, and export your resume in PDF, DOCX, or TXT formats. You can also customize fonts, colors, and layout.',
    },
    {
      question: 'Can AutoApply really apply to jobs on my behalf?',
      answer: 'Yes! Our Auto Apply feature can automatically submit applications to jobs that match your preferences. You set the criteria (job titles, locations, salary range, etc.), and our system applies to matching positions 24/7. You can review and approve applications before they\'re sent, or let it run fully automatically.',
    },
    {
      question: 'Who is AutoApply for?',
      answer: 'AutoApply is designed for anyone looking for a job or career change. Whether you\'re a recent graduate, mid-career professional, executive, or career changer, our tools adapt to your experience level and goals. We support all industries and job functions.',
    },
    {
      question: 'How is AutoApply different from other resume builders?',
      answer: 'Unlike traditional resume builders, AutoApply uses advanced AI to: (1) Automatically tailor your resume for each job, (2) Apply to jobs on your behalf, (3) Provide real-time interview coaching, (4) Track all your applications, (5) Continuously learn and improve based on your success. It\'s a complete job search automation platform, not just a resume tool.',
    },
    {
      question: 'Is my data safe and private with AutoApply?',
      answer: 'Absolutely. We take data security very seriously. Your information is encrypted using bank-level SSL encryption, stored on secure servers, and never sold to third parties. We comply with GDPR and other privacy regulations. You can delete your data at any time.',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about AutoApply. Can't find what you're looking for? 
            Feel free to contact our support team.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'shadow-md border-purple-200' : 'shadow-sm'
              }`}
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <CardContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-purple-100">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help. Reach out and we'll get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="btn-primary">
                  Contact Support
                </Button>
                <Button variant="outline">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FAQ
