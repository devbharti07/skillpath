import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Code,
  Heart,
  Briefcase,
  Sliders,
  Clock,
  Target,
  AlertTriangle,
  Award,
  Zap
} from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  const [formData, setFormData] = useState({
    educationLevel: 'Undergraduate',
    technicalSkills: ['JavaScript', 'HTML & CSS'],
    softSkills: ['Problem Solving', 'Communication'],
    topicsEnjoyed: ['Web Development', 'UI/UX Design'],
    preferredCareers: ['Frontend Developer'],
    proficiencyLevel: 'BEGINNER',
    weeklyAvailabilityHours: 12,
    shortTermGoals: 'Master React state management and complete my portfolio projects.',
    longTermGoals: 'Secure a junior software engineer role at a high-growth tech company.'
  });

  const availableSkills = [
    'JavaScript', 'HTML & CSS', 'React', 'Node.js', 'Python', 'SQL',
    'Git & GitHub', 'Docker', 'Data Structures & Algorithms',
    'UI/UX Design', 'Machine Learning', 'Data Analysis'
  ];

  const availableTopics = [
    'Web Development', 'Artificial Intelligence', 'Machine Learning',
    'Data Science', 'Cybersecurity', 'Cloud Computing',
    'Mobile App Development', 'UI/UX Design', 'Digital Product Strategy'
  ];

  const availableCareers = [
    'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
    'Data Analyst', 'AI & Machine Learning Engineer', 'UI/UX Designer'
  ];

  const toggleItem = (listName, item) => {
    const list = formData[listName];
    if (list.includes(item)) {
      setFormData({ ...formData, [listName]: list.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [listName]: [...list, item] });
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Save and generate career discovery summary
      try {
        setLoading(true);
        setError('');
        const res = await api.saveOnboarding({ ...formData, isCompleted: true });
        const targetCareer = formData.preferredCareers?.[0] || 'Frontend Developer';
        const discSummary = res?.discoverySummary || res?.summary || {
          topCareerSuggestions: [
            {
              id: 'c-1',
              title: targetCareer,
              matchScore: 94,
              category: 'Engineering',
              summary: 'High alignment with your technical preferences and career ambitions.'
            }
          ],
          selfReportedSkills: formData.technicalSkills || [],
          untestedSkillsNotice: 'Self-reported competencies provide an initial discovery baseline.',
          verifiedSkillsConfirmedByAssessment: []
        };
        setSummary(discSummary);
        await refreshProfile();
        setStep(5); // Summary step
      } catch (err) {
        setError(err.message || 'Failed to save onboarding responses.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      {/* Brand & Progress Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 text-xs font-semibold text-primary">
          <Compass className="w-4 h-4" />
          <span>Student Onboarding & Career Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
          {step === 5 ? 'Your Career Discovery Summary' : 'Map Your Baseline & Goals'}
        </h1>
        <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark max-w-xl mx-auto">
          {step === 5
            ? 'Based on your actual responses, here is your transparent baseline and initial career matches.'
            : 'Help us calibrate your roadmaps and assessment recommendations.'}
        </p>

        {/* Stepper Dots */}
        {step < 5 && (
          <div className="flex justify-center items-center gap-2 pt-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s ? 'w-8 bg-primary' : step > s ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-soft-lg border border-borderBase-light dark:border-borderBase-dark">
        {/* STEP 1: Education & Topics Enjoyed */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              1. Education Level & Topics You Enjoy
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-2">
                What is your current education level?
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                className="w-full p-3 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/20 text-textMain-light dark:text-textMain-dark"
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">College / Undergraduate (CS or STEM)</option>
                <option value="Undergraduate Non-STEM">College / Undergraduate (Non-STEM)</option>
                <option value="Graduate / Master">Graduate / Master's Degree</option>
                <option value="Bootcamp Graduate">Coding Bootcamp Student / Graduate</option>
                <option value="Self-Taught">Self-Taught Learner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-2">
                Select topics you genuinely enjoy exploring (Select multiple)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableTopics.map(topic => {
                  const selected = formData.topicsEnjoyed.includes(topic);
                  return (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => toggleItem('topicsEnjoyed', topic)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selected
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                          : 'bg-white dark:bg-slate-800 text-textMain-light dark:text-textMain-dark border-borderBase-light dark:border-borderBase-dark hover:border-primary/50'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Existing Skills & Proficiency */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Code className="w-5 h-5 text-secondary" />
              2. Existing Skills & Self-Reported Proficiency
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-2">
                Which tools or technologies have you tried? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableSkills.map(skill => {
                  const selected = formData.technicalSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleItem('technicalSkills', skill)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selected
                          ? 'bg-secondary text-white border-secondary shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-textMain-light dark:text-textMain-dark border-borderBase-light dark:border-borderBase-dark hover:border-secondary/50'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-textMuted-light dark:text-textMuted-dark mt-2">
                Note: These will be marked as self-reported provisional skills until confirmed by taking an assessment.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-2">
                Your current general proficiency level:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { level: 'BEGINNER', label: 'Beginner', desc: 'Starting out or early coursework' },
                  { level: 'INTERMEDIATE', label: 'Intermediate', desc: 'Built several small projects or coursework' },
                  { level: 'ADVANCED', label: 'Advanced', desc: 'Shipped production apps or internships' }
                ].map(p => (
                  <button
                    type="button"
                    key={p.level}
                    onClick={() => setFormData({ ...formData, proficiencyLevel: p.level })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      formData.proficiencyLevel === p.level
                        ? 'border-primary bg-primary-50 dark:bg-primary-950/30'
                        : 'border-borderBase-light dark:border-borderBase-dark hover:border-primary/40'
                    }`}
                  >
                    <div className="font-bold text-sm text-textMain-light dark:text-textMain-dark">{p.label}</div>
                    <div className="text-[11px] text-textMuted-light dark:text-textMuted-dark mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Preferred Careers & Availability */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              3. Preferred Career Areas & Learning Pace
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-2">
                Which career paths are you most interested in pursuing?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableCareers.map(career => {
                  const selected = formData.preferredCareers.includes(career);
                  return (
                    <button
                      type="button"
                      key={career}
                      onClick={() => toggleItem('preferredCareers', career)}
                      className={`p-3 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                        selected
                          ? 'bg-accent/15 border-accent text-accent-700 dark:text-accent-300'
                          : 'bg-white dark:bg-slate-800 border-borderBase-light dark:border-borderBase-dark text-textMain-light dark:text-textMain-dark'
                      }`}
                    >
                      <span>{career}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" /> Weekly Study Availability
                </label>
                <span className="text-sm font-extrabold text-primary">
                  {formData.weeklyAvailabilityHours} Hours / Week
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={formData.weeklyAvailabilityHours}
                onChange={(e) => setFormData({ ...formData, weeklyAvailabilityHours: Number(e.target.value) })}
                className="w-full accent-primary h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-textMuted-light dark:text-textMuted-dark mt-1">
                <span>Light (4h)</span>
                <span>Balanced (12-15h)</span>
                <span>Intensive (40h)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Goals */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              4. Short-term and Long-term Goals
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Short-term Goal (Next 1–3 Months)
              </label>
              <input
                type="text"
                value={formData.shortTermGoals}
                onChange={(e) => setFormData({ ...formData, shortTermGoals: e.target.value })}
                placeholder="e.g. Master React fundamentals and complete 2 portfolio applications"
                className="w-full p-3 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/20 text-textMain-light dark:text-textMain-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Long-term Career Goal (Next 1–2 Years)
              </label>
              <textarea
                rows={3}
                value={formData.longTermGoals}
                onChange={(e) => setFormData({ ...formData, longTermGoals: e.target.value })}
                placeholder="e.g. Secure a software engineer role at a company working on modern web architecture"
                className="w-full p-3 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/20 text-textMain-light dark:text-textMain-dark"
              />
            </div>
          </div>
        )}

        {/* STEP 5: CAREER DISCOVERY SUMMARY (Generated Output) */}
        {step === 5 && summary && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Match Hero */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-primary/10 via-secondary/10 to-transparent border border-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Top Career Suggestion
                </span>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-primary text-white">
                  {summary.topCareerSuggestions?.[0]?.matchScore || 94}% Match
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
                {summary.topCareerSuggestions?.[0]?.title || 'Frontend Developer'}
              </h3>
              <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark leading-relaxed">
                {summary.topCareerSuggestions?.[0]?.summary || 'Strong alignment with your profile.'}
              </p>
            </div>

            {/* Evidence & Status Transparency Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Self-Reported Skills (Untested)
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(summary.selfReportedSkills || []).map((s) => (
                    <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {s} (Provisional)
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">
                  {summary.untestedSkillsNotice || 'Self-reported skills provide a starting point.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Skills Confirmed by Assessment
                </span>
                {(!summary.verifiedSkillsConfirmedByAssessment || summary.verifiedSkillsConfirmedByAssessment.length === 0) ? (
                  <p className="text-xs text-textMuted-light dark:text-textMuted-dark italic">
                    None yet. Take your first Skill Assessment in the dashboard to confirm your proficiency.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(summary.verifiedSkillsConfirmedByAssessment || []).map((s) => (
                      <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Other Career Matches */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-textMuted-light dark:text-textMuted-dark uppercase tracking-wider">
                Alternative Career Matches
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(summary.topCareerSuggestions || []).slice(1, 4).map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-textMain-light dark:text-textMain-dark truncate">{c.title}</span>
                      <span className="text-[11px] font-bold text-primary">{c.matchScore}%</span>
                    </div>
                    <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark block">{c.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Go to My Student Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step Navigation Controls */}
        {step < 5 && (
          <div className="mt-8 pt-6 border-t border-borderBase-light dark:border-borderBase-dark flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{step === 4 ? 'Generate Career Discovery Summary' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
