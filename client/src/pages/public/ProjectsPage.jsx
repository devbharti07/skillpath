import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { FolderGit2, CheckCircle2, ArrowRight, Layers, Code } from 'lucide-react';

export default function ProjectsPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await api.getProjectTemplates();
        setTemplates(data || []);
      } catch (err) {
        console.error('Failed to load project templates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Proof of Work</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Curated Project Templates
        </h1>
        <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark">
          Move beyond boilerplate tutorials. Build production-grade software that proves your competence to engineering managers.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map(temp => (
            <div
              key={temp.id}
              className="glass-card rounded-3xl p-6 border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary uppercase">
                    {temp.category}
                  </span>
                  <span className="text-xs font-semibold text-textMuted-light dark:text-textMuted-dark">
                    {temp.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
                  {temp.title}
                </h3>

                <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
                  {temp.description}
                </p>

                {/* Tech Stack */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark">
                    Suggested Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {temp.suggestedTech.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="space-y-1.5 pt-2 border-t border-borderBase-light dark:border-borderBase-dark">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark">
                    Learning Objectives:
                  </span>
                  <ul className="text-xs text-textMuted-light dark:text-textMuted-dark space-y-1">
                    {temp.learningObjectives.slice(0, 3).map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
                <Link
                  to="/dashboard/projects"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 text-center block transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Adopt in My Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
