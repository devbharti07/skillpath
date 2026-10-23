import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { Map, ArrowRight, CheckCircle2, Clock, Play, BookOpen, Layers } from 'lucide-react';

export default function StudentRoadmapsPage() {
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [allRoadmaps, setAllRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [myRes, allRes] = await Promise.all([
        api.getMyRoadmaps(),
        api.getRoadmaps()
      ]);
      setMyRoadmaps(myRes || []);
      setAllRoadmaps(allRes || []);
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">My Career Roadmaps</h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
            Follow structured curriculum phases, mark items complete, and calculate your target schedule.
          </p>
        </div>
      </div>

      {/* Enrolled Roadmaps */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark">
          Enrolled Roadmaps ({myRoadmaps.length})
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading your roadmaps...</div>
        ) : myRoadmaps.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-3">
            <Map className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm">No roadmaps enrolled yet</h4>
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Choose a career track below to enroll and begin tracking items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRoadmaps.map(r => (
              <div
                key={r.id}
                className="glass-card p-6 rounded-3xl border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {r.career?.category || 'Engineering'}
                    </span>
                    <span className="text-xs font-bold text-primary bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-full">
                      {r.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-lg text-textMain-light dark:text-textMain-dark">{r.title}</h4>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-textMain-light dark:text-textMain-dark">
                      <span>Curriculum Progress</span>
                      <span>{r.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${r.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-textMuted-light dark:text-textMuted-dark pt-1">
                    <span>Pace: {r.weeklyHours} hrs/week</span>
                    {r.targetCompletionDate && (
                      <span>Target: {new Date(r.targetCompletionDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
                  <Link
                    to={`/dashboard/roadmaps/${r.slug}`}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20 text-center block transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Open Interactive Tracker</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explore More Roadmaps Catalog */}
      <div className="space-y-4 pt-6">
        <h3 className="font-bold text-sm uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark">
          Explore All Learning Roadmaps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allRoadmaps.map(r => (
            <div
              key={r.id}
              className="glass-card p-5 rounded-2xl border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase tracking-wider">
                  {r.level} • {r.durationWeeks} Weeks
                </span>
                <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">{r.title}</h4>
                <p className="text-xs text-textMuted-light dark:text-textMuted-dark line-clamp-2">{r.description}</p>
                <div className="text-[11px] text-textMuted-light dark:text-textMuted-dark pt-1">
                  {r.totalPhases} Curriculum Phases • {r.totalItems} Topics
                </div>
              </div>

              <div className="pt-3 border-t border-borderBase-light dark:border-borderBase-dark">
                <Link
                  to={`/dashboard/roadmaps/${r.slug}`}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-textMain-light dark:text-textMain-dark hover:bg-slate-200 text-center block"
                >
                  View Curriculum →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
