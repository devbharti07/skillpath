import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { Scale, Check, ArrowLeft, Code, Layers, ShieldCheck } from 'lucide-react';

export default function CareerComparePage() {
  const location = useLocation();
  const [careers, setCareers] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const initialSlugs = location.state?.selectedSlugs || ['frontend-developer', 'backend-developer'];

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        setLoading(true);
        const res = await api.compareCareers(initialSlugs);
        if (Array.isArray(res)) {
          setCareers(res);
          setInsights({ commonSkills: ['Git & GitHub', 'RESTful APIs', 'Problem Solving'] });
        } else {
          setCareers(res?.careers || []);
          setInsights(res?.comparisonInsights || { commonSkills: ['Git & GitHub', 'RESTful APIs', 'Problem Solving'] });
        }
      } catch (err) {
        console.error('Failed to compare careers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Comparing career pathways...</p>
      </div>
    );
  }

  if (careers.length < 2) {
    return (
      <div className="text-center py-16 space-y-4">
        <Scale className="w-10 h-10 text-secondary mx-auto" />
        <h3 className="font-bold text-lg">Select at least 2 careers to compare</h3>
        <Link to="/careers" className="text-xs font-bold text-primary">Browse Careers to Compare</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div className="space-y-1">
          <Link to="/careers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-700 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Career Explorer
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Scale className="w-6 h-6 text-secondary" />
            Side-by-Side Career Comparison
          </h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
            Evaluate curriculum length, required skills, and sample project expectations.
          </p>
        </div>
      </div>

      {/* Common Skills Highlight */}
      {insights?.commonSkills?.length > 0 && (
        <div className="p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800 text-xs space-y-1.5">
          <span className="font-bold text-secondary flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Shared Foundation Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {insights.commonSkills.map(s => (
              <span key={s} className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 font-semibold text-secondary shadow-sm">
                {s}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-textMuted-light dark:text-textMuted-dark">
            These competencies are valuable across all chosen tracks, making your study time transferable!
          </p>
        </div>
      )}

      {/* Comparison Matrix Table / Cards */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[700px]">
          {careers.map(career => {
            const skills = career.technicalSkills || career.requiredSkills || [];
            const diff = career.difficulty || career.level || 'Intermediate';
            const projects = career.exampleProjects || (career.recommendedProjects || []).map(p => typeof p === 'string' ? p : p.title);
            const prereqs = career.prerequisites || ['Basic computer literacy'];

            return (
              <div
                key={career.id}
                className="glass-card rounded-3xl p-6 border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary uppercase">
                      {career.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-textMain-light dark:text-textMain-dark mt-1">
                      {career.title}
                    </h3>
                  </div>

                  {/* Duration & Difficulty */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark block uppercase font-bold">Estimated Time</span>
                      <span className="font-bold text-textMain-light dark:text-textMain-dark">~{career.estimatedLearningWeeks || 24} Weeks</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark block uppercase font-bold">Difficulty</span>
                      <span className="font-bold text-textMain-light dark:text-textMain-dark">{diff}</span>
                    </div>
                  </div>

                  {/* Technical Skills */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-primary" /> Key Tech Skills
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map(s => (
                        <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/60 text-primary border border-primary-100 dark:border-primary-900">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Prerequisites
                    </h5>
                    <ul className="text-xs text-textMuted-light dark:text-textMuted-dark space-y-1">
                      {prereqs.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Example Projects */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500" /> Milestone Projects
                    </h5>
                    <ul className="text-xs text-textMuted-light dark:text-textMuted-dark space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>★ {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
                  <Link
                    to={`/careers/${career.slug}`}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 text-center block transition-colors shadow-sm"
                  >
                    Explore Complete Roadmap →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
