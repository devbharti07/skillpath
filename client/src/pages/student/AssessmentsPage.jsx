import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import {
  FileCheck2,
  Clock,
  HelpCircle,
  Award,
  ArrowRight,
  History,
  CheckCircle2,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'history'
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assRes, histRes] = await Promise.all([
        api.getAssessments(),
        api.getAssessmentHistory()
      ]);
      setAssessments(assRes || []);
      setHistory(histRes || []);
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Skill Assessments
          </h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
            Test your knowledge with timed evaluations. Scores verify skills on your student profile.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'catalog'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-textMuted-light dark:text-textMuted-dark'
            }`}
          >
            Available Tests ({assessments.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-textMuted-light dark:text-textMuted-dark'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My History ({history.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-textMuted-light dark:text-textMuted-dark">
          Loading assessments...
        </div>
      ) : activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map(a => (
            <div
              key={a.id}
              className="glass-card rounded-3xl p-6 border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between hover:shadow-soft-lg transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary">
                    {a.category}
                  </span>
                  <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark">
                    Passing: {a.passingScorePercent || 60}%
                  </span>
                </div>

                <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
                  {a.title}
                </h3>

                <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
                  {a.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-textMuted-light dark:text-textMuted-dark pt-1">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    {a.totalQuestions} Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {a.durationMinutes} Mins
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {a.difficulty}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
                {a.lastAttempt ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-textMuted-light dark:text-textMuted-dark">Previous Score:</span>
                      <span className={`font-extrabold ${a.lastAttempt.scorePercent >= (a.passingScorePercent || 60) ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {a.lastAttempt.scorePercent}% ({a.lastAttempt.proficiencyResult})
                      </span>
                    </div>
                    <Link
                      to={`/dashboard/assessments/${a.slug}`}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-textMain-light dark:text-textMain-dark hover:bg-slate-200 text-center block transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake Assessment
                    </Link>
                  </div>
                ) : (
                  <Link
                    to={`/dashboard/assessments/${a.slug}`}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20 text-center block transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl space-y-3">
              <History className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">No attempts yet</h4>
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Take a skill assessment to see your historical evaluation results.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((att, idx) => {
                const cat = att.assessment?.category || att.category || 'Skill Evaluation';
                const title = att.assessment?.title || att.title || att.assessmentTitle || 'Assessment Result';
                const targetSlug = att.assessment?.slug || att.assessmentSlug || 'javascript-core';
                const score = att.scorePercent ?? att.percentage ?? 0;
                const prof = att.proficiencyResult || att.proficiency || 'Proficient';
                const correctCount = att.correctAnswers ?? att.correctCount ?? 0;
                const totalQ = att.totalQuestions || 5;

                return (
                  <div
                    key={att.id || idx}
                    className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-borderBase-light dark:border-borderBase-dark"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {cat}
                      </span>
                      <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">
                        {title}
                      </h4>
                      <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
                        Completed: {att.completedAt ? new Date(att.completedAt).toLocaleDateString() : 'Recently'} • {correctCount} of {totalQ} correct
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-xl font-extrabold ${score >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {score}%
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-textMuted-light dark:text-textMuted-dark uppercase">
                          {prof}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/assessments/${targetSlug}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-borderBase-light dark:border-borderBase-light hover:bg-slate-100 text-textMain-light dark:text-textMain-dark"
                      >
                        Retake
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
