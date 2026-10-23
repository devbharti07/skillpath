import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900/90 text-textMuted-light dark:text-textMuted-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-textMain-light dark:text-textMain-dark">
                Skill<span className="text-primary dark:text-primary-400">Path</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6 text-textMuted-light dark:text-textMuted-dark">
              An evidence-based career exploration and skill development platform for students and aspiring engineers. Discover strengths, verify skills, and follow structured roadmaps.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border border-borderBase-light dark:border-borderBase-dark flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border border-borderBase-light dark:border-borderBase-dark flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border border-borderBase-light dark:border-borderBase-dark flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/careers" className="hover:text-primary transition-colors">Career Explorer</Link></li>
              <li><Link to="/skills" className="hover:text-primary transition-colors">Skill Catalog</Link></li>
              <li><Link to="/roadmaps" className="hover:text-primary transition-colors">Learning Roadmaps</Link></li>
              <li><Link to="/projects" className="hover:text-primary transition-colors">Project Templates</Link></li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About SkillPath</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Student Login</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Student Workspace</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark uppercase tracking-wider mb-4">
              Notice
            </h4>
            <p className="text-xs leading-relaxed mb-3 text-slate-500">
              Salary and job estimates represent educational context from labor analytics reports. No placement guarantees are made.
            </p>
            <div className="text-[11px] text-slate-400">
              Verified with Prisma ORM & PostgreSQL/SQLite.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-borderBase-light dark:border-borderBase-dark flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillPath Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for ambitious learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
