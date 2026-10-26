import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import {
  Compass,
  CheckCircle2,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Code2
} from 'lucide-react';

export default function PublicPortfolioPage() {
  const { userId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await api.getPublicPortfolio(userId);
        setPortfolio(data);
      } catch (err) {
        setError(err.message || 'Portfolio is private or user does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Compass className="w-12 h-12 text-slate-400" />
        <h2 className="text-xl font-bold text-textMain-light dark:text-textMain-dark">Portfolio Unavailable</h2>
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark max-w-sm">{error || 'Could not load portfolio data.'}</p>
        <Link to="/" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white">
          Return to SkillPath Home
        </Link>
      </div>
    );
  }

  const student = portfolio.student || portfolio.user || {};
  const verifiedSkills = portfolio.verifiedSkills || [];
  const completedProjects = portfolio.completedProjects || portfolio.projects || [];
  const achievements = portfolio.achievements || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-fadeIn">
      {/* Student Profile Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-borderBase-light dark:border-borderBase-dark space-y-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-3xl font-extrabold shadow-md flex-shrink-0">
            {student.fullName ? student.fullName[0].toUpperCase() : 'S'}
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-bold text-emerald-600 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified SkillPath Portfolio</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
              {student.fullName || 'Student Portfolio'}
            </h1>

            <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed">
              {student.bio || `Aspiring ${student.primaryCareerInterest || 'Software Engineer'}`}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-textMuted-light dark:text-textMuted-dark pt-1">
              {student.educationLevel && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" /> {student.educationLevel}
                </span>
              )}
              {student.primaryCareerInterest && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-secondary" /> {student.primaryCareerInterest}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center sm:justify-start gap-3 pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
          {student.githubUrl && (
            <a
              href={student.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {student.linkedinUrl && (
            <a
              href={student.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
          {student.portfolioWebsite && (
            <a
              href={student.portfolioWebsite}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Globe className="w-4 h-4" />
              <span>Personal Site</span>
            </a>
          )}
        </div>
      </div>

      {/* Verified Skills */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Assessment-Verified Skills ({verifiedSkills.length})
        </h3>

        {verifiedSkills.length === 0 ? (
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark italic">
            This student has not completed verified diagnostic assessments yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {verifiedSkills.map((sk, i) => (
              <div key={i} className="p-3.5 rounded-2xl glass-card border border-emerald-500/20 space-y-1">
                <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark uppercase font-bold">{sk.category}</span>
                <h5 className="font-bold text-xs text-textMain-light dark:text-textMain-dark">{sk.name}</h5>
                <div className="text-[11px] font-extrabold text-emerald-600">{sk.proficiency} ({sk.score}%)</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Projects */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          Completed Projects ({completedProjects.length})
        </h3>

        {completedProjects.length === 0 ? (
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark italic">
            No completed projects published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedProjects.map(proj => (
              <div key={proj.id} className="glass-card p-5 rounded-2xl border space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase">{proj.category || 'Engineering'}</span>
                  <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark mt-0.5">{proj.title}</h4>
                  <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1 line-clamp-2">{proj.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs pt-2 border-t border-borderBase-light dark:border-borderBase-dark">
                  {(proj.repoUrl || proj.githubUrl) && (
                    <a href={proj.repoUrl || proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-textMain-light dark:text-textMain-dark hover:text-primary">
                      <Github className="w-3.5 h-3.5" /> Repo
                    </a>
                  )}
                  {(proj.demoUrl || proj.liveUrl) && (
                    <a href={proj.demoUrl || proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-primary hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
          <Award className="w-4 h-4 text-secondary" />
          Milestone Badges ({achievements.length})
        </h3>

        <div className="flex flex-wrap gap-3">
          {achievements.map((ach, i) => (
            <div key={ach.id || i} className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center gap-2 text-xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-textMain-light dark:text-textMain-dark">{ach.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
