import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import {
  Compass,
  LayoutDashboard,
  CheckCircle2,
  FileCheck2,
  Briefcase,
  Map,
  BookOpen,
  FolderGit2,
  Target,
  BarChart3,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Skills', path: '/dashboard/skills', icon: CheckCircle2 },
    { name: 'Skill Assessments', path: '/dashboard/assessments', icon: FileCheck2 },
    { name: 'Career Explorer', path: '/dashboard/careers', icon: Briefcase },
    { name: 'My Roadmaps', path: '/dashboard/roadmaps', icon: Map },
    { name: 'Learning Hub', path: '/dashboard/learning', icon: BookOpen },
    { name: 'Projects & Portfolio', path: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Goals & Tasks', path: '/dashboard/goals', icon: Target },
    { name: 'Progress Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Career Assistant', path: '/dashboard/assistant', icon: Bot, badge: 'AI' },
    { name: 'Profile & Settings', path: '/dashboard/profile', icon: Settings }
  ];

  const isCurrentActive = (itemPath) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(itemPath);
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark text-textMain-light dark:text-textMain-dark transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar: Desktop & Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out ${
          mobileDrawerOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full lg:translate-x-0 ' + (collapsed ? 'w-20' : 'w-64')
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-borderBase-light dark:border-borderBase-dark">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex-shrink-0 flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            {(!collapsed || mobileDrawerOpen) && (
              <span className="font-extrabold text-lg tracking-tight text-textMain-light dark:text-textMain-dark">
                Skill<span className="text-primary dark:text-primary-400">Path</span>
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Collapse sidebar"
            className="hidden lg:flex p-1.5 rounded-lg text-textMuted-light dark:text-textMuted-dark hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close mobile menu"
            className="lg:hidden p-1.5 rounded-lg text-textMuted-light dark:text-textMuted-dark hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm shadow-primary/30 font-semibold'
                    : 'text-textMuted-light dark:text-textMuted-dark hover:text-textMain-light dark:hover:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : ''}`} />
                {(!collapsed || mobileDrawerOpen) && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {(!collapsed || mobileDrawerOpen) && item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <div className="pt-3 border-t border-borderBase-light dark:border-borderBase-dark">
              <Link
                to="/admin"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-secondary-50 dark:hover:bg-secondary-950/30 transition-all"
              >
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || mobileDrawerOpen) && (
                  <span className="flex-1 truncate font-semibold">Admin Panel</span>
                )}
              </Link>
            </div>
          )}
        </nav>

        {/* Sidebar bottom: user info & logout */}
        <div className="p-3 border-t border-borderBase-light dark:border-borderBase-dark">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            {(!collapsed || mobileDrawerOpen) && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-textMain-light dark:text-textMain-dark truncate">
                  {user?.fullName || 'Student'}
                </p>
                <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark truncate">
                  {user?.profile?.primaryCareerInterest || user?.email}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-textMuted-light dark:text-textMuted-dark hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Dashboard Top Header */}
        <header className="sticky top-0 z-30 h-16 glass-panel border-b border-borderBase-light dark:border-borderBase-dark px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-textMain-light dark:text-textMain-dark truncate">
                {user?.fullName ? `Hello, ${user.fullName.split(' ')[0]}` : 'Welcome back'}
              </h2>
              <p className="text-[11px] text-textMuted-light dark:text-textMuted-dark hidden sm:block">
                {todayFormatted} • Track your progress
              </p>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick public portfolio link */}
            {user?.id && (
              <Link
                to={`/portfolio/${user.id}`}
                target="_blank"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark text-textMuted-light dark:text-textMuted-dark hover:text-primary transition-colors"
              >
                <span>View My Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View notifications"
                className="p-2 rounded-lg text-textMuted-light dark:text-textMuted-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-900" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl glass-card shadow-soft-lg p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-borderBase-light dark:border-borderBase-dark">
                    <span className="text-xs font-bold">Notifications</span>
                    <span className="text-[10px] text-primary font-semibold">1 new</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-primary-50/50 dark:bg-primary-950/20 text-xs">
                      <p className="font-semibold text-textMain-light dark:text-textMain-dark">Personalized Roadmap Ready</p>
                      <p className="text-textMuted-light dark:text-textMuted-dark text-[11px] mt-0.5">Explore your curated roadmap topics and take your first assessment.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-textMuted-light dark:text-textMuted-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
