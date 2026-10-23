import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import {
  Compass,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Careers', path: '/careers' },
    { name: 'Roadmaps', path: '/roadmaps' },
    { name: 'Skill Quizzes', path: '/dashboard/assessments' },
    { name: 'Learning Hub', path: '/dashboard/learning' },
    { name: 'Workspace', path: '/dashboard/projects' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-borderBase-light dark:border-borderBase-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-textMain-light dark:text-textMain-dark leading-none">
              Skill<span className="text-primary dark:text-primary-400">Path</span>
            </span>
            <span className="text-[10px] text-textMuted-light dark:text-textMuted-dark uppercase tracking-wider font-semibold">
              Student Career Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path)
                  ? 'text-primary dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                  : 'text-textMuted-light dark:text-textMuted-dark hover:text-textMain-light dark:hover:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-textMuted-light dark:text-textMuted-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Direct Dashboard CTA */}
          <Link
            to="/dashboard"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 transition-all flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          {/* Student Profile Quick Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xs font-semibold text-textMain-light dark:text-textMain-dark max-w-[100px] truncate">
                {user?.fullName || 'Alex Chen'}
              </span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
                A
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-textMuted-light dark:text-textMuted-dark" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl glass-card shadow-soft-lg py-1.5 z-50">
                <div className="px-4 py-2 border-b border-borderBase-light dark:border-borderBase-dark">
                  <p className="text-[11px] text-textMuted-light dark:text-textMuted-dark">Student Demo Active</p>
                  <p className="text-xs font-bold text-textMain-light dark:text-textMain-dark truncate">{user?.fullName || 'Alex Chen'}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded-full mt-1">
                    Student Mode
                  </span>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-textMain-light dark:text-textMain-dark hover:bg-primary-50 dark:hover:bg-slate-700/50"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                  Student Dashboard
                </Link>

                <Link
                  to="/dashboard/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-textMain-light dark:text-textMain-dark hover:bg-primary-50 dark:hover:bg-slate-700/50"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Profile & Goals
                </Link>

                <Link
                  to="/admin"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-textMain-light dark:text-textMain-dark hover:bg-primary-50 dark:hover:bg-slate-700/50"
                >
                  <Shield className="w-4 h-4 text-secondary" />
                  Admin Overview
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-textMuted-light dark:text-textMuted-dark"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-borderBase-light dark:border-borderBase-dark px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'text-primary bg-primary-50 dark:bg-primary-900/30'
                  : 'text-textMuted-light dark:text-textMuted-dark'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl bg-primary text-white text-sm font-semibold shadow-md"
                >
                  Go to Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 text-center rounded-xl border border-secondary text-secondary text-sm font-semibold"
                  >
                    Admin Area
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center rounded-xl text-red-600 text-sm font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl border border-borderBase-light dark:border-borderBase-dark text-sm font-semibold text-textMain-light dark:text-textMain-dark"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-primary text-white text-sm font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
