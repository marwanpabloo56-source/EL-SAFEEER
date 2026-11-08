import React from 'react';
import { useData } from '../context/DataContext';
import { Flame, Bell, Sparkles } from 'lucide-react';

interface NewsTickerProps {
  onScrollToNews: () => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ onScrollToNews }) => {
  const { settings, news } = useData();

  if (!settings.announcementActive && news.length === 0) {
    return null;
  }

  // Combine settings ticker text and urgent news titles
  const urgentNews = news.filter((n) => n.isUrgent);

  return (
    <div className="bg-gradient-to-r from-[#111e4f] via-[#0f1d47] to-[#111e4f] border-y border-[#20367a] py-2.5 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Fixed Badge on the right */}
        <div
          onClick={onScrollToNews}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-[#f5b83d] text-[#0a1230] font-black text-xs cursor-pointer shadow-md hover:scale-105 transition-transform"
        >
          <Flame className="w-3.5 h-3.5 fill-[#0a1230]" />
          <span>شريط التنبيهات</span>
          <span className="px-1.5 py-0.2 rounded-md bg-[#0a1230] text-[#f5b83d] text-[10px] font-extrabold">
            جديد
          </span>
        </div>

        {/* Rolling / Ticker Content */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative mask-fade-edges">
          <div className="animate-ticker inline-flex items-center gap-8 text-xs sm:text-sm font-semibold text-slate-200">
            {/* Primary message */}
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f5b83d]" />
              <span>{settings.tickerText}</span>
            </span>

            {/* Urgent items */}
            {urgentNews.map((item) => (
              <span
                key={item.id}
                onClick={onScrollToNews}
                className="inline-flex items-center gap-2 cursor-pointer hover:text-[#f5b83d] transition-colors"
              >
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                  تنبيه هام
                </span>
                <span>{item.title}</span>
              </span>
            ))}

            {/* Repetition for continuous loop feel */}
            <span className="inline-flex items-center gap-2 text-amber-300/80">
              <Bell className="w-4 h-4" />
              <span>مواعيد الحصص يتم تحديثها أسبوعياً بواسطة السفير وفريق السكرتارية.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
