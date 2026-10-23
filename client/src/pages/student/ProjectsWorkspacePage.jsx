import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  Edit3,
  Layers,
  AlertCircle
} from 'lucide-react';

export default function ProjectsWorkspacePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED'
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    difficulty: 'BEGINNER',
    status: 'IN_PROGRESS',
    repoUrl: '',
    demoUrl: '',
    notes: '',
    templateId: ''
  });
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [myRes, tempRes] = await Promise.all([
        api.getMyProjects(),
        api.getProjectTemplates()
      ]);
      setProjects(myRes || []);
      setTemplates(tempRes || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Please enter a project title.');
      return;
    }

    try {
      setFormError('');
      await api.createProject(formData);
      setModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'Frontend',
        difficulty: 'BEGINNER',
        status: 'IN_PROGRESS',
        repoUrl: '',
        demoUrl: '',
        notes: '',
        templateId: ''
      });
      loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create project.');
    }
  };

  const handleUpdateStatus = async (projectId, nextStatus) => {
    try {
      await api.updateProject(projectId, { status: nextStatus });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update project status.');
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.deleteProject(projectId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const handleAdoptTemplate = (template) => {
    setFormData({
      title: template.title,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      status: 'IN_PROGRESS',
      repoUrl: '',
      demoUrl: '',
      notes: '',
      templateId: template.id
    });
    setModalOpen(true);
  };

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Project Workspace & Portfolio
          </h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
            Build real software, document milestone achievements, and showcase proof of work.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {user?.id && (
            <Link
              to={`/portfolio/${user.id}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Portfolio</span>
            </Link>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {['ALL', 'IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-textMuted-light dark:text-textMuted-dark'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card p-10 rounded-3xl text-center space-y-3">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-sm">No projects in this category</h4>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Create a new project or select an industry-standard template below.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="glass-card rounded-3xl p-6 border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-textMuted-light dark:text-textMuted-dark uppercase">
                    {proj.category}
                  </span>

                  <select
                    value={proj.status}
                    onChange={(e) => handleUpdateStatus(proj.id, e.target.value)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <h4 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
                  {proj.title}
                </h4>

                <p className="text-xs text-textMuted-light dark:text-textMuted-dark line-clamp-3 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>

                {/* External Verified Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code Repository</span>
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-borderBase-light dark:border-borderBase-dark flex items-center justify-between">
                <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark">
                  {proj.status === 'COMPLETED' ? 'Completed & on Portfolio' : 'Work in progress'}
                </span>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-500"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Project Templates */}
      <div className="space-y-4 pt-6 border-t border-borderBase-light dark:border-borderBase-dark">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Curated Portfolio Project Templates
            </h3>
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Adopt structured templates with defined learning milestones.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map(temp => (
            <div
              key={temp.id}
              className="p-5 rounded-2xl border border-dashed border-borderBase-light dark:border-borderBase-dark bg-white/40 dark:bg-slate-900/40 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase">{temp.category} • {temp.difficulty}</span>
                <h5 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">{temp.title}</h5>
                <p className="text-xs text-textMuted-light dark:text-textMuted-dark line-clamp-2">{temp.description}</p>
                <div className="text-[11px] text-textMuted-light dark:text-textMuted-dark pt-1">
                  Includes {temp.milestones.length} milestones & suggested tech stack.
                </div>
              </div>

              <button
                onClick={() => handleAdoptTemplate(temp)}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary border border-primary-200 dark:border-primary-800 hover:bg-primary hover:text-white transition-colors"
              >
                Adopt Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-soft-lg border">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
              {formData.templateId ? 'Adopt Project Template' : 'New Custom Project'}
            </h3>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Real-Time Task Analytics Tool"
                  required
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What problem does this project solve?"
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Data Science">Data Science</option>
                    <option value="AI / ML">AI / ML</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">GitHub / Code Repository URL</label>
                <input
                  type="url"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  placeholder="https://github.com/username/project"
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://myproject.vercel.app"
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-textMuted-light dark:text-textMuted-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
