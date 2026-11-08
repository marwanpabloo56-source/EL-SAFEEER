import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GRADES_LIST, NewsItem } from '../lib/firebase';
import {
  Bell,
  Sparkles,
  Flame,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Info,
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news, selectedGrade, settings } = useData();
  const [filter, setFilter] = useState<'all' | 'myGrade'>('all');

  const filteredNews = news.filter((item) => {
    if (filter === 'myGrade') {
      return item.grade === 'all' || item.grade === selectedGrade;
    }
    return true;
  });

  const currentGradeObj = GRADES_LIST.find((g) => g.id === selectedGrade) || GRADES_LIST[0];

  return (
    <section id="news" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-black border border-emerald-500/30 mb-3">
            <Bell className="w-3.5 h-3.5" />
            <span>لوحة التنبيهات الرسمية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            آخر الأخبار وتنبيهات السفير
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            مواعيد الامتحانات الشاملة، استلام الملازم الجديدة، وتفاصيل الحصص الإضافية.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#f5b83d] text-[#0a1230] font-black shadow-md'
                : 'bg-[#0f1d47] text-slate-300 border border-[#233878]'
            }`}
          >
            كل الأخبار ({news.length})
          </button>
          <button
            onClick={() => setFilter('myGrade')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === 'myGrade'
                ? 'bg-[#f5b83d] text-[#0a1230] font-black shadow-md'
                : 'bg-[#0f1d47] text-slate-300 border border-[#233878]'
            }`}
          >
            أخبار {currentGradeObj.shortName} خاصة
          </button>
        </div>

        {/* News Cards Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-[#0f1d47]/40 border border-[#233878]">
            <Info className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-70" />
            <h3 className="text-lg font-bold text-white mb-1">لا توجد أخبار مسجلة حالياً</h3>
            <p className="text-xs text-slate-400">تابع شريط الأخبار بالأعلى للتحديثات السريعة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredNews.map((item) => {
              const isGradeSpecific = item.grade !== 'all';
              const targetGrade = GRADES_LIST.find((g) => g.id === item.grade);

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl p-6 transition-all duration-200 border flex flex-col justify-between ${
                    item.isUrgent
                      ? 'bg-gradient-to-br from-[#1a1438] via-[#121c45] to-[#0f193d] border-rose-500/40 shadow-xl shadow-rose-950/20'
                      : 'bg-[#0f1d47]/90 border-[#20367a] hover:border-[#f5b83d]/40 shadow-xl'
                  }`}
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.isUrgent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black">
                            <Flame className="w-3.5 h-3.5 fill-rose-400" />
                            <span>عاجل وهام</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{item.badgeLabel || 'جديد'}</span>
                          </span>
                        )}

                        {isGradeSpecific && targetGrade && (
                          <span className="px-2 py-0.5 rounded-md bg-[#2b6cff]/20 text-[#38bdf8] text-[11px] font-bold border border-[#2b6cff]/30">
                            {targetGrade.shortName}
                          </span>
                        )}
                        {!isGradeSpecific && (
                          <span className="px-2 py-0.5 rounded-md bg-[#142352] text-slate-400 text-[11px] font-medium">
                            لجميع المراحل
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-400 font-medium">{item.dateStr}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-white mb-3 leading-snug">
                      {item.title}
                    </h3>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="mt-5 pt-3 border-t border-[#1b2b62] flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#f5b83d]" />
                      <span>معتمد من السكرتارية</span>
                    </span>
                    <span className="font-semibold text-slate-300">{settings.nickname}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
