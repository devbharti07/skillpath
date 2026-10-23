import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  BookOpen,
  Search,
  Bookmark,
  ExternalLink,
  Clock,
  Layers,
  FileText,
  Video,
  Code
} from 'lucide-react';

export default function LearningHubPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [type, setType] = useState('ALL');

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.getResources();
      setResources(data || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleToggleBookmark = async (resId) => {
    try {
      const res = await api.toggleBookmark('RESOURCE', resId);
      setResources(prev => prev.map(r => r.id === resId ? { ...r, isBookmarked: res.bookmarked } : r));
    } catch (err) {
      console.error('Failed to bookmark resource:', err);
    }
  };

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'ALL' || r.category === category;
    const matchesType = type === 'ALL' || r.type === type;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (resourceType) => {
    switch (resourceType) {
      case 'VIDEO': return <Video className="w-3.5 h-3.5 text-red-500" />;
      case 'DOCS': return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case 'TUTORIAL': return <Code className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">Learning Hub</h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
            Curated official documentation, interactive tutorials, and vetted guides.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documentation, topics..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl text-xs border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          >
            <option value="ALL">All Categories</option>
            <option value="Web">Web Development</option>
            <option value="Data">Data & Databases</option>
            <option value="AI">AI & Machine Learning</option>
            <option value="Cloud">Cloud & DevOps</option>
            <option value="Design">UI/UX Design</option>
            <option value="Foundations">CS Foundations</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 rounded-xl text-xs border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          >
            <option value="ALL">All Media Types</option>
            <option value="DOCS">Documentation</option>
            <option value="TUTORIAL">Tutorials</option>
            <option value="ARTICLE">Articles</option>
            <option value="VIDEO">Video Series</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading resources...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-sm">No resources found</h4>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <div
              key={res.id}
              className="glass-card p-5 rounded-2xl border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-textMain-light dark:text-textMain-dark">
                    {getTypeIcon(res.type)}
                    <span>{res.type}</span>
                  </span>

                  <button
                    onClick={() => handleToggleBookmark(res.id)}
                    className="p-1 rounded text-slate-400 hover:text-primary transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${res.isBookmarked ? 'fill-primary text-primary' : ''}`} />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">
                  {res.title}
                </h4>

                <p className="text-xs text-textMuted-light dark:text-textMuted-dark line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-textMuted-light dark:text-textMuted-dark pt-1">
                  <span>{res.category}</span>
                  <span>•</span>
                  <span>{res.difficulty}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~{res.durationMinutes}m
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-borderBase-light dark:border-borderBase-dark">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Open Official Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
