import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Brain,
  Code2,
  Shield,
  Layers,
  ChevronDown,
  Target,
  BarChart,
  Award,
  Zap,
  Terminal,
  Database,
  Layout,
  ExternalLink,
  FolderGit2
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does SkillPath assess my actual skills?',
      a: 'SkillPath uses timed conceptual and practical assessments with server-side validation. Your results distinguish verified skills from self-reported interests, providing an accurate, honest baseline without inflated claims.'
    },
    {
      q: 'Are the career roadmaps realistic for beginners?',
      a: 'Yes. Each roadmap is structured in sequential phases—from internet and language fundamentals to advanced architecture and portfolio deployment. The system estimates your completion timeline based on your weekly availability.'
    },
    {
      q: 'Does SkillPath guarantee job placement?',
      a: 'No. SkillPath is an educational skill-development and career exploration platform. While we provide labor market data and structured project requirements to make you competitive, we do not make false employment guarantees.'
    },
    {
      q: 'Can I track projects and build a shareable portfolio?',
      a: 'Yes! The Project Workspace allows you to manage milestone progress, record repository links, live demos, and notes. Completed projects automatically appear on your public SkillPath portfolio.'
    },
    {
      q: 'What is the AI Career Assistant?',
      a: 'The AI Assistant helps you compare career paths, understand difficult concepts, and break large goals into actionable daily tasks. When no live LLM key is configured, it seamlessly uses our built-in SkillPath Guidance Engine.'
    }
  ];

  const popularAssessments = [
    { title: 'JavaScript Core & Async Mastery', category: 'JavaScript', questions: 5, time: '10 min', level: 'Intermediate', slug: 'javascript-core' },
    { title: 'HTML5 & Modern CSS3 Architecture', category: 'HTML and CSS', questions: 4, time: '8 min', level: 'Beginner', slug: 'html-css' },
    { title: 'React.js Component Architecture', category: 'React', questions: 4, time: '10 min', level: 'Intermediate', slug: 'react-fundamentals' },
    { title: 'SQL & Database Modeling', category: 'SQL', questions: 4, time: '10 min', level: 'Intermediate', slug: 'sql-relational' }
  ];

  return (
    <div className="space-y-24 py-8 lg:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-xs font-semibold text-primary dark:text-primary-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discover Your Strengths. Build Your Future.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark leading-[1.1]">
              Your Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Your Career.
              </span> <br />
              Your Future.
            </h1>

            <p className="text-base sm:text-lg text-textMuted-light dark:text-textMuted-dark leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover what you're good at, explore career opportunities, test your skills, and follow a personalized roadmap to reach your goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-primary hover:bg-primary-700 shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
              >
                <span>Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/careers"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold text-textMain-light dark:text-textMain-dark border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
              >
                Explore Careers
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-textMuted-light dark:text-textMuted-dark">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Evidence-based assessments</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 6-Phase structured roadmaps</span>
            </div>
          </div>

          {/* Hero Visual Preview */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl -z-10 opacity-70"></div>
            <div className="glass-card rounded-2xl p-6 shadow-soft-lg space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-borderBase-light dark:border-borderBase-dark">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    JS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-textMain-light dark:text-textMain-dark">Frontend Developer</h4>
                    <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Active Career Track • 24 Weeks</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  65% Completed
                </span>
              </div>

              {/* Roadmap Mini Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Phase 1: Web Fundamentals
                  </span>
                  <span className="text-emerald-600 font-bold">Verified</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Phase 2: JavaScript & Async
                  </span>
                  <span className="text-emerald-600 font-bold">Verified</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-primary-50 dark:bg-primary-950/30 p-2.5 rounded-lg border border-primary-200 dark:border-primary-800">
                  <span className="font-semibold text-primary dark:text-primary-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Phase 3: React & Architecture
                  </span>
                  <span className="text-primary font-bold">In Progress</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-textMuted-light dark:text-textMuted-dark">
                  <span>Weekly Pace: 15 hrs/week</span>
                  <span>Target: Oct 2026</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-full w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Why SkillPath</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Everything you need to turn curiosity into a tech career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl hover:shadow-soft-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">Honest Skill Verification</h3>
            <p className="text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed">
              We never fabricate student scores. Secure server-evaluated quizzes give you genuine insight into your strengths and areas needing improvement.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:shadow-soft-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-950/50 text-secondary flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">Structured 6-Phase Roadmaps</h3>
            <p className="text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed">
              Stop wandering through random video tutorials. Follow structured curriculum phases with duration estimates tailored to your weekly availability.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:shadow-soft-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-950/50 text-accent flex items-center justify-center">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">Verified Project Portfolios</h3>
            <p className="text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed">
              Build production-grade applications with verified repositories and live demo links that recruiters can inspect on your public portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW SKILLPATH WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Workflow</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Four simple steps to career confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Discover & Onboard', desc: 'Answer 8 targeted questions about your interests, current education level, and weekly availability.' },
            { step: '02', title: 'Assess Baseline', desc: 'Take quick 15-minute diagnostic assessments to evaluate your current knowledge without guessing.' },
            { step: '03', title: 'Follow Roadmap', desc: 'Complete organized phase curriculum items with vetted official documentation and exercises.' },
            { step: '04', title: 'Build & Showcase', desc: 'Ship real-world portfolio projects, track deadlines, and share your public engineering portfolio.' }
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl border border-borderBase-light dark:border-borderBase-dark bg-white/60 dark:bg-slate-800/40 space-y-3 relative overflow-hidden">
              <span className="text-3xl font-extrabold text-primary/20 dark:text-primary/10">
                {item.step}
              </span>
              <h4 className="text-base font-bold text-textMain-light dark:text-textMain-dark">{item.title}</h4>
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR ASSESSMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Diagnostic Testing</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
              Popular Skill Assessments
            </h3>
          </div>
          <Link to="/skills" className="text-sm font-semibold text-primary hover:text-primary-700 flex items-center gap-1">
            <span>View All Skills & Tests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularAssessments.map((a) => (
            <div key={a.slug} className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-textMuted-light dark:text-textMuted-dark uppercase tracking-wider">
                  {a.category}
                </span>
                <h4 className="font-bold text-base text-textMain-light dark:text-textMain-dark mt-2">{a.title}</h4>
                <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">{a.questions} Questions • {a.time} • {a.level}</p>
              </div>
              <Link
                to={`/dashboard/assessments/${a.slug}`}
                className="w-full py-2 text-center rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-700 transition-colors"
              >
                Take Assessment
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SAMPLE CAREER ROADMAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 rounded-3xl border border-borderBase-light dark:border-borderBase-dark">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Curriculum Architecture</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark mt-1">
              Frontend Developer Roadmap Preview
            </h3>
            <p className="text-sm text-textMuted-light dark:text-textMuted-dark mt-2">
              Our 6-phase curriculum bridges the gap between basic coding syntax and professional engineering standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { phase: 1, title: 'Web Fundamentals', items: ['HTML5 & Semantics', 'CSS Grid & Flexbox', 'Responsive Design'] },
              { phase: 2, title: 'JavaScript & Async', items: ['ES6+ Syntaxes', 'DOM & Events', 'Fetch API & Promises'] },
              { phase: 3, title: 'React Architecture', items: ['Component State', 'Hooks Lifecycle', 'Routing & Layouts'] },
              { phase: 4, title: 'Professional Dev', items: ['Git Workflows', 'WCAG Accessibility', 'Testing with Vitest'] },
              { phase: 5, title: 'Portfolio Projects', items: ['Task Manager App', 'Analytics Dashboard', 'Capstone Project'] },
              { phase: 6, title: 'Career Preparation', items: ['Resume Review', 'DSA Fundamentals', 'Mock Interviews'] }
            ].map((p) => (
              <div key={p.phase} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="text-[11px] font-bold text-primary">Phase {p.phase}</span>
                <h5 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">{p.title}</h5>
                <ul className="text-xs text-textMuted-light dark:text-textMuted-dark space-y-1">
                  {p.items.map((i) => <li key={i}>• {i}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/roadmaps/frontend-developer-roadmap" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-700">
              <span>View Full Interactive Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Got Questions?</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl overflow-hidden border border-borderBase-light dark:border-borderBase-dark transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-textMain-light dark:text-textMain-dark"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-textMuted-light dark:text-textMuted-dark transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary via-indigo-700 to-secondary p-8 sm:p-14 text-white text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take control of your career path?
            </h2>
            <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
              Join thousands of college students discovering their true technical strengths and building proven portfolios with SkillPath.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-primary bg-white hover:bg-slate-100 shadow-lg transition-transform active:scale-95"
              >
                Open Student Workspace
              </Link>
              <Link
                to="/careers"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                Browse Career Tracks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
