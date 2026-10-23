import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Code,
  Heart,
  Layers,
  Map,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function CareerDetailPage() {
  const { slug } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setLoading(true);
        const data = await api.getCareer(slug);
        setCareer(data);
        setBookmarked(data.isBookmarked || false);
      } catch (err) {
        console.error('Failed to load career:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!career) return;
    try {
      const res = await api.toggleBookmark('CAREER', career.id);
      setBookmarked(res.bookmarked);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Loading career profile...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="font-bold text-lg">Career profile not found</h3>
        <Link to="/careers" className="text-xs font-bold text-primary">Browse all careers</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-borderBase-light dark:border-borderBase-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {career.category} Career Track
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
              {career.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                bookmarked
                  ? 'border-primary bg-primary-50 dark:bg-primary-950/40 text-primary'
                  : 'border-borderBase-light dark:border-borderBase-dark text-textMuted-light dark:text-textMuted-dark'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-primary' : ''}`} />
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <Link
              to={`/dashboard/roadmaps/${career.roadmapSlug || career.roadmaps?.[0]?.slug || 'frontend-developer'}`}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <span>Start Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-sm sm:text-base text-textMuted-light dark:text-textMuted-dark leading-relaxed">
          {career.description}
        </p>

        {/* Quick Meta Pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-textMain-light dark:text-textMain-dark font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" /> Est. Salary: {career.salaryRange || '$85,000 - $140,000'}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-textMain-light dark:text-textMain-dark font-medium">
            Level: <strong>{career.level || career.difficulty || 'All Levels'}</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-textMain-light dark:text-textMain-dark font-medium">
            Demand: <strong>{career.marketDemand || 'Very High'}</strong>
          </span>
        </div>
      </div>

      {/* Responsibilities & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-borderBase-light dark:border-borderBase-dark">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Typical Responsibilities
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark">
            {(career.responsibilities || []).map((resp, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical & Soft Skills */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-borderBase-light dark:border-borderBase-dark">
          <div className="space-y-3">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Code className="w-4 h-4 text-secondary" />
              Required Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(career.requiredSkills || career.technicalSkills || []).map((sk) => (
                <span key={sk} className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary border border-primary-200 dark:border-primary-800">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
            <h3 className="font-bold text-sm text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Essential Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(career.softSkills || []).map((sk) => (
                <span key={sk} className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-textMuted-light dark:text-textMuted-dark">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisites & Recommended Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-borderBase-light dark:border-borderBase-dark">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Recommended Prerequisites
          </h3>
          <ul className="space-y-2 text-xs text-textMuted-light dark:text-textMuted-dark">
            {(career.prerequisites || []).map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-borderBase-light dark:border-borderBase-dark">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            Recommended Portfolio Projects
          </h3>
          <div className="space-y-3">
            {(career.recommendedProjects || []).map((proj, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">{typeof proj === 'string' ? proj : proj.title}</h4>
                {proj.description && <p className="text-[11px] text-textMuted-light dark:text-textMuted-dark mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sourced Labor Market Note & Transparency Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-borderBase-light dark:border-borderBase-dark space-y-2 text-xs">
        <h4 className="font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500" />
          Labor Market Context & Transparency Notice
        </h4>
        <p className="text-textMuted-light dark:text-textMuted-dark leading-relaxed">
          {career.salaryNote || 'Salary ranges and market demand metrics reflect aggregated industry benchmarks from public developer reports (e.g., U.S. BLS and Stack Overflow Developer Survey). Individual compensation varies based on geography, experience, and organization size.'}
        </p>
      </div>
    </div>
  );
}
