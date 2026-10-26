import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  Check,
  Scale
} from 'lucide-react';

export default function CareerExplorerPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [compareList, setCompareList] = useState([]); // array of career slugs
  const navigate = useNavigate();

  const loadCareers = async () => {
    try {
      setLoading(true);
      const data = await api.getCareers();
      setCareers(data || []);
    } catch (err) {
      console.error('Failed to load careers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareers();
  }, []);

  const handleToggleBookmark = async (careerId) => {
    try {
      const res = await api.toggleBookmark('CAREER', careerId);
      setCareers(prev => prev.map(c => c.id === careerId ? { ...c, isBookmarked: res.bookmarked } : c));
    } catch (err) {
      console.error('Failed to bookmark career:', err);
    }
  };

  const handleToggleCompare = (slug) => {
    if (compareList.includes(slug)) {
      setCompareList(compareList.filter(s => s !== slug));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 careers at once.');
        return;
      }
      setCompareList([...compareList, slug]);
    }
  };

  const filtered = careers.filter(c => {
    const skills = c.requiredSkills || c.technicalSkills || [];
    const matchesSearch = (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase()) ||
      skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const diff = (c.difficulty || c.level || '').toLowerCase();
    const matchesDiff = selectedDifficulty === 'ALL' || diff.includes(selectedDifficulty.toLowerCase());
    return matchesSearch && matchesCategory && matchesDiff;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">Career Explorer</h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
            Discover modern engineering tracks, inspect required competencies, and compare career paths.
          </p>
        </div>

        {compareList.length >= 2 && (
          <button
            onClick={() => navigate('/careers/compare', { state: { selectedSlugs: compareList } })}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-secondary text-white hover:bg-secondary-700 shadow-md shadow-secondary/20 flex items-center gap-1.5 animate-pulse"
          >
            <Scale className="w-4 h-4" />
            <span>Compare {compareList.length} Careers Side-by-Side</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers, skills (e.g. React, Python)..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-xl text-xs border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          >
            <option value="ALL">All Categories</option>
            <option value="Engineering">Software Engineering</option>
            <option value="Data">Data & Analytics</option>
            <option value="AI">AI & Machine Learning</option>
            <option value="Design">UI/UX Design</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="p-2 rounded-xl text-xs border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          >
            <option value="ALL">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Comparison Drawer Indicator if 1 selected */}
      {compareList.length === 1 && (
        <div className="p-3 rounded-xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800 text-xs flex items-center justify-between text-secondary">
          <span>1 career selected for comparison. Select 1 or 2 more to launch side-by-side comparison.</span>
          <button onClick={() => setCompareList([])} className="text-[11px] underline font-bold">Clear</button>
        </div>
      )}

      {/* Career Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading careers...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl space-y-2">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-sm">No careers match your filter</h4>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Try searching for broader keywords like "Developer" or "Data".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(career => {
            const isComparing = compareList.includes(career.slug);
            const skills = career.requiredSkills || career.technicalSkills || [];
            const displayLevel = career.difficulty || career.level || 'All Levels';

            return (
              <div
                key={career.id}
                className={`glass-card rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 hover:shadow-soft-lg ${
                  isComparing ? 'ring-2 ring-secondary border-secondary' : 'border-borderBase-light dark:border-borderBase-dark'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary uppercase tracking-wider">
                      {career.category}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(career.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary transition-colors"
                      title={career.isBookmarked ? 'Remove bookmark' : 'Bookmark career'}
                    >
                      <Bookmark className={`w-4 h-4 ${career.isBookmarked ? 'fill-primary text-primary' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
                    {career.title}
                  </h3>

                  <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed line-clamp-3">
                    {career.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark">
                      Key Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.slice(0, 4).map(skill => (
                        <span key={skill} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {skill}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark self-center">
                          +{skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-textMuted-light dark:text-textMuted-dark pt-2 border-t border-borderBase-light dark:border-borderBase-dark">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{career.estimatedLearningWeeks || 24} Weeks
                    </span>
                    <span className="text-xs font-semibold">
                      {displayLevel}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleCompare(career.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 ${
                      isComparing
                        ? 'border-secondary bg-secondary text-white'
                        : 'border-borderBase-light dark:border-borderBase-dark text-textMuted-light dark:text-textMuted-dark hover:border-secondary'
                    }`}
                  >
                    {isComparing ? <Check className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                    <span>{isComparing ? 'Selected' : 'Compare'}</span>
                  </button>

                  <Link
                    to={`/careers/${career.slug}`}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 transition-colors flex items-center gap-1"
                  >
                    <span>View Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
