import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Layers
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
  Radar,
  AreaChart,
  Area
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.getDashboardOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Analyzing student performance data...</p>
      </div>
    );
  }

  const { summaryCards, weeklyActivity, skillsChartData } = data;

  return (
    <div className="space-y-8">
      <div className="pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">Progress Analytics</h1>
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
          Deep-dive into your verified skills growth, study cadence, and roadmap milestones.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Verified Skills</span>
          <div className="text-2xl font-extrabold text-emerald-600">{summaryCards.skillsAssessed}</div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Assessment certified</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Active Roadmaps</span>
          <div className="text-2xl font-extrabold text-primary">{summaryCards.activeRoadmaps}</div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">In progress</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Weekly Hours Goal</span>
          <div className="text-2xl font-extrabold text-amber-600">{summaryCards.weeklyLearningHours}h</div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Scheduled availability</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Learning Streak</span>
          <div className="text-2xl font-extrabold text-orange-600">{summaryCards.currentStreakDays} Days</div>
          <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">Consistent study</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Trend */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Weekly Study Rhythm (Hours)</h3>
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Actual study hours logged versus target schedule</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="actualHours" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Proficiency Radar */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Skill Domain Balance</h3>
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Relative proficiency across software domains</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={80} data={skillsChartData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
                <Radar name="Proficiency" dataKey="proficiencyScore" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
