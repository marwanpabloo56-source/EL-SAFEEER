import React from 'react';
import { useData } from '../context/DataContext';
import { GRADES_LIST, GradeId } from '../lib/firebase';
import {
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  MessageCircle,
  Video,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface HeroProps {
  onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollTo }) => {
  const { settings, selectedGrade, setSelectedGrade, getTeacherWhatsAppUrl } = useData();

  return (
    <section id="hero" className="relative pt-6 pb-14 md:pt-12 md:pb-20 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#2b6cff]/20 via-[#f5b83d]/15 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-5 w-72 h-72 bg-[#2b6cff]/15 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Top Teacher Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#142456] via-[#1c3275] to-[#142456] border border-[#f5b83d]/30 text-amber-300 text-xs sm:text-sm font-bold shadow-lg shadow-black/40 mb-6">
            <Sparkles className="w-4 h-4 text-[#f5b83d] animate-pulse" />
            <span>المنصة الرسمية للمرحلة الإعدادية فقط (1ع • 2ع • 3ع)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5b83d]"></span>
            <span className="text-slate-300 font-medium">دفعة 2025 - 2026</span>
          </div>

          {/* Glowing Big Brand Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-3">
            منصة{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#fff3d4] via-[#f5b83d] to-[#d8971f] text-gold-glow">
                {settings.nickname}
              </span>
              <span className="absolute -top-3 -left-3 text-[#f5b83d] opacity-80 animate-bounce">
                👑
              </span>
            </span>
          </h1>

          {/* Teacher Name & Slogan */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
            <span className="text-xl sm:text-3xl font-extrabold text-slate-100">
              {settings.teacherName}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-base sm:text-2xl font-bold text-[#f5b83d] bg-[#f5b83d]/10 px-3 py-1 rounded-xl border border-[#f5b83d]/20">
              "{settings.slogan}"
            </span>
          </div>

          <p className="max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
            كل اللي محتاجه عشان تقفل المادة: مواعيد الحصص بالسناتر أول بأول، فيديوهات شرح
            مبسطة، متابعة الامتحانات الدورية، وتواصل مباشر مع مستر محمود وفريق العمل.
          </p>

          {/* Grade selection quick pills */}
          <div className="w-full max-w-xl bg-[#0f1d47]/80 backdrop-blur-md p-2 rounded-2xl sm:rounded-3xl border border-[#233878] shadow-2xl mb-8">
            <div className="text-xs font-bold text-amber-300 mb-2 px-3 pt-1 flex items-center justify-between">
              <span>اختر صفك الدراسي (الموقع بيفتكره تلقائياً):</span>
              <span className="text-slate-400 font-normal text-[11px]">الصف المختار حالياً 📌</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {GRADES_LIST.map((grade) => {
                const isSelected = selectedGrade === grade.id;
                return (
                  <button
                    key={grade.id}
                    onClick={() => {
                      setSelectedGrade(grade.id);
                      onScrollTo('schedules');
                    }}
                    className={`py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#f5b83d] to-[#d8971f] text-[#0a1230] shadow-lg shadow-[#f5b83d]/25 scale-[1.02]'
                        : 'bg-[#142352] text-slate-300 hover:text-white hover:bg-[#1b2f6b]'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black">
                      <span>{grade.shortName}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-[#0a1230]" />}
                    </div>
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-[#0a1230]/80 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {grade.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none">
            <button
              onClick={() => onScrollTo('schedules')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2b6cff] to-[#1e54cc] hover:from-[#3a78ff] hover:to-[#255fd9] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#2b6cff]/25 hover:shadow-[#2b6cff]/40 transition-all active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              <span>جدول المواعيد والسناتر</span>
            </button>

            <button
              onClick={() => onScrollTo('videos')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#142352] hover:bg-[#1b2f6b] text-slate-200 border border-[#2b448a] font-extrabold text-sm sm:text-base shadow-lg transition-all active:scale-95"
            >
              <Video className="w-5 h-5 text-[#f5b83d]" />
              <span>فيديوهات الشرح</span>
            </button>

            <a
              href={getTeacherWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/40 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>تواصل واتساب مباشر</span>
            </a>
          </div>

          {/* Feature Highlights Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 w-full max-w-4xl">
            <div className="p-3.5 rounded-2xl bg-[#0f1d47]/70 border border-[#1e3370] flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-[#f5b83d]/15 flex items-center justify-center text-[#f5b83d] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">تأسيس وتفوق</div>
                <div className="text-[11px] text-slate-400">شرح مبسط وأقوى التريكات</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0f1d47]/70 border border-[#1e3370] flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-[#2b6cff]/15 flex items-center justify-center text-[#2b6cff] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">متابعة وامتحانات</div>
                <div className="text-[11px] text-slate-400">كويزات وتصحيح دوري</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0f1d47]/70 border border-[#1e3370] flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">دعم مستمر</div>
                <div className="text-[11px] text-slate-400">رد فوري على أسئلة الطلاب</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0f1d47]/70 border border-[#1e3370] flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">تحديث فوري</div>
                <div className="text-[11px] text-slate-400">أي تعديل يظهر فوراً</div>
              </div>
            </div>
          </div>

          {/* Quick scroll down arrow */}
          <button
            onClick={() => onScrollTo('countdown')}
            aria-label="النزول للأسفل"
            className="mt-10 p-2 rounded-full bg-[#142352] text-slate-300 hover:text-[#f5b83d] hover:bg-[#1a2f6e] transition-all animate-bounce"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
