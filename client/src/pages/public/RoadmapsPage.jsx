import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { Map, Clock, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await api.getRoadmaps();
        setRoadmaps(data || []);
      } catch (err) {
        console.error('Failed to load roadmaps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Step-by-Step Curriculum</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Learning Roadmaps
        </h1>
        <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark">
          Structured 6-phase engineering tracks from computer foundations to production capstones and interview readiness.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading roadmaps...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map(r => (
            <div
              key={r.id}
              className="glass-card rounded-3xl p-6 border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary uppercase">
                    {r.career?.category || 'Engineering'}
                  </span>
                  <span className="text-xs font-semibold text-textMuted-light dark:text-textMuted-dark">
                    {r.level}
                  </span>
                </div>

                <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
                  {r.title}
                </h3>

                <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed line-clamp-3">
                  {r.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-textMuted-light dark:text-textMuted-dark pt-1">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    {r.totalPhases} Structured Phases
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~{r.durationWeeks} Weeks
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
                <Link
                  to={`/dashboard/roadmaps/${r.slug}`}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 text-center block transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Explore Interactive Curriculum</span>
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
