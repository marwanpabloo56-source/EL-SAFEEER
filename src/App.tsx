/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { NewsTicker } from './components/NewsTicker';
import { Hero } from './components/Hero';
import { NextClassCountdown } from './components/NextClassCountdown';
import { ScheduleSection } from './components/ScheduleSection';
import { VideosSection } from './components/VideosSection';
import { NewsSection } from './components/NewsSection';
import { CentersSection } from './components/CentersSection';
import { Footer } from './components/Footer';
import { WhatsAppFab } from './components/WhatsAppFab';
import { AdminDashboard } from './components/AdminDashboard';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Error Boundary to prevent any blank white screen
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a1230] text-white flex items-center justify-center p-6 text-center" dir="rtl">
          <div className="max-w-md bg-[#0f1d47] p-8 rounded-3xl border border-rose-500/40 shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2">عذراً، حدث خطأ أثناء عرض الصفحة</h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              تم تسجيل المشكلة، اضغط على الزر أدناه لإعادة تحميل الصفحة والبيانات.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#f5b83d] text-[#0a1230] font-black text-sm flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة تحميل المنصة</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1230] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-[#f5b83d] selection:text-[#0a1230]">
      {/* Top Navbar */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollTo={scrollToSection}
      />

      {/* Rolling News Ticker */}
      <NewsTicker onScrollToNews={() => scrollToSection('news')} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onScrollTo={scrollToSection} />

        {/* Next Class Countdown (Dynamic for selected grade) */}
        <NextClassCountdown onScrollToSchedules={() => scrollToSection('schedules')} />

        {/* Schedules & WhatsApp Sharing */}
        <ScheduleSection />

        {/* Video Lessons with Coming Soon badge */}
        <VideosSection />

        {/* News & Announcements */}
        <NewsSection />

        {/* Centers & Locations */}
        <CentersSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollTo={scrollToSection}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFab />

      {/* Supervisor Admin Dashboard Modal */}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </ErrorBoundary>
  );
}
