import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GRADES_LIST, GradeId } from '../lib/firebase';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Copy,
  Check,
  Search,
  MessageCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScheduleSection: React.FC = () => {
  const {
    schedules,
    selectedGrade,
    setSelectedGrade,
    generateWhatsAppShareText,
    getTeacherWhatsAppUrl,
    settings,
  } = useData();

  const [searchCenter, setSearchCenter] = useState('');
  const [copied, setCopied] = useState(false);

  // Filter schedules by selected grade and search
  const filteredSchedules = schedules.filter((item) => {
    const matchGrade = item.grade === selectedGrade;
    const matchSearch =
      searchCenter.trim() === '' ||
      item.centerName.toLowerCase().includes(searchCenter.toLowerCase()) ||
      item.dayOfWeek.toLowerCase().includes(searchCenter.toLowerCase()) ||
      (item.centerAddress && item.centerAddress.toLowerCase().includes(searchCenter.toLowerCase()));
    return matchGrade && matchSearch;
  });

  const currentGradeObj = GRADES_LIST.find((g) => g.id === selectedGrade) || GRADES_LIST[0];

  // Handle WhatsApp Share
  const handleShareWhatsApp = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f5b83d', '#2b6cff', '#10b981'],
    });

    const shareText = generateWhatsAppShareText(selectedGrade);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle Copy to clipboard
  const handleCopySchedule = async () => {
    try {
      const shareText = generateWhatsAppShareText(selectedGrade);
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <section id="schedules" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5b83d]/10 text-[#f5b83d] text-xs font-black border border-[#f5b83d]/25 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>جدول الحصص الأسبوعي المعتمد</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            مواعيد الحصص وأماكن السناتر
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            اختر الصف الدراسي وشارك الجدول مع زملائك على جروبات الدفعة والواتساب بضغطة واحدة.
          </p>
        </div>

        {/* Grade Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#0f1d47]/80 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-[#1e3472]">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {GRADES_LIST.map((grade) => {
              const isSelected = selectedGrade === grade.id;
              return (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-[#f5b83d] text-[#0a1230] shadow-md shadow-[#f5b83d]/25 font-black'
                      : 'bg-[#142352] text-slate-300 hover:text-white hover:bg-[#1a2e6b]'
                  }`}
                >
                  <span>{grade.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-[#0a1230]/20 text-[#0a1230]' : 'bg-[#0a1230] text-slate-400'
                    }`}
                  >
                    {grade.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchCenter}
              onChange={(e) => setSearchCenter(e.target.value)}
              placeholder="ابحث باسم السنتر أو اليوم..."
              className="w-full bg-[#142352] border border-[#263e85] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#f5b83d]"
            />
          </div>
        </div>

        {/* Schedule List or Empty state */}
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#0f1d47]/40 border border-[#233878]">
            <Info className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-bold text-white mb-1">لا توجد مواعيد مطابقة لبحثك</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              يمكنك مسح البحث أو التواصل مع السكرتارية لمعرفة تفاصيل إضافية.
            </p>
            <button
              onClick={() => setSearchCenter('')}
              className="px-4 py-2 rounded-xl bg-[#142352] text-xs font-bold text-slate-200 hover:bg-[#1b2f6b]"
            >
              إعادة تعيين البحث
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSchedules.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-[#0f1d47]/90 border border-[#20367a] hover:border-[#f5b83d]/50 p-5 sm:p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0a1230]"
              >
                {/* Top header: Day & Slot number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#f5b83d]/15 text-[#f5b83d] flex items-center justify-center font-black text-xs border border-[#f5b83d]/30">
                      {index + 1}
                    </span>
                    <span className="text-base sm:text-lg font-black text-white">
                      يوم {item.dayOfWeek}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#142352] text-[#f5b83d] text-xs font-bold border border-[#284082]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </span>
                </div>

                {/* Center details */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2b6cff]/15 text-[#2b6cff] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{item.centerName}</div>
                      {item.centerAddress && (
                        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {item.centerAddress}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.notes && (
                    <div className="p-3 rounded-2xl bg-[#0a1230]/70 border border-[#1b2b62] text-xs text-amber-200/90 leading-relaxed">
                      <span className="font-bold text-[#f5b83d]">📌 ملاحظة: </span>
                      {item.notes}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-[#1b2b62] flex items-center justify-between gap-2">
                  <a
                    href={getTeacherWhatsAppUrl(
                      `السلام عليكم يا مستر محمود، أنا طالب في ${currentGradeObj.shortName} وعاوز احجز أو استفسر عن ميعاد يوم ${item.dayOfWeek} الساعة ${item.time} في ${item.centerName}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#142352] hover:bg-emerald-600 hover:text-white text-xs font-bold text-slate-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>احجز الميعاد</span>
                  </a>

                  <button
                    onClick={() => {
                      const text = `📌 ميعاد حصة ${settings.nickname} (${currentGradeObj.shortName}): يوم ${item.dayOfWeek} الساعة ${item.time} في ${item.centerName} (${item.centerAddress || ''}). للحجز واتساب: wa.me/${settings.whatsappNumber}`;
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-2 rounded-xl bg-[#142352] text-slate-300 hover:text-white hover:bg-[#1e3472] transition-colors"
                    title="نسخ تفاصيل هذا الميعاد"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Bar: WhatsApp Share and Quick Contact */}
        <div className="mt-10 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#142457] via-[#101d4a] to-[#142457] border border-[#263e85] shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-right">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f5b83d]" />
              <span>انشر الجدول لزمايلك في المدرسة والجروبات</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              شارك جدول {currentGradeObj.name} الكامل مع التفاصيل المنسقة مباشرة على واتساب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Share WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة الجدول على واتساب</span>
            </button>

            {/* Copy All */}
            <button
              onClick={handleCopySchedule}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#0f1d47] hover:bg-[#172b68] text-slate-200 border border-[#2b448a] font-bold text-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">تم النسخ بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#f5b83d]" />
                  <span>نسخ الجدول كاملاً</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
