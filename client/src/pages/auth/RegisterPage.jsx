import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Compass, Lock, Mail, User, GraduationCap, Briefcase, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    educationLevel: 'Undergraduate',
    primaryCareerInterest: 'Frontend Developer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await register(formData);
      // Direct newly registered students to onboarding wizard
      navigate('/onboarding');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 glass-card p-8 rounded-3xl shadow-soft-lg border border-borderBase-light dark:border-borderBase-dark">
        <div className="p-3.5 rounded-2xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-center space-y-2">
          <p className="text-xs font-bold text-primary dark:text-primary-300">
            🎓 Student Mode Active (No Password Required)
          </p>
          <Link
            to="/dashboard"
            className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <span>Open Student Workspace Directly</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Create student profile
          </h2>
          <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark">
            Customize your learning profile or click above to jump directly to the dashboard
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Alex Morgan"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textMain-light dark:text-textMain-dark transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textMain-light dark:text-textMain-dark transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  required
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textMain-light dark:text-textMain-dark transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textMain-light dark:text-textMain-dark transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Education Level
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textMain-light dark:text-textMain-dark transition-all"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate / College</option>
                  <option value="Graduate / Master">Graduate / Master</option>
                  <option value="Bootcamp Student">Bootcamp Student</option>
                  <option value="Self-Taught Learner">Self-Taught Learner</option>
                  <option value="Career Transitioner">Career Transitioner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark mb-1">
                Career Interest
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <select
                  name="primaryCareerInterest"
                  value={formData.primaryCareerInterest}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textMain-light dark:text-textMain-dark transition-all"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="AI & Machine Learning Engineer">AI & Machine Learning Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-textMuted-light dark:text-textMuted-dark">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-primary-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
