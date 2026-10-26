import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Code
} from 'lucide-react';

export default function MySkillsPage() {
  const [userSkills, setUserSkills] = useState([]);
  const [stats, setStats] = useState({ total: 0, verifiedCount: 0, provisionalCount: 0 });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('BEGINNER');

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsRes, allRes] = await Promise.all([
        api.getMySkills(),
        api.getSkills()
      ]);

      const rawList = skillsRes?.userSkills || (Array.isArray(skillsRes) ? skillsRes : []);
      const normalized = rawList.map((us, idx) => ({
        id: us.id || `us-${idx}`,
        isVerified: Boolean(us.isVerified || us.verified),
        proficiency: us.proficiency || us.level || 'Intermediate',
        skill: us.skill || {
          id: us.id || `sk-${idx}`,
          name: us.name || 'Technical Skill',
          category: us.category || 'Frontend'
        }
      }));

      setUserSkills(normalized);
      const verifiedCount = normalized.filter(s => s.isVerified).length;
      setStats(skillsRes?.stats || {
        total: normalized.length,
        verifiedCount,
        provisionalCount: normalized.length - verifiedCount
      });

      const skillList = Array.isArray(allRes) ? allRes : allRes?.skills || [];
      setAvailableSkills(skillList);
      if (skillList.length > 0) setSelectedSkillId(skillList[0].id);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    try {
      await api.addOrUpdateUserSkill({
        skillId: selectedSkillId,
        proficiency: selectedProficiency
      });
      setAddModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Remove this skill from your profile?')) return;
    try {
      await api.deleteUserSkill(skillId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to remove skill.');
    }
  };

  const filteredSkills = userSkills.filter(us => {
    const sName = us.skill?.name || us.name || '';
    const sCat = us.skill?.category || us.category || '';
    const matchesSearch = sName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || sCat.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">My Skills Portfolio</h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
            Track verified skills and self-reported competencies.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary flex items-center justify-center font-bold">
            {stats.total}
          </div>
          <div>
            <div className="text-xs font-bold text-textMain-light dark:text-textMain-dark">Total Skills Recorded</div>
            <div className="text-[11px] text-textMuted-light dark:text-textMuted-dark">On your student profile</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center gap-3 border-emerald-500/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold">
            {stats.verifiedCount}
          </div>
          <div>
            <div className="text-xs font-bold text-textMain-light dark:text-textMain-dark">Verified by Assessment</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Test confirmed</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center gap-3 border-amber-500/20">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold">
            {stats.provisionalCount}
          </div>
          <div>
            <div className="text-xs font-bold text-textMain-light dark:text-textMain-dark">Provisional / Self-Reported</div>
            <div className="text-[11px] text-amber-600 font-semibold">Take test to verify</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your skills..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'Frontend', 'Backend', 'Data', 'Core'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-primary text-white'
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
        <div className="py-12 text-center text-xs text-textMuted-light dark:text-textMuted-dark">Loading skills...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="glass-card p-8 rounded-3xl text-center space-y-3">
          <Code className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">No skills found</h4>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Add skills you're learning or take an assessment to verify skills.</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(us => (
            <div
              key={us.id}
              className={`glass-card p-4 rounded-2xl border transition-all space-y-3 ${
                us.isVerified ? 'border-emerald-500/30 dark:border-emerald-500/20' : 'border-borderBase-light dark:border-borderBase-dark'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark">
                    {us.skill?.category || us.category}
                  </span>
                  <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark mt-0.5">
                    {us.skill?.name || us.name}
                  </h4>
                </div>

                {us.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-textMuted-light dark:text-textMuted-dark">
                    Provisional
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-borderBase-light dark:border-borderBase-dark">
                <span className="text-textMuted-light dark:text-textMuted-dark">
                  Proficiency: <strong className="text-textMain-light dark:text-textMain-dark">{us.proficiency}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {!us.isVerified && (
                    <Link
                      to="/dashboard/assessments"
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Verify →
                    </Link>
                  )}
                  <button
                    onClick={() => handleDeleteSkill(us.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-soft-lg border">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Add Skill to Profile</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                  Select Competency
                </label>
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
                >
                  {availableSkills.map((sk) => (
                    <option key={sk.id} value={sk.id}>
                      {sk.name} ({sk.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                  Self-Reported Proficiency
                </label>
                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
                >
                  <option value="BEGINNER">Beginner (Foundations)</option>
                  <option value="INTERMEDIATE">Intermediate (Practical Work)</option>
                  <option value="ADVANCED">Advanced (Production Experience)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-textMuted-light dark:text-textMuted-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700"
                >
                  Record Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
