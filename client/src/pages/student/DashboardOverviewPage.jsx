import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import {
  CheckCircle2,
  Map,
  TrendingUp,
  FolderGit2,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  FileCheck2,
  Award,
  AlertCircle,
  Plus,
  Play
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function DashboardOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardOverview();
      setData(res);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      await api.updateTask(taskId, { status: nextStatus });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Loading your learning workspace...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl max-w-md mx-auto my-12 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-lg text-textMain-light dark:text-textMain-dark">Could not load dashboard</h3>
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { summaryCards, continueLearning, activeRoadmaps, todaysTasks, recentAssessments, recommendedSkills, weeklyActivity, skillsChartData, recentAchievements } = data;

  return (
    <div className="space-y-8">
      {/* 1. HERO GOAL BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-indigo-700 to-secondary p-6 sm:p-8 text-white shadow-soft-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold backdrop-blur-md">
              <Target className="w-3.5 h-3.5" />
              <span>Target Career: {data.currentCareerGoal}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {data.studentGreeting}
            </h1>
            <p className="text-primary-100 text-xs sm:text-sm max-w-xl">
              Stay consistent with your learning roadmap. You have {todaysTasks.length} learning tasks scheduled for today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/assessments"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-primary hover:bg-slate-50 transition-all shadow-md flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Take Assessment</span>
            </Link>
            <Link
              to="/dashboard/roadmaps"
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              View Roadmaps
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY METRIC CARDS (REAL DATA ONLY) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Skills Assessed */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-textMuted-light dark:text-textMuted-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Skills</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            {summaryCards.skillsAssessed}
          </div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Confirmed by test</p>
        </div>

        {/* Active Roadmaps */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-textMuted-light dark:text-textMuted-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider">Roadmaps</span>
            <Map className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            {summaryCards.activeRoadmaps}
          </div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">In progress</p>
        </div>

        {/* Learning Progress % */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-textMuted-light dark:text-textMuted-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Progress</span>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            {summaryCards.learningProgressPercent}%
          </div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Across tracks</p>
        </div>

        {/* Completed Projects */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-textMuted-light dark:text-textMuted-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider">Projects</span>
            <FolderGit2 className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            {summaryCards.completedProjects}
          </div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Shipped & verified</p>
        </div>

        {/* Weekly Learning Time */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-textMuted-light dark:text-textMuted-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider">Study Goal</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            {summaryCards.weeklyLearningHours}h
          </div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Planned weekly</p>
        </div>

        {/* Activity Streak */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-textMuted-light dark:text-textMuted-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            {summaryCards.currentStreakDays}d
          </div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Activity days</p>
        </div>
      </div>

      {/* 3. CONTINUE LEARNING & ROADMAP PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Topic in Active Roadmap */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Continue Learning
            </h3>
            {continueLearning && (
              <span className="text-xs font-semibold text-primary">
                Phase {continueLearning.phaseNumber}
              </span>
            )}
          </div>

          {continueLearning ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {continueLearning.roadmapTitle}
                </span>
                <h4 className="text-base font-bold text-textMain-light dark:text-textMain-dark mt-0.5">
                  {continueLearning.itemTitle}
                </h4>
                <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1 leading-relaxed">
                  {continueLearning.itemDescription}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-textMuted-light dark:text-textMuted-dark">
                  Est. Duration: {continueLearning.estimatedHours} Hours
                </span>
                <Link
                  to="/dashboard/roadmaps"
                  className="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold flex items-center gap-1.5 hover:bg-primary-700 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Learning</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-borderBase-light dark:border-borderBase-dark text-center space-y-3">
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
                You haven't enrolled in a career roadmap yet.
              </p>
              <Link
                to="/dashboard/roadmaps"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white"
              >
                <span>Browse & Start a Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Active Roadmaps Summary */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark">
              Active Roadmaps
            </h3>
            <Link to="/dashboard/roadmaps" className="text-xs font-semibold text-primary hover:text-primary-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {activeRoadmaps.length === 0 ? (
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark italic py-4 text-center">
                No active roadmaps. Enroll in one to track progress.
              </p>
            ) : (
              activeRoadmaps.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-textMain-light dark:text-textMain-dark truncate">{r.title}</span>
                    <span className="font-extrabold text-primary">{r.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${r.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. TODAY'S TASKS & RECENT ASSESSMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Today's Tasks
            </h3>
            <Link to="/dashboard/goals" className="text-xs font-semibold text-primary hover:text-primary-700">
              Manage Tasks
            </Link>
          </div>

          {todaysTasks.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-borderBase-light dark:border-borderBase-dark text-center space-y-2">
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
                No tasks scheduled for today. Great job!
              </p>
              <Link to="/dashboard/goals" className="text-xs font-bold text-primary inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add a new task
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                      }`}
                    >
                      {task.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <div>
                      <span className={`text-xs font-medium ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-textMain-light dark:text-textMain-dark'}`}>
                        {task.title}
                      </span>
                      {task.goal && (
                        <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Goal: {task.goal.title}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Assessment Results */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-secondary" />
              Recent Assessment Scores
            </h3>
            <Link to="/dashboard/assessments" className="text-xs font-semibold text-primary hover:text-primary-700">
              Take Quiz
            </Link>
          </div>

          {recentAssessments.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-borderBase-light dark:border-borderBase-dark text-center space-y-2">
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
                No assessments taken yet. Discover your level today!
              </p>
              <Link to="/dashboard/assessments" className="text-xs font-bold text-primary inline-flex items-center gap-1">
                <span>Start JavaScript or SQL test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentAssessments.map((att) => (
                <div key={att.id} className="p-3.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-textMain-light dark:text-textMain-dark">{att.assessmentTitle}</h5>
                    <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">
                      Level: {att.proficiencyResult} • {new Date(att.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-extrabold ${att.scorePercent >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {att.scorePercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. VISUALIZATIONS: WEEKLY ACTIVITY & SKILL RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Hours Bar Chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark">Weekly Study Time</h3>
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Target vs Actual hours completed</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-full">
              Real Activity
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="actualHours" name="Actual Hours" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="targetHours" name="Target Hours" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Proficiency Radar */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark">Skill Proficiency</h3>
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Evaluated across technology pillars</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={75} data={skillsChartData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
                <Radar name="Proficiency" dataKey="proficiencyScore" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. ACHIEVEMENTS & RECOMMENDED SKILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Recent Achievements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentAchievements.length === 0 ? (
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark italic col-span-2">
                Complete assessments or enroll in a roadmap to earn your first achievement badge!
              </p>
            ) : (
              recentAchievements.map((ach) => (
                <div key={ach.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-textMain-light dark:text-textMain-dark">{ach.title}</h5>
                    <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark mt-0.5">{ach.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Recommended Skills to Learn
          </h3>

          <div className="space-y-2">
            {recommendedSkills.map((sk) => (
              <div key={sk.id} className="p-3 rounded-xl border border-borderBase-light dark:border-borderBase-dark flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-textMain-light dark:text-textMain-dark">{sk.name}</span>
                  <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">{sk.reason}</p>
                </div>
                <Link
                  to="/dashboard/skills"
                  className="text-[11px] font-semibold text-primary hover:text-primary-700"
                >
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
