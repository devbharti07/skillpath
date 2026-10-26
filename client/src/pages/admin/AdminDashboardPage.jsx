import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  ShieldAlert,
  Users,
  Briefcase,
  FileCheck2,
  Map,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Code
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');

  // Modals
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  // Forms
  const [careerForm, setCareerForm] = useState({
    title: '',
    slug: '',
    category: 'Engineering',
    description: '',
    difficulty: 'Beginner',
    estimatedLearningWeeks: 24,
    technicalSkills: 'JavaScript, React, Git',
    softSkills: 'Communication, Problem Solving',
    responsibilities: 'Build web applications',
    salaryNote: 'Educational context from labor benchmarks.'
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    slug: '',
    category: 'Frontend',
    description: '',
    isCore: true
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [ovRes, uRes] = await Promise.all([
          api.getAdminOverview(),
          api.getAdminUsers()
        ]);
        setOverview(ovRes);
        setUsersList(Array.isArray(uRes) ? uRes : uRes?.users || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, [isAdmin, navigate]);

  const handleCreateCareer = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminCareer({
        ...careerForm,
        technicalSkills: careerForm.technicalSkills.split(',').map(s => s.trim()),
        softSkills: careerForm.softSkills.split(',').map(s => s.trim()),
        responsibilities: [careerForm.responsibilities]
      });
      setCareerModalOpen(false);
      alert('Career successfully published!');
      const ovRes = await api.getAdminOverview();
      setOverview(ovRes);
    } catch (err) {
      alert(err.message || 'Failed to create career.');
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminSkill(skillForm);
      setSkillModalOpen(false);
      alert('Skill created!');
      const ovRes = await api.getAdminOverview();
      setOverview(ovRes);
    } catch (err) {
      alert(err.message || 'Failed to create skill.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Verifying administrative credentials...</p>
      </div>
    );
  }

  const stats = overview?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-50 dark:bg-secondary-950/40 text-[11px] font-bold text-secondary">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Authorization Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Platform Administration
          </h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
            Oversee user registrations, assessment health, and curriculum publications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSkillModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Skill</span>
          </button>

          <button
            onClick={() => setCareerModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-secondary hover:bg-secondary-700 shadow-md shadow-secondary/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Career Track</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Registered Users</span>
          <div className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">{stats.totalUsers || 0}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Published Careers</span>
          <div className="text-2xl font-extrabold text-primary">{stats.totalCareers || 0}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Skill Catalog</span>
          <div className="text-2xl font-extrabold text-secondary">{stats.totalSkills || 0}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Assessments Taken</span>
          <div className="text-2xl font-extrabold text-emerald-600">{stats.totalAttempts || 0}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Roadmap Enrollments</span>
          <div className="text-2xl font-extrabold text-amber-600">{stats.totalRoadmaps || 0}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-textMuted-light dark:text-textMuted-dark uppercase">Student Projects</span>
          <div className="text-2xl font-extrabold text-accent">{stats.totalProjects || 0}</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-card rounded-3xl p-6 border border-borderBase-light dark:border-borderBase-dark space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Registered Students & Administrators
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-borderBase-light dark:border-borderBase-dark text-textMuted-light dark:text-textMuted-dark">
                <th className="pb-3 font-bold uppercase tracking-wider">User</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Role</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Career Track</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderBase-light dark:divide-borderBase-dark">
              {usersList
                .filter(u => u.fullName.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()))
                .map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3">
                      <div className="font-bold text-textMain-light dark:text-textMain-dark">{u.fullName}</div>
                      <div className="text-[11px] text-textMuted-light dark:text-textMuted-dark">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-textMuted-light dark:text-textMuted-dark">
                      {u.profile?.primaryCareerInterest || 'Undeclared'}
                    </td>
                    <td className="py-3 text-textMuted-light dark:text-textMuted-dark">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Career Track */}
      {careerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-soft-lg border">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Publish New Career Track</h3>
            <form onSubmit={handleCreateCareer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Career Title</label>
                <input
                  type="text"
                  value={careerForm.title}
                  onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  required
                  placeholder="e.g. Cloud Security Specialist"
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={careerForm.category}
                  onChange={(e) => setCareerForm({ ...careerForm, category: e.target.value })}
                  className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900"
                >
                  <option value="Engineering">Software Engineering</option>
                  <option value="Data">Data & Analytics</option>
                  <option value="AI">AI & Machine Learning</option>
                  <option value="Design">UI/UX Design</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  value={careerForm.description}
                  onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Key Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  value={careerForm.technicalSkills}
                  onChange={(e) => setCareerForm({ ...careerForm, technicalSkills: e.target.value })}
                  placeholder="e.g. AWS, Terraform, Docker"
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCareerModalOpen(false)} className="px-4 py-2 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-secondary text-white hover:bg-secondary-700">
                  Publish Career
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Skill */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full space-y-4 shadow-soft-lg border">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Create New Skill Entry</h3>
            <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Skill Name</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  required
                  placeholder="e.g. GraphQL"
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Data">Data</option>
                  <option value="AI">AI</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Core">Core</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSkillModalOpen(false)} className="px-4 py-2 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-700">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
