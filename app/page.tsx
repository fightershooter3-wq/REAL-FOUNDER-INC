'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Zap, Target, TrendingUp, Users, Lightbulb, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  const [_email, _setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            🚀 MicroFounder AI
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-slate-700">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Build Your Startup <span className="text-blue-400">With AI</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            MicroFounder AI is the all-in-one platform for teenagers and early-stage founders to validate ideas, execute with precision, and launch real startups using structured systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-slate-300 text-center mb-8">
            We believe that age shouldn't limit ambition. MicroFounder AI empowers the next generation of founders with AI-driven tools, structured frameworks, and measurable execution systems to turn ideas into real, profitable businesses.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-700 border-slate-600 p-6">
              <Lightbulb className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Validate Ideas</h3>
              <p className="text-slate-300">AI-powered analysis to test your startup concept before investing time and money.</p>
            </Card>
            <Card className="bg-slate-700 border-slate-600 p-6">
              <Target className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Execute Precisely</h3>
              <p className="text-slate-300">4-week sprint plans with daily tasks, measurable outcomes, and progress tracking.</p>
            </Card>
            <Card className="bg-slate-700 border-slate-600 p-6">
              <TrendingUp className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Launch & Scale</h3>
              <p className="text-slate-300">Tools for market research, financial projections, and founder growth tracking.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Validate Your Idea</h3>
              <p className="text-slate-300">
                Submit your startup concept. Our AI analyzes market clarity, problem-solution fit, and monetization potential.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Build Your Plan</h3>
              <p className="text-slate-300">
                Generate Lean Canvas, business models, market research, and 4-week execution sprints with AI guidance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Execute & Track</h3>
              <p className="text-slate-300">
                Complete daily tasks, log validation conversations, track progress, and grow as a founder with real metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Powerful Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: 'Idea Validator', desc: 'AI-powered analysis of your startup concept' },
              { icon: Target, title: 'Market Research', desc: 'TAM/SAM/SOM estimation and trend analysis' },
              { icon: TrendingUp, title: 'Financial Projections', desc: 'Revenue forecasts and break-even analysis' },
              { icon: Users, title: 'Competitor Analysis', desc: 'Identify strengths, weaknesses, and differentiation' },
              { icon: CheckCircle, title: 'Sprint Builder', desc: '4-week execution plans with daily tasks' },
              { icon: Lightbulb, title: 'AI Mentor Chat', desc: 'Context-aware startup advice and guidance' },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-slate-700 border-slate-600 p-6 flex gap-4">
                <feature.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-slate-300 text-sm">{feature.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">What Founders Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Alex Chen',
                role: 'Founder, TechFlow',
                quote: 'MicroFounder AI helped me validate my idea in 2 weeks instead of 2 months. The AI insights were incredibly valuable.',
              },
              {
                name: 'Sarah Johnson',
                role: 'Founder, EcoStart',
                quote: 'The sprint builder and daily task system kept me accountable. I launched my MVP in 4 weeks!',
              },
              {
                name: 'Marcus Williams',
                role: 'Founder, DataViz',
                quote: 'As a teenager, I felt lost building a startup. MicroFounder AI gave me the structure and confidence I needed.',
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="bg-slate-700 border-slate-600 p-6">
                <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-400">{testimonial.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Build Your Startup?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of founders building real businesses with MicroFounder AI.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8">
              Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">MicroFounder AI</h3>
              <p className="text-slate-400 text-sm">Building the future of startup execution.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 MicroFounder AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
