import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import {
  Map,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  ExternalLink,
  BookOpen,
  Save,
  Calendar,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoadmapWorkplacePage() {
  const { slug } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [openPhases, setOpenPhases] = useState({ 1: true, 2: true }); // expanded phase accordion states

  // Editable settings
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [personalNotes, setPersonalNotes] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const data = await api.getRoadmap(slug);
      setRoadmap(data);
      if (data.userRoadmap) {
        setWeeklyHours(data.userRoadmap.weeklyHours || 10);
        setPersonalNotes(data.userRoadmap.notes || '');
      }
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [slug]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await api.enrollRoadmap({
        roadmapId: roadmap.id,
        weeklyHours
      });
      await fetchRoadmap();
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      alert(err.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleItem = async (itemId, currentStatus) => {
    try {
      const res = await api.updateRoadmapProgress({
        roadmapId: roadmap.id,
        itemId,
        completed: !currentStatus
      });

      // Update local state without full reload
      setRoadmap(prev => ({
        ...prev,
        userRoadmap: {
          ...prev.userRoadmap,
          progressPercent: res.progressPercent
        },
        phases: prev.phases.map(phase => ({
          ...phase,
          items: phase.items.map(i => i.id === itemId ? { ...i, isCompleted: !currentStatus } : i)
        }))
      }));

      if (res.progressPercent === 100) {
        confetti({ particleCount: 100, spread: 80 });
      }
    } catch (err) {
      console.error('Failed to update item progress:', err);
    }
  };

  const handleSaveSettings = async () => {
    if (!roadmap?.userRoadmap?.id) return;
    try {
      setSavingSettings(true);
      await api.updateRoadmapSettings(roadmap.userRoadmap.id, {
        weeklyHours,
        notes: personalNotes
      });
      setSaveSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSaveSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const togglePhaseAccordion = (phaseNum) => {
    setOpenPhases(prev => ({ ...prev, [phaseNum]: !prev[phaseNum] }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Loading curriculum tracker...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="font-bold text-lg">Roadmap not found</h3>
        <Link to="/dashboard/roadmaps" className="text-xs font-bold text-primary">Browse roadmaps</Link>
      </div>
    );
  }

  const isEnrolled = Boolean(roadmap.userRoadmap);
  const progressPercent = roadmap.userRoadmap?.progressPercent || 0;

  // Calculate estimated weeks based on weekly study hours
  const totalCurriculumHours = roadmap.phases.reduce((sum, p) =>
    sum + p.items.reduce((iSum, item) => iSum + item.estimatedHours, 0)
  , 0);
  const estimatedWeeks = Math.ceil(totalCurriculumHours / (weeklyHours || 10));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div className="space-y-1">
          <Link to="/dashboard/roadmaps" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-700 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Roadmaps
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
            {roadmap.title}
          </h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
            {roadmap.description}
          </p>
        </div>

        {!isEnrolled ? (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{enrolling ? 'Enrolling...' : 'Enroll in Roadmap'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark uppercase font-bold">Progress</span>
              <div className="text-xl font-extrabold text-primary">{progressPercent}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Progress & Schedule Calculator Bar */}
      {isEnrolled && (
        <div className="glass-card p-6 rounded-3xl border border-borderBase-light dark:border-borderBase-dark space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-textMain-light dark:text-textMain-dark">Overall Completion</span>
                <span className="text-xs font-extrabold text-primary">{progressPercent}%</span>
              </div>
              <div className="w-64 sm:w-80 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Schedule Estimator */}
            <div className="flex items-center gap-4 text-xs text-textMuted-light dark:text-textMuted-dark">
              <div>
                <span className="block text-[10px] font-bold uppercase">Workload</span>
                <span className="font-bold text-textMain-light dark:text-textMain-dark">{totalCurriculumHours} Total Hours</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase">Estimated Timeline</span>
                <span className="font-bold text-textMain-light dark:text-textMain-dark">~{estimatedWeeks} Weeks ({weeklyHours}h/wk)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Phases & Interactive Topics */}
      <div className="space-y-6">
        <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
          Curriculum Phases & Checkpoints
        </h3>

        <div className="space-y-4">
          {roadmap.phases.map(phase => {
            const isOpen = openPhases[phase.phaseNumber] ?? true;
            const completedInPhase = phase.items.filter(i => i.isCompleted).length;

            return (
              <div
                key={phase.id}
                className="glass-card rounded-3xl border border-borderBase-light dark:border-borderBase-dark overflow-hidden transition-all"
              >
                {/* Phase Header Accordion */}
                <button
                  type="button"
                  onClick={() => togglePhaseAccordion(phase.phaseNumber)}
                  className="w-full p-5 text-left flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary font-bold text-xs flex items-center justify-center">
                      {phase.phaseNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">
                        Phase {phase.phaseNumber}: {phase.title}
                      </h4>
                      <p className="text-xs text-textMuted-light dark:text-textMuted-dark">{phase.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-textMuted-light dark:text-textMuted-dark">
                      {completedInPhase}/{phase.items.length} Done
                    </span>
                    <ChevronDown className={`w-4 h-4 text-textMuted-light dark:text-textMuted-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Phase Items Checklist */}
                {isOpen && (
                  <div className="p-5 space-y-3 divide-y divide-borderBase-light dark:divide-borderBase-dark">
                    {phase.items.map(item => (
                      <div
                        key={item.id}
                        className="pt-3 first:pt-0 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleItem(item.id, item.isCompleted)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors ${
                              item.isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                            }`}
                          >
                            {item.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </button>

                          <div className="space-y-1">
                            <span className={`text-xs font-bold ${item.isCompleted ? 'line-through text-slate-400' : 'text-textMain-light dark:text-textMain-dark'}`}>
                              {item.title}
                            </span>
                            <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
                              {item.description}
                            </p>

                            {/* Resource Links */}
                            {item.learningResources && item.learningResources.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {item.learningResources.map((resUrl, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={resUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    <span>Study Docs</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] text-textMuted-light dark:text-textMuted-dark whitespace-nowrap">
                          ~{item.estimatedHours} hrs
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Settings & Notes Panel (if enrolled) */}
      {isEnrolled && (
        <div className="glass-card p-6 rounded-3xl border border-borderBase-light dark:border-borderBase-dark space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
              Study Pace & Personal Learning Notes
            </h3>
            {saveSuccessMessage && (
              <span className="text-xs font-bold text-emerald-600">{saveSuccessMessage}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Weekly Study Time ({weeklyHours} hrs/week)
              </label>
              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-textMuted-light dark:text-textMuted-dark mt-1">
                Schedule estimates update dynamically based on your available study time.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Personal Roadmap Notes
              </label>
              <textarea
                rows={3}
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Add study reminders, project ideas, or questions for this roadmap..."
                className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSettings ? 'Saving...' : 'Save Notes & Settings'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
