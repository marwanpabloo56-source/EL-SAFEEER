import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  GraduationCap,
  Calendar,
  Video,
  Bell,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onScrollTo: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onScrollTo }) => {
  const { settings, currentUser, isAdmin, getTeacherWhatsAppUrl } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a1230]/90 backdrop-blur-md border-b border-[#1b2b65]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f5b83d] via-[#e2a52b] to-[#b37c15] p-0.5 shadow-lg shadow-[#f5b83d]/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0a1230] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#f5b83d]" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#f5b83d] to-amber-400 tracking-tight">
                  {settings.nickname}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#f5b83d]/15 text-[#f5b83d] border border-[#f5b83d]/30 font-bold">
                  إعدادي
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium -mt-0.5">
                {settings.teacherName} • {settings.slogan.split(' ')[0]} {settings.slogan.split(' ')[1]}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('schedules')}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#142352] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-[#f5b83d]" />
              <span>المواعيد</span>
            </button>
            <button
              onClick={() => handleNavClick('videos')}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#142352] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-[#2b6cff]" />
              <span>الفيديوهات</span>
            </button>
            <button
              onClick={() => handleNavClick('news')}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#142352] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>آخر الأخبار</span>
            </button>
            <button
              onClick={() => handleNavClick('centers')}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#142352] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>السناتر</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp direct contact */}
            <a
              href={getTeacherWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-emerald-600/30 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>تواصل واتساب</span>
            </a>

            {/* Admin supervisor entry button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                currentUser && isAdmin
                  ? 'bg-[#f5b83d] text-[#0a1230] border-[#f5b83d] hover:bg-amber-400 shadow-md shadow-[#f5b83d]/20'
                  : 'bg-[#0f1d47] text-slate-300 border-[#233878] hover:border-[#f5b83d] hover:text-[#f5b83d]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{currentUser && isAdmin ? 'لوحة المشرف' : 'دخول المشرف'}</span>
              {currentUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#142352] text-slate-200 hover:text-white"
              aria-label="قائمة الموبايل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c163b] border-b border-[#1b2b65] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => handleNavClick('schedules')}
              className="p-3 rounded-xl bg-[#142352] text-right font-bold text-sm text-slate-200 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#f5b83d]" />
              <span>مواعيد الحصص</span>
            </button>
            <button
              onClick={() => handleNavClick('videos')}
              className="p-3 rounded-xl bg-[#142352] text-right font-bold text-sm text-slate-200 flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-[#2b6cff]" />
              <span>فيديوهات الشرح</span>
            </button>
            <button
              onClick={() => handleNavClick('news')}
              className="p-3 rounded-xl bg-[#142352] text-right font-bold text-sm text-slate-200 flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>آخر الأخبار</span>
            </button>
            <button
              onClick={() => handleNavClick('centers')}
              className="p-3 rounded-xl bg-[#142352] text-right font-bold text-sm text-slate-200 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>أماكن السناتر</span>
            </button>
          </div>

          <a
            href={getTeacherWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>تواصل مع أ/ محمود عصام واتساب</span>
          </a>

          <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#f5b83d]" />
            <span>منصة السفير للمرحلة الإعدادية • كل التوفيق لأبطالنا</span>
          </div>
        </div>
      )}
    </header>
  );
};
