import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import ErrorBoundary from '../components/common/ErrorBoundary.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-textMain-light dark:text-textMain-dark transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <ErrorBoundary isRouteLevel title="Page temporarily unavailable">
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
