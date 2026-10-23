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
    { name: 'Skills', path: '/skills' },
    { name: 'Learning Roadmaps', path: '/roadmaps' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' }
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
              Career Engine
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

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="text-xs font-semibold text-textMain-light dark:text-textMain-dark max-w-[120px] truncate">
                  {user.fullName || user.email}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-textMuted-light dark:text-textMuted-dark mr-1" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass-card shadow-soft-lg py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-borderBase-light dark:border-borderBase-dark">
                    <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Signed in as</p>
                    <p className="text-xs font-bold text-textMain-light dark:text-textMain-dark truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 px-2 py-0.5 rounded-full mt-1">
                        <Shield className="w-2.5 h-2.5" /> Administrator
                      </span>
                    )}
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
                    Profile & Settings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-textMain-light dark:text-textMain-dark hover:bg-primary-50 dark:hover:bg-slate-700/50"
                    >
                      <Shield className="w-4 h-4 text-secondary" />
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-borderBase-light dark:border-borderBase-dark my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-semibold text-textMain-light dark:text-textMain-dark hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Get Started
              </Link>
            </div>
          )}
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
