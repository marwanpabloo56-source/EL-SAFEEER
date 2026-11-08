import React from 'react';
import { useData } from '../context/DataContext';
import { GRADES_LIST } from '../lib/firebase';
import {
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  AlertCircle,
  Timer,
  ChevronLeft,
} from 'lucide-react';

interface NextClassCountdownProps {
  onScrollToSchedules: () => void;
}

export const NextClassCountdown: React.FC<NextClassCountdownProps> = ({ onScrollToSchedules }) => {
  const { nextClassInfo, selectedGrade } = useData();

  const currentGradeObj = GRADES_LIST.find((g) => g.id === selectedGrade) || GRADES_LIST[0];

  if (!nextClassInfo || !nextClassInfo.nextSchedule) {
    return (
      <div id="countdown" className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-[#0f1d47]/70 border border-[#233878] rounded-3xl p-6 text-center">
          <Clock className="w-10 h-10 text-amber-400 mx-auto mb-2 opacity-80" />
          <h3 className="text-lg font-bold text-white mb-1">
            لا توجد حصص قادمة مسجلة حالياً لـ {currentGradeObj.shortName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            تابع الجدول بالأسفل أو تواصل مع مستر محمود لمعرفة مواعيد المجموعات الجديدة.
          </p>
        </div>
      </div>
    );
  }

  const { nextSchedule, days, hours, minutes, seconds, isNow } = nextClassInfo;

  return (
    <div id="countdown" className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122254] via-[#0f1d47] to-[#0a1435] border border-[#263e85] p-5 sm:p-7 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#f5b83d]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#2b6cff]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Right info section */}
          <div className="text-right w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5b83d]/15 text-[#f5b83d] text-xs font-black border border-[#f5b83d]/30 mb-2">
              <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>العدّاد التنازلي للحصة القادمة ({currentGradeObj.shortName})</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>الحصة الجاية في</span>
              <span className="text-[#f5b83d]">{nextSchedule.centerName}</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#2b6cff]" />
                <strong className="text-white">يوم {nextSchedule.dayOfWeek}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#f5b83d]" />
                <strong className="text-white">{nextSchedule.time}</strong>
              </span>
              {nextSchedule.centerAddress && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 text-slate-400 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{nextSchedule.centerAddress}</span>
                  </span>
                </>
              )}
            </div>

            {nextSchedule.notes && (
              <p className="mt-2 text-xs text-amber-200/90 bg-[#162758] px-3 py-1.5 rounded-xl border border-[#274088] inline-block">
                💡 <span className="font-semibold">تنبيه الحصة:</span> {nextSchedule.notes}
              </p>
            )}
          </div>

          {/* Left countdown digits */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-16 sm:h-18 rounded-2xl bg-[#0a1230] border border-[#2b448a] flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {String(days).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 mt-1.5">يوم</span>
            </div>

            <span className="text-xl font-bold text-[#f5b83d] -mt-5">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-16 sm:h-18 rounded-2xl bg-[#0a1230] border border-[#2b448a] flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl font-black text-[#f5b83d]">
                  {String(hours).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 mt-1.5">ساعة</span>
            </div>

            <span className="text-xl font-bold text-[#f5b83d] -mt-5">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-16 sm:h-18 rounded-2xl bg-[#0a1230] border border-[#2b448a] flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {String(minutes).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 mt-1.5">دقيقة</span>
            </div>

            <span className="text-xl font-bold text-[#f5b83d] -mt-5">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-16 sm:h-18 rounded-2xl bg-[#0a1230] border border-[#2b6cff] flex items-center justify-center shadow-lg shadow-[#2b6cff]/20">
                <span className="text-2xl sm:text-3xl font-black text-[#38bdf8]">
                  {String(seconds).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 mt-1.5">ثانية</span>
            </div>
          </div>
        </div>

        {/* Bottom encouragement / quick button */}
        <div className="mt-5 pt-4 border-t border-[#1e346f] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-4 h-4 text-[#f5b83d]" />
            <span>
              {isNow
                ? 'الحصة بدأت أو على وشك البدء الآن! بالتوفيق يا بطل 🚀'
                : 'جهّز كشكولك وملزمة السفير وركز في الشرح والتسميع الدوري.'}
            </span>
          </div>

          <button
            onClick={onScrollToSchedules}
            className="flex items-center gap-1 font-bold text-[#f5b83d] hover:text-amber-300 transition-colors"
          >
            <span>عرض باقي مواعيد الأسبوع</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
