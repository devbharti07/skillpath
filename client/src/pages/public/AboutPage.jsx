import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Target, Brain, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Mission</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-textMain-light dark:text-textMain-dark leading-tight">
          Empowering the next generation of engineers with honest, evidence-based guidance.
        </h1>
        <p className="text-sm sm:text-base text-textMuted-light dark:text-textMuted-dark leading-relaxed">
          SkillPath was built to eliminate the noise, inflated credentials, and generic AI hallucinations in online learning. We provide structured curriculum phases, server-verified diagnostic testing, and verifiable portfolio projects.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-3 border">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Transparent Evidence</h3>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
            We clearly distinguish between self-reported interests, verified test scores, and untested skills. No fake badges or false employment guarantees.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 border">
          <div className="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-950/50 text-secondary flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Realistic Pacing</h3>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
            Every roadmap adapts to the student’s weekly availability. We compute estimated timelines based on actual curriculum workload, not arbitrary calendar dates.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 border">
          <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950/50 text-accent flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Independent Proof of Work</h3>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
            Real portfolio projects with verified repositories and live demo links prove competence far better than certificates ever could.
          </p>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="glass-card p-8 rounded-3xl border border-borderBase-light dark:border-borderBase-dark space-y-4">
        <h3 className="text-xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Our Educational Methodology
        </h3>
        <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed">
          Most beginners drop out because they don’t know where they stand or what to do next. SkillPath’s 6-phase engineering roadmaps guide students from internet mechanics and language syntax to production architectural patterns, accessibility standards, automated testing, and interview readiness.
        </p>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-800/80 text-center space-y-4">
        <h3 className="text-xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Start your career development journey today
        </h3>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20"
        >
          <span>Create Free Student Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
