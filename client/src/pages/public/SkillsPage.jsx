import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { Code, Search, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const data = await api.getSkills();
        setSkills(data || []);
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const filtered = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Skill Competency Index</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Explore Technical & Core Skills
        </h1>
        <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark">
          Browse verified technical capabilities and core engineering competencies required by modern software organizations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills (e.g. JavaScript, SQL, React)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'Frontend', 'Backend', 'Data', 'AI', 'Cloud', 'Design', 'Core'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-textMuted-light dark:text-textMuted-dark hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading skills...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(skill => (
            <div
              key={skill.id}
              className="glass-card p-6 rounded-3xl border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {skill.category}
                  </span>
                  {skill.isCore && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                      Core Competency
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
                  {skill.name}
                </h3>

                <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="pt-3 border-t border-borderBase-light dark:border-borderBase-dark flex items-center justify-between">
                <Link
                  to="/dashboard/assessments"
                  className="text-xs font-bold text-primary hover:text-primary-700 flex items-center gap-1"
                >
                  <span>Verify Skill</span>
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
