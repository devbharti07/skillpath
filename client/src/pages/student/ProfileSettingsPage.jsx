import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import {
  User,
  Lock,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Sun,
  Moon
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, refreshProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'privacy'

  // Profile fields
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    educationLevel: '',
    primaryCareerInterest: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioWebsite: '',
    isPublic: true
  });

  // Password fields
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        educationLevel: user.profile?.educationLevel || '',
        primaryCareerInterest: user.profile?.primaryCareerInterest || '',
        bio: user.profile?.bio || '',
        githubUrl: user.profile?.githubUrl || '',
        linkedinUrl: user.profile?.linkedinUrl || '',
        portfolioWebsite: user.profile?.portfolioWebsite || '',
        isPublic: user.profile?.isPublic ?? true
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      await api.updateProfile(profileForm);
      await refreshProfile();
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmNewPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      await api.changePassword(passForm);
      setPassMsg('Password successfully changed!');
      setPassForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPassMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillpath-export-${user.id.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Failed to export account data.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">Profile & Settings</h1>
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
          Manage your personal details, verified portfolio links, and account security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
        <button
          onClick={() => { setActiveTab('profile'); setErrorMsg(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-textMuted-light dark:text-textMuted-dark'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile Information</span>
        </button>
        <button
          onClick={() => { setActiveTab('password'); setErrorMsg(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'password' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-textMuted-light dark:text-textMuted-dark'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Password</span>
        </button>
        <button
          onClick={() => { setActiveTab('privacy'); setErrorMsg(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'privacy' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-textMuted-light dark:text-textMuted-dark'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Data & Preferences</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="glass-card p-6 sm:p-8 rounded-3xl border border-borderBase-light dark:border-borderBase-dark space-y-6">
          {profileMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{profileMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Education Level</label>
              <input
                type="text"
                value={profileForm.educationLevel}
                onChange={(e) => setProfileForm({ ...profileForm, educationLevel: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Primary Career Target</label>
            <input
              type="text"
              value={profileForm.primaryCareerInterest}
              onChange={(e) => setProfileForm({ ...profileForm, primaryCareerInterest: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Short Biography</label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Tell others about your learning journey..."
              className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-borderBase-light dark:border-borderBase-dark">
            <div>
              <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">GitHub Profile</label>
              <input
                type="url"
                value={profileForm.githubUrl}
                onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={profileForm.linkedinUrl}
                onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Portfolio Website</label>
              <input
                type="url"
                value={profileForm.portfolioWebsite}
                onChange={(e) => setProfileForm({ ...profileForm, portfolioWebsite: e.target.value })}
                placeholder="https://myportfolio.dev"
                className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Password */}
      {activeTab === 'password' && (
        <form onSubmit={handleChangePassword} className="glass-card p-6 sm:p-8 rounded-3xl border border-borderBase-light dark:border-borderBase-dark space-y-4 max-w-lg">
          {passMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{passMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Current Password</label>
            <input
              type="password"
              value={passForm.currentPassword}
              onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
              required
              className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">New Password (Min 8 chars)</label>
            <input
              type="password"
              value={passForm.newPassword}
              onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
              required
              className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passForm.confirmNewPassword}
              onChange={(e) => setPassForm({ ...passForm, confirmNewPassword: e.target.value })}
              required
              className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-xs text-textMain-light dark:text-textMain-dark"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      {/* TAB 3: Privacy, Theme & Data Export */}
      {activeTab === 'privacy' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-borderBase-light dark:border-borderBase-dark space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-borderBase-light dark:border-borderBase-dark">
            <div>
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">Theme Preference</h4>
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Switch between light and dark visual presentation.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-borderBase-light dark:border-borderBase-dark flex items-center gap-2 hover:bg-slate-100"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}</span>
            </button>
          </div>

          {/* Export JSON */}
          <div className="flex items-center justify-between pb-4 border-b border-borderBase-light dark:border-borderBase-dark">
            <div>
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">Export Your Learning Data</h4>
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Download a complete JSON record of your assessments, roadmaps, and projects.</p>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Public Portfolio Visibility Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">Public Portfolio Visibility</h4>
              <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Allow recruiters to view your verified skills and completed projects.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileForm.isPublic}
                onChange={(e) => {
                  setProfileForm({ ...profileForm, isPublic: e.target.checked });
                  api.updateProfile({ isPublic: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
