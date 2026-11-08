import React from 'react';
import { useData } from '../context/DataContext';
import {
  MapPin,
  Phone,
  Navigation,
  Building2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const CentersSection: React.FC = () => {
  const { centers, schedules, settings } = useData();

  return (
    <section id="centers" className="py-12 sm:py-16 relative bg-[#070e26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs font-black border border-rose-500/30 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>السناتر وأماكن التواجد</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            أماكن وفروع سناتر أ/ محمود عصام
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            قاعات مجهزة ومكيفة بأحدث شاشات العرض الذكية ومتابعة دورية مستمرة مع أولياء الأمور.
          </p>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {centers.map((center) => {
            // Find which schedules meet at this center
            const centerSchedules = schedules.filter(
              (s) => s.centerName.trim().toLowerCase() === center.name.trim().toLowerCase()
            );

            return (
              <div
                key={center.id}
                className="rounded-3xl bg-[#0f1d47]/90 border border-[#20367a] hover:border-[#f5b83d]/50 p-6 shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Name */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5b83d] to-[#d8971f] text-[#0a1230] flex items-center justify-center shrink-0 shadow-lg shadow-[#f5b83d]/20">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{center.name}</h3>
                      <span className="text-xs text-amber-300 font-bold">فرع معتمد للسفير</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-3 mb-4 text-xs sm:text-sm">
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{center.address}</span>
                    </div>

                    {center.phone && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <a
                          href={`tel:${center.phone}`}
                          className="hover:text-emerald-300 font-semibold dir-ltr"
                        >
                          {center.phone}
                        </a>
                      </div>
                    )}

                    {center.notes && (
                      <div className="p-3 rounded-2xl bg-[#0a1230]/70 border border-[#1b2b62] text-xs text-slate-400">
                        {center.notes}
                      </div>
                    )}
                  </div>

                  {/* Scheduled classes at this center */}
                  {centerSchedules.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#f5b83d]" />
                        <span>الحصص المتوفرة بالسنتر:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {centerSchedules.map((s) => (
                          <span
                            key={s.id}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#142352] text-slate-200 border border-[#233a7a]"
                          >
                            {s.dayOfWeek} • {s.time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="pt-4 border-t border-[#1b2b62] flex items-center gap-2">
                  {center.mapLink && (
                    <a
                      href={center.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#142352] hover:bg-[#1b2f6b] text-white text-xs font-bold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>الموقع على الخريطة</span>
                    </a>
                  )}

                  {center.phone && (
                    <a
                      href={`tel:${center.phone}`}
                      className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition-colors"
                      title="اتصال بالسنتر"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
