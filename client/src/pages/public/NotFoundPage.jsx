import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Home, LayoutDashboard } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
        <Compass className="w-8 h-8 text-white" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">404 Error</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed">
          The career roadmap, assessment, or section you requested doesn't exist or may have been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20 flex items-center gap-1.5 transition-all"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Student Dashboard</span>
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>SkillPath Home</span>
        </Link>
      </div>
    </div>
  );
}
