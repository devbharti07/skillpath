import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Public & Auth Pages
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import CareerExplorerPage from './pages/student/CareerExplorerPage.jsx';
import CareerDetailPage from './pages/public/CareerDetailPage.jsx';
import CareerComparePage from './pages/public/CareerComparePage.jsx';
import SkillsPage from './pages/public/SkillsPage.jsx';
import RoadmapsPage from './pages/public/RoadmapsPage.jsx';
import ProjectsPage from './pages/public/ProjectsPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import PublicPortfolioPage from './pages/public/PublicPortfolioPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';

// Student Workspace Pages
import OnboardingPage from './pages/student/OnboardingPage.jsx';
import DashboardOverviewPage from './pages/student/DashboardOverviewPage.jsx';
import MySkillsPage from './pages/student/MySkillsPage.jsx';
import AssessmentsPage from './pages/student/AssessmentsPage.jsx';
import AssessmentTestPage from './pages/student/AssessmentTestPage.jsx';
import StudentRoadmapsPage from './pages/student/StudentRoadmapsPage.jsx';
import RoadmapWorkplacePage from './pages/student/RoadmapWorkplacePage.jsx';
import LearningHubPage from './pages/student/LearningHubPage.jsx';
import ProjectsWorkspacePage from './pages/student/ProjectsWorkspacePage.jsx';
import GoalsTasksPage from './pages/student/GoalsTasksPage.jsx';
import AnalyticsPage from './pages/student/AnalyticsPage.jsx';
import AssistantPage from './pages/student/AssistantPage.jsx';
import ProfileSettingsPage from './pages/student/ProfileSettingsPage.jsx';

// Admin Page
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';

// Route Guards (Direct access for assignment demonstration)
const ProtectedRoute = ({ children }) => {
  return children;
};

const AdminRoute = ({ children }) => {
  return children;
};

export default function App() {
  return (
    <ErrorBoundary title="Application Error" message="An unexpected error occurred. Click Retry or return to Dashboard.">
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Layout Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/careers" element={<CareerExplorerPage />} />
                <Route path="/careers/compare" element={<CareerComparePage />} />
                <Route path="/careers/:slug" element={<CareerDetailPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/roadmaps" element={<RoadmapsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/portfolio/:userId" element={<PublicPortfolioPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Student Onboarding (Protected) */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              {/* Student Dashboard Workspace (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverviewPage />} />
                <Route path="skills" element={<MySkillsPage />} />
                <Route path="assessments" element={<AssessmentsPage />} />
                <Route path="assessments/:slug" element={<AssessmentTestPage />} />
                <Route path="careers" element={<CareerExplorerPage />} />
                <Route path="careers/compare" element={<CareerComparePage />} />
                <Route path="careers/:slug" element={<CareerDetailPage />} />
                <Route path="roadmaps" element={<StudentRoadmapsPage />} />
                <Route path="roadmaps/:slug" element={<RoadmapWorkplacePage />} />
                <Route path="learning" element={<LearningHubPage />} />
                <Route path="projects" element={<ProjectsWorkspacePage />} />
                <Route path="goals" element={<GoalsTasksPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="assistant" element={<AssistantPage />} />
                <Route path="profile" element={<ProfileSettingsPage />} />
              </Route>

              {/* Protected Admin Route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
