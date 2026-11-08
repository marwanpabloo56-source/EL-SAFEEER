import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

export const WhatsAppFab: React.FC = () => {
  const { settings, getTeacherWhatsAppUrl, selectedGrade } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const gradeName =
    selectedGrade === 'grade1'
      ? 'أولى إعدادي'
      : selectedGrade === 'grade2'
      ? 'تانية إعدادي'
      : 'تالتة إعدادي (الشهادة)';

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
      {/* Quick message popup */}
      {isOpen && (
        <div className="w-72 sm:w-80 bg-[#0f1d47] border border-[#2b448a] rounded-3xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1f3675]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                <MessageCircle className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">{settings.teacherName}</h4>
                <div className="text-[10px] text-emerald-400 font-bold">متاح للرد والاستفسارات 🟢</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            يا دكتور/ة المستقبل، لو محتاج تسأل عن حجز الحصص أو مكان السنتر أو الملازم لصف{' '}
            <strong className="text-[#f5b83d]">{gradeName}</strong>، كلمنا واتساب مباشرة وهنرد عليك فوراً!
          </p>

          <a
            href={getTeacherWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-colors"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
            <span>فتح المحادثة على واتساب</span>
          </a>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all"
        aria-label="تواصل مع السفير واتساب"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline">تواصل مع السفير واتساب</span>
        <span className="sm:hidden">واتساب</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#f5b83d] animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#f5b83d]" />
      </button>
    </div>
  );
};
